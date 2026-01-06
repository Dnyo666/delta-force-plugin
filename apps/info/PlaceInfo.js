import utils from '../../utils/utils.js'
import Code from '../../components/Code.js'

export class PlaceInfo extends plugin {
  constructor (e) {
    super({
      name: '三角洲特勤处信息',
      dsc: '查询特勤处设施详细信息',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)(特勤处信息|placeinfo)\\s*(.*)$',
          fnc: 'getPlaceInfo'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
  }

  async getPlaceInfo() {
    const token = await utils.getAccount(this.e.user_id)
    if (!token) {
      await this.e.reply('您尚未绑定账号，请使用 #三角洲登录 进行绑定。')
      return true
    }

    // 解析参数
    const argString = this.e.msg.replace(/^(#三角洲|\^)(特勤处信息|placeinfo)\s*/, '').trim()
    const placeMap = {
      '仓库': 'storage',
      '指挥中心': 'control',
      '工作台': 'workbench',
      '技术中心': 'tech',
      '靶场': 'shoot',
      '训练中心': 'training',
      '制药台': 'pharmacy',
      '防具台': 'armory',
      '收藏室': 'collect',
      '潜水中心': 'diving'
    }
    const placeType = placeMap[argString.trim()] || ''

    await this.e.reply('正在查询特勤处信息，请稍候...')

    const res = await this.api.getPlaceInfo(token, placeType)

    if (await utils.handleApiError(res, this.e)) return true

    if (!res.data || !res.data.places) {
      await this.e.reply(`查询失败: ${res.msg || res.message || 'API 返回数据格式不正确'}`)
      return true
    }

    const { places, relateMap } = res.data

    if (places.length === 0) {
      await this.e.reply('未能查询到任何特勤处设施信息。')
      return true
    }

    // 构建转发消息
    const forwardMsg = []
    const bot = global.Bot

    // 场所类型名称映射
    const typeNameMap = {
      'storage': '仓库',
      'control': '指挥中心',
      'workbench': '工作台',
      'tech': '技术中心',
      'shoot': '靶场',
      'training': '训练中心',
      'pharmacy': '制药台',
      'armory': '防具台',
      'collect': '收藏室',
      'diving': '潜水中心'
    }

    // 添加消息头
    const placeTypeName = placeType ? typeNameMap[placeType] || placeType : '全部'
    const title = `特勤处信息查询 - ${placeTypeName}\n共 ${places.length} 个设施`;
    forwardMsg.push({
      message: title,
      nickname: bot.nickname,
      user_id: bot.uin
    })

    // 按等级分组展示
    const groupedByLevel = {}
    places.forEach(place => {
      const level = place.level || 0
      if (!groupedByLevel[level]) {
        groupedByLevel[level] = []
      }
      groupedByLevel[level].push(place)
    })

    // 按等级排序
    const sortedLevels = Object.keys(groupedByLevel).sort((a, b) => parseInt(a) - parseInt(b))

    sortedLevels.forEach(level => {
      const levelPlaces = groupedByLevel[level]
      levelPlaces.forEach(place => {
        // 获取设施显示名称
        const placeName = place.placeName || ''
        const placeType = place.placeType || ''
        let displayName = placeName
        if (!/[\u4e00-\u9fa5]/.test(placeName)) {
          displayName = typeNameMap[placeType] || placeName || '未知设施'
        }

        let msg = `--- ${displayName} Lv.${place.level || 0} ---\n`
        
        // 升级信息
        if (place.upgradeInfo) {
          msg += `升级条件: ${place.upgradeInfo.condition || '无'}\n`
          if (place.upgradeInfo.hafCount > 0) {
            msg += `所需HAF: ${place.upgradeInfo.hafCount.toLocaleString()}\n`
          }
        }

        // 升级所需物品
        if (place.upgradeRequired && place.upgradeRequired.length > 0) {
          msg += `\n升级所需物品:\n`
          const upgradeItems = place.upgradeRequired.map(req => {
            const itemInfo = relateMap[String(req.objectID)]
            const itemName = itemInfo ? itemInfo.objectName : `物品ID: ${req.objectID}`
            return `${itemName} x${req.count}`
          })
          msg += upgradeItems.join('\n')
          msg += `\n`
        }

        // 解锁信息
        if (place.unlockInfo) {
          msg += `\n解锁效果:\n`
          const unlockResult = []
          const properties = place.unlockInfo.properties?.list || []
          const props = place.unlockInfo.props || []
          
          if (properties.length > 0) {
            unlockResult.push('属性加成:')
            properties.forEach(prop => {
              if (typeof prop === 'string') {
                unlockResult.push(`  - ${prop}`)
              } else if (prop && typeof prop === 'object') {
                const propName = prop.name || prop.objectName || prop.desc || JSON.stringify(prop)
                unlockResult.push(`  - ${propName}`)
              }
            })
          }
          
          if (props.length > 0) {
            unlockResult.push('道具:')
            props.forEach(prop => {
              if (typeof prop === 'string') {
                unlockResult.push(`  - ${prop}`)
              } else if (prop && typeof prop === 'object') {
                let propName = '未知道具'
                if (prop.objectID) {
                  const itemInfo = relateMap[String(prop.objectID)]
                  propName = itemInfo && itemInfo.objectName ? itemInfo.objectName : `物品ID: ${prop.objectID}`
                } else if (prop.name || prop.objectName) {
                  propName = prop.name || prop.objectName
                } else if (prop.id) {
                  const itemInfo = relateMap[String(prop.id)]
                  propName = itemInfo && itemInfo.objectName ? itemInfo.objectName : `物品ID: ${prop.id}`
                }
                if (prop.count !== undefined) {
                  propName += ` x${prop.count}`
                }
                unlockResult.push(`  - ${propName}`)
              }
            })
          }
          
          msg += unlockResult.length > 0 ? unlockResult.join('\n') : '无'
          msg += `\n`
        }

        // 详细信息
        if (place.detail) {
          msg += `\n详情: ${place.detail}\n`
        }

        forwardMsg.push({
          message: msg.trim(),
          nickname: bot.nickname,
          user_id: bot.uin
        })
      })
    })

    // 创建合并转发消息
    const result = await this.e.reply(await bot.makeForwardMsg(forwardMsg), false, { recallMsg: 0 })

    if (!result) {
      await this.e.reply('生成转发消息失败，请联系管理员。')
    }

    return true
  }
}
