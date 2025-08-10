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
    const { api_key: apiKey, base_url: BASE_URL } = this.cfg

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
        const queryString = new URLSearchParams(params).toString()
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
   * 获取AI战绩锐评（流式）
   * @param {string} frameworkToken - 用户token
   * @param {string} type - 模式 (e.g., 'sol')
   * @returns {Promise<object|boolean>}
   */
  async getAiCommentary(frameworkToken, type) {
    return this.request('/df/person/ai', { frameworkToken, type }, 'POST');
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
}