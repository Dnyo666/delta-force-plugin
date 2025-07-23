import plugin from '../../../lib/plugins/plugin.js';
import DeltaForceAPI from '../components/Code.js';

const typeMap = {
    '设备': 1,
    '道具': 2,
    '货币': 3
};

export class DeltaForceFlows extends plugin {
    constructor() {
        super({
            name: '三角洲行动-流水记录',
            event: 'message',
            priority: 1009,
            rule: [
                {
                    reg: '^(#三角洲|\^)流水(?: (设备|道具|货币))?(?: (\\d+))?$',
                    fnc: 'getFlows'
                }
            ]
        });
    }

    async getFlows(e) {
        // 解析参数
        const [, , typeStr, pageStr] = e.msg.match(this.rule[0].reg);
        const type = typeStr ? typeMap[typeStr] : 2; // 默认道具
        const page = pageStr ? parseInt(pageStr, 10) : 1;
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
        // 查询流水
        const res = await DeltaForceAPI.get('/df/person/flows', {
            frameworkToken: token,
            type: type,
            page: page
        });
        if (!res || !res.success || !res.data || !res.data.length) {
            return await e.reply('获取流水记录失败，或当前页无记录');
        }
        // 渲染流水
        let msg = `【三角洲行动-流水记录】\n类型：${Object.keys(typeMap).find(k => typeMap[k] === type)} | 第 ${page} 页\n\n`;
        res.data.forEach((r, i) => {
            msg += `[${i + 1}] ${r.dtEventTime} ${r.FlowDesc}\n`;
        });
        await e.reply(msg.trim());
    }
} 