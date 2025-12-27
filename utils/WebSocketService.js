import { getWebSocketManager } from '../components/WebSocket.js'
import Config from '../components/Config.js'
import DataManager from './Data.js'
import { initBroadcastNotificationListener } from '../apps/push/Notification.js'

/**
 * WebSocket 服务管理器
 * 负责自动启动、推送分发等全局功能
 */
class WebSocketService {
  constructor() {
    this.wsManager = null
    this.isInitialized = false
    this.listenersRegistered = false // 防止重复注册监听器
    this.pushSettings = new Map() // 用户推送设置缓存
    this.autoConnectEnabled = false
    this.broadcastHandler = null // 广播通知处理器
  }

  /**
   * 初始化 WebSocket 服务
   * @param {Object} options - 初始化选项
   * @param {boolean} options.autoConnect - 是否自动连接（默认false）
   */
  async init(options = {}) {
    if (this.isInitialized) {
      logger.warn('[Delta-Force WS Service] 服务已初始化')
      return
    }

    logger.info('[Delta-Force WS Service] 初始化 WebSocket 服务...')

    this.wsManager = getWebSocketManager()
    this.autoConnectEnabled = options.autoConnect || false

    // 注册全局消息监听器
    this.registerGlobalListeners()

    // 如果启用自动连接
    if (this.autoConnectEnabled) {
      await this.autoConnect()
    }

    this.isInitialized = true
    logger.info('[Delta-Force WS Service] WebSocket 服务初始化完成')
  }

  /**
   * 自动连接 WebSocket
   */
  async autoConnect() {
    const cfg = Config.getConfig()?.delta_force || {}
    const clientID = cfg.clientID
    const apiKey = cfg.api_key

    if (!clientID || !apiKey || apiKey === 'sk-xxxxxxx') {
      logger.warn('[Delta-Force WS Service] 配置不完整，跳过自动连接')
      return false
    }

    try {
      logger.info('[Delta-Force WS Service] 自动连接 WebSocket...')

      const success = await this.wsManager.connect({
        clientID: clientID,
        clientType: 'bot'
      })

      if (success) {
        // 等待连接就绪（最多5秒）
        await new Promise((resolve) => {
          const timeout = setTimeout(() => {
            logger.warn('[Delta-Force WS Service] 等待就绪超时，但连接可能仍然有效')
            resolve()
          }, 5000)
          
          this.wsManager.once('ready', () => {
            clearTimeout(timeout)
            resolve()
          })
        })

        logger.info('[Delta-Force WS Service] WebSocket 自动连接成功')
        return true
      } else {
        logger.warn('[Delta-Force WS Service] WebSocket 自动连接返回false')
        return false
      }
    } catch (error) {
      // 捕获所有错误，避免影响插件启动
      logger.error('[Delta-Force WS Service] WebSocket 自动连接失败:', error.message)
      logger.warn('[Delta-Force WS Service] 插件将继续加载，可稍后使用 #三角洲ws连接 手动连接')
      return false
    }
  }

  /**
   * 注册全局消息监听器
   */
  registerGlobalListeners() {
    // 防止重复注册
    if (this.listenersRegistered) {
      logger.warn('[Delta-Force WS Service] 监听器已注册，跳过')
      return
    }

    // 连接就绪
    this.wsManager.on('ready', async (data) => {
      logger.info(`[Delta-Force WS Service] WebSocket 就绪`)
      
      // 自动订阅广播通知频道（如果启用）
      await this.autoSubscribeBroadcast()
    })

    // 连接关闭
    this.wsManager.on('closed', () => {
      logger.warn('[Delta-Force WS Service] WebSocket 连接已关闭')
    })

    // 服务器错误
    this.wsManager.on('server_error', (error) => {
      logger.error(`[Delta-Force WS Service] 服务器错误 [${error.code}]: ${error.message}`)
    })

    // 连接错误（502等）
    this.wsManager.on('error', (error) => {
      logger.error(`[Delta-Force WS Service] 连接错误: ${error.message}`)
    })

    // 注册广播通知监听器
    try {
      this.broadcastHandler = initBroadcastNotificationListener(this.wsManager)
      logger.info('[Delta-Force WS Service] 广播通知监听器已注册')
    } catch (error) {
      logger.error('[Delta-Force WS Service] 广播通知监听器注册失败:', error)
    }

    this.listenersRegistered = true
    logger.info('[Delta-Force WS Service] 全局监听器已注册')
  }


  /**
   * 自动订阅广播频道（如果启用）
   */
  async autoSubscribeBroadcast() {
    const cfg = Config.getConfig()?.delta_force?.broadcast_notification || {}
    
    if (!cfg.enabled) {
      logger.debug('[Delta-Force WS Service] 广播通知未启用')
      return
    }
    
    const channel = 'notification:broadcast'
    
    try {
      await this.wsManager.subscribe(channel)
      logger.info(`[Delta-Force WS Service] 已订阅广播频道: ${channel}`)
    } catch (error) {
      logger.error(`[Delta-Force WS Service] 订阅广播频道失败: ${channel}`, error)
    }
  }

  /**
   * 获取 WebSocket 管理器实例
   * @returns {WebSocketManager}
   */
  getManager() {
    return this.wsManager
  }

  /**
   * 获取服务状态
   * @returns {Object}
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      autoConnectEnabled: this.autoConnectEnabled,
      wsStatus: this.wsManager ? this.wsManager.getStatus() : null
    }
  }
}

// 创建全局单例
let wsService = null

/**
 * 获取 WebSocket 服务实例（单例）
 * @returns {WebSocketService}
 */
export function getWebSocketService() {
  if (!wsService) {
    wsService = new WebSocketService()
  }
  return wsService
}

export default WebSocketService
