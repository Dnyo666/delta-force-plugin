import utils from '../../utils/utils.js'
import Code from '../../components/Code.js'
import Render from '../../components/Render.js'

export class HealthInfo extends plugin {
  constructor (e) {
    super({
      name: '三角洲健康状态信息',
      dsc: '查询游戏健康状态相关信息',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)健康状态$',
          fnc: 'getHealthInfo'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
  }

  async getHealthInfo() {
    await this.e.reply('正在查询健康状态信息，请稍候...')

    const res = await this.api.getHealth()

    if (await utils.handleApiError(res, this.e)) return true

    if (!res.data || !res.data[0]) {
      await this.e.reply(`查询失败: ${res.msg || res.message || 'API 返回数据格式不正确'}`)
      return true
    }

    const healthData = res.data[0]

    if (!healthData.healthyDetail) {
      await this.e.reply('未能查询到健康状态详细信息。')
      return true
    }

    const { deBuffList, buffList } = healthData.healthyDetail

    // 处理负面状态：合并同一部位的状态到同一卡片
    const processedDeBuffList = []
    if (deBuffList && deBuffList.length > 0) {
      deBuffList.forEach(areaGroup => {
        const area = areaGroup.area || '未知部位'
        const statuses = areaGroup.list || []
        
        // 如果该部位有多个状态，需要检查是否可以合并
        // 这里我们按每2个状态合并成一个卡片组
        for (let i = 0; i < statuses.length; i += 2) {
          const groupStatuses = statuses.slice(i, i + 2)
          processedDeBuffList.push({
            area: area,
            list: groupStatuses,
            isMerged: groupStatuses.length === 2 && groupStatuses[0] && groupStatuses[1]
          })
        }
      })
    }

    // 准备模板数据
    const templateData = {
      deBuffList: processedDeBuffList,
      buffList: buffList || []
    }

    // 使用模板渲染图片
    return await Render.render('Template/healthInfo/healthInfo', templateData, {
      e: this.e,
      retType: 'default'
    })
  }
}
