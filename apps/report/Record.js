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
   * @returns {Promise<boolean>} 是否成功发送
   */
  async queryAndRenderMode(mode, page, token) {
    const modeName = mode === 'sol' ? '烽火地带' : '全面战场';
    const typeId = mode === 'sol' ? 4 : 5;
    const recordsPerPage = 10;

    const res = await this.api.getRecord(token, typeId, page);
    if (await utils.handleApiError(res, this.e)) return false;

    if (!res.data || !Array.isArray(res.data)) {
      await this.e.reply(`查询失败: ${modeName} API 返回的数据格式不正确。`);
      return false;
    }

    const records = res.data
    if (records.length === 0) {
      await this.e.reply(`您在 ${modeName} (第${page}页) 没有更多战绩记录。`)
      return false
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

    await Render.render('Template/record/record', {
      modeName,
      page,
      records: templateRecords
    }, {
      e: this.e,
      scale: 1.2
    })

    return true
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
      await this.queryAndRenderMode(specifiedMode, page, token)
      return true
    }

    await e.reply(`正在查询战绩 (第${page}页)，请稍候...`)
    await this.queryAndRenderMode('sol', page, token)
    await this.queryAndRenderMode('mp', page, token)
    
    return true
  }
} 