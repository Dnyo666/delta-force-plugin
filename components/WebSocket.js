import Config from './Config.js'
import WebSocket from 'ws'
import EventEmitter from 'events'

/**
 * WebSocket 管理器
 * 负责与 Delta Force API 的 WebSocket 连接管理
 */
export default class WebSocketManager extends EventEmitter {
  constructor() {
    super()
    this.ws = null
    this.isConnected = false
    this.isConnecting = false
    this.reconnectTimer = null
    this.heartbeatTimer = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 10
    this.reconnectDelay = 5000 // 5秒
    this.heartbeatInterval = 30000 // 30秒
    this.subscriptions = new Set() // 当前订阅的频道
    this.availableChannels = [] // 可用频道列表
    this.connectionInfo = {} // 连接信息
    
    // 消息处理器映射
    this.messageHandlers = new Map()
    this.registerDefaultHandlers()
  }

  /**
   * 注册默认消息处理器
   */
  registerDefaultHandlers() {
    this.messageHandlers.set('connected', this.handleConnected.bind(this))
    this.messageHandlers.set('subscribed', this.handleSubscribed.bind(this))
    this.messageHandlers.set('unsubscribed', this.handleUnsubscribed.bind(this))
    this.messageHandlers.set('error', this.handleError.bind(this))
    this.messageHandlers.set('pong', this.handlePong.bind(this))
    this.messageHandlers.set('price_update', this.handlePriceUpdate.bind(this))
    this.messageHandlers.set('message', this.handleMessage.bind(this))
  }

  /**
   * 连接到 WebSocket 服务器
   * @param {Object} options - 连接选项
   * @param {string} options.clientID - 客户端ID（必填）
   * @param {string} options.platformID - 平台用户ID（可选）
   * @param {string} options.clientType - 客户端类型（可选，默认'bot'）
   * @returns {Promise<boolean>}
   */
  async connect(options = {}) {
    if (this.isConnected || this.isConnecting) {
      logger.warn('[Delta-Force WebSocket] 已经连接或正在连接中')
      return false
    }

    const cfg = Config.getConfig()?.delta_force || {}
    const apiKey = cfg.api_key

    if (!apiKey || apiKey === 'sk-xxxxxxx') {
      logger.error('[Delta-Force WebSocket] API Key 未配置')
      return false
    }

    const clientID = options.clientID || cfg.clientID
    if (!clientID) {
      logger.error('[Delta-Force WebSocket] clientID 未提供')
      return false
    }

    this.isConnecting = true

    try {
      // 构建连接URL
      const baseUrl = 'wss://df-api.shallow.ink/ws'
      const params = new URLSearchParams({
        key: apiKey,
        clientID: clientID
      })

      if (options.platformID) {
        params.append('platformID', options.platformID)
      }
      if (options.clientType) {
        params.append('clientType', options.clientType)
      } else {
        params.append('clientType', 'bot')
      }

      const wsUrl = `${baseUrl}?${params.toString()}`

      logger.info('[Delta-Force WebSocket] 正在连接...')
      
      this.ws = new WebSocket(wsUrl, {
        handshakeTimeout: 10000, // 10秒握手超时
      })

      // 设置事件监听器
      this.ws.on('open', this.onOpen.bind(this))
      this.ws.on('message', this.onMessage.bind(this))
      this.ws.on('close', this.onClose.bind(this))
      this.ws.on('error', this.onError.bind(this))
      this.ws.on('ping', this.onPing.bind(this))
      this.ws.on('pong', this.onPong.bind(this))

      return true
    } catch (error) {
      logger.error('[Delta-Force WebSocket] 连接失败:', error)
      this.isConnecting = false
      return false
    }
  }

  /**
   * 断开连接
   * @param {boolean} preventReconnect - 是否阻止自动重连
   */
  disconnect(preventReconnect = true) {
    if (preventReconnect) {
      this.clearReconnectTimer()
      this.maxReconnectAttempts = 0 // 阻止重连
    }

    this.clearHeartbeatTimer()

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    this.isConnected = false
    this.isConnecting = false
    this.subscriptions.clear()
    
    logger.info('[Delta-Force WebSocket] 已断开连接')
    this.emit('disconnected')
  }

  /**
   * 发送消息
   * @param {Object} data - 要发送的数据对象
   * @returns {boolean}
   */
  send(data) {
    if (!this.isConnected || !this.ws) {
      logger.warn('[Delta-Force WebSocket] 未连接，无法发送消息')
      return false
    }

    try {
      const message = JSON.stringify(data)
      this.ws.send(message)
      return true
    } catch (error) {
      logger.error('[Delta-Force WebSocket] 发送消息失败:', error)
      return false
    }
  }

