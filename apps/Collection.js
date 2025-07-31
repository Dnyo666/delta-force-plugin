import utils from '../utils/utils.js'
import Code from '../components/Code.js'

export class Collection extends plugin {
  constructor(e) {
    super({
      name: '三角洲藏品查询',
      dsc: '查询个人仓库中的皮肤、饰品等非货币资产',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)(藏品|资产)$',
          fnc: 'getCollection'
        }
      ]
    })
    this.api = new Code(e)
  }

  async getCollection(e) {
    const token = utils.getAccount(e.user_id)
    if (!token) {
      return e.reply('您尚未绑定账号，请使用 #三角洲登录 进行绑定。')
    }

    await e.reply('正在查询您的藏品信息，请稍候...');

    // 恢复并行请求，同时获取用户藏品和藏品信息表
    const [collectionRes, collectionMapRes] = await Promise.all([
      this.api.getCollection(token),
      this.api.getCollectionMap()
    ]);

    // 统一处理用户藏品API的错误
    if (await utils.handleApiError(collectionRes, e)) return true;

    // 单独处理藏品信息表API的错误
    if (!collectionMapRes || collectionMapRes.success === false) {
      logger.mark(`[Collection] 获取藏品对照表失败: ${collectionMapRes?.message || '服务无响应'}`);
      return e.reply(`获取藏品基础信息失败，无法展示您的资产。`);
    }

    // 使用安全的方式获取藏品数据，即使字段不存在或为空也不会报错
    const userItems = collectionRes.data?.userData || []
    const weaponItems = collectionRes.data?.weponData || []
    const allUserItems = [...userItems, ...weaponItems]

    const collectionMap = new Map(collectionMapRes.data.map(item => [String(item.id), item]))

    if (allUserItems.length === 0) {
      return this.e.reply('您的藏品库为空。')
    }

    const categorizedItems = {}
    const qualityMap = { '橙': '传说', '紫': '史诗', '蓝': '稀有', '绿': '普通' }
    const qualityOrder = ['传说', '史诗', '稀有', '普通', '其他']

    allUserItems.forEach(item => {
      const itemInfo = collectionMap.get(item.ItemId)
      if (itemInfo) {
        const primaryCategory = itemInfo.type || '其他资产'
        const quality = qualityMap[itemInfo.rare] || '其他'

        if (!categorizedItems[primaryCategory]) {
          categorizedItems[primaryCategory] = {}
        }
        if (!categorizedItems[primaryCategory][quality]) {
          categorizedItems[primaryCategory][quality] = []
        }
        categorizedItems[primaryCategory][quality].push(itemInfo.name)
      }
    })

    // --- 构造转发消息 ---
    const userInfo = {
      user_id: e.user_id,
      nickname: e.sender.nickname
    };

    let forwardMsg = []

    forwardMsg.push({
      ...userInfo,
      message: '【三角洲行动 - 藏品资产】'
    })
    const totalCount = allUserItems.length
    forwardMsg.push({
      ...userInfo,
      message: `【您的藏品资产总览 (共 ${totalCount} 件)】`
    })

    for (const category in categorizedItems) {
      const categoryItems = categorizedItems[category]
      let categoryCount = 0
      let msg = ''

      qualityOrder.forEach(quality => {
        if (categoryItems[quality]) {
          categoryCount += categoryItems[quality].length
        }
      })

      if (categoryCount > 0) {
        msg += `--- ${category} (${categoryCount}件) ---\n`
        qualityOrder.forEach(quality => {
          if (categoryItems[quality] && categoryItems[quality].length > 0) {
            msg += `\n【${quality}】\n`
            msg += categoryItems[quality].join('\n')
          }
        })
        forwardMsg.push({ ...userInfo, message: msg.trim() })
      }
    }

    if (forwardMsg.length <= 1) {
      return e.reply('未能解析到您的任何藏品信息。')
    }
    return e.reply(Bot.makeForwardMsg(forwardMsg))
  }
} 