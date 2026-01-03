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
          reg: '^(#三角洲|\\^)(出红记录|大红记录|藏品记录|大红收藏|大红藏品|大红海报|藏品海报)(?:\\s+(\\d+))?$',
          fnc: 'getRedCollection'
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

  /**
   * 解析用户信息（公共方法）
   * @param {Object} personalInfoRes - 个人信息API响应
   * @returns {Object} { userName, userAvatar, userRank, userRankImage }
   */
  parseUserInfo(personalInfoRes) {
    let userName = '未知'
    let userAvatar = ''
    let userRank = '未知段位'
    let userRankImage = null

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
        // 获取段位图标路径（只使用 sol 模式，因为烽火是 sol）
        userRankImage = DataManager.getRankImagePath(userRank, 'sol')
      }
    }

    return { userName, userAvatar, userRank, userRankImage }
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
      const { userName, userAvatar, userRank, userRankImage } = this.parseUserInfo(personalInfoRes)

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
      const qqAvatarUrl = `http://q.qlogo.cn/headimg_dl?dst_uin=${e.user_id}&spec=640&img_type=jpg`
      const renderData = {
        userName: userName,
        userRank: userRank,
        userRankImage: userRankImage,
        userAvatar: userAvatar,
        userId: e.user_id,
        qqAvatarUrl: qqAvatarUrl,
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
        const viewWidth = 650
        const viewHeight = 5000

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

  /**
   * 获取大红收藏数据（统一方法，支持出红记录和收藏品详情两种数据源）
   */
  async getRedCollection(e) {
    try {
      // 解析命令参数，判断使用哪个数据源
      const match = e.msg.match(/^(#三角洲|\^)(出红记录|大红记录|藏品记录|大红收藏|大红藏品|大红海报|藏品海报)(?:\s+(\d+))?$/)
      if (!match) return false

      const commandType = match[2]
      const seasonParam = match[3]

      // 判断数据源类型
      const useRecordSource = ['出红记录', '大红记录', '藏品记录'].includes(commandType)
      const useCollectionSource = ['大红收藏', '大红藏品', '大红海报', '藏品海报'].includes(commandType)

      if (!useRecordSource && !useCollectionSource) return false

      // 解析赛季参数（仅收藏品详情支持）
      let seasonId = 'all'
      let seasonDisplay = useRecordSource ? '所有记录' : '所有赛季'

      if (useCollectionSource && seasonParam) {
        seasonId = seasonParam
        seasonDisplay = `S${seasonId}赛季`
      }

      const token = await utils.getAccount(e.user_id)
      if (!token) {
        await e.reply([segment.at(e.user_id), '您尚未绑定账号，请使用 #三角洲登录 进行绑定。'])
        return true
      }

      await e.reply(useRecordSource ? '正在获取您的藏品解锁记录，请稍候...' : '正在获取大红收藏数据，请稍候...')

      // 解析用户信息
      const personalInfoRes = await this.api.getPersonalInfo(token)
      if (await utils.handleApiError(personalInfoRes, e)) return true

      if (!personalInfoRes.data || !personalInfoRes.roleInfo) {
        await e.reply('获取个人信息失败：API返回数据格式异常')
        return true
      }

      const { userName, userAvatar, userRank, userRankImage } = this.parseUserInfo(personalInfoRes)

      let renderData = {}

      // 根据数据源类型处理数据
      if (useRecordSource) {
        // 使用出红记录数据源
        const [res] = await Promise.all([
          this.api.getRedList(token)
        ])

        if (await utils.handleApiError(res, e)) return true

        if (!res || !res.success || !res.data || !res.data.records) {
          return e.reply('获取藏品记录失败：数据格式错误')
        }

        const records = res.data.records
        if (!records.list || records.list.length === 0) {
          return e.reply('您还没有任何藏品解锁记录')
        }

        // 获取物品名称和价格映射
        const itemIds = records.list.map(item => item.itemId)
        const itemMap = await this.getItemNameMap(itemIds)
        const priceMap = await this.getItemPriceMap(itemIds)

        // 统计数据
        const itemStats = new Map()

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
        const redGodCount = itemStats.size
        let redTotalCount = 0
        let redTotalValue = 0

        itemStats.forEach(stat => {
          redTotalCount += stat.count
          redTotalValue += stat.totalValue
        })

        // 按价值排序，生成记录列表（仅展示前6条）
        const allSortedRecords = Array.from(itemStats.values())
          .sort((a, b) => b.totalValue - a.totalValue)
          .map(item => ({
            name: item.name,
            count: item.count,
            value: item.totalValue.toLocaleString(),
            imageUrl: item.imageUrl
          }))
        
        // 只取前6条记录
        const sortedRecords = allSortedRecords.slice(0, 6)

        // 获取未解锁藏品数量
        let unlockedCount = 0
        try {
          const allCollectionsRes = await this.api.getObjectList('props', 'collection')
          if (allCollectionsRes && allCollectionsRes.data && allCollectionsRes.data.keywords) {
            const allRedCollections = allCollectionsRes.data.keywords.filter(item => item.grade === 6)
            const collectedIds = new Set(itemIds.map(id => String(id)))
            const uncollectedItems = allRedCollections.filter(item => !collectedIds.has(String(item.objectID)))
            unlockedCount = uncollectedItems.length
          }
        } catch (error) {
          // 静默处理
        }

        const qqAvatarUrl = `http://q.qlogo.cn/headimg_dl?dst_uin=${e.user_id}&spec=640&img_type=jpg`
        renderData = {
          userName,
          userRank,
          userRankImage,
          userAvatar,
          userId: e.user_id,
          qqAvatarUrl: qqAvatarUrl,
          statistics: {
            redGodCount: redGodCount.toString(),
            redTotalCount: redTotalCount.toString(),
            redTotalValue: redTotalValue.toLocaleString(),
            unlockedCount: unlockedCount > 0 ? unlockedCount.toString() : ''
          },
          records: sortedRecords,
          totalRecords: allSortedRecords.length // 总记录数
        }
      } else {
        // 使用收藏品详情数据源
        const [personalDataRes, titleRes] = await Promise.all([
          this.api.getPersonalData(token, '', seasonId),
          this.api.getTitle(token)
        ])

        if (await utils.handleApiError(personalDataRes, e)) return true
        if (await utils.handleApiError(titleRes, e)) return true

        if (!personalDataRes.success || !personalDataRes.data) {
          await e.reply('获取个人数据失败：API返回数据格式异常')
          return true
        }

        if (!titleRes.success || !titleRes.data) {
          await e.reply('获取大红称号失败：API返回数据格式异常')
          return true
        }

        // 解析个人数据结构
        let solDetail = null
        const allModesData = personalDataRes.data
        if (allModesData?.sol?.data?.data?.solDetail) {
          solDetail = allModesData.sol.data.data.solDetail
        }

        if (!solDetail) {
          await e.reply('没有找到烽火地带游戏数据，请确保您已经在游戏中进行过烽火地带模式的对局。')
          return true
        }

        // 解析大红称号信息
        const titleData = titleRes.data
        const title = titleData.title || '血色会计'
        const subtitle = titleData.subtitle || '"能把肾上腺素换算成子弹汇率的鬼才"'
        const unlockDesc = titleData.unlockDesc || '总价值突破800万且持有医疗/能源类大红收藏品'

        // 只解析需要的数据
        const redTotalMoney = solDetail.redTotalMoney || 0
        const redTotalCount = solDetail.redTotalCount || 0
        const redCollectionDetail = solDetail.redCollectionDetail || []

        if (redCollectionDetail.length === 0) {
          await e.reply('您还没有任何大红收藏品，快去游戏中获取一些稀有收藏品吧！')
          return true
        }

        // 计算大红种类数量（去重）
        const uniqueObjectIds = new Set(redCollectionDetail.map(item => item.objectID))
        const redGodCount = uniqueObjectIds.size

        // 按价格排序，取前6个最贵的收藏品
        const sortedCollections = redCollectionDetail
          .sort((a, b) => (b.price || 0) - (a.price || 0))
          .slice(0, 6)

        // 获取所有需要查询名称的物品ID
        const objectIds = sortedCollections.map(item => item.objectID)

        // 批量查询物品名称
        let objectNames = {}
        if (objectIds.length > 0) {
          try {
            const searchRes = await this.api.searchObject('', objectIds.join(','))
            if (searchRes && searchRes.data && searchRes.data.keywords) {
              searchRes.data.keywords.forEach(obj => {
                objectNames[obj.objectID] = obj.objectName
              })
            }
          } catch (error) {
            logger.warn('[大红收藏馆] 获取物品名称失败，将使用物品ID显示:', error.message)
          }
        }

        const topCollections = sortedCollections.map((item, index) => ({
          rank: index + 1,
          name: objectNames[item.objectID] || `物品${item.objectID}`,
          count: item.count || 1,
          value: (item.price || 0).toLocaleString(),
          imageUrl: `https://playerhub.df.qq.com/playerhub/60004/object/${item.objectID}.png`
        }))

        // 获取所有藏品列表（grade=6的物品）
        let unlockedCollections = []
        let unlockedCount = 0
        try {
          const allCollectionsRes = await this.api.getObjectList('props', 'collection')
          if (allCollectionsRes && allCollectionsRes.data && allCollectionsRes.data.keywords) {
            const allRedCollections = allCollectionsRes.data.keywords.filter(item => item.grade === 6)
            const collectedIds = new Set(redCollectionDetail.map(item => item.objectID))
            const uncollectedItems = allRedCollections.filter(item => !collectedIds.has(item.objectID))

            unlockedCount = uncollectedItems.length

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
          logger.warn('[大红收藏馆] 获取未解锁藏品失败:', error.message)
          unlockedCount = 74 - redGodCount
        }

        const qqAvatarUrl = `http://q.qlogo.cn/headimg_dl?dst_uin=${e.user_id}&spec=640&img_type=jpg`
        renderData = {
          userName,
          userRank,
          userRankImage,
          userAvatar,
          userId: e.user_id,
          qqAvatarUrl: qqAvatarUrl,
          title,
          subtitle,
          unlockDesc,
          seasonDisplay,
          statistics: {
            redGodCount: redGodCount.toString(),
            redTotalCount: redTotalCount.toString(),
            redTotalValue: redTotalMoney.toLocaleString(),
            unlockedCount: unlockedCount.toString()
          },
          topCollections,
          unlockedCollections
        }
      }

      try {
        // 根据数据源类型选择模板
        const templatePath = useRecordSource 
          ? 'Template/redRecordList/redRecordList.html'
          : 'Template/redCollection/redCollection.html'
        
        // 视口尺寸设置
        let viewPort = {}
        if (useRecordSource) {
          const listLen = renderData.records?.length || 0
          const baseHeight = 300 // 用户头部 + 统计区域
          const recordItemHeight = 82 // 每条记录高度
          const footerHeight = 80 // 页脚
          viewPort = {
            width: 650,
            height: Math.max(500, baseHeight + listLen * recordItemHeight + footerHeight + 200) // 动态高度 + 安全边距
          }
        } else {
          // 大红收藏海报：固定尺寸
          viewPort = {
            width: 1145,  // 略大于容器宽度，避免边框被裁切
            height: 2340  // 略大于容器高度，避免底部被裁切
          }
        }
        
        return await Render.render(templatePath, renderData, {
          e,
          scale: 1.0,
          renderCfg: {
            viewPort
          }
        })
      } catch (renderError) {
        logger.error(useRecordSource ? '[出红记录]' : '[大红收藏馆]', '渲染失败:', renderError)
        await e.reply(`图片渲染失败: ${renderError.message}`)
        return true
      }

    } catch (error) {
      logger.error('[大红收藏馆] 查询失败:', error)
      await e.reply([
        segment.at(e.user_id),
        `\n查询大红收藏失败: ${error.message}\n\n请检查：\n1. 账号是否已登录或过期\n2. 是否已绑定游戏角色\n3. 网络连接是否正常`
      ])
    }
    return true
  }
}