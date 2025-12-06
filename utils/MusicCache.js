import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { pluginCache } from '../model/path.js'

/**
 * 音乐缓存管理器
 * 负责音乐文件的本地缓存管理
 */
class MusicCache {
  constructor() {
    // 缓存目录：Miao-Yunzai/temp/delta-force-plugin/music
    this.cacheDir = path.join(pluginCache, 'music')
    // 缓存元数据文件
    this.metadataFile = path.join(this.cacheDir, 'metadata.json')
    // 内存中的元数据缓存
    this.metadata = new Map()
    
    // 初始化缓存目录
    this.initCacheDir()
    // 加载元数据
    this.loadMetadata()
  }

  /**
   * 初始化缓存目录
   */
  initCacheDir() {
    try {
      if (!fs.existsSync(this.cacheDir)) {
        fs.mkdirSync(this.cacheDir, { recursive: true })
        logger.info('[Delta-Force 音乐缓存] 缓存目录已创建:', this.cacheDir)
      }
    } catch (error) {
      logger.error('[Delta-Force 音乐缓存] 创建缓存目录失败:', error)
    }
  }

  /**
   * 加载元数据文件
   */
  loadMetadata() {
    try {
      if (fs.existsSync(this.metadataFile)) {
        const data = fs.readFileSync(this.metadataFile, 'utf8')
        const metadataObj = JSON.parse(data)
        this.metadata = new Map(Object.entries(metadataObj))
        logger.info(`[Delta-Force 音乐缓存] 已加载 ${this.metadata.size} 条缓存元数据`)
      }
    } catch (error) {
      logger.error('[Delta-Force 音乐缓存] 加载元数据失败:', error)
      this.metadata = new Map()
    }
  }

  /**
   * 保存元数据到文件
   */
  saveMetadata() {
    try {
      const metadataObj = Object.fromEntries(this.metadata)
      fs.writeFileSync(this.metadataFile, JSON.stringify(metadataObj, null, 2), 'utf8')
    } catch (error) {
      logger.error('[Delta-Force 音乐缓存] 保存元数据失败:', error)
    }
  }

  /**
   * 生成音乐的唯一标识符
   * @param {Object} music - 音乐对象
   * @returns {string} - 唯一标识符
   */
  generateMusicKey(music) {
    // 使用 fileName + artist 生成唯一键
    const identifier = `${music.fileName || 'unknown'}_${music.artist || 'unknown'}`
    return crypto.createHash('md5').update(identifier).digest('hex')
  }

  /**
   * 生成缓存文件路径
   * @param {string} musicKey - 音乐唯一标识符
   * @param {string} extension - 文件扩展名
   * @returns {string} - 缓存文件路径
   */
  getCacheFilePath(musicKey, extension = 'mp3') {
    return path.join(this.cacheDir, `${musicKey}.${extension}`)
  }

  /**
   * 检查音乐是否已缓存
   * @param {Object} music - 音乐对象
   * @returns {boolean} - 是否已缓存
   */
  isCached(music) {
    const musicKey = this.generateMusicKey(music)
    const cachedData = this.metadata.get(musicKey)
    
    if (!cachedData) return false
    
    // 检查文件是否存在
    const filePath = this.getCacheFilePath(musicKey, cachedData.extension)
    return fs.existsSync(filePath)
  }

  /**
   * 获取缓存的音乐文件路径
   * @param {Object} music - 音乐对象
   * @returns {string|null} - 缓存文件路径，如果不存在则返回null
   */
  getCachedMusicPath(music) {
    const musicKey = this.generateMusicKey(music)
    const cachedData = this.metadata.get(musicKey)
    
    if (!cachedData) return null
    
    const filePath = this.getCacheFilePath(musicKey, cachedData.extension)
    if (fs.existsSync(filePath)) {
      // 更新最后访问时间
      cachedData.lastAccess = Date.now()
      this.metadata.set(musicKey, cachedData)
      this.saveMetadata()
      
      logger.debug(`[Delta-Force 音乐缓存] 命中缓存: ${music.fileName}`)
      return filePath
    }
    
    // 元数据存在但文件不存在，清理元数据
    this.metadata.delete(musicKey)
    this.saveMetadata()
    return null
  }

