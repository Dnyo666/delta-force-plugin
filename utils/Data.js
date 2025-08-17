import Code from '../components/Code.js'
import fs from 'fs'
import path from 'path'
import YAML from 'yaml'
import { pluginRoot } from '../model/path.js'

let mapData = null;
let operatorData = null;
let rankScoreData = null;

// 本地数据文件路径
const localMapsFile = path.join(pluginRoot, 'config', 'maps.yaml');
const localOperatorsFile = path.join(pluginRoot, 'config', 'operators.yaml');
const localRankScoreFile = path.join(pluginRoot, 'config', 'rankscore.yaml');

/**
 * 加载本地YAML数据
 * @param {string} filePath - YAML文件路径
 * @returns {Map|null} - 加载的数据Map或null
 */
function loadLocalData(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const data = YAML.parse(fileContent);
            
            if (data && typeof data === 'object') {
                logger.info(`[Delta-Force 数据管理器] 成功加载本地数据: ${filePath}`);
                return new Map(Object.entries(data));
            }
        } else {
            logger.warn(`[Delta-Force 数据管理器] 本地数据文件不存在: ${filePath}`);
        }
    } catch (error) {
        logger.error(`[Delta-Force 数据管理器] 加载本地数据失败 (${filePath}):`, error);
    }
    return null;
}

/**
 * 保存数据到本地YAML文件
 * @param {Map} dataMap - 要保存的Map数据
 * @param {string} filePath - 保存的文件路径
 */
function saveLocalData(dataMap, filePath) {
    try {
        if (!dataMap) return;
        
        // 将Map转换为普通对象
        const dataObj = Object.fromEntries(dataMap);
        
        // 确保目录存在
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        // 写入YAML文件
        fs.writeFileSync(filePath, YAML.stringify(dataObj), 'utf8');
        logger.info(`[Delta-Force 数据管理器] 数据已保存到 ${filePath}`);
    } catch (error) {
        logger.error(`[Delta-Force 数据管理器] 保存本地数据失败 (${filePath}):`, error);
    }
}

/**
 * 加载排位分数数据
 * @param {string} filePath - YAML文件路径
 * @returns {Object|null} - 加载的数据对象或null
 */
function loadRankScoreData(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const data = YAML.parse(fileContent);
            
            if (data && typeof data === 'object') {
                logger.info(`[Delta-Force 数据管理器] 成功加载排位分数数据: ${filePath}`);
                return data;
            }
        } else {
            logger.warn(`[Delta-Force 数据管理器] 排位分数数据文件不存在: ${filePath}`);
        }
    } catch (error) {
        logger.error(`[Delta-Force 数据管理器] 加载排位分数数据失败 (${filePath}):`, error);
    }
    return null;
}

/**
 * 保存排位分数数据到本地YAML文件
 * @param {Object} dataObj - 要保存的数据对象
 * @param {string} filePath - 保存的文件路径
 */
function saveRankScoreData(dataObj, filePath) {
    try {
        if (!dataObj) return;
        
        // 确保目录存在
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        // 写入YAML文件
        fs.writeFileSync(filePath, YAML.stringify(dataObj), 'utf8');
        logger.info(`[Delta-Force 数据管理器] 排位分数数据已保存到 ${filePath}`);
    } catch (error) {
        logger.error(`[Delta-Force 数据管理器] 保存排位分数数据失败 (${filePath}):`, error);
    }
}

