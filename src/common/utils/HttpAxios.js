import axios from 'axios';

/**
 * 基础 HTTP 请求工具，内部仅并不限于 Axios 实现
 * 使用示例
 * 普通 Get 请求方法 get(url, config)
 * 复杂 Post 或者其它请求方法 post(url, data, config)
 */
export default class HttpAxios {
  constructor(option) {
    this.prefixURL = option.prefixURL;
    this.instance = axios.create({
      timeout: option.timeout || 60000,
      withCredentials: option.withCredentials || false,
      baseURL: option.baseURL,
    });
    return this;
  }

  request (config = {}) {
    if (!config.url) {
      throw new ReferenceError('缺少 url 参数');
    }
    config.url = this.prefixURL + config.url;
    return this.instance.request(config);
  }

  get (url, config = {}) {
    return this.request({ url, ...config });
  }

  post (url, data = {}, config = {}) {
    config.method = 'POST';
    return this.request({ url, data, ...config });
  }

  options (url, config = {}) {
    config.method = 'OPTIONS';
    return this.request({ url, ...config });
  }

  delete (url, config = {}) {
    config.method = 'DELETE';
    return this.request({ url, ...config });
  }

  put (url, data = {}, config = {}) {
    config.method = 'PUT';
    return this.request({ url, data, ...config })
  }

  patch(url, data = {}, config = {}) {
    config.method = 'PATCH';
    return this.request({ url, data, ...config });
  }

  head(url, config = {}) {
    config.method = 'HEAD';
    return this.request({ url, ...config });
  }
}
