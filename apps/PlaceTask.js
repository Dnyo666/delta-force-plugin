import schedule from 'node-schedule';
import lodash from 'lodash';
import fs from 'fs';
import Config from '../components/Config.js';
import Code from '../components/Code.js';
import utils from '../utils/utils.js';

let mainJob = null;
const redisKeyPrefix = 'df:place:finish:';

/**
 * =================================================================================
 * [重要] 前置设置:
 * 请确保你的 Redis 已开启键空间通知 (Keyspace Notifications)。
 * 修改 redis.conf 文件或通过 redis-cli 执行:
 * 
 * redis-cli> config set notify-keyspace-events KEA
 * 
 * KEA 表示开启键(keyspace)、键事件(keyevent)和通用命令(all)的通知。
 * 否则，本文件的生产完成推送功能将无法工作！
 * =================================================================================
 */

/**
 * 格式化剩余时间用于日志和消息
 * @param {number} seconds
 */
function formatDuration(seconds) {
    if (!seconds || isNaN(seconds)) return 'N/A';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.round(seconds % 60);
    return `${h}小时${m}分钟${s}秒`;
}

/**
 * 调度一个生产完成的提醒任务 (通过Redis TTL)
 * @param {object} taskDetails - 包含任务详情的对象
 */
async function scheduleProductionFinish(taskDetails) {
  const { userId, placeId, leftTime, objectName, pushToGroups } = taskDetails;
  
  if (!leftTime || leftTime <= 0) {
    logger.debug(`[特勤处推送] 任务 ${userId}-${placeId} 剩余时间为0，跳过调度`);
    return;
  }
  
  const redisKey = `${redisKeyPrefix}${userId}:${placeId}`;
  const payload = JSON.stringify({ userId, objectName, pushToGroups });

  try {
    // 使用 SETEX 原子化地设置键、过期时间和值
    await redis.setex(redisKey, Math.round(leftTime), payload);
    logger.mark(`[特勤处推送] 已调度生产完成提醒: 用户[${userId}]的[${objectName}]将在 ${formatDuration(leftTime)} 后完成`);
  } catch (err) {
    logger.error(`[特勤处推送] Redis 任务调度失败: ${err.message}`);
  }
}

/**
 * 主扫描任务，由Cron定时触发
 */
async function scanPlaceStatus() {
  logger.info('[特勤处推送] 开始执行主扫描任务...');
  
  const config = Config.loadYAML(Config.fileMaps.config) || {};
  const placePushConfig = config?.delta_force?.push_place_status || {};

  if (!placePushConfig.enabled) {
    logger.info('[特勤处推送] 功能未启用，跳过本次扫描');
    return;
  }

  const api = new Code();
  const userIds = Object.keys(placePushConfig).filter(key => key.match(/^\d+$/) && placePushConfig[key].enabled);

  logger.info(`[特勤处推送] 发现 ${userIds.length} 位用户开启了推送`);

  for (const userId of userIds) {
    const userConfig = placePushConfig[userId];
    const pushToGroups = userConfig.push_to.group || [];
    
    if (pushToGroups.length === 0) {
      logger.debug(`[特勤处推送] 用户 ${userId} 未配置任何推送群组，跳过`);
      continue;
    }

    const token = await utils.getAccount(userId); // 使用默认token
    if (!token) {
      logger.warn(`[特勤处推送] 获取用户 ${userId} 的Token失败，跳过`);
      continue;
    }
    
    try {
      const res = await api.getPlaceStatus(token);
      if (res && res.success && res.data && res.data.places) {
        for (const place of res.data.places) {
          if (place.objectDetail && place.leftTime > 0) {
            // 如果这个生产任务已经在Redis里了，就不重复设置，避免覆盖
            const redisKey = `${redisKeyPrefix}${userId}:${place.id}`;
            const ttl = await redis.ttl(redisKey);
            if (ttl > 0) {
              logger.debug(`[特勤处推送] 任务 ${redisKey} 已在调度中 (剩余 ${ttl}s)，本次跳过`);
              continue;
            }

            await scheduleProductionFinish({
              userId,
              placeId: place.id,
              leftTime: place.leftTime,
              objectName: place.objectDetail.objectName,
              pushToGroups
            });
          }
        }
      } else {
        logger.warn(`[特勤处推送] 查询用户 ${userId} 特勤处状态失败: ${res.msg || 'API返回数据异常'}`);
      }
    } catch (e) {
      logger.error(`[特勤处推送] 处理用户 ${userId} 时发生错误: ${e.message}`);
    }
    
    // 短暂延迟，避免请求过于频繁
    await new Promise(resolve => setTimeout(resolve, 2000)); 
  }
  logger.info('[特勤处推送] 主扫描任务执行完毕');
}

