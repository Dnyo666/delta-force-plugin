import Config from '../../components/Config.js';
import Code from '../../components/Code.js';
import utils from '../../utils/utils.js';
import DataManager from '../../utils/Data.js';
import { normalizeCronExpression } from '../../utils/cron.js';
import Render from '../../components/Render.js';

export class DailyPush extends plugin {
  // URL解码函数
  decodeUserInfo(str) {
    try {
      return decodeURIComponent(str || '')
    } catch (e) {
      return str || ''
    }
  }

  constructor(e) {
    super({
      name: '三角洲日报推送',
      dsc: '每日定时推送日报',
      event: 'none',
      priority: 100
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
      
      const res = await api.getDailyRecord(token);

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

      // 获取用户信息（包括头像）
      let userName = userConfig.nickname || userId
      let userAvatar = ''
      try {
        const personalInfoRes = await api.getPersonalInfo(token)
        if (personalInfoRes && personalInfoRes.data && personalInfoRes.roleInfo) {
          const { userData, careerData } = personalInfoRes.data
          const { roleInfo } = personalInfoRes

          // 获取用户名（优先使用游戏内名称）
          const gameUserName = this.decodeUserInfo(userData?.charac_name || roleInfo?.charac_name)
          if (gameUserName) {
            userName = gameUserName
          }

          // 获取用户头像
          userAvatar = this.decodeUserInfo(userData?.picurl || roleInfo?.picurl)
          if (userAvatar && /^[0-9]+$/.test(userAvatar)) {
            userAvatar = `https://wegame.gtimg.com/g.2001918-r.ea725/helper/df/skin/${userAvatar}.webp`
          }
        }
      } catch (error) {
        // 获取个人信息失败，使用默认值
        logger.debug(`[日报推送] 获取用户信息失败:`, error)
      }

      // 构建模板数据
      const templateData = {
        type: 'daily',
        mode: '',
        userName: userName,
        userAvatar: userAvatar
      }

      // 处理全面战场数据
      if (mpDetail) {
        const mostUsedOperator = DataManager.getOperatorName(mpDetail.mostUseForceType);
        
        // 获取干员图片路径（相对路径，模板中会自动添加 _res_path）
        const operatorImagePath = mostUsedOperator ? utils.getOperatorImagePath(mostUsedOperator) : null;
        
        templateData.mpDetail = {
          recentDate: mpDetail.recentDate || '-',
          totalFightNum: mpDetail.totalFightNum || 0,
          totalWinNum: mpDetail.totalWinNum || 0,
          totalKillNum: mpDetail.totalKillNum || 0,
          totalScore: mpDetail.totalScore?.toLocaleString() || '0',
          mostUsedOperator: mostUsedOperator || '无',
          operatorImage: operatorImagePath || null
        }

        // 处理最佳对局
        if (mpDetail.bestMatch) {
          const best = mpDetail.bestMatch
          const bestMatchMap = DataManager.getMapName(best.mapID);
          
          // 使用 DataManager 的方法获取地图背景图路径（相对路径）
          const mapBgPath = bestMatchMap ? DataManager.getMapImagePath(bestMatchMap, 'mp') : null;
          const bestOperator = DataManager.getOperatorName(best.ArmedForceId);
          const bestOperatorImage = bestOperator ? utils.getOperatorImagePath(bestOperator) : null;
          
          templateData.mpDetail.bestMatch = {
            mapID: best.mapID,
            mapName: bestMatchMap || '未知地图',
            mapImage: mapBgPath,
            dtEventTime: best.dtEventTime || '-',
            isWinner: best.isWinner || false,
            killNum: best.killNum || 0,
            death: best.death || 0,
            assist: best.assist || 0,
            score: best.score?.toLocaleString() || '0'
          }
        }
      }

      // 处理烽火地带数据
      if (solDetail && solDetail.recentGainDate) {
        const topItems = solDetail.userCollectionTop?.list || []
        
        // 为物品添加图片URL，优先使用接口返回的 pic 字段
        const itemsWithImages = topItems.map((item) => {
          const objectName = item.objectName || '未知物品'
          let imageUrl = null
          
          // 优先使用接口返回的 pic 字段
          if (item.pic) {
            imageUrl = item.pic
          } else {
            // 如果没有 pic，尝试通过 objectID 构造
            const objectID = item.objectID || item.itemId || item.objectId
            if (objectID) {
              imageUrl = `https://playerhub.df.qq.com/playerhub/60004/object/${String(objectID)}.png`
            }
          }
          
          return {
            objectName: objectName,
            price: parseFloat(item.price || 0).toLocaleString(),
            count: item.count || 0,
            imageUrl: imageUrl
          }
        })
        
        templateData.solDetail = {
          recentGainDate: solDetail.recentGainDate || '-',
          recentGain: solDetail.recentGain?.toLocaleString() || '0',
          topItems: itemsWithImages
        }
      } else if (!mpDetail) {
        templateData.solDetail = null
      }
      
      const pushToGroups = userConfig.push_to.group || [];
      for (const groupId of pushToGroups) {
        try {
          const group = await Bot.pickGroup(Number(groupId));
          
          // 创建模拟的 e 对象用于渲染
          const Runtime = (await import('../../../../lib/plugins/runtime.js')).default;
          const mockE = {
            user_id: Number(userId),
            group_id: Number(groupId),
            isGroup: true,
            sender: {
              card: userConfig.nickname || userId,
              nickname: userConfig.nickname || userId
            }
          };
          const runtime = new Runtime(mockE);
          mockE.runtime = runtime;

          // 渲染模板，获取 base64 图片
          const base64Image = await Render.render('Template/dailyReport/dailyReport', templateData, {
            e: mockE,
            retType: 'base64'
          });

          if (base64Image) {
            await group.sendMsg([segment.at(Number(userId)), '\n您的日报来啦！', base64Image]);
            logger.debug(`[日报推送] 已成功向群 ${groupId} 推送用户 ${userId} 的日报`);
          } else {
            logger.error(`[日报推送] 用户 ${userId} 日报渲染失败`);
          }
        } catch (e) {
          logger.error(`[日报推送] 向群 ${groupId} 推送用户 ${userId} 日报时失败: ${e.message}`);
        }
      }
    }
    logger.info('[DELTA FORCE] 日报推送任务执行完毕。');
  }
}
