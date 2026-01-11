import Config from '../../components/Config.js';
import Code from '../../components/Code.js';
import utils from '../../utils/utils.js';
import DataManager from '../../utils/Data.js';
import { normalizeCronExpression } from '../../utils/cron.js';
import Render from '../../components/Render.js';

export class DailyPush extends plugin {
  decodeUserInfo(str) {
    try {
      return decodeURIComponent(str || '')
    } catch {
      return str || ''
    }
  }

  constructor(e) {
    super({
      name: '三角洲日报推送',
      dsc: '每日定时推送日报',
      event: 'message',
      priority: 100,
      rule: []
    });

    const dailyConfig = Config.getConfig()?.delta_force?.push_daily_report || {};
    
    this.task = {
      name: '三角洲日报推送任务',
      cron: normalizeCronExpression(dailyConfig.cron || '0 0 10 * * ?'), 
      fnc: () => this.pushDailyReports()
    };
  }

  async pushDailyReports() {
    const config = Config.getConfig();
    const dailyReportConfig = config?.delta_force?.push_daily_report || {};

    if (!dailyReportConfig.enabled) {
      return;
    }

    logger.info('[DELTA FORCE] 开始执行日报推送任务...');
    const api = new Code();

    const userEntries = Object.entries(dailyReportConfig).filter(([key, value]) => 
        /^\d+$/.test(key) && value?.enabled && value?.push_to?.group?.length > 0
    );

    for (const [userId, userConfig] of userEntries) {
      const token = await utils.getAccount(userId);
      if (!token) {
        logger.warn(`[日报推送] 用户 ${userId} 未绑定token，跳过推送。`);
        continue;
      }
      
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayDate = `${yesterday.getFullYear()}${String(yesterday.getMonth() + 1).padStart(2, '0')}${String(yesterday.getDate()).padStart(2, '0')}`
      
      const res = await api.getDailyRecord(token, '', yesterdayDate);

      if (!res || !res.success || !res.data) {
        logger.warn(`[日报推送] 用户 ${userId} API数据异常，跳过。(${res?.msg || '未知错误'})`);
        continue;
      }
      
      const solDetail = res.data?.sol?.data?.data?.solDetail;
      const mpDetail = res.data?.mp?.data?.data?.mpDetail;

      if (!solDetail && !mpDetail) {
        logger.info(`[日报推送] 用户 ${userId} 无日报数据，跳过。`);
        continue;
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
        logger.debug(`[日报推送] 获取用户信息失败:`, err)
      }

      const now = new Date()
      const currentDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

      const templateData = {
        type: 'daily',
        mode: '',
        userName,
        userAvatar,
        currentDate: currentDateStr
      }

      const hasValidMpData = mpDetail?.recentDate?.trim()
      if (hasValidMpData) {
        const mostUsedOperator = DataManager.getOperatorName(mpDetail.mostUseForceType)
        templateData.mpDetail = {
          recentDate: mpDetail.recentDate || '-',
          totalFightNum: mpDetail.totalFightNum || 0,
          totalWinNum: mpDetail.totalWinNum || 0,
          totalKillNum: mpDetail.totalKillNum || 0,
          totalScore: mpDetail.totalScore?.toLocaleString() || '0',
          mostUsedOperator: mostUsedOperator || '无',
          operatorImage: mostUsedOperator ? DataManager.getOperatorImagePath(mostUsedOperator) : null
        }

        if (mpDetail.bestMatch) {
          const best = mpDetail.bestMatch
          const bestMatchMap = DataManager.getMapName(best.mapID)
          templateData.mpDetail.bestMatch = {
            mapID: best.mapID,
            mapName: bestMatchMap || '未知地图',
            mapImage: bestMatchMap ? DataManager.getMapImagePath(bestMatchMap, 'mp') : null,
            dtEventTime: best.dtEventTime || '-',
            isWinner: best.isWinner || false,
            killNum: best.killNum || 0,
            death: best.death || 0,
            assist: best.assist || 0,
            score: best.score?.toLocaleString() || '0'
          }
        }
      } else {
        templateData.mpDetail = { isEmpty: true }
      }

      const hasValidSolData = solDetail?.recentGainDate?.trim()
      if (hasValidSolData) {
        const topItems = solDetail.userCollectionTop?.list || []
        const itemsWithImages = topItems.map((item) => {
          const objectID = item.objectID || item.itemId || item.objectId
          const imageUrl = item.pic || (objectID ? `https://playerhub.df.qq.com/playerhub/60004/object/${String(objectID)}.png` : null)
          return {
            objectName: item.objectName || '未知物品',
            price: parseFloat(item.price || 0).toLocaleString(),
            count: item.count || 0,
            imageUrl
          }
        })
        
        templateData.solDetail = {
          recentGainDate: solDetail.recentGainDate || '-',
          recentGain: solDetail.recentGain?.toLocaleString() || '0',
          topItems: itemsWithImages
        }
      } else {
        templateData.solDetail = { isEmpty: true }
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

          const base64Image = await Render.render('Template/dailyReport/dailyReport', templateData, {
            e: mockE,
            retType: 'base64'
          })

          if (base64Image) {
            await group.sendMsg([segment.at(Number(userId)), '\n您的日报来啦！', base64Image])
            logger.debug(`[日报推送] 已成功向群 ${groupId} 推送用户 ${userId} 的日报`)
          } else {
            logger.error(`[日报推送] 用户 ${userId} 日报渲染失败`)
          }
        } catch (err) {
          logger.error(`[日报推送] 向群 ${groupId} 推送用户 ${userId} 日报时失败: ${err.message}`)
        }
      }
    }
    logger.info('[DELTA FORCE] 日报推送任务执行完毕。');
  }
}
