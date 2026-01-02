import utils from '../../utils/utils.js'
import Code from '../../components/Code.js'
import DataManager from '../../utils/Data.js'
import lodash from 'lodash'
import Config from '../../components/Config.js'
import Render from '../../components/Render.js'

export class Daily extends plugin {
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

    // 获取用户信息（包括头像）
    let userName = e.sender.card || e.sender.nickname
    let userAvatar = ''
    try {
      const personalInfoRes = await this.api.getPersonalInfo(token)
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
      logger.debug(`[Daily] 获取用户信息失败:`, error)
    }

    // 构建模板数据
    const templateData = {
      type: 'daily',
      mode: mode,
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
      
      // 为物品添加图片URL
      // 优先使用接口返回的 pic 字段，如果没有则通过 objectID 构造
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
    } else if (mode === 'sol' || !mode) {
      // 无数据但需要显示烽火地带卡片
      templateData.solDetail = null
    }

    // 渲染模板
    return await Render.render('Template/dailyReport/dailyReport', templateData, {
      e: e,
      retType: 'default'
    })
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

    const recentGain = solDetail.recentGain || 0;
    const gainDate = solDetail.recentGainDate || '昨日';
    const topItems = solDetail.userCollectionTop.list || [];

    // 获取用户信息（包括头像）
    let userName = e.sender.card || e.sender.nickname
    let userAvatar = ''
    try {
      const personalInfoRes = await this.api.getPersonalInfo(token)
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
      logger.debug(`[Daily] 获取用户信息失败:`, error)
    }

    // 构建模板数据
    const templateData = {
      type: 'profit',
      userName: userName,
      userAvatar: userAvatar,
      profitData: {
        gainDate: gainDate,
        recentGain: recentGain,
        topItems: topItems.slice(0, 3).map(item => ({
          objectName: item.objectName || '未知物品',
          price: parseFloat(item.price || 0).toLocaleString(),
          count: item.count || 0
        }))
      }
    }

    // 渲染模板
    return await Render.render('Template/dailyReport/dailyReport', templateData, {
      e: e,
      retType: 'default'
    });
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