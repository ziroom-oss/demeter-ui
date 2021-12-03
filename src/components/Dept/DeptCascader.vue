<template>
  <el-cascader
    v-if="deptEnum.length > 0"
    ref="cascader"
    v-model="dept"
    size="small"
    clearable
    :props="props"
    @change="changeDep"
  ></el-cascader>
</template>

<script type="text/ecmascript-6">
import ehrServer from '@/apis/ehr';

export default {
  props: {
    value: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data () {
    const _this = this;
    return {
      code: '',
      dept: [],
      deptEnum: [],
      props: {
        lazy: true,
        checkStrictly: true,
        lazyLoad (node, resolve) {
          const { level, root } = node;
          if (!root && !node.hasChildren) resolve();
          if (root) {
            _this.getDep(_this.dept[0]).then(res => {
              const nodes = res;
              resolve(nodes);
            });
          } else if (level < 3) {
            _this.code = node.data.value;
            const data = {
              deptId: _this.code,
              setId: ''
            };
            ehrServer.getNextOrg(data).then(res => {
              const list = res.map(el => {
                return {
                  value: el.code,
                  label: el.name,
                  leaf: level >= 2
                };
              });
              resolve(list);
            }).catch(() => {
              resolve([]);
            });
          }
        }
      }
    };
  },
  watch: {
    value (val) {
      this.dept = val;
      // console.log(this.dept);
      ehrServer.getOrgByCode({ deptId: this.dept[0], setId: '' }).then((res) => {
        // console.log(res);
        this.deptEnum = [res] || [];
      });
    }
  },
  // created () {
  //   // 默认获取技术平台作为级联选择器的根
  //   const params = {
  //     deptId: '102558',
  //     setId: ''
  //   };
  //   ehrServer.getOrgByCode(params).then((res) => {
  //     this.deptEnum = [res] || [];
  //     this.dept.push('102558');
  //   });
  // },
  methods: {
    async getDep (val) {
      const list = this.deptEnum.map(el => {
        return {
          value: el.code,
          label: el.name,
          code: el.code
        };
      });
      if (val) {
        const index = this.getDepIndex(val);
        const data = {
          deptId: this.code,
          setId: ''
        };
        const subList = await ehrServer.getNextOrg(data);
        list[index].children = subList.map(el => {
          return {
            value: el.code,
            label: el.name,
            code: el.code
          };
        });
      }
      return list;
    },
    getDepIndex (val) {
      const index = this.deptEnum.findIndex(el => {
        return el.code === val;
      });
      console.log(this.deptEnum);
      this.code = this.deptEnum[index].code;
      return index;
    },
    changeDep () { // 获取部门名字 如：事业部/家修事业部/运营管理部
      const node = this.$refs.cascader.getCheckedNodes()[0];
      const depName = this.getCascaderName(node);
      this.$emit('input', this.dept);
      this.$emit('change', {
        value: this.dept.join('/'),
        name: depName
      });
    },
    getCascaderName (node) {
      let name = '';
      if (!node) return name;
      if (node.parent) {
        name = this.getCascaderName(node.parent) + '/' + node.data.label;
        return name;
      } else {
        return node.data.label;
      }
    }
  }
};
</script>
