import utils from '../../utils/utils.js'
import Code from '../../components/Code.js'
import DataManager from '../../utils/Data.js'

export class Price extends plugin {
  constructor(e) {
    super({
      name: '三角洲价格查询',
      dsc: '查询物品价格、利润排行等信息',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^(#三角洲|\\^)(价格历史|历史价格)\\s+(.+)$',
          fnc: 'getPriceHistory'
        },
        {
          reg: '^(#三角洲|\\^)(当前价格|最新价格|价格)\\s+(.+)$',
          fnc: 'getCurrentPrice'
        },
        {
          reg: '^(#三角洲|\\^)(材料价格|制造材料)\\s*(.*)$',
          fnc: 'getMaterialPrice'
        },
        {
          reg: '^(#三角洲|\\^)(利润历史|历史利润)\\s+(.+)$',
          fnc: 'getProfitHistory'
        },
        {
          reg: '^(#三角洲|\\^)(利润排行|利润榜)\\s*(.*)$',
          fnc: 'getProfitRank'
        },
        {
          reg: '^(#三角洲|\\^)(最高利润|利润排行v2|利润榜v2)\\s*(.*)$',
          fnc: 'getProfitRankV2'
        },
        {
          reg: '^(#三角洲|\\^)(特勤处利润|特勤利润)\\s*(.*)$',
          fnc: 'getSpecialOpsProfit'
        }
      ]
    })
    this.e = e
    this.api = new Code(e)
  }

  /**
   * 分批发送转发消息（每批最多200条）
   * @param {Array} messages - 消息数组
   * @param {number} batchSize - 每批消息数量，默认200
   * @returns {Promise<boolean>}
   */
  async sendForwardMsgInBatches(messages, batchSize = 200) {
    if (!messages || messages.length === 0) {
      await this.e.reply('没有消息需要发送');
      return false;
    }

    try {
      // 如果消息数量不超过限制，直接发送
      if (messages.length <= batchSize) {
        await this.e.reply(await Bot.makeForwardMsg(messages));
        return true;
      }

      // 分批发送
      const totalBatches = Math.ceil(messages.length / batchSize);
      
      for (let i = 0; i < totalBatches; i++) {
        const start = i * batchSize;
        const end = Math.min(start + batchSize, messages.length);
        const batch = messages.slice(start, end);
        
        await this.e.reply(await Bot.makeForwardMsg(batch));
        
        // 批次之间添加短暂延迟，避免发送过快
        if (i < totalBatches - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      return true;
    } catch (error) {
      logger.error('[Price] 分批发送转发消息失败:', error);
      await this.e.reply('发送消息时发生错误，请稍后重试。');
      return false;
    }
  }

  /**
   * 通用方法：将物品名称或ID查询转换为物品ID列表和名称映射
   * @param {string} query - 查询字符串，支持ID、名称、逗号分隔的混合查询
   * @param {number} maxResults - 最大返回结果数，默认5
   * @returns {Promise<{objectIds: string[], idToNameMap: Map<string, string>}>}
   */
  async parseItemQuery(query, maxResults = 5) {
    let objectIds = [];
    let items = [];

    // 检查是否包含逗号分隔的多个查询
    const queries = query.split(/[,，]/).map(q => q.trim()).filter(Boolean);
    
    if (queries.length > 1) {
      // 多个查询项：分别处理每个查询
      for (const singleQuery of queries) {
        if (/^\d+$/.test(singleQuery)) {
          // 纯数字，当作ID处理
          objectIds.push(singleQuery);
          const searchRes = await this.api.searchObject('', singleQuery);
          if (searchRes?.data?.keywords?.length > 0) {
            items.push(...searchRes.data.keywords);
          } else {
            // 如果搜索失败，创建默认项
            items.push({
              objectID: singleQuery,
              objectName: `物品ID: ${singleQuery}`
            });
          }
        } else {
          // 名称查询
          const searchRes = await this.api.searchObject(singleQuery, '');
          if (searchRes?.data?.keywords?.length > 0) {
            // 对于名称查询，只取第一个最匹配的结果
            const firstMatch = searchRes.data.keywords[0];
            objectIds.push(String(firstMatch.objectID));
            items.push(firstMatch);
          }
        }
      }
    } else {
      // 单个查询项
      const singleQuery = queries[0];
      
      if (/^\d+$/.test(singleQuery)) {
        // 纯数字ID
        objectIds = [singleQuery];
        const searchRes = await this.api.searchObject('', singleQuery);
        if (searchRes?.data?.keywords?.length > 0) {
          items = searchRes.data.keywords;
        } else {
          items = [{
            objectID: singleQuery,
            objectName: `物品ID: ${singleQuery}`
          }];
        }
      } else {
        // 名称模糊搜索
        const searchRes = await this.api.searchObject(singleQuery, '');
        if (searchRes?.data?.keywords?.length > 0) {
          // 取前maxResults个结果
          const selectedItems = searchRes.data.keywords.slice(0, maxResults);
          objectIds = selectedItems.map(item => String(item.objectID));
          items = selectedItems;
        }
      }
    }

    // 创建ID到名称的映射
    const idToNameMap = new Map();
    items.forEach(item => {
      if (item.objectID && item.objectName) {
        idToNameMap.set(String(item.objectID), item.objectName);
      }
    });

    return { objectIds, idToNameMap };
  }

  /**
   * 按天分组价格数据
   * @param {Array} history - 历史价格数据数组
   * @returns {Object} - 按日期分组的数据对象
   */
  groupPriceDataByDay(history) {
    const grouped = {};
    
    history.forEach(item => {
      const date = new Date(item.timestamp);
      const dateKey = date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(item);
    });
    
    return grouped;
  }

  /**
   * 计算单日价格统计数据
   * @param {Array} dayData - 单日价格数据
   * @returns {Object} - 统计数据对象
   */
  calculateDayStats(dayData) {
    if (!dayData || dayData.length === 0) return {};
    
    const prices = dayData.map(item => parseFloat(item.avgPrice)).filter(price => !isNaN(price));
    if (prices.length === 0) return {};
    
    const open = prices[prices.length - 1]; // 最早的价格（开盘）
    const close = prices[0]; // 最新的价格（收盘）
    const high = Math.max(...prices);
    const low = Math.min(...prices);
    const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const range = high - low;
    
    return {
      open: Math.round(open),
      close: Math.round(close),
      high: Math.round(high),
      low: Math.round(low),
      avg: Math.round(avg),
      range: Math.round(range)
    };
  }

  /**
   * 获取物品历史价格
   * 命令: #三角洲价格历史 物品名称/ID
   * 支持多物品: #三角洲价格历史 低级燃料,燃料电池
   */
  async getPriceHistory() {
    const match = this.e.msg.match(this.rule[0].reg);
    const query = match[3].trim();
    
    if (!query) {
      await this.e.reply('请输入要查询的物品名称或ID\n示例: #三角洲价格历史 M4A1突击步枪\n支持多物品: #三角洲价格历史 低级燃料,燃料电池');
      return true;
    }

    await this.e.reply('正在查询物品历史价格，请稍候...');

    try {
      // 使用通用方法解析查询
      const { objectIds, idToNameMap } = await this.parseItemQuery(query, 3);
      
      if (objectIds.length === 0) {
        await this.e.reply(`未找到相关物品，请检查物品名称。`);
        return true;
      }

      // 构建转发消息
      const userInfo = {
        user_id: this.e.user_id,
        nickname: this.e.sender.nickname
      };

      let forwardMsg = [];
      
      // 标题
      const titleText = objectIds.length > 1 ? `物品历史价格查询 (${objectIds.length}个物品)` : 
                       `${idToNameMap.get(objectIds[0]) || `物品ID: ${objectIds[0]}`} - 历史价格`;
      forwardMsg.push({
        ...userInfo,
        message: `【${titleText}】`
      });

      // 查询每个物品的历史价格
      for (const objectId of objectIds) {
        const objectName = idToNameMap.get(objectId) || `物品ID: ${objectId}`;
        
        try {
          // 调用历史价格API (使用v2接口，支持半小时精度)
          const res = await this.api.getPriceHistoryV2(objectId);
          
          if (await utils.handleApiError(res, this.e, false)) {
            forwardMsg.push({
              ...userInfo,
              message: `${objectName}: 获取数据失败`
            });
            continue;
          }

          if (!res.data || !res.data.history) {
            forwardMsg.push({
              ...userInfo,
              message: `${objectName}: 暂无历史价格数据`
            });
            continue;
          }

          const { history, stats } = res.data;

                      // 价格趋势统计
            if (stats && history.length > 0) {
              let statsMsg = `--- ${objectName} ---\n`;
              statsMsg += `数据期间: 7天 (每半小时记录)\n`;
              statsMsg += `数据点数: ${history.length}个\n`;
              statsMsg += `当前价格: ${stats.latestPrice?.toLocaleString()}\n`;
              statsMsg += `平均价格: ${stats.avgPrice?.toLocaleString()}\n`;
              statsMsg += `最高价格: ${stats.maxPrice?.toLocaleString()}\n`;
              statsMsg += `最低价格: ${stats.minPrice?.toLocaleString()}\n`;
              statsMsg += `价格波动: ${stats.priceRange?.toLocaleString()}`;

              forwardMsg.push({
                ...userInfo,
                message: statsMsg
              });

              // 按天分组显示历史价格数据
              const groupedByDay = this.groupPriceDataByDay(history);
              
              Object.keys(groupedByDay).forEach((date, dayIndex) => {
                const dayData = groupedByDay[date];
                const dayStats = this.calculateDayStats(dayData);
                
                let dayMsg = `--- ${date} (${dayData.length}条记录) ---\n`;
                dayMsg += `开盘: ${dayStats.open?.toLocaleString()} | 收盘: ${dayStats.close?.toLocaleString()}\n`;
                dayMsg += `最高: ${dayStats.high?.toLocaleString()} | 最低: ${dayStats.low?.toLocaleString()}\n`;
                dayMsg += `平均: ${dayStats.avg?.toLocaleString()} | 波动: ${dayStats.range?.toLocaleString()}\n\n`;
                
                // 显示当天的详细数据（每4小时显示一次，减少数据量）
                const sampledData = dayData.filter((_, index) => index % 8 === 0 || index === dayData.length - 1);
                sampledData.forEach(item => {
                  const time = new Date(item.timestamp).toLocaleTimeString('zh-CN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  });
                  const price = parseFloat(item.avgPrice).toLocaleString();
                  dayMsg += `${time}: ${price}\n`;
                });

                forwardMsg.push({
                  ...userInfo,
                  message: dayMsg.trim()
                });
              });
              
              // 添加完整数据说明
              forwardMsg.push({
                ...userInfo,
                message: `--- 数据说明 ---\n完整数据包含7天内每半小时的价格记录\n以上显示为按天汇总，每天采样显示部分数据点\n如需查看完整数据，请访问游戏内交易所`
              });
            }
        } catch (error) {
          logger.error(`[Price] 查询物品 ${objectId} 历史价格失败:`, error);
          forwardMsg.push({
            ...userInfo,
            message: `${objectName}: 查询过程中发生错误`
          });
        }
      }

      return await this.sendForwardMsgInBatches(forwardMsg);

    } catch (error) {
      logger.error(`[Price] 查询历史价格失败: ${error.message}`);
      logger.error(`[Price] 错误堆栈:`, error.stack);
      await this.e.reply('查询历史价格时发生错误，请稍后重试。');
      return true;
    }
  }

  /**
   * 获取物品当前价格
   * 命令: #三角洲当前价格 物品名称/ID
   */
  async getCurrentPrice() {
    const match = this.e.msg.match(this.rule[1].reg);
    const query = match[3].trim();
    
    if (!query) {
      await this.e.reply('请输入要查询的物品名称或ID\n示例: #三角洲当前价格 M4A1突击步枪\n支持多物品: #三角洲当前价格 低级燃料,燃料电池');
      return true;
    }

    await this.e.reply('正在查询物品当前价格，请稍候...');

    try {
      // 使用通用方法解析查询
      const { objectIds, idToNameMap } = await this.parseItemQuery(query, 5);
      
      if (objectIds.length === 0) {
        await this.e.reply(`未找到相关物品，请检查物品名称。`);
        return true;
      }

      // 调用当前价格API
      const res = await this.api.getCurrentPrice(objectIds);
      
      if (await utils.handleApiError(res, this.e)) return true;

      if (!res.data || res.data.length === 0) {
        await this.e.reply('未获取到价格数据。');
        return true;
      }

      // 构建回复消息
      const prices = res.data.prices || res.data;
      
      if (prices.length === 1) {
        // 单个物品直接回复
        const item = prices[0];
        const price = parseFloat(item.avgPrice).toLocaleString();
        const itemName = idToNameMap.get(String(item.objectID)) || `物品ID: ${item.objectID}`;
        
        let msg = `【${itemName}】\n`;
        msg += `当前均价: ${price}`;
        
        await this.e.reply(msg);
      } else {
        // 多个物品使用转发消息
        const userInfo = {
          user_id: this.e.user_id,
          nickname: this.e.sender.nickname
        };

        let forwardMsg = [];
        forwardMsg.push({
          ...userInfo,
          message: '【物品当前价格查询结果】'
        });

        prices.forEach((item) => {
          const price = parseFloat(item.avgPrice).toLocaleString();
          const itemName = idToNameMap.get(String(item.objectID)) || `物品ID: ${item.objectID}`;
          
          let msg = `--- ${itemName} ---\n`;
          msg += `当前均价: ${price}`;
          
          forwardMsg.push({
            ...userInfo,
            message: msg
          });
        });

        return await this.sendForwardMsgInBatches(forwardMsg);
      }

    } catch (error) {
      logger.error(`[Price] 查询当前价格失败: ${error.message}`);
      logger.error(`[Price] 错误堆栈:`, error.stack);
      await this.e.reply('查询当前价格时发生错误，请稍后重试。');
      return true;
    }
  }

  /**
   * 获取制造材料价格
   * 命令: #三角洲材料价格 [物品名称/ID]
   * 支持多物品: #三角洲材料价格 低级燃料,燃料电池
   */
  async getMaterialPrice() {
    const match = this.e.msg.match(this.rule[2].reg);
    const query = match[3] ? match[3].trim() : '';

    await this.e.reply('正在查询制造材料价格，请稍候...');

    try {
      let objectIds = [];
      let idToNameMap = new Map();
      
      if (query) {
        // 使用通用方法解析查询
        const result = await this.parseItemQuery(query, 5);
        objectIds = result.objectIds;
        idToNameMap = result.idToNameMap;
        
        if (objectIds.length === 0) {
          await this.e.reply(`未找到相关物品，请检查物品名称。`);
          return true;
        }
      }

      // 构建转发消息
      const userInfo = {
        user_id: this.e.user_id,
        nickname: this.e.sender.nickname
      };

      let forwardMsg = [];

      if (objectIds.length > 0) {
        // 查询指定物品的材料价格
        for (const objectId of objectIds) {
          const objectName = idToNameMap.get(objectId) || `物品ID: ${objectId}`;
          
          try {
            const res = await this.api.getMaterialPrice(objectId);
            
            if (await utils.handleApiError(res, this.e, false)) {
              forwardMsg.push({
                ...userInfo,
                message: `${objectName}: 获取材料价格失败`
              });
              continue;
            }

            if (!res.data || !res.data.materials || res.data.materials.length === 0) {
              forwardMsg.push({
                ...userInfo,
                message: `${objectName}: 暂无材料价格数据`
              });
              continue;
            }

            const materials = res.data.materials;
            
            forwardMsg.push({
              ...userInfo,
              message: `【${objectName} 制造材料价格】(共${materials.length}种)`
            });

            // 分批显示材料，每个消息显示8种材料
            const batchSize = 8;
            for (let i = 0; i < materials.length; i += batchSize) {
              const batch = materials.slice(i, i + batchSize);
              let msg = `--- ${objectName} 材料 ${i + 1}-${Math.min(i + batchSize, materials.length)} ---\n`;
              
              batch.forEach(material => {
                const price = parseFloat(material.minPrice).toLocaleString();
                const time = new Date(material.minPriceTime).toLocaleString();
                const usedCount = material.usedBy ? material.usedBy.length : 0;
                
                msg += `${material.objectName}:\n`;
                msg += `  最低价格: ${price}\n`;
                msg += `  用于制造: ${usedCount}种物品\n`;
                msg += `  最低价时间: ${time}\n\n`;
              });
              
              forwardMsg.push({
                ...userInfo,
                message: msg.trim()
              });
            }
          } catch (error) {
            logger.error(`[Price] 查询物品 ${objectId} 材料价格失败:`, error);
            forwardMsg.push({
              ...userInfo,
              message: `${objectName}: 查询过程中发生错误`
            });
          }
        }
      } else {
        // 查询所有材料价格
        const res = await this.api.getMaterialPrice();
        
        if (await utils.handleApiError(res, this.e)) return true;

        if (!res.data || !res.data.materials || res.data.materials.length === 0) {
          await this.e.reply('未获取到制造材料价格数据。');
          return true;
        }

        const materials = res.data.materials;
        
        forwardMsg.push({
          ...userInfo,
          message: `【制造材料最低价格】(共${materials.length}种)`
        });

        // 分批显示材料，每个消息显示10种材料
        const batchSize = 10;
        for (let i = 0; i < materials.length; i += batchSize) {
          const batch = materials.slice(i, i + batchSize);
          let msg = `--- 材料 ${i + 1}-${Math.min(i + batchSize, materials.length)} ---\n`;
          
          batch.forEach(material => {
            const price = parseFloat(material.minPrice).toLocaleString();
            const time = new Date(material.minPriceTime).toLocaleString();
            const usedCount = material.usedBy ? material.usedBy.length : 0;
            
            msg += `${material.objectName}:\n`;
            msg += `  最低价格: ${price}\n`;
            msg += `  用于制造: ${usedCount}种物品\n`;
            msg += `  最低价时间: ${time}\n\n`;
          });
          
          forwardMsg.push({
            ...userInfo,
            message: msg.trim()
          });
        }
      }

      return await this.sendForwardMsgInBatches(forwardMsg);

    } catch (error) {
      logger.error(`[Price] 查询材料价格失败: ${error.message}`);
      await this.e.reply('查询材料价格时发生错误，请稍后重试。');
      return true;
    }
  }

  /**
   * 获取利润历史
   * 命令: #三角洲利润历史 物品名称/ID/场所
   * 支持多物品: #三角洲利润历史 低级燃料,燃料电池
   */
  async getProfitHistory() {
    const match = this.e.msg.match(this.rule[3].reg);
    const query = match[3].trim();
    
    if (!query) {
      await this.e.reply('请输入要查询的物品名称、ID或制造场所\n示例: #三角洲利润历史 M4A1突击步枪\n支持多物品: #三角洲利润历史 低级燃料,燃料电池\n制造场所: #三角洲利润历史 tech');
      return true;
    }

    await this.e.reply('正在查询利润历史，请稍候...');

    try {
      let params = {};
      let queryByItems = false;
      
      // 判断查询类型
      if (['tech', 'workbench', 'pharmacy', 'armory', 'storage', 'control', 'shoot', 'training'].includes(query.toLowerCase())) {
        // 制造场所
        params.place = query.toLowerCase();
      } else if (/^\d+$/.test(query)) {
        // 纯数字当作物品ID
        params.objectId = query;
      } else if (query.includes(',') || query.includes('，')) {
        // 包含逗号，处理为多物品查询
        queryByItems = true;
      } else {
        // 物品名称模糊搜索
        params.objectName = query;
      }

      if (queryByItems) {
        // 多物品查询：使用通用方法解析
        const { objectIds, idToNameMap } = await this.parseItemQuery(query, 10);
        
        if (objectIds.length === 0) {
          await this.e.reply(`未找到相关物品，请检查物品名称。`);
          return true;
        }

        // 构建转发消息
        const userInfo = {
          user_id: this.e.user_id,
          nickname: this.e.sender.nickname
        };

        let forwardMsg = [];
        
        forwardMsg.push({
          ...userInfo,
          message: `【多物品利润历史查询 (${objectIds.length}个物品)】`
        });

        // 查询每个物品的利润历史
        for (const objectId of objectIds) {
          const objectName = idToNameMap.get(objectId) || `物品ID: ${objectId}`;
          
          try {
            const res = await this.api.getProfitHistory({ objectId });
            
            if (await utils.handleApiError(res, this.e, false)) {
              forwardMsg.push({
                ...userInfo,
                message: `${objectName}: 获取利润数据失败`
              });
              continue;
            }

            if (!res.data || !res.data.items || res.data.items.length === 0) {
              forwardMsg.push({
                ...userInfo,
                message: `${objectName}: 暂无利润历史数据`
              });
              continue;
            }

            // 显示该物品的利润数据 (只显示第一个结果，避免消息过长)
            const item = res.data.items[0];
            let msg = `--- ${objectName} ---\n`;
            msg += `制造场所: ${item.placeName} (Lv.${item.level})\n`;
            msg += `制造周期: ${item.period}小时\n`;
            msg += `每次产量: ${item.perCount}\n\n`;

            // 最新数据
            if (item.latestData) {
              const latest = item.latestData;
              const time = new Date(latest.timestamp).toLocaleString();
              msg += `【最新数据】\n`;
              msg += `时间: ${time}\n`;
              msg += `销售价: ${latest.salePrice?.toLocaleString()}\n`;
              msg += `成本价: ${latest.costPrice?.toLocaleString()}\n`;
              msg += `利润: ${latest.profit?.toLocaleString()}\n`;
              msg += `利润率: ${latest.profitRate?.toFixed(2)}%\n`;
              msg += `小时利润: ${latest.hourProfit?.toLocaleString()}\n`;
            }

            forwardMsg.push({
              ...userInfo,
              message: msg.trim()
            });
          } catch (error) {
            logger.error(`[Price] 查询物品 ${objectId} 利润历史失败:`, error);
            forwardMsg.push({
              ...userInfo,
              message: `${objectName}: 查询过程中发生错误`
            });
          }
        }

        return await this.sendForwardMsgInBatches(forwardMsg);
      }

      const res = await this.api.getProfitHistory(params);
      
      if (await utils.handleApiError(res, this.e)) return true;

      if (!res.data || !res.data.items || res.data.items.length === 0) {
        await this.e.reply('未获取到利润历史数据。');
        return true;
      }

      // 构建转发消息
      const userInfo = {
        user_id: this.e.user_id,
        nickname: this.e.sender.nickname
      };

      let forwardMsg = [];
      
      forwardMsg.push({
        ...userInfo,
        message: `【利润历史查询: ${query}】(共${res.data.totalCount}项)`
      });

      // 显示利润历史数据
      res.data.items.slice(0, 10).forEach((item, index) => {
        let msg = `--- ${item.objectName} ---\n`;
        msg += `物品ID: ${item.objectID}\n`;
        msg += `制造场所: ${item.placeName} (Lv.${item.level})\n`;
        msg += `制造周期: ${item.period}小时\n`;
        msg += `每次产量: ${item.perCount}\n\n`;

        // 最新数据
        if (item.latestData) {
          const latest = item.latestData;
          const time = new Date(latest.timestamp).toLocaleString();
          msg += `【最新数据】\n`;
          msg += `时间: ${time}\n`;
          msg += `销售价: ${latest.salePrice?.toLocaleString()}\n`;
          msg += `成本价: ${latest.costPrice?.toLocaleString()}\n`;
          msg += `利润: ${latest.profit?.toLocaleString()}\n`;
          msg += `利润率: ${latest.profitRate?.toFixed(2)}%\n`;
          msg += `小时利润: ${latest.hourProfit?.toLocaleString()}\n`;
          msg += `手续费: ${latest.fee?.toLocaleString()}\n`;
          msg += `保证金: ${latest.bail?.toLocaleString()}\n\n`;
        }

        // 统计数据
        if (item.stats) {
          const stats = item.stats;
          msg += `【历史统计】(${stats.count}条记录)\n`;
          msg += `平均利润: ${stats.avgProfit?.toLocaleString()}\n`;
          msg += `平均利润率: ${stats.avgProfitRate?.toFixed(2)}%\n`;
          msg += `最高利润: ${stats.maxProfit?.toLocaleString()}\n`;
          msg += `最低利润: ${stats.minProfit?.toLocaleString()}\n`;
          msg += `平均小时利润: ${stats.avgHourProfit?.toLocaleString()}\n`;
          msg += `最高小时利润: ${stats.maxHourProfit?.toLocaleString()}\n`;
          msg += `最低小时利润: ${stats.minHourProfit?.toLocaleString()}\n\n`;
        }

        // 制造材料
        if (item.required && item.required.length > 0) {
          msg += `【制造材料】\n`;
          item.required.forEach(material => {
            msg += `- 物品ID ${material.objectID}: ${material.count}个\n`;
          });
        }
        
        forwardMsg.push({
          ...userInfo,
          message: msg.trim()
        });
      });

      // 如果有历史价格数据，显示最近几条
      const firstItem = res.data.items[0];
      if (firstItem?.history && firstItem.history.length > 0) {
        let historyMsg = `【${firstItem.objectName} - 最近价格变化】\n`;
        firstItem.history.slice(-5).forEach((record, index) => {
          const time = new Date(record.timestamp).toLocaleString();
          historyMsg += `${time}\n`;
          historyMsg += `销售价: ${record.salePrice?.toLocaleString()} | 成本: ${record.costPrice?.toLocaleString()}\n`;
          historyMsg += `利润: ${record.profit?.toLocaleString()} | 时利润: ${record.hourProfit?.toLocaleString()}\n\n`;
        });
        
        forwardMsg.push({
          ...userInfo,
          message: historyMsg.trim()
        });
      }

      return await this.sendForwardMsgInBatches(forwardMsg);

    } catch (error) {
      logger.error(`[Price] 查询利润历史失败: ${error.message}`);
      await this.e.reply('查询利润历史时发生错误，请稍后重试。');
      return true;
    }
  }

  /**
   * 获取利润排行榜
   * 命令: #三角洲利润排行 [类型] [场所] [数量]
   */
  async getProfitRank() {
    const match = this.e.msg.match(this.rule[4].reg);
    const argString = match[3] ? match[3].trim() : '';
    const args = argString.split(/\s+/).filter(Boolean);

    let type = 'hour';  // 默认按小时利润排序
    let place = '';     // 场所过滤
    let limit = 10;     // 默认显示10条

    // 解析参数
    for (const arg of args) {
      if (['hour', 'total', 'hourprofit', 'totalprofit'].includes(arg.toLowerCase())) {
        type = arg.toLowerCase();
      } else if (['tech', 'workbench', 'pharmacy', 'armory', 'storage', 'control', 'shoot', 'training'].includes(arg.toLowerCase())) {
        place = arg.toLowerCase();
      } else if (!isNaN(parseInt(arg))) {
        const num = parseInt(arg);
        if (num > 0 && num <= 50) {
          limit = num;
        }
      }
    }

    await this.e.reply(`正在查询利润排行榜 (${type}${place ? `, 场所: ${place}` : ''}，显示前${limit}名)...`);

    try {
      // 准备API参数，只包含非空值
      const params = { type, limit };
      if (place) params.place = place;
      logger.info(`[Price] V1接口调用参数: ${JSON.stringify(params)}`);
      
      // 使用V1接口获取利润排行
      const res = await this.api.getProfitRankV1(params);
      
      if (await utils.handleApiError(res, this.e)) return true;

      // 更详细的数据验证
      if (!res.data) {
        await this.e.reply('API返回数据为空。');
        return true;
      }
      
      // V1接口现在也返回groups结构
      if (!res.data.groups && !res.data.items) {
        await this.e.reply(`API返回数据中没有groups或items字段。返回的data: ${JSON.stringify(res.data)}`);
        return true;
      }
      
      // 处理数据，支持新的groups结构和旧的items结构
      let allItems = [];
      if (res.data.groups) {
        // 新的groups结构
        for (const [groupName, items] of Object.entries(res.data.groups)) {
          if (!place || groupName === place) {
            allItems = allItems.concat(items);
          }
        }
      } else if (res.data.items) {
        // 旧的items结构
        allItems = res.data.items;
      }
      
      if (allItems.length === 0) {
        await this.e.reply(`当前查询条件下没有利润排行数据。\n查询参数: 类型=${type}, 场所=${place || '全部'}, 数量=${limit}`);
        return true;
      }

      // 构建转发消息
      const userInfo = {
        user_id: this.e.user_id,
        nickname: this.e.sender.nickname
      };

      let forwardMsg = [];
      
      const typeText = {
        hour: '小时利润',
        total: '总利润', 
        hourprofit: '小时利润',
        totalprofit: '总利润'
      }[type] || '利润';

      const placeText = res.data.place || place;
      const totalItems = res.data.total || allItems.length;

      forwardMsg.push({
        ...userInfo,
        message: `【${typeText}排行榜${placeText ? ` - ${placeText}` : ''}】\n总计${totalItems}项，显示前${allItems.length}名\n更新时间: ${res.data.currentTime ? new Date(res.data.currentTime).toLocaleString() : '未知'}`
      });

      // 排行榜数据 - 按指定类型排序
      if (type === 'hour' || type === 'hourprofit') {
        allItems.sort((a, b) => (b.hourProfit || 0) - (a.hourProfit || 0));
      } else {
        allItems.sort((a, b) => (b.profit || b.totalProfit || 0) - (a.profit || a.totalProfit || 0));
      }

      // 显示前limit名
      allItems.slice(0, limit).forEach((item, index) => {
        const rank = index + 1;
        const hourProfit = parseFloat(item.hourProfit || 0).toLocaleString();
        const totalProfit = parseFloat(item.profit || item.totalProfit || 0).toLocaleString();
        const timestamp = item.timestamp ? new Date(item.timestamp).toLocaleString() : '未知';
        
        let msg = `TOP ${rank}`;
        if (item.hourRank && item.totalRank) {
          msg += ` (时利润排名: ${item.hourRank}, 总利润排名: ${item.totalRank})`;
        }
        msg += `\n`;
        msg += `物品: ${item.objectName}\n`;
        msg += `物品ID: ${item.objectID}\n`;
        msg += `制造场所: ${item.placeName || item.placeType} (Lv.${item.level})\n`;
        msg += `小时利润: ${hourProfit}\n`;
        msg += `总利润: ${totalProfit}\n`;
        msg += `更新时间: ${timestamp}`;
        
        forwardMsg.push({
          ...userInfo,
          message: msg
        });
      });

      // 使用说明
      let helpMsg = '--- 使用说明 ---\n';
      helpMsg += '参数: [类型] [场所] [数量]\n';
      helpMsg += '类型: hour/total (小时/总利润)\n';
      helpMsg += '场所: tech/workbench/pharmacy等\n';
      helpMsg += '数量: 1-50 (默认10)\n\n';
      helpMsg += '示例:\n';
      helpMsg += '#三角洲利润排行 hour workbench 20\n';
      helpMsg += '#三角洲利润排行 total tech';
      
      forwardMsg.push({
        ...userInfo,
        message: helpMsg
      });

      return await this.sendForwardMsgInBatches(forwardMsg);

    } catch (error) {
      logger.error(`[Price] 查询利润排行失败: ${error.message}`);
      await this.e.reply('查询利润排行时发生错误，请稍后重试。');
      return true;
    }
  }

  /**
   * 获取利润排行榜 V2 (最高利润)
   * 命令: #三角洲最高利润 [类型] [场所] [物品ID]
   */
  async getProfitRankV2() {
    const match = this.e.msg.match(this.rule[5].reg);
    const argString = match[3] ? match[3].trim() : '';
    const args = argString.split(/\s+/).filter(Boolean);

    let type = 'hour';  // 默认按小时利润排序
    let place = '';     // 场所过滤
    let id = '';        // 物品ID过滤

    // 解析参数
    for (const arg of args) {
      if (['hour', 'total', 'hourprofit', 'totalprofit', 'profit'].includes(arg.toLowerCase())) {
        type = arg.toLowerCase();
      } else if (['tech', 'workbench', 'pharmacy', 'armory', 'storage', 'control', 'shoot', 'training'].includes(arg.toLowerCase())) {
        place = arg.toLowerCase();
      } else if (/^\d+$/.test(arg)) {
        id = arg;
      }
    }

    await this.e.reply(`正在查询最高利润排行榜 (${type}${place ? `, 场所: ${place}` : ''}${id ? `, 物品ID: ${id}` : ''})...`);

    try {
      // 准备API参数，只包含非空值
      const params = { type };
      if (place) params.place = place;
      if (id) params.id = id;
      logger.info(`[Price] V2接口调用参数: ${JSON.stringify(params)}`);
      
      // 使用V2接口获取最高利润排行
      const res = await this.api.getProfitRankV2(params);
      
      if (await utils.handleApiError(res, this.e)) return true;

      // 更详细的数据验证
      if (!res.data) {
        await this.e.reply('API返回数据为空。');
        return true;
      }
      
      if (!res.data.groups) {
        await this.e.reply(`API返回数据中没有groups字段。返回的data: ${JSON.stringify(res.data)}`);
        return true;
      }

      // 构建转发消息
      const userInfo = {
        user_id: this.e.user_id,
        nickname: this.e.sender.nickname
      };

      let forwardMsg = [];
      
      const typeText = {
        hour: '小时利润',
        total: '总利润', 
        hourprofit: '小时利润',
        totalprofit: '总利润',
        profit: '总利润'
      }[type] || '利润';

      const placeText = res.data.place || place || Object.keys(res.data.groups)[0];

      // 处理groups数据结构
      let allItems = [];
      for (const [groupName, items] of Object.entries(res.data.groups)) {
        if (!place || groupName === place) {
          allItems = allItems.concat(items);
        }
      }

      if (allItems.length === 0) {
        await this.e.reply('该场所暂无利润数据。');
        return true;
      }

      // 按今日数据排序
      if (type === 'hour' || type === 'hourprofit') {
        allItems.sort((a, b) => (b.today?.hourProfit || 0) - (a.today?.hourProfit || 0));
      } else {
        allItems.sort((a, b) => (b.today?.profit || 0) - (a.today?.profit || 0));
      }

      // 显示前15名（可以根据需要调整）
      const displayLimit = 15;
      const displayItems = allItems.slice(0, displayLimit);
      
      forwardMsg.push({
        ...userInfo,
        message: `【最高${typeText}排行榜 - ${placeText}】\n今日vs昨日对比 (显示前${displayItems.length}名)\n更新时间: ${res.data.currentTime ? new Date(res.data.currentTime).toLocaleString() : '未知'}`
      });

      displayItems.forEach((item, index) => {
        const rank = index + 1;
        const today = item.today || {};
        const yesterday = item.yesterday || {};
        
        let msg = `TOP ${rank} - ${item.objectName}\n`;
        msg += `物品ID: ${item.objectID}\n`;
        msg += `制造场所: ${item.placeName} (Lv.${item.level})\n\n`;

        // 今日数据
        msg += `【今日最佳】\n`;
        if (today.bestSalePrice) {
          const saleTime = new Date(today.bestSaleTime).toLocaleString();
          msg += `最高售价: ${today.bestSalePrice?.toLocaleString()} (${saleTime})\n`;
        }
        if (today.minCost) {
          const costTime = new Date(today.minCostTime).toLocaleString();
          msg += `最低成本: ${today.minCost?.toLocaleString()} (${costTime})\n`;
        }
        msg += `利润: ${today.profit?.toLocaleString()}\n`;
        msg += `小时利润: ${today.hourProfit?.toLocaleString()}\n`;
        msg += `利润排名: ${today.profitRank} | 时利润排名: ${today.hourProfitRank}\n\n`;

        // 昨日对比
        msg += `【昨日对比】\n`;
        const profitChange = (today.profit || 0) - (yesterday.profit || 0);
        const hourProfitChange = (today.hourProfit || 0) - (yesterday.hourProfit || 0);
        
        msg += `利润变化: ${profitChange >= 0 ? '+' : ''}${profitChange?.toLocaleString()}\n`;
        msg += `时利润变化: ${hourProfitChange >= 0 ? '+' : ''}${hourProfitChange?.toLocaleString()}\n`;
        msg += `昨日利润排名: ${yesterday.profitRank} | 时利润排名: ${yesterday.hourProfitRank}`;
        
        forwardMsg.push({
          ...userInfo,
          message: msg
        });
      });

      // 使用说明
      let helpMsg = '--- V2版本说明 ---\n';
      helpMsg += '显示今日vs昨日最高利润对比\n';
      helpMsg += '参数: [类型] [场所] [物品ID]\n';
      helpMsg += '类型: hour/total/profit\n';
      helpMsg += '场所: tech/workbench/pharmacy等\n';
      helpMsg += '物品ID: 可选的具体物品筛选\n\n';
      helpMsg += '示例:\n';
      helpMsg += '#三角洲最高利润 hour workbench\n';
      helpMsg += '#三角洲利润排行v2 total tech 12345';
      
      forwardMsg.push({
        ...userInfo,
        message: helpMsg
      });

      return await this.sendForwardMsgInBatches(forwardMsg);

    } catch (error) {
      logger.error(`[Price] 查询最高利润排行失败: ${error.message}`);
      await this.e.reply('查询最高利润排行时发生错误，请稍后重试。');
      return true;
    }
  }

  /**
   * 获取特勤处四个场所的利润排行
   * 命令: #三角洲特勤处利润 [类型]
   * 支持参数: hour/total (默认hour)
   */
  async getSpecialOpsProfit() {
    const match = this.e.msg.match(this.rule[6].reg);
    const argString = match[3] ? match[3].trim() : '';
    
    // 解析类型参数
    let type = 'hour';  // 默认按小时利润
    if (argString && ['hour', 'total', 'hourprofit', 'totalprofit', 'profit'].includes(argString.toLowerCase())) {
      type = argString.toLowerCase();
    }

    // 特勤处四个制造场所
    const places = [
      { key: 'tech', name: '技术中心' },
      { key: 'workbench', name: '工作台' },
      { key: 'pharmacy', name: '制药台' },
      { key: 'armory', name: '防具台' }
    ];

    const typeText = {
      hour: '小时利润',
      total: '总利润', 
      hourprofit: '小时利润',
      totalprofit: '总利润',
      profit: '总利润'
    }[type] || '利润';

    await this.e.reply(`正在查询特勤处四个场所的${typeText}排行，每个场所显示前3名...`);

    try {
      // 构建转发消息
      const userInfo = {
        user_id: this.e.user_id,
        nickname: this.e.sender.nickname
      };

      let forwardMsg = [];
      
      // 标题消息
      forwardMsg.push({
        ...userInfo,
        message: `【特勤处${typeText}总览】\n四个制造场所TOP3排行\n查询类型: ${type}`
      });

      // 并行查询四个场所的数据
      const promises = places.map(async (place) => {
        try {
          const params = { type, place: place.key };
          const res = await this.api.getProfitRankV2(params);
          
          if (res && res.data && res.data.groups && res.data.groups[place.key]) {
            const items = res.data.groups[place.key];
            
            // 按指定类型排序
            if (type === 'hour' || type === 'hourprofit') {
              items.sort((a, b) => (b.today?.hourProfit || 0) - (a.today?.hourProfit || 0));
            } else {
              items.sort((a, b) => (b.today?.profit || 0) - (a.today?.profit || 0));
            }
            
            return {
              place: place,
              items: items.slice(0, 3), // 只取前3名
              success: true,
              updateTime: res.data.currentTime
            };
          } else {
            return {
              place: place,
              items: [],
              success: false,
              error: '无数据'
            };
          }
        } catch (error) {
          logger.error(`[Price] 查询${place.name}利润失败:`, error);
          return {
            place: place,
            items: [],
            success: false,
            error: error.message
          };
        }
      });

      // 等待所有查询完成
      const results = await Promise.all(promises);
      
      // 为每个场所生成消息
      results.forEach((result) => {
        let msg = `🏭 ${result.place.name} (${result.place.key})\n`;
        
        if (!result.success) {
          msg += `❌ 查询失败: ${result.error}`;
          forwardMsg.push({
            ...userInfo,
            message: msg
          });
          return;
        }
        
        if (result.items.length === 0) {
          msg += `📊 暂无${typeText}数据`;
          forwardMsg.push({
            ...userInfo,
            message: msg
          });
          return;
        }
        
        msg += `📊 ${typeText}TOP3\n`;
        if (result.updateTime) {
          msg += `⏰ 更新: ${new Date(result.updateTime).toLocaleString()}\n`;
        }
        msg += `\n`;
        
        result.items.forEach((item, index) => {
          const rank = index + 1;
          const today = item.today || {};
          const rankEmoji = ['🥇', '🥈', '🥉'][index] || `${rank}.`;
          
          msg += `${rankEmoji} ${item.objectName}\n`;
          msg += `   ID: ${item.objectID} | Lv.${item.level}\n`;
          
          if (type === 'hour' || type === 'hourprofit') {
            msg += `   时利润: ${today.hourProfit?.toLocaleString() || '0'}\n`;
            msg += `   时排名: ${today.hourProfitRank || 'N/A'}\n`;
          } else {
            msg += `   总利润: ${today.profit?.toLocaleString() || '0'}\n`;
            msg += `   总排名: ${today.profitRank || 'N/A'}\n`;
          }
          
          if (index < result.items.length - 1) {
            msg += `\n`;
          }
        });
        
        forwardMsg.push({
          ...userInfo,
          message: msg
        });
      });
      
      // 汇总统计信息
      const totalItems = results.reduce((sum, result) => sum + (result.items?.length || 0), 0);
      const successCount = results.filter(r => r.success).length;
      
      let summaryMsg = `📈 汇总统计\n`;
      summaryMsg += `✅ 成功查询: ${successCount}/4 个场所\n`;
      summaryMsg += `📋 总计显示: ${totalItems} 个物品\n`;
      summaryMsg += `🔄 排序类型: ${typeText}\n\n`;
      summaryMsg += `💡 使用说明:\n`;
      summaryMsg += `• 支持参数: hour(小时利润) / total(总利润)\n`;
      summaryMsg += `• 示例: ^特勤处利润 hour\n`;
      summaryMsg += `• 示例: ^特勤利润 total`;
      
      forwardMsg.push({
        ...userInfo,
        message: summaryMsg
      });

      return await this.sendForwardMsgInBatches(forwardMsg);

    } catch (error) {
      logger.error(`[Price] 查询特勤处利润失败: ${error.message}`);
      await this.e.reply('查询特勤处利润时发生错误，请稍后重试。');
      return true;
    }
  }
} 