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

/**
 * 战绩订阅插件
 * 提供战绩订阅管理和实时推送功能
 */
export class RecordSubscription extends plugin {
  static _listenerRegistered = false
  static _nicknameCache = new Map() // 缓存 frameworkToken -> 昵称的映射
  static _pushedRecords = new Map() // 缓存已推送的战绩ID，防止短时间内重复推送

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
      logger.info('[战绩订阅] WebSocket 已连接，立即执行自动订阅')
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
      logger.info('[战绩订阅] WebSocket 已连接，检查本地订阅状态...')
      
      // 获取所有推送配置
      const allConfigs = this.subConfig.getAllPushConfigs()
      
      if (!allConfigs || Object.keys(allConfigs).length === 0) {
        logger.info('[战绩订阅] 没有本地订阅记录')
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
          logger.info(`[战绩订阅] 用户 ${platformID} 订阅已禁用，跳过`)
          continue
        }

        const recordType = subData.subscriptionType || 'both'
        
        logger.info(`[战绩订阅] 自动重新订阅: platformID=${platformID}, recordType=${recordType}`)
        
        // 发送 WebSocket 订阅消息
        const sendSuccess = this.wsManager.send({
          type: 'record_subscribe',
          platformID: platformID,
          recordType: recordType
        })

        if (sendSuccess) {
          logger.info(`[战绩订阅] 用户 ${platformID} 自动订阅成功`)
        } else {
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
      logger.info(`[战绩订阅] WebSocket 状态: ${wsStatus.isConnected ? '已连接' : '未连接'}`)
      
      if (!wsStatus.isConnected) {
        logger.info('[战绩订阅] 正在建立 WebSocket 连接...')
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
        logger.info('[战绩订阅] 等待 WebSocket 就绪...')
        await new Promise((resolve) => {
          const timeout = setTimeout(() => {
            logger.warn('[战绩订阅] WebSocket 就绪超时')
            resolve()
          }, 5000)
          this.wsManager.once('connected', () => {
            logger.info('[战绩订阅] WebSocket 已连接')
            clearTimeout(timeout)
            resolve()
          })
        })
      }

      // 3. 通过 WebSocket 订阅频道
      logger.info(`[战绩订阅] 发送 WebSocket 订阅请求: platformID=${platformID}, recordType=${subscriptionType}`)
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

      logger.info('[战绩订阅] WebSocket 订阅消息已发送')

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

      await this.e.reply(`订阅成功 [${typeText}]\n使用 ^订阅状态 战绩 查看详情`)

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
      await this.e.reply('您还未订阅战绩推送\n请先使用 ^订阅 战绩')
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
      await this.e.reply('您还未订阅战绩推送\n请先使用 ^订阅 战绩')
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
    const platformID = platformId  // 兼容性：转换为内部使用的变量名
    const maskedToken = frameworkToken ? `${frameworkToken.substring(0, 4)}****${frameworkToken.slice(-4)}` : '未知'
    const modeText = recordType === 'sol' ? '烽火地带' : recordType === 'mp' ? '全面战场' : `未知(${recordType})`

    // 只处理新战绩，不处理缓存战绩
    if (!isNew) {
      logger.debug(`[战绩订阅] 跳过缓存战绩: ${platformID} | 账号: ${maskedToken} | 模式: ${modeText} | 类型: ${recordType}`)
      return
    }

    // 生成战绩唯一标识，防止重复推送
    const recordId = `${platformID}:${frameworkToken}:${recordType}:${record.dtEventTime || Date.now()}`
    if (RecordSubscription._pushedRecords.has(recordId)) {
      logger.debug(`[战绩订阅] 检测到重复推送，已跳过: ${platformID} | 账号: ${maskedToken} | 模式: ${modeText} | 类型: ${recordType} | ID: ${recordId.substring(0, 50)}...`)
      return
    }

    // 标记为已推送，5分钟后过期
    RecordSubscription._pushedRecords.set(recordId, Date.now())
    setTimeout(() => {
      RecordSubscription._pushedRecords.delete(recordId)
    }, 300000) // 5分钟

    // 记录需要处理的事件（在去重检查之后）
    logger.info(`[战绩订阅] 收到推送事件: ${platformID} | 账号: ${maskedToken} | 模式: ${modeText} | 类型: ${recordType} | isRecent: ${isRecent}`)

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
      logger.info(`[战绩订阅] 推送配置: 模式=${modeText} | 私信=${pushConfig.private} | 群数=${pushConfig.groups?.length || 0}`)

      if (!pushConfig.private && (!pushConfig.groups || pushConfig.groups.length === 0)) {
        logger.warn(`[战绩订阅] 没有推送目标: ${platformID} | 模式: ${modeText}`)
        return
      }

      // 3. 格式化战绩消息（使用图片渲染）
      logger.info(`[战绩订阅] 开始格式化战绩消息: ${platformID} | 模式: ${modeText} | 类型: ${recordType}`)
      let message
      try {
        message = await this.formatRecordMessage(recordType, record, frameworkToken, platformID)
        logger.info(`[战绩订阅] 战绩消息格式化完成: ${platformID} | 模式: ${modeText}`)
      } catch (error) {
        logger.error(`[战绩订阅] 格式化战绩消息失败: ${platformID} | 模式: ${modeText}`, error)
        // 使用文本消息作为降级
        const mapId = record.MapID || record.MapId
        let mapName = DataManager.getMapName(mapId)
        const operatorName = DataManager.getOperatorName(record.ArmedForceId)
        const displayName = frameworkToken ? `${frameworkToken.substring(0, 4)}****${frameworkToken.slice(-4)}` : '未知玩家'
        message = this.formatRecordMessageText(recordType, record, frameworkToken, displayName, mapName, operatorName)
      }

      // 4. 推送到私聊
      if (pushConfig.private) {
        // 应用私信筛选条件
        if (pushConfig.filters && pushConfig.filters.length > 0) {
          if (!this.checkFilters(recordType, record, pushConfig.filters)) {
            logger.debug(`[战绩订阅] 战绩不符合私信筛选条件: ${platformID} | 模式: ${modeText}`)
          } else {
            try {
              const maskedToken = frameworkToken ? `${frameworkToken.substring(0, 4)}****${frameworkToken.slice(-4)}` : '未知'
              await Bot.pickUser(platformID).sendMsg(message)
              logger.info(`[战绩订阅] 私信推送成功: ${platformID} | 账号: ${maskedToken} | 模式: ${modeText}`)
            } catch (error) {
              const maskedToken = frameworkToken ? `${frameworkToken.substring(0, 4)}****${frameworkToken.slice(-4)}` : '未知'
              logger.error(`[战绩订阅] 私信推送失败: ${platformID} | 账号: ${maskedToken} | 模式: ${modeText}`, error)
            }
          }
        } else {
          // 无筛选条件，推送所有
          try {
            const maskedToken = frameworkToken ? `${frameworkToken.substring(0, 4)}****${frameworkToken.slice(-4)}` : '未知'
            await Bot.pickUser(platformID).sendMsg(message)
            logger.info(`[战绩订阅] 私信推送成功: ${platformID} | 账号: ${maskedToken} | 模式: ${modeText}`)
          } catch (error) {
            const maskedToken = frameworkToken ? `${frameworkToken.substring(0, 4)}****${frameworkToken.slice(-4)}` : '未知'
            logger.error(`[战绩订阅] 私信推送失败: ${platformID} | 账号: ${maskedToken} | 模式: ${modeText}`, error)
          }
        }
      }

      // 5. 推送到符合筛选条件的群
      if (pushConfig.groups && pushConfig.groups.length > 0) {
        for (const groupConfig of pushConfig.groups) {
          try {
            // 应用群筛选条件
            if (groupConfig.filters && groupConfig.filters.length > 0) {
              if (!this.checkFilters(recordType, record, groupConfig.filters)) {
                logger.debug(`[战绩订阅] 战绩不符合筛选条件，跳过推送到群${groupConfig.groupId} | 模式: ${modeText}`)
                continue
              }
            }

            const maskedToken = frameworkToken ? `${frameworkToken.substring(0, 4)}****${frameworkToken.slice(-4)}` : '未知'
            await Bot.pickGroup(groupConfig.groupId).sendMsg(message)
            logger.info(`[战绩订阅] 推送成功: ${platformID} | 账号: ${maskedToken} | 模式: ${modeText} -> 群${groupConfig.groupId}`)
          } catch (error) {
            logger.error(`[战绩订阅] 推送失败到群${groupConfig.groupId} | 模式: ${modeText}:`, error)
          }
        }
      }

    } catch (error) {
      logger.error(`[战绩订阅] 处理推送失败: ${platformID} | 模式: ${modeText}`, error)
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
   * URL解码函数
   * @param {string} str - 待解码字符串
   * @returns {string} 解码后的字符串
   */
  decode(str) {
    try {
      return decodeURIComponent(str || '')
    } catch (e) {
      return str || ''
    }
  }

  /**
   * 获取玩家昵称（带缓存）
   * @param {string} frameworkToken - 游戏账号令牌
   * @returns {Promise<string|null>} 玩家昵称或 null
   */
  async getNickname(frameworkToken) {
    if (!frameworkToken) return null
    
    // 检查缓存
    if (RecordSubscription._nicknameCache.has(frameworkToken)) {
      return RecordSubscription._nicknameCache.get(frameworkToken)
    }
    
    try {
      const api = new Code()
      const res = await api.getPersonalInfo(frameworkToken)
      
      if (res && res.data && res.roleInfo) {
        const { userData } = res.data
        const { roleInfo } = res
        
        // 参考 Info.js 的实现方式
        const nickname = this.decode(userData?.charac_name || roleInfo.charac_name) || null
        
        if (nickname) {
          // 缓存昵称（1小时后过期）
          RecordSubscription._nicknameCache.set(frameworkToken, nickname)
          setTimeout(() => {
            RecordSubscription._nicknameCache.delete(frameworkToken)
          }, 3600000)
          
          return nickname
        }
      }
    } catch (error) {
      logger.debug(`[战绩订阅] 获取昵称失败: ${frameworkToken.substring(0, 4)}****${frameworkToken.slice(-4)}`, error)
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
   * 格式化战绩消息（使用图片渲染）
   * @param {string} recordType - 战绩类型 (sol/mp)
   * @param {Object} record - 战绩对象
   * @param {string} frameworkToken - 游戏账号令牌（可选）
   * @param {string} platformID - 用户ID（用于创建伪事件对象）
   * @returns {Promise<Array|string>}
   */
  async formatRecordMessage(recordType, record, frameworkToken, platformID) {
    const modeText = recordType === 'sol' ? '烽火地带' : '全面战场'
    // 全面战场使用 MapID，烽火地带使用 MapId
    const mapId = record.MapID || record.MapId
    let mapName = DataManager.getMapName(mapId)
    const operatorName = DataManager.getOperatorName(record.ArmedForceId)

    // 地图名称映射：沟壕战 -> 堑壕战（仅用于全面战场战绩，匹配图片文件名）
    if (recordType === 'mp' && mapName && mapName.includes('沟壕战')) {
      mapName = mapName.replace(/沟壕战/g, '堑壕战')
    }

    // 获取昵称
    let nickname = null
    if (frameworkToken) {
      try {
        nickname = await this.getNickname(frameworkToken)
      } catch (error) {
        logger.warn(`[战绩订阅] 获取昵称失败: ${frameworkToken.substring(0, 4)}****${frameworkToken.slice(-4)}`, error)
        // 继续执行，使用默认显示名称
      }
    }
    
    // 标题显示昵称或账号
    const displayName = nickname || (frameworkToken ? `${frameworkToken.substring(0, 4)}****${frameworkToken.slice(-4)}` : '未知玩家')

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
      const relativePath = utils.getOperatorImagePath(operatorName)
      const imgPath = `${process.cwd()}/plugins/delta-force-plugin/resources/${relativePath}`.replace(/\\/g, '/')
      return `file:///${imgPath}`
    }

    // 创建伪事件对象
    let fakeE
    try {
      fakeE = this.createFakeEvent(platformID)
      if (!fakeE) {
        logger.warn(`[战绩订阅] 创建伪事件对象失败: ${platformID}，使用文本消息降级`)
        return this.formatRecordMessageText(recordType, record, frameworkToken, displayName, mapName, operatorName)
      }
    } catch (error) {
      logger.error(`[战绩订阅] 创建伪事件对象异常: ${platformID}`, error)
      return this.formatRecordMessageText(recordType, record, frameworkToken, displayName, mapName, operatorName)
    }

    // 准备模板数据
    const templateData = {
      displayName,
      modeName: modeText,
      time: record.dtEventTime,
      map: mapName,
      operator: operatorName,
      mapBg: getMapBgPath(mapName, recordType),
      operatorImg: getOperatorImgPath(operatorName)
    }

    if (recordType === 'sol') {
      // 烽火地带战绩
      const finalPrice = Number(record.FinalPrice || 0).toLocaleString()
      const income = (record.flowCalGainedPrice != null && record.flowCalGainedPrice !== '') 
        ? Number(record.flowCalGainedPrice).toLocaleString() 
        : '未知'
      
      // 处理存活时间
      const durationS = Number(record.DurationS || 0)
      let duration = '未知'
      if (durationS > 0) {
        const hours = Math.floor(durationS / 3600)
        const minutes = Math.floor((durationS % 3600) / 60)
        const seconds = durationS % 60
        if (hours > 0) {
          duration = `${hours}小时${minutes}分${seconds}秒`
        } else if (minutes > 0) {
          duration = `${minutes}分${seconds}秒`
        } else {
          duration = `${seconds}秒`
        }
      }
      
      // 撤离状态
      const escapeReasons = {
        '1': '撤离成功',
        '2': '被玩家击杀',
        '3': '被人机击杀',
        '10': '撤离失败'
      }
      const escapeStatus = escapeReasons[String(record.EscapeFailReason)] || '撤离失败'
      
      // 确定状态样式类
      let statusClass = 'fail'
      if (record.EscapeFailReason === 1 || record.EscapeFailReason === '1') statusClass = 'success'
      else if (record.EscapeFailReason === 3 || record.EscapeFailReason === '3') statusClass = 'exit'

      // 击杀数据
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
      // 全面战场战绩
      const gameTimeS = Number(record.gametime || 0)
      const hours = Math.floor(gameTimeS / 3600)
      const minutes = Math.floor((gameTimeS % 3600) / 60)
      const seconds = gameTimeS % 60
      let duration = '未知'
      if (gameTimeS > 0) {
        if (hours > 0) {
          duration = `${hours}小时${minutes}分${seconds}秒`
        } else if (minutes > 0) {
          duration = `${minutes}分${seconds}秒`
        } else {
          duration = `${seconds}秒`
        }
      }
      
      // 对局结果
      const mpResults = {
        '1': '胜利',
        '2': '失败',
        '3': '中途退出'
      }
      const result = mpResults[String(record.MatchResult)] || '未知结果'
      
      // 确定状态样式类
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
      logger.info(`[战绩订阅] 开始渲染图片: ${platformID} | 模式: ${modeText}`)
      const base64Data = await Render.render('Template/recordPush/recordPush', templateData, {
        e: fakeE,
        scale: 1.2,
        retType: 'base64'
      })
      logger.info(`[战绩订阅] 图片渲染完成: ${platformID} | 模式: ${modeText}，结果: ${base64Data ? '成功' : '空值'}`)
      
      if (base64Data) {
        return base64Data
      } else {
        // 如果渲染失败，返回文本消息作为降级
        logger.warn(`[战绩订阅] 图片渲染返回空值，使用文本消息降级: ${platformID} | 模式: ${modeText}`)
        return this.formatRecordMessageText(recordType, record, frameworkToken, displayName, mapName, operatorName)
      }
    } catch (error) {
      logger.error(`[战绩订阅] 图片渲染异常: ${platformID} | 模式: ${modeText}`, error)
      // 如果渲染异常，返回文本消息作为降级
      return this.formatRecordMessageText(recordType, record, frameworkToken, displayName, mapName, operatorName)
    }
  }

  /**
   * 格式化战绩消息（文本格式，作为降级方案）
   */
  formatRecordMessageText(recordType, record, frameworkToken, displayName, mapName, operatorName) {
    const modeText = recordType === 'sol' ? '烽火地带' : '全面战场'
    let msg = `${displayName}-战绩订阅-${modeText}\n`

    if (recordType === 'sol') {
      const finalPrice = Number(record.FinalPrice || 0).toLocaleString()
      const income = (record.flowCalGainedPrice != null && record.flowCalGainedPrice !== '') 
        ? Number(record.flowCalGainedPrice).toLocaleString() 
        : '未知'
      
      const durationS = Number(record.DurationS || 0)
      let duration = '未知'
      if (durationS > 0) {
        const hours = Math.floor(durationS / 3600)
        const minutes = Math.floor((durationS % 3600) / 60)
        const seconds = durationS % 60
        if (hours > 0) {
          duration = `${hours}小时${minutes}分${seconds}秒`
        } else if (minutes > 0) {
          duration = `${minutes}分${seconds}秒`
        } else {
          duration = `${seconds}秒`
        }
      }
      
      const escapeReasons = {
        '1': '撤离成功',
        '2': '被玩家击杀',
        '3': '被人机击杀',
        '10': '撤离失败'
      }
      const escapeStatus = escapeReasons[String(record.EscapeFailReason)] || '撤离失败'

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
      const gameTimeS = Number(record.gametime || 0)
      const hours = Math.floor(gameTimeS / 3600)
      const minutes = Math.floor((gameTimeS % 3600) / 60)
      const seconds = gameTimeS % 60
      let duration = '未知'
      if (gameTimeS > 0) {
        if (hours > 0) {
          duration = `${hours}小时${minutes}分${seconds}秒`
        } else if (minutes > 0) {
          duration = `${minutes}分${seconds}秒`
        } else {
          duration = `${seconds}秒`
        }
      }
      
      const mpResults = {
        '1': '胜利',
        '2': '失败',
        '3': '中途退出'
      }
      const result = mpResults[String(record.MatchResult)] || '未知结果'

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
