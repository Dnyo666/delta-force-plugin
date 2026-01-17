import utils from '../../utils/utils.js'
import Code from '../../components/Code.js'
import DataManager from '../../utils/Data.js'
import Render from '../../components/Render.js'

export class Data extends plugin {
  constructor (e) {
    super({
      name: '三角洲数据',
      dsc: '查询三角洲行动个人数据',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)(数据|data)\\s*(.*)$',
          fnc: 'getPersonalData'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
  }

  decodeUserInfo(str) {
    try {
      return decodeURIComponent(str || '')
    } catch (e) {
      return str || ''
    }
  }

  async getObjectNames(objectIDs) {
    if (!objectIDs || objectIDs.length === 0) return {}
    try {
      const idsString = objectIDs.join(',')
      const res = await this.api.searchObject('', idsString)
      
      if (res && res.success && res.data && res.data.keywords && Array.isArray(res.data.keywords)) {
        const nameMap = {}
        res.data.keywords.forEach(item => {
          if (item.objectID) {
            const id = String(item.objectID)
            const name = item.name || item.objectName
            if (name) {
              nameMap[id] = name
            }
          }
        })
        logger.debug(`[Data] 成功获取 ${Object.keys(nameMap).length}/${objectIDs.length} 个物品名称`)
        return nameMap
      } else {
        logger.warn(`[Data] API返回格式异常:`, res ? JSON.stringify(res).substring(0, 200) : 'res is null')
      }
    } catch (error) {
      logger.warn(`[Data] 获取物品名称失败:`, error)
    }
    return {}
  }

  async getPersonalData () {
    const token = await utils.getAccount(this.e.user_id)
    if (!token) {
      await this.e.reply([segment.at(this.e.user_id), '您尚未绑定账号，请使用 #三角洲登录 进行绑定。'])
      return true
    }

    const argString = this.e.msg.replace(/^(#三角洲|\^)(数据|data)\s*/, '').trim()
    const args = argString.split(' ').filter(Boolean)
    let mode = ''
    let season = 7
    for (const arg of args) {
      if (['烽火', '烽火地带', 'sol', '摸金'].includes(arg)) {
        mode = 'sol'
      } else if (['全面', '全面战场', '战场', 'mp'].includes(arg)) {
        mode = 'mp'
      } else if (['all', '全部'].includes(arg.toLowerCase())) {
        season = 'all'
      } else if (!isNaN(arg)) {
        season = parseInt(arg)
      }
    }

    const res = await this.api.getPersonalData(token, mode, season)

    if (!res) {
      await this.e.reply('查询数据失败，请检查网络或联系管理员查看后台日志。')
      return true
    }

    if (res.success === false) {
      await this.e.reply(`查询数据失败: ${res.message || '未知API错误'}`)
      return true
    }
    
    let solDetail = null
    let mpDetail = null
    if (mode) {
      const singleModeData = res.data?.data?.data
      if (singleModeData?.solDetail) solDetail = singleModeData.solDetail
      if (singleModeData?.mpDetail) mpDetail = singleModeData.mpDetail
    } else {
      const allModesData = res.data
      if (allModesData?.sol?.data?.data?.solDetail) {
        solDetail = allModesData.sol.data.data.solDetail
      }
      if (allModesData?.mp?.data?.data?.mpDetail) {
        mpDetail = allModesData.mp.data.data.mpDetail
      }
    }

    if (!solDetail && !mpDetail) {
      await this.e.reply('暂未查询到该账号的游戏数据。')
      return true
    }

    let userName = this.e.sender.card || this.e.sender.nickname
    let userAvatar = ''
    try {
      const personalInfoRes = await this.api.getPersonalInfo(token)
      if (personalInfoRes && personalInfoRes.data && personalInfoRes.roleInfo) {
        const { userData } = personalInfoRes.data
        const { roleInfo } = personalInfoRes

        const gameUserName = this.decodeUserInfo(userData?.charac_name || roleInfo?.charac_name)
        if (gameUserName) {
          userName = gameUserName
        }

        const picUrl = this.decodeUserInfo(userData?.picurl || roleInfo?.picurl)
        if (picUrl) {
          if (/^[0-9]+$/.test(picUrl)) {
            userAvatar = `https://wegame.gtimg.com/g.2001918-r.ea725/helper/df/skin/${picUrl}.webp`
          } else {
            userAvatar = picUrl
          }
        }
      }
    } catch (error) {
      logger.debug(`[Data] 获取用户信息失败:`, error)
    }

    const now = new Date()
    const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

    const qqAvatarUrl = `http://q.qlogo.cn/headimg_dl?dst_uin=${this.e.user_id}&spec=640&img_type=jpg`
    const templateData = {
      nickname: userName,
      userName: userName,
      userAvatar: userAvatar,
      userId: this.e.user_id,
      qqAvatarUrl: qqAvatarUrl,
      currentDate: currentDate,
      season: season === 'all' ? '全部' : season
    }
    
    if ((!mode || mode === 'sol') && solDetail) {
      const solRank = solDetail.levelScore ? DataManager.getRankByScore(solDetail.levelScore, 'sol') : '-'
      const solRankImage = solRank !== '-' ? DataManager.getRankImagePath(solRank, 'sol') : null
      
      const totalGameTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0分钟'
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        return `${hours}小时${minutes}分钟`
      }
      
      const formatGainedPrice = (price) => {
        if (!price || isNaN(price)) return '-'
        return `${(parseFloat(price) / 1000000).toFixed(2)}M`
      }
      
      const formatKd = (kd) => {
        if (kd === null || kd === undefined || isNaN(kd)) return '-'
        return (parseFloat(kd) / 100).toFixed(2)
      }
      
      const mapOrder = ['零号大坝', '长弓溪谷', '巴克什', '航天基地', '潮汐监狱']
      const solMapListRaw = (solDetail.mapList || []).map(map => {
        const mapName = DataManager.getMapName(map.mapID)
        const mapImage = DataManager.getMapImagePath(mapName, 'sol')
        const baseMapName = mapName.replace(/-?(常规|机密|绝密|水淹|适应)$/, '')
        return {
          ...map,
          mapName: mapName,
          baseMapName: baseMapName,
          mapImage: mapImage
        }
      })
      
      const mapGroups = {}
      solMapListRaw.forEach(map => {
        if (!mapGroups[map.baseMapName]) {
          mapGroups[map.baseMapName] = []
        }
        mapGroups[map.baseMapName].push(map)
      })
      
      let solMapList = mapOrder
        .filter(baseName => mapGroups[baseName] && mapGroups[baseName].length > 0)
        .map(baseName => {
          const maps = mapGroups[baseName]
          maps.sort((a, b) => b.totalCount - a.totalCount)
          return {
            baseMapName: baseName,
            maps: maps
          }
        })
      
      const resultList = []
      let pendingSingleGroups = []
      
      const mergePendingGroups = () => {
        if (pendingSingleGroups.length > 1) {
          const mergedMaps = pendingSingleGroups.flatMap(sg => sg.maps)
          resultList.push({ baseMapName: 'merged', maps: mergedMaps })
          pendingSingleGroups = []
        } else if (pendingSingleGroups.length === 1) {
          resultList.push(pendingSingleGroups[0])
          pendingSingleGroups = []
        }
      }
      
      solMapList.forEach((group) => {
        if (group.maps && group.maps.length === 1) {
          pendingSingleGroups.push(group)
        } else {
          mergePendingGroups()
          resultList.push(group)
        }
      })
      
      mergePendingGroups()
      
      solMapList = resultList

      const collectionIDs = (solDetail.redCollectionDetail || []).map(item => String(item.objectID))
      const weaponIDs = (solDetail.gunPlayList || []).map(weapon => String(weapon.objectID))
      const allObjectIDs = [...new Set([...collectionIDs, ...weaponIDs])]
      const objectNameMap = await this.getObjectNames(allObjectIDs)

      const formatPrice = (price) => {
        if (!price || isNaN(price)) return '-'
        const numPrice = parseFloat(price)
        if (numPrice >= 1000000000) {
          return (numPrice / 1000000000).toFixed(2) + 'B'
        } else if (numPrice >= 1000000) {
          return (numPrice / 1000000).toFixed(2) + 'M'
        } else if (numPrice >= 1000) {
          return (numPrice / 1000).toFixed(1) + 'K'
        } else {
          return numPrice.toFixed(0)
        }
      }
      
      const solRedCollection = (solDetail.redCollectionDetail || []).map(item => ({
        ...item,
        objectName: objectNameMap[String(item.objectID)] || item.objectName || `物品(${item.objectID})`,
        imageUrl: `https://playerhub.df.qq.com/playerhub/60004/object/${item.objectID}.png`,
        priceFormatted: formatPrice(item.price)
      })).sort((a, b) => b.price - a.price).slice(0, 10)

      const solGunPlayList = (solDetail.gunPlayList || []).map(weapon => ({
        ...weapon,
        weaponName: objectNameMap[String(weapon.objectID)] || `武器(${weapon.objectID})`,
        imageUrl: `https://playerhub.df.qq.com/playerhub/60004/object/${weapon.objectID}.png`,
        totalPriceFormatted: weapon.totalPrice ? (weapon.totalPrice / 1000000).toFixed(2) + 'M' : '-',
        escapeRate: weapon.fightCount > 0 ? ((weapon.escapeCount / weapon.fightCount) * 100).toFixed(1) + '%' : '-'
      })).sort((a, b) => b.totalPrice - a.totalPrice).slice(0, 10)

      templateData.solDetail = {
        ...solDetail,
        totalGameTime: totalGameTime(solDetail.totalGameTime),
        totalGainedPriceFormatted: formatGainedPrice(solDetail.totalGainedPrice),
        profitLossRatioFormatted: solDetail.profitLossRatio ? (parseFloat(solDetail.profitLossRatio) / 100000).toFixed(1) + 'K' : '-',
        lowKD: formatKd(solDetail.lowKillDeathRatio),
        medKD: formatKd(solDetail.medKillDeathRatio),
        highKD: formatKd(solDetail.highKillDeathRatio),
        totalFight: solDetail.totalFight || 0,
        totalKill: solDetail.totalKill || 0,
        userRank: solDetail.userRank || '-',
        mapList: solMapList,
        redCollectionList: solRedCollection,
        gunPlayList: solGunPlayList
      }
      templateData.solRank = solRank
      templateData.solRankImage = solRankImage
    }

    if ((!mode || mode === 'mp') && mpDetail) {
      const mpRank = mpDetail.levelScore ? DataManager.getRankByScore(mpDetail.levelScore, 'tdm') : '-'
      const mpRankImage = mpRank !== '-' ? DataManager.getRankImagePath(mpRank, 'tdm') : null
      
      const mpMapList = (mpDetail.mapList || []).map(map => {
        const mapName = DataManager.getMapName(map.mapID)
        const mapImage = DataManager.getMapImagePath(mapName, 'mp')
        return {
          ...map,
          mapName: mapName,
          mapImage: mapImage
        }
      }).sort((a, b) => b.totalCount - a.totalCount).slice(0, 10)

      const formatMPGameTime = (minutes) => {
        if (!minutes || isNaN(minutes)) return '0分钟'
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return `${hours}小时${mins}分钟`
      }
      
      templateData.mpDetail = {
        ...mpDetail,
        totalGameTime: formatMPGameTime(mpDetail.totalGameTime),
        avgKillPerMinuteFormatted: mpDetail.avgKillPerMinute ? (parseFloat(mpDetail.avgKillPerMinute) / 100).toFixed(2) : '-',
        avgScorePerMinuteFormatted: mpDetail.avgScorePerMinute ? (parseFloat(mpDetail.avgScorePerMinute) / 100).toFixed(2) : '-',
        totalFight: mpDetail.totalFight || 0,
        totalWin: mpDetail.totalWin || 0,
        totalVehicleDestroyed: mpDetail.totalVehicleDestroyed || 0,
        mapList: mpMapList
      }
      templateData.mpRank = mpRank
      templateData.mpRankImage = mpRankImage
    }

    const hasBothModes = templateData.solDetail && templateData.mpDetail
    const bot = global.Bot
    const forwardMsg = []
    const renderCfg = {
      e: this.e,
      scale: 1.0,
      retType: 'base64',
      renderCfg: {
        viewPort: {
          width: 2000,
          height: 10000
        }
      }
    }

    if (templateData.solDetail) {
      const solTemplateData = {
        ...templateData,
        solDetail: templateData.solDetail,
        solRank: templateData.solRank,
        solRankImage: templateData.solRankImage,
        mpDetail: null
      }

      try {
        const solImage = await Render.render('Template/personalData/personalData', solTemplateData, renderCfg)
        if (solImage) {
          if (hasBothModes) {
            forwardMsg.push({
              message: ['【烽火地带 - 个人统计】\n', solImage],
              nickname: bot.nickname,
              user_id: bot.uin
            })
          } else {
            await this.e.reply(solImage)
            return true
          }
        }
      } catch (error) {
        logger.error(`[Data] 渲染烽火地带图片失败:`, error)
        if (hasBothModes) {
          forwardMsg.push({
            message: '【烽火地带 - 个人统计】\n渲染失败，请稍后重试',
            nickname: bot.nickname,
            user_id: bot.uin
          })
        } else {
          await this.e.reply('渲染烽火地带图片失败，请稍后重试。')
          return true
        }
      }
    }

    if (templateData.mpDetail) {
      const mpTemplateData = {
        ...templateData,
        mpDetail: templateData.mpDetail,
        mpRank: templateData.mpRank,
        mpRankImage: templateData.mpRankImage,
        solDetail: null
      }

      try {
        const mpImage = await Render.render('Template/personalData/personalData', mpTemplateData, renderCfg)
        if (mpImage) {
          if (hasBothModes) {
            forwardMsg.push({
              message: ['【全面战场 - 个人统计】\n', mpImage],
              nickname: bot.nickname,
              user_id: bot.uin
            })
          } else {
            await this.e.reply(mpImage)
            return true
          }
        }
      } catch (error) {
        logger.error(`[Data] 渲染全面战场图片失败:`, error)
        if (hasBothModes) {
          forwardMsg.push({
            message: '【全面战场 - 个人统计】\n渲染失败，请稍后重试',
            nickname: bot.nickname,
            user_id: bot.uin
          })
        } else {
          await this.e.reply('渲染全面战场图片失败，请稍后重试。')
          return true
        }
      }
    }

    if (hasBothModes && forwardMsg.length > 0) {
      const result = await this.e.reply(await bot.makeForwardMsg(forwardMsg), false, { recallMsg: 0 })
      if (!result) {
        await this.e.reply('生成转发消息失败，请联系管理员。')
      }
    } else if (!hasBothModes) {
      await this.e.reply('未能生成图片，请稍后重试。')
    }

    return true
  }
}
