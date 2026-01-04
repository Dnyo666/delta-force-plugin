import utils from '../../utils/utils.js'
import Code from '../../components/Code.js'
import DataManager from '../../utils/Data.js'
import Render from '../../components/Render.js'

export class Data extends plugin {
  constructor (e) {
    super({
      name: '三角洲数据',
      dsc: '查询三角洲行动个人数据',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)(数据|data)\\s*(.*)$',
          fnc: 'getPersonalData'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
  }

  // URL解码函数
  decodeUserInfo(str) {
    try {
      return decodeURIComponent(str || '')
    } catch (e) {
      return str || ''
    }
  }

  async getPersonalData () {
    const token = await utils.getAccount(this.e.user_id)
    if (!token) {
      await this.e.reply([segment.at(this.e.user_id), '您尚未绑定账号，请使用 #三角洲登录 进行绑定。'])
      return true
    }

    // 解析参数
    const argString = this.e.msg.replace(/^(#三角洲|\^)(数据|data)\s*/, '').trim()
    const args = argString.split(' ').filter(Boolean)
    let mode = ''
    let season = 7
    for (const arg of args) {
      if (['烽火', '烽火地带', 'sol', '摸金'].includes(arg)) {
        mode = 'sol'
      } else if (['全面', '全面战场', '战场', 'mp'].includes(arg)) {
        mode = 'mp'
      } else if (['all', '全部'].includes(arg.toLowerCase())) {
        season = 'all'
      } else if (!isNaN(arg)) {
        season = parseInt(arg)
      }
    }

    const res = await this.api.getPersonalData(token, mode, season)

    if (!res) {
      await this.e.reply('查询数据失败，请检查网络或联系管理员查看后台日志。')
      return true
    }

    if (res.success === false) {
      await this.e.reply(`查询数据失败: ${res.message || '未知API错误'}`)
      return true
    }
    
    // 提取详情数据
    let solDetail = null
    let mpDetail = null
    if (mode) {
      const singleModeData = res.data?.data?.data
      if (singleModeData?.solDetail) solDetail = singleModeData.solDetail
      if (singleModeData?.mpDetail) mpDetail = singleModeData.mpDetail
    } else {
      const allModesData = res.data
      if (allModesData?.sol?.data?.data?.solDetail) {
        solDetail = allModesData.sol.data.data.solDetail
      }
      if (allModesData?.mp?.data?.data?.mpDetail) {
        mpDetail = allModesData.mp.data.data.mpDetail
      }
    }

    if (!solDetail && !mpDetail) {
      await this.e.reply('暂未查询到该账号的游戏数据。')
      return true
    }

    // 获取用户信息（包括头像）
    let userName = this.e.sender.card || this.e.sender.nickname
    let userAvatar = ''
    try {
      const personalInfoRes = await this.api.getPersonalInfo(token)
      if (personalInfoRes && personalInfoRes.data && personalInfoRes.roleInfo) {
        const { userData, careerData } = personalInfoRes.data
        const { roleInfo } = personalInfoRes

        // 获取用户名（优先使用游戏内名称）
        const gameUserName = this.decodeUserInfo(userData?.charac_name || roleInfo?.charac_name)
        if (gameUserName) {
          userName = gameUserName
        }

        // 获取用户头像
        const picUrl = this.decodeUserInfo(userData?.picurl || roleInfo?.picurl)
        if (picUrl) {
          if (/^[0-9]+$/.test(picUrl)) {
            userAvatar = `https://wegame.gtimg.com/g.2001918-r.ea725/helper/df/skin/${picUrl}.webp`
          } else {
            userAvatar = picUrl
          }
        }
      }
    } catch (error) {
      // 获取个人信息失败，使用默认值
      logger.debug(`[Data] 获取用户信息失败:`, error)
    }

    // 获取当前时间
    const now = new Date()
    const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

    // 构建模板数据
    const qqAvatarUrl = `http://q.qlogo.cn/headimg_dl?dst_uin=${this.e.user_id}&spec=640&img_type=jpg`
    const templateData = {
      nickname: userName,
      userName: userName,
      userAvatar: userAvatar,
      userId: this.e.user_id,
      qqAvatarUrl: qqAvatarUrl,
      currentDate: currentDate,
      season: season === 'all' ? '全部' : season
    }
    
    if ((!mode || mode === 'sol') && solDetail) {
      const solRank = solDetail.levelScore ? DataManager.getRankByScore(solDetail.levelScore, 'sol') : '-'
      const solRankImage = solRank !== '-' ? DataManager.getRankImagePath(solRank, 'sol') : null
      
      // 格式化 sol 数据
      const totalGameTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0分钟'
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        return `${hours}小时${minutes}分钟`
      }
      
      const formatGainedPrice = (price) => {
        if (!price || isNaN(price)) return '-'
        return `${(parseFloat(price) / 1000000).toFixed(2)}M`
      }
      
      const formatKd = (kd) => {
        if (kd === null || kd === undefined || isNaN(kd)) return '-'
        return (parseFloat(kd) / 100).toFixed(2)
      }
      
      templateData.solDetail = {
        ...solDetail,
        totalGameTime: totalGameTime(solDetail.totalGameTime),
        totalGainedPriceFormatted: formatGainedPrice(solDetail.totalGainedPrice),
        profitLossRatioFormatted: solDetail.profitLossRatio ? (parseFloat(solDetail.profitLossRatio) / 100000).toFixed(1) + 'K' : '-',
        lowKD: formatKd(solDetail.lowKillDeathRatio),
        medKD: formatKd(solDetail.medKillDeathRatio),
        highKD: formatKd(solDetail.highKillDeathRatio)
      }
      templateData.solRank = solRank
      templateData.solRankImage = solRankImage
    }

    if ((!mode || mode === 'mp') && mpDetail) {
      const mpRank = mpDetail.levelScore ? DataManager.getRankByScore(mpDetail.levelScore, 'tdm') : '-'
      const mpRankImage = mpRank !== '-' ? DataManager.getRankImagePath(mpRank, 'tdm') : null
      
      // 格式化 mp 数据
      const totalGameTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0分钟'
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        return `${hours}小时${minutes}分钟`
      }
      
      templateData.mpDetail = {
        ...mpDetail,
        totalGameTime: totalGameTime(mpDetail.totalGameTime * 60),
        avgKillPerMinuteFormatted: mpDetail.avgKillPerMinute ? (parseFloat(mpDetail.avgKillPerMinute) / 100).toFixed(2) : '-',
        avgScorePerMinuteFormatted: mpDetail.avgScorePerMinute ? (parseFloat(mpDetail.avgScorePerMinute) / 100).toFixed(2) : '-'
      }
      templateData.mpRank = mpRank
      templateData.mpRankImage = mpRankImage
    }

    // 渲染模板
    return await Render.render('Template/personalData/personalData', templateData, {
      e: this.e,
      scale: 1.0,
      renderCfg: {
        viewPort: {
          width: 680,
          height: 5000
        }
      }
    })
  }
}