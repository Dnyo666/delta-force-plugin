import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const pluginPackageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'))
const rootPackageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))

const currentVersion = pluginPackageJson.version
const yunzaiVersion = rootPackageJson.version
const isMiao = rootPackageJson.name === 'miao-yunzai'
const isTrss = !!Array.isArray(Bot.uin)

let Version = {
  isMiao,
  isTrss,
  get version() {
    return currentVersion
  },
  get yunzai() {
    return yunzaiVersion
  }
}

export default Version
