import utils from '../../utils/utils.js'
import Code from '../../components/Code.js'
import Render from '../../components/Render.js'
import { segment } from 'oicq'

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

    // 获取用户信息
    let userName = this.e.sender.card || this.e.sender.nickname
    let userAvatar = ''
    let qqAvatarUrl = ''
    try {
      const personalInfoRes = await this.api.getPersonalInfo(token)
      if (personalInfoRes && personalInfoRes.data && personalInfoRes.roleInfo) {
        const { userData } = personalInfoRes.data
        const { roleInfo } = personalInfoRes
        userName = decodeURIComponent(userData?.charac_name || roleInfo?.charac_name || userName)
        let picUrl = decodeURIComponent(userData?.picurl || roleInfo?.picurl || '')
        if (picUrl && /^[0-9]+$/.test(picUrl)) {
          userAvatar = `https://wegame.gtimg.com/g.2001918-r.ea725/helper/df/skin/${picUrl}.webp`
        } else if (picUrl) {
          userAvatar = picUrl
        }
      }
    } catch (e) {
      logger.warn('[特勤处信息] 获取用户信息失败:', e)
    }
    
    // QQ头像
    qqAvatarUrl = `https://q1.qlogo.cn/g?b=qq&nk=${this.e.user_id}&s=640`

    // 如果指定了类型，直接生成一张图片
    if (placeType) {
      const processedPlaces = this.processPlaces(places, typeNameMap, relateMap)
      // 按设施类型分组（显示名称相同的归为一组）
      const groupedByDisplayName = {}
      processedPlaces.forEach(place => {
        const displayName = place.displayName
        if (!groupedByDisplayName[displayName]) {
          groupedByDisplayName[displayName] = []
        }
        groupedByDisplayName[displayName].push(place)
      })

      // 转换为数组并排序
      const placesByType = Object.keys(groupedByDisplayName).map(displayName => {
        const typePlaces = groupedByDisplayName[displayName]
        // 按等级排序
        typePlaces.sort((a, b) => a.level - b.level)
        return {
          typeName: displayName,
          displayName: displayName, // 添加 displayName 字段，方便模板使用
          places: typePlaces
        }
      })

      const placeTypeName = typeNameMap[placeType] || placeType
      const templateData = {
        userName: userName,
        userAvatar: userAvatar || qqAvatarUrl,
        qqAvatarUrl: qqAvatarUrl,
        placeTypeName: placeTypeName,
        totalCount: processedPlaces.length,
        placesByType: placesByType
      }

      return await Render.render('Template/placeInfo/placeInfo', templateData, {
        e: this.e,
        retType: 'default'
      })
    }

    // 如果没有指定类型，按场所类型分组，每个类型生成一张图片
    const groupedByType = {}
    places.forEach(place => {
      const type = place.placeType || 'unknown'
      if (!groupedByType[type]) {
        groupedByType[type] = []
      }
      groupedByType[type].push(place)
    })

    // 定义类型显示顺序
    const typeOrder = ['storage', 'control', 'workbench', 'tech', 'shoot', 'training', 'pharmacy', 'armory', 'collect', 'diving']
    const sortedTypes = Object.keys(groupedByType).sort((a, b) => {
      const indexA = typeOrder.indexOf(a)
      const indexB = typeOrder.indexOf(b)
      if (indexA === -1 && indexB === -1) return a.localeCompare(b)
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return indexA - indexB
    })

    // 构建合并转发消息数组
    const forwardMsg = []
    const bot = global.Bot

    // 添加标题消息
    forwardMsg.push({
      message: `特勤处信息查询\n共 ${places.length} 个设施，${sortedTypes.length} 种类型`,
      nickname: bot.nickname,
      user_id: bot.uin
    })

    // 为每个类型生成一张图片
    for (const type of sortedTypes) {
      const typePlaces = groupedByType[type]
      if (typePlaces.length === 0) continue

      const processedPlaces = this.processPlaces(typePlaces, typeNameMap, relateMap)
      const placeTypeName = typeNameMap[type] || type

      const templateData = {
        userName: userName,
        userAvatar: userAvatar || qqAvatarUrl,
        qqAvatarUrl: qqAvatarUrl,
        placeTypeName: placeTypeName,
        totalCount: processedPlaces.length,
        places: processedPlaces
      }

      try {
        // 渲染图片（retType: 'base64' 返回的是 segment.image 对象）
        const imageSegment = await Render.render('Template/placeInfo/placeInfo', templateData, {
          e: this.e,
          retType: 'base64',
          saveId: `${this.e.user_id}_placeinfo_${type}`
        })

        if (imageSegment) {
          // 将类型标题和图片合并到一条消息中
          forwardMsg.push({
            message: [
              `【${placeTypeName}】\n`,
              imageSegment
            ],
            nickname: bot.nickname,
            user_id: bot.uin
          })
        }
      } catch (error) {
        logger.error(`[特勤处信息] 渲染 ${placeTypeName} 图片失败:`, error)
        // 如果渲染失败，添加文本消息作为降级方案
        forwardMsg.push({
          message: `【${placeTypeName}】渲染失败，请稍后重试`,
          nickname: bot.nickname,
          user_id: bot.uin
        })
      }
    }

    // 发送合并转发消息
    if (forwardMsg.length > 1) {
      const result = await this.e.reply(await bot.makeForwardMsg(forwardMsg), false, { recallMsg: 0 })
      if (!result) {
        await this.e.reply('生成转发消息失败，请联系管理员。')
      }
    } else {
      await this.e.reply('未能生成任何图片，请稍后重试。')
    }

    return true
  }

  /**
   * 处理场所数据，格式化供模板使用
   * @param {Array} places - 场所数组
   * @param {Object} typeNameMap - 类型名称映射
   * @param {Object} relateMap - 物品映射表
   * @returns {Array} - 处理后的场所数组
   */
  processPlaces(places, typeNameMap, relateMap) {
    // 按等级分组并排序
    const groupedByLevel = {}
    places.forEach(place => {
      const level = place.level || 0
      if (!groupedByLevel[level]) {
        groupedByLevel[level] = []
      }
      groupedByLevel[level].push(place)
    })

    const sortedLevels = Object.keys(groupedByLevel).sort((a, b) => parseInt(a) - parseInt(b))
    const processedPlaces = []

    sortedLevels.forEach(level => {
      const levelPlaces = groupedByLevel[level]
      levelPlaces.forEach(place => {
        // 获取设施显示名称
        const placeName = place.placeName || ''
        const placeTypeValue = place.placeType || ''
        let displayName = placeName
        if (!/[\u4e00-\u9fa5]/.test(placeName)) {
          displayName = typeNameMap[placeTypeValue] || placeName || '未知设施'
        }

        const processedPlace = {
          displayName: displayName,
          level: place.level || 0,
          upgradeInfo: null,
          upgradeRequired: [],
          unlockInfo: null,
          detail: place.detail || ''
        }

        // 处理升级信息
        if (place.upgradeInfo) {
          // 解析升级条件，按分号分割并过滤空字符串
          let conditionText = place.upgradeInfo.condition || '无'
          let conditions = []
          if (conditionText && conditionText !== '无' && conditionText !== '默认解锁') {
            // 按分号分割条件
            conditions = conditionText.split(/[;；]/).map(c => c.trim()).filter(c => c.length > 0)
          }
          
          processedPlace.upgradeInfo = {
            condition: conditionText,
            conditions: conditions, // 添加条件数组
            hafCount: place.upgradeInfo.hafCount || 0,
            hafCountFormatted: place.upgradeInfo.hafCount > 0 ? place.upgradeInfo.hafCount.toLocaleString() : '0'
          }
        }

        // 处理升级所需物品
        if (place.upgradeRequired && place.upgradeRequired.length > 0) {
          processedPlace.upgradeRequired = place.upgradeRequired.map(req => {
            const itemInfo = relateMap[String(req.objectID)]
            const itemName = itemInfo ? itemInfo.objectName : `物品ID: ${req.objectID}`
            const imageUrl = itemInfo?.pic || (req.objectID ? `https://playerhub.df.qq.com/playerhub/60004/object/${req.objectID}.png` : null)
            return {
              objectName: itemName,
              count: req.count,
              imageUrl: imageUrl
            }
          })
        }

        // 处理解锁信息
        if (place.unlockInfo) {
          const unlockData = {
            properties: [],
            props: []
          }

          const properties = place.unlockInfo.properties?.list || []
          if (properties.length > 0) {
            unlockData.properties = properties.map(prop => {
              if (typeof prop === 'string') {
                return prop
              } else if (prop && typeof prop === 'object') {
                return prop.name || prop.objectName || prop.desc || JSON.stringify(prop)
              }
              return String(prop)
            })
          }

          const props = place.unlockInfo.props || []
          if (props.length > 0) {
            unlockData.props = props.map(prop => {
              if (typeof prop === 'string') {
                return { objectName: prop, imageUrl: null, count: null }
              } else if (prop && typeof prop === 'object') {
                let objectName = '未知道具'
                let imageUrl = null
                
                if (prop.objectID) {
                  const itemInfo = relateMap[String(prop.objectID)]
                  objectName = itemInfo && itemInfo.objectName ? itemInfo.objectName : `物品ID: ${prop.objectID}`
                  imageUrl = itemInfo?.pic || `https://playerhub.df.qq.com/playerhub/60004/object/${prop.objectID}.png`
                } else if (prop.name || prop.objectName) {
                  objectName = prop.name || prop.objectName
                } else if (prop.id) {
                  const itemInfo = relateMap[String(prop.id)]
                  objectName = itemInfo && itemInfo.objectName ? itemInfo.objectName : `物品ID: ${prop.id}`
                  imageUrl = itemInfo?.pic || `https://playerhub.df.qq.com/playerhub/60004/object/${prop.id}.png`
                }
                
                return {
                  objectName: objectName,
                  imageUrl: imageUrl,
                  count: prop.count
                }
              }
              return { objectName: String(prop), imageUrl: null, count: null }
            })
          }

          if (unlockData.properties.length > 0 || unlockData.props.length > 0) {
            processedPlace.unlockInfo = unlockData
          }
        }

        processedPlaces.push(processedPlace)
      })
    })

    return processedPlaces
  }
}
