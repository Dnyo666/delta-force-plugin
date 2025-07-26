import plugin from '../../../lib/plugins/plugin.js'
import utils from '../utils/utils.js'
import Code from '../components/Code.js'

// --- 数据字典 ---
const solMap = {
  '2231': '零号大坝-前夜', '2201': '零号大坝-常规', '2202': '零号大坝-机密',
  '1901': '长弓溪谷-常规', '1902': '长弓溪谷-机密',
  '3901': '航天基地-机密', '3902': '航天基地-绝密',
  '8102': '巴克什-机密', '8103': '巴克什-绝密',
  '8803': '潮汐监狱-绝密'
};
const mpMap = {
  '107': '沟壕战-攻防', '108': '沟壕战-占领',
  '302': '风暴眼-攻防', '303': '风暴眼-占领',
  '54': '攀升-攻防', '103': '攀升-占领',
  '75': '临界点-攻防', '113': '贯穿-攻防',
  '34': '烬区-占领', '112': '断轨-占领',
  '210': '临界点-占领'
};
const armedForce = {
  '10007': '红狼', '10010': '威龙', '10011': '无名', '20003': '蜂医',
  '20004': '蛊', '30008': '牧羊人', '30010': '未知干员', '40005': '露娜',
  '40010': '骇爪'
};
const escapeReason = {
  '1': '撤离成功', '2': '被玩家击杀', '3': '被人机击杀'
};
const mpResult = {
  '1': '胜利', '2': '失败', '3': '中途退出'
};

export class Record extends plugin {
  constructor (e) {
    super({
      name: '三角洲战绩',
      dsc: '查询三角洲行动战绩',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^#三角洲战绩(.*)$',
          fnc: 'getRecord'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
  }

  async getRecord () {
    const argStr = this.e.msg.replace(/^#三角洲战绩\s*/, '').trim();
    const args = argStr.split(/\s+/).filter(Boolean);

    let mode = 'sol'; // 默认模式为烽火地带
    let page = 1;     // 默认页数为1
    let modeName = '烽火地带';

    for (const arg of args) {
      if (['全面', '全面战场', '战场', 'mp'].includes(arg)) {
        mode = 'mp';
        modeName = '全面战场';
      } else if (['烽火', '烽火地带', 'sol', '摸金'].includes(arg)) {
        mode = 'sol';
        modeName = '烽火地带';
      } else if (!isNaN(parseInt(arg))) {
        page = parseInt(arg) > 0 ? parseInt(arg) : 1;
      }
    }

    const typeId = mode === 'sol' ? 4 : 5

    const token = await utils.getAccount(this.e.user_id)
    if (!token) {
      await this.e.reply('您尚未绑定账号，请使用 #三角洲登录 进行绑定。')
      return true
    }
    
    await this.e.reply(`正在查询 ${modeName} 的战绩 (第${page}页)，请稍候...`)
    
    const res = await this.api.getRecord(token, typeId, page)

    if (!res || res.success === false) {
      await this.e.reply(`查询战绩失败: ${res?.message || '服务无响应或发生未知错误'}`);
      return true;
    }

    if (!res.data || res.data.length === 0) {
      await this.e.reply(`暂无更多 ${modeName} 的战绩记录。`);
      return true;
    }

    // --- 构造转发消息 ---
    let { nickname } = this.e.bot;
    if (this.e.isGroup) {
        const info = await this.e.bot.getGroupMemberInfo(this.e.group_id, this.e.bot.uin);
        nickname = info.card || info.nickname;
    }
    const userInfo = {
        user_id: this.e.bot.uin,
        nickname
    };

    const records = res.data; 
    let forwardMsg = [];

    const title = `--- ${modeName}战绩 (第${page}页) ---`;
    forwardMsg.push({ ...userInfo, message: title });

    if (mode === 'sol') {
      records.forEach((r, i) => {
        let msg = '';
        const recordNum = (page - 1) * records.length + i + 1; // 修正编号计算
        const mapName = solMap[r.MapId] || `未知地图(${r.MapId})`
        const operator = armedForce[r.ArmedForceId] || `未知干员(${r.ArmedForceId})`
        const status = escapeReason[r.EscapeFailReason] || '撤离失败'
        const duration = utils.formatDuration(r.DurationS, 'seconds')
        const value = Number(r.FinalPrice).toLocaleString()

        msg += `#${recordNum}: ${r.dtEventTime}\n`
        msg += `地图: ${mapName} | 干员: ${operator}\n`
        msg += `状态: ${status} | 存活: ${duration}\n`
        msg += `带出价值: ${value}\n`
        msg += `击杀: 干员(${r.KillCount || 0}) / AI玩家(${r.KillPlayerAICount || 0}) / 其他AI(${r.KillAICount || 0})`
        
        forwardMsg.push({ ...userInfo, message: msg.trim() });
      });
    } else { // mode === 'mp'
      records.forEach((r, i) => {
        let mainMsg = '';
        let teamMsg = '';
        const recordNum = (page - 1) * records.length + i + 1; // 修正编号计算
        const mapName = mpMap[r.MapID] || `未知地图(${r.MapID})`
        const operator = armedForce[r.ArmedForceId] || `未知干员(${r.ArmedForceId})`
        const result = mpResult[r.MatchResult] || '未知结果'
        const duration = utils.formatDuration(r.gametime, 'seconds')

        mainMsg += `#${recordNum}: ${r.dtEventTime}\n`;
        mainMsg += `地图: ${mapName} | 干员: ${operator}\n`;
        mainMsg += `结果: ${result} | K/D/A: ${r.KillNum}/${r.Death}/${r.Assist}\n`;
        mainMsg += `得分: ${r.TotalScore.toLocaleString()} | 时长: ${duration}\n`;
        mainMsg += `救援: ${r.RescueTeammateCount}`;
        
        forwardMsg.push({ ...userInfo, message: mainMsg.trim() });

        const teamList = r.RoomInfo?.data?.mpDetailList;
        if (teamList && teamList.length > 0) {
            teamMsg += "--- 对局详情 ---\n";
            teamList.forEach(t => {
                const teamOperator = armedForce[t.armedForceType] || `干员(${t.armedForceType})`;
                // 解码昵称
                const nickName = decodeURIComponent(t.nickName || t.PlayerName || '未知玩家');
                const isCurrentUser = t.isCurrentUser ? ' (我)' : '';
                
                teamMsg += `${nickName}${isCurrentUser} (${teamOperator}):\n`;
                teamMsg += `  K/D/A: ${t.killNum}/${t.death}/${t.assist}, 得分: ${t.totalScore.toLocaleString()}\n`;
            });
            forwardMsg.push({ ...userInfo, message: teamMsg.trim() });
        }
      });
    }

    let msgToSend;
    if (this.e.group?.makeForwardMsg) {
      msgToSend = await this.e.group.makeForwardMsg(forwardMsg);
    } else if (this.e.friend?.makeForwardMsg) {
      msgToSend = await this.e.friend.makeForwardMsg(forwardMsg);
    } else {
      msgToSend = forwardMsg.map(item => item.message).join('\n\n---\n\n');
    }

    // 统一转发消息的标题
    const dec = `三角洲战绩-${modeName}`;
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

    await this.e.reply(msgToSend)
    return true
  }
} 