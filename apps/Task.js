import plugin from '../../../lib/plugins/plugin.js';
import schedule from 'node-schedule';
import Config from '../components/Config.js';
import Code from '../components/Code.js';
import utils from '../utils/utils.js';
import lodash from 'lodash';
import fs from 'fs';

let job = null;
// 静态标志，用于确保任务只初始化一次
let isInitialized = false;

// 标准化cron表达式
function normalizeCron(cronExpression) {
  if (!cronExpression) return '0 8 * * *'; // 默认每天早上8点
  
  try {
    // 移除可能的问号和多余的字段，确保是标准的5段cron
    const cronParts = cronExpression.split(' ').filter(part => part !== '?');
    if (cronParts.length > 5) {
      // 如果超过5段，只保留前5段
      return cronParts.slice(0, 5).join(' ');
    }
    return cronExpression;
  } catch (err) {
    logger.error(`[DELTA FORCE PLUGIN] Cron表达式格式化失败: ${cronExpression}`, err);
    return '0 8 * * *'; // 出错时返回默认值
  }
}

export class Task extends plugin {
  constructor (e) {
    super({
      name: '三角洲定时任务',
      dsc: '处理定时推送等任务',
      event: 'message',
      priority: 10,
      rule: [
        {
            reg: '^(#三角洲|\\^)(开启|关闭)每日密码推送$',
            fnc: 'toggleDailyKeywordPush',
            permission: 'group.admin'
        }
      ]
    });

    this.e = e;
    this.api = new Code();
    
    // 仅在首次初始化时设置任务
    if (!isInitialized) {
      isInitialized = true;
      logger.mark('[DELTA FORCE PLUGIN] 初始化定时任务...');
      // 监视配置文件变化
      this.watchConfig();
      // 初始化时启动任务
      this.rescheduleTask();
    }
  }

  watchConfig() {
    const configPath = './plugins/delta-force-plugin/config/config/config.yaml';
    
    // lodash.debounce 避免在短时间内频繁触发
    const debouncedReschedule = lodash.debounce(() => {
        logger.mark('[DELTA FORCE PLUGIN] 配置文件更新，重新加载定时任务...');
        this.rescheduleTask();
    }, 2000);
    
    try {
      // 使用 fs.watch 监视文件变化
      fs.watch(configPath, (eventType) => {
          if (eventType === 'change') {
              logger.mark('[DELTA FORCE PLUGIN] config.yaml 文件变动，重新加载');
              debouncedReschedule();
          }
      });
    } catch (err) {
      logger.error(`[DELTA FORCE PLUGIN] 监视配置文件失败: ${err.message}`);
    }
  }

  rescheduleTask() {
    // 先取消已有的任务
    if (job) {
      job.cancel();
      job = null;
    }

    // 获取配置，优先使用嵌套格式
    const cfg = Config.getConfig()?.delta_force || {};
    let dailyKeywordConfig = cfg.push_daily_keyword || {};
    
    // 如果存在扁平格式的配置，将其转为嵌套格式
    if (cfg['push_daily_keyword.enabled'] !== undefined) {
      dailyKeywordConfig.enabled = cfg['push_daily_keyword.enabled'];
    }
    
    if (cfg['push_daily_keyword.cron'] !== undefined) {
      dailyKeywordConfig.cron = cfg['push_daily_keyword.cron'];
    }
    
    if (cfg['push_daily_keyword.push_to.group'] !== undefined) {
      if (!dailyKeywordConfig.push_to) dailyKeywordConfig.push_to = {};
      dailyKeywordConfig.push_to.group = cfg['push_daily_keyword.push_to.group'];
    }
    
    if (cfg['push_daily_keyword.push_to.private'] !== undefined) {
      if (!dailyKeywordConfig.push_to) dailyKeywordConfig.push_to = {};
      dailyKeywordConfig.push_to.private = cfg['push_daily_keyword.push_to.private'];
    }
    
    // 标准化cron表达式
    if (dailyKeywordConfig.cron) {
      dailyKeywordConfig.cron = normalizeCron(dailyKeywordConfig.cron);
    }
    
    // 记录当前配置用于调试
    logger.mark(`[DELTA FORCE PLUGIN] 配置已更新: ${JSON.stringify(dailyKeywordConfig)}`);

    if (dailyKeywordConfig && dailyKeywordConfig.enabled) {
      try {
        const cronExpression = dailyKeywordConfig.cron || '0 8 * * *';
        job = schedule.scheduleJob(cronExpression, async () => {
          logger.mark('[DELTA FORCE PLUGIN] 开始执行每日密码推送任务');
          await this.pushDailyKeyword();
        });
        logger.mark(`[DELTA FORCE PLUGIN] 每日密码推送任务已启动，Cron: ${cronExpression}`);
      } catch (err) {
        logger.error(`[DELTA FORCE PLUGIN] 定时任务启动失败: ${err.message}`);
      }
    } else {
      logger.mark('[DELTA FORCE PLUGIN] 每日密码推送任务未开启。');
    }
  }

