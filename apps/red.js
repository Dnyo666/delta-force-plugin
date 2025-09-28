import Code from '../components/Code.js'
import utils from '../utils/utils.js'
import DataManager from '../utils/Data.js'

export class Red extends plugin {
  constructor(e) {
    super({
      name: '三角洲藏品记录',
      dsc: '查询三角洲行动藏品解锁记录',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)(出红记录|大红记录|藏品记录)$',
          fnc: 'getRedList'
        },
        {
          reg: '^(#三角洲|\\^)(出红记录|大红记录|藏品记录)\\s+(.+)$',
          fnc: 'getRedByName'
        }
      ]
    })
    this.api = new Code(e)
  }

  async getRedList(e) {
    const token = await utils.getAccount(e.user_id)
    if (!token) {
      return e.reply([segment.at(e.user_id), '您尚未绑定账号，请使用 #三角洲登录 进行绑定。'])
    }

    await e.reply('正在获取您的藏品解锁记录，请稍候...')

    try {
      const res = await this.api.getRedList(token)

      if (await utils.handleApiError(res, e)) return

      if (!res || !res.success || !res.data || !res.data.records) {
        return e.reply('获取藏品记录失败：数据格式错误')
      }

      const records = res.data.records
      if (!records.list || records.list.length === 0) {
        return e.reply('您还没有任何藏品解锁记录')
      }

      // 获取物品名称映射
      const itemMap = await this.getItemNameMap(records.list.map(item => item.itemId))

      const userInfo = { user_id: e.user_id, nickname: e.sender.nickname }
      const forwardMsg = []

      forwardMsg.push({
        ...userInfo,
        message: `【藏品解锁记录】\n总计：${records.total}条记录\n查询时间：${res.data.currentTime}` 
      })

      // 按时间倒序排列（最新的在前）
      const sortedList = records.list.sort((a, b) => new Date(b.time) - new Date(a.time))

      sortedList.forEach((record, index) => {
        // 确保使用字符串类型的ID进行查找
        const itemName = itemMap.get(String(record.itemId)) || `未知物品(${record.itemId})`
        const mapInfo = DataManager.getMapName(record.mapid)
        
        let msg = `${index + 1}. ${itemName}\n`
        msg += `时间：${record.time}\n`
        msg += `地图：${mapInfo}\n`
        msg += `数量：${record.num}\n`
        if (record.des) {
          msg += `描述：${record.des}`
        }

        forwardMsg.push({ ...userInfo, message: msg })
      })

      await e.reply(await Bot.makeForwardMsg(forwardMsg))

    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 藏品记录查询失败:', error)
      await e.reply('藏品记录查询失败，请稍后重试')
    }
    return
  }

  async getRedByName(e) {
    const token = await utils.getAccount(e.user_id)
    if (!token) {
      return e.reply([segment.at(e.user_id), '您尚未绑定账号，请使用 #三角洲登录 进行绑定。'])
    }

    const match = e.msg.match(/^(#三角洲|\^)(大红记录|藏品记录)\s+(.+)$/)
    const itemName = match[3].trim()

    await e.reply(`正在搜索物品"${itemName}"的藏品记录...`)

    try {
      // 1. 先搜索物品获取objectID
      const searchRes = await this.api.searchObject(itemName, '')
      
      if (await utils.handleApiError(searchRes, e)) return true

      const items = searchRes?.data?.keywords
      if (!Array.isArray(items) || items.length === 0) {
        return e.reply(`未找到名为"${itemName}"的物品，请检查名称是否正确`)
      }

      // 如果搜索到多个结果，使用第一个
      const targetItem = items[0]
      const objectId = targetItem.objectID

      if (!objectId) {
        return e.reply('获取物品ID失败，无法查询记录')
      }

      // 2. 根据objectID获取具体记录
      const recordRes = await this.api.getRedRecord(token, objectId)
      
      if (await utils.handleApiError(recordRes, e)) return true

      if (!recordRes || !recordRes.success || !recordRes.data) {
        return e.reply('获取藏品记录失败：数据格式错误')
      }

      const itemData = recordRes.data.itemData
      if (!itemData || !itemData.list || itemData.list.length === 0) {
        return e.reply(`物品"${targetItem.objectName}"暂无解锁记录`)
      }

      const userInfo = { user_id: e.user_id, nickname: e.sender.nickname }
      const forwardMsg = []

      forwardMsg.push({
        ...userInfo,
        message: `【${targetItem.objectName} 解锁记录】\n物品ID：${objectId}\n总计：${itemData.total}条记录\n${itemData.des ? `描述：${itemData.des}\n` : ''}查询时间：${recordRes.data.currentTime}` 
      })

      // 按时间倒序排列
      const sortedRecords = itemData.list.sort((a, b) => new Date(b.time) - new Date(a.time))

      sortedRecords.forEach((record, index) => {
        const mapInfo = DataManager.getMapName(record.mapid)

        let msg = `第${index + 1}次解锁\n`
        msg += `时间：${record.time}\n`
        msg += `地图：${mapInfo}\n`
        msg += `数量：${record.num}`
        
        forwardMsg.push({ ...userInfo, message: msg })
      })

      await e.reply(await Bot.makeForwardMsg(forwardMsg))
      
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 指定藏品记录查询失败:', error)
      await e.reply('查询失败，请稍后重试')
    }
    
    return
  }

  /**
   * 获取物品名称映射
   * @param {Array} itemIds - 物品ID数组
   * @returns {Map} - ID到名称的映射
   */
  async getItemNameMap(itemIds) {
    const itemMap = new Map()
    
    // 去重处理并转为字符串
    const uniqueIds = [...new Set(itemIds)].map(id => String(id))
    
    logger.info(`[DELTA FORCE PLUGIN] 开始查询物品名称，共${uniqueIds.length}个ID: ${uniqueIds.join(',')}`)
    
    // 先尝试批量查询
    try {
      const batchRes = await this.api.searchObject('', uniqueIds.join(','))
      logger.info(`[DELTA FORCE PLUGIN] 批量查询结果: ${JSON.stringify(batchRes?.data?.keywords?.length || 0)}条记录`)
      
      if (batchRes?.success && batchRes?.data?.keywords) {
        batchRes.data.keywords.forEach(item => {
          // 确保使用字符串类型的ID作为key
          itemMap.set(String(item.objectID), item.objectName)
          logger.info(`[DELTA FORCE PLUGIN] 批量查询成功: ${item.objectID} -> ${item.objectName}`)
        })
      }
    } catch (error) {
      logger.error(`[DELTA FORCE PLUGIN] 批量查询失败: ${error.message}`)
    }
    
    // 检查还有哪些ID没有找到，进行单个查询
    const missingIds = uniqueIds.filter(id => !itemMap.has(id))
    if (missingIds.length > 0) {
      logger.info(`[DELTA FORCE PLUGIN] 还有${missingIds.length}个ID需要单独查询: ${missingIds.join(',')}`)
      
      for (const id of missingIds) {
        try {
          const singleRes = await this.api.searchObject('', id)
          logger.info(`[DELTA FORCE PLUGIN] 单个查询ID ${id} 结果: ${JSON.stringify(singleRes?.data?.keywords?.length || 0)}条记录`)
          
          if (singleRes?.success && singleRes?.data?.keywords?.length > 0) {
            const item = singleRes.data.keywords[0]
            itemMap.set(String(item.objectID), item.objectName)
            logger.info(`[DELTA FORCE PLUGIN] 单个查询成功: ${item.objectID} -> ${item.objectName}`)
          } else {
            logger.warn(`[DELTA FORCE PLUGIN] 单个查询ID ${id} 未找到结果`)
          }
          
          // 单个查询间隔
          await new Promise(resolve => setTimeout(resolve, 300))
        } catch (singleError) {
          logger.error(`[DELTA FORCE PLUGIN] 单个ID查询失败 ${id}: ${singleError.message}`)
        }
      }
    }
    
    logger.info(`[DELTA FORCE PLUGIN] 物品名称查询完成，成功获取${itemMap.size}/${uniqueIds.length}个物品名称`)
    return itemMap
  }
}