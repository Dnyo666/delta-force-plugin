import fs from 'fs'
import path from 'path'
import Code from '../components/Code.js'
import Config from '../components/Config.js'
import { pluginRoot } from '../model/path.js'
import utils from '../utils/utils.js'
import { Account } from './Account.js'

const LOGIN_TIMEOUT = 180 * 1000; // 登录总超时时间，180秒
const POLL_INTERVAL = 1000; // 轮询间隔，1秒

// 用于存储用户的教程消息ID，用于后续撤回
const userHelpMessages = new Map();

export class Login extends plugin {
  constructor (e) {
    super({
      name: '三角洲登录',
      dsc: '通过扫码登录获取 frameworkToken',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)(qq|QQ|微信|wx|WX|wegame|WEGAME|wegame微信|微信wegame|qqsafe|QQsafe|安全中心|qq安全中心)?(登陆|登录)$',
          fnc: 'login'
        },
        {
          reg: '^(#三角洲|\\^)ck(登陆|登录)\\s*(.*)$',
          fnc: 'loginWithCookie'
        },
        {
          reg: '^(#三角洲|\\^)(qq|QQ)(授权|auth)(登陆|登录)\\s*(.*)$',
          fnc: 'qqAuthLogin'
        },
        {
          reg: '^(#三角洲|\\^)(网页|web|网站)(登陆|登录)$',
          fnc: 'webLogin'
        },
        {
          reg: '^(#三角洲|\\^)角色绑定\\s*([a-zA-Z0-9\\-]+)?$',
          fnc: 'bindCharacter'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
  }

  async login () {
    const match = this.e.msg.match(this.rule[0].reg);
    let platform = match[2] || 'qq';
    
    // 统一转为小写处理
    platform = platform.toLowerCase();
    
    // 处理各种登录平台的别名
    if (['wx', '微信'].includes(platform)) platform = 'wechat';
    if (['qqsafe', '安全中心', 'qq安全中心'].includes(platform)) platform = 'qqsafe';
    if (['wegame微信', '微信wegame'].includes(platform)) platform = 'wegame/wechat';
    
    // 记录原始平台类型，用于后续判断是否进行角色绑定
    const originalPlatform = platform;
    
    const res = await this.api.getLoginQr(platform)
    const frameworkToken = res.token || res.frameworkToken;

    if (!res || !res.qr_image) {
    await this.e.reply('二维码获取失败，请稍后重试。')
    return true
  }
  
  const messagesToRecall = [];

  let qrImage = res.qr_image;
  if (platform !== 'wechat' && qrImage.startsWith('data:image/png;base64,')) {
      qrImage = `base64://${qrImage.replace(/^data:image\/png;base64,/, '')}`;
  }

  const qrMsg = await this.e.reply([
    segment.at(this.e.user_id),
    `\n请使用另一台设备上的【${platform.toUpperCase()}】扫描二维码登录，有效期约2分钟。\n`,
    segment.image(qrImage),
    '\n\n【免责声明】',
    '\n您将通过扫码授权本插件后端服务器获取您的游戏数据。',
    '\n扫码仅用于获取小程序数据，不涉及登录游戏，如果出现盗号等问题与我方完全无关。',
    '\n害怕风险请勿扫码！',
    '\n如果无法扫码，请私聊机器人发送【^ck登陆】获取Cookie登录教程。'
  ]);
  if (qrMsg?.message_id) messagesToRecall.push(qrMsg.message_id);

  // --- 开始健壮的轮询逻辑 ---
  const startTime = Date.now();
  let notifiedScanned = false; // 用于标记是否已通知用户"已扫码"

  const poll = async (resolve, reject) => {
    // 检查是否超时
      if (Date.now() - startTime > LOGIN_TIMEOUT) {
        return reject(new Error('二维码已超时'));
      }

      const statusRes = await this.api.getLoginStatus(platform, frameworkToken);

      if (!statusRes) {
        // API请求失败，短暂延迟后重试
        setTimeout(() => poll(resolve, reject), POLL_INTERVAL * 2);
        return;
      }
      
      // 优先处理 Token 无效的错误情况
      if (statusRes.code === -2) {
        return reject(new Error(statusRes.msg || '登录凭证无效或已过期'));
      }

      switch (statusRes.status) {
        case 'done': // 登录成功
          const finalToken = statusRes.token || statusRes.frameworkToken;
          if (finalToken) {
            resolve(finalToken);
          } else {
            reject(new Error('登录成功但未能获取到最终Token'));
          }
          break;

        case 'scanned': // 已扫码，待确认
          if (!notifiedScanned) {
            notifiedScanned = true;
            // 撤回二维码图片
            if (qrMsg?.message_id) {
              try {
                await this.e.group.recallMsg(qrMsg.message_id);
                // 从待撤回列表中移除，避免重复撤回
                const index = messagesToRecall.indexOf(qrMsg.message_id);
                if (index > -1) {
                  messagesToRecall.splice(index, 1);
                }
              } catch (err) {
                logger.warn(`[DELTA FORCE PLUGIN] 撤回二维码消息失败: ${qrMsg.message_id}`, err);
              }
            }
          }
          setTimeout(() => poll(resolve, reject), POLL_INTERVAL);
          break;
        
        case 'pending': // 等待扫描
          setTimeout(() => poll(resolve, reject), POLL_INTERVAL);
          break;

        case 'expired': // 二维码超时
          reject(new Error('二维码已超时'));
          break;

        default: // 其他未知状态或需要继续轮询的状态(如authed)
          // logger.debug(`[DELTA FORCE PLUGIN] 轮询登录状态: ${statusRes.status}`); // Original code had this line commented out
          setTimeout(() => poll(resolve, reject), POLL_INTERVAL);
          break;
      }
    };

    try {
      const finalToken = await new Promise(poll);

      if (!finalToken) {
          throw new Error('未能获取到有效的Token');
      }

      // 撤回二维码等消息
      for (const msgId of messagesToRecall) {
          try {
            await this.e.group.recallMsg(msgId);
          } catch (err) {
            logger.warn(`[DELTA FORCE PLUGIN] 撤回消息失败: ${msgId}`, err);
          }
      }

      const clientID = Config.getConfig()?.delta_force?.clientID;
      if (!clientID) {
          throw new Error('clientID 未配置，无法进行绑定');
      }

      // 记录绑定前的激活token
      const oldActiveToken = await utils.getAccount(this.e.user_id);

      const bindRes = await this.api.bindUser({
        frameworkToken: finalToken,
        platformID: this.e.user_id,
        clientID: clientID,
        clientType: 'qq'
      });

      if (bindRes && (bindRes.code === 0 || bindRes.success)) {

        // 获取用户现有账号列表
        const listRes = await this.api.getUserList({ clientID, platformID: this.e.user_id, clientType: 'qq' });

        if (!listRes || listRes.code !== 0 || !listRes.data) {
            await this.e.reply('获取账号列表失败，无法为您自动激活。请手动切换。');
            // 直接返回，不修改当前激活的token
            return true;
        }
        
        const newAccounts = listRes.data;
        const newlyBoundAccount = newAccounts.find(a => a.frameworkToken === finalToken);

        if (!newlyBoundAccount) {
            await this.e.reply('绑定成功，但未能从账号列表中确认，请手动切换。');
            return true;
        }

        // 获取当前活跃token（可能为null）
        const oldActiveToken = await utils.getAccount(this.e.user_id);
        let shouldActivateNewToken = false;
        
        // 确定新账号所属分组
        const newAccountType = newlyBoundAccount.tokenType.toLowerCase();
        let newAccountGroupKey;
        
        // 确定新账号所属分组
        if (['qq', 'wechat'].includes(newAccountType)) {
          newAccountGroupKey = 'qq_wechat';
        } else if (['wegame', 'wegame/wechat'].includes(newAccountType)) {
          newAccountGroupKey = 'wegame';
        } else if (newAccountType === 'qqsafe') {
          newAccountGroupKey = 'qqsafe';
        } else {
          newAccountGroupKey = 'other';
        }
        
        if (!oldActiveToken) {
          // Case 1: 没有激活账号，则直接激活新账号
          shouldActivateNewToken = true;
        } else {
          // Case 2: 已有激活账号，查找该账号信息
          const oldActiveAccount = newAccounts.find(acc => acc.frameworkToken === oldActiveToken);
          
          if (!oldActiveAccount) {
            // 原激活账号已失效或已被删除，激活新账号
            shouldActivateNewToken = true;
          } else {
            // 获取原账号的类型分组
            const oldAccountType = oldActiveAccount.tokenType.toLowerCase();
            let oldAccountGroupKey;
            
            if (['qq', 'wechat'].includes(oldAccountType)) {
              oldAccountGroupKey = 'qq_wechat';
            } else if (['wegame', 'wegame/wechat'].includes(oldAccountType)) {
              oldAccountGroupKey = 'wegame';
            } else if (oldAccountType === 'qqsafe') {
              oldAccountGroupKey = 'qqsafe';
            } else {
              oldAccountGroupKey = 'other';
            }
            
            // 只有在同一分组内才更新激活账号
            if (oldAccountGroupKey === newAccountGroupKey) {
              shouldActivateNewToken = true;
              logger.info(`[DELTA FORCE PLUGIN] 在同一分组(${newAccountGroupKey})内更新激活账号`);
            } else {
              logger.info(`[DELTA FORCE PLUGIN] 不同分组账号(${oldAccountGroupKey}->${newAccountGroupKey})，保持原激活账号不变`);
            }
          }
        }

        if (shouldActivateNewToken) {
          // 使用Account类中的分组激活方法
          const accountHelper = new Account({ user_id: this.e.user_id });
          await accountHelper.setGroupedActiveToken(this.e.user_id, newAccountGroupKey, finalToken);
          
          logger.info(`[DELTA FORCE PLUGIN] 已激活${newAccountGroupKey}分组新账号: ${finalToken.substring(0, 4)}****${finalToken.slice(-4)}`);
        } else {
          logger.info(`[DELTA FORCE PLUGIN] 保持原激活账号不变: ${oldActiveToken.substring(0, 4)}****${oldActiveToken.slice(-4)}`);
        }

        // 只有QQ和微信登录才尝试自动绑定角色
        if (['qq', 'wechat'].includes(originalPlatform)) {
            // 自动绑定角色
            const characterBindRes = await this.api.bindCharacter(finalToken);
            
            if (characterBindRes && characterBindRes.success && characterBindRes.roleInfo) {
              const { charac_name, level, tdmlevel, adultstatus } = characterBindRes.roleInfo;
              const isAdult = adultstatus === '0' ? '否' : '是';
        
              let charMsg = '登录绑定成功并角色信息已获取！\n';
              charMsg += '--- 角色信息 ---\n';
              charMsg += `昵称: ${charac_name}\n`;
              charMsg += `烽火地带等级: ${level}\n`;
              charMsg += `全面战场等级: ${tdmlevel}\n`;
              charMsg += `防沉迷: ${isAdult}`;
              
              await this.e.reply([segment.at(this.e.user_id), charMsg]);
            } else {
              const apiMsg = characterBindRes?.msg || characterBindRes?.message || '未知错误';
              await this.e.reply(`自动绑定角色失败: ${apiMsg}。\n您可以稍后使用 #三角洲角色绑定 手动绑定。`);
            }
        }

      } else {
        await this.e.reply(`登录失败: ${bindRes.msg || bindRes.message || '未知错误'}`);
      }

    } catch (error) {
      // 出错时也尝试撤回消息
      for (const msgId of messagesToRecall) {
          try {
            await this.e.group.recallMsg(msgId);
          } catch (err) {
            logger.warn(`[DELTA FORCE PLUGIN] 撤回消息失败: ${msgId}`, err);
          }
      }
      await this.e.reply(`登录失败: ${error.message}`);
    }

    return true
  }

  async loginWithCookie() {
    const match = this.e.msg.match(this.rule[1].reg);
    const cookie = match[3] ? match[3].trim() : '';

    if (!cookie) {
      const helpMsg = [
        '三角洲ck登陆教程：',
        '1. 准备via浏览器(或其他类似浏览器)，在浏览器中打开 https://pvp.qq.com/cp/a20161115tyf/page1.shtml',
        '2. 在网页中进行QQ登陆',
        '3. 点击左上角的网页名左侧的盾图标',
        '4. 点击查看cookies，然后复制全部内容',
        '5. 返回QQ，私聊机器人，发送 ^ck登陆 刚刚复制的cookies',
        '6. 成功登陆'
      ].join('\n');
      await this.e.reply(helpMsg);
      return true;
    }

    await this.e.reply('正在尝试使用Cookie登录，请稍候...');

    try {
      const res = await this.api.loginWithCookie(cookie);

      if (!res || (res.code !== 0 && !res.success)) {
        throw new Error(res.msg || res.message || 'Cookie登录失败，请检查Cookie是否有效');
      }

      const finalToken = res.frameworkToken;
      if (!finalToken) {
          throw new Error('未能获取到有效的Token');
      }

      // 使用统一的绑定和激活函数
      const result = await this.handleBindAndActivate(finalToken, 'Cookie登录');
      
      if (result.success) {
        await this.e.reply(result.message);

        // 如果需要自动绑定角色
        if (result.shouldBindCharacter) {
          const characterBindRes = await this.api.bindCharacter(finalToken);
          if (characterBindRes && characterBindRes.success && characterBindRes.roleInfo) {
            const { charac_name, level, tdmlevel, adultstatus } = characterBindRes.roleInfo;
            const isAdult = adultstatus === '0' ? '否' : '是';
            let charMsg = '角色信息已获取！\n';
            charMsg += '--- 角色信息 ---\n';
            charMsg += `昵称: ${charac_name}\n`;
            charMsg += `烽火地带等级: ${level}\n`;
            charMsg += `全面战场等级: ${tdmlevel}\n`;
            charMsg += `防沉迷: ${isAdult}`;
            await this.e.reply([segment.at(this.e.user_id), charMsg]);
          } else {
            const apiMsg = characterBindRes?.msg || characterBindRes?.message || '未知错误';
            await this.e.reply(`自动绑定角色失败: ${apiMsg}。\n您可以稍后使用 #三角洲角色绑定 手动绑定。`);
          }
        }
      } else {
        await this.e.reply(result.message);
      }
    } catch (error) {
      await this.e.reply(`登录失败: ${error.message}`);
    }

    return true;
  }

  async bindCharacter() {
    const match = this.e.msg.match(/^(#三角洲|\^)角色绑定\\s*([a-zA-Z0-9\\-]+)?$/);
    let token = match[2]; // Optional token from command

    if (!token) {
        token = await utils.getAccount(this.e.user_id);
    }

    if (!token) {
        await this.e.reply('您尚未登录或激活任何账号，请先使用 #三角洲登录，或提供一个有效的Token。');
        return true;
    }

    await this.e.reply('正在为您绑定游戏内角色，请稍候...');

    const res = await this.api.bindCharacter(token);
    
    if (await utils.handleApiError(res, this.e)) return true;

    if (res && res.success && res.roleInfo) {
      const { charac_name, level, tdmlevel, adultstatus } = res.roleInfo;
      const isAdult = adultstatus === '0' ? '否' : '是';

      let msg = '角色绑定成功！\n';
      msg += '--- 角色信息 ---\n';
      msg += `昵称: ${charac_name}\n`;
      msg += `烽火地带等级: ${level}\n`;
      msg += `全面战场等级: ${tdmlevel}\n`;
      msg += `防沉迷: ${isAdult}`;
      
      await this.e.reply([segment.at(this.e.user_id), msg]);
    } else {
      const apiMsg = res?.msg || res?.message || '未知错误';
      await this.e.reply(`角色绑定失败: ${apiMsg}`);
    }
    return true;
  }

  /**
   * QQ授权登录
   */
  async qqAuthLogin() {
    const match = this.e.msg.match(this.rule[2].reg);
    const authUrl = match[5] ? match[5].trim() : '';

    if (!authUrl) {
      // 没有提供授权链接，显示帮助信息
      try {
        const res = await this.api.getQqLinkAuth();
        
        if (!res || res.code !== 0 || !res.login_url || !res.frameworkToken) {
          await this.e.reply('获取授权链接失败，请稍后重试。');
          return true;
        }

        const helpMsg = [
          '三角洲QQ授权登陆教程：',
          `1. QQ内打开链接：${res.login_url}`,
          '2. 点击登陆',
          '3. 登陆成功后，点击右上角，选择复制链接',
          '4. 返回聊天界面，发送 ^qq授权登陆 刚刚复制的链接',
        ].join('\n');

        const helpMessage = await this.e.reply([segment.at(this.e.user_id), '\n', helpMsg]);
        // 存储教程消息ID，用于后续可能的撤回，10分钟后自动清理
        if (helpMessage?.message_id) {
          userHelpMessages.set(this.e.user_id, helpMessage.message_id);
          setTimeout(() => {
            userHelpMessages.delete(this.e.user_id);
          }, 10 * 60 * 1000);
        }
      } catch (error) {
        logger.error('[DELTA FORCE PLUGIN] QQ授权登录获取链接失败:', error);
        await this.e.reply('获取授权链接时发生错误，请稍后重试。');
      }
      return true;
    }


    try {
      // 从URL中提取authCode
      const authCode = this.extractAuthCodeFromUrl(authUrl);
      if (!authCode) {
        await this.e.reply('无法从链接中提取授权码，请确保链接包含 code= 参数。\n示例链接应该类似：https://milo.qq.com/...?code=XXXXXX&state=...');
        return true;
      }

      // 先获取frameworkToken
      const authRes = await this.api.getQqLinkAuth();
      if (!authRes || authRes.code !== 0 || !authRes.frameworkToken) {
        throw new Error('获取frameworkToken失败，请重试');
      }

      // 提交授权码
      const res = await this.api.submitQqLinkAuth(authRes.frameworkToken, authCode);
      
      if (!res || res.code !== 0) {
        throw new Error(res?.msg || res?.message || '授权码提交失败');
      }

      const finalToken = res.frameworkToken || authRes.frameworkToken;
      if (!finalToken) {
        throw new Error('未能获取到有效的Token');
      }

      // 尝试自动撤回用户的授权链接消息和教程消息
      const messagesToRecall = [];
      let recallFailedMessages = [];

      // 1. 尝试撤回用户发送的包含授权链接的消息
      if (this.e.message_id) {
        messagesToRecall.push({ id: this.e.message_id, type: '用户授权链接消息' });
      }

      // 2. 尝试撤回之前的教程消息（如果存在）
      const helpMessageId = userHelpMessages.get(this.e.user_id);
      if (helpMessageId) {
        messagesToRecall.push({ id: helpMessageId, type: '登录教程消息' });
        // 清理已使用的教程消息ID
        userHelpMessages.delete(this.e.user_id);
      }

      // 执行撤回操作
      for (const msgInfo of messagesToRecall) {
        try {
          await this.e.group.recallMsg(msgInfo.id);
          logger.info(`[DELTA FORCE PLUGIN] 成功撤回${msgInfo.type}: ${msgInfo.id}`);
        } catch (err) {
          logger.warn(`[DELTA FORCE PLUGIN] 撤回${msgInfo.type}失败: ${msgInfo.id}`, err);
          recallFailedMessages.push(msgInfo.type);
        }
      }

      // 根据撤回结果给出相应提示
      if (recallFailedMessages.length > 0) {
        const failedTypes = recallFailedMessages.join('、');
        await this.e.reply(`⚠️ 隐私提醒：机器人权限不足，无法自动撤回${failedTypes}，请您手动撤回以保护账号安全！`);
      } else if (messagesToRecall.length > 0) {
      }

      // -- 复用登录成功后的绑定逻辑 --
      const clientID = Config.getConfig()?.delta_force?.clientID;
      if (!clientID) {
        throw new Error('clientID 未配置，无法进行绑定');
      }

      const bindRes = await this.api.bindUser({
        frameworkToken: finalToken,
        platformID: this.e.user_id,
        clientID: clientID,
        clientType: 'qq'
      });

      if (bindRes && (bindRes.code === 0 || bindRes.success)) {
        // 使用统一的绑定和激活函数
        const result = await this.handleBindAndActivate(finalToken, 'QQ授权登录');
        
        if (result.success) {
          // 如果需要自动绑定角色
          if (result.shouldBindCharacter) {
            const characterBindRes = await this.api.bindCharacter(finalToken);
            if (characterBindRes && characterBindRes.success && characterBindRes.roleInfo) {
              const { charac_name, level, tdmlevel, adultstatus } = characterBindRes.roleInfo;
              const isAdult = adultstatus === '0' ? '否' : '是';
              
              let charMsg = '角色信息已获取！\n';
              charMsg += '--- 角色信息 ---\n';
              charMsg += `昵称: ${charac_name}\n`;
              charMsg += `烽火地带等级: ${level}\n`;
              charMsg += `全面战场等级: ${tdmlevel}\n`;
              charMsg += `防沉迷: ${isAdult}`;
              
              await this.e.reply([segment.at(this.e.user_id), charMsg]);
            } else {
              const apiMsg = characterBindRes?.msg || characterBindRes?.message || '未知错误';
              await this.e.reply(`自动绑定角色失败: ${apiMsg}。\n您可以稍后使用 #三角洲角色绑定 手动绑定。`);
            }
          }
        } else {
          await this.e.reply(result.message);
        }
      } else {
        await this.e.reply(`账号绑定失败: ${bindRes.msg || bindRes.message || '未知错误'}`);
      }
    } catch (error) {
      await this.e.reply(`授权登录失败: ${error.message}`);
    }

    return true;
  }



  /**
   * 从URL中提取authCode
   * @param {string} url - 授权成功后的URL
   * @returns {string|null} - 提取的authCode或null
   */
  extractAuthCodeFromUrl(url) {
    try {
      // 支持多种URL格式
      const urlObj = new URL(url);
      const code = urlObj.searchParams.get('code');
      if (code) {
        return code;
      }

      // 如果URL解析失败，尝试正则表达式提取
      const match = url.match(/[?&]code=([^&]+)/);
      return match ? match[1] : null;
    } catch (e) {
      // URL格式不正确，尝试正则表达式
      const match = url.match(/[?&]code=([^&]+)/);
      return match ? match[1] : null;
    }
  }

  /**
   * 网页登录
   */
  async webLogin() {
    const platformID = this.e.user_id;
    
    // 获取配置，判断是否允许其他机器人共用网页登陆数据
    const config = Config.getConfig()?.delta_force || {};
    const allowShareWithOtherBots = config.web_login?.allow_share_with_other_bots !== false; // 默认为false
    
    let webLoginUrl = `https://df.shallow.ink/qq-link-login?platformID=${platformID}`;
    
    // 如果不允许共用，添加botID参数
    if (!allowShareWithOtherBots) {
      // 获取机器人ID，优先使用Bot.uin，fallback到其他可能的标识
      const botID = Bot?.uin || Bot?.self_id || this.e?.self_id || 'unknown';
      webLoginUrl += `&botID=${botID}`;
    }

    // 发送网页登录链接
    const loginMessage = [
      '三角洲行动网页授权登陆：',
      '请打开：',
      webLoginUrl,
      '进行登陆，三分钟内登陆将会自动绑定'
    ].join('\n');

    const sentMsg = await this.e.reply([segment.at(this.e.user_id), '\n', loginMessage]);

    // 开始轮询登录状态
    const startTime = Date.now();
    const webLoginTimeout = 3 * 60 * 1000; // 3分钟超时
    const pollInterval = 3000; // 3秒轮询一次

    let activeTokens = new Set(); // 存储所有活跃的frameworkToken
    let notifiedPending = false;
    let pendingMsg = null; // 存储"正在等待登录"消息，用于撤回
    let isCompleted = false; // 标记是否已完成登录
    
    // 保存配置变量供轮询函数使用
    const shareConfig = allowShareWithOtherBots;

    const pollStatus = async () => {
      // 检查是否已完成或超时
      if (isCompleted) {
        return;
      }
      
      if (Date.now() - startTime > webLoginTimeout) {
        // 超时时尝试撤回相关消息
        const messagesToRecall = [];
        
        if (sentMsg?.message_id) {
          messagesToRecall.push({ id: sentMsg.message_id, type: '网页登录链接消息' });
        }
        
        if (pendingMsg?.message_id) {
          messagesToRecall.push({ id: pendingMsg.message_id, type: '等待登录提示消息' });
        }
        
        for (const msgInfo of messagesToRecall) {
          try {
            await this.e.group.recallMsg(msgInfo.id);
            logger.info(`[DELTA FORCE PLUGIN] 超时撤回${msgInfo.type}: ${msgInfo.id}`);
          } catch (err) {
            logger.warn(`[DELTA FORCE PLUGIN] 超时撤回${msgInfo.type}失败: ${msgInfo.id}`, err);
          }
        }
        
        await this.e.reply('网页登录已超时，请重新尝试。');
        isCompleted = true;
        return;
      }

      try {
        // 获取平台登录状态，如果不允许共用则传入botID
        let statusRes;
        if (!shareConfig) {
          const botID = Bot?.uin || Bot?.self_id || this.e?.self_id || 'unknown';
          statusRes = await this.api.getPlatformLoginStatus(platformID, botID);
        } else {
          statusRes = await this.api.getPlatformLoginStatus(platformID);
        }
        
        if (!statusRes || statusRes.code !== 0) {
          logger.warn(`[DELTA FORCE PLUGIN] 获取平台登录状态失败:`, statusRes);
          setTimeout(pollStatus, pollInterval);
          return;
        }

        const sessions = statusRes.sessions || [];
        
        if (sessions.length === 0) {
          // 没有会话，继续轮询
          setTimeout(pollStatus, pollInterval);
          return;
        }

        // 收集所有有效的frameworkToken（最多5个）
        const validTokens = sessions
          .filter(session => session.frameworkToken && session.status !== 'expired')
          .slice(-5) // 只取最近的5个
          .map(session => session.frameworkToken);

        // 检查是否有新的token
        for (const token of validTokens) {
          if (!activeTokens.has(token)) {
            activeTokens.add(token);
            logger.info(`[DELTA FORCE PLUGIN] 网页登录检测到新frameworkToken: ${token.substring(0, 4)}****`);
            
            if (!notifiedPending) {
              pendingMsg = await this.e.reply('已检测到网页登录会话，正在等待您完成登录...');
              notifiedPending = true;
            }
          }
        }

        // 并发轮询所有活跃的token状态
        if (activeTokens.size > 0) {
          const tokenArray = Array.from(activeTokens);
          logger.debug(`[DELTA FORCE PLUGIN] 正在轮询 ${tokenArray.length} 个frameworkToken状态`);
          
          // 并发检查所有token的状态
          const statusPromises = tokenArray.map(async (token) => {
            try {
              const loginStatusRes = await this.api.getQqLinkStatus(token);
              return { token, status: loginStatusRes };
            } catch (error) {
              logger.warn(`[DELTA FORCE PLUGIN] 轮询token ${token.substring(0, 4)}**** 状态失败:`, error);
              return { token, status: null };
            }
          });

          const results = await Promise.all(statusPromises);
          
          // 检查结果
          for (const { token, status } of results) {
            if (status && status.status === 'done') {
              // 检查是否和当前激活token相同，如果相同则跳过这个token，继续检查其他token
              const currentToken = await utils.getAccount(this.e.user_id);
              if (currentToken === token) {
                logger.info(`[DELTA FORCE PLUGIN] 网页登录token与当前激活token相同，跳过: ${token.substring(0, 4)}****`);
                // 从活跃token列表中移除，不再轮询
                activeTokens.delete(token);
                continue; // 跳过当前token，继续检查其他token
              }
              
              // 找到登录成功的token，执行绑定
              logger.info(`[DELTA FORCE PLUGIN] 网页登录成功，使用token: ${token.substring(0, 4)}****`);
              isCompleted = true;
              await this.handleWebLoginSuccess(token, { sentMsg, pendingMsg });
              return;
            } else if (status && status.status === 'expired') {
              // 移除过期的token
              activeTokens.delete(token);
              logger.info(`[DELTA FORCE PLUGIN] 移除过期token: ${token.substring(0, 4)}****`);
            }
          }
          
          // 如果所有token都过期了，撤回消息并提醒用户
          if (activeTokens.size === 0 && validTokens.length === 0) {
            const messagesToRecall = [];
            
            if (sentMsg?.message_id) {
              messagesToRecall.push({ id: sentMsg.message_id, type: '网页登录链接消息' });
            }
            
            if (pendingMsg?.message_id) {
              messagesToRecall.push({ id: pendingMsg.message_id, type: '等待登录提示消息' });
            }
            
            for (const msgInfo of messagesToRecall) {
              try {
                await this.e.group.recallMsg(msgInfo.id);
                logger.info(`[DELTA FORCE PLUGIN] 所有会话过期，撤回${msgInfo.type}: ${msgInfo.id}`);
              } catch (err) {
                logger.warn(`[DELTA FORCE PLUGIN] 撤回${msgInfo.type}失败: ${msgInfo.id}`, err);
              }
            }
            
            await this.e.reply('网页登录会话已过期，请重新尝试。');
            isCompleted = true;
            return;
          }
        }

        // 继续轮询
        if (!isCompleted) {
          setTimeout(pollStatus, pollInterval);
        }
        
      } catch (error) {
        logger.error(`[DELTA FORCE PLUGIN] 网页登录轮询失败:`, error);
        if (!isCompleted) {
          setTimeout(pollStatus, pollInterval * 2); // 错误时延长轮询间隔
        }
      }
    };

    // 开始轮询
    setTimeout(pollStatus, pollInterval);
    return true;
  }

  /**
   * 处理网页登录成功
   * @param {string} frameworkToken - 登录成功的token
   * @param {object} messages - 要撤回的消息对象 {sentMsg, pendingMsg}
   */
  async handleWebLoginSuccess(frameworkToken, messages) {
    try {
      // 尝试撤回相关消息
      const messagesToRecall = [];
      let recallFailedMessages = [];
      
      if (messages.sentMsg?.message_id) {
        messagesToRecall.push({ id: messages.sentMsg.message_id, type: '网页登录链接消息' });
      }
      
      if (messages.pendingMsg?.message_id) {
        messagesToRecall.push({ id: messages.pendingMsg.message_id, type: '等待登录提示消息' });
      }
      
      for (const msgInfo of messagesToRecall) {
        try {
          await this.e.group.recallMsg(msgInfo.id);
          logger.info(`[DELTA FORCE PLUGIN] 成功撤回${msgInfo.type}: ${msgInfo.id}`);
        } catch (err) {
          logger.warn(`[DELTA FORCE PLUGIN] 撤回${msgInfo.type}失败: ${msgInfo.id}`, err);
          recallFailedMessages.push(msgInfo.type);
        }
      }
      
      // 如果有撤回失败的消息，提醒用户
      if (recallFailedMessages.length > 0) {
        const failedTypes = recallFailedMessages.join('、');
        await this.e.reply(`⚠️ 隐私提醒：机器人权限不足，无法自动撤回${failedTypes}，建议您手动撤回以保护隐私安全！`);
      }

      // 使用统一的绑定和激活函数
      const result = await this.handleBindAndActivate(frameworkToken, '网页登录');
      
      if (result.success) {
        // 如果需要自动绑定角色
        if (result.shouldBindCharacter) {
          const characterBindRes = await this.api.bindCharacter(frameworkToken);
          if (characterBindRes && characterBindRes.success && characterBindRes.roleInfo) {
            const { charac_name, level, tdmlevel, adultstatus } = characterBindRes.roleInfo;
            const isAdult = adultstatus === '0' ? '否' : '是';
            
            let charMsg = '网页登录绑定成功并角色信息已获取！\n';
            charMsg += '--- 角色信息 ---\n';
            charMsg += `昵称: ${charac_name}\n`;
            charMsg += `烽火地带等级: ${level}\n`;
            charMsg += `全面战场等级: ${tdmlevel}\n`;
            charMsg += `防沉迷: ${isAdult}`;
            
            await this.e.reply([segment.at(this.e.user_id), charMsg]);
          } else {
            const apiMsg = characterBindRes?.msg || characterBindRes?.message || '未知错误';
            await this.e.reply(`网页登录成功！\n自动绑定角色失败: ${apiMsg}。\n您可以稍后使用 #三角洲角色绑定 手动绑定。`);
          }
        } else {
          await this.e.reply(result.message);
        }
      } else {
        await this.e.reply(result.message);
      }

    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 网页登录绑定失败:', error);
      await this.e.reply(`网页登录失败: ${error.message}`);
    }
  }

    /**
   * 统一的绑定和激活处理函数
   * @param {string} frameworkToken - 要绑定的Token
   * @param {string} loginType - 登录类型（用于日志和提示）
   * @returns {object} - 处理结果 {success: boolean, shouldBindCharacter: boolean, message?: string}
   */
    async handleBindAndActivate(frameworkToken, loginType = '登录') {
      try {
        const clientID = Config.getConfig()?.delta_force?.clientID;
        if (!clientID) {
          throw new Error('clientID 未配置，无法进行绑定');
        }
  
        // 绑定用户
        const bindRes = await this.api.bindUser({
          frameworkToken: frameworkToken,
          platformID: this.e.user_id,
          clientID: clientID,
          clientType: 'qq'
        });
  
        if (!bindRes || (bindRes.code !== 0 && !bindRes.success)) {
          return {
            success: false,
            shouldBindCharacter: false,
            message: `${loginType}账号绑定失败: ${bindRes?.msg || bindRes?.message || '未知错误'}`
          };
        }
  
        // 获取用户现有账号列表
        const listRes = await this.api.getUserList({ clientID, platformID: this.e.user_id, clientType: 'qq' });
  
        if (!listRes || listRes.code !== 0 || !listRes.data) {
          return {
            success: false,
            shouldBindCharacter: false,
            message: `${loginType}成功，但获取账号列表失败，请手动切换。`
          };
        }
        
        const newAccounts = listRes.data;
        const newlyBoundAccount = newAccounts.find(a => a.frameworkToken === frameworkToken);
  
        if (!newlyBoundAccount) {
          return {
            success: false,
            shouldBindCharacter: false,
            message: `${loginType}成功，但未能从账号列表中确认，请手动切换。`
          };
        }
  
        // 获取当前活跃token（可能为null）
        const oldActiveToken = await utils.getAccount(this.e.user_id);
        let shouldActivateNewToken = false;
        
        // 确定新账号所属分组
        const newAccountType = newlyBoundAccount.tokenType.toLowerCase();
        let newAccountGroupKey;
        
        // 确定新账号所属分组
        if (['qq', 'wechat'].includes(newAccountType)) {
          newAccountGroupKey = 'qq_wechat';
        } else if (['wegame', 'wegame/wechat'].includes(newAccountType)) {
          newAccountGroupKey = 'wegame';
        } else if (newAccountType === 'qqsafe') {
          newAccountGroupKey = 'qqsafe';
        } else {
          newAccountGroupKey = 'other';
        }
        
        if (!oldActiveToken) {
          // Case 1: 没有激活账号，则直接激活新账号
          shouldActivateNewToken = true;
        } else {
          // Case 2: 已有激活账号，查找该账号信息
          const oldActiveAccount = newAccounts.find(acc => acc.frameworkToken === oldActiveToken);
          
          if (!oldActiveAccount) {
            // 原激活账号已失效或已被删除，激活新账号
            shouldActivateNewToken = true;
          } else {
            // 获取原账号的类型分组
            const oldAccountType = oldActiveAccount.tokenType.toLowerCase();
            let oldAccountGroupKey;
            
            if (['qq', 'wechat'].includes(oldAccountType)) {
              oldAccountGroupKey = 'qq_wechat';
            } else if (['wegame', 'wegame/wechat'].includes(oldAccountType)) {
              oldAccountGroupKey = 'wegame';
            } else if (oldAccountType === 'qqsafe') {
              oldAccountGroupKey = 'qqsafe';
            } else {
              oldAccountGroupKey = 'other';
            }
            
            // 只有在同一分组内才更新激活账号
            if (oldAccountGroupKey === newAccountGroupKey) {
              shouldActivateNewToken = true;
              logger.info(`[DELTA FORCE PLUGIN] 在同一分组(${newAccountGroupKey})内更新激活账号`);
            } else {
              logger.info(`[DELTA FORCE PLUGIN] 不同分组账号(${oldAccountGroupKey}->${newAccountGroupKey})，保持原激活账号不变`);
            }
          }
        }
  
        if (shouldActivateNewToken) {
          // 使用Account类中的分组激活方法
          const accountHelper = new Account({ user_id: this.e.user_id });
          await accountHelper.setGroupedActiveToken(this.e.user_id, newAccountGroupKey, frameworkToken);
          
          logger.info(`[DELTA FORCE PLUGIN] 已通过${loginType}激活${newAccountGroupKey}分组新账号: ${frameworkToken.substring(0, 4)}****${frameworkToken.slice(-4)}`);
        } else {
          logger.info(`[DELTA FORCE PLUGIN] 保持原激活账号不变: ${oldActiveToken.substring(0, 4)}****${oldActiveToken.slice(-4)}`);
        }
  
        return {
          success: true,
          shouldBindCharacter: ['qq', 'wechat'].includes(newAccountType), // 只有QQ和微信登录才自动绑定角色
          message: `${loginType}成功，账号已自动绑定！`
        };
  
      } catch (error) {
        logger.error(`[DELTA FORCE PLUGIN] ${loginType}绑定失败:`, error);
        return {
          success: false,
          shouldBindCharacter: false,
          message: `${loginType}失败: ${error.message}`
        };
      }
    }
  
} 