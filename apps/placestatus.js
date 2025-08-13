import utils from '../utils/utils.js'
import Code from '../components/Code.js'
import Config from '../components/Config.js';
import lodash from 'lodash';

const scheduledKeyPrefix = 'delta-force:place:scheduled:';
const expireNotifiedKeyPrefix = 'delta-force:place:expire-notified:';

export class PlaceStatus extends plugin {
  constructor (e) {
    super({
      name: '三角洲特勤处状态',
      dsc: '查询特勤处设施的制造状态',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)(特勤处状态|placestatus)$',
          fnc: 'getPlaceStatus'
        },
        {
          reg: '^(#三角洲|\\^)(开启|关闭)特勤处推送$',
          fnc: 'togglePlaceStatusPush',
        }
       ]
    })
    this.e = e
    this.api = new Code(e)
  }

  async getPlaceStatus () {
    const token = await utils.getAccount(this.e.user_id)
    if (!token) {
      await this.e.reply('您尚未绑定账号，请使用 #三角洲登录 进行绑定。')
      return true
    }

    await this.e.reply('正在查询特勤处状态，请稍候...')

    const res = await this.api.getPlaceStatus(token)

    if (await utils.handleApiError(res, this.e)) return true

    if (!res.data || !res.data.places || !res.data.stats) {
      await this.e.reply(`查询失败: ${res.msg || 'API 返回数据格式不正确'}`)
      return true
    }
    
    const { places, stats } = res.data;
    
    if (places.length === 0) {
      await this.e.reply('未能查询到任何特勤处设施信息。')
      return true
    }

    // --- 构造转发消息 ---
    const forwardMsg = []
    const bot = global.Bot

    // --- 数据处理函数 ---
    const formatDuration = (seconds) => {
        if (!seconds || isNaN(seconds)) return 'N/A';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}小时${m}分钟${s}秒`;
    }
    
    // 添加消息头 - 总体状态
    const title = `总设施: ${stats.total} | 生产中: ${stats.producing} | 闲置: ${stats.idle}`;
    forwardMsg.push({
      message: title,
      nickname: bot.nickname,
      user_id: bot.uin
    });

    // 添加每个设施的状态到转发消息中
    places.forEach((place) => {
      let msg = `--- ${place.placeName} (Lv.${place.level}) ---\n`;
      if (place.objectDetail) {
        msg += `状态: 生产中\n`;
        msg += `物品: ${place.objectDetail.objectName}\n`;
        msg += `剩余时间: ${formatDuration(place.leftTime)}`;
      } else {
        msg += `状态: ${place.status}`;
      }
      
      forwardMsg.push({
        message: msg.trim(),
        nickname: bot.nickname,
        user_id: bot.uin
      })
    })
    
    // 创建合并转发消息
    const result = await this.e.reply(await bot.makeForwardMsg(forwardMsg), false, { recallMsg: 0 })

    if (!result) {
      await this.e.reply('生成转发消息失败，请联系管理员。')
    }

    return true
  }
  
  async togglePlaceStatusPush() {
    if (!this.e.isGroup) {
      await this.e.reply('该指令只能在群聊中使用。');
      return true;
    }
    
    const action = this.e.msg.includes('开启') ? '开启' : '关闭';
    const userId = String(this.e.user_id);
    const groupId = String(this.e.group_id);
    
    // 如果是开启操作，检查用户登录状态
    if (action === '开启') {
      const token = await utils.getAccount(this.e.user_id);
      if (!token) {
        await this.e.reply([segment.at(this.e.user_id), ' 您尚未绑定账号，请先使用 #三角洲登录 进行绑定后再开启特勤处推送。']);
        return true;
      }
      
      // 验证token是否有效
      const testResponse = await this.api.getPlaceStatus(token);
      if (!testResponse || !testResponse.success) {
        // 检查是否为登录失效错误
        if (testResponse?.data?.ret === 101 || 
            testResponse?.error?.includes('请先完成QQ或微信登录') || 
            testResponse?.message?.includes('请先登录') ||
            testResponse?.message?.includes('没有找到对应的有效登录数据')) {
          await this.e.reply([segment.at(this.e.user_id), ' 您的登录已过期，请先使用 #三角洲登录 重新登录后再开启特勤处推送。']);
          return true;
        }
        // 其他API错误也阻止开启
        await this.e.reply([segment.at(this.e.user_id), ' 检测到您的账号状态异常，请先确保能正常查询特勤处状态后再开启推送。']);
        return true;
      }
    }
    
    const config = Config.loadYAML(Config.fileMaps.config) || {};
    
    // 检查总开关
    if (!config?.delta_force?.push_place_status?.enabled) {
      await this.e.reply('特勤处推送功能当前未由机器人主人开启，请联系主人在配置文件中开启。');
      return true;
    }

    if (!config.delta_force) config.delta_force = {};
    if (!config.delta_force.push_place_status) config.delta_force.push_place_status = {};

    const userSettings = lodash.merge({
      enabled: false,
      push_to: { group: [] }
    }, config.delta_force.push_place_status[userId]);

    const pushGroups = userSettings.push_to.group.map(String);
    const groupIndex = pushGroups.indexOf(groupId);

    if (action === '开启') {
      if (groupIndex > -1) {
        return this.e.reply('本群已经开启了特勤处生产完成推送。');
      }
      pushGroups.push(groupId);
      userSettings.enabled = true; // 只要有一个群开启，总开关就开启
      userSettings.push_to.group = pushGroups;
      config.delta_force.push_place_status[userId] = userSettings;
      await this.e.reply('已为你在本群开启特勤处生产完成推送！');

    } else { // 关闭
      if (groupIndex === -1) {
        return this.e.reply('你尚未在本群开启特勤处生产完成推送。');
      }
      pushGroups.splice(groupIndex, 1);

      if (pushGroups.length === 0) {
        // 如果所有群都关闭了，直接删除该用户的配置项
        delete config.delta_force.push_place_status[userId];
        await this.e.reply('已为你关闭所有特勤处生产完成推送，配置已清除。');
        
        // 同时清理该用户在Redis中的所有待推送任务和过期通知标记
        try {
            const keysToDelete = await redis.keys(`${scheduledKeyPrefix}${userId}:*`);
            if (keysToDelete.length > 0) {
                await redis.del(keysToDelete);
                logger.mark(`[特勤处推送] 已清理用户 ${userId} 的 ${keysToDelete.length} 条待推送任务。`);
            }
            
            // 清理过期通知标记
            const expireKey = `${expireNotifiedKeyPrefix}${userId}`;
            const expireKeyExists = await redis.get(expireKey);
            if (expireKeyExists) {
                await redis.del(expireKey);
                logger.mark(`[特勤处推送] 已清理用户 ${userId} 的过期通知标记。`);
            }
        } catch(e) {
            logger.error(`[特勤处推送] 清理用户 ${userId} 的Redis数据时出错: ${e.message}`);
        }

      } else {
        // 否则，只更新群组列表
        userSettings.push_to.group = pushGroups;
        config.delta_force.push_place_status[userId] = userSettings;
        await this.e.reply('已为你在本群关闭特勤处生产完成推送。');
      }
    }
    
    Config.setConfig(config);
    
    return true;
  }
} 