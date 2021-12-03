<template>
  <Appearance>
    <label class="appearance-label">
      <p class="label-name">时间周期</p>
      <el-date-picker
        v-model="month"
        type="month"
        placeholder="选择日期"
        size="small"
        value-format="yyyy-MM-dd HH:mm:ss"
        @change="onChange">
      </el-date-picker>
    </label>
  </Appearance>
</template>

<script>
import Appearance from './Appearance.vue';
export default {
  components: {
    Appearance
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: [String, Date],
      default: '',
    }
  },
  data() {
    return {
      month: '',
    }
  },
  mounted() {
    this.month = this.value;
  },
  methods: {
    onChange(value) {
      this.$emit('change', value);
    }
  },
}
</script>
