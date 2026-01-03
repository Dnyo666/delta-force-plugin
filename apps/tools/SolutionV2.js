import utils from '../../utils/utils.js'
import Code from '../../components/Code.js'

export class SolutionV2 extends plugin {
  constructor(e) {
    super({
      name: '三角洲改枪方案V2',
      dsc: '管理和分享改枪方案',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)上传(改枪方案|改枪码)(.*)$',
          fnc: 'uploadSolution'
        },
        {
          reg: '^(#三角洲|\\^)(改枪方案|改枪码)列表(.*)$',
          fnc: 'getSolutionList'
        },
        {
          reg: '^(#三角洲|\\^)(改枪方案|改枪码)详情\\s+(\\d+)$',
          fnc: 'getSolutionDetail'
        },
        {
          reg: '^(#三角洲|\\^)(改枪方案|改枪码)(点赞|点踩)\\s+(\\d+)$',
          fnc: 'voteSolution'
        },
        {
          reg: '^(#三角洲|\\^)更新(改枪方案|改枪码)(.*)$',
          fnc: 'updateSolution'
        },
        {
          reg: '^(#三角洲|\\^)删除(改枪方案|改枪码)\\s+(\\d+)$',
          fnc: 'deleteSolution'
        },
        {
          reg: '^(#三角洲|\\^)(收藏|取消收藏)(改枪方案|改枪码)\\s+(\\d+)$',
          fnc: 'collectSolution'
        },
        {
          reg: '^(#三角洲|\\^)(改枪方案|改枪码)收藏列表$',
          fnc: 'getCollectList'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
  }

  async uploadSolution() {
    const token = await utils.getAccount(this.e.user_id)
    const clientID = utils.getClientID()
    if (!token) {
      await this.e.reply('请先绑定账号。')
      return true
    }
    if (!clientID) {
      await this.e.reply('clientID 未在配置文件中正确设置，请联系管理员。')
      return true
    }

    const argString = this.e.msg.replace(/^(#三角洲|\^)上传(改枪方案|改枪码)\s*/, '').trim()
    
    if (!argString) {
      let helpMsg = '上传改枪方案/改枪码指令格式:\n'
      helpMsg += '#三角洲上传改枪码 <改枪码> [描述] [模式] [是否公开] [配件信息]\n'
      helpMsg += '示例1: #三角洲上传改枪码 腾龙突击步枪-烽火地带-6GQIU4800CIEH22G8UEHS\n'
      helpMsg += '示例2: #三角洲上传改枪码 腾龙突击步枪-烽火地带-6GQIU4800CIEH22G8UEHS 56W满配腾龙-安安队\n'
      helpMsg += '示例3: #三角洲上传改枪码 腾龙突击步枪-烽火地带-6GQIU4800CIEH22G8UEHS 56W满配腾龙-安安队 烽火 是\n'
      helpMsg += '模式: sol/烽火/烽火地带, mp/全面/战场/全面战场\n'
      helpMsg += '公开: 是/否 (是否公开作者QQ)\n'
      helpMsg += '配件: JSON格式的配件数组'
      await this.e.reply(helpMsg)
      return true
    }

    // 智能解析参数
    let solutionCode = ''
    let desc = ''
    let type = ''
    let isPublic = false
    let accessory = ''

    // 首先提取可能的JSON配件信息（在最后面）
    let remainingText = argString
    const jsonMatch = argString.match(/(\[.*\])$/)
    if (jsonMatch) {
      accessory = jsonMatch[1]
      remainingText = argString.replace(/\s*\[.*\]$/, '')
    }

    // 分割剩余的参数
    const parts = remainingText.split(/\s+/)
    
    if (parts.length === 0) {
      await this.e.reply('请提供改枪码')
      return true
    }

    solutionCode = parts[0]

    // 寻找模式和公开设置的关键词
    const modeKeywords = ['sol', '烽火', '烽火地带', '摸金', 'mp', '全面', '战场', '全面战场']
    const publicKeywords = ['是', '否', 'true', 'false']
    
    let modeIndex = -1
    let publicIndex = -1
    
    // 从后往前找关键词
    for (let i = parts.length - 1; i >= 1; i--) {
      if (publicKeywords.includes(parts[i]) && publicIndex === -1) {
        publicIndex = i
        isPublic = ['是', 'true'].includes(parts[i])
      } else if (modeKeywords.includes(parts[i]) && modeIndex === -1) {
        modeIndex = i
        if (['sol', '烽火', '烽火地带', '摸金'].includes(parts[i])) {
          type = 'sol'
        } else if (['mp', '全面', '战场', '全面战场'].includes(parts[i])) {
          type = 'mp'
        }
      }
    }

    // 确定描述的结束位置
    let descEndIndex = parts.length - 1
    if (publicIndex !== -1) {
      descEndIndex = publicIndex - 1
    } else if (modeIndex !== -1) {
      descEndIndex = modeIndex - 1
    }

    // 提取描述（从第二个参数到结束位置）
    if (descEndIndex >= 1) {
      desc = parts.slice(1, descEndIndex + 1).join(' ')
    }

    if (!solutionCode) {
      await this.e.reply('请提供改枪码')
      return true
    }

    const modeDisplay = type ? (type === 'sol' ? '烽火地带' : '全面战场') : '默认(烽火地带)'
    const publicDisplay = isPublic ? '公开' : '私有'

    // 调用API
    const res = await this.api.uploadSolution(
      token, 
      clientID, 
      solutionCode, 
      desc || '', 
      isPublic, 
      type || 'sol',
      '', // weaponId
      accessory || ''
    )

    if (await utils.handleApiError(res, this.e)) return true

    if (res && (res.code === 0 || res.success == true || (res.message && res.message.includes('上传成功')))) {
      let replyMsg = '改枪码上传成功！\n'
      replyMsg += `方案ID: ${res.data?.solutionId || '未知'}\n`
      replyMsg += `模式: ${modeDisplay}\n`
      replyMsg += `状态: ${publicDisplay}\n`
      replyMsg += '注意: 新上传的方案需要通过审核后才会在列表中显示'
      await this.e.reply(replyMsg)
    } else {
      await this.e.reply(`上传失败: ${res.msg || res.message || '未知错误'}`)
    }
    return true
  }

  async getSolutionList() {
    const token = await utils.getAccount(this.e.user_id)
    const clientID = utils.getClientID()
    if (!token) {
      await this.e.reply('请先绑定账号。')
      return true
    }
    if (!clientID) {
      await this.e.reply('clientID 未在配置文件中正确设置，请联系管理员。')
      return true
    }

    const argString = this.e.msg.replace(/^(#三角洲|\^)(改枪方案|改枪码)列表\s*/, '').trim()
    const args = argString.split(/\s+/).filter(Boolean)

    let weaponName = ''
    let priceRange = ''

    // 解析参数
    for (const arg of args) {
      // 判断是否为价格范围（包含逗号的数字格式）
      if (/^\d+,\d+$/.test(arg)) {
        priceRange = arg
      } else if (!weaponName) {
        // 第一个非价格范围的参数作为武器名
        weaponName = arg
      }
    }

    let filterDesc = []
    if (weaponName) filterDesc.push(`武器:${weaponName}`)
    if (priceRange) filterDesc.push(`价格:${priceRange.replace(',', '-')}`)

    const replyMsg = `正在查询改枪方案列表... ${filterDesc.length > 0 ? `[${filterDesc.join(', ')}]` : ''}`
    await this.e.reply(replyMsg.trim())

    const res = await this.api.getSolutionList(token, clientID, '', weaponName, priceRange, '', '')

    if (await utils.handleApiError(res, this.e)) return true

    if (!res || (res.code !== 0 && res.success != true && !(res.message && res.message.includes('查询成功')))) {
      await this.e.reply(`查询失败: ${res?.msg || res?.message || '无法获取方案列表'}`)
      return true
    }

    // 处理不同的数据结构
    let solutions = []
    if (res.data && Array.isArray(res.data)) {
      solutions = res.data
    } else if (res.data && res.data.list && Array.isArray(res.data.list)) {
      solutions = res.data.list
    } else if (res.data && res.data.keywords && Array.isArray(res.data.keywords)) {
      solutions = res.data.keywords
    }

    if (solutions.length === 0) {
      await this.e.reply('未找到符合条件的改枪方案。')
      return true
    }

    // --- 构造转发消息 ---
    const userInfo = {
      user_id: this.e.user_id,
      nickname: this.e.sender.nickname
    }
    
    let forwardMsg = []
    const filterTitle = filterDesc.length > 0 ? ` - ${filterDesc.join(', ')}` : ''
    const title = `【改枪方案列表${filterTitle}】 (${solutions.length}个方案)`
    forwardMsg.push({ ...userInfo, message: title })

    solutions.forEach((solution, index) => {
      let msg = `#${index + 1}: ${solution.solutionCode}\n`
      msg += `方案ID: ${solution.id || solution.solutionId}\n`
      msg += `武器: ${solution.weaponName || '未知'}\n`
      msg += `模式: ${solution.type === 'sol' ? '烽火地带' : '全面战场'}\n`
      msg += `价格: ${solution.totalPrice ? solution.totalPrice.toLocaleString() : '未知'}\n`
      msg += `作者: ${solution.authorNickname || solution.author || '匿名用户'}\n`
      msg += `浏览: ${solution.views || 0} | 👍 ${solution.likes || solution.likeCount || 0} 👎 ${solution.dislikes || solution.dislikeCount || 0}`
      if (solution.description || solution.desc) {
        msg += `\n描述: ${solution.description || solution.desc}`
      }
      msg += `\n使用 #三角洲改枪方案详情 ${solution.id || solution.solutionId} 查看详情`
      
      forwardMsg.push({ ...userInfo, message: msg.trim() })
    })

    return this.e.reply(await Bot.makeForwardMsg(forwardMsg))
  }

  async getSolutionDetail() {
    const token = await utils.getAccount(this.e.user_id)
    const clientID = utils.getClientID()
    if (!token) {
      await this.e.reply('请先绑定账号。')
      return true
    }
    if (!clientID) {
      await this.e.reply('clientID 未在配置文件中正确设置，请联系管理员。')
      return true
    }

    const match = this.e.msg.match(/^(#三角洲|\^)(改枪方案|改枪码)详情\s+(\d+)$/)
    if (!match) {
      await this.e.reply('指令格式错误，请使用：#三角洲改枪方案详情 <方案ID>')
      return true
    }
    const solutionId = match[3]

    await this.e.reply(`正在查询方案详情 (ID: ${solutionId})...`)

    const res = await this.api.getSolutionDetail(token, clientID, solutionId)

    if (await utils.handleApiError(res, this.e)) return true

    if (!res || (res.code !== 0 && res.success != true) || !res.data) {
      await this.e.reply(`查询失败: ${res?.msg || res?.message || '方案不存在或无权限查看'}`)
      return true
    }

    const solution = res.data
    let msg = `=== 改枪方案详情 ===\n`
    msg += `方案ID: ${solution.id || solution.solutionId}\n`
    msg += `改枪码: ${solution.solutionCode}\n`
    msg += `武器: ${solution.weapon?.objectName || '未知'}\n`
    msg += `模式: ${solution.metadata?.type === 'sol' ? '烽火地带' : '全面战场'}\n`
    msg += `总价格: ${solution.statistics?.totalPrice ? solution.statistics.totalPrice.toLocaleString() : '未知'}\n`
    msg += `作者: ${solution.author?.platformID || '匿名用户'}\n`
    msg += `创建时间: ${solution.metadata?.createdAt || '未知'}\n`
    msg += `浏览量: ${solution.statistics?.views || 0}\n`
    msg += `👍 ${solution.statistics?.likes || 0} 👎 ${solution.statistics?.dislikes || 0}\n`
    
    if (solution.description) {
      msg += `描述: ${solution.description}\n`
    }

    if (solution.attachments && solution.attachments.length > 0) {
      msg += `\n=== 配件列表 ===\n`
      solution.attachments.forEach((acc, index) => {
        msg += `${index + 1}. ${acc.objectName || acc.objectID} - ${acc.price ? acc.price.toLocaleString() : '未知价格'}\n`
      })
    }

    msg += `\n使用指令:\n`
    msg += `#三角洲改枪方案点赞 ${solution.id || solutionId} - 点赞\n`
    msg += `#三角洲改枪方案点踩 ${solution.id || solutionId} - 点踩\n`
    msg += `#三角洲收藏改枪方案 ${solution.id || solutionId} - 收藏`

    await this.e.reply(msg.trim())
    return true
  }

  async voteSolution() {
    const token = await utils.getAccount(this.e.user_id)
    const clientID = utils.getClientID()
    if (!token) {
      await this.e.reply('请先绑定账号。')
      return true
    }
    if (!clientID) {
      await this.e.reply('clientID 未在配置文件中正确设置，请联系管理员。')
      return true
    }

    const match = this.e.msg.match(/^(#三角洲|\^)(改枪方案|改枪码)(点赞|点踩)\s+(\d+)$/)
    if (!match) {
      await this.e.reply('指令格式错误，请使用：#三角洲改枪方案点赞 <方案ID>')
      return true
    }
    const voteAction = match[3]
    const solutionId = match[4]
    const voteType = voteAction === '点赞' ? 'like' : 'dislike'

    await this.e.reply(`正在${voteAction}方案 (ID: ${solutionId})...`)

    const res = await this.api.voteSolution(token, clientID, solutionId, voteType)

    if (await utils.handleApiError(res, this.e)) return true

    if (res && (res.code === 0 || res.success == true)) {
      await this.e.reply(res.msg || `${voteAction}成功！`)
    } else {
      await this.e.reply(`操作失败: ${res?.msg || res?.message || '未知错误'}`)
    }
    return true
  }

  async updateSolution() {
    const token = await utils.getAccount(this.e.user_id)
    const clientID = utils.getClientID()
    if (!token) {
      await this.e.reply('请先绑定账号。')
      return true
    }
    if (!clientID) {
      await this.e.reply('clientID 未在配置文件中正确设置，请联系管理员。')
      return true
    }

    const argString = this.e.msg.replace(/^(#三角洲|\^)更新(改枪方案|改枪码)\s*/, '').trim()
    
    if (!argString) {
      let helpMsg = '更新改枪方案/改枪码指令格式:\n'
      helpMsg += '#三角洲更新改枪码 <方案ID> [新改枪码] [新描述] [模式] [是否公开] [配件信息]\n'
      helpMsg += '示例1: #三角洲更新改枪码 123\n'
      helpMsg += '示例2: #三角洲更新改枪码 123 腾龙突击步枪-烽火地带-6GQIU4800CIEH22G8UEHS 新的配置描述\n'
      helpMsg += '示例3: #三角洲更新改枪码 123 腾龙突击步枪-烽火地带-6GQIU4800CIEH22G8UEHS 新的配置描述 全面 是\n'
      helpMsg += '模式: sol/烽火/烽火地带, mp/全面/战场/全面战场\n'
      helpMsg += '公开: 是/否 (是否公开作者QQ)\n'
      helpMsg += '注意: 只能更新自己的方案'
      await this.e.reply(helpMsg)
      return true
    }

    // 智能解析参数
    let solutionId = ''
    let solutionCode = ''
    let desc = ''
    let type = ''
    let isPublic = null
    let accessory = ''

    // 首先提取可能的JSON配件信息（在最后面）
    let remainingText = argString
    const jsonMatch = argString.match(/(\[.*\])$/)
    if (jsonMatch) {
      accessory = jsonMatch[1]
      remainingText = argString.replace(/\s*\[.*\]$/, '')
    }

    // 分割剩余的参数
    const parts = remainingText.split(/\s+/)
    
    if (parts.length === 0) {
      await this.e.reply('请提供要更新的方案ID')
      return true
    }

    solutionId = parts[0]
    if (parts.length > 1) {
      solutionCode = parts[1]
    }

    // 寻找模式和公开设置的关键词
    const modeKeywords = ['sol', '烽火', '烽火地带', '摸金', 'mp', '全面', '战场', '全面战场']
    const publicKeywords = ['是', '否', 'true', 'false']
    
    let modeIndex = -1
    let publicIndex = -1
    
    // 从后往前找关键词
    for (let i = parts.length - 1; i >= 2; i--) {
      if (publicKeywords.includes(parts[i]) && publicIndex === -1) {
        publicIndex = i
        isPublic = ['是', 'true'].includes(parts[i])
      } else if (modeKeywords.includes(parts[i]) && modeIndex === -1) {
        modeIndex = i
        if (['sol', '烽火', '烽火地带', '摸金'].includes(parts[i])) {
          type = 'sol'
        } else if (['mp', '全面', '战场', '全面战场'].includes(parts[i])) {
          type = 'mp'
        }
      }
    }

    // 确定描述的结束位置
    let descEndIndex = parts.length - 1
    if (publicIndex !== -1) {
      descEndIndex = publicIndex - 1
    } else if (modeIndex !== -1) {
      descEndIndex = modeIndex - 1
    }

    // 提取描述（从第三个参数到结束位置）
    if (descEndIndex >= 2) {
      desc = parts.slice(2, descEndIndex + 1).join(' ')
    }

    if (!solutionId) {
      await this.e.reply('请提供要更新的方案ID')
      return true
    }

    await this.e.reply(`正在更新方案 (ID: ${solutionId})...`)

    const res = await this.api.updateSolution(token, clientID, solutionId, solutionCode, desc, isPublic, type, accessory)

    if (await utils.handleApiError(res, this.e)) return true

    if (res && (res.code === 0 || res.success == true || (res.message && res.message.includes('更新成功')))) {
      let replyMsg = '方案更新成功！\n'
      if (desc) replyMsg += '注意: 更新描述后需要重新审核'
      await this.e.reply(replyMsg)
    } else {
      await this.e.reply(`更新失败: ${res?.msg || res?.message || '未知错误，可能您不是方案作者'}`)
    }
    return true
  }

  async deleteSolution() {
    const token = await utils.getAccount(this.e.user_id)
    const clientID = utils.getClientID()
    if (!token) {
      await this.e.reply('请先绑定账号。')
      return true
    }
    if (!clientID) {
      await this.e.reply('clientID 未在配置文件中正确设置，请联系管理员。')
      return true
    }

    const match = this.e.msg.match(/^(#三角洲|\^)删除(改枪方案|改枪码)\s+(\d+)$/)
    if (!match) {
      await this.e.reply('指令格式错误，请使用：#三角洲删除改枪方案 <方案ID>')
      return true
    }
    const solutionId = match[3]

    await this.e.reply(`正在删除方案 (ID: ${solutionId})...`)

    const res = await this.api.deleteSolution(token, clientID, solutionId)

    if (await utils.handleApiError(res, this.e)) return true

    if (res && (res.code === 0 || res.success == true || (res.message && res.message.includes('删除成功')))) {
      await this.e.reply('方案删除成功！注意: 删除后无法恢复')
    } else {
      await this.e.reply(`删除失败: ${res?.msg || res?.message || '未知错误，可能您不是方案作者或方案不存在'}`)
    }
    return true
  }

  async collectSolution() {
    const token = await utils.getAccount(this.e.user_id)
    const clientID = utils.getClientID()
    if (!token) {
      await this.e.reply('请先绑定账号。')
      return true
    }
    if (!clientID) {
      await this.e.reply('clientID 未在配置文件中正确设置，请联系管理员。')
      return true
    }

    const match = this.e.msg.match(/^(#三角洲|\^)(收藏|取消收藏)(改枪方案|改枪码)\s+(\d+)$/)
    if (!match) {
      await this.e.reply('指令格式错误，请使用：#三角洲收藏改枪方案 <方案ID>')
      return true
    }
    const action = match[2]
    const solutionId = match[4]
    const isCollect = action === '收藏'


    const res = isCollect 
      ? await this.api.collectSolution(token, clientID, solutionId)
      : await this.api.discollectSolution(token, clientID, solutionId)

    if (await utils.handleApiError(res, this.e)) return true

    if (res && (res.code === 0 || res.success == true)) {
      await this.e.reply(res.msg || `${action}成功！`)
    } else {
      await this.e.reply(`操作失败: ${res?.msg || res?.message || '未知错误'}`)
    }
    return true
  }

  async getCollectList() {
    const token = await utils.getAccount(this.e.user_id)
    const clientID = utils.getClientID()
    if (!token) {
      await this.e.reply('请先绑定账号。')
      return true
    }
    if (!clientID) {
      await this.e.reply('clientID 未在配置文件中正确设置，请联系管理员。')
      return true
    }

    await this.e.reply('正在查询您的收藏列表...')

    const res = await this.api.getCollectList(token, clientID)

    if (await utils.handleApiError(res, this.e)) return true

    if (!res || (res.code !== 0 && res.success != true && !(res.message && res.message.includes('查询成功')))) {
      await this.e.reply(`查询失败: ${res?.msg || res?.message || '无法获取收藏列表'}`)
      return true
    }

    // 处理不同的数据结构  
    let collections = []
    if (res.data && Array.isArray(res.data)) {
      collections = res.data
    } else if (res.data && res.data.list && Array.isArray(res.data.list)) {
      collections = res.data.list
    }

    if (collections.length === 0) {
      await this.e.reply('您还没有收藏任何改枪方案。')
      return true
    }

    const userInfo = { user_id: this.e.user_id, nickname: this.e.sender.nickname }
    const forwardMsg = []
    forwardMsg.push({ ...userInfo, message: `【我的收藏列表】 (${collections.length}个方案)` })

    collections.forEach((solution, index) => {
      let msg = `#${index + 1}: ${solution.solutionCode}\n`
      msg += `方案ID: ${solution.id || solution.solutionId}\n`
      msg += `武器: ${solution.weaponName || '未知'}\n`
      msg += `模式: ${solution.type === 'sol' ? '烽火地带' : '全面战场'}\n`
      msg += `价格: ${solution.totalPrice ? solution.totalPrice.toLocaleString() : '未知'}\n`
      msg += `作者: ${solution.authorNickname || solution.author || '匿名用户'}\n`
      msg += ` 👍 ${solution.likes || 0} 👎 ${solution.dislikes || 0}\n`
      if (solution.description || solution.desc) msg += `描述: ${solution.description || solution.desc}\n`
      forwardMsg.push({ ...userInfo, message: msg.trim() })
    })

    await this.e.reply(await Bot.makeForwardMsg(forwardMsg))
    return true
  }
}