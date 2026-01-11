import Config from '../../components/Config.js';
import Code from '../../components/Code.js';
import utils from '../../utils/utils.js';
import DataManager from '../../utils/Data.js';
import { normalizeCronExpression } from '../../utils/cron.js';
import Render from '../../components/Render.js';

export class WeeklyPush extends plugin {
  decodeUserInfo(str) {
    try {
      return decodeURIComponent(str || '')
    } catch {
      return str || ''
    }
  }

  constructor(e) {
    super({
      name: '三角洲周报推送',
      dsc: '每周定时推送周报',
      event: 'message',
      priority: 100,
      rule: []
    });

    const weeklyConfig = Config.getConfig()?.delta_force?.push_weekly_report || {};
    
    this.task = {
      name: '三角洲周报推送任务',
      cron: normalizeCronExpression(weeklyConfig.cron || '0 0 10 * * 1'), 
      fnc: () => this.pushWeeklyReports()
    };
  }

  async pushWeeklyReports() {
    const config = Config.getConfig();
    const weeklyReportConfig = config?.delta_force?.push_weekly_report || {};

    if (!weeklyReportConfig.enabled) {
      return;
    }

    logger.info('[DELTA FORCE] 开始执行周报推送任务...');
    const api = new Code();

    const userEntries = Object.entries(weeklyReportConfig).filter(([key, value]) => 
        /^\d+$/.test(key) && value?.enabled && value?.push_to?.group?.length > 0
    );

    for (const [userId, userConfig] of userEntries) {
      const token = await utils.getAccount(userId);
      if (!token) {
        logger.warn(`[周报推送] 用户 ${userId} 未绑定token，跳过推送。`);
        continue;
      }
      
      const res = await api.getWeeklyRecord(token, '', true, '')
      if (!res?.success || !res.data) {
        logger.warn(`[周报推送] 用户 ${userId} API数据异常，跳过。(${res?.msg || '未知错误'})`)
        continue
      }
      const solData = res.data?.sol?.data?.data
      const mpData = res.data?.mp?.data?.data
      if (!solData && !mpData) {
        logger.info(`[周报推送] 用户 ${userId} 无周报数据，跳过。`)
        continue
      }
      
      const allTeammateOpenIDs = new Set()
      solData?.teammates?.forEach(t => allTeammateOpenIDs.add(t.friend_openid))
      mpData?.teammates?.forEach(t => allTeammateOpenIDs.add(t.friend_openid))

      const nicknameMap = new Map()
      const avatarMap = new Map()
      if (allTeammateOpenIDs.size > 0) {
        const promises = Array.from(allTeammateOpenIDs).map(openid => api.getFriendInfo(token, openid))
        const results = await Promise.allSettled(promises)
        const openIDs = Array.from(allTeammateOpenIDs)
        
        results.forEach((result, index) => {
          if (result.status === 'fulfilled' && result.value?.success && result.value.data) {
            const data = result.value.data
            const openid = openIDs[index]
            if (data.charac_name) {
              nicknameMap.set(openid, data.charac_name)
            }
            if (data.picurl) {
              let avatarUrl = data.picurl
              if (/^[0-9]+$/.test(avatarUrl)) {
                avatarUrl = `https://wegame.gtimg.com/g.2001918-r.ea725/helper/df/skin/${avatarUrl}.webp`
              } else {
                try {
                  avatarUrl = decodeURIComponent(avatarUrl)
                } catch {}
              }
              avatarMap.set(openid, avatarUrl)
            }
          }
        })
      }

      const parseAndGetName = (dataStr, idKey, countKey, dataManagerFunc) => {
        if (!dataStr || typeof dataStr !== 'string') return '无'
        const items = dataStr.split('#').map(s => {
          try {
            const correctedJSON = s.replace(/'/g, '"').replace(/([a-zA-Z0-9_]+):/g, '"$1":')
            return JSON.parse(correctedJSON)
          } catch {
            return null
          }
        }).filter(Boolean)
        if (items.length === 0) return '无'
        const mostUsed = items.reduce((a, b) => (a[countKey] > b[countKey] ? a : b))
        return dataManagerFunc(mostUsed[idKey])
      }

      if (solData) {
        solData.mostUsedMap = parseAndGetName(solData.total_mapid_num, 'MapId', 'inum', DataManager.getMapName)
        solData.mostUsedOperator = parseAndGetName(solData.total_ArmedForceId_num, 'ArmedForceId', 'inum', DataManager.getOperatorName)
      }
      if (mpData) {
        mpData.mostUsedMap = parseAndGetName(mpData.max_inum_mapid, 'MapId', 'inum', DataManager.getMapName)
        mpData.mostUsedOperator = DataManager.getOperatorName(mpData.max_inum_DeployArmedForceType)
      }

      let userName = userConfig.nickname || userId
      let userAvatar = ''
      try {
        const personalInfoRes = await api.getPersonalInfo(token)
        if (personalInfoRes?.data && personalInfoRes?.roleInfo) {
          const { userData } = personalInfoRes.data
          const { roleInfo } = personalInfoRes
          const gameUserName = this.decodeUserInfo(userData?.charac_name || roleInfo?.charac_name)
          if (gameUserName) userName = gameUserName
          const picUrl = this.decodeUserInfo(userData?.picurl || roleInfo?.picurl)
          if (picUrl) {
            userAvatar = /^[0-9]+$/.test(picUrl)
              ? `https://wegame.gtimg.com/g.2001918-r.ea725/helper/df/skin/${picUrl}.webp`
              : picUrl
          }
        }
      } catch (err) {
        logger.debug(`[周报推送] 获取用户信息失败:`, err)
      }

      const now = new Date()
      const displayDate = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`

      const templateData = {
        userName,
        userAvatar,
        date: displayDate
      }

      if (solData) {
        const hasValidData = solData.total_sol_num && Number(solData.total_sol_num) > 0
        
        if (!hasValidData) {
          templateData.solData = { isEmpty: true }
        } else {
        const solRank = solData.Rank_Score ? DataManager.getRankByScore(solData.Rank_Score, 'sol') : '-'
        const gainedPrice = Number(solData.Gained_Price) || 0
        const consumePrice = Number(solData.consume_Price) || 0
        let profitRatio = '0'
        if (gainedPrice > 0 && consumePrice > 0) {
          profitRatio = (gainedPrice / consumePrice).toFixed(2)
        } else if (gainedPrice > 0 && consumePrice === 0) {
          profitRatio = '∞'
          logger.warn(`[周报推送] 烽火地带赚损比异常 - 收益: ${gainedPrice}, 消费: ${consumePrice}, 设置为∞`)
        }
        
        let assetTrend = null
        if (solData.Total_Price) {
          const prices = solData.Total_Price.split(',')
          const dayMap = {
            'Monday': '周一',
            'Tuesday': '周二',
            'Wednesday': '周三',
            'Thursday': '周四',
            'Friday': '周五',
            'Saturday': '周六',
            'Sunday': '周日'
          }
          
          const dailyPrices = {}
          prices.forEach(priceStr => {
            const parts = priceStr.split('-')
            if (parts.length >= 3) {
              const price = parseInt(parts[2])
              if (!isNaN(price)) {
                dailyPrices[parts[0]] = price
              }
            }
          })
          
          const monday = dailyPrices['Monday']
          const sunday = dailyPrices['Sunday']
          
          if (monday !== undefined && sunday !== undefined) {
            const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            const allPrices = allDays.map(day => dailyPrices[day]).filter(p => p !== undefined)
            const maxPrice = Math.max(...allPrices)
            const minPrice = Math.min(...allPrices)
            const priceRange = maxPrice - minPrice
            
            const chartWidth = 600
            const chartHeight = 120
            const padding = { top: 20, right: 10, bottom: 30, left: 10 }
            const plotWidth = chartWidth - padding.left - padding.right
            const plotHeight = chartHeight - padding.top - padding.bottom
            
            const points = allDays.map((day, index) => {
              const price = dailyPrices[day]
              const x = padding.left + (index / (allDays.length - 1)) * plotWidth
              const y = padding.top + plotHeight - ((price - minPrice) / priceRange) * plotHeight
              return {
                dayName: dayMap[day] || day,
                price: price ? price.toLocaleString() : '-',
                rawPrice: price || 0,
                x: x.toFixed(1),
                y: y.toFixed(1),
                xPercent: ((x / chartWidth) * 100).toFixed(2),
                yPercent: ((y / chartHeight) * 100).toFixed(2)
              }
            })
            
            let pathData = ''
            if (points.length > 0) {
              pathData = `M ${points[0].x},${points[0].y}`
              for (let i = 1; i < points.length; i++) {
                pathData += ` L ${points[i].x},${points[i].y}`
              }
            }
            
            assetTrend = {
              startPrice: monday.toLocaleString(),
              endPrice: sunday.toLocaleString(),
              maxPrice: maxPrice.toLocaleString(),
              minPrice: minPrice.toLocaleString(),
              chartWidth,
              chartHeight,
              pathData,
              allDays: points
            }
          }
        }

        templateData.solData = {
          total_sol_num: solData.total_sol_num || 0,
          total_exacuation_num: solData.total_exacuation_num || 0,
          GainedPrice_overmillion_num: solData.GainedPrice_overmillion_num || 0,
          total_Death_Count: solData.total_Death_Count || 0,
          total_Kill_Player: solData.total_Kill_Player || 0,
          total_Kill_AI: solData.total_Kill_AI || 0,
          total_Kill_Boss: solData.total_Kill_Boss || 0,
          rankName: solRank,
          rankImagePath: solRank !== '-' ? DataManager.getRankImagePath(solRank, 'sol') : null,
          rise_Price: solData.rise_Price?.toLocaleString() || '0',
          Gained_Price: solData.Gained_Price?.toLocaleString() || '0',
          consume_Price: solData.consume_Price?.toLocaleString() || '0',
          profitRatio,
          assetTrend,
          total_Quest_num: solData.total_Quest_num || 0,
          use_Keycard_num: solData.use_Keycard_num || 0,
          Mandel_brick_num: solData.Mandel_brick_num || 0,
          search_Birdsnest_num: solData.search_Birdsnest_num || 0,
          mileage: solData.Total_Mileage ? (solData.Total_Mileage / 100000).toFixed(2) : '0',
          total_Rescue_num: solData.total_Rescue_num || 0,
          Kill_ByCrocodile_num: solData.Kill_ByCrocodile_num || 0,
          gameTime: `${Math.floor((solData.total_Online_Time || 0) / 3600)}小时${Math.floor(((solData.total_Online_Time || 0) % 3600) / 60)}分钟`,
          mostUsedMap: solData.mostUsedMap || '无',
          mostUsedMapImagePath: solData.mostUsedMap ? DataManager.getMapImagePath(solData.mostUsedMap, 'sol') : null,
          mostUsedOperator: solData.mostUsedOperator || '无',
          mostUsedOperatorImagePath: solData.mostUsedOperator ? DataManager.getOperatorImagePath(solData.mostUsedOperator) : null
        }

        const parseJsonArray = (dataStr, parseFunc) => {
          if (!dataStr) return []
          try {
            const strings = dataStr.includes('#') ? dataStr.split('#') : [dataStr]
            return strings.map(s => {
              try {
                const correctedJSON = s.replace(/'/g, '"').replace(/([a-zA-Z0-9_]+):/g, '"$1":')
                return parseFunc(JSON.parse(correctedJSON))
              } catch {
                return null
              }
            }).filter(Boolean).sort((a, b) => b.count - a.count)
          } catch {
            return []
          }
        }

        if (solData.total_sol_num > 0) {
          templateData.solData.operators = parseJsonArray(solData.total_ArmedForceId_num, (parsed) => {
            const operatorName = DataManager.getOperatorName(parsed.ArmedForceId)
            return {
              id: parsed.ArmedForceId,
              count: parsed.inum,
              name: operatorName,
              imagePath: DataManager.getOperatorImagePath(operatorName)
            }
          })

          templateData.solData.maps = parseJsonArray(solData.total_mapid_num, (parsed) => {
            const mapName = DataManager.getMapName(parsed.MapId)
            return {
              id: parsed.MapId,
              count: parsed.inum,
              name: mapName,
              imagePath: DataManager.getMapImagePath(mapName, 'sol')
            }
          })
        } else {
          templateData.solData.operators = []
          templateData.solData.maps = []
        }

        if (solData.CarryOut_highprice_list) {
          try {
            const items = solData.CarryOut_highprice_list.split('#').map(s => {
              const correctedJSON = s.replace(/'/g, '"').replace(/([a-zA-Z0-9_]+):/g, '"$1":')
              return JSON.parse(correctedJSON)
            }).filter(Boolean)
            items.sort((a, b) => b.iPrice - a.iPrice)
            templateData.solData.highPriceItems = items.slice(0, 5).map(item => ({
              name: item.auctontype || '物品',
              price: item.iPrice.toLocaleString()
            }))
          } catch {
            templateData.solData.highPriceItems = []
          }
        } else {
          templateData.solData.highPriceItems = []
        }

        const sol_teammates = (solData.teammates || []).filter(t => t.Friend_total_sol_num > 0)
        templateData.solData.teammates = sol_teammates.map(t => {
          const sumGained = t.Friend_Sum_Gained_Price
          const totalGained = Number(sumGained) ||
            (Number(t.Friend_Sum_Escape1_Gained_Price || 0) + Number(t.Friend_Sum_Escape2_Gained_Price || 0))
          return {
            name: nicknameMap.get(t.friend_openid) || `...${t.friend_openid.slice(-6)}`,
            avatar: avatarMap.get(t.friend_openid) || '',
            total_sol_num: t.Friend_total_sol_num || 0,
            escape1: t.Friend_is_Escape1_num || 0,
            escape2: t.Friend_is_Escape2_num || 0,
            killPlayer: t.Friend_total_sol_KillPlayer || 0,
            death: t.Friend_total_sol_DeathCount || 0,
            totalGained: totalGained.toLocaleString(),
            successGain: Number(t.Friend_Sum_Escape1_Gained_Price || 0).toLocaleString(),
            failGain: Number(t.Friend_Sum_Escape2_Gained_Price || 0).toLocaleString(),
            totalCost: Number(t.Friend_consume_Price || 0).toLocaleString(),
            successCost: Number(t.Friend_Escape1_consume_Price || 0).toLocaleString(),
            failCost: Number(t.Friend_Escape2_consume_Price || 0).toLocaleString(),
            assistCnt: t.Friend_total_sol_AssistCnt || 0
          }
        })
        }
      } else {
        templateData.solData = { isEmpty: true }
      }

      if (mpData) {
        const hasValidData = mpData.total_num && Number(mpData.total_num) > 0
        
        if (!hasValidData) {
          templateData.mpData = { isEmpty: true }
        } else {
        const totalNum = Number(mpData.total_num) || 0
        const winNum = Number(mpData.win_num) || 0
        const winRate = totalNum > 0 ? `${((winNum / totalNum) * 100).toFixed(1)}%` : '0%'
        const mpRank = mpData.Rank_Match_Score ? DataManager.getRankByScore(mpData.Rank_Match_Score, 'tdm') : '-'
        const consumeBullet = Number(mpData.Consume_Bullet_Num) || 0
        const hitBullet = Number(mpData.Hit_Bullet_Num) || 0
        const hitRate = consumeBullet > 0 ? `${((hitBullet / consumeBullet) * 100).toFixed(1)}%` : '0%'

        templateData.mpData = {
          total_num: mpData.total_num || 0,
          win_num: mpData.win_num || 0,
          winRate,
          rankName: mpRank,
          rankImagePath: mpRank !== '-' ? DataManager.getRankImagePath(mpRank, 'tdm') : null,
          Kill_Num: mpData.Kill_Num || 0,
          continuous_Kill_Num: mpData.continuous_Kill_Num || 0,
          total_score: mpData.total_score?.toLocaleString() || '0',
          hitRate,
          Hit_Bullet_Num: mpData.Hit_Bullet_Num || 0,
          Consume_Bullet_Num: mpData.Consume_Bullet_Num || 0,
          SBattle_Support_UseNum: mpData.SBattle_Support_UseNum || 0,
          SBattle_Support_CostScore: mpData.SBattle_Support_CostScore?.toLocaleString() || '0',
          Rescue_Teammate_Count: mpData.Rescue_Teammate_Count || 0,
          by_Rescue_num: mpData.by_Rescue_num || 0,
          mostUsedMap: mpData.mostUsedMap || '无',
          mostUsedMapImagePath: mpData.mostUsedMap ? DataManager.getMapImagePath(mpData.mostUsedMap, 'mp') : null,
          mostUsedOperator: mpData.mostUsedOperator || '无',
          mostUsedOperatorImagePath: mpData.mostUsedOperator ? DataManager.getOperatorImagePath(mpData.mostUsedOperator) : null
        }

        if (mpData.total_num > 0) {
          templateData.mpData.maps = parseJsonArray(mpData.max_inum_mapid, (parsed) => {
            const mapName = DataManager.getMapName(parsed.MapId)
            return {
              id: parsed.MapId,
              count: parsed.inum,
              name: mapName,
              imagePath: DataManager.getMapImagePath(mapName, 'mp')
            }
          })
        } else {
          templateData.mpData.maps = []
        }

        if (mpData.max_inum_DeployArmedForceType && mpData.total_num > 0) {
          const operatorName = DataManager.getOperatorName(mpData.max_inum_DeployArmedForceType)
          templateData.mpData.operatorStats = {
            name: operatorName || '未知干员',
            imagePath: DataManager.getOperatorImagePath(operatorName),
            games: mpData.DeployArmedForceType_inum || 0,
            kills: mpData.DeployArmedForceType_KillNum || 0,
            gameTime: `${Math.floor((mpData.DeployArmedForceType_gametime || 0) / 3600)}小时${Math.floor(((mpData.DeployArmedForceType_gametime || 0) % 3600) / 60)}分钟`
          }
        }

        const mp_teammates = (mpData.teammates || []).filter(t => t.Friend_mp_total_num > 0 || t.Friend_mp_win_num > 0 || t.Friend_mp_KillNum > 0)
        templateData.mpData.teammates = mp_teammates.map(t => {
          const total_mp_games = t.Friend_mp_total_num || 0
          const win_mp_games = t.Friend_mp_win_num || 0
          return {
            name: nicknameMap.get(t.friend_openid) || `...${t.friend_openid.slice(-6)}`,
            avatar: avatarMap.get(t.friend_openid) || '',
            total_num: total_mp_games,
            win_num: win_mp_games,
            winRate: total_mp_games > 0 ? `${((win_mp_games / total_mp_games) * 100).toFixed(1)}%` : '0%',
            kda: `${t.Friend_mp_KillNum || 0}/${t.Friend_mp_Death || 0}/${t.Friend_mp_Assist || 0}`,
            sumScore: t.Friend_Sum_Score?.toLocaleString() || '0',
            maxScore: t.Friend_Max_Score?.toLocaleString() || '0'
          }
        })
        }
      } else {
        templateData.mpData = { isEmpty: true }
      }

      for (const groupId of userConfig.push_to.group || []) {
        try {
          const group = await Bot.pickGroup(Number(groupId))
          const Runtime = (await import('../../../../lib/plugins/runtime.js')).default
          const mockE = {
            user_id: Number(userId),
            group_id: Number(groupId),
            isGroup: true,
            sender: {
              card: userConfig.nickname || userId,
              nickname: userConfig.nickname || userId
            }
          }
          mockE.runtime = new Runtime(mockE)

          const base64Image = await Render.render('Template/weeklyReport/weeklyReport', templateData, {
            e: mockE,
            retType: 'base64'
          })

          if (base64Image) {
            await group.sendMsg([segment.at(Number(userId)), '\n您的周报来啦！', base64Image])
            logger.debug(`[周报推送] 已成功向群 ${groupId} 推送用户 ${userId} 的周报`)
          } else {
            logger.error(`[周报推送] 用户 ${userId} 周报渲染失败`)
          }
        } catch (err) {
          logger.error(`[周报推送] 向群 ${groupId} 推送用户 ${userId} 周报时失败: ${err.message}`)
        }
      }
    }
    logger.info('[DELTA FORCE] 周报推送任务执行完毕。');
  }
}
