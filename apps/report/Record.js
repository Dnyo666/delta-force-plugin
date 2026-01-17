import utils from '../../utils/utils.js'
import Code from '../../components/Code.js'
import DataManager from '../../utils/Data.js'
import Render from '../../components/Render.js'
import fs from 'fs'

const ESCAPE_REASONS = {
  '1': '撤离成功',
  '2': '被玩家击杀',
  '3': '被人机击杀',
  '10': '撤离失败'
}

const MP_RESULTS = {
  '1': '胜利',
  '2': '失败',
  '3': '中途退出'
}

export class Record extends plugin {
  constructor (e) {
    super({
      name: '三角洲战绩',
      dsc: '查询三角洲行动战绩',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)战绩(.*)$',
          fnc: 'getRecord'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
  }

  /**
   * 格式化时长
   * @param {number} seconds - 秒数
   * @returns {string} 格式化后的时长
   */
  formatDuration(seconds) {
    if (!seconds && seconds !== 0) return '未知'
    if (seconds === 0) return '0秒'
    
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) return `${hours}小时${minutes}分${secs}秒`
    if (minutes > 0) return `${minutes}分${secs}秒`
    return `${secs}秒`
  }

  /**
   * 查询并渲染单个模式的战绩
   * @param {string} mode - 模式 ('sol' | 'mp')
   * @param {number} page - 页码
   * @param {string} token - 账号令牌
   * @returns {Promise<Object|null>} 返回 { modeName, image } 或 null（失败时）
   */
  async queryAndRenderMode(mode, page, token) {
    const modeName = mode === 'sol' ? '烽火地带' : '全面战场'
    const typeId = mode === 'sol' ? 4 : 5
    const recordsPerPage = 5

    const res = await this.api.getRecord(token, typeId, page)
    if (await utils.handleApiError(res, this.e)) return null

    if (!res.data || !Array.isArray(res.data)) {
      await this.e.reply(`查询失败: ${modeName} API 返回的数据格式不正确。`)
      return null
    }

    const records = res.data
    if (records.length === 0) {
      await this.e.reply(`您在 ${modeName} (第${page}页) 没有更多战绩记录。`)
      return null
    }

    const pageRecords = records.slice(0, recordsPerPage)

    const getMapBgPath = (mapName, gameMode) => {
      const modePrefix = gameMode === 'sol' ? '烽火' : '全面'
      const baseDir = `${process.cwd()}/plugins/delta-force-plugin/resources/imgs/map`.replace(/\\/g, '/')
      
      // 全面战场的地图文件格式是"全面-地图名.jpg"，没有难度级别
      // 烽火地带的地图文件格式是"烽火-地图名-难度.png"，有难度级别
      if (gameMode === 'mp') {
        // 全面战场：直接使用地图名称匹配
        const parts = mapName.split('-')
        const baseMapName = parts[0] // 取第一部分作为地图名称
        
        // 尝试匹配"全面-地图名.jpg"
        const jpgPath = `${baseDir}/${modePrefix}-${baseMapName}.jpg`
        if (fs.existsSync(jpgPath)) {
          const bgPath = `${process.cwd()}/plugins/delta-force-plugin/resources/imgs/map/${modePrefix}-${baseMapName}.jpg`.replace(/\\/g, '/')
          return `file:///${bgPath}`
        }
        
        // 如果找不到，尝试使用完整地图名称（去掉难度部分）
        const fullMapName = mapName.replace(/-.*$/, '') // 移除"-"后面的所有内容
        const fullJpgPath = `${baseDir}/${modePrefix}-${fullMapName}.jpg`
        if (fs.existsSync(fullJpgPath)) {
          const bgPath = `${process.cwd()}/plugins/delta-force-plugin/resources/imgs/map/${modePrefix}-${fullMapName}.jpg`.replace(/\\/g, '/')
          return `file:///${bgPath}`
        }
        
        // 如果还是找不到，返回默认路径
        const bgPath = `${process.cwd()}/plugins/delta-force-plugin/resources/imgs/map/${modePrefix}-${baseMapName}.jpg`.replace(/\\/g, '/')
        return `file:///${bgPath}`
      } else {
        // 烽火地带：处理地图名称和难度级别
        const parts = mapName.split('-')
        let finalPath = null
        
        if (parts.length >= 2) {
          // 有难度级别的情况：尝试精确匹配，如果不存在则降级到常规
          const baseMapName = parts[0]
          const difficulty = parts.slice(1).join('-')
          
          // 优先级1: 精确匹配
          const exactPath = `${baseDir}/${modePrefix}-${baseMapName}-${difficulty}.png`
          if (fs.existsSync(exactPath)) {
            finalPath = `imgs/map/${modePrefix}-${baseMapName}-${difficulty}.png`
          } else {
            // 优先级2: 降级到常规版本
            const regularPath = `${baseDir}/${modePrefix}-${baseMapName}-常规.png`
            if (fs.existsSync(regularPath)) {
              finalPath = `imgs/map/${modePrefix}-${baseMapName}-常规.png`
            } else {
              // 如果都不存在，返回精确匹配路径（让浏览器处理错误）
              finalPath = `imgs/map/${modePrefix}-${baseMapName}-${difficulty}.png`
            }
          }
        } else {
          // 只有基础地图名称的情况
          const cleanMapName = parts[0]
          const pngPath = `${baseDir}/${modePrefix}-${cleanMapName}.png`
          
          if (fs.existsSync(pngPath)) {
            finalPath = `imgs/map/${modePrefix}-${cleanMapName}.png`
          } else {
            finalPath = `imgs/map/${modePrefix}-${cleanMapName}.png`
          }
        }
        
        const bgPath = `${process.cwd()}/plugins/delta-force-plugin/resources/${finalPath}`.replace(/\\/g, '/')
        return `file:///${bgPath}`
      }
    }

    const templateRecords = []

    for (let i = 0; i < pageRecords.length; i++) {
      const r = pageRecords[i]
      const recordNum = (page - 1) * recordsPerPage + i + 1
      const mapName = mode === 'sol' ? DataManager.getMapName(r.MapId) : DataManager.getMapName(r.MapID)
      const operator = DataManager.getOperatorName(r.ArmedForceId)
      const operatorImgPath = DataManager.getOperatorImagePath(operator)
      const operatorImg = `file:///${process.cwd()}/plugins/delta-force-plugin/resources/${operatorImgPath}`.replace(/\\/g, '/')
      
      const recordData = {
        recordNum,
        time: r.dtEventTime,
        map: mapName,
        operator,
        mapBg: getMapBgPath(mapName, mode),
        operatorImg
      }

      if (mode === 'sol') {
        const escapeStatus = ESCAPE_REASONS[String(r.EscapeFailReason)] || '撤离失败'
        const duration = this.formatDuration(Number(r.DurationS))
        let statusClass = 'fail'
        if (r.EscapeFailReason === 1 || r.EscapeFailReason === '1') {
          statusClass = 'success'
        } else if (r.EscapeFailReason === 3 || r.EscapeFailReason === '3') {
          statusClass = 'exit'
        }

        recordData.status = escapeStatus
        recordData.statusClass = statusClass
        recordData.duration = duration
        recordData.value = Number(r.FinalPrice).toLocaleString()
        const incomeValue = r.flowCalGainedPrice ? Number(r.flowCalGainedPrice) : null
        recordData.income = incomeValue !== null ? incomeValue.toLocaleString() : '未知'
        recordData.incomeClass = incomeValue !== null ? (incomeValue >= 0 ? 'income-positive' : 'income-negative') : ''
        recordData.killsHtml = `<span class="kill-item kill-player">玩家 ${r.KillCount || 0}</span><span class="kill-separator">/</span><span class="kill-item kill-ai-player">AI玩家 ${r.KillPlayerAICount || 0}</span><span class="kill-separator">/</span><span class="kill-item kill-ai">AI ${r.KillAICount || 0}</span>`
      } else {
        const result = MP_RESULTS[String(r.MatchResult)] || '未知结果'
        const duration = this.formatDuration(Number(r.gametime))
        let statusClass = 'fail'
        if (r.MatchResult === 1 || r.MatchResult === '1') {
          statusClass = 'success'
        } else if (r.MatchResult === 3 || r.MatchResult === '3') {
          statusClass = 'exit'
        }

        recordData.status = result
        recordData.statusClass = statusClass
        recordData.duration = duration
        recordData.kda = `${r.KillNum}/${r.Death}/${r.Assist}`
        recordData.score = r.TotalScore.toLocaleString()
        if (r.RescueTeammateCount) {
          recordData.rescue = r.RescueTeammateCount
        }
      }

      // 处理队友信息
      // 全面战场从RoomInfo.mpDetailList获取，烽火地带从teammateArr获取
      let teammateSource = null
      if (mode === 'mp' && r.RoomInfo && r.RoomInfo.data && r.RoomInfo.data.mpDetailList && Array.isArray(r.RoomInfo.data.mpDetailList)) {
        // 全面战场：从RoomInfo.mpDetailList获取，排除当前用户
        teammateSource = r.RoomInfo.data.mpDetailList.filter(t => !t.isCurrentUser)
      } else if (r.teammateArr && Array.isArray(r.teammateArr) && r.teammateArr.length > 0) {
        // 烽火地带：从teammateArr获取
        teammateSource = r.teammateArr
      }

      if (teammateSource && teammateSource.length > 0) {
        recordData.teammates = teammateSource.map(teammate => {
          const teammateOperator = DataManager.getOperatorName(teammate.ArmedForceId)
          const teammateData = {
            operator: teammateOperator,
            operatorImg: `file:///${process.cwd()}/plugins/delta-force-plugin/resources/${DataManager.getOperatorImagePath(teammateOperator)}`.replace(/\\/g, '/')
          }

          if (mode === 'sol') {
            const teammateStatus = ESCAPE_REASONS[String(teammate.EscapeFailReason)] || '撤离失败'
            let teammateStatusClass = 'fail'
            if (teammate.EscapeFailReason === 1 || teammate.EscapeFailReason === '1') {
              teammateStatusClass = 'success'
            } else if (teammate.EscapeFailReason === 3 || teammate.EscapeFailReason === '3') {
              teammateStatusClass = 'exit'
            }

            teammateData.status = teammateStatus
            teammateData.statusClass = teammateStatusClass
            teammateData.value = Number(teammate.FinalPrice || 0).toLocaleString()
            teammateData.duration = this.formatDuration(Number(teammate.DurationS || 0))
            teammateData.kills = `${(teammate.KillCount || 0) + (teammate.KillPlayerAICount || 0) + (teammate.KillAICount || 0)}`
            teammateData.rescue = teammate.Rescue || 0
          } else {
            // 全面战场：处理RoomInfo.mpDetailList中的队友数据
            const teammateResult = MP_RESULTS[String(teammate.matchResult || teammate.MatchResult)] || '未知结果'
            let teammateStatusClass = 'fail'
            const matchResult = teammate.matchResult || teammate.MatchResult
            if (matchResult === 1 || matchResult === '1') {
              teammateStatusClass = 'success'
            } else if (matchResult === 3 || matchResult === '3') {
              teammateStatusClass = 'exit'
            }

            teammateData.status = teammateResult
            teammateData.statusClass = teammateStatusClass
            teammateData.kda = `${teammate.killNum || teammate.KillNum || 0}/${teammate.death || teammate.Death || 0}/${teammate.assist || teammate.Assist || 0}`
            teammateData.score = (teammate.totalScore || teammate.TotalScore || 0).toLocaleString()
            teammateData.duration = this.formatDuration(Number(teammate.gameTime || teammate.gametime || teammate.DurationS || 0))
            teammateData.rescue = teammate.rescueTeammateCount || teammate.RescueTeammateCount || teammate.Rescue || 0
            // 全面战场队友的干员ID字段可能是armedForceType
            if (teammate.armedForceType && !teammate.ArmedForceId) {
              const mpTeammateOperator = DataManager.getOperatorName(teammate.armedForceType)
              teammateData.operator = mpTeammateOperator
              teammateData.operatorImg = `file:///${process.cwd()}/plugins/delta-force-plugin/resources/${DataManager.getOperatorImagePath(mpTeammateOperator)}`.replace(/\\/g, '/')
            }
          }

          return teammateData
        })
      }

      templateRecords.push(recordData)
    }

    try {
      const image = await Render.render('Template/record/record', {
        modeName,
        page,
        records: templateRecords
      }, {
        e: this.e,
        retType: 'base64',
        saveId: `${this.e.user_id}_record_${mode}_${page}_${Date.now()}`,
        scale: 1.2
      })

      if (image) {
        return { modeName, image, mode }
      }
      return null
    } catch (error) {
      logger.error(`[战绩] 渲染${modeName}图片失败:`, error)
      await this.e.reply(`${modeName}战绩图片渲染失败，请稍后重试。`)
      return null
    }
  }

