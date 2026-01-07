import utils from '../../utils/utils.js'
import Code from '../../components/Code.js'

export class OperatorList extends plugin {
  constructor (e) {
    super({
      name: '三角洲干员列表',
      dsc: '查询所有干员列表',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)干员列表$',
          fnc: 'getOperatorList'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
  }

  async getOperatorList() {
    await this.e.reply('正在查询干员列表，请稍候...')

    const res = await this.api.getOperators()

    if (await utils.handleApiError(res, this.e)) return true

    if (!res.data || !Array.isArray(res.data)) {
      await this.e.reply(`查询失败: ${res.msg || res.message || 'API 返回数据格式不正确'}`)
      return true
    }

    const operators = res.data

    if (operators.length === 0) {
      await this.e.reply('未能查询到任何干员信息。')
      return true
    }

    // 根据 ID 前缀判断兵种
    const getArmyTypeById = (id) => {
      if (id >= 10000 && id < 20000) return '突击'
      if (id >= 20000 && id < 30000) return '支援'
      if (id >= 30000 && id < 40000) return '工程'
      if (id >= 40000 && id < 50000) return '侦察'
      return '未知'
    }

    // 按兵种分组
    const groupedByArmyType = {}
    operators.forEach(operator => {
      const armyType = operator.armyType || getArmyTypeById(operator.id)
      if (!groupedByArmyType[armyType]) {
        groupedByArmyType[armyType] = []
      }
      groupedByArmyType[armyType].push(operator)
    })

    // 兵种显示顺序
    const armyTypeOrder = ['突击', '工程', '支援', '侦察']
    const sortedArmyTypes = Object.keys(groupedByArmyType).sort((a, b) => {
      const indexA = armyTypeOrder.indexOf(a)
      const indexB = armyTypeOrder.indexOf(b)
      if (indexA === -1 && indexB === -1) return a.localeCompare(b)
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return indexA - indexB
    })

    // 构建消息
    let msg = `【干员列表】\n共 ${operators.length} 个干员\n\n`

    sortedArmyTypes.forEach((armyType, index) => {
      const typeOperators = groupedByArmyType[armyType]
      msg += `【${armyType}】(${typeOperators.length}人)\n`
      typeOperators.forEach(operator => {
        msg += `  • ${operator.name || operator.operator || operator.fullName || '未知'}\n`
      })
      // 最后一个分组后不加换行
      if (index < sortedArmyTypes.length - 1) {
        msg += '\n'
      }
    })

    await this.e.reply(msg)
    return true
  }
}
