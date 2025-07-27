import plugin from '../../../lib/plugins/plugin.js'
import utils from '../utils/utils.js'
import Code from '../components/Code.js'
import DataManager from '../utils/Data.js'

export class Collection extends plugin {
  constructor (e) {
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
    this.e = e
    this.api = new Code(e)
  }

  async getCollection () {
    const token = await utils.getAccount(this.e.user_id)
    if (!token) {
      await this.e.reply('您尚未绑定账号，请使用 #三角洲登录 进行绑定。')
      return true
    }

    await this.e.reply('正在查询您的藏品资产，请稍候...')

    const [collectionRes, collectionMapRes] = await Promise.all([
      this.api.getCollection(token),
      this.api.getCollectionMap()
    ])

    // 检查是否需要先绑定大区
    if (DataManager.isRegionBindingRequired(collectionRes)) {
      await this.e.reply('您尚未绑定游戏大区！请先使用 #三角洲角色绑定 命令进行绑定。')
      return true
    }

    if (!collectionRes || collectionRes.success === false) {
      return this.e.reply(`查询藏品失败: ${collectionRes?.message || '服务无响应'}`)
    }
    if (!collectionMapRes || collectionMapRes.success === false) {
      return this.e.reply(`获取藏品信息失败: ${collectionMapRes?.message || '服务无响应'}`)
    }

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
    let { nickname } = this.e.bot
    if (this.e.isGroup) {
      const info = await this.e.bot.getGroupMemberInfo(this.e.group_id, this.e.bot.uin)
      nickname = info.card || info.nickname
    }
    const userInfo = {
      user_id: this.e.bot.uin,
      nickname
    }

    let forwardMsg = []
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
      return this.e.reply('未能解析到您的任何藏品信息。')
    }
    
    let msgToSend
    if (this.e.group?.makeForwardMsg) {
      msgToSend = await this.e.group.makeForwardMsg(forwardMsg)
    } else if (this.e.friend?.makeForwardMsg) {
      msgToSend = await this.e.friend.makeForwardMsg(forwardMsg)
    } else {
      // Fallback for non-group/friend context
      msgToSend = forwardMsg.map(item => item.message).join('\n--------------------\n')
    }

    const dec = '三角洲藏品查询'
    if (typeof (msgToSend.data) === 'object') {
      let detail = msgToSend.data?.meta?.detail
      if (detail) {
        detail.news = [{ text: dec }]
      }
    } else {
      msgToSend.data = msgToSend.data
        .replace(/\n/g, '')
        .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, '___')
        .replace(/___+/, `<title color="#777777" size="26">${dec}</title>`)
    }

    await this.e.reply(msgToSend)
    return true
  }
} 