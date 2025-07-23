import plugin from '../../../lib/plugins/plugin.js';
import DeltaForceAPI from '../components/Code.js';

export class DeltaForceMoney extends plugin {
    constructor() {
        super({
            name: '三角洲行动-货币信息',
            event: 'message',
            priority: 1009,
            rule: [
                {
                    reg: '^(#三角洲|\^)(货币|余额)$',
                    fnc: 'getMoney'
                }
            ]
        });
    }

    async getMoney(e) {
        // 获取 frameworkToken
        let raw = await redis.get(`delta-force:token:${e.user_id}`);
        let token = '';
        if (raw) {
            try {
                const arr = JSON.parse(raw);
                token = Array.isArray(arr) ? arr[0] : arr;
            } catch {
                token = raw;
            }
        }
        if (!token) return await e.reply('请先扫码登录或绑定 frameworkToken');
        // 查询货币信息
        const res = await DeltaForceAPI.get('/df/person/money', {
            frameworkToken: token
        });
        if (!res || !res.success || !res.data) {
            return await e.reply('获取货币信息失败，请稍后重试');
        }
        // 渲染货币信息
        let msg = `【三角洲行动-货币信息】\n`;
        res.data.forEach(item => {
            msg += `${item.objectName}: ${item.count}\n`;
        });
        await e.reply(msg.trim());
    }
} 