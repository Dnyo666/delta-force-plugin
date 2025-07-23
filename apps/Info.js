import plugin from '../../../lib/plugins/plugin.js'
import utils from '../utils/utils.js'
import Render from '../components/Render.js'
import Code from '../components/Code.js'

export class Info extends plugin {
  constructor (e) {
    super({
      name: '三角洲信息',
      dsc: '查询三角洲行动个人信息',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)(信息|info)$',
          fnc: 'getUserInfo'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
  }

  async getUserInfo () {
    const token = await utils.getAccount(this.e.user_id)
    if (!token) {
      await this.e.reply('您尚未绑定账号，请使用 #三角洲登录 进行绑定。')
      return true
    }

    await this.e.reply('正在查询您的个人信息，请稍候...')

    const res = await this.api.getPersonalInfo(token)
    if (!res || !res.data) {
      await this.e.reply(`查询失败: ${res.msg || 'API 返回数据格式不正确'}`)
      return true
    }

    const { roleInfo, careerData } = res.data

    // 数据处理
    if (roleInfo && roleInfo.charac_name) {
      try {
        roleInfo.charac_name = decodeURIComponent(roleInfo.charac_name)
      } catch (e) {
        logger.warn(`[DELTA FORCE PLUGIN] 用户名解码失败: ${roleInfo.charac_name}`)
      }
    }
    if (careerData.solduration) {
      careerData.solduration = utils.formatDuration(careerData.solduration, 'seconds')
    }
    if (careerData.tdmduration) {
      careerData.tdmduration = utils.formatDuration(careerData.tdmduration, 'minutes')
    }

    const img = await Render.render('Template/userInfo/userInfo', {
      ...res.data
    }, { e: this.e, scale: 1.2 })

    if (img) {
      await this.e.reply(img)
    } else {
      await this.e.reply('生成个人信息图片失败，请稍后重试。')
    }
    return true
  }
} 