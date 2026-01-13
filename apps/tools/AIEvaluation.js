import utils from '../../utils/utils.js'
import Code from '../../components/Code.js'
import Config from '../../components/Config.js'
import DataManager from '../../utils/Data.js'
import fs from 'fs'
import path from 'path'

// TTS缓存目录
const pluginCache = path.join(process.cwd(), 'temp', 'delta-force-plugin')
const ttsCacheDir = path.join(pluginCache, 'tts')

// 确保缓存目录存在
if (!fs.existsSync(ttsCacheDir)) {
  fs.mkdirSync(ttsCacheDir, { recursive: true })
}

export class Ai extends plugin {
  constructor () {
    super({
      name: '三角洲AI锐评',
      dsc: '使用AI锐评战绩',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)(ai|AI)锐评\\s*(.*)$',
          fnc: 'getAiCommentary'
        },
        {
          reg: '^(#三角洲|\\^)(ai|AI)评价\\s+(\\S+)\\s+(\\S+)(?:\\s+(\\S+))?$',
          fnc: 'getAiCommentaryWithPreset'
        },
        {
          reg: '^(#三角洲|\\^)(ai|AI)预设列表$',
          fnc: 'listAiPresets'
        }
      ]
    })
  }

  /**
   * 解析游戏模式参数
   * @param {string} modeStr - 用户输入的模式字符串
   * @returns {Object} - { type: 'sol'|'mp', name: '烽火地带'|'全面战场' }
   */
  parseGameMode(modeStr) {
    if (!modeStr || modeStr.trim() === '') {
      // 默认烽火地带
      return { type: 'sol', name: '烽火地带' };
    }

    const mode = modeStr.trim().toLowerCase();
    
    // 烽火地带的别名
    const solAliases = ['sol', '烽火', '烽火地带', '摸金', '4'];
    // 全面战场的别名
    const mpAliases = ['mp', '战场', '大战场', '全面战场', '5'];
    
    if (solAliases.includes(mode)) {
      return { type: 'sol', name: '烽火地带' };
    } else if (mpAliases.includes(mode)) {
      return { type: 'mp', name: '全面战场' };
    } else {
      // 无法识别，返回null
      return null;
    }
  }

  async getAiCommentary (e) {
    const api = new Code(e);
    
    // 解析游戏模式参数
    const match = e.msg.match(this.rule[0].reg);
    const modeStr = match[3] || '';
    const gameMode = this.parseGameMode(modeStr);
    
    // 如果无法识别模式，给出提示
    if (!gameMode) {
      await e.reply([
        '无法识别的游戏模式，请使用以下格式：\n',
        '• ^ai锐评 sol/烽火/烽火地带/摸金/4 (烽火地带)\n',
        '• ^ai锐评 mp/战场/大战场/全面战场/5 (全面战场)\n',
        '• ^ai锐评 (默认烽火地带)'
      ].join(''));
      return true;
    }
    
    // CD键包含模式，不同模式独立CD
    const cdKey = `delta-force:ai-cd:${e.user_id}:${gameMode.type}`;
    const cd = await redis.ttl(cdKey);
    if (cd > 0) {
        const minutes = Math.ceil(cd / 60);
        await e.reply(`${gameMode.name}模式的AI大脑正在冷却中，请在 ${minutes} 分钟后重试哦~`);
        return true;
    }

    const token = await utils.getAccount(e.user_id, 'qq_wechat')
    if (!token) {
      await e.reply('您尚未绑定任何QQ/微信账号，请使用 #三角洲登录 进行绑定。')
      return true
    }

    // 抢占式设置临时CD，防止重复请求
    await redis.set(cdKey, '1', { EX: 90 }); // 90秒临时CD

    await e.reply(`正在分析您的${gameMode.name}近期战绩，请耐心等待...`)

    try {
      const res = await api.getAiCommentary(token, gameMode.type)

      if (!res || !res.success || !res.data) {
        throw new Error(res.msg || res.message || '请求AI接口失败或未返回有效数据')
      }

      let fullAnswer = ''
      // 从返回的data字符串中解析流式内容
      const streamContent = res.data
      const lines = streamContent.split('\n').filter(line => line.trim().startsWith('data:'))

      for (const line of lines) {
        const jsonData = line.substring(6)
        try {
          const parsedData = JSON.parse(jsonData)
          // 根据Dify文档，内容在 answer 字段
          if (parsedData.answer) {
            fullAnswer += parsedData.answer
          }
        } catch (e) {
          logger.warn(`[AI锐评] 解析流式JSON块失败: ${jsonData}`)
        }
      }

      if (fullAnswer.trim()) {
        // 成功，将CD延长至1小时
        await redis.expire(cdKey, 3600);
        
        // 直接回复发送内容（引用原消息）
        await e.reply(`【${gameMode.name}模式 AI锐评】\n${fullAnswer}`)
      } else {
        // 失败，立即删除CD
        await redis.del(cdKey);
        await e.reply(`${gameMode.name}模式AI锐评失败，未能生成有效内容。`)
      }
    } catch (error) {
      // 任何错误都应立即删除CD
      await redis.del(cdKey);
      await e.reply(`${gameMode.name}模式AI锐评出错了: ${error.message}`)
    }

    return true
  }

  /**
   * 使用指定预设进行AI评价
   * 命令格式: ^ai评价 模式 预设 [音色]
   * 支持预设代码(rp/cxg)或中文名(锐评/雌小鬼)
   * 可选音色参数用于生成TTS语音
   */
  async getAiCommentaryWithPreset (e) {
    const api = new Code(e);
    
    // 解析参数: 模式 预设 [音色]
    const match = e.msg.match(this.rule[1].reg);
    const modeStr = match[3];
    const presetInput = match[4];
    const voiceInput = match[5] || null; // 可选的TTS音色预设
    
    // 解析游戏模式
    const gameMode = this.parseGameMode(modeStr);
    if (!gameMode) {
      await e.reply([
        '无法识别的游戏模式，请使用以下格式：\n',
        '• ^ai评价 sol/烽火 预设\n',
        '• ^ai评价 mp/战场 预设\n\n',
        '预设支持代码或中文名，如: rp、锐评、cxg、雌小鬼\n',
        '使用 ^ai预设列表 查看可用预设'
      ].join(''));
      return true;
    }
    
    // 查找预设（支持代码或中文名）
    let preset = DataManager.findAiPreset(presetInput);
    if (!preset) {
      // 尝试刷新预设列表后重新查找
      await DataManager.refreshAiPresets();
      preset = DataManager.findAiPreset(presetInput);
      
      if (!preset) {
        const presets = DataManager.getAiPresets();
        let presetHint = '';
        if (presets && presets.length > 0) {
          presetHint = '\n可用预设: ' + presets.map(p => `${p.name}(${p.code})`).join(', ');
        }
        await e.reply(`无效的预设: ${presetInput}${presetHint}\n\n使用 ^ai预设列表 查看可用预设`);
        return true;
      }
    }
    
    const presetCode = preset.code;
    const presetName = preset.name;
    
    // CD键包含模式和预设，不同组合独立CD
    const cdKey = `delta-force:ai-cd:${e.user_id}:${gameMode.type}:${presetCode}`;
    const cd = await redis.ttl(cdKey);
    if (cd > 0) {
      const minutes = Math.ceil(cd / 60);
      await e.reply(`${gameMode.name}模式的【${presetName}】AI正在冷却中，请在 ${minutes} 分钟后重试哦~`);
      return true;
    }

    const token = await utils.getAccount(e.user_id, 'qq_wechat')
    if (!token) {
      await e.reply('您尚未绑定任何QQ/微信账号，请使用 #三角洲登录 进行绑定。')
      return true
    }

    // 抢占式设置临时CD，防止重复请求
    await redis.set(cdKey, '1', { EX: 90 }); // 90秒临时CD

    await e.reply(`正在使用【${presetName}】分析您的${gameMode.name}近期战绩，请耐心等待...`)

    try {
      const res = await api.getAiCommentary(token, gameMode.type, presetCode)

      if (!res || !res.success || !res.data) {
        throw new Error(res.msg || res.message || '请求AI接口失败或未返回有效数据')
      }

      let fullAnswer = ''
      // 从返回的data字符串中解析流式内容
      const streamContent = res.data
      const lines = streamContent.split('\n').filter(line => line.trim().startsWith('data:'))

      for (const line of lines) {
        const jsonData = line.substring(6)
        try {
          const parsedData = JSON.parse(jsonData)
          if (parsedData.answer) {
            fullAnswer += parsedData.answer
          }
        } catch (parseError) {
          logger.warn(`[AI评价] 解析流式JSON块失败: ${jsonData}`)
        }
      }

      if (fullAnswer.trim()) {
        // 成功，将CD延长至1小时
        await redis.expire(cdKey, 3600);
        
        // 直接回复发送内容（引用原消息）
        await e.reply(`【${gameMode.name}模式 AI${presetName}】\n${fullAnswer}`, true)
        
        // 如果指定了音色预设，异步生成TTS语音
        if (voiceInput) {
          this.generateTtsVoice(e, api, fullAnswer, voiceInput)
        }
      } else {
        // 失败，立即删除CD
        await redis.del(cdKey);
        await e.reply(`${gameMode.name}模式AI${presetName}失败，未能生成有效内容。`)
      }
    } catch (error) {
      // 任何错误都应立即删除CD
      await redis.del(cdKey);
      await e.reply(`${gameMode.name}模式AI${presetName}出错了: ${error.message}`)
    }

    return true
  }

  /**
   * 检查AI评价TTS功能权限
   * @param {object} e - 消息事件对象
   * @returns {object} { allowed: boolean, message: string }
   */
  checkAiTtsPermission(e) {
    const ttsConfig = Config.getConfig()?.delta_force?.tts || {}
    const aiTtsConfig = ttsConfig.ai_tts || {}
    
    // 检查功能是否启用
    if (aiTtsConfig.enabled === false) {
      return { allowed: false, message: 'AI评价TTS功能未启用' }
    }
    
    const mode = aiTtsConfig.mode || 'blacklist'
    const groupList = (aiTtsConfig.group_list || []).map(String)
    const userList = (aiTtsConfig.user_list || []).map(String)
    
    const userId = String(e.user_id)
    const groupId = e.isGroup ? String(e.group_id) : null
    
    if (mode === 'whitelist') {
      const userAllowed = userList.includes(userId)
      const groupAllowed = groupId && groupList.includes(groupId)
      if (!userAllowed && !groupAllowed) {
        return { allowed: false, message: 'AI评价TTS功能未对您开放' }
      }
    } else {
      if (userList.includes(userId)) {
        return { allowed: false, message: 'AI评价TTS功能已被禁用' }
      }
      if (groupId && groupList.includes(groupId)) {
        return { allowed: false, message: 'AI评价TTS功能在本群已被禁用' }
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
   * 异步生成TTS语音
   * @param {object} e - 消息事件对象
   * @param {Code} api - API实例
   * @param {string} text - 要转换的文本
   * @param {string} voiceInput - 音色预设（ID或中文名）
   */
  async generateTtsVoice(e, api, text, voiceInput) {
    try {
      // 检查AI评价TTS权限
      const permission = this.checkAiTtsPermission(e)
      if (!permission.allowed) {
        await e.reply(permission.message)
        return
      }

      // 查找TTS音色预设
      let voicePreset = DataManager.findTtsPreset(voiceInput)
      if (!voicePreset) {
        await DataManager.refreshTtsPresets()
        voicePreset = DataManager.findTtsPreset(voiceInput)
        
        if (!voicePreset) {
          const ttsPresets = DataManager.getTtsPresetList()
          let voiceHint = ''
          if (ttsPresets && ttsPresets.length > 0) {
            voiceHint = '\n可用音色: ' + ttsPresets.map(p => `${p.name}(${p.id})`).join(', ')
          }
          await e.reply(`无效的音色预设: ${voiceInput}${voiceHint}`)
          return
        }
      }

      const characterId = voicePreset.id
      const characterName = voicePreset.name

      // AI评价TTS不限制字数，直接使用全文
      const ttsText = text

      logger.info(`[AI评价] 开始生成TTS语音，角色: ${characterName}, 文本长度: ${ttsText.length}`)

      // 调用TTS合成API
      const res = await api.ttsSynthesize({
        text: ttsText,
        character: characterId
      })

      if (!res.success || !res.data || !res.data.taskId) {
        logger.warn(`[AI评价] TTS任务提交失败: ${res.message || '未知错误'}`)
        await e.reply(`语音生成失败: ${res.message || '未知错误'}`)
        return
      }

      const taskId = res.data.taskId

      // 轮询任务状态
      const result = await this.pollTtsTaskStatus(api, taskId)

      if (!result.success) {
        logger.warn(`[AI评价] TTS生成失败: ${result.message}`)
        await e.reply(`语音生成失败: ${result.message}`)
        return
      }

      // 下载音频到本地
      const localPath = await this.downloadTtsAudio(result.audio_url, result.filename, e.user_id)

      if (!localPath) {
        await e.reply('语音下载失败，请稍后重试')
        return
      }

      // 发送语音
      const recordUrl = `file:///${localPath.replace(/\\/g, '/')}`
      await e.reply([segment.at(e.user_id), ' AI评价语音生成完毕！请查收'])
      await e.reply(segment.record(recordUrl))

      logger.info(`[AI评价] TTS语音发送成功: ${result.filename}`)

      // 60秒后清理临时文件
      setTimeout(() => {
        try { fs.unlinkSync(localPath) } catch (err) {}
      }, 60 * 1000)

    } catch (error) {
      logger.error('[AI评价] TTS语音生成异常:', error)
      await e.reply(`语音生成出错: ${error.message}`)
    }
  }

  /**
   * 轮询TTS任务状态
   * @param {Code} api - API实例
   * @param {string} taskId - 任务ID
   * @returns {Promise<object>} - 结果对象
   */
  async pollTtsTaskStatus(api, taskId) {
    const maxAttempts = 90
    const pollInterval = 5000

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const res = await api.getTtsTaskStatus(taskId)

        if (!res.success || !res.data) {
          await this.sleep(pollInterval)
          continue
        }

        const { status, result, error } = res.data

        switch (status) {
          case 'completed':
            if (result && result.audio_url) {
              return {
                success: true,
                audio_url: result.audio_url,
                filename: result.filename
              }
            }
            return { success: false, message: '任务完成但未获取到音频链接' }

          case 'failed':
            return { success: false, message: error || '语音合成失败' }

          case 'queued':
          case 'processing':
            break
        }

        await this.sleep(pollInterval)
      } catch (error) {
        logger.error(`[AI评价] TTS任务状态轮询异常:`, error)
        await this.sleep(pollInterval)
      }
    }

    return { success: false, message: '语音合成超时，请稍后重试' }
  }

  /**
   * 下载TTS音频到本地缓存
   * @param {string} audioUrl - 音频URL
   * @param {string} filename - 文件名
   * @param {string} userId - 用户ID
   * @returns {Promise<string|null>} - 本地文件路径
   */
  async downloadTtsAudio(audioUrl, filename, userId) {
    try {
      const response = await fetch(audioUrl)
      if (!response.ok) {
        throw new Error(`下载失败: ${response.status}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const localFilename = `${userId}_${Date.now()}_${filename || 'ai_tts.wav'}`
      const localPath = path.join(ttsCacheDir, localFilename)

      fs.writeFileSync(localPath, buffer)
      logger.info(`[AI评价] TTS音频已缓存: ${localPath}`)

      return localPath
    } catch (error) {
      logger.error('[AI评价] 下载TTS音频失败:', error)
      return null
    }
  }

  /**
   * 延时函数
   * @param {number} ms - 延时毫秒数
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 列出所有可用的AI预设
   */
  async listAiPresets (e) {
    // 先尝试刷新预设列表
    await DataManager.refreshAiPresets();
    
    const presets = DataManager.getAiPresets();
    
    if (!presets || presets.length === 0) {
      await e.reply('暂无可用的AI预设，请稍后重试。');
      return true;
    }
    
    let msg = '【AI评价预设列表】\n\n';
    presets.forEach((preset, index) => {
      const defaultMark = preset.isDefault ? ' (默认)' : '';
      msg += `${index + 1}. ${preset.name} - 代码: ${preset.code}${defaultMark}\n`;
    });
    
    msg += '\n使用方法:\n';
    msg += '• ^ai锐评 模式 - 使用默认预设(锐评)\n';
    msg += '• ^ai评价 模式 预设 - 使用指定预设\n';
    msg += '• ^ai评价 模式 预设 音色 - 额外生成TTS语音\n';
    msg += '\n示例:\n';
    msg += '• ^ai评价 烽火 cxg\n';
    msg += '• ^ai评价 烽火 雌小鬼\n';
    msg += '• ^ai评价 烽火 雌小鬼 麦晓雯 (带语音)\n';
    msg += '• ^ai评价 mp 锐评';
    
    await e.reply(msg);
    return true;
  }
}