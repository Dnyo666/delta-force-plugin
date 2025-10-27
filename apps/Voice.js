import Code from '../components/Code.js'
import utils from '../utils/utils.js'
import DataManager from '../utils/Data.js'

// 音乐记忆存储（全局，用于跨消息记忆）
const musicMemory = new Map()

export class Voice extends plugin {
  constructor(e) {
    super({
      name: '三角洲随机语音',
      dsc: '三角洲行动游戏随机语音',
      event: 'message',
      priority: 100,
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
          reg: '^(#三角洲|\\^)(歌词|鼠鼠歌词|鼠鼠音乐歌词)$',
          fnc: 'getLyrics'
        },
        {
          reg: '^(#三角洲|\\^)鼠鼠音乐\\s*(.*)$',
          fnc: 'sendShushuMusic'
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
      // 5. 默认当作角色参数（后端会自动识别以下格式）
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

  /**
   * 发送鼠鼠音乐
   * 命令：#三角洲鼠鼠音乐 [艺术家/歌曲名/歌单]
   */
  async sendShushuMusic() {
    try {
      const match = this.e.msg.match(/^(#三角洲|\^)鼠鼠音乐\s*(.*)$/)
      const params = match[2].trim()

      // 如果没有参数，直接随机
      if (!params) {
        await this.e.reply('正在获取随机鼠鼠音乐...')
        const res = await this.api.getShushuMusic({ count: 1 })
        
        if (await utils.handleApiError(res, this.e)) return true
        
        if (!res.data || !res.data.musics || res.data.musics.length === 0) {
          await this.e.reply('未找到符合条件的音乐')
          return true
        }
        
        await this.sendMusicMessage(res.data.musics[0])
        return true
      }

      // 有参数时，使用智能回退搜索
      await this.e.reply(`正在搜索 "${params}"...`)
      
      // 定义搜索顺序：歌单 -> 艺术家 -> 歌曲名
      const searchStrategies = [
        { type: 'playlist', param: 'playlist', label: '歌单' },
        { type: 'artist', param: 'artist', label: '艺术家' },
        { type: 'title', param: 'title', label: '歌曲名' }
      ]

      let foundMusic = null
      let successStrategy = null

      // 依次尝试每种搜索策略
      for (const strategy of searchStrategies) {
        logger.debug(`[DELTA FORCE PLUGIN] 尝试按${strategy.label}搜索: ${params}`)
        
        const apiParams = { count: 1 }
        apiParams[strategy.param] = params
        
        const res = await this.api.getShushuMusic(apiParams)
        
        // 检查是否成功且有结果
        if (res.success && res.data && res.data.musics && res.data.musics.length > 0) {
          foundMusic = res.data.musics[0]
          successStrategy = strategy
          logger.info(`[DELTA FORCE PLUGIN] ${strategy.label}搜索成功: ${params}`)
          break
        }
        
        logger.debug(`[DELTA FORCE PLUGIN] ${strategy.label}搜索失败，尝试下一个...`)
      }

      // 如果所有策略都失败
      if (!foundMusic) {
        await this.e.reply(`未找到与 "${params}" 相关的音乐\n已尝试搜索：歌单、艺术家、歌曲名`)
        return true
      }

      // 发送找到的音乐
      await this.sendMusicMessage(foundMusic)
      
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 发送鼠鼠音乐失败:', error)
      await this.e.reply('发送鼠鼠音乐失败，请稍后重试。')
      return true
    }
  }

  /**
   * 发送音乐消息的核心方法
   * @param {Object} music - 音乐对象
   */
  async sendMusicMessage(music) {
    try {
      if (!music.download || !music.download.url) {
        logger.error('[DELTA FORCE PLUGIN] 音乐数据缺少下载链接:', music)
        await this.e.reply('音乐数据异常，请稍后重试。')
        return
      }

      // 构建消息
      const msgParts = []
      
      // 歌曲名称和艺术家
      if (music.fileName && music.artist) {
        msgParts.push(`♪ ${music.fileName} - ${music.artist}`)
      } else if (music.fileName) {
        msgParts.push(`♪ ${music.fileName}`)
      }

      // 歌单信息
      if (music.playlist && music.playlist.name) {
        msgParts.push(`歌单: ${music.playlist.name}`)
      }

      // 热度信息
      if (music.metadata && music.metadata.hot) {
        msgParts.push(`🔥 ${music.metadata.hot}`)
      }
      
      // 发送音乐
      await this.e.reply(segment.record(music.download.url))

      // 发送文字信息
      if (msgParts.length > 0) {
        await this.e.reply(msgParts.join('\n'))
      }

      // 保存音乐记忆（2分钟有效期）
      this.saveMusicMemory(music)

      // 记录日志
      logger.info(`[DELTA FORCE PLUGIN] 发送鼠鼠音乐: ${music.fileName} - ${music.artist}`)
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 发送音乐消息失败:', error)
      await this.e.reply('发送音乐失败，请稍后重试。')
    }
  }

  /**
   * 保存音乐记忆
   * @param {Object} music - 音乐对象
   */
  saveMusicMemory(music) {
    const userId = this.e.user_id
    const memoryKey = `${userId}`
    
    // 保存音乐信息
    musicMemory.set(memoryKey, {
      music,
      timestamp: Date.now()
    })

    // 2分钟后自动清除
    setTimeout(() => {
      musicMemory.delete(memoryKey)
      logger.debug(`[DELTA FORCE PLUGIN] 清除用户 ${userId} 的音乐记忆`)
    }, 2 * 60 * 1000)

    logger.debug(`[DELTA FORCE PLUGIN] 保存用户 ${userId} 的音乐记忆: ${music.fileName}`)
  }

  /**
   * 获取歌词
   * 命令：^歌词 / ^鼠鼠歌词 / ^鼠鼠音乐歌词
   */
  async getLyrics() {
    try {
      const userId = this.e.user_id
      const memoryKey = `${userId}`
      
      // 检查是否有记忆
      const memory = musicMemory.get(memoryKey)
      if (!memory) {
        await this.e.reply('暂无最近播放的音乐记录\n请先使用 ^鼠鼠音乐 播放一首歌曲')
        return true
      }

      // 检查记忆是否过期（2分钟）
      const elapsed = Date.now() - memory.timestamp
      if (elapsed > 2 * 60 * 1000) {
        musicMemory.delete(memoryKey)
        await this.e.reply('音乐记录已过期（超过2分钟）\n请重新播放音乐')
        return true
      }

      const music = memory.music

      // 检查是否有歌词链接
      if (!music.metadata || !music.metadata.lrc) {
        await this.e.reply(`歌曲「${music.fileName}」暂无歌词`)
        return true
      }

      await this.e.reply(`正在获取「${music.fileName}」的歌词...`)

      // 下载并解析歌词
      const lrcContent = await this.fetchLyrics(music.metadata.lrc)
      if (!lrcContent) {
        await this.e.reply('获取歌词失败，请稍后重试')
        return true
      }

      // 解析LRC格式
      const parsedLyrics = this.parseLRC(lrcContent)

      // 构建转发消息
      const userInfo = {
        user_id: this.e.user_id,
        nickname: this.e.sender.nickname
      }

      const forwardMsg = [
        {
          ...userInfo,
          message: `【${music.fileName}】${music.artist ? `\n演唱：${music.artist}` : ''}`
        },
        {
          ...userInfo,
          message: parsedLyrics
        },
        {
          ...userInfo,
          message: '鼠鼠音乐由 @Liusy 提供'
        }
      ]

      await this.e.reply(await Bot.makeForwardMsg(forwardMsg))

      return true
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 获取歌词失败:', error)
      await this.e.reply('获取歌词失败，请稍后重试。')
      return true
    }
  }

  /**
   * 下载歌词文件
   * @param {string} lrcUrl - 歌词URL
   * @returns {Promise<string>} - 歌词内容
   */
  async fetchLyrics(lrcUrl) {
    try {
      const response = await fetch(lrcUrl)
      if (!response.ok) {
        logger.error(`[DELTA FORCE PLUGIN] 下载歌词失败: ${response.status}`)
        return null
      }
      const text = await response.text()
      return text
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 下载歌词异常:', error)
      return null
    }
  }

  /**
   * 解析LRC格式歌词
   * @param {string} lrcContent - LRC格式的歌词内容
   * @returns {string} - 纯文本歌词
   */
  parseLRC(lrcContent) {
    // LRC格式：[00:12.00]歌词内容
    const lines = lrcContent.split('\n')
    const lyrics = []

    for (const line of lines) {
      // 移除时间标签，提取歌词
      const match = line.match(/\[(\d+):(\d+)\.(\d+)\](.*)/)
      if (match && match[4].trim()) {
        lyrics.push(match[4].trim())
      } else {
        // 处理元数据行（如：[ti:歌名]）
        const metaMatch = line.match(/\[(ti|ar|al|by):(.+)\]/)
        if (!metaMatch && line.trim() && !line.startsWith('[')) {
          lyrics.push(line.trim())
        }
      }
    }

    return lyrics.length > 0 ? lyrics.join('\n') : '（暂无歌词内容）'
  }
}