async function fetchAndCache(dataType) {
    const api = new Code();
    try {
        if (dataType === 'maps') {
            const res = await api.getMaps();
            if (res && (res.success || res.code === 0)) {
                mapData = new Map(res.data.map(item => [String(item.id), item.name]));
                // 缓存成功后保存到本地
                saveLocalData(mapData, localMapsFile);
            } else {
                logger.error('[Delta-Force 数据管理器] 获取地图数据失败:', res || '无响应');
                // 尝试从本地加载
                const localData = loadLocalData(localMapsFile);
                if (localData && localData.size > 0) {
                    mapData = localData;
                    logger.info('[Delta-Force 数据管理器] 已从本地加载地图数据');
                }
            }
        } else if (dataType === 'operators') {
            const res = await api.getOperators();
            if (res && (res.success || res.code === 0)) {
                operatorData = new Map(res.data.map(item => [String(item.id), item.name]));
                // 缓存成功后保存到本地
                saveLocalData(operatorData, localOperatorsFile);
            } else {
                logger.error('[Delta-Force 数据管理器] 获取干员数据失败:', res || '无响应');
                // 尝试从本地加载
                const localData = loadLocalData(localOperatorsFile);
                if (localData && localData.size > 0) {
                    operatorData = localData;
                    logger.info('[Delta-Force 数据管理器] 已从本地加载干员数据');
                }
            }
        } else if (dataType === 'rankscore') {
            const res = await api.getRankScore();
            if (res && (res.success || res.code === 0)) {
                // 处理排位分数数据结构
                const processedData = {};
                for (const mode in res.data) {
                    processedData[mode] = {};
                    if (Array.isArray(res.data[mode])) {
                        res.data[mode].forEach(item => {
                            processedData[mode][String(item.score)] = item.name;
                        });
                    }
                }
                rankScoreData = processedData;
                // 缓存成功后保存到本地
                saveRankScoreData(rankScoreData, localRankScoreFile);
            } else {
                logger.error('[Delta-Force 数据管理器] 获取排位分数数据失败:', res || '无响应');
                // 尝试从本地加载
                const localData = loadLocalData(localRankScoreFile);
                if (localData && Object.keys(localData).length > 0) {
                    rankScoreData = localData;
                    logger.info('[Delta-Force 数据管理器] 已从本地加载排位分数数据');
                }
            }
        }
    } catch (error) {
        logger.error(`[Delta-Force 数据管理器] 缓存 ${dataType} 数据失败:`, error);
        // 发生错误时尝试从本地加载
        if (dataType === 'maps') {
            const localData = loadLocalData(localMapsFile);
            if (localData && localData.size > 0) {
                mapData = localData;
                logger.info('[Delta-Force 数据管理器] 已从本地加载地图数据');
            }
        } else if (dataType === 'operators') {
            const localData = loadLocalData(localOperatorsFile);
            if (localData && localData.size > 0) {
                operatorData = localData;
                logger.info('[Delta-Force 数据管理器] 已从本地加载干员数据');
            }
        } else if (dataType === 'rankscore') {
            const localData = loadLocalData(localRankScoreFile);
            if (localData && Object.keys(localData).length > 0) {
                rankScoreData = localData;
                logger.info('[Delta-Force 数据管理器] 已从本地加载排位分数数据');
            }
        }
    }
}

