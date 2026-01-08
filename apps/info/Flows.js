import utils from '../../utils/utils.js'
import Code from '../../components/Code.js'
import Render from '../../components/Render.js'

const typeMap = { '设备': 1, '道具': 2, '货币': 3 }

export class Flows extends plugin {
    constructor (e) {
        super({
            name: '三角洲流水',
            dsc: '查询游戏内交易流水',
            event: 'message',
            priority: 100,
            rule: [
                {
                    reg: '^(#三角洲|\\^)(流水|flows)(?: (设备|道具|货币|all))?(?: (all|\\d+))?$',
                    fnc: 'getFlows'
                }
            ]
        })
        this.e = e  
        this.api = new Code(e)
    }

    async getFlows () {
        const token = await utils.getAccount(this.e.user_id)
        if (!token) {
            return await this.e.reply('您尚未绑定账号，请使用 #三角洲登录 进行绑定。')
        }

        const match = this.e.msg.match(this.rule[0].reg)
        const typeStr = match[3]
        const pageOrAll = match[4]
        const isAll = typeStr?.toLowerCase() === 'all' || pageOrAll?.toLowerCase() === 'all'
        const actualTypeStr = typeStr?.toLowerCase() === 'all' ? undefined : typeStr
        const page = pageOrAll && !isNaN(parseInt(pageOrAll, 10)) ? parseInt(pageOrAll, 10) : 1

        const decodeReason = (reason) => {
            try {
                return decodeURIComponent(reason || '') || '未知原因'
            } catch {
                return reason || '未知原因'
            }
        }

        const isApiError = (res) => {
            if (!res || typeof res !== 'object') return { error: true, msg: 'API未返回数据' }
            if (res.code === '1000' || res.code === '1001' || res.code === '1100' || res.success === false) {
                return { error: true, msg: res.msg || res.message || 'API错误' }
            }
            if (res.data?.ret === 101 || res.error?.includes('请先完成QQ或微信登录') || 
                res.sMsg?.includes('请先登录') || res.data?.ret === 99998 || res.message?.includes('先绑定大区')) {
                return { error: true, msg: res.message || res.sMsg || '需要登录或绑定大区' }
            }
            if (res.code !== undefined && res.code !== null && res.code !== 0 && res.code !== '0') {
                return { error: true, msg: res.msg || res.message || 'API错误' }
            }
            return { error: false }
        }

        const groupByColumns = (arr, itemsPerColumn, isAllPages = false) => {
            const columns = [[], [], [], [], []]
            arr.forEach((item, index) => {
                const columnIndex = index % 5
                if (isAllPages || columns[columnIndex].length < itemsPerColumn) {
                    columns[columnIndex].push(item)
                } else {
                    for (let i = 0; i < 5; i++) {
                        const col = columns[(columnIndex + i + 1) % 5]
                        if (col.length < itemsPerColumn) {
                            col.push(item)
                            break
                        }
                    }
                }
            })
            return columns.filter(col => col.length > 0)
        }

        const mergePagesData = (pagesData, typeValue) => {
            if (!pagesData?.length) return null
            const merged = { data: [{ LoginArr: [], itemArr: [], iMoneyArr: [] }] }
            const firstData = pagesData[0]?.data?.[0]
            if (typeValue === 1 && firstData?.vRoleName) {
                Object.assign(merged.data[0], { vRoleName: firstData.vRoleName, Level: firstData.Level, loginDay: firstData.loginDay })
            }
            pagesData.forEach(res => {
                const pageData = res?.data?.[0]
                if (!pageData) return
                const arrKey = typeValue === 1 ? 'LoginArr' : typeValue === 2 ? 'itemArr' : 'iMoneyArr'
                if (pageData[arrKey]) merged.data[0][arrKey].push(...pageData[arrKey])
            })
            return merged
        }

        const getAllPagesData = async (typeValue) => {
            const allPagesData = []
            let currentPage = 1
            while (true) {
                try {
                    const res = await this.api.getFlows(token, typeValue, currentPage)
                    const data = res?.data?.[0]
                    const arrKey = typeValue === 1 ? 'LoginArr' : typeValue === 2 ? 'itemArr' : 'iMoneyArr'
                    if (isApiError(res).error || !data?.[arrKey]?.length) break
                    allPagesData.push(res)
                    currentPage++
                } catch (error) {
                    logger.error(`[流水] 获取第 ${currentPage} 页数据失败:`, error)
                    break
                }
            }
            return allPagesData
        }

        const prepareTemplateData = (res, typeValue, page, typeName, isAllPages = false) => {
            const data = res?.data?.[0]
            const templateData = { typeName, typeValue, page: isAllPages ? `全部` : page }

            switch (typeValue) {
                case 1:
                    if (data?.LoginArr) {
                        templateData.playerInfo = {
                            vRoleName: data.vRoleName || '未知',
                            Level: data.Level || '未知',
                            loginDay: data.loginDay || '未知'
                        }
                        const loginRecords = data.LoginArr.map((r, i) => ({
                            index: i + 1,
                            indtEventTime: r.indtEventTime || '',
                            outdtEventTime: r.outdtEventTime || '',
                            vClientIP: r.vClientIP || '未知',
                            SystemHardware: r.SystemHardware || '未知'
                        }))
                        templateData.loginColumns = groupByColumns(loginRecords, 5, isAllPages)
                        
                        const deviceStats = {}
                        const ipStats = {}
                        data.LoginArr.forEach(r => {
                            deviceStats[r.SystemHardware || '未知设备'] = (deviceStats[r.SystemHardware || '未知设备'] || 0) + 1
                            ipStats[r.vClientIP || '未知IP'] = (ipStats[r.vClientIP || '未知IP'] || 0) + 1
                        })
                        templateData.totalCount = data.LoginArr.length
                        templateData.deviceStats = Object.entries(deviceStats).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
                        templateData.ipStats = Object.entries(ipStats).map(([ip, count]) => ({ ip, count })).sort((a, b) => b.count - a.count)
                    }
                    break

                case 2:
                    if (data?.itemArr) {
                        const itemRecords = data.itemArr.map((r, i) => {
                            const addOrReduce = String(r.AddOrReduce || '')
                            return {
                                index: i + 1,
                                dtEventTime: r.dtEventTime || '',
                                Name: r.Name || '未知物品',
                                AddOrReduce: addOrReduce,
                                Reason: decodeReason(r.Reason),
                                changeType: addOrReduce.startsWith('+') ? 'positive' : 'negative'
                            }
                        })
                        templateData.itemColumns = groupByColumns(itemRecords, 10, isAllPages)
                    }
                    break

                case 3:
                    if (data?.iMoneyArr) {
                        const moneyRecords = data.iMoneyArr.map((r, i) => {
                            const addOrReduce = String(r.AddOrReduce || '')
                            return {
                                index: i + 1,
                                dtEventTime: r.dtEventTime || '',
                                AddOrReduce: addOrReduce,
                                leftMoney: r.leftMoney || '未知',
                                Reason: decodeReason(r.Reason),
                                changeType: addOrReduce.startsWith('+') ? 'positive' : 'negative'
                            }
                        })
                        templateData.moneyColumns = groupByColumns(moneyRecords, 10, isAllPages)
                        
                        if (moneyRecords.length > 0) {
                            const dateMap = new Map()
                            moneyRecords.forEach(r => {
                                if (!r.dtEventTime) return
                                const normalizedDate = r.dtEventTime.split(' ')[0]?.replace(/\//g, '-') || r.dtEventTime.split('T')[0]?.replace(/\//g, '-')
                                if (!normalizedDate) return
                                if (!dateMap.has(normalizedDate)) dateMap.set(normalizedDate, [])
                                dateMap.get(normalizedDate).push(r)
                            })
                            
                            const dailyData = []
                            Array.from(dateMap.keys()).sort((a, b) => a.localeCompare(b)).forEach(date => {
                                const dayRecords = dateMap.get(date).sort((a, b) => (a.dtEventTime || '').localeCompare(b.dtEventTime || ''))
                                let dayTotalChange = 0
                                let startBalance = 0
                                let endBalance = 0
                                let validCount = 0
                                
                                dayRecords.forEach((r, index) => {
                                    dayTotalChange += parseFloat(String(r.AddOrReduce || '').trim()) || 0
                                    const balance = parseFloat(String(r.leftMoney || '0').replace(/,/g, '').trim()) || 0
                                    if (!isNaN(balance) && balance >= 0 && String(r.leftMoney || '0').trim() !== '未知') {
                                        if (index === 0 || startBalance === 0) startBalance = balance
                                        endBalance = balance
                                        validCount++
                                    }
                                })
                                
                                if (validCount > 0) {
                                    dailyData.push({ date, startBalance, endBalance, totalChange: dayTotalChange, recordCount: dayRecords.length })
                                }
                            })
                            
                            if (dailyData.length > 0) {
                                const balances = dailyData.map(d => d.endBalance)
                                const maxBalance = Math.max(...balances)
                                const minBalance = Math.min(...balances)
                                const balanceRange = maxBalance - minBalance || 1
                                const chartWidth = 800
                                const chartHeight = 120
                                const padding = { top: 20, right: 10, bottom: 30, left: 10 }
                                const plotWidth = chartWidth - padding.left - padding.right
                                const plotHeight = chartHeight - padding.top - padding.bottom
                                
                                const points = dailyData.map((item, index) => {
                                    const x = dailyData.length === 1 
                                        ? padding.left + plotWidth / 2
                                        : padding.left + (index / (dailyData.length - 1)) * plotWidth
                                    const y = padding.top + plotHeight - ((item.endBalance - minBalance) / balanceRange) * plotHeight
                                    const dateParts = item.date.split('-')
                                    return {
                                        date: dateParts.length >= 3 ? `${dateParts[1]}-${dateParts[2]}` : item.date,
                                        fullDate: item.date,
                                        balance: item.endBalance.toLocaleString(),
                                        totalChange: item.totalChange.toLocaleString(),
                                        startBalance: item.startBalance.toLocaleString(),
                                        recordCount: item.recordCount,
                                        x: x.toFixed(1),
                                        y: y.toFixed(1),
                                        xPercent: ((x / chartWidth) * 100).toFixed(2)
                                    }
                                })
                                
                                let pathData = points.length === 1
                                    ? `M ${points[0].x},${points[0].y} L ${points[0].x + 10},${points[0].y}`
                                    : points.length > 1
                                        ? `M ${points[0].x},${points[0].y}` + points.slice(1).map(p => ` L ${p.x},${p.y}`).join('')
                                        : ''
                                
                                const totalChange = dailyData.reduce((sum, item) => sum + item.totalChange, 0)
                                const firstDay = dailyData[0]
                                const lastDay = dailyData[dailyData.length - 1]
                                
                                templateData.moneyTrendChart = {
                                    startBalance: firstDay.startBalance.toLocaleString(),
                                    endBalance: lastDay.endBalance.toLocaleString(),
                                    maxBalance: maxBalance.toLocaleString(),
                                    minBalance: minBalance.toLocaleString(),
                                    totalChange: totalChange.toLocaleString(),
                                    chartWidth,
                                    chartHeight,
                                    pathData,
                                    points,
                                    dateRange: `${firstDay.date} ~ ${lastDay.date}`
                                }
                            }
                        }
                    }
                    break
            }
            return templateData
        }

        const renderTrendChart = async (res, typeValue) => {
            if (typeValue !== 3) return null
            const errorCheck = isApiError(res)
            if (errorCheck.error) return null
            const templateData = prepareTemplateData(res, typeValue, 1, '货币', false)
            if (!templateData.moneyTrendChart) return null
            return await Render.render('Template/flows/moneyTrendChart', { moneyTrendChart: templateData.moneyTrendChart }, {
                e: this.e,
                retType: 'base64',
                saveId: `${this.e.user_id}_flows_chart_${Date.now()}`
            })
        }

        const renderTypeImage = async (res, typeValue, pageNum, typeName, isAllPages = false) => {
            const errorCheck = isApiError(res)
            if (errorCheck.error) return { error: true, msg: errorCheck.msg }
            const templateData = prepareTemplateData(res, typeValue, pageNum, typeName, isAllPages)
            if (typeValue === 3 && templateData.moneyTrendChart) delete templateData.moneyTrendChart
            const imageSegment = await Render.render('Template/flows/flows', templateData, {
                e: this.e,
                retType: 'base64',
                saveId: `${this.e.user_id}_flows_${typeValue}_${isAllPages ? 'all' : pageNum}`
            })
            return { error: false, image: imageSegment }
        }

        const bot = global.Bot

        if (isAll) {
            if (actualTypeStr) {
                const type = typeMap[actualTypeStr]
                if (!type) {
                    return await this.e.reply('未知的流水类型，支持的类型：设备、道具、货币')
                }
                
                await this.e.reply(`正在获取${actualTypeStr}流水的所有页数据，这可能需要较长时间，请耐心等待...`)
                const forwardMsg = []
                
                try {
                    const allPagesData = await getAllPagesData(type)
                    if (!allPagesData.length) {
                        return await this.e.reply(`【${actualTypeStr}流水】全部\n\n未获取到任何数据`)
                    }
                    
                    const mergedRes = mergePagesData(allPagesData, type)
                    if (!mergedRes) {
                        return await this.e.reply(`【${actualTypeStr}流水】全部\n\n数据合并失败`)
                    }
                    
                    // 货币流水有两张图，使用合并转发消息
                    if (type === 3) {
                        const forwardMsg = []
                        const chartImage = await renderTrendChart(mergedRes, type)
                        if (chartImage) {
                            forwardMsg.push({ message: [`【${actualTypeStr}流水】资产余额变化趋势\n`, chartImage], nickname: bot.nickname, user_id: bot.uin })
                        }
                        
                        const result = await renderTypeImage(mergedRes, type, allPagesData.length, actualTypeStr, true)
                        if (result.error || !result.image) {
                            if (forwardMsg.length > 0) {
                                await this.e.reply(await bot.makeForwardMsg(forwardMsg), false, { recallMsg: 0 })
                            }
                            return await this.e.reply(`【${actualTypeStr}流水】全部\n\n${result.error ? '查询失败: ' + result.msg : '渲染失败，请稍后重试'}`)
                        }
                        
                        forwardMsg.push({ message: [`【${actualTypeStr}流水】全部（共${allPagesData.length}页）\n`, result.image], nickname: bot.nickname, user_id: bot.uin })
                        const forwardResult = await this.e.reply(await bot.makeForwardMsg(forwardMsg), false, { recallMsg: 0 })
                        return forwardResult || await this.e.reply('未能获取流水记录。')
                    }
                    
                    // 其他类型直接发送图片
                    const result = await renderTypeImage(mergedRes, type, allPagesData.length, actualTypeStr, true)
                    if (result.error || !result.image) {
                        return await this.e.reply(`【${actualTypeStr}流水】全部\n\n${result.error ? '查询失败: ' + result.msg : '渲染失败，请稍后重试'}`)
                    }
                    
                    return await this.e.reply(result.image)
                } catch (error) {
                    logger.error(`[流水] 获取 ${actualTypeStr} 全部数据失败:`, error)
                    return await this.e.reply(`【${actualTypeStr}流水】全部\n\n查询异常: ${error.message || '未知错误'}`)
                }
            }
            
            await this.e.reply('正在获取所有类型的所有页数据，这可能需要较长时间，请耐心等待...')
            const forwardMsg = []
            
            for (const [typeName, typeValue] of Object.entries(typeMap)) {
                try {
                    const allPagesData = await getAllPagesData(typeValue)
                    if (!allPagesData.length) {
                        forwardMsg.push({ message: `【${typeName}流水】全部\n\n未获取到任何数据`, nickname: bot.nickname, user_id: bot.uin })
                        continue
                    }
                    
                    const mergedRes = mergePagesData(allPagesData, typeValue)
                    if (!mergedRes) {
                        forwardMsg.push({ message: `【${typeName}流水】全部\n\n数据合并失败`, nickname: bot.nickname, user_id: bot.uin })
                        continue
                    }
                    
                    if (typeValue === 3) {
                        const chartImage = await renderTrendChart(mergedRes, typeValue)
                        if (chartImage) {
                            forwardMsg.push({ message: [`【${typeName}流水】资产余额变化趋势\n`, chartImage], nickname: bot.nickname, user_id: bot.uin })
                        }
                    }
                    
                    const result = await renderTypeImage(mergedRes, typeValue, allPagesData.length, typeName, true)
                    forwardMsg.push({ 
                        message: result.error || !result.image 
                            ? `【${typeName}流水】全部\n\n${result.error ? '查询失败: ' + result.msg : '渲染失败，请稍后重试'}`
                            : [`【${typeName}流水】全部（共${allPagesData.length}页）\n`, result.image],
                        nickname: bot.nickname, 
                        user_id: bot.uin 
                    })
                } catch (error) {
                    logger.error(`[流水] 获取 ${typeName} 全部数据失败:`, error)
                    forwardMsg.push({ message: `【${typeName}流水】全部\n\n查询异常: ${error.message || '未知错误'}`, nickname: bot.nickname, user_id: bot.uin })
                }
            }

            const result = await this.e.reply(await bot.makeForwardMsg(forwardMsg), false, { recallMsg: 0 })
            return result || await this.e.reply('未能获取任何流水记录。')
        }

        if (!actualTypeStr) {
            await this.e.reply('正在生成流水记录图片，请稍候...')
            const forwardMsg = []
            
            for (const [typeName, typeValue] of Object.entries(typeMap)) {
                try {
                    const res = await this.api.getFlows(token, typeValue, page)
                    
                    if (typeValue === 3) {
                        const chartImage = await renderTrendChart(res, typeValue)
                        if (chartImage) {
                            forwardMsg.push({ message: [`【${typeName}流水】资产余额变化趋势\n`, chartImage], nickname: bot.nickname, user_id: bot.uin })
                        }
                    }
                    
                    const result = await renderTypeImage(res, typeValue, page, typeName)
                    forwardMsg.push({ 
                        message: result.error || !result.image 
                            ? `【${typeName}流水】第 ${page} 页\n\n${result.error ? '查询失败: ' + result.msg : '渲染失败，请稍后重试'}`
                            : [`【${typeName}流水】\n`, result.image],
                        nickname: bot.nickname, 
                        user_id: bot.uin 
                    })
                } catch (error) {
                    logger.error(`[流水] 渲染 ${typeName} 图片失败:`, error)
                    forwardMsg.push({ message: `【${typeName}流水】第 ${page} 页\n\n查询异常: ${error.message || '未知错误'}`, nickname: bot.nickname, user_id: bot.uin })
                }
            }

            const result = await this.e.reply(await bot.makeForwardMsg(forwardMsg), false, { recallMsg: 0 })
            return result || await this.e.reply('未能生成任何图片，请稍后重试。')
        }

        const type = typeMap[actualTypeStr]
        if (!type) {
            return await this.e.reply('未知的流水类型，支持的类型：设备、道具、货币')
        }
        
        await this.e.reply(`正在查询${actualTypeStr}流水，请稍候...`)
        const res = await this.api.getFlows(token, type, page)
        
        if (await utils.handleApiError(res, this.e)) return true
        if (!res?.data?.length) {
            return await this.e.reply('当前页无流水记录。')
        }
        
        if (type === 3) {
            const forwardMsg = []
            const chartImage = await renderTrendChart(res, type)
            if (chartImage) {
                forwardMsg.push({ message: [`【${actualTypeStr}流水】资产余额变化趋势\n`, chartImage], nickname: bot.nickname, user_id: bot.uin })
            }
            
            const result = await renderTypeImage(res, type, page, actualTypeStr)
            if (result.error || !result.image) {
                if (forwardMsg.length > 0) {
                    await this.e.reply(await bot.makeForwardMsg(forwardMsg), false, { recallMsg: 0 })
                }
                return await this.e.reply(result.error ? `查询失败: ${result.msg}` : '渲染失败，请稍后重试。')
            }
            
            forwardMsg.push({ message: [`【${actualTypeStr}流水】\n`, result.image], nickname: bot.nickname, user_id: bot.uin })
            const forwardResult = await this.e.reply(await bot.makeForwardMsg(forwardMsg), false, { recallMsg: 0 })
            return forwardResult || await this.e.reply('未能获取流水记录。')
        }
        
        const result = await renderTypeImage(res, type, page, actualTypeStr)
        if (result.error || !result.image) {
            return await this.e.reply(result.error ? `查询失败: ${result.msg}` : '渲染失败，请稍后重试。')
        }
        
        return await this.e.reply(result.image)
    }
}
