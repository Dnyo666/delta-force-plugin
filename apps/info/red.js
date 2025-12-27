import Code from '../../components/Code.js'
import Render from '../../components/Render.js'
import utils from '../../utils/utils.js'
import DataManager from '../../utils/Data.js'
import fs from 'fs'

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

  // URL解码函数
  decode(str) {
    try {
      return decodeURIComponent(str || '')
    } catch (e) {
      return str || ''
    }
  }

  async getRedList(e) {
    const token = await utils.getAccount(e.user_id)
    if (!token) {
      return e.reply([segment.at(e.user_id), '您尚未绑定账号，请使用 #三角洲登录 进行绑定。'])
    }

    await e.reply('正在获取您的藏品解锁记录，请稍候...')

    try {
      // 并行获取出红记录和用户信息
      const [res, personalInfoRes] = await Promise.all([
        this.api.getRedList(token),
        this.api.getPersonalInfo(token)
      ])

      if (await utils.handleApiError(res, e)) return

      if (!res || !res.success || !res.data || !res.data.records) {
        return e.reply('获取藏品记录失败：数据格式错误')
      }

      const records = res.data.records
      if (!records.list || records.list.length === 0) {
        return e.reply('您还没有任何藏品解锁记录')
      }

      // 解析用户信息
      let userName = '未知'
      let userAvatar = ''
      let userRank = '未知段位'

      if (personalInfoRes && personalInfoRes.data && personalInfoRes.roleInfo) {
        const { userData, careerData } = personalInfoRes.data
        const { roleInfo } = personalInfoRes

        userName = this.decode(userData?.charac_name || roleInfo?.charac_name) || '未知'

        userAvatar = this.decode(userData?.picurl || roleInfo?.picurl)
        if (userAvatar && /^[0-9]+$/.test(userAvatar)) {
          userAvatar = `https://wegame.gtimg.com/g.2001918-r.ea725/helper/df/skin/${userAvatar}.webp`
        }

        if (careerData?.rankpoint) {
          const fullRank = DataManager.getRankByScore(careerData.rankpoint, 'sol')
          userRank = fullRank.replace(/\s*\(\d+\)/, '')
        }
      }

      // 获取物品名称和价格映射
      const itemIds = records.list.map(item => item.itemId)
      const itemMap = await this.getItemNameMap(itemIds)
      const priceMap = await this.getItemPriceMap(itemIds)

      // 统计数据
      const itemStats = new Map() // objectID -> { count, totalValue, name, imageUrl }

      records.list.forEach(record => {
        const itemId = String(record.itemId)
        const itemName = itemMap.get(itemId) || `未知物品(${itemId})`
        const itemPrice = priceMap.get(itemId) || 0
        const num = record.num || 1

        if (itemStats.has(itemId)) {
          const stat = itemStats.get(itemId)
          stat.count += num
          stat.totalValue += itemPrice * num
        } else {
          itemStats.set(itemId, {
            name: itemName,
            count: num,
            totalValue: itemPrice * num,
            imageUrl: `https://playerhub.df.qq.com/playerhub/60004/object/${itemId}.png`
          })
        }
      })

      // 计算总计
      const redGodCount = itemStats.size // 收藏种类数
      let redTotalCount = 0
      let redTotalValue = 0

      itemStats.forEach(stat => {
        redTotalCount += stat.count
        redTotalValue += stat.totalValue
      })

      // 按价值排序，取前6个
      const sortedCollections = Array.from(itemStats.values())
        .sort((a, b) => b.totalValue - a.totalValue)
        .slice(0, 6)
        .map(item => ({
          name: item.name,
          count: item.count,
          value: item.totalValue.toLocaleString(),
          imageUrl: item.imageUrl
        }))

      // 获取未解锁藏品
      let unlockedCollections = []
      let unlockedCount = 0
      try {
        const allCollectionsRes = await this.api.getObjectList('props', 'collection')
        if (allCollectionsRes && allCollectionsRes.data && allCollectionsRes.data.keywords) {
          // 筛选出grade=6的物品（大红藏品）
          const allRedCollections = allCollectionsRes.data.keywords.filter(item => item.grade === 6)

          // 获取已收藏的物品ID集合
          const collectedIds = new Set(itemIds.map(id => String(id)))

          // 找出未收藏的物品
          const uncollectedItems = allRedCollections.filter(item => !collectedIds.has(String(item.objectID)))

          unlockedCount = uncollectedItems.length

          // 随机选择3个未收藏的物品展示
          if (uncollectedItems.length > 0) {
            const shuffled = uncollectedItems.sort(() => 0.5 - Math.random())
            unlockedCollections = shuffled.slice(0, 3).map(item => ({
              name: item.objectName,
              objectID: item.objectID,
              price: (item.avgPrice || 0).toLocaleString(),
              imageUrl: `https://playerhub.df.qq.com/playerhub/60004/object/${item.objectID}.png`
            }))
          }
        }
      } catch (error) {
        // 获取未解锁藏品失败不影响主要功能，静默处理
      }

      // 构建渲染数据
      const renderData = {
        userName: userName,
        userRank: userRank,
        userAvatar: userAvatar,
        title: '出红记录',
        subtitle: `共${records.total}次获得大红藏品`,
        unlockDesc: `查询时间：${res.data.currentTime}`,
        seasonDisplay: '所有记录',
        statistics: {
          redGodCount: redGodCount.toString(),
          redTotalCount: redTotalCount.toString(),
          redTotalValue: redTotalValue.toLocaleString(),
          unlockedCount: unlockedCount > 0 ? unlockedCount.toString() : ''
        },
        topCollections: sortedCollections,
        unlockedCollections: unlockedCollections
      }

      try {
        return await Render.render('Template/redCollection/redCollection.html', renderData, {
          e,
          scale: 1.0,
          renderCfg: {
            viewPort: {
              width: 1125,
              height: 2436
            }
          }
        })
      } catch (renderError) {
        logger.error('[DELTA FORCE PLUGIN] 出红记录渲染失败:', renderError)
        await e.reply(`图片渲染失败: ${renderError.message}`)
        return true
      }

    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 藏品记录查询失败:', error)
      await e.reply('藏品记录查询失败，请稍后重试')
    }
    return
  }

  /**
   * 获取物品价格映射
   * @param {Array} itemIds - 物品ID数组
   * @returns {Map} - ID到价格的映射
   */
  async getItemPriceMap(itemIds) {
    const priceMap = new Map()
    const uniqueIds = [...new Set(itemIds)].map(id => String(id))

    try {
      const batchRes = await this.api.searchObject('', uniqueIds.join(','))
      if (batchRes?.success && batchRes?.data?.keywords) {
        batchRes.data.keywords.forEach(item => {
          priceMap.set(String(item.objectID), item.avgPrice || 0)
        })
      }
    } catch (error) {
      // 获取物品价格失败不影响主要功能，静默处理
    }

    return priceMap
  }

  async getRedByName(e) {
    const token = await utils.getAccount(e.user_id)
    if (!token) {
      return e.reply([segment.at(e.user_id), '您尚未绑定账号，请使用 #三角洲登录 进行绑定。'])
    }

    const match = e.msg.match(/^(#三角洲|\^)(出红记录|大红记录|藏品记录)\s+(.+)$/)
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

      // 2. 并行获取记录和用户信息
      const [recordRes, personalInfoRes] = await Promise.all([
        this.api.getRedRecord(token, objectId),
        this.api.getPersonalInfo(token)
      ])

      if (await utils.handleApiError(recordRes, e)) return true

      if (!recordRes || !recordRes.success || !recordRes.data) {
        return e.reply('获取藏品记录失败：数据格式错误')
      }

      const itemData = recordRes.data.itemData
      if (!itemData || !itemData.list || itemData.list.length === 0) {
        return e.reply(`物品"${targetItem.objectName}"暂无解锁记录`)
      }

      // 解析用户信息
      let userName = '未知'
      let userAvatar = ''
      let userRank = '未知段位'

      if (personalInfoRes && personalInfoRes.data && personalInfoRes.roleInfo) {
        const { userData, careerData } = personalInfoRes.data
        const { roleInfo } = personalInfoRes

        userName = this.decode(userData?.charac_name || roleInfo?.charac_name) || '未知'

        userAvatar = this.decode(userData?.picurl || roleInfo?.picurl)
        if (userAvatar && /^[0-9]+$/.test(userAvatar)) {
          userAvatar = `https://wegame.gtimg.com/g.2001918-r.ea725/helper/df/skin/${userAvatar}.webp`
        }

        if (careerData?.rankpoint) {
          const fullRank = DataManager.getRankByScore(careerData.rankpoint, 'sol')
          userRank = fullRank.replace(/\s*\(\d+\)/, '')
        }
      }

      // 构建地图背景图路径的辅助函数（藏品只在烽火地带，使用新的统一路径，支持降级匹配）
      const getMapBgPath = (mapName) => {
        const modePrefix = '烽火';
        const baseDir = `${process.cwd()}/plugins/delta-force-plugin/resources/imgs/map`.replace(/\\/g, '/');
        
        // 处理地图名称：尝试精确匹配和降级匹配
        const parts = mapName.split('-');
        let finalPath = null;
        
        if (parts.length >= 2) {
          // 有难度级别的情况：尝试精确匹配，如果不存在则降级到常规
          const baseMapName = parts[0];
          const difficulty = parts.slice(1).join('-');
          
          // 优先级1: 精确匹配
          const exactPath = `${baseDir}/${modePrefix}-${baseMapName}-${difficulty}.png`;
          if (fs.existsSync(exactPath)) {
            finalPath = `imgs/map/${modePrefix}-${baseMapName}-${difficulty}.png`;
          } else {
            // 优先级2: 降级到常规版本
            const regularPath = `${baseDir}/${modePrefix}-${baseMapName}-常规.png`;
            if (fs.existsSync(regularPath)) {
              finalPath = `imgs/map/${modePrefix}-${baseMapName}-常规.png`;
            } else {
              // 如果都不存在，返回精确匹配路径（让浏览器处理错误）
              finalPath = `imgs/map/${modePrefix}-${baseMapName}-${difficulty}.png`;
            }
          }
        } else {
          // 只有基础地图名称的情况
          const cleanMapName = parts[0];
          const jpgPath = `${baseDir}/${modePrefix}-${cleanMapName}.jpg`;
          const pngPath = `${baseDir}/${modePrefix}-${cleanMapName}.png`;
          
          if (fs.existsSync(jpgPath)) {
            finalPath = `imgs/map/${modePrefix}-${cleanMapName}.jpg`;
          } else if (fs.existsSync(pngPath)) {
            finalPath = `imgs/map/${modePrefix}-${cleanMapName}.png`;
          } else {
            finalPath = `imgs/map/${modePrefix}-${cleanMapName}.jpg`;
          }
        }
        
        return finalPath;
      }

      // 按时间正序排列（最早的在前）
      const sortedRecords = itemData.list.sort((a, b) => new Date(a.time) - new Date(b.time))

      // 获取首次解锁记录
      const firstRecord = sortedRecords[0]
      const firstUnlockMapName = DataManager.getMapName(firstRecord.mapid)
      const firstUnlockMapBg = getMapBgPath(firstUnlockMapName)

      // 取最新20条记录（按时间倒序，最新的在前）
      const latestRecords = sortedRecords.slice(-20).reverse()

      // 构建记录列表数据
      const records = latestRecords.map(record => {
        const mapName = DataManager.getMapName(record.mapid)
        return {
          time: record.time,
          map: mapName,
          count: record.num || 1
        }
      })

      // 物品图片URL
      const itemImageUrl = `https://playerhub.df.qq.com/playerhub/60004/object/${objectId}.png`

      // 构建渲染数据（新模板使用流式布局，无需计算高度）
      const renderData = {
        userName: userName,
        userRank: userRank,
        userAvatar: userAvatar,
        itemName: targetItem.objectName,
        itemType: targetItem.objectType || (targetItem.grade ? `GRADE ${targetItem.grade}` : ''),
        itemImageUrl: itemImageUrl,
        firstUnlockTime: firstRecord.time,
        firstUnlockMap: firstUnlockMapName,
        firstUnlockMapBg: firstUnlockMapBg,
        records: records,
        recordCount: recordRes.data.itemData.total || records.length
      }

      try {
        // 视口宽度略大于容器宽度（避免边框被裁切）
        const viewWidth = 600
        // 动态高度：根据记录条数估算，避免固定 2000 过长
        const listLen = records?.length || 0
        const noteExtra = (recordRes.data.itemData.total || listLen) > 20 ? 40 : 0
        const viewHeight = Math.min(2000, Math.max(820, 720 + listLen * 58 + noteExtra))

        return await Render.render('Template/redRecord/redRecord.html', renderData, {
          e,
          scale: 1.0,
          renderCfg: {
            viewPort: {
              width: viewWidth,
              height: viewHeight
            }
          }
        })
      } catch (renderError) {
        logger.error('[DELTA FORCE PLUGIN] 物品记录渲染失败:', renderError)
        await e.reply(`图片渲染失败: ${renderError.message}`)
        return true
      }

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

    // 先尝试批量查询
    try {
      const batchRes = await this.api.searchObject('', uniqueIds.join(','))
      if (batchRes?.success && batchRes?.data?.keywords) {
        batchRes.data.keywords.forEach(item => {
          // 确保使用字符串类型的ID作为key
          itemMap.set(String(item.objectID), item.objectName)
        })
      }
    } catch (error) {
      logger.error(`[DELTA FORCE PLUGIN] 批量查询物品名称失败: ${error.message}`)
    }

    // 检查还有哪些ID没有找到，进行单个查询
    const missingIds = uniqueIds.filter(id => !itemMap.has(id))
    if (missingIds.length > 0) {
      for (const id of missingIds) {
        try {
          const singleRes = await this.api.searchObject('', id)
          if (singleRes?.success && singleRes?.data?.keywords?.length > 0) {
            const item = singleRes.data.keywords[0]
            itemMap.set(String(item.objectID), item.objectName)
          }

          // 单个查询间隔
          await new Promise(resolve => setTimeout(resolve, 300))
        } catch (singleError) {
          logger.error(`[DELTA FORCE PLUGIN] 单个ID查询失败 ${id}: ${singleError.message}`)
        }
      }
    }
    return itemMap
  }
}