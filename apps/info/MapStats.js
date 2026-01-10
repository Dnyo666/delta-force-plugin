import utils from '../../utils/utils.js'
import Code from '../../components/Code.js'
import DataManager from '../../utils/Data.js'
import Render from '../../components/Render.js'
import { segment } from 'oicq'

export class MapStats extends plugin {
  constructor(e) {
    super({
      name: '三角洲地图统计',
      dsc: '查询三角洲行动地图数据统计',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)(地图统计|mapStats|地图数据)\\s*(.*)$',
          fnc: 'getMapStats'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
  }

  formatDuration(seconds) {
    if (!seconds || isNaN(seconds)) return '0分钟'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}小时${minutes}分钟` : `${minutes}分钟`
  }

  formatNumber(num) {
    if (num === null || num === undefined || num === '') return '-'
    const numValue = typeof num === 'string' ? parseFloat(num) : num
    return isNaN(numValue) ? num : numValue.toLocaleString()
  }

  formatProfit(profit) {
    if (profit === null || profit === undefined || profit === '') return '-'
    const profitValue = typeof profit === 'string' ? parseFloat(profit) : profit
    if (isNaN(profitValue)) return profit
    const absValue = Math.abs(profitValue)
    const sign = profitValue >= 0 ? '+' : '-'
    if (absValue >= 1000000000) return `${sign}${parseFloat((absValue / 1000000000).toFixed(2))}B`
    if (absValue >= 1000000) return `${sign}${parseFloat((absValue / 1000000).toFixed(2))}M`
    if (absValue >= 1000) return `${sign}${parseFloat((absValue / 1000).toFixed(2))}K`
    return `${sign}${absValue.toLocaleString()}`
  }

  calculateWinRate(winnum, total) {
    if (!winnum || !total || total === '0') return '0%'
    const win = parseFloat(winnum)
    const tot = parseFloat(total)
    return (isNaN(win) || isNaN(tot) || tot === 0) ? '0%' : `${((win / tot) * 100).toFixed(1)}%`
  }

  calculateKDA(kill, assist, death) {
    if (!kill || kill === '0') return '0.00'
    const k = parseFloat(kill)
    const a = parseFloat(assist || 0)
    const d = parseFloat(death || 0)
    if (isNaN(k) || isNaN(a) || isNaN(d)) return '0.00'
    return d === 0 ? k.toFixed(2) : ((k + a) / d).toFixed(2)
  }

  calculateEscapeRate(escaped, total) {
    if (!escaped || !total || total === '0') return '0%'
    const esc = parseFloat(escaped)
    const tot = parseFloat(total)
    return (isNaN(esc) || isNaN(tot) || tot === 0) ? '0%' : `${((esc / tot) * 100).toFixed(1)}%`
  }

  getMapBaseName(mapName) {
    return mapName ? mapName.replace(/[-（(].*$/, '').trim() : ''
  }

  // 处理烽火地带数据项
  processSolItem(item) {
    const mapName = item.mapName || DataManager.getMapName(item.mapId)
    const data = item.data
    return {
      baseName: this.getMapBaseName(mapName),
      mapName: mapName,
      mapId: item.mapId,
      mapImage: DataManager.getMapImagePath(mapName, 'sol'),
      sol: {
        profit: this.formatProfit(data.a1),
        totalGames: this.formatNumber(data.zdj || data.cs),
        escaped: this.formatNumber(data.isescapednum),
        escapeRate: this.calculateEscapeRate(data.isescapednum, data.zdj || data.cs),
        kill: this.formatNumber(data.killnum),
        failed: this.formatNumber(data.nums)
      },
      mp: null
    }
  }

  // 处理全面战场数据项
  processMpItem(item) {
    const mapName = item.mapName || DataManager.getMapName(item.mapId)
    const data = item.data
    return {
      baseName: this.getMapBaseName(mapName),
      mapName: mapName,
      mapId: item.mapId,
      mapImage: DataManager.getMapImagePath(mapName, 'mp'),
      sol: null,
      mp: {
        win: this.formatNumber(data.winnum),
        totalGames: this.formatNumber(data.zdjnum),
        winRate: this.calculateWinRate(data.winnum, data.zdjnum),
        score: this.formatNumber(data.score),
        gameTime: this.formatDuration(parseInt(data.gametime)),
        kill: this.formatNumber(data.killnum),
        assist: this.formatNumber(data.assist),
        death: this.formatNumber(data.death),
        kda: this.calculateKDA(data.killnum, data.assist, data.death)
      }
    }
  }

  async getMapStats() {
    const token = await utils.getAccount(this.e.user_id)
    if (!token) {
      return await this.e.reply([segment.at(this.e.user_id), '您尚未绑定账号，请使用 #三角洲登录 进行绑定。'])
    }

    const argString = this.e.msg.replace(/^(#三角洲|\^)(地图统计|mapStats|地图数据)\s*/, '').trim()
    const args = argString.split(' ').filter(Boolean)

    let type = '', seasonid = 'all', mapKeyword = '', shouldMerge = false

    for (const arg of args) {
      if (['烽火', '烽火地带', 'sol', '摸金'].includes(arg)) {
        type = 'sol'
      } else if (['全面', '全面战场', '战场', 'mp', 'tdm'].includes(arg)) {
        type = 'mp'
      } else if (['all', '全部'].includes(arg.toLowerCase())) {
        seasonid = 'all'
      } else if (!isNaN(arg)) {
        seasonid = arg
      } else {
        mapKeyword = arg
      }
    }

    if (!type && !mapKeyword && !args.length) {
      shouldMerge = true
      type = ''
      seasonid = 'all'
    } else if (mapKeyword) {
      shouldMerge = false
      if (!type) type = ''
    } else {
      shouldMerge = false
      if (!type) {
        return await this.e.reply([
          segment.at(this.e.user_id),
          '\n请指定游戏模式或地图名称：\n' +
          '格式：\n' +
          '  ^地图统计                    # 合并所有基础地图数据（烽火+全面）\n' +
          '  ^地图统计 烽火 5             # 查询烽火地带第5赛季（不合并）\n' +
          '  ^地图统计 全面 all           # 查询全面战场所有赛季（不合并）\n' +
          '  ^地图统计 大坝               # 搜索包含"大坝"的地图（不合并）'
        ])
      }
    }

    await this.e.reply(`正在查询地图统计数据${type ? `（${type === 'sol' ? '烽火地带' : '全面战场'}）` : '（烽火地带 + 全面战场）'}，请稍候...`)

    try {
      let solRes = null, mpRes = null

      if (!type || type === 'sol') {
        solRes = await this.api.getMapStats(token, seasonid, 'sol', '')
        if (await utils.handleApiError(solRes, this.e)) return true
      }
      if (!type || type === 'mp') {
        mpRes = await this.api.getMapStats(token, seasonid, 'mp', '')
        if (await utils.handleApiError(mpRes, this.e)) return true
      }

      let userName = this.e.sender.card || this.e.sender.nickname
      let userAvatar = ''
      try {
        const personalInfoRes = await this.api.getPersonalInfo(token)
        if (personalInfoRes?.data && personalInfoRes?.roleInfo) {
          const { userData } = personalInfoRes.data
          const { roleInfo } = personalInfoRes
          try {
            const gameUserName = decodeURIComponent(userData?.charac_name || roleInfo?.charac_name || '')
            if (gameUserName) userName = gameUserName
          } catch {}
          try {
            const picUrl = decodeURIComponent(userData?.picurl || roleInfo?.picurl || '')
            if (picUrl) {
              userAvatar = /^[0-9]+$/.test(picUrl)
                ? `https://wegame.gtimg.com/g.2001918-r.ea725/helper/df/skin/${picUrl}.webp`
                : picUrl
            }
          } catch {}
        }
      } catch (error) {
        logger.debug(`[MapStats] 获取用户信息失败:`, error)
      }

      const qqAvatarUrl = `http://q.qlogo.cn/headimg_dl?dst_uin=${this.e.user_id}&spec=640&img_type=jpg`
      const currentDate = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })

      if (shouldMerge) {
        return await this.processMergedData(solRes, mpRes, userName, userAvatar, qqAvatarUrl, currentDate)
      } else if (mapKeyword) {
        return await this.processSearchData(solRes, mpRes, mapKeyword, userName, userAvatar, qqAvatarUrl, currentDate, seasonid)
      } else {
        return await this.processNormalData(solRes, mpRes, type, seasonid, userName, userAvatar, qqAvatarUrl, currentDate)
      }
    } catch (error) {
      logger.error('[地图统计] 查询失败:', error)
      await this.e.reply([
        segment.at(this.e.user_id),
        `\n查询地图统计失败: ${error.message}\n\n请检查：\n1. 账号是否已登录或过期\n2. 是否已绑定游戏角色\n3. 网络连接是否正常`
      ])
    }
  }

  async processMergedData(solRes, mpRes, userName, userAvatar, qqAvatarUrl, currentDate) {
    const solMapStats = new Map()

    if (solRes?.success && Array.isArray(solRes.data)) {
      const validMaps = solRes.data.filter(item => item.data !== null && item.data !== undefined)
      const groupedByBase = new Map()

      for (const item of validMaps) {
        const mapName = item.mapName || DataManager.getMapName(item.mapId)
        const baseName = this.getMapBaseName(mapName)
        if (!groupedByBase.has(baseName)) groupedByBase.set(baseName, [])
        groupedByBase.get(baseName).push(item)
      }

      for (const [baseName, items] of groupedByBase.entries()) {
        const firstItem = items[0]
        const mapName = firstItem.mapName || DataManager.getMapName(firstItem.mapId)
        let totalProfit = 0, totalGames = 0, totalEscaped = 0, totalKill = 0, totalFailed = 0
        for (const item of items) {
          if (item.data) {
            totalProfit += parseFloat(item.data.a1) || 0
            totalGames += parseFloat(item.data.zdj || item.data.cs) || 0
            totalEscaped += parseFloat(item.data.isescapednum) || 0
            totalKill += parseFloat(item.data.killnum) || 0
            totalFailed += parseFloat(item.data.nums) || 0
          }
        }
        solMapStats.set(baseName, {
          baseName, mapName: baseName, mapId: firstItem.mapId,
          mapImage: DataManager.getMapImagePath(mapName, 'sol'),
          sol: {
            profit: this.formatProfit(totalProfit),
            totalGames: this.formatNumber(totalGames),
            escaped: this.formatNumber(totalEscaped),
            escapeRate: this.calculateEscapeRate(totalEscaped, totalGames),
            kill: this.formatNumber(totalKill),
            failed: this.formatNumber(totalFailed)
          },
          mp: null
        })
      }
    }

    if (mpRes?.success && Array.isArray(mpRes.data)) {
      const validMaps = mpRes.data.filter(item => item.data !== null && item.data !== undefined)
      const groupedByBase = new Map()

      for (const item of validMaps) {
        const mapName = item.mapName || DataManager.getMapName(item.mapId)
        const baseName = this.getMapBaseName(mapName)
        if (!groupedByBase.has(baseName)) groupedByBase.set(baseName, [])
        groupedByBase.get(baseName).push(item)
      }

      for (const [baseName, items] of groupedByBase.entries()) {
        const firstItem = items[0]
        const mapName = firstItem.mapName || DataManager.getMapName(firstItem.mapId)
        let totalWin = 0, totalGames = 0, totalScore = 0, totalGameTime = 0
        let totalKill = 0, totalAssist = 0, totalDeath = 0
        for (const item of items) {
          if (item.data) {
            totalWin += parseFloat(item.data.winnum) || 0
            totalGames += parseFloat(item.data.zdjnum) || 0
            totalScore += parseFloat(item.data.score) || 0
            totalGameTime += parseInt(item.data.gametime) || 0
            totalKill += parseFloat(item.data.killnum) || 0
            totalAssist += parseFloat(item.data.assist) || 0
            totalDeath += parseFloat(item.data.death) || 0
          }
        }
        const mergedMp = {
          win: this.formatNumber(totalWin),
          totalGames: this.formatNumber(totalGames),
          winRate: this.calculateWinRate(totalWin, totalGames),
          score: this.formatNumber(totalScore),
          gameTime: this.formatDuration(totalGameTime),
          kill: this.formatNumber(totalKill),
          assist: this.formatNumber(totalAssist),
          death: this.formatNumber(totalDeath),
          kda: this.calculateKDA(totalKill, totalAssist, totalDeath)
        }
        if (solMapStats.has(baseName)) {
          solMapStats.get(baseName).mp = mergedMp
          const mpMapImage = DataManager.getMapImagePath(mapName, 'mp')
          if (mpMapImage) solMapStats.get(baseName).mapImage = mpMapImage
        } else {
          solMapStats.set(baseName, {
            baseName, mapName: baseName, mapId: firstItem.mapId,
            mapImage: DataManager.getMapImagePath(mapName, 'mp'),
            sol: null, mp: mergedMp
          })
        }
      }
    }

    const allMaps = Array.from(solMapStats.values())
    if (allMaps.length === 0) return await this.e.reply('暂未查询到地图统计数据。')

    const solMaps = allMaps.filter(map => map.sol !== null)
    const mpMaps = allMaps.filter(map => map.mp !== null)
    if (solMaps.length === 0 && mpMaps.length === 0) return await this.e.reply('暂未查询到地图统计数据。')

    return await this.sendForwardMessages(solMaps, mpMaps, userName, userAvatar, qqAvatarUrl, currentDate, '全部赛季')
  }

  async processSearchData(solRes, mpRes, mapKeyword, userName, userAvatar, qqAvatarUrl, currentDate, seasonid) {
    const solMaps = []
    const mpMaps = []

    if (solRes?.success && Array.isArray(solRes.data)) {
      const validMaps = solRes.data.filter(item => {
        if (item.data === null || item.data === undefined) return false
        const mapName = item.mapName || DataManager.getMapName(item.mapId)
        return mapName && mapName.includes(mapKeyword)
      })
      for (const item of validMaps) {
        solMaps.push(this.processSolItem(item))
      }
    }

    if (mpRes?.success && Array.isArray(mpRes.data)) {
      const validMaps = mpRes.data.filter(item => {
        if (item.data === null || item.data === undefined) return false
        const mapName = item.mapName || DataManager.getMapName(item.mapId)
        return mapName && mapName.includes(mapKeyword)
      })
      for (const item of validMaps) {
        mpMaps.push(this.processMpItem(item))
      }
    }

    if (solMaps.length === 0 && mpMaps.length === 0) {
      return await this.e.reply(`未找到包含"${mapKeyword}"的地图数据。`)
    }

    // 按难度等级排序
    const difficultyWeights = { '常规': 1, '机密': 2, '绝密': 3, '适应': 4 }
    const getDifficulty = (mapName) => {
      if (!mapName) return ''
      const match = mapName.match(/-([^-（(]+)/)
      return match && match[1] ? match[1].replace(/[（(].*$/, '').trim() : ''
    }
    const sortByDifficulty = (maps) => {
      maps.sort((a, b) => {
        const diffA = getDifficulty(a.mapName)
        const diffB = getDifficulty(b.mapName)
        const weightA = difficultyWeights[diffA] || 999
        const weightB = difficultyWeights[diffB] || 999
        if (weightA !== weightB) return weightA - weightB
        if (diffA !== diffB) return diffA.localeCompare(diffB, 'zh-CN')
        return a.mapName.localeCompare(b.mapName, 'zh-CN')
      })
    }

    if (solMaps.length > 0) sortByDifficulty(solMaps)
    if (mpMaps.length > 0) sortByDifficulty(mpMaps)

    const seasonText = seasonid === 'all' ? '全部赛季' : `第${seasonid}赛季`
    return await this.sendForwardMessages(solMaps, mpMaps, userName, userAvatar, qqAvatarUrl, currentDate, seasonText)
  }

  async processNormalData(solRes, mpRes, type, seasonid, userName, userAvatar, qqAvatarUrl, currentDate) {
    const solMaps = []
    const mpMaps = []

    if (type === 'sol' && solRes?.success && Array.isArray(solRes.data)) {
      const validMaps = solRes.data.filter(item => item.data !== null && item.data !== undefined)
      for (const item of validMaps) {
        solMaps.push(this.processSolItem(item))
      }
    }

    if (type === 'mp' && mpRes?.success && Array.isArray(mpRes.data)) {
      const validMaps = mpRes.data.filter(item => item.data !== null && item.data !== undefined)
      for (const item of validMaps) {
        mpMaps.push(this.processMpItem(item))
      }
    }

    if (solMaps.length === 0 && mpMaps.length === 0) {
      return await this.e.reply('暂未查询到地图统计数据。')
    }

    const seasonText = seasonid === 'all' ? '全部赛季' : `第${seasonid}赛季`
    const typeName = type === 'sol' ? '烽火地带' : '全面战场'

    // 先发送文本信息
    await this.e.reply(`【地图统计数据】\n查询时间：${currentDate}\n模式：${typeName}\n赛季：${seasonText}\n${type === 'sol' ? `烽火地带：${solMaps.length} 张地图` : `全面战场：${mpMaps.length} 张地图`}`)

    // 直接发送图片
    if (type === 'sol' && solMaps.length > 0) {
      const image = await this.renderMapStatsImage(solMaps, 'sol', '烽火地带', seasonText, userName, userAvatar, qqAvatarUrl, currentDate)
      if (image) {
        const imageSegment = this.formatImageSegment(image)
        await this.e.reply(['【烽火地带】\n', imageSegment])
      } else {
        return await this.e.reply('渲染烽火地带图片失败，请稍后重试。')
      }
    } else if (type === 'mp' && mpMaps.length > 0) {
      const image = await this.renderMapStatsImage(mpMaps, 'mp', '全面战场', seasonText, userName, userAvatar, qqAvatarUrl, currentDate)
      if (image) {
        const imageSegment = this.formatImageSegment(image)
        await this.e.reply(['【全面战场】\n', imageSegment])
      } else {
        return await this.e.reply('渲染全面战场图片失败，请稍后重试。')
      }
    }

    return true
  }

  async sendForwardMessages(solMaps, mpMaps, userName, userAvatar, qqAvatarUrl, currentDate, seasonText) {
    // 先发送文本信息
    await this.e.reply(`【地图统计数据】\n查询时间：${currentDate}\n赛季：${seasonText}\n烽火地带：${solMaps.length} 张地图\n全面战场：${mpMaps.length} 张地图`)

    // 直接发送烽火地带图片
    if (solMaps.length > 0) {
      const image = await this.renderMapStatsImage(solMaps, 'sol', '烽火地带', seasonText, userName, userAvatar, qqAvatarUrl, currentDate)
      if (image) {
        const imageSegment = this.formatImageSegment(image)
        await this.e.reply(['【烽火地带】\n', imageSegment])
      } else {
        await this.e.reply('渲染烽火地带图片失败，请稍后重试。')
      }
    }

    // 直接发送全面战场图片
    if (mpMaps.length > 0) {
      const image = await this.renderMapStatsImage(mpMaps, 'mp', '全面战场', seasonText, userName, userAvatar, qqAvatarUrl, currentDate)
      if (image) {
        const imageSegment = this.formatImageSegment(image)
        await this.e.reply(['【全面战场】\n', imageSegment])
      } else {
        await this.e.reply('渲染全面战场图片失败，请稍后重试。')
      }
    }

    return true
  }

  // 格式化图片段，确保返回正确的 segment.image 对象
  formatImageSegment(image) {
    // 如果已经是 segment.image 对象，直接返回
    if (image && typeof image === 'object' && image.type === 'image') {
      return image
    }
    // 如果是 base64 字符串，使用 segment.image 包装
    if (typeof image === 'string') {
      if (image.startsWith('base64://') || image.startsWith('data:image')) {
        return segment.image(image)
      }
      // 如果不是 base64 格式，尝试直接作为图片路径
      return segment.image(image)
    }
    // 如果都不匹配，返回原始值
    return image
  }

  async renderMapStatsImage(mapStatsList, type, typeName, seasonText, userName, userAvatar, qqAvatarUrl, currentDate) {
    try {
      const image = await Render.render('Template/mapStats/mapStats.html', {
        backgroundImage: DataManager.getRandomBackground(),
        userName, userAvatar, userId: this.e.user_id, qqAvatarUrl,
        type, typeName, seasonid: seasonText,
        mapStatsList, totalMaps: mapStatsList.length, currentDate
      }, {
        e: this.e,
        retType: 'base64',
        saveId: `${this.e.user_id}_mapstats_${type}_${Date.now()}`,
        renderCfg: {
          viewport: { width: 600, height: Math.max(800, mapStatsList.length * 200 + 300) }
        }
      })
      return image
    } catch (error) {
      logger.error(`[地图统计] 渲染${typeName}图片失败:`, error)
      return null
    }
  }
}
