<template>
  <Appearance>
    <label class="appearance-label">
      <p class="label-name">部门</p>
      <el-select
        v-model="depId"
        placeholder="请选择部门"
        size="small"
        @change="onChange">
        <el-option
          v-for="item in deptList"
          :key="item.departmentCode"
          :label="item.departmentName"
          :value="item.departmentCode">
        </el-option>
      </el-select>
    </label>

  </Appearance>
</template>

<script>
import Appearance from './Appearance.vue';
import NewEhrServer from '@/apis/newEhr.js';
export default {
  components: {
    Appearance,
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: String,
      default: '',
    }
  },
  mounted() {
    this.depId = this.value;
    this.getDepartmentList();
  },
  data() {
    return {
      depId: '',
      deptList: [],
    }
  },
  methods: {
    onChange(value) {
      this.$emit('change', value);
    },
    getDepartmentList(){
       NewEhrServer.getDepartmentList().then(res => {
          this.deptList = res;
        }).catch((error) => {
          console.log(error);
       })
    }
  }
}
</script>
