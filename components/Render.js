import { pluginRoot } from '../model/path.js'

export default {
  async render (tpl, data = {}, cfg = {}) {
    let { e } = cfg
    if (!e) return false

    return e.runtime.render('delta-force-plugin-cursor', tpl, data, {
      ...cfg,
      beforeRender ({ data }) {
        const _res_path = data.pluResPath
        return {
          ...data,
          _res_path: `${_res_path}/`,
          defaultLayout: `${pluginRoot}/resources/common/layout/default.html`
        }
      }
    })
  }
}