  /**
   * 订阅频道
   * @param {string|Array<string>} channels - 频道名称或频道数组
   * @param {string} platformId - 平台用户ID（可选）
   * @returns {boolean}
   */
  subscribe(channels, platformId = null) {
    if (!this.isConnected) {
      logger.warn('[Delta-Force WebSocket] 未连接，无法订阅频道')
      return false
    }

    const message = {
      type: 'subscribe'
    }

    if (Array.isArray(channels)) {
      message.channels = channels
    } else {
      message.channel = channels
    }

    if (platformId) {
      message.platformId = platformId
    }

    const sent = this.send(message)
    if (sent) {
      const channelList = Array.isArray(channels) ? channels : [channels]
      channelList.forEach(ch => this.subscriptions.add(ch))
      logger.info(`[Delta-Force WebSocket] 已发送订阅请求: ${channelList.join(', ')}`)
    }

    return sent
  }

  /**
   * 取消订阅频道
   * @param {string|Array<string>} channels - 频道名称或频道数组
   * @returns {boolean}
   */
  unsubscribe(channels) {
    if (!this.isConnected) {
      logger.warn('[Delta-Force WebSocket] 未连接，无法取消订阅')
      return false
    }

    const message = {
      type: 'unsubscribe'
    }

    if (Array.isArray(channels)) {
      message.channels = channels
    } else {
      message.channel = channels
    }

    const sent = this.send(message)
    if (sent) {
      const channelList = Array.isArray(channels) ? channels : [channels]
      channelList.forEach(ch => this.subscriptions.delete(ch))
      logger.info(`[Delta-Force WebSocket] 已发送取消订阅请求: ${channelList.join(', ')}`)
    }

    return sent
  }

  /**
   * 发送心跳（应用层）
   * @returns {boolean}
   */
  sendPing() {
    return this.send({ type: 'ping' })
  }

  /**
   * 获取当前订阅的频道列表
   * @returns {Array<string>}
   */
  getSubscriptions() {
    return Array.from(this.subscriptions)
  }

  /**
   * 获取可用频道列表
   * @returns {Array<string>}
   */
  getAvailableChannels() {
    return this.availableChannels
  }

  /**
   * 获取连接状态
   * @returns {Object}
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      isConnecting: this.isConnecting,
      subscriptions: this.getSubscriptions(),
      availableChannels: this.availableChannels,
      connectionInfo: this.connectionInfo
    }
  }

  // ==================== 事件处理器 ====================

  /**
   * WebSocket 连接打开事件
   */
  onOpen() {
    logger.info('[Delta-Force WebSocket] 连接已建立')
    this.isConnected = true
    this.isConnecting = false
    this.reconnectAttempts = 0
    
    // 启动心跳
    this.startHeartbeat()
    
    this.emit('connected')
  }

  /**
   * WebSocket 消息接收事件
   * @param {Buffer|String} data - 接收到的数据
   */
  onMessage(data) {
    try {
      const message = JSON.parse(data.toString())
      const { type } = message

      logger.debug(`[Delta-Force WebSocket] 收到消息: ${type}`)

      // 触发通用消息事件
      this.emit('message', message)

      // 调用特定类型的处理器
      const handler = this.messageHandlers.get(type)
      if (handler) {
        handler(message)
      } else {
        logger.warn(`[Delta-Force WebSocket] 未知消息类型: ${type}`)
        this.emit('unknown_message', message)
      }
    } catch (error) {
      logger.error('[Delta-Force WebSocket] 解析消息失败:', error)
    }
  }

