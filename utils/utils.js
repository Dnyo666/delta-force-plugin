import fetch from 'node-fetch'
import lodash from 'lodash'
import fs from 'fs'
import path from 'path'

const utils = {
    /**
     * @description: 获取绑定用户的 token
     * @param {String} user_id
     * @return {String|null}
     */
    async getAccount(user_id) {
        let raw = await redis.get(`delta-force:token:${user_id}`);
        if (!raw) return null;
        try {
            // 优先解析数组格式，兼容旧的字符串格式
            const arr = JSON.parse(raw);
            return Array.isArray(arr) && arr.length > 0 ? arr[0] : (typeof arr === 'string' ? arr : null);
        } catch {
            // 如果解析失败，说明可能是旧的纯字符串 token
            return typeof raw === 'string' ? raw : null;
        }
    },

    /**
     * @description: 格式化时间
     * @param {Number|String} value - 时长
     * @param {String} unit - 单位 (seconds/minutes)
     * @return {String}
     */
    formatDuration(value, unit = 'seconds') {
        if (!value || isNaN(value)) return '-';
        let totalMinutes = 0;
        if (unit === 'seconds') {
            totalMinutes = Math.floor(parseInt(value, 10) / 60);
        } else {
            totalMinutes = parseInt(value, 10);
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