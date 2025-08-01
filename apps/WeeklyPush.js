import Config from '../components/Config.js';
import Code from '../components/Code.js';
import utils from '../utils/utils.js';
import DataManager from '../utils/Data.js';
import { normalizeCronExpression } from '../utils/cron.js';

export class WeeklyPush extends plugin {
  constructor() {
    super({
      name: '三角洲周报推送',
      dsc: '每周定时推送周报',
      event: 'none',
    });

    const weeklyConfig = Config.getConfig()?.delta_force?.push_weekly_report || {};
    
    this.task = {
      name: '三角洲周报推送任务',
      cron: normalizeCronExpression(weeklyConfig.cron || '0 0 10 * * 1'), 
      fnc: () => this.pushWeeklyReports()
    };
  }

  async pushWeeklyReports() {
    const config = Config.getConfig();
    const weeklyReportConfig = config?.delta_force?.push_weekly_report || {};

    if (!weeklyReportConfig.enabled) {
      return;
    }

    logger.info('[DELTA FORCE] 开始执行周报推送任务...');
    const api = new Code();

    const userEntries = Object.entries(weeklyReportConfig).filter(([key, value]) => 
        /^\d+$/.test(key) && value?.enabled && value?.push_to?.group?.length > 0
    );

    for (const [userId, userConfig] of userEntries) {
      const token = await utils.getAccount(userId);
      if (!token) {
        logger.warn(`[周报推送] 用户 ${userId} 未绑定token，跳过推送。`);
        continue;
      }
      
      // --- 数据获取与预处理 ---
      const res = await api.getWeeklyRecord(token, '', true, '');
      if (!res || !res.success || !res.data) {
        logger.warn(`[周报推送] 用户 ${userId} API数据异常，跳过。(${res?.msg || '未知错误'})`);
        continue;
      }
      const solData = res.data?.sol?.data?.data;
      const mpData = res.data?.mp?.data?.data;
      if (!solData && !mpData) {
        logger.info(`[周报推送] 用户 ${userId} 无周报数据，跳过。`);
        continue;
      }
      
      const allTeammateOpenIDs = new Set();
      if (solData?.teammates) solData.teammates.forEach(t => allTeammateOpenIDs.add(t.friend_openid));
      if (mpData?.teammates) mpData.teammates.forEach(t => allTeammateOpenIDs.add(t.friend_openid));
      const nicknameMap = new Map();
      if (allTeammateOpenIDs.size > 0) {
        const promises = Array.from(allTeammateOpenIDs).map(openid => api.getFriendInfo(token, openid));
        const results = await Promise.allSettled(promises);
        results.forEach((result, index) => {
          const openid = Array.from(allTeammateOpenIDs)[index];
          if (result.status === 'fulfilled' && result.value?.success && result.value.data?.charac_name) {
            nicknameMap.set(openid, result.value.data.charac_name);
          }
        });
      }

      // --- 数据解析和渲染 from Weekly.js ---
      const parseAndGetName = (dataStr, idKey, countKey, dataManagerFunc) => {
          if (!dataStr || typeof dataStr !== 'string') return '无';
          const items = dataStr.split('#').map(s => {
              try {
                  const correctedJSON = s.replace(/'/g, '"').replace(/([a-zA-Z0-9_]+):/g, '"$1":');
                  return JSON.parse(correctedJSON);
              } catch (e) { return null; }
          }).filter(Boolean);
          if (items.length === 0) return '无';
          const mostUsed = items.reduce((a, b) => (a[countKey] > b[countKey] ? a : b));
          return dataManagerFunc(mostUsed[idKey]);
      };
      if (solData) {
          solData.mostUsedMap = parseAndGetName(solData.total_mapid_num, 'MapId', 'inum', DataManager.getMapName);
          solData.mostUsedOperator = parseAndGetName(solData.total_ArmedForceId_num, 'ArmedForceId', 'inum', DataManager.getOperatorName);
      }
      if (mpData) {
          mpData.mostUsedMap = parseAndGetName(mpData.max_inum_mapid, 'MapId', 'inum', DataManager.getMapName);
          mpData.mostUsedOperator = DataManager.getOperatorName(mpData.max_inum_DeployArmedForceType);
      }
      
      // --- 构造转发消息 (Full version from Weekly.js) ---
      const userInfo = { user_id: userId, nickname: userConfig.nickname || '我' };
      const forwardMsg = [];
      const title = `【三角洲行动周报 - ${userConfig.nickname || userId}】`;
      forwardMsg.push({ ...userInfo, message: title });

      if (solData) {
          let solMsg = '--- 烽火地带 ---\n';
          solMsg += `总览: ${solData.total_sol_num || 0}场 | ${solData.total_exacuation_num || 0}撤离 | ${solData.GainedPrice_overmillion_num || 0}次百万撤离 | ${solData.total_Death_Count || 0}死亡\n`;
          solMsg += `击杀: ${solData.total_Kill_Player || 0}玩家 | ${solData.total_Kill_AI || 0}AI | ${solData.total_Kill_Boss || 0}BOSS\n`;
          solMsg += `排位分: ${solData.Rank_Score || 0}\n`;
          solMsg += `资产净增: ${solData.rise_Price?.toLocaleString() || 0} (总收益 ${solData.Gained_Price?.toLocaleString() || 0} / 总消费 ${solData.consume_Price?.toLocaleString() || 0})\n`;
          const profitRatio = solData.Gained_Price && solData.consume_Price ? (solData.Gained_Price / solData.consume_Price).toFixed(2) : '0';
          solMsg += `赚损比: ${profitRatio} (收益/消费)\n`;
          if (solData.Total_Price) {
              const prices = solData.Total_Price.split(',');
              const monday = prices.find(p => p.startsWith('Monday'));
              const sunday = prices.find(p => p.startsWith('Sunday'));
              if (monday && sunday) {
                  const startPrice = parseInt(monday.split('-')[2]);
                  const endPrice = parseInt(sunday.split('-')[2]);
                  solMsg += `资产趋势: ${startPrice.toLocaleString()} → ${endPrice.toLocaleString()}\n`;
              }
          }
          solMsg += `局内行为: ${solData.total_Quest_num || 0}任务 | ${solData.use_Keycard_num || 0}用钥匙 | ${solData.Mandel_brick_num || 0}破译 | ${solData.search_Birdsnest_num || 0}搜鸟巢\n`;
          solMsg += `其他: ${(solData.Total_Mileage / 100000).toFixed(2)}km里程 | ${solData.total_Rescue_num || 0}次救援 | ${solData.Kill_ByCrocodile_num || 0}次被鳄鱼偷袭\n`;
          solMsg += `游戏时长: ${Math.floor((solData.total_Online_Time || 0) / 3600)}小时${Math.floor(((solData.total_Online_Time || 0) % 3600) / 60)}分钟\n`;
          solMsg += `常玩地图: ${solData.mostUsedMap || '无'}\n`;
          solMsg += `常玩干员: ${solData.mostUsedOperator || '无'}`;
          forwardMsg.push({ ...userInfo, message: solMsg });

          // [补全] 解析并展示所有使用的干员
          if (solData.total_ArmedForceId_num && solData.total_sol_num > 0) {
              try {
                  const operatorsStr = solData.total_ArmedForceId_num;
                  const opStrings = operatorsStr.includes('#') ? operatorsStr.split('#') : [operatorsStr];
                  const operators = opStrings.map(s => {
                      const correctedJSON = s.replace(/'/g, '"').replace(/([a-zA-Z0-9_]+):/g, '"$1":');
                      try {
                          const parsed = JSON.parse(correctedJSON);
                          return { id: parsed.ArmedForceId, count: parsed.inum, name: DataManager.getOperatorName(parsed.ArmedForceId) };
                      } catch (err) { return null; }
                  }).filter(Boolean);
                  operators.sort((a, b) => b.count - a.count);
                  if (operators.length > 0) {
                      let operatorsMsg = '--- 本周烽火干员使用详情 ---\n';
                      operators.forEach(op => { operatorsMsg += `${op.name || '未知干员'}: ${op.count}场\n`; });
                      forwardMsg.push({ ...userInfo, message: operatorsMsg.trim() });
                  }
              } catch (e) {}
          }
  
          // [补全] 解析并展示烽火地图使用详情
          if (solData.total_mapid_num && solData.total_sol_num > 0) {
              try {
                  const mapsStr = solData.total_mapid_num;
                  const mapStrings = mapsStr.includes('#') ? mapsStr.split('#') : [mapsStr];
                  const maps = mapStrings.map(s => {
                      const correctedJSON = s.replace(/'/g, '"').replace(/([a-zA-Z0-9_]+):/g, '"$1":');
                      try {
                          const parsed = JSON.parse(correctedJSON);
                          return { id: parsed.MapId, count: parsed.inum, name: DataManager.getMapName(parsed.MapId) };
                      } catch (err) { return null; }
                  }).filter(Boolean);
                  maps.sort((a, b) => b.count - a.count);
                  if (maps.length > 0) {
                      let mapsMsg = '--- 本周烽火地图使用详情 ---\n';
                      maps.forEach(map => { mapsMsg += `${map.name || '未知地图'}: ${map.count}场\n`; });
                      forwardMsg.push({ ...userInfo, message: mapsMsg.trim() });
                  }
              } catch (e) {}
          }

          // [补全] 解析并展示高价值物资
          if (solData.CarryOut_highprice_list) {
              try {
                  const items = solData.CarryOut_highprice_list.split('#').map(s => {
                      const correctedJSON = s.replace(/'/g, '"').replace(/([a-zA-Z0-9_]+):/g, '"$1":');
                      return JSON.parse(correctedJSON);
                  }).filter(Boolean);
                  if (items.length > 0) {
                      items.sort((a, b) => b.iPrice - a.iPrice);
                      let highPriceMsg = '--- 本周高价值物资 Top 5 ---\n';
                      items.slice(0, 5).forEach(item => { highPriceMsg += `${item.auctontype || '物品'}: ${item.iPrice.toLocaleString()}\n`; });
                      forwardMsg.push({ ...userInfo, message: highPriceMsg.trim() });
                  }
              } catch (e) {}
          }
  
          // [补全] 烽火地带队友数据
          const sol_teammates = solData.teammates || [];
          const active_sol_teammates = sol_teammates.filter(t => t.Friend_total_sol_num > 0);
          if (active_sol_teammates.length > 0) {
              let teammatesMsg = '--- 本周烽火队友协作 ---\n';
              active_sol_teammates.forEach((t, i) => {
                  const teammateName = nicknameMap.get(t.friend_openid) || `...${t.friend_openid.slice(-6)}`;
                  teammatesMsg += `\n[队友 ${i + 1} (${teammateName})]\n`;
                  teammatesMsg += `  总览: ${t.Friend_total_sol_num}场 | ${t.Friend_is_Escape1_num}撤离/${t.Friend_is_Escape2_num}失败 | ${t.Friend_total_sol_KillPlayer}击杀 | ${t.Friend_total_sol_DeathCount}死亡\n`;
                  const totalGained = Number(t.Friend_Sum_Gained_Price) || (Number(t.Friend_Sum_Escape1_Gained_Price || 0) + Number(t.Friend_Sum_Escape2_Gained_Price || 0));
                  teammatesMsg += `  带出: ${totalGained.toLocaleString()}\n`;
                  const successGain = Number(t.Friend_Sum_Escape1_Gained_Price || 0).toLocaleString();
                  const failGain = Number(t.Friend_Sum_Escape2_Gained_Price || 0).toLocaleString();
                  teammatesMsg += `  带出详情: (成功${successGain}/失败${failGain})\n`;
                  const totalCost = Number(t.Friend_consume_Price || 0).toLocaleString();
                  const successCost = Number(t.Friend_Escape1_consume_Price || 0).toLocaleString();
                  const failCost = Number(t.Friend_Escape2_consume_Price || 0).toLocaleString();
                  teammatesMsg += `  战损: ${totalCost} (成功${successCost}/失败${failCost}) | 被救: ${t.Friend_total_sol_AssistCnt || 0}次`;
              });
              forwardMsg.push({ ...userInfo, message: teammatesMsg.trim() });
          }
      }
      
      if (mpData) {
          let mpMsg = '--- 全面战场 ---\n';
          const winRate = mpData.total_num > 0 ? (mpData.win_num / mpData.total_num * 100).toFixed(1) + '%' : '0%';
          mpMsg += `总览: ${mpData.total_num || 0}场 | ${mpData.win_num || 0}胜 | ${winRate}胜率\n`;
          mpMsg += `排位分: ${mpData.Rank_Match_Score || 0}\n`;
          mpMsg += `数据: ${mpData.Kill_Num || 0}击杀 | ${mpData.continuous_Kill_Num || 0}最高连杀 | ${mpData.total_score?.toLocaleString() || 0}总分\n`;
          const hitRate = mpData.Consume_Bullet_Num > 0 ? (mpData.Hit_Bullet_Num / mpData.Consume_Bullet_Num * 100).toFixed(1) + '%' : '0%';
          mpMsg += `命中率: ${hitRate} (${mpData.Hit_Bullet_Num || 0}/${mpData.Consume_Bullet_Num || 0})\n`;
          mpMsg += `支援: 呼叫${mpData.SBattle_Support_UseNum || 0}次 | 消耗${mpData.SBattle_Support_CostScore?.toLocaleString() || 0}分\n`;
          mpMsg += `救援: ${mpData.Rescue_Teammate_Count || 0}次 | 被救: ${mpData.by_Rescue_num || 0}次\n`;
          mpMsg += `常玩地图: ${mpData.mostUsedMap || '无'}\n`;
          let operatorStats = `常玩干员: ${mpData.mostUsedOperator || '无'}`;
          if (mpData.DeployArmedForceType_inum) {
              operatorStats += ` (${mpData.DeployArmedForceType_inum}场 | ${mpData.DeployArmedForceType_KillNum}击杀)`;
          }
          mpMsg += operatorStats;
          forwardMsg.push({ ...userInfo, message: mpMsg });
          
          // [补全] 解析并展示地图使用详情
          if (mpData.max_inum_mapid && mpData.total_num > 0) {
              try {
                  const mapsStr = mpData.max_inum_mapid;
                  const mapStrings = mapsStr.includes('#') ? mapsStr.split('#') : [mapsStr];
                  const maps = mapStrings.map(s => {
                      const correctedJSON = s.replace(/'/g, '"').replace(/([a-zA-Z0-9_]+):/g, '"$1":');
                      try {
                          const parsed = JSON.parse(correctedJSON);
                          return { id: parsed.MapId, count: parsed.inum, name: DataManager.getMapName(parsed.MapId) };
                      } catch (err) { return null; }
                  }).filter(Boolean);
                  maps.sort((a, b) => b.count - a.count);
                  if (maps.length > 0) {
                      let mapsMsg = '--- 本周战场地图使用详情 ---\n';
                      maps.forEach(map => { mapsMsg += `${map.name || '未知地图'}: ${map.count}场\n`; });
                      forwardMsg.push({ ...userInfo, message: mapsMsg.trim() });
                  }
              } catch (e) {}
          }
  
          // [补全] 解析战场干员使用情况
          if (mpData.max_inum_DeployArmedForceType && mpData.total_num > 0) {
              const operatorId = mpData.max_inum_DeployArmedForceType;
              const operatorName = DataManager.getOperatorName(operatorId);
              let operatorMsg = '--- 本周战场最常用干员 ---\n';
              operatorMsg += `${operatorName || '未知干员'}`;
              if (mpData.DeployArmedForceType_inum && mpData.DeployArmedForceType_KillNum) {
                  operatorMsg += `\n使用场次: ${mpData.DeployArmedForceType_inum}场`;
                  operatorMsg += `\n击杀数: ${mpData.DeployArmedForceType_KillNum}`;
                  operatorMsg += `\n游戏时长: ${Math.floor((mpData.DeployArmedForceType_gametime || 0) / 3600)}小时${Math.floor(((mpData.DeployArmedForceType_gametime || 0) % 3600) / 60)}分钟`;
              }
              forwardMsg.push({ ...userInfo, message: operatorMsg });
          }
  
          // [补全] 全面战场队友数据
          const mp_teammates = mpData.teammates || [];
          const active_mp_teammates = mp_teammates.filter(t => t.Friend_mp_total_num > 0 || t.Friend_mp_win_num > 0 || t.Friend_mp_KillNum > 0);
          if (active_mp_teammates.length > 0) {
              let teammatesMsg = '--- 本周战场队友协作 ---\n';
              active_mp_teammates.forEach((t, i) => {
                  const teammateName = nicknameMap.get(t.friend_openid) || `...${t.friend_openid.slice(-6)}`;
                  teammatesMsg += `\n[队友 ${i + 1} (${teammateName})]\n`;
                  const total_mp_games = t.Friend_mp_total_num || 0;
                  const win_mp_games = t.Friend_mp_win_num || 0;
                  const mp_win_rate = total_mp_games > 0 ? `${((win_mp_games / total_mp_games) * 100).toFixed(1)}%` : '0%';
                  teammatesMsg += `  总览: ${total_mp_games}场 | ${win_mp_games}胜 (${mp_win_rate}) | KDA: ${t.Friend_mp_KillNum || 0}/${t.Friend_mp_Death || 0}/${t.Friend_mp_Assist || 0}\n`;
                  teammatesMsg += `  得分: ${t.Friend_Sum_Score?.toLocaleString() || 0} (最高 ${t.Friend_Max_Score?.toLocaleString() || 0})`;
              });
              forwardMsg.push({ ...userInfo, message: teammatesMsg.trim() });
          }
      }

      if (forwardMsg.length <= 1) {
        logger.info(`[周报推送] 用户 ${userId} 未能解析到有效的周报数据，跳过。`);
        continue;
      }
      
      // --- 推送 ---
      const pushToGroups = userConfig.push_to.group || [];
      for (const groupId of pushToGroups) {
        try {
          const group = await Bot.pickGroup(Number(groupId));
          await group.sendMsg([segment.at(Number(userId)), ' 您的周报来啦！']);
          await new Promise(resolve => setTimeout(resolve, 500));
          const forward = await Bot.makeForwardMsg(forwardMsg);
          await group.sendMsg(forward);
          logger.mark(`[周报推送] 已成功向群 ${groupId} 推送用户 ${userId} 的周报。`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (e) {
          logger.error(`[周报推送] 向群 ${groupId} 推送用户 ${userId} 周报时失败: ${e.message}`);
        }
      }
    }
    logger.info('[DELTA FORCE] 周报推送任务执行完毕。');
  }
} 