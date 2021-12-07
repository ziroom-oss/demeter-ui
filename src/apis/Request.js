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
  if (response.data.code !== '200') {
    Message.warning(response.data.message || '不存在 MESSAGE 或者是接口错误');
    return Promise.reject(new Error(response.data.message));
  }
  return response.data.data;
}

// 继承请求工具
export default class Request extends HttpAxios{
  constructor(options) {
    super({ baseURL: process.env.VUE_BASE_API, ...options });
    // 配置请求拦截器
    this.instance.interceptors.request.use(
      options.requestInterceptor || requestDefaultInterceptor,
      function (error) { return Promise.reject(error)}
    )

    // 配置响应拦截器
    this.instance.interceptors.response.use(
      options.responseInterceptor || responseDefaultInterceptor,
      function (error) {
        console.info(error);
        // if (error.response.status === 401) {
        //   doOauthLogout();
        // }
        return Promise.reject(error);
    })
  }
}
