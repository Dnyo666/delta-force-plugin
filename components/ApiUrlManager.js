import Config from './Config.js'

/**
 * API URL 管理器
 * 负责管理多个后端地址，支持故障转移和模式切换
 */
class ApiUrlManager {
  constructor() {
    // 三个后端地址
    this.urls = {
      default: 'https://df-api.shallow.ink',
      eo: 'https://df-api-eo.shallow.ink',
      esa: 'https://df-api-esa.shallow.ink'
    }
    
    // auto 模式下的地址列表（用于故障转移）
    this.autoUrls = [
      this.urls.default,
      this.urls.eo,
      this.urls.esa
    ]
    
    // 当前使用的地址索引（仅用于 auto 模式）
    this.currentIndex = 0
    
    // 当前模式（从配置读取）
    this.mode = null
    
    // 失败的地址记录（用于故障转移）
    this.failedUrls = new Set()
    
    // 地址失败时间戳（用于自动恢复）
    this.urlFailureTime = new Map()
    
    // 失败地址的恢复时间（5分钟）
    this.failureRecoveryTime = 5 * 60 * 1000
  }

  /**
   * 获取当前配置的模式
   * @returns {string} 'auto' | 'default' | 'eo' | 'esa'
   */
  getMode() {
    if (this.mode === null) {
      const cfg = Config.getConfig()?.delta_force || {}
      this.mode = cfg.api_mode || 'auto'
    }
    return this.mode
  }

  /**
   * 设置模式（用于测试或动态切换）
   * @param {string} mode - 'auto' | 'default' | 'eo' | 'esa'
   */
  setMode(mode) {
    if (['auto', 'default', 'eo', 'esa'].includes(mode)) {
      this.mode = mode
      // 切换模式时重置失败记录
      this.failedUrls.clear()
      this.urlFailureTime.clear()
      this.currentIndex = 0
    } else {
      logger.warn(`[ApiUrlManager] 无效的模式: ${mode}，使用默认 auto`)
      this.mode = 'auto'
    }
  }

  /**
   * 获取当前应该使用的 API 地址
   * @returns {string} API 基础地址
   */
  getBaseUrl() {
    const mode = this.getMode()
    
    switch (mode) {
      case 'default':
        return this.urls.default
      
      case 'eo':
        return this.urls.eo
      
      case 'esa':
        return this.urls.esa
      
      case 'auto':
      default:
        return this.getAutoUrl()
    }
  }

  /**
   * 获取 auto 模式下的地址（带故障转移）
   * @returns {string} API 基础地址
   */
  getAutoUrl() {
    // 清理过期的失败记录
    this.cleanExpiredFailures()
    
    // 获取所有可用的地址
    const availableUrls = this.autoUrls.filter(url => !this.failedUrls.has(url))
    
    // 如果没有可用地址，重置所有失败记录（可能所有地址都恢复了）
    if (availableUrls.length === 0) {
      logger.warn('[ApiUrlManager] 所有地址都标记为失败，重置失败记录')
      this.failedUrls.clear()
      this.urlFailureTime.clear()
      return this.autoUrls[this.currentIndex % this.autoUrls.length]
    }
    
    // 如果有可用地址，使用轮询方式选择
    // 找到当前索引对应的可用地址
    let found = false
    let attempts = 0
    let url = null
    
    while (!found && attempts < this.autoUrls.length) {
      const index = (this.currentIndex + attempts) % this.autoUrls.length
      url = this.autoUrls[index]
      
      if (!this.failedUrls.has(url)) {
        this.currentIndex = index
        found = true
      } else {
        attempts++
      }
    }
    
    // 如果找到了可用地址，返回它
    if (found && url) {
      return url
    }
    
    // 如果没找到（理论上不应该发生），返回第一个可用地址
    return availableUrls[0]
  }

  /**
   * 标记地址为失败（用于故障转移）
   * @param {string} url - 失败的地址
   */
  markUrlFailed(url) {
    this.failedUrls.add(url)
    this.urlFailureTime.set(url, Date.now())
    logger.warn(`[ApiUrlManager] 标记地址为失败: ${url}`)
    
    // 如果当前使用的是这个地址，切换到下一个
    const currentUrl = this.getBaseUrl()
    if (currentUrl === url && this.getMode() === 'auto') {
      logger.info('[ApiUrlManager] 当前地址失败，切换到下一个可用地址')
      this.switchToNextUrl()
    }
  }

  /**
   * 切换到下一个可用地址（仅用于 auto 模式）
   */
  switchToNextUrl() {
    if (this.getMode() !== 'auto') {
      return
    }
    
    this.currentIndex = (this.currentIndex + 1) % this.autoUrls.length
    logger.info(`[ApiUrlManager] 切换到地址索引: ${this.currentIndex}`)
  }

  /**
   * 清理过期的失败记录（超过恢复时间的地址重新可用）
   */
  cleanExpiredFailures() {
    const now = Date.now()
    for (const [url, failureTime] of this.urlFailureTime.entries()) {
      if (now - failureTime > this.failureRecoveryTime) {
        this.failedUrls.delete(url)
        this.urlFailureTime.delete(url)
        logger.info(`[ApiUrlManager] 地址恢复可用: ${url}`)
      }
    }
  }

  /**
   * 重置所有失败记录（用于手动恢复）
   */
  resetFailures() {
    this.failedUrls.clear()
    this.urlFailureTime.clear()
    this.currentIndex = 0
    logger.info('[ApiUrlManager] 已重置所有失败记录')
  }

  /**
   * 获取当前状态信息（用于调试）
   * @returns {object} 状态信息
   */
  getStatus() {
    return {
      mode: this.getMode(),
      currentUrl: this.getBaseUrl(),
      currentIndex: this.currentIndex,
      failedUrls: Array.from(this.failedUrls),
      urlFailureTime: Object.fromEntries(this.urlFailureTime)
    }
  }
}

// 创建全局单例
let apiUrlManager = null

/**
 * 获取 API URL 管理器实例（单例）
 * @returns {ApiUrlManager}
 */
export function getApiUrlManager() {
  if (!apiUrlManager) {
    apiUrlManager = new ApiUrlManager()
  }
  return apiUrlManager
}

export default ApiUrlManager

