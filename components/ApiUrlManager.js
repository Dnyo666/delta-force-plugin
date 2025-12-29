import Config from './Config.js'

/**
 * API URL 管理器
 * 负责管理多个后端地址，支持故障转移和模式切换
 * 使用 Timeout 机制和 3 次重试逻辑
 */
class ApiUrlManager {
  constructor() {
    // 三个后端地址
    this.urls = {
      default: 'https://df-api.shallow.ink',
      eo: 'https://df-api-eo.shallow.ink',
      esa: 'https://df-api-esa.shallow.ink'
    }
    
    // 当前模式（从配置读取）
    this.mode = null
    
    // 失败的地址记录（用于过滤）
    this.failedUrls = new Set()
    
    // 默认请求超时时间（30秒）
    this.defaultTimeout = 30000
    
    // 默认重试次数
    this.defaultRetryCount = 3
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
    } else {
      logger.warn(`[ApiUrlManager] 无效的模式: ${mode}，使用默认 auto`)
      this.mode = 'auto'
    }
  }

  /**
   * 获取可用的地址列表（过滤掉失败的地址）
   * @returns {string[]} 可用地址列表
   */
  getAvailableUrls() {
    const mode = this.getMode()
    
    let urls = []
    if (mode === 'auto') {
      // 优先使用 eo 和 esa，default 作为备用
      urls = [this.urls.eo, this.urls.esa, this.urls.default]
    } else {
      // 非 auto 模式返回单个地址
      const url = this.urls[mode] || this.urls.default
      urls = [url]
    }
    
    return urls.filter(url => !this.failedUrls.has(url))
  }

  /**
   * 获取当前应该使用的 API 地址（向后兼容方法）
   * @returns {string} API 基础地址
   */
  getBaseUrl() {
    const availableUrls = this.getAvailableUrls()
    if (availableUrls.length > 0) {
      return availableUrls[0]
    }
    return this.urls.default
  }

  /**
   * 标记地址为失败
   * @param {string} url - 失败的地址
   */
  markUrlFailed(url) {
    this.failedUrls.add(url)
    logger.warn(`[ApiUrlManager] 标记地址为失败: ${url}`)
  }

  /**
   * 重置所有失败记录
   */
  resetFailures() {
    this.failedUrls.clear()
    logger.info('[ApiUrlManager] 已重置所有失败记录')
  }

  /**
   * 执行请求，自动处理重试和地址切换
   * @param {Function} requestFn - 请求函数，接收 baseUrl 作为参数，返回 Promise
   * @param {object} options - 选项
   * @param {number} options.timeout - 超时时间（毫秒），默认 30000
   * @param {number} options.retryCount - 每个地址的重试次数，默认 3
   * @returns {Promise<any>} 请求结果
   */
  async executeRequest(requestFn, options = {}) {
    const { timeout = this.defaultTimeout, retryCount = this.defaultRetryCount } = options
    
    // 获取可用地址列表
    let availableUrls = this.getAvailableUrls()
    
    // 如果没有可用地址，重置失败记录并重新获取
    if (availableUrls.length === 0) {
      logger.warn('[ApiUrlManager] 所有地址都标记为失败，重置失败记录')
      this.resetFailures()
      availableUrls = this.getAvailableUrls()
    }
    
    // 如果仍然没有可用地址，返回错误
    if (availableUrls.length === 0) {
      throw new Error('[ApiUrlManager] 没有可用的 API 地址')
    }
    
    // 循环遍历所有可用地址
    for (const baseUrl of availableUrls) {
      // 对当前地址重试指定次数
      for (let attempt = 1; attempt <= retryCount; attempt++) {
        try {
          // 使用 Timeout 包装请求
          const result = await Promise.race([
            requestFn(baseUrl),
            new Promise((_, reject) => {
              setTimeout(() => {
                reject(new Error(`请求超时 (${timeout}ms)`))
              }, timeout)
            })
          ])
          
          // 请求成功，直接返回结果
          logger.debug(`[ApiUrlManager] 请求成功: ${baseUrl}`)
          return result
        } catch (error) {
          const isLastAttempt = attempt === retryCount
          const errorMsg = error.message || String(error)
          
          if (isLastAttempt) {
            // 最后一次重试也失败，标记地址为失败
            logger.error(`[ApiUrlManager] 地址 ${baseUrl} 重试 ${retryCount} 次后仍然失败: ${errorMsg}`)
            this.markUrlFailed(baseUrl)
            
            // 如果是最后一个可用地址，抛出错误
            if (baseUrl === availableUrls[availableUrls.length - 1]) {
              throw new Error(`所有 API 地址都请求失败，最后一个地址 ${baseUrl} 错误: ${errorMsg}`)
            }
            
            // 否则继续下一个地址
            logger.info(`[ApiUrlManager] 切换到下一个可用地址`)
            break
          } else {
            // 不是最后一次重试，记录日志并继续重试
            logger.warn(`[ApiUrlManager] 地址 ${baseUrl} 第 ${attempt} 次请求失败: ${errorMsg}，将重试`)
          }
        }
      }
    }
  }

  /**
   * 获取当前状态信息（用于调试）
   * @returns {object} 状态信息
   */
  getStatus() {
    const mode = this.getMode()
    const availableUrls = this.getAvailableUrls()
    return {
      mode,
      currentUrl: availableUrls[0] || this.urls.default,
      availableUrls,
      failedUrls: Array.from(this.failedUrls),
      totalUrls: mode === 'auto' ? 3 : 1
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

