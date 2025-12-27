import Code from '../../components/Code.js'
import utils from '../../utils/utils.js'

export class Health extends plugin {
  constructor(e) {
    super({
      name: '三角洲服务器状态',
      dsc: '查询三角洲服务器运行状态',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)服务器状态$',
          fnc: 'getServerHealth'
        }
      ]
    })
    this.api = new Code(e)
  }

  async getServerHealth(e) {
    
    try {
      const res = await this.api.request('/health/detailed', {}, 'GET')
      
      // 如果能获取到响应且格式正确，显示详细状态
      if (res && typeof res === 'object' && res.status) {
        const statusMsg = this.formatHealthStatus(res)
        await e.reply(statusMsg)
        return true
      }
      
      // 如果响应格式不正确但有数据，显示简单状态
      if (res && typeof res === 'object') {
        const statusMsg = this.formatSimpleStatus(res)
        await e.reply(statusMsg)
        return true
      }
      
      // 如果没有响应，显示离线状态
      await e.reply(this.formatOfflineStatus('无响应'))
      
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 服务器状态查询异常:', error)
      
      // 解析错误信息，提取状态码
      let errorInfo = '未知错误'
      
      if (error.message) {
        if (error.message.includes('502')) {
          errorInfo = '502 Bad Gateway'
        } else if (error.message.includes('503')) {
          errorInfo = '503 Service Unavailable'
        } else if (error.message.includes('500')) {
          errorInfo = '500 Internal Server Error'
        } else if (error.message.includes('404')) {
          errorInfo = '404 Not Found'
        } else if (error.message.includes('timeout')) {
          errorInfo = '请求超时'
        } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
          errorInfo = '连接被拒绝'
        } else {
          errorInfo = error.message
        }
      }
      
      // 显示离线状态和错误信息
      await e.reply(this.formatOfflineStatus(errorInfo))
    }
    
    return true
  }

  formatHealthStatus(data) {
    // 安全访问嵌套属性，提供默认值
    const status = data.status || 'unknown'
    const cluster = data.cluster || {}
    const system = data.system || {}
    const dependencies = data.dependencies || {}
    
    // 状态转换
    const statusText = status === 'healthy' ? '✅ 在线' : 
                      status === 'unhealthy' ? '❌ 离线' : 
                      '⚠️ 未知'
                      
    const nodeTypeName = cluster.nodeType === 'master' ? '主节点' : 
                        cluster.nodeType === 'worker' ? '从节点' : 
                        '未知节点'
    
    // 运行时间转换（安全处理）
    const uptime = system.uptime || 0
    const uptimeHours = uptime > 0 ? (uptime / 3600).toFixed(1) : '0'
    
    // 内存使用（安全处理）
    const memory = system.memory || {}
    const memoryInfo = memory.rss && memory.heapUsed && memory.heapTotal
      ? `RSS ${memory.rss}MB，堆内存 ${memory.heapUsed}/${memory.heapTotal}MB`
      : '内存信息不可用'
    
    // 依赖服务状态（安全处理）
    const mongoStatus = dependencies.mongodb?.status === 'connected' ? '✅ 正常' : '❌ 异常'
    const redisStatus = dependencies.redis?.status === 'connected' ? '✅ 正常' : '❌ 异常'
    
    let msg = `【三角洲插件-服务器状态】\n`
    msg += `服务状态：${statusText}\n`
    
    if (cluster.nodeId) {
      msg += `节点信息：${cluster.nodeId} (${nodeTypeName})\n`
    } else {
      msg += `节点信息：${nodeTypeName}\n`
    }
    
    msg += `运行时间：${uptimeHours}小时\n`
    
    if (system.platform) {
      msg += `系统平台：${system.platform}\n`
    }
    
    msg += `内存使用：${memoryInfo}\n`
    
    // 只有在有依赖信息时才显示
    if (dependencies.mongodb || dependencies.redis) {
      msg += `数据库连接：MongoDB ${mongoStatus}，Redis ${redisStatus}`
    } else {
      msg += `数据库连接：状态信息不可用`
    }
    
    return msg
  }

  formatSimpleStatus(data) {
    const status = data.status || 'unknown'
    const statusText = status === 'healthy' ? '✅ 在线' : 
                      status === 'unhealthy' ? '❌ 离线' : 
                      '⚠️ 未知'
                      
    let msg = `【三角洲插件-服务器状态】\n`
    msg += `服务状态：${statusText}\n`
    
    if (data.message) {
      msg += `消息：${data.message}\n`
    }
    
    if (data.timestamp) {
      const time = new Date(data.timestamp).toLocaleString()
      msg += `检查时间：${time}`
    }
    
    return msg
  }

  formatOfflineStatus(errorInfo) {
    const currentTime = new Date().toLocaleString()
    return `【三角洲插件-服务器状态】\n服务状态：❌ 离线\n错误信息：${errorInfo}\n检查时间：${currentTime}`
  }


} 