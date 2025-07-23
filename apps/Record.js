import plugin from '../../../lib/plugins/plugin.js'
import utils from '../utils/utils.js'
import Code from '../components/Code.js'

// --- 数据字典 ---
const solMap = {
  '2231': '零号大坝-前夜', '2201': '零号大坝-常规', '2202': '零号大坝-机密',
  '1901': '长弓溪谷-常规', '1902': '长弓溪谷-机密',
  '3901': '航天基地-机密', '3902': '航天基地-绝密',
  '8102': '巴克什-机密', '8103': '巴克什-绝密',
  '8803': '潮汐监狱-绝密'
};
const mpMap = {
  '107': '沟壕战-攻防', '108': '沟壕战-占领',
  '302': '风暴眼-攻防', '303': '风暴眼-占领',
  '54': '攀升-攻防', '103': '攀升-占领',
  '75': '临界点-攻防', '113': '贯穿-攻防',
  '34': '烬区-占领', '112': '断轨-占领',
  '210': '临界点-占领'
};
const armedForce = {
  '10007': '红狼', '10010': '威龙', '10011': '无名', '20003': '蜂医',
  '20004': '蛊', '30008': '牧羊人', '30010': '未知干员', '40005': '露娜',
  '40010': '骇爪'
};
const escapeReason = {
  '1': '撤离成功', '2': '被玩家击杀', '3': '被人机击杀'
};
const mpResult = {
  '1': '胜利', '2': '失败', '3': '中途退出'
};

export class Record extends plugin {
  constructor (e) {
    super({
      name: '三角洲战绩',
      dsc: '查询三角洲行动战绩',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^#三角洲战绩(.*)$',
          fnc: 'getRecord'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
  }

  async getRecord () {
    const modeType = this.e.msg.replace(/^(#三角洲|\^)?战绩/, '').trim()
    const mode = modeType.includes('全面') ? 'mp' : 'sol'
    const typeId = mode === 'sol' ? 4 : 5
    const page = 1 // 默认为第一页

    const token = await utils.getAccount(this.e.user_id)
    if (!token) {
      await this.e.reply('您尚未绑定账号，请使用 #三角洲登录 进行绑定。')
      return true
    }
    
    await this.e.reply(`正在查询 ${mode === 'sol' ? '烽火地带' : '全面战场'} 的战绩，请稍候...`)
    
    const res = await this.api.getRecord(token, typeId, page)

    if (!res || !res.success || !res.data || res.data.length === 0) {
      await this.e.reply(`查询战绩失败或暂无记录: ${res.message || '未知错误'}`)
      return true
    }

    // 仅显示最近的5条记录
    const records = res.data.slice(0, 5)
    let replyMsg = ''

    if (mode === 'sol') {
      replyMsg = '--- 烽火地带战绩 ---\n'
      records.forEach((r, i) => {
        const mapName = solMap[r.MapId] || `未知地图(${r.MapId})`
        const operator = armedForce[r.ArmedForceId] || `未知干员(${r.ArmedForceId})`
        const status = escapeReason[r.EscapeFailReason] || '撤离失败'
        const duration = utils.formatDuration(r.DurationS, 'seconds')
        const value = Number(r.FinalPrice).toLocaleString()

        replyMsg += `\n#${i + 1}: ${r.dtEventTime}\n`
        replyMsg += `地图: ${mapName} | 干员: ${operator}\n`
        replyMsg += `状态: ${status} | 存活: ${duration}\n`
        replyMsg += `带出价值: ${value}\n`
        replyMsg += `击杀: 干员(${r.KillCount || 0}) / AI玩家(${r.KillPlayerAICount || 0}) / 其他AI(${r.KillAICount || 0})`
        if (i < records.length - 1) replyMsg += '\n----------'
      })
    } else { // mode === 'mp'
      replyMsg = '--- 全面战场战绩 ---\n'
      records.forEach((r, i) => {
        const mapName = mpMap[r.MapID] || `未知地图(${r.MapID})`
        const operator = armedForce[r.ArmedForceId] || `未知干员(${r.ArmedForceId})`
        const result = mpResult[r.MatchResult] || '未知结果'
        const duration = utils.formatDuration(r.gametime, 'seconds')

        replyMsg += `\n#${i + 1}: ${r.dtEventTime}\n`
        replyMsg += `地图: ${mapName} | 干员: ${operator}\n`
        replyMsg += `结果: ${result} | K/D/A: ${r.KillNum}/${r.Death}/${r.Assist}\n`
        replyMsg += `得分: ${r.TotalScore.toLocaleString()} | 时长: ${duration}\n`
        replyMsg += `救援: ${r.RescueTeammateCount}`
        if (i < records.length - 1) replyMsg += '\n----------'
      })
    }

    await this.e.reply(replyMsg.trim())
    return true
  }
} 