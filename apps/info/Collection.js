import utils from '../../utils/utils.js'
import Code from '../../components/Code.js'
import Render from '../../components/Render.js'

export class Collection extends plugin {
  constructor(e) {
    super({
      name: '三角洲藏品查询',
      dsc: '查询个人仓库中的皮肤、饰品等非货币资产',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)(藏品|资产)(?:\\s+(.*))?$',
          fnc: 'getCollection'
        }
      ]
    })
    this.api = new Code(e)
  }

  async getCollection(e) {
    const token = await utils.getAccount(e.user_id)
    if (!token) {
      return e.reply('您尚未绑定账号，请使用 #三角洲登录 进行绑定。')
    }

    const match = e.msg.match(/^(#三角洲|\^)(藏品|资产)(?:\s+(.*))?$/)
    const typeFilter = match && match[3] ? match[3].trim() : null

    const supportedTypes = ['干员皮肤', '喷漆', '挂饰', '典藏枪皮', '枪皮', '载具', '头像', '军牌']

    // 如果没有参数，查询所有类型；如果有参数，查询指定类型
    const actualTypeFilter = typeFilter && typeFilter !== '' ? typeFilter : null

    await e.reply('正在查询您的藏品信息，请稍候...');

    const [collectionRes, collectionMapRes] = await Promise.all([
      this.api.getCollection(token),
      this.api.getCollectionMap()
    ]);

    if (await utils.handleApiError(collectionRes, e)) return true;

    if (!collectionMapRes || collectionMapRes.success === false) {
      logger.warn(`[Collection] 获取藏品对照表失败: ${collectionMapRes?.message || '服务无响应'}`);
      return e.reply(`获取藏品基础信息失败，无法展示您的资产。`);
    }

    const userItems = collectionRes.data?.userData || []
    const weaponItems = collectionRes.data?.weponData || []
    const allUserItems = [...userItems, ...weaponItems]

    const collectionMap = new Map(collectionMapRes.data.map(item => [String(item.id), item]))

    if (allUserItems.length === 0) {
      return e.reply('您的藏品库为空。')
    }

    const categorizedItems = {}
    const qualityConfig = {
      '传说': { level: 5, color: '橙' },
      '史诗': { level: 4, color: '紫' },
      '稀有': { level: 3, color: '蓝' },
      '普通': { level: 2, color: '绿' },
      '其他': { level: 1, color: null }
    }
    const qualityOrder = Object.keys(qualityConfig)
    const colorToQuality = Object.fromEntries(
      Object.entries(qualityConfig)
        .filter(([_, config]) => config.color)
        .map(([quality, config]) => [config.color, quality])
    )

    const availableTypes = new Set()

    allUserItems.forEach(item => {
      const itemInfo = collectionMap.get(item.ItemId)
      if (itemInfo) {
        const primaryCategory = itemInfo.type || '其他资产'
        availableTypes.add(primaryCategory)
        
        if (actualTypeFilter && !primaryCategory.includes(actualTypeFilter) && !actualTypeFilter.includes(primaryCategory)) {
          return
        }

        const quality = colorToQuality[itemInfo.rare] || '其他'

        if (!categorizedItems[primaryCategory]) {
          categorizedItems[primaryCategory] = {}
        }
        if (!categorizedItems[primaryCategory][quality]) {
          categorizedItems[primaryCategory][quality] = []
        }
        
        const itemData = {
          name: itemInfo.name,
          id: item.ItemId,
          imageUrl: `https://playerhub.df.qq.com/playerhub/60004/object/${item.ItemId}.png`,
          displayName: `${itemInfo.name} (ID: ${item.ItemId})`,
          qualityLevel: qualityConfig[quality]?.level || 1,
          category: primaryCategory
        }
        categorizedItems[primaryCategory][quality].push(itemData)
      }
    })

    if (actualTypeFilter && Object.keys(categorizedItems).length === 0) {
      return e.reply(`未找到类型"${actualTypeFilter}"的藏品。\n\n支持的查询类型：${supportedTypes.join('、')}`)
    }

    // 按类型分组收集藏品
    const categories = []
    const qualityStatsMap = {}
    let totalCount = 0

    for (const category in categorizedItems) {
      const categoryItems = categorizedItems[category]
      const categoryItemsList = []
      let categoryCount = 0
      
      qualityOrder.forEach(quality => {
        if (categoryItems[quality] && categoryItems[quality].length > 0) {
          const qualityItems = categoryItems[quality]
          categoryCount += qualityItems.length
          totalCount += qualityItems.length
          
          if (!qualityStatsMap[quality]) {
            qualityStatsMap[quality] = 0
          }
          qualityStatsMap[quality] += qualityItems.length
          
          categoryItemsList.push(...qualityItems)
        }
      })

      if (categoryCount > 0) {
        categories.push({
          name: category,
          items: categoryItemsList,
          count: categoryCount
        })
      }
    }

    if (categories.length === 0) {
      return e.reply('未能解析到您的任何藏品信息。')
    }

    // 生成品质统计数组
    const qualityStats = qualityOrder
      .filter(quality => qualityStatsMap[quality] && qualityStatsMap[quality] > 0)
      .map(quality => ({
        level: qualityConfig[quality]?.level || 1,
        count: qualityStatsMap[quality]
      }))

    const typeName = actualTypeFilter || '所有藏品'
    
    // 类型背景图片映射
    const categoryBgMap = {
      '干员皮肤': 'operator-skin', // 特殊标记，使用物品图片作为背景
      '喷漆': 'property-gx-li3.webp',
      '挂饰': 'property-gx-li2.webp',
      '典藏枪皮': 'property-jz-bg.webp',
      '枪皮': 'property-jz-bg.webp',
      '载具': 'property-qx-bg2.webp',
      '头像': 'property-gx-li3.webp',
      '军牌': 'property-jz-bg.webp',
      '其他资产': 'property-gx-li3.webp'
    }
    
    // 为每个分类添加背景图片
    categories.forEach(category => {
      category.bgImage = categoryBgMap[category.name] || 'property-gx-li3.webp'
    })
    
    const templateData = {
      typeName: typeName,
      totalCount: totalCount,
      qualityStats: qualityStats,
      categories: categories
    }
    
    try {
      const imageResult = await Render.render('Template/collection/collection', templateData, {
        e: e,
        retType: 'default',
        saveId: `${e.user_id}_collection_${typeName}`
      })
      
      return imageResult
    } catch (error) {
      logger.error(`[Collection] 渲染模板失败: ${error.message}`)
      return e.reply(`渲染 ${typeName} 藏品图片失败，请稍后重试`)
    }
  }
} 