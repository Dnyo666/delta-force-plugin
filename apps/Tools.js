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
          reg: '^(#三角洲|\\^)(文章详情|文章)\\s*(\\d+)$',
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

    if (!res || !res.success || !res.data?.articles?.list) {
      await this.e.reply(`获取文章列表失败: ${res?.message || '未知错误'}`);
      return true;
    }

    const listCategories = res.data.articles.list;
    
    // 合并所有分类的文章
    let allArticles = [];
    for (const category in listCategories) {
      if (Array.isArray(listCategories[category])) {
        allArticles = allArticles.concat(listCategories[category]);
      }
    }

    // 按时间降序排序
    allArticles.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // 限制显示数量
    const articlesToShow = allArticles.slice(0, 20);

    if (articlesToShow.length === 0) {
      await this.e.reply('暂无文章数据');
      return true;
    }

    // 构建转发消息
    const userInfo = {
      user_id: this.e.user_id,
      nickname: this.e.sender.nickname
    };
    
    let forwardMsg = [];
    
    // 添加标题
    forwardMsg.push({
      ...userInfo,
      message: '【三角洲行动 - 最新文章列表】'
    });

    // 添加每篇文章
    articlesToShow.forEach((article, index) => {
      let articleMsg = `${index + 1}. 【${article.title}】\n`;
      articleMsg += `作者: ${article.author}\n`;
      articleMsg += `ID: ${article.threadID}\n`;
      articleMsg += `发布时间: ${article.createdAt}\n`;
      articleMsg += `浏览: ${article.viewCount} | 点赞: ${article.likedCount}\n`;
      
      if (article.summary) {
        articleMsg += `\n${article.summary.slice(0, 100)}${article.summary.length > 100 ? '...' : ''}`;
      }
      
      forwardMsg.push({
        ...userInfo,
        message: articleMsg
      });
    });
    
    // 添加使用提示
    forwardMsg.push({
      ...userInfo,
      message: '使用 #三角洲文章详情<ID> 查看具体内容'
    });
    
    // 发送转发消息
    let msgToSend = forwardMsg.join('\n\n');
    if (this.e.group?.raw?.makeForwardMsg) {
      msgToSend = await this.e.group.raw.makeForwardMsg(forwardMsg);
    } else if (this.e.group?.makeForwardMsg) {
      msgToSend = await this.e.group.makeForwardMsg(forwardMsg);
    } else if (this.e.friend?.makeForwardMsg) {
      msgToSend = await this.e.friend.makeForwardMsg(forwardMsg);
    }
    
    // 自定义转发消息标题
    const dec = '三角洲行动文章列表';
    if (typeof (msgToSend.data) === 'object') {
      let detail = msgToSend.data?.meta?.detail;
      if (detail) {
        detail.news = [{ text: dec }];
      }
    } else {
      msgToSend.data = msgToSend.data
        .replace(/\n/g, '')
        .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, '___')
        .replace(/___+/, `<title color="#777777" size="26">${dec}</title>`);
    }

    await this.e.reply(msgToSend);
    return true;
  }

  async getArticleDetail() {
    const threadId = this.e.msg.match(/(\d+)$/)[1];
    await this.e.reply(`正在获取文章详情 (ID: ${threadId})...`);
    const res = await this.api.getArticleDetail(threadId);
    
    if (await utils.handleApiError(res, this.e)) return true;

    // 根据新的API结构，文章数据现在在 res.data.article 中
    const article = res.data?.article;
    
    if (!article) {
      await this.e.reply(`获取文章详情失败: ${res.message || '文章不存在或已删除'}`);
      return true;
    }

    // 构建转发消息
    const userInfo = {
      user_id: this.e.user_id,
      nickname: this.e.sender.nickname
    };
    
    let forwardMsg = [];
    
    // 标题和基本信息
    let titleMsg = `【${article.title}】\n`;
    titleMsg += `作者: ${article.author?.nickname || '未知作者'}\n`;
    titleMsg += `发布时间: ${article.createdAt}\n`;
    titleMsg += `浏览量: ${article.viewCount} | 点赞: ${article.likedCount}\n`;
    titleMsg += `ID: ${article.id}\n`;
    
    // 添加标签信息
    if (article.ext?.gicpTags?.length > 0) {
      titleMsg += `标签: ${article.ext.gicpTags.join(', ')}\n`;
    }
    
    forwardMsg.push({
      ...userInfo,
      message: titleMsg
    });
    
    // 文章封面
    if (article.cover) {
      const coverUrl = article.cover.startsWith('http') ? article.cover : `https:${article.cover}`;
      try {
        forwardMsg.push({
          ...userInfo,
          message: segment.image(coverUrl)
        });
      } catch (e) {
        logger.error(`[DELTA FORCE PLUGIN] 封面图片加载失败: ${e.message}`);
      }
    }
    
    // 文章内容
    if (article.content?.text) {
      // 处理HTML内容，提取图片和文本
      const htmlContent = article.content.text;
      
      // 提取文本内容（去除HTML标签）
      let textContent = htmlContent
        .replace(/<[^>]+>/g, '')  // 移除HTML标签
        .replace(/&nbsp;/g, ' ')   // 替换空格
        .trim();
      
      // 如果文章有正文内容，添加到转发消息
      if (textContent) {
        forwardMsg.push({
          ...userInfo,
          message: textContent
        });
      }
      
      // 提取所有图片链接
      const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
      let imgMatch;
      let imageUrls = [];
      
      while ((imgMatch = imgRegex.exec(htmlContent)) !== null) {
        const imgUrl = imgMatch[1];
        if (imgUrl) {
          const fullImgUrl = imgUrl.startsWith('http') ? imgUrl : `https:${imgUrl}`;
          imageUrls.push(fullImgUrl);
          
          // 尝试添加图片（每张单独发送）
          try {
            forwardMsg.push({
              ...userInfo,
              message: segment.image(fullImgUrl)
            });
          } catch (e) {
            logger.error(`[DELTA FORCE PLUGIN] 文章图片加载失败: ${e.message}`);
          }
        }
      }
    } else if (article.summary) {
      forwardMsg.push({
        ...userInfo,
        message: article.summary
      });
    }
    
    // 如果没有任何内容，显示提示信息
    if (forwardMsg.length <= 1) {
      forwardMsg.push({
        ...userInfo,
        message: '该文章没有可显示的内容'
      });
    }
    
    // 发送转发消息
    let msgToSend = forwardMsg.join('\n\n');
    if (this.e.group?.raw?.makeForwardMsg) {
      msgToSend = await this.e.group.raw.makeForwardMsg(forwardMsg);
    } else if (this.e.group?.makeForwardMsg) {
      msgToSend = await this.e.group.makeForwardMsg(forwardMsg);
    } else if (this.e.friend?.makeForwardMsg) {
      msgToSend = await this.e.friend.makeForwardMsg(forwardMsg);
    }
    
    // 自定义转发消息标题
    const dec = `三角洲行动 - ${article.title}`;
    if (typeof (msgToSend.data) === 'object') {
      let detail = msgToSend.data?.meta?.detail;
      if (detail) {
        detail.news = [{ text: dec }];
      }
    } else {
      msgToSend.data = msgToSend.data
        .replace(/\n/g, '')
        .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, '___')
        .replace(/___+/, `<title color="#777777" size="26">${dec}</title>`);
    }
    
    await this.e.reply(msgToSend);
    return true;
  }
} 