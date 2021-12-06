import authorize from '@/apis/authorize';
import { routes, asyncRoutes } from '@/router';

const state = {
  userinfo: null,
  token: null,
  routes: [],
};

function hasPermission(route, role) {
  return route.meta && route.meta.role
    // route.meta.role 是一个字符串数组
    ? route.meta.role.includes(role)
    : true;
}

function filterAsyncRoutes(routes, role) {
  const res = [];
  routes.forEach(route => {
    if (hasPermission(route, role)) {
      if (route.children) route.children = filterAsyncRoutes(route.children, role);
      res.push(route);
    }
  })
  return res;
}

export default {
  state,
  mutations: {
    SET_USERINFO(state, userinfo) {
      state.userinfo = userinfo;
    },
    SET_ACCESS_TOKEN(state, accessToken) {
      state.token = accessToken;
    },
    SET_ROUTES(state, accessRoutes) {
      state.routes = routes.concat(accessRoutes);
    }
  },
  actions: {
    getAccessRoutes({ commit }) {
      return new Promise((resolve, reject) => {
        let accessRoutes = [];
        authorize.getAuthorize().then(role => {
          accessRoutes = filterAsyncRoutes(asyncRoutes, role);
          commit('SET_ROUTES', accessRoutes);
          resolve(accessRoutes);
        }).catch(error => {
          reject(error);
        })
      })
    },
    doUserLogin({ commit }, { username, password }) {
      return new Promise((resolve, reject) => {
        authorize.doLogin('/auth/login', { username, password }).then(userinfo => {
          commit(SET_USERINFO, userinfo);
          commit(SET_ACCESS_TOKEN, userinfo.token);
          resolve(userinfo);
        }).catch(error => {
          reject(error);
        })
      })
    },
    doLogout() {
      authorize.doLogout().then(() => {
        window.location.reload();
      })
    }
  }
}
