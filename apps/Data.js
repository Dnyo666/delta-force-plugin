import plugin from '../../../lib/plugins/plugin.js'
import utils from '../utils/utils.js'
import Code from '../components/Code.js'

export class Data extends plugin {
  constructor (e) {
    super({
      name: '三角洲数据',
      dsc: '查询三角洲行动个人数据',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)(数据|data)$',
          fnc: 'getPersonalData'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
  }

  async getPersonalData () {
    const token = await utils.getAccount(this.e.user_id)
    if (!token) {
      await this.e.reply('您尚未绑定账号，请使用 #三角洲登录 进行绑定。')
      return true
    }

    await this.e.reply('正在查询您的统计数据，请稍候...')

    const res = await this.api.getPersonalData(token)

    if (!res || res.result !== 0 || !res.solDetail || !res.mpDetail) {
      await this.e.reply(`查询数据失败: ${res.error_info || 'API返回数据不正确'}`)
      return true
    }

    const { solDetail, mpDetail } = res

    // --- 数据格式化 ---
    const formatDuration = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0分钟';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}小时${minutes}分钟`;
    }
    
    solDetail.solduration = formatDuration(solDetail.solduration);
    mpDetail.tdmduration = formatDuration(mpDetail.tdmduration * 60); // 全面战场是分钟，转为秒再格式化

    // --- 消息拼接 ---
    let msg = '【个人统计数据】\n'

    msg += '--- 烽火地带 ---\n'
    msg += `排位分: ${solDetail.rankpoint || '-'}\n`
    msg += `总对局: ${solDetail.soltotalfght || '-'}\n`
    msg += `总撤离: ${solDetail.solttotalescape || '-'}\n`
    msg += `撤离率: ${solDetail.solescaperatio ? (solDetail.solescaperatio / 100).toFixed(2) + '%' : '-'}\n`
    msg += `总击杀: ${solDetail.soltotalkill || '-'}\n`
    msg += `游戏时长: ${solDetail.solduration}\n`

    msg += '\n--- 全面战场 ---\n'
    msg += `排位分: ${mpDetail.tdmrankpoint || '-'}\n`
    msg += `总对局: ${mpDetail.tdmtotalfight || '-'}\n`
    msg += `总胜场: ${mpDetail.totalwin || '-'}\n`
    msg += `胜率: ${mpDetail.tdmsuccessratio ? (mpDetail.tdmsuccessratio / 100).toFixed(2) + '%' : '-'}\n`
    msg += `总击杀: ${mpDetail.tdmtotalkill || '-'}\n`
    msg += `分均击杀: ${mpDetail.avgkillperminute ? (mpDetail.avgkillperminute / 100).toFixed(2) : '-'}\n`
    msg += `游戏时长: ${mpDetail.tdmduration}`

    await this.e.reply(msg.trim())
    return true
  }
}
