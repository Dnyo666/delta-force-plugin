import Code from '../../components/Code.js';
import utils from '../../utils/utils.js'

const PAGE_SIZE = 20; // 每页显示20条

export class Object extends plugin {
  constructor(e) {
    super({
      name: '三角洲物品查询',
      dsc: '查询和搜索三角洲行动的物品',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)物品列表\\s*(.*)$',
          fnc: 'getObjectList'
        },
        {
          reg: '^(#三角洲|\\^)物品搜索\\s+(.*)$',
          fnc: 'searchObject'
        }
      ]
    });
    this.api = new Code(e);
  }

  async getObjectList(e) {
    const match = e.msg.match(/^(#三角洲|\^)物品列表\s*(.*)$/)
    const argStr = match ? (match[2] || '') : ''
    let args = argStr.trim().split(/\s+/).filter(Boolean)

    let page = 1
    // 提取并移除页码参数
    const pageArg = args.find(arg => /^\d+$/.test(arg))
    if (pageArg) {
      page = parseInt(pageArg, 10)
      args = args.filter(arg => arg !== pageArg)
    }

    let primary, second

    // 检查是否有分类参数，如果没有则使用默认值
    if (args.length === 0) {
      primary = 'props'
      second = 'collection'
    } else {
      primary = args[0] || ''
      second = args[1] || ''
    }

    const categoryDisplay = args.length === 0
      ? `${primary}(默认)/${second}(默认)`
      : `${primary || '无'}/${second || '无'}`

    await e.reply(`正在获取物品列表 (分类: ${categoryDisplay}, 第${page}页)，请稍候...`)

    const res = await this.api.getObjectList(primary, second)

    if (await utils.handleApiError(res, e)) return true

    // 根据API返回结构，物品列表在 res.data.keywords
    const items = res?.data?.keywords

    if (!Array.isArray(items)) {
      return e.reply('获取物品列表失败: API返回数据格式异常或列表为空')
    }
    if (items.length === 0) {
      return e.reply('未找到符合条件的物品。')
    }

    const totalPages = Math.ceil(items.length / PAGE_SIZE)
    if (page < 1 || page > totalPages) {
      return e.reply(`页码超出范围，该分类下总共只有 ${totalPages} 页数据。`)
    }

    const paginatedItems = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    const userInfo = { user_id: e.user_id, nickname: e.sender.nickname }
    const forwardMsg = []
    const titleCategory = args.length === 0 ? '默认' : `${primary || '全部分类'}/${second || '全部分类'}`
    forwardMsg.push({ ...userInfo, message: `【物品列表 - ${titleCategory}】 (第${page}/${totalPages}页)` })

    paginatedItems.forEach(item => {
      let msg = ''
      msg += `名称: ${item.objectName} (ID: ${item.objectID || item.id})\n`
      msg += `分类: ${item.primaryClass} / ${item.secondClass}\n`
      msg += `价格: ${item.price?.toLocaleString() || item.avgPrice?.toLocaleString() || '未知'} | 重量: ${item.weight} | 稀有度: ${item.grade}\n`
      msg += `描述: ${item.desc}\n`
      forwardMsg.push({ ...userInfo, message: msg })
    })

    return e.reply(await Bot.makeForwardMsg(forwardMsg))
  }

  async searchObject(e) {
    const match = e.msg.match(/^(#三角洲|\^)物品搜索\s+(.*)$/)
    const argStr = match ? (match[2] || '') : ''
    const args = argStr.trim().split(/\s+/).filter(Boolean)

    let name = ''
    let ids = []

    args.forEach(arg => {
      if (!isNaN(parseInt(arg)) && arg.length > 5) {
        ids.push(arg);
      } else {
        name += (name ? ' ' : '') + arg;
      }
    });
    
    if (ids.length > 0) {
      name = '';
      await e.reply(`正在通过ID搜索物品: ${ids.join(', ')}...`);
    } else {
      await e.reply(`正在通过名称 "${name}" 搜索物品...`);
    }

    const res = await this.api.searchObject(name, ids.join(','))

    if (await utils.handleApiError(res, e)) return true

    // 根据提供的JSON文件，修正数据路径为 res.data.keywords
    const items = res?.data?.keywords

    if (!Array.isArray(items)) {
      return e.reply(`搜索失败: API返回数据异常`)
    }
    if (items.length === 0) {
      return e.reply('未搜索到相关物品。')
    }
    
    const userInfo = { user_id: e.user_id, nickname: e.sender.nickname };
    const forwardMsg = [];
    forwardMsg.push({ ...userInfo, message: `【物品搜索结果 - ${name || 'ID搜索'}】 (${items.length}条)` });

    items.forEach(item => {
        let msg = '';
        msg += `名称: ${item.objectName} (ID: ${item.objectID})\n`;
        msg += `分类: ${item.primaryClass} / ${item.secondClass}\n`;
        msg += `价格: ${item.avgPrice?.toLocaleString() || '未知'} | 重量: ${item.weight} | 稀有度: ${item.grade}\n`;
        msg += `描述: ${item.desc}`;
        forwardMsg.push({ ...userInfo, message: msg });
    });

    return e.reply(await Bot.makeForwardMsg(forwardMsg));
  }
} 