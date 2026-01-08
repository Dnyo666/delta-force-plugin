import fs from 'node:fs'
import path from 'node:path'
import { exec } from 'child_process'
import { pluginName, pluginRoot } from "../../model/path.js"
import { update as UpdatePlugin } from '../../../other/update.js'
import Render from '../../components/Render.js'
import Config from '../../components/Config.js'
import config from '../../../../lib/config/config.js'

const mdLogLineToHTML = (line) => {
  line = line.replace(/(^\s*\*|\r)/g, '')
  line = line.replace(/\s*`([^`]+`)/g, '<span class="cmd">$1')
  line = line.replace(/`\s*/g, '</span>')
  line = line.replace(/\s*\*\*([^\*]+\*\*)/g, '<span class="strong">$1')
  line = line.replace(/\*\*\s*/g, '</span>')
  return line.trim()
}

let BaseUpdate = null
try {
  BaseUpdate = (await import('../../../other/update.js').catch(e => null))?.update
  BaseUpdate ||= (await import('../../../system/apps/update.ts').catch(e => null))?.update
} catch (e) {
  logger.error(`[${pluginName}]未获取到更新js ${logger.yellow('更新功能')} 将无法使用`)
}

let DeltaForceUpdate = null

if (BaseUpdate) {
  DeltaForceUpdate = class DeltaForceUpdate extends BaseUpdate {
    exec(cmd, plugin, opts = {}) {
      if (plugin) opts.cwd = `plugins/${plugin}`
      return new Promise(resolve => {
        exec(cmd, { windowsHide: true, ...opts }, (error, stdout, stderr) => {
          resolve({ error, stdout: stdout.trim(), stderr })
        })
      })
    }

    async handleLog(remote = false) {
      if (remote) {
        await this.exec('git fetch origin main', pluginName)
      }
      const cmdStr = remote
        ? 'git log -100 --pretty="%h||%cd||%s" --date=format:"%Y-%m-%d %H:%M:%S" origin/main'
        : 'git log -100 --pretty="%h||%cd||%s" --date=format:"%Y-%m-%d %H:%M:%S"'
      const cm = await this.exec(cmdStr, pluginName)
      if (cm.error) {
        throw new Error(cm.error.message)
      }

      const logAll = cm.stdout.split('\n').filter(str => str.trim())
      if (!logAll.length) {
        throw new Error('未获取到更新日志')
      }

      const log = []
      let current = true
      for (let str of logAll) {
        const parts = str.split('||')
        if (parts[0] === this.oldCommitId) break
        if (parts[2]?.includes('Merge')) continue
        const commit = {
          commit: parts[0],
          date: parts[1],
          msg: mdLogLineToHTML(parts[2] || ''),
          local: !remote,
          current: !remote && current && (current = false)
        }
        log.push(commit)
      }
      return log
    }

    async getDeltaForceAllLog() {
      const [localLog, remoteLog] = await Promise.all([
        this.handleLog(false),
        this.handleLog(true).catch(() => [])
      ])
      const logs = [...localLog, ...remoteLog].filter((log, index, self) =>
        index === self.findIndex(l => l.commit === log.commit)
      )
      logs.sort((a, b) => new Date(b.date) - new Date(a.date))
      return logs
    }

    async hasUpdate() {
      const logs = await this.getDeltaForceAllLog()
      const newLogs = logs.filter(log => !log.local)
      return {
        hasUpdate: newLogs.length > 0,
        logs: newLogs
      }
    }
  }
}

const updateInfo = { lastCheckCommit: '' }

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
        },
        {
          reg: '^(#三角洲|\\^)(开启|关闭)更新推送$',
          fnc: 'toggleUpdatePush'
        }
      ]
    })
    
    const updateConfig = Config.get('delta_force', 'update') || {}
    this.task = {
      name: 'DELTA-FORCE-PLUGIN自动检测更新',
      cron: updateConfig.cron || '0 0/10 * * * ?',
      fnc: () => this.checkUpdateTask()
    }
  }

  async update(e = this.e) {
    if (e.at && !e.atme) return
    if (!e.isMaster || !DeltaForceUpdate) return false
    e.msg = `#${e.msg.includes('强制') ? '强制' : ''}更新${pluginName}`
    const up = new DeltaForceUpdate(e)
    up.e = e
    return up.update()
  }

  async checkUpdateTask() {
    const updateConfig = Config.get('delta_force', 'update') || {}
    if (!updateConfig.autoCheck || !DeltaForceUpdate) return
    
    try {
      const up = new DeltaForceUpdate()
      const result = await up.hasUpdate()
      if (!result.hasUpdate || result.logs[0].commit === updateInfo.lastCheckCommit) return
      
      const bot = global.Bot
      const botInfo = { nickname: 'DELTA-FORCE-PLUGIN更新', user_id: bot.uin }
      const msgs = [
        { message: [`[${pluginName}]有${result.logs.length || 1}个更新`], ...botInfo },
        ...result.logs.map(log => ({
          message: [`[${log.commit}|${log.date}]${log.msg}`],
          ...botInfo
        }))
      ]
      const msg = await bot.makeForwardMsg(msgs)
      try {
        ForMsg.data = ForMsg.data
          .replace(/\n/g, '')
          .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, '___')
          .replace(/___+/, `<title color="#777777" size="26">${pluginName}更新</title>`)
      } catch (err) {}
      
      for (const master of config.masterQQ) {
        if (master.toString() == 'stdin' || master.toString().length > 11) continue
        await Bot.pickFriend(master).sendMsg(msg)
        break
      }
      
      updateInfo.lastCheckCommit = result.logs[0].commit
    } catch (error) {
      logger.error(`[${pluginName}] 自动检查更新失败:`, error)
    }
  }

  async toggleUpdatePush(e) {
    if (!e.isMaster) return false
    
    const configData = Config.getConfig()
    if (!configData.delta_force) configData.delta_force = {}
    if (!configData.delta_force.update) configData.delta_force.update = {}
    configData.delta_force.update.autoCheck = e.msg.includes('开启')
    
    if (Config.setConfig(configData)) {
      await e.reply(`更新推送已${configData.delta_force.update.autoCheck ? '开启' : '关闭'}`)
    } else {
      await e.reply('配置更新失败')
    }
    return true
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
