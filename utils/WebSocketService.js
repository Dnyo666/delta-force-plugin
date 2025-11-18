import { getWebSocketManager } from '../components/WebSocket.js'
import Config from '../components/Config.js'
import DataManager from './Data.js'

/**
 * WebSocket 服务管理器
 * 负责自动启动、推送分发等全局功能
 */
class WebSocketService {
  constructor() {
    this.wsManager = null
    this.isInitialized = false
    this.pushSettings = new Map() // 用户推送设置缓存
    this.autoConnectEnabled = false
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

    logger.info('[Delta-Force WS Service] 自动连接 WebSocket...')

    const success = await this.wsManager.connect({
      clientID: clientID,
      clientType: 'bot'
    })

    if (success) {
      // 等待连接就绪
      await new Promise((resolve) => {
        const timeout = setTimeout(resolve, 5000)
        this.wsManager.once('ready', () => {
          clearTimeout(timeout)
          resolve()
        })
      })

      logger.info('[Delta-Force WS Service] WebSocket 自动连接成功')
      return true
    } else {
      logger.error('[Delta-Force WS Service] WebSocket 自动连接失败')
      return false
    }
  }

  /**
   * 注册全局消息监听器
   */
  registerGlobalListeners() {
    // 战绩更新推送 - 由 RecordSubscription 插件处理
    this.wsManager.on('record_update', async (data) => {
      const { platformId, frameworkToken, recordType, isNew, isRecent } = data
      const maskedToken = frameworkToken ? `${frameworkToken.substring(0, 4)}****${frameworkToken.slice(-4)}` : ''
      const accountInfo = maskedToken ? ` | 账号: ${maskedToken}` : ''
      const statusInfo = isNew ? '新战绩' : (isRecent ? '缓存' : '')
      logger.info(`[Delta-Force WS Service] 战绩更新: ${platformId} - ${recordType}${accountInfo} - ${statusInfo}`)
    })

    // 连接就绪
    this.wsManager.on('ready', (data) => {
      logger.info(`[Delta-Force WS Service] WebSocket 就绪`)
    })

    // 连接关闭
    this.wsManager.on('closed', () => {
      logger.warn('[Delta-Force WS Service] WebSocket 连接已关闭')
    })

    // 服务器错误
    this.wsManager.on('server_error', (error) => {
      logger.error(`[Delta-Force WS Service] 服务器错误 [${error.code}]: ${error.message}`)
    })

    logger.info('[Delta-Force WS Service] 全局监听器已注册')
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
