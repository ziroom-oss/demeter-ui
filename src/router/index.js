

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
          icon: 'code',
        },
        component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/EngineerManagePanel/index.vue')
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
    {
      path: 'System',
      name: 'System',
      meta: {
        title: '系统管理',
        icon: 'code',
        roles: ['demeter-super-admin', 'demeter-dept-admin'],
      },
      component: () => import(/* webpackChunkName: "System" */'@/views/System/index.vue'),
      children: [
        {
          path: 'SkillMap',
          name: 'SkillMap',
          meta: {
            title: '技能图谱',
            icon: 'code',
          },
          component: () => import(/* webpackChunkName: "SkillMap" */'@/views/System/SkillMap/index.vue'),
        }
      ]
    },
  ];

Vue.use(VueRouter);
const router = new VueRouter({
  routes,
});

export default router;