

import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from '@/components/Layout/index.vue';

/**
 * 任何用户都有权限访问的路由配置
 */
export const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/EngineeringMetric',
    children: [
      {
        path: 'EngineeringMetric',
        name: 'EngineeringMetric',
        meta: {
          title: '工程指标',
          hidden: false,
          icon: 'code',
        },
        component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/EngineerManagePanel/index.vue')
      },
      {
        path: 'PortraitManagement',
        name: 'PortraitManagement',
        redirect: '/PortaraitManagement/EmployeePortrait',
        meta: {
          title: '画像管理',
          sort: 1,
          icon: 'smile',
        },
        component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/Portrait/index.vue'),
        children: [
          {
            path: 'EmployeePortrait',
            name: 'EmployeePortrait',
            meta: {
              title: '画像信息',
              home: true,
              hidden: false,
            },
            component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/Portrait/EmployeePortrait/index.vue')
          }
        ]
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '用户登陆',
      hidden: true,
    },
    component: () => import(/* webpackChunkName: "Login" */'@/views/Login/index.vue')
  }
];

// 这里配置需要准入权限的路由，结构和上述相同
export const asyncRoutes = [
];

Vue.use(VueRouter);
const router = new VueRouter({
  routes,
});

export default router;