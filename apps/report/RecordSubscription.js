import { getWebSocketManager } from '../../components/WebSocket.js'
import Config from '../../components/Config.js'
import Code from '../../components/Code.js'
import DataManager from '../../utils/Data.js'
import utils from '../../utils/utils.js'
import { getSubscriptionConfig } from '../../utils/SubscriptionConfig.js'
import Render from '../../components/Render.js'
import Runtime from '../../../../lib/plugins/runtime.js'
import { segment } from 'oicq'
import fs from 'fs'
import common from '../../../../lib/common/common.js'

// 状态映射常量
const ESCAPE_REASONS = {
  '1': '撤离成功',
  '2': '被玩家击杀',
  '3': '被人机击杀',
  '10': '撤离失败'
}

const MP_RESULTS = {
  '1': '胜利',
  '2': '失败',
  '3': '中途退出'
}

/**
 * 战绩订阅插件
 * 提供战绩订阅管理和实时推送功能
 */
export class RecordSubscription extends plugin {
  static _listenerRegistered = false
  static _nicknameCache = new Map() // 缓存 platformID -> 昵称的映射
  static _recentRecordCache = new Map() // 缓存 isRecent 战绩，用于批量合并转发
  static _recentRecordTimers = new Map() // 缓存定时器，用于延迟批量发送

