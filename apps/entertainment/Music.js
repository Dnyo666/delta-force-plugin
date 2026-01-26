import Code from '../../components/Code.js'
import utils from '../../utils/utils.js'
import MusicCache from '../../utils/MusicCache.js'
import Render from '../../components/Render.js'

// 音乐记忆存储（全局，用于跨消息记忆）
const musicMemory = new Map()

// 音乐列表记忆（用于点歌功能）
// 结构: { userId: { list: [...], timestamp: Date.now(), type: 'rank|playlist' } }
const musicListMemory = new Map()

export class Music extends plugin {
  constructor(e) {
    super({
      name: '三角洲鼠鼠音乐',
      dsc: '三角洲行动鼠鼠音乐功能',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)(歌词|鼠鼠歌词|鼠鼠音乐歌词)$',
          fnc: 'getLyrics'
        },
        {
          reg: '^(#三角洲|\\^)鼠鼠语音$',
          fnc: 'sendShushuVoice'
        },
        {
          reg: '^(#三角洲|\\^)音乐缓存(状态|统计)$',
          fnc: 'getMusicCacheStats'
        },
        {
          reg: '^(#三角洲|\\^)清理音乐缓存$',
          fnc: 'cleanMusicCache'
        },
        {
          reg: '^(#三角洲|\\^)鼠鼠音乐(列表|排行榜)\\s*(\\d*)$',
          fnc: 'getShushuMusicRank'
        },
        {
          reg: '^(#三角洲|\\^)鼠鼠歌单\\s*(.*)$',
          fnc: 'getShushuPlaylist'
        },
        {
          reg: '^(#三角洲|\\^)(点歌|听|听歌|播放)\\s*(\\d+)$',
          fnc: 'selectMusicByNumber'
        },
        {
          reg: '^(#三角洲|\\^)鼠鼠音乐\\s*(.*)$',
          fnc: 'sendShushuMusic'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
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
        
        // 随机模式：检查是否有本地缓存，如果有则使用缓存
        await this.sendMusicMessage(res.data.musics[0], { useCache: true })
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

      // 指定搜索模式：
      // - useCache: true 表示优先使用本地缓存
      // - foundMusic 包含从API获取的最新元数据（热度等信息）
      await this.sendMusicMessage(foundMusic, { useCache: true })
      
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 发送鼠鼠音乐失败:', error)
      await this.e.reply('发送鼠鼠音乐失败，请稍后重试。')
      return true
    }
  }

  /**
   * 发送音乐消息的核心方法
   * @param {Object} music - 音乐对象（包含最新的API数据：热度、歌单等）
   * @param {Object} options - 选项
   * @param {boolean} options.useCache - 是否使用本地缓存
   */
  async sendMusicMessage(music, options = {}) {
    try {
      const { useCache = false } = options

      if (!music.download || !music.download.url) {
        logger.error('[DELTA FORCE PLUGIN] 音乐数据缺少下载链接:', music)
        await this.e.reply('音乐数据异常，请稍后重试。')
        return
      }

      const musicUrl = music.download.url

      // 先尝试发送音乐卡片（使用原始URL）
      const cardSent = await this.sendMusicCard(music, musicUrl)
      
      if (!cardSent) {
        // 卡片发送失败，使用备用方案：发送语音
        logger.info('[DELTA FORCE PLUGIN] 音乐卡片发送失败，使用语音备用方案')
        
        let cachedMusicUrl = musicUrl
        let fromCache = false
        
        // 如果需要缓存，尝试获取或下载
        if (useCache) {
          const cachedPath = MusicCache.getCachedMusicPath(music)
          
          if (cachedPath) {
            // 命中缓存
            cachedMusicUrl = `file:///${cachedPath.replace(/\\/g, '/')}`
            fromCache = true
            logger.info(`[DELTA FORCE PLUGIN] 使用本地缓存: ${music.fileName}`)
          } else {
            // 下载并缓存（后台进行，不阻塞）
            logger.info(`[DELTA FORCE PLUGIN] 缓存未命中，开始下载: ${music.fileName}`)
            MusicCache.downloadAndCache(music).catch(err => {
              logger.warn(`[DELTA FORCE PLUGIN] 后台缓存失败: ${err.message}`)
            })
          }
        }
        
        await this.sendMusicAsRecord(music, cachedMusicUrl, fromCache)
      }

      // 保存音乐记忆（2分钟有效期）
      this.saveMusicMemory(music)

    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 发送音乐消息失败:', error)
      await this.e.reply('发送音乐失败，请稍后重试。')
    }
  }

