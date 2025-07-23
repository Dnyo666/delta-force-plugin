import plugin from '../../../lib/plugins/plugin.js';
import DeltaForceAPI from '../components/Code.js';
import Render from '../components/Render.js';
import utils from '../utils/utils.js';

export class DeltaForceInfo extends plugin {
    constructor() {
        super({
            name: '三角洲行动-信息',
            event: 'message',
            priority: 1009,
            rule: [
                {
                    reg: '^(#三角洲|\\^)信息$',
                    fnc: 'getUserInfo'
                }
            ]
        });
    }

    async getUserInfo(e) {
        const token = await utils.getAccount(e.user_id);
        if (!token) {
            return await e.reply('您尚未绑定 frameworkToken，请使用 #三角洲QQ登陆 或 #三角洲微信登陆 进行绑定。');
        }

        const res = await DeltaForceAPI.get('/df/person/personalInfo', { frameworkToken: token });

        if (!res || res.retcode !== 0 || !res.data) {
            return await e.reply(`获取个人信息失败: ${res?.message || '未知错误'}`);
        }

        const data = res.data;
        
        // Decode username
        if (data.userData?.charac_name) {
            data.userData.charac_name = decodeURIComponent(data.userData.charac_name);
        }
        if (data.roleInfo?.charac_name) {
            data.roleInfo.charac_name = decodeURIComponent(data.roleInfo.charac_name);
        }

        // Format time
        if(data.roleInfo?.solduration) {
            data.roleInfo.solduration = utils.formatDuration(data.roleInfo.solduration);
        }
        if(data.careerData?.tdmduration) {
            data.careerData.tdmduration = utils.formatDuration(data.careerData.tdmduration, 'minutes');
        }


        const img = await Render.render('userInfo/userInfo', {
            ...data
        }, { e, retType: 'base64' });

        if (img) {
            await e.reply(segment.image(`base64://${img}`));
        } else {
            await e.reply('个人信息图片渲染失败，请联系管理员。');
        }
    }
} 