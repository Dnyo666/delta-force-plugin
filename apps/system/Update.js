import fs from 'node:fs'
import path from 'node:path'
import { pluginName, pluginRoot } from "../../model/path.js"
import { update as UpdatePlugin } from '../../../other/update.js'
import Render from '../../components/Render.js'

export class Update extends plugin {
  constructor() {
    super({
      name: '三角洲-更新插件',
      event: 'message',
      priority: 1009,
      rule: [
        {
          reg: '^(#三角洲|\\^)((插件)?(强制)?更新|update)$',
          fnc: 'update',
          permission: 'master'
        },
        {
          reg: '^(#三角洲|\\^)((插件)?更新日志|update_log)$',
          fnc: 'update_log'
        }
      ]
    })
  }

  async update(e) {
    if (e.at && !e.atme) return
    e.msg = `#${e.msg.includes('强制') ? '强制' : ''}更新${pluginName}`
    const up = new UpdatePlugin(e)
    up.e = e
    return up.update()
  }

  /**
   * 解析 CHANGELOG.md 文件
   * @returns {Array} 解析后的更新日志数据
   */
  parseChangelog() {
    const changelogPath = path.join(pluginRoot, 'CHANGELOG.md')
    
    try {
      if (!fs.existsSync(changelogPath)) {
        logger.warn(`[DELTA FORCE PLUGIN] CHANGELOG.md 文件不存在: ${changelogPath}`)
        return []
      }

      const content = fs.readFileSync(changelogPath, 'utf-8')
      const lines = content.split('\n')
      
      const changelogs = []
      let currentVersion = null
      let currentLogs = []
      let currentCategory = null
      let currentItems = []
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        
        // 匹配版本号：## [版本号] - 标题
        const versionMatch = line.match(/^##\s+\[([^\]]+)\]\s*-\s*(.+)$/)
        if (versionMatch) {
          // 保存上一个版本的数据
          if (currentVersion) {
            if (currentCategory && currentItems.length > 0) {
              currentLogs.push({
                title: currentCategory,
                logs: currentItems
              })
            }
            if (currentLogs.length > 0) {
              changelogs.push({
                version: currentVersion,
                logs: currentLogs
              })
            }
          }
          
          // 开始新版本
          currentVersion = versionMatch[1]
          currentLogs = []
          currentCategory = null
          currentItems = []
          continue
        }
        
        // 匹配分类：### 分类名
        const categoryMatch = line.match(/^###\s+(.+)$/)
        if (categoryMatch) {
          // 保存上一个分类的数据
          if (currentCategory && currentItems.length > 0) {
            currentLogs.push({
              title: currentCategory,
              logs: currentItems
            })
          }
          
          // 开始新分类
          currentCategory = categoryMatch[1]
          currentItems = []
          continue
        }
        
        // 匹配列表项：- 内容
        const itemMatch = line.match(/^-\s+(.+)$/)
        if (itemMatch && currentCategory) {
          currentItems.push(itemMatch[1])
          continue
        }
        
        // 如果遇到分隔线或说明部分，停止解析
        if (line === '---' || line.startsWith('## 版本说明') || line.startsWith('## 更新类型说明')) {
          break
        }
      }
      
      // 保存最后一个版本的数据
      if (currentVersion) {
        if (currentCategory && currentItems.length > 0) {
          currentLogs.push({
            title: currentCategory,
            logs: currentItems
          })
        }
        if (currentLogs.length > 0) {
          changelogs.push({
            version: currentVersion,
            logs: currentLogs
          })
        }
      }
      
      return changelogs
    } catch (error) {
      logger.error(`[DELTA FORCE PLUGIN] 解析 CHANGELOG.md 失败: ${error.message}`)
      return []
    }
  }

  async update_log(e) {
    const changelogs = this.parseChangelog()
    
    if (changelogs.length === 0) {
      // 如果解析失败，回退到原来的方式
      const UpdateLog = new UpdatePlugin()
      UpdateLog.e = e
      UpdateLog.reply = this.reply

      if (UpdateLog.getPlugin(pluginName)) {
        e.reply(await UpdateLog.getLog(pluginName))
      }
      return true
    }

    // 使用 version-info 模板渲染
    return await Render.render('help/version-info.html', {
      name: pluginName,
      changelogs: changelogs
    }, {
      e: e,
      scale: 1.0
    })
  }
}
