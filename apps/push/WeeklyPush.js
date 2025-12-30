import Config from '../../components/Config.js';
import Code from '../../components/Code.js';
import utils from '../../utils/utils.js';
import DataManager from '../../utils/Data.js';
import { normalizeCronExpression } from '../../utils/cron.js';
import Render from '../../components/Render.js';

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
      
      // --- 提取所有队友的OpenID并获取昵称和头像 ---
      const allTeammateOpenIDs = new Set();
      if (solData?.teammates) {
        solData.teammates.forEach(t => allTeammateOpenIDs.add(t.friend_openid));
      }
      if (mpData?.teammates) {
        mpData.teammates.forEach(t => allTeammateOpenIDs.add(t.friend_openid));
      }

      const nicknameMap = new Map();
      const avatarMap = new Map();
      if (allTeammateOpenIDs.size > 0) {
        const promises = Array.from(allTeammateOpenIDs).map(openid => 
          api.getFriendInfo(token, openid)
        );
        const results = await Promise.allSettled(promises);
        
        results.forEach((result, index) => {
          const openid = Array.from(allTeammateOpenIDs)[index];
          if (result.status === 'fulfilled' && result.value?.success && result.value.data) {
            const data = result.value.data;
            if (data.charac_name) {
              nicknameMap.set(openid, data.charac_name);
            }
            // 处理头像
            if (data.picurl) {
              let avatarUrl = data.picurl;
              // 如果是纯数字，使用游戏内头像接口
              if (/^[0-9]+$/.test(avatarUrl)) {
                avatarUrl = `https://wegame.gtimg.com/g.2001918-r.ea725/helper/df/skin/${avatarUrl}.webp`;
              } else {
                // QQ/微信头像需要URL解码
                try {
                  avatarUrl = decodeURIComponent(avatarUrl);
                } catch (e) {
                  // 解码失败，使用原始URL
                }
              }
              avatarMap.set(openid, avatarUrl);
            }
          }
        });
      }

      // --- 数据解析和渲染 ---
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

      // --- 构建模板数据 ---
      const templateData = {
        userName: userConfig.nickname || userId,
        date: ''
      };

      if (solData) {
        const solRank = solData.Rank_Score ? DataManager.getRankByScore(solData.Rank_Score, 'sol') : '-';
        const profitRatio = solData.Gained_Price && solData.consume_Price ?
          (solData.Gained_Price / solData.consume_Price).toFixed(2) : '0';
        
        // 解析资产趋势
        let assetTrend = null;
        if (solData.Total_Price) {
          const prices = solData.Total_Price.split(',');
          const monday = prices.find(p => p.startsWith('Monday'));
          const sunday = prices.find(p => p.startsWith('Sunday'));
          if (monday && sunday) {
            const startPrice = parseInt(monday.split('-')[2]);
            const endPrice = parseInt(sunday.split('-')[2]);
            assetTrend = {
              startPrice: startPrice.toLocaleString(),
              endPrice: endPrice.toLocaleString()
            };
          }
        }

        templateData.solData = {
          total_sol_num: solData.total_sol_num || 0,
          total_exacuation_num: solData.total_exacuation_num || 0,
          GainedPrice_overmillion_num: solData.GainedPrice_overmillion_num || 0,
          total_Death_Count: solData.total_Death_Count || 0,
          total_Kill_Player: solData.total_Kill_Player || 0,
          total_Kill_AI: solData.total_Kill_AI || 0,
          total_Kill_Boss: solData.total_Kill_Boss || 0,
          rankName: solRank,
          rise_Price: solData.rise_Price?.toLocaleString() || '0',
          Gained_Price: solData.Gained_Price?.toLocaleString() || '0',
          consume_Price: solData.consume_Price?.toLocaleString() || '0',
          profitRatio: profitRatio,
          assetTrend: assetTrend,
          total_Quest_num: solData.total_Quest_num || 0,
          use_Keycard_num: solData.use_Keycard_num || 0,
          Mandel_brick_num: solData.Mandel_brick_num || 0,
          search_Birdsnest_num: solData.search_Birdsnest_num || 0,
          mileage: solData.Total_Mileage ? (solData.Total_Mileage / 100000).toFixed(2) : '0',
          total_Rescue_num: solData.total_Rescue_num || 0,
          Kill_ByCrocodile_num: solData.Kill_ByCrocodile_num || 0,
          gameTime: `${Math.floor((solData.total_Online_Time || 0) / 3600)}小时${Math.floor(((solData.total_Online_Time || 0) % 3600) / 60)}分钟`,
          mostUsedMap: solData.mostUsedMap || '无',
          mostUsedOperator: solData.mostUsedOperator || '无'
        };

        // 解析所有使用的干员
        if (solData.total_ArmedForceId_num && solData.total_sol_num > 0) {
          try {
            const operatorsStr = solData.total_ArmedForceId_num;
            const opStrings = operatorsStr.includes('#') ? operatorsStr.split('#') : [operatorsStr];
            const operators = opStrings.map(s => {
              const correctedJSON = s.replace(/'/g, '"').replace(/([a-zA-Z0-9_]+):/g, '"$1":');
              try {
                const parsed = JSON.parse(correctedJSON);
                return {
                  id: parsed.ArmedForceId,
                  count: parsed.inum,
                  name: DataManager.getOperatorName(parsed.ArmedForceId)
                };
              } catch (err) {
                return null;
              }
            }).filter(Boolean).sort((a, b) => b.count - a.count);
            templateData.solData.operators = operators;
          } catch (e) {
            templateData.solData.operators = [];
          }
        } else {
          templateData.solData.operators = [];
        }

        // 解析烽火地图使用详情
        if (solData.total_mapid_num && solData.total_sol_num > 0) {
          try {
            const mapsStr = solData.total_mapid_num;
            const mapStrings = mapsStr.includes('#') ? mapsStr.split('#') : [mapsStr];
            const maps = mapStrings.map(s => {
              const correctedJSON = s.replace(/'/g, '"').replace(/([a-zA-Z0-9_]+):/g, '"$1":');
              try {
                const parsed = JSON.parse(correctedJSON);
                return {
                  id: parsed.MapId,
                  count: parsed.inum,
                  name: DataManager.getMapName(parsed.MapId)
                };
              } catch (err) {
                return null;
              }
            }).filter(Boolean).sort((a, b) => b.count - a.count);
            templateData.solData.maps = maps;
          } catch (e) {
            templateData.solData.maps = [];
          }
        } else {
          templateData.solData.maps = [];
        }

        // 解析高价值物资
        if (solData.CarryOut_highprice_list) {
          try {
            const items = solData.CarryOut_highprice_list.split('#').map(s => {
              const correctedJSON = s.replace(/'/g, '"').replace(/([a-zA-Z0-9_]+):/g, '"$1":');
              return JSON.parse(correctedJSON);
            }).filter(Boolean);
            items.sort((a, b) => b.iPrice - a.iPrice);
            templateData.solData.highPriceItems = items.slice(0, 5).map(item => ({
              name: item.auctontype || '物品',
              price: item.iPrice.toLocaleString()
            }));
          } catch (e) {
            templateData.solData.highPriceItems = [];
          }
        } else {
          templateData.solData.highPriceItems = [];
        }

        // 烽火地带队友数据
        const sol_teammates = solData.teammates || [];
        const active_sol_teammates = sol_teammates.filter(t => t.Friend_total_sol_num > 0);
        templateData.solData.teammates = active_sol_teammates.map((t, i) => {
          const teammateName = nicknameMap.get(t.friend_openid) || `...${t.friend_openid.slice(-6)}`;
          const teammateAvatar = avatarMap.get(t.friend_openid) || '';
          const sumGained = t.Friend_Sum_Gained_Price;
          const totalGained = Number(sumGained) ||
            (Number(t.Friend_Sum_Escape1_Gained_Price || 0) +
              Number(t.Friend_Sum_Escape2_Gained_Price || 0));
          return {
            name: teammateName,
            avatar: teammateAvatar,
            total_sol_num: t.Friend_total_sol_num || 0,
            escape1: t.Friend_is_Escape1_num || 0,
            escape2: t.Friend_is_Escape2_num || 0,
            killPlayer: t.Friend_total_sol_KillPlayer || 0,
            death: t.Friend_total_sol_DeathCount || 0,
            totalGained: totalGained.toLocaleString(),
            successGain: Number(t.Friend_Sum_Escape1_Gained_Price || 0).toLocaleString(),
            failGain: Number(t.Friend_Sum_Escape2_Gained_Price || 0).toLocaleString(),
            totalCost: Number(t.Friend_consume_Price || 0).toLocaleString(),
            successCost: Number(t.Friend_Escape1_consume_Price || 0).toLocaleString(),
            failCost: Number(t.Friend_Escape2_consume_Price || 0).toLocaleString(),
            assistCnt: t.Friend_total_sol_AssistCnt || 0
          };
        });
      }

      if (mpData) {
        const winRate = mpData.total_num > 0 ? (mpData.win_num / mpData.total_num * 100).toFixed(1) + '%' : '0%';
        const mpRank = mpData.Rank_Match_Score ? DataManager.getRankByScore(mpData.Rank_Match_Score, 'tdm') : '-';
        const hitRate = mpData.Consume_Bullet_Num > 0 ? (mpData.Hit_Bullet_Num / mpData.Consume_Bullet_Num * 100).toFixed(1) + '%' : '0%';

        templateData.mpData = {
          total_num: mpData.total_num || 0,
          win_num: mpData.win_num || 0,
          winRate: winRate,
          rankName: mpRank,
          Kill_Num: mpData.Kill_Num || 0,
          continuous_Kill_Num: mpData.continuous_Kill_Num || 0,
          total_score: mpData.total_score?.toLocaleString() || '0',
          hitRate: hitRate,
          Hit_Bullet_Num: mpData.Hit_Bullet_Num || 0,
          Consume_Bullet_Num: mpData.Consume_Bullet_Num || 0,
          SBattle_Support_UseNum: mpData.SBattle_Support_UseNum || 0,
          SBattle_Support_CostScore: mpData.SBattle_Support_CostScore?.toLocaleString() || '0',
          Rescue_Teammate_Count: mpData.Rescue_Teammate_Count || 0,
          by_Rescue_num: mpData.by_Rescue_num || 0,
          mostUsedMap: mpData.mostUsedMap || '无',
          mostUsedOperator: mpData.mostUsedOperator || '无'
        };

        // 解析地图使用详情
        if (mpData.max_inum_mapid && mpData.total_num > 0) {
          try {
            const mapsStr = mpData.max_inum_mapid;
            const mapStrings = mapsStr.includes('#') ? mapsStr.split('#') : [mapsStr];
            const maps = mapStrings.map(s => {
              const correctedJSON = s.replace(/'/g, '"').replace(/([a-zA-Z0-9_]+):/g, '"$1":');
              try {
                const parsed = JSON.parse(correctedJSON);
                return {
                  id: parsed.MapId,
                  count: parsed.inum,
                  name: DataManager.getMapName(parsed.MapId)
                };
              } catch (err) {
                return null;
              }
            }).filter(Boolean).sort((a, b) => b.count - a.count);
            templateData.mpData.maps = maps;
          } catch (e) {
            templateData.mpData.maps = [];
          }
        } else {
          templateData.mpData.maps = [];
        }

        // 解析战场干员使用情况
        if (mpData.max_inum_DeployArmedForceType && mpData.total_num > 0) {
          const operatorId = mpData.max_inum_DeployArmedForceType;
          const operatorName = DataManager.getOperatorName(operatorId);
          templateData.mpData.operatorStats = {
            name: operatorName || '未知干员',
            games: mpData.DeployArmedForceType_inum || 0,
            kills: mpData.DeployArmedForceType_KillNum || 0,
            gameTime: `${Math.floor((mpData.DeployArmedForceType_gametime || 0) / 3600)}小时${Math.floor(((mpData.DeployArmedForceType_gametime || 0) % 3600) / 60)}分钟`
          };
        }

        // 全面战场队友数据
        const mp_teammates = mpData.teammates || [];
        const active_mp_teammates = mp_teammates.filter(t => t.Friend_mp_total_num > 0 || t.Friend_mp_win_num > 0 || t.Friend_mp_KillNum > 0);
        templateData.mpData.teammates = active_mp_teammates.map((t, i) => {
          const teammateName = nicknameMap.get(t.friend_openid) || `...${t.friend_openid.slice(-6)}`;
          const teammateAvatar = avatarMap.get(t.friend_openid) || '';
          const total_mp_games = t.Friend_mp_total_num || 0;
          const win_mp_games = t.Friend_mp_win_num || 0;
          const mp_win_rate = total_mp_games > 0 ? `${((win_mp_games / total_mp_games) * 100).toFixed(1)}%` : '0%';
          return {
            name: teammateName,
            avatar: teammateAvatar,
            total_num: total_mp_games,
            win_num: win_mp_games,
            winRate: mp_win_rate,
            kda: `${t.Friend_mp_KillNum || 0}/${t.Friend_mp_Death || 0}/${t.Friend_mp_Assist || 0}`,
            sumScore: t.Friend_Sum_Score?.toLocaleString() || '0',
            maxScore: t.Friend_Max_Score?.toLocaleString() || '0'
          };
        });
      }

      // --- 推送 ---
      const pushToGroups = userConfig.push_to.group || [];
      for (const groupId of pushToGroups) {
        try {
          const group = await Bot.pickGroup(Number(groupId));
          
          // 创建模拟的 e 对象用于渲染
          const Runtime = (await import('../../../../lib/plugins/runtime.js')).default;
          const mockE = {
            user_id: Number(userId),
            group_id: Number(groupId),
            isGroup: true,
            sender: {
              card: userConfig.nickname || userId,
              nickname: userConfig.nickname || userId
            }
          };
          const runtime = new Runtime(mockE);
          mockE.runtime = runtime;

          // 渲染模板，获取 base64 图片
          const base64Image = await Render.render('Template/weeklyReport/weeklyReport', templateData, {
            e: mockE,
            retType: 'base64'
          });

          if (base64Image) {
            await group.sendMsg([segment.at(Number(userId)), ' 您的周报来啦！']);
            await new Promise(resolve => setTimeout(resolve, 500));
            await group.sendMsg(segment.image(base64Image));
            logger.debug(`[周报推送] 已成功向群 ${groupId} 推送用户 ${userId} 的周报`);
            await new Promise(resolve => setTimeout(resolve, 1000));
          } else {
            logger.error(`[周报推送] 用户 ${userId} 周报渲染失败`);
          }
        } catch (e) {
          logger.error(`[周报推送] 向群 ${groupId} 推送用户 ${userId} 周报时失败: ${e.message}`);
        }
      }
    }
    logger.info('[DELTA FORCE] 周报推送任务执行完毕。');
  }
}
