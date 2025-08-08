import Code from '../components/Code.js'
import utils from '../utils/utils.js'

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
      
      if (await utils.handleApiError(res, e)) return true
      
      if (!res || typeof res !== 'object') {
        await e.reply('服务器状态查询失败：数据格式错误')
        return true
      }

      // 格式化服务器状态信息
      const statusMsg = this.formatHealthStatus(res)
      await e.reply(statusMsg)
      
    } catch (error) {
      logger.error('[DELTA FORCE PLUGIN] 服务器状态查询失败:', error)
      await e.reply('服务器状态查询失败，请稍后重试')
    }
    
    return true
  }

  formatHealthStatus(data) {
    const { status, cluster, system, dependencies } = data
    
    // 状态转换
    const statusText = status === 'healthy' ? '在线' : '离线'
    const nodeTypeName = cluster.nodeType === 'master' ? '主节点' : '从节点'
    
    // 运行时间转换
    const uptimeHours = (system.uptime / 3600).toFixed(1)
    
    // 内存使用
    const memoryInfo = `RSS ${system.memory.rss}MB，堆内存 ${system.memory.heapUsed}/${system.memory.heapTotal}MB`
    
    // 依赖服务状态
    const mongoStatus = dependencies.mongodb?.status === 'connected' ? '正常' : '异常'
    const redisStatus = dependencies.redis?.status === 'connected' ? '正常' : '异常'
    
    let msg = `【三角洲插件-服务器状态】\n`
    msg += `服务状态：${statusText}\n`
    msg += `节点信息：${cluster.nodeId} (${nodeTypeName})\n`
    msg += `运行时间：${uptimeHours}小时\n`
    msg += `系统平台：${system.platform}\n`
    msg += `内存使用：${memoryInfo}\n`
    msg += `数据库连接：MongoDB ${mongoStatus}，Redis ${redisStatus}`
    
    return msg
  }


} 