/**
 * 监听Redis键过期事件
 */
async function listenExpiredKeys() {
    // 创建一个专用的Redis客户端用于订阅
    const subscriber = redis.duplicate();
    await subscriber.connect();

    // 订阅key过期事件
    await subscriber.pSubscribe('__keyevent@*__:expired', async (key) => {
        if (key.startsWith(redisKeyPrefix)) {
            logger.mark(`[特勤处推送] 监听到过期键: ${key}`);
            try {
                // 注意：键过期后值已不存在，所以我们需要在设置时将信息编码到键本身
                const payloadStr = await redis.get(`payload:${key}`); // 假设我们用另一个键存payload
                // 更好的方法是在设置时就将所有信息存好，然后在过期时从一个持久化的地方读取
                // 然而，最简单的方法是，我们已经将信息编码在键名里了
                const keyParts = key.replace(redisKeyPrefix, '').split(':');
                const userId = keyParts[0];
                const placeId = keyParts[1];
                
                // 我们需要在scan时获取objectName并存入redis
                const finishedTaskPayload = await redis.get(`temp:${key}`); // 临时获取一下
                 if (!finishedTaskPayload) {
                    // 这是一个问题，因为值已经没了。我们需要在scan时将所有信息存入一个hash
                    // 简化逻辑：我们从redis获取之前存的payload
                    //
                    // 正确的逻辑：
                    // 当我们setex时，我们拿不到value。所以我们需要在setex之前，就把payload存起来
                    // 我们可以在scanPlaceStatus时，在scheduleProductionFinish里做这个事
                    // 但是，既然值已经没了，我们无法获取 objectName 和 pushToGroups
                    // 
                    // 解决方案：当键过期时，我们重新查询一次用户状态，找到完成的那个
                    // 这不是最高效的，但是最可靠
                    
                    // 妥协方案：在设置TTL时，将payload也存入一个不会过期的hash中
                    // HSET df:place:payloads "userId:placeId" "JSON_PAYLOAD"
                    
                    const payload = await redis.get(`payload:${userId}:${placeId}`);
                    if (payload) {
                        const { objectName, pushToGroups } = JSON.parse(payload);
                        const msg = `[生产完成] @${userId} 您的 ${objectName} 已在特勤处生产完成！`;
                        
                        for (const groupId of pushToGroups) {
                            try {
                                const group = await Bot.pickGroup(Number(groupId));
                                await group.sendMsg(msg);
                                logger.info(`[特勤处推送] 已成功推送完成提醒到群 ${groupId}`);
                            } catch (e) {
                                logger.error(`[特勤处推送] 推送到群 ${groupId} 失败: ${e.message}`);
                            }
                        }
                        await redis.del(`payload:${userId}:${placeId}`);
                    }

                }
            } catch (e) {
                logger.error(`[特勤处推送] 处理过期键 ${key} 失败: ${e.message}`);
            }
        }
    });

    logger.mark('[特勤处推送] 已启动Redis键过期事件监听');
}

/**
 * 处理Redis键过期事件 (备用方法，不依赖订阅)
 * 这个方法更可靠，因为它不依赖于可能被禁用的keyspace通知
 * 而是通过短间隔轮询来实现
 */
 
