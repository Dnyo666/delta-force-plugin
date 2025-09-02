/**
 * 三角洲行动计算工具类
 * 提供各种游戏相关的计算功能
 * 严格按照繁星攻略组Python代码的计算逻辑实现
 */

export class Calculate {
  constructor() {
    // 计算器不需要存储数据，所有数据都通过Data.js获取
  }

  /**
   * 战备计算器 - 计算最低成本卡战备配装
   * 严格按照繁星攻略组Python代码逻辑实现
   * @param {number} targetReadiness - 目标战备值
   * @param {object} options - 配置选项
   * @param {object} dataManager - DataManager实例
   * @returns {object} 计算结果
   */
  calculateReadiness(targetReadiness, options = {}, dataManager) {
    try {
      const {
        specifiedChest = null,
        specifiedBackpack = null,
        maxPrice = Infinity,
        filterOverpriced = true
      } = options

      // 获取数据
      const equipmentData = dataManager.getEquipmentData();
      const weaponsData = dataManager.getCalculatorData().weapons;
      const armorsData = dataManager.getCalculatorData().armors;

      if (!equipmentData || !weaponsData || !armorsData) {
        throw new Error('数据加载失败，请检查数据文件')
      }

      // 按照Python逻辑过滤装备数据
      const availableEquipment = this.filterEquipmentByPrice(equipmentData, armorsData, maxPrice, filterOverpriced, targetReadiness)
      const availableWeapons = this.filterWeaponsByPrice(weaponsData, maxPrice, filterOverpriced, targetReadiness)

      // 生成所有可能的组合（严格按照Python算法）
      const combinations = this.generateEquipmentCombinations(
        targetReadiness,
        availableEquipment,
        availableWeapons,
        specifiedChest,
        specifiedBackpack
      )

      if (combinations.length === 0) {
        return {
          success: true,
          targetReadiness,
          bestCombination: null,
          topCombinations: [],
          totalCombinations: 0
        }
      }

      // 按总成本升序排序，只保留前3个最优方案（Python逻辑）
      combinations.sort((a, b) => a.totalCost - b.totalCost)
      const top3 = combinations.slice(0, 3)

      return {
        success: true,
        targetReadiness,
        bestCombination: top3[0],
        topCombinations: top3,
        totalCombinations: combinations.length
      }
    } catch (error) {
      logger.error('[Calculate] 战备计算失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * 夺金伤害计算 - 击杀模拟计算（从满血满甲到击杀）
   * 严格按照Python代码逻辑实现
   * @param {object} weapon - 武器数据
   * @param {object} armorData - 护甲数据（可包含armor和helmet）
   * @param {object} bullet - 子弹数据
   * @param {object} hitData - 命中数据
   * @returns {object} 伤害计算结果
   */
  calculateDamage(weapon, armorData, bullet, hitData) {
    try {
      const {
        distance = 0,
        hitParts = [], // 命中部位数组
        fireMode = 1,  // 射击模式
        triggerDelay = 0 // 扳机延迟
      } = hitData

      if (!weapon || !bullet) {
        return {
          success: false,
          error: '缺少武器或子弹数据'
        }
      }

      // 初始状态
      let playerHealth = 100.0  // 满血100/100
      let currentArmorDurability = 0  // 护甲满耐久
      let currentHelmetDurability = 0  // 头盔满耐久
      
      // 护甲参数 - 支持头盔+护甲组合
      let armorLevel = 0
      let helmetLevel = 0
      let maxArmorDurability = 0
      let maxHelmetDurability = 0
      let armorInfo = null
      let helmetInfo = null
      
      // 处理护甲数据
      if (armorData) {
        if (armorData.armor && armorData.helmet) {
          // 组合模式：头盔+护甲
          armorInfo = armorData.armor
          helmetInfo = armorData.helmet
          armorLevel = armorInfo.protectionLevel
          helmetLevel = helmetInfo.protectionLevel
          currentArmorDurability = armorInfo.initialMax
          currentHelmetDurability = helmetInfo.initialMax
          maxArmorDurability = armorInfo.initialMax
          maxHelmetDurability = helmetInfo.initialMax
        } else if (armorData.armor) {
          // 只有护甲
          armorInfo = armorData.armor
          armorLevel = armorInfo.protectionLevel
          currentArmorDurability = armorInfo.initialMax
          maxArmorDurability = armorInfo.initialMax
        } else if (armorData.helmet) {
          // 只有头盔
          helmetInfo = armorData.helmet
          helmetLevel = helmetInfo.protectionLevel
          currentHelmetDurability = helmetInfo.initialMax
          maxHelmetDurability = helmetInfo.initialMax
        } else if (armorData.protectionLevel) {
          // 兼容旧格式：单个护甲对象
          const armor = armorData
          if (armor.name?.includes('头盔') || armor.name?.includes('帽') || armor.name?.includes('盔')) {
            helmetInfo = armor
            helmetLevel = armor.protectionLevel
            currentHelmetDurability = armor.initialMax
            maxHelmetDurability = armor.initialMax
          } else {
            armorInfo = armor
            armorLevel = armor.protectionLevel
            currentArmorDurability = armor.initialMax
            maxArmorDurability = armor.initialMax
          }
        }
      }
      
      // 计算武器距离衰减倍率
      const weaponDecayMultiplier = this.calculateWeaponDecay(distance, weapon)
      
      // 获取子弹参数
      const penetrationLevel = bullet.penetrationLevel || 0
      const baseDamageMultiplier = bullet.baseDamageMultiplier || 1.0
      const baseArmorMultiplier = bullet.baseArmorMultiplier || 1.0
      const armorDecayFactors = bullet.armorDecayFactors || []

      // 武器基础参数
      const weaponDamage = weapon.baseDamage || 0
      const weaponArmorDamage = weapon.armorDamage || 0

      // 特殊处理：.338 Lap Mag弹药始终完全穿透护甲
      const is338LapMag = bullet.caliber === '338lapmag' || bullet.name?.includes('.338 Lap Mag')

      // 部位倍率映射
      const bodyPartMultipliers = {
        '头部': weapon.headMultiplier || 2.1,
        '胸部': weapon.chestMultiplier || 1.0,
        '腹部': weapon.abdomenMultiplier || 1.0,
        '下腹部': weapon.abdomenMultiplier || 1.0,
        '大臂': weapon.upperArmMultiplier || 1.0,
        '小臂': weapon.lowerArmMultiplier || 1.0,
        '大腿': weapon.thighMultiplier || 1.0,
        '小腿': weapon.calfMultiplier || 1.0,
        'head': weapon.headMultiplier || 2.1,
        'chest': weapon.chestMultiplier || 1.0,
        'abdomen': weapon.abdomenMultiplier || 1.0,
        'upper_arm': weapon.upperArmMultiplier || 1.0,
        'lower_arm': weapon.lowerArmMultiplier || 1.0,
        'thigh': weapon.thighMultiplier || 1.0,
        'calf': weapon.calfMultiplier || 1.0
      }

      // 定义护甲和头盔的保护部位
      const armorProtectedAreas = ['胸部', '腹部', '下腹部', 'chest', 'abdomen']  // 护甲保护躯干
      const helmetProtectedAreas = ['头部', 'head']  // 头盔保护头部

      // 模拟结果
      const shotResults = []
      let totalDamage = 0
      let totalArmorDamage = 0
      let shotCount = 0

      // 逐发模拟直到击杀
      for (let i = 0; i < hitParts.length && playerHealth > 0; i++) {
        const hitPart = hitParts[i]
        shotCount++
        
        // 判断保护状态 - 分别检查头盔和护甲
        let isProtected = false
        let protectorLevel = 0
        let isHelmetProtected = false
        let isArmorProtected = false
        
        // 检查头盔保护
        if (helmetLevel > 0 && currentHelmetDurability > 0 && helmetProtectedAreas.includes(hitPart)) {
          isHelmetProtected = true
          isProtected = true
          protectorLevel = helmetLevel
        }
        
        // 检查护甲保护
        if (armorLevel > 0 && currentArmorDurability > 0 && armorProtectedAreas.includes(hitPart)) {
          isArmorProtected = true
          if (!isProtected) {  // 如果头盔没有保护，则使用护甲保护
            isProtected = true
            protectorLevel = armorLevel
          }
        }
        // 确定保护器类型和当前耐久度
        let protectorType = null
        let currentProtectorDurability = 0
        
        if (isHelmetProtected) {
          protectorType = 'helmet'
          currentProtectorDurability = currentHelmetDurability
        } else if (isArmorProtected) {
          protectorType = 'armor'
          currentProtectorDurability = currentArmorDurability
        }

        let finalDamage = 0
        let armorDamageValue = 0
        let protectorDestroyed = false
        let armorDamageDealt = 0

        if (isProtected) {
          // 计算穿透倍率
          let penetrationMultiplier = 0.0
          const levelDiff = penetrationLevel - protectorLevel
          if (levelDiff < 0) {
            penetrationMultiplier = 0.0
          } else if (levelDiff === 0) {
            penetrationMultiplier = 0.5
          } else if (levelDiff === 1) {
            penetrationMultiplier = 0.75
          } else {
            penetrationMultiplier = 1.0
          }

          // 计算护甲伤害
          const armorDecayMultiplier = armorDecayFactors[protectorLevel - 1] || 0
          armorDamageValue = weaponArmorDamage * baseArmorMultiplier * armorDecayMultiplier * weaponDecayMultiplier

          // 计算剩余耐久
          const remainingDurability = Math.max(0, currentProtectorDurability - armorDamageValue)
          protectorDestroyed = remainingDurability <= 0
          armorDamageDealt = currentProtectorDurability - remainingDurability
          totalArmorDamage += armorDamageDealt

          // 更新耐久
          if (protectorType === 'helmet') {
            currentHelmetDurability = remainingDurability
          } else {
            currentArmorDurability = remainingDurability
          }

          // 计算伤害
          const partMultiplier = bodyPartMultipliers[hitPart] || 1.0
          
          if (is338LapMag) {
            // .338弹药完全穿透护甲
            finalDamage = weaponDamage * baseDamageMultiplier * partMultiplier * weaponDecayMultiplier
          } else {
            // 正常护甲穿透计算
            const denominator = weaponArmorDamage * baseArmorMultiplier * weaponDecayMultiplier * armorDecayMultiplier
            
            if (denominator === 0) {
              finalDamage = weaponDamage * baseDamageMultiplier * partMultiplier * weaponDecayMultiplier
            } else if (currentProtectorDurability >= armorDamageValue) {
              // 护甲未被击穿
              finalDamage = weaponDamage * baseDamageMultiplier * partMultiplier * penetrationMultiplier * weaponDecayMultiplier
            } else {
              // 护甲被击穿的情况
              const ratio = currentProtectorDurability / denominator
              const part1 = ratio * weaponDamage * baseDamageMultiplier * partMultiplier * penetrationMultiplier * weaponDecayMultiplier
              const part2 = (1 - ratio) * weaponDamage * baseDamageMultiplier * partMultiplier * weaponDecayMultiplier
              finalDamage = part1 + part2
            }
          }
        } else {
          // 未受保护
          const partMultiplier = bodyPartMultipliers[hitPart] || 1.0
          finalDamage = weaponDamage * baseDamageMultiplier * partMultiplier * weaponDecayMultiplier
        }

        // 四舍五入
        finalDamage = Math.round(finalDamage * 100) / 100
        armorDamageValue = Math.round(armorDamageValue * 100) / 100

        // 扣除生命值
        playerHealth -= finalDamage
        totalDamage += finalDamage

        // 记录这发子弹的结果
        shotResults.push({
          shotNumber: shotCount,
          hitPart,
          damage: finalDamage,
          armorDamage: armorDamageDealt,
          isProtected,
          protectorDestroyed,
          protectorType,
          playerHealthAfter: Math.max(0, Math.round(playerHealth * 100) / 100),
          armorDurabilityAfter: Math.round(currentArmorDurability * 10) / 10,
          helmetDurabilityAfter: Math.round(currentHelmetDurability * 10) / 10,
          isKill: playerHealth <= 0
        })

        // 如果击杀则停止
        if (playerHealth <= 0) {
          break
        }
      }

      return {
        success: true,
        weapon: weapon.name,
        // 护甲和头盔信息
        armor: armorInfo ? armorInfo.name : '无',
        helmet: helmetInfo ? helmetInfo.name : '无',
        bullet: bullet.name,
        distance,
        baseDamage: weaponDamage,
        weaponDecayMultiplier: Math.round(weaponDecayMultiplier * 1000) / 1000,
        penetrationLevel,
        armorLevel,
        helmetLevel,
        is338LapMag,
        
        // 击杀模拟结果
        shotsToKill: shotCount,
        totalDamage: Math.round(totalDamage * 100) / 100,
        totalArmorDamage: Math.round(totalArmorDamage * 100) / 100,
        shotResults,
        finalPlayerHealth: Math.max(0, Math.round(playerHealth * 100) / 100),
        finalArmorDurability: Math.round(currentArmorDurability * 10) / 10,
        finalHelmetDurability: Math.round(currentHelmetDurability * 10) / 10,
        maxArmorDurability,
        maxHelmetDurability,
        armorType: armorInfo ? armorInfo.type : null,
        helmetType: helmetInfo ? helmetInfo.type : null,
        isKilled: playerHealth <= 0
      }
    } catch (error) {
      logger.error('[Calculate] 伤害计算失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * 战场伤害计算 - 无护甲影响的伤害计算
   * 严格按照Python代码逻辑实现
   * @param {object} weapon - 武器数据
   * @param {number} distance - 距离
   * @param {string} hitPart - 命中部位
   * @returns {object} 伤害结果
   */
  calculateBattlefieldDamage(weapon, distance, hitPart = 'chest') {
    try {
      // 计算距离衰减
      const distanceMultiplier = this.calculateDistanceMultiplier(weapon, distance)
      
      // 获取部位倍率
      const partMultiplier = weapon[`${hitPart}_multiplier`] || 1.0
      
      // 计算最终伤害
      const finalDamage = weapon.baseDamage * distanceMultiplier * partMultiplier
      
      // 判断是否致死
      const isKill = finalDamage >= 100
      
      return {
        success: true,
        weapon: weapon.name,
        distance,
        hitPart,
        baseDamage: weapon.baseDamage,
        distanceMultiplier: Math.round(distanceMultiplier * 1000) / 1000,
        partMultiplier,
        finalDamage: Math.round(finalDamage * 100) / 100,
        isKill,
        killThreshold: 100
      }
    } catch (error) {
      logger.error('[Calculate] 战场伤害计算失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * 维修损耗计算 - 计算装备维修后的损耗
   * 严格按照Python代码逻辑实现
   * @param {object} armor - 护甲数据
   * @param {object} repairData - 维修数据
   * @returns {object} 维修结果
   */
  calculateRepairLoss(armor, repairData) {
    try {
      const { repairMode } = repairData

      if (repairMode === 'inside') {
        // 局内维修逻辑
        return this.calculateInsideRepair(armor, repairData)
      } else {
        // 局外维修逻辑
        return this.calculateOutsideRepair(armor, repairData)
      }
    } catch (error) {
      logger.error('[Calculate] 维修计算失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * 局内维修计算 - 严格按照繁星攻略组Python代码实现
   * @param {object} armor - 护甲数据
   * @param {object} repairData - 维修数据
   * @returns {object} 维修结果
   */
  calculateInsideRepair(armor, repairData) {
    const { currentDurability, remainingDurability } = repairData

    if (!armor || remainingDurability > currentDurability) {
      return {
        success: false,
        error: '无效的维修参数'
      }
    }

    // 严格按照Python逻辑计算
    const initialMax = armor.initialMax
    const repairLoss = armor.repairLoss
    
    if (repairLoss === undefined) {
      return {
        success: false,
        error: `护甲 ${armor.name} 缺少维修损耗数据`
      }
    }
    
    // 使用Decimal精度计算，模拟Python的Decimal库
    const d_initialMax = parseFloat(initialMax.toString())
    const d_repairLoss = parseFloat(repairLoss.toString())
    const d_currentMax = parseFloat(currentDurability.toString())
    const d_remainingDurability = parseFloat(remainingDurability.toString())
    
    // 计算比例 - 按照Python逻辑：(current_max - remaining) / current_max
    let ratio = 0
    if (d_currentMax !== 0) {
      ratio = (d_currentMax - d_remainingDurability) / d_currentMax
    }
    
    // 计算对数项 - 按照Python逻辑：log10(current_max / initial_max)
    let logTerm = 0
    if (d_currentMax > 0 && d_initialMax > 0) {
      logTerm = Math.log10(d_currentMax / d_initialMax)
    }
    
    // 计算维修后上限 - 按照Python公式
    const repairedMax = d_currentMax - d_currentMax * ratio * (d_repairLoss - logTerm)
    
    // 四舍五入到2位小数用于点数计算（Python的quantize ROUND_HALF_UP）
    const repairedMaxForCalculation = Math.round(repairedMax * 100) / 100
    
    // 计算耐久差 - 维修后上限减去剩余耐久
    const delta = repairedMaxForCalculation - d_remainingDurability
    
    // 计算所有四种维修包的消耗点数
    const repairPackages = []
    const packageTypes = [
      { key: 'self_made', name: '自制维修包' },
      { key: 'standard', name: '标准维修包' },
      { key: 'precision', name: '精密维修包' },
      { key: 'advanced', name: '高级维修组合' }
    ]
    
    for (const packageType of packageTypes) {
      const efficiency = this.getInsideRepairEfficiency(armor, packageType.key)
      let consumption = '暂无数据'
      
      if (efficiency === null || efficiency === undefined) {
        consumption = '暂无数据'
      } else if (efficiency === 0) {
        consumption = '无穷大'
      } else if (delta <= 0) {
        consumption = '无效值'
      } else {
        // 计算点数并向下取整（Python的ROUND_FLOOR）
        const points = delta / efficiency
        consumption = Math.floor(points)
      }
      
      repairPackages.push({
        name: packageType.name,
        efficiency: efficiency,
        consumption: consumption
      })
    }

    return {
      success: true,
      mode: '局内维修',
      armor: armor.name,
      currentMax: currentDurability,
      remainingDurability,
      repairedMax: Math.round(repairedMax * 10) / 10, // 显示用1位小数
      repairLoss,
      repairPackages
    }
  }

  /**
   * 局外维修计算 - 严格按照繁星攻略组Python代码逻辑
   * @param {object} armor - 护甲数据
   * @param {object} repairData - 维修数据
   * @returns {object} 维修结果
   */
  calculateOutsideRepair(armor, repairData) {
    const { repairLevel, currentDurability, remainingDurability } = repairData

    if (!armor || currentDurability <= 0) {
      return {
        success: false,
        error: '无效的维修参数'
      }
    }

    // 获取维修倍率
    const repairMultiplier = repairLevel === 'primary' ? 1.25 : 1.0
    const levelName = repairLevel === 'primary' ? '初级维修' : '中级维修'
    
    // 从护甲数据获取维修损耗和价格（不使用默认值）
    const baseRepairLoss = armor.repairLoss
    const baseRepairPrice = armor.repairPrice
    
    if (baseRepairLoss === undefined || baseRepairPrice === undefined) {
      return {
        success: false,
        error: `护甲 ${armor.name} 缺少维修数据（损耗: ${baseRepairLoss}, 价格: ${baseRepairPrice}）`
      }
    }
    
    const adjustedRepairLoss = Math.min(baseRepairLoss * repairMultiplier, 1.0)
    const adjustedRepairPrice = baseRepairPrice * repairMultiplier
    
    // 严格按照Python逻辑计算
    const initialMax = armor.initialMax
    
    // 处理当前上限（去尾法取整）- 与Python版本一致
    const currentUpperProcessed = Math.floor(currentDurability)
    const remainingDurabilityDec = remainingDurability !== undefined ? remainingDurability : currentUpperProcessed
    
    // 维修可行性判定 - 与Python版本一致
    const armorType = armor.type || armor.category
    if (armorType && armorType.includes('头盔') && currentUpperProcessed < 5) {
      return {
        success: false,
        error: `当前头盔上限(${currentUpperProcessed})小于5，不可维修`
      }
    }
    if (!armorType?.includes('头盔') && currentUpperProcessed < 10) {
      return {
        success: false,
        error: `当前护甲上限(${currentUpperProcessed})小于10，不可维修`
      }
    }
    
    try {
      // 严格按照Python代码的计算公式
      // term1 = (current_upper_processed - remaining_durability_dec) / current_upper_processed
      const term1 = (currentUpperProcessed - remainingDurabilityDec) / currentUpperProcessed
      
      // 对数计算安全校验
      if (currentUpperProcessed <= 0 || initialMax <= 0) {
        throw new Error("对数计算参数必须大于0")
      }
      
      // 计算对数部分
      // log_value = float(current_upper_processed) / float(initial_upper)
      const logValue = currentUpperProcessed / initialMax
      if (logValue <= 0) {
        throw new Error("对数计算参数必须大于0")
      }
      
      const logTerm = Math.log10(logValue)
      
      // term2 = repair_loss - Decimal(str(log_term))
      const term2 = adjustedRepairLoss - logTerm
      
      // 计算维修后上限
      // repaired_upper = current_upper_processed - current_upper_processed * term1 * term2
      const repairedUpper = currentUpperProcessed - currentUpperProcessed * term1 * term2
      
      // 确保结果有效
      if (isNaN(repairedUpper) || !isFinite(repairedUpper)) {
        throw new Error("计算结果无效")
      }
      
      // 去尾法取整（向下取整）
      let finalUpper = Math.floor(repairedUpper)
      if (finalUpper < 1) {
        finalUpper = 1
      }
      
      // 计算维修花费（剩余耐久取整）
      // remaining_int = Decimal(str(int(remaining_durability)))  # 去尾取整
      // repair_cost = (final_upper - remaining_int + Decimal('1')) * repair_price
      const remainingInt = Math.floor(remainingDurabilityDec)
      let repairCost = (finalUpper - remainingInt + 1) * adjustedRepairPrice
      
      // 花费不能为负
      if (repairCost < 0) {
        repairCost = 0
      } else {
        // 货币值取整（四舍五入到整数）
        repairCost = Math.round(repairCost)
      }
      
      // 计算磨损百分比
      const wearPercentage = (1 - finalUpper / initialMax) * 100

      // 市场出售判定 - 按照Python代码逻辑
      let marketStatus = ''
      const nonTradableEquipments = [
        "金刚防弹衣",
        "特里克MAS2.0装甲", 
        "泰坦防弹装甲",
        "DICH-9重型头盔",
        "GT5指挥官头盔",
        "H70夜视精英头盔"
      ]
      
      if (nonTradableEquipments.includes(armor.name)) {
        // 特殊装备直接标记为不可交易
        marketStatus = "不可在市场进行交易"
      } else {
        // 计算初始上限的85%和70%（向下取整）
        const threshold85 = Math.floor(initialMax * 0.85)
        const threshold70 = Math.floor(initialMax * 0.70)
        
        // 比较维修后上限与市场阈值
        if (finalUpper >= threshold85) {
          marketStatus = "略有磨损，可在市场出售"
        } else if (finalUpper >= threshold70) {
          marketStatus = "久经沙场，可在市场出售"
        } else {
          marketStatus = "破损不堪，不可在市场出售"
        }
      }

      return {
        success: true,
        mode: '局外维修',
        armor: armor.name,
        repairLevel: levelName,
        initialMax,
        currentDurability: currentUpperProcessed,
        remainingDurability: remainingDurabilityDec,
        finalUpper,
        repairLoss: adjustedRepairLoss,
        repairCost,
        wearPercentage: Math.round(wearPercentage * 10) / 10,
        marketStatus
      }
      
    } catch (error) {
      return {
        success: false,
        error: `计算错误: ${error.message}`
      }
    }
  }

  /**
   * 计算武器距离衰减倍率 - 严格按照繁星攻略组Python代码逻辑
   * @param {number} distance - 距离
   * @param {object} weapon - 武器数据
   * @returns {number} 衰减倍率
   */
  calculateWeaponDecay(distance, weapon) {
    const decayDistances = weapon.decayDistances || weapon.decay_distances || []
    const decayMultipliers = weapon.decayMultipliers || weapon.decay_factors || []

    if (decayDistances.length === 0) {
      return 1.0
    }

    // 确保衰减距离有序（Python逻辑中是有序的）
    const sortedPairs = decayDistances.map((dist, index) => ({
      distance: dist,
      multiplier: decayMultipliers[index] || 1.0
    })).sort((a, b) => a.distance - b.distance)

    // 在第一个衰减距离前，无衰减
    if (distance <= sortedPairs[0].distance) {
      return 1.0
    }

    // 找到对应的衰减倍率
    for (let i = 0; i < sortedPairs.length; i++) {
      if (distance <= sortedPairs[i].distance) {
        return sortedPairs[i].multiplier
      }
    }

    // 超过所有衰减距离，使用最后一个衰减倍率
    return sortedPairs[sortedPairs.length - 1].multiplier
  }

  /**
   * 计算距离衰减倍率 - 兼容旧版本
   * @param {object} weapon - 武器数据
   * @param {number} distance - 距离
   * @returns {number} 衰减倍率
   */
  calculateDistanceMultiplier(weapon, distance) {
    return this.calculateWeaponDecay(distance, weapon)
  }

  /**
   * 计算射击间隔 - 严格按照Python代码逻辑
   * @param {object} weapon - 武器数据
   * @param {number} fireMode - 射击模式
   * @param {number} triggerDelay - 扳机延迟
   * @returns {number} 射击间隔(毫秒)
   */
  calculateShootingInterval(weapon, fireMode, triggerDelay) {
    let baseInterval = weapon.shootingInterval || 0
    
    if (fireMode === 2) { // 连发模式
      if (weapon.fireRate && weapon.fireRate > 0) {
        baseInterval = 60000 / weapon.fireRate
      } else {
        // 如果射速为0，使用默认值600
        baseInterval = 60000 / 600
      }
    }
    
    return baseInterval + triggerDelay
  }

  /**
   * 获取局内维修包效率 - 正确处理两种数据格式
   * @param {object} armor - 护甲数据
   * @param {string} repairType - 维修包类型
   * @returns {number} 维修效率
   */
  getInsideRepairEfficiency(armor, repairType) {
    if (!armor || !armor.repairEfficiencies) {
      return null
    }

    const efficiencies = armor.repairEfficiencies
    const keys = Object.keys(efficiencies)
    
    // 判断数据格式类型
    const isOldFormat = keys.some(key => ['3', '6', '8', '9'].includes(key))
    
    if (isOldFormat) {
      // 旧格式：使用固定键名映射
      const repairTypeToKey = {
        'self_made': '3',    // 自制维修包
        'standard': '6',     // 标准维修包  
        'precision': '8',    // 精密维修包
        'advanced': '9'      // 高级维修组合
      }
      
      const key = repairTypeToKey[repairType]
      if (!key || !efficiencies[key]) return null
      
      const efficiency = parseFloat(efficiencies[key])
      return isNaN(efficiency) ? null : efficiency
      
    } else {
      // 新格式：键名本身就是效率值
      // 按照Python代码顺序：[自制, 标准, 精密, 高级维修组合]
      const sortedKeys = keys.sort((a, b) => parseFloat(a) - parseFloat(b))
      
      const repairTypeToIndex = {
        'self_made': 0,   // 自制维修包（效率最小）
        'standard': 1,    // 标准维修包（效率第二小）
        'precision': 2,   // 精密维修包（效率第三小）
        'advanced': 3     // 高级维修组合（效率最大）
      }
      
      const index = repairTypeToIndex[repairType]
      if (index === undefined || index >= sortedKeys.length) return null
      
      const key = sortedKeys[index]
      const efficiency = parseFloat(key) // 键名本身就是效率值
      return isNaN(efficiency) ? null : efficiency
    }
  }

  /**
   * 获取维修包名称
   * @param {string} repairType - 维修包类型
   * @returns {string} 维修包名称
   */
  getRepairTypeName(repairType) {
    const typeNames = {
      'self_made': '自制维修包',
      'standard': '标准维修包',
      'precision': '精密维修包',
      'advanced': '高级维修组合'
    }
    return typeNames[repairType] || repairType
  }

  /**
   * 获取维修包效率 (兼容旧版本)
   * @param {object} armor - 护甲数据
   * @param {string} repairType - 维修包类型
   * @returns {number} 维修效率
   */
  getRepairEfficiency(armor, repairType) {
    if (!armor || !armor.repairEfficiencies) {
      return null
    }

    // 维修包类型映射到维修效率值 (根据游戏实际数据)
    const repairTypeToEfficiency = {
      'blue': 8.8,   // 蓝修包效率
      'purple': 8.8, // 紫修包效率  
      'gold': 10.9,  // 金修包效率
      'red': 13.0    // 红修包效率
    }

    const targetEfficiency = repairTypeToEfficiency[repairType]
    if (!targetEfficiency) return null

    // 在护甲的维修效率数据中查找匹配的效率值
    const efficiencies = armor.repairEfficiencies
    
    // 遍历所有效率值，找到匹配的
    for (const [key, value] of Object.entries(efficiencies)) {
      if (Math.abs(parseFloat(value) - targetEfficiency) < 0.1) {
        return parseFloat(value)
      }
    }

    // 如果没找到精确匹配，返回默认效率
    return targetEfficiency
  }

  /**
   * 过滤装备数据 - 按照繁星攻略组Python逻辑
   * @param {object} equipmentData - 装备价格数据
   * @param {object} armorsData - 护甲数据
   * @param {number} maxPrice - 最大价格
   * @param {boolean} filterOverpriced - 是否过滤高价物品
   * @param {number} targetReadiness - 目标战备值
   * @returns {object} 过滤后的装备数据
   */
  filterEquipmentByPrice(equipmentData, armorsData, maxPrice, filterOverpriced, targetReadiness = Infinity) {
    const filtered = {}
    
    // 处理护甲数据
    if (armorsData?.armors?.body_armor) {
      filtered['护甲'] = armorsData.armors.body_armor.map(armor => {
        const equipment = this.findEquipmentByName(equipmentData?.equipment, armor.name);
        return {
          ...armor,
          readinessValue: equipment?.readinessValue || 0,
          marketPrice: equipment?.marketPrice || 0,
          quality: equipment?.quality || 1,
          level: armor.protectionLevel || 1,
          type: armor.type || '半甲',
          initialMax: armor.initialMax || 30,
          durability: armor.initialMax || 30,
          repairLoss: (armor.repairLoss || 0.1) * 100,
          efficiencies: [
            armor.repairEfficiencies?.['3'] || 0,
            armor.repairEfficiencies?.['6'] || 0,
            armor.repairEfficiencies?.['8'] || 0,
            armor.repairEfficiencies?.['9'] || 0
          ]
        };
      }).filter(item => {
        // Python逻辑：过滤市场价格为0的物品
        if (item.marketPrice === 0) return false
        // Python逻辑：过滤超过最大价格的物品
        if (item.marketPrice > maxPrice) return false
        // Python逻辑：过滤高价物品（市场价值≥战备价值+2000）
        if (filterOverpriced && item.marketPrice >= item.readinessValue + 2000) return false
        // Python逻辑：过滤市场价值≥目标战备值的物品
        if (item.marketPrice >= targetReadiness) return false
        return true
      });
    }
    
    // 处理头盔数据
    if (armorsData?.armors?.helmets) {
      filtered['头盔'] = armorsData.armors.helmets.map(helmet => {
        const equipment = this.findEquipmentByName(equipmentData?.equipment, helmet.name);
        return {
          ...helmet,
          readinessValue: equipment?.readinessValue || 0,
          marketPrice: equipment?.marketPrice || 0,
          quality: equipment?.quality || 1,
          level: helmet.protectionLevel || 1,
          type: helmet.type || '有',
          initialMax: helmet.initialMax || 25,
          durability: helmet.initialMax || 25,
          repairLoss: (helmet.repairLoss || 0.08) * 100,
          efficiencies: [
            helmet.repairEfficiencies?.['3'] || 0,
            helmet.repairEfficiencies?.['6'] || 0,
            helmet.repairEfficiencies?.['8'] || 0,
            helmet.repairEfficiencies?.['9'] || 0
          ]
        };
      }).filter(item => {
        if (item.marketPrice > maxPrice) return false
        if (filterOverpriced && item.marketPrice >= item.readinessValue + 2000) return false
        return true
      });
    }
    
    // 处理胸挂数据
    if (equipmentData?.equipment?.chest_rigs) {
      filtered['胸挂'] = equipmentData.equipment.chest_rigs.map(chest => {
        return {
          name: chest.name,
          readinessValue: chest.readinessValue || 0,
          marketPrice: chest.marketPrice || 0,
          quality: chest.quality || 1,
          level: chest.quality || 1,
          type: '胸挂',
          initialMax: 100,
          durability: 100,
          repairLoss: 0,
          efficiencies: [0, 0, 0, 0]
        };
      }).filter(item => {
        if (item.marketPrice > maxPrice) return false
        if (filterOverpriced && item.marketPrice >= item.readinessValue + 2000) return false
        return true
      });
    }
    
    // 处理背包数据
    if (equipmentData?.equipment?.backpacks) {
      filtered['背包'] = equipmentData.equipment.backpacks.map(backpack => {
        return {
          name: backpack.name,
          readinessValue: backpack.readinessValue || 0,
          marketPrice: backpack.marketPrice || 0,
          quality: backpack.quality || 1,
          level: backpack.quality || 1,
          type: '背包',
          initialMax: 100,
          durability: 100,
          repairLoss: 0,
          efficiencies: [0, 0, 0, 0]
        };
      }).filter(item => {
        if (item.marketPrice > maxPrice) return false
        if (filterOverpriced && item.marketPrice >= item.readinessValue + 2000) return false
        return true
      });
    }
    
    return filtered
  }

  /**
   * 过滤武器数据 - 按照繁星攻略组Python逻辑
   * @param {object} weaponsData - 武器数据
   * @param {number} maxPrice - 最大价格
   * @param {boolean} filterOverpriced - 是否过滤高价物品
   * @param {number} targetReadiness - 目标战备值
   * @returns {object} 过滤后的武器数据
   */
  filterWeaponsByPrice(weaponsData, maxPrice, filterOverpriced, targetReadiness = Infinity) {
    const filtered = {}
    
    for (const [category, weapons] of Object.entries(weaponsData || {})) {
      filtered[category] = weapons.map(weapon => ({
        ...weapon,
        head_multiplier: weapon.headMultiplier || 1.0,
        chest_multiplier: weapon.chestMultiplier || 1.0,
        abdomen_multiplier: weapon.abdomenMultiplier || 1.0,
        upper_arm_multiplier: weapon.upperArmMultiplier || 1.0,
        lower_arm_multiplier: weapon.lowerArmMultiplier || 1.0,
        thigh_multiplier: weapon.thighMultiplier || 1.0,
        calf_multiplier: weapon.calfMultiplier || 1.0,
        decayDistances: weapon.decayDistances || weapon.decay_distances || [],
        decayMultipliers: weapon.decayMultipliers || weapon.decay_factors || []
      })).filter(weapon => {
        // Python逻辑：过滤市场价格为0的武器
        if (weapon.marketPrice === 0) return false
        // Python逻辑：过滤超过最大价格的武器
        if (weapon.marketPrice > maxPrice) return false
        // Python逻辑：过滤高价武器（市场价值≥战备价值+2000）
        if (filterOverpriced && weapon.marketPrice >= weapon.readinessValue + 2000) return false
        // Python逻辑：过滤市场价值≥目标战备值的武器
        if (weapon.marketPrice >= targetReadiness) return false
        return true
      })
    }
    
    return filtered
  }

  /**
   * 生成装备组合 - 严格按照Python代码逻辑实现
   * @param {number} targetReadiness - 目标战备值
   * @param {object} equipment - 装备数据
   * @param {object} weapons - 武器数据
   * @param {object} specifiedChest - 指定胸挂
   * @param {object} specifiedBackpack - 指定背包
   * @returns {Array} 装备组合列表
   */
  generateEquipmentCombinations(targetReadiness, equipment, weapons, specifiedChest, specifiedBackpack) {
    const combinations = []
    
    // 准备槽位数据（包括空选项）
    const noneOption = { name: "无", marketPrice: 0, readinessValue: 0 }
    
    // 更新槽位：移除武器槽2
    const slots = {
      weapon1: [noneOption],  // 主武器槽
      pistol: [noneOption],   // 手枪槽
      helmet: [noneOption],   // 头盔槽
      armor: [noneOption],    // 护甲槽
      chest: [noneOption],    // 弹挂槽
      backpack: [noneOption]  // 背包槽
    }
    
    // 填充武器槽（非手枪武器）
    for (const category of Object.keys(weapons)) {
      if (category !== "手枪") {
        for (const weapon of weapons[category]) {
          slots.weapon1.push(weapon)
        }
      }
    }
    
    // 填充手枪槽
    if (weapons["手枪"]) {
      slots.pistol.push(...weapons["手枪"])
    }
    
    // 填充装备槽
    if (equipment["头盔"]) slots.helmet.push(...equipment["头盔"])
    if (equipment["护甲"]) slots.armor.push(...equipment["护甲"])
    
    // 特殊处理：用户指定装备
    if (specifiedChest) {
      slots.chest = [specifiedChest]  // 只使用指定的胸挂
    } else if (equipment["胸挂"]) {
      slots.chest.push(...equipment["胸挂"])
    }
    
    if (specifiedBackpack) {
      slots.backpack = [specifiedBackpack]  // 只使用指定的背包
    } else if (equipment["背包"]) {
      slots.backpack.push(...equipment["背包"])
    }
    
    // 生成所有组合
    let counter = 0  // 用于生成唯一标识符
    
    for (const w1 of slots.weapon1) {
      for (const pistol of slots.pistol) {
        for (const helmet of slots.helmet) {
          for (const armor of slots.armor) {
            for (const chest of slots.chest) {
              for (const backpack of slots.backpack) {
                const totalValue = (
                  w1.readinessValue +
                  pistol.readinessValue +
                  helmet.readinessValue +
                  armor.readinessValue +
                  chest.readinessValue +
                  backpack.readinessValue
                )
                
                if (totalValue >= targetReadiness) {
                  const totalCost = (
                    w1.marketPrice +
                    pistol.marketPrice +
                    helmet.marketPrice +
                    armor.marketPrice +
                    chest.marketPrice +
                    backpack.marketPrice
                  )
                  
                  counter++
                  const combination = {
                    id: counter,
                    totalCost,
                    totalReadiness: totalValue,
                    equipment: {
                      weapon1: w1,
                      pistol,
                      helmet,
                      armor,
                      chest,
                      backpack
                    }
                  }
                  
                  combinations.push(combination)
                }
              }
            }
          }
        }
      }
    }
    
    return combinations
  }

  /**
   * 根据名称查找装备数据
   */
  findEquipmentByName(equipmentData, name) {
    if (!equipmentData) return null;
    
    // 在所有装备类别中搜索
    for (const category in equipmentData) {
      const item = equipmentData[category].find(item => 
        item.name.includes(name) || name.includes(item.name.split('（')[0])
      );
      if (item) return item;
    }
    
    return null;
  }

  /**
   * 格式化数字显示
   * @param {number} value - 数值
   * @param {number} decimals - 小数位数
   * @returns {string} 格式化后的字符串
   */
  formatNumber(value, decimals = 2) {
    if (typeof value !== 'number' || isNaN(value)) return '0'
    return value.toFixed(decimals)
  }

  /**
   * 格式化价格显示
   * @param {number} price - 价格
   * @returns {string} 格式化后的价格
   */
  formatPrice(price) {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(2)}M`
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(1)}K`
    }
    return price.toString()
  }
}

export default Calculate