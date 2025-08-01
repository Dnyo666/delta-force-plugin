import utils from '../utils/utils.js'
import Code from '../components/Code.js'

export class Ai extends plugin {
  constructor () {
    super({
      name: '三角洲AI锐评',
      dsc: '使用AI锐评战绩',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)(ai|AI)锐评$',
          fnc: 'getAiCommentary'
        }
      ]
    })
    this.api = new Code(e)
  }

  async getAiCommentary (e) {
    const cdKey = `delta-force:ai-cd:${e.user_id}`;
    const cd = await redis.ttl(cdKey);
    if (cd > 0) {
        const minutes = Math.ceil(cd / 60);
        await e.reply(`AI大脑正在冷却中，请在 ${minutes} 分钟后重试哦~`);
        return true;
    }

    const token = await utils.getAccount(e.user_id, 'sol')
    if (!token) {
      await e.reply('您尚未绑定账号，请使用 #三角洲登录 进行绑定。')
      return true
    }

    // 抢占式设置临时CD，防止重复请求
    await redis.set(cdKey, '1', { EX: 90 }); // 90秒临时CD

    await e.reply('正在分析您的近期战绩，请耐心等待...')

    try {
      const res = await this.api.getAiCommentary(token, 'sol')

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
        await e.reply([segment.at(e.user_id), fullAnswer])
      } else {
        // 失败，立即删除CD
        await redis.del(cdKey);
        await e.reply('AI锐评失败，未能生成有效内容。')
      }
    } catch (error) {
      // 任何错误都应立即删除CD
      await redis.del(cdKey);
      await this.e.reply(`AI锐评出错了: ${error.message}`)
    }

    return true
  }
} 