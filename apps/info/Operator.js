import utils from '../../utils/utils.js'
import Code from '../../components/Code.js'

export class Operator extends plugin {
  constructor (e) {
    super({
      name: '三角洲干员信息',
      dsc: '查询单个干员详细信息',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)干员\\s+(.+)$',
          fnc: 'getOperatorInfo'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
  }

  async getOperatorInfo() {
    // 解析干员名称
    const match = this.e.msg.match(/^(#三角洲|\^)干员\s+(.+)$/)
    if (!match || !match[2]) {
      await this.e.reply('请输入干员名称，例如：^干员 乌鲁鲁')
      return true
    }

    const operatorName = match[2].trim()
    if (!operatorName) {
      await this.e.reply('请输入干员名称，例如：^干员 乌鲁鲁')
      return true
    }

    await this.e.reply(`正在查询干员「${operatorName}」的信息，请稍候...`)

    const res = await this.api.getOperator()

    if (await utils.handleApiError(res, this.e)) return true

    if (!res.data || !Array.isArray(res.data) || res.data.length === 0) {
      await this.e.reply(`未找到任何干员信息。`)
      return true
    }

    // 根据名称过滤干员（支持干员名称和全名）
    const matchedOperators = res.data.filter(op => {
      const opName = op.operator || ''
      const fullName = op.fullName || ''
      return opName.includes(operatorName) || fullName.includes(operatorName) || 
             operatorName.includes(opName) || operatorName.includes(fullName)
    })

    if (matchedOperators.length === 0) {
      await this.e.reply(`未找到干员「${operatorName}」的信息，请检查干员名称是否正确。`)
      return true
    }

    // 如果匹配到多个，优先选择完全匹配的
    let operator = matchedOperators.find(op => 
      op.operator === operatorName || op.fullName === operatorName
    ) || matchedOperators[0]

    // 如果匹配到多个，提示用户
    if (matchedOperators.length > 1) {
      const names = matchedOperators.map(op => op.operator || op.fullName).join('、')
      await this.e.reply(`找到多个匹配的干员：${names}，将显示第一个匹配结果。`)
    }

    // 构建消息
    let msg = `【${operator.operator || operator.fullName || '未知干员'}】\n`
    
    if (operator.fullName) {
      msg += `全名：${operator.fullName}\n`
    }
    
    if (operator.armyType) {
      msg += `兵种：${operator.armyType}\n`
    }
    
    if (operator.armyTypeDesc) {
      msg += `兵种描述：${operator.armyTypeDesc}\n`
    }

    if (operator.abilitiesList && operator.abilitiesList.length > 0) {
      msg += `\n【技能列表】\n`
      operator.abilitiesList.forEach((ability, index) => {
        msg += `${index + 1}. ${ability.abilityName || '未知技能'}\n`
        msg += `   类型：${ability.abilityTypeCN || ability.abilityType || '未知'}\n`
        msg += `   位置：${ability.positionCN || ability.position || '未知'}\n`
        if (ability.abilityDesc) {
          msg += `   描述：${ability.abilityDesc}\n`
        }
        // 最后一个技能后不加换行
        if (index < operator.abilitiesList.length - 1) {
          msg += '\n'
        }
      })
    }

    await this.e.reply(msg)
    return true
  }
}
