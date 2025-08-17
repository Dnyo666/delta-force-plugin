import Code from '../components/Code.js'
import Config from '../components/Config.js'
import utils from '../utils/utils.js'

export class Stats extends plugin {
  constructor(e) {
    super({
      name: '三角洲用户统计',
      dsc: '查询用户统计信息',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)用户统计$',
          fnc: 'getUserStats'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
  }

  async getUserStats() {
    // 权限检查：只有机器人主人才能使用
    if (!this.e.isMaster) {
      await this.e.reply('抱歉，只有机器人主人才能使用此功能。');
      return true;
    }

    try {
      // 从配置中获取clientID
      const config = Config.getConfig()
      const clientID = config?.delta_force?.clientID

      if (!clientID) {
        await this.e.reply('系统配置错误：clientID未配置，请联系管理员。')
        return true
      }

      await this.e.reply('正在获取用户统计信息，请稍候...')

      const res = await this.api.getUserStats(clientID)
      
      if (await utils.handleApiError(res, this.e)) return true

      if (!res.data) {
        await this.e.reply('获取统计信息失败：API返回数据为空')
        return true
      }

      const { accessLevel, data } = res
      
      if (accessLevel === 'admin') {
        // 管理员权限 - 显示全部用户统计
        await this.displayAdminStats(data)
      } else {
        // 普通用户权限 - 显示个人统计
        await this.displayUserStats(data)
      }

    } catch (error) {
      logger.error(`[Stats] 获取用户统计失败: ${error.message}`)
      await this.e.reply(`获取用户统计失败: ${error.message}`)
    }

    return true
  }

  async displayAdminStats(data) {
    const { users, api, subscription, loginMethods, platform } = data
    
    let msg = '【三角洲行动 - 全站用户统计】\n'
    msg += '权限级别：超级管理员\n'
    
    // 用户统计
    msg += '用户统计\n'
    msg += `总用户数: ${users.total}\n`
    msg += `邮箱已验证: ${users.emailVerified}\n`
    msg += `邮箱未验证: ${users.emailUnverified}\n`
    
    // API密钥统计
    msg += 'API密钥统计\n'
    msg += `总密钥数: ${api.totalKeys}\n`
    msg += `活跃密钥: ${api.activeKeys}\n`
    msg += `非活跃密钥: ${api.inactiveKeys}\n`
    
    // 订阅统计
    msg += '订阅统计\n'
    msg += `专业用户: ${subscription.proUsers}\n`
    msg += `免费用户: ${subscription.freeUsers}\n`
    msg += `总订阅数: ${subscription.totalSubscriptions}\n`
    
    // 登录方式统计
    msg += '登录方式统计\n'
    Object.entries(loginMethods).forEach(([method, stats]) => {
      const methodName = this.getMethodDisplayName(method)
      msg += `${methodName}: ${stats.total} (有效: ${stats.valid}, 无效: ${stats.invalid})\n`
    })
    msg += '\n'
    
    // 平台绑定统计
    msg += '平台绑定统计\n'
    msg += `总绑定数: ${platform.totalBindings}\n`
    msg += `已绑定用户: ${platform.boundUsers}\n`
    msg += `未绑定用户: ${platform.unboundUsers}`

    await this.e.reply(msg)
  }

  async displayUserStats(data) {
    const { userInfo, loginMethods, api } = data
    
    let msg = '【三角洲行动 - 个人统计信息】\n'
    msg += '权限级别：普通用户\n'   
    // 账号统计
    msg += '账号统计\n'
    msg += `总账号数: ${userInfo.totalAccounts}\n`
    msg += `已绑定账号: ${userInfo.boundAccounts}\n`
    msg += `未绑定账号: ${userInfo.unboundAccounts}\n`
    
    // 登录方式统计
    msg += '登录方式统计\n'
    Object.entries(loginMethods).forEach(([method, stats]) => {
      const methodName = this.getMethodDisplayName(method)
      msg += `${methodName}: ${stats.total} (有效: ${stats.valid}, 无效: ${stats.invalid})\n`
    })
    
    // API密钥统计
    msg += 'API密钥统计\n'
    msg += `总密钥数: ${api.totalKeys}\n`
    msg += `活跃密钥: ${api.activeKeys}\n`
    msg += `非活跃密钥: ${api.inactiveKeys}`

    await this.e.reply(msg)
  }

  getMethodDisplayName(method) {
    const methodNames = {
      'qq': 'QQ登录',
      'wechat': '微信登录',
      'wegame': 'WeGame登录',
      'wegameWechat': 'WeGame微信登录',
      'qqsafe': 'QQ安全中心',
      'qqCk': 'QQ Cookie登录'
    }
    return methodNames[method] || method
  }

  formatDate(dateString) {
    if (!dateString) return '未知'
    try {
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return dateString
    }
  }
} 