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
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^\\^测试日报推送$',
          fnc: 'testDailyPush'
        }
      ]
    });

    const dailyConfig = Config.getConfig()?.delta_force?.push_daily_report || {};
    
    this.task = {
      name: '三角洲日报推送任务',
      cron: normalizeCronExpression(dailyConfig.cron || '0 0 10 * * ?'), 
      fnc: () => this.pushDailyReports()
    };
  }

  async testDailyPush(e) {
    if (!e.isGroup) {
      return e.reply('该指令只能在群聊中使用。');
    }

    const userId = String(e.user_id);
    const groupId = String(e.group_id);

    await e.reply('正在测试日报推送，请稍候...');

    const config = Config.getConfig();
    const dailyReportConfig = config?.delta_force?.push_daily_report || {};

    if (!dailyReportConfig.enabled) {
      return e.reply('日报推送功能当前未启用。');
    }

    const userConfig = dailyReportConfig[userId];
    if (!userConfig || !userConfig.enabled) {
      return e.reply('您尚未开启日报推送功能。');
    }

    const pushToGroups = userConfig.push_to?.group || [];
    if (!pushToGroups.includes(groupId)) {
      return e.reply('您尚未在本群开启日报推送。');
    }

    // 临时修改配置，只处理当前用户和当前群
    const originalConfig = { ...dailyReportConfig };
    const testConfig = {
      enabled: true,
      [userId]: {
        ...userConfig,
        push_to: {
          group: [groupId]
        }
      }
    };
    
    // 临时替换配置
    config.delta_force.push_daily_report = testConfig;
    
    try {
      // 调用推送方法
      await this.pushDailyReports();
      await e.reply('日报推送测试完成！');
    } catch (error) {
      logger.error(`[日报推送测试] 失败:`, error);
      await e.reply(`日报推送测试失败: ${error.message}`);
    } finally {
      // 恢复原配置
      config.delta_force.push_daily_report = originalConfig;
    }

    return true;
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
      
      // 获取昨天日期（格式：YYYYMMDD），日报推送通常是推送昨天的数据
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const year = yesterday.getFullYear()
      const month = String(yesterday.getMonth() + 1).padStart(2, '0')
      const day = String(yesterday.getDate()).padStart(2, '0')
      const yesterdayDate = `${year}${month}${day}`
      
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

      // 获取当前日期（格式：YYYY-MM-DD）用于头部显示
      const now = new Date()
      const currentDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

      // 构建模板数据
      const templateData = {
        type: 'daily',
        mode: '',
        userName: userName,
        userAvatar: userAvatar,
        currentDate: currentDateStr  // 头部显示的当前日期（YYYY-MM-DD）
      }

      // 处理全面战场数据
      // 查询全部模式，需要显示卡片
      // 判断是否有有效数据：recentDate 不为空且不为空字符串
      const hasValidMpData = mpDetail && 
        mpDetail.recentDate && 
        mpDetail.recentDate.trim() !== ''
      
      if (hasValidMpData) {
        const mostUsedOperator = DataManager.getOperatorName(mpDetail.mostUseForceType);
        
        // 获取干员图片路径（相对路径，模板中会自动添加 _res_path）
        const operatorImagePath = mostUsedOperator ? DataManager.getOperatorImagePath(mostUsedOperator) : null;
        
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
          const bestOperatorImage = bestOperator ? DataManager.getOperatorImagePath(bestOperator) : null;
          
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
      } else {
        // 没有数据，但需要显示卡片
        templateData.mpDetail = {
          isEmpty: true
        }
      }

      // 处理烽火地带数据
      // 查询全部模式，需要显示卡片
      // 判断是否有有效数据：recentGainDate 不为空且不为空字符串
      const hasValidSolData = solDetail && 
        solDetail.recentGainDate && 
        solDetail.recentGainDate.trim() !== ''
      
      if (hasValidSolData) {
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
      } else {
        // 没有数据，但需要显示卡片
        templateData.solDetail = {
          isEmpty: true
        }
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
