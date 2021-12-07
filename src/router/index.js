

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
    redirect: '/EmployeePortrait',
    children: [
      {
        path: 'EmployeePortrait',
        name: 'EmployeePortrait',
        meta: {
          title: '画像信息',
          icon: 'code',
        },
        component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/Portrait/EmployeePortrait/index.vue'),
      }
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
    path: '/',
    component: Layout,
    children: [

      {
        path: 'TaskManagement',
        name: 'TaskManagement',
        meta: {
          title: '任务管理',
          icon: 'audit',
          roles: ['demeter-dept-admin', 'demeter-super-admin', 'plain'],
        },
        component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/Task/index.vue'),
        children: [
          {
            path: 'TaskList',
            name: 'TaskList',
            meta: {
              title: '任务列表',
              roles: ['demeter-dept-admin', 'demeter-super-admin', 'plain'],
            },
            component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/Task/List/index.vue'),
          },
          {
            path: 'NewTaskAssign',
            name: 'NewTaskAssign',
            meta: {
              title: '新建指派任务',
              roles: ['demeter-dept-admin', 'demeter-super-admin'],
            },
            component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/Task/Assign/index.vue'),
          },
          {
            path: 'SkillDetail',
            name: 'SkillDetail',
            meta: {
              title: '技能点详情',
              hidden: true
            },
            component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/Task/SkillDetail/index.vue'),
          },
          {
            path: 'AssignDetail',
            name: 'AssignDetail',
            meta: {
              title: '指派任务详情',
              hidden: true
            },
            component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/Task/AssignDetail/index.vue'),
          }
        ]
      },

      {
        path: 'SkillAuthManagement',
        name: 'SkillAuthManagement',
        meta: {
          title: '技能认证管理',
          icon: 'trophy',
          roles: ['demeter-dept-admin', 'demeter-super-admin', 'plain'],
        },
        component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/SkillAuthManagement/index.vue'),
        children: [
          
          {
            path: 'SkillAssignList',
            name: 'SkillAssignList',
            meta: {
              title: '技能分配列表',
              roles: ['demeter-super-admin', 'demeter-dept-admin'],
            },
            component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/SkillAuthManagement/SkillassiginList/index.vue'),
          },

          {
            path: 'AuthList',
            name: 'AuthList',
            meta: {
              title: '认证列表',
              roles: ['demeter-super-admin', 'demeter-dept-admin'],
            },
            component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/SkillAuthManagement/AuthList/index.vue'),
          },

          {
            path: 'ClaimList',
            name: 'ClaimList',
            meta: {
              title: '认领列表',
              roles: ['demeter-dept-admin', 'demeter-super-admin', 'plain'],
            },
            component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/SkillAuthManagement/List/index.vue'),
          },
          
          {
            path: 'EditStudyList',
            name: 'EditStudyList',
            meta: {
              title: '学习清单编辑',
              hidden: true,
            },
            component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/SkillAuthManagement/EditStudyList/index.vue'),
          },
          {
            path: 'StudyListDetail',
            name: 'StudyListDetail',
            meta: {
              title: '学习清单详情',
              hidden: true,
            },
            component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/SkillAuthManagement/studyListDetail/index.vue'),
          }
        ]
      },

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
            path: 'JobsManagement',
            name: 'JobsManagement',
            meta: {
              title: '职务管理',
            },
            component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/System/Jobs/index.vue'),
          },
          {
            path: 'SkillMapManagement',
            name: 'SkillMapManagement',
            meta: {
              title: '技能图谱管理',
            },
            component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/System/SkillMap/index.vue'),
          },
          {
            path: 'SkillPointList',
            name: 'SkillPointList',
            meta: {
              title: '技能点列表',
            },
            component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/System/SkillPointManagement/index.vue'),
          },
          {
            path: 'SkillTreeManagement',
            name: 'SkillTreeManagement',
            meta: {
              title: '技能树管理',
            },
            component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/System/SkillTree/index.vue'),
          },
          {
            path: 'SkillMapNew',
            name: 'SkillMapNew',
            meta: {
              title: '新建技能图谱',
              hidden: true,
            },
            component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/System/SkillMapNew/index.vue'),
          }
        ]
      },
      
    ]
  }
];

Vue.use(VueRouter);
const router = new VueRouter({
  routes,
});

export default router;