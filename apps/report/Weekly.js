import utils from '../../utils/utils.js'
import Code from '../../components/Code.js'
import DataManager from '../../utils/Data.js'
import lodash from 'lodash'
import Config from '../../components/Config.js'
import Render from '../../components/Render.js'

export class Weekly extends plugin {
    // URL解码函数
    decodeUserInfo(str) {
        try {
            return decodeURIComponent(str || '')
        } catch (e) {
            return str || ''
        }
    }
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

        await e.reply('正在查询您的本周战报，请稍候...');
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

        // 如果查询全部模式，即使某个模式没有数据，也要显示卡片
        // 只有当两个模式都没有数据时，才提示无数据
        if (!mode) {
            // 查询全部模式：即使某个模式没有数据，也要在模板中设置（显示"暂无数据"）
            if (!solData && !mpData) {
                return e.reply('暂无周报数据，不打两把吗？')
            }
        } else {
            // 指定模式查询：如果没有数据，提示无数据
            if (!solData && !mpData) {
                return e.reply('暂无周报数据，不打两把吗？')
            }
        }

        // --- 获取用户信息（包括头像） ---
        let userName = e.sender.card || e.sender.nickname
        let userAvatar = ''
        try {
            const personalInfoRes = await this.api.getPersonalInfo(token)
            if (personalInfoRes && personalInfoRes.data && personalInfoRes.roleInfo) {
                const { userData, careerData } = personalInfoRes.data
                const { roleInfo } = personalInfoRes

                // 获取用户名（优先使用游戏内名称）
                const gameUserName = this.decodeUserInfo(userData?.charac_name || roleInfo?.charac_name)
                if (gameUserName) {
                    userName = gameUserName
                }

                // 获取用户头像
                userAvatar = this.decodeUserInfo(userData?.picurl || roleInfo?.picurl)
                if (userAvatar && /^[0-9]+$/.test(userAvatar)) {
                    userAvatar = `https://wegame.gtimg.com/g.2001918-r.ea725/helper/df/skin/${userAvatar}.webp`
                }
            }
        } catch (error) {
            // 获取个人信息失败，使用默认值
            logger.debug(`[Weekly] 获取用户信息失败:`, error)
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
        const avatarMap = new Map();
        if (allTeammateOpenIDs.size > 0) {
            const promises = Array.from(allTeammateOpenIDs).map(openid => 
                this.api.getFriendInfo(token, openid)
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

        // 如果没有提供日期，使用当前日期（格式：YYYYMMDD）
        let displayDate = date
        if (!displayDate) {
            const now = new Date()
            const year = now.getFullYear()
            const month = String(now.getMonth() + 1).padStart(2, '0')
            const day = String(now.getDate()).padStart(2, '0')
            displayDate = `${year}${month}${day}`
        }

        // --- 构建模板数据 ---
        const qqAvatarUrl = `http://q.qlogo.cn/headimg_dl?dst_uin=${e.user_id}&spec=640&img_type=jpg`
        const templateData = {
            userName: userName,
            userAvatar: userAvatar,
            userId: e.user_id,
            qqAvatarUrl: qqAvatarUrl,
            date: displayDate
        };

        // 处理烽火地带数据
        // 如果查询全部模式或指定sol模式，都需要显示卡片
        if (!mode || mode === 'sol') {
            if (solData) {
                // 判断是否有有效数据：总对局数大于0
                const hasValidData = solData.total_sol_num && Number(solData.total_sol_num) > 0;
                
                if (!hasValidData) {
                    // 没有数据，但需要显示卡片
                    templateData.solData = {
                        isEmpty: true
                    };
                } else {
                const solRank = solData.Rank_Score ? DataManager.getRankByScore(solData.Rank_Score, 'sol') : '-';
                
                // 检查收益和消费数据，避免NaN
                const gainedPrice = Number(solData.Gained_Price) || 0;
                const consumePrice = Number(solData.consume_Price) || 0;
                let profitRatio = '0';
                if (gainedPrice > 0 && consumePrice > 0) {
                    profitRatio = (gainedPrice / consumePrice).toFixed(2);
                } else if (gainedPrice > 0 && consumePrice === 0) {
                    profitRatio = '∞'; // 收益大于0但消费为0
                    logger.warn(`[Weekly] 烽火地带赚损比异常 - 收益: ${gainedPrice}, 消费: ${consumePrice}, 设置为∞`);
                }
                
                // 获取段位图片路径
                const solRankImagePath = solRank !== '-' ? DataManager.getRankImagePath(solRank, 'sol') : null;
                
                // 解析资产趋势 - 处理7天数据
                let assetTrend = null;
                if (solData.Total_Price) {
                    const prices = solData.Total_Price.split(',');
                    const dayMap = {
                        'Monday': '周一',
                        'Tuesday': '周二',
                        'Wednesday': '周三',
                        'Thursday': '周四',
                        'Friday': '周五',
                        'Saturday': '周六',
                        'Sunday': '周日'
                    };
                    
                    // 解析所有7天的数据
                    const dailyPrices = {};
                    prices.forEach(priceStr => {
                        const parts = priceStr.split('-');
                        if (parts.length >= 3) {
                            const dayName = parts[0];
                            const price = parseInt(parts[2]);
                            if (!isNaN(price)) {
                                dailyPrices[dayName] = price;
                            }
                        }
                    });
                    
                    // 获取周一和周日的数据（开始和结束）
                    const monday = dailyPrices['Monday'];
                    const sunday = dailyPrices['Sunday'];
                    
                    if (monday !== undefined && sunday !== undefined) {
                        // 计算7天的完整数据
                        const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                        const allPrices = allDays.map(day => dailyPrices[day]).filter(p => p !== undefined);
                        
                        // 计算最高和最低值
                        const maxPrice = Math.max(...allPrices);
                        const minPrice = Math.min(...allPrices);
                        const priceRange = maxPrice - minPrice;
                        
                        // 计算折线图坐标点
                        const chartWidth = 600;
                        const chartHeight = 120;
                        const padding = { top: 20, right: 10, bottom: 30, left: 10 };
                        const plotWidth = chartWidth - padding.left - padding.right;
                        const plotHeight = chartHeight - padding.top - padding.bottom;
                        const htmlContainerHeight = 140; // HTML容器高度（与CSS中的height一致）
                        
                        const points = allDays.map((day, index) => {
                            const price = dailyPrices[day];
                            // X坐标：均匀分布
                            const x = padding.left + (index / (allDays.length - 1)) * plotWidth;
                            // Y坐标：从底部开始，价格越高Y越小（SVG坐标系）
                            const y = padding.top + plotHeight - ((price - minPrice) / priceRange) * plotHeight;
                            // Y坐标百分比（用于HTML定位）
                            // 将SVG的Y坐标映射到HTML容器的百分比位置
                            const yPercent = ((y / chartHeight) * 100).toFixed(2);
                            
                            return {
                                dayName: dayMap[day] || day,
                                price: price ? price.toLocaleString() : '-',
                                rawPrice: price || 0,
                                x: x.toFixed(1),
                                y: y.toFixed(1),
                                xPercent: ((x / chartWidth) * 100).toFixed(2),
                                yPercent: yPercent
                            };
                        });
                        
                        // 生成折线路径
                        let pathData = '';
                        if (points.length > 0) {
                            pathData = `M ${points[0].x},${points[0].y}`;
                            for (let i = 1; i < points.length; i++) {
                                pathData += ` L ${points[i].x},${points[i].y}`;
                            }
                        }
                        
                        assetTrend = {
                            startPrice: monday.toLocaleString(),
                            endPrice: sunday.toLocaleString(),
                            maxPrice: maxPrice.toLocaleString(),
                            minPrice: minPrice.toLocaleString(),
                            chartWidth: chartWidth,
                            chartHeight: chartHeight,
                            pathData: pathData,
                            allDays: points
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
                    rankImagePath: solRankImagePath,
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
                    mostUsedMapImagePath: solData.mostUsedMap ? DataManager.getMapImagePath(solData.mostUsedMap, 'sol') : null,
                    mostUsedOperator: solData.mostUsedOperator || '无',
                    mostUsedOperatorImagePath: solData.mostUsedOperator && solData.mostUsedOperator !== '无' 
                        ? DataManager.getOperatorImagePath(solData.mostUsedOperator) 
                        : null
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
                            const operatorId = parsed.ArmedForceId;
                            const operatorName = DataManager.getOperatorName(operatorId);
                            const imagePath = DataManager.getOperatorImagePath(operatorName);
                            
                            return {
                                id: operatorId,
                                count: parsed.inum,
                                name: operatorName,
                                imagePath: imagePath
                            };
                        } catch (err) {
                            logger.error(`[Weekly] 烽火地带干员数据解析失败:`, err, `原始数据: ${s}`);
                            return null;
                        }
                    }).filter(Boolean).sort((a, b) => b.count - a.count);
                        templateData.solData.operators = operators;
                    } catch (e) {
                        logger.error(`[Weekly] 干员数据解析异常:`, e);
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
                            const mapName = DataManager.getMapName(parsed.MapId);
                            return {
                                id: parsed.MapId,
                                count: parsed.inum,
                                name: mapName,
                                imagePath: DataManager.getMapImagePath(mapName, 'sol')
                            };
                        } catch (err) {
                            return null;
                        }
                    }).filter(Boolean).sort((a, b) => b.count - a.count);
                        templateData.solData.maps = maps;
                    } catch (e) {
                        logger.error(`[Weekly] 地图数据解析异常:`, e);
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
            } else {
                // 没有数据，但需要显示卡片
                templateData.solData = {
                    isEmpty: true
                };
            }
        }

        // 处理全面战场数据
        // 如果查询全部模式或指定mp模式，都需要显示卡片
        if (!mode || mode === 'mp') {
            if (mpData) {
                // 判断是否有有效数据：总对局数大于0
                const hasValidData = mpData.total_num && Number(mpData.total_num) > 0;
                
                if (!hasValidData) {
                    // 没有数据，但需要显示卡片
                    templateData.mpData = {
                        isEmpty: true
                    };
                } else {
                    // 检查胜率计算，避免NaN
                    const totalNum = Number(mpData.total_num) || 0;
                    const winNum = Number(mpData.win_num) || 0;
                    let winRate = '0%';
                    if (totalNum > 0) {
                        winRate = ((winNum / totalNum) * 100).toFixed(1) + '%';
                    }
                    
                    const mpRank = mpData.Rank_Match_Score ? DataManager.getRankByScore(mpData.Rank_Match_Score, 'tdm') : '-';
                    
                    // 检查命中率计算，避免NaN
                    const consumeBullet = Number(mpData.Consume_Bullet_Num) || 0;
                    const hitBullet = Number(mpData.Hit_Bullet_Num) || 0;
                    let hitRate = '0%';
                    if (consumeBullet > 0) {
                        hitRate = ((hitBullet / consumeBullet) * 100).toFixed(1) + '%';
                    }

                    // 获取段位图片路径
                    const mpRankImagePath = mpRank !== '-' ? DataManager.getRankImagePath(mpRank, 'tdm') : null;

                    templateData.mpData = {
                        total_num: mpData.total_num || 0,
                        win_num: mpData.win_num || 0,
                        winRate: winRate,
                        rankName: mpRank,
                        rankImagePath: mpRankImagePath,
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
                        mostUsedMapImagePath: mpData.mostUsedMap ? DataManager.getMapImagePath(mpData.mostUsedMap, 'mp') : null,
                        mostUsedOperator: mpData.mostUsedOperator || '无',
                        mostUsedOperatorImagePath: mpData.mostUsedOperator && mpData.mostUsedOperator !== '无' 
                            ? DataManager.getOperatorImagePath(mpData.mostUsedOperator) 
                            : null
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
                                    const mapName = DataManager.getMapName(parsed.MapId);
                                    return {
                                        id: parsed.MapId,
                                        count: parsed.inum,
                                        name: mapName,
                                        imagePath: DataManager.getMapImagePath(mapName, 'mp')
                                    };
                                } catch (err) {
                                    return null;
                                }
                            }).filter(Boolean).sort((a, b) => b.count - a.count);
                            templateData.mpData.maps = maps;
                        } catch (e) {
                            logger.error(`[Weekly] 全面战场地图数据解析异常:`, e);
                            templateData.mpData.maps = [];
                        }
                    } else {
                        templateData.mpData.maps = [];
                    }
        
                    // 解析战场干员使用情况
                    if (mpData.max_inum_DeployArmedForceType && mpData.total_num > 0) {
                        const operatorId = mpData.max_inum_DeployArmedForceType;
                        const operatorName = DataManager.getOperatorName(operatorId);
                        const imagePath = DataManager.getOperatorImagePath(operatorName);
                        
                        templateData.mpData.operatorStats = {
                            name: operatorName || '未知干员',
                            imagePath: imagePath,
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
            } else {
                // 没有数据，但需要显示卡片
                templateData.mpData = {
                    isEmpty: true
                };
            }
        }

        // 渲染模板
        try {
            return await Render.render('Template/weeklyReport/weeklyReport', templateData, {
                e: e,
                retType: 'default'
            });
        } catch (error) {
            logger.error(`[Weekly] 周报渲染异常:`, error);
            await e.reply('周报渲染失败，请查看日志获取详细信息。');
            return false;
        }
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