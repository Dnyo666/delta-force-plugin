import Config from '../components/Config.js';
import Code from '../components/Code.js';
import utils from '../utils/utils.js';

const scheduledKeyPrefix = 'delta-force:place:scheduled:'; // Redis中待推送任务的前缀

export class PlaceTask extends plugin {
  constructor() {
    super({
      name: '三角洲特勤处推送',
      dsc: '处理特勤处完成状态的定时推送',
      event: 'none',
      priority: 50,
    });

    const config = Config.getConfig() || {};
    const placePushConfig = config?.delta_force?.push_place_status || {};

    this.task = [];
    
    // 使用Yunzai标准方式注册任务
    // 任务一: 高频推送器
    this.task.push({
      name: '[DELTA FORCE] 特勤处高频推送器',
      cron: '*/10 * * * * *', // 固定每10秒执行一次
      fnc: () => this.checkAndPushScheduledTasks(),
      log: false, // 避免刷屏
    });

    // 任务二: 低频调度器
    this.task.push({
      name: '[DELTA FORCE] 特勤处低频调度器',
      // Cron表达式从配置读取，提供默认值
      cron: this.normalizeCron(placePushConfig.cron || '*/5 * * * *'),
      fnc: () => this.pollAndScheduleTasks(),
    });

  }

  /**
   * 规范化cron表达式，以兼容Yunzai的调度器
   * @param {string} cron - cron表达式
   */
  normalizeCron(cron) {
    if (!cron) return '*/5 * * * *';
    let normalized = String(cron).replace(/\?/g, '*');
    const parts = normalized.split(' ').filter(p => p);
    if (parts.length === 7) {
      normalized = parts.slice(0, 6).join(' ');
    }
    return normalized;
  }
  
  /**
   * 任务一: 低频调度器 (由用户Cron配置触发)
   * - 从API同步状态
   * - 在Redis中添加/更新需要推送的任务及其精准的完成时间戳
   * - 清理已取消的任务
   */
  async pollAndScheduleTasks() {
    // 在执行时重新加载配置，确保读取最新状态
    const config = Config.loadYAML(Config.fileMaps.config) || {};
    const placePushConfig = config?.delta_force?.push_place_status || {};

    if (!placePushConfig.enabled) {
      return; // 如果被禁用，则不执行
    }
    
    logger.info('[特勤处调度器] 开始同步API状态并调度任务...');

    const api = new Code();
    const enabledUserIds = Object.keys(placePushConfig).filter(key => key.match(/^\d+$/) && placePushConfig[key].enabled);

    for (const userId of enabledUserIds) {
      const userConfig = placePushConfig[userId];
      const pushToGroups = userConfig.push_to.group || [];
      if (pushToGroups.length === 0) continue;

      const token = await utils.getAccount(userId);
      if (!token) continue;

      try {
        const apiResponse = await api.getPlaceStatus(token);
        if (!apiResponse || !apiResponse.success || !apiResponse.data || !apiResponse.data.places) {
          logger.warn(`[特勤处调度器] 用户 ${userId} API数据异常，跳过`);
          continue;
        }

        const apiTasks = new Map(apiResponse.data.places
          .filter(p => p.objectDetail && p.leftTime > 0)
          .map(p => [p.id, p])
        );
        
        const scheduledKeys = await redis.keys(`${scheduledKeyPrefix}${userId}:*`);
        const scheduledTasks = new Map(scheduledKeys.map(key => [key.split(':')[4], key]));

        // 1. 新增或更新任务到"任务清单"
        for (const [placeId, task] of apiTasks.entries()) {
          const key = `${scheduledKeyPrefix}${userId}:${placeId}`;
          const finishTimestamp = Date.now() + (task.leftTime * 1000);
          
          const payload = JSON.stringify({
              userId,
              placeId,
              objectName: task.objectDetail.objectName,
              pushToGroups,
              finishTimestamp
          });
          
          await redis.set(key, payload);
          scheduledTasks.delete(placeId);
        }

        // 2. 清理API中已不存在的任务
        for (const [placeId, key] of scheduledTasks.entries()) {
            logger.info(`[特勤处调度器] 任务 ${userId}:${placeId} 已不存在，从清单中移除`);
            await redis.del(key);
        }

      } catch (e) {
        logger.error(`[特勤处调度器] 处理用户 ${userId} 时出错: ${e.message}`);
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  /**
   * 任务二: 高频推送器 (固定10秒一次)
   * - 检查Redis"任务清单"
   * - 推送时间戳已到期的任务
   * - 推送后删除任务
   */
  async checkAndPushScheduledTasks() {
    // 再次检查总开关，确保在功能关闭后不会执行推送
    const config = Config.loadYAML(Config.fileMaps.config) || {};
    if (!config?.delta_force?.push_place_status?.enabled) {
      return;
    }

    const keys = await redis.keys(`${scheduledKeyPrefix}*`);
    if (keys.length === 0) return;

    for (const key of keys) {
      const payload = await redis.get(key);
      if (!payload) continue;

      try {
        const task = JSON.parse(payload);
        
        if (task.finishTimestamp <= Date.now()) {
          logger.mark(`[特勤处推送器] 发现到期任务: ${key}, 推送给 ${task.userId}`);
          const msg = `您的 ${task.objectName} 已在特勤处生产完成！`;

          for (const groupId of task.pushToGroups) {
            try {
              const group = await Bot.pickGroup(Number(groupId));
              await group.sendMsg([segment.at(Number(task.userId)), ` ${msg}`]);
            } catch (e) {
              logger.error(`[特勤处推送器] 推送到群 ${groupId} 失败: ${e.message}`);
            }
          }
          await redis.del(key);
        }
      } catch (e) {
        logger.error(`[特勤处推送器] 处理任务 ${key} 时出错: ${e.message}`);
        await redis.del(key);
      }
    }
  }
}