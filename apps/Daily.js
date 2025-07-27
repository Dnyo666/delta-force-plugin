import plugin from '../../../lib/plugins/plugin.js'
import utils from '../utils/utils.js'
import Code from '../components/Code.js'
import DataManager from '../utils/Data.js'

export class Daily extends plugin {
  constructor (e) {
    super({
      name: '三角洲日报',
      dsc: '查询三角洲行动日报数据',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)(日报|daily)\\s*(.*)$',
          fnc: 'getDailyReport'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
  }

  async getDailyReport () {
    const token = await utils.getAccount(this.e.user_id)
    if (!token) {
      await this.e.reply('您尚未绑定账号，请使用 #三角洲登录 进行绑定。')
      return true
    }

    const match = this.e.msg.match(this.rule[0].reg)
    const argString = match[3] ? match[3].trim() : ''
    let mode = ''
    if (['烽火', '烽火地带', 'sol', '摸金'].includes(argString)) {
      mode = 'sol'
    } else if (['全面', '全面战场', '战场', 'mp'].includes(argString)) {
      mode = 'mp'
    }

    const res = await this.api.getDailyRecord(token, mode)

    if (!res || res.success === false) {
      await this.e.reply(`查询日报失败: ${res.message || '未知错误'}`)
      return true
    }

    let solDetail, mpDetail;

    if (mode) { // 指定模式查询
        const detailData = res.data?.data?.data;
        if (mode === 'sol') {
            solDetail = detailData?.solDetail;
        } else if (mode === 'mp') {
            mpDetail = detailData?.mpDetail;
        }
    } else { // 查询全部
        solDetail = res.data?.sol?.data?.data?.solDetail;
        mpDetail = res.data?.mp?.data?.data?.mpDetail;
    }


    if (!solDetail && !mpDetail) {
      await this.e.reply('暂无日报数据，不打两把吗？')
      return true
    }

    let msg = '【三角洲行动日报】\n'

    // --- 全面战场 ---
    if (mpDetail) {
      msg += '--- 全面战场 ---\n'
      msg += `日期: ${mpDetail.recentDate}\n`
      msg += `总对局: ${mpDetail.totalFightNum} | 胜利: ${mpDetail.totalWinNum}\n`
      msg += `总击杀: ${mpDetail.totalKillNum}\n`
      msg += `总得分: ${mpDetail.totalScore?.toLocaleString()}\n`
      const mostUsedOperator = DataManager.getOperatorName(mpDetail.mostUseForceType);
      msg += `最常用干员: ${mostUsedOperator}\n`;

      if (mpDetail.bestMatch) {
        const best = mpDetail.bestMatch
        const bestMatchMap = DataManager.getMapName(best.mapID);
        msg += '--- 当日最佳 ---\n'
        msg += `地图: ${bestMatchMap} | 时间: ${best.dtEventTime}\n`
        msg += `结果: ${best.isWinner ? '胜利' : '失败'} | KDA: ${best.killNum}/${best.death}/${best.assist}\n`
        msg += `得分: ${best.score?.toLocaleString()}\n`
      }
    }

    // --- 烽火地带 ---
    if (solDetail && solDetail.recentGainDate) {
      if (mpDetail) msg += '\n' // 分割线
      msg += '--- 烽火地带 ---\n'
      msg += `日期: ${solDetail.recentGainDate}\n`
      msg += `最近带出总价值: ${solDetail.recentGain?.toLocaleString()}\n`
      
      const topItems = solDetail.userCollectionTop?.list
      if (topItems && topItems.length > 0) {
        msg += '--- 近期高价值物资 ---\n'
        topItems.forEach(item => {
          const price = parseFloat(item.price).toLocaleString()
          msg += `${item.objectName}: ${price}\n`
        })
      }
    } else if (mode === 'sol' || !mode) {
        if (mpDetail) msg += '\n';
        msg += '--- 烽火地带 ---\n最近没有对局';
    }

    await this.e.reply(msg.trim())
    return true
  }
} 