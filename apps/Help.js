import plugin from '../../../lib/plugins/plugin.js';
import Render from '../components/Render.js';
import { style } from '../resources/help/imgs/config.js';
import _ from 'lodash';

export class Help extends plugin {
    constructor() {
        super({
            name: "三角洲行动-帮助",
            event: "message",
            priority: 1008,
            rule: [
                {
                    reg: "^(#三角洲|\\^)(帮助|菜单|功能)$",
                    fnc: "help"
                }
            ]
        });
    }

    async help(e) {
        const helpCfg = {
            "title": "三角洲行动 帮助",
            "subTitle": "DeltaForce-Plugin HELP",
            "colWidth": 265,
            "theme": "all",
            "themeExclude": ["default"],
            "colCount": 3,
            "bgBlur": true
        };

        const helpList = [
            {
                group: "所有命令中的 #三角洲 都可以替换成 ^ 例如 ^帮助 和 #三角洲帮助",
            },
            {
                group: "账号管理",
                list: [
                    { icon: 80, title: "#三角洲账号", desc: "查看已绑定token" },
                    { icon: 71, title: "#三角洲账号切换 [序号]", desc: "激活指定序号账号" },
                    { icon: 48, title: "#三角洲解绑 [序号]", desc: "解绑指定序号token" },
                    { icon: 49, title: "#三角洲微信刷新", desc: "刷新微信token" },
                    { icon: 76, title: "#三角洲角色绑定 [token]", desc: "手动绑定token" }
                ]
            },
            {
                group: "账号登录",
                list: [
                    { icon: 64, title: "#三角洲QQ登陆", desc: "通过QQ扫码登录" },
                    { icon: 63, title: "#三角洲微信登陆", desc: "通过微信扫码登录" },
                    { icon: 62, title: "#三角洲WeGame登陆", desc: "通过qq扫码登陆wegame" },
                    { icon: 76, title: "#三角洲wegame微信登陆", desc: "通过微信扫码登陆wegame" },
                    { icon: 61, title: "#三角洲安全中心登陆", desc: "通过安全中心扫码登录" },
                    { icon: 71, title: "#三角洲ck登陆", desc: "获取ck登陆帮助" },
                    { icon: 80, title: "#三角洲ck登陆 [cookies]", desc: "通过cookie登陆" }
                ]
            },
            {
                group: "个人信息",
                list: [
                    { icon: 78, title: "#三角洲信息", desc: "查询个人详细信息" },
                    { icon: 71, title: "#三角洲UID", desc: "查询个人UID" },
                    { icon: 61, title: "#三角洲ai锐评", desc: "使用AI锐评战绩等数据" }
                ]
            },
            {
                group: "游戏数据",
                list: [
                    { icon: 41, title: "#三角洲藏品", desc: "查询个人仓库中的皮肤、饰品等非货币资产" },
                    { icon: 48, title: "#三角洲货币", desc: "查询游戏内货币信息" },
                    { icon: 53, title: "#三角洲流水 [类型] [页码]", desc: "查询交易流水，类型可选：设备/道具/货币" },
                    { icon: 55, title: "#三角洲数据 [模式] [赛季数字]", desc: "查询个人统计数据，支持模式和赛季参数" },
                    { icon: 66, title: "#三角洲战绩 [模式] [页码]", desc: "查询战绩，模式可选：全面/烽火/页码" }
                ]
            },
            {
                group: "战报统计",
                list: [
                    { icon: 86, title: "#三角洲日报 [模式]", desc: "查询三角洲行动日报数据，模式可选：全面/烽火" },
                    { icon: 86, title: "#三角洲周报 [模式] [日期] [展示/不展示]", desc: "查询每周战报，支持多参数" }
                ]
            },
            {
                group: "房间管理",
                list: [
                    { icon: 28, title: "#三角洲房间列表", desc: "查询房间列表" },
                    { icon: 23, title: "#三角洲创建房间", desc: "创建房间" },
                    { icon: 26, title: "#三角洲加入房间 [房间号]", desc: "加入房间" },
                    { icon: 37, title: "#三角洲退出房间 [房间号]", desc: "退出房间" },
                    { icon: 56, title: "#三角洲踢人 [序号]", desc: "踢人" },
                    { icon: 64, title: "#三角洲房间信息", desc: "查询房间信息" },
                    { icon: 62, title: "#三角洲房间地图列表", desc: "查询房间地图列表" },
                    { icon: 78, title: "#三角洲房间标签列表", desc: "查询房间标签列表" }
                ]
            },
            {
                group: "其他/帮助",
                list: [
                    { icon: 92, title: "#三角洲(强制)更新", desc: "更新三角洲插件" },
                    { icon: 85, title: "#三角洲帮助", desc: "显示本帮助菜单" }
                ]
            }
        ];

        let helpGroup = [];
        _.forEach(helpList, (group) => {
            _.forEach(group.list, (help) => {
                let icon = help.icon * 1;
                if (!icon) {
                    help.css = 'display:none';
                } else {
                    let x = (icon - 1) % 10;
                    let y = (icon - x - 1) / 10;
                    help.css = `background-position:-${x * 50}px -${y * 50}px`;
                }
            });
            helpGroup.push(group);
        });

        let themeData = await this.getThemeData(helpCfg, helpCfg);
        return await Render.render('help/index.html', {
            helpCfg,
            helpGroup,
            ...themeData,
            element: 'default'
        }, { e, scale: 1.6 });
    }

    async getThemeData(diyStyle, sysStyle) {
        const helpConfig = { ...sysStyle, ...diyStyle };
        const colCount = Math.min(5, Math.max(parseInt(helpConfig?.colCount) || 3, 2));
        const colWidth = Math.min(500, Math.max(100, parseInt(helpConfig?.colWidth) || 265));
        const width = Math.min(2500, Math.max(800, colCount * colWidth + 30));
        const theme = {
            main: `../imgs/bg.jpg`,
            bg: `../imgs/bg.jpg`,
            style: style
        };
        const themeStyle = theme.style || {};
        const ret = [`
          body{background-image:url(${theme.bg}) no-repeat;width:${width}px;}
          .container{background-image:url(${theme.main});background-size:cover;}
          .help-table .td,.help-table .th{width:${100 / colCount}%}
          `];
        const css = function (sel, css, key, def, fn) {
            let val = themeStyle[key] ?? diyStyle[key] ?? sysStyle[key] ?? def;
            if (fn) {
                val = fn(val);
            }
            ret.push(`${sel}{${css}:${val}}`);
        };
        css('.help-title,.help-group', 'color', 'fontColor', '#ceb78b');
        css('.help-title,.help-group', 'text-shadow', 'fontShadow', 'none');
        css('.help-desc', 'color', 'descColor', '#eee');
        css('.cont-box', 'background', 'contBgColor', 'rgba(43, 52, 61, 0.8)');
        css('.cont-box', 'backdrop-filter', 'contBgBlur', 3, (n) => diyStyle.bgBlur === false ? 'none' : `blur(${n}px)`);
        css('.help-group', 'background', 'headerBgColor', 'rgba(34, 41, 51, .4)');
        css('.help-table .tr:nth-child(odd)', 'background', 'rowBgColor1', 'rgba(34, 41, 51, .2)');
        css('.help-table .tr:nth-child(even)', 'background', 'rowBgColor2', 'rgba(34, 41, 51, .4)');
        return {
            style: `<style>${ret.join('\n')}</style>`,
            colCount
        };
    }
}
