import Code from '../components/Code.js';
import lodash from 'lodash';
import { normalizeCronExpression } from '../utils/cron.js';
import Config from '../components/Config.js';

const config = Config.getConfig() || {};

// --- 插件主体，用于处理指令 ---
export class Task extends plugin {
  constructor() {
    super({
      name: '三角洲定时任务',
      dsc: '处理定时推送等任务',
      event: 'message',
      priority: 10,
      rule: [
        {
          reg: '^(#三角洲|\\^)(开启|关闭)每日密码推送$',
          fnc: 'toggleDailyKeywordPush'
        }
      ]
    });
    this.task = [];
    this.task.push({
      name: '[DELTA FORCE PLUGIN] 每日密码推送',
      cron: normalizeCronExpression(config.delta_force.push_daily_keyword.cron),
      fnc: () => this.pushDailyKeyword()
    })
  }

  async toggleDailyKeywordPush(e) {
    if (!e.isGroup) {
      return e.reply('该指令只能在群聊中使用。');
    }
    if (!e.group.pickMember(e.user_id).is_admin && !e.isMaster && !e.group.pickMember(e.user_id).is_owner) {
      return e.reply('抱歉，只有群管理员才能操作哦~');
    }

    const match = e.msg.match(this.rule[0].reg);
    const action = match[2];
    const groupId = String(e.group_id);

    if (!config.delta_force) config.delta_force = {};

    config.delta_force.push_daily_keyword = lodash.merge({
      enabled: false,
      cron: '0 8 * * *',
      push_to: { group: [], private: [] }
    }, config.delta_force.push_daily_keyword);

    const pushGroups = config.delta_force.push_daily_keyword.push_to.group.map(String);

    if (action === '开启') {
      if (pushGroups.includes(groupId)) {
        return e.reply('本群已经开启每日密码推送了。');
      }
      pushGroups.push(groupId);
      config.delta_force.push_daily_keyword.enabled = true;
    } else if (action === '关闭') {
      const index = pushGroups.indexOf(groupId);
      if (index === -1) {
        return e.reply('本群尚未开启每日密码推送。');
      }
      pushGroups.splice(index, 1);
    }

    config.delta_force.push_daily_keyword.push_to.group = pushGroups;

    if (Config.setConfig(config)) {
      await e.reply(`本群已成功${action}每日密码推送。`);
    } else {
      await e.reply('配置写入失败，请检查文件权限。');
    }

    return true;
  }

  /**
   * 执行每日密码推送
   */
  async pushDailyKeyword() {
    const api = new Code();
    const res = await api.getDailyKeyword();

    if (!res || (!res.success && res.code !== 0)) {
      logger.error('[DELTA FORCE PLUGIN] 推送每日密码失败：API请求出错');
      return;
    }

    const config = Config.loadYAML(Config.fileMaps.config) || {};
    const dailyKeywordConfig = config?.delta_force?.push_daily_keyword || {};

    if (res.data?.list?.length > 0) {
      let msg = '【每日密码】\n';
      res.data.list.forEach(item => {
        msg += `【${item.mapName}】: ${item.secret}\n`;
      });

      const pushTo = dailyKeywordConfig.push_to || {};

      if (pushTo.group && pushTo.group.length > 0) {
        for (const groupId of pushTo.group) {
          try {
            await Bot.pickGroup(Number(groupId)).sendMsg(msg.trim());
            logger.debug(`[DELTA FORCE PLUGIN] 推送每日密码到群 ${groupId} 成功`);
            await Bot.sleep(1000);
          } catch (e) {
            logger.error(`[DELTA FORCE PLUGIN] 推送每日密码到群 ${groupId} 失败: ${e.message}`);
          }
        }
      }

      if (pushTo.private && pushTo.private.length > 0) {
        for (const userId of pushTo.private) {
          try {
            await Bot.pickUser(Number(userId)).sendMsg(msg.trim());
            logger.debug(`[DELTA FORCE PLUGIN] 推送每日密码到用户 ${userId} 成功`);
            await Bot.sleep(1000);
          } catch (e) {
            logger.error(`[DELTA FORCE PLUGIN] 推送每日密码到用户 ${userId} 失败: ${e.message}`);
          }
        }
      }
    } else {
      logger.error(`[DELTA FORCE PLUGIN] 推送每日密码失败: ${res.msg || res.message || '暂无数据'}`);
    }
  }
}