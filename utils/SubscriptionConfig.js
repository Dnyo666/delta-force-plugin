import fs from 'fs'
import path from 'path'
import YAML from 'yaml'
import { pluginRoot } from '../model/path.js'

/**
 * 订阅推送配置管理器
 * 管理战绩订阅的推送配置
 */
class SubscriptionConfigManager {
  constructor() {
    // 用户数据存放在 config/config/ 目录（运行时生成）
    this.configDir = path.join(pluginRoot, 'config', 'config')
    this.configFile = path.join(this.configDir, 'subscription_push.yaml')
    this.config = null
    
    // 确保目录存在
    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir, { recursive: true })
    }
    
    // 迁移旧配置文件（从 config/ 到 config/config/）
    this.migrateOldConfig()
    
    this.loadConfig()
  }
  
  /**
   * 迁移旧配置文件到新位置
   */
  migrateOldConfig() {
    const oldConfigFile = path.join(pluginRoot, 'config', 'subscription_push.yaml')
    
    // 如果旧文件存在且新文件不存在，执行迁移
    if (fs.existsSync(oldConfigFile) && !fs.existsSync(this.configFile)) {
      try {
        fs.renameSync(oldConfigFile, this.configFile)
        logger.info('[订阅配置] 已将订阅配置迁移到 config/config/ 目录')
      } catch (error) {
        logger.error('[订阅配置] 迁移配置文件失败:', error)
        // 迁移失败时尝试复制
        try {
          fs.copyFileSync(oldConfigFile, this.configFile)
          fs.unlinkSync(oldConfigFile)
          logger.info('[订阅配置] 已将订阅配置复制到 config/config/ 目录')
        } catch (copyError) {
          logger.error('[订阅配置] 复制配置文件也失败:', copyError)
        }
      }
    }
  }

  /**
   * 加载配置文件
   */
  loadConfig() {
    try {
      if (fs.existsSync(this.configFile)) {
        const content = fs.readFileSync(this.configFile, 'utf-8')
        this.config = YAML.parse(content) || {}
      } else {
        this.config = {}
        this.saveConfig()
      }
      
      // 确保结构存在
      if (!this.config.record_push) {
        this.config.record_push = {}
      }
    } catch (error) {
      logger.error('[订阅配置] 加载配置失败:', error)
      this.config = { record_push: {} }
    }
  }

  /**
   * 保存配置文件
   */
  saveConfig() {
    try {
      const yamlContent = YAML.stringify(this.config)
      fs.writeFileSync(this.configFile, yamlContent, 'utf-8')
      return true
    } catch (error) {
      logger.error('[订阅配置] 保存配置失败:', error)
      return false
    }
  }

  /**
   * 获取用户的推送配置
   * @param {string} platformID - 用户QQ号
   * @returns {Object} { groups: [], private: boolean, filters: [] }
   */
  getUserPushConfig(platformID) {
    const userConfig = this.config.record_push[platformID]
    if (!userConfig) {
      return {
        groups: [],
        private: false,
        filters: []
      }
    }
    return {
      groups: userConfig.groups || [],
      private: userConfig.private || false,
      filters: userConfig.filters || []
    }
  }

  /**
   * 设置用户推送到群
   * @param {string} platformID - 用户QQ号
   * @param {string} groupId - 群号
   * @param {Array<string>} filters - 筛选条件
   */
  setGroupPush(platformID, groupId, filters = []) {
    if (!this.config.record_push[platformID]) {
      this.config.record_push[platformID] = {
        groups: [],
        private: false,
        filters: []
      }
    }

    const userConfig = this.config.record_push[platformID]
    
    // 移除旧的群配置（如果存在）
    userConfig.groups = userConfig.groups.filter(g => g.groupId !== groupId)
    
    // 添加新的群配置
    userConfig.groups.push({
      groupId: groupId,
      filters: filters,
      enabledAt: Date.now()
    })

    return this.saveConfig()
  }

  /**
   * 移除群推送
   * @param {string} platformID - 用户QQ号
   * @param {string} groupId - 群号
   */
  removeGroupPush(platformID, groupId) {
    if (!this.config.record_push[platformID]) {
      return true
    }

    const userConfig = this.config.record_push[platformID]
    userConfig.groups = userConfig.groups.filter(g => g.groupId !== groupId)

    // 如果没有任何推送配置，删除用户配置
    if (userConfig.groups.length === 0 && !userConfig.private) {
      delete this.config.record_push[platformID]
    }

    return this.saveConfig()
  }

  /**
   * 设置私信推送
   * @param {string} platformID - 用户QQ号
   * @param {boolean} enabled - 是否启用
   * @param {Array<string>} filters - 筛选条件
   */
  setPrivatePush(platformID, enabled, filters = []) {
    if (!this.config.record_push[platformID]) {
      this.config.record_push[platformID] = {
        groups: [],
        private: false,
        filters: []
      }
    }

    const userConfig = this.config.record_push[platformID]
    userConfig.private = enabled
    
    if (enabled && filters.length > 0) {
      userConfig.filters = filters
    }

    // 如果没有任何推送配置，删除用户配置
    if (!enabled && userConfig.groups.length === 0) {
      delete this.config.record_push[platformID]
    }

    return this.saveConfig()
  }

  /**
   * 获取所有订阅用户的推送配置
   * @returns {Object}
   */
  getAllPushConfigs() {
    return this.config.record_push || {}
  }

  /**
   * 清除用户的所有推送配置
   * @param {string} platformID - 用户QQ号
   */
  clearUserConfig(platformID) {
    delete this.config.record_push[platformID]
    return this.saveConfig()
  }
}

// 创建单例
let configManager = null

/**
 * 获取订阅配置管理器实例
 * @returns {SubscriptionConfigManager}
 */
export function getSubscriptionConfig() {
  if (!configManager) {
    configManager = new SubscriptionConfigManager()
  }
  return configManager
}

export default SubscriptionConfigManager
