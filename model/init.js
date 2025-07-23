import fs from 'node:fs'
import path from 'node:path'
import { pluginRoot } from './path.js'
import Config from '../components/Config.js'

class Init {
  constructor () {
    this.createDataDir()
  }

  /**
   * 创建插件所需的数据目录
   */
  createDataDir () {
    const dataDir = path.join(pluginRoot, '..', '..', 'data', 'delta-force')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
      logger.mark('[DELTA FORCE PLUGIN] 数据目录创建成功:', dataDir)
    }
  }
}

new Init()

export default Init
