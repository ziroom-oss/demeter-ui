import Vue from 'vue';

import App from './App.vue';

import 'normalize.css';
import './global.css';

import Antd from 'ant-design-vue';
import ElementUI from 'element-ui';
import 'ant-design-vue/dist/antd.css';
import 'element-ui/lib/theme-chalk/index.css';

import 'xe-utils';
import VXETable from 'vxe-table';
import 'vxe-table/lib/style.css';

import router from '@/router/index.js';

import extendInstance from '@/common/extendInstance.js';

Vue.use(Antd).use(ElementUI).use(VXETable);

Vue.config.productionTip = false;
const app = new Vue({
  router,
  render: h => h(App)
}).$mount('#app');

extendInstance(Vue);
