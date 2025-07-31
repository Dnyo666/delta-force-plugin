import plugin from '../../../lib/plugins/plugin.js'
import utils from '../utils/utils.js'
import Code from '../components/Code.js'

export class PlaceStatus extends plugin {
  constructor (e) {
    super({
      name: '三角洲特勤处状态',
      dsc: '查询特勤处设施的制造状态',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)(特勤处状态|placestatus)$',
          fnc: 'getPlaceStatus'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
  }

  async getPlaceStatus () {
    const token = await utils.getAccount(this.e.user_id)
    if (!token) {
      await this.e.reply('您尚未绑定账号，请使用 #三角洲登录 进行绑定。')
      return true
    }

    await this.e.reply('正在查询特勤处状态，请稍候...')

    const res = await this.api.getPlaceStatus(token)

    if (await utils.handleApiError(res, this.e)) return true

    if (!res.data || !res.data.places || !res.data.stats) {
      await this.e.reply(`查询失败: ${res.msg || 'API 返回数据格式不正确'}`)
      return true
    }
    
    const { places, stats } = res.data;
    
    if (places.length === 0) {
      await this.e.reply('未能查询到任何特勤处设施信息。')
      return true
    }

    // --- 构造转发消息 ---
    const forwardMsg = []
    const bot = global.Bot

    // --- 数据处理函数 ---
    const formatDuration = (seconds) => {
        if (!seconds || isNaN(seconds)) return 'N/A';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}小时${m}分钟${s}秒`;
    }
    
    // 添加消息头 - 总体状态
    const title = `总设施: ${stats.total} | 生产中: ${stats.producing} | 闲置: ${stats.idle}`;
    forwardMsg.push({
      message: title,
      nickname: bot.nickname,
      user_id: bot.uin
    });

    // 添加每个设施的状态到转发消息中
    places.forEach((place) => {
      let msg = `--- ${place.placeName} (Lv.${place.level}) ---\n`;
      if (place.objectDetail) {
        msg += `状态: 生产中\n`;
        msg += `物品: ${place.objectDetail.objectName}\n`;
        msg += `剩余时间: ${formatDuration(place.leftTime)}`;
      } else {
        msg += `状态: ${place.status}`;
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