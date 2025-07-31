import schedule from 'node-schedule';
import lodash from 'lodash';
import fs from 'fs';
import Config from '../components/Config.js';
import Code from '../components/Code.js';
import utils from '../utils/utils.js';

let schedulerJob = null; // 低频调度器任务
let pusherJob = null;    // 高频推送器任务
const scheduledKeyPrefix = 'delta-force:place:scheduled:'; // Redis中待推送任务的前缀

/**
 * 任务一: 低频调度器 (由用户Cron配置触发)
 * - 从API同步状态
 * - 在Redis中添加/更新需要推送的任务及其精准的完成时间戳
 * - 清理已取消的任务
 */
async function pollAndScheduleTasks() {
  logger.info('[特勤处调度器] 开始同步API状态并调度任务...');

  const config = Config.loadYAML(Config.fileMaps.config) || {};
  const placePushConfig = config?.delta_force?.push_place_status || {};

  if (!placePushConfig.enabled) {
    return;
  }

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
        .filter(p => p.objectDetail && p.leftTime > 0) // 只关心正在生产的
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
        
        await redis.set(key, payload); // 直接覆盖写入，无需TTL
        scheduledTasks.delete(placeId); // 从待清理map中移除
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
async function checkAndPushScheduledTasks() {
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
            // 显式将 userId 转为数字以确保 segment.at 正常工作
            await group.sendMsg([segment.at(Number(task.userId)), ` ${msg}`]);
          } catch (e) {
            logger.error(`[特勤处推送器] 推送到群 ${groupId} 失败: ${e.message}`);
          }
        }
        await redis.del(key); // 推送后立即删除
      }
    } catch (e) {
      logger.error(`[特勤处推送器] 处理任务 ${key} 时出错: ${e.message}`);
      await redis.del(key); // 出错的任务也删除，防止卡死
    }
  }
}

/**
 * 重新安排所有定时任务
 */
function rescheduleTasks() {
  if (schedulerJob) schedulerJob.cancel();
  if (pusherJob) pusherJob.cancel();
  
  const config = Config.loadYAML(Config.fileMaps.config) || {};
  const placePushConfig = config?.delta_force?.push_place_status || {};
  
  if (placePushConfig.enabled) {
    // 启动高频推送器 (固定10秒)
    pusherJob = schedule.scheduleJob('*/10 * * * * *', () => checkAndPushScheduledTasks());
    logger.mark(`[特勤处推送器] 任务已启动，固定10秒执行一次`);

    try {
      let cron = String(placePushConfig.cron || '*/5 * * * *');
      if (cron.includes('?')) {
        cron = cron.replace(/\?/g, '*');
        const cronParts = cron.split(' ').filter(p => p);
        if (cronParts.length === 7) {
            cron = cronParts.slice(0, 6).join(' ');
        }
      }
      schedulerJob = schedule.scheduleJob(cron, () => pollAndScheduleTasks());
      logger.mark(`[特勤处调度器] 任务已启动，Cron: ${cron}`);
    } catch (err) {
      logger.error(`[特勤处调度器] 定时任务启动失败: ${err.message}`);
    }
  } else {
    logger.mark('[特勤处推送] 功能未开启，所有相关任务均未启动。');
  }
}

/**
 * 监控配置文件变化
 */
function watchConfig() {
  const configPath = Config.fileMaps.config;
  const debouncedReschedule = lodash.debounce(() => {
      logger.mark('[特勤处推送] 配置文件更新，重新加载所有定时任务...');
      rescheduleTasks();
  }, 2000);
  
  try {
    fs.watch(configPath, (eventType) => {
        if (eventType === 'change') {
            debouncedReschedule();
        }
    });
  } catch (err) {
    logger.error(`[特勤处推送] 监视配置文件失败: ${err.message}`);
  }
}

// --- 启动初始化 ---
logger.mark('[DELTA FORCE PLUGIN] 初始化特勤处推送模块...');
rescheduleTasks();
watchConfig();