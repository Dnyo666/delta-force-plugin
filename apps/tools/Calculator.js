import Calculate from '../../utils/Calculate.js'
import DataManager from '../../utils/Data.js'
import HelpConfig from '../../components/HelpConfig.js'
import StyleConfig from '../../components/StyleConfig.js'
import Render from '../../components/Render.js'
import _ from 'lodash'

// 会话状态管理
const userSessions = new Map()
const sessionTimeouts = new Map() // 存储每个用户的超时定时器

// 会话超时时间（2分钟）
const SESSION_TIMEOUT = 2 * 60 * 1000

// 会话管理辅助方法
function startSessionTimeout(userId, e) {
  // 清除现有的超时定时器
  if (sessionTimeouts.has(userId)) {
    clearTimeout(sessionTimeouts.get(userId))
  }
  
  // 设置新的超时定时器
  const timeoutId = setTimeout(async () => {
    if (userSessions.has(userId)) {
      userSessions.delete(userId)
      sessionTimeouts.delete(userId)
      
      // 发送超时提示消息
      try {
        await e.reply([
          segment.at(userId),
          '\n⏰ 计算会话已超时（2分钟无回复），已自动结束。',
          '\n如需重新计算，请发送相应的计算命令。'
        ])
      } catch (error) {
        logger.error(`[三角洲计算器] 发送超时消息失败:`, error)
      }
    }
  }, SESSION_TIMEOUT)
  
  sessionTimeouts.set(userId, timeoutId)
}

function clearSessionTimeout(userId) {
  if (sessionTimeouts.has(userId)) {
    clearTimeout(sessionTimeouts.get(userId))
    sessionTimeouts.delete(userId)
  }
}

function endUserSession(userId) {
  userSessions.delete(userId)
  clearSessionTimeout(userId)
}

export class InteractiveCalculator extends plugin {
  constructor(e) {
    super({
      name: '三角洲计算器',
      dsc: '计算器 - 提供战备、伤害、战场伤害、维修等计算功能',
      event: 'message',
      priority: 90,
      rule: [
        {
          reg: '^(#三角洲|\\^)(伤害计算|伤害)$',
          fnc: 'startDamageCalculation'
        },
        {
          reg: '^(#三角洲|\\^)(战备计算|战备)$',
          fnc: 'startReadinessCalculation'
        },

        {
          reg: '^(#三角洲|\\^)(维修计算|维修)$',
          fnc: 'startRepairCalculation'
        },
        {
           reg: '^(#三角洲|\\^)?(修甲|修理)\\s+(.+?)\\s+(\\d+(?:\\.\\d+)?)[/／](\\d+(?:\\.\\d+)?)\\s+(局内|局外|inside|outside)$',
           fnc: 'quickRepairCalculation'
        },
        {
          reg: '^(#三角洲|\\^)?(伤害|dmg)\\s+(.+)$',
          fnc: 'quickDamageCalculation'
        },
        {
          reg: '^(#三角洲|\\^)(计算帮助)$',
          fnc: 'showHelp'
        },
        {
          reg: '^(#三角洲|\\^)(计算映射表|映射表)$',
          fnc: 'showMappingTable'
        },
        {
          reg: '^(#三角洲|\\^)(取消计算|取消)$',
          fnc: 'cancelCalculation'
        }
      ]
    })
    this.e = e
    this.calculator = new Calculate()
  }

