import Config from '../components/Config.js'
import Code from '../components/Code.js'; // 引入Code以调用API

function getClientID () {
    return Config.getConfig()?.delta_force?.clientID;
}

/**
 * 检查并处理常见的API错误响应。
 * 如果检测到并处理了错误，将发送回复并返回true。
 * @param {object} res - API响应对象。
 * @param {object} e - Yunzai事件对象，用于回复。
 * @returns {Promise<boolean>} - 如果处理了错误则返回 true，否则返回 false。
 */
async function handleApiError(res, e) {
  // Case 0: Null or non-object response
  if (!res || typeof res !== 'object') {
    logger.warn('[API Error Handler] API响应为空或格式不正确');
    await e.reply('请求失败，API未返回任何数据或数据格式错误。');
    return true;
  }

  const resString = JSON.stringify(res);

  // Case 1: API Key/Auth invalid (code: 1000 or 1001)
  if (String(res.code) === '1000' || String(res.code) === '1001') {
    logger.warn(`[API Error Handler] API Key无效或未配置`);
    await e.reply('API Key无效或已过期，请联系机器人管理员检查配置。');
    return true;
  }
  
  // Case 1.1: API Key permission insufficient (code: 1100)
  if (String(res.code) === '1100') {
    logger.warn(`[API Error Handler] API Key权限不足`);
    await e.reply(`APIKey权限不足，请机器人升级订阅后使用。\n当前等级: ${res.currentTier || 'free'} | 需要等级: ${res.requiredTier || 'pro'}`);
    return true;
  }

  // Case 4: Login session invalid (ret: 101)
  if (res.data?.ret === 101 || res.error?.includes('请先完成QQ或微信登录') || res.sMsg?.includes('请先登录')) {
    logger.warn(`[API Error Handler] 登录会话无效`);
    await e.reply('登录已失效，请重新登录。');
    return true;
  }

  // Case 3: Region not bound (ret: 99998)
  if (res.data?.ret === 99998 || res.message?.includes('先绑定大区')) {
    logger.warn(`[API Error Handler] 大区未绑定`);
    await e.reply('您尚未绑定游戏大区，请先使用 #三角洲角色绑定 命令进行绑定。');
    return true;
  }

  // Case 2: frameworkToken not found or invalid
  if (res.success == false && (res.message?.includes('未找到有效token') || res.message?.includes('缺少frameworkToken参数'))) {
    logger.warn(`[API Error Handler] Token无效或缺失`);
    await e.reply('当前激活的账号无效，请重新登陆账号或使用 #三角洲账号切换 切换有效账号。');
    return true;
  }
  
  // Generic failure catch-all
  if (res.success == false) {
    // 特殊处理：某些成功消息可能被错误标记为 success: false
    if (res.message && (
      res.message.includes('上传成功') || 
      res.message.includes('查询成功') ||
      res.message.includes('操作成功') ||
      res.message.includes('删除成功') ||
      res.message.includes('更新成功')
    )) {
      logger.debug(`[API Error Handler] 检测到成功消息但标记为失败，忽略错误处理: ${res.message}`);
      return false; // 不处理为错误
    }
    
    logger.warn(`[API Error Handler] API请求失败: ${res.message || res.msg || res.error || '未知错误'}`);
    await e.reply(`操作失败：${res.message || res.msg || res.error || '未知错误，请查看日志'}`);
    return true;
  }

  return false;
}


const utils = {
    /**
     * @description: 设置当前用户的激活token
     * @param {string} user_id
     * @param {string} token
     */
    async setActiveToken(user_id, token) {
        await redis.set(`delta-force:active-token:${user_id}`, token);
    },

    /**
     * @description: 获取当前用户的激活token
     * 优先从Redis读取激活token，如果没有则从API获取列表并自动设置第一个为激活
     * @param {String} user_id - 用户ID
     * @param {String} group - 分组名称，不指定则默认查询qq_wechat分组
     * @return {String|null}
     */
    async getAccount(user_id, group = 'qq_wechat') {
        // 1. 优先从分组Redis键获取激活token
        let activeToken = await redis.get(`delta-force:${group}-token:${user_id}`);
        
        // 2. 如果指定的是qq_wechat分组，但没有找到，尝试从传统键中查找（向后兼容）
        if (!activeToken && group === 'qq_wechat') {
            activeToken = await redis.get(`delta-force:active-token:${user_id}`);
        }
        
        if (activeToken) return activeToken;

        // 3. 如果没有，则从API获取账号列表
        const clientID = getClientID();
        const api = new Code(); // 实例化API
        if (!clientID) {
            logger.error('[DELTA FORCE PLUGIN] getAccount无法获取clientID');
            return null;
        }

        const res = await api.getUserList({
            clientID,
            platformID: user_id,
            clientType: 'qq'
        });

        if (res && res.code === 0 && res.data && res.data.length > 0) {
            // 4. 按分组筛选账号
            const accountsInGroup = res.data.filter(acc => {
                const tokenType = acc.tokenType.toLowerCase();
                
                if (group === 'qq_wechat') {
                    return ['qq', 'wechat'].includes(tokenType);
                } else if (group === 'wegame') {
                    return ['wegame', 'wegame/wechat'].includes(tokenType);
                } else if (group === 'qqsafe') {
                    return tokenType === 'qqsafe';
                } else {
                    return true; // 其他分组或未指定分组，返回全部
                }
            });
            
            // 5. 在当前分组中寻找第一个有效的token作为默认激活token
            const firstValidAccount = accountsInGroup.find(acc => acc.isValid);
            
            if (firstValidAccount && firstValidAccount.frameworkToken) {
                const defaultToken = firstValidAccount.frameworkToken;
                
                // 6. 将其设置为当前分组的激活token
                await redis.set(`delta-force:${group}-token:${user_id}`, defaultToken);
                
                // 7. 如果是qq_wechat分组，同时设置传统键（向后兼容）
                if (group === 'qq_wechat') {
                    await this.setActiveToken(user_id, defaultToken);
                }
                
                return defaultToken;
            }
        }

        return null; // 用户确实没有当前分组的任何有效账号
    },

    /**
     * @description: 格式化时间
     * @param {Number|String} value - 时长
     * @param {String} unit - 单位 (seconds/minutes)
     * @return {String}
     */
    formatDuration(value, unit = 'seconds') {
        const numValue = parseInt(value, 10);
        if (isNaN(numValue) || numValue < 0) return '-';
        if (numValue === 0) return '0分钟';
        
        let totalMinutes = 0;
        if (unit === 'seconds') {
            totalMinutes = Math.floor(numValue / 60);
        } else {
            totalMinutes = numValue;
        }

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        if (hours > 0) {
            return `${hours}小时${minutes}分钟`;
        }
        return `${minutes}分钟`;
    },
    handleApiError
};

export default utils; 