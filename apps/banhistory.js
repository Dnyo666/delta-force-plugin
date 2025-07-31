import utils from '../utils/utils.js'
import Code from '../components/Code.js'

export class BanHistory extends plugin {
  constructor (e) {
    super({
      name: '三角洲违规记录',
      dsc: '查询三角洲行动账号的违规记录',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)(封号记录|违规记录|违规历史|封号历史)$',
          fnc: 'getBanHistory'
        }
      ]
    })
    this.api = new Code(e)
  }

  async getBanHistory (e) {
    // 优先获取QQ安全中心的token
    const token = utils.getAccount(e.user_id, 'qqsafe')
    if (!token) {
      return e.reply('您尚未绑定或激活QQ安全中心账号，请使用 #三角洲qqsafe登录 进行绑定。')
    }

    await e.reply('正在查询违规记录，请稍候...')

    const res = await this.api.getBanHistory(token)

    if (await utils.handleApiError(res, e)) return true

    if (!res.data || !Array.isArray(res.data)) {
      return e.reply(`查询失败: ${res.msg || 'API 返回数据格式不正确'}`)
    }
    
    const banList = res.data;
    
    if (banList.length === 0) {
      return e.reply('该账号暂无违规记录。')
    }

    // --- 构造转发消息 ---
    const forwardMsg = []

    // --- 数据处理函数 ---
    const formatDate = (timestamp) => {
        if (!timestamp || isNaN(timestamp)) return 'N/A';
        return new Date(timestamp * 1000).toLocaleString();
    }
    const formatDuration = (seconds) => {
        if (!seconds || isNaN(seconds)) return 'N/A';
        const days = Math.floor(seconds / (3600 * 24));
        if (days > 365 * 9) return '永久';
        const h = Math.floor((seconds % (3600 * 24)) / 3600);
        return `${days}天${h}小时`;
    }

    // 添加每条封号记录到转发消息中
    banList.forEach((ban, index) => {
      let msg = `--- 违规记录 ${index + 1} ---\n`;
      msg += `游戏: ${ban.game_name} (${ban.zone})\n`;
      msg += `类型: ${ban.type}\n`;
      msg += `原因: ${ban.reason}\n`;
      msg += `分类: ${ban.strategy_desc}\n`;
      msg += `开始时间: ${formatDate(ban.start_stmp)}\n`;
      msg += `持续时间: ${formatDuration(ban.duration)}\n`;
      if (ban.cheat_date) {
        msg += `作弊时间: ${formatDate(ban.cheat_date)}`;
      }
      
      forwardMsg.push({
        message: msg.trim(),
        nickname: e.sender.nickname,
        user_id: e.user_id
      })
    })
    
    // 创建合并转发消息
    const result = await e.reply(Bot.makeForwardMsg(forwardMsg), false, { recallMsg: 0 })

    if (!result) {
      await e.reply('生成转发消息失败，请联系管理员。')
    }

    return true
  }
} 