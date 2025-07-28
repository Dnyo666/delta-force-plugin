import plugin from '../../../lib/plugins/plugin.js'
import Code from '../components/Code.js'
import Config from '../components/Config.js'
import utils from '../utils/utils.js'

function getClientID () {
  const clientID = Config.getConfig()?.delta_force?.clientID
  if (!clientID) {
    console.error('clientID 未在配置文件中正确设置，请联系管理员。')
  }
  return clientID
}

export class Account extends plugin {
  constructor (e) {
    super({
      name: '三角洲账号管理',
      dsc: '手动绑定和管理账号 Token',
      event: 'message',
      priority: 101, // 优先级略低于Login
      rule: [
        {
          reg: '^(#三角洲|\\^)账号(列表)?$',
          fnc: 'showAccounts'
        },
        {
          reg: '^(#三角洲|\\^)绑定\\s*([a-zA-Z0-9\\-]+)$',
          fnc: 'bindToken'
        },
        {
          reg: '^(#三角洲|\\^)解绑\\s*(\\d+)$',
          fnc: 'unbindToken'
        },
        {
          reg: '^(#三角洲|\\^)?(账号切换|切换账号)\\s*(.*)$',
          fnc: 'switchAccount'
        },
        {
          reg: '^(#三角洲|\\^)(微信刷新|刷新微信)$',
          fnc: 'refreshWechat'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
  }

  /**
   * 获取并分组用户的账号列表
   * @returns {Promise<{
   *  all: Array, 
   *  grouped: {qq_wechat: Array, wegame: Array, qqsafe: Array}, 
   *  activeTokens: {qq_wechat: String, wegame: String, qqsafe: String}
   * }|null>}
   */
  async _getGroupedAccounts() {
    const clientID = getClientID();
    if (!clientID) {
      this.e.reply('clientID 未在配置文件中正确设置，请联系管理员。');
      return null;
    }

    // 获取各个分组的激活token
    const activeTokens = {
      qq_wechat: await this.getGroupedActiveToken(this.e.user_id, 'qq_wechat'),
      wegame: await this.getGroupedActiveToken(this.e.user_id, 'wegame'),
      qqsafe: await this.getGroupedActiveToken(this.e.user_id, 'qqsafe')
    };
    
    const res = await this.api.getUserList({ clientID, platformID: this.e.user_id, clientType: 'qq' });

    if (!res || res.code !== 0) {
      this.e.reply(`查询账号列表失败: ${res?.msg || res?.message || '未知错误'}`);
      return null;
    }
    
    const accounts = res.data || [];
    const grouped = {
      qq_wechat: [],
      wegame: [],
      qqsafe: []
    };
    
    // 用于解绑和切换时维持 showAccounts 的序号顺序
    const allInOrder = [];

    accounts.forEach(acc => {
      const type = acc.tokenType?.toLowerCase();
      if (type === 'qq' || type === 'wechat') {
        grouped.qq_wechat.push(acc);
      } else if (type === 'wegame' || type === 'wegame/wechat') {
        grouped.wegame.push(acc);
      } else if (type === 'qqsafe') {
        grouped.qqsafe.push(acc);
      }
    });
    
    // 按照分组顺序构建完整列表
    allInOrder.push(...grouped.qq_wechat);
    allInOrder.push(...grouped.wegame);
    allInOrder.push(...grouped.qqsafe);

    return { all: allInOrder, grouped, activeTokens };
  }


  async bindToken () {
    const token = this.e.msg.match(/^(#三角洲|\^)绑定\s*([a-zA-Z0-9\-]+)$/)[2]
    this.e.reply('正在尝试绑定 Token...')

    const clientID = getClientID();
    if (!clientID) {
      this.e.reply('clientID 未在配置文件中正确设置，请联系管理员。')
      return true;
    }

    const res = await this.api.bindUser({
      frameworkToken: token,
      platformID: this.e.user_id,
      clientID: clientID,
      clientType: 'qq' // 假设都通过QQ机器人绑定
    })
    
    if (res && (res.code === 0 || res.success)) {
      // 绑定成功后不再操作本地存储，让列表实时从API获取
      this.e.reply('账号手动绑定成功！')
    } else {
      this.e.reply(`绑定失败: ${res.msg || '未知错误'}`)
    }
  }

  async showAccounts () {
    const accountData = await this._getGroupedAccounts();
    if (!accountData) return true;
    
    const { grouped, activeTokens } = accountData;

    if (accountData.all.length === 0) {
        await this.e.reply('您尚未绑定任何账号，请使用 #三角洲登录 进行绑定。');
        return true;
    }

    let msg = `【${this.e.sender.card || this.e.sender.nickname}】绑定的账号列表：\n`;
    let overallIndex = 1;

    const buildGroupMsg = (title, group, groupKey) => {
      if (group.length > 0) {
        msg += `---${title}---\n`;
        const groupActiveToken = activeTokens[groupKey]; // 获取该分组的激活token
        
        group.forEach(acc => {
          const token = acc.frameworkToken;
          const displayedToken = this.e.isGroup
            ? `${token.substring(0, 4)}****${token.slice(-4)}`
            : token;
          const status = acc.isValid ? '【有效】' : '【失效】';
          const isActive = (token === groupActiveToken) ? '✅' : ''; // 使用分组激活token判断
          const qqDisplay = acc.qqNumber ? `(${acc.qqNumber.slice(0, 4)}****)` : '';

          msg += `${overallIndex++}. ${isActive}【${acc.tokenType.toUpperCase()}】${qqDisplay} ${displayedToken} ${status}\n`;
        });
      }
    };

    buildGroupMsg('QQ & 微信', grouped.qq_wechat, 'qq_wechat');
    buildGroupMsg('Wegame', grouped.wegame, 'wegame');
    buildGroupMsg('QQ安全中心', grouped.qqsafe, 'qqsafe');

    msg += '\n可通过 #三角洲解绑 <序号> 来解绑账号。';
    msg += '\n使用 #三角洲账号切换 <序号> 可切换当前激活账号。';
    
    await this.e.reply(msg.trim());
    return true;
  }

  async unbindToken () {
      const index = parseInt(this.e.msg.match(/\d+$/)[0]) - 1;
      
      const accountData = await this._getGroupedAccounts();
      if (!accountData) return true;
      
      const { all } = accountData;

      if (index < 0 || index >= all.length) {
          await this.e.reply('序号无效，请发送 #三角洲账号 查看正确的序号。');
          return true;
      }
      
      const tokenToUnbind = all[index].frameworkToken;
      const clientID = getClientID(); // _getGroupedAccounts已确保存在

      const unbindRes = await this.api.unbindUser({
          frameworkToken: tokenToUnbind,
          platformID: this.e.user_id,
          clientID: clientID,
          clientType: 'qq'
      });

      if (unbindRes && (unbindRes.code === 0 || unbindRes.success)) {
          await this.e.reply('解绑成功！');
      } else {
          await this.e.reply(`解绑失败: ${unbindRes.msg || unbindRes.message || '未知错误'}`);
      }
      return true;
  }

  /**
   * 获取指定分组的激活token
   * @param {string} user_id - 用户ID
   * @param {string} group - 分组名称 (qq_wechat, wegame, qqsafe)
   * @returns {Promise<string|null>} - 该分组的激活token或null
   */
  async getGroupedActiveToken(user_id, group) {
    try {
      // 从Redis获取当前分组的激活token
      return await redis.get(`delta-force:${group}-token:${user_id}`);
    } catch (e) {
      logger.error(`[DELTA FORCE PLUGIN] 获取${group}分组Token失败:`, e);
      return null;
    }
  }
  
  /**
   * 设置指定分组的激活token
   * @param {string} user_id - 用户ID
   * @param {string} group - 分组名称 (qq_wechat, wegame, qqsafe)
   * @param {string} token - 要设置的token
   * @returns {Promise<boolean>} - 设置是否成功
   */
  async setGroupedActiveToken(user_id, group, token) {
    try {
      // 设置当前分组的激活token
      await redis.set(`delta-force:${group}-token:${user_id}`, token);
      
      // 如果是QQ&微信分组，同时设置主激活token（向后兼容）
      if (group === 'qq_wechat') {
        await redis.set(`delta-force:active-token:${user_id}`, token);
      }
      
      return true;
    } catch (e) {
      logger.error(`[DELTA FORCE PLUGIN] 设置${group}分组Token失败:`, e);
      return false;
    }
  }
  
  /**
   * 确定账号所属的分组
   * @param {Object} account - 账号对象
   * @returns {string} - 分组名称 (qq_wechat, wegame, qqsafe, other)
   */
  getAccountGroup(account) {
    const tokenType = account.tokenType.toLowerCase();
    
    if (['qq', 'wechat'].includes(tokenType)) {
      return 'qq_wechat';
    } else if (['wegame', 'wegame/wechat'].includes(tokenType)) {
      return 'wegame';
    } else if (tokenType === 'qqsafe') {
      return 'qqsafe';
    } else {
      return 'other';
    }
  }

  async switchAccount () {
    const args = this.e.msg.replace(/^(#三角洲|\^)?(账号切换|切换账号)\s*/, '').trim().split(' ');
    
    if (isNaN(args[0])) {
      await this.e.reply('指令格式错误，请使用：#三角洲账号切换 <序号>');
      return true;
    }
    const targetIndex = parseInt(args[0]) - 1;
    
    const accountData = await this._getGroupedAccounts();
    if (!accountData) return true;

    const { all } = accountData;

    if (targetIndex < 0 || targetIndex >= all.length) {
      await this.e.reply('序号无效，请检查序号是否正确。');
      return true;
    }

    const targetAccount = all[targetIndex];
    if (!targetAccount.isValid) {
      await this.e.reply('该账号已失效，无法切换。');
      return true;
    }
    
    // 确定目标账号所属分组
    const targetGroup = this.getAccountGroup(targetAccount);
    const targetToken = targetAccount.frameworkToken;
    
    // 只更新该分组的激活账号
    await this.setGroupedActiveToken(this.e.user_id, targetGroup, targetToken);
    
    // 获取激活状态的信息描述
    const groupNames = {
      'qq_wechat': 'QQ/微信',
      'wegame': 'WeGame',
      'qqsafe': 'QQ安全中心',
      'other': '其他'
    };
    
    const maskedToken = `${targetToken.substring(0, 4)}****${targetToken.slice(-4)}`;
    const qqDisplay = targetAccount.qqNumber ? ` (${targetAccount.qqNumber.slice(0, 4)}****)` : '';
    await this.e.reply(`账号切换成功！\n当前${groupNames[targetGroup]}分组使用账号:${qqDisplay} ${maskedToken}`);
    
    return true;
  }

  /**
   * 手动刷新微信登录状态
   * @returns {Promise<boolean>}
   */
  async refreshWechat() {
    const token = await utils.getAccount(this.e.user_id);
    if (!token) {
      await this.e.reply('您尚未绑定账号，请使用 #三角洲登录 进行绑定。');
      return true;
    }
    
    await this.e.reply('正在刷新微信登录状态，请稍候...');
    
    const res = await this.api.refreshLogin('wechat', token);
    
    if (await utils.handleApiError(res, this.e)) return true;
    
    if (res.success) {
      await this.e.reply(`微信登录状态刷新成功！`);
    } else {
      await this.e.reply(`刷新失败：${res.message || '未知错误'}`);
    }
    
    return true;
  }
}