  /**
   * 发送音乐卡片
   * @param {Object} music - 音乐对象
   * @param {string} musicUrl - 音乐URL（原始URL）
   * @returns {Promise<boolean>} - 是否成功发送
   */
  async sendMusicCard(music, musicUrl) {
    try {
      const title = music.fileName || '未知歌曲'
      const singer = music.artist || '未知艺术家'
      const preview = music.metadata?.cover || ''
      const jumpUrl = 'https://sjz.hengj.cn'

      // OneBotv11 协议
      if (this.e.bot?.adapter === 'OneBotv11' || this.e.bot?.adapter?.name === 'OneBotv11') {
        await this.e.reply({
          type: "music",
          data: {
            type: "custom",
            url: jumpUrl,
            audio: musicUrl,
            title: title,
            image: preview,
            singer: singer
          }
        })
        
        logger.info(`[DELTA FORCE PLUGIN] 音乐卡片发送成功: ${title} - ${singer}`)
        return true
      }

      // ICQQ/OICQ 协议
      if (!this.e.bot.sendOidb || typeof core === 'undefined' || !core?.pb) {
        return false
      }

      // 获取接收者信息
      let recv_uin = 0
      let send_type = 0
      let recv_guild_id = 0

      if (this.e.isGroup) {
        recv_uin = this.e.group.gid
        send_type = 1
      } else if (this.e.guild_id) {
        recv_uin = Number(this.e.channel_id)
        recv_guild_id = BigInt(this.e.guild_id)
        send_type = 3
      } else {
        recv_uin = this.e.friend.uin || this.e.friend.uid
        send_type = 0
      }

      // 构建音乐卡片
      const prompt = `[分享]${title}-${singer}`
      const body = {
        1: 100497308,
        2: 1,
        3: 4,  // style: 4表示音乐卡片
        5: { 1: 1, 2: "0.0.0", 3: "com.tencent.qqmusic", 4: "cbd27cd7c861227d013a25b2d10f0799" },
        6: '',  // text字段留空
        10: send_type,
        11: recv_uin,
        12: { 10: title, 11: singer, 12: prompt, 13: jumpUrl, 14: preview, 16: musicUrl },
        19: recv_guild_id
      }

      const payload = await this.e.bot.sendOidb("OidbSvc.0xb77_9", core.pb.encode(body))
      const result = core.pb.decode(payload)

      if (result[3] != 0) {
        logger.warn(`[DELTA FORCE PLUGIN] 音乐卡片发送失败: ${result[3]}`)
        return false
      }

      logger.info(`[DELTA FORCE PLUGIN] 音乐卡片发送成功: ${title} - ${singer}`)
      return true
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 发送音乐卡片异常:', error)
      return false
    }
  }

