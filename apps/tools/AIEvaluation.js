import utils from '../../utils/utils.js'
import Code from '../../components/Code.js'
import DataManager from '../../utils/Data.js'

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
        },
        {
          reg: '^(#三角洲|\\^)(ai|AI)评价\\s+(\\S+)\\s+(\\S+)$',
          fnc: 'getAiCommentaryWithPreset'
        },
        {
          reg: '^(#三角洲|\\^)(ai|AI)预设列表$',
          fnc: 'listAiPresets'
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
        
        // 使用合并转发消息发送
        const bot = Bot.pickUser(e.user_id)
        const forwardMsg = [{
          message: [`【${gameMode.name}模式 AI锐评】\n`, fullAnswer],
          nickname: bot.nickname,
          user_id: bot.uin
        }]
        
        await e.reply(await Bot.makeForwardMsg(forwardMsg), false, { recallMsg: 0 })
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

  /**
   * 使用指定预设进行AI评价
   * 命令格式: ^ai评价 模式 预设
   * 支持预设代码(rp/cxg)或中文名(锐评/雌小鬼)
   */
  async getAiCommentaryWithPreset (e) {
    const api = new Code(e);
    
    // 解析参数: 模式 预设
    const match = e.msg.match(this.rule[1].reg);
    const modeStr = match[3];
    const presetInput = match[4];
    
    // 解析游戏模式
    const gameMode = this.parseGameMode(modeStr);
    if (!gameMode) {
      await e.reply([
        '无法识别的游戏模式，请使用以下格式：\n',
        '• ^ai评价 sol/烽火 预设\n',
        '• ^ai评价 mp/战场 预设\n\n',
        '预设支持代码或中文名，如: rp、锐评、cxg、雌小鬼\n',
        '使用 ^ai预设列表 查看可用预设'
      ].join(''));
      return true;
    }
    
    // 查找预设（支持代码或中文名）
    let preset = DataManager.findAiPreset(presetInput);
    if (!preset) {
      // 尝试刷新预设列表后重新查找
      await DataManager.refreshAiPresets();
      preset = DataManager.findAiPreset(presetInput);
      
      if (!preset) {
        const presets = DataManager.getAiPresets();
        let presetHint = '';
        if (presets && presets.length > 0) {
          presetHint = '\n可用预设: ' + presets.map(p => `${p.name}(${p.code})`).join(', ');
        }
        await e.reply(`无效的预设: ${presetInput}${presetHint}\n\n使用 ^ai预设列表 查看可用预设`);
        return true;
      }
    }
    
    const presetCode = preset.code;
    const presetName = preset.name;
    
    // CD键包含模式和预设，不同组合独立CD
    const cdKey = `delta-force:ai-cd:${e.user_id}:${gameMode.type}:${presetCode}`;
    const cd = await redis.ttl(cdKey);
    if (cd > 0) {
      const minutes = Math.ceil(cd / 60);
      await e.reply(`${gameMode.name}模式的【${presetName}】AI正在冷却中，请在 ${minutes} 分钟后重试哦~`);
      return true;
    }

    const token = await utils.getAccount(e.user_id, 'qq_wechat')
    if (!token) {
      await e.reply('您尚未绑定任何QQ/微信账号，请使用 #三角洲登录 进行绑定。')
      return true
    }

    // 抢占式设置临时CD，防止重复请求
    await redis.set(cdKey, '1', { EX: 90 }); // 90秒临时CD

    await e.reply(`正在使用【${presetName}】分析您的${gameMode.name}近期战绩，请耐心等待...`)

    try {
      const res = await api.getAiCommentary(token, gameMode.type, presetCode)

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
          if (parsedData.answer) {
            fullAnswer += parsedData.answer
          }
        } catch (parseError) {
          logger.warn(`[AI评价] 解析流式JSON块失败: ${jsonData}`)
        }
      }

      if (fullAnswer.trim()) {
        // 成功，将CD延长至1小时
        await redis.expire(cdKey, 3600);
        
        // 使用合并转发消息发送
        const bot = Bot.pickUser(e.user_id)
        const forwardMsg = [{
          message: [`【${gameMode.name}模式 AI${presetName}】\n`, fullAnswer],
          nickname: bot.nickname,
          user_id: bot.uin
        }]
        
        await e.reply(await Bot.makeForwardMsg(forwardMsg), false, { recallMsg: 0 })
      } else {
        // 失败，立即删除CD
        await redis.del(cdKey);
        await e.reply(`${gameMode.name}模式AI${presetName}失败，未能生成有效内容。`)
      }
    } catch (error) {
      // 任何错误都应立即删除CD
      await redis.del(cdKey);
      await e.reply(`${gameMode.name}模式AI${presetName}出错了: ${error.message}`)
    }

    return true
  }

  /**
   * 列出所有可用的AI预设
   */
  async listAiPresets (e) {
    // 先尝试刷新预设列表
    await DataManager.refreshAiPresets();
    
    const presets = DataManager.getAiPresets();
    
    if (!presets || presets.length === 0) {
      await e.reply('暂无可用的AI预设，请稍后重试。');
      return true;
    }
    
    let msg = '【AI评价预设列表】\n\n';
    presets.forEach((preset, index) => {
      const defaultMark = preset.isDefault ? ' (默认)' : '';
      msg += `${index + 1}. ${preset.name} - 代码: ${preset.code}${defaultMark}\n`;
    });
    
    msg += '\n使用方法:\n';
    msg += '• ^ai锐评 模式 - 使用默认预设(锐评)\n';
    msg += '• ^ai评价 模式 预设 - 使用指定预设\n';
    msg += '\n示例:\n';
    msg += '• ^ai评价 烽火 cxg\n';
    msg += '• ^ai评价 烽火 雌小鬼\n';
    msg += '• ^ai评价 mp 锐评';
    
    await e.reply(msg);
    return true;
  }
}