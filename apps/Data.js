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
      await this.e.reply('您尚未绑定账号，请使用 #三角洲登录 进行绑定。')
      return true
    }

    await this.e.reply('正在查询您的统计数据，请稍候...')

    const argString = this.e.msg.replace(/^(#三角洲|\^)(数据|data)\s*/, '').trim()
    const args = argString.split(' ').filter(Boolean)

    let mode = ''
    let season = 5 // 默认赛季5

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
      await this.e.reply('未能查询到有效的游戏数据，可能是尚未进行过对局或API返回数据格式有误。');
      return true
    }

    // --- 数据格式化 ---
    const formatDuration = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0分钟';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}小时${minutes}分钟`;
    }
    
    // --- 消息拼接 ---
    let msg = `【个人统计数据 S${season === 'all' ? '全部' : season}】\n`
    
    if ((!mode || mode === 'sol') && solDetail) {
        solDetail.totalGameTime = formatDuration(solDetail.totalGameTime);
        msg += '--- 烽火地带 ---\n'
        msg += `排位分: ${solDetail.levelScore || '-'}\n`
        msg += `总对局: ${solDetail.totalFight || '-'}\n`
        msg += `总撤离: ${solDetail.totalEscape || '-'}\n`
        msg += `总击杀 (干员): ${solDetail.totalKill || '-'}\n`
        msg += `赚损比: ${solDetail.profitLossRatio ? (solDetail.profitLossRatio / 10000).toFixed(2) + '万' : '-'}\n`
        msg += `游戏时长: ${solDetail.totalGameTime}\n`
        msg += `收藏大红价值: ${solDetail.redTotalMoney?.toLocaleString() || '-'} (${solDetail.redTotalCount}个)\n`
    }

    if ((!mode || mode === 'mp') && mpDetail) {
        mpDetail.totalGameTime = formatDuration(mpDetail.totalGameTime * 60); // 文档中是秒，但示例像分钟，保持转换
        if (solDetail && !mode) msg += '\n'; // 如果前面有烽火数据且是查询全部，加个换行
        msg += '--- 全面战场 ---\n'
        msg += `排位分: ${mpDetail.levelScore || '-'}\n`
        msg += `总对局: ${mpDetail.totalFight || '-'}\n`
        msg += `总胜场: ${mpDetail.totalWin || '-'}\n`
        msg += `胜率: ${mpDetail.winRatio ? mpDetail.winRatio + '%' : '-'}\n`
        msg += `分均击杀: ${mpDetail.avgKillPerMinute ? (Math.floor(mpDetail.avgKillPerMinute) / 100).toFixed(2) : '-'}\n`
        msg += `分均得分: ${mpDetail.avgScorePerMinute ? (Math.floor(mpDetail.avgScorePerMinute) / 100).toFixed(2) : '-'}\n`
        msg += `游戏时长: ${mpDetail.totalGameTime}`
    }

    await this.e.reply(msg.trim())
    return true
  }
}
