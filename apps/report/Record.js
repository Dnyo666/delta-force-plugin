import utils from '../../utils/utils.js'
import Code from '../../components/Code.js'
import DataManager from '../../utils/Data.js'
import Render from '../../components/Render.js'
import fs from 'fs'

const ESCAPE_REASONS = {
  '1': '撤离成功',
  '2': '被玩家击杀',
  '3': '被人机击杀'
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
    const modeName = mode === 'sol' ? '烽火地带' : '全面战场';
    const typeId = mode === 'sol' ? 4 : 5;
    const recordsPerPage = 10;

    const res = await this.api.getRecord(token, typeId, page);
    if (await utils.handleApiError(res, this.e)) return null;

    if (!res.data || !Array.isArray(res.data)) {
      await this.e.reply(`查询失败: ${modeName} API 返回的数据格式不正确。`);
      return null;
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
      const parts = mapName.split('-')
      let finalPath = null
      
      if (parts.length >= 2) {
        const baseMapName = parts[0]
        const difficulty = parts.slice(1).join('-')
        const exactPath = `${baseDir}/${modePrefix}-${baseMapName}-${difficulty}.png`
        if (fs.existsSync(exactPath)) {
          finalPath = `imgs/map/${modePrefix}-${baseMapName}-${difficulty}.png`
        } else {
          const regularPath = `${baseDir}/${modePrefix}-${baseMapName}-常规.png`
          if (fs.existsSync(regularPath)) {
            finalPath = `imgs/map/${modePrefix}-${baseMapName}-常规.png`
          } else {
            const basePath = `${baseDir}/${modePrefix}-${baseMapName}.jpg`
            if (fs.existsSync(basePath)) {
              finalPath = `imgs/map/${modePrefix}-${baseMapName}.jpg`
            } else {
              finalPath = `imgs/map/${modePrefix}-${baseMapName}-${difficulty}.png`
            }
          }
        }
      } else {
        const cleanMapName = parts[0]
        const jpgPath = `${baseDir}/${modePrefix}-${cleanMapName}.jpg`
        const pngPath = `${baseDir}/${modePrefix}-${cleanMapName}.png`
        if (fs.existsSync(jpgPath)) {
          finalPath = `imgs/map/${modePrefix}-${cleanMapName}.jpg`
        } else if (fs.existsSync(pngPath)) {
          finalPath = `imgs/map/${modePrefix}-${cleanMapName}.png`
        } else {
          finalPath = `imgs/map/${modePrefix}-${cleanMapName}.jpg`
        }
      }
      const bgPath = `${process.cwd()}/plugins/delta-force-plugin/resources/${finalPath}`.replace(/\\/g, '/')
      return `file:///${bgPath}`
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
        const status = ESCAPE_REASONS[String(r.EscapeFailReason)] || '撤离失败'
        const duration = this.formatDuration(Number(r.DurationS))
        let statusClass = 'fail'
        if (r.EscapeFailReason === 1 || r.EscapeFailReason === '1') statusClass = 'success'
        else if (r.EscapeFailReason === 3 || r.EscapeFailReason === '3') statusClass = 'exit'

        recordData.status = status
        recordData.statusClass = statusClass
        recordData.duration = duration
        recordData.value = Number(r.FinalPrice).toLocaleString()
        recordData.income = r.flowCalGainedPrice ? Number(r.flowCalGainedPrice).toLocaleString() : '未知'
        recordData.killsHtml = `<span class="kill-player">干员(${r.KillCount || 0})</span> / <span class="kill-ai-player">AI玩家(${r.KillPlayerAICount || 0})</span> / <span class="kill-ai">其他AI(${r.KillAICount || 0})</span>`
      } else {
        const status = MP_RESULTS[String(r.MatchResult)] || '未知结果'
        const duration = this.formatDuration(Number(r.gametime))
        let statusClass = 'fail'
        if (r.MatchResult === 1 || r.MatchResult === '1') statusClass = 'success'
        else if (r.MatchResult === 3 || r.MatchResult === '3') statusClass = 'exit'

        recordData.status = status
        recordData.statusClass = statusClass
        recordData.duration = duration
        recordData.kda = `${r.KillNum}/${r.Death}/${r.Assist}`
        recordData.score = r.TotalScore.toLocaleString()
        if (r.RescueTeammateCount) {
          recordData.rescue = r.RescueTeammateCount
        }
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
      // 只查询一个模式，直接发送图片
      const modeName = specifiedMode === 'sol' ? '烽火地带' : '全面战场'
      await e.reply(`正在查询 ${modeName} 的战绩 (第${page}页)，请稍候...`)
      const result = await this.queryAndRenderMode(specifiedMode, page, token)
      
      if (result && result.image) {
        await e.reply(result.image)
      }
      return true
    }

    // 查询两个模式，收集图片后决定发送方式
    await e.reply(`正在查询战绩 (第${page}页)，请稍候...`)
    
    const results = []
    const solResult = await this.queryAndRenderMode('sol', page, token)
    if (solResult) results.push(solResult)
    
    const mpResult = await this.queryAndRenderMode('mp', page, token)
    if (mpResult) results.push(mpResult)

    if (results.length === 0) {
      // 两个模式都没有数据，已经在前面的方法中回复了
      return true
    }

    if (results.length === 1) {
      // 只有一个模式的图片，直接发送
      await e.reply(results[0].image)
      return true
    }

    // 有两个模式的图片，使用合并转发消息发送
    const bot = Bot.pickUser(e.user_id)
    const forwardMsg = []

    // 添加标题消息
    forwardMsg.push({
      message: `【战绩查询】\n第${page}页\n${results.map(r => r.modeName).join(' + ')}`,
      nickname: bot.nickname,
      user_id: bot.uin
    })

    // 添加两个模式的图片
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