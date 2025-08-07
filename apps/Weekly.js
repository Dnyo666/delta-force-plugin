import utils from '../utils/utils.js'
import Code from '../components/Code.js'
import DataManager from '../utils/Data.js'
import lodash from 'lodash'
import Config from '../components/Config.js'

export class Weekly extends plugin {
    constructor(e) {
        super({
            name: '三角洲周报',
            dsc: '查询三角洲行动周报数据',
            event: 'message',
            priority: 100,
            rule: [
                {
                    reg: '^(#三角洲|\\^)(周报|weekly)\\s*(.*)$',
                    fnc: 'getWeeklyReport'
                },
                {
                  reg: '^(#三角洲|\\^)(开启|关闭)周报推送$',
                  fnc: 'toggleWeeklyPush',
                }
            ]
        })
        this.api = new Code(e)
    }

    async getWeeklyReport(e) {
        const token = await utils.getAccount(e.user_id)
        if (!token) {
            await e.reply('您尚未绑定账号，请使用 #三角洲登录 进行绑定。')
            return true
        }

        const match = e.msg.match(this.rule[0].reg)
        const args = match[3] ? match[3].trim().split(/\s+/) : []
        
        let mode = ''
        let isShowNullFriend = true
        let date = ''

        for (const arg of args) {
            if (['烽火', '烽火地带', 'sol', '摸金'].includes(arg)) {
                mode = 'sol'
            } else if (['全面', '全面战场', '战场', 'mp'].includes(arg)) {
                mode = 'mp'
            } else if (['不展示', '否'].includes(arg)) {
                isShowNullFriend = false
            } else if (['展示', '是'].includes(arg)) {
                isShowNullFriend = true
            } else if (/^\d{8}$/.test(arg)) {
                date = arg
            }
        }

        const res = await this.api.getWeeklyRecord(token, mode, isShowNullFriend, date);

        if (await utils.handleApiError(res, e)) return true;
    
        if (!res.data) {
            await e.reply(`查询失败: ${res.msg || 'API 返回数据格式不正确'}`);
            return true;
        }
    
        let solData, mpData;
        if (mode) { // 指定模式查询
            const detailData = res.data?.data?.data;
            if (mode === 'sol') {
                solData = detailData;
            } else if (mode === 'mp') {
                mpData = detailData;
            }
        } else { // 查询全部
            solData = res.data?.sol?.data?.data;
            mpData = res.data?.mp?.data?.data;
        }

        if (!solData && !mpData) {
            return e.reply('暂无周报数据，不打两把吗？')
        }

        // --- 提取所有队友的OpenID并获取昵称 ---
        const allTeammateOpenIDs = new Set();
        if (solData?.teammates) {
            solData.teammates.forEach(t => allTeammateOpenIDs.add(t.friend_openid));
        }
        if (mpData?.teammates) {
            mpData.teammates.forEach(t => allTeammateOpenIDs.add(t.friend_openid));
        }

        const nicknameMap = new Map();
        if (allTeammateOpenIDs.size > 0) {
            const promises = Array.from(allTeammateOpenIDs).map(openid => 
                this.api.getFriendInfo(token, openid)
            );
            const results = await Promise.allSettled(promises);
            
            results.forEach((result, index) => {
                const openid = Array.from(allTeammateOpenIDs)[index];
                if (result.status === 'fulfilled' && result.value?.success && result.value.data?.charac_name) {
                    nicknameMap.set(openid, result.value.data.charac_name);
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

        // --- 构造转发消息 ---
        const userInfo = {
            user_id: e.user_id,
            nickname: e.sender.nickname
        };

        let forwardMsg = [];
        // 添加日期信息到标题
        let titleDate = '';
        if (date) {
            titleDate = ` (${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)})`;
        }
        const title = `【三角洲行动周报${titleDate} - ${e.sender.card || e.sender.nickname}】`;
        forwardMsg.push({ ...userInfo, message: title });

        if (solData) {
            let solMsg = '--- 烽火地带 ---\n';
            solMsg += `总览: ${solData.total_sol_num || 0}场 | ${solData.total_exacuation_num || 0}撤离 | ${solData.GainedPrice_overmillion_num || 0}次百万撤离 | ${solData.total_Death_Count || 0}死亡\n`;
            solMsg += `击杀: ${solData.total_Kill_Player || 0}玩家 | ${solData.total_Kill_AI || 0}AI | ${solData.total_Kill_Boss || 0}BOSS\n`;
            const solRank = solData.Rank_Score ? DataManager.getRankByScore(solData.Rank_Score, 'sol') : '-';
            solMsg += `段位: ${solRank}\n`;
            solMsg += `资产净增: ${solData.rise_Price?.toLocaleString() || 0} (总收益 ${solData.Gained_Price?.toLocaleString() || 0} / 总消费 ${solData.consume_Price?.toLocaleString() || 0})\n`;

            // 添加战损比
            const profitRatio = solData.Gained_Price && solData.consume_Price ?
                (solData.Gained_Price / solData.consume_Price).toFixed(2) : '0';
            solMsg += `赚损比: ${profitRatio} (收益/消费)\n`;

            // 解析并展示资产趋势
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

            // 解析并展示所有使用的干员
            if (solData.total_ArmedForceId_num && solData.total_sol_num > 0) {
                try {
                    const operatorsStr = solData.total_ArmedForceId_num;
                    let operators = [];
                
                    // 拆分字符串（单个或多个干员）
                    const opStrings = operatorsStr.includes('#') ? operatorsStr.split('#') : [operatorsStr];
                
                    // 解析每个干员数据
                    operators = opStrings.map(s => {
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
                    }).filter(Boolean);
                
                    // 按使用次数排序
                    operators.sort((a, b) => b.count - a.count);
                
                    // 构造消息
                    if (operators.length > 0) {
                        let operatorsMsg = '--- 本周烽火干员使用详情 ---\n';
                        operators.forEach(op => {
                            operatorsMsg += `${op.name || '未知干员'}: ${op.count}场\n`;
                        });
                        forwardMsg.push({ ...userInfo, message: operatorsMsg.trim() });
                    }
                } catch (e) {
                    // 解析失败时不展示
                }
            }
    
            // 解析并展示烽火地图使用详情
            if (solData.total_mapid_num && solData.total_sol_num > 0) {
                try {
                    const mapsStr = solData.total_mapid_num;
                    const mapStrings = mapsStr.includes('#') ? mapsStr.split('#') : [mapsStr];
                
                    // 解析地图数据
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
                    }).filter(Boolean);
                
                    // 按使用次数排序
                    maps.sort((a, b) => b.count - a.count);
                
                    // 构造消息
                    if (maps.length > 0) {
                        let mapsMsg = '--- 本周烽火地图使用详情 ---\n';
                        maps.forEach(map => {
                            mapsMsg += `${map.name || '未知地图'}: ${map.count}场\n`;
                        });
                        forwardMsg.push({ ...userInfo, message: mapsMsg.trim() });
                    }
                } catch (e) {
                    // 解析失败时不展示
                }
            }

            // 解析并展示高价值物资
            if (solData.CarryOut_highprice_list) {
                try {
                    const items = solData.CarryOut_highprice_list.split('#').map(s => {
                        const correctedJSON = s.replace(/'/g, '"').replace(/([a-zA-Z0-9_]+):/g, '"$1":');
                        return JSON.parse(correctedJSON);
                    }).filter(Boolean);

                    if (items.length > 0) {
                        items.sort((a, b) => b.iPrice - a.iPrice);
                        let highPriceMsg = '--- 本周高价值物资 Top 5 ---\n';
                        items.slice(0, 5).forEach(item => {
                            highPriceMsg += `${item.auctontype || '物品'}: ${item.iPrice.toLocaleString()}\n`;
                        });
                        forwardMsg.push({ ...userInfo, message: highPriceMsg.trim() });
                    }
                } catch (e) {
                    // logger.warn('[WeeklyReport] 解析高价值物品列表失败', e); // Original code had this line commented out
                }
            }
    
            // 烽火地带队友数据
            const sol_teammates = solData.teammates || [];
            const active_sol_teammates = sol_teammates.filter(t => t.Friend_total_sol_num > 0);
            if (active_sol_teammates.length > 0) {
                let teammatesMsg = '--- 本周烽火队友协作 ---\n';
                active_sol_teammates.forEach((t, i) => {
                    const teammateName = nicknameMap.get(t.friend_openid) || `...${t.friend_openid.slice(-6)}`;
                    teammatesMsg += `\n[队友 ${i + 1} (${teammateName})]\n`;
                    teammatesMsg += `  总览: ${t.Friend_total_sol_num}场 | ${t.Friend_is_Escape1_num}撤离/${t.Friend_is_Escape2_num}失败 | ${t.Friend_total_sol_KillPlayer}击杀 | ${t.Friend_total_sol_DeathCount}死亡\n`;
                
                    // 确保正确读取带出金额 - 直接读取字段并转换为数字
                    const sumGained = t.Friend_Sum_Gained_Price;
                    const maxGained = t.Friend_Max_Gained_Price || 0; // 如果没有最高带出字段，默认为0
                
                    // 累计总带出通常是成功+失败带出之和
                    const totalGained = Number(sumGained) ||
                        (Number(t.Friend_Sum_Escape1_Gained_Price || 0) +
                            Number(t.Friend_Sum_Escape2_Gained_Price || 0));
                
                    // 最高单局可能需要通过物品ID关联查询，暂时不显示最高单局
                    teammatesMsg += `  带出: ${totalGained.toLocaleString()}\n`;
                
                    // 成功带出和失败带出
                    const successGain = Number(t.Friend_Sum_Escape1_Gained_Price || 0).toLocaleString();
                    const failGain = Number(t.Friend_Sum_Escape2_Gained_Price || 0).toLocaleString();
                    teammatesMsg += `  带出详情: (成功${successGain}/失败${failGain})\n`;
                
                    // 战损数据
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
            const mpRank = mpData.Rank_Match_Score ? DataManager.getRankByScore(mpData.Rank_Match_Score, 'tdm') : '-';
            mpMsg += `段位: ${mpRank}\n`;
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
    
            // 解析并展示地图使用详情
            if (mpData.max_inum_mapid && mpData.total_num > 0) {
                try {
                    const mapsStr = mpData.max_inum_mapid;
                    const mapStrings = mapsStr.includes('#') ? mapsStr.split('#') : [mapsStr];
                
                    // 解析地图数据
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
                    }).filter(Boolean);
                
                    // 按使用次数排序
                    maps.sort((a, b) => b.count - a.count);
                
                    // 构造消息
                    if (maps.length > 0) {
                        let mapsMsg = '--- 本周战场地图使用详情 ---\n';
                        maps.forEach(map => {
                            mapsMsg += `${map.name || '未知地图'}: ${map.count}场\n`;
                        });
                        forwardMsg.push({ ...userInfo, message: mapsMsg.trim() });
                    }
                } catch (e) {
                    // 解析失败时不展示
                }
            }
    
            // 解析战场干员使用情况
            if (mpData.max_inum_DeployArmedForceType && mpData.total_num > 0) {
                // max_inum_DeployArmedForceType通常是直接的ID数字，不是JSON字符串
                const operatorId = mpData.max_inum_DeployArmedForceType;
                const operatorName = DataManager.getOperatorName(operatorId);
        
                // 干员使用统计
                let operatorMsg = '--- 本周战场最常用干员 ---\n';
                operatorMsg += `${operatorName || '未知干员'}`;
                if (mpData.DeployArmedForceType_inum && mpData.DeployArmedForceType_KillNum) {
                    operatorMsg += `\n使用场次: ${mpData.DeployArmedForceType_inum}场`;
                    operatorMsg += `\n击杀数: ${mpData.DeployArmedForceType_KillNum}`;
                    operatorMsg += `\n游戏时长: ${Math.floor((mpData.DeployArmedForceType_gametime || 0) / 3600)}小时${Math.floor(((mpData.DeployArmedForceType_gametime || 0) % 3600) / 60)}分钟`;
                }
        
                forwardMsg.push({ ...userInfo, message: operatorMsg });
            }
    
            // 全面战场队友数据
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
            return e.reply('未能解析到有效的周报数据。');
        }
    
        await e.reply(Bot.makeForwardMsg(forwardMsg))
        return true
    }

    async toggleWeeklyPush(e) {
      if (!e.isGroup) {
        return e.reply('该指令只能在群聊中使用。');
      }
      
      const action = e.msg.includes('开启') ? '开启' : '关闭';
      const userId = String(e.user_id);
      const groupId = String(e.group_id);
      
      const config = Config.getConfig() || {};
      
      if (!config?.delta_force?.push_weekly_report?.enabled) {
        return e.reply('周报推送功能当前未由机器人主人开启。');
      }
  
      if (!config.delta_force) config.delta_force = {};
      if (!config.delta_force.push_weekly_report) config.delta_force.push_weekly_report = {};
  
      const userSettings = lodash.merge({
        enabled: false,
        push_to: { group: [] }
      }, config.delta_force.push_weekly_report[userId]);
  
      const pushGroups = userSettings.push_to.group.map(String);
      const groupIndex = pushGroups.indexOf(groupId);
  
      if (action === '开启') {
        if (groupIndex > -1) {
          return e.reply('本群已经为您开启了周报推送。');
        }
        pushGroups.push(groupId);
        userSettings.enabled = true;
        userSettings.nickname = e.sender.card || e.sender.nickname;
        userSettings.push_to.group = pushGroups;
        config.delta_force.push_weekly_report[userId] = userSettings;
        
        const cron = config.delta_force.push_weekly_report.cron || '';
        let timeInfo = '';
        if (cron) {
            const parts = cron.split(' ');
            if (parts.length >= 6 && !isNaN(parts[1]) && !isNaN(parts[2])) {
                const dayOfWeekMap = ['日', '一', '二', '三', '四', '五', '六'];
                const day = dayOfWeekMap[parts[5]] || `周${parts[5]}`;
                timeInfo = ` (每${day}${parts[2]}:${parts[1].padStart(2, '0')})`;
            }
        }
        await e.reply(`已为您在本群开启周报推送！${timeInfo}`);

      } else { // 关闭
        if (groupIndex === -1) {
          return e.reply('您尚未在本群开启周报推送。');
        }
        pushGroups.splice(groupIndex, 1);
  
        if (pushGroups.length === 0) {
          delete config.delta_force.push_weekly_report[userId];
          await e.reply('已为您关闭所有周报推送。');
        } else {
          userSettings.push_to.group = pushGroups;
          config.delta_force.push_weekly_report[userId] = userSettings;
          await e.reply('已为您在本群关闭周报推送。');
        }
      }
      
      Config.setConfig(config);
      return true;
    }
}