  /**
   * 下载并缓存音乐文件
   * @param {Object} music - 音乐对象
   * @returns {Promise<string|null>} - 缓存文件路径，失败返回null
   */
  async downloadAndCache(music) {
    try {
      if (!music.download || !music.download.url) {
        logger.error('[Delta-Force 音乐缓存] 音乐数据缺少下载链接')
        return null
      }

      const musicKey = this.generateMusicKey(music)
      
      // 从URL推断文件扩展名，默认mp3
      const urlExtension = path.extname(new URL(music.download.url).pathname).slice(1)
      const extension = urlExtension || 'mp3'
      const filePath = this.getCacheFilePath(musicKey, extension)

      logger.info(`[Delta-Force 音乐缓存] 开始下载: ${music.fileName} - ${music.artist}`)

      // 下载音乐文件
      const response = await fetch(music.download.url)
      if (!response.ok) {
        logger.error(`[Delta-Force 音乐缓存] 下载失败: HTTP ${response.status}`)
        return null
      }

      // 将数据写入文件
      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      fs.writeFileSync(filePath, buffer)

      // 下载并缓存封面图片
      let coverPath = null
      if (music.metadata && music.metadata.cover) {
        coverPath = await this.downloadCover(musicKey, music.metadata.cover)
      }

      // 保存元数据
      const metadataEntry = {
        fileName: music.fileName,
        artist: music.artist,
        playlist: music.playlist,
        extension: extension,
        fileSize: buffer.length,
        downloadTime: Date.now(),
        lastAccess: Date.now(),
        sourceUrl: music.download.url,
        coverPath: coverPath,
        coverUrl: music.metadata?.cover || null
      }
      
      this.metadata.set(musicKey, metadataEntry)
      this.saveMetadata()

      logger.info(`[Delta-Force 音乐缓存] 缓存成功: ${music.fileName} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`)
      return filePath
    } catch (error) {
      logger.error('[Delta-Force 音乐缓存] 下载缓存失败:', error)
      return null
    }
  }

  /**
   * 下载封面图片
   * @param {string} musicKey - 音乐唯一标识符
   * @param {string} coverUrl - 封面图片URL
   * @returns {Promise<string|null>} - 封面文件路径，失败返回null
   */
  async downloadCover(musicKey, coverUrl) {
    try {
      // 从URL推断文件扩展名
      const urlExtension = path.extname(new URL(coverUrl).pathname).slice(1)
      const extension = urlExtension || 'jpg'
      const coverPath = path.join(this.cacheDir, `${musicKey}_cover.${extension}`)

      logger.debug(`[Delta-Force 音乐缓存] 开始下载封面: ${coverUrl}`)

      // 下载封面
      const response = await fetch(coverUrl)
      if (!response.ok) {
        logger.warn(`[Delta-Force 音乐缓存] 封面下载失败: HTTP ${response.status}`)
        return null
      }

      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      fs.writeFileSync(coverPath, buffer)

      logger.debug(`[Delta-Force 音乐缓存] 封面缓存成功: ${(buffer.length / 1024).toFixed(2)} KB`)
      return coverPath
    } catch (error) {
      logger.error('[Delta-Force 音乐缓存] 下载封面失败:', error)
      return null
    }
  }

  /**
   * 清理过期缓存
   * @param {number} maxAge - 最大缓存时间（毫秒），默认14天
   */
  cleanExpiredCache(maxAge = 14 * 24 * 60 * 60 * 1000) {
    try {
      const now = Date.now()
      let cleanedCount = 0

      for (const [musicKey, data] of this.metadata.entries()) {
        const age = now - (data.lastAccess || data.downloadTime)
        
        if (age > maxAge) {
          const filePath = this.getCacheFilePath(musicKey, data.extension)
          
          // 删除音乐文件
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
          }
          
          // 删除封面文件
          if (data.coverPath && fs.existsSync(data.coverPath)) {
            fs.unlinkSync(data.coverPath)
          }
          
          // 删除元数据
          this.metadata.delete(musicKey)
          cleanedCount++
        }
      }

      if (cleanedCount > 0) {
        this.saveMetadata()
        logger.info(`[Delta-Force 音乐缓存] 清理了 ${cleanedCount} 个过期缓存`)
      }
    } catch (error) {
      logger.error('[Delta-Force 音乐缓存] 清理缓存失败:', error)
    }
  }

  /**
   * 获取缓存统计信息
   * @returns {Object} - 缓存统计信息
   */
  getCacheStats() {
    let totalSize = 0
    let validCount = 0

    for (const [musicKey, data] of this.metadata.entries()) {
      const filePath = this.getCacheFilePath(musicKey, data.extension)
      if (fs.existsSync(filePath)) {
        totalSize += data.fileSize || 0
        validCount++
      }
    }

    return {
      totalFiles: validCount,
      totalSize: totalSize,
      totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
      metadataCount: this.metadata.size
    }
  }

  /**
   * 清空所有缓存
   */
  clearAllCache() {
    try {
      // 删除所有缓存文件
      for (const [musicKey, data] of this.metadata.entries()) {
        const filePath = this.getCacheFilePath(musicKey, data.extension)
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
        
        // 删除封面文件
        if (data.coverPath && fs.existsSync(data.coverPath)) {
          fs.unlinkSync(data.coverPath)
        }
      }

      // 清空元数据
      this.metadata.clear()
      this.saveMetadata()

      logger.info('[Delta-Force 音乐缓存] 已清空所有缓存')
    } catch (error) {
      logger.error('[Delta-Force 音乐缓存] 清空缓存失败:', error)
    }
  }

  /**
   * 获取缓存的封面路径
   * @param {Object} music - 音乐对象
   * @returns {string|null} - 封面文件路径，如果不存在则返回null
   */
  getCachedCoverPath(music) {
    const musicKey = this.generateMusicKey(music)
    const cachedData = this.metadata.get(musicKey)
    
    if (cachedData && cachedData.coverPath && fs.existsSync(cachedData.coverPath)) {
      return cachedData.coverPath
    }
    
    return null
  }
}

// 导出单例
export default new MusicCache()

