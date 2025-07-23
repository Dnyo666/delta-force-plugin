import plugin from '../../../lib/plugins/plugin.js'
import utils from '../utils/utils.js'
import Code from '../components/Code.js'
import Config from '../components/Config.js'

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
          reg: '^(#三角洲|\\^)?房间列表$',
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
          reg: '^(#三角洲|\\^)?房间信息\\s*(\\d+)$',
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
    
    await this.e.reply('正在查询房间列表...')
    const res = await this.api.getRoomList(clientID)

    if (!res || !res.success || !res.data) {
      await this.e.reply(`查询失败: ${res.message || '无法获取房间列表'}`)
      return true
    }

    const rooms = res.data;
    if (rooms.length === 0) {
      await this.e.reply('当前没有公开的开黑房间。')
      return true
    }

    let msg = '--- 开黑房间列表 ---\n'
    rooms.forEach((room, index) => {
      const lock = room.hasPassword ? '🔒' : ' ';
      const mode = room.type === 'sol' ? '烽火' : '战场';
      msg += `\n#${index + 1}: [${mode}] ${room.tagText || '无标题'} ${lock}\n`
      msg += `ID: ${room.roomId} | 人数: ${room.currentMemberCount}/${room.maxMemberCount}\n`
      msg += `房主: ${room.ownerNickname}`
      if (index < rooms.length - 1) msg += '\n----------'
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
    // onlyCurrentlyClient: 是否仅限同clientID用户加入 (默认false)
    const isLimitedArg = (args[4] || '否').toLowerCase();
    const onlyCurrentlyClient = ['是', 'yes', 'true', '1'].includes(isLimitedArg);


    if (!type || !['sol', 'mp'].includes(type.toLowerCase())) {
        let helpMsg = '指令格式错误，缺少必要的房间模式 (sol/mp)！\n';
        helpMsg += '格式: #三角洲创建房间 <模式> [地图ID] [标签ID] [密码] [仅本机:是/否]\n';
        helpMsg += '示例: #三角洲创建房间 sol 1902 10001 123 是\n';
        helpMsg += '可使用 #三角洲房间地图列表 和 #三角洲房间标签列表 查询可用ID。';
        await this.e.reply(helpMsg);
        return true;
    }

    await this.e.reply(`正在创建房间... [模式:${type}, 地图:${mapid}, 标签:${tag || '无'}, 仅本机:${onlyCurrentlyClient}]`)
    
    const res = await this.api.createRoom(token, clientID, type, tag, password, mapid, onlyCurrentlyClient)

    if (res && res.success && res.data) {
      let replyMsg = `房间创建成功！\n房间ID: ${res.data.roomId}`
      if (password) {
        replyMsg += `\n密码: ${password}`
      }
      replyMsg += `\n请使用 #三角洲加入房间 ${res.data.roomId} ${password ? password : ''} 加入。`
      await this.e.reply(replyMsg)
    } else {
      await this.e.reply(`创建失败: ${res.message || '未知错误'}`)
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
    
    const roomId = match[1]
    const password = match[2] ? match[2].trim() : ''

    await this.e.reply(`正在加入房间: ${roomId}...`)
    const res = await this.api.joinRoom(token, clientID, roomId, password)

    if (res && res.success) {
      await this.e.reply('成功加入房间！')
    } else {
      await this.e.reply(`加入房间失败: ${res.message || '未知错误，可能是密码错误或房间不存在'}`)
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

    if (res && res.success) {
      await this.e.reply('成功退出或解散房间！')
    } else {
      await this.e.reply(`操作失败: ${res.message || '未知错误，可能您不在该房间或不是房主'}`)
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
    
    const roomId = match[1]
    const targetUserId = this.e.at
    const targetFrameworkToken = await utils.getAccount(targetUserId)

    if (!targetFrameworkToken) {
        await this.e.reply(`目标玩家 @${targetUserId} 未绑定账号。`)
        return true
    }

    await this.e.reply(`正在从房间 ${roomId} 中踢出玩家 @${targetUserId}...`)
    const res = await this.api.kickMember(token, clientID, roomId, targetFrameworkToken)

    if (res && res.success) {
      await this.e.reply('成功踢出玩家！')
    } else {
      await this.e.reply(`操作失败: ${res.message || '未知错误，请确保您是房主且目标玩家在该房间内'}`)
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
      
      const match = this.e.msg.match(/^(#三角洲|\^)?房间信息\s*(\d+)$/);
      if (!match) {
          await this.e.reply('指令格式错误，请使用：#房间信息 <房间ID>');
          return true;
      }
      const roomId = match[1];

      await this.e.reply(`正在查询房间 ${roomId} 的信息...`);
      const res = await this.api.getRoomInfo(token, clientID, roomId);

      if (!res || !res.success || !res.data) {
          await this.e.reply(`查询失败: ${res.message || '未知错误，可能您不在该房间内或房间不存在'}`);
          return true;
      }

      const room = res.data;
      let msg = `--- 房间信息 (ID: ${room.roomId}) ---\n`;
      msg += `模式: ${room.type === 'sol' ? '烽火地带' : '全面战场'}\n`;
      msg += `标签: ${room.tagText || '无'}\n`;
      msg += `地图ID: ${room.mapid}\n`;
      msg += `人数: ${room.currentMemberCount}/${room.maxMemberCount}\n\n`;
      msg += `--- 成员列表 ---\n`;
      room.members.forEach((member, index) => {
          msg += `${index + 1}. ${member.nickname}\n`;
      });

      await this.e.reply(msg.trim());
      return true;
  }

  async getMapList() {
      await this.e.reply("正在获取最新地图列表...");
      const res = await this.api.getMaps();
      if (!res || !res.success || !res.data) {
          await this.e.reply(`获取地图列表失败: ${res.message || '未知错误'}`);
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
      if (!res || !res.success || !res.data) {
          await this.e.reply(`获取标签列表失败: ${res.message || '未知错误'}`);
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