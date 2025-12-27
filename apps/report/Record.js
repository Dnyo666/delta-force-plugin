import utils from '../../utils/utils.js'
import Code from '../../components/Code.js'
import DataManager from '../../utils/Data.js'
import Render from '../../components/Render.js'

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

    // --- 构造模板数据 ---
    const templateRecords = [];

    // 构建地图背景图路径的辅助函数
    const getMapBgPath = (mapName, gameMode) => {
      const modePrefix = gameMode === 'sol' ? '烽火' : '全面';
      // 去掉地图名称中的难度后缀（如：航天基地-绝密 -> 航天基地）
      const cleanMapName = mapName.split('-')[0];
      const bgFileName = `${modePrefix}-${cleanMapName}.jpg`;
      const bgPath = `${process.cwd()}/plugins/delta-force-plugin/resources/Template/record/bg/${bgFileName}`.replace(/\\/g, '/');
      return `file:///${bgPath}`;
    };

    // 构建干员图片路径的辅助函数
    const getOperatorImgPath = (operatorName) => {
      const imgPath = `${process.cwd()}/plugins/delta-force-plugin/resources/Template/record/operator/${operatorName}.jpg`.replace(/\\/g, '/');
      return `file:///${imgPath}`;
    };

    if (mode === 'sol') {
      for (let i = 0; i < records.length; i++) {
        const r = records[i];
        const recordNum = (page - 1) * records.length + i + 1;
        const mapName = DataManager.getMapName(r.MapId);
        const operator = DataManager.getOperatorName(r.ArmedForceId);
        const status = escapeReason[r.EscapeFailReason] || '撤离失败';
        const duration = utils.formatDuration(r.DurationS, 'seconds');
        const value = Number(r.FinalPrice).toLocaleString();
        const income = r.flowCalGainedPrice ? Number(r.flowCalGainedPrice).toLocaleString() : '未知';
        
        // 确定状态样式类（注意：EscapeFailReason 是数字类型）
        let statusClass = 'fail';
        if (r.EscapeFailReason === 1 || r.EscapeFailReason === '1') statusClass = 'success';
        else if (r.EscapeFailReason === 3 || r.EscapeFailReason === '3') statusClass = 'exit';

        // 获取地图背景图路径
        const mapBg = getMapBgPath(mapName, 'sol');
        // 获取干员图片路径
        const operatorImg = getOperatorImgPath(operator);

        // 格式化击杀数据，添加颜色
        const killsHtml = `<span class="kill-player">干员(${r.KillCount || 0})</span> / <span class="kill-ai-player">AI玩家(${r.KillPlayerAICount || 0})</span> / <span class="kill-ai">其他AI(${r.KillAICount || 0})</span>`;

        templateRecords.push({
          recordNum,
          time: r.dtEventTime,
          status,
          statusClass,
          map: mapName,
          operator,
          duration,
          value,
          income,
          killsHtml,
          mapBg,
          operatorImg
        });
      }
    } else { // mode === 'mp'
      for (let i = 0; i < records.length; i++) {
        const r = records[i];
        const recordNum = (page - 1) * records.length + i + 1;
        const mapName = DataManager.getMapName(r.MapID);
        const operator = DataManager.getOperatorName(r.ArmedForceId);
        const result = mpResult[r.MatchResult] || '未知结果';
        const duration = utils.formatDuration(r.gametime, 'seconds');
        
        // 确定状态样式类（注意：MatchResult 是数字类型）
        let statusClass = 'fail';
        if (r.MatchResult === 1 || r.MatchResult === '1') statusClass = 'success';
        else if (r.MatchResult === 3 || r.MatchResult === '3') statusClass = 'exit';

        // 获取地图背景图路径
        const mapBg = getMapBgPath(mapName, 'mp');
        // 获取干员图片路径
        const operatorImg = getOperatorImgPath(operator);

        templateRecords.push({
          recordNum,
          time: r.dtEventTime,
          status: result,
          statusClass,
          map: mapName,
          operator,
          duration,
          kda: `${r.KillNum}/${r.Death}/${r.Assist}`,
          score: r.TotalScore.toLocaleString(),
          rescue: r.RescueTeammateCount,
          mapBg,
          operatorImg
        });
      }
    }

    // 渲染模板
    const templateData = {
      modeName,
      page,
      records: templateRecords
    };

    return await Render.render('Template/record/record', templateData, {
      e: this.e,
      scale: 1.2
    });
  }
} 