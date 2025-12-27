import fs from 'node:fs'
import path from 'node:path'
import YAML from 'yaml'
import { pluginRoot } from '../model/path.js'

class StyleConfig {
  constructor() {
    this.imgsDir = path.join(pluginRoot, 'resources', 'help', 'imgs')
    
    // 默认配置
    this.defaultStyle = {
      fontColor: '#ceb78b',
      fontShadow: 'none',
      descColor: '#eee',
      fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
      titleFontSize: '50px',
      groupFontSize: '18px',
      commandFontSize: '16px',
      descFontSize: '13px',
      tableFontSize: '14px',
      contBgColor: 'rgba(6, 21, 31, .3)',
      contBgBlur: 3,
      headerBgColor: 'rgba(6, 21, 31, .4)',
      rowBgColor1: 'rgba(6, 21, 31, .2)',
      rowBgColor2: 'rgba(6, 21, 31, .35)'
    }
    
    // 缓存每个主题的配置
    this.cache = new Map()
    
    // 初始化默认主题
    this.loadConfigSync('default')
  }

  /**
   * 同步加载配置
   * 从 YAML 文件加载指定主题的配置
   * @param {string} theme - 主题名称，默认为 'default'
   */
  loadConfigSync(theme = 'default') {
    try {
      const themeDir = path.join(this.imgsDir, theme)
      const styleYamlPath = path.join(themeDir, 'config.yaml')
      
      // 如果主题目录不存在，使用 default
      if (!fs.existsSync(themeDir)) {
        if (theme !== 'default') {
          logger.warn(`[DELTA FORCE PLUGIN] 主题目录不存在: ${theme}，使用 default 主题`)
          theme = 'default'
          const defaultThemeDir = path.join(this.imgsDir, 'default')
          const defaultStyleYamlPath = path.join(defaultThemeDir, 'config.yaml')
          if (!fs.existsSync(defaultThemeDir)) {
            logger.warn(`[DELTA FORCE PLUGIN] default 主题目录也不存在`)
            return { style: { ...this.defaultStyle }, lastModified: null }
          }
          return this.loadConfigSync('default')
        }
        logger.warn(`[DELTA FORCE PLUGIN] default 主题目录不存在`)
        return { style: { ...this.defaultStyle }, lastModified: null }
      }
      
      // 检查文件是否真的改变了
      const cached = this.cache.get(theme)
      if (fs.existsSync(styleYamlPath)) {
        const stats = fs.statSync(styleYamlPath)
        if (cached && cached.lastModified && stats.mtimeMs <= cached.lastModified) {
          return cached
        }
        
        // 读取 YAML 文件内容
        const fileContent = fs.readFileSync(styleYamlPath, 'utf-8')
        
        // 使用 YAML 解析
        const yamlData = YAML.parse(fileContent)
        
        if (yamlData) {
          // 合并默认配置和YAML配置
          const styleConfig = {
            style: { ...this.defaultStyle, ...yamlData },
            lastModified: stats.mtimeMs,
            themeDir: theme
          }
          
          this.cache.set(theme, styleConfig)
          logger.info(`[DELTA FORCE PLUGIN] 主题 "${theme}" 样式配置已重新加载`)
          return styleConfig
        } else {
          logger.warn(`[DELTA FORCE PLUGIN] YAML 解析结果为空，使用缓存的配置`)
        }
      } else {
        // 如果 config.yaml 不存在，使用默认配置
        logger.debug(`[DELTA FORCE PLUGIN] ${theme} 主题的 config.yaml 不存在，使用默认配置`)
        const styleConfig = {
          style: { ...this.defaultStyle },
          lastModified: null,
          themeDir: theme
        }
        this.cache.set(theme, styleConfig)
        return styleConfig
      }
      
    } catch (error) {
      logger.error(`[DELTA FORCE PLUGIN] 加载主题 "${theme}" 样式配置失败: ${error.message}`)
      logger.warn(`[DELTA FORCE PLUGIN] 使用缓存的配置`)
    }
    
    // 返回缓存的配置或默认配置
    const cached = this.cache.get(theme)
    if (cached) {
      return cached
    }
    
    const defaultConfig = {
      style: { ...this.defaultStyle },
      lastModified: null,
      themeDir: theme
    }
    this.cache.set(theme, defaultConfig)
    return defaultConfig
  }

  /**
   * 异步重新加载配置（用于文件监听）
   * @param {string} theme - 主题名称
   */
  async reloadConfig(theme = 'default') {
    return this.loadConfigSync(theme)
  }

  /**
   * 获取样式配置（每次调用时尝试重新加载）
   * @param {string} theme - 主题名称，默认为 'default'
   * @returns {object} 样式配置对象
   */
  getStyle(theme = 'default') {
    const config = this.loadConfigSync(theme)
    return config.style || { ...this.defaultStyle }
  }

  /**
   * 获取主题目录路径（用于资源文件引用）
   * @param {string} theme - 主题名称，默认为 'default'
   * @returns {string} 主题目录的相对路径
   */
  getThemePath(theme = 'default') {
    const themeDir = path.join(this.imgsDir, theme)
    // 检查主题目录是否存在，不存在则使用 default
    if (!fs.existsSync(themeDir) && theme !== 'default') {
      return 'default'
    }
    return theme
  }
}

export default new StyleConfig()

