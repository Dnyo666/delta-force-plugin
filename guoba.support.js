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
      ],
      getConfigData() {
        const config = Config.getConfig();
        return config.delta_force || {};
      },
      setConfigData(data, { Result }) {
        const config = Config.getConfig();
        config.delta_force = lodash.merge(config.delta_force || {}, data);
        Config.setConfig(config);
        return Result.ok({}, '保存成功~');
      },
    },
  };
}