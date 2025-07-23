import plugin from '../../../lib/plugins/plugin.js';
import DeltaForceAPI from "../components/Code.js";
import fs from 'fs';
import axios from 'axios';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data', 'deltaforce');

function maskToken(token) {
    if (!token || token.length < 8) return '***';
    return token.slice(0, 4) + '****' + token.slice(-4);
}

function base64ToImage(base64, filePath) {
    const matches = base64.match(/^data:image\/(png|jpeg);base64,(.+)$/);
    if (!matches) return null;
    const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const data = matches[2];
    const outPath = filePath + '.' + ext;
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, Buffer.from(data, 'base64'));
    return outPath;
}

async function urlToImage(url, filePath) {
    try {
        const res = await axios.get(url, { responseType: 'arraybuffer' });
        const ext = url.includes('.jpg') ? 'jpg' : url.includes('.jpeg') ? 'jpg' : url.includes('.png') ? 'png' : 'png';
        const outPath = filePath + '.' + ext;
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, res.data);
        return outPath;
    } catch {
        return null;
    }
}

export class DeltaForceBind extends plugin {
    constructor() {
        super({
            name: "三角洲行动-用户登录",
            event: "message",
            priority: 1009,
            rule: [
                {
                    reg: "^(#三角洲|\^)QQ登陆$",
                    fnc: "loginQQ"
                },
                {
                    reg: "^(#三角洲|\^)微信登陆$",
                    fnc: "loginWechat"
                },
                {
                    reg: "^(#三角洲|\^)账号$",
                    fnc: "accountInfo"
                },
                {
                    reg: "^(#三角洲|\^)绑定 (.+)$",
                    fnc: "bindToken"
                },
                {
                    reg: "^(#三角洲|\^)解绑 (.+)$",
                    fnc: "unbindToken"
                }
            ]
        });
    }

    // QQ扫码登陆
    async loginQQ(e) {
        const res = await DeltaForceAPI.get('/login/qq/qr');
        if (!res || res.code !== 0 || !res.qr_image || !res.token) {
            return await e.reply('获取QQ扫码二维码失败，请稍后重试');
        }
        // base64转图片
        const imgPath = base64ToImage(res.qr_image, path.join(dataDir, `qr_${e.user_id}_${Date.now()}`));
        if (!imgPath) return await e.reply('二维码图片解析失败');
        await e.reply(["请使用QQ扫描下方二维码登录三角洲行动：", segment.image(imgPath)]);
        const frameworkToken = await this._pollLoginStatus(e, '/login/qq/status', res.token);
        if (frameworkToken) {
            await this._addAccount(e.user_id, frameworkToken);
            await e.reply('QQ扫码登录成功，frameworkToken已绑定！');
        }
        if (imgPath && fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    // 微信扫码登陆
    async loginWechat(e) {
        const res = await DeltaForceAPI.get('/login/wechat/qr');
        if (!res || res.code !== 0 || !res.qr_image || !res.frameworkToken) {
            return await e.reply('获取微信扫码二维码失败，请稍后重试');
            }
        // 下载二维码图片
        const imgPath = await urlToImage(res.qr_image, path.join(dataDir, `qr_${e.user_id}_${Date.now()}`));
        if (!imgPath) return await e.reply('二维码图片下载失败');
        await e.reply(["请使用微信扫描下方二维码登录三角洲行动：", segment.image(imgPath)]);
        const frameworkToken = await this._pollLoginStatus(e, '/login/wechat/status', res.frameworkToken);
        if (frameworkToken) {
            await this._addAccount(e.user_id, frameworkToken);
            await e.reply('微信扫码登录成功，frameworkToken已绑定！');
        }
        if (imgPath && fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    // 轮询扫码状态
    async _pollLoginStatus(e, statusApi, token) {
        let lastStatus = '';
        const start = Date.now();
        while (Date.now() - start < 120000) { // 最长2分钟
            await new Promise(r => setTimeout(r, 2000));
            const res = await DeltaForceAPI.get(statusApi, { frameworkToken: token });
            if (!res || res.code !== 0) continue;
            if (res.status !== lastStatus) {
                lastStatus = res.status;
                if (res.status === 'pending') {
                    await e.reply('等待扫码...');
                } else if (res.status === 'scanned') {
                    await e.reply('已扫码，等待确认...');
                } else if (res.status === 'success' || res.frameworkToken) {
                    return res.frameworkToken || token;
                } else if (res.status === 'expired') {
                    await e.reply('二维码已过期，请重新发起登录。');
                    return null;
                }
            }
        }
        await e.reply('扫码登录超时，请重新发起登录。');
        return null;
    }

    // 添加账号（支持多账号）
    async _addAccount(user_id, frameworkToken) {
        let accounts = await this._getAccounts(user_id);
        if (!accounts.includes(frameworkToken)) accounts.push(frameworkToken);
        await redis.set(`delta-force:token:${user_id}`, JSON.stringify(accounts));
    }

    // 获取账号列表
    async _getAccounts(user_id) {
        let raw = await redis.get(`delta-force:token:${user_id}`);
        if (!raw) return [];
        try {
            const arr = JSON.parse(raw);
            if (Array.isArray(arr)) return arr;
            if (typeof arr === 'string') return [arr];
            return [];
        } catch {
            return typeof raw === 'string' ? [raw] : [];
        }
    }

    // 绑定 frameworkToken
    async bindToken(e) {
        const [, , token] = e.msg.match(this.rule[3].reg);
        if (!token || token.length < 10) {
            return await e.reply('请输入正确的 frameworkToken！如：#三角洲绑定 xxxxxxxx');
        }
        await this._addAccount(e.user_id, token);
        await e.reply('绑定 frameworkToken 成功！');
    }

    // 解绑 frameworkToken 或序号
    async unbindToken(e) {
        const [, , arg] = e.msg.match(this.rule[4].reg);
        let accounts = await this._getAccounts(e.user_id);
        if (!accounts.length) return await e.reply('当前未绑定任何 frameworkToken');
        let idx = -1;
        if (/^\d+$/.test(arg)) {
            idx = parseInt(arg, 10) - 1;
            if (idx < 0 || idx >= accounts.length) return await e.reply('序号无效，请用 #三角洲账号 查看序号');
        } else {
            idx = accounts.findIndex(t => t === arg);
            if (idx === -1) return await e.reply('未找到该 frameworkToken');
        }
        const removed = accounts.splice(idx, 1);
        await redis.set(`delta-force:token:${e.user_id}`, JSON.stringify(accounts));
        await e.reply(`解绑成功：${maskToken(removed[0])}`);
    }

    // 查询账号信息
    async accountInfo(e) {
        let accounts = await this._getAccounts(e.user_id);
        if (!accounts.length) {
            return await e.reply('当前未绑定任何 frameworkToken，请先扫码登录或手动绑定');
        }
        let msg = '已绑定 frameworkToken：\n';
        accounts.forEach((token, i) => {
            msg += `${i + 1}. `;
            if (e.isGroup) {
                msg += maskToken(token) + '\n';
            } else {
                msg += token + '\n';
            }
        });
        await e.reply(msg.trim());
    }
}