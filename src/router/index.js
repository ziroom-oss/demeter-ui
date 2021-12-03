

import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from '@/components/Layout/index.vue';

/**
 * RouteConfig Props
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
      }
    ]
  }
];

Vue.use(VueRouter);
const router = new VueRouter({
  routes,
});

export default router;