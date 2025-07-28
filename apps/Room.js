import plugin from '../../../lib/plugins/plugin.js'
import utils from '../utils/utils.js'
import Code from '../components/Code.js'
import Config from '../components/Config.js'

let mapCache = null;
let tagCache = null;

async function getMapData(api) {
    if (mapCache) {
        return mapCache;
    }
    const res = await api.getMaps();
    if (res && res.code === 0 && res.data) {
        mapCache = new Map();
        for (const map of res.data) {
            mapCache.set(map.id, map.name);
        }
        // 设置一个定时器，比如1小时后清空缓存，以便下次可以获取最新的
        setTimeout(() => { mapCache = null; }, 3600 * 1000);
        return mapCache;
    }
    return new Map(); // 失败时返回空Map，避免阻塞
}

async function getTagData(api) {
    if (tagCache) {
        return tagCache;
    }
    const res = await api.getTags();
    if (res && res.code === 0 && res.data) {
        tagCache = new Map();
        for (const tag of res.data) {
            tagCache.set(tag.id, tag.name);
        }
        // 设置一个定时器，比如1小时后清空缓存，以便下次可以获取最新的
        setTimeout(() => { tagCache = null; }, 3600 * 1000);
        return tagCache;
    }
    return new Map(); // 失败时返回空Map，避免阻塞
}

function getClientID () {
  const clientID = Config.getConfig()?.delta_force?.clientID
  if (!clientID || clientID === 'xxxxxx') {
    return null
  }
  return clientID
}

