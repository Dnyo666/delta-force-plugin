import fetch from 'node-fetch'
import lodash from 'lodash'
import fs from 'fs'
import path from 'path'
import Config from '../components/Config.js'

const utils = {
    /**
     * @description: 获取绑定用户的 token
     * @param {String} user_id
     * @return {String|null}
     */
    async getAccount(user_id) {
        // 优先从 Redis 获取，速度最快
        let token = await redis.get(`delta-force:token:${user_id}`);
        if (token) return token;

        // 如果 Redis 没有，则从文件读取，并回写 Redis
        const userData = Config.getUserData(user_id);
        if (userData && userData.length > 0 && userData[0].token) {
            token = userData[0].token;
            // 将正确的 token 写回 redis，保持数据一致性
            await redis.set(`delta-force:token:${user_id}`, token);
            return token;
        }

        return null; // 确实没有绑定
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