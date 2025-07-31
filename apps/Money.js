import utils from '../utils/utils.js'
import Code from '../components/Code.js'

export class Money extends plugin {
    constructor (e) {
        super({
            name: '三角洲货币查询',
            dsc: '查询游戏内货币信息',
            event: 'message',
            priority: 100,
            rule: [
                {
                    reg: '^(#三角洲|\\^)(货币|money|余额)$',
                    fnc: 'getMoney'
                }
            ]
        })
        this.e = e
        this.api = new Code(e)
    }

    async getMoney () {
        const token = await utils.getAccount(this.e.user_id)
        if (!token) {
            return await this.e.reply('您尚未绑定账号，请使用 #三角洲登录 进行绑定。')
        }

        const res = await this.api.getMoney(token)

        if (!res || !res.data) {
            return await this.e.reply('获取货币信息失败，或API未返回有效数据。')
        }

        let msg = `【三角洲行动-货币信息】\n`
        if (Array.isArray(res.data) && res.data.length > 0) {
            res.data.forEach(item => {
                msg += `${item.name}: ${item.totalMoney}\n`
            })
        } else {
            msg += '未查询到任何货币信息。'
        }
        
        await this.e.reply(msg.trim())
    }
} 