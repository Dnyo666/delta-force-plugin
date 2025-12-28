import { pluginRoot } from '../model/path.js'

function scale(pct = 1, customScale = 1) {
  const baseScale = 1 // 默认最佳缩放比例
  pct = pct * baseScale * customScale
  return `style=transform:scale(${pct})`
}

const Render = {
  async render(path, params = {}, cfg = { retType: 'default', saveId: '' }) {
    const { e } = cfg
    if (!e) {
      logger.error('[Delta-Force Render] 缺少 e 参数')
      return false
    }

    try {
      return await e.runtime.render('delta-force-plugin', path, params, {
        retType: cfg.retType || 'default',
        renderCfg: cfg.renderCfg || {},
        beforeRender({ data }) {
          const resPath = data.pluResPath
          const layoutPath = `${pluginRoot}/resources/common/layout/`
          const saveId = (cfg.saveId || e?.user_id || data.saveId || 'unknown') +
            '_' + Math.random().toString().slice(-6)

          const customScale = cfg.scale || cfg.renderCfg?.scale || 1

          return {
            ...data,
            saveId,
            _res_path: resPath + '/',
            defaultLayout: layoutPath + 'default.html',
            elemLayout: layoutPath + 'elem.html',
            sys: {
              scale: scale(1, customScale)
            },
            copyright: `Created By Yunzai-Bot & Delta-Force-Plugin`,
            pageGotoParams: {
              waitUntil: 'networkidle2',
              timeout: 60000, // 60秒超时
            },
              viewport: cfg.renderCfg?.viewPort || cfg.viewport || {
                width: 1200,
              height: 5000 // 设置足够大的高度，让系统通过 boundingBox 自动截取
            }
          }
        }
      })
    } catch (error) {
      logger.error('[Delta-Force Render] 渲染失败:', error)
      return false
    }
  }
}

export default Render