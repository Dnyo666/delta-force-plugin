import Config from '../components/Config.js';
import Code from '../components/Code.js';
import utils from '../utils/utils.js';
import DataManager from '../utils/Data.js';
import { normalizeCronExpression } from '../utils/cron.js';

export class DailyPush extends plugin {
  constructor() {
    super({
      name: '三角洲日报推送',
      dsc: '每日定时推送日报',
      event: 'none', // 这是一个后台任务，不响应任何消息
    });

    // 在启动时从用户配置读取cron
    const dailyConfig = Config.getConfig()?.delta_force?.push_daily_report || {};
    
    this.task = {
      name: '三角洲日报推送任务',
      // 使用通用的规范化函数
      cron: normalizeCronExpression(dailyConfig.cron || '0 0 10 * * ?'), 
      fnc: () => this.pushDailyReports()
    };
  }

  async pushDailyReports() {
    // 1. 在执行时，获取最新的配置
    const config = Config.getConfig();
    const dailyReportConfig = config?.delta_force?.push_daily_report || {};

    // 2. 检查功能是否启用
    if (!dailyReportConfig.enabled) {
      return;
    }

    logger.info('[DELTA FORCE] 开始执行日报推送任务...');
    const api = new Code();

    // 3. 筛选出所有开启了此项推送的用户ID
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

      let msg = '【三角洲行动日报】\n';

      // --- 全面战场 ---
      if (mpDetail) {
        msg += '--- 全面战场 ---\n';
        msg += `日期: ${mpDetail.recentDate}\n`;
        msg += `总对局: ${mpDetail.totalFightNum} | 胜利: ${mpDetail.totalWinNum}\n`;
        msg += `总击杀: ${mpDetail.totalKillNum}\n`;
        msg += `总得分: ${mpDetail.totalScore?.toLocaleString()}\n`;
        const mostUsedOperator = DataManager.getOperatorName(mpDetail.mostUseForceType);
        msg += `最常用干员: ${mostUsedOperator}\n`;

        if (mpDetail.bestMatch) {
            const best = mpDetail.bestMatch;
            const bestMatchMap = DataManager.getMapName(best.mapID);
            msg += '--- 当日最佳 ---\n';
            msg += `地图: ${bestMatchMap} | 时间: ${best.dtEventTime}\n`;
            msg += `结果: ${best.isWinner ? '胜利' : '失败'} | KDA: ${best.killNum}/${best.death}/${best.assist}\n`;
            msg += `得分: ${best.score?.toLocaleString()}\n`;
        }
      }

      // --- 烽火地带 ---
      if (solDetail && solDetail.recentGainDate) {
        if (mpDetail) msg += '\n'; // 分割线
        msg += '--- 烽火地带 ---\n';
        msg += `日期: ${solDetail.recentGainDate}\n`;
        msg += `最近带出总价值: ${solDetail.recentGain?.toLocaleString()}\n`;

        const topItems = solDetail.userCollectionTop?.list;
        if (topItems && topItems.length > 0) {
            msg += '--- 近期高价值物资 ---\n';
            topItems.forEach(item => {
                const price = parseFloat(item.price).toLocaleString();
                msg += `${item.objectName}: ${price}\n`;
            });
        }
      } else if (!mpDetail) {
          if (mpDetail) msg += '\n';
          msg += '--- 烽火地带 ---\n最近没有对局';
      }
      
      const pushToGroups = userConfig.push_to.group || [];
      for (const groupId of pushToGroups) {
        try {
          const group = await Bot.pickGroup(Number(groupId));
          await group.sendMsg([segment.at(Number(userId)), `\n${msg.trim()}`]);
          logger.mark(`[日报推送] 已成功向群 ${groupId} 推送用户 ${userId} 的日报。`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (e) {
          logger.error(`[日报推送] 向群 ${groupId} 推送用户 ${userId} 日报时失败: ${e.message}`);
        }
      }
    }
    logger.info('[DELTA FORCE] 日报推送任务执行完毕。');
  }
} 