  /**
   * WebSocket 连接关闭事件
   * @param {number} code - 关闭代码
   * @param {string} reason - 关闭原因
   */
  onClose(code, reason) {
    logger.warn(`[Delta-Force WebSocket] 连接已关闭 [${code}] ${reason}`)
    this.isConnected = false
    this.isConnecting = false
    this.subscriptions.clear()
    
    this.clearHeartbeatTimer()
    
    this.emit('closed', { code, reason })

    // 尝试重连
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.scheduleReconnect()
    } else {
      logger.error('[Delta-Force WebSocket] 已达到最大重连次数，停止重连')
    }
  }

  /**
   * WebSocket 错误事件
   * @param {Error} error - 错误对象
   */
  onError(error) {
    logger.error('[Delta-Force WebSocket] 发生错误:', error.message)
    this.emit('error', error)
  }

  /**
   * WebSocket ping 帧接收（协议层）
   */
  onPing() {
    logger.debug('[Delta-Force WebSocket] 收到服务器 ping（协议层）')
    // ws库会自动响应pong
  }

  /**
   * WebSocket pong 帧接收（协议层）
   */
  onPong() {
    logger.debug('[Delta-Force WebSocket] 收到服务器 pong（协议层）')
  }

  // ==================== 消息处理器 ====================

  /**
   * 处理连接成功消息
   */
  handleConnected(message) {
    const { data } = message
    this.connectionInfo = {
      clientId: data.clientId,
      boundClientId: data.boundClientId,
      clientType: data.clientType
    }
    this.availableChannels = data.availableChannels || []
    
    logger.info('[Delta-Force WebSocket] 连接成功，可用频道:', this.availableChannels.length)
    this.emit('ready', data)
  }

  /**
   * 处理订阅成功消息
   */
  handleSubscribed(message) {
    const { channel, data } = message
    logger.info(`[Delta-Force WebSocket] 订阅成功: ${channel}`)
    this.emit('subscribed', { channel, data })
  }

  /**
   * 处理取消订阅消息
   */
  handleUnsubscribed(message) {
    const { channel, data } = message
    logger.info(`[Delta-Force WebSocket] 取消订阅成功: ${channel}`)
    this.emit('unsubscribed', { channel, data })
  }

  /**
   * 处理错误消息
   */
  handleError(message) {
    const { data } = message
    const { code, message: errorMsg } = data
    
    logger.error(`[Delta-Force WebSocket] 服务器错误 [${code}]: ${errorMsg}`)
    
    // 特殊处理订阅等级不足错误
    if (code === 3011) {
      logger.warn(`[Delta-Force WebSocket] 订阅等级不足: 需要 ${data.requiredTier}, 当前 ${data.currentTier}`)
    }
    
    this.emit('server_error', data)
  }

  /**
   * 处理心跳响应消息
   */
  handlePong(message) {
    logger.debug('[Delta-Force WebSocket] 收到应用层 pong')
    this.emit('pong', message)
  }

  /**
   * 处理价格更新消息
   */
  handlePriceUpdate(message) {
    const { channel, data } = message
    logger.info(`[Delta-Force WebSocket] 价格更新: ${channel} - ${data.type}`)
    this.emit('price_update', { channel, data })
  }

  /**
   * 处理通用消息（用于战绩推送等）
   */
  handleMessage(message) {
    const { data } = message
    if (data.messageType === 'record_update') {
      const maskedToken = data.frameworkToken ? `${data.frameworkToken.substring(0, 4)}****${data.frameworkToken.slice(-4)}` : ''
      const accountInfo = maskedToken ? ` | 账号: ${maskedToken}` : ''
      const statusInfo = data.isNew ? '新战绩' : (data.isRecent ? '缓存' : '')
      logger.info(`[Delta-Force WebSocket] 战绩更新: ${data.platformId} - ${data.recordType}${accountInfo} - ${statusInfo}`)
      this.emit('record_update', data)
    } else {
      this.emit('custom_message', message)
    }
  }

  // ==================== 心跳和重连机制 ====================

  /**
   * 启动心跳定时器
   */
  startHeartbeat() {
    this.clearHeartbeatTimer()
    
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected) {
        this.sendPing()
      }
    }, this.heartbeatInterval)
    
    logger.debug('[Delta-Force WebSocket] 心跳定时器已启动')
  }

  /**
   * 清除心跳定时器
   */
  clearHeartbeatTimer() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  /**
   * 安排重连
   */
  scheduleReconnect() {
    this.clearReconnectTimer()
    
    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.min(this.reconnectAttempts, 5) // 最多延迟到25秒
    
    logger.info(`[Delta-Force WebSocket] ${delay / 1000}秒后尝试第${this.reconnectAttempts}次重连...`)
    
    this.reconnectTimer = setTimeout(() => {
      logger.info(`[Delta-Force WebSocket] 开始第${this.reconnectAttempts}次重连`)
      this.connect(this.lastConnectOptions)
    }, delay)
  }

  /**
   * 清除重连定时器
   */
  clearReconnectTimer() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }
}

// 创建全局单例
let wsManager = null

/**
 * 获取 WebSocket 管理器实例（单例模式）
 * @returns {WebSocketManager}
 */
export function getWebSocketManager() {
  if (!wsManager) {
    wsManager = new WebSocketManager()
  }
  return wsManager
}
