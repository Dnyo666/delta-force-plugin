import { pluginRoot } from '../model/path.js'
import Config from './Config.js'

function scale(pct = 1, customScale = 1) {
  const renderScale = (Config.getConfig())?.render_scale || 10
  const baseScale = Math.min(2, Math.max(0.5, renderScale))
  pct = pct * baseScale * customScale
  return `style=transform:scale(${pct})`
}

export default {
  async render(tpl, data = {}, cfg = {}) {
    let { e } = cfg
    if (!e) return false

    return e.runtime.render('delta-force-plugin', tpl, data, {
      ...cfg,
      beforeRender({ data }) {
        const _res_path = data.pluResPath
        return {
          ...data,
          sys: {
            scale: scale()
          },
          _res_path: `${_res_path}/`,
          defaultLayout: `${pluginRoot}/resources/common/layout/default.html`
        }
      }
    })
  }
}