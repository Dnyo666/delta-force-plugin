import plugin from '../../../lib/plugins/plugin.js'
import utils from '../utils/utils.js'
import Render from '../components/Render.js'
import Code from '../components/Code.js'

export class Data extends plugin {
  constructor (e) {
    super({
      name: '三角洲数据',
      dsc: '查询三角洲行动个人游戏数据',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)(数据|data)$',
          fnc: 'getUserData'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
  }

  async getUserData () {
    const token = await utils.getAccount(this.e.user_id)
    if (!token) {
      await this.e.reply('您尚未绑定账号，请使用 #三角洲登录 进行绑定。')
      return true
    }

    await this.e.reply('正在查询您的游戏数据，请稍候...')

    const res = await this.api.getPersonalData(token)

    if (!res || !res.data) {
      await this.e.reply(`查询失败: ${res.msg || 'API 返回数据格式不正确'}`)
      return true
    }
    
    const data = res.data

    // 数据处理
    if (data.solDetail?.totalGameTime) {
      data.solDetail.totalGameTime = utils.formatDuration(data.solDetail.totalGameTime, 'seconds')
    }
    if (data.mpDetail?.totalGameTime) {
        data.mpDetail.totalGameTime = utils.formatDuration(data.mpDetail.totalGameTime, 'seconds')
    }

    const img = await Render.render('Template/personalData/personalData', {
      ...data
    }, { e: this.e, scale: 1.2 })

    if (img) {
      await this.e.reply(img)
    } else {
      await this.e.reply('生成游戏数据图片失败，请稍后重试。')
    }
    return true
  }
}
