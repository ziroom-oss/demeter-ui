

import store from '@/store/index.js';
import router from '@/router/index.js';

const whiteRoutes = ['/login'];
router.beforeEach(async (to, from, next) => {
  const userinfo = store.state.permission.userinfo;
  const routes = store.state.permission.routes;
  // 允许通过：当用户不为空
  if (userinfo) {
    if (routes.length < 1) {
      const accessRoutes = await store.dispatch('getAccessRoutes');
      if (accessRoutes.length > 0) {
        accessRoutes.forEach(route => {
          router.addRoute(route);
        });
      }
      next({ ...to, replace: true });
    } else {
      next();
    }
  } else {
    // 允许通过2：当要通往登录页面
    if (whiteRoutes.includes(to.path)) {
      next();
    } else {
      // 不允许通过：跳转登陆页面
      next('/login');
    }
  }
})