import utils from '../../utils/utils.js'
import Code from '../../components/Code.js'
import DataManager from '../../utils/Data.js'
import lodash from 'lodash'
import Config from '../../components/Config.js'
import Render from '../../components/Render.js'

export class Weekly extends plugin {
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
        let showExtra = false

        for (const arg of args) {
            if (['烽火', '烽火地带', 'sol', '摸金'].includes(arg)) {
                mode = 'sol'
            } else if (['全面', '全面战场', '战场', 'mp'].includes(arg)) {
                mode = 'mp'
            } else if (['不展示', '否'].includes(arg)) {
                isShowNullFriend = false
            } else if (['展示', '是'].includes(arg)) {
                isShowNullFriend = true
            } else if (['详细', 'detail', 'extra'].includes(arg)) {
                showExtra = true
            } else if (/^\d{8}$/.test(arg)) {
                date = arg
            }
        }

        await e.reply('正在查询您的本周战报，请稍候...');
        const res = await this.api.getWeeklyRecord(token, mode, isShowNullFriend, date, showExtra);

        if (await utils.handleApiError(res, e)) return true;
    
        if (!res.data) {
            await e.reply(`查询失败: ${res.msg || 'API 返回数据格式不正确'}`);
            return true;
        }
    
        let solData, mpData;
        if (mode) {
            const detailData = res.data?.data?.data;
            if (mode === 'sol') {
                solData = detailData;
            } else if (mode === 'mp') {
                mpData = detailData;
            }
        } else {
            solData = res.data?.sol?.data?.data;
            mpData = res.data?.mp?.data?.data;
        }

        if (mode) {
            if (mode === 'sol' && !solData) {
                return e.reply('暂无烽火地带周报数据，不打两把吗？')
            }
            if (mode === 'mp' && !mpData) {
                return e.reply('暂无全面战场周报数据，不打两把吗？')
            }
        }

