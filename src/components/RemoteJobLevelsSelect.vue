<template>
  <el-select
    v-model="value"
    clearable
    placeholder="选择职级"
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
/**
 * 搭配技能图谱使用的职业等级组件
 */
import map from '@/apis/map.js';
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
      value: [],
      options: [],
    }
  },
  watch: {
    modelValue: {
      immediate: true,
      handler: function (value) {
        // 因为使用 v-model 并且 change 事件提交的是数组
        // 那么同时也会变更 modelValue，而提交的数组已经按升序排列，因此仅需取最后一个元素
        this.value = value[value.length - 1];
      }
    }
  },
  mounted() {
    map.getTechRanks().then(res => {
      this.options = res.sort((a, b) => a.code - b.code);
    })
  },
  methods: {
    onChange(value) {
      const selected = this.options
          .slice(0, value)
          .map(o => o.code);
      this.$emit('change', selected);
    }
  }
}
</script>