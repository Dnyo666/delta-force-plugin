import Code from '../components/Code.js'
import utils from '../utils/utils.js'

/**
 * 三角洲随机语音插件
 * 功能：从云端实时获取并发送游戏角色语音
 */
export class Voice extends plugin {
  constructor(e) {
    super({
      name: '三角洲随机语音',
      dsc: '三角洲行动游戏随机语音',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)(随机)?语音$',
          fnc: 'sendRandomVoice'
        },
        {
          reg: '^(#三角洲|\\^)角色语音\\s*(.*)$',
          fnc: 'sendCharacterVoice'
        },
        {
          reg: '^(#三角洲|\\^)语音列表$',
          fnc: 'getCharacterList'
        },
        {
          reg: '^(#三角洲|\\^)语音分类$',
          fnc: 'getCategoryList'
        },
        {
          reg: '^(#三角洲|\\^)语音统计$',
          fnc: 'getAudioStats'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
  }

  /**
   * 发送随机语音
   * 命令：#三角洲语音 或 #三角洲随机语音
   * 功能：随机获取任意角色的语音
   */
  async sendRandomVoice() {
    try {
      await this.e.reply('正在获取随机语音，请稍候...')

      // 调用随机音频接口（不指定任何参数，完全随机）
      const res = await this.api.getRandomAudio({
        count: 1
      })

      if (await utils.handleApiError(res, this.e)) return true

      if (!res.data || !res.data.audios || res.data.audios.length === 0) {
        await this.e.reply('未获取到语音数据，请稍后重试。')
        return true
      }

      // 发送语音
      await this.sendVoiceMessage(res.data.audios[0])
      return true
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 发送随机语音失败:', error)
      await this.e.reply('发送语音失败，请稍后重试。')
      return true
    }
  }

  /**
   * 发送指定角色语音
   * 命令：#三角洲角色语音 [角色名] [场景] [动作类型]
   * 示例：#三角洲角色语音 红狼 局内 战斗
   */
  async sendCharacterVoice() {
    try {
      const match = this.e.msg.match(/^(#三角洲|\^)角色语音\s*(.*)$/)
      const params = match[2].trim()

      // 解析参数
      const args = params.split(/\s+/).filter(arg => arg)
      
      // 构建请求参数
      const queryParams = {
        count: 1
      }

      // 第一个参数：角色名
      if (args[0]) {
        queryParams.character = args[0]
      }

      // 第二个参数：场景
      if (args[1]) {
        const sceneMap = {
          '局内': 'InGame',
          '局外': 'OutGame',
          'ingame': 'InGame',
          'outgame': 'OutGame'
        }
        queryParams.scene = sceneMap[args[1].toLowerCase()] || args[1]
      }

      // 第三个参数：动作类型
      if (args[2]) {
        const actionMap = {
          '呼吸': 'Breath',
          '战斗': 'Combat',
          '死亡': 'Death',
          'breath': 'Breath',
          'combat': 'Combat',
          'death': 'Death'
        }
        queryParams.actionType = actionMap[args[2].toLowerCase()] || args[2]
      }

      // 提示信息
      let hint = '正在获取'
      if (queryParams.character) hint += ` ${queryParams.character}`
      if (queryParams.scene) hint += ` ${queryParams.scene === 'InGame' ? '局内' : '局外'}`
      if (queryParams.actionType) hint += ` ${queryParams.actionType}`
      hint += ' 语音...'
      
      await this.e.reply(hint)

      // 调用角色语音接口
      const res = await this.api.getCharacterAudio(queryParams)

      if (await utils.handleApiError(res, this.e)) return true

      if (!res.data || !res.data.audios || res.data.audios.length === 0) {
        let errorMsg = '未找到符合条件的语音'
        if (queryParams.character) {
          errorMsg += `\n角色：${queryParams.character}`
        }
        errorMsg += '\n使用 #三角洲语音列表 查看所有可用角色'
        await this.e.reply(errorMsg)
        return true
      }

      // 发送语音
      await this.sendVoiceMessage(res.data.audios[0])
      return true
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 发送角色语音失败:', error)
      await this.e.reply('发送语音失败，请稍后重试。')
      return true
    }
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

      // 构建消息 - 直接显示API返回的角色ID列表
      let message = '【三角洲角色语音列表】\n\n'
      message += `共 ${res.data.characters.length} 个角色\n\n`
      
      res.data.characters.forEach((characterId, index) => {
        message += `${index + 1}. ${characterId}\n`
      })

      message += '\n使用方法：\n'
      message += '• #三角洲角色语音 [角色名]\n'
      message += '• #三角洲角色语音 [角色名] [局内/局外]\n'
      message += '• #三角洲角色语音 [角色名] [局内/局外] [呼吸/战斗]\n\n'
      message += '提示：支持使用中文角色名，如"红狼"、"威龙"等'

      await this.e.reply(message)
      return true
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 获取角色列表失败:', error)
      await this.e.reply('获取角色列表失败，请稍后重试。')
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

      message += '\n当前仅支持角色语音(Voice)播放'

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
      
      // 角色名称
      if (audio.characterName) {
        infoMsg.push(`【${audio.characterName}】`)
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
      logger.info(`[DELTA FORCE PLUGIN] 发送语音: ${audio.fileName} (角色: ${audio.characterName || '未知'})`)
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 发送语音消息失败:', error)
      await this.e.reply('发送语音失败，请稍后重试。')
    }
  }
}

