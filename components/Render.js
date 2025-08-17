import { pluginRoot } from '../model/path.js'

function scale(pct = 1, customScale = 1) {
  const baseScale = 1 // 不使用额外缩放
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

    if (!e.runtime) {
      logger.error('[Delta-Force Render] 未找到e.runtime，请升级至最新版Yunzai')
      return false
    }

    try {
      // 构建渲染配置
      const renderOptions = {
        retType: cfg.retType || 'default'
      }

      // 如果有renderCfg配置，添加到options中
      if (cfg.renderCfg) {
        renderOptions.renderCfg = cfg.renderCfg
      }

      return await e.runtime.render('delta-force-plugin', path, params, {
        ...renderOptions,
        beforeRender({ data }) {
          const resPath = data.pluResPath
          const layoutPath = `${pluginRoot}/resources/common/layout/`
          const saveId = (cfg.saveId || e?.user_id || data.saveId || 'unknown') +
            '_' + Math.random().toString().slice(-6)

          const customScale = cfg.scale || 1

          return {
            ...data,
            saveId,
            _res_path: resPath + '/',
            _layout_path: layoutPath,
            defaultLayout: layoutPath + 'default.html',
            elemLayout: layoutPath + 'elem.html',
            sys: {
              scale: scale(1, customScale)
            },
            copyright: `Created By Yunzai-Bot & Delta-Force-Plugin`
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