// 我们将采用更简单的逻辑，在主任务中直接处理
// 放弃Keyspace通知，因为它配置复杂且不可靠

// 新的、简化的主任务逻辑
async function simpleScanAndNotify() {
    logger.info('[特勤处推送] 开始执行主扫描任务...');
    
    const config = Config.loadYAML(Config.fileMaps.config) || {};
    const placePushConfig = config?.delta_force?.push_place_status || {};

    if (!placePushConfig.enabled) {
      logger.info('[特勤处推送] 功能未启用，跳过本次扫描');
      return;
    }

    const api = new Code();
    const userIds = Object.keys(placePushConfig).filter(key => key.match(/^\d+$/) && placePushConfig[key].enabled);
    
    for (const userId of userIds) {
        const userConfig = placePushConfig[userId];
        const pushToGroups = userConfig.push_to.group || [];
        if (pushToGroups.length === 0) continue;

        const token = await utils.getAccount(userId);
        if (!token) continue;
        
        try {
            const res = await api.getPlaceStatus(token);
            if (res && res.success && res.data && res.data.places) {
                for (const place of res.data.places) {
                    const redisKey = `${redisKeyPrefix}${userId}:${place.id}`;
                    
                    if (place.objectDetail && place.leftTime > 0) {
                        const payload = JSON.stringify({ objectName: place.objectDetail.objectName, pushToGroups });
                        await redis.set(redisKey, payload, {EX: Math.round(place.leftTime + 300) }); // 多给5分钟容错
                    } else {
                        const finishedTaskPayload = await redis.get(redisKey);
                        if (finishedTaskPayload) {
                            const { objectName, pushToGroups: savedGroups } = JSON.parse(finishedTaskPayload);
                            const msgText = `您的 ${objectName} 已在特勤处生产完成！`;
                            
                            for (const groupId of savedGroups) {
                                try {
                                    const group = await Bot.pickGroup(Number(groupId));
                                    await group.sendMsg([segment.at(userId), ` ${msgText}`]);
                                    logger.info(`[特勤处推送] 已成功推送完成提醒到群 ${groupId} for user ${userId}`);
                                } catch (e) {
                                    logger.error(`[特勤处推送] 推送到群 ${groupId} 失败: ${e.message}`);
                                }
                            }
                            await redis.del(redisKey);
                        }
                    }
                }
            } else {
                 logger.warn(`[特勤处推送] 查询用户 ${userId} 特勤处状态失败: ${res.msg || 'API返回数据异常'}`);
            }
        } catch (e) {
             logger.error(`[特勤处推送] 处理用户 ${userId} 时发生错误: ${e.message}`);
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    logger.info('[特勤处推送] 主扫描任务执行完毕');
}


/**
 * 重新安排主扫描任务
 */
function scheduleMainTask() {
  if (mainJob) {
    mainJob.cancel();
    mainJob = null;
  }

  const config = Config.loadYAML(Config.fileMaps.config) || {};
  const placePushConfig = config?.delta_force?.push_place_status || {};
  
  if (placePushConfig.enabled) {
    try {
      const cron = String(placePushConfig.cron || '*/5 * * * *')
        .replace('?', '*')
        .split(' ')
        .slice(0, 6)
        .join(' ');
        
      mainJob = schedule.scheduleJob(cron, () => simpleScanAndNotify());
      logger.mark(`[特勤处推送] 主扫描任务已启动，Cron: ${cron}`);
    } catch (err) {
      logger.error(`[特勤处推送] 定时任务启动失败: ${err.message}`);
    }
  } else {
    logger.mark('[特勤处推送] 特勤处完成推送任务未开启。');
  }
}

/**
 * 监控配置文件变化
 */
function watchConfig() {
  const configPath = './plugins/delta-force-plugin/config/config/config.yaml';
  const debouncedReschedule = lodash.debounce(() => {
      logger.mark('[特勤处推送] 配置文件更新，重新加载定时任务...');
      scheduleMainTask();
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
scheduleMainTask();
watchConfig(); 