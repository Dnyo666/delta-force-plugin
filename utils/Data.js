import Code from '../components/Code.js';

let mapData = null;
let operatorData = null;

async function fetchAndCache(dataType) {
    const api = new Code();
    try {
        if (dataType === 'maps') {
            const res = await api.getMaps();
            if (res && (res.success || res.code === 0)) {
                mapData = new Map(res.data.map(item => [String(item.id), item.name]));
            } else {
                logger.error('[Delta-Force 数据管理器] 获取地图数据失败:', res || '无响应');
            }
        } else if (dataType === 'operators') {
            const res = await api.getOperators();
            if (res && (res.success || res.code === 0)) {
                operatorData = new Map(res.data.map(item => [String(item.id), item.name]));
            } else {
                logger.error('[Delta-Force 数据管理器] 获取干员数据失败:', res || '无响应');
            }
        }
    } catch (error) {
        logger.error(`[Delta-Force 数据管理器] 缓存 ${dataType} 数据失败:`, error);
    }
}

export default {
    async init() {
        logger.info('[Delta-Force 数据管理器] 正在初始化数据缓存...');
        await Promise.all([
            fetchAndCache('maps'),
            fetchAndCache('operators')
        ]);
        logger.info('[Delta-Force 数据管理器] 数据缓存初始化完成。');
    },

    getMapName(id) {
        if (!mapData) {
            logger.warn('[Delta-Force 数据管理器] 地图数据未就绪, 返回备用值。');
            return `地图(${id})`;
        }
        return mapData.get(String(id)) || `未知地图(${id})`;
    },

    getOperatorName(id) {
        if (!operatorData) {
            logger.warn('[Delta-Force 数据管理器] 干员数据未就绪, 返回备用值。');
            return `干员(${id})`;
        }
        return operatorData.get(String(id)) || `未知干员(${id})`;
    }
}; 