export default {
    async init() {
        logger.mark('[Delta-Force 数据管理器] 正在初始化数据缓存...');
        
        // 先尝试加载本地数据作为初始数据
        const localMaps = loadLocalData(localMapsFile);
        if (localMaps && localMaps.size > 0) {
            mapData = localMaps;
            logger.mark(`[Delta-Force 数据管理器] 已从本地加载地图数据 (${localMaps.size}条记录)`);
        }
        
        const localOperators = loadLocalData(localOperatorsFile);
        if (localOperators && localOperators.size > 0) {
            operatorData = localOperators;
            logger.mark(`[Delta-Force 数据管理器] 已从本地加载干员数据 (${localOperators.size}条记录)`);
        }
        
        const localRankScore = loadRankScoreData(localRankScoreFile);
        if (localRankScore && Object.keys(localRankScore).length > 0) {
            rankScoreData = localRankScore;
            logger.mark(`[Delta-Force 数据管理器] 已从本地加载排位分数数据 (${Object.keys(localRankScore).length}个模式)`);
        }
        
        // 然后尝试从API获取最新数据
        await Promise.all([
            fetchAndCache('maps'),
            fetchAndCache('operators'),
            fetchAndCache('rankscore')
        ]);
        
        logger.info('[Delta-Force 数据管理器] 数据缓存初始化完成。');
    },

    getMapName(id) {
        // 如果mapData为空，尝试立即从本地加载
        if (!mapData) {
            mapData = loadLocalData(localMapsFile);
            if (mapData && mapData.size > 0) {
                logger.info(`[Delta-Force 数据管理器] 已临时从本地加载地图数据 (${mapData.size}条记录)`);
            } else {
                logger.warn('[Delta-Force 数据管理器] 地图数据未就绪, 返回备用值。');
                return `地图(${id})`;
            }
        }
        return mapData.get(String(id)) || `未知地图(${id})`;
    },

    getOperatorName(id) {
        // 如果operatorData为空，尝试立即从本地加载
        if (!operatorData) {
            operatorData = loadLocalData(localOperatorsFile);
            if (operatorData && operatorData.size > 0) {
                logger.info(`[Delta-Force 数据管理器] 已临时从本地加载干员数据 (${operatorData.size}条记录)`);
            } else {
                logger.warn('[Delta-Force 数据管理器] 干员数据未就绪, 返回备用值。');
                return `干员(${id})`;
            }
        }
        return operatorData.get(String(id)) || `未知干员(${id})`;
    },

    /**
     * 根据分数获取对应的段位名称
     * @param {number|string} score - 分数
     * @param {string} mode - 模式 ('sol' 或 'tdm')
     * @returns {string} - 段位名称
     */
    getRankByScore(score, mode = 'sol') {
        // 如果rankScoreData为空，尝试立即从本地加载
        if (!rankScoreData) {
            rankScoreData = loadRankScoreData(localRankScoreFile);
            if (rankScoreData && Object.keys(rankScoreData).length > 0) {
                logger.info(`[Delta-Force 数据管理器] 已临时从本地加载排位分数数据 (${Object.keys(rankScoreData).length}个模式)`);
            } else {
                logger.warn('[Delta-Force 数据管理器] 排位分数数据未就绪, 返回备用值。');
                return `${score}分`;
            }
        }

        const numScore = parseInt(score);
        if (isNaN(numScore)) {
            return `分数无效(${score})`;
        }

        const modeData = rankScoreData[mode];
        if (!modeData) {
            return `${score}分 (${mode}模式)`;
        }

        // 获取所有分数阈值并排序
        const thresholds = Object.keys(modeData).map(s => parseInt(s)).sort((a, b) => b - a);
        
        // 找到第一个小于等于目标分数的阈值
        for (const threshold of thresholds) {
            if (numScore >= threshold) {
                const rankName = modeData[String(threshold)];
                
                // 检查是否是最高段位（统帅/三角洲巅峰）需要计算星级
                const isHighestRank = (mode === 'sol' && threshold === 6000) || (mode === 'tdm' && threshold === 5000);
                
                if (isHighestRank && numScore > threshold) {
                    // 计算星级：超出部分每50分一颗星
                    const extraScore = numScore - threshold;
                    const stars = Math.floor(extraScore / 50);
                    if (stars > 0) {
                        return `${rankName}${stars}星 (${numScore})`;
                    }
                }
                
                return `${rankName} (${numScore})`;
            }
        }

        // 如果分数低于所有阈值，返回最低段位
        const lowestThreshold = thresholds[thresholds.length - 1];
        const lowestRank = modeData[String(lowestThreshold)];
        return `${lowestRank} (${numScore})`;
    },
    
    /**
     * 根据段位名称和模式获取段位图片路径
     * @param {string} rankName - 段位名称（如"铂金 II"）
     * @param {string} mode - 模式 ('sol' 或 'tdm'/'mp')
     * @returns {string} - 段位图片路径
     */
    getRankImagePath(rankName, mode = 'sol') {
        if (!rankName || rankName.includes('分数无效') || rankName.includes('未知')) {
            return null;
        }

        // 清理段位名称，移除分数和星级信息
        const cleanRankName = rankName.replace(/\s*\(\d+\)/, '').replace(/\d+星/, '').trim();
        
        // 段位映射表
        const rankMappings = {
            'sol': {
                '青铜 V': '1_5', '青铜 IV': '1_4', '青铜 III': '1_3', '青铜 II': '1_2', '青铜 I': '1_1',
                '白银 V': '2_5', '白银 IV': '2_4', '白银 III': '2_3', '白银 II': '2_2', '白银 I': '2_1',
                '黄金 V': '3_5', '黄金 IV': '3_4', '黄金 III': '3_3', '黄金 II': '3_2', '黄金 I': '3_1',
                '铂金 V': '4_5', '铂金 IV': '4_4', '铂金 III': '4_3', '铂金 II': '4_2', '铂金 I': '4_1',
                '钻石 V': '5_5', '钻石 IV': '5_4', '钻石 III': '5_3', '钻石 II': '5_2', '钻石 I': '5_1',
                '黑鹰 V': '6_5', '黑鹰 IV': '6_4', '黑鹰 III': '6_3', '黑鹰 II': '6_2', '黑鹰 I': '6_1',
                '三角洲巅峰': '7'
            },
            'mp': {
                '列兵 V': '1_5', '列兵 IV': '1_4', '列兵 III': '1_3', '列兵 II': '1_2', '列兵 I': '1_1',
                '上等兵 V': '2_5', '上等兵 IV': '2_4', '上等兵 III': '2_3', '上等兵 II': '2_2', '上等兵 I': '2_1',
                '军士长 V': '3_5', '军士长 IV': '3_4', '军士长 III': '3_3', '军士长 II': '3_2', '军士长 I': '3_1',
                '尉官 V': '4_5', '尉官 IV': '4_4', '尉官 III': '4_3', '尉官 II': '4_2', '尉官 I': '4_1',
                '校官 V': '5_5', '校官 IV': '5_4', '校官 III': '5_3', '校官 II': '5_2', '校官 I': '5_1',
                '将军 V': '6_5', '将军 IV': '6_4', '将军 III': '6_3', '将军 II': '6_2', '将军 I': '6_1',
                '统帅': '7'
            }
        };

        // 统一模式名称
        const modeKey = mode === 'tdm' ? 'mp' : mode;
        const mappings = rankMappings[modeKey];
        
        if (!mappings) {
            logger.warn(`[Delta-Force 数据管理器] 未知的游戏模式: ${mode}`);
            return null;
        }

        const rankCode = mappings[cleanRankName];
        if (!rankCode) {
            logger.warn(`[Delta-Force 数据管理器] 未找到段位映射: ${cleanRankName} (模式: ${modeKey})`);
            return null;
        }

        return `rank/${modeKey}/${rankCode}.webp`;
    },

    /**
     * 随机选择一张背景图片
     * @returns {string} - 背景图片路径
     */
    getRandomBackground() {
        const backgrounds = ['bg2-1.webp', 'bg2-2.webp', 'bg2-3.webp', 'bg2-4.webp', 'bg2-5.webp', 'bg2-6.webp'];
        const randomIndex = Math.floor(Math.random() * backgrounds.length);
        return `background/${backgrounds[randomIndex]}`;
    },
    
}; 