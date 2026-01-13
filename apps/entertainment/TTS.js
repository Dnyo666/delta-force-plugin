import Code from '../../components/Code.js'
import Config from '../../components/Config.js'
import utils from '../../utils/utils.js'
import DataManager from '../../utils/Data.js'
import fs from 'fs'
import path from 'path'
import { pluginCache } from '../../model/path.js'

// TTS语音缓存目录
const ttsCacheDir = path.join(pluginCache, 'tts')

// 确保缓存目录存在
if (!fs.existsSync(ttsCacheDir)) {
  fs.mkdirSync(ttsCacheDir, { recursive: true })
}

// TTS语音缓存（用户ID -> 语音信息）
const ttsCache = new Map()

export class TTS extends plugin {
  constructor(e) {
    super({
      name: '三角洲TTS语音合成',
      dsc: '三角洲行动TTS语音合成功能',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)tts状态$',
          fnc: 'getTtsHealth'
        },
        {
          reg: '^(#三角洲|\\^)tts(角色|预设)(列表)?$',
          fnc: 'getTtsPresets'
        },
        {
          reg: '^(#三角洲|\\^)tts角色详情\\s*(.+)$',
          fnc: 'getTtsPresetDetail'
        },
        {
          reg: '^(#三角洲|\\^)tts上传$',
          fnc: 'downloadLastTts'
        },
        {
          reg: '^(#三角洲|\\^)tts\\s+([\\s\\S]+)$',
          fnc: 'synthesize'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
  }

  /**
   * 获取TTS服务状态
   * 命令：^tts状态
   */
  async getTtsHealth() {
    try {
      await this.e.reply('正在检查TTS服务状态...')

      const res = await this.api.getTtsHealth()

      if (await utils.handleApiError(res, this.e)) return true

      if (!res.success) {
        await this.e.reply('TTS服务异常，请稍后重试')
        return true
      }

      let message = '【TTS语音合成服务状态】\n\n'
      message += `状态: ${res.message || '正常'}\n`
      message += `预设加载: ${res.presetsLoaded ? '✅ 已加载' : '❌ 未加载'}\n`
      message += `预设数量: ${res.presetCount || 0} 个\n`
      
      if (res.timestamp) {
        const time = new Date(res.timestamp).toLocaleString('zh-CN')
        message += `检查时间: ${time}`
      }

      await this.e.reply(message)
      return true
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 获取TTS状态失败:', error)
      await this.e.reply('获取TTS状态失败，请稍后重试。')
      return true
    }
  }

  /**
   * 获取TTS角色预设列表
   * 命令：^tts角色列表 / ^tts预设列表
   */
  async getTtsPresets() {
    try {
      await this.e.reply('正在获取TTS角色预设列表...')

      const res = await this.api.getTtsPresets()

      if (await utils.handleApiError(res, this.e)) return true

      if (!res.success || !res.data || !res.data.presets) {
        await this.e.reply('获取角色预设列表失败')
        return true
      }

      const { defaultPreset, presets } = res.data

      // 构建转发消息
      const userInfo = {
        user_id: this.e.user_id,
        nickname: this.e.sender.nickname
      }

      const forwardMsg = []

      // 添加标题
      forwardMsg.push({
        ...userInfo,
        message: `【TTS角色预设列表】\n共 ${presets.length} 个角色\n默认角色: ${defaultPreset}`
      })

      // 添加每个角色的信息
      for (const preset of presets) {
        let charMsg = `【${preset.name}】\n`
        charMsg += `ID: ${preset.id}\n`
        charMsg += `描述: ${preset.description || '无'}\n`
        charMsg += `默认情感: ${preset.defaultEmotion || 'neutral'}\n`
        
        if (preset.emotions && preset.emotions.length > 0) {
          charMsg += '\n可用情感:\n'
          preset.emotions.forEach(emo => {
            charMsg += `  • ${emo.name} (${emo.id})`
            if (emo.description) {
              charMsg += ` - ${emo.description}`
            }
            charMsg += '\n'
          })
        }

        forwardMsg.push({
          ...userInfo,
          message: charMsg
        })
      }

      // 添加使用说明
      forwardMsg.push({
        ...userInfo,
        message: '使用方法：\n• ^tts [角色] [情感] 文本内容\n• ^tts 麦晓雯 开心 你好呀！\n• ^tts 麦晓雯 我是麦晓雯\n\n提示：情感可选，不填则使用默认情感'
      })

      // 发送转发消息
      await this.e.reply(await Bot.makeForwardMsg(forwardMsg))
      return true
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 获取TTS角色预设列表失败:', error)
      await this.e.reply('获取角色预设列表失败，请稍后重试。')
      return true
    }
  }

  /**
   * 获取TTS角色预设详情
   * 命令：^tts角色详情 [角色ID]
   */
  async getTtsPresetDetail() {
    try {
      const match = this.e.msg.match(/^(#三角洲|\^)tts角色详情\s*(.+)$/)
      const characterId = match[2].trim()

      if (!characterId) {
        await this.e.reply('请指定角色ID\n例如：^tts角色详情 maiXiaowen')
        return true
      }

      await this.e.reply(`正在获取角色 "${characterId}" 的详情...`)

      const res = await this.api.getTtsPreset(characterId)

      if (await utils.handleApiError(res, this.e)) return true

      if (!res.success || !res.data) {
        await this.e.reply(`未找到角色 "${characterId}"`)
        return true
      }

      const preset = res.data

      let message = `【${preset.name}】\n\n`
      message += `ID: ${preset.id}\n`
      message += `描述: ${preset.description || '无'}\n`
      message += `默认情感: ${preset.defaultEmotion || 'neutral'}\n`
      message += `音色文件: ${preset.voiceFileExists ? '✅ 存在' : '❌ 缺失'}\n`

      if (preset.emotions && preset.emotions.length > 0) {
        message += '\n【可用情感】\n'
        preset.emotions.forEach(emo => {
          message += `• ${emo.name} (${emo.id})\n`
          if (emo.description) {
            message += `  ${emo.description}\n`
          }
        })
      }

      await this.e.reply(message)
      return true
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 获取TTS角色详情失败:', error)
      await this.e.reply('获取角色详情失败，请稍后重试。')
      return true
    }
  }

  /**
   * 检查TTS功能权限
   * @returns {object} { allowed: boolean, message: string }
   */
  checkTtsPermission() {
    const ttsConfig = Config.getConfig()?.delta_force?.tts || {}
    
    // 检查功能是否启用
    if (ttsConfig.enabled === false) {
      return { allowed: false, message: 'TTS功能未启用' }
    }
    
    const mode = ttsConfig.mode || 'blacklist'
    const groupList = (ttsConfig.group_list || []).map(String)
    const userList = (ttsConfig.user_list || []).map(String)
    
    const userId = String(this.e.user_id)
    const groupId = this.e.isGroup ? String(this.e.group_id) : null
    
    if (mode === 'whitelist') {
      // 白名单模式：只有列表中的群/用户可用
      const userAllowed = userList.includes(userId)
      const groupAllowed = groupId && groupList.includes(groupId)
      if (!userAllowed && !groupAllowed) {
        return { allowed: false, message: 'TTS功能未对您开放' }
      }
    } else {
      // 黑名单模式：列表中的群/用户禁用
      if (userList.includes(userId)) {
        return { allowed: false, message: 'TTS功能已被禁用' }
      }
      if (groupId && groupList.includes(groupId)) {
        return { allowed: false, message: 'TTS功能在本群已被禁用' }
      }
    }
    
    return { allowed: true, message: '' }
  }

  /**
   * 获取TTS最大字数限制
   * @returns {number}
   */
  getTtsMaxLength() {
    const ttsConfig = Config.getConfig()?.delta_force?.tts || {}
    return ttsConfig.max_length || 800
  }

  /**
   * TTS语音合成（队列模式）
   * 命令：^tts [角色] [情感] 文本内容
   * 示例：
   * - ^tts 麦晓雯 开心 你好呀！
   * - ^tts 麦晓雯 我是麦晓雯
   */
  async synthesize() {
    try {
      // 检查TTS权限
      const permission = this.checkTtsPermission()
      if (!permission.allowed) {
        await this.e.reply(permission.message)
        return true
      }

      const match = this.e.msg.match(/^(#三角洲|\^)tts\s+([\s\S]+)$/)
      const params = match[2].trim()

      if (!params) {
        await this.e.reply('请输入要合成的内容')
        return true
      }

      // 解析参数：角色 [情感] 文本（必须用空格分隔）
      const parseResult = await this.parseTtsParams(params)

      // 检查解析错误
      if (parseResult.error) {
        await this.e.reply(parseResult.error)
        return true
      }

      if (!parseResult.text) {
        await this.e.reply('请输入要合成的文本内容')
        return true
      }

      // 检查文本长度（使用配置的最大字数）
      const maxLength = this.getTtsMaxLength()
      if (parseResult.text.length > maxLength) {
        await this.e.reply(`文本过长（${parseResult.text.length}字），最多支持${maxLength}字符`)
        return true
      }

      // 构建API请求参数
      const apiParams = {
        text: parseResult.text
      }

      if (parseResult.character) {
        apiParams.character = parseResult.character
      }

      if (parseResult.emotion) {
        apiParams.emotion = parseResult.emotion
      }

      logger.debug(`[DELTA FORCE PLUGIN] TTS请求参数: ${JSON.stringify(apiParams)}`)

      // 调用TTS合成API（队列模式，返回taskId）
      const res = await this.api.ttsSynthesize(apiParams)

      if (await utils.handleApiError(res, this.e)) return true

      if (!res.success || !res.data || !res.data.taskId) {
        await this.e.reply(`语音合成失败: ${res.message || '未知错误'}`)
        return true
      }

      const { taskId, position, queueLength } = res.data

      // 发送队列提示
      let queueHint = '语音合成任务已提交'
      if (parseResult.characterName) {
        queueHint += `\n角色: ${parseResult.characterName}`
        if (parseResult.emotionName) {
          queueHint += ` | 情感: ${parseResult.emotionName}`
        }
      }
      if (position && queueLength) {
        queueHint += `\n队列位置: ${position}/${queueLength}`
      }
      queueHint += '\n正在处理中，请稍候...'

      await this.e.reply(queueHint)

      // 轮询任务状态
      const result = await this.pollTaskStatus(taskId, parseResult)

      if (!result.success) {
        await this.e.reply(result.message || '语音合成失败')
        return true
      }

      // 下载并缓存到本地
      const localPath = await this.downloadToCache(result.audio_url, result.filename)

      // 保存到缓存（5分钟有效）
      ttsCache.set(this.e.user_id, {
        audio_url: result.audio_url,
        filename: result.filename,
        localPath: localPath,
        timestamp: Date.now()
      })
      setTimeout(() => {
        const cached = ttsCache.get(this.e.user_id)
        if (cached && cached.localPath) {
          try { fs.unlinkSync(cached.localPath) } catch (e) {}
        }
        ttsCache.delete(this.e.user_id)
      }, 5 * 60 * 1000)

      // 艾特用户并发送语音（使用本地文件）
      const recordUrl = localPath ? `file:///${localPath.replace(/\\/g, '/')}` : result.audio_url
      await this.e.reply([segment.at(this.e.user_id), segment.record(recordUrl)])

      logger.info(`[DELTA FORCE PLUGIN] TTS合成成功: ${result.filename}, 文本: ${parseResult.text.substring(0, 20)}...`)
      return true
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] TTS语音合成失败:', error)
      await this.e.reply('语音合成失败，请稍后重试。')
      return true
    }
  }

  /**
   * 下载上次合成的TTS语音文件
   * 命令：^tts上传
   */
  async downloadLastTts() {
    try {
      const cached = ttsCache.get(this.e.user_id)

      if (!cached) {
        await this.e.reply('暂无可下载的语音\n请先使用 ^tts 命令合成语音')
        return true
      }

      // 检查是否过期（5分钟）
      if (Date.now() - cached.timestamp > 5 * 60 * 1000) {
        ttsCache.delete(this.e.user_id)
        await this.e.reply('语音已过期，请重新合成')
        return true
      }

      // 使用本地缓存文件发送
      if (cached.localPath && fs.existsSync(cached.localPath)) {
        await this.sendFileToGroup(cached.localPath, cached.filename)
      } else {
        // 本地文件不存在，重新下载后发送
        await this.downloadAndSendFile(cached.audio_url, cached.filename)
      }

      logger.info(`[DELTA FORCE PLUGIN] TTS文件上传成功: ${cached.filename}`)
      return true
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] TTS语音上传失败:', error)
      await this.e.reply('语音文件上传失败，请稍后重试。')
      return true
    }
  }

  /**
   * 下载音频到本地缓存目录
   * @param {string} audioUrl - 音频URL
   * @param {string} filename - 文件名
   * @returns {Promise<string|null>} - 本地文件路径
   */
  async downloadToCache(audioUrl, filename) {
    try {
      const response = await fetch(audioUrl)
      if (!response.ok) {
        throw new Error(`下载失败: ${response.status}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // 生成本地文件路径
      const localFilename = `${this.e.user_id}_${Date.now()}_${filename || 'tts.wav'}`
      const localPath = path.join(ttsCacheDir, localFilename)

      // 写入文件
      fs.writeFileSync(localPath, buffer)
      logger.info(`[DELTA FORCE PLUGIN] TTS音频已缓存: ${localPath}`)

      return localPath
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 下载TTS音频到缓存失败:', error)
      return null
    }
  }

  /**
   * 下载音频文件并发送
   * @param {string} audioUrl - 音频URL
   * @param {string} filename - 文件名
   */
  async downloadAndSendFile(audioUrl, filename) {
    try {
      const response = await fetch(audioUrl)
      if (!response.ok) {
        throw new Error(`下载失败: ${response.status}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // 保存到本地缓存
      const localFilename = `${this.e.user_id}_${Date.now()}_${filename || 'tts.wav'}`
      const localPath = path.join(ttsCacheDir, localFilename)
      fs.writeFileSync(localPath, buffer)

      // 使用sendFile上传到群文件
      await this.sendFileToGroup(localPath, filename || 'tts_audio.wav')

      // 清理临时文件
      setTimeout(() => {
        try { fs.unlinkSync(localPath) } catch (e) {}
      }, 60 * 1000)
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 下载音频文件失败:', error)
      // 下载失败时尝试发送语音
      await this.e.reply([
        segment.at(this.e.user_id),
        '文件下载失败，发送语音格式：',
        segment.record(audioUrl)
      ])
    }
  }

  /**
   * 使用sendFile方法上传文件
   * @param {string} filePath - 本地文件路径
   * @param {string} filename - 文件名
   */
  async sendFileToGroup(filePath, filename) {
    try {
      if (this.e.isGroup) {
        // 群聊使用sendFile上传到群文件
        const group = this.e.group
        if (group && typeof group.sendFile === 'function') {
          const result = await group.sendFile(filePath, '/', filename)
          logger.info(`[DELTA FORCE PLUGIN] 群文件上传成功:`, result)
          return
        }
      } else {
        // 私聊使用friend.sendFile
        const friend = this.e.friend
        if (friend && typeof friend.sendFile === 'function') {
          const result = await friend.sendFile(filePath, filename)
          logger.info(`[DELTA FORCE PLUGIN] 私聊文件发送成功:`, result)
          return
        }
      }
      
      // sendFile不可用时，尝试使用文件URL发送语音
      const fileUrl = `file:///${filePath.replace(/\\/g, '/')}`
      await this.e.reply(segment.record(fileUrl))
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 上传文件失败:', error)
      // 上传失败时尝试发送语音格式
      try {
        const fileUrl = `file:///${filePath.replace(/\\/g, '/')}`
        await this.e.reply(segment.record(fileUrl))
      } catch (e) {
        throw error
      }
    }
  }

  /**
   * 轮询TTS任务状态
   * @param {string} taskId - 任务ID
   * @param {object} parseResult - 解析后的参数（用于日志）
   * @returns {Promise<object>} - 结果对象
   */
  async pollTaskStatus(taskId, parseResult) {
    const maxAttempts = 90  // 最多轮询90次
    const pollInterval = 5000  // 每5秒轮询一次
    let lastStatus = ''

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const res = await this.api.getTtsTaskStatus(taskId)

        if (!res.success || !res.data) {
          logger.warn(`[DELTA FORCE PLUGIN] TTS任务状态查询失败: ${res.message}`)
          await this.sleep(pollInterval)
          continue
        }

        const { status, result, error, position, message } = res.data

        // 状态变化时记录日志
        if (status !== lastStatus) {
          logger.debug(`[DELTA FORCE PLUGIN] TTS任务状态: ${status} (taskId: ${taskId})`)
          lastStatus = status
        }

        switch (status) {
          case 'completed':
            // 任务完成
            if (result && result.audio_url) {
              return {
                success: true,
                audio_url: result.audio_url,
                filename: result.filename,
                duration_ms: result.duration_ms,
                expires_in: result.expires_in
              }
            }
            return { success: false, message: '任务完成但未获取到音频链接' }

          case 'failed':
            // 任务失败
            return { success: false, message: error || '语音合成失败' }

          case 'queued':
          case 'processing':
            // 继续等待
            break

          default:
            logger.warn(`[DELTA FORCE PLUGIN] 未知的TTS任务状态: ${status}`)
        }

        await this.sleep(pollInterval)
      } catch (error) {
        logger.error(`[DELTA FORCE PLUGIN] TTS任务状态轮询异常:`, error)
        await this.sleep(pollInterval)
      }
    }

    return { success: false, message: '语音合成超时，请稍后重试' }
  }

  /**
   * 延时函数
   * @param {number} ms - 延时毫秒数
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 解析TTS参数
   * 格式：角色 [情感] 文本（必须用空格分隔）
   * @param {string} params - 用户输入的参数字符串
   * @returns {object} 解析后的参数，包含error字段表示错误信息
   */
  async parseTtsParams(params) {
    const result = {
      character: null,
      characterName: null,
      emotion: null,
      emotionName: null,
      text: null,
      error: null
    }

    // 从本地缓存获取预设列表
    let presets = DataManager.getTtsPresetList()
    
    // 如果本地缓存为空，尝试刷新
    if (!presets || presets.length === 0) {
      logger.debug('[DELTA FORCE PLUGIN] TTS预设缓存为空，尝试刷新')
      await DataManager.refreshTtsPresets()
      presets = DataManager.getTtsPresetList()
    }

    // 如果仍然没有预设数据，返回错误
    if (!presets || presets.length === 0) {
      result.error = 'TTS预设数据不可用，请稍后重试'
      return result
    }

    // 构建角色和情感映射
    const characterMap = {}
    const emotionMap = {}
    const availableCharacters = []
    
    for (const preset of presets) {
      availableCharacters.push(`${preset.name}(${preset.id})`)
      // 角色ID -> 角色信息
      characterMap[preset.id.toLowerCase()] = {
        id: preset.id,
        name: preset.name,
        emotions: preset.emotions || []
      }
      // 角色中文名 -> 角色信息
      characterMap[preset.name] = {
        id: preset.id,
        name: preset.name,
        emotions: preset.emotions || []
      }

      // 情感映射
      if (preset.emotions) {
        for (const emo of preset.emotions) {
          emotionMap[emo.id.toLowerCase()] = { id: emo.id, name: emo.name }
          emotionMap[emo.name] = { id: emo.id, name: emo.name }
        }
      }
    }

    // 严格按空格分隔解析参数
    const words = params.split(/\s+/)
    
    // 必须至少有2个词（角色 + 文本）
    if (words.length < 2) {
      result.error = `格式错误，请使用空格分隔角色和文本\n正确格式：^tts 角色 [情感] 文本`
      return result
    }

    // 第一个词：必须匹配角色
    const firstWord = words[0]
    const matchedChar = characterMap[firstWord] || characterMap[firstWord.toLowerCase()]
    
    if (!matchedChar) {
      result.error = `未识别的角色: "${firstWord}"\n请使用空格分隔角色和文本}`
      return result
    }

    result.character = matchedChar.id
    result.characterName = matchedChar.name
    let consumedWords = 1

    // 第二个词：尝试匹配情感（可选）
    if (words.length > 2) {
      const secondWord = words[1]
      const matchedEmo = emotionMap[secondWord] || emotionMap[secondWord.toLowerCase()]
      
      if (matchedEmo) {
        result.emotion = matchedEmo.id
        result.emotionName = matchedEmo.name
        consumedWords = 2
      }
    }

    // 剩余部分作为文本
    result.text = words.slice(consumedWords).join(' ').trim()

    // 检查文本是否为空
    if (!result.text) {
      const emotionList = matchedChar.emotions.map(e => e.name).join('、')
      result.error = `请输入要合成的文本\n格式：^tts ${matchedChar.name} [情感] 文本}`
      return result
    }

    return result
  }
}
