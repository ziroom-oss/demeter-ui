

import store from '@/store/index.js';
import router from '@/router/index.js';
import { isEmpty } from 'lodash-es';

const whiteRoutes = ['/login'];
router.beforeEach(async (to, from, next) => {
  const userinfo = store.permission.state.userinfo;
  const routes = store.permission.state.routes;
  // 允许通过：当用户不为空
  if (!isEmpty(userinfo)) {
    if (routes.length < 1) {
      const accessRoutes = await store.dispatch('getAccessRoutes');
      router.addRoutes(accessRoutes);
      next({ ...to, replace: true });
    } else {
      next();
    }
  } else {
    // 允许通过2：当要通往登录页面
    if (whiteRoutes.includes(to)) {
      next();
    } else {
      // 不允许通过：跳转登陆页面
      next('/login');
    }
  }
})