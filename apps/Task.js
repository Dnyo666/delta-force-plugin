import utils from '../utils/utils.js'
import Code from '../components/Code.js';
import lodash from 'lodash';
import fs from 'fs';

let job = null;

/**
 * 执行每日密码推送
 */
async function pushDailyKeyword() {
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
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (e) {
          logger.error(`[DELTA FORCE PLUGIN] 推送每日密码到群 ${groupId} 失败: ${e.message}`);
        }
      }
    }
    
    if (pushTo.private && pushTo.private.length > 0) {
      for (const userId of pushTo.private) {
          try {
              await Bot.pickUser(Number(userId)).sendMsg(msg.trim());
              await new Promise(resolve => setTimeout(resolve, 1000));
          } catch(e) {
              logger.error(`[DELTA FORCE PLUGIN] 推送每日密码到用户 ${userId} 失败: ${e.message}`);
          }
      }
    }
  } else {
    logger.error(`[DELTA FORCE PLUGIN] 推送每日密码失败: ${res.msg || res.message || '暂无数据'}`);
  }
}

/**
 * 重新安排定时任务
 */
function rescheduleTask() {
  if (job) {
    job.cancel();
    job = null;
  }

  const config = Config.loadYAML(Config.fileMaps.config) || {};
  const dailyKeywordConfig = config?.delta_force?.push_daily_keyword || {};
  
  logger.mark(`[DELTA FORCE PLUGIN] 加载推送配置: ${JSON.stringify(dailyKeywordConfig)}`);

  if (dailyKeywordConfig.enabled) {
    try {
      // 最终修复: 将7位的Quartz cron表达式强制转换为6位的标准cron
      const cron = String(dailyKeywordConfig.cron || '')
        .replace('?', '*')
        .split(' ')
        .slice(0, 6)
        .join(' ');
        
      job = schedule.scheduleJob(cron, () => pushDailyKeyword());
      logger.mark(`[DELTA FORCE PLUGIN] 每日密码推送任务已启动，Cron: ${cron}`);
    } catch (err) {
      logger.error(`[DELTA FORCE PLUGIN] 定时任务启动失败，Cron表达式可能无效: ${err.message}`);
      logger.error(`[DELTA FORCE PLUGIN] 无效的Cron表达式: ${dailyKeywordConfig.cron}`);
    }
  } else {
    logger.mark('[DELTA FORCE PLUGIN] 每日密码推送任务未开启。');
  }
}

/**
 * 监控配置文件变化
 */
function watchConfig() {
  const configPath = './plugins/delta-force-plugin/config/config/config.yaml';
  const debouncedReschedule = lodash.debounce(() => {
      logger.mark('[DELTA FORCE PLUGIN] 配置文件更新，重新加载定时任务...');
      rescheduleTask();
  }, 2000);
  
  try {
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

// --- 插件主体，用于处理指令 ---
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
  }

  async toggleDailyKeywordPush() {
    if (!this.e.isGroup) {
      return this.e.reply('该指令只能在群聊中使用。');
    }
    if (!this.e.member.is_admin && !this.e.isMaster) {
      return this.e.reply('抱歉，只有群管理员才能操作哦~');
    }

    const match = this.e.msg.match(this.rule[0].reg);
    const action = match[2];
    const groupId = String(this.e.group_id);

    const config = Config.loadYAML(Config.fileMaps.config) || {};
    if (!config.delta_force) config.delta_force = {};

    config.delta_force.push_daily_keyword = lodash.merge({
      enabled: false,
      cron: '0 8 * * *',
      push_to: { group: [], private: [] }
    }, config.delta_force.push_daily_keyword);

    const pushGroups = config.delta_force.push_daily_keyword.push_to.group.map(String);

    if (action === '开启') {
        if (pushGroups.includes(groupId)) {
            return this.e.reply('本群已经开启每日密码推送了。');
        }
        pushGroups.push(groupId);
        config.delta_force.push_daily_keyword.enabled = true;
    } else if (action === '关闭') {
        const index = pushGroups.indexOf(groupId);
        if (index === -1) {
            return this.e.reply('本群尚未开启每日密码推送。');
        }
        pushGroups.splice(index, 1);
    }
    
    config.delta_force.push_daily_keyword.push_to.group = pushGroups;

    if (Config.setConfig(config)) {
      await this.e.reply(`本群已成功${action}每日密码推送。`);
    } else {
      await this.e.reply('配置写入失败，请检查文件权限。');
    }
    
    return true;
  }
}

// --- 启动初始化 ---
logger.mark('[DELTA FORCE PLUGIN] 初始化定时任务模块...');
rescheduleTask();
watchConfig(); 