  /**
   * 使用语音方式发送音乐（备用方案）
   * @param {Object} music - 音乐对象
   * @param {string} musicUrl - 音乐URL
   * @param {boolean} fromCache - 是否来自缓存
   */
  async sendMusicAsRecord(music, musicUrl, fromCache) {
    try {
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
      await this.e.reply(segment.record(musicUrl))

      // 发送文字信息
      if (msgParts.length > 0) {
        await this.e.reply(msgParts.join('\n'))
      }

      // 记录日志
      const cacheStatus = fromCache ? '[本地缓存]' : '[直链]'
      logger.info(`[DELTA FORCE PLUGIN] 发送鼠鼠音乐(语音): ${music.fileName} - ${music.artist} ${cacheStatus}`)
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 发送语音失败:', error)
      throw error
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
   * 发送鼠鼠语音
   * 命令：^鼠鼠语音
   * 将最近播放的音乐卡片转换为语音格式发送；如果没有记忆，则随机播放一首
   */
  async sendShushuVoice() {
    try {
      const userId = this.e.user_id
      const memoryKey = `${userId}`
      
      // 检查是否有记忆
      const memory = musicMemory.get(memoryKey)
      
      // 如果没有记忆或记忆已过期，随机获取一首鼠鼠音乐
      if (!memory || (Date.now() - memory.timestamp > 2 * 60 * 1000)) {
        logger.info('[DELTA FORCE PLUGIN] 无音乐记忆或已过期，随机获取鼠鼠音乐')
        await this.e.reply('正在获取随机鼠鼠音乐（语音版）...')
        
        const res = await this.api.getShushuMusic({ count: 1 })
        
        if (await utils.handleApiError(res, this.e)) return true
        
        if (!res.data || !res.data.musics || res.data.musics.length === 0) {
          await this.e.reply('未找到符合条件的音乐')
          return true
        }
        
        const music = res.data.musics[0]
        
        // 优先使用本地缓存
        let musicUrl = music.download.url
        let fromCache = false
        
        const cachedPath = MusicCache.getCachedMusicPath(music)
        if (cachedPath) {
          musicUrl = `file:///${cachedPath.replace(/\\/g, '/')}`
          fromCache = true
          logger.info(`[DELTA FORCE PLUGIN] 使用本地缓存发送语音: ${music.fileName}`)
        } else {
          // 下载并缓存（后台进行，不阻塞）
          logger.info(`[DELTA FORCE PLUGIN] 缓存未命中，开始下载: ${music.fileName}`)
          MusicCache.downloadAndCache(music).catch(err => {
            logger.warn(`[DELTA FORCE PLUGIN] 后台缓存失败: ${err.message}`)
          })
        }
        
        // 强制发送为语音格式
        await this.sendMusicAsRecord(music, musicUrl, fromCache)
        
        // 保存音乐记忆
        this.saveMusicMemory(music)
        
        return true
      }

      // 有记忆，转换最近播放的音乐为语音
      const music = memory.music

      if (!music.download || !music.download.url) {
        logger.error('[DELTA FORCE PLUGIN] 音乐数据缺少下载链接:', music)
        await this.e.reply('音乐数据异常，无法发送鼠鼠音乐语音。')
        return true
      }

      await this.e.reply('正在转换为语音...')

      // 优先使用本地缓存
      let musicUrl = music.download.url
      let fromCache = false

      const cachedPath = MusicCache.getCachedMusicPath(music)
      if (cachedPath) {
        // 命中缓存
        musicUrl = `file:///${cachedPath.replace(/\\/g, '/')}`
        fromCache = true
        logger.info(`[DELTA FORCE PLUGIN] 使用本地缓存发送语音: ${music.fileName}`)
      } else {
        // 未命中缓存，先下载
        logger.info(`[DELTA FORCE PLUGIN] 下载音乐用于语音: ${music.fileName}`)
        try {
          const downloadedPath = await MusicCache.downloadAndCache(music)
          if (downloadedPath) {
            musicUrl = `file:///${downloadedPath.replace(/\\/g, '/')}`
            fromCache = true
            logger.info(`[DELTA FORCE PLUGIN] 下载完成，使用本地文件发送: ${music.fileName}`)
          }
        } catch (err) {
          logger.warn(`[DELTA FORCE PLUGIN] 下载失败，使用直链: ${err.message}`)
          // 下载失败则使用原始URL
        }
      }

      // 强制发送为语音格式
      await this.sendMusicAsRecord(music, musicUrl, fromCache)

      return true
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 发送语音失败:', error)
      await this.e.reply('发送语音失败，请稍后重试。')
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

  /**
   * 获取音乐缓存统计信息
   * 命令：^音乐缓存状态 / ^音乐缓存统计
   */
  async getMusicCacheStats() {
    try {
      const stats = MusicCache.getCacheStats()

      let message = '【鼠鼠音乐缓存统计】\n\n'
      message += `缓存文件数: ${stats.totalFiles}\n`
      message += `总缓存大小: ${stats.totalSizeMB} MB\n`
      message += `元数据记录: ${stats.metadataCount}\n\n`
      message += `使用 ^清理音乐缓存 可清空所有缓存`

      await this.e.reply(message)
      return true
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 获取缓存统计失败:', error)
      await this.e.reply('获取缓存统计失败，请稍后重试。')
      return true
    }
  }

  /**
   * 清理音乐缓存（清空所有缓存）
   * 命令：^清理音乐缓存
   */
  async cleanMusicCache() {
    try {
      // 检查权限：只有主人可以清理缓存
      if (!this.e.isMaster) {
        await this.e.reply('只有主人可以清理音乐缓存')
        return true
      }

      const beforeStats = MusicCache.getCacheStats()
      await this.e.reply('正在清理音乐缓存...')

      // 清空所有缓存
      MusicCache.clearAllCache()

      let message = '音乐缓存已清空\n\n'
      message += `清理文件: ${beforeStats.totalFiles} 个\n`
      message += `释放空间: ${beforeStats.totalSizeMB} MB`

      await this.e.reply(message)
      return true
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 清理缓存失败:', error)
      await this.e.reply('清理缓存失败，请稍后重试。')
      return true
    }
  }

  /**
   * 获取鼠鼠音乐热度排行榜
   * 命令：^鼠鼠音乐列表 [页码] / ^鼠鼠音乐排行榜 [页码]
   */
  async getShushuMusicRank() {
    try {
      const match = this.e.msg.match(/^(#三角洲|\^)鼠鼠音乐(列表|排行榜)\s*(\d*)$/)
      const pageNum = parseInt(match[3]) || 1

      await this.e.reply('正在获取热度排行榜...')

      // 调用API获取按热度排序的音乐列表
      const res = await this.api.getShushuMusicList({ sortBy: 'hot' })

      if (await utils.handleApiError(res, this.e)) return true

      if (!res.data || res.data.length === 0) {
        await this.e.reply('未找到音乐数据')
        return true
      }

      // 保存列表到用户记忆（2分钟有效期）
      this.saveMusicListMemory(res.data, 'rank')

      // 渲染音乐列表图片（分页）
      await this.renderMusicList(res.data, '鼠鼠音乐热度排行榜', '最受欢迎的歌曲', 'rank', pageNum)
      
      return true
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 获取音乐排行榜失败:', error)
      await this.e.reply('获取排行榜失败，请稍后重试。')
      return true
    }
  }

  /**
   * 获取鼠鼠歌单
   * 命令：^鼠鼠歌单 [歌单名/ID/艺术家]
   */
  async getShushuPlaylist() {
    try {
      const match = this.e.msg.match(/^(#三角洲|\^)鼠鼠歌单\s*(.*)$/)
      const params = match[2].trim()

      if (!params) {
        await this.e.reply('请指定歌单名称、ID或艺术家\n例如：^鼠鼠歌单 曼波\n^鼠鼠歌单 10\n^鼠鼠歌单 沐源鸽')
        return true
      }

      await this.e.reply(`正在获取歌单 "${params}"...`)

      // 尝试按不同方式搜索
      let res
      let searchType = ''

      // 先尝试作为歌单搜索
      res = await this.api.getShushuMusicList({ playlist: params, sortBy: 'default' })
      
      if (res.success && res.data && res.data.length > 0) {
        searchType = 'playlist'
      } else {
        // 再尝试作为艺术家搜索
        res = await this.api.getShushuMusicList({ artist: params, sortBy: 'default' })
        if (res.success && res.data && res.data.length > 0) {
          searchType = 'artist'
        }
      }

      if (await utils.handleApiError(res, this.e)) return true

      if (!res.data || res.data.length === 0) {
        await this.e.reply(`未找到与 "${params}" 相关的歌单或艺术家`)
        return true
      }

      // 保存列表到用户记忆
      this.saveMusicListMemory(res.data, 'playlist')

      // 获取歌单/艺术家名称和副标题
      const title = searchType === 'playlist' 
        ? (res.data[0].playlist?.name || params)
        : `${params} 的歌曲`
      
      const subtitle = searchType === 'playlist' 
        ? `歌单 · ${params}`
        : `艺术家 · ${params}`

      // 渲染音乐列表图片（第1页）
      await this.renderMusicList(res.data, title, subtitle, 'playlist', 1)
      
      return true
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 获取歌单失败:', error)
      await this.e.reply('获取歌单失败，请稍后重试。')
      return true
    }
  }

  /**
   * 点歌功能
   * 命令：^点歌 [数字] / ^听 [数字] / ^听歌 [数字] / ^播放 [数字]
   */
  async selectMusicByNumber() {
    try {
      const match = this.e.msg.match(/^(#三角洲|\^)(点歌|听|听歌|播放)\s*(\d+)$/)
      const number = parseInt(match[3])

      const userId = this.e.user_id
      const listMemory = musicListMemory.get(userId)

      // 检查是否有列表记忆
      if (!listMemory) {
        await this.e.reply('您还没有获取音乐列表\n请先使用：\n• ^鼠鼠音乐列表\n• ^鼠鼠歌单 [歌单名]')
        return true
      }

      // 检查记忆是否过期（2分钟）
      const elapsed = Date.now() - listMemory.timestamp
      if (elapsed > 2 * 60 * 1000) {
        musicListMemory.delete(userId)
        await this.e.reply('音乐列表已过期（超过2分钟）\n请重新获取列表')
        return true
      }

      // 检查序号是否有效
      if (number < 1 || number > listMemory.list.length) {
        await this.e.reply(`序号超出范围\n请输入 1-${listMemory.list.length} 之间的数字`)
        return true
      }

      // 获取对应的音乐
      const music = listMemory.list[number - 1]

      // 发送音乐（使用缓存）
      await this.sendMusicMessage(music, { useCache: true })
      
      return true
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 点歌失败:', error)
      await this.e.reply('点歌失败，请稍后重试。')
      return true
    }
  }

  /**
   * 保存音乐列表记忆
   * @param {Array} musicList - 音乐列表
   * @param {string} type - 列表类型 ('rank' 或 'playlist')
   */
  saveMusicListMemory(musicList, type) {
    const userId = this.e.user_id
    
    // 保存列表信息
    musicListMemory.set(userId, {
      list: musicList,
      timestamp: Date.now(),
      type: type
    })

    // 2分钟后自动清除
    setTimeout(() => {
      musicListMemory.delete(userId)
      logger.debug(`[DELTA FORCE PLUGIN] 清除用户 ${userId} 的音乐列表记忆`)
    }, 2 * 60 * 1000)

    logger.debug(`[DELTA FORCE PLUGIN] 保存用户 ${userId} 的音乐列表记忆: ${musicList.length} 首歌曲`)
  }

  /**
   * 渲染音乐列表图片
   * @param {Array} musicList - 音乐列表
   * @param {string} title - 列表标题
   * @param {string} subtitle - 副标题
   * @param {string} type - 列表类型 ('rank' 或 'playlist')
   * @param {number} page - 页码（默认1）
   */
  async renderMusicList(musicList, title, subtitle, type, page = 1) {
    try {
      const pageSize = 10  // 每页显示10首歌
      const totalPages = Math.ceil(musicList.length / pageSize)
      
      // 验证页码
      if (page < 1 || page > totalPages) {
        await this.e.reply(`页码超出范围，共 ${totalPages} 页\n使用 ^鼠鼠音乐列表 [页码] 查看`)
        return
      }
      
      // 计算分页范围
      const startIndex = (page - 1) * pageSize
      const endIndex = Math.min(startIndex + pageSize, musicList.length)
      const displayList = musicList.slice(startIndex, endIndex)
      
      // 异步处理封面缓存
      const musicListWithCovers = await Promise.all(displayList.map(async (music, index) => {
        let coverUrl = music.metadata?.cover || null
        
        // 检查是否有本地缓存的封面
        const cachedCoverPath = MusicCache.getCachedCoverPath(music)
        if (cachedCoverPath) {
          // 使用file://协议指向本地文件
          coverUrl = `file:///${cachedCoverPath.replace(/\\/g, '/')}`
          logger.debug(`[DELTA FORCE PLUGIN] 使用缓存封面: ${music.fileName}`)
        }
        
        return {
          index: startIndex + index + 1,  // 全局序号
          cover: coverUrl,
          name: music.fileName || '未知歌曲',
          artist: music.artist || '未知艺术家',
          playlist: music.playlist?.name || null,
          hot: music.metadata?.hot || null
        }
      }))
      
      const templateData = {
        listTitle: title,
        subtitle: `${subtitle} · 第 ${page}/${totalPages} 页`,
        totalCount: musicList.length,
        musicList: musicListWithCovers
      }

      // 使用Render组件渲染图片
      return await Render.render('Template/musicList/musicList', templateData, {
        e: this.e,
        scale: 1.2
      })
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 渲染音乐列表失败:', error)
      // 渲染失败时使用文字消息作为备用方案
      let fallbackMsg = `【${title}】\n${subtitle}\n共 ${musicList.length} 首歌曲\n\n`
      
      const displayList = musicList.slice(0, 10)
      displayList.forEach((music, index) => {
        fallbackMsg += `${index + 1}. ${music.fileName}`
        if (music.artist) fallbackMsg += ` - ${music.artist}`
        if (music.metadata?.hot) fallbackMsg += ` 🔥${music.metadata.hot}`
        fallbackMsg += `\n`
      })
      
      if (musicList.length > 10) {
        fallbackMsg += `\n... 还有 ${musicList.length - 10} 首歌曲\n`
      }
      
      fallbackMsg += `\n使用 ^点歌 [序号] 播放歌曲`
      
      await this.e.reply(fallbackMsg)
    }
  }
}

