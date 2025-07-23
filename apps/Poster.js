import plugin from '../../../lib/plugins/plugin.js';
import DeltaForceAPI from '../components/Code.js';

export class DeltaForcePoster extends plugin {
    constructor() {
        super({
            name: '三角洲行动-大红海报',
            event: 'message',
            priority: 1009,
            rule: [
                {
                    reg: '^(#三角洲|\^)(海报|大红海报|藏品海报|藏品)$',
                    fnc: 'getRedPoster'
                }
            ]
        });
    }

    async getRedPoster(e) {
        // 获取 frameworkToken
        let raw = await redis.get(`delta-force:token:${e.user_id}`);
        let token = '';
        if (raw) {
            try {
                const arr = JSON.parse(raw);
                token = Array.isArray(arr) ? arr[0] : arr;
            } catch {
                token = raw;
            }
        }
        if (!token) return await e.reply('请先扫码登录或绑定 frameworkToken');
        // 1. 获取个人数据
        const dataRes = await DeltaForceAPI.get('/df/person/personalData', { frameworkToken: token });
        if (!dataRes || !dataRes.success) return await e.reply('获取藏品信息失败');
        const solDetail = dataRes.data?.sol?.data?.data?.solDetail || {};
        const { redTotalMoney, redTotalCount, redCollectionDetail } = solDetail;
        // 2. 获取称号
        const titleRes = await DeltaForceAPI.get('/df/person/title', { frameworkToken: token });
        // 3. 渲染摘要
        let msg = `【三角洲行动-大红收藏】\n`;
        msg += `总价值：${redTotalMoney || 0}\n总数量：${redTotalCount || 0}\n`;
        if (titleRes && titleRes.success && titleRes.data) {
            msg += `称号：${titleRes.data.map(t => t.titleName).join(', ') || '无'}\n`;
        }
        msg += `\n【藏品详情】\n`;
        if (redCollectionDetail && redCollectionDetail.length) {
            for (const item of redCollectionDetail) {
                const itemRes = await DeltaForceAPI.get('/df/object/search', { id: item.objectID });
                const itemName = itemRes?.data?.keywords?.[0]?.objectName || '未知物品';
                msg += `${itemName} x${item.count} | 价值: ${item.price}\n`;
            }
        } else {
            msg += '暂无藏品';
        }
        await e.reply(msg.trim());
    }
} 