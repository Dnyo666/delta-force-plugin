import Version from './Version.js'
import Config from './Config.js'
import { pluginName, pluginRoot, pluginResources } from '../model/path.js'
import fs from 'fs'

function getScale(pct = null) {
    pct = pct || (Config.getConfig().render_scale / 100)
    pct = Math.min(2, Math.max(0.5, pct))
    return `style=transform:scale(${pct});`
}

const time = {}
function getsaveId(name) {
    if (!time[name]) time[name] = 0;

    time[name]++;

    if (time[name] === 1) {
        setTimeout(() => {
            time[name] = 0;
        }, 10000);
    }

    return `${name}_${time[name]}`;
}

const Render = {
    async render(path, params, cfg) {
        let { e } = cfg
        if (!e.runtime) {
            logger.mark(logger.blue('[DeltaForce]'), logger.red(`未找到e.runtime，请升级至最新版Yunzai`));
        }

        let BotName = Version.isMiao ? 'Miao-Yunzai' : Version.isTrss ? 'TRSS-Yunzai' : 'Yunzai-Bot'
        let currentVersion = "1.0.0"
        try {
            const packageJson = JSON.parse(fs.readFileSync(`${pluginRoot}/package.json`, 'utf-8'));
            if (packageJson.version) {
                currentVersion = packageJson.version;
            }
        } catch (error) {
            logger.error(`[DeltaForce] 读取 package.json 失败: ${error}`);
        }
        
        // const pluginName = "delta-force-plugin"; // This is wrong

        return e.runtime.render(pluginName, path, params, {
            retType: cfg.retType || (cfg.retMsgId ? 'msgId' : 'default'),
            beforeRender({ data }) {
                let pluginDisplayName = '';
                if (data.pluginName !== false) {
                    pluginDisplayName = ` & ${data.pluginName || 'DeltaForce'}`;
                    if (data.pluginVersion !== false) {
                        pluginDisplayName += `<span class="version">${currentVersion}</span>`;
                    }
                }
                const layoutPath = `${pluginRoot}/resources/common/layout/`;
                return {
                    ...data,
                    avatarUrl: params.isSelf && e.friend?.getAvatarUrl?.() || "",
                    pluginResources,
                    _res_path: pluginResources,
                    _layout_path: layoutPath,
                    defaultLayout: `${layoutPath}default.html`,
                    elemLayout: `${layoutPath}elem.html`,
                    sys: {
                        scale: getScale(cfg.scale)
                    },
                    saveId: getsaveId(data.saveId),
                    copyright: `Created By ${BotName}<span class="version">${Version.yunzai}</span>${pluginDisplayName}`,
                }
            }
        })
    }
}

export default Render;