

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
    redirect: '/PortraitManagement',
    children: [
      {
        path: 'PortraitManagement',
        name: 'PortraitManagement',
        meta: {
          title: '画像管理',
          sort: 1,
          icon: 'smile',
        },
        component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/Portrait/index.vue')
      }
    ]
  },
  
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
          home: true,
        },
        component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/Portrait/EmployeePortrait/index.vue')
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/SkillAuthManagement_AuthList',
    children: [
      {
        path: 'SkillAuthManagement_AuthList',
        name: 'SkillAuthManagement_AuthList',
        meta: {
          title: '认证列表',
          hidden: false,
          icon: 'code',
        },
        component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/SkillAuthManagement/AuthList/index.vue')
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/SkillAuthManagement_EditStudyList',
    children: [
      {
        path: 'SkillAuthManagement_EditStudyList',
        name: 'SkillAuthManagement_EditStudyList',
        meta: {
          title: '学习清单编辑',
          hidden: false,
        },
        component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/SkillAuthManagement/EditStudyList/index.vue')
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/SkillAuthManagement_List',
    children: [
      {
        path: 'SkillAuthManagement_List',
        name: 'SkillAuthManagement_List',
        meta: {
          title: '认领列表',
          hidden: false,
        },
        component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/SkillAuthManagement/List/index.vue')
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/SkillAuthManagement_SkillAssignList',
    children: [
      {
        path: 'SkillAuthManagement_SkillAssignList',
        name: 'SkillAuthManagement_SkillAssignList',
        meta: {
          title: '技能分配列表',
          hidden: false,
        },
        component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/SkillAuthManagement/SkillassiginList/index.vue')
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/SkillAuthManagement_StudyListDetail',
    children: [
      {
        path: 'SkillAuthManagement_StudyListDetail',
        name: 'SkillAuthManagement_StudyListDetail',
        meta: {
          title: '学习清单详情',
          hidden: false,
        },
        component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/SkillAuthManagement/studyListDetail/index.vue')
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/SkillAuthManagement',
    children: [
      {
        path: 'SkillAuthManagement',
        name: 'SkillAuthManagement',
        meta: {
          title: '技能认证管理',
          sort: 2,
          hidden: false,
        },
        component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/SkillAuthManagement/index.vue')
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/JobsManagement',
    children: [
      {
        path: 'JobsManagement',
        name: 'JobsManagement',
        meta: {
          title: '职务管理',
        },
        component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/System/Jobs/index.vue')
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/SkillMapManagement',
    children: [
      {
        path: 'SkillMapManagement',
        name: 'SkillMapManagement',
        meta: {
          title: '技能图谱管理',
        },
        component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/System/SkillMap/index.vue')
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/SkillMapNew',
    children: [
      {
        path: 'SkillMapNew',
        name: 'SkillMapNew',
        meta: {
          title: '新建技能图谱',
          hidden: true,
        },
        component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/System/SkillMapNew/index.vue')
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/SkillPointList',
    children: [
      {
        path: 'SkillPointList',
        name: 'SkillPointList',
        meta: {
          title: '技能点列表',
        },
        component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/System/SkillPointManagement/index.vue')
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/SkillTreeManagement',
    children: [
      {
        path: 'SkillTreeManagement',
        name: 'SkillTreeManagement',
        meta: {
          title: '技能树管理',
          sort: 2,
        },
        component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/System/SkillTree/index.vue')
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/SystemManagement',
    children: [
      {
        path: 'SystemManagement',
        name: 'SystemManagement',
        meta: {
          title: '系统管理',
          hidden: false,
          icon: 'apartment',
          sort: 4,
        },
        component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/System/index.vue')
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/NewTaskAssign',
    children: [
      {
        path: 'NewTaskAssign',
        name: 'NewTaskAssign',
        meta: {
          title: '新建指派任务',
        },
        component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/Task/Assign/index.vue')
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/AssignDetail',
    children: [
      {
        path: 'AssignDetail',
        name: 'AssignDetail',
        meta: {
          title: '指派任务详情',
          hidden: true,
        },
        component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/Task/AssignDetail/index.vue')
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/TaskList',
    children: [
      {
        path: 'TaskList',
        name: 'TaskList',
        meta: {
          title: '任务列表',
        },
        component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/Task/List/index.vue')
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/NewTask',
    children: [
      {
        path: 'NewTask',
        name: 'NewTask',
        meta: {
          title: '新建任务',
          hidden: true
        },
        component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/Task/New/index.vue')
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/SkillDetail',
    children: [
      {
        path: 'SkillDetail',
        name: 'SkillDetail',
        meta: {
          title: '技能点详情',
          hidden: true
        },
        component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/Task/SkillDetail/index.vue')
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/TaskManagement',
    children: [
      {
        path: 'TaskManagement',
        name: 'TaskManagement',
        meta: {
          title: '任务管理',
          icon: 'audit',
          sort: 2,
        },
        component: () => import(/* webpackChunkName: "EngineeringMetric" */'@/views/Task/index.vue')
      }
    ]
  }
];

Vue.use(VueRouter);
const router = new VueRouter({
  routes,
});

export default router;