  async getRecord(e) {
    const match = e.msg.match(/^(#三角洲|\^)战绩\s*(.*)$/)
    const argStr = match ? match[2].trim() : ''
    const args = argStr.split(/\s+/).filter(Boolean)

    let specifiedMode = null
    let page = 1

    for (const arg of args) {
      if (['全面', '全面战场', '战场', 'mp'].includes(arg)) {
        specifiedMode = 'mp'
      } else if (['烽火', '烽火地带', 'sol', '摸金'].includes(arg)) {
        specifiedMode = 'sol'
      } else if (!isNaN(parseInt(arg))) {
        page = parseInt(arg) > 0 ? parseInt(arg) : 1
      }
    }

    const token = await utils.getAccount(e.user_id)
    if (!token) {
      await e.reply('您尚未绑定账号，请使用 #三角洲登录 进行绑定。')
      return true
    }

    if (specifiedMode) {
      const modeName = specifiedMode === 'sol' ? '烽火地带' : '全面战场'
      await e.reply(`正在查询 ${modeName} 的战绩 (第${page}页)，请稍候...`)
      const result = await this.queryAndRenderMode(specifiedMode, page, token)
      if (result && result.image) {
        await e.reply(result.image)
      }
      return true
    }

    await e.reply(`正在查询战绩 (第${page}页)，请稍候...`)
    
    const results = []
    const solResult = await this.queryAndRenderMode('sol', page, token)
    if (solResult) results.push(solResult)
    
    const mpResult = await this.queryAndRenderMode('mp', page, token)
    if (mpResult) results.push(mpResult)

    if (results.length === 0) {
      return true
    }

    if (results.length === 1) {
      await e.reply(results[0].image)
      return true
    }

    const bot = Bot.pickUser(e.user_id)
    const forwardMsg = [{
      message: `【战绩查询】\n第${page}页\n${results.map(r => r.modeName).join(' + ')}`,
      nickname: bot.nickname,
      user_id: bot.uin
    }]

    for (const result of results) {
      forwardMsg.push({
        message: [`【${result.modeName}】\n`, result.image],
        nickname: bot.nickname,
        user_id: bot.uin
      })
    }

    await e.reply(await Bot.makeForwardMsg(forwardMsg), false, { recallMsg: 0 })
    return true
  }
} 