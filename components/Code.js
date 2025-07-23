import fetch from 'node-fetch'
import Config from './Config.js'
import utils from '../utils/utils.js'

const BASE_URL = 'https://df-api.cduestc.fun' // 从插件指南获取的临时API地址

class Code {
  constructor (e) {
    this.e = e
  }

  /**
   * 基础请求方法，自动处理认证和错误
   * @param {string} url - 请求的API端点
   * @param {object} params - 请求参数 (for GET) or body (for POST)
   * @param {string} method - 'GET' or 'POST'
   * @returns {Promise<object|boolean>}
   */
  async request (url, params, method = 'GET') {
    const deltaForceConfig = Config.getConfig().delta_force || {}
    const apiKey = deltaForceConfig.api_key

    if (!apiKey) {
      logger.error('[DELTA FORCE PLUGIN] APIKey 未配置，请在 config/config/config.yaml 中填写')
      if (this.e) {
        await this.e.reply('APIKey 未配置，请联系机器人管理员。')
      }
      return false
    }

    const headers = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }

    let fullUrl = `${BASE_URL}${url}`
    const options = { method, headers }

    if (method === 'GET') {
      if (params) {
        const queryString = new URLSearchParams(params).toString()
        fullUrl += `?${queryString}`
      }
    } else if (method === 'POST') {
      options.body = JSON.stringify(params)
    }

        try {
      const response = await fetch(fullUrl, options)
      if (!response.ok) {
        logger.error(`[DELTA FORCE PLUGIN] API 请求失败: ${response.status} ${response.statusText} - ${fullUrl}`)
        const errorBody = await response.text()
        logger.error(`[DELTA FORCE PLUGIN] 错误详情: ${errorBody}`)
        return false
      }
      const res = await response.json()
      // 根据API文档，code为0代表成功
      if (res.code !== 0 && res.success !== true) {
        logger.warn(`[DELTA FORCE PLUGIN] API 返回错误: ${res.msg || res.message || '未知错误'} - ${fullUrl}`)
      }
      return res
        } catch (error) {
      logger.error(`[DELTA FORCE PLUGIN] 网络请求异常: ${error} - ${fullUrl}`)
      return false
    }
  }

  // --- 登录相关 ---

  /**
   * 获取登录二维码
   * @param {string} platform - 'qq', 'wechat', 'qqsafe', 'wegame'
   */
  async getLoginQr (platform) {
    return this.request(`/login/${platform}/qr`)
  }

  /**
   * 获取登录状态
   * @param {string} platform - 'qq', 'wechat', 'qqsafe', 'wegame'
   * @param {string} frameworkToken - 登录流程中获取的临时 token
   */
  async getLoginStatus (platform, frameworkToken) {
    return this.request(`/login/${platform}/status`, { frameworkToken }, 'GET')
  }

  // --- 用户数据 ---
  
  /**
   * 获取个人信息
   * @param {string} frameworkToken - 用户绑定的token
   */
  async getPersonalInfo (frameworkToken) {
    return this.request('/df/person/personalInfo', { frameworkToken }, 'GET')
    }

  /**
   * 获取个人数据（烽火地带和全面战场）
   * @param {string} frameworkToken - 用户绑定的token
   */
  async getPersonalData (frameworkToken) {
    return this.request('/df/person/personalData', { frameworkToken }, 'GET')
  }

  /**
   * 获取战绩记录
   * @param {string} frameworkToken - 用户绑定的token
   * @param {number} type - 模式ID (4: 烽火地带, 5: 全面战场)
   * @param {number} page - 页码
   */
  async getRecord (frameworkToken, type, page) {
    return this.request('/df/person/record', { frameworkToken, type, page }, 'GET')
  }

  /**
   * 获取货币信息
   * @param {string} frameworkToken - 用户绑定的token
   */
  async getMoney (frameworkToken) {
    return this.request('/df/person/money', { frameworkToken }, 'GET')
  }

  /**
   * 获取流水记录
   * @param {string} frameworkToken - 用户绑定的token
   * @param {number} type - 类型ID
   * @param {number} page - 页码
   */
  async getFlows (frameworkToken, type, page) {
    return this.request('/df/person/flows', { frameworkToken, type, page }, 'GET')
  }

  // --- 账号绑定 ---

  /**
   * 绑定用户 Token
   * @param {object} data - { frameworkToken, platformID, clientID, clientType }
   */
  async bindUser (data) {
    return this.request('/user/bind', data, 'POST')
  }

  /**
   * 解绑用户 Token
   * @param {object} data - { frameworkToken, platformID, clientID, clientType }
   */
  async unbindUser (data) {
    return this.request('/user/unbind', data, 'POST')
    }

  /**
   * 获取用户绑定的 Token 列表
   * @param {object} params - { platformID, clientID, clientType }
   */
  async getUserList (params) {
    return this.request('/user/list', params, 'GET')
  }
}

export default Code