        let userName = e.sender.card || e.sender.nickname
        let userAvatar = ''
        try {
            const personalInfoRes = await this.api.getPersonalInfo(token)
            if (personalInfoRes?.data && personalInfoRes?.roleInfo) {
                const { userData } = personalInfoRes.data
                const { roleInfo } = personalInfoRes

                const gameUserName = this.decodeUserInfo(userData?.charac_name || roleInfo?.charac_name)
                if (gameUserName) {
                    userName = gameUserName
                }

                userAvatar = this.decodeUserInfo(userData?.picurl || roleInfo?.picurl)
                if (userAvatar && /^[0-9]+$/.test(userAvatar)) {
                    userAvatar = `https://wegame.gtimg.com/g.2001918-r.ea725/helper/df/skin/${userAvatar}.webp`
                }
            }
        } catch (error) {
            logger.debug(`[Weekly] 获取用户信息失败:`, error)
        }

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
                    if (data.picurl) {
                        let avatarUrl = data.picurl;
                        if (/^[0-9]+$/.test(avatarUrl)) {
                            avatarUrl = `https://wegame.gtimg.com/g.2001918-r.ea725/helper/df/skin/${avatarUrl}.webp`;
                        } else {
                            try {
                                avatarUrl = decodeURIComponent(avatarUrl);
                            } catch (e) {}
                        }
                        avatarMap.set(openid, avatarUrl);
                    }
                }
            });
        }

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

        let displayDate = date
        if (!displayDate) {
            const now = new Date()
            displayDate = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
        }

        const qqAvatarUrl = `http://q.qlogo.cn/headimg_dl?dst_uin=${e.user_id}&spec=640&img_type=jpg`
        const templateData = {
            userName,
            userAvatar,
            userId: e.user_id,
            qqAvatarUrl,
            date: displayDate
        };

        if (!mode || mode === 'sol') {
            if (solData) {
                const hasValidData = solData.total_sol_num && Number(solData.total_sol_num) > 0;
                
                if (!hasValidData) {
                    templateData.solData = { isEmpty: true };
                } else {
                const solRank = solData.Rank_Score ? DataManager.getRankByScore(solData.Rank_Score, 'sol') : '-';
                
                const gainedPrice = Number(solData.Gained_Price) || 0;
                const consumePrice = Number(solData.consume_Price) || 0;
                let profitRatio = '0';
                if (gainedPrice > 0 && consumePrice > 0) {
                    profitRatio = (gainedPrice / consumePrice).toFixed(2);
                } else if (gainedPrice > 0 && consumePrice === 0) {
                    profitRatio = '∞';
                    logger.warn(`[Weekly] 烽火地带赚损比异常 - 收益: ${gainedPrice}, 消费: ${consumePrice}, 设置为∞`);
                }
                
                const solRankImagePath = solRank !== '-' ? DataManager.getRankImagePath(solRank, 'sol') : null;
                
                let assetTrend = null;
                if (solData.Total_Price) {
                    const prices = solData.Total_Price.split(',');
                    const dayMap = {
                        'Monday': '周一', 'Tuesday': '周二', 'Wednesday': '周三', 'Thursday': '周四',
                        'Friday': '周五', 'Saturday': '周六', 'Sunday': '周日'
                    };
                    
                    const dailyPrices = {};
                    prices.forEach(priceStr => {
                        const parts = priceStr.split('-');
                        if (parts.length >= 3) {
                            const price = parseInt(parts[2]);
                            if (!isNaN(price)) {
                                dailyPrices[parts[0]] = price;
                            }
                        }
                    });
                    
                    const monday = dailyPrices['Monday'];
                    const sunday = dailyPrices['Sunday'];
                    
                    if (monday !== undefined && sunday !== undefined) {
                        const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                        const allPrices = allDays.map(day => dailyPrices[day]).filter(p => p !== undefined);
                        const maxPrice = Math.max(...allPrices);
                        const minPrice = Math.min(...allPrices);
                        const priceRange = maxPrice - minPrice;
                        
                        // 资产趋势图加宽：避免横向过于拥挤导致“看起来很奇怪”
                        const chartWidth = 2000;
                        const chartHeight = 200;
                        const padding = { top: 20, right: 10, bottom: 30, left: 10 };
                        const plotWidth = chartWidth - padding.left - padding.right;
                        const plotHeight = chartHeight - padding.top - padding.bottom;
                        
                        const points = allDays.map((day, index) => {
                            const price = dailyPrices[day];
                            const x = padding.left + (index / (allDays.length - 1)) * plotWidth;
                            const y = padding.top + plotHeight - ((price - minPrice) / priceRange) * plotHeight;
                            
                            return {
                                dayName: dayMap[day] || day,
                                price: price ? price.toLocaleString() : '-',
                                rawPrice: price || 0,
                                x: x.toFixed(1),
                                y: y.toFixed(1),
                                xPercent: ((x / chartWidth) * 100).toFixed(2),
                                yPercent: ((y / chartHeight) * 100).toFixed(2)
                            };
                        });
                        
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
                    mileage: solData.Total_Mileage ? (solData.Total_Mileage / 100000).toFixed(2) : '0',
                    total_Rescue_num: solData.total_Rescue_num || 0,
                    gameTime: `${Math.floor((solData.total_Online_Time || 0) / 3600)}小时${Math.floor(((solData.total_Online_Time || 0) % 3600) / 60)}分钟`,
                    mostUsedMap: solData.mostUsedMap || '无',
                    mostUsedMapImagePath: solData.mostUsedMap ? DataManager.getMapImagePath(solData.mostUsedMap, 'sol') : null,
                    mostUsedOperator: solData.mostUsedOperator || '无',
                    mostUsedOperatorImagePath: solData.mostUsedOperator && solData.mostUsedOperator !== '无' 
                        ? DataManager.getOperatorImagePath(solData.mostUsedOperator) 
                        : null
                };

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
                templateData.solData = { isEmpty: true };
            }
        }

        // 处理reportDm补充数据
        const reportDm = res.data?.reportDm;
        if (reportDm) {
            // 处理好友top10数据（烽火数据）
            if (reportDm.wbn?.friends && Array.isArray(reportDm.wbn.friends)) {
                const friendsData = reportDm.wbn.friends;
                // 按 total_gained_price 排序，取前10名
                const sortedFriends = friendsData
                    .filter(f => f.total_gained_price && Number(f.total_gained_price) > 0)
                    .sort((a, b) => Number(b.total_gained_price) - Number(a.total_gained_price))
                    .slice(0, 10);
                
                if (sortedFriends.length > 0) {
                    // 获取好友的昵称和头像
                    const friendOpenIDs = sortedFriends.map(f => f.Friendopenid);
                    const friendNicknameMap = new Map();
                    const friendAvatarMap = new Map();
                    
                    const friendPromises = friendOpenIDs.map(openid => 
                        this.api.getFriendInfo(token, openid)
                    );
                    const friendResults = await Promise.allSettled(friendPromises);
                    
                    friendResults.forEach((result, index) => {
                        const openid = friendOpenIDs[index];
                        if (result.status === 'fulfilled' && result.value?.success && result.value.data) {
                            const data = result.value.data;
                            if (data.charac_name) {
                                friendNicknameMap.set(openid, data.charac_name);
                            }
                            if (data.picurl) {
                                let avatarUrl = data.picurl;
                                if (/^[0-9]+$/.test(avatarUrl)) {
                                    avatarUrl = `https://wegame.gtimg.com/g.2001918-r.ea725/helper/df/skin/${avatarUrl}.webp`;
                                } else {
                                    try {
                                        avatarUrl = decodeURIComponent(avatarUrl);
                                    } catch (e) {}
                                }
                                friendAvatarMap.set(openid, avatarUrl);
                            }
                        }
                    });
                    
                    // 收集所有物品ID
                    const allItemIDs = new Set();
                    sortedFriends.forEach(friend => {
                        // 处理 CarryOut_highprice_list
                        if (friend.CarryOut_highprice_list && Array.isArray(friend.CarryOut_highprice_list)) {
                            friend.CarryOut_highprice_list.forEach(item => {
                                if (item.itemid) {
                                    allItemIDs.add(String(item.itemid));
                                }
                            });
                        }
                        // 处理 CarryOut_top2_highprice_list
                        if (friend.CarryOut_top2_highprice_list && Array.isArray(friend.CarryOut_top2_highprice_list)) {
                            friend.CarryOut_top2_highprice_list.forEach(item => {
                                if (item.itemid) {
                                    allItemIDs.add(String(item.itemid));
                                }
                            });
                        }
                    });
                    
                    // 获取物品名称
                    let itemNameMap = {};
                    if (allItemIDs.size > 0) {
                        try {
                            const itemIDsArray = Array.from(allItemIDs);
                            const itemIDsString = itemIDsArray.join(',');
                            const itemRes = await this.api.searchObject('', itemIDsString);
                            
                            if (itemRes && itemRes.success && itemRes.data && itemRes.data.keywords && Array.isArray(itemRes.data.keywords)) {
                                itemRes.data.keywords.forEach(item => {
                                    if (item.objectID) {
                                        const id = String(item.objectID);
                                        const name = item.name || item.objectName;
                                        if (name) {
                                            itemNameMap[id] = name;
                                        }
                                    }
                                });
                                logger.debug(`[Weekly] 成功获取 ${Object.keys(itemNameMap).length}/${allItemIDs.size} 个物品名称`);
                            }
                        } catch (error) {
                            logger.warn(`[Weekly] 获取物品名称失败:`, error);
                        }
                    }
                    
                    // 格式化价格
                    const formatPrice = (price) => {
                        if (!price || isNaN(price)) return '0';
                        const numPrice = Number(price);
                        if (numPrice >= 1000000) {
                            return (numPrice / 1000000).toFixed(2) + 'M';
                        } else if (numPrice >= 1000) {
                            return (numPrice / 1000).toFixed(1) + 'K';
                        } else {
                            return numPrice.toLocaleString();
                        }
                    };
                    
                    templateData.topFriends = sortedFriends.map((friend, index) => {
                        const friendName = friendNicknameMap.get(friend.Friendopenid) || `...${String(friend.Friendopenid).slice(-6)}`;
                        const friendAvatar = friendAvatarMap.get(friend.Friendopenid) || '';
                        
                        // 处理物品列表
                        const items = [];
                        const addedItemIds = new Set(); // 用于去重
                        
                        // 优先显示 CarryOut_highprice_list
                        if (friend.CarryOut_highprice_list && Array.isArray(friend.CarryOut_highprice_list)) {
                            friend.CarryOut_highprice_list.forEach(item => {
                                if (item.itemid && !addedItemIds.has(item.itemid)) {
                                    const itemId = String(item.itemid);
                                    const rawPrice = Number(item.iPrice || 0);
                                    addedItemIds.add(item.itemid);
                                    items.push({
                                        itemid: item.itemid,
                                        name: itemNameMap[itemId] || `物品${item.itemid}`,
                                        imageUrl: `https://playerhub.df.qq.com/playerhub/60004/object/${item.itemid}.png`,
                                        price: formatPrice(rawPrice),
                                        rawPrice: rawPrice, // 保存原始价格用于排序
                                        inum: item.inum || 1,
                                        quality: item.quality || 0
                                    });
                                }
                            });
                        }
                        
                        // 补充显示 CarryOut_top2_highprice_list（如果还有空位且未添加过）
                        if (friend.CarryOut_top2_highprice_list && Array.isArray(friend.CarryOut_top2_highprice_list)) {
                            friend.CarryOut_top2_highprice_list.forEach(item => {
                                if (item.itemid && !addedItemIds.has(item.itemid) && items.length < 3) {
                                    const itemId = String(item.itemid);
                                    const rawPrice = Number(item.iPrice || 0);
                                    addedItemIds.add(item.itemid);
                                    items.push({
                                        itemid: item.itemid,
                                        name: itemNameMap[itemId] || `物品${item.itemid}`,
                                        imageUrl: `https://playerhub.df.qq.com/playerhub/60004/object/${item.itemid}.png`,
                                        price: formatPrice(rawPrice),
                                        rawPrice: rawPrice, // 保存原始价格用于排序
                                        inum: item.inum || 1,
                                        quality: item.quality || 0
                                    });
                                }
                            });
                        }
                        
                        // 按价格从高到低排序
                        items.sort((a, b) => b.rawPrice - a.rawPrice);
                        
                        return {
                            rank: index + 1,
                            name: friendName,
                            avatar: friendAvatar,
                            total_gained_price: Number(friend.total_gained_price || 0).toLocaleString(),
                            total_GainedPrice: formatPrice(friend.total_GainedPrice || 0), // 净收益
                            max_GainedPrice: formatPrice(friend.max_GainedPrice || 0), // 最大单次收益
                            win_num: friend.win_num || 0,
                            lose_num: friend.lose_num || 0,
                            intimacy: friend.FriendIntimacy || 0,
                            items: items.slice(0, 3) // 最多显示3个物品
                        };
                    });
                } else {
                    templateData.topFriends = [];
                }
            } else {
                templateData.topFriends = [];
            }

            // 处理report1 - 烽火地带收益统计
            if (reportDm.report1) {
                templateData.report1 = {
                    total_sell_price: Number(reportDm.report1.total_sell_price || 0).toLocaleString()
                };
            }

            // 处理report3 - 全面战场详细统计
            if (reportDm.report3) {
                const r3 = reportDm.report3;
                const maxScoreMapId = r3.max_score_mapid ? DataManager.getMapName(r3.max_score_mapid) : '无';
                const maxScoreOperator = r3.max_mpmatch_num_deployarmedforcetype ? DataManager.getOperatorName(r3.max_mpmatch_num_deployarmedforcetype) : '无';
                const maxVehicleOperator = r3.max_vehicle_usedtime_vehicleid ? `载具ID: ${r3.max_vehicle_usedtime_vehicleid}` : '无';
                
                templateData.report3 = {
                    max_mpmatch_num: r3.max_mpmatch_num || 0,
                    max_vehicle_usedtime: r3.max_vehicle_usedtime ? `${Math.floor(Number(r3.max_vehicle_usedtime) / 60)}分钟` : '0',
                    total_killvehicle: r3.total_killvehicle || 0,
                    total_vehicle_usedtime: r3.total_vehicle_usedtime ? `${Math.floor(Number(r3.total_vehicle_usedtime) / 60)}分钟` : '0',
                    total_vehicle_inum: r3.total_vehicle_inum || 0,
                    max_score_killnum: r3.max_score_killnum || 0,
                    max_score_death: r3.max_score_death || 0,
                    win_mpmatch_num: r3.win_mpmatch_num || 0,
                    max_score_assist: r3.max_score_assist || 0,
                    total_mpmatch_num: r3.total_mpmatch_num || 0,
                    max_score_mapid: maxScoreMapId,
                    max_score_mapid_image: r3.max_score_mapid ? DataManager.getMapImagePath(maxScoreMapId, 'mp') : null,
                    max_mpmatch_num_Rescue: r3.max_mpmatch_num_Rescue || 0,
                    max_mpmatch_num_deployarmedforcetype: maxScoreOperator,
                    max_mpmatch_num_deployarmedforcetype_image: r3.max_mpmatch_num_deployarmedforcetype ? DataManager.getOperatorImagePath(maxScoreOperator) : null,
                    max_score_dteventtime: r3.max_score_dteventtime || '-',
                    total_killnum: r3.total_killnum || 0,
                    max_vehicle_usedtime_vehicleid: maxVehicleOperator,
                    total_score: Number(r3.total_score || 0).toLocaleString(),
                    max_mpmatch_num_GameTime: r3.max_mpmatch_num_GameTime ? `${Math.floor(Number(r3.max_mpmatch_num_GameTime) / 3600)}小时${Math.floor((Number(r3.max_mpmatch_num_GameTime) % 3600) / 60)}分钟` : '0',
                    total_vehicle_killnum: r3.total_vehicle_killnum || 0,
                    max_vehicle_usedtime_killplayer: r3.max_vehicle_usedtime_killplayer || 0,
                    max_mpmatch_num_Score: Number(r3.max_mpmatch_num_Score || 0).toLocaleString()
                };
            }

            // 处理report4 - 全面战场队友统计
            if (reportDm.report4) {
                const r4 = reportDm.report4;
                // 获取最佳队友和最差队友的信息
                const bestTeammateId = r4.max_mpwinnum_memberid;
                const worstTeammateId = r4.max_mplosenum_memberid;
                
                let bestTeammateName = '未知';
                let bestTeammateAvatar = '';
                let worstTeammateName = '未知';
                let worstTeammateAvatar = '';
                
                // 并行获取两个队友的信息
                const teammatePromises = [];
                if (bestTeammateId) {
                    teammatePromises.push(
                        this.api.getFriendInfo(token, bestTeammateId).then(bestInfo => ({ type: 'best', info: bestInfo })).catch(e => {
                            logger.debug(`[Weekly] 获取最佳队友信息失败:`, e);
                            return { type: 'best', info: null };
                        })
                    );
                } else {
                    teammatePromises.push(Promise.resolve({ type: 'best', info: null }));
                }
                
                if (worstTeammateId) {
                    teammatePromises.push(
                        this.api.getFriendInfo(token, worstTeammateId).then(worstInfo => ({ type: 'worst', info: worstInfo })).catch(e => {
                            logger.debug(`[Weekly] 获取最差队友信息失败:`, e);
                            return { type: 'worst', info: null };
                        })
                    );
                } else {
                    teammatePromises.push(Promise.resolve({ type: 'worst', info: null }));
                }
                
                const teammateResults = await Promise.all(teammatePromises);
                
                teammateResults.forEach(result => {
                    if (result.type === 'best' && result.info?.success && result.info.data) {
                        const data = result.info.data;
                        bestTeammateName = data.charac_name || '未知';
                        if (data.picurl) {
                            let avatarUrl = data.picurl;
                            if (/^[0-9]+$/.test(avatarUrl)) {
                                avatarUrl = `https://wegame.gtimg.com/g.2001918-r.ea725/helper/df/skin/${avatarUrl}.webp`;
                            } else {
                                try {
                                    avatarUrl = decodeURIComponent(avatarUrl);
                                } catch (e) {}
                            }
                            bestTeammateAvatar = avatarUrl;
                        }
                    } else if (result.type === 'worst' && result.info?.success && result.info.data) {
                        const data = result.info.data;
                        worstTeammateName = data.charac_name || '未知';
                        if (data.picurl) {
                            let avatarUrl = data.picurl;
                            if (/^[0-9]+$/.test(avatarUrl)) {
                                avatarUrl = `https://wegame.gtimg.com/g.2001918-r.ea725/helper/df/skin/${avatarUrl}.webp`;
                            } else {
                                try {
                                    avatarUrl = decodeURIComponent(avatarUrl);
                                } catch (e) {}
                            }
                            worstTeammateAvatar = avatarUrl;
                        }
                    }
                });
                
                const bestOperator = r4.max_mpwinnum_member_deployarmedforcetype ? DataManager.getOperatorName(r4.max_mpwinnum_member_deployarmedforcetype) : '无';
                const worstOperator = r4.max_mplosenum_member_deployarmedforcetype ? DataManager.getOperatorName(r4.max_mplosenum_member_deployarmedforcetype) : '无';
                
                templateData.report4 = {
                    best_teammate: {
                        name: bestTeammateName,
                        avatar: bestTeammateAvatar,
                        intimacy: r4.max_mpwinnum_member_friendintimacy || 0,
                        win_num: r4.max_mpwinnum_player_winmun || 0,
                        lose_num: r4.max_mpwinnum_player_wlosemun || 0,
                        kill_num: r4.max_mpwinnum_player_killnum || 0,
                        assist: r4.max_mpwinnum_player_assist || 0,
                        score: Number(r4.max_mpwinnum_player_score || 0).toLocaleString(),
                        operator: bestOperator,
                        operator_image: r4.max_mpwinnum_member_deployarmedforcetype ? DataManager.getOperatorImagePath(bestOperator) : null
                    },
                    worst_teammate: {
                        name: worstTeammateName,
                        avatar: worstTeammateAvatar,
                        intimacy: r4.max_mplosenum_member_friendintimacy || 0,
                        win_num: r4.max_mplosenum_player_winmun || 0,
                        lose_num: r4.max_mplosenum_player_wlosemun || 0,
                        kill_num: r4.max_mplosenum_player_killnum || 0,
                        assist: r4.max_mplosenum_player_assist || 0,
                        score: Number(r4.max_mplosenum_player_score || 0).toLocaleString(),
                        operator: worstOperator,
                        operator_image: r4.max_mplosenum_member_deployarmedforcetype ? DataManager.getOperatorImagePath(worstOperator) : null
                    }
                };
            }

            // 处理bk - 全面战场详细统计（载具数据）
            if (reportDm.bk) {
                const bk = reportDm.bk;
                if (bk.mp_vehicleid_list && Array.isArray(bk.mp_vehicleid_list)) {
                    templateData.bk = {
                        vehicles: bk.mp_vehicleid_list.map(v => ({
                            vehicleid: v.vehicleid,
                            inum: v.inum || 0,
                            vehicle_name: `载具${v.vehicleid}` // 暂时显示ID，后续可以添加载具名称映射
                        })).sort((a, b) => b.inum - a.inum),
                        avg_score: Number(bk.mp_avgscore || 0).toFixed(1),
                        support_count: bk.mp_supportcount || 0,
                        support_details: {
                            '1001012': bk.mp_supportcount_1001012 || 0,
                            '1001011': bk.mp_supportcount_1001011 || 0,
                            '1001014': bk.mp_supportcount_1001014 || 0,
                            '1001015': bk.mp_supportcount_1001015 || 0
                        }
                    };
                } else {
                    templateData.bk = {
                        vehicles: [],
                        avg_score: '0',
                        support_count: 0,
                        support_details: {}
                    };
                }
            }
        } else {
            templateData.topFriends = [];
        }

        if (!mode || mode === 'mp') {
            if (mpData) {
                const hasValidData = mpData.total_num && Number(mpData.total_num) > 0;
                
                if (!hasValidData) {
                    templateData.mpData = { isEmpty: true };
                } else {
                    const totalNum = Number(mpData.total_num) || 0;
                    const winNum = Number(mpData.win_num) || 0;
                    let winRate = '0%';
                    if (totalNum > 0) {
                        winRate = ((winNum / totalNum) * 100).toFixed(1) + '%';
                    }
                    
                    const mpRank = mpData.Rank_Match_Score ? DataManager.getRankByScore(mpData.Rank_Match_Score, 'tdm') : '-';
                    
                    const consumeBullet = Number(mpData.Consume_Bullet_Num) || 0;
                    const hitBullet = Number(mpData.Hit_Bullet_Num) || 0;
                    let hitRate = '0%';
                    if (consumeBullet > 0) {
                        hitRate = ((hitBullet / consumeBullet) * 100).toFixed(1) + '%';
                    }

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
                templateData.mpData = { isEmpty: true };
            }
        }

        try {
            if (mode === 'sol') {
                if (!templateData.solData || templateData.solData.isEmpty) {
                    return e.reply('暂无烽火地带周报数据，不打两把吗？')
                }
                return await Render.render('Template/weeklyReport/weeklyReport', {
                    ...templateData,
                    mpData: null
                }, {
                    e: e,
                    retType: 'default'
                });
            }
            
            if (mode === 'mp') {
                if (!templateData.mpData || templateData.mpData.isEmpty) {
                    return e.reply('暂无全面战场周报数据，不打两把吗？')
                }
                return await Render.render('Template/weeklyReport/weeklyReport', {
                    ...templateData,
                    solData: null
                }, {
                    e: e,
                    retType: 'default'
                });
            }
            
            if (!mode) {
                const hasSolData = templateData.solData && !templateData.solData.isEmpty;
                const hasMpData = templateData.mpData && !templateData.mpData.isEmpty;
                
                if (!hasSolData && !hasMpData) {
                    return e.reply('暂无周报数据，不打两把吗？');
                }
                
                if (hasSolData && hasMpData) {
                    const bot = Bot.pickUser(e.user_id);
                    const forwardMsg = [];
                    
                    const solImage = await Render.render('Template/weeklyReport/weeklyReport', {
                        ...templateData,
                        mpData: null
                    }, {
                        e: e,
                        retType: 'base64'
                    });
                    if (solImage) {
                        forwardMsg.push({
                            message: ['【烽火地带周报】\n', solImage],
                            nickname: bot.nickname,
                            user_id: bot.uin
                        });
                    }
                    
                    const mpImage = await Render.render('Template/weeklyReport/weeklyReport', {
                        ...templateData,
                        solData: null
                    }, {
                        e: e,
                        retType: 'base64'
                    });
                    if (mpImage) {
                        forwardMsg.push({
                            message: ['【全面战场周报】\n', mpImage],
                            nickname: bot.nickname,
                            user_id: bot.uin
                        });
                    }
                    
                    if (forwardMsg.length > 0) {
                        const result = await e.reply(await Bot.makeForwardMsg(forwardMsg), false, { recallMsg: 0 });
                        if (!result) {
                            await e.reply('生成转发消息失败，请联系管理员。');
                        }
                        return true;
                    }
                } else if (hasSolData) {
                    return await Render.render('Template/weeklyReport/weeklyReport', {
                        ...templateData,
                        mpData: null
                    }, {
                        e: e,
                        retType: 'default'
                    });
                } else if (hasMpData) {
                    return await Render.render('Template/weeklyReport/weeklyReport', {
                        ...templateData,
                        solData: null
                    }, {
                        e: e,
                        retType: 'default'
                    });
                }
            }
            
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

      } else {
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