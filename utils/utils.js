import fetch from 'node-fetch'
import lodash from 'lodash'
import fs from 'fs'
import path from 'path'
import Config from '../components/Config.js'
import Code from '../components/Code.js'; // 引入Code以调用API

function getClientID () {
    return Config.getConfig()?.delta_force?.clientID;
}

const utils = {
    /**
     * @description: 设置当前用户的激活token
     * @param {string} user_id
     * @param {string} token
     */
    async setActiveToken(user_id, token) {
        await redis.set(`delta-force:active-token:${user_id}`, token);
    },

    /**
     * @description: 获取当前用户的激活token
     * 优先从Redis读取激活token，如果没有则从API获取列表并自动设置第一个为激活
     * @param {String} user_id
     * @return {String|null}
     */
    async getAccount(user_id) {
        // 1. 优先从 Redis 获取激活 token
        let activeToken = await redis.get(`delta-force:active-token:${user_id}`);
        if (activeToken) return activeToken;

        // 2. 如果没有，则从API获取账号列表
        const clientID = getClientID();
        const api = new Code(); // 实例化API
        if (!clientID) {
            logger.error('[DELTA FORCE PLUGIN] getAccount无法获取clientID');
            return null;
        }

        const res = await api.getUserList({
            clientID,
            platformID: user_id,
            clientType: 'qq'
        });

        if (res && res.code === 0 && res.data && res.data.length > 0) {
            // 3. 寻找第一个有效的token作为默认激活token
            const firstValidAccount = res.data.find(acc => acc.isValid);
            if (firstValidAccount && firstValidAccount.frameworkToken) {
                const defaultToken = firstValidAccount.frameworkToken;
                // 4. 将其设置为激活token并返回
                await this.setActiveToken(user_id, defaultToken);
                return defaultToken;
            }
        }

        return null; // 用户确实没有任何有效账号
    },

    /**
     * @description: 格式化时间
     * @param {Number|String} value - 时长
     * @param {String} unit - 单位 (seconds/minutes)
     * @return {String}
     */
    formatDuration(value, unit = 'seconds') {
        const numValue = parseInt(value, 10);
        if (isNaN(numValue) || numValue < 0) return '-';
        if (numValue === 0) return '0分钟';
        
        let totalMinutes = 0;
        if (unit === 'seconds') {
            totalMinutes = Math.floor(numValue / 60);
        } else {
            totalMinutes = numValue;
        }

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        if (hours > 0) {
            return `${hours}小时${minutes}分钟`;
        }
        return `${minutes}分钟`;
    }
};

export default utils; 