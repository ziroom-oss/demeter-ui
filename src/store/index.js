import Vue from 'vue';
import Vuex from 'vuex';

const modulesContext = require.context('./modules/', true, /\.js$/);
const trimPath = name => name.replace(/(^\.|\/|\.js?$)/g, '');
const modules = modulesContext
  .keys()
  .reduce((accu, curr) => {
    accu[trimPath(curr)] = modulesContext(curr).default;
    return accu;
  }, {});

Vue.use(Vuex);

export default new Vuex.Store({
  modules,
});
