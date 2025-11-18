import { getWebSocketManager } from '../components/WebSocket.js'
import Config from '../components/Config.js'
import utils from '../utils/utils.js'

/**
 * WebSocket 客户端插件
 * 提供 WebSocket 连接管理和频道订阅的用户命令接口
 */
export class WebSocketClient extends plugin {
  constructor(e) {
    super({
      name: '三角洲WebSocket',
      dsc: 'WebSocket连接管理',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)(ws|WS|websocket|WebSocket)(连接|启动|开启)$',
          fnc: 'connectWebSocket'
        },
        {
          reg: '^(#三角洲|\\^)(ws|WS|websocket|WebSocket)(断开|关闭|停止)$',
          fnc: 'disconnectWebSocket'
        },
        {
          reg: '^(#三角洲|\\^)(ws|WS|websocket|WebSocket)(状态|status)$',
          fnc: 'getWebSocketStatus'
        }
      ]
    })
    this.e = e
    this.wsManager = getWebSocketManager()
  }

  /**
   * 连接 WebSocket
   */
  async connectWebSocket() {
    const clientID = Config.getConfig()?.delta_force?.clientID

    if (!clientID) {
      await this.e.reply('clientID 未配置，请先在配置文件中设置')
      return true
    }

    const status = this.wsManager.getStatus()
    if (status.isConnected) {
      await this.e.reply('WebSocket 已经连接')
      return true
    }

    if (status.isConnecting) {
      await this.e.reply('WebSocket 正在连接中，请稍候...')
      return true
    }

    await this.e.reply('正在连接 WebSocket 服务器...')

    // 连接选项
    const options = {
      clientID: clientID,
      platformID: this.e.user_id,
      clientType: this.e.isGroup ? 'group' : 'private'
    }

    const success = await this.wsManager.connect(options)

    if (success) {
      // 等待连接就绪
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          resolve()
        }, 5000)

        this.wsManager.once('ready', () => {
          clearTimeout(timeout)
          resolve()
        })
      })

      const statusAfter = this.wsManager.getStatus()
      if (statusAfter.isConnected) {
        await this.e.reply([
          '✅ WebSocket 连接成功！\n',
          '\n说明：WebSocket 已就绪，可用于战绩推送\n',
          '使用 #三角洲战绩订阅 来订阅战绩推送'
        ])
      } else {
        await this.e.reply('WebSocket 连接超时，请查看日志')
      }
    } else {
      await this.e.reply('WebSocket 连接失败，请检查配置和日志')
    }

    return true
  }

  /**
   * 断开 WebSocket
   */
  async disconnectWebSocket() {
    const status = this.wsManager.getStatus()
    
    if (!status.isConnected && !status.isConnecting) {
      await this.e.reply('WebSocket 未连接')
      return true
    }

    this.wsManager.disconnect(true)
    await this.e.reply('WebSocket 已断开连接')
    return true
  }

  /**
   * 获取 WebSocket 状态
   */
  async getWebSocketStatus() {
    const status = this.wsManager.getStatus()

    let msg = '【WebSocket 状态】\n'
    msg += `连接状态: ${status.isConnected ? '✅ 已连接' : '❌ 未连接'}\n`
    
    if (status.isConnecting) {
      msg += '正在连接中...\n'
    }

    if (status.isConnected) {
      msg += `\n客户端ID: ${status.connectionInfo.clientId || '-'}\n`
      msg += `\n说明：WebSocket 连接用于接收战绩推送\n`
      msg += `使用 #三角洲战绩订阅 来订阅战绩`
    }

    await this.e.reply(msg.trim())
    return true
  }
}
