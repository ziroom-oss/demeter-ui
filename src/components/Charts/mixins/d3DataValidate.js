export default {
  methods: {
    validateData(value) {
      if (!value || value.length < 1) {
        console.warn(new TypeError(this.idName + ': data 参数不存在或者长度小于 1'));
        return false;
      }
      if (!Array.isArray(value) || value.some(v => !Array.isArray(v))) {
        console.warn(new TypeError(this.idName + ': data 类型必须是二维数组'));
        return false;
      }
      return true;
    }
  }
}