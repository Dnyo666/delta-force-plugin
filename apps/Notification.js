import Config from '../components/Config.js'
import { getWebSocketManager } from '../components/WebSocket.js'

/**
 * 广播通知接收插件
 * 负责接收和处理 WebSocket 推送的系统广播通知
 */
export class BroadcastNotification extends plugin {
  constructor(e) {
    super({
      name: '三角洲广播通知',
      dsc: '接收系统广播通知',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)(广播|通知)(开启|启用|订阅)$',
          fnc: 'enableNotification',
          permission: 'master'
        },
        {
          reg: '^(#三角洲|\\^)(广播|通知)(关闭|禁用|取消)$',
          fnc: 'disableNotification',
          permission: 'master'
        },
        {
          reg: '^(#三角洲|\\^)(广播|通知)(状态|设置)$',
          fnc: 'getNotificationStatus',
          permission: 'master'
        }
      ]
    })
    this.e = e
    this.wsManager = getWebSocketManager()
    
    // 去重缓存（防止短时间内重复推送相同通知）
    this.notificationCache = new Set()
    this.cacheExpireTime = 5 * 60 * 1000 // 5分钟
  }

  /**
   * 启用广播通知
   */
  async enableNotification() {
    if (!this.e.isMaster) {
      await this.e.reply('⚠️ 抱歉，只有机器人主人才能管理广播通知')
      return true
    }

    const cfg = Config.getConfig()?.delta_force?.broadcast_notification || {}
    
    if (cfg.enabled) {
      await this.e.reply('广播通知已经是启用状态')
      return true
    }

    // 修改配置
    const config = Config.getConfig()
    if (!config.delta_force) config.delta_force = {}
    if (!config.delta_force.broadcast_notification) {
      config.delta_force.broadcast_notification = {
        enabled: true,
        push_to: { 
          group: [],
          private_enabled: false,
          private: []
        }
      }
    } else {
      config.delta_force.broadcast_notification.enabled = true
    }
    
    Config.modify('delta_force', config.delta_force)
    
    // 如果 WebSocket 已连接，立即订阅
    const status = this.wsManager.getStatus()
    if (status.isConnected) {
      await this.subscribeChannel('notification:broadcast')
      await this.e.reply('广播通知已启用\n\n提示：使用 #三角洲通知状态 查看详细配置')
    } else {
      await this.e.reply('广播通知已启用\n\nWebSocket 未连接，将在连接后自动订阅\n使用 #三角洲ws连接 来连接')
    }

    return true
  }

  /**
   * 禁用广播通知
   */
  async disableNotification() {
    if (!this.e.isMaster) {
      await this.e.reply('⚠️ 抱歉，只有机器人主人才能管理广播通知')
      return true
    }

    const cfg = Config.getConfig()?.delta_force?.broadcast_notification || {}
    
    if (!cfg.enabled) {
      await this.e.reply('广播通知已经是禁用状态')
      return true
    }

    // 修改配置
    const config = Config.getConfig()
    config.delta_force.broadcast_notification.enabled = false
    Config.modify('delta_force', config.delta_force)
    
    // 如果 WebSocket 已连接，取消订阅
    const status = this.wsManager.getStatus()
    if (status.isConnected) {
      await this.unsubscribeChannel('notification:broadcast')
      await this.e.reply('广播通知已禁用')
    } else {
      await this.e.reply('广播通知已禁用')
    }

    return true
  }

  /**
   * 查看通知状态
   */
  async getNotificationStatus() {
    if (!this.e.isMaster) {
      await this.e.reply('抱歉，只有机器人主人才能查看通知设置')
      return true
    }

    const cfg = Config.getConfig()?.delta_force?.broadcast_notification || {}
    const wsStatus = this.wsManager.getStatus()
    
    let msg = '【广播通知设置】\n'
    msg += `功能状态：${cfg.enabled ? '已启用' : '已禁用'}\n`
    msg += `WebSocket：${wsStatus.isConnected ? '已连接' : '未连接'}\n`
    
    msg += '\n【推送目标群】\n'
    if (cfg.push_to?.group && cfg.push_to.group.length > 0) {
      msg += `群聊：${cfg.push_to.group.join(', ')} (共${cfg.push_to.group.length}个)\n`
    } else {
      msg += '未配置\n'
    }
    
    msg += '\n【推送私信】\n'
    if (cfg.push_to?.private_enabled) {
      const privateList = cfg.push_to?.private || []
      if (privateList.length > 0) {
        msg += `QQ号：${privateList.join(', ')} (共${privateList.length}个)\n`
      } else {
        msg += '默认推送给主人\n'
      }
    } else {
      msg += '未启用'
    }
    
    if (cfg.enabled && !wsStatus.isConnected) {
      msg += '\n\n提示：WebSocket 未连接，使用 #三角洲ws连接'
    }

    await this.e.reply(msg.trim())
    return true
  }

  /**
   * 订阅频道
   */
  async subscribeChannel(channel) {
    try {
      await this.wsManager.subscribe(channel)
      logger.info(`[广播通知] 已订阅频道: ${channel}`)
    } catch (error) {
      logger.error(`[广播通知] 订阅频道失败: ${channel}`, error)
    }
  }

  /**
   * 取消订阅频道
   */
  async unsubscribeChannel(channel) {
    try {
      await this.wsManager.unsubscribe(channel)
      logger.info(`[广播通知] 已取消订阅频道: ${channel}`)
    } catch (error) {
      logger.error(`[广播通知] 取消订阅失败: ${channel}`, error)
    }
  }

  /**
   * 格式化通知消息
   */
  formatNotificationMessage(notification) {
    const priorityLabels = {
      low: '低',
      normal: '普通',
      high: '重要',
      urgent: '紧急'
    }
    
    const typeLabel = notification.type || '系统通知'
    const priorityLabel = priorityLabels[notification.priority] || '普通'
    
    let msg = ''
    msg += `【Delta-Force-Plugin 广播通知】\n`
    msg += `────────────────────\n`
    msg += `【类型】${typeLabel}\n`
    msg += `【程度】${priorityLabel}\n`
    msg += `【标题】${notification.title}\n`
    msg += `【内容】\n${notification.content}\n`
    
    // 格式化时间
    const time = new Date(notification.timestamp)
    const timeStr = time.toLocaleString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
    msg += `────────────────────\n`
    msg += `${timeStr}\n`
    
    return msg
  }

  /**
   * 处理广播通知
   */
  async handleBroadcastNotification(data) {
    const cfg = Config.getConfig()?.delta_force?.broadcast_notification || {}
    
    // 检查功能是否启用
    if (!cfg.enabled) {
      logger.debug('[广播通知] 功能未启用，跳过推送')
      return
    }
    
    const notification = data.notification
    
    // 去重检查（使用通知ID）
    if (this.notificationCache.has(notification.id)) {
      logger.debug(`[广播通知] 通知已推送过，跳过: ${notification.id}`)
      return
    }
    
    // 添加到缓存
    this.notificationCache.add(notification.id)
    setTimeout(() => {
      this.notificationCache.delete(notification.id)
    }, this.cacheExpireTime)
    
    // 格式化消息
    const message = this.formatNotificationMessage(notification)
    
    let successCount = 0
    let failCount = 0
    
    // 推送到目标群
    const targetGroups = cfg.push_to?.group || []
    for (const groupId of targetGroups) {
      try {
        await Bot.pickGroup(groupId).sendMsg(message)
        successCount++
        logger.info(`[广播通知] 推送成功 → 群 ${groupId}`)
      } catch (error) {
        failCount++
        logger.error(`[广播通知] 推送失败 → 群 ${groupId}:`, error.message)
      }
    }
    
    // 推送到私信
    if (cfg.push_to?.private_enabled) {
      let privateTargets = cfg.push_to?.private || []
      
      // 如果没有配置私信列表，默认推送给主人
      if (privateTargets.length === 0) {
        const masterConfig = Config.getConfig()
        const masterQQ = masterConfig?.masterQQ || Bot.uin
        if (Array.isArray(masterQQ)) {
          privateTargets = masterQQ
        } else {
          privateTargets = [masterQQ]
        }
      }
      
      for (const userId of privateTargets) {
        try {
          await Bot.pickFriend(userId).sendMsg(message)
          successCount++
          logger.info(`[广播通知] 推送成功 → 私信 ${userId}`)
        } catch (error) {
          failCount++
          logger.error(`[广播通知] 推送失败 → 私信 ${userId}:`, error.message)
        }
      }
    }
    
    const total = targetGroups.length + (cfg.push_to?.private_enabled ? (cfg.push_to?.private?.length || 1) : 0)
    if (total === 0) {
      logger.warn('[广播通知] 未配置任何推送目标')
      logger.info(`[广播通知] 收到通知: ${notification.title}`)
    } else {
      logger.info(`[广播通知] 通知推送完成: ${notification.title} | 成功 ${successCount}/${total}`)
    }
  }
}

/**
 * 初始化广播通知监听器（由 WebSocketService 调用）
 */
export function initBroadcastNotificationListener(wsManager) {
  const notificationHandler = new BroadcastNotification()
  
  // 监听广播消息
  wsManager.on('notification_broadcast', async (data) => {
    try {
      await notificationHandler.handleBroadcastNotification(data)
    } catch (error) {
      logger.error('[广播通知] 处理通知失败:', error)
    }
  })
  
  logger.info('[广播通知] 监听器已注册')
  return notificationHandler
}
