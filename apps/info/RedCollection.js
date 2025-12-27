import Render from '../../components/Render.js'
import Code from '../../components/Code.js'
import utils from '../../utils/utils.js'
import DataManager from '../../utils/Data.js'

export class RedCollection extends plugin {
    constructor(e) {
        super({
            name: '大红收藏馆',
            dsc: '查看大红收藏数据',
            event: 'message',
            priority: 1000,
            rule: [
                {
                    reg: '^(#三角洲|\\^)(大红收藏|大红藏品|大红海报|藏品海报)(?:\\s+(\\d+))?$',
                    fnc: 'getRedCollection'
                }
            ]
        })
        this.e = e
        this.api = new Code(e)
    }

    // URL解码函数（参考Info.js）
    decode(str) {
        try {
            return decodeURIComponent(str || '')
        } catch (e) {
            return str || ''
        }
    }

    async getRedCollection(e) {
        try {
            // 解析赛季参数
            let seasonId = 'all'  // 默认查询所有赛季
            let seasonDisplay = '所有赛季'

            const seasonMatch = e.msg.match(/^(#三角洲|\^)(大红收藏|大红藏品|大红海报|藏品海报)(?:\s+(\d+))?$/)
            if (seasonMatch && seasonMatch[3]) {
                seasonId = seasonMatch[3]
                seasonDisplay = `S${seasonId}赛季`
            }

            const token = await utils.getAccount(e.user_id)
            if (!token) {
                await e.reply([segment.at(e.user_id), '您尚未绑定账号，请使用 #三角洲登录 进行绑定。'])
                return true
            }

            await e.reply('正在获取大红收藏数据，请稍候...')

            // 获取个人信息（用户名、头像、段位分数）
            const personalInfoRes = await this.api.getPersonalInfo(token)
            if (await utils.handleApiError(personalInfoRes, e)) return true;

            if (!personalInfoRes.data || !personalInfoRes.roleInfo) {
                await e.reply('获取个人信息失败：API返回数据格式异常')
                return true
            }

            // 获取个人数据（支持赛季参数）
            const personalDataRes = await this.api.getPersonalData(token, '', seasonId)
            if (await utils.handleApiError(personalDataRes, e)) return true;

            if (!personalDataRes.success || !personalDataRes.data) {
                await e.reply('获取个人数据失败：API返回数据格式异常')
                return true
            }

            // 获取大红称号信息
            const titleRes = await this.api.getTitle(token)
            if (await utils.handleApiError(titleRes, e)) return true;

            if (!titleRes.success || !titleRes.data) {
                await e.reply('获取大红称号失败：API返回数据格式异常')
                return true
            }

            // 解析用户信息
            const { userData, careerData } = personalInfoRes.data
            const { roleInfo } = personalInfoRes

            const userName = this.decode(userData?.charac_name || roleInfo?.charac_name) || '未知'

            let userAvatar = this.decode(userData?.picurl || roleInfo?.picurl)
            if (userAvatar && /^[0-9]+$/.test(userAvatar)) {
                userAvatar = `https://wegame.gtimg.com/g.2001918-r.ea725/helper/df/skin/${userAvatar}.webp`
            }

            let userRank = '未知段位'
            if (careerData?.rankpoint) {
                const fullRank = DataManager.getRankByScore(careerData.rankpoint, 'sol')
                // 移除分数部分，保留完整段位名称（如"铂金II"）
                userRank = fullRank.replace(/\s*\(\d+\)/, '')
            }

            // 解析个人数据结构（参考Data.js的解析逻辑）
            let solDetail = null
            const allModesData = personalDataRes.data
            if (allModesData?.sol?.data?.data?.solDetail) {
                solDetail = allModesData.sol.data.data.solDetail
            }

            if (!solDetail) {
                await e.reply('没有找到烽火地带游戏数据，请确保您已经在游戏中进行过烽火地带模式的对局。')
                return true
            }

            // 解析大红称号信息
            const titleData = titleRes.data
            const title = titleData.title || '血色会计'
            const subtitle = titleData.subtitle || '"能把肾上腺素换算成子弹汇率的鬼才"'
            const unlockDesc = titleData.unlockDesc || '总价值突破800万且持有医疗/能源类大红收藏品'

            // 只解析需要的数据
            const redTotalMoney = solDetail.redTotalMoney || 0
            const redTotalCount = solDetail.redTotalCount || 0
            const redCollectionDetail = solDetail.redCollectionDetail || []

            if (redCollectionDetail.length === 0) {
                await e.reply('您还没有任何大红收藏品，快去游戏中获取一些稀有收藏品吧！')
                return true
            }

            // 计算大红种类数量（去重）
            const uniqueObjectIds = new Set(redCollectionDetail.map(item => item.objectID))
            const redGodCount = uniqueObjectIds.size

            // 按价格排序，取前6个最贵的收藏品
            const sortedCollections = redCollectionDetail
                .sort((a, b) => (b.price || 0) - (a.price || 0))
                .slice(0, 6)

            // 获取所有需要查询名称的物品ID
            const objectIds = sortedCollections.map(item => item.objectID)

            // 批量查询物品名称
            let objectNames = {}
            if (objectIds.length > 0) {
                try {
                    const searchRes = await this.api.searchObject('', objectIds.join(','))
                    if (searchRes && searchRes.data && searchRes.data.keywords) {
                        searchRes.data.keywords.forEach(obj => {
                            objectNames[obj.objectID] = obj.objectName
                        })
                    }
                } catch (error) {
                    logger.warn('[大红收藏馆] 获取物品名称失败，将使用物品ID显示:', error.message)
                }
            }

            const topCollections = sortedCollections.map((item, index) => ({
                rank: index + 1,
                name: objectNames[item.objectID] || `物品${item.objectID}`,
                count: item.count || 1,
                value: (item.price || 0).toLocaleString(),
                imageUrl: `https://playerhub.df.qq.com/playerhub/60004/object/${item.objectID}.png`
            }))

            // 获取所有藏品列表（grade=6的物品）
            let unlockedCollections = []
            let unlockedCount = 0
            try {
                const allCollectionsRes = await this.api.getObjectList('props', 'collection')
                if (allCollectionsRes && allCollectionsRes.data && allCollectionsRes.data.keywords) {
                    // 筛选出grade=6的物品（大红藏品）
                    const allRedCollections = allCollectionsRes.data.keywords.filter(item => item.grade === 6)

                    // 获取已收藏的物品ID集合
                    const collectedIds = new Set(redCollectionDetail.map(item => item.objectID))

                    // 找出未收藏的物品
                    const uncollectedItems = allRedCollections.filter(item => !collectedIds.has(item.objectID))

                    unlockedCount = uncollectedItems.length

                    // 随机选择3个未收藏的物品展示
                    if (uncollectedItems.length > 0) {
                        const shuffled = uncollectedItems.sort(() => 0.5 - Math.random())
                        unlockedCollections = shuffled.slice(0, 3).map(item => ({
                            name: item.objectName,
                            objectID: item.objectID,
                            price: (item.avgPrice || 0).toLocaleString(),
                            imageUrl: `https://playerhub.df.qq.com/playerhub/60004/object/${item.objectID}.png`
                        }))
                    }
                }
            } catch (error) {
                logger.warn('[大红收藏馆] 获取未解锁藏品失败:', error.message)
                unlockedCount = 74 - redGodCount // 降级为原始计算方式
            }

            const renderData = {
                userName: userName,
                userRank: userRank,
                userAvatar: userAvatar,
                title: title,
                subtitle: subtitle,
                unlockDesc: unlockDesc,
                seasonDisplay: seasonDisplay, // 传递赛季显示文本
                statistics: {
                    redGodCount: redGodCount.toString(),
                    redTotalCount: redTotalCount.toString(),
                    redTotalValue: redTotalMoney.toLocaleString(),
                    unlockedCount: unlockedCount.toString()
                },
                topCollections: topCollections,
                unlockedCollections: unlockedCollections
            }

            try {
                return await Render.render('Template/redCollection/redCollection.html', renderData, {
                    e,
                    scale: 1.0,
                    renderCfg: {
                        viewPort: {
                            width: 1125,
                            height: 2436
                        }
                    }
                })
            } catch (renderError) {
                logger.error('[大红收藏馆] 渲染失败:', renderError)
                await e.reply(`图片渲染失败: ${renderError.message}`)
                return true
            }

        } catch (error) {
            logger.error('[大红收藏馆] 查询失败:', error)
            await e.reply([
                segment.at(e.user_id),
                `\n查询大红收藏失败: ${error.message}\n\n请检查：\n1. 账号是否已登录或过期\n2. 是否已绑定游戏角色\n3. 网络连接是否正常`
            ])
        }
        return true
    }
} 