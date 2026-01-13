import Config from "./components/Config.js";
import lodash from "lodash";
import path from "path";
import { pluginRoot } from "./model/path.js";

export function supportGuoba() {
  return {
    pluginInfo: {
      name: 'delta-force-plugin',
      title: 'Delta-Force-Plugin',
      author: ['@Dnyo666'],
      authorLink: ['https://github.com/dnyo666'],
      link: 'https://github.com/dnyo666/delta-force-plugin',
      isV3: true,
      isV2: false,
      showInMenu: true,
      description: '基于 Yunzai 的三角洲行动游戏数据查询插件',
      // 显示图标，此为个性化配置
      // 图标可在 https://icon-sets.iconify.design 这里进行搜索
      //icon: 'token-branded:bat',
      // 图标颜色，例：#FF0000 或 rgb(255, 0, 0)
      //iconColor: '#0FF796 ',
      // 如果想要显示成图片，也可以填写图标路径（绝对路径）
      iconPath: path.join(pluginRoot, 'resources/imgs/readme/icon.png'),
    },
    configInfo: {
      schemas: [
        {
          component: 'Divider',
          label: '基础配置',
        },
        {
          field: "api_key",
          label: "API 密钥",
          bottomHelpMessage: "用于 API 认证的密钥，在https://df.shallow.ink/api-keys 获取",
          component: "Input",
          required: true,
          componentProps: {
            placeholder: '请输入 API 密钥',
          },
        },
        {
          field: "clientID",
          label: "客户端 ID",
          bottomHelpMessage: "用于标识客户端的 ID，在https://df.shallow.ink/profile 获取（用户id就是）",
          component: "Input",
          required: true,
          componentProps: {
            placeholder: '请输入客户端 ID',
          },
        },
        {
          field: "api_mode",
          label: "API地址模式",
          bottomHelpMessage: "选择API服务器地址模式：auto-自动故障转移（推荐）| default-默认地址 | eo-eo版地址 | esa-esa版地址",
          component: "Select",
          componentProps: {
            placeholder: '请选择API地址模式',
            options: [
              { label: '自动故障转移（推荐）', value: 'auto' },
              { label: '默认地址', value: 'default' },
              { label: 'EO版地址', value: 'eo' },
              { label: 'ESA版地址', value: 'esa' },
            ],
          },
        },
        {
          component: 'Divider',
          label: '定时推送',
        },
        {
          field: 'push_daily_keyword.enabled',
          label: '开启每日密码推送',
          component: 'Switch',
        },
        {
          field: 'push_daily_keyword.cron',
          label: '推送时间',
          component: 'EasyCron',
          bottomHelpMessage: '可视化设置定时任务的执行时间，也可以直接编辑cron表达式',
        },
        {
          field: 'push_daily_keyword.push_to.group',
          label: '推送群号',
          component: 'GSelectGroup',
          bottomHelpMessage: '也可以在群里使用 #三角洲开启每日密码推送 来添加',
          componentProps: {
            placeholder: '点击选择要推送的群'
          },
        },
        {
          field: 'push_daily_keyword.push_to.private',
          label: '推送QQ号',
          component: 'GTags',
          componentProps: {
            placeholder: '请输入QQ号后回车'
          },
        },
        {
          field: 'push_place_status.enabled',
          label: '开启特勤处完成推送',
          component: 'Switch',
          bottomHelpMessage: '开启后，将根据下方Cron设置的时间定时检查所有用户的特勤处状态',
        },
        {
          field: 'push_place_status.cron',
          label: '特勤处检查频率',
          component: 'EasyCron',
          bottomHelpMessage: '设置主任务的执行频率，用于检查并设置生产完成提醒',
        },
        {
          field: 'push_daily_report.enabled',
          label: '开启每日战报推送',
          component: 'Switch',
        },
        {
          field: 'push_daily_report.cron',
          label: '日报推送时间',
          component: 'EasyCron',
          bottomHelpMessage: '设置每日战报的推送时间',
        },
        {
          field: 'push_weekly_report.enabled',
          label: '开启每周战报推送',
          component: 'Switch',
        },
        {
          field: 'push_weekly_report.cron',
          label: '周报推送时间',
          component: 'EasyCron',
          bottomHelpMessage: '设置每周战报的推送时间 (通常为周一)',
        },
        {
          component: 'Divider',
          label: '高级设置',
        },
        {
          field: 'web_login.allow_share_with_other_bots',
          label: '允许同时登陆',
          component: 'Switch',
          bottomHelpMessage: '开启后，网页授权将不会再使用botID参数，可以同时登陆触发命令的多个机器人',
        },
        {
          field: 'websocket.auto_connect',
          label: 'WebSocket自动连接',
          component: 'Switch',
          bottomHelpMessage: '开启后，插件启动时将自动连接WebSocket服务器（用于战绩推送）',
        },
        {
          component: 'Divider',
          label: '广播通知',
        },
        {
          field: 'broadcast_notification.enabled',
          label: '开启广播通知接收',
          component: 'Switch',
          bottomHelpMessage: '开启后，将接收服务器推送的系统广播通知',
        },
        {
          field: 'broadcast_notification.push_to.group',
          label: '推送群号',
          component: 'GSelectGroup',
          bottomHelpMessage: '选择接收通知的群',
          componentProps: {
            placeholder: '点击选择要推送的群'
          },
        },
        {
          field: 'broadcast_notification.push_to.private_enabled',
          label: '开启私信推送',
          component: 'Switch',
          bottomHelpMessage: '开启后将推送通知到私信，未配置QQ号则默认推送给主人',
        },
        {
          field: 'broadcast_notification.push_to.private',
          label: '私信推送QQ号',
          component: 'GTags',
          bottomHelpMessage: '输入QQ号后回车，留空则默认推送给主人',
          componentProps: {
            placeholder: '请输入QQ号后回车'
          },
        },
        {
          component: 'Divider',
          label: 'TTS语音合成',
        },
        {
          field: 'tts.enabled',
          label: '启用TTS功能',
          component: 'Switch',
          bottomHelpMessage: '开启后可使用 ^tts 命令进行语音合成',
        },
        {
          field: 'tts.mode',
          label: 'TTS黑白名单模式',
          component: 'Select',
          bottomHelpMessage: '白名单模式下只有列表中的群/用户可用，黑名单模式下列表中的群/用户禁用',
          componentProps: {
            options: [
              { label: '黑名单模式', value: 'blacklist' },
              { label: '白名单模式', value: 'whitelist' },
            ],
          },
        },
        {
          field: 'tts.group_list',
          label: 'TTS群号列表',
          component: 'GSelectGroup',
          bottomHelpMessage: '配合黑白名单模式使用',
          componentProps: {
            placeholder: '点击选择群'
          },
        },
        {
          field: 'tts.user_list',
          label: 'TTS用户列表',
          component: 'GTags',
          bottomHelpMessage: '配合黑白名单模式使用，输入QQ号后回车',
          componentProps: {
            placeholder: '请输入QQ号后回车'
          },
        },
        {
          field: 'tts.max_length',
          label: 'TTS最大字数',
          component: 'InputNumber',
          bottomHelpMessage: 'TTS文本的最大字数限制',
          componentProps: {
            min: 20,
            max: 800,
            placeholder: '后端目前最高800字'
          },
        },
        {
          component: 'Divider',
          label: 'AI评价TTS语音',
        },
        {
          field: 'tts.ai_tts.enabled',
          label: '启用AI评价TTS',
          component: 'Switch',
          bottomHelpMessage: '开启后AI评价命令可附加音色参数生成语音',
        },
        {
          field: 'tts.ai_tts.mode',
          label: 'AI评价TTS黑白名单模式',
          component: 'Select',
          bottomHelpMessage: '白名单模式下只有列表中的群/用户可用，黑名单模式下列表中的群/用户禁用',
          componentProps: {
            options: [
              { label: '黑名单模式', value: 'blacklist' },
              { label: '白名单模式', value: 'whitelist' },
            ],
          },
        },
        {
          field: 'tts.ai_tts.group_list',
          label: 'AI评价TTS群号列表',
          component: 'GSelectGroup',
          bottomHelpMessage: '配合黑白名单模式使用',
          componentProps: {
            placeholder: '点击选择群'
          },
        },
        {
          field: 'tts.ai_tts.user_list',
          label: 'AI评价TTS用户列表',
          component: 'GTags',
          bottomHelpMessage: '配合黑白名单模式使用，输入QQ号后回车',
          componentProps: {
            placeholder: '请输入QQ号后回车'
          },
        },
      ],
      getConfigData() {
        // 直接从文件读取最新的、未经缓存的配置
        const config = Config.loadYAML(Config.fileMaps.config) || {};
        const df = lodash.cloneDeep(config.delta_force || {});
        
        // 设置 api_mode 默认值
        if (!df.api_mode) {
          df.api_mode = 'auto';
        }
        
        // 确保 push_daily_keyword 对象及其子属性存在，为UI提供完整的模型
        // 使用 mergeWith 自定义合并逻辑，确保数组直接被替换而不是合并
        df.push_daily_keyword = lodash.mergeWith(
          {
            enabled: false,
            cron: '0 8 * * *',
            push_to: { group: [], private: [] }
          },
          df.push_daily_keyword,
          (objValue, srcValue) => {
            if (lodash.isArray(srcValue)) {
              return srcValue;
            }
          }
        );
        
        df.push_place_status = lodash.merge(
          {
            enabled: false,
            cron: '*/5 * * * *', // 默认每5分钟检查一次
          },
          df.push_place_status
        );

        df.push_daily_report = lodash.merge(
          {
            enabled: true,
            cron: '0 0 10 * * ?',
          },
          df.push_daily_report
        );

        df.push_weekly_report = lodash.merge(
          {
            enabled: true,
            cron: '0 0 10 * * 1',
          },
          df.push_weekly_report
        );

        df.web_login = lodash.merge(
          {
            allow_share_with_other_bots: false,
          },
          df.web_login
        );

        df.websocket = lodash.merge(
          {
            auto_connect: false
          },
          df.websocket
        );

        df.broadcast_notification = lodash.mergeWith(
          {
            enabled: false,
            push_to: { 
              group: [],
              private_enabled: false,
              private: []
            }
          },
          df.broadcast_notification,
          (objValue, srcValue) => {
            if (lodash.isArray(srcValue)) {
              return srcValue;
            }
          }
        );

        df.tts = lodash.mergeWith(
          {
            enabled: true,
            mode: 'blacklist',
            group_list: [],
            user_list: [],
            max_length: 800,
            ai_tts: {
              enabled: true,
              mode: 'blacklist',
              group_list: [],
              user_list: []
            }
          },
          df.tts,
          (objValue, srcValue) => {
            if (lodash.isArray(srcValue)) {
              return srcValue;
            }
          }
        );

        return df;
      },
      setConfigData(data, { Result }) {
        try {
          const config = Config.loadYAML(Config.fileMaps.config) || {};

          // 确保插件的命名空间存在
          if (!config.delta_force) {
            config.delta_force = {};
          }

          // 将从锅巴面板接收到的扁平数据转换为嵌套对象
          const unflattenedData = {};
          for (const key in data) {
            lodash.set(unflattenedData, key, data[key]);
          }

          // 核心修复: 使用 mergeWith 并自定义合并逻辑，确保数组被直接替换而不是合并
          lodash.mergeWith(config.delta_force, unflattenedData, (objValue, srcValue) => {
            if (lodash.isArray(srcValue)) {
              return srcValue;
            }
          });
          
          if (Config.setConfig(config)) {
            logger.debug('[DELTA FORCE PLUGIN] 配置已更新 (Guoba)');
            return Result.ok({}, '保存成功~');
          } else {
            return Result.error('配置保存失败，请检查文件权限');
          }
        } catch (error) {
          logger.error('[DELTA FORCE PLUGIN] 配置保存失败:', error);
          return Result.error('配置保存失败，请检查日志');
        }
      },
    },
  };
}