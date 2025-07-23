import plugin from '../../../lib/plugins/plugin.js'
import utils from '../utils/utils.js'
import Code from '../components/Code.js'
import Render from '../components/Render.js'

export class Record extends plugin {
  constructor (e) {
    super({
      name: '三角洲战绩',
      dsc: '查询三角洲行动历史战绩',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)(战绩|record)\\s*(烽火|战场|烽火地带|全面战场|sol|mp|\\d+)?\\s*(\\d+)?$',
          fnc: 'getRecord'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
  }

  async getRecord () {
    const token = await utils.getAccount(this.e.user_id)
    if (!token) {
      await this.e.reply('您尚未绑定账号，请使用 #三角洲登录 进行绑定。')
      return true
    }
    
    // 解析参数
    const { mode, page } = this.parseRecordParams()

    await this.e.reply(`正在查询【${mode === 4 ? '烽火地带' : '全面战场'}】第 ${page} 页的战绩...`)

    const res = await this.api.getRecord(token, mode, page)
    
    if (!res || !res.data) {
      await this.e.reply(`查询失败: ${res.msg || 'API 返回数据格式不正确或该页无记录'}`)
      return true
    }
    
    // 传递给模板的数据
    const renderData = {
        data: res.data,
        mode: mode,
        page: page,
        utils: utils // 将 utils 传入以便在模板中调用
    }

    const img = await Render.render('Template/record/record', renderData, { e: this.e, scale: 1.2 })

    if (img) {
      await this.e.reply(img)
    } else {
      await this.e.reply('生成战绩图片失败，请稍后重试。')
    }
    return true
  }

  parseRecordParams () {
    const match = this.e.msg.match(/(烽火|战场|烽火地带|全面战场|sol|mp|\d+)?\s*(\d+)?$/)
    const modeMap = {
      '烽火': 4, '烽火地带': 4, 'sol': 4,
      '战场': 5, '全面战场': 5, 'mp': 5
    }

    let mode = 4 // 默认烽火地带
    let page = 1

    if (!match) return { mode, page }

    let [, arg1, arg2] = match

    if (arg1) {
      if (modeMap[arg1]) { // #战绩 <模式> <页码?>
        mode = modeMap[arg1]
        if (arg2 && !isNaN(arg2)) {
          page = parseInt(arg2)
        }
      } else if (!isNaN(arg1)) { // #战绩 <页码>
        page = parseInt(arg1)
      }
    }
    
    return { mode, page }
  }
} 