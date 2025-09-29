import utils from '../utils/utils.js'
import Code from '../components/Code.js'
import DataManager from '../utils/Data.js'
import Render from '../components/Render.js'

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
    if (!timestamp || isNaN(timestamp)) return '未知';
    return new Date(timestamp * 1000).toLocaleString();
  }

  // 格式化时长函数
  formatDuration(value, unit = 'seconds') {
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
        solDuration: this.formatDuration(careerData.solduration),

        // 全面战场信息
        tdmLevel: roleInfo.tdmlevel || '-',
        tdmRankName: tdmRankName,
        tdmRankImage: tdmRankImagePath,
        tdmTotalFight: careerData.tdmtotalfight || '-',
        tdmTotalWin: careerData.totalwin || '-',
        tdmWinRatio: careerData.tdmsuccessratio || '-',
        tdmTotalKill: careerData.tdmtotalkill || '-',
        tdmDuration: this.formatDuration(careerData.tdmduration, 'minutes'),

        // 资产信息
        hafCoin: roleInfo.hafcoinnum?.toLocaleString() || '-',
        totalAssets: totalAssets > 0 ? totalAssets.toFixed(2) + 'M' : '-'
      };

      try {
        const img = await Render.render('Template/userInfo/userInfo.html', renderData, {
          e: this.e,
          retType: 'default',
          renderCfg: {
            viewport: {
              width: 1365,
              height: 640
            }
          }
        })

        // 检查图片数据是否有效 - 修复对象类型处理
        if (img) {
          try {
            return await this.e.reply(img)
          } catch (replyError) {
            logger.error('[三角洲信息] 发送图片失败:', replyError)
            // 如果发送失败，记录更详细的图片信息
            logger.error('[三角洲信息] 图片数据详情:', {
              type: typeof img,
              isBuffer: Buffer.isBuffer(img),
              isString: typeof img === 'string',
              constructor: img?.constructor?.name,
              keys: img && typeof img === 'object' ? Object.keys(img) : null
            })
            return await this.e.reply('图片发送失败，请稍后重试。')
          }
        } else {
          logger.error('[三角洲信息] 渲染失败: 图片数据为空')
          return await this.e.reply('图片渲染失败，请稍后重试。')
        }
      } catch (renderError) {
        logger.error('[三角洲信息] 渲染失败:', renderError)
        return await this.e.reply(`图片渲染失败: ${renderError.message}`)
      }

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