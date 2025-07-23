import plugin from '../../../lib/plugins/plugin.js'
import { segment } from 'oicq'
import fs from 'fs'
import path from 'path'
import Code from '../components/Code.js'
import Config from '../components/Config.js'
import { pluginRoot } from '../model/path.js'

export class Login extends plugin {
  constructor (e) {
    super({
      name: '三角洲登录',
      dsc: '通过扫码登录获取 frameworkToken',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)(qq|微信|wx|wegame|qqsafe)?(登陆|登录)$',
          fnc: 'login'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
  }

  async login () {
    const match = this.e.msg.match(/^(#三角洲|\^)(qq|微信|wx|wegame|qqsafe)?(登陆|登录)/)
    let platform = match[2] || 'qq'
    
    if (platform === 'wx' || platform === '微信') platform = 'wechat'
    
    // QQ安全中心在API中的标识是 qqsafe
    if (this.e.msg.includes('安全中心')) platform = 'qqsafe'

    this.e.reply(`正在获取【${platform.toUpperCase()}】登录二维码，请稍候...`)

    const res = await this.api.getLoginQr(platform)

    if (!res || (!res.qr_image && !res.frameworkToken)) {
      this.e.reply('获取二维码失败，请稍后重试。')
      return true
    }
    
    // 根据您的提示，只有微信是URL，其他都按base64处理
    let qrImage = res.qr_image
    if (platform !== 'wechat') {
        // 大部分框架支持直接发送 base64，不再写入文件
        qrImage = `base64://${qrImage.replace(/^data:image\/png;base64,/, '')}`
    }

    const tipMsg = `请使用【${platform.toUpperCase()}】扫描二维码登录，有效期约2分钟。`
    await this.e.reply([tipMsg, segment.image(qrImage)])

    this.pollLoginStatus(platform, res.token || res.frameworkToken)
  }

  async pollLoginStatus (platform, frameworkToken) {
    const startTime = Date.now()
    const interval = setInterval(async () => {
      if (Date.now() - startTime > 2 * 60 * 1000) {
        clearInterval(interval)
        this.e.reply('登录已超时，请重新发送登录指令。')
        return
      }

      const statusRes = await this.api.getLoginStatus(platform, frameworkToken)

      if (statusRes && statusRes.status === 'success') {
        clearInterval(interval)
        // 自动绑定
        const clientID = (Config.getConfig().delta_force || {}).clientID
        const bindRes = await this.api.bindUser({
          frameworkToken: statusRes.frameworkToken,
          platformID: this.e.user_id,
          clientID: clientID,
          clientType: 'qq' // 假设都通过QQ机器人绑定
        })
        
        if (bindRes && (bindRes.code === 0 || bindRes.success)) {
          let userData = Config.getUserData(this.e.user_id) || []
          // 防止重复添加
          if (!userData.some(acc => acc.token === statusRes.frameworkToken)) {
            userData.push({ token: statusRes.frameworkToken, platform, bindTime: new Date().toLocaleString() })
            Config.setUserData(this.e.user_id, userData)
          }
          this.e.reply(`QQ：${statusRes.qq || '未知'} 登录成功，并已为您自动绑定账号！\n可通过 #三角洲账号 查看。`)
        } else {
          this.e.reply(`登录成功，但自动绑定失败: ${bindRes.msg || '未知错误'}`)
        }
      } else if (statusRes && statusRes.status === 'scanned') {
          // 可选：提示用户已扫码
      } else if (!statusRes) {
        // API 请求失败或返回格式不正确
        clearInterval(interval);
        this.e.reply('登录状态查询失败，已停止轮询。请检查网络或联系管理员。');
      }
    }, 3000)
  }
} 