import HelpConfig from '../../components/HelpConfig.js';
import Render from '../../components/Render.js';
import { style } from '../../resources/help/imgs/config.js';
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
                },
                {
                    reg: "^(#三角洲|\\^)娱乐(帮助|菜单|功能)$",
                    fnc: "entertainmentHelp"
                }
            ]
        });
    }

    async help(e) {
        const helpList = HelpConfig.getHelpList();
        const helpCfg = HelpConfig.getHelpCfg();
        let helpGroup = [];
        _.forEach(helpList, (group) => {
            // 权限检查：如果是masterOnly组且用户不是master，则跳过
            if (group.masterOnly && !e.isMaster) {
                return;
            }
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

        // 如果启用两列布局，预先分割数组
        let leftGroups = [];
        let rightGroups = [];
        let fullWidthGroups = [];
        if (helpCfg.twoColumnLayout) {
            // 分离出需要跨列显示的组
            const normalGroups = [];
            helpGroup.forEach((group) => {
                if (group.fullWidth) {
                    fullWidthGroups.push(group);
                } else if (group.column === 'left') {
                    leftGroups.push(group);
                } else if (group.column === 'right') {
                    rightGroups.push(group);
                } else {
                    normalGroups.push(group);
                }
            });
            // 对于未指定列位置的组，智能平衡分配到左右两列
            if (normalGroups.length > 0) {
                // 计算总组数和目标分配
                const totalGroups = leftGroups.length + rightGroups.length + normalGroups.length;
                const targetLeftCount = Math.ceil(totalGroups / 2);
                const targetRightCount = Math.floor(totalGroups / 2);
                
                // 计算每列还需要多少个组
                let leftNeeded = Math.max(0, targetLeftCount - leftGroups.length);
                let rightNeeded = Math.max(0, targetRightCount - rightGroups.length);
                
                // 如果某个列已经超过目标，则全部给另一个列
                if (leftGroups.length >= targetLeftCount) {
                    rightGroups.push(...normalGroups);
                } else if (rightGroups.length >= targetRightCount) {
                    leftGroups.push(...normalGroups);
                } else {
                    // 按需分配，优先分配给需要更多的列
                    normalGroups.forEach((group) => {
                        if (leftNeeded > rightNeeded) {
                            leftGroups.push(group);
                            leftNeeded--;
                        } else {
                            rightGroups.push(group);
                            rightNeeded--;
                        }
                    });
                }
            }
        }

        let themeData = await this.getThemeData(helpCfg, helpCfg);
        return await Render.render('help/index.html', {
            helpCfg,
            helpGroup,
            leftGroups,
            rightGroups,
            fullWidthGroups,
            ...themeData,
            element: 'default'
        }, { e, scale: 1.6 });
    }

    async entertainmentHelp(e) {
        const entertainmentHelpList = HelpConfig.getEntertainmentHelpList();
        const entertainmentHelpCfg = HelpConfig.getEntertainmentHelpCfg();
        let helpGroup = [];
        _.forEach(entertainmentHelpList, (group) => {
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

        // 如果启用两列布局，预先分割数组
        let leftGroups = [];
        let rightGroups = [];
        let fullWidthGroups = [];
        if (entertainmentHelpCfg.twoColumnLayout) {
            // 分离出需要跨列显示的组
            const normalGroups = [];
            helpGroup.forEach((group) => {
                if (group.fullWidth) {
                    fullWidthGroups.push(group);
                } else if (group.column === 'left') {
                    leftGroups.push(group);
                } else if (group.column === 'right') {
                    rightGroups.push(group);
                } else {
                    normalGroups.push(group);
                }
            });
            // 对于未指定列位置的组，智能平衡分配到左右两列
            if (normalGroups.length > 0) {
                // 计算总组数和目标分配
                const totalGroups = leftGroups.length + rightGroups.length + normalGroups.length;
                const targetLeftCount = Math.ceil(totalGroups / 2);
                const targetRightCount = Math.floor(totalGroups / 2);
                
                // 计算每列还需要多少个组
                let leftNeeded = Math.max(0, targetLeftCount - leftGroups.length);
                let rightNeeded = Math.max(0, targetRightCount - rightGroups.length);
                
                // 如果某个列已经超过目标，则全部给另一个列
                if (leftGroups.length >= targetLeftCount) {
                    rightGroups.push(...normalGroups);
                } else if (rightGroups.length >= targetRightCount) {
                    leftGroups.push(...normalGroups);
                } else {
                    // 按需分配，优先分配给需要更多的列
                    normalGroups.forEach((group) => {
                        if (leftNeeded > rightNeeded) {
                            leftGroups.push(group);
                            leftNeeded--;
                        } else {
                            rightGroups.push(group);
                            rightNeeded--;
                        }
                    });
                }
            }
        }

        let themeData = await this.getThemeData(entertainmentHelpCfg, entertainmentHelpCfg);
        return await Render.render('help/index.html', {
            helpCfg: entertainmentHelpCfg,
            helpGroup,
            leftGroups,
            rightGroups,
            fullWidthGroups,
            ...themeData,
            element: 'default'
        }, { e, scale: 1.6 });
    }

    async getThemeData(diyStyle, sysStyle) {
        const helpConfig = { ...sysStyle, ...diyStyle };
        const colCount = Math.min(5, Math.max(parseInt(helpConfig?.colCount) || 3, 2));
        const colWidth = Math.min(600, Math.max(200, parseInt(helpConfig?.colWidth) || 350));
        const twoColumnLayout = helpConfig?.twoColumnLayout === true;
        
        // 两侧空白区域（每侧15px，总共30px）
        const sidePadding = 30;
        // 两列布局的间距
        const columnGap = 20;
        
        let width;
        if (twoColumnLayout) {
            // 两列布局：每个表格宽度 = 列数 * 列宽，总宽度 = 两个表格宽度 + 中间间距 + 两侧空白
            const tableWidth = colCount * colWidth;
            width = tableWidth * 2 + columnGap + sidePadding;
        } else {
            // 单列布局：总宽度 = 两侧空白区域 + (列数 * 列宽)
            width = colCount * colWidth + sidePadding;
        }
        
        const theme = {
            main: `../imgs/bg.jpg`,
            bg: `../imgs/bg.jpg`,
            style: style
        };
        const themeStyle = theme.style || {};
        const ret = [`
          body{background-image:url(${theme.bg}) no-repeat;width:${width}px;}
          .container{background-image:url(${theme.main});background-size:cover;width:${width}px;}
          .help-table .td,.help-table .th{width:${100 / colCount}%}
          `];
        
        // 如果启用两列布局，添加相应的CSS
        if (twoColumnLayout) {
            ret.push(`
              .help-content-wrapper{display:flex;gap:${columnGap}px;width:100%;}
              .help-column{flex:1;min-width:0;}
              .help-column .cont-box{width:100%;}
            `);
        }
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
