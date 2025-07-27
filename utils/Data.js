import Code from '../components/Code.js'
import fs from 'fs'
import path from 'path'
import YAML from 'yaml'
import { pluginRoot } from '../model/path.js'

let mapData = null;
let operatorData = null;

// 本地数据文件路径
const localMapsFile = path.join(pluginRoot, 'config', 'maps.yaml');
const localOperatorsFile = path.join(pluginRoot, 'config', 'operators.yaml');

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
        }
    }
}

/**
 * 检查API响应是否是"未绑定大区"错误
 * @param {object} res API响应对象
 * @returns {boolean} 是否是未绑定大区错误
 */
function isRegionBindingRequired(res) {
    if (!res) return false;
    
    // 检查常见的错误模式
    if (res.success === false && res.data?.ret === 99998) {
        return true;
    }
    
    // 检查错误消息是否包含绑定大区的关键词
    const errorMsg = res.message || res.msg || res.sMsg || '';
    return errorMsg.includes('绑定大区') || 
           (res.error && res.error.includes('99998'));
}

export default {
    async init() {
        logger.info('[Delta-Force 数据管理器] 正在初始化数据缓存...');
        
        // 先尝试加载本地数据作为初始数据
        const localMaps = loadLocalData(localMapsFile);
        if (localMaps && localMaps.size > 0) {
            mapData = localMaps;
            logger.info(`[Delta-Force 数据管理器] 已从本地加载地图数据 (${localMaps.size}条记录)`);
        }
        
        const localOperators = loadLocalData(localOperatorsFile);
        if (localOperators && localOperators.size > 0) {
            operatorData = localOperators;
            logger.info(`[Delta-Force 数据管理器] 已从本地加载干员数据 (${localOperators.size}条记录)`);
        }
        
        // 然后尝试从API获取最新数据
        await Promise.all([
            fetchAndCache('maps'),
            fetchAndCache('operators')
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
    
    // 导出用于检查未绑定大区错误的函数
    isRegionBindingRequired
}; 