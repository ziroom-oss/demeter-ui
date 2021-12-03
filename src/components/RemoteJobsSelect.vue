<template>
  <el-select
    v-model="value"
    filterable
    clearable
    reserve-keyword
    placeholder="请输入关键词"
    @change="onChange"
    size="mini"
    >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.name"
      :value="item.code">
    </el-option>
  </el-select>
</template>

<script>
import jobs from '@/apis/jobs';
export default {
  model: {
    prop: 'modelValue',
    event: 'change',
  },
  props: {
    modelValue: [Number, String],
  },
  data() {
    return {
      value: '',
      options: [],
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
  mounted() {
    jobs.listAll().then(res => {
      this.options = res;
    })
  },
  methods: {
    onChange(value) {
      this.$emit('change', value);
    }
  }
}
</script>