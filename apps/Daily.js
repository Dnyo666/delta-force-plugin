import utils from '../utils/utils.js'
import Code from '../components/Code.js'
import DataManager from '../utils/Data.js'
import lodash from 'lodash'
import Config from '../components/Config.js'

export class Daily extends plugin {
  constructor(e) {
    super({
      name: '三角洲日报',
      dsc: '查询三角洲行动日报数据',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)(日报|daily)\\s*(.*)$',
          fnc: 'getDailyReport'
        },
        {
          reg: '^(#三角洲|\\^)(昨日收益|昨日物资)\\s*(.*)$',
          fnc: 'getYesterdayProfit'
        },
        {
          reg: '^(#三角洲|\\^)(开启|关闭)日报推送$',
          fnc: 'toggleDailyPush',
        }
      ]
    })
    this.api = new Code(e)
  }

  async getDailyReport(e) {
    const token = await utils.getAccount(e.user_id)
    if (!token) {
      await e.reply([segment.at(e.user_id), '您尚未绑定账号，请使用 #三角洲登录 进行绑定。'])
      return true
    }

    const match = e.msg.match(this.rule[0].reg)
    const argString = match[3] ? match[3].trim() : ''
    let mode = ''
    if (['烽火', '烽火地带', 'sol', '摸金'].includes(argString)) {
      mode = 'sol'
    } else if (['全面', '全面战场', '战场', 'mp'].includes(argString)) {
      mode = 'mp'
    }

    await e.reply('正在查询您的今日战报，请稍候...');

    // mode变量值作为type参数传递
    const res = await this.api.getDailyRecord(token, mode);

    if (await utils.handleApiError(res, e)) return true;

    if (!res.data) {
      await e.reply(`查询失败: ${res.msg || 'API 返回数据格式不正确'}`);
      return true;
    }

    let solDetail, mpDetail;

    if (mode) { // 指定模式查询
      const detailData = res.data?.data?.data;
      if (mode === 'sol') {
        solDetail = detailData?.solDetail;
      } else if (mode === 'mp') {
        mpDetail = detailData?.mpDetail;
      }
    } else { // 查询全部
      solDetail = res.data?.sol?.data?.data?.solDetail;
      mpDetail = res.data?.mp?.data?.data?.mpDetail;
    }


    if (!solDetail && !mpDetail) {
      await e.reply('暂无日报数据，不打两把吗？')
      return true
    }

    let msg = '【三角洲行动日报】\n'

    // --- 全面战场 ---
    if (mpDetail) {
      msg += '--- 全面战场 ---\n'
      msg += `日期: ${mpDetail.recentDate}\n`
      msg += `总对局: ${mpDetail.totalFightNum} | 胜利: ${mpDetail.totalWinNum}\n`
      msg += `总击杀: ${mpDetail.totalKillNum}\n`
      msg += `总得分: ${mpDetail.totalScore?.toLocaleString()}\n`
      const mostUsedOperator = DataManager.getOperatorName(mpDetail.mostUseForceType);
      msg += `最常用干员: ${mostUsedOperator}\n`;

      if (mpDetail.bestMatch) {
        const best = mpDetail.bestMatch
        const bestMatchMap = DataManager.getMapName(best.mapID);
        msg += '--- 当日最佳 ---\n'
        msg += `地图: ${bestMatchMap} | 时间: ${best.dtEventTime}\n`
        msg += `结果: ${best.isWinner ? '胜利' : '失败'} | KDA: ${best.killNum}/${best.death}/${best.assist}\n`
        msg += `得分: ${best.score?.toLocaleString()}\n`
      }
    }

    // --- 烽火地带 ---
    if (solDetail && solDetail.recentGainDate) {
      if (mpDetail) msg += '\n' // 分割线
      msg += '--- 烽火地带 ---\n'
      msg += `日期: ${solDetail.recentGainDate}\n`
      msg += `最近带出总价值: ${solDetail.recentGain?.toLocaleString()}\n`

      const topItems = solDetail.userCollectionTop?.list
      if (topItems && topItems.length > 0) {
        msg += '--- 近期高价值物资 ---\n'
        topItems.forEach(item => {
          const price = parseFloat(item.price).toLocaleString()
          msg += `${item.objectName}: ${price}\n`
        })
      }
    } else if (mode === 'sol' || !mode) {
      if (mpDetail) msg += '\n';
      msg += '--- 烽火地带 ---\n最近没有对局';
    }

    return e.reply([segment.at(e.user_id), msg.trim()])
  }

  async getYesterdayProfit(e) {
    const token = await utils.getAccount(e.user_id)
    if (!token) {
      await e.reply('您尚未绑定账号，请使用 #三角洲登录 进行绑定。')
      return true
    }

    await e.reply('正在查询您的昨日收益数据，请稍候...');

    // 默认不传模式参数，查询全部数据
    const res = await this.api.getDailyRecord(token);

    if (await utils.handleApiError(res, e)) return true;

    if (!res.data) {
      return e.reply(`查询失败: ${res.msg || 'API 返回数据格式不正确'}`);
    }

    // 获取烽火地带数据
    const solDetail = res.data?.sol?.data?.data?.solDetail;

    if (!solDetail || !solDetail.userCollectionTop || !solDetail.userCollectionTop.list) {
      return e.reply('暂无昨日收益数据，快去摸金吧！');
    }

    const recentGain = solDetail.recentGain;
    const gainDate = solDetail.recentGainDate || '昨日';
    const topItems = solDetail.userCollectionTop.list;

    let msg = `【${gainDate}收益TOP3物资】\n`;

    // 处理并显示TOP物资
    if (topItems && topItems.length > 0) {
      topItems.forEach((item, index) => {
        const price = parseFloat(item.price).toLocaleString();
        msg += `${index + 1}. 【${item.objectName}*${item.count}】${price}\n`;
      });

      // 添加总收益
      const gainPrefix = recentGain >= 0 ? '+' : '';
      msg += `\n${gainDate}总收益: ${gainPrefix}${recentGain?.toLocaleString()}`;
    } else {
      msg += '昨日未带出任何高价值物资\n';
      msg += `${gainDate}总收益: ${recentGain?.toLocaleString()}`;
    }

    return e.reply([segment.at(e.user_id), msg.trim()]);
  }

  async toggleDailyPush(e) {
    if (!e.isGroup) {
      return e.reply('该指令只能在群聊中使用。');
    }
    
    const action = e.msg.includes('开启') ? '开启' : '关闭';
    const userId = String(e.user_id);
    const groupId = String(e.group_id);
    
    const config = Config.getConfig() || {};
    
    if (!config?.delta_force?.push_daily_report?.enabled) {
      return e.reply('日报推送功能当前未由机器人主人开启。');
    }

    if (!config.delta_force) config.delta_force = {};
    if (!config.delta_force.push_daily_report) config.delta_force.push_daily_report = {};

    const userSettings = lodash.merge({
      enabled: false,
      push_to: { group: [] }
    }, config.delta_force.push_daily_report[userId]);

    const pushGroups = userSettings.push_to.group.map(String);
    const groupIndex = pushGroups.indexOf(groupId);

    if (action === '开启') {
      if (groupIndex > -1) {
        return e.reply('本群已经为您开启了日报推送。');
      }
      pushGroups.push(groupId);
      userSettings.enabled = true;
      userSettings.nickname = e.sender.card || e.sender.nickname;
      userSettings.push_to.group = pushGroups;
      config.delta_force.push_daily_report[userId] = userSettings;

      const cron = config.delta_force.push_daily_report.cron || '';
      let timeInfo = '';
      if (cron) {
          const parts = cron.split(' ');
          if (parts.length >= 3 && !isNaN(parts[1]) && !isNaN(parts[2])) {
              timeInfo = ` (每日${parts[2]}:${parts[1].padStart(2, '0')})`;
          }
      }
      await e.reply(`已为您在本群开启日报推送！${timeInfo}`);

    } else { // 关闭
      if (groupIndex === -1) {
        return e.reply('您尚未在本群开启日报推送。');
      }
      pushGroups.splice(groupIndex, 1);

      if (pushGroups.length === 0) {
        delete config.delta_force.push_daily_report[userId];
        await e.reply('已为您关闭所有日报推送。');
      } else {
        userSettings.push_to.group = pushGroups;
        config.delta_force.push_daily_report[userId] = userSettings;
        await e.reply('已为您在本群关闭日报推送。');
      }
    }
    
    Config.setConfig(config);
    return true;
  }
} 