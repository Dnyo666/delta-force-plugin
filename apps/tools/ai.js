import utils from '../../utils/utils.js'
import Code from '../../components/Code.js'

export class Ai extends plugin {
  constructor () {
    super({
      name: '三角洲AI锐评',
      dsc: '使用AI锐评战绩',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)(ai|AI)锐评\\s*(.*)$',
          fnc: 'getAiCommentary'
        }
      ]
    })
  }

  /**
   * 解析游戏模式参数
   * @param {string} modeStr - 用户输入的模式字符串
   * @returns {Object} - { type: 'sol'|'mp', name: '烽火地带'|'全面战场' }
   */
  parseGameMode(modeStr) {
    if (!modeStr || modeStr.trim() === '') {
      // 默认烽火地带
      return { type: 'sol', name: '烽火地带' };
    }

    const mode = modeStr.trim().toLowerCase();
    
    // 烽火地带的别名
    const solAliases = ['sol', '烽火', '烽火地带', '摸金', '4'];
    // 全面战场的别名
    const mpAliases = ['mp', '战场', '大战场', '全面战场', '5'];
    
    if (solAliases.includes(mode)) {
      return { type: 'sol', name: '烽火地带' };
    } else if (mpAliases.includes(mode)) {
      return { type: 'mp', name: '全面战场' };
    } else {
      // 无法识别，返回null
      return null;
    }
  }

  async getAiCommentary (e) {
    const api = new Code(e);
    
    // 解析游戏模式参数
    const match = e.msg.match(this.rule[0].reg);
    const modeStr = match[3] || '';
    const gameMode = this.parseGameMode(modeStr);
    
    // 如果无法识别模式，给出提示
    if (!gameMode) {
      await e.reply([
        '无法识别的游戏模式，请使用以下格式：\n',
        '• ^ai锐评 sol/烽火/烽火地带/摸金/4 (烽火地带)\n',
        '• ^ai锐评 mp/战场/大战场/全面战场/5 (全面战场)\n',
        '• ^ai锐评 (默认烽火地带)'
      ].join(''));
      return true;
    }
    
    // CD键包含模式，不同模式独立CD
    const cdKey = `delta-force:ai-cd:${e.user_id}:${gameMode.type}`;
    const cd = await redis.ttl(cdKey);
    if (cd > 0) {
        const minutes = Math.ceil(cd / 60);
        await e.reply(`${gameMode.name}模式的AI大脑正在冷却中，请在 ${minutes} 分钟后重试哦~`);
        return true;
    }

    const token = await utils.getAccount(e.user_id, 'qq_wechat')
    if (!token) {
      await e.reply('您尚未绑定任何QQ/微信账号，请使用 #三角洲登录 进行绑定。')
      return true
    }

    // 抢占式设置临时CD，防止重复请求
    await redis.set(cdKey, '1', { EX: 90 }); // 90秒临时CD

    await e.reply(`正在分析您的${gameMode.name}近期战绩，请耐心等待...`)

    try {
      const res = await api.getAiCommentary(token, gameMode.type)

      if (!res || !res.success || !res.data) {
        throw new Error(res.msg || res.message || '请求AI接口失败或未返回有效数据')
      }

      let fullAnswer = ''
      // 从返回的data字符串中解析流式内容
      const streamContent = res.data
      const lines = streamContent.split('\n').filter(line => line.trim().startsWith('data:'))

      for (const line of lines) {
        const jsonData = line.substring(6)
        try {
          const parsedData = JSON.parse(jsonData)
          // 根据Dify文档，内容在 answer 字段
          if (parsedData.answer) {
            fullAnswer += parsedData.answer
          }
        } catch (e) {
          logger.warn(`[AI锐评] 解析流式JSON块失败: ${jsonData}`)
        }
      }

      if (fullAnswer.trim()) {
        // 成功，将CD延长至1小时
        await redis.expire(cdKey, 3600);
        await e.reply([segment.at(e.user_id), `\n【${gameMode.name}模式 AI锐评】\n`, fullAnswer])
      } else {
        // 失败，立即删除CD
        await redis.del(cdKey);
        await e.reply(`${gameMode.name}模式AI锐评失败，未能生成有效内容。`)
      }
    } catch (error) {
      // 任何错误都应立即删除CD
      await redis.del(cdKey);
      await e.reply(`${gameMode.name}模式AI锐评出错了: ${error.message}`)
    }

    return true
  }
} 