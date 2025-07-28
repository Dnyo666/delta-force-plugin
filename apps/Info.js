import plugin from '../../../lib/plugins/plugin.js'
import utils from '../utils/utils.js'
import Code from '../components/Code.js'
import DataManager from '../utils/Data.js'
import { segment } from 'oicq'

export class Info extends plugin {
  constructor (e) {
    super({
      name: '三角洲信息',
      dsc: '查询三角洲行动个人信息',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)(信息|info)$',
          fnc: 'getUserInfo'
        },
        {
          reg: '^(#三角洲|\\^)(uid|UID)$',
          fnc: 'getUid'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
  }

  async getUserInfo () {
    const token = await utils.getAccount(this.e.user_id)
    if (!token) {
      await this.e.reply('您尚未绑定账号，请使用 #三角洲登录 进行绑定。')
      return true
    }

    await this.e.reply('正在查询您的个人信息，请稍候...')

    const res = await this.api.getPersonalInfo(token)

    // 检查是否需要先绑定大区
    if (DataManager.isRegionBindingRequired(res)) {
      await this.e.reply('您尚未绑定游戏大区！请先使用 #三角洲角色绑定 命令进行绑定。')
      return true
    }

    if (!res || !res.data || !res.roleInfo) {
      await this.e.reply(`查询失败: ${res.msg || 'API 返回数据格式不正确'}`)
      return true
    }

    const { userData } = res.data;
    const { roleInfo } = res;

    // --- 数据处理 ---
    const decode = (str) => {
        try { return decodeURIComponent(str || '') } catch (e) { return str || '' }
    }
    const formatDate = (timestamp) => {
        if (!timestamp || isNaN(timestamp)) return '未知';
        return new Date(timestamp * 1000).toLocaleString();
    }
    const channelMap = {
        '10430644': 'PC官启',
        '10430645': 'WeGame',
        '10025553': '安卓手游',
        '10003898': '微信',
        '2002022121601': 'Wegame-QQ',
        '1001': 'iPad-QQ'
    };

    userData.charac_name = decode(userData.charac_name);
    userData.picurl = decode(userData.picurl);
    
    // --- 头像URL处理 ---
    let finalPicUrl = userData.picurl;
    if (finalPicUrl && /^[0-9]+$/.test(finalPicUrl)) {
      finalPicUrl = `https://wegame.gtimg.com/g.2001918-r.ea725/helper/df/skin//${finalPicUrl}.webp`;
    }
    
    // --- 消息拼接 ---
    let msg = '【个人账户信息】\n';
    const maskedUid = roleInfo.uid ? `${roleInfo.uid.substring(0, 4)}****${roleInfo.uid.slice(-4)}` : '-';
    const isAdult = roleInfo.adultstatus === '0' ? '否' : (roleInfo.adultstatus === '1' ? '是' : '未知');
    const isBanUser = roleInfo.isbanuser === '1' ? '是' : '否';
    const isBanSpeak = roleInfo.isbanspeak === '1' ? '是' : '否';

    msg += `昵称: ${userData.charac_name || roleInfo.charac_name || '未知'}\n`;
    msg += `等级: ${roleInfo.level || '-'}\n`;
    msg += `UID: ${maskedUid}\n`;
    msg += `哈夫币: ${roleInfo.hafcoinnum?.toLocaleString() || '-'}\n`;
    msg += `仓库总值: ${roleInfo.propcapital?.toLocaleString() || '-'}\n`;
    msg += `账号封禁: ${isBanUser} | 禁言: ${isBanSpeak} | 防沉迷: ${isAdult}\n`;
    msg += `注册时间: ${formatDate(roleInfo.register_time)}\n`;
    msg += `最近登录: ${formatDate(roleInfo.lastlogintime)}\n`;
    msg += `登录渠道: ${channelMap[roleInfo.loginchannel] || roleInfo.loginchannel || '未知'}\n`;

    // 发送头像和文本信息
    if (finalPicUrl) {
        await this.e.reply([segment.image(finalPicUrl), msg.trim()]);
    } else {
        await this.e.reply(msg.trim());
    }
    
    return true
  }

  async getUid() {
    const token = await utils.getAccount(this.e.user_id)
    if (!token) {
      await this.e.reply('您尚未绑定账号，请使用 #三角洲登录 进行绑定。')
      return true
    }

    const res = await this.api.getPersonalInfo(token)
    
    // 检查是否需要先绑定大区
    if (DataManager.isRegionBindingRequired(res)) {
      await this.e.reply('您尚未绑定游戏大区！请先使用 #三角洲角色绑定 命令进行绑定。')
      return true
    }
    
    if (!res || !res.roleInfo) {
      await this.e.reply(`查询失败: ${res.msg || 'API 返回数据格式不正确'}`)
      return true
    }
    
    const { roleInfo } = res;
    const nickName = roleInfo.charac_name || '未知';
    const uid = roleInfo.uid || '未获取到';
    
    await this.e.reply([
      segment.at(this.e.user_id),
      `\n昵称: ${nickName}\nUID: ${uid}`
    ]);
    return true;
  }
} 