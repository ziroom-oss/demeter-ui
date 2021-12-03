import { random } from 'lodash-es';

/**
 * 为运行实例扩展方法
 * @param {*} Vue Vue
 */
export default function(Vue) {
  Vue.prototype.$random = random;
}