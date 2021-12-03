import {
  doOauthInterceptor,
  doOauthLogout,
  getOauthToken,
  getUserinfo,
} from '@ziroom/zcloud-head';
import { addAsyncRoutes } from '@ziroom/cherry2-starter-vue';
import authorize from '@/apis/authorize';

const env = process.env.VUE_ENV_CONFIG;
const setting = {
  clientId: env === 'dev' ? 'zcloud-dev' : 'demeter-ui',
  appId: 'demeter-ui',
  env: ['sit', 'dev'].includes(process.env.VUE_ENV_CONFIG) ? 'sit' : env,
};

// 模拟存储 userinfo
let userinfo = null;

// 导出 vur-router 所使用的导航守卫
// [参考链接](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html)
export async function before (to, from, next) {
  const token = getOauthToken();
  if (!token) {
    try {
      await doOauthInterceptor(setting);
    } catch (error) {
      const r = window.confirm(error);
      if (r) {
        doOauthLogout();
      }
    }
  } else if (token && !userinfo) {
    const user = await authorize.getAuthorize();
    userinfo = getUserinfo();
    addAsyncRoutes(user.roles);
    next({ ...to, replace: true });
  } else {
    next();
  }
}

let isPrinted = false;
export async function after () {
}
