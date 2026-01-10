import Code from '../../components/Code.js'
import utils from '../../utils/utils.js'
import DataManager from '../../utils/Data.js'

export class Voice extends plugin {
  constructor(e) {
    super({
      name: '三角洲随机语音',
      dsc: '三角洲行动游戏随机语音',
      event: 'message',
      priority: 0,
      rule: [
        {
          reg: '^(#三角洲|\\^)语音列表$',
          fnc: 'getCharacterList'
        },
        {
          reg: '^(#三角洲|\\^)标签列表$',
          fnc: 'getTagList'
        },
        {
          reg: '^(#三角洲|\\^)语音分类$',
          fnc: 'getCategoryList'
        },
        {
          reg: '^(#三角洲|\\^)语音统计$',
          fnc: 'getAudioStats'
        },
        {
          reg: '^(#三角洲|\\^)语音\\s*(.*)$',
          fnc: 'sendVoice'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
  }

  /**
   * 统一的语音发送方法 - 智能识别参数类型
   * 命令：#三角洲语音 [参数...]
   * 支持：
   * - 无参数：完全随机
   * - 角色名：红狼、威龙、蜂医等
   * - 特殊标签：渡鸦、boss-1、task-0等
   * - 场景+动作：局内、局外、呼吸、战斗等
   */
  async sendVoice() {
    try {
      const match = this.e.msg.match(/^(#三角洲|\^)语音\s*(.*)$/)
      const params = match[2].trim()

      // 解析参数并构建查询
      const queryParams = await this.parseVoiceParams(params)
      
      // 构建提示信息
      let hint = '正在获取'
      if (queryParams.hint) {
        hint += ` ${queryParams.hint}`
      }
      hint += ' 语音...'
      await this.e.reply(hint)

      // 调用对应的API
      let res
      if (queryParams.category) {
        // 使用category参数（音频分类）
        res = await this.api.getRandomAudio({
          category: queryParams.category,
          count: 1
        })
      } else if (queryParams.tag) {
        // 使用tag参数（特殊语音）
        res = await this.api.getRandomAudio({
          tag: queryParams.tag,
          count: 1
        })
      } else if (queryParams.character || queryParams.scene || queryParams.actionType) {
        // 使用角色/场景/动作参数
        const apiParams = { count: 1 }
        if (queryParams.character) apiParams.character = queryParams.character
        if (queryParams.scene) apiParams.scene = queryParams.scene
        if (queryParams.actionType) apiParams.actionType = queryParams.actionType
        
        res = await this.api.getCharacterAudio(apiParams)
      } else {
        // 完全随机
        res = await this.api.getRandomAudio({ count: 1 })
      }

      if (await utils.handleApiError(res, this.e)) return true

      if (!res.data || !res.data.audios || res.data.audios.length === 0) {
        await this.e.reply('未找到符合条件的语音\n使用 #三角洲语音列表 查看所有可用内容')
        return true
      }

      // 发送语音
      await this.sendVoiceMessage(res.data.audios[0])
      return true
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 发送语音失败:', error)
      await this.e.reply('发送语音失败，请稍后重试。')
      return true
    }
  }

  /**
   * 智能解析语音参数
   * @param {string} params - 用户输入的参数字符串
   * @returns {object} 解析后的查询参数
   */
  async parseVoiceParams(params) {
    if (!params) {
      return { hint: '随机' }
    }

    const args = params.split(/\s+/).filter(arg => arg)
    const result = {}
    let hint = ''

    // 场景映射
    const sceneMap = {
      '局内': 'InGame',
      '局外': 'OutGame',
      'ingame': 'InGame',
      'outgame': 'OutGame'
    }

    // 动作类型映射
    const actionMap = {
      '呼吸': 'Breath',
      '战斗': 'Combat',
      '死亡': 'Death',
      '受伤': 'Pain',
      'breath': 'Breath',
      'combat': 'Combat',
      'death': 'Death',
      'pain': 'Pain'
    }

    // 第一个参数：可能是分类、标签、角色名或场景
    if (args[0]) {
      const firstArg = args[0]
      
      // 1. 优先检查是否是音频分类（使用DataManager）
      const mappedCategory = DataManager.getAudioCategory(firstArg)
      if (mappedCategory) {
        result.category = mappedCategory
        result.hint = firstArg
        return result
      }
      
      // 2. 检查是否是特殊标签（使用DataManager）
      const mappedTag = DataManager.getAudioTag(firstArg)
      if (mappedTag) {
        result.tag = mappedTag
        result.hint = firstArg
        return result
      }
      
      // 3. 检查是否是场景
      if (sceneMap[firstArg] || sceneMap[firstArg.toLowerCase()]) {
        result.scene = sceneMap[firstArg] || sceneMap[firstArg.toLowerCase()]
        hint = firstArg
      } 
      // 4. 检查是否是动作类型
      else if (actionMap[firstArg] || actionMap[firstArg.toLowerCase()]) {
        result.actionType = actionMap[firstArg] || actionMap[firstArg.toLowerCase()]
        hint = firstArg
      }
      // 5. 检查是否是有效角色名（使用DataManager验证）
      else if (DataManager.isValidAudioCharacter(firstArg)) {
        result.character = firstArg
        hint = firstArg
      }
      // 6. 默认当作角色参数（后端会自动识别以下格式）
      //    - 干员全局ID：20003, 10007, 40005
      //    - Voice ID：Voice_101, Voice_301, Voice_201
      //    - 皮肤ID：Voice_301_SkinA, Voice_301_skinA（大小写不敏感）
      //    - 中文名：红狼, 红狼A（含皮肤）
      else {
        result.character = firstArg
        hint = firstArg
      }
    }

    // 第二个参数：可能是场景或动作类型
    if (args[1]) {
      const secondArg = args[1]
      
      if (sceneMap[secondArg] || sceneMap[secondArg.toLowerCase()]) {
        result.scene = sceneMap[secondArg] || sceneMap[secondArg.toLowerCase()]
        hint += ` ${secondArg}`
      } else if (actionMap[secondArg] || actionMap[secondArg.toLowerCase()]) {
        result.actionType = actionMap[secondArg] || actionMap[secondArg.toLowerCase()]
        hint += ` ${secondArg}`
      }
    }

    // 第三个参数：动作类型
    if (args[2]) {
      const thirdArg = args[2]
      
      if (actionMap[thirdArg] || actionMap[thirdArg.toLowerCase()]) {
        result.actionType = actionMap[thirdArg] || actionMap[thirdArg.toLowerCase()]
        hint += ` ${thirdArg}`
      }
    }

    result.hint = hint || '随机'
    return result
  }

  /**
   * 获取角色列表
   * 命令：#三角洲语音列表
   */
  async getCharacterList() {
    try {
      await this.e.reply('正在获取角色列表...')

      const res = await this.api.getAudioCharacters()

      if (await utils.handleApiError(res, this.e)) return true

      if (!res.data || !res.data.characters) {
        await this.e.reply('获取角色列表失败。')
        return true
      }

      // 构建转发消息
      const userInfo = {
        user_id: this.e.user_id,
        nickname: this.e.sender.nickname
      }

      const forwardMsg = []

      // 添加标题
      forwardMsg.push({
        ...userInfo,
        message: `【三角洲角色语音列表】\n共 ${res.data.characters.length} 个角色`
      })

      // 按职业分组
      const groups = {
        '医疗': [],
        '侦查': [],
        '突击': [],
        '工程': [],
        '其他': []
      }

      res.data.characters.forEach(char => {
        const profession = char.profession || '其他'
        const name = char.name || char.voiceId || '未知'
        const voiceId = char.voiceId
        const operatorId = char.operatorId
        
        // 使用API返回的profession字段，如果没有则根据voiceId判断
        let groupKey = profession
        if (!groups[profession]) {
          if (voiceId.startsWith('Voice_1')) groupKey = '医疗'
          else if (voiceId.startsWith('Voice_2')) groupKey = '侦查'
          else if (voiceId.startsWith('Voice_3')) groupKey = '突击'
          else if (voiceId.startsWith('Voice_4')) groupKey = '工程'
          else groupKey = '其他'
        }
        
        // 添加角色及其皮肤
        const charInfo = { voiceId, name, operatorId, skins: char.skins || [] }
        groups[groupKey].push(charInfo)
      })

      // 添加分组角色
      for (const [category, characters] of Object.entries(groups)) {
        if (characters.length > 0) {
          let msg = `【${category}】\n\n`
          characters.forEach((char, index) => {
            // 显示：名字 (Voice ID)
            msg += `${index + 1}. ${char.name}`
            if (char.voiceId) {
              msg += ` (${char.voiceId})`
            }
            
            // 如果有皮肤，列出皮肤名字和Voice ID
            if (char.skins && char.skins.length > 0) {
              msg += '\n   皮肤: '
              char.skins.forEach((skin, idx) => {
                if (idx > 0) msg += ', '
                msg += `${skin.name} (${skin.voiceId})`
              })
            }
            
            msg += '\n'
          })
          
          forwardMsg.push({
            ...userInfo,
            message: msg
          })
        }
      }

      // 添加使用说明
      forwardMsg.push({
        ...userInfo,
        message: '使用方法：\n• #三角洲语音 [角色名]\n• #三角洲语音 [角色名] [局内/局外]\n• #三角洲语音 [角色名] [局内/局外] [呼吸/战斗]\n\n提示：支持使用中文角色名和Voice ID'
      })

      // 发送转发消息
      await this.e.reply(await Bot.makeForwardMsg(forwardMsg))
      return true
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 获取角色列表失败:', error)
      await this.e.reply('获取角色列表失败，请稍后重试。')
      return true
    }
  }

  /**
   * 获取特殊标签列表 - 使用转发消息
   * 命令：#三角洲标签列表
   */
  async getTagList() {
    try {
      await this.e.reply('正在获取特殊标签列表...')

      const res = await this.api.getAudioTags()

      if (await utils.handleApiError(res, this.e)) return true

      if (!res.data || !res.data.tags) {
        await this.e.reply('获取特殊标签列表失败。')
        return true
      }

      // 构建转发消息
      const userInfo = {
        user_id: this.e.user_id,
        nickname: this.e.sender.nickname
      }

      const forwardMsg = []

      // 添加标题
      forwardMsg.push({
        ...userInfo,
        message: `【三角洲特殊语音标签】\n共 ${res.data.tags.length} 个标签`
      })

      // 按类型分组
      const groups = {
        'Boss语音': [],
        '任务语音': [],
        '撤离语音': [],
        '彩蛋语音': [],
        '全面战场': [],
        '其他': []
      }

      res.data.tags.forEach(tagInfo => {
        const tag = tagInfo.tag || tagInfo
        const desc = tagInfo.description || ''
        const item = { tag, desc }

        if (tag.startsWith('boss-')) {
          groups['Boss语音'].push(item)
        } else if (tag.startsWith('task-')) {
          groups['任务语音'].push(item)
        } else if (tag.startsWith('Evac-')) {
          groups['撤离语音'].push(item)
        } else if (tag.startsWith('eggs-')) {
          groups['彩蛋语音'].push(item)
        } else if (tag.startsWith('bf-') || tag.startsWith('BF_')) {
          groups['全面战场'].push(item)
        } else {
          groups['其他'].push(item)
        }
      })

      // 添加分组标签
      for (const [category, tags] of Object.entries(groups)) {
        if (tags.length > 0) {
          let msg = `【${category}】\n\n`
          tags.forEach((item, index) => {
            msg += `${index + 1}. ${item.tag}`
            if (item.desc) {
              msg += ` - ${item.desc}`
            }
            msg += '\n'
          })
          
          forwardMsg.push({
            ...userInfo,
            message: msg
          })
        }
      }

      // 添加使用说明
      forwardMsg.push({
        ...userInfo,
        message: '使用方法：\n• #三角洲语音 [标签]\n• #三角洲语音 [中文名]\n\n示例：\n• #三角洲语音 渡鸦\n• #三角洲语音 boss-1\n• #三角洲语音 破壁'
      })

      // 发送转发消息
      await this.e.reply(await Bot.makeForwardMsg(forwardMsg))
      return true
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 获取特殊标签列表失败:', error)
      await this.e.reply('获取特殊标签列表失败，请稍后重试。')
      return true
    }
  }

  /**
   * 获取音频分类列表
   * 命令：#三角洲语音分类
   */
  async getCategoryList() {
    try {
      await this.e.reply('正在获取分类列表...')

      const res = await this.api.getAudioCategories()

      if (await utils.handleApiError(res, this.e)) return true

      if (!res.data || !res.data.categories) {
        await this.e.reply('获取分类列表失败。')
        return true
      }

      // 分类名称映射
      const categoryNameMap = {
        'Voice': '角色语音',
        'CutScene': '过场动画',
        'Amb': '环境音效',
        'Music': '背景音乐',
        'SFX': '音效',
        'Festivel': '节日活动'
      }

      let message = '【三角洲音频分类】\n\n'
      res.data.categories.forEach(cat => {
        const categoryName = categoryNameMap[cat.category] || cat.category
        message += `• ${categoryName} (${cat.category})\n`
      })

      await this.e.reply(message)
      return true
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 获取分类列表失败:', error)
      await this.e.reply('获取分类列表失败，请稍后重试。')
      return true
    }
  }

  /**
   * 获取音频统计信息
   * 命令：#三角洲语音统计
   */
  async getAudioStats() {
    try {
      await this.e.reply('正在获取统计信息...')

      const res = await this.api.getAudioStats()

      if (await utils.handleApiError(res, this.e)) return true

      if (!res.data) {
        await this.e.reply('获取统计信息失败。')
        return true
      }

      // 分类名称映射
      const categoryNameMap = {
        'Voice': '角色语音',
        'CutScene': '过场动画',
        'Amb': '环境音效',
        'Music': '背景音乐',
        'SFX': '音效',
        'Festivel': '节日活动'
      }

      let message = '【三角洲音频统计】\n\n'
      message += `总文件数：${res.data.totalFiles}\n\n`

      if (res.data.categories && res.data.categories.length > 0) {
        message += '分类统计：\n'
        res.data.categories.forEach(cat => {
          const categoryName = categoryNameMap[cat.category] || cat.category
          message += `• ${categoryName}: ${cat.fileCount} 个\n`
        })
      }

      await this.e.reply(message)
      return true
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 获取统计信息失败:', error)
      await this.e.reply('获取统计信息失败，请稍后重试。')
      return true
    }
  }

  /**
   * 发送语音消息的核心方法
   * @param {Object} audio - 音频对象
   */
  async sendVoiceMessage(audio) {
    try {
      if (!audio.download || !audio.download.url) {
        logger.error('[DELTA FORCE PLUGIN] 音频数据缺少下载链接:', audio)
        await this.e.reply('音频数据异常，请稍后重试。')
        return
      }

      // 构建提示信息
      let infoMsg = []
      
      // 角色名称（新API格式：audio.character.name）
      if (audio.character && audio.character.name) {
        let charInfo = `【${audio.character.name}】`
        // 如果有职业信息，也显示出来
        if (audio.character.profession) {
          charInfo += ` (${audio.character.profession})`
        }
        infoMsg.push(charInfo)
      }
      
      // 场景和动作
      if (audio.scene || audio.actionType) {
        let detail = ''
        if (audio.scene === 'InGame') detail += '局内'
        else if (audio.scene === 'OutGame') detail += '局外'
        
        if (audio.actionType) {
          if (detail) detail += ' - '
          detail += audio.actionType
        }
        
        if (detail) {
          infoMsg.push(detail)
        }
      }

      // 链接有效期提示
      if (audio.download.expiresIn) {
        const minutes = Math.floor(audio.download.expiresIn / 60)
        const seconds = audio.download.expiresIn % 60
        infoMsg.push(`(链接${minutes}分${seconds}秒后失效)`)
      }

      // 发送语音
      await this.e.reply([
        infoMsg.length > 0 ? infoMsg.join(' ') + '\n' : '',
        segment.record(audio.download.url)
      ])

      // 记录日志
      const characterName = audio.character?.name || '未知'
      logger.info(`[DELTA FORCE PLUGIN] 发送语音: ${audio.fileName} (角色: ${characterName})`)
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 发送语音消息失败:', error)
      await this.e.reply('发送语音失败，请稍后重试。')
    }
  }
}