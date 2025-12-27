import fs from 'node:fs'
import path from 'node:path'
import YAML from 'yaml'
import { pluginRoot } from '../model/path.js'

class HelpConfig {
  constructor() {
    this.helpYamlPath = path.join(pluginRoot, 'config', 'help.yaml')
    
    this.cache = {
      helpCfg: {},
      entertainmentHelpCfg: {},
      helpList: [],
      entertainmentHelpList: [],
      lastModified: null
    }
    
    // 初始化时加载一次
    this.loadConfigSync()
    
    // 监听文件变化
    this.watchFile()
  }

  /**
   * 同步加载配置
   * 从 YAML 文件加载配置
   */
  loadConfigSync() {
    try {
      if (!fs.existsSync(this.helpYamlPath)) {
        logger.warn(`[DELTA FORCE PLUGIN] help.yaml 文件不存在: ${this.helpYamlPath}`)
        return this.cache
      }
      
      const stats = fs.statSync(this.helpYamlPath)
      
      // 检查文件是否真的改变了
      if (this.cache.lastModified && stats.mtimeMs <= this.cache.lastModified) {
        return this.cache
      }

      // 读取 YAML 文件内容
      const fileContent = fs.readFileSync(this.helpYamlPath, 'utf-8')
      
      // 使用 YAML 解析
      const yamlData = YAML.parse(fileContent)
      
      if (yamlData) {
        // 更新缓存
        this.cache = {
          helpCfg: yamlData.helpCfg || this.cache.helpCfg,
          entertainmentHelpCfg: yamlData.entertainmentHelpCfg || this.cache.entertainmentHelpCfg,
          helpList: yamlData.helpList || this.cache.helpList,
          entertainmentHelpList: yamlData.entertainmentHelpList || this.cache.entertainmentHelpList,
          lastModified: stats.mtimeMs
        }
        
        logger.info('[DELTA FORCE PLUGIN] 帮助配置已重新加载')
        return this.cache
      } else {
        logger.warn(`[DELTA FORCE PLUGIN] YAML 解析结果为空，使用缓存的配置`)
      }
      
    } catch (error) {
      logger.error(`[DELTA FORCE PLUGIN] 加载帮助配置失败: ${error.message}`)
      logger.warn(`[DELTA FORCE PLUGIN] 使用缓存的配置`)
      // 如果加载失败，保持原有缓存
    }
    
    return this.cache
  }

  /**
   * 异步重新加载配置（用于文件监听）
   */
  async reloadConfig() {
    return this.loadConfigSync()
  }

  /**
   * 获取帮助配置（每次调用时尝试重新加载）
   */
  getHelpCfg() {
    this.loadConfigSync()
    return this.cache.helpCfg || {}
  }

  /**
   * 获取娱乐帮助配置（每次调用时尝试重新加载）
   */
  getEntertainmentHelpCfg() {
    this.loadConfigSync()
    return this.cache.entertainmentHelpCfg || {}
  }

  /**
   * 获取帮助列表（每次调用时尝试重新加载）
   */
  getHelpList() {
    this.loadConfigSync()
    return this.cache.helpList || []
  }

  /**
   * 获取娱乐帮助列表（每次调用时尝试重新加载）
   */
  getEntertainmentHelpList() {
    this.loadConfigSync()
    return this.cache.entertainmentHelpList || []
  }

  /**
   * 监听文件变化
   */
  watchFile() {
    if (fs.existsSync(this.helpYamlPath)) {
      fs.watchFile(this.helpYamlPath, { interval: 1000 }, async (curr, prev) => {
        if (curr.mtimeMs !== prev.mtimeMs) {
          logger.debug(`[DELTA FORCE PLUGIN] help.yaml 文件变动，重新加载`)
          await this.reloadConfig()
        }
      })
      logger.info('[DELTA FORCE PLUGIN] 已启用 help.yaml 文件监听，修改文件后会自动重新加载')
    } else {
      logger.warn(`[DELTA FORCE PLUGIN] help.yaml 文件不存在`)
    }
  }

  /**
   * 停止监听文件
   */
  unwatchFile() {
    if (fs.existsSync(this.helpYamlPath)) {
      fs.unwatchFile(this.helpYamlPath)
      logger.info('[DELTA FORCE PLUGIN] 已停止监听 help.yaml 文件')
    }
  }
}

export default new HelpConfig()
