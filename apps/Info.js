import utils from '../utils/utils.js'
import Code from '../components/Code.js'
import DataManager from '../utils/Data.js'

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
      await this.e.reply([segment.at(this.e.user_id), '您尚未绑定账号，请使用 #三角洲登录 进行绑定。'])
      return true
    }


    const res = await this.api.getPersonalInfo(token)

    if (await utils.handleApiError(res, this.e)) return true;

    if (!res.data || !res.roleInfo || !res.data.careerData) {
      await this.e.reply(`查询失败: API 返回数据格式不正确`)
      return true
    }

    const { userData, careerData } = res.data;
    const { roleInfo } = res;

    // --- 数据处理函数 ---
    const decode = (str) => {
        try { return decodeURIComponent(str || '') } catch (e) { return str || '' }
    }
    const formatDate = (timestamp) => {
        if (!timestamp || isNaN(timestamp)) return '未知';
        return new Date(timestamp * 1000).toLocaleString();
    }
    const formatDuration = (value, unit = 'seconds') => {
        if (!value || isNaN(value)) return '未知';
        const numValue = Number(value);
        if (isNaN(numValue)) return '未知';

        let totalMinutes;
        if (unit === 'seconds') {
            totalMinutes = Math.floor(numValue / 60);
        } else { // minutes
            totalMinutes = numValue;
        }
        const h = Math.floor(totalMinutes / 60);
        const m = Math.floor(totalMinutes % 60);
        return `${h}小时${m}分钟`;
    }
    const channelMap = {
        '10430644': 'PC官启',
        '10430645': 'WeGame',
        '10025553': '安卓手游',
        '10003898': '微信',
        '2002022121601': 'Wegame-QQ',
        '1001': 'iPad-QQ'
    };

    // --- 数据提取与格式化 ---
    const nickName = decode(userData.charac_name || roleInfo.charac_name) || '未知';
    let picUrl = decode(userData.picurl || roleInfo.picurl);
    if (picUrl && /^[0-9]+$/.test(picUrl)) {
      picUrl = `https://wegame.gtimg.com/g.2001918-r.ea725/helper/df/skin/${picUrl}.webp`;
    }
    const isBanUser = roleInfo.isbanuser === '1' ? '封禁' : '正常';
    const isBanSpeak = roleInfo.isbanspeak === '1' ? '禁言' : '正常';
    const isAdult = roleInfo.adultstatus === '0' ? '已成年' : '未成年';

    // --- 消息拼接 ---
    let msg = `【${nickName}的个人信息】\n`;
    
    // 账户信息
    msg += "--- 账户信息 ---\n";
    const propCapital = parseFloat(roleInfo.propcapital) || 0;
    const hafcoinNum = parseFloat(roleInfo.hafcoinnum) || 0;
    const totalAssets = (propCapital + hafcoinNum) / 1000000;
    msg += `哈夫币: ${roleInfo.hafcoinnum?.toLocaleString() || '-'}\n`;
    msg += `仓库流动资产: ${totalAssets > 0 ? totalAssets.toFixed(2) + 'M' : '-'}\n`;
    msg += `注册时间: ${formatDate(roleInfo.register_time)}\n`;
    msg += `上次登录: ${formatDate(roleInfo.lastlogintime)}\n`;
    msg += `登录渠道: ${channelMap[roleInfo.loginchannel] || roleInfo.loginchannel || '未知'}\n`;
    msg += `账号封禁: ${isBanUser} | 禁言: ${isBanSpeak} | 防沉迷: ${isAdult}\n`;
    
    // 烽火地带生涯
    msg += "\n--- 烽火地带信息 ---\n";
    msg += `等级: ${roleInfo.level || '-'} | 排位分: ${careerData.rankpoint || '-'}\n`;
    msg += `总对局: ${careerData.soltotalfght || '-'} | 总撤离: ${careerData.solttotalescape || '-'}\n`;
    msg += `撤离率: ${careerData.solescaperatio || '-'} | 总击杀: ${careerData.soltotalkill || '-'}\n`;
    msg += `游玩时长: ${formatDuration(careerData.solduration)}`;

    // 全面战场生涯
    msg += "\n--- 全面战场信息 ---\n";
    msg += `等级: ${roleInfo.tdmlevel || '-'} | 排位分: ${careerData.tdmrankpoint || '-'}\n`;
    msg += `总对局: ${careerData.tdmtotalfight || '-'} | 总胜利: ${careerData.totalwin || '-'}\n`;
    msg += `胜率: ${careerData.tdmsuccessratio || '-'} | 总击杀: ${careerData.tdmtotalkill || '-'}\n`;
    msg += `游玩时长: ${formatDuration(careerData.tdmduration, 'minutes')}`;


    // 发送头像和文本信息
    if (picUrl) {
        await this.e.reply([segment.image(picUrl), msg.trim()]);
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
    
    if (await utils.handleApiError(res, this.e)) return true;
    
    if (!res.roleInfo) {
      await this.e.reply(`查询失败: API 返回数据格式不正确`)
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