  /**
   * 决定是否接受并处理消息
   */
  accept() {
    // 检查消息是否存在且为字符串类型
    if (!this.e.msg || typeof this.e.msg !== 'string') {
      return false // 忽略非文本消息（图片、文件等）
    }
    
    // 检查是否是取消计算命令，如果是则不在这里处理（由 cancelCalculation 方法处理）
    const msg = this.e.msg.trim()
    if (/^(#三角洲|\^)(取消计算|取消)$/.test(msg)) {
      return false // 让 cancelCalculation 方法处理
    }
    
    // 只有当用户有活跃会话时才处理非命令消息
    const userId = this.e.user_id
    const session = userSessions.get(userId)
    
    if (session) {
      // 有活跃会话，处理用户输入
      return this.handleUserInput()
    }
    
    // 没有活跃会话，不处理普通消息
    return false
  }

  /**
   * 开始伤害计算对话
   */
  async startDamageCalculation() {
    const userId = this.e.user_id
    
    // 清除现有会话（如果有）
    endUserSession(userId)
    
    // 初始化用户会话
    userSessions.set(userId, {
      type: 'damage',
      step: 'mode',
      data: {}
    })

    const modeOptions = [
      '请选择游戏模式，发送对应数字：',
      '1. 烽火地带 (sol)',
      '2. 全面战场 (mp)',
      '',
      '发送 ^取消计算 可退出'
    ].join('\n')

    await this.e.reply([segment.at(this.e.user_id), '\n【伤害计算器】\n', modeOptions])
    
    // 启动会话超时
    startSessionTimeout(userId, this.e)
    return true
  }

  /**
   * 开始战备计算对话
   */
  async startReadinessCalculation() {
    const userId = this.e.user_id
    
    // 清除现有会话（如果有）
    endUserSession(userId)
    
    userSessions.set(userId, {
      type: 'readiness',
      step: 'target',
      data: {}
    })

        await this.e.reply([
          segment.at(this.e.user_id),
      '\n【战备计算器】',
      '\n请输入目标战备值（例如：500）：',
      '\n发送 ^取消计算 可退出'
        ])
        
        // 启动会话超时
        startSessionTimeout(userId, this.e)
        return true
      }



  /**
   * 开始维修计算对话
   */
  async startRepairCalculation() {
    const userId = this.e.user_id
    
    // 清除现有会话（如果有）
    endUserSession(userId)
    
    userSessions.set(userId, {
      type: 'repair',
      step: 'repair_mode',
      data: {}
    })

    const msg = '【维修计算器】\n\n请选择维修模式，发送对应数字：\n1. 局内维修 (使用维修包)\n2. 局外维修 (按维修单价)\n\n发送 ^取消计算 可退出'

    await this.e.reply([segment.at(this.e.user_id), '\n', msg])
    
    // 启动会话超时
    startSessionTimeout(userId, this.e)
        return true
      }

  /**
   * 处理帮助组图标和权限（公共方法）
   * @param {Object} group - 帮助组对象
   * @param {boolean} checkPermission - 是否检查权限（默认true）
   * @returns {Object|null} - 处理后的组对象，如果无权限则返回null
   */
  processHelpGroup(group, checkPermission = true) {
    // 权限检查：如果是masterOnly组且用户不是master，则返回null
    if (checkPermission && group.masterOnly && !this.e.isMaster) {
      return null
    }
    
    // 处理组内的图标
    if (group.list && Array.isArray(group.list)) {
      _.forEach(group.list, (help) => {
        let icon = help.icon * 1
        if (!icon) {
          help.css = 'display:none'
        } else {
          let x = (icon - 1) % 10
          let y = (icon - x - 1) / 10
          help.css = `background-position:-${x * 50}px -${y * 50}px`
        }
      })
    }
    
    return group
  }

  /**
   * 处理两列布局分配（公共方法）
   * @param {Array} sortedGroups - 已排序的组数组
   * @param {boolean} twoColumnLayout - 是否启用两列布局
   * @returns {Object} - 包含 leftGroups, rightGroups, topFullWidthGroups, bottomFullWidthGroups, helpGroup
   */
  distributeGroupsToColumns(sortedGroups, twoColumnLayout) {
    let leftGroups = []
    let rightGroups = []
    let topFullWidthGroups = []
    let bottomFullWidthGroups = []
    let helpGroup = []
    
    if (twoColumnLayout) {
      // 分离出需要跨列显示的组
      const normalGroups = []
      sortedGroups.forEach((group) => {
        if (group.fullWidth) {
          // 根据 order 分配到顶部或底部
          if ((group.order || 999) < 50) {
            topFullWidthGroups.push(group)
          } else {
            bottomFullWidthGroups.push(group)
          }
        } else if (group.column === 'left') {
          leftGroups.push(group)
        } else if (group.column === 'right') {
          rightGroups.push(group)
        } else {
          normalGroups.push(group)
        }
      })
      
      // 对于未指定列位置的组，智能平衡分配到左右两列
      if (normalGroups.length > 0) {
        // 计算总组数和目标分配
        const totalGroups = leftGroups.length + rightGroups.length + normalGroups.length
        const targetLeftCount = Math.ceil(totalGroups / 2)
        const targetRightCount = Math.floor(totalGroups / 2)
        
        // 计算每列还需要多少个组
        let leftNeeded = Math.max(0, targetLeftCount - leftGroups.length)
        let rightNeeded = Math.max(0, targetRightCount - rightGroups.length)
        
        // 如果某个列已经超过目标，则全部给另一个列
        if (leftGroups.length >= targetLeftCount) {
          rightGroups.push(...normalGroups)
        } else if (rightGroups.length >= targetRightCount) {
          leftGroups.push(...normalGroups)
        } else {
          // 按需分配，优先分配给需要更多的列
          normalGroups.forEach((group) => {
            if (leftNeeded > rightNeeded) {
              leftGroups.push(group)
              leftNeeded--
            } else {
              rightGroups.push(group)
              rightNeeded--
            }
          })
        }
      }
    } else {
      // 单列布局：所有组放在 helpGroup 中
      helpGroup = sortedGroups
    }
    
    return {
      leftGroups,
      rightGroups,
      topFullWidthGroups,
      bottomFullWidthGroups,
      helpGroup
    }
  }

  /**
   * 显示帮助信息 - 使用模板渲染
   */
  async showHelp() {
    const calculatorHelpList = HelpConfig.getCalculatorHelpList()
    const calculatorHelpCfg = HelpConfig.getCalculatorHelpCfg()
    const helpCfg = HelpConfig.getHelpCfg()

    let leftGroups = []
    let rightGroups = []
    let topFullWidthGroups = []
    let bottomFullWidthGroups = []
    let helpGroup = []

    // 检查是新格式（对象）还是旧格式（数组）
    if (calculatorHelpList && typeof calculatorHelpList === 'object' && !Array.isArray(calculatorHelpList)) {
      // 新格式：从 left/right/fullWidth 中获取组
      // 处理 fullWidth 组，分为顶部和底部两部分
      if (calculatorHelpList.fullWidth && Array.isArray(calculatorHelpList.fullWidth)) {
        const sorted = calculatorHelpList.fullWidth
          .map(g => this.processHelpGroup(g))
          .filter(g => g !== null)
          .sort((a, b) => (a.order || 999) - (b.order || 999))
        // order < 50 的显示在顶部，order >= 50 的显示在底部
        sorted.forEach(group => {
          if ((group.order || 999) < 50) {
            topFullWidthGroups.push(group)
          } else {
            bottomFullWidthGroups.push(group)
          }
        })
      }

      // 处理 left 组
      if (calculatorHelpList.left && Array.isArray(calculatorHelpList.left)) {
        const sorted = calculatorHelpList.left
          .map(g => this.processHelpGroup(g))
          .filter(g => g !== null)
          .sort((a, b) => (a.order || 999) - (b.order || 999))
        leftGroups.push(...sorted)
      }

      // 处理 right 组
      if (calculatorHelpList.right && Array.isArray(calculatorHelpList.right)) {
        const sorted = calculatorHelpList.right
          .map(g => this.processHelpGroup(g))
          .filter(g => g !== null)
          .sort((a, b) => (a.order || 999) - (b.order || 999))
        rightGroups.push(...sorted)
      }

      // 合并所有组用于单列布局
      helpGroup = [...topFullWidthGroups, ...bottomFullWidthGroups, ...leftGroups, ...rightGroups]
    } else {
      // 旧格式：兼容原有数组格式
      _.forEach(calculatorHelpList, (group) => {
        const processed = this.processHelpGroup(group)
        if (processed) {
          helpGroup.push(processed)
        }
      })

      // 如果启用两列布局，使用公共方法分配
      if (calculatorHelpCfg.twoColumnLayout) {
        const distribution = this.distributeGroupsToColumns(helpGroup, true)
        leftGroups = distribution.leftGroups
        rightGroups = distribution.rightGroups
        topFullWidthGroups = distribution.topFullWidthGroups
        bottomFullWidthGroups = distribution.bottomFullWidthGroups
        helpGroup = [] // 两列布局时 helpGroup 为空
      }
    }

    // 合并配置，calculatorHelpCfg 优先级更高
    const finalCfg = { ...helpCfg, ...calculatorHelpCfg }

    let themeData = await this.getThemeData(finalCfg, helpCfg) || {}
    return await Render.render('help/index.html', {
      helpCfg: finalCfg,
      helpGroup,
      leftGroups,
      rightGroups,
      topFullWidthGroups,
      bottomFullWidthGroups,
      ...themeData,
      themePath: themeData.themePath || 'default',
      element: 'default'
    }, { e: this.e, scale: 1.6 })
  }

  /**
   * 显示计算映射表 - 使用合并消息转发
   */
  async showMappingTable() {
    const armors = this.getArmorList()
    const hitParts = ['头部', '胸部', '腹部', '大臂', '小臂', '大腿', '小腿']
    
    // 构建转发消息
    const forwardMsg = []
    
    // 游戏模式映射
    let gameModeMsg = '【游戏模式映射】\n'
    gameModeMsg += '烽火地带 - sol / 烽火 / 烽火地带 / 摸金\n'
    gameModeMsg += '全面战场 - mp / 战场 / 全面 / 大战场 / 全面战场'
    forwardMsg.push({
      message: gameModeMsg,
      nickname: Bot.nickname,
      user_id: Bot.uin
    })
    
    // 命中部位映射
    const partDescMap = {
      '头部': '简写: 头',
      '胸部': '简写: 胸',
      '腹部': '简写: 腹'
    }
    let partMsg = '【命中部位映射】\n'
    hitParts.forEach((part, index) => {
      const desc = partDescMap[part] || '不支持简写，请使用序号'
      partMsg += `${index + 1}. ${part} - ${desc}\n`
    })
    forwardMsg.push({
      message: partMsg.trim(),
      nickname: Bot.nickname,
      user_id: Bot.uin
    })
    
    // 使用示例
    let exampleMsg = '【使用示例】\n'
    exampleMsg += '护甲组合 - 序号: 2:5 (头盔2+护甲5)\n'
    exampleMsg += '护甲组合 - 简写: dich-1:fs 或 gn:泰坦\n'
    exampleMsg += '部位分配 - 序号: 1:2,2:4 (头部2发+胸部4发)\n'
    exampleMsg += '部位分配 - 简写: 头:2,胸:4\n'
    exampleMsg += '注意事项: 四肢部位不支持简写，请使用序号'
    forwardMsg.push({
      message: exampleMsg,
      nickname: Bot.nickname,
      user_id: Bot.uin
    })
    
    // 护甲头盔列表 - 按等级分组并显示
    const armorGroups = {}
    armors.forEach((armor, index) => {
      const level = armor.protectionLevel
      if (!armorGroups[level]) {
        armorGroups[level] = []
      }
      const isHelmet = this.isHelmet(armor)
      const type = isHelmet ? '头盔' : '护甲'
      armorGroups[level].push({
        index: index + 2,
        name: armor.name,
        type: type
      })
    })
    
    // 按1-6级顺序显示装备
    for (let level = 1; level <= 6; level++) {
      if (armorGroups[level] && armorGroups[level].length > 0) {
        let armorMsg = `━━━ ${level}级装备 ━━━\n`
        armorGroups[level].forEach(item => {
          armorMsg += `${item.index}. ${item.name} - ${item.type} (防护等级 ${level})\n`
        })
        forwardMsg.push({
          message: armorMsg.trim(),
          nickname: Bot.nickname,
          user_id: Bot.uin
        })
      }
    }
    
    // 发送转发消息
    await this.e.reply(await Bot.makeForwardMsg(forwardMsg))
  }

  /**
   * 快捷维修计算 - 一条指令完成维修计算
   * 格式：修甲 装备名称 当前耐久/当前上限 局内/局外
   * 示例：修甲 fs 0/100 局内
   */
  async quickRepairCalculation() {
    try {
      const msg = this.e.msg.trim()
      
      // 解析指令参数
      const match = msg.match(/^(#三角洲|\^)?(修甲|修理)\s+(.+?)\s+(\d+(?:\.\d+)?)[/／](\d+(?:\.\d+)?)\s+(局内|局外|inside|outside)$/)
      
      if (!match) {
        await this.e.reply('指令格式错误！\n格式：修甲 装备名称 剩余耐久/当前上限 局内/局外\n示例：修甲 fs 0/100 局内')
        return
      }
      
      const [, , , equipmentName, remainingStr, currentStr, modeStr] = match
      
      // 解析参数
      const remainingDurability = parseFloat(remainingStr)
      const currentDurability = parseFloat(currentStr)
      const repairMode = (modeStr === '局内' || modeStr === 'inside') ? 'inside' : 'outside'
      
      // 验证参数
      if (isNaN(remainingDurability) || isNaN(currentDurability)) {
        await this.e.reply('耐久度参数无效，请输入数字')
        return
      }
      
      if (remainingDurability > currentDurability) {
        await this.e.reply('剩余耐久不能大于当前上限')
        return
      }
      
      if (currentDurability <= 0) {
        await this.e.reply('当前上限必须大于0')
        return
      }
      
      // 搜索装备
      const equipment = this.fuzzySearchEquipment(equipmentName.trim())
      if (!equipment) {
        await this.e.reply(`未找到装备：${equipmentName}\n请检查装备名称是否正确`)
        return
      }
      
      // 构建计算数据
      const repairData = {
        repairMode,
        currentDurability,
        remainingDurability
      }
      
      // 局外维修需要额外的参数
      if (repairMode === 'outside') {
        repairData.repairLevel = 'intermediate' // 默认中级维修
      }
      
      
      const result = await this.performRepairCalculation({
        armor: equipment,
        repairMode,
        ...repairData
      })
      
      if (!result.success) {
        await this.e.reply(`计算失败：${result.error}`)
        return
      }
      
      // 显示结果
      await this.displayRepairResult(result, {
        armor: equipment,
        repairMode,
        ...repairData
      })
      
    } catch (error) {
      logger.error('[Calculator] 快捷维修计算失败:', error)
      await this.e.reply('计算过程中发生错误，请重试')
    }
  }

  /**
   * 快捷伤害计算 - 一条指令完成伤害计算
   * 格式：伤害 模式 武器名 子弹名 护甲 距离 次数 部位分配
   * 示例：伤害 烽火 腾龙 dvc12 41:37 50 6 1:2,2:4
   */
  async quickDamageCalculation() {
    try {
      const msg = this.e.msg.trim()
      
      // 解析指令参数 - 用空格分割
      const parts = msg.split(/\s+/)
      
      if (parts.length < 8) {
        await this.e.reply([
          '指令格式错误！',
          '格式：伤害 模式 武器名 子弹名 护甲 距离 次数 部位分配',
          '示例：伤害 烽火 腾龙 dvc12 41:37 50 6 1:2,2:4',
          '',
          '参数说明：',
          '- 模式：烽火/全面',
          '- 武器名：支持模糊搜索',
          '- 子弹名：支持模糊搜索',
          '- 护甲：装备编号或头盔:护甲',
          '- 距离：射击距离(米)',
          '- 次数：射击次数',
          '- 部位：1:2,2:4 (头部2发+胸部4发)'
        ].join('\n'))
        return
      }
      
      // 解析参数
      const [command, mode, weaponName, bulletName, armorStr, distanceStr, shotsStr, hitPartsStr] = parts
      
      // 验证和转换参数
      const gameMode = this.parseGameMode(mode)
      if (!gameMode) {
        await this.e.reply([
          '游戏模式错误！',
          '支持的模式:',
          '- 烽火地带: sol/烽火/烽火地带/摸金',
          '- 全面战场: mp/战场/全面/大战场/全面战场'
        ].join('\n'))
        return
      }
      
      const distance = parseFloat(distanceStr)
      const totalShots = parseInt(shotsStr)
      
      if (isNaN(distance) || distance < 0) {
        await this.e.reply('射击距离无效，请输入非负数字')
        return
      }
      
      if (isNaN(totalShots) || totalShots < 1 || totalShots > 20) {
        await this.e.reply('射击次数无效，请输入1-20之间的数字')
        return
      }
      
      // 搜索武器
      const weapon = this.fuzzySearchWeapon(weaponName, gameMode)
      if (!weapon) {
        await this.e.reply(`未找到武器：${weaponName}`)
        return
      }
      
      // 搜索子弹
      const bullet = this.fuzzySearchBullet(bulletName, weapon.caliber)
      if (!bullet) {
        await this.e.reply(`未找到子弹：${bulletName}`)
        return
      }
      
      // 解析护甲
      const armorResult = this.parseArmorSelection(armorStr)
      if (!armorResult.success) {
        await this.e.reply(armorResult.error)
        return
      }
      
      // 解析命中部位
      const hitParts = this.parseHitParts(hitPartsStr, totalShots)
      if (!hitParts.success) {
        await this.e.reply(hitParts.error)
        return
      }
      
      // 执行计算
      const result = await this.performDamageCalculation({
        mode: gameMode,
        weapon,
        bullet,
        armor: armorResult.armor,
        helmet: armorResult.helmet,
        distance,
        shots: totalShots
      }, hitParts.data)
      
      if (!result.success) {
        await this.e.reply(`计算失败：${result.error}`)
        return
      }
      
      // 显示结果
      await this.displayDamageResult(result, {
        mode: gameMode,
        weapon,
        bullet,
        armor: armorResult.armor,
        helmet: armorResult.helmet,
        distance,
        shots: totalShots
      }, hitParts.data)
      
    } catch (error) {
      logger.error('[Calculator] 快捷伤害计算失败:', error)
      await this.e.reply('计算过程中发生错误，请重试')
    }
  }

  /**
   * 取消计算
   */
  async cancelCalculation() {
    const userId = this.e.user_id
    if (userSessions.has(userId)) {
      endUserSession(userId)
      logger.info(`[三角洲计算器] 用户 ${userId} 取消计算，已删除会话`)
      await this.e.reply([segment.at(this.e.user_id), '\n已取消计算，如需重新计算，请发送相应的计算命令'])
    }
        return true
      }

  /**
   * 处理用户输入
   */
  async handleUserInput() {
    const userId = this.e.user_id
    const session = userSessions.get(userId)
    
    // 如果没有活跃会话，不处理 - 直接返回false让其他插件处理
    if (!session) {
      return false
    }

    const userInput = this.e.msg.trim()
    logger.info(`[三角洲计算器] 处理用户输入: ${userId} -> ${userInput} (会话类型: ${session.type}, 步骤: ${session.step})`)
    
    // 重置会话超时
    startSessionTimeout(userId, this.e)
    
    try {
      if (session.type === 'damage') {
        await this.handleDamageCalculationStep(session, userInput)
      } else if (session.type === 'readiness') {
        await this.handleReadinessCalculationStep(session, userInput)
      } else if (session.type === 'repair') {
        await this.handleRepairCalculationStep(session, userInput)
      }
      return true
    } catch (error) {
      logger.error('[InteractiveCalculator] 处理用户输入失败:', error)
      await this.e.reply('处理输入时发生错误，请重新开始计算')
      endUserSession(userId)
      logger.info(`[三角洲计算器] 处理错误，已删除用户 ${userId} 的会话`)
      return true
    }
  }

  /**
   * 处理伤害计算步骤
   */
  async handleDamageCalculationStep(session, userInput) {
    const userId = this.e.user_id

    switch (session.step) {
      case 'mode':
        await this.handleModeSelection(session, userInput)
        break
      case 'weapon_category':
        await this.handleWeaponCategorySelection(session, userInput)
        break
      case 'weapon':
        await this.handleWeaponSelection(session, userInput)
        break
      case 'bullet':
        await this.handleBulletSelection(session, userInput)
        break
      case 'armor':
        await this.handleArmorSelection(session, userInput)
        break
      case 'distance':
        await this.handleDistanceInput(session, userInput)
        break
      case 'shots':
        await this.handleShotsInput(session, userInput)
        break
      case 'hit_parts':
        await this.handleHitPartsInput(session, userInput)
        break
    }
  }

  /**
   * 处理游戏模式选择
   */
  async handleModeSelection(session, userInput) {
    const mode = userInput === '1' ? 'sol' : userInput === '2' ? 'mp' : null
    
    if (!mode) {
      await this.e.reply('请输入 1 或 2 选择游戏模式')
      return
    }

    session.data.mode = mode
    session.step = 'weapon_category'

    const categories = this.getWeaponCategories(mode)
    let msg = `已选择: ${mode === 'sol' ? '烽火地带' : '全面战场'}\n\n请选择武器类型，发送对应数字：\n`
    categories.forEach((category, index) => {
      msg += `${index + 1}. ${category.displayName} (${category.count}把)\n`
    })

    await this.e.reply([segment.at(this.e.user_id), '\n', msg])
  }

  /**
   * 处理武器类别选择
   */
  async handleWeaponCategorySelection(session, userInput) {
    const categories = this.getWeaponCategories(session.data.mode)
    const categoryIndex = parseInt(userInput) - 1
    
    if (isNaN(categoryIndex) || categoryIndex < 0 || categoryIndex >= categories.length) {
      await this.e.reply(`请输入 1-${categories.length} 之间的数字`)
      return
    }

    const selectedCategory = categories[categoryIndex]
    session.data.category = selectedCategory.key
    session.step = 'weapon'

    const weapons = this.getWeaponsByCategory(session.data.mode, selectedCategory.key)
    let msg = `已选择: ${selectedCategory.displayName}\n\n请选择武器，发送对应数字：\n`
    weapons.forEach((weapon, index) => {
      msg += `${index + 1}. ${weapon.name}\n`
    })

      await this.e.reply([segment.at(this.e.user_id), '\n', msg])
  }

  /**
   * 处理武器选择
   */
  async handleWeaponSelection(session, userInput) {
    const weapons = this.getWeaponsByCategory(session.data.mode, session.data.category)
    const weaponIndex = parseInt(userInput) - 1
    
    if (isNaN(weaponIndex) || weaponIndex < 0 || weaponIndex >= weapons.length) {
      await this.e.reply(`请输入 1-${weapons.length} 之间的数字`)
      return
    }

    session.data.weapon = weapons[weaponIndex]
    
    if (session.data.mode === 'mp') {
      // 全面战场模式：跳过子弹选择，直接到距离输入
      session.step = 'distance'
      
      await this.e.reply([
        segment.at(this.e.user_id),
        `\n已选择武器: ${session.data.weapon.name}`,
        `\n基础伤害: ${session.data.weapon.baseDamage}`,
        '\n\n请输入射击距离（米，例如：50）：'
      ])
    } else {
      // 烽火地带模式：需要选择子弹
      session.step = 'bullet'

      // 获取该武器口径的子弹列表
      const bullets = DataManager.getBulletsByCaliber(session.data.weapon.caliber)
      if (bullets.length === 0) {
        await this.e.reply(`未找到口径 ${session.data.weapon.caliber} 的子弹数据`)
        return
      }

      let msg = `已选择武器: ${session.data.weapon.name}\n口径: ${session.data.weapon.caliber}\n\n请选择子弹，发送对应数字：\n`
      bullets.forEach((bullet, index) => {
        msg += `${index + 1}. ${bullet.name} (穿透等级:${bullet.penetrationLevel}, 伤害倍率:${bullet.baseDamageMultiplier})\n`
      })

      await this.e.reply([segment.at(this.e.user_id), '\n', msg])
    }
  }

  /**
   * 处理子弹选择
   */
  async handleBulletSelection(session, userInput) {
    const bullets = DataManager.getBulletsByCaliber(session.data.weapon.caliber)
    const bulletIndex = parseInt(userInput) - 1
    
    if (isNaN(bulletIndex) || bulletIndex < 0 || bulletIndex >= bullets.length) {
      await this.e.reply(`请输入 1-${bullets.length} 之间的数字`)
      return
    }

    session.data.bullet = bullets[bulletIndex]
    session.step = 'armor'

    const armors = this.getArmorList()
    let msg = `已选择子弹: ${session.data.bullet.name}\n穿透等级: ${session.data.bullet.penetrationLevel}\n\n请选择护甲，发送对应数字：\n`
    msg += `1. 无护甲\n`
    armors.forEach((armor, index) => {
      msg += `${index + 2}. ${armor.name} (防护等级${armor.protectionLevel})\n`
    })

    await this.e.reply([segment.at(this.e.user_id), '\n', msg])
  }

  /**
   * 处理护甲选择 - 支持头盔+护甲组合选择
   */
  async handleArmorSelection(session, userInput) {
    const armors = this.getArmorList()
    
    // 检查是否是组合选择格式 (头盔:护甲 或 头盔,护甲)
    const combinationPattern = /^(\d+)[:：,，](\d+)$/
    const match = userInput.match(combinationPattern)
    
    if (match) {
      // 组合选择 - 考虑"无护甲"占用第1位，实际装备从第2位开始
      const helmetIndex = parseInt(match[1]) - 2  // 用户看到的编号减2才是真实索引
      const armorIndex = parseInt(match[2]) - 2   // 用户看到的编号减2才是真实索引
      
      if (helmetIndex < 0 || helmetIndex >= armors.length || 
          armorIndex < 0 || armorIndex >= armors.length) {
        await this.e.reply(`请输入有效的组合，格式：头盔编号:护甲编号 (1-${armors.length})`)
        return
      }
      
      const helmet = armors[helmetIndex]
      const armor = armors[armorIndex]
      
      // 验证头盔和护甲类型
      if (!this.isHelmet(helmet)) {
        await this.e.reply(`编号${match[1]}不是头盔，请选择正确的头盔`)
        return
      }
      
      if (this.isHelmet(armor)) {
        await this.e.reply(`编号${match[2]}是头盔，请选择护甲`)
        return
      }
      
      session.data.helmet = helmet
      session.data.armor = armor
      
      await this.e.reply([
        segment.at(this.e.user_id),
        `\n已选择组合:`,
        `\n头盔: ${helmet.name} (防护等级${helmet.protectionLevel})`,
        `\n护甲: ${armor.name} (防护等级${armor.protectionLevel})`,
        '\n\n请输入射击距离（米，例如：50）：'
      ])
      
    } else {
      // 单个选择
      const userChoice = parseInt(userInput)
      
      if (isNaN(userChoice) || userChoice < 1 || userChoice > armors.length + 1) {
        await this.e.reply(`请输入有效数字 (1-${armors.length + 1}) 或组合格式 (头盔:护甲)`)
        return
      }

      if (userChoice === 1) {
        // 无护甲
        session.data.armor = null
        session.data.helmet = null
        await this.e.reply([
          segment.at(this.e.user_id),
          `\n已选择: 无护甲`,
          '\n\n请输入射击距离（米，例如：50）：'
        ])
      } else {
        // 实际装备索引 = 用户选择 - 2 (因为第1个是"无护甲")
        const selectedArmor = armors[userChoice - 2]
        session.data.armor = this.isHelmet(selectedArmor) ? null : selectedArmor
        session.data.helmet = this.isHelmet(selectedArmor) ? selectedArmor : null
        
        const armorName = session.data.armor ? session.data.armor.name : '无护甲'
        const helmetName = session.data.helmet ? session.data.helmet.name : '无头盔'
        
        await this.e.reply([
          segment.at(this.e.user_id),
          `\n已选择: ${session.data.helmet ? helmetName : armorName}`,
          '\n\n请输入射击距离（米，例如：50）：'
        ])
      }
    }
    
    session.step = 'distance'
  }

  /**
   * 处理距离输入
   */
  async handleDistanceInput(session, userInput) {
    const distance = parseFloat(userInput)

      if (isNaN(distance) || distance < 0) {
      await this.e.reply('请输入有效的距离数值（大于等于0）')
      return
    }

    session.data.distance = distance
    
    if (session.data.mode === 'mp') {
      // 全面战场模式：直接显示战场伤害结果，不需要护甲和射击次数
      const userId = this.e.user_id
      
      try {
        await this.e.reply('正在计算战场伤害，请稍候...')
        
        const result = await this.performBattlefieldDamageCalculation(session.data)
        
        // 清除会话
        endUserSession(userId)
        
        // 显示结果
        await this.displayBattlefieldDamageResult(result, session.data)
        
      } catch (error) {
        logger.error('[Calculator] 战场伤害计算失败:', error)
        await this.e.reply('计算过程中发生错误，请重新开始')
        endUserSession(userId)
      }
    } else {
      // 烽火地带模式：继续原有流程
      session.step = 'shots'

      await this.e.reply([
        segment.at(this.e.user_id),
        `\n已设置距离: ${distance}米`,
        '\n\n请输入射击次数（1-20，例如：5）：'
      ])
    }
  }

  /**
   * 处理射击次数输入
   */
  async handleShotsInput(session, userInput) {
    const shots = parseInt(userInput)

    if (isNaN(shots) || shots < 1 || shots > 20) {
      await this.e.reply('请输入有效的射击次数（1-20）')
      return
    }

    session.data.shots = shots
    session.step = 'hit_parts'

    const hitParts = ['头部', '胸部', '腹部', '大臂', '小臂', '大腿', '小腿']
    let msg = `射击次数: ${shots}发\n\n请选择命中部位，发送对应数字：\n`
    hitParts.forEach((part, index) => {
      // 只有头胸腹支持简写
      if (part === '头部') {
        msg += `${index + 1}. ${part} (简写: 头)\n`
      } else if (part === '胸部') {
        msg += `${index + 1}. ${part} (简写: 胸)\n`
      } else if (part === '腹部') {
        msg += `${index + 1}. ${part} (简写: 腹)\n`
      } else {
        msg += `${index + 1}. ${part}\n`
      }
    })
    msg += `\n简单模式：发送数字，全部子弹打该部位（例如：2 表示${shots}发全打胸部）`
    msg += `\n高级模式：部位:次数（例如：1:2,2:3 或 头:2,胸:3）`
    msg += `\n注意：四肢部位不支持简写，请使用序号`

      await this.e.reply([segment.at(this.e.user_id), '\n', msg])
  }

  /**
   * 处理命中部位输入并执行计算
   */
  async handleHitPartsInput(session, userInput) {
    const userId = this.e.user_id
    const hitPartOptions = ['头部', '胸部', '腹部', '大臂', '小臂', '大腿', '小腿']
    const totalShots = session.data.shots
    
    try {
      // 解析部位分配: 格式可以是 "2" (全部打胸部) 或 "1:2,2:3" 或 "头:2,胸:3"
      const hitParts = {}
      let totalAllocated = 0
      
      if (userInput.includes(':') || userInput.includes('：')) {
        // 高级格式：使用parseHitParts方法
        const parseResult = this.parseHitParts(userInput, totalShots)
        if (!parseResult.success) {
          await this.e.reply(`解析失败: ${parseResult.error}`)
          return
        }
        
        Object.assign(hitParts, parseResult.data)
        totalAllocated = totalShots
      } else {
        // 简单格式：单个部位索引，将所有子弹分配到该部位
        const partIndex = parseInt(userInput.trim()) - 1
        if (isNaN(partIndex) || partIndex < 0 || partIndex >= hitPartOptions.length) {
          await this.e.reply(`无效选择: ${userInput}，请输入 1-${hitPartOptions.length} 之间的数字`)
          return
        }
        const partName = hitPartOptions[partIndex]
        hitParts[partName] = totalShots
        totalAllocated = totalShots
      }
      
      // 验证分配总数
      if (totalAllocated !== totalShots) {
        await this.e.reply(`分配的子弹数量 ${totalAllocated} 与射击次数 ${totalShots} 不符，请重新分配`)
        return
      }

      // 执行伤害计算
      await this.e.reply('正在计算伤害，请稍候...')
      
      const result = await this.performDamageCalculation(session.data, hitParts)
      
      // 清除会话
      endUserSession(userId)
      logger.info(`[三角洲计算器] 伤害计算完成，已删除用户 ${userId} 的会话`)
      
      // 显示结果
      await this.displayDamageResult(result, session.data, hitParts)

    } catch (error) {
      logger.error('[InteractiveCalculator] 伤害计算失败:', error)
      await this.e.reply('计算过程中发生错误，请重新开始')
      endUserSession(userId)
    }
  }

  /**
   * 处理战备计算步骤
   */
  async handleReadinessCalculationStep(session, userInput) {
    const userId = this.e.user_id

    switch (session.step) {
      case 'target':
        await this.handleTargetReadinessInput(session, userInput)
        break
      case 'chest_option':
        await this.handleChestEquipmentOption(session, userInput)
        break
      case 'chest_selection':
        await this.handleChestEquipmentSelection(session, userInput)
        break
      case 'backpack_option':
        await this.handleBackpackEquipmentOption(session, userInput)
        break
      case 'backpack_selection':
        await this.handleBackpackEquipmentSelection(session, userInput)
        break
      case 'max_price':
        await this.handleMaxPriceInput(session, userInput)
        break
    }
  }



  /**
   * 处理维修计算步骤
   */
  async handleRepairCalculationStep(session, userInput) {
    switch (session.step) {
      case 'repair_mode':
        await this.handleRepairModeSelection(session, userInput)
        break
      case 'armor':
        await this.handleRepairArmorSelection(session, userInput)
        break
      case 'repair_level': // 局外维修等级选择
        await this.handleRepairLevelSelection(session, userInput)
        break

      case 'current_durability':
        await this.handleCurrentDurabilityInput(session, userInput)
        break
      case 'remaining_durability': // 局内维修的剩余耐久输入
        await this.handleRemainingDurabilityInput(session, userInput)
        break
      case 'target_durability':
        await this.handleTargetDurabilityInput(session, userInput)
        break
    }
  }

  /**
   * 处理目标战备值输入
   */
  async handleTargetReadinessInput(session, userInput) {
    const targetReadiness = parseInt(userInput)
    
    if (isNaN(targetReadiness) || targetReadiness <= 0) {
      await this.e.reply('请输入有效的目标战备值（正整数）')
      return
    }

    session.data.targetReadiness = targetReadiness
    session.step = 'chest_option'

        await this.e.reply([
          segment.at(this.e.user_id),
      `\n目标战备值: ${targetReadiness}`,
      '\n\n是否指定胸挂装备？',
      '\n1. 是，我要指定胸挂',
      '\n2. 否，自动选择',
      '\n请发送 1 或 2：'
    ])
  }

  /**
   * 处理胸挂装备选项
   */
  async handleChestEquipmentOption(session, userInput) {
    if (userInput === '1') {
      session.step = 'chest_selection'
      const chestEquipment = this.getChestEquipment()
      let msg = '请选择胸挂装备，发送对应数字：\n'
      chestEquipment.forEach((equipment, index) => {
        msg += `${index + 1}. ${equipment.name} (战备值: ${equipment.readinessValue})\n`
      })
      await this.e.reply([segment.at(this.e.user_id), '\n', msg])
    } else if (userInput === '2') {
      session.step = 'backpack_option'
      await this.e.reply([
        segment.at(this.e.user_id),
        '\n已选择自动选择胸挂',
        '\n\n是否指定背包装备？',
        '\n1. 是，我要指定背包',
        '\n2. 否，自动选择',
        '\n请发送 1 或 2：'
      ])
    } else {
      await this.e.reply('请输入 1 或 2')
    }
  }

  /**
   * 处理胸挂装备选择
   */
  async handleChestEquipmentSelection(session, userInput) {
    const chestEquipment = this.getChestEquipment()
    const equipmentIndex = parseInt(userInput) - 1
    
    if (isNaN(equipmentIndex) || equipmentIndex < 0 || equipmentIndex >= chestEquipment.length) {
      await this.e.reply(`请输入 1-${chestEquipment.length} 之间的数字`)
      return
    }

    session.data.specifiedChest = chestEquipment[equipmentIndex]
    session.step = 'backpack_option'

    await this.e.reply([
      segment.at(this.e.user_id),
      `\n已选择胸挂: ${session.data.specifiedChest.name}`,
      '\n\n是否指定背包装备？',
      '\n1. 是，我要指定背包',
      '\n2. 否，自动选择',
      '\n请发送 1 或 2：'
    ])
  }

  /**
   * 处理背包装备选项
   */
  async handleBackpackEquipmentOption(session, userInput) {
    if (userInput === '1') {
      session.step = 'backpack_selection'
      const backpackEquipment = this.getBackpackEquipment()
      let msg = '请选择背包装备，发送对应数字：\n'
      backpackEquipment.forEach((equipment, index) => {
        msg += `${index + 1}. ${equipment.name} (战备值: ${equipment.readinessValue})\n`
      })
      await this.e.reply([segment.at(this.e.user_id), '\n', msg])
    } else if (userInput === '2') {
      session.step = 'max_price'
      await this.e.reply([
        segment.at(this.e.user_id),
        '\n已选择自动选择背包',
        '\n\n是否设置最高价格限制？',
        '\n请输入最高价格（例如：50000），或发送 0 表示不限制：'
      ])
    } else {
      await this.e.reply('请输入 1 或 2')
    }
  }

  /**
   * 处理背包装备选择
   */
  async handleBackpackEquipmentSelection(session, userInput) {
    const backpackEquipment = this.getBackpackEquipment()
    const equipmentIndex = parseInt(userInput) - 1
    
    if (isNaN(equipmentIndex) || equipmentIndex < 0 || equipmentIndex >= backpackEquipment.length) {
      await this.e.reply(`请输入 1-${backpackEquipment.length} 之间的数字`)
      return
    }

    session.data.specifiedBackpack = backpackEquipment[equipmentIndex]
    session.step = 'max_price'

        await this.e.reply([
          segment.at(this.e.user_id),
      `\n已选择背包: ${session.data.specifiedBackpack.name}`,
      '\n\n是否设置最高价格限制？',
      '\n请输入最高价格（例如：50000），或发送 0 表示不限制：'
    ])
  }

  /**
   * 处理最高价格输入并执行计算
   */
  async handleMaxPriceInput(session, userInput) {
    const userId = this.e.user_id
    const maxPrice = parseInt(userInput)
    
    if (isNaN(maxPrice) || maxPrice < 0) {
      await this.e.reply('请输入有效的价格数值（大于等于0）')
      return
    }

    if (maxPrice > 0) {
      session.data.maxPrice = maxPrice
    }

    try {
      // 执行战备计算
      await this.e.reply('正在计算最优战备配置，请稍候...')
      
      const result = await this.performReadinessCalculation(session.data)
      
      // 清除会话
      endUserSession(userId)
      logger.info(`[三角洲计算器] 战备计算完成，已删除用户 ${userId} 的会话`)
      
      // 显示结果
      await this.displayReadinessResult(result, session.data)

    } catch (error) {
      logger.error('[InteractiveCalculator] 战备计算失败:', error)
      await this.e.reply('计算过程中发生错误，请重新开始')
      endUserSession(userId)
    }
  }

  /**
   * 执行伤害计算
   */
  async performDamageCalculation(data, hitParts) {
    const { weapon, armor, helmet, bullet, distance, shots } = data

    // 将 hitParts 对象转换为数组格式，每个部位重复对应的次数
    const hitPartsArray = []
    for (const [partName, count] of Object.entries(hitParts)) {
      for (let i = 0; i < count; i++) {
        hitPartsArray.push(this.translateHitPart(partName))
      }
    }

    const hitData = {
      distance,
      hitParts: hitPartsArray,
      fireMode: 1,
      triggerDelay: 0
    }

    // 传递头盔和护甲信息给计算器
    const armorData = {
      armor: armor,
      helmet: helmet
    }

    return this.calculator.calculateDamage(weapon, armorData, bullet, hitData)
  }

  /**
   * 执行战备计算
   */
  async performReadinessCalculation(data) {
    const options = { filterOverpriced: true }
    
    if (data.specifiedChest) {
      options.specifiedChest = data.specifiedChest
    }
    
    if (data.specifiedBackpack) {
      options.specifiedBackpack = data.specifiedBackpack
    }
    
    if (data.maxPrice) {
      options.maxPrice = data.maxPrice
    }

    return this.calculator.calculateReadiness(data.targetReadiness, options, DataManager)
  }

  /**
   * 显示伤害计算结果
   */
  async displayDamageResult(result, data, hitParts) {
    if (!result.success) {
      await this.e.reply(`计算失败: ${result.error}`)
      return
    }

    const modeName = data.mode === 'sol' ? '烽火地带' : '全面战场'
    
    // 构建护甲显示信息
    let protectionInfo = '无护甲'
    if (data.helmet && data.armor) {
      protectionInfo = `${data.helmet.name} + ${data.armor.name}`
    } else if (data.helmet) {
      protectionInfo = data.helmet.name
    } else if (data.armor) {
      protectionInfo = data.armor.name
    }

    // 计算总射击次数
    const totalShots = Object.values(hitParts).reduce((sum, count) => sum + count, 0)
    
    let msg = `【击杀模拟结果】\n`
    msg += `游戏模式: ${modeName}\n`
    msg += `武器: ${result.weapon}\n`
    msg += `防护: ${protectionInfo}\n`
    msg += `子弹: ${result.bullet} (穿透等级${result.penetrationLevel})\n`
    msg += `距离: ${result.distance}m\n`
    msg += `基础伤害: ${result.baseDamage}\n`
    msg += `距离衰减: ${result.weaponDecayMultiplier}\n`
    if (result.is338LapMag) {
      msg += `⚠️ .338 Lap Mag 完全穿透护甲！\n`
    }
    
    msg += `\n━━━ 击杀情况 ━━━\n`
    msg += `击杀所需: ${result.shotsToKill}发 / ${totalShots}发\n`
    msg += `总伤害: ${result.totalDamage}\n`
    msg += `护甲伤害: ${result.totalArmorDamage}\n`
    msg += `最终生命: ${result.finalPlayerHealth}/100\n`
    
    // 显示护甲和头盔信息
    if (result.maxArmorDurability > 0) {
      msg += `最终护甲: ${result.finalArmorDurability}/${result.maxArmorDurability} (${result.armor})\n`
    }
    if (result.maxHelmetDurability > 0) {
      msg += `最终头盔: ${result.finalHelmetDurability}/${result.maxHelmetDurability} (${result.helmet})\n`
    }
    if (result.maxArmorDurability === 0 && result.maxHelmetDurability === 0) {
      msg += `护具: 无\n`
    }
    
    msg += `击杀状态: ${result.isKilled ? '💀已击杀' : '💥未击杀'}\n`
    
    // 如果射击次数超过6发，使用转发消息显示完整逐发详情
    if (result.shotResults.length > 6) {
      // 先发送基础信息
      await this.e.reply([segment.at(this.e.user_id), '\n', msg])
      
      // 构建转发消息显示完整逐发详情
      const forwardMsg = []
      const shotsPerMsg = 5 // 每条消息显示10发
      
      for (let start = 0; start < result.shotResults.length; start += shotsPerMsg) {
        const end = Math.min(start + shotsPerMsg, result.shotResults.length)
        let detailMsg = ``
        
        for (let i = start; i < end; i++) {
          const shot = result.shotResults[i]
          const partName = this.getPartDisplayName(shot.hitPart)
          
          // 根据保护类型显示不同信息
          let protection = ''
          if (shot.isProtected) {
            const protectorName = shot.protectorType === 'helmet' ? '头盔' : '护甲'
            protection = shot.protectorDestroyed ? `(${protectorName}击碎)` : `(${protectorName}保护)`
          }
          
          const status = shot.isKill ? '💀' : '💥'
          detailMsg += `第${shot.shotNumber}发: ${partName} ${shot.damage} ${protection} ${status}\n`
          
          // 显示生命值和护具耐久
          let durabilityInfo = `生命: ${shot.playerHealthAfter}/100`
          if (result.maxArmorDurability > 0) {
            durabilityInfo += `, 护甲: ${shot.armorDurabilityAfter}`
          }
          if (result.maxHelmetDurability > 0) {
            durabilityInfo += `, 头盔: ${shot.helmetDurabilityAfter}`
          }
          detailMsg += `  ${durabilityInfo}\n`
        }
        
        forwardMsg.push({
          message: detailMsg,
          nickname: Bot.nickname,
          user_id: Bot.uin
        })
      }
      
      // 发送转发消息
      await this.e.reply(await Bot.makeForwardMsg(forwardMsg))
    } else {
      // 射击次数不超过6发，直接在原消息中显示
      msg += `\n━━━ 逐发详情 ━━━\n`
      for (let i = 0; i < result.shotResults.length; i++) {
        const shot = result.shotResults[i]
        const partName = this.getPartDisplayName(shot.hitPart)
        
        // 根据保护类型显示不同信息
        let protection = ''
        if (shot.isProtected) {
          const protectorName = shot.protectorType === 'helmet' ? '头盔' : '护甲'
          protection = shot.protectorDestroyed ? `(${protectorName}击碎)` : `(${protectorName}保护)`
        }
        
        const status = shot.isKill ? '💀' : '💥'
        msg += `第${shot.shotNumber}发: ${partName} ${shot.damage} ${protection} ${status}\n`
        
        // 显示生命值和护具耐久
        let durabilityInfo = `生命: ${shot.playerHealthAfter}/100`
        if (result.maxArmorDurability > 0) {
          durabilityInfo += `, 护甲: ${shot.armorDurabilityAfter}`
        }
        if (result.maxHelmetDurability > 0) {
          durabilityInfo += `, 头盔: ${shot.helmetDurabilityAfter}`
        }
        msg += `  ${durabilityInfo}\n`
      }
      
      await this.e.reply([segment.at(this.e.user_id), '\n', msg])
    }
  }

  /**
   * 显示战备计算结果
   */
  async displayReadinessResult(result, data) {
    if (!result.success) {
      await this.e.reply(`计算失败: ${result.error}`)
      return
    }

    if (result.totalCombinations === 0) {
      await this.e.reply('未找到符合条件的装备组合，请调整参数后重试')
      return
    }

    const topCombinations = result.topCombinations
    let msg = `【战备计算结果】\n`
    msg += `目标战备值: ${data.targetReadiness}\n`
    msg += `找到 ${result.totalCombinations} 个满足条件的组合，最优${topCombinations.length}个方案:\n\n`
    
    topCombinations.forEach((combo, index) => {
      msg += `━━━ 方案 #${index + 1} ━━━\n`
      msg += `总成本: ${this.formatPrice(combo.totalCost)} | 总战备: ${combo.totalReadiness}\n`
      
      for (const [slot, item] of Object.entries(combo.equipment)) {
        const slotName = this.getSlotDisplayName(slot)
        if (item.name === '无') {
          msg += `${slotName}: ${item.name}\n`
      } else {
          const priceInfo = item.marketPrice === 0 ? '不可交易' : this.formatPrice(item.marketPrice)
          msg += `${slotName}: ${item.name} (${priceInfo}/${item.readinessValue})\n`
        }
      }
      
      if (index < topCombinations.length - 1) msg += '\n'
    })

    await this.e.reply([segment.at(this.e.user_id), '\n', msg])
  }

  // 辅助方法

  /**
   * 获取武器类别
   */
  getWeaponCategories(mode) {
    try {
      if (mode === 'mp') {
        // 全面战场模式 - 使用战场武器数据
        const battlefieldData = DataManager.getBattlefieldWeapons()
        if (!battlefieldData || !battlefieldData.battlefield_weapons) {
          logger.warn(`[Calculator] 未找到战场武器数据`)
          return []
        }
        
        const categories = []
        for (const [category, weapons] of Object.entries(battlefieldData.battlefield_weapons)) {
          if (Array.isArray(weapons) && weapons.length > 0) {
            categories.push({
              key: category,
              displayName: this.getBattlefieldCategoryDisplayName(category),
              count: weapons.length
            })
          }
        }
        
        return categories
      } else {
        // 烽火地带模式 - 使用原有逻辑
        const calcData = DataManager.getCalculatorData()
        const weaponData = calcData.weaponsSol?.weapons || {}
        
        if (!weaponData || Object.keys(weaponData).length === 0) {
          logger.warn(`[Calculator] 未找到 ${mode} 模式的武器数据`)
          return []
        }
        
        const categories = []
        for (const [category, weapons] of Object.entries(weaponData)) {
          if (Array.isArray(weapons) && weapons.length > 0) {
            categories.push({
              key: category,
              displayName: this.getCategoryDisplayName(category),
              count: weapons.length
            })
          }
        }
        
        return categories
      }
    } catch (error) {
      logger.error('[Calculator] 获取武器类别失败:', error)
      return []
    }
  }

  /**
   * 根据类别获取武器列表
   */
  getWeaponsByCategory(mode, category) {
    try {
      if (mode === 'mp') {
        // 全面战场模式 - 使用战场武器数据
        const battlefieldData = DataManager.getBattlefieldWeapons()
        if (!battlefieldData || !battlefieldData.battlefield_weapons || !battlefieldData.battlefield_weapons[category]) {
          logger.warn(`[Calculator] 未找到战场武器 ${category} 数据`)
          return []
        }
        
        return battlefieldData.battlefield_weapons[category] || []
      } else {
        // 烽火地带模式 - 使用原有逻辑
        const calcData = DataManager.getCalculatorData()
        const weaponData = calcData.weaponsSol?.weapons || {}
        
        if (!weaponData || !weaponData[category]) {
          logger.warn(`[Calculator] 未找到 ${mode} 模式的 ${category} 武器数据`)
          return []
        }
        
        return weaponData[category] || []
      }
    } catch (error) {
      logger.error('[Calculator] 获取武器列表失败:', error)
      return []
    }
  }

  /**
   * 根据模式获取所有武器列表 - 用于模糊搜索
   */
  getWeaponsByMode(mode) {
    try {
      const calcData = DataManager.getCalculatorData()
      let weaponData = null
      
      if (mode === 'sol') {
        weaponData = calcData.weaponsSol?.weapons || {}
      } else if (mode === 'mp') {
        weaponData = calcData.weaponsMp?.weapons || {}
      }
      
      if (!weaponData) {
        logger.warn(`[Calculator] 未找到 ${mode} 模式的武器数据`)
        return []
      }
      
      // 将所有类别的武器合并到一个数组
      const allWeapons = []
      for (const [category, weapons] of Object.entries(weaponData)) {
        if (Array.isArray(weapons)) {
          allWeapons.push(...weapons.map(weapon => ({
            ...weapon,
            category
          })))
        }
      }
      
      return allWeapons
    } catch (error) {
      logger.error('[Calculator] 获取武器列表失败:', error)
      return []
    }
  }

  /**
   * 判断装备是否是头盔
   */
  isHelmet(equipment) {
    if (!equipment || !equipment.name) return false
    
    // 头盔关键词
    const helmetKeywords = ['头盔', '帽', '盔']
    return helmetKeywords.some(keyword => equipment.name.includes(keyword))
  }

  /**
   * 模糊搜索装备名称
   * @param {string} searchName - 搜索关键词
   * @returns {object|null} - 找到的装备对象
   */
  fuzzySearchEquipment(searchName) {
    const armors = this.getArmorList()
    const searchLower = searchName.toLowerCase()
    
    // 1. 精确匹配
    let found = armors.find(armor => armor.name.toLowerCase() === searchLower)
    if (found) return found
    
    // 2. 包含匹配
    found = armors.find(armor => armor.name.toLowerCase().includes(searchLower))
    if (found) return found
    
    // 3. 拼音首字母匹配（简单实现）
    const pinyinMap = {
      'dt': 'DT-AVS防弹衣',
      'fs': 'FS复合防弹衣',
      'hvk': 'Hvk-2 防弹衣',
      'hvk2': 'Hvk-2 防弹衣',
      'gn': 'GN重型头盔',
      'tt': '泰坦防弹装甲',
      'jg': '金刚防弹衣',
      'tlk': '特里克MAS2.0装甲'
    }
    
    if (pinyinMap[searchLower]) {
      found = armors.find(armor => armor.name === pinyinMap[searchLower])
      if (found) return found
    }
    
    // 4. 部分匹配
    found = armors.find(armor => {
      const armorLower = armor.name.toLowerCase()
      return searchLower.split('').every(char => armorLower.includes(char))
    })
    
    return found || null
  }

  /**
   * 解析游戏模式 - 支持更多别名
   */
  parseGameMode(mode) {
    const modeMap = {
      // 烽火地带模式
      'sol': 'sol',
      '烽火': 'sol',
      '烽火地带': 'sol', 
      '摸金': 'sol',
      // 全面战场模式
      'mp': 'mp',
      '战场': 'mp',
      '全面': 'mp',
      '大战场': 'mp',
      '全面战场': 'mp'
    }
    return modeMap[mode.toLowerCase()] || null
  }

  /**
   * 模糊搜索武器 - 增强版
   */
  fuzzySearchWeapon(weaponName, gameMode) {
    const weapons = this.getWeaponsByMode(gameMode)
    const searchLower = weaponName.toLowerCase()
    
    // 1. 精确匹配
    let found = weapons.find(weapon => weapon.name.toLowerCase() === searchLower)
    if (found) return found
    
    // 2. 包含匹配
    found = weapons.find(weapon => weapon.name.toLowerCase().includes(searchLower))
    if (found) return found
    
    // 3. 扩展的简化名称映射
    const nameMap = {
      '腾龙': '腾龙突击步枪',
      'qbz': 'QBZ-191',
      'ak': 'AK-74',
      'm4': 'M4A1',
      'kc17': 'KC17突击步枪',
      'k437': 'K437突击步枪',
      'asval': 'AS VAL突击步枪',
      'car15': 'CAR-15 突击步枪',
      'ptr32': 'PTR-32突击步枪',
      'g3': 'G3战斗步枪',
      'scarh': 'SCAR-H战斗步枪',
      'ak12': 'AK12突击步枪',
      'sg552': 'SG552突击步枪',
      'm7': 'M7战斗步枪',
      'aug': 'AUG突击步枪',
      'k416': 'K416突击步枪',
      'ash12': 'ASH-12战斗步枪',
      'aks74u': 'AKS-74U突击步枪'
    }
    
    if (nameMap[searchLower]) {
      found = weapons.find(weapon => weapon.name.includes(nameMap[searchLower]))
      if (found) return found
    }
    
    // 4. 部分字符匹配
    found = weapons.find(weapon => {
      const weaponLower = weapon.name.toLowerCase()
      return searchLower.split('').every(char => weaponLower.includes(char))
    })
    
    return found || null
  }

  /**
   * 模糊搜索子弹 - 增强版
   */
  fuzzySearchBullet(bulletName, caliber) {
    const bullets = DataManager.getBulletsByCaliber(caliber)
    const searchLower = bulletName.toLowerCase()
    
    // 1. 精确匹配
    let found = bullets.find(bullet => bullet.name.toLowerCase() === searchLower)
    if (found) return found
    
    // 2. 包含匹配
    found = bullets.find(bullet => bullet.name.toLowerCase().includes(searchLower))
    if (found) return found
    
    // 3. 扩展的子弹映射表
    const bulletMap = {
      // 5.8x42mm
      'dvc12': 'DVC12',
      'dbp87': 'DBP87',
      'dvp88': 'DVP88',
      'dbp10': 'DBP10',
      // 5.56x45mm
      'rrlp': 'RRLP',
      'm855': 'M855',
      'm855a1': 'M855A1',
      'm995': 'M995',
      // 7.62x51mm
      'm80': 'M80',
      'm61': 'M61',
      'm62': 'M62',
      // 5.45x39mm
      'prs': 'PRS',
      'ps': 'PS',
      'bt': 'BT',
      'bs': 'BS',
      // 常见简写
      'ap': 'AP',
      'fmj': 'FMJ',
      'jhp': 'JHP',
      'hp': 'HP'
    }
    
    const mappedName = bulletMap[searchLower]
    if (mappedName) {
      found = bullets.find(bullet => bullet.name.includes(mappedName))
      if (found) return found
    }
    
    // 4. 部分字符匹配
    found = bullets.find(bullet => {
      const bulletLower = bullet.name.toLowerCase()
      return searchLower.split('').every(char => bulletLower.includes(char))
    })
    
    return found || null
  }

  /**
   * 解析护甲选择 - 支持序号和模糊搜索
   */
  parseArmorSelection(armorStr) {
    const armors = this.getArmorList()
    
    // 检查是否是组合格式 (头盔:护甲 或 名称:名称)
    const combinationPattern = /^(.+?)[:：,，](.+?)$/
    const match = armorStr.match(combinationPattern)
    
    if (match) {
      const helmetStr = match[1].trim()
      const armorStr = match[2].trim()
      
      // 解析头盔
      const helmetResult = this.parseArmorItem(helmetStr, armors, true)
      if (!helmetResult.success) {
        return { success: false, error: `头盔解析失败: ${helmetResult.error}` }
      }
      
      // 解析护甲
      const armorResult = this.parseArmorItem(armorStr, armors, false)
      if (!armorResult.success) {
        return { success: false, error: `护甲解析失败: ${armorResult.error}` }
      }
      
      return { success: true, helmet: helmetResult.equipment, armor: armorResult.equipment }
    } else {
      // 单个选择
      const result = this.parseArmorItem(armorStr, armors, null)
      if (!result.success) {
        return result
      }
      
      const equipment = result.equipment
      if (this.isHelmet(equipment)) {
        return { success: true, helmet: equipment, armor: null }
      } else {
        return { success: true, helmet: null, armor: equipment }
      }
    }
  }

  /**
   * 解析单个护甲项 - 支持序号和模糊搜索
   */
  parseArmorItem(itemStr, armors, expectHelmet = null) {
    // 1. 尝试序号解析
    const index = parseInt(itemStr) - 2  // 减2因为第1个是"无护甲"
    if (!isNaN(index) && index >= 0 && index < armors.length) {
      const equipment = armors[index]
      
      // 如果指定了期望类型，进行验证
      if (expectHelmet === true && !this.isHelmet(equipment)) {
        return { success: false, error: `编号${parseInt(itemStr)}不是头盔` }
      }
      if (expectHelmet === false && this.isHelmet(equipment)) {
        return { success: false, error: `编号${parseInt(itemStr)}是头盔，请选择护甲` }
      }
      
      return { success: true, equipment }
    }
    
    // 2. 模糊搜索
    const searchLower = itemStr.toLowerCase()
    
    // 扩展的护甲映射表
    const armorMap = {
      // 护甲简写
      'dt': 'DT-AVS防弹衣',
      'fs': 'FS复合防弹衣',
      'hvk': 'Hvk-2 防弹衣',
      'hvk2': 'Hvk-2 防弹衣',
      'tt': '泰坦防弹装甲',
      'jg': '金刚防弹衣',
      'tlk': '特里克MAS2.0装甲',
      '泰坦': '泰坦防弹装甲',
      // 头盔简写
      'gn': 'GN重型头盔',
      'dich': 'DICH-9重型头盔',
      'dich-9': 'DICH-9重型头盔',
      'dich9': 'DICH-9重型头盔',
      'gt5': 'GT5指挥官头盔',
      'h70': 'H70夜视精英头盔'
    }
    
    // 3. 先尝试映射表匹配
    if (armorMap[searchLower]) {
      const found = armors.find(armor => armor.name.includes(armorMap[searchLower]))
      if (found) {
        // 验证类型
        if (expectHelmet === true && !this.isHelmet(found)) {
          return { success: false, error: `${itemStr}不是头盔` }
        }
        if (expectHelmet === false && this.isHelmet(found)) {
          return { success: false, error: `${itemStr}是头盔，请选择护甲` }
        }
        return { success: true, equipment: found }
      }
    }
    
    // 4. 包含匹配
    let found = armors.find(armor => armor.name.toLowerCase().includes(searchLower))
    if (found) {
      // 验证类型
      if (expectHelmet === true && !this.isHelmet(found)) {
        return { success: false, error: `${itemStr}不是头盔` }
      }
      if (expectHelmet === false && this.isHelmet(found)) {
        return { success: false, error: `${itemStr}是头盔，请选择护甲` }
      }
      return { success: true, equipment: found }
    }
    
    // 5. 部分字符匹配
    found = armors.find(armor => {
      const armorLower = armor.name.toLowerCase()
      return searchLower.split('').every(char => armorLower.includes(char))
    })
    
    if (found) {
      // 验证类型
      if (expectHelmet === true && !this.isHelmet(found)) {
        return { success: false, error: `${itemStr}不是头盔` }
      }
      if (expectHelmet === false && this.isHelmet(found)) {
        return { success: false, error: `${itemStr}是头盔，请选择护甲` }
      }
      return { success: true, equipment: found }
    }
    
    return { success: false, error: `未找到护甲: ${itemStr}` }
  }

  /**
   * 解析命中部位 - 支持序号和中文简写
   */
  parseHitParts(hitPartsStr, totalShots) {
    try {
      const hitParts = {}
      const partNames = ['头部', '胸部', '腹部', '大臂', '小臂', '大腿', '小腿']
      
      // 部位映射表 - 四肢不支持简写，避免冲突
      const partMap = {
        '1': '头部', '头': '头部', '头部': '头部',
        '2': '胸部', '胸': '胸部', '胸部': '胸部',
        '3': '腹部', '腹': '腹部', '腹部': '腹部', '肚': '腹部',
        '4': '大臂', '大臂': '大臂',
        '5': '小臂', '小臂': '小臂',
        '6': '大腿', '大腿': '大腿',
        '7': '小腿', '小腿': '小腿'
      }
      
      // 解析格式：1:2,2:4 或 头:2,胸:4
      const parts = hitPartsStr.split(/[,，]/).map(s => s.trim())
      let totalHits = 0
      
      for (const part of parts) {
        const [partStr, countStr] = part.split(/[:：]/).map(s => s.trim())
        const count = parseInt(countStr)
        
        if (isNaN(count) || count <= 0) {
          return { success: false, error: `无效的射击次数: ${countStr}` }
        }
        
        // 查找部位名称
        const partName = partMap[partStr]
        if (!partName) {
          return { success: false, error: `无效的部位: ${partStr}，支持1-7或中文简写` }
        }
        
        hitParts[partName] = (hitParts[partName] || 0) + count
        totalHits += count
      }
      
      if (totalHits !== totalShots) {
        return { success: false, error: `部位分配总数(${totalHits})与射击次数(${totalShots})不匹配` }
      }
      
      return { success: true, data: hitParts }
    } catch (error) {
      return { success: false, error: '部位格式错误，正确格式：头:2,胸:4 或 1:2,2:4' }
    }
  }

  /**
   * 获取护甲列表 - 按照防护等级排序，确保序号与显示一致
   */
  getArmorList() {
    const calcData = DataManager.getCalculatorData()
    const armorData = calcData.armors?.armors || {}
    const armors = []
    
    // 按照数据文件中的顺序：先body_armor，后helmets
    if (armorData.body_armor) {
      armors.push(...armorData.body_armor)
    }
    if (armorData.helmets) {  // 修复：使用正确的键名 "helmets"
      armors.push(...armorData.helmets)
    }
    
    // 按照防护等级排序，这样序号就与显示的顺序一致
    return armors.sort((a, b) => a.protectionLevel - b.protectionLevel)
  }

  /**
   * 获取胸挂装备列表
   */
  getChestEquipment() {
    const calcData = DataManager.getCalculatorData()
    const equipmentData = calcData.equipment?.equipment || {}
    return equipmentData.chest_rigs || []
  }

  /**
   * 获取背包装备列表
   */
  getBackpackEquipment() {
    const calcData = DataManager.getCalculatorData()
    const equipmentData = calcData.equipment?.equipment || {}
    return equipmentData.backpack || []
  }

  /**
   * 获取类别显示名称
   */
  getCategoryDisplayName(category) {
    const categoryMap = {
      'assault_rifles': '突击步枪',
      'submachine_guns': '冲锋枪',
      'shotguns': '霰弹枪', 
      'light_machine_guns': '轻机枪',
      'marksman_rifles': '精确射手步枪',
      'sniper_rifles': '狙击步枪',
      'pistols': '手枪',
      'special': '特殊武器'
    }
    return categoryMap[category] || category
  }

  /**
   * 获取战场武器类别显示名称
   */
  getBattlefieldCategoryDisplayName(category) {
    const categoryMap = {
      'rifles': '突击步枪',
      'lmgs': '轻机枪', 
      'dmrs': '精确射手步枪',
      'snipers': '狙击步枪',
      'pistols': '手枪'
    }
    return categoryMap[category] || category
  }

  /**
   * 翻译命中部位
   */
  translateHitPart(part) {
    const partMap = {
      '头部': 'head', '胸部': 'chest', '腹部': 'abdomen',
      '大臂': 'upper_arm', '小臂': 'lower_arm', 
      '大腿': 'thigh', '小腿': 'calf'
    }
    return partMap[part] || 'chest'
  }

  /**
   * 获取部位显示名称
   */
  getPartDisplayName(part) {
    const partMap = {
      'head': '头部', 'chest': '胸部', 'abdomen': '腹部',
      'upper_arm': '大臂', 'lower_arm': '小臂', 
      'thigh': '大腿', 'calf': '小腿'
    }
    return partMap[part] || part
  }

  /**
   * 获取槽位显示名称
   */
  getSlotDisplayName(slot) {
    const slotMap = {
      'weapon1': '主武器',
      'pistol': '手枪',
      'helmet': '头盔',
      'armor': '护甲',
      'chest': '胸挂',
      'backpack': '背包'
    }
    return slotMap[slot] || slot
  }

  /**
   * 格式化价格
   */
  formatPrice(price) {
    if (price >= 1000000) return `${(price / 1000000).toFixed(1)}M`
    if (price >= 1000) return `${(price / 1000).toFixed(0)}K`
    return price.toString()
  }



  // ============ 维修计算处理方法 ============

  /**
   * 处理维修模式选择
   */
  async handleRepairModeSelection(session, userInput) {
    const mode = userInput === '1' ? 'inside' : userInput === '2' ? 'outside' : null
    
    if (!mode) {
      await this.e.reply('请输入 1 或 2 选择维修模式')
      return
    }

    session.data.repairMode = mode
    session.step = 'armor'

    const modeName = mode === 'inside' ? '局内维修' : '局外维修'
    const armors = this.getArmorList()
    let msg = `已选择: ${modeName}\n\n请选择要维修的护甲，发送对应数字：\n`
    armors.forEach((armor, index) => {
      msg += `${index + 1}. ${armor.name} (防护等级${armor.protectionLevel})\n`
    })

    await this.e.reply([segment.at(this.e.user_id), '\n', msg])
  }

  /**
   * 处理维修护甲选择
   */
  async handleRepairArmorSelection(session, userInput) {
    const armors = this.getArmorList()
    const armorIndex = parseInt(userInput) - 1
    
    if (isNaN(armorIndex) || armorIndex < 0 || armorIndex >= armors.length) {
      await this.e.reply(`请输入 1-${armors.length} 之间的数字`)
      return
    }

    session.data.armor = armors[armorIndex]
    
    if (session.data.repairMode === 'inside') {
      // 局内维修：直接进入当前上限输入，不需要选择维修包
      session.step = 'current_durability'
      
      await this.e.reply([
        segment.at(this.e.user_id),
        `\n已选择护甲: ${session.data.armor.name}`,
        `\n护甲最大耐久: ${session.data.armor.initialMax}`,
        '\n\n请输入当前上限：'
      ])
    } else {
      // 局外维修：选择维修等级
      session.step = 'repair_level'

      let msg = `已选择护甲: ${session.data.armor.name}\n\n请选择维修等级，发送对应数字：\n`
      msg += `1. 初级维修 (损耗与价格为中级维修的1.25倍)\n`
      msg += `2. 中级维修 (标准损耗与价格)\n`

      await this.e.reply([segment.at(this.e.user_id), '\n', msg])
    }
  }

  /**
   * 处理局外维修等级选择
   */
  async handleRepairLevelSelection(session, userInput) {
    const level = userInput === '1' ? 'primary' : userInput === '2' ? 'intermediate' : null
    
    if (!level) {
      await this.e.reply('请输入 1 或 2 选择维修等级')
      return
    }

    session.data.repairLevel = level
    session.step = 'current_durability'

    const levelName = level === 'primary' ? '初级维修' : '中级维修'
    await this.e.reply([
      segment.at(this.e.user_id),
      `\n已选择维修等级: ${levelName}`,
      `\n护甲最大耐久: ${session.data.armor.initialMax}`,
      '\n\n请输入当前上限：'
    ])
  }



  /**
   * 处理当前耐久度输入
   */
  async handleCurrentDurabilityInput(session, userInput) {
    const currentDurability = parseFloat(userInput)
    
    if (isNaN(currentDurability) || currentDurability < 0 || currentDurability > session.data.armor.initialMax) {
      await this.e.reply(`请输入有效的耐久度数值（0-${session.data.armor.initialMax}）`)
      return
    }

    session.data.currentDurability = currentDurability

    if (session.data.repairMode === 'inside') {
      // 局内维修：需要输入剩余耐久
      session.step = 'remaining_durability'
      await this.e.reply([
        segment.at(this.e.user_id),
        `\n当前上限: ${currentDurability}`,
        `\n最大耐久: ${session.data.armor.initialMax}`,
        '\n\n请输入剩余耐久度：'
      ])
    } else {
      // 局外维修：也需要输入剩余耐久
      session.step = 'remaining_durability'
      await this.e.reply([
        segment.at(this.e.user_id),
        `\n当前上限: ${currentDurability}`,
        `\n最大耐久: ${session.data.armor.initialMax}`,
        '\n\n请输入剩余耐久度：'
      ])
    }
  }

  /**
   * 处理剩余耐久度输入 (局内和局外维修)
   */
  async handleRemainingDurabilityInput(session, userInput) {
    const remainingDurability = parseFloat(userInput)
    
    if (isNaN(remainingDurability) || remainingDurability < 0 || remainingDurability > session.data.currentDurability) {
      await this.e.reply(`请输入有效的剩余耐久度（0-${session.data.currentDurability}）`)
      return
    }

    session.data.remainingDurability = remainingDurability

    try {
      // 执行维修计算（局内或局外）
      const repairType = session.data.repairMode === 'inside' ? '维修损耗' : '维修成本'
      await this.e.reply(`正在计算${repairType}，请稍候...`)
      
      const result = await this.performRepairCalculation(session.data)
      
      // 清除会话
      const userId = this.e.user_id
      endUserSession(userId)
      logger.info(`[三角洲计算器] 维修计算完成，已删除用户 ${userId} 的会话`)
      
      // 显示结果
      await this.displayRepairResult(result, session.data)
      
    } catch (error) {
      logger.error('[InteractiveCalculator] 维修计算失败:', error)
      await this.e.reply('计算过程中发生错误，请重新开始')
      const userId = this.e.user_id
      endUserSession(userId)
    }
  }

  /**
   * 处理目标耐久度输入并执行计算
   */
  async handleTargetDurabilityInput(session, userInput) {
    const userId = this.e.user_id
    const targetDurability = parseFloat(userInput)
    
    if (isNaN(targetDurability) || targetDurability < session.data.currentDurability || targetDurability > session.data.armor.initialMax) {
      await this.e.reply(`请输入有效的目标耐久度（${session.data.currentDurability}-${session.data.armor.initialMax}）`)
      return
    }

    session.data.targetDurability = targetDurability

    try {
      // 执行维修计算
      await this.e.reply('正在计算维修成本，请稍候...')
      
      const result = await this.performRepairCalculation(session.data)
      
      // 清除会话
      endUserSession(userId)
      logger.info(`[三角洲计算器] 维修计算完成，已删除用户 ${userId} 的会话`)
      
      // 显示结果
      await this.displayRepairResult(result, session.data)
      
    } catch (error) {
      logger.error('[InteractiveCalculator] 维修计算失败:', error)
      await this.e.reply('计算过程中发生错误，请重新开始')
      endUserSession(userId)
    }
  }

  // ============ 计算执行方法 ============



  /**
   * 执行维修计算
   */
  async performRepairCalculation(data) {
    return this.calculator.calculateRepairLoss(data.armor, data)
  }

  // ============ 结果显示方法 ============



  /**
   * 显示维修计算结果
   */
  async displayRepairResult(result, data) {
    if (!result.success) {
      await this.e.reply(`计算失败: ${result.error}`)
      return
    }

    let msg = `【维修计算结果】\n`
    msg += `维修模式: ${result.mode}\n`
    msg += `护甲: ${result.armor}\n`

    if (data.repairMode === 'inside') {
      // 局内维修结果 - 按照Python版本格式显示
      msg += `当前上限: ${result.currentMax}\n`
      msg += `剩余耐久: ${result.remainingDurability}\n`
      msg += `维修后上限: ${result.repairedMax}\n`
      msg += `维修损耗: ${result.repairLoss}\n`
      msg += `消耗维修点数:\n`
      
      // 显示所有维修包的消耗点数
      for (const pkg of result.repairPackages) {
        msg += `- ${pkg.name}: ${pkg.consumption}\n`
      }
      
      // 移除最后的换行符
      msg = msg.trimEnd()
    } else {
      // 局外维修结果
      msg += `维修等级: ${result.repairLevel}\n`
      msg += `初始上限: ${result.initialMax}\n`
      msg += `当前上限: ${result.currentDurability}\n`
      msg += `剩余耐久: ${result.remainingDurability}\n`
      msg += `维修后上限: ${result.finalUpper}\n`
      msg += `维修损耗: ${result.repairLoss}\n`
      msg += `维修花费: ${result.repairCost}\n`
      msg += `磨损程度: ${result.wearPercentage}%\n`
      msg += `能否出售: ${result.marketStatus}`
    }

    await this.e.reply([segment.at(this.e.user_id), '\n', msg])
  }

  // ============ 战场伤害计算方法 ============

  /**
   * 执行战场伤害计算
   */
  async performBattlefieldDamageCalculation(data) {
    const { weapon, distance } = data
    
    // 计算距离衰减倍率
    const decayMultiplier = this.getBattlefieldDecayMultiplier(weapon, distance)
    
    // 计算各部位伤害和击杀次数
    const bodyParts = ['头部', '胸部', '腹部', '大臂', '小臂', '大腿', '小腿']
    const partResults = []
    
    for (const part of bodyParts) {
      const multiplier = this.getBattlefieldPartMultiplier(weapon, part)
      const damagePerShot = weapon.baseDamage * multiplier * decayMultiplier
      
      let hitsToKill = 'N/A'
      let timeToKill = 'N/A'
      
      if (damagePerShot > 0) {
        const hits = Math.ceil(100 / damagePerShot)
        hitsToKill = hits
        
        // 根据射击模式计算耗时
        if (weapon.fireModeCode === 1) { // 全自动
          timeToKill = weapon.triggerDelay + weapon.shootingInterval * (hits - 1)
        } else { // 半自动
          timeToKill = weapon.triggerDelay * hits + weapon.shootingInterval * (hits - 1)
        }
        timeToKill = Math.round(timeToKill * 100) / 100 // 保留2位小数
      }
      
      partResults.push({
        part,
        multiplier,
        damagePerShot: Math.round(damagePerShot * 100) / 100,
        hitsToKill,
        timeToKill
      })
    }
    
    return {
      success: true,
      weapon: weapon.name,
      baseDamage: weapon.baseDamage,
      distance,
      decayMultiplier,
      fireMode: weapon.fireMode,
      fireRate: weapon.fireRate,
      shootingInterval: weapon.shootingInterval,
      triggerDelay: weapon.triggerDelay,
      partResults
    }
  }

  /**
   * 获取战场武器距离衰减倍率
   */
  getBattlefieldDecayMultiplier(weapon, distance) {
    if (!weapon.decayDistances || !weapon.decayMultipliers) {
      return 1.0
    }
    
    // 在第一个衰减距离前，无衰减
    if (distance <= weapon.decayDistances[0]) {
      return 1.0
    }
    
    // 检查距离落在哪个衰减区间
    for (let i = 0; i < weapon.decayDistances.length; i++) {
      if (distance <= weapon.decayDistances[i]) {
        return weapon.decayMultipliers[i - 1] || 1.0
      }
    }
    
    // 距离超过最后一个衰减距离，使用最后一个衰减倍率
    return weapon.decayMultipliers[weapon.decayMultipliers.length - 1] || 1.0
  }

  /**
   * 获取战场武器部位倍率
   */
  getBattlefieldPartMultiplier(weapon, part) {
    const partMap = {
      '头部': weapon.headMultiplier,
      '胸部': weapon.chestMultiplier,
      '腹部': weapon.abdomenMultiplier,
      '大臂': weapon.upperArmMultiplier,
      '小臂': weapon.lowerArmMultiplier,
      '大腿': weapon.thighMultiplier,
      '小腿': weapon.calfMultiplier
    }
    return partMap[part] || 1.0
  }

  /**
   * 显示战场伤害计算结果
   */
  async displayBattlefieldDamageResult(result, data) {
    if (!result.success) {
      await this.e.reply(`计算失败: ${result.error}`)
      return
    }

    let msg = `【战场伤害计算结果】\n`
    msg += `游戏模式: 全面战场\n`
    msg += `武器: ${result.weapon}\n`
    msg += `射击模式: ${result.fireMode}\n`
    msg += `基础伤害: ${result.baseDamage}\n`
    msg += `距离: ${result.distance}m\n`
    msg += `衰减倍率: ${result.decayMultiplier.toFixed(3)}\n`
    msg += `射速: ${result.fireRate}RPM\n`
    msg += `射击间隔: ${result.shootingInterval.toFixed(2)}ms\n`
    msg += `扳机延迟: ${result.triggerDelay}ms\n\n`
    
    msg += `━━━ 各部位击杀数据 ━━━\n`
    
    for (const partResult of result.partResults) {
      const hitsStr = partResult.hitsToKill === 'N/A' ? '无法击杀' : `${partResult.hitsToKill}发`
      const timeStr = partResult.timeToKill === 'N/A' ? '无法计算' : `${partResult.timeToKill}ms`
      
      msg += `${partResult.part}: ${hitsStr} (${timeStr})\n`
      msg += `  伤害: ${partResult.damagePerShot} (倍率: ${partResult.multiplier})\n`
    }

    await this.e.reply([segment.at(this.e.user_id), '\n', msg])
  }

  /**
   * 获取主题数据 - 用于模板渲染
   */
  async getThemeData(diyStyle, sysStyle) {
    const helpConfig = { ...sysStyle, ...diyStyle }
    const colCount = Math.min(5, Math.max(parseInt(helpConfig?.colCount) || 3, 2))
    const colWidth = Math.min(600, Math.max(200, parseInt(helpConfig?.colWidth) || 350))
    const twoColumnLayout = helpConfig?.twoColumnLayout === true
    
    // 获取主题名称，默认为 'default'
    const themeName = helpConfig?.themeName || 'default'
    
    // 两侧空白区域（每侧15px，总共30px）
    const sidePadding = 30
    // 两列布局的间距
    const columnGap = 20
    
    let width
    if (twoColumnLayout) {
      // 两列布局：每个表格宽度 = 列数 * 列宽，总宽度 = 两个表格宽度 + 中间间距 + 两侧空白
      const tableWidth = colCount * colWidth
      width = tableWidth * 2 + columnGap + sidePadding
    } else {
      // 单列布局：总宽度 = 两侧空白区域 + (列数 * 列宽)
      width = colCount * colWidth + sidePadding
    }
    
    // 从 StyleConfig 获取指定主题的样式配置（支持热重载）
    const style = StyleConfig.getStyle(themeName)
    const themePath = StyleConfig.getThemePath(themeName)
    
    // 构建绝对路径（Puppeteer 渲染时相对路径的 base URL 不可靠）
    const path = await import('node:path')
    const { pluginRoot } = await import('../../model/path.js')
    
    const bgPath = path.join(pluginRoot, 'resources', 'help', 'imgs', themePath, 'bg.jpg')
    const iconPath = path.join(pluginRoot, 'resources', 'help', 'imgs', themePath, 'icon.png')
    
    const theme = {
      main: bgPath,
      bg: bgPath,
      icon: iconPath,
      style: style,
      themePath: themePath
    }
    const themeStyle = theme.style || {}
    const ret = []
    
    // body 样式设置（宽度、字体、背景图）
    const bodyFontFamily = themeStyle.fontFamily ?? diyStyle.fontFamily ?? sysStyle.fontFamily ?? 'Microsoft YaHei, SimHei, Arial, sans-serif'
    ret.push(`body{width:${width}px;font-family:${bodyFontFamily};background-image:url("${theme.bg}");background-repeat:no-repeat;background-size:cover;}`)
    
    // container 样式设置（宽度、背景图）
    ret.push(`.container{width:${width}px;background-image:url("${theme.main}");background-position:top left;background-repeat:no-repeat;background-size:100% auto;}`)
    
    // help-icon 样式设置（背景图）
    ret.push(`.help-icon{background-image:url("${theme.icon}");background-size:500px auto;}`)
    
    // 表格宽度
    ret.push(`.help-table .td,.help-table .th{width:${100 / colCount}%}`)
    
    // 如果启用两列布局，添加相应的CSS
    if (twoColumnLayout) {
      ret.push(`
        .help-content-wrapper{display:flex;gap:${columnGap}px;width:100%;}
        .help-column{flex:1;min-width:0;}
        .help-column .cont-box{width:100%;}
      `)
    }
    
    const css = function (sel, cssProp, key, def, fn) {
      let val = themeStyle[key] ?? diyStyle[key] ?? sysStyle[key] ?? def
      if (fn) {
        val = fn(val)
      }
      ret.push(`${sel}{${cssProp}:${val}}`)
    }
    
    // 其他样式设置
    css('.head-box .title', 'font-size', 'titleFontSize', '50px')
    css('.help-group', 'font-size', 'groupFontSize', '18px')
    css('.help-title', 'font-size', 'commandFontSize', '16px')
    css('.help-desc', 'font-size', 'descFontSize', '13px')
    css('.help-table .td,.help-table .th', 'font-size', 'tableFontSize', '14px')
    
    // 颜色和样式设置
    css('.help-title,.help-group', 'color', 'fontColor', '#ceb78b')
    css('.help-title,.help-group', 'text-shadow', 'fontShadow', 'none')
    css('.help-desc', 'color', 'descColor', '#eee')
    css('.cont-box', 'background', 'contBgColor', 'rgba(43, 52, 61, 0.8)')
    css('.cont-box', 'backdrop-filter', 'contBgBlur', 3, (n) => diyStyle.bgBlur === false ? 'none' : `blur(${n}px)`)
    css('.help-group', 'background', 'headerBgColor', 'rgba(34, 41, 51, .4)')
    css('.help-table .tr:nth-child(odd)', 'background', 'rowBgColor1', 'rgba(34, 41, 51, .2)')
    css('.help-table .tr:nth-child(even)', 'background', 'rowBgColor2', 'rgba(34, 41, 51, .4)')
    
    const finalStyle = ret.join('\n')
    return {
      style: `<style>${finalStyle}</style>`,
      colCount,
      themePath
    }
  }
}
