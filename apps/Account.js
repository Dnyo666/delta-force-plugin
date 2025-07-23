import plugin from '../../../lib/plugins/plugin.js'
import Code from '../components/Code.js'
import Config from '../components/Config.js'

export class Account extends plugin {
  constructor (e) {
    super({
      name: '三角洲账号管理',
      dsc: '手动绑定和管理账号 Token',
      event: 'message',
      priority: 101, // 优先级略低于Login
      rule: [
        {
          reg: '^(#三角洲|\\^)账号$',
          fnc: 'showAccounts'
        },
        {
          reg: '^(#三角洲|\\^)绑定\\s*([a-zA-Z0-9\\-]+)$',
          fnc: 'bindToken'
        },
        {
          reg: '^(#三角洲|\\^)解绑\\s*(\\d+)$',
          fnc: 'unbindToken'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
  }

  async bindToken () {
    const token = this.e.msg.match(/^(#三角洲|\^)绑定\s*([a-zA-Z0-9\-]+)$/)[2]
    this.e.reply('正在尝试绑定 Token...')

    const clientID = (Config.getConfig().delta_force || {}).clientID
    const res = await this.api.bindUser({
      frameworkToken: token,
      platformID: this.e.user_id,
      clientID: clientID,
      clientType: 'qq' // 假设都通过QQ机器人绑定
    })
    
    if (res && (res.code === 0 || res.success)) {
      let userData = Config.getUserData(this.e.user_id) || []
       // 防止重复添加
      if (!userData.some(acc => acc.token === token)) {
        userData.push({ token: token, platform: 'manual', bindTime: new Date().toLocaleString() })
        Config.setUserData(this.e.user_id, userData)
      }
      this.e.reply('账号手动绑定成功！')
    } else {
      this.e.reply(`绑定失败: ${res.msg || '未知错误'}`)
    }
  }

  async showAccounts () {
    const userData = Config.getUserData(this.e.user_id)
    if (!userData || !userData.length) {
      this.e.reply('您尚未绑定任何账号，请发送 #三角洲登录 进行绑定。')
      return true
    }
    
    let msg = '您已绑定的账号列表：\n'
    userData.forEach((account, index) => {
      let tokenPart = this.e.isGroup ? `${account.token.substring(0, 4)}****${account.token.slice(-4)}` : account.token
      msg += `${index + 1}. [${account.platform.toUpperCase()}] ${tokenPart}\n`
    })
    msg += '可通过 #三角洲解绑 <序号> 来解绑账号。'
    
    this.e.reply(msg)
  }

  async unbindToken () {
      const index = parseInt(this.e.msg.match(/\d+$/)[0]) - 1
      let userData = Config.getUserData(this.e.user_id)
      if (!userData || !userData[index]) {
          this.e.reply('序号无效，请发送 #三角洲账号 查看正确的序号。')
          return true
      }
      
      const tokenToUnbind = userData[index].token
      const clientID = (Config.getConfig().delta_force || {}).clientID

      const res = await this.api.unbindUser({
          frameworkToken: tokenToUnbind,
          platformID: this.e.user_id,
          clientID: clientID,
          clientType: 'qq'
      })

      if (res && (res.code === 0 || res.success)) {
          userData.splice(index, 1)
          Config.setUserData(this.e.user_id, userData)
          this.e.reply('解绑成功！')
      } else {
          this.e.reply(`解绑失败: ${res.msg || '未知错误'}`)
      }
  }
}