  async pushDailyKeyword() {
    const res = await this.api.getDailyKeyword();
    
    if (await utils.handleApiError(res, {})) {
        logger.error('[DELTA FORCE PLUGIN] 推送每日密码失败：API请求出错');
        return;
    }
    
    // 获取最新配置，优先使用嵌套格式
    const cfg = Config.getConfig()?.delta_force || {};
    let dailyKeywordConfig = cfg.push_daily_keyword || {};
    
    // 如果存在扁平格式的配置，将其转为嵌套格式
    if (cfg['push_daily_keyword.push_to.group'] !== undefined) {
      if (!dailyKeywordConfig.push_to) dailyKeywordConfig.push_to = {};
      dailyKeywordConfig.push_to.group = cfg['push_daily_keyword.push_to.group'];
    }
    
    if (cfg['push_daily_keyword.push_to.private'] !== undefined) {
      if (!dailyKeywordConfig.push_to) dailyKeywordConfig.push_to = {};
      dailyKeywordConfig.push_to.private = cfg['push_daily_keyword.push_to.private'];
    }
    
    if (res && (res.code === 0 || res.success) && res.data?.list?.length > 0) {
      let msg = '【每日密码】\n';
      res.data.list.forEach(item => {
        msg += `【${item.mapName}】: ${item.secret}\n`;
      });

      const pushTo = dailyKeywordConfig.push_to || {};

      // 推送到群组
      if (pushTo.group && pushTo.group.length > 0) {
        for (const groupId of pushTo.group) {
          try {
            await Bot.pickGroup(Number(groupId)).sendMsg(msg.trim());
            await new Promise(resolve => setTimeout(resolve, 2000));
          } catch (e) {
            logger.error(`[DELTA FORCE PLUGIN] 推送每日密码到群 ${groupId} 失败: ${e.message}`);
          }
        }
      }
      
      // 推送到私聊
      if (pushTo.private && pushTo.private.length > 0) {
        for (const userId of pushTo.private) {
            try {
                await Bot.pickUser(Number(userId)).sendMsg(msg.trim());
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch(e) {
                logger.error(`[DELTA FORCE PLUGIN] 推送每日密码到用户 ${userId} 失败: ${e.message}`);
            }
        }
      }
    } else {
      logger.error(`[DELTA FORCE PLUGIN] 推送每日密码失败: ${res.msg || res.message || '暂无数据'}`);
    }
  }

  async toggleDailyKeywordPush() {
    if (!this.e.isGroup) {
        await this.e.reply('该指令只能在群聊中使用。');
        return true;
    }

    const match = this.e.msg.match(this.rule[0].reg);
    const action = match[2];
    const groupId = this.e.group_id;

    const config = Config.getConfig();
    
    // 确保配置结构完整
    if (!config.delta_force.push_daily_keyword) {
        config.delta_force.push_daily_keyword = {
            enabled: false,
            cron: '0 8 * * *',
            push_to: { group: [], private: [] }
        };
    } else if (!config.delta_force.push_daily_keyword.push_to) {
        config.delta_force.push_daily_keyword.push_to = { group: [], private: [] };
    }
    
    // 删除可能存在的扁平格式键
    delete config.delta_force['push_daily_keyword.enabled'];
    delete config.delta_force['push_daily_keyword.cron'];
    delete config.delta_force['push_daily_keyword.push_to.group'];
    delete config.delta_force['push_daily_keyword.push_to.private'];
    
    let pushGroups = config.delta_force.push_daily_keyword.push_to.group || [];
    
    // 确保是字符串数组
    pushGroups = pushGroups.map(String);

    if (action === '开启') {
        if (pushGroups.includes(String(groupId))) {
            await this.e.reply('本群已经开启每日密码推送了。');
        } else {
            pushGroups.push(String(groupId));
            config.delta_force.push_daily_keyword.push_to.group = pushGroups;
            if (Config.setConfig(config)) {
              await this.e.reply('本群已成功开启每日密码推送。\n将在每日设定时间自动发送，请确保总开关已开启。');
            } else {
              await this.e.reply('配置写入失败，请检查文件权限。');
            }
        }
    } else if (action === '关闭') {
        const index = pushGroups.indexOf(String(groupId));
        if (index > -1) {
            pushGroups.splice(index, 1);
            config.delta_force.push_daily_keyword.push_to.group = pushGroups;
            if (Config.setConfig(config)) {
              await this.e.reply('本群已成功关闭每日密码推送。');
            } else {
              await this.e.reply('配置写入失败，请检查文件权限。');
            }
        } else {
            await this.e.reply('本群尚未开启每日密码推送。');
        }
    }
    return true;
  }
} 