export class Room extends plugin {
  constructor (e) {
    super({
      name: '三角洲开黑房间',
      dsc: '创建和管理开黑房间',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)?房间列表(.*)$',
          fnc: 'getRoomList'
        },
        {
          reg: '^(#三角洲|\\^)?创建房间(.*)$',
          fnc: 'createRoom'
        },
        {
          reg: '^(#三角洲|\\^)?加入房间\\s+(\\d+)(.*)$',
          fnc: 'joinRoom'
        },
        {
          reg: '^(#三角洲|\\^)?(退出|解散)房间\\s+(\\d+)$',
          fnc: 'quitRoom'
        },
        {
          reg: '^(#三角洲|\\^)?踢人\\s*(\\d+)',
          fnc: 'kickMember'
        },
        {
          reg: '^(#三角洲|\\^)?房间信息$',
          fnc: 'getRoomInfo'
        },
        {
          reg: '^(#三角洲|\\^)?房间地图列表$',
          fnc: 'getMapList'
        },
        {
          reg: '^(#三角洲|\\^)?房间标签列表$',
          fnc: 'getTagList'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
  }

  async getRoomList () {
    const clientID = getClientID()
    if (!clientID) {
        await this.e.reply('clientID 未在配置文件中正确设置，请联系管理员。')
        return true
    }
    
    const argString = this.e.msg.match(/^(#三角洲|\^)?房间列表(.*)$/)[2].trim();
    const args = argString.split(' ').filter(Boolean);

    let type = '';
    let hasPassword = ''; // 使用空字符串表示未设置
    let isAllModeQuery = false;

    const solAliases = ['sol', '烽火', '摸金', '烽火地带'];
    const mpAliases = ['mp', '全面', '战场', '全面战场'];
    const allAliases = ['全模式', '全部'];
    const hasPasswordAliases = ['有', '有密码'];
    const noPasswordAliases = ['无', '无密码'];

    for (const arg of args) {
      if (solAliases.includes(arg)) {
        type = 'sol';
      } else if (mpAliases.includes(arg)) {
        type = 'mp';
      } else if (allAliases.includes(arg)) {
        isAllModeQuery = true;
      } else if (hasPasswordAliases.includes(arg)) {
        hasPassword = true;
      } else if (noPasswordAliases.includes(arg)) {
        hasPassword = false;
      }
    }

    let filterDesc = [];
    if (type) {
      filterDesc.push(`模式:${type === 'sol' ? '烽火' : '战场'}`);
    } else if (isAllModeQuery) {
      filterDesc.push('模式:全部');
    }
    
    if (hasPassword !== '') filterDesc.push(hasPassword ? '有密码' : '无密码');
    
    const replyMsg = `正在查询房间列表... ${filterDesc.length > 0 ? `[${filterDesc.join(', ')}]` : ''}`;
    await this.e.reply(replyMsg.trim());
    
    const res = await this.api.getRoomList(clientID, type, hasPassword)

    if (await utils.handleApiError(res, this.e)) return true;

    if (!res || res.code !== 0 || !res.data) {
      await this.e.reply(`查询失败: ${res.msg || res.message || '无法获取房间列表'}`)
      return true
    }

    const rooms = res.data;
    if (rooms.length === 0) {
      await this.e.reply('当前没有公开的开黑房间。')
      return true
    }

    const maps = await getMapData(this.api);
    let msg = '--- 开黑房间列表 ---\n'
    rooms.forEach((room, index) => {
      const lock = room.hasPassword ? '🔒' : ' ';
      const mode = room.type === 'sol' ? '烽火' : '战场';
      const mapName = maps.get(room.mapid) || room.mapid;
      msg += `\n#${index + 1}: [${mode}] ${room.tagText || '无标题'} ${lock}\n`
      msg += `ID: ${room.roomId} | 地图: ${mapName} | 人数: ${room.currentMemberCount}/${room.maxMemberCount}\n`
      msg += `房主: ${room.ownerNickname}`
      if (index < rooms.length - 1) msg += '\n----------'
      msg += `\n使用#三角洲加入房间 [房间ID] 加入。`
    })

    await this.e.reply(msg.trim())
    return true
  }

  async createRoom () {
    const token = await utils.getAccount(this.e.user_id)
    const clientID = getClientID()
    if (!token) {
      await this.e.reply('请先绑定账号。')
      return true
    }
    if (!clientID) {
      await this.e.reply('clientID 未在配置文件中正确设置，请联系管理员。')
      return true
    }

    const argString = this.e.msg.replace(/^(#三角洲|\^)?创建房间/, '').trim()
    const args = []
    if (argString) {
        // 使用正则表达式来解析参数，支持带引号的字符串
        const regex = /"([^"]*)"|'([^']*)'|(\S+)/g
        let match;
        while ((match = regex.exec(argString)) !== null) {
            args.push(match[1] || match[2] || match[3] || '');
        }
    }

    const type = args[0] || '' // 模式 (sol/mp)
    const mapid = args[1] || '0' // 地图ID
    const tag = args[2] || '' // 标签ID
    const password = args[3] || '' // 密码
    const isLimitedArg = (args[4] || '否').toLowerCase();
    const onlyCurrentlyClient = ['是', 'yes', 'true', '1'].includes(isLimitedArg);

    let typeEng = '';
    const typeInput = args[0] || '';
    if (['sol', '烽火', '摸金', '烽火地带'].includes(typeInput)) {
      typeEng = 'sol';
    } else if (['mp', '全面', '战场', '全面战场'].includes(typeInput)) {
      typeEng = 'mp';
    }

    if (!typeEng) {
        let helpMsg = '指令格式错误，缺少必要的房间模式 (sol/mp/烽火/战场)！\n';
        helpMsg += '格式: #三角洲创建房间 <模式> [地图ID] [标签ID] [密码] [仅本机:是/否]\n';
        helpMsg += '示例: #三角洲创建房间 sol 1902 10001 123 是\n';
        helpMsg += '可使用 #三角洲房间地图列表 和 #三角洲房间标签列表 查询可用ID。';
        await this.e.reply(helpMsg);
        return true;
    }

    const maps = await getMapData(this.api);
    const mapName = maps.get(mapid) || mapid;
    const tags = await getTagData(this.api);
    const tagName = tags.get(tag) || (tag ? '自定义' : '无');

    await this.e.reply(`正在创建房间... [模式:${typeEng}, 地图:${mapName}, 标签:${tagName}, 仅本机:${onlyCurrentlyClient}]`)
    
    // 修正了参数传递顺序，使其与解析顺序一致
    const res = await this.api.createRoom(token, clientID, typeEng, mapid, tag, password, onlyCurrentlyClient)

    if (await utils.handleApiError(res, this.e)) return true;

    if (res && res.code === 0 && res.data) {
      let replyMsg = `房间创建成功！\n房间ID: ${res.data.roomId}`
      if (password) {
        replyMsg += `\n密码: ${password}`
      }
      replyMsg += `\n其他玩家请使用 #三角洲加入房间 ${res.data.roomId} ${password ? password : ''} 加入。`
      replyMsg += `\n\n注意: 创建或加入房间即代表您同意插件展示您的昵称、UID等公开信息。`;
      await this.e.reply(replyMsg)
    } else {
      await this.e.reply(`创建失败: ${res.msg || res.message || '未知错误'}`)
    }
    return true
  }

  async joinRoom () {
    const token = await utils.getAccount(this.e.user_id)
    const clientID = getClientID()
    if (!token) {
      await this.e.reply('请先绑定账号。')
      return true
    }
    if (!clientID) {
      await this.e.reply('clientID 未在配置文件中正确设置，请联系管理员。')
      return true
    }

    const match = this.e.msg.match(/^(#三角洲|\^)?加入房间\s+(\d+)(.*)$/)
    if (!match) {
        await this.e.reply('指令格式错误，请使用：#三角洲加入房间 <房间ID> [密码]')
        return true
    }
    
    const roomId = match[2]
    const password = match[3] ? match[3].trim() : ''

    await this.e.reply(`正在加入房间: ${roomId}...`)
    const res = await this.api.joinRoom(token, clientID, roomId, password)

    if (await utils.handleApiError(res, this.e)) return true;

    if (res && res.code === 0) {
      let replyMsg = (res.msg || '成功加入房间！') + '\n\n注意: 创建或加入房间即代表您同意插件展示您的昵称、UID等公开信息。';
      await this.e.reply(replyMsg)
    } else {
      await this.e.reply(`加入房间失败: ${res.msg || res.message || '未知错误，可能是密码错误或房间不存在'}`)
    }
    return true
  }

  async quitRoom () {
    const token = await utils.getAccount(this.e.user_id)
    const clientID = getClientID()
    if (!token) {
      await this.e.reply('请先绑定账号。')
      return true
    }
    if (!clientID) {
      await this.e.reply('clientID 未在配置文件中正确设置，请联系管理员。')
      return true
    }
    
    const match = this.e.msg.match(/^(#三角洲|\^)?(退出|解散)房间\s+(\d+)$/)
    const roomId = match[3]

    await this.e.reply(`正在退出/解散房间: ${roomId}...`)
    const res = await this.api.quitRoom(token, clientID, roomId)

    if (await utils.handleApiError(res, this.e)) return true;

    const apiMsg = res?.msg || res?.message || '';
    if (res && res.code === 0) {
      await this.e.reply(apiMsg || '成功退出或解散房间！');
    } else if (res && apiMsg.includes('房间已解散')) {
      await this.e.reply(apiMsg);
    } else {
      await this.e.reply(`操作失败: ${apiMsg || '未知错误，可能您不在该房间或不是房主'}`)
    }
    return true
  }

  async kickMember () {
    const token = await utils.getAccount(this.e.user_id)
    const clientID = getClientID()
    if (!token) {
      await this.e.reply('请先绑定账号。')
      return true
    }
    if (!clientID) {
      await this.e.reply('clientID 未在配置文件中正确设置，请联系管理员。')
      return true
    }

    const match = this.e.msg.match(/^(#三角洲|\^)?踢人\s*(\d+)/)
    if (!match || !this.e.at) {
        await this.e.reply('指令格式错误，请使用：#三角洲踢人 <房间ID> @目标玩家')
        return true
    }
    
    const roomId = match[2]
    const targetUserId = this.e.at
    const targetFrameworkToken = await utils.getAccount(targetUserId)

    if (!targetFrameworkToken) {
        await this.e.reply(`目标玩家 @${targetUserId} 未绑定账号。`)
        return true
    }

    await this.e.reply(`正在从房间 ${roomId} 中踢出玩家 @${targetUserId}...`)
    const res = await this.api.kickMember(token, clientID, roomId, targetFrameworkToken)

    if (await utils.handleApiError(res, this.e)) return true;

    if (res && res.code === 0) {
      await this.e.reply(res.msg || '成功踢出玩家！')
    } else {
      await this.e.reply(`操作失败: ${res.msg || res.message || '未知错误，请确保您是房主且目标玩家在该房间内'}`)
    }
    return true
  }

  async getRoomInfo() {
      const token = await utils.getAccount(this.e.user_id)
      const clientID = getClientID()
      if (!token) {
        await this.e.reply('请先绑定账号。')
        return true
      }
      if (!clientID) {
        await this.e.reply('clientID 未在配置文件中正确设置，请联系管理员。')
        return true
      }
      
      await this.e.reply(`正在查询您所在的房间信息...`);
      const res = await this.api.getRoomInfo(token, clientID);

      if (await utils.handleApiError(res, this.e)) return true;

      if (!res || res.code !== 0 || !res.data) {
          await this.e.reply(`查询失败: ${res.msg || res.message || '未知错误，可能您不在任何房间内'}`);
          return true;
      }

      const room = res.data;
      const maps = await getMapData(this.api);
      const mapName = maps.get(room.mapid) || room.mapid;
      const tags = await getTagData(this.api);
      const tagName = tags.get(room.tag) || room.tagText || (room.tag ? '自定义' : '无');
      let msg = `--- 房间信息 (ID: ${room.roomId}) ---\n`;
      msg += `模式: ${room.type === 'sol' ? '烽火地带' : '全面战场'}\n`;
      msg += `标签: ${tagName}\n`;
      msg += `地图: ${mapName}\n`;
      msg += `人数: ${room.currentMemberCount}/${room.maxMemberCount}\n\n`;
      msg += `--- 成员列表 ---\n`;
      room.members.forEach((member, index) => {
          msg += `${index + 1}. ${member.nickname} (UID: ${member.uid})\n`;
      });

      await this.e.reply(msg.trim());
      return true;
  }

  async getMapList() {
      await this.e.reply("正在获取最新地图列表...");
      const res = await this.api.getMaps();
      
      if (await utils.handleApiError(res, this.e)) return true;

      if (!res || res.code !== 0 || !res.data) {
          await this.e.reply(`获取地图列表失败: ${res.msg || res.message || '未知错误'}`);
          return true;
      }
      
      let msg = "--- 房间可用地图列表 ---\n";
      msg += "ID - 地图名称\n";
      res.data.forEach(map => {
          msg += `${map.id} - ${map.name}\n`;
      });
      await this.e.reply(msg.trim());
      return true;
  }

  async getTagList() {
      await this.e.reply("正在获取最新标签列表...");
      const res = await this.api.getTags();
      
      if (await utils.handleApiError(res, this.e)) return true;

      if (!res || res.code !== 0 || !res.data) {
          await this.e.reply(`获取标签列表失败: ${res.msg || res.message || '未知错误'}`);
          return true;
      }

      if (res.data.length === 0) {
          await this.e.reply("暂无可用房间标签。");
      } else {
          let msg = "--- 房间可用标签列表 ---\n";
          msg += "ID - 标签名称\n";
          res.data.forEach(tag => {
              msg += `${tag.id} - ${tag.name}\n`;
          });
          await this.e.reply(msg.trim());
      }
      return true;
  }
} 