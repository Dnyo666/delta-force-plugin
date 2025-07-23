import YAML from 'yaml'
import fs from 'node:fs'
import path from 'node:path'
import lodash from 'lodash'
import { pluginRoot } from '../model/path.js'

const configDir = path.join(pluginRoot, 'config', 'config')
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true })
}

const userConfigPath = path.join(configDir, 'config.yaml');
const defaultConfigPath = path.join(pluginRoot, 'config', 'config_default.yaml');

if (!fs.existsSync(userConfigPath)) {
  fs.copyFileSync(defaultConfigPath, userConfigPath);
  logger.mark('[DELTA FORCE PLUGIN] 自动创建 config.yaml 成功');
}

class Config {
  constructor () {
    this.cache = {
      config: null,
      config_default: null,
      user: null,
      user_default: null
    }

    this.fileMaps = {
      config: path.join(configDir, 'config.yaml'),
      config_default: path.join(pluginRoot, 'config', 'config_default.yaml'),
      user: path.join(configDir, 'user.yaml'),
      user_default: path.join(pluginRoot, 'config', 'user_default.yaml')
    }

    this.watchFiles()
  }

  loadYAML (filePath) {
    try {
      if (fs.existsSync(filePath)) {
        return YAML.parse(fs.readFileSync(filePath, 'utf-8'))
      }
      return null
    } catch (error) {
      const fileName = path.basename(filePath)
      logger.mark(`[DELTA FORCE PLUGIN] 读取 ${fileName} 失败`, error)
      return null
    }
  }

  saveConfig (filePath, data) {
    try {
      fs.writeFileSync(filePath, YAML.stringify(data))
      return true
    } catch (error) {
      const fileName = path.basename(filePath)
      logger.mark(`[DELTA FORCE PLUGIN] 写入 ${fileName} 失败`, error)
      return false
    }
  }

  watchFiles () {
    for (const key in this.fileMaps) {
      const filePath = this.fileMaps[key]
      if (!fs.existsSync(filePath) && key.endsWith('_default')) {
        continue // 不监视不存在的默认配置文件
      }
      fs.watchFile(filePath, { interval: 1000 }, () => {
        logger.mark(`[DELTA FORCE PLUGIN] ${path.basename(filePath)} 文件变动，重新加载`)
        this.cache[key] = null // 清空缓存，下次访问时重新加载
      })
    }
  }

  get (app, name) {
    const config = this.getConfig()
    const defConfig = this.getDefConfig()
    if (config && config[app] && !lodash.isUndefined(config[app][name])) {
      return config[app][name]
    }
    if (defConfig && defConfig[app] && !lodash.isUndefined(defConfig[app][name])) {
      return defConfig[app][name]
    }
    logger.warn(`[DELTA FORCE PLUGIN] config.yaml not found: ${app}.${name}`)
    return undefined
  }

  getConfig () {
    if (this.cache.config === null) {
      this.cache.config = this.loadYAML(this.fileMaps.config) || {}
    }
    return this.cache.config
  }

  getDefConfig () {
    if (this.cache.config_default === null) {
      this.cache.config_default = this.loadYAML(this.fileMaps.config_default) || {}
    }
    return this.cache.config_default
  }

  setConfig (config_data) {
    if (this.saveConfig(this.fileMaps.config, config_data)) {
      this.cache.config = config_data
      return true
    }
    return false
  }

  // 用户相关方法可后续重构
  getUserConfig() {
    if (!this.cache.user) {
      this.cache.user = this.loadYAML(this.fileMaps.user);
    }
    return this.cache.user;
  }

  getDefUserConfig() {
    if (!this.cache.user_default) {
      this.cache.user_default = this.loadYAML(this.fileMaps.user_default);
    }
    return this.cache.user_default;
  }

  setUserConfig(user_data) {
    return this.saveConfig(this.fileMaps.user, user_data);
  }

  getUserData(userId) {
    const dataDir = path.join(pluginRoot, '..', '..', 'data', 'delta-force');
    const userConfigFile = path.join(dataDir, `${userId}.yaml`);
    try {
      return fs.existsSync(userConfigFile) ? this.loadYAML(userConfigFile) : [];
    } catch (error) {
      logger.mark(`[DELTA FORCE PLUGIN] 读取用户数据 ${userId}.yaml 失败`, error);
      return [];
    }
  }

  setUserData(userId, userData) {
    const dataDir = path.join(pluginRoot, '..', '..', 'data', 'delta-force');
    const userConfigFile = path.join(dataDir, `${userId}.yaml`);
    try {
      if (!userData || !userData.length) {
        if (fs.existsSync(userConfigFile)) fs.unlinkSync(userConfigFile);
        redis.del(`delta-force:token:${userId}`);
        return true;
      }
      this.saveConfig(userConfigFile, userData);
      const currentToken = Array.isArray(userData) && userData.length > 0 ? userData[0].token : userData.token;
      if (currentToken) {
        redis.set(`delta-force:token:${userId}`, currentToken);
      }
      return true;
    } catch (error) {
      logger.mark(`[DELTA FORCE PLUGIN] 写入用户数据 ${userId}.yaml 失败`, error);
      return false;
    }
  }
}

export default new Config()