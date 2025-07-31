import fs from 'node:fs'
import path from 'node:path'
import { _path } from './path.js'

class Init {
  constructor() {
    this.createDataDir()
  }

  /**
   * 创建插件所需的数据目录
   */
  createDataDir() {
    const dataDir = path.join(_path, 'data', 'delta-force')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
      logger.mark('[DELTA FORCE PLUGIN] 数据目录创建成功:', dataDir)
    }
  }
}

new Init()

export default Init
