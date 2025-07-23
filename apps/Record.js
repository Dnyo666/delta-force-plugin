import plugin from '../../../lib/plugins/plugin.js';
import DeltaForceAPI from '../components/Code.js';

const modeMap = {
    '烽火': 4, '烽火地带': 4, 'sol': 4, '4': 4,
    '战场': 5, '全面战场': 5, 'mp': 5, '5': 5
};

export class DeltaForceRecord extends plugin {
    constructor() {
        super({
            name: '三角洲行动-战绩记录',
            event: 'message',
            priority: 1009,
            rule: [
                {
                    reg: '^(#三角洲|\^)战绩(?: (烽火|烽火地带|sol|4|战场|全面战场|mp|5))?(?: (\\d+))?$',
                    fnc: 'getRecord'
                }
            ]
        });
    }

    async getRecord(e) {
        // 解析参数
        const [, , modeStr, pageStr] = e.msg.match(this.rule[0].reg);
        const mode = modeStr ? modeMap[modeStr] : 4; // 默认烽火地带
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
        // 查询战绩
        const res = await DeltaForceAPI.get('/df/person/record', {
            frameworkToken: token,
            type: mode,
            page: page
        });
        if (!res || !res.success || !res.data || !res.data.length) {
            return await e.reply('获取战绩失败，或当前页无记录');
        }
        // 渲染战绩
        let msg = `【三角洲行动-战绩记录】\n模式：${mode === 4 ? '烽火地带' : '全面战场'} | 第 ${page} 页\n\n`;
        if (mode === 4) { // 烽火地带
            res.data.forEach((r, i) => {
                msg += `[${i + 1}] 地图: ${r.MapId} | 时间: ${r.dtEventTime}\n`;
                msg += `  状态: ${r.EscapeFailReason === 1 ? '成功撤离' : '撤离失败'} | 带出价值: ${r.FinalPrice}\n`;
                msg += `  击败干员: ${r.KillCount} | 击杀AI: ${r.KillAICount}\n\n`;
            });
        } else { // 全面战场
            res.data.forEach((r, i) => {
                msg += `[${i + 1}] 地图: ${r.MapID} | 时间: ${r.dtEventTime}\n`;
                msg += `  结果: ${r.MatchResult === 1 ? '胜利' : '失败'} | 得分: ${r.TotalScore}\n`;
                msg += `  KDA: ${r.KillNum}/${r.Death}/${r.Assist}\n\n`;
            });
        }
        await e.reply(msg.trim());
    }
} 