import login from '@/apis/login';
import { routes, asyncRoutes } from '@/router';
import { intersection } from 'lodash-es';

const state = {
  userinfo: null,
  token: null,
  routes: [],
};

function hasPermission(route, roles) {
  return route.meta && route.meta.roles
    // 检查数组是否有交集，如果有则判定有权限
    ? intersection(route.meta.roles, roles).length > 0
    : true;
}

function filterAsyncRoutes(routes, roles) {
  const res = [];
  routes.forEach(route => {
    if (hasPermission(route, roles)) {
      if (route.children) route.children = filterAsyncRoutes(route.children, roles);
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
      state.routes = routes[0].children.concat(accessRoutes);
    }
  },
  actions: {
    getAccessRoutes({ commit }) {
      return new Promise((resolve, reject) => {
        let accessRoutes = [];
        accessRoutes = filterAsyncRoutes(asyncRoutes, ['demeter-super-admin']);
        console.info(accessRoutes);
        if (accessRoutes.length > 0) {
          commit('SET_ROUTES', accessRoutes);
          return resolve(accessRoutes);
        }
        resolve([]);
        // @Todo 接口调试
        // login.getAuth().then(res => {
        //   if (res.roles.length < 1) {
        //     commit('SET_ROUTES', []);
        //     resolve([]);
        //   } else {
        //     accessRoutes = filterAsyncRoutes(asyncRoutes, res.roles);
        //     commit('SET_ROUTES', accessRoutes);
        //     resolve(accessRoutes);
        //   }
        // }).catch(error => {
        //   reject(error);
        // })
      })
    },
    doUserLogin({ commit }, { username, password }) {
      return new Promise((resolve, reject) => {
        login.doLogin({ username, password }).then(userinfo => {
          commit('SET_USERINFO', userinfo);
          commit('SET_ACCESS_TOKEN', userinfo.token);
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
