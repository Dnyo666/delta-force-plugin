import plugin from '../../../lib/plugins/plugin.js'
import fs from 'fs'
import path from 'path'
import Code from '../components/Code.js'
import Config from '../components/Config.js'
import { pluginRoot } from '../model/path.js'
import utils from '../utils/utils.js'
import { Account } from './Account.js'

const LOGIN_TIMEOUT = 180 * 1000; // 登录总超时时间，180秒
const POLL_INTERVAL = 1000; // 轮询间隔，1秒

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
        await this.e.reply('Cookie登录成功，账号已自动绑定！');

        // 自动激活Token
        const accountHelper = new Account({ user_id: this.e.user_id });
        await accountHelper.setGroupedActiveToken(this.e.user_id, 'qq_wechat', finalToken);
        logger.info(`[DELTA FORCE PLUGIN] 已通过Cookie登录激活qq_wechat分组新账号: ${finalToken.substring(0, 4)}****`);

        // 自动绑定角色
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
      } else {
        await this.e.reply(`账号绑定失败: ${bindRes.msg || bindRes.message || '未知错误'}`);
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
} 