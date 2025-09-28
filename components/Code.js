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
   * @param {object} opts - 额外选项，如 { responseType: 'stream' }
   * @returns {Promise<object|boolean>}
   */
  async request (url, params, method = 'GET', opts = {}) {
    const { responseType = 'json' } = opts
    const { api_key: apiKey } = this.cfg
    const BASE_URL = 'https://df-api.shallow.ink' // 固定的API地址

    if (!apiKey || apiKey === 'sk-xxxxxxx') {
      const errorMsg = 'APIKey 未配置，请联系机器人管理员。'
      logger.error('[DELTA FORCE PLUGIN] APIKey 未配置，请在 config/config.yaml 中填写')
      if (this.e) {
        await this.e.reply(errorMsg)
      }
      if (responseType === 'stream') {
        return { stream: null, error: { message: errorMsg } }
      }
      return false
    }

    const headers = {
      Authorization: `Bearer ${apiKey}`
    }

    let fullUrl = `${BASE_URL}${url}`
    const upperCaseMethod = method.toUpperCase()
    const fetchOptions = { method: upperCaseMethod, headers }

    if (upperCaseMethod === 'GET') {
      if (params) {
        // 特殊处理数组参数，特别是id参数
        const processedParams = new URLSearchParams()
        for (const [key, value] of Object.entries(params)) {
          if (Array.isArray(value)) {
            // 对于数组参数，将其转换为JSON字符串格式：[id1,id2,id3]
            processedParams.append(key, JSON.stringify(value))
          } else if (value !== null && value !== undefined) {
            processedParams.append(key, value)
          }
        }
        const queryString = processedParams.toString()
        fullUrl += `?${queryString}`
      }
    } else if (upperCaseMethod === 'POST') {
      headers['Content-Type'] = 'application/x-www-form-urlencoded'
      fetchOptions.body = new URLSearchParams(params).toString()
    }

    try {
      const response = await fetch(fullUrl, fetchOptions)

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: `API 错误: ${response.statusText}` }))
        logger.error(`[DELTA FORCE PLUGIN] API 请求失败: ${response.status} ${response.statusText} - ${fullUrl}`)
        logger.error(`[DELTA FORCE PLUGIN] 错误详情: ${JSON.stringify(errorBody)}`)
        if (responseType === 'stream') {
          return { stream: null, error: errorBody }
        }
        return errorBody
      }

      if (responseType === 'stream') {
        return { stream: response.body, error: null }
      }

      const responseBody = await response.json().catch(() => ({}))
      if (responseBody.code !== 0 && responseBody.success !== true) {
        logger.warn(`[DELTA FORCE PLUGIN] API 返回业务错误: ${responseBody.msg || responseBody.message || '未知错误'} - ${fullUrl}`)
      }
      return responseBody
    } catch (error) {
      const errorMsg = '网络请求异常，请检查后端服务是否可用'
      logger.error(`[DELTA FORCE PLUGIN] 网络请求异常: ${error} - ${fullUrl}`)
      if (responseType === 'stream') {
        return { stream: null, error: { message: errorMsg } }
      }
      return false
    }
  }

  /**
   * JSON格式的POST请求方法，用于OAuth等需要JSON body的接口
   * @param {string} url - 请求的API端点
   * @param {object} data - 请求数据对象
   * @param {string} method - HTTP方法，默认POST
   * @returns {Promise<object|boolean>}
   */
  async requestJson (url, data, method = 'POST') {
    const { api_key: apiKey } = this.cfg
    const BASE_URL = 'https://df-api.shallow.ink'

    if (!apiKey || apiKey === 'sk-xxxxxxx') {
      const errorMsg = 'APIKey 未配置，请联系机器人管理员。'
      logger.error('[DELTA FORCE PLUGIN] APIKey 未配置，请在 config/config.yaml 中填写')
      if (this.e) {
        await this.e.reply(errorMsg)
      }
      return false
    }

    const headers = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }

    const fullUrl = `${BASE_URL}${url}`
    const fetchOptions = { 
      method: method.toUpperCase(), 
      headers,
      body: JSON.stringify(data)
    }

    try {
      const response = await fetch(fullUrl, fetchOptions)

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: `API 错误: ${response.statusText}` }))
        logger.error(`[DELTA FORCE PLUGIN] API 请求失败: ${response.status} ${response.statusText} - ${fullUrl}`)
        logger.error(`[DELTA FORCE PLUGIN] 错误详情: ${JSON.stringify(errorBody)}`)
        return errorBody
      }

      const responseBody = await response.json().catch(() => ({}))
      if (responseBody.code !== 0 && responseBody.success !== true) {
        logger.warn(`[DELTA FORCE PLUGIN] API 返回业务错误: ${responseBody.msg || responseBody.message || '未知错误'} - ${fullUrl}`)
      }
      return responseBody
    } catch (error) {
      const errorMsg = '网络请求异常，请检查后端服务是否可用'
      logger.error(`[DELTA FORCE PLUGIN] 网络请求异常: ${error} - ${fullUrl}`)
      return false
    }
  }

  // --- 登录相关 ---

  /**
   * 获取登录二维码
   * @param {string} platform - 'qq', 'wechat', 'qqsafe', 'wegame', 'wegame/wechat'(通过微信登录WeGame)
   */
  async getLoginQr (platform) {
    return this.request(`/login/${platform}/qr`)
  }

  /**
   * 获取登录状态
   * @param {string} platform - 'qq', 'wechat', 'qqsafe', 'wegame', 'wegame/wechat'(通过微信登录WeGame)
   * @param {string} frameworkToken - 登录流程中获取的临时 token
   */
  async getLoginStatus (platform, frameworkToken) {
    return this.request(`/login/${platform}/status`, { frameworkToken }, 'GET')
  }

  /**
   * 通过Cookie登录QQ
   * @param {string} cookie - QQ登录的Cookie字符串
   */
  async loginWithCookie(cookie) {
    return this.request('/login/qq/ck', { cookie }, 'POST');
  }

  /**
   * QQ OAuth登录 - 获取授权链接和frameworkToken
   * @param {string} platformID - 平台用户ID (可选)
   * @param {string} botID - 机器人ID (可选)
   * @returns {Promise<object>} - 包含login_url和frameworkToken的响应
   */
  async getQqOAuthAuth(platformID = null, botID = null) {
    const params = {};
    if (platformID) params.platformID = platformID;
    if (botID) params.botID = botID;
    return this.request('/login/qq/oauth', params, 'GET');
  }

  /**
   * QQ OAuth登录 - 提交授权信息完成登录
   * @param {string} authurl - 完整的回调URL (包含code和state参数)
   * @param {string} frameworkToken - 框架Token (可选，如果authurl中没有state)
   * @param {string} authcode - 授权码 (可选，如果不使用完整authurl)
   * @returns {Promise<object>} - 登录结果
   */
  async submitQqOAuthAuth(authurl = null, frameworkToken = null, authcode = null) {
    const data = {};
    
    if (authurl) {
      // 使用完整的回调URL
      data.authurl = authurl;
    } else if (frameworkToken && authcode) {
      // 使用分离的参数
      data.frameworkToken = frameworkToken;
      data.authcode = authcode;
    } else {
      throw new Error('必须提供authurl或者frameworkToken+authcode');
    }
    
    // 使用特殊的JSON POST请求
    return this.requestJson('/login/qq/oauth', data, 'POST');
  }

  /**
   * 获取QQ OAuth登录状态
   * @param {string} frameworkToken - frameworkToken
   * @returns {Promise<object>} - 登录状态响应
   */
  async getQqOAuthStatus(frameworkToken) {
    return this.request('/login/qq/oauth/status', { frameworkToken }, 'GET');
  }

  /**
   * 获取统一平台登录状态 - 用于OAuth轮询
   * @param {string} platformID - 平台用户ID (QQ号)
   * @param {string} botID - 机器人ID (可选，用于区分不同机器人实例)
   * @param {string} type - 登录类型 (可选，qq|wechat|不填表示查询全部)
   * @returns {Promise<object>} - 平台登录状态响应
   */
  async getPlatformLoginStatus(platformID, botID = null, type = null) {
    const params = { platformID };
    if (botID) {
      params.botID = botID;
    }
    if (type) {
      params.type = type;
    }
    return this.request('/login/oauth/platform-status', params, 'GET');
  }

  /**
   * 获取AI战绩锐评（流式）
   * @param {string} frameworkToken - 用户token
   * @param {string} type - 模式 (e.g., 'sol')
   * @returns {Promise<object|boolean>}
   */
  async getAiCommentary(frameworkToken, type) {
    return this.request('/df/person/ai', { frameworkToken, type }, 'POST');
  }

  /**
   * 微信OAuth登录 - 获取授权链接和frameworkToken
   * @param {string} platformID - 平台用户ID (可选)
   * @param {string} botID - 机器人ID (可选)
   * @returns {Promise<object>} - 包含login_url和frameworkToken的响应
   */
  async getWechatOAuthAuth(platformID = null, botID = null) {
    const params = {};
    if (platformID) params.platformID = platformID;
    if (botID) params.botID = botID;
    return this.request('/login/wechat/oauth', params, 'GET');
  }

  /**
   * 微信OAuth登录 - 提交授权信息完成登录
   * @param {string} authurl - 完整的回调URL (包含code和state参数)
   * @param {string} frameworkToken - 框架Token (可选，如果authurl中没有state)
   * @param {string} authcode - 授权码 (可选，如果不使用完整authurl)
   * @returns {Promise<object>} - 登录结果
   */
  async submitWechatOAuthAuth(authurl = null, frameworkToken = null, authcode = null) {
    const data = {};
    
    if (authurl) {
      data.authurl = authurl;
    } else if (frameworkToken && authcode) {
      data.frameworkToken = frameworkToken;
      data.authcode = authcode;
    } else {
      throw new Error('必须提供authurl或者frameworkToken+authcode');
    }
    
    // 使用统一的JSON POST请求
    return this.requestJson('/login/wechat/oauth', data, 'POST');
  }

  /**
   * 获取微信OAuth登录状态
   * @param {string} frameworkToken - frameworkToken
   * @returns {Promise<object>} - 登录状态响应
   */
  async getWechatOAuthStatus(frameworkToken) {
    return this.request('/login/wechat/oauth/status', { frameworkToken }, 'GET');
  }

  /**
   * 统一Token验证
   * @param {string} frameworkToken - 框架Token
   * @returns {Promise<object>} - Token验证响应
   */
  async verifyOAuthToken(frameworkToken) {
    return this.request('/login/oauth/token', { frameworkToken }, 'GET');
  }

  // ========== 向后兼容的旧版API方法 ==========
  
  /**
   * @deprecated 请使用 getQqOAuthAuth() 替代
   * QQ Link登录 - 获取授权链接和frameworkToken (旧版兼容)
   */
  async getQqLinkAuth() {
    return this.getQqOAuthAuth();
  }

  /**
   * @deprecated 请使用 submitQqOAuthAuth() 替代  
   * QQ Link登录 - 提交授权码完成登录 (旧版兼容)
   */
  async submitQqLinkAuth(frameworkToken, authCode) {
    return this.submitQqOAuthAuth(null, frameworkToken, authCode);
  }

  /**
   * @deprecated 请使用 getQqOAuthStatus() 替代
   * 获取QQ Link登录状态 (旧版兼容)
   */
  async getQqLinkStatus(frameworkToken) {
    return this.getQqOAuthStatus(frameworkToken);
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
    return this.request('/df/tools/article/detail', { threadID: threadId }, 'GET');
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
    if (type && type.trim() !== '') {
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
   * 获取大红称号
   * @param {string} frameworkToken - 用户绑定的token
   */
  async getTitle (frameworkToken) {
    return this.request('/df/person/title', { frameworkToken }, 'GET')
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

  async getRankScore() {
    return await this.request('/df/object/rankscore', {}, 'get');
  }
  
  /**
   * 刷新登录状态
   * @param {string} platform - 'wechat', 'qq', 'qqsafe', 'wegame'
   * @param {string} frameworkToken - 用户的token
   */
  async refreshLogin(platform, frameworkToken) {
    return this.request(`/login/${platform}/refresh`, { frameworkToken }, 'GET');
  }

  /**
   * 删除QQ登录数据
   * @param {string} frameworkToken - 用户的token
   */
  async deleteQqLogin(frameworkToken) {
    return this.request('/login/qq/delete', { frameworkToken }, 'GET');
  }

  /**
   * 删除微信登录数据
   * @param {string} frameworkToken - 用户的token
   */
  async deleteWechatLogin(frameworkToken) {
    return this.request('/login/wechat/delete', { frameworkToken }, 'GET');
  }

  async getBanHistory(frameworkToken) {
    return this.request('/login/qqsafe/ban', { frameworkToken }, 'GET');
  }

  async getPlaceStatus(frameworkToken) {
    return this.request('/df/place/status', { frameworkToken }, 'GET');
  }

  /**
   * 获取好友信息
   * @param {string} frameworkToken - 用户绑定的token
   * @param {string} openid - 好友的openid
   */
  async getFriendInfo(frameworkToken, openid) {
    return this.request('/df/person/friendinfo', { frameworkToken, openid }, 'GET');
  }

  /**
   * 获取物品列表
   * @param {string} primary 一级分类
   * @param {string} second 二级分类
   */
  async getObjectList(primary = '', second = '') {
    const params = {};
    if (primary) params.primary = primary;
    if (second) params.second = second;
    return this.request('/df/object/list', params, 'GET');
  }

  /**
   * 搜索物品
   * @param {string} name 物品名称
   * @param {string} ids 物品ID (逗号分隔)
   */
  async searchObject(name = '', ids = '') {
    const params = {};
    if (name) params.name = name;
    if (ids) params.id = ids;
    return this.request('/df/object/search', params, 'GET');
  }

  // --- 改枪方案 V2 ---

  /**
   * 上传改枪方案
   * @param {string} frameworkToken - 用户token
   * @param {string} clientID - 客户端ID
   * @param {string} solutionCode - 改枪码
   * @param {string} desc - 描述
   * @param {boolean} isPublic - 是否公开
   * @param {string} type - 游戏模式 (sol/mp)
   * @param {string} weaponId - 武器ID (可选)
   * @param {string} accessory - 配件信息 (可选)
   */
  async uploadSolution(frameworkToken, clientID, solutionCode, desc = '', isPublic = false, type = 'sol', weaponId = '', accessory = '') {
    const data = {
      clientID,
      clientType: 'qq',
      platformID: this.e.user_id,
      frameworkToken,
      solutionCode,
      desc,
      isPublic,
      type
    };
    if (weaponId) data.weaponId = weaponId;
    if (accessory) data.Accessory = accessory;
    return this.request('/df/tools/solution/v2/upload', data, 'POST');
  }

  /**
   * 获取方案列表
   * @param {string} frameworkToken - 用户token
   * @param {string} clientID - 客户端ID
   * @param {string} weaponId - 武器ID筛选 (可选)
   * @param {string} weaponName - 武器名称筛选 (可选)
   * @param {string} priceRange - 价格范围筛选 (可选)
   * @param {string} authorPlatformID - 按作者筛选 (可选)
   * @param {string} type - 游戏模式筛选 (可选)
   */
  async getSolutionList(frameworkToken, clientID, weaponId = '', weaponName = '', priceRange = '', authorPlatformID = '', type = '') {
    const params = {
      clientID,
      clientType: 'qq',
      platformID: this.e.user_id,
      frameworkToken
    };
    if (weaponId) params.weaponId = weaponId;
    if (weaponName) params.weaponName = weaponName;
    if (priceRange) params.priceRange = priceRange;
    if (authorPlatformID) params.authorPlatformID = authorPlatformID;
    if (type) params.type = type;
    return this.request('/df/tools/solution/v2/list', params, 'GET');
  }

  /**
   * 获取方案详情
   * @param {string} frameworkToken - 用户token
   * @param {string} clientID - 客户端ID
   * @param {string} solutionId - 方案ID
   */
  async getSolutionDetail(frameworkToken, clientID, solutionId) {
    const params = {
      clientID,
      clientType: 'qq',
      platformID: this.e.user_id,
      frameworkToken,
      solutionId
    };
    return this.request('/df/tools/solution/v2/detail', params, 'GET');
  }

  /**
   * 投票
   * @param {string} frameworkToken - 用户token
   * @param {string} clientID - 客户端ID
   * @param {string} solutionId - 方案ID
   * @param {string} voteType - 投票类型 (like/dislike)
   */
  async voteSolution(frameworkToken, clientID, solutionId, voteType) {
    const data = {
      clientID,
      clientType: 'qq',
      platformID: this.e.user_id,
      frameworkToken,
      solutionId,
      voteType
    };
    return this.request('/df/tools/solution/v2/vote', data, 'POST');
  }

  /**
   * 更新方案
   * @param {string} frameworkToken - 用户token
   * @param {string} clientID - 客户端ID
   * @param {string} solutionId - 方案ID
   * @param {string} solutionCode - 新的改枪码 (可选)
   * @param {string} desc - 新的描述 (可选)
   * @param {boolean} isPublic - 是否公开 (可选)
   * @param {string} type - 游戏模式 (可选)
   * @param {string} accessory - 新的配件数组 (可选)
   */
  async updateSolution(frameworkToken, clientID, solutionId, solutionCode = '', desc = '', isPublic = null, type = '', accessory = '') {
    const data = {
      clientID,
      clientType: 'qq',
      platformID: this.e.user_id,
      frameworkToken,
      solutionId
    };
    if (solutionCode) data.solutionCode = solutionCode;
    if (desc) data.desc = desc;
    if (isPublic !== null) data.isPublic = isPublic;
    if (type) data.type = type;
    if (accessory) data.Accessory = accessory;
    return this.request('/df/tools/solution/v2/update', data, 'POST');
  }

  /**
   * 删除方案
   * @param {string} frameworkToken - 用户token
   * @param {string} clientID - 客户端ID
   * @param {string} solutionId - 方案ID
   */
  async deleteSolution(frameworkToken, clientID, solutionId) {
    const data = {
      clientID,
      clientType: 'qq',
      platformID: this.e.user_id,
      frameworkToken,
      solutionId
    };
    return this.request('/df/tools/solution/v2/delete', data, 'POST');
  }

  /**
   * 收藏方案
   * @param {string} frameworkToken - 用户token
   * @param {string} clientID - 客户端ID
   * @param {string} solutionId - 方案ID
   */
  async collectSolution(frameworkToken, clientID, solutionId) {
    const data = {
      clientID,
      clientType: 'qq',
      platformID: this.e.user_id,
      frameworkToken,
      solutionId
    };
    return this.request('/df/tools/solution/v2/collect', data, 'POST');
  }

  /**
   * 取消收藏
   * @param {string} frameworkToken - 用户token
   * @param {string} clientID - 客户端ID
   * @param {string} solutionId - 方案ID
   */
  async discollectSolution(frameworkToken, clientID, solutionId) {
    const data = {
      clientID,
      clientType: 'qq',
      platformID: this.e.user_id,
      frameworkToken,
      solutionId
    };
    return this.request('/df/tools/solution/v2/discollect', data, 'POST');
  }

  /**
   * 收藏列表
   * @param {string} frameworkToken - 用户token
   * @param {string} clientID - 客户端ID
   */
  async getCollectList(frameworkToken, clientID) {
    const params = {
      clientID,
      clientType: 'qq',
      platformID: this.e.user_id,
      frameworkToken
    };
    return this.request('/df/tools/solution/v2/collectlist', params, 'GET');
  }

  /**
   * 获取藏品解锁记录列表
   * @param {string} frameworkToken - 框架Token
   * @returns {Promise<object>} - API响应
   */
  async getRedList(frameworkToken) {
    const params = {
      frameworkToken
    };
    return this.request('/df/person/redlist', params, 'GET');
  }

  /**
   * 获取指定藏品的详细记录
   * @param {string} frameworkToken - 框架Token
   * @param {string} objectid - 物品ID
   * @returns {Promise<object>} - API响应
   */
  async getRedRecord(frameworkToken, objectid) {
    const params = {
      frameworkToken,
      objectid
    };
    return this.request('/df/person/redone', params, 'GET');
  }

  // ==================== 价格相关接口 ====================

  /**
   * 获取物品历史均价 (V1接口)
   * @param {string} id - 物品ID (单个ID)
   * @returns {Promise<object>} - API响应
   */
  async getPriceHistoryV1(id) {
    return this.request('/df/object/price/history/v1', { id }, 'GET');
  }

  /**
   * 获取物品历史价格 (V2接口，半小时精度)
   * @param {string|Array} objectId - 物品ID (支持数组)
   * @returns {Promise<object>} - API响应
   */
  async getPriceHistoryV2(objectId) {
    return this.request('/df/object/price/history/v2', { objectId }, 'GET');
  }

  /**
   * 获取物品当前均价
   * @param {string|Array} id - 物品ID (支持数组)
   * @returns {Promise<object>} - API响应
   */
  async getCurrentPrice(id) {
    return this.request('/df/object/price/latest', { id }, 'GET');
  }

  /**
   * 获取制造材料最低价格
   * @param {string} id - 物品ID (可选，不传则返回所有材料)
   * @returns {Promise<object>} - API响应
   */
  async getMaterialPrice(id = null) {
    const params = id ? { id } : {};
    return this.request('/df/place/materialPrice', params, 'GET');
  }

  /**
   * 获取利润历史
   * @param {object} params - 查询参数 {objectId?, objectName?, place?}
   * @returns {Promise<object>} - API响应
   */
  async getProfitHistory(params) {
    return this.request('/df/place/profitHistory', params, 'GET');
  }

  /**
   * 获取利润排行榜 V1
   * @param {object} params - 查询参数 {type, place?, limit?, timestamp?}
   * @returns {Promise<object>} - API响应
   */
  async getProfitRankV1(params) {
    return this.request('/df/place/profitRank/v1', params, 'GET');
  }

  /**
   * 获取利润排行榜 V2 (最高利润)
   * @param {object} params - 查询参数 {type, place?, id?}
   * @returns {Promise<object>} - API响应
   */
  async getProfitRankV2(params) {
    return this.request('/df/place/profitRank/v2', params, 'GET');
  }

  /**
   * 获取用户统计信息
   * @param {string} clientID - 客户端ID
   * @returns {Promise<object>} - API响应
   */
  async getUserStats(clientID) {
    return this.request('/stats/users', { clientID }, 'GET');
  }
}