import plugin from '../../../lib/plugins/plugin.js';
import DeltaForceAPI from '../components/Code.js';
import Render from '../components/Render.js';
import utils from '../utils/utils.js';

export class DeltaForceData extends plugin {
    constructor() {
        super({
            name: '三角洲行动-数据',
            event: 'message',
            priority: 1009,
            rule: [
                {
                    reg: '^(#三角洲|\\^)数据$',
                    fnc: 'getUserData'
                }
            ]
        });
    }

    async getUserData(e) {
        const token = await utils.getAccount(e.user_id);
        if (!token) {
            return await e.reply('您尚未绑定 frameworkToken，请使用 #三角洲QQ登陆 或 #三角洲微信登陆 进行绑定。');
        }

        const res = await DeltaForceAPI.get('/df/person/personalData', { frameworkToken: token });

        if (!res || res.retcode !== 0 || !res.data) {
            return await e.reply(`获取个人数据失败: ${res?.message || '未知错误'}`);
        }

        const data = res.data;

        // Format durations
        if (data.solDetail?.totalGameTime) {
            data.solDetail.totalGameTime = utils.formatDuration(data.solDetail.totalGameTime, 'seconds');
        }
        if (data.mpDetail?.totalGameTime) {
            data.mpDetail.totalGameTime = utils.formatDuration(data.mpDetail.totalGameTime, 'seconds');
        }

        const img = await Render.render('personalData/personalData', {
            ...data,
            // Pass any other necessary data for rendering
        }, { e, retType: 'base64' });

        if (img) {
            await e.reply(segment.image(`base64://${img}`));
        } else {
            await e.reply('个人数据图片渲染失败，请联系管理员。');
        }
    }
}
