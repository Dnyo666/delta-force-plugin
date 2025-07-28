import plugin from '../../../lib/plugins/plugin.js'
import { segment } from 'oicq'
import fs from 'fs'
import path from 'path'
import Code from '../components/Code.js'
import Config from '../components/Config.js'
import { pluginRoot } from '../model/path.js'
import utils from '../utils/utils.js'

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
          reg: '^(#三角洲|\\^)(qq|微信|wx|wegame|qqsafe|安全中心|qq安全中心)?(登陆|登录)$',
          fnc: 'login'
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
    if (['wx', '微信'].includes(platform)) platform = 'wechat';
    if (['qqsafe', '安全中心', 'qq安全中心'].includes(platform)) platform = 'qqsafe';
    
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
    `\n请使用【${platform.toUpperCase()}】扫描二维码登录，有效期约2分钟。`,
    segment.image(qrImage),
    `\n\n【免责声明】\n扫码登录则代表向服务器授权数据。\n继续操作即表示您已了解并愿意承担相关风险。\n请勿扫描他人二维码`
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
        await this.e.reply('登录成功，账号已自动绑定！正在检查并更新激活状态...');

        const listRes = await this.api.getUserList({ clientID, platformID: this.e.user_id, clientType: 'qq' });

        if (!listRes || listRes.code !== 0 || !listRes.data) {
            await this.e.reply('获取账号列表失败，无法为您自动激活。请手动切换。');
            return true;
        }
        
        const newAccounts = listRes.data;
        const newlyBoundAccount = newAccounts.find(a => a.frameworkToken === finalToken);

        if (!newlyBoundAccount) {
            await this.e.reply('绑定成功，但未能从账号列表中确认，请手动切换。');
            return true;
        }

        let shouldActivateNewToken = false;

        // Case 1: 首次登录
        if (!oldActiveToken) {
            shouldActivateNewToken = true;
        } else {
            // Case 2: 分组首次登录或重新登录
            const newAccountType = newlyBoundAccount.tokenType.toLowerCase();
            let newAccountGroupKey = 'qq_wechat';
            if (newAccountType === 'wegame') newAccountGroupKey = 'wegame';
            if (newAccountType === 'qqsafe') newAccountGroupKey = 'qqsafe';
            
            const accountsInGroup = newAccounts.filter(a => {
                const type = a.tokenType.toLowerCase();
                if (newAccountGroupKey === 'qq_wechat') return ['qq', 'wechat'].includes(type);
                return type === newAccountGroupKey;
            });
            
            if (accountsInGroup.length === 1) {
                // 这个分组下只有一个号，说明是分组首次登录
                shouldActivateNewToken = true;
            } else {
                // Case 3: 检查是否是已激活账号的更新
                // 如果旧的激活token在绑定后的新列表中找不到了, 说明它被新的替换了
                const oldActiveAccountInNewList = newAccounts.find(a => a.frameworkToken === oldActiveToken);
                if (!oldActiveAccountInNewList) {
                    shouldActivateNewToken = true;
                }
            }
        }

        if (shouldActivateNewToken) {
            await utils.setActiveToken(this.e.user_id, finalToken);
        }

        // 自动绑定角色
        const characterBindRes = await this.api.bindCharacter(finalToken);
        
        if (characterBindRes && characterBindRes.success && characterBindRes.roleInfo) {
          const { charac_name, level, tdmlevel, adultstatus } = characterBindRes.roleInfo;
          const isAdult = adultstatus === '0' ? '否' : '是';
    
          let charMsg = '登录并绑定成功！\n';
          charMsg += '--- 角色信息 ---\n';
          charMsg += `昵称: ${charac_name}\n`;
          charMsg += `烽火地带等级: ${level}\n`;
          charMsg += `全面战场等级: ${tdmlevel}\n`;
          charMsg += `防沉迷: ${isAdult}`;
          
          await this.e.reply(charMsg);
        } else {
          const apiMsg = characterBindRes?.msg || characterBindRes?.message || '未知错误';
          await this.e.reply(`云端账号登录并绑定成功！\n但自动绑定角色失败: ${apiMsg}。\n您可以稍后使用 #三角洲角色绑定 手动绑定。`);
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

  async bindCharacter() {
    const match = this.e.msg.match(/^(#三角洲|\^)角色绑定\s*([a-zA-Z0-9\-]+)?$/);
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
    
    if (res && res.success && res.roleInfo) {
      const { charac_name, level, tdmlevel, adultstatus } = res.roleInfo;
      const isAdult = adultstatus === '0' ? '否' : '是';

      let msg = '角色绑定成功！\n';
      msg += '--- 角色信息 ---\n';
      msg += `昵称: ${charac_name}\n`;
      msg += `烽火地带等级: ${level}\n`;
      msg += `全面战场等级: ${tdmlevel}\n`;
      msg += `防沉迷: ${isAdult}`;
      
      await this.e.reply(msg);
    } else {
      const apiMsg = res?.msg || res?.message || '未知错误';
      if (apiMsg.includes('绑定大区')) {
        await this.e.reply('您尚未绑定大区，请绑定后，再使用此命令');
        return true
      }
      await this.e.reply(`角色绑定失败: ${apiMsg}`);
    }
    return true;
  }
} 