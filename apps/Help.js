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
                "group": "账号管理",
                "list": [
                    { "icon": 7, "title": "#三角洲QQ登陆", "desc": "通过QQ扫码登录" },
                    { "icon": 8, "title": "#三角洲微信登陆", "desc": "通过微信扫码登录" },
                    { "icon": 21, "title": "#三角洲账号", "desc": "查看已绑定的token" },
                    { "icon": 4, "title": "#三角洲绑定 [token]", "desc": "手动绑定token" },
                    { "icon": 10, "title": "#三角洲解绑 [序号]", "desc": "解绑指定序号的token" }
                ]
            },
            {
                "group": "信息查询",
                "list": [
                    { "icon": 53, "title": "#三角洲信息", "desc": "查询个人详细信息" },
                    { "icon": 50, "title": "#三角洲数据", "desc": "查询个人统计数据" },
                    { "icon": 60, "title": "#三角洲战绩 [模式]", "desc": "查询战绩，模式可选" },
                    { "icon": 64, "title": "#三角洲货币", "desc": "查询各类货币信息" },
                    { "icon": 90, "title": "#三角洲海报", "desc": "生成大红收藏海报" },
                    { "icon": 67, "title": "#三角洲流水 [类型]", "desc": "查询交易流水，类型可选" }
                ]
            },
            {
                "group": "其他",
                "list": [
                    { "icon": 72, "title": "#三角洲帮助", "desc": "显示本帮助菜单" }
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
        return await Render.render('help/index', {
            helpCfg,
            helpGroup,
            ...themeData,
            element: 'default'
        }, { e, scale: 1.6 });
    }

    async getThemeData(diyStyle, sysStyle) {
        let resPath = '{{_res_path}}/help/imgs/';
        let helpConfig = _.extend({}, sysStyle, diyStyle);
        let colCount = Math.min(5, Math.max(parseInt(helpConfig?.colCount) || 3, 2));
        let colWidth = Math.min(500, Math.max(100, parseInt(helpConfig?.colWidth) || 265));
        let width = Math.min(2500, Math.max(800, colCount * colWidth + 30));
        let theme = {
            main: `${resPath}/bg.jpg`,
            bg: `${resPath}/bg.jpg`,
            style: style
        };
        let themeStyle = theme.style || {};
        let ret = [`
          body{background-image:url(${theme.bg}) no-repeat;width:${width}px;}
          .container{background-image:url(${theme.main});background-size:cover;}
          .help-table .td,.help-table .th{width:${100 / colCount}%}
          `];
        let css = function (sel, css, key, def, fn) {
            let val = (function () {
                for (let idx in arguments) {
                    if (!_.isUndefined(arguments[idx])) {
                        return arguments[idx];
                    }
                }
            })(themeStyle[key], diyStyle[key], sysStyle[key], def);
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
            style: `<style>${ret.join('\\n')}</style>`,
            colCount
        };
    }
}
