import utils from '../../utils/utils.js'
import Code from '../../components/Code.js'
import DataManager from '../../utils/Data.js'
import Render from '../../components/Render.js'

export class Data extends plugin {
  constructor (e) {
    super({
      name: '三角洲数据',
      dsc: '查询三角洲行动个人数据',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)(数据|data)\\s*(.*)$',
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
      await this.e.reply([segment.at(this.e.user_id), '您尚未绑定账号，请使用 #三角洲登录 进行绑定。'])
      return true
    }

    const argString = this.e.msg.replace(/^(#三角洲|\^)(数据|data)\s*/, '').trim()
    const args = argString.split(' ').filter(Boolean)

    let mode = ''
    let season = 7 // 默认赛季7

    // 健壮的参数解析，不再依赖顺序
    for (const arg of args) {
      if (['烽火', '烽火地带', 'sol', '摸金'].includes(arg)) {
        mode = 'sol'
      } else if (['全面', '全面战场', '战场', 'mp'].includes(arg)) {
        mode = 'mp'
      } else if (['all', '全部'].includes(arg.toLowerCase())) {
        season = 'all'
      } else if (!isNaN(arg)) {
        season = parseInt(arg)
      }
    }

    const res = await this.api.getPersonalData(token, mode, season)

    if (!res) {
      await this.e.reply('查询数据失败，请检查网络或联系管理员查看后台日志。')
      return true
    }

    if (res.success === false) {
      await this.e.reply(`查询数据失败: ${res.message || '未知API错误'}`)
      return true
    }
    
    let solDetail = null;
    let mpDetail = null;

    if (mode) { // 查询单模式
      const singleModeData = res.data?.data?.data;
      if (singleModeData?.solDetail) solDetail = singleModeData.solDetail;
      if (singleModeData?.mpDetail) mpDetail = singleModeData.mpDetail;
    } else { // 查询全部模式
      const allModesData = res.data;
      if (allModesData?.sol?.data?.data?.solDetail) {
        solDetail = allModesData.sol.data.data.solDetail;
      }
      if (allModesData?.mp?.data?.data?.mpDetail) {
        mpDetail = allModesData.mp.data.data.mpDetail;
      }
    }

    if (!solDetail && !mpDetail) {
      await this.e.reply('暂未查询到该账号的游戏数据。');
      return true
    }

    // --- 数据格式化 ---
    const formatDuration = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0分钟';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}小时${minutes}分钟`;
    }

    const formatGainedPrice = (price) => {
      if (!price || isNaN(price)) return '-';
      return `${(parseFloat(price) / 1000000).toFixed(2)}M`;
    };

    const formatKd = (kd) => {
      if (kd === null || kd === undefined || isNaN(kd)) return '-';
      return (parseFloat(kd) / 100).toFixed(2);
    }
    
    // --- 准备模板数据 ---
    const templateData = {
      nickname: this.e.sender.nickname,
      season: season === 'all' ? '全部' : season
    };
    
    if ((!mode || mode === 'sol') && solDetail) {
        const solRank = solDetail.levelScore ? DataManager.getRankByScore(solDetail.levelScore, 'sol') : '-';
        
        templateData.solDetail = {
          ...solDetail,
          totalGameTime: formatDuration(solDetail.totalGameTime),
          totalGainedPriceFormatted: formatGainedPrice(solDetail.totalGainedPrice),
          profitLossRatioFormatted: solDetail.profitLossRatio ? (parseFloat(solDetail.profitLossRatio) / 100000).toFixed(1) + 'K' : '-',
          lowKD: formatKd(solDetail.lowKillDeathRatio),
          medKD: formatKd(solDetail.medKillDeathRatio),
          highKD: formatKd(solDetail.highKillDeathRatio)
        };
        templateData.solRank = solRank;
    }

    if ((!mode || mode === 'mp') && mpDetail) {
        const mpRank = mpDetail.levelScore ? DataManager.getRankByScore(mpDetail.levelScore, 'tdm') : '-';
        
        templateData.mpDetail = {
          ...mpDetail,
          totalGameTime: formatDuration(mpDetail.totalGameTime * 60),
          avgKillPerMinuteFormatted: mpDetail.avgKillPerMinute ? (parseFloat(mpDetail.avgKillPerMinute) / 100).toFixed(2) : '-',
          avgScorePerMinuteFormatted: mpDetail.avgScorePerMinute ? (parseFloat(mpDetail.avgScorePerMinute) / 100).toFixed(2) : '-'
        };
        templateData.mpRank = mpRank;
    }

    // 渲染模板
    return await Render.render('Template/personalData/personalData', templateData, {
      e: this.e,
      scale: 1.2
    });
  }
}
