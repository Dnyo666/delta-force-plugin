import Config from './Config.js';
import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';

class DeltaForceAPI {
    constructor() {
        this.api = axios.create();
        this.api.interceptors.request.use(
    async config => {
                // 代理支持
        const proxyUrl = Config.getConfig().proxy_url;
        if (proxyUrl) {
            const proxyAgent = new HttpsProxyAgent(proxyUrl);
            config.httpsAgent = proxyAgent;
        }
                // baseURL拼接
                const baseURL = Config.getConfig().delta_force?.base_url || '';
                if (config.url && !config.url.startsWith('http')) {
                    config.url = baseURL.replace(/\/$/, '') + (config.url.startsWith('/') ? config.url : '/' + config.url);
                }
                // APIKey
                const apiKey = Config.getConfig().delta_force?.api_key || '';
                if (apiKey) {
                    config.headers = config.headers || {};
                    config.headers['Authorization'] = `Bearer ${apiKey}`;
        }
                // clientID（部分接口需要）
                const clientID = Config.getConfig().delta_force?.clientID;
                if (clientID && config.method === 'get') {
                    config.params = config.params || {};
                    if (!('clientID' in config.params)) {
                        config.params.clientID = clientID;
                    }
                }
                return config;
            },
            error => Promise.reject(error)
        );
    }

    async get(url, params = {}, options = {}) {
        try {
            const response = await this.api.get(url, { params, ...options });
            return response.data;
        } catch (error) {
            return this._handleError(error);
        }
    }

    async post(url, data = {}, options = {}) {
        try {
            const response = await this.api.post(url, data, options);
            return response.data;
        } catch (error) {
            return this._handleError(error);
        }
    }

    _handleError(error) {
        if (error.response) {
            return { success: false, code: error.response.status, msg: error.response.data?.msg || error.message };
            } else {
            return { success: false, code: 500, msg: error.message };
            }
    }
}

export default new DeltaForceAPI();