  constructor(e) {
    super({
      name: '三角洲订阅管理',
      dsc: '战绩订阅&推送',
      event: 'message',
      priority: -100,
      rule: [
        {
          reg: '^(#三角洲|\\^)订阅\\s+战绩\\s*(.*)$',
          fnc: 'subscribeRecord'
        },
        {
          reg: '^(#三角洲|\\^)取消订阅\\s+战绩$',
          fnc: 'unsubscribeRecord'
        },
        {
          reg: '^(#三角洲|\\^)订阅状态\\s+战绩$',
          fnc: 'getSubscriptionStatus'
        },
        {
          reg: '^(#三角洲|\\^)开启本群订阅推送\\s+战绩\\s*(.*)$',
          fnc: 'enableGroupPush'
        },
        {
          reg: '^(#三角洲|\\^)关闭本群订阅推送\\s+战绩$',
          fnc: 'disableGroupPush'
        },
        {
          reg: '^(#三角洲|\\^)开启私信订阅推送\\s+战绩\\s*(.*)$',
          fnc: 'enablePrivatePush'
        },
        {
          reg: '^(#三角洲|\\^)关闭私信订阅推送\\s+战绩$',
          fnc: 'disablePrivatePush'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
    this.wsManager = getWebSocketManager()
    this.subConfig = getSubscriptionConfig()
    
    // 初始化战绩推送监听器
    this.initRecordPushListener()
  }

  /**
   * 初始化战绩推送监听器（单例）
   */
  initRecordPushListener() {
    // 使用静态标记避免重复注册
    if (RecordSubscription._listenerRegistered) {
      return
    }

    // 监听战绩推送消息
    this.wsManager.on('record_update', async (data) => {
      await this.handleRecordPush(data)
    })

    // 监听 WebSocket 连接成功事件，自动重新订阅
    this.wsManager.on('connected', async () => {
      await this.autoResubscribeOnConnect()
    })

    RecordSubscription._listenerRegistered = true
    logger.info('[战绩订阅] 推送监听器已初始化')

    // 检查 WebSocket 是否已连接，如果已连接则立即执行订阅
    const wsStatus = this.wsManager.getStatus()
    if (wsStatus.isConnected) {
      // 延迟执行，确保所有初始化完成
      setTimeout(async () => {
        await this.autoResubscribeOnConnect()
      }, 100)
    }
  }

  /**
   * WebSocket 连接成功后自动重新订阅
   */
  async autoResubscribeOnConnect() {
    try {
      // 获取所有推送配置
      const allConfigs = this.subConfig.getAllPushConfigs()
      
      if (!allConfigs || Object.keys(allConfigs).length === 0) {
        return
      }

      // 遍历所有用户的订阅配置
      for (const [platformID, config] of Object.entries(allConfigs)) {
        // 检查 Redis 中是否有订阅记录
        const subKey = `delta-force:record-sub:${platformID}`
        const subDataStr = await redis.get(subKey)
        
        if (!subDataStr) {
          logger.warn(`[战绩订阅] 用户 ${platformID} 本地有配置但 Redis 无订阅记录，跳过`)
          continue
        }

        const subData = JSON.parse(subDataStr)
        if (!subData.enabled) {
          continue
        }

        const recordType = subData.subscriptionType || 'both'
        
        // 发送 WebSocket 订阅消息
        const sendSuccess = this.wsManager.send({
          type: 'record_subscribe',
          platformID: platformID,
          recordType: recordType
        })

        if (!sendSuccess) {
          logger.error(`[战绩订阅] 用户 ${platformID} 自动订阅失败`)
        }
      }
      
    } catch (error) {
      logger.error('[战绩订阅] 自动重新订阅失败:', error)
    }
  }

  /**
   * 订阅战绩
   * 命令: ^订阅 战绩 [sol/mp/both]
   */
  async subscribeRecord() {
    const match = this.e.msg.match(/^(#三角洲|\^)订阅\s+战绩\s*(.*)$/)
    const typeArg = match[2].trim().toLowerCase()
    
    // 解析订阅类型
    let subscriptionType = 'both' // 默认订阅全部
    if (['sol', '烽火', '烽火地带'].includes(typeArg)) {
      subscriptionType = 'sol'
    } else if (['mp', '全面', '全面战场', '战场'].includes(typeArg)) {
      subscriptionType = 'mp'
    }

    const fullConfig = Config.getConfig()
    const clientID = fullConfig?.delta_force?.clientID
    
    if (!clientID || clientID === 'xxxxxx') {
      await this.e.reply('clientID 未配置，请先在配置文件中设置')
      return true
    }

    const platformID = String(this.e.user_id)

    try {
      // 1. 通过 HTTP API 创建订阅
      const httpRes = await this.api.subscribeRecord({
        platformID: platformID,
        clientID: clientID,
        subscriptionType: subscriptionType
      })

      if (await utils.handleApiError(httpRes, this.e)) {
        return true
      }

      if (!httpRes.success) {
        await this.e.reply(`订阅失败: ${httpRes.message || '未知错误'}`)
        return true
      }

      // 2. 确保 WebSocket 已连接
      const wsStatus = this.wsManager.getStatus()
      
      if (!wsStatus.isConnected) {
        // 尝试连接
        const connectSuccess = await this.wsManager.connect({
          clientID: clientID,
          platformID: platformID,
          clientType: this.e.isGroup ? 'group' : 'private'
        })

        if (!connectSuccess) {
          logger.error('[战绩订阅] WebSocket 连接失败')
          await this.e.reply('WebSocket 连接失败，请稍后重试或联系管理员')
          return true
        }

        // 等待连接就绪
        await new Promise((resolve) => {
          const timeout = setTimeout(() => {
            logger.warn('[战绩订阅] WebSocket 就绪超时')
            resolve()
          }, 5000)
          this.wsManager.once('connected', () => {
            clearTimeout(timeout)
            resolve()
          })
        })
      }

      // 3. 通过 WebSocket 订阅频道
      const sendSuccess = this.wsManager.send({
        type: 'record_subscribe',
        platformID: platformID,
        recordType: subscriptionType
      })

      if (!sendSuccess) {
        logger.error('[战绩订阅] WebSocket 订阅消息发送失败')
        await this.e.reply('WebSocket 订阅失败，请检查连接状态')
        return true
      }

      // 4. 保存订阅信息到 Redis
      await redis.set(
        `delta-force:record-sub:${platformID}`,
        JSON.stringify({
          subscriptionType: subscriptionType,
          subscribedAt: Date.now(),
          enabled: true
        }),
        { EX: 7 * 24 * 60 * 60 } // 7天过期
      )

      const typeText = subscriptionType === 'both' ? '烽火地带+全面战场' 
        : subscriptionType === 'sol' ? '烽火地带' 
        : '全面战场'

      await this.e.reply(`订阅成功 [${typeText}]\n使用 #三角洲订阅状态 战绩 查看详情`)

    } catch (error) {
      logger.error('[战绩订阅] 订阅失败:', error)
      await this.e.reply('订阅失败，请查看日志或联系管理员')
    }

    return true
  }

  /**
   * 取消订阅战绩
   */
  async unsubscribeRecord() {
    const clientID = Config.getConfig()?.delta_force?.clientID
    if (!clientID || clientID === 'xxxxxx') {
      await this.e.reply('clientID 未配置')
      return true
    }

    const platformID = String(this.e.user_id)

    try {
      // 1. 通过 HTTP API 取消订阅
      const httpRes = await this.api.unsubscribeRecord({
        platformID: platformID,
        clientID: clientID
      })

      if (await utils.handleApiError(httpRes, this.e)) {
        return true
      }

      if (!httpRes.success) {
        await this.e.reply(`取消失败: ${httpRes.message || '未知错误'}`)
        return true
      }

      // 2. 删除 Redis 中的订阅信息
      await redis.del(`delta-force:record-sub:${platformID}`)
      
      // 3. 清除推送配置
      this.subConfig.clearUserConfig(platformID)

      await this.e.reply('已取消订阅')

    } catch (error) {
      logger.error('[战绩订阅] 取消订阅失败:', error)
      await this.e.reply('取消订阅失败，请查看日志')
    }

    return true
  }

  /**
   * 查询订阅状态
   */
  async getSubscriptionStatus() {
    const clientID = Config.getConfig()?.delta_force?.clientID
    if (!clientID || clientID === 'xxxxxx') {
      await this.e.reply('clientID 未配置')
      return true
    }

    const platformID = String(this.e.user_id)

    try {
      // 1. 查询 HTTP API 订阅状态
      const httpRes = await this.api.getRecordSubscription(platformID, clientID)

      if (await utils.handleApiError(httpRes, this.e)) {
        return true
      }

      if (!httpRes.success || !httpRes.data) {
        await this.e.reply('您尚未订阅战绩推送\n使用 #三角洲战绩订阅 进行订阅')
        return true
      }

      const subData = httpRes.data
      
      // 2. 查询机器人推送配置
      const pushConfig = this.subConfig.getUserPushConfig(platformID)

      // 3. 构建状态消息 - 第一部分：API 订阅状态
      const typeText = subData.subscriptionType === 'both' ? '烽火地带+全面战场' 
        : subData.subscriptionType === 'sol' ? '烽火地带' 
        : '全面战场'

      let msg = '━━━ 订阅状态（API）━━━\n'
      msg += `状态: ${subData.isActive ? '已激活' : '未激活'}\n`
      msg += `模式: ${typeText}\n`
      msg += `订阅: ${new Date(subData.createdAt).toLocaleString()}\n`
      msg += `轮询: 每${subData.pollInterval}秒\n`
      msg += `统计: ${subData.newRecordsCount}条新战绩 (总${subData.totalPolls}次轮询)\n`
      
      if (subData.lastPollAt) {
        const lastTime = new Date(subData.lastPollAt).toLocaleTimeString()
        msg += `上次: ${lastTime}\n`
      }
      if (subData.nextPollAt) {
        const nextTime = new Date(subData.nextPollAt).toLocaleTimeString()
        msg += `下次: ${nextTime}\n`
      }

      // 最近战绩
      if ((subData.lastSolRecordIds && subData.lastSolRecordIds.length > 0) || 
          (subData.lastMpRecordIds && subData.lastMpRecordIds.length > 0)) {
        msg += `最近: `
        const recentRecords = []
        if (subData.lastSolRecordIds && subData.lastSolRecordIds.length > 0) {
          recentRecords.push(`烽火${subData.lastSolRecordIds[0].split('_')[1]}`)
        }
        if (subData.lastMpRecordIds && subData.lastMpRecordIds.length > 0) {
          recentRecords.push(`全面${subData.lastMpRecordIds[0].split('_')[1]}`)
        }
        msg += recentRecords.join(' | ') + '\n'
      }

      // 第二部分：机器人推送配置
      msg += `\n━━━ 推送配置（机器人）━━━\n`
      
      // 私信推送
      msg += `私信: ${pushConfig.private ? '已开启' : '已关闭'}`
      if (pushConfig.private && pushConfig.filters && pushConfig.filters.length > 0) {
        msg += ` [${pushConfig.filters.join('、')}]`
      }
      msg += '\n'

      // 群推送
      if (pushConfig.groups && pushConfig.groups.length > 0) {
        msg += `群聊: ${pushConfig.groups.length}个群\n`
        pushConfig.groups.forEach((group, index) => {
          msg += `  ${index + 1}. ${group.groupId}`
          if (group.filters && group.filters.length > 0) {
            msg += ` [${group.filters.join('、')}]`
          }
          msg += '\n'
        })
      } else {
        msg += `群聊: 未配置\n`
      }

      await this.e.reply(msg.trim())

    } catch (error) {
      logger.error('[战绩订阅] 查询状态失败:', error)
      await this.e.reply('查询失败，请查看日志')
    }

    return true
  }

  /**
   * 开启群战绩推送
   * 命令: ^开启本群订阅推送 战绩 [筛选条件]
   * 筛选条件：百万撤离、百万战损、天才少年
   */
  async enableGroupPush() {
    if (!this.e.isGroup) {
      await this.e.reply('此命令只能在群里使用')
      return true
    }

    const match = this.e.msg.match(/^(#三角洲|\^)开启本群订阅推送\s+战绩\s*(.*)$/)
    const filterArg = match[2].trim()

    const platformID = String(this.e.user_id)

    // 检查用户是否已订阅
    const subStr = await redis.get(`delta-force:record-sub:${platformID}`)
    if (!subStr) {
      await this.e.reply('您还未订阅战绩推送\n请先使用 #三角洲订阅 战绩')
      return true
    }

    // 解析筛选条件
    const filters = this.parseFilters(filterArg)

    // 保存群推送配置
    this.subConfig.setGroupPush(platformID, String(this.e.group_id), filters)

    let msg = '已开启本群推送'
    if (filters.length > 0) {
      msg += ` [${filters.join('、')}]`
    }

    await this.e.reply(msg)
    return true
  }

  /**
   * 解析筛选条件
   * @param {string} filterArg - 用户输入的筛选条件
   * @returns {Array<string>} - 筛选条件数组
   */
  parseFilters(filterArg) {
    const filters = []
    const normalized = filterArg.toLowerCase().replace(/\s+/g, '')

    if (normalized.includes('百万撤离') || normalized.includes('100w撤离') || normalized.includes('百万带出')) {
      filters.push('百万撤离')
    }
    if (normalized.includes('百万战损') || normalized.includes('100w战损')) {
      filters.push('百万战损')
    }
    if (normalized.includes('天才少年') || normalized.includes('天才')) {
      filters.push('天才少年')
    }

    return filters
  }

  /**
   * 关闭群战绩推送
   * 命令: ^关闭本群订阅推送 战绩
   */
  async disableGroupPush() {
    if (!this.e.isGroup) {
      await this.e.reply('此命令只能在群里使用')
      return true
    }

    const platformID = String(this.e.user_id)

    // 从推送配置中移除群
    this.subConfig.removeGroupPush(platformID, String(this.e.group_id))

    await this.e.reply('已关闭本群推送')
    return true
  }

  /**
   * 开启私信战绩推送
   * 命令: ^开启私信订阅推送 战绩 [筛选条件]
   */
  async enablePrivatePush() {
    const match = this.e.msg.match(/^(#三角洲|\^)开启私信订阅推送\s+战绩\s*(.*)$/)
    const filterArg = match[2].trim()

    const platformID = String(this.e.user_id)

    // 检查用户是否已订阅
    const subStr = await redis.get(`delta-force:record-sub:${platformID}`)
    if (!subStr) {
      await this.e.reply('您还未订阅战绩推送\n请先使用 #三角洲订阅 战绩')
      return true
    }

    // 解析筛选条件
    const filters = this.parseFilters(filterArg)

    // 保存私信推送配置
    this.subConfig.setPrivatePush(platformID, true, filters)

    let msg = '已开启私信推送'
    if (filters.length > 0) {
      msg += ` [${filters.join('、')}]`
    }

    await this.e.reply(msg)
    return true
  }

  /**
   * 关闭私信战绩推送
   * 命令: ^关闭私信订阅推送 战绩
   */
  async disablePrivatePush() {
    const platformID = String(this.e.user_id)

    // 关闭私信推送
    this.subConfig.setPrivatePush(platformID, false, [])

    await this.e.reply('已关闭私信推送')
    return true
  }

  /**
   * 处理战绩推送
   * @param {Object} data - 战绩推送数据
   */
  async handleRecordPush(data) {
    const { platformId, frameworkToken, recordType, record, isNew, isRecent } = data
    const platformID = platformId
    const modeText = recordType === 'sol' ? '烽火地带' : recordType === 'mp' ? '全面战场' : `未知(${recordType})`

    // 兼容处理：如果 isNew 不存在，使用 isRecent 来判断
    // isRecent=true 表示是最近/新的战绩，应该处理
    const shouldProcess = isNew !== undefined ? isNew : (isRecent === true)
    
    // 检查字段情况
    if (isNew === undefined && isRecent === undefined) {
      logger.warn(`[战绩订阅] 警告: isNew和isRecent字段都为undefined，无法判断是否为新战绩`)
      return
    }

    // 只处理新战绩，不处理缓存战绩
    if (!shouldProcess) {
      logger.debug(`[战绩订阅] 跳过缓存战绩: platformID=${platformID} | 模式: ${modeText}`)
      return
    }

    // 判断是否为 isRecent 战绩（非 isNew）
    const isRecentRecord = (isNew === undefined || isNew === false) && isRecent === true
    
    // 生成战绩唯一标识，防止重复推送
    // 使用关键字段生成唯一ID，确保同一场对局不会重复推送
    const mapId = record.MapID || record.MapId
    const armedForceId = record.ArmedForceId
    const dtEventTime = record.dtEventTime || ''
    
    // 对于烽火地带，添加 FinalPrice 作为额外标识
    // 对于全面战场，添加 TotalScore 作为额外标识
    let extraId = ''
    if (recordType === 'sol') {
      extraId = record.FinalPrice || '0'
    } else {
      extraId = record.TotalScore || '0'
    }
    
    const recordId = `${platformID}:${frameworkToken}:${recordType}:${mapId}:${armedForceId}:${dtEventTime}:${extraId}`
    const recordKey = `delta-force:record-pushed:${recordId}`
    
    // 检查 Redis 中是否已推送过
    const pushed = await redis.get(recordKey)
    if (pushed) {
      const pushedTime = new Date(parseInt(pushed)).toLocaleString()
      logger.debug(`[战绩订阅] 检测到重复推送，已跳过: ${platformID} | 模式: ${modeText} | 已推送时间: ${pushedTime}`)
      return
    }

    // 标记为已推送，保存到 Redis，24小时后过期（防止重启后重复推送）
    await redis.set(recordKey, Date.now().toString(), { EX: 24 * 60 * 60 })
    
    logger.info(`[战绩订阅] 处理新战绩: platformID=${platformID} | 模式: ${modeText} | isRecent=${isRecentRecord}`)

    try {
      // 1. 检查用户是否启用了战绩订阅
      const subStr = await redis.get(`delta-force:record-sub:${platformID}`)
      if (!subStr) {
        logger.debug(`[战绩订阅] 用户未订阅: ${platformID}`)
        return
      }

      const sub = JSON.parse(subStr)
      if (!sub.enabled) {
        logger.debug(`[战绩订阅] 用户已禁用推送: ${platformID}`)
        return
      }

      // 2. 获取推送配置
      const pushConfig = this.subConfig.getUserPushConfig(platformID)

      if (!pushConfig.private && (!pushConfig.groups || pushConfig.groups.length === 0)) {
        logger.warn(`[战绩订阅] 没有推送目标: ${platformID} | 模式: ${modeText}`)
        return
      }

      // 3. 如果是 isRecent 战绩，使用批量合并转发
      if (isRecentRecord) {
        await this.addToRecentRecordCache(platformID, recordType, record, frameworkToken, pushConfig)
        return
      }

      // 4. 格式化战绩消息（使用图片渲染）- 新战绩立即发送
      const message = await this.formatRecordMessageWithFallback(recordType, record, frameworkToken, platformID, false)

      // 5. 推送到私聊
      if (pushConfig.private) {
        const shouldPush = !pushConfig.filters || pushConfig.filters.length === 0 || 
                          this.checkFilters(recordType, record, pushConfig.filters)
        if (shouldPush) {
          try {
            await Bot.pickUser(platformID).sendMsg(message)
          } catch (error) {
            logger.error(`[战绩订阅] 私信推送失败: ${platformID} | 模式: ${modeText}`, error)
          }
        } else {
          logger.debug(`[战绩订阅] 战绩不符合私信筛选条件: ${platformID} | 模式: ${modeText}`)
        }
      }

      // 6. 推送到符合筛选条件的群
      if (pushConfig.groups && pushConfig.groups.length > 0) {
        for (const groupConfig of pushConfig.groups) {
          const shouldPush = !groupConfig.filters || groupConfig.filters.length === 0 || 
                            this.checkFilters(recordType, record, groupConfig.filters)
          if (shouldPush) {
            try {
              await Bot.pickGroup(groupConfig.groupId).sendMsg(message)
            } catch (error) {
              logger.error(`[战绩订阅] 推送失败到群${groupConfig.groupId} | 模式: ${modeText}`, error)
            }
          } else {
            logger.debug(`[战绩订阅] 战绩不符合筛选条件，跳过推送到群${groupConfig.groupId} | 模式: ${modeText}`)
          }
        }
      }

    } catch (error) {
      logger.error(`[战绩订阅] 处理推送失败: ${platformID} | 模式: ${modeText}`, error)
    }
  }


  /**
   * 格式化战绩消息（带降级处理）
   * @param {string} recordType - 战绩类型
   * @param {Object} record - 战绩对象
   * @param {string} frameworkToken - 游戏账号令牌
   * @param {string} platformID - 用户ID
   * @param {boolean} isRecent - 是否为 isRecent 战绩
   * @returns {Promise<string>} 格式化后的消息
   */
  async formatRecordMessageWithFallback(recordType, record, frameworkToken, platformID, isRecent) {
    try {
      logger.debug(`[战绩订阅] 开始格式化战绩消息: ${platformID} | isRecent=${isRecent}`)
      const message = await this.formatRecordMessage(recordType, record, frameworkToken, platformID, isRecent)
      logger.debug(`[战绩订阅] 战绩消息格式化完成: ${platformID}`)
      return message
    } catch (error) {
      logger.error(`[战绩订阅] 格式化战绩消息失败: ${platformID}`, error)
      // 使用文本消息作为降级
      const mapId = record.MapID || record.MapId
      const armedForceId = record.ArmedForceId
      const mapName = DataManager.getMapName(mapId)
      const operatorName = DataManager.getOperatorName(armedForceId)
      // 尝试从 platformID 获取昵称
      let displayName = '未知玩家'
      try {
        const nickname = await this.getNickname(platformID)
        if (nickname) {
          displayName = nickname
        } else if (frameworkToken) {
          displayName = `${frameworkToken.substring(0, 4)}****${frameworkToken.slice(-4)}`
        }
      } catch (error) {
        if (frameworkToken) {
          displayName = `${frameworkToken.substring(0, 4)}****${frameworkToken.slice(-4)}`
        }
      }
      return this.formatRecordMessageText(recordType, record, frameworkToken, displayName, mapName, operatorName, isRecent)
    }
  }



  /**
   * 添加 isRecent 战绩到缓存，用于批量合并转发
   * @param {string} platformID - 用户ID
   * @param {string} recordType - 战绩类型
   * @param {Object} record - 战绩对象
   * @param {string} frameworkToken - 游戏账号令牌
   * @param {Object} pushConfig - 推送配置
   */
  async addToRecentRecordCache(platformID, recordType, record, frameworkToken, pushConfig) {
    // 为每个推送目标创建缓存键
    const cacheKeys = []
    
    // 私信推送
    if (pushConfig.private) {
      const shouldPush = !pushConfig.filters || pushConfig.filters.length === 0 || 
                        this.checkFilters(recordType, record, pushConfig.filters)
      if (shouldPush) {
        cacheKeys.push(`private:${platformID}`)
      }
    }
    
    // 群推送
    if (pushConfig.groups && pushConfig.groups.length > 0) {
      for (const groupConfig of pushConfig.groups) {
        const shouldPush = !groupConfig.filters || groupConfig.filters.length === 0 || 
                          this.checkFilters(recordType, record, groupConfig.filters)
        if (shouldPush) {
          cacheKeys.push(`group:${groupConfig.groupId}:${platformID}`)
        }
      }
    }

    // 为每个推送目标添加战绩到缓存
    for (const cacheKey of cacheKeys) {
      if (!RecordSubscription._recentRecordCache.has(cacheKey)) {
        RecordSubscription._recentRecordCache.set(cacheKey, [])
      }
      
      const cache = RecordSubscription._recentRecordCache.get(cacheKey)
      cache.push({
        platformID,
        recordType,
        record,
        frameworkToken
      })

      // 清除之前的定时器
      if (RecordSubscription._recentRecordTimers.has(cacheKey)) {
        clearTimeout(RecordSubscription._recentRecordTimers.get(cacheKey))
      }

      // 设置新的定时器，500ms 后批量发送
      const timer = setTimeout(async () => {
        await this.sendRecentRecordsBatch(cacheKey)
      }, 500)
      
      RecordSubscription._recentRecordTimers.set(cacheKey, timer)
    }
  }

  /**
   * 批量发送 isRecent 战绩（合并转发）
   * @param {string} cacheKey - 缓存键
   */
  async sendRecentRecordsBatch(cacheKey) {
    const cache = RecordSubscription._recentRecordCache.get(cacheKey)
    if (!cache || cache.length === 0) {
      return
    }

    // 清空缓存
    RecordSubscription._recentRecordCache.delete(cacheKey)
    RecordSubscription._recentRecordTimers.delete(cacheKey)

    const [targetType, ...rest] = cacheKey.split(':')
    const platformID = rest[rest.length - 1]
    
    try {
      // 格式化所有战绩消息
      const messages = []
      for (const item of cache) {
        const message = await this.formatRecordMessageWithFallback(
          item.recordType,
          item.record,
          item.frameworkToken,
          item.platformID,
          true // isRecent = true
        )
        // 如果返回的是 base64 图片，使用 segment.image 包装
        if (typeof message === 'string' && (message.startsWith('base64://') || message.startsWith('data:image'))) {
          messages.push([segment.image(message)])
        } else {
          messages.push([message])
        }
      }

      if (messages.length === 0) {
        return
      }

      // 创建伪事件对象用于合并转发
      const fakeE = this.createFakeEvent(platformID)
      if (!fakeE) {
        logger.error(`[战绩订阅] 创建伪事件对象失败，无法发送合并转发: ${platformID}`)
        return
      }

      // 使用合并转发发送
      const forwardMsg = common.makeForwardMsg(fakeE, messages, '最近的战绩')
      const targetId = targetType === 'private' ? platformID : rest[0]
      
      try {
        if (targetType === 'private') {
          await Bot.pickUser(targetId).sendMsg(forwardMsg)
        } else if (targetType === 'group') {
          await Bot.pickGroup(targetId).sendMsg(forwardMsg)
        }
        logger.info(`[战绩订阅] 已批量发送 ${messages.length} 条 isRecent 战绩到${targetType === 'private' ? '私信' : `群${targetId}`}: ${platformID}`)
      } catch (error) {
        const targetName = targetType === 'private' ? '私信' : `群${targetId}`
        logger.error(`[战绩订阅] ${targetName}批量推送失败: ${platformID}`, error)
      }
    } catch (error) {
      logger.error(`[战绩订阅] 批量发送 isRecent 战绩失败: ${cacheKey}`, error)
    }
  }

  /**
   * 检查战绩是否符合筛选条件
   * @param {string} recordType - sol 或 mp
   * @param {Object} record - 战绩对象
   * @param {Array<string>} filters - 筛选条件数组
   * @returns {boolean}
   */
  checkFilters(recordType, record, filters) {
    for (const filter of filters) {
      switch (filter) {
        case '百万撤离':
          // 烽火地带：带出价值 >= 100w
          if (recordType === 'sol' && Number(record.FinalPrice) >= 1000000) {
            return true
          }
          break
        
        case '百万战损':
          // 烽火地带：战损 >= 100w
          // 战损 = 利润 - 总带出 = 局内损失（负数）
          if (recordType === 'sol') {
            const profit = Number(record.flowCalGainedPrice) || 0
            const carryOut = Number(record.FinalPrice) || 0
            const loss = profit - carryOut  // 局内损失
            if (loss <= -1000000) {
              return true
            }
          }
          break
        
        case '天才少年':
          // 烽火地带：击杀 >= 12
          if (recordType === 'sol' && Number(record.KillCount) >= 12) {
            return true
          }
          // 全面战场：击杀 >= 140
          if (recordType === 'mp' && Number(record.KillNum) >= 140) {
            return true
          }
          break
      }
    }
    
    // 如果有筛选条件但都不满足，返回 false
    return filters.length === 0
  }

  /**
   * 获取玩家昵称（带缓存）
   * @param {string} platformID - 用户ID
   * @returns {Promise<string|null>} 玩家昵称或 null
   */
  async getNickname(platformID) {
    if (!platformID) return null
    
    if (RecordSubscription._nicknameCache.has(platformID)) {
      return RecordSubscription._nicknameCache.get(platformID)
    }
    
    try {
      const token = await utils.getAccount(platformID)
      if (!token) return null
      
      const api = new Code()
      const res = await api.getPersonalInfo(token)
      
      if (res?.data && res?.roleInfo) {
        const { userData } = res.data
        const { roleInfo } = res
        let nickname = null
        try {
          nickname = decodeURIComponent(userData?.charac_name || roleInfo.charac_name || '') || null
        } catch (e) {
          nickname = (userData?.charac_name || roleInfo.charac_name) || null
        }
        
        if (nickname) {
          RecordSubscription._nicknameCache.set(platformID, nickname)
          setTimeout(() => RecordSubscription._nicknameCache.delete(platformID), 3600000)
          return nickname
        }
      }
    } catch (error) {
      logger.debug(`[战绩订阅] 获取昵称失败: platformID=${platformID}`, error)
    }
    
    return null
  }

  /**
   * 创建伪事件对象用于渲染
   * @param {string} platformID - 用户ID
   * @returns {Object} 伪事件对象
   */
  createFakeEvent(platformID) {
    const fakeE = {
      user_id: platformID,
      isGroup: false,
      isPrivate: true
    }
    try {
      fakeE.runtime = new Runtime(fakeE)
    } catch (error) {
      logger.error('[战绩订阅] 创建 Runtime 失败:', error)
      // 如果创建失败，返回 null，后续会降级为文本消息
      return null
    }
    return fakeE
  }

  /**
   * 格式化时长
   * @param {number} seconds - 秒数
   * @returns {string} 格式化后的时长
   */
  formatDuration(seconds) {
    if (!seconds && seconds !== 0) return '未知'
    if (seconds === 0) return '0秒'
    
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) return `${hours}小时${minutes}分${secs}秒`
    if (minutes > 0) return `${minutes}分${secs}秒`
    return `${secs}秒`
  }

  /**
   * 格式化战绩消息（使用图片渲染）
   * @param {string} recordType - 战绩类型 (sol/mp)
   * @param {Object} record - 战绩对象
   * @param {string} frameworkToken - 游戏账号令牌（可选）
   * @param {string} platformID - 用户ID（用于创建伪事件对象）
   * @param {boolean} isRecent - 是否为 isRecent 战绩（标题显示"最近的战绩"）
   * @returns {Promise<Array|string>}
   */
  async formatRecordMessage(recordType, record, frameworkToken, platformID, isRecent = false) {
    const modeText = recordType === 'sol' ? '烽火地带' : '全面战场'
    const mapId = record.MapID || record.MapId
    const armedForceId = record.ArmedForceId
    const mapName = DataManager.getMapName(mapId)
    const operatorName = DataManager.getOperatorName(armedForceId)
    let displayName = '未知玩家'

    try {
      const nickname = await this.getNickname(platformID)
      if (nickname) {
        displayName = nickname
      } else if (frameworkToken) {
        displayName = `${frameworkToken.substring(0, 4)}****${frameworkToken.slice(-4)}`
      }
    } catch (error) {
      logger.warn(`[战绩订阅] 获取昵称失败: platformID=${platformID}`, error)
      if (frameworkToken) {
        displayName = `${frameworkToken.substring(0, 4)}****${frameworkToken.slice(-4)}`
      }
    }

    // 构建地图背景图路径的辅助函数（使用新的统一路径，支持降级匹配）
    const getMapBgPath = (mapName, gameMode) => {
      const modePrefix = gameMode === 'sol' ? '烽火' : '全面'
      const baseDir = `${process.cwd()}/plugins/delta-force-plugin/resources/imgs/map`.replace(/\\/g, '/')
      
      // 处理地图名称：尝试精确匹配和降级匹配
      const parts = mapName.split('-')
      let finalPath = null
      
      if (parts.length >= 2) {
        // 有难度级别的情况：尝试精确匹配，如果不存在则降级到常规
        const baseMapName = parts[0]
        const difficulty = parts.slice(1).join('-')
        
        // 优先级1: 精确匹配
        const exactPath = `${baseDir}/${modePrefix}-${baseMapName}-${difficulty}.png`
        if (fs.existsSync(exactPath)) {
          finalPath = `imgs/map/${modePrefix}-${baseMapName}-${difficulty}.png`
        } else {
          // 优先级2: 降级到常规版本
          const regularPath = `${baseDir}/${modePrefix}-${baseMapName}-常规.png`
          if (fs.existsSync(regularPath)) {
            finalPath = `imgs/map/${modePrefix}-${baseMapName}-常规.png`
          } else {
            // 优先级3: 尝试基础地图名称
            const basePath = `${baseDir}/${modePrefix}-${baseMapName}.jpg`
            if (fs.existsSync(basePath)) {
              finalPath = `imgs/map/${modePrefix}-${baseMapName}.jpg`
            } else {
              // 如果都不存在，返回精确匹配路径（让浏览器处理错误）
              finalPath = `imgs/map/${modePrefix}-${baseMapName}-${difficulty}.png`
            }
          }
        }
      } else {
        // 只有基础地图名称的情况
        const cleanMapName = parts[0]
        const jpgPath = `${baseDir}/${modePrefix}-${cleanMapName}.jpg`
        const pngPath = `${baseDir}/${modePrefix}-${cleanMapName}.png`
        
        if (fs.existsSync(jpgPath)) {
          finalPath = `imgs/map/${modePrefix}-${cleanMapName}.jpg`
        } else if (fs.existsSync(pngPath)) {
          finalPath = `imgs/map/${modePrefix}-${cleanMapName}.png`
        } else {
          finalPath = `imgs/map/${modePrefix}-${cleanMapName}.jpg`
        }
      }
      
      const bgPath = `${process.cwd()}/plugins/delta-force-plugin/resources/${finalPath}`.replace(/\\/g, '/')
      return `file:///${bgPath}`
    }

    // 构建干员图片路径的辅助函数
    const getOperatorImgPath = (operatorName) => {
      const relativePath = DataManager.getOperatorImagePath(operatorName)
      const imgPath = `${process.cwd()}/plugins/delta-force-plugin/resources/${relativePath}`.replace(/\\/g, '/')
      return `file:///${imgPath}`
    }

    // 创建伪事件对象
    let fakeE
    try {
      fakeE = this.createFakeEvent(platformID)
      if (!fakeE) {
        logger.warn(`[战绩订阅] 创建伪事件对象失败: ${platformID}，使用文本消息降级`)
        return this.formatRecordMessageText(recordType, record, frameworkToken, displayName, mapName, operatorName, isRecent)
      }
    } catch (error) {
      logger.error(`[战绩订阅] 创建伪事件对象异常: ${platformID}`, error)
      return this.formatRecordMessageText(recordType, record, frameworkToken, displayName, mapName, operatorName, isRecent)
    }

    // 准备模板数据
    // 如果是 isRecent 战绩，标题显示"最近的战绩"
    const templateData = {
      isRecent: isRecent,
      displayName: displayName,
      modeName: modeText,
      time: record.dtEventTime,
      map: mapName || '未知地图',
      operator: operatorName || '未知干员',
      mapBg: getMapBgPath(mapName || '未知地图', recordType),
      operatorImg: getOperatorImgPath(operatorName || '未知干员')
    }

    if (recordType === 'sol') {
      const finalPrice = Number(record.FinalPrice || 0).toLocaleString()
      const income = (record.flowCalGainedPrice != null && record.flowCalGainedPrice !== '') 
        ? Number(record.flowCalGainedPrice).toLocaleString() 
        : '未知'
      
      const duration = this.formatDuration(Number(record.DurationS))
      const escapeStatus = ESCAPE_REASONS[String(record.EscapeFailReason)] || '撤离失败'
      
      let statusClass = 'fail'
      if (record.EscapeFailReason === 1 || record.EscapeFailReason === '1') statusClass = 'success'
      else if (record.EscapeFailReason === 3 || record.EscapeFailReason === '3') statusClass = 'exit'

      const killCount = record.KillCount ?? 0
      const killAI = record.KillAICount ?? 0
      const killPlayerAI = record.KillPlayerAICount ?? 0
      const killsHtml = `<span class="kill-player">${killCount}玩家</span> / <span class="kill-ai-player">${killPlayerAI}AI玩家</span> / <span class="kill-ai">${killAI}AI</span>`

      templateData.status = escapeStatus
      templateData.statusClass = statusClass
      templateData.duration = duration
      templateData.value = finalPrice
      templateData.income = income
      templateData.killsHtml = killsHtml
      if (record.Rescue != null && record.Rescue > 0) {
        templateData.rescue = record.Rescue
      }
    } else {
      const duration = this.formatDuration(Number(record.gametime))
      const result = MP_RESULTS[String(record.MatchResult)] || '未知结果'
      
      let statusClass = 'fail'
      if (record.MatchResult === 1 || record.MatchResult === '1') statusClass = 'success'
      else if (record.MatchResult === 3 || record.MatchResult === '3') statusClass = 'exit'

      templateData.status = result
      templateData.statusClass = statusClass
      templateData.duration = duration
      templateData.kda = `${record.KillNum}/${record.Death}/${record.Assist}`
      templateData.score = record.TotalScore.toLocaleString()
      if (record.RescueTeammateCount != null && record.RescueTeammateCount > 0) {
        templateData.rescue = record.RescueTeammateCount
      }
    }

    // 渲染模板（使用 base64 模式获取图片数据，而不是自动发送）
    try {
      const base64Data = await Render.render('Template/recordPush/recordPush', templateData, {
        e: fakeE,
        scale: 1.2,
        retType: 'base64'
      })
      
      if (base64Data) {
        return base64Data
      } else {
        // 如果渲染失败，返回文本消息作为降级
        logger.warn(`[战绩订阅] 图片渲染返回空值，使用文本消息降级: ${platformID} | 模式: ${modeText}`)
        return this.formatRecordMessageText(recordType, record, frameworkToken, displayName, mapName, operatorName, isRecent)
      }
    } catch (error) {
      logger.error(`[战绩订阅] 图片渲染异常: ${platformID} | 模式: ${modeText}`, error)
      // 如果渲染异常，返回文本消息作为降级
      return this.formatRecordMessageText(recordType, record, frameworkToken, displayName, mapName, operatorName, isRecent)
    }
  }

  /**
   * 格式化战绩消息（文本格式，作为降级方案）
   * @param {string} recordType - 战绩类型
   * @param {Object} record - 战绩对象
   * @param {string} frameworkToken - 游戏账号令牌
   * @param {string} displayName - 显示名称
   * @param {string} mapName - 地图名称
   * @param {string} operatorName - 干员名称
   * @param {boolean} isRecent - 是否为 isRecent 战绩（标题显示"最近的战绩"）
   */
  formatRecordMessageText(recordType, record, frameworkToken, displayName, mapName, operatorName, isRecent = false) {
    const modeText = recordType === 'sol' ? '烽火地带' : '全面战场'
    const titlePrefix = isRecent ? '最近的战绩-' : ''
    let msg = `${titlePrefix}${displayName}-战绩订阅-${modeText}\n`

    if (recordType === 'sol') {
      const finalPrice = Number(record.FinalPrice || 0).toLocaleString()
      const income = (record.flowCalGainedPrice != null && record.flowCalGainedPrice !== '') 
        ? Number(record.flowCalGainedPrice).toLocaleString() 
        : '未知'
      const duration = this.formatDuration(Number(record.DurationS))
      const escapeStatus = ESCAPE_REASONS[String(record.EscapeFailReason)] || '撤离失败'

      msg += `地图：${mapName}\n`
      msg += `干员：${operatorName}\n`
      msg += `时间：${record.dtEventTime}\n`
      msg += `状态：${escapeStatus}\n`
      msg += `存活：${duration}\n`
      msg += `带出价值：${finalPrice}\n`
      msg += `净收益：${income}\n`
      
      const killCount = record.KillCount ?? '未知'
      const killAI = record.KillAICount ?? '未知'
      const killPlayerAI = record.KillPlayerAICount ?? '未知'
      msg += `击杀：玩家(${killCount}) / AI(${killAI}) / AI玩家(${killPlayerAI})`
      
      if (record.Rescue != null && record.Rescue > 0) {
        msg += `\n救援：${record.Rescue}次`
      }
    } else {
      const duration = this.formatDuration(Number(record.gametime))
      const result = MP_RESULTS[String(record.MatchResult)] || '未知结果'

      msg += `地图：${mapName}\n`
      msg += `干员：${operatorName}\n`
      msg += `时间：${record.dtEventTime}\n`
      msg += `结果：${result}\n`
      msg += `K/D/A：${record.KillNum}/${record.Death}/${record.Assist}\n`
      msg += `得分：${record.TotalScore.toLocaleString()}\n`
      msg += `时长：${duration}`
      
      if (record.RescueTeammateCount != null && record.RescueTeammateCount > 0) {
        msg += `\n救援：${record.RescueTeammateCount}次`
      }
    }

    return msg
  }
}
