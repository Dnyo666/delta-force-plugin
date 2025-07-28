import plugin from '../../../lib/plugins/plugin.js'
import Code from '../components/Code.js'
import utils from '../utils/utils.js'

export class Tools extends plugin {
  constructor (e) {
    super({
      name: '三角洲功能',
      dsc: '提供各种实用小功能',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)(每日密码|今日密码)$',
          fnc: 'getDailyKeyword'
        },
        {
          reg: '^(#三角洲|\\^)文章列表$',
          fnc: 'getArticleList'
        },
        {
          reg: '^(#三角洲|\\^)(文章详情|文章)(\\d+)$',
          fnc: 'getArticleDetail'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
  }

  async getDailyKeyword() {
    const res = await this.api.getDailyKeyword();
    
    if (await utils.handleApiError(res, this.e)) return true;

    if (res && (res.code === 0 || res.success) && res.data?.list?.length > 0) {
      let msg = '【每日密码】\n';
      res.data.list.forEach(item => {
        msg += `【${item.mapName}】: ${item.secret}\n`;
      });
      await this.e.reply(msg.trim());
    } else {
      await this.e.reply(`获取每日密码失败: ${res.msg || res.message || '暂无数据'}`);
    }
    return true;
  }

  async getArticleList() {
    await this.e.reply('正在获取最新文章列表...');
    const res = await this.api.getArticleList();
    
    if (await utils.handleApiError(res, this.e)) return true;

    if (res && res.code === 0 && res.data && res.data.list) {
      let msg = '【最新文章列表】\n';
      msg += '--------------------\n';
      res.data.list.slice(0, 10).forEach(article => { // 最多显示10条
        msg += `【${article.subject}】\n`;
        msg += `作者: ${article.user_name}\n`;
        msg += `ID: ${article.thread_id}\n`;
        msg += `时间: ${new Date(article.post_time * 1000).toLocaleString()}\n`;
        msg += '--------------------\n';
      });
      msg += '使用 #三角洲文章详情<ID> 查看具体内容。';
      await this.e.reply(msg);
    } else {
      await this.e.reply(`获取文章列表失败: ${res.msg || res.message || '未知错误'}`);
    }
    return true;
  }

  async getArticleDetail() {
    const threadId = this.e.msg.match(/(\d+)$/)[1];
    await this.e.reply(`正在获取文章详情 (ID: ${threadId})...`);
    const res = await this.api.getArticleDetail(threadId);
    
    if (await utils.handleApiError(res, this.e)) return true;

    if (res && res.code === 0 && res.data) {
      const article = res.data;
      let msg = `【${article.subject}】\n`;
      msg += `作者: ${article.user_name}\n`;
      msg += '--------------------\n';
      // 简单的内容清洗，移除HTML标签和多余空白
      const content = article.content.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
      msg += content;
      await this.e.reply(msg);
    } else {
      await this.e.reply(`获取文章详情失败: ${res.msg || res.message || 'ID可能不存在或API错误'}`);
    }
    return true;
  }
} 