import HttpAxios from "@/common/utils/HttpAxios";
import { Message } from "element-ui";
import store from '@/store';

const requestDefaultInterceptor = function (config) {
    // 补充
    // config.headers['X-ZCLOUD-TOKEN'] = getOauthToken();
    if (process.env.VUE_APP_ENV_CONFIG === 'dev') {
        config.baseURL = '';
        config.url = '/dev' + config.url;
    }

    const token = store.state.permission.token;
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
}

const responseDefaultInterceptor = function (response) {
    if (!response.data.success && response.data.resultCode === '20701'){
        return Promise.reject(new Error(response.data.resultMessage));
    }

    if (response.data.code === 'NO_LOGIN' || response.data.code === '50003' || response.data.code === '20703'
        || response.data.code === '20704' || response.data.code === '20704'){
        window.sessionStorage.removeItem('demeter-ui-permission');
        window.location.reload();
        return Promise.reject(new Error(response.data.resultMessage));
    }
    if (!response.data.success) {
        Message.warning('系统开小差了，请联系管理员');
        return Promise.reject(new Error(response.data.resultMessage));
    }

    return response.data.result;
}

// 继承请求工具
export default class Base extends HttpAxios {
    constructor(options) {
        super({ baseURL: process.env.VUE_BASE_API, ...options });
        // 配置请求拦截器
        this.instance.interceptors.request.use(
            options.requestInterceptor || requestDefaultInterceptor,
            function (error) { return Promise.reject(error) }
        )

        // 配置响应拦截器
        this.instance.interceptors.response.use(
            options.responseInterceptor || responseDefaultInterceptor,
            function (error) {
                console.info(error);
                return Promise.reject(error);
            })
    }
}
