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
      description: '基于 Yunzai 的三角洲行动游戏数据查询插件（公测中）',
      // 显示图标，此为个性化配置
      // 图标可在 https://icon-sets.iconify.design 这里进行搜索
      //icon: 'token-branded:bat',
      // 图标颜色，例：#FF0000 或 rgb(255, 0, 0)
      //iconColor: '#0FF796 ',
      // 如果想要显示成图片，也可以填写图标路径（绝对路径）
      iconPath: path.join(pluginRoot, 'resources/readme/icon.png'),
    },
    configInfo: {
      schemas: [
        {
          field: "api_key",
          label: "API 密钥",
          bottomHelpMessage: "用于 API 认证的密钥，在https://df.cduestc.fun/api-keys 获取",
          component: "Input",
          required: true,
          componentProps: {
            placeholder: '请输入 API 密钥',
          },
        },
        {
          field: "clientID",
          label: "客户端 ID",
          bottomHelpMessage: "用于标识客户端的 ID，在https://df.cduestc.fun/profile 获取（用户id就是）",
          component: "Input",
          required: true,
          componentProps: {
            placeholder: '请输入客户端 ID',
          },
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
          component: 'GTags',
          bottomHelpMessage: '也可以在群里使用 #三角洲开启每日密码推送 来添加',
          componentProps: {
            placeholder: '请输入群号后回车'
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
      ],
      getConfigData() {
        // 直接从文件读取最新的、未经缓存的配置
        const config = Config.loadYAML(Config.fileMaps.config) || {};
        const df = lodash.cloneDeep(config.delta_force || {});
        
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
            logger.mark('[DELTA FORCE PLUGIN] 配置已更新 (Guoba):', JSON.stringify(config.delta_force));
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