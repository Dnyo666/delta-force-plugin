import plugin from '../../../lib/plugins/plugin.js'
import utils from '../utils/utils.js'
import Code from '../components/Code.js'

const typeMap = { '设备': 1, '道具': 2, '货币': 3 }

export class Flows extends plugin {
    constructor (e) {
        super({
            name: '三角洲流水',
            dsc: '查询游戏内交易流水',
            event: 'message',
            priority: 100,
            rule: [
                {
                    reg: '^(#三角洲|\\^)(流水|flows)(?: (设备|道具|货币))?(?: (\\d+))?$',
                    fnc: 'getFlows'
                }
            ]
        })
        this.e = e
        this.api = new Code(e)
    }

    async getFlows () {
        const token = await utils.getAccount(this.e.user_id)
        if (!token) {
            return await this.e.reply('您尚未绑定账号，请使用 #三角洲登录 进行绑定。')
        }

        const match = this.e.msg.match(this.rule[0].reg)
        const typeStr = match[3]
        const pageStr = match[4]
        
        const type = typeStr ? typeMap[typeStr] : 2 // 默认道具
        const page = pageStr ? parseInt(pageStr, 10) : 1

        const res = await this.api.getFlows(token, type, page)
        
        // 添加对API错误的处理
        if (await utils.handleApiError(res, this.e)) return true;

        if (!res || !res.data || !res.data.length) {
            return await this.e.reply('当前页无流水记录。')
        }
        
        const typeName = Object.keys(typeMap).find(k => typeMap[k] === type)
        let msg = `【三角洲行动-流水记录】\n类型：${typeName} | 第 ${page} 页\n\n`
        
        const decodeReason = (reason) => {
            try {
                return decodeURIComponent(reason || '')
            } catch (e) {
                return reason || '未知原因'
            }
        }

        switch (type) {
            case 1: // 设备 (Login)
                if (res.data[0]?.LoginArr) {
                    msg += `玩家：${res.data[0]?.vRoleName || '未知'}\n`
                    msg += `等级：${res.data[0]?.Level || '未知'}\n\n`
                    res.data[0].LoginArr.forEach((r, i) => {
                        msg += `[${i + 1}] 登录: ${r.indtEventTime}\n`
                        msg += `    登出: ${r.outdtEventTime}\n`
                    })
                } else {
                    msg += '未查询到设备流水信息。'
                }
                break;

            case 2: // 道具 (Item)
                if (res.data[0]?.itemArr) {
                    res.data[0].itemArr.forEach((r, i) => {
                        const reason = decodeReason(r.Reason);
                        const name = r.Name || '未知物品';
                        const change = `${r.AddOrReduce}`.startsWith('+') ? r.AddOrReduce : `${r.AddOrReduce}`;
                        msg += `[${i + 1}] ${r.dtEventTime}\n`
                        msg += `    ${name} ${change} (原因: ${reason})\n`
                    });
                } else {
                    msg += '未查询到道具流水信息。'
                }
                break;

            case 3: // 货币 (Currency)
                 if (res.data[0]?.iMoneyArr) {
                    res.data[0].iMoneyArr.forEach((r, i) => {
                        const reason = decodeReason(r.Reason);
                        const change = `${r.AddOrReduce}`.startsWith('+') ? r.AddOrReduce : `${r.AddOrReduce}`;
                        msg += `[${i + 1}] ${r.dtEventTime}\n`
                        msg += `    变动: ${change}, 余额: ${r.leftMoney} (原因: ${reason})\n`
                    });
                } else {
                    msg += '未查询到货币流水信息。'
                }
                break;
            
            default:
                msg += '未知的流水类型。'
        }

        await this.e.reply(msg.trim())
    }
} 