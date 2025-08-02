import utils from '../utils/utils.js'
import Code from '../components/Code.js'
import DataManager from '../utils/Data.js'

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
          reg: '^(#三角洲|\\^)战绩(.*)$',
          fnc: 'getRecord'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
  }

  async getRecord (e) {
    const match = e.msg.match(/^(#三角洲|\^)战绩\s*(.*)$/);
    const argStr = match ? match[2].trim() : '';
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

    const token = await utils.getAccount(e.user_id)
    if (!token) {
      await e.reply('您尚未绑定账号，请使用 #三角洲登录 进行绑定。')
      return true
    }
    
    await e.reply(`正在查询 ${modeName} 的战绩 (第${page}页)，请稍候...`);

    const res = await this.api.getRecord(token, typeId, page);

    if (await utils.handleApiError(res, e)) return true;

    if (!res.data || !Array.isArray(res.data)) {
      await e.reply(`查询失败: API 返回的数据格式不正确或战绩列表为空。`);
      return true;
    }

    const records = res.data;
    
    if (records.length === 0) {
      await e.reply(`您在 ${modeName} (第${page}页) 没有更多战绩记录。`);
      return true;
    }

    // --- 构造转发消息 ---
    const userInfo = {
      user_id: e.user_id,
      nickname: e.sender.nickname
    };
    
    let forwardMsg = [];
    const title = `【${modeName}战绩 - 第${page}页】`;
    forwardMsg.push({ ...userInfo, message: title });

    if (mode === 'sol') {
      for (const r of records) {
        const i = records.indexOf(r);
        let msg = '';
        const recordNum = (page - 1) * records.length + i + 1;
        const mapName = DataManager.getMapName(r.MapId);
        const operator = DataManager.getOperatorName(r.ArmedForceId);
        const status = escapeReason[r.EscapeFailReason] || '撤离失败'
        const duration = utils.formatDuration(r.DurationS, 'seconds')
        const value = Number(r.FinalPrice).toLocaleString()
        const income = r.flowCalGainedPrice ? Number(r.flowCalGainedPrice).toLocaleString() : '未知'

        msg += `#${recordNum}: ${r.dtEventTime}\n`
        msg += `地图: ${mapName} | 干员: ${operator}\n`
        msg += `状态: ${status} | 存活: ${duration}\n`
        msg += `带出价值: ${value} | 净收益: ${income}\n`
        msg += `击杀: 干员(${r.KillCount || 0}) / AI玩家(${r.KillPlayerAICount || 0}) / 其他AI(${r.KillAICount || 0})`
        
        forwardMsg.push({ ...userInfo, message: msg.trim() });
      }
    } else { // mode === 'mp'
      for (const r of records) {
        const i = records.indexOf(r);
        let mainMsg = '';
        let teamMsg = '';
        const recordNum = (page - 1) * records.length + i + 1;
        const mapName = DataManager.getMapName(r.MapID);
        const operator = DataManager.getOperatorName(r.ArmedForceId);
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
            for (const t of teamList) {
                const teamOperator = DataManager.getOperatorName(t.armedForceType);
                // 解码昵称
                const nickName = decodeURIComponent(t.nickName || t.PlayerName || '未知玩家');
                const isCurrentUser = t.isCurrentUser ? ' (我)' : '';
                
                teamMsg += `${nickName}${isCurrentUser} (${teamOperator}):\n`;
                teamMsg += `  K/D/A: ${t.killNum}/${t.death}/${t.assist}, 得分: ${t.totalScore.toLocaleString()}\n`;
            }
            forwardMsg.push({ ...userInfo, message: teamMsg.trim() });
        }
      }
    }

    return e.reply(await Bot.makeForwardMsg(forwardMsg))
  }
} 