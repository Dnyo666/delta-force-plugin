import plugin from '../../../lib/plugins/plugin.js'
import utils from '../utils/utils.js'
import Code from '../components/Code.js'

export class BanHistory extends plugin {
  constructor (e) {
    super({
      name: '三角洲封号记录',
      dsc: '查询三角洲行动账号的封号记录',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)(封号记录|banhistory)$',
          fnc: 'getBanHistory'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
  }

  async getBanHistory () {
    // 优先获取QQ安全中心的token
    const token = await utils.getAccount(this.e.user_id, 'qqsafe')
    if (!token) {
      await this.e.reply('您尚未绑定或激活QQ安全中心账号，请使用 #三角洲登录qqsafe 进行绑定。')
      return true
    }

    await this.e.reply('正在查询封号记录，请稍候...')

    const res = await this.api.getBanHistory(token)

    if (await utils.handleApiError(res, this.e)) return true

    if (!res.data || !Array.isArray(res.data)) {
      await this.e.reply(`查询失败: ${res.msg || 'API 返回数据格式不正确'}`)
      return true
    }
    
    const banList = res.data;
    
    if (banList.length === 0) {
      await this.e.reply('该账号暂无封号记录。')
      return true
    }

    // --- 构造转发消息 ---
    const forwardMsg = []
    const bot = global.Bot

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
      let msg = `--- 封号记录 ${index + 1} ---\n`;
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
        nickname: bot.nickname,
        user_id: bot.uin
      })
    })
    
    // 创建合并转发消息
    const result = await this.e.reply(await bot.makeForwardMsg(forwardMsg), false, { recallMsg: 0 })

    if (!result) {
      await this.e.reply('生成转发消息失败，请联系管理员。')
    }

    return true
  }
} 