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
      ],
      getConfigData() {
        const config = Config.getConfig();
        // 确保返回的是嵌套格式的配置
        const df = config.delta_force || {};
        
        // 如果存在扁平格式的配置，将其转为嵌套格式
        if (df['push_daily_keyword.enabled'] !== undefined) {
          if (!df.push_daily_keyword) df.push_daily_keyword = {};
          df.push_daily_keyword.enabled = df['push_daily_keyword.enabled'];
        }
        
        if (df['push_daily_keyword.cron'] !== undefined) {
          if (!df.push_daily_keyword) df.push_daily_keyword = {};
          df.push_daily_keyword.cron = df['push_daily_keyword.cron'];
        }
        
        if (df['push_daily_keyword.push_to.group'] !== undefined) {
          if (!df.push_daily_keyword) df.push_daily_keyword = {};
          if (!df.push_daily_keyword.push_to) df.push_daily_keyword.push_to = {};
          df.push_daily_keyword.push_to.group = df['push_daily_keyword.push_to.group'];
        }
        
        if (df['push_daily_keyword.push_to.private'] !== undefined) {
          if (!df.push_daily_keyword) df.push_daily_keyword = {};
          if (!df.push_daily_keyword.push_to) df.push_daily_keyword.push_to = {};
          df.push_daily_keyword.push_to.private = df['push_daily_keyword.push_to.private'];
        }
        
        return df;
      },
      setConfigData(data, { Result }) {
        try {
          const config = Config.getConfig();
          
          // 先删除可能存在的扁平格式键
          delete config.delta_force['push_daily_keyword.enabled'];
          delete config.delta_force['push_daily_keyword.cron'];
          delete config.delta_force['push_daily_keyword.push_to.group'];
          delete config.delta_force['push_daily_keyword.push_to.private'];
          
          // 然后进行深度合并
          const newConfig = lodash.merge({}, config.delta_force, data);
          
          // 确保push_daily_keyword的完整性
          if (newConfig.push_daily_keyword) {
            if (!newConfig.push_daily_keyword.push_to) {
              newConfig.push_daily_keyword.push_to = { group: [], private: [] };
            }
            if (!newConfig.push_daily_keyword.push_to.group) {
              newConfig.push_daily_keyword.push_to.group = [];
            }
            if (!newConfig.push_daily_keyword.push_to.private) {
              newConfig.push_daily_keyword.push_to.private = [];
            }
          }
          
          config.delta_force = newConfig;
          Config.setConfig(config);
          logger.mark('[DELTA FORCE PLUGIN] 配置已更新:', JSON.stringify(newConfig.push_daily_keyword));
          
          return Result.ok({}, '保存成功~');
        } catch (error) {
          logger.error('[DELTA FORCE PLUGIN] 配置保存失败:', error);
          return Result.error('配置保存失败，请检查日志');
        }
      },
    },
  };
}