<template>
  <el-select
    v-model="value"
    filterable
    reserve-keyword
    placeholder="请选择图谱"
    @change="onChange"
    size="mini"
    >
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
import map from '@/apis/map';
import portrait from '@/apis/portrait';
//import { getUserinfo } from '@ziroom/zcloud-head';

export default {
  model: {
    prop: 'modelValue',
    event: 'change',
  },
  props: {
    modelValue: [Number, String, Array],
  },
  data() {
    return {
      value: '',
      options: [],
      skillMapListReq: {
        name: '',
        pageNumber: 1,
        isEnable: 1,
        pageSize: 1000,
      }
    }
  },
  watch: {
    modelValue: {
      immediate: true,
      handler: function (value) {
        this.value = value;
      }
    }
  },
  async mounted() {
    await this.listGraphs();
    const userinfo = getUserinfo().userInfo;
    portrait.getUserDetail(userinfo.uid).then(res => {
      const jobId = Number(res.jobId) || null;
      console.log(this.options);
      const option = this.options.find(opt => Number(opt.jobId) === jobId);
      console.log("option: "+option);
      console.log("jobId: "+jobId);
      if (option) {
        this.$emit('change', option.id);
      } else {
        this.$emit('change', this.options[0].id);
      }
    })
  },
  methods: {
    onChange(value) {
      this.$emit('change', value);
    },
    async listGraphs() {
      const res = await map.listByCondition(this.skillMapListReq);
      this.options = res.data;
      return Promise.resolve();
    }
  }
}
</script>