import utils from '../../utils/utils.js'
import Code from '../../components/Code.js'
import Render from '../../components/Render.js'

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

    // 提取英文名（从 fullName 中提取，如果有的话）
    let englishName = ''
    const fullName = operator.fullName || ''
    // 尝试提取英文部分（通常在括号或逗号后）
    const englishMatch = fullName.match(/[A-Za-z\s·]+/)
    if (englishMatch) {
      englishName = englishMatch[0].trim().toUpperCase()
    }

    // 准备模板数据
    const templateData = {
      operatorName: operator.operator || '未知干员',
      fullName: fullName,
      englishName: englishName,
      operatorPic: operator.pic || '',
      background: '', // 如果有背景描述字段可以添加
      armyType: operator.armyType || '',
      armyTypeDesc: operator.armyTypeDesc || '',
      abilitiesList: (operator.abilitiesList || []).map(ability => ({
        abilityName: ability.abilityName || '未知技能',
        abilityType: ability.abilityType || '',
        abilityTypeCN: ability.abilityTypeCN || ability.abilityType || '',
        abilityDesc: ability.abilityDesc || '',
        abilityPic: ability.abilityPic || ''
      }))
    }

    // 使用模板渲染图片
    return await Render.render('Template/operator/operator', templateData, {
      e: this.e,
      retType: 'default'
    })
  }
}
