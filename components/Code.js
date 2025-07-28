import Config from './Config.js'
import fetch from 'node-fetch'
import https from 'https'
import crypto from 'crypto'

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
})

export default class Code {
  constructor (e) {
    this.e = e
    this.cfg = Config.getConfig()?.delta_force || {}
    // clientID 将由调用方提供，这里不再处理
  }

  /**
   * 基础请求方法，自动处理认证和错误
   * @param {string} url - 请求的API端点
   * @param {object} params - 请求参数 (for GET) or body (for POST)
   * @param {string} method - 'GET' or 'POST'
   * @returns {Promise<object|boolean>}
   */
  async request (url, params, method = 'GET') {
    const { api_key: apiKey, base_url: BASE_URL } = this.cfg

    if (!apiKey || apiKey === 'sk-xxxxxxx') {
      logger.error('[DELTA FORCE PLUGIN] APIKey 未配置，请在 config/config.yaml 中填写')
      if (this.e) {
        await this.e.reply('APIKey 未配置，请联系机器人管理员。')
      }
      return false
    }

    const headers = {
      Authorization: `Bearer ${apiKey}`
    }

    let fullUrl = `${BASE_URL}${url}`
    const upperCaseMethod = method.toUpperCase();
    const options = { method: upperCaseMethod, headers }

    if (upperCaseMethod === 'GET') {
      if (params) {
        const queryString = new URLSearchParams(params).toString()
        fullUrl += `?${queryString}`
      }
    } else if (upperCaseMethod === 'POST') {
      headers['Content-Type'] = 'application/x-www-form-urlencoded'
      options.body = new URLSearchParams(params).toString()
    }

    try {
      const response = await fetch(fullUrl, options)
      const responseBody = await response.json().catch(() => ({}));

      if (!response.ok) {
        logger.error(`[DELTA FORCE PLUGIN] API 请求失败: ${response.status} ${response.statusText} - ${fullUrl}`);
        logger.error(`[DELTA FORCE PLUGIN] 错误详情: ${JSON.stringify(responseBody)}`);
        // 关键修复：返回错误体，而不是null
        return responseBody;
      }
      // 根据API文档，code为0代表成功
      if (responseBody.code !== 0 && responseBody.success !== true) {
        logger.warn(`[DELTA FORCE PLUGIN] API 返回错误: ${responseBody.msg || responseBody.message || '未知错误'} - ${fullUrl}`)
      }
      return responseBody
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
   * 绑定游戏内角色
   * @param {string} frameworkToken 
   */
  async bindCharacter(frameworkToken) {
    return this.request('/df/person/bind', { frameworkToken, method: 'bind' }, 'GET');
  }

  /**
   * 获取每日密码
   */
  async getDailyKeyword() {
    return this.request('/df/tools/dailykeyword', {}, 'GET');
  }

  /**
   * 获取文章列表
   */
  async getArticleList() {
    return this.request('/df/tools/article/list', {}, 'POST');
  }

  /**
   * 获取文章详情
   * @param {string} threadId 文章ID
   */
  async getArticleDetail(threadId) {
    return this.request('/df/tools/article/detail', { threadId }, 'GET');
  }
  
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
  async getPersonalData (frameworkToken, type = '', seasonid = 5) {
    const params = { frameworkToken }
    if (type) {
      params.type = type
    }
    // 如果 seasonid 不是 'all'，则添加到参数中
    if (seasonid !== 'all') {
      params.seasonid = seasonid
    }
    return this.request('/df/person/personalData', params, 'GET')
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

  /**
   * 获取个人藏品
   * @param {string} frameworkToken - 用户绑定的token
   */
  async getCollection (frameworkToken) {
    return this.request('/df/person/collection', { frameworkToken }, 'GET')
  }

  /**
   * 获取藏品信息对照表
   */
  async getCollectionMap () {
    return this.request('/df/object/collection', {}, 'GET')
  }

  /**
   * 获取日报
   * @param {string} frameworkToken - 用户绑定的token
   * @param {string} type - 'sol' 或 'mp'
   */
  async getDailyRecord(frameworkToken, type = '') {
      const params = { frameworkToken };
      if (type) {
          params.type = type;
      }
      return this.request('/df/person/dailyRecord', params, 'GET');
  }

  /**
   * 获取周报
   * @param {string} frameworkToken - 用户绑定的token
   * @param {string} type - 'sol' 或 'mp'
   * @param {boolean} isShowNullFriend - 是否显示空值队友
   * @param {string} date - 日期，格式 YYYYMMDD
   */
  async getWeeklyRecord(frameworkToken, type = '', isShowNullFriend = true, date = '') {
      const params = { frameworkToken, isShowNullFriend: String(isShowNullFriend) };
      if (type) params.type = type;
      if (date) params.date = date;
      return this.request('/df/person/weeklyRecord', params, 'GET');
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

  // ---- 开黑房间 V2 ----

  async getRoomList (clientID, type = '', hasPassword = '') {
    const params = { clientID };
    if (type) {
      params.type = type;
    }
    if (hasPassword !== '') {
      params.hasPassword = hasPassword;
    }
    return await this.request('/df/tools/Room/list', params, 'get');
  }

  async getRoomInfo (token, clientID) {
    const params = { frameworkToken: token, clientID };
    return await this.request('/df/tools/Room/info', params, 'get');
  }

  async createRoom (token, clientID, type, mapid = '0', tag = '', password = '', onlyCurrentlyClient = false) {
    const data = {
      frameworkToken: token,
      clientID,
      type,
      tag,
      password,
      mapid,
      onlyCurrentlyClient: String(onlyCurrentlyClient)
    };
    return await this.request('/df/tools/Room/creat', data, 'post');
  }

  async joinRoom (token, clientID, roomId, password = '') {
    const data = { frameworkToken: token, clientID, roomId, password };
    return await this.request('/df/tools/Room/join', data, 'post');
  }

  async quitRoom (token, clientID, roomId) {
    const data = { frameworkToken: token, clientID, roomId };
    return await this.request('/df/tools/Room/quit', data, 'post');
  }

  async kickMember (token, clientID, roomId, targetFrameworkToken) {
    const data = { frameworkToken: token, clientID, roomId, targetFrameworkToken };
    return await this.request('/df/tools/Room/kick', data, 'post');
  }
  
  async getMaps() {
    return await this.request('/df/object/maps', {}, 'get');
  }

  async getOperators() {
    return await this.request('/df/object/operator2', {}, 'get');
  }

  async getTags() {
    return await this.request('/df/tools/Room/tags', {}, 'get');
  }
}