import fs from 'node:fs'
import path from 'node:path'
import YAML from 'yaml'
import { pluginRoot } from '../model/path.js'

class HelpConfig {
  constructor() {
    this.helpDir = path.join(pluginRoot, 'config', 'help')
    this.helpYamlPath = path.join(pluginRoot, 'config', 'help.yaml') // 保留兼容性
    
    this.cache = {
      helpCfg: {},
      entertainmentHelpCfg: {},
      calculatorHelpCfg: {},
      calculatorMappingCfg: {},
      helpList: [],
      entertainmentHelpList: [],
      calculatorHelpList: [],
      lastModified: null
    }
    
    // 初始化时加载一次
    this.loadConfigSync()
    
    // 监听文件变化
    this.watchFile()
  }

  /**
   * 同步加载配置
   * 从 help 文件夹下的多个 YAML 文件加载配置
   */
  loadConfigSync() {
    try {
      let maxMtimeMs = 0
      const mergedData = {}
      
      // 优先从 help 文件夹加载
      if (fs.existsSync(this.helpDir)) {
        const files = fs.readdirSync(this.helpDir)
        const yamlFiles = files.filter(f => f.endsWith('.yaml') || f.endsWith('.yml'))
        
        if (yamlFiles.length > 0) {
          for (const file of yamlFiles) {
            const filePath = path.join(this.helpDir, file)
            const stats = fs.statSync(filePath)
            maxMtimeMs = Math.max(maxMtimeMs, stats.mtimeMs)
            
            try {
              const fileContent = fs.readFileSync(filePath, 'utf-8')
              const yamlData = YAML.parse(fileContent)
              
              if (yamlData) {
                // 合并数据
                Object.assign(mergedData, yamlData)
              }
            } catch (fileError) {
              logger.warn(`[DELTA FORCE PLUGIN] 加载帮助配置文件失败: ${file} - ${fileError.message}`)
            }
          }
        }
      }
      
      // 兼容旧格式：如果 help 文件夹不存在或为空，尝试加载 help.yaml
      if (Object.keys(mergedData).length === 0 && fs.existsSync(this.helpYamlPath)) {
        const stats = fs.statSync(this.helpYamlPath)
        maxMtimeMs = Math.max(maxMtimeMs, stats.mtimeMs)
        
        const fileContent = fs.readFileSync(this.helpYamlPath, 'utf-8')
        const yamlData = YAML.parse(fileContent)
        
        if (yamlData) {
          Object.assign(mergedData, yamlData)
        }
      }
      
      // 检查文件是否真的改变了
      if (this.cache.lastModified && maxMtimeMs <= this.cache.lastModified && maxMtimeMs > 0) {
        return this.cache
      }
      
      if (Object.keys(mergedData).length > 0) {
        // 更新缓存
        this.cache = {
          helpCfg: mergedData.helpCfg || this.cache.helpCfg,
          entertainmentHelpCfg: mergedData.entertainmentHelpCfg || this.cache.entertainmentHelpCfg,
          calculatorHelpCfg: mergedData.calculatorHelpCfg || this.cache.calculatorHelpCfg,
          calculatorMappingCfg: mergedData.calculatorMappingCfg || this.cache.calculatorMappingCfg,
          helpList: mergedData.helpList || this.cache.helpList,
          entertainmentHelpList: mergedData.entertainmentHelpList || this.cache.entertainmentHelpList,
          calculatorHelpList: mergedData.calculatorHelpList || this.cache.calculatorHelpList,
          lastModified: maxMtimeMs || Date.now()
        }
        
        logger.info('[DELTA FORCE PLUGIN] 帮助配置已重新加载')
        return this.cache
      } else {
        logger.warn(`[DELTA FORCE PLUGIN] 未找到帮助配置文件，使用缓存的配置`)
      }
      
    } catch (error) {
      logger.error(`[DELTA FORCE PLUGIN] 加载帮助配置失败: ${error.message}`)
      logger.warn(`[DELTA FORCE PLUGIN] 使用缓存的配置`)
      // 如果加载失败，保持原有缓存
    }
    
    return this.cache
  }


  /**
   * 获取帮助配置（每次调用时尝试重新加载）
   */
  getHelpCfg() {
    return (this.loadConfigSync().helpCfg || {})
  }

  /**
   * 获取娱乐帮助配置（每次调用时尝试重新加载）
   */
  getEntertainmentHelpCfg() {
    return (this.loadConfigSync().entertainmentHelpCfg || {})
  }

  /**
   * 获取帮助列表（每次调用时尝试重新加载）
   */
  getHelpList() {
    return (this.loadConfigSync().helpList || [])
  }

  /**
   * 获取娱乐帮助列表（每次调用时尝试重新加载）
   */
  getEntertainmentHelpList() {
    return (this.loadConfigSync().entertainmentHelpList || [])
  }

  /**
   * 获取计算器帮助配置（每次调用时尝试重新加载）
   */
  getCalculatorHelpCfg() {
    return (this.loadConfigSync().calculatorHelpCfg || {})
  }

  /**
   * 获取计算器映射表配置（每次调用时尝试重新加载）
   */
  getCalculatorMappingCfg() {
    return (this.loadConfigSync().calculatorMappingCfg || {})
  }

  /**
   * 获取计算器帮助列表（每次调用时尝试重新加载）
   */
  getCalculatorHelpList() {
    return (this.loadConfigSync().calculatorHelpList || [])
  }

  /**
   * 监听文件变化
   */
  watchFile() {
    // 监听 help 文件夹
    if (fs.existsSync(this.helpDir)) {
      fs.watch(this.helpDir, { recursive: false }, (eventType, filename) => {
        if (filename && (filename.endsWith('.yaml') || filename.endsWith('.yml'))) {
          logger.debug(`[DELTA FORCE PLUGIN] help 文件夹中的文件变动: ${filename}，重新加载`)
          this.loadConfigSync()
        }
      })
      logger.info('[DELTA FORCE PLUGIN] 已启用 help 文件夹监听，修改文件后会自动重新加载')
    }
    
    // 兼容旧格式：监听 help.yaml
    if (fs.existsSync(this.helpYamlPath)) {
      fs.watchFile(this.helpYamlPath, { interval: 1000 }, (curr, prev) => {
        if (curr.mtimeMs !== prev.mtimeMs) {
          logger.debug(`[DELTA FORCE PLUGIN] help.yaml 文件变动，重新加载`)
          this.loadConfigSync()
        }
      })
      logger.info('[DELTA FORCE PLUGIN] 已启用 help.yaml 文件监听，修改文件后会自动重新加载')
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
    // 注意：fs.watch 返回的 watcher 对象需要保存才能 unwatch，这里简化处理
  }
}

export default new HelpConfig()
