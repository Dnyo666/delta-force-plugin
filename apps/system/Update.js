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

  async update(e = this.e) {
    if (e.at && !e.atme) return
    if (!e.isMaster || !UpdatePlugin) return false
    e.msg = `#${e.msg.includes('强制') ? '强制' : ''}更新${pluginName}`
    const up = new UpdatePlugin()
    up.e = e
    return up.update()
  }

  parseChangelog() {
    const changelogPath = path.join(pluginRoot, 'CHANGELOG.md')
    
    try {
      if (!fs.existsSync(changelogPath)) {
        logger.warn(`[DELTA FORCE PLUGIN] CHANGELOG.md 文件不存在: ${changelogPath}`)
        return []
      }

      const lines = fs.readFileSync(changelogPath, 'utf-8').split('\n')
      const changelogs = []
      let currentVersion = null
      let currentLogs = []
      let currentCategory = null
      let currentItems = []
      
      const saveCurrentVersion = () => {
        if (currentVersion && currentCategory && currentItems.length > 0) {
          currentLogs.push({ title: currentCategory, logs: currentItems })
        }
        if (currentVersion && currentLogs.length > 0) {
          changelogs.push({ version: currentVersion, logs: currentLogs })
        }
      }
      
      for (const line of lines) {
        const trimmed = line.trim()
        
        const versionMatch = trimmed.match(/^##\s+\[([^\]]+)\]\s*-\s*(.+)$/)
        if (versionMatch) {
          saveCurrentVersion()
          currentVersion = versionMatch[1]
          currentLogs = []
          currentCategory = null
          currentItems = []
          continue
        }
        
        const categoryMatch = trimmed.match(/^###\s+(.+)$/)
        if (categoryMatch) {
          if (currentCategory && currentItems.length > 0) {
            currentLogs.push({ title: currentCategory, logs: currentItems })
          }
          currentCategory = categoryMatch[1]
          currentItems = []
          continue
        }
        
        const itemMatch = trimmed.match(/^-\s+(.+)$/)
        if (itemMatch && currentCategory) {
          currentItems.push(itemMatch[1])
          continue
        }
        
        if (trimmed === '---' || trimmed.startsWith('## 版本说明') || trimmed.startsWith('## 更新类型说明')) {
          break
        }
      }
      
      saveCurrentVersion()
      return changelogs
    } catch (error) {
      logger.error(`[DELTA FORCE PLUGIN] 解析 CHANGELOG.md 失败: ${error.message}`)
      return []
    }
  }

  async update_log(e) {
    const changelogs = this.parseChangelog()
    
    if (changelogs.length === 0) {
      const UpdateLog = new UpdatePlugin()
      UpdateLog.e = e
      UpdateLog.reply = this.reply
      if (UpdateLog.getPlugin(pluginName)) {
        e.reply(await UpdateLog.getLog(pluginName))
      }
      return true
    }

    return await Render.render('help/version-info.html', {
      name: pluginName,
      changelogs: changelogs.slice(0, 2)
    }, {
      e: e,
      scale: 1.0
    })
  }
}
