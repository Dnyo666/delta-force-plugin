import utils from '../../utils/utils.js'
import Code from '../../components/Code.js'
import DataManager from '../../utils/Data.js'
import Render from '../../components/Render.js'

export class Info extends plugin {
  constructor(e) {
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

  // URL解码函数
  decode(str) {
    try {
      return decodeURIComponent(str || '')
    } catch (e) {
      return str || ''
    }
  }

  // 格式化时间函数
  formatDate(timestamp) {
    if (!timestamp) return '未知';
    
    // 尝试转换为数字
    let ts = Number(timestamp);
    if (isNaN(ts)) return '未知';
    
    // 判断是秒还是毫秒时间戳（大于 10^12 认为是毫秒）
    if (ts < 10000000000) {
      ts = ts * 1000; // 秒转毫秒
    }
    
    try {
      const date = new Date(ts);
      if (isNaN(date.getTime())) return '未知';
      
      // 格式化为 MM/DD/YYYY, H:MM:SS AM/PM 格式
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      // 12小时制
      const hour12 = hours % 12 || 12;
      const ampm = hours >= 12 ? 'PM' : 'AM';
      
      return `${month}/${day}/${year}, ${hour12}:${minutes}:${seconds} ${ampm}`;
    } catch (e) {
      return '未知';
    }
  }

  async getUserInfo() {
    const token = await utils.getAccount(this.e.user_id)
    if (!token) {
      return await this.e.reply([segment.at(this.e.user_id), '您尚未绑定账号，请使用 #三角洲登录 进行绑定。'])
    }

    await this.e.reply('正在生成个人信息，请稍候...')

    try {
      const res = await this.api.getPersonalInfo(token)

      if (await utils.handleApiError(res, this.e)) return true;

      if (!res.data || !res.roleInfo || !res.data.careerData) {
        return await this.e.reply(`查询失败: API 返回数据格式不正确`)
      }

      const { userData, careerData } = res.data;
      const { roleInfo } = res;

      // 数据提取与格式化
      const nickName = this.decode(userData.charac_name || roleInfo.charac_name) || '未知';
      let picUrl = this.decode(userData.picurl || roleInfo.picurl);
      if (picUrl && /^[0-9]+$/.test(picUrl)) {
        picUrl = `https://wegame.gtimg.com/g.2001918-r.ea725/helper/df/skin/${picUrl}.webp`;
      }

      const isBanUser = roleInfo.isbanuser === '1' ? '封禁' : '正常';
      const isBanSpeak = roleInfo.isbanspeak === '1' ? '禁言' : '正常';
      const isAdult = roleInfo.adultstatus === '0' ? '已成年' : '未成年';

      // 计算资产
      const propCapital = parseFloat(roleInfo.propcapital) || 0;
      const hafcoinNum = parseFloat(roleInfo.hafcoinnum) || 0;
      const totalAssets = (propCapital + hafcoinNum) / 1000000;

      // 段位信息处理
      const solRank = careerData.rankpoint ? DataManager.getRankByScore(careerData.rankpoint, 'sol') : '-';
      const tdmRank = careerData.tdmrankpoint ? DataManager.getRankByScore(careerData.tdmrankpoint, 'tdm') : '-';

      // 获取段位图片路径
      const solRankImagePath = DataManager.getRankImagePath(solRank, 'sol');
      const tdmRankImagePath = DataManager.getRankImagePath(tdmRank, 'mp');

      // 移除分数部分，保留完整段位名称
      const solRankName = solRank.replace(/\s*\(\d+\)/, '');
      const tdmRankName = tdmRank.replace(/\s*\(\d+\)/, '');

      // 构建渲染数据
      const renderData = {
        // 背景和基础信息 - 移除模板变量，直接使用相对路径
        backgroundImage: DataManager.getRandomBackground(),
        userName: nickName,
        userAvatar: picUrl,
        registerTime: this.formatDate(roleInfo.register_time),
        lastLoginTime: this.formatDate(roleInfo.lastlogintime),
        accountStatus: `账号封禁: ${isBanUser} | 禁言: ${isBanSpeak} | 防沉迷: ${isAdult}`,

        // 烽火地带信息
        solLevel: roleInfo.level || '-',
        solRankName: solRankName,
        solRankImage: solRankImagePath,
        solTotalFight: careerData.soltotalfght || '-',
        solTotalEscape: careerData.solttotalescape || '-',
        solEscapeRatio: careerData.solescaperatio || '-',
        solTotalKill: careerData.soltotalkill || '-',
        solDuration: utils.formatDuration(careerData.solduration),

        // 全面战场信息
        tdmLevel: roleInfo.tdmlevel || '-',
        tdmRankName: tdmRankName,
        tdmRankImage: tdmRankImagePath,
        tdmTotalFight: careerData.tdmtotalfight || '-',
        tdmTotalWin: careerData.totalwin || '-',
        tdmWinRatio: careerData.tdmsuccessratio || '-',
        tdmTotalKill: careerData.tdmtotalkill || '-',
        tdmDuration: utils.formatDuration(careerData.tdmduration, 'minutes'),

        // 资产信息
        hafCoin: roleInfo.hafcoinnum?.toLocaleString() || '-',
        totalAssets: totalAssets > 0 ? totalAssets.toFixed(2) + 'M' : '-'
      };

      return await Render.render('Template/userInfo/userInfo.html', renderData, {
        e: this.e,
        retType: 'default',
        renderCfg: {
          viewport: {
            width: 1365,
            height: 640
          }
        }
      })

    } catch (error) {
      logger.error('[三角洲信息] 查询失败:', error)
      await this.e.reply([
        segment.at(this.e.user_id),
        `\n查询个人信息失败: ${error.message}\n\n请检查：\n1. 账号是否已登录或过期\n2. 是否已绑定游戏角色\n3. 网络连接是否正常`
      ])
    }
    return
  }

  async getUid() {
    const token = await utils.getAccount(this.e.user_id)
    if (!token) {
      return await this.e.reply('您尚未绑定账号，请使用 #三角洲登录 进行绑定。')
    }

    const res = await this.api.getPersonalInfo(token)

    if (await utils.handleApiError(res, this.e)) return;

    if (!res.roleInfo) {
      return await this.e.reply(`查询失败: API 返回数据格式不正确`)
    }

    const { roleInfo } = res;
    const nickName = roleInfo.charac_name || '未知';
    const uid = roleInfo.uid || '未获取到';

    await this.e.reply([
      segment.at(this.e.user_id),
      `\n昵称: ${nickName}\nUID: ${uid}`
    ]);
    return;
  }
}