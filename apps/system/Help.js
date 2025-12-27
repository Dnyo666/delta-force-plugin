import HelpConfig from '../../components/HelpConfig.js';
import StyleConfig from '../../components/StyleConfig.js';
import Render from '../../components/Render.js';
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
        
        // 处理帮助组图标和权限
        const processGroup = (group) => {
            // 权限检查：如果是masterOnly组且用户不是master，则返回null
            if (group.masterOnly && !e.isMaster) {
                return null;
            }
            
            // 处理组内的图标
            if (group.list && Array.isArray(group.list)) {
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
            }
            
            return group;
        };

        let leftGroups = [];
        let rightGroups = [];
        let topFullWidthGroups = [];
        let bottomFullWidthGroups = [];
        let helpGroup = [];

        // 检查是新格式（对象）还是旧格式（数组）
        if (helpList && typeof helpList === 'object' && !Array.isArray(helpList)) {
            // 新格式：从 left/right/fullWidth 中获取组
            // 处理 fullWidth 组，分为顶部和底部两部分
            if (helpList.fullWidth && Array.isArray(helpList.fullWidth)) {
                const sorted = helpList.fullWidth
                    .map(processGroup)
                    .filter(g => g !== null)
                    .sort((a, b) => (a.order || 999) - (b.order || 999));
                // order < 50 的显示在顶部，order >= 50 的显示在底部
                sorted.forEach(group => {
                    if ((group.order || 999) < 50) {
                        topFullWidthGroups.push(group);
                    } else {
                        bottomFullWidthGroups.push(group);
                    }
                });
            }

            // 处理 left 组
            if (helpList.left && Array.isArray(helpList.left)) {
                const sorted = helpList.left
                    .map(processGroup)
                    .filter(g => g !== null)
                    .sort((a, b) => (a.order || 999) - (b.order || 999));
                leftGroups.push(...sorted);
            }

            // 处理 right 组
            if (helpList.right && Array.isArray(helpList.right)) {
                const sorted = helpList.right
                    .map(processGroup)
                    .filter(g => g !== null)
                    .sort((a, b) => (a.order || 999) - (b.order || 999));
                rightGroups.push(...sorted);
            }

            // 合并所有组用于单列布局
            helpGroup = [...topFullWidthGroups, ...bottomFullWidthGroups, ...leftGroups, ...rightGroups];
        } else {
            // 旧格式：兼容原有数组格式
            _.forEach(helpList, (group) => {
                const processed = processGroup(group);
                if (processed) {
                    helpGroup.push(processed);
                }
            });

            // 如果启用两列布局，预先分割数组
            if (helpCfg.twoColumnLayout) {
                // 分离出需要跨列显示的组
                const normalGroups = [];
                helpGroup.forEach((group) => {
                    if (group.fullWidth) {
                        // 根据 order 分配到顶部或底部
                        if ((group.order || 999) < 50) {
                            topFullWidthGroups.push(group);
                        } else {
                            bottomFullWidthGroups.push(group);
                        }
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
        }

        let themeData = await this.getThemeData(helpCfg, helpCfg) || {};
        return await Render.render('help/index.html', {
            helpCfg,
            helpGroup,
            leftGroups,
            rightGroups,
            topFullWidthGroups,
            bottomFullWidthGroups,
            ...themeData,
            themePath: themeData.themePath || 'default',
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

        let themeData = await this.getThemeData(entertainmentHelpCfg, entertainmentHelpCfg) || {};
        return await Render.render('help/index.html', {
            helpCfg: entertainmentHelpCfg,
            helpGroup,
            leftGroups,
            rightGroups,
            topFullWidthGroups: [],
            bottomFullWidthGroups: [],
            ...themeData,
            themePath: themeData.themePath || 'default',
            element: 'default'
        }, { e, scale: 1.6 });
    }

    async getThemeData(diyStyle, sysStyle) {
        const helpConfig = { ...sysStyle, ...diyStyle };
        const colCount = Math.min(5, Math.max(parseInt(helpConfig?.colCount) || 3, 2));
        const colWidth = Math.min(600, Math.max(200, parseInt(helpConfig?.colWidth) || 350));
        const twoColumnLayout = helpConfig?.twoColumnLayout === true;
        
        // 获取主题名称，默认为 'default'
        const themeName = helpConfig?.themeName || 'default';
        
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
        
        // 从 StyleConfig 获取指定主题的样式配置（支持热重载）
        const style = StyleConfig.getStyle(themeName);
        const themePath = StyleConfig.getThemePath(themeName);
        
        // 构建绝对路径（Puppeteer 渲染时相对路径的 base URL 不可靠）
        const path = await import('node:path');
        const { pluginRoot } = await import('../../model/path.js');
        
        const bgPath = path.join(pluginRoot, 'resources', 'help', 'imgs', themePath, 'bg.jpg');
        const iconPath = path.join(pluginRoot, 'resources', 'help', 'imgs', themePath, 'icon.png');
        
        const theme = {
            main: bgPath,
            bg: bgPath,
            icon: iconPath,
            style: style,
            themePath: themePath
        };
        const themeStyle = theme.style || {};
        const ret = [];
        
        // body 样式设置（宽度、字体、背景图）
        const bodyFontFamily = themeStyle.fontFamily ?? diyStyle.fontFamily ?? sysStyle.fontFamily ?? 'Microsoft YaHei, SimHei, Arial, sans-serif';
        ret.push(`body{width:${width}px;font-family:${bodyFontFamily};background-image:url("${theme.bg}");background-repeat:no-repeat;background-size:cover;}`);
        
        // container 样式设置（宽度、背景图）
        ret.push(`.container{width:${width}px;background-image:url("${theme.main}");background-position:top left;background-repeat:no-repeat;background-size:100% auto;}`);
        
        // help-icon 样式设置（背景图）
        ret.push(`.help-icon{background-image:url("${theme.icon}");background-size:500px auto;}`);
        
        // 表格宽度
        ret.push(`.help-table .td,.help-table .th{width:${100 / colCount}%}`);
        
        // 如果启用两列布局，添加相应的CSS
        if (twoColumnLayout) {
            ret.push(`
              .help-content-wrapper{display:flex;gap:${columnGap}px;width:100%;}
              .help-column{flex:1;min-width:0;}
              .help-column .cont-box{width:100%;}
            `);
        }
        
        const css = function (sel, cssProp, key, def, fn) {
            let val = themeStyle[key] ?? diyStyle[key] ?? sysStyle[key] ?? def;
            if (fn) {
                val = fn(val);
            }
            ret.push(`${sel}{${cssProp}:${val}}`);
        };
        
        // 其他样式设置
        css('.head-box .title', 'font-size', 'titleFontSize', '50px');
        css('.help-group', 'font-size', 'groupFontSize', '18px');
        css('.help-title', 'font-size', 'commandFontSize', '16px');
        css('.help-desc', 'font-size', 'descFontSize', '13px');
        css('.help-table .td,.help-table .th', 'font-size', 'tableFontSize', '14px');
        
        // 颜色和样式设置
        css('.help-title,.help-group', 'color', 'fontColor', '#ceb78b');
        css('.help-title,.help-group', 'text-shadow', 'fontShadow', 'none');
        css('.help-desc', 'color', 'descColor', '#eee');
        css('.cont-box', 'background', 'contBgColor', 'rgba(43, 52, 61, 0.8)');
        css('.cont-box', 'backdrop-filter', 'contBgBlur', 3, (n) => diyStyle.bgBlur === false ? 'none' : `blur(${n}px)`);
        css('.help-group', 'background', 'headerBgColor', 'rgba(34, 41, 51, .4)');
        css('.help-table .tr:nth-child(odd)', 'background', 'rowBgColor1', 'rgba(34, 41, 51, .2)');
        css('.help-table .tr:nth-child(even)', 'background', 'rowBgColor2', 'rgba(34, 41, 51, .4)');
        
        const finalStyle = ret.join('\n');
        return {
            style: `<style>${finalStyle}</style>`,
            colCount
        };
    }
}
