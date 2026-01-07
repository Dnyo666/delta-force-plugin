import utils from '../../utils/utils.js'
import Code from '../../components/Code.js'

export class HealthInfo extends plugin {
  constructor (e) {
    super({
      name: '三角洲健康状态信息',
      dsc: '查询游戏健康状态相关信息',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)健康状态$',
          fnc: 'getHealthInfo'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
  }

  async getHealthInfo() {
    await this.e.reply('正在查询健康状态信息，请稍候...')

    const res = await this.api.getHealth()

    if (await utils.handleApiError(res, this.e)) return true

    if (!res.data || !res.data[0]) {
      await this.e.reply(`查询失败: ${res.msg || res.message || 'API 返回数据格式不正确'}`)
      return true
    }

    const healthData = res.data[0]

    if (!healthData.healthyDetail) {
      await this.e.reply('未能查询到健康状态详细信息。')
      return true
    }

    const { deBuffList, buffList } = healthData.healthyDetail

    const bot = global.Bot
    const forwardMsg = []

    // 负面状态列表
    if (deBuffList && deBuffList.length > 0) {
      let debuffMsg = `【负面状态】\n\n`
      
      deBuffList.forEach((areaGroup, areaIndex) => {
        const area = areaGroup.area || '未知部位'
        debuffMsg += `【${area}】\n`
        
        if (areaGroup.list && areaGroup.list.length > 0) {
          areaGroup.list.forEach((debuff, debuffIndex) => {
            debuffMsg += `• ${debuff.title || debuff.status || '未知状态'}\n`
            if (debuff.trigger) {
              debuffMsg += `  触发：${debuff.trigger}\n`
            }
            if (debuff.effect) {
              debuffMsg += `  效果：${debuff.effect}\n`
            }
            // 最后一个负面状态且是最后一个部位，且没有增益状态时才不加换行
            const isLastDebuff = areaIndex === deBuffList.length - 1 && 
                                 debuffIndex === areaGroup.list.length - 1 && 
                                 (!buffList || buffList.length === 0)
            if (!isLastDebuff) {
              debuffMsg += '\n'
            }
          })
        }
        
        // 不是最后一个部位时添加换行
        if (areaIndex < deBuffList.length - 1) {
          debuffMsg += '\n'
        }
      })
      
      forwardMsg.push({
        message: debuffMsg,
        nickname: bot.nickname,
        user_id: bot.uin
      })
    }

    // 增益状态列表
    if (buffList && buffList.length > 0) {
      let buffMsg = `【增益状态】\n\n`
      
      buffList.forEach((buffGroup, groupIndex) => {
        if (buffGroup.list && buffGroup.list.length > 0) {
          buffGroup.list.forEach((buff, buffIndex) => {
            buffMsg += `• ${buff.title || '未知增益'}\n`
            if (buff.effect) {
              buffMsg += `  效果：${buff.effect}\n`
            }
            // 最后一个增益状态时才不加换行
            const isLastBuff = groupIndex === buffList.length - 1 && 
                               buffIndex === buffGroup.list.length - 1
            if (!isLastBuff) {
              buffMsg += '\n'
            }
          })
        }
      })
      
      forwardMsg.push({
        message: buffMsg,
        nickname: bot.nickname,
        user_id: bot.uin
      })
    }

    // 发送合并转发消息
    if (forwardMsg.length > 0) {
      const result = await this.e.reply(await bot.makeForwardMsg(forwardMsg), false, { recallMsg: 0 })
      if (!result) {
        await this.e.reply('生成转发消息失败，请联系管理员。')
      }
    } else {
      await this.e.reply('未能生成任何健康状态信息，请稍后重试。')
    }

    return true
  }
}
