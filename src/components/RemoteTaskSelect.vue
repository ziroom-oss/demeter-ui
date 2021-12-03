<template>
  <el-select
    v-model="value"
    filterable
    remote
    reserve-keyword
    placeholder="请输入关键词"
    :remote-method="remoteMethod"
    :loading="loading"
    @change="onChange"
    >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.taskName"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
import task from '@/apis/task';
import SkillPointServer from '@/apis/skill.js';
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
      list: [],
      loading: false,
    }
  },
  watch: {
    modelValue: {
      immediate: true,
      handler: function (value) {
        if (!value) {
          this.value = '';
        } else {
          SkillPointServer.getSkillTask(value).then(res => {
            this.value = res.taskName;
          })
        }
      }
    }
  },
  methods: {
    remoteMethod(query) {
      console.info(query);
      if (query === '') {
        return;
      };
      this.loading = true;
      task.searchTask(query).then(res => {
        this.loading = false;
        this.options = res;
      });
    },
    onChange(value) {
      this.$emit('change', value);
    }
  }
}
</script>