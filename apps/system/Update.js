import { pluginName } from "../../model/path.js"
import { update as UpdatePlugin } from '../../../other/update.js'

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

  async update_log() {
    const UpdateLog = new UpdatePlugin()
    UpdateLog.e = this.e
    UpdateLog.reply = this.reply

    if (UpdateLog.getPlugin(pluginName)) {
      this.e.reply(await UpdateLog.getLog(pluginName))
    }
    return true
  }
}
