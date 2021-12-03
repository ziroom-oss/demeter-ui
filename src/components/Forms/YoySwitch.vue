<template>
  <section class="yoy-switch">
    <p @click="onChange" class="switch-item" :class="{active: status, inactive: !status}">{{text[0]}}</p>
    <p @click="onChange" class="switch-item" :class="{active: !status, inactive: status}">{{text[1]}}</p>
  </section>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: Boolean,
      default: true,
    },
    text: {
      type: Array,
      default() {
        return ['正确', '错误'];
      }
    }
  },
  data() {
    return {
      status: true,
    }
  },
  mounted() {
    this.status = this.value;
  },
  methods: {
    onChange() {
      this.status = !this.status;
      this.$emit('change', this.status);
    }
  },
}
</script>

<style lang="scss" scoped>
.yoy-switch {
  position: relative;
  font-size: 14px;
  width: 180px;
  height: 32px;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  background-color: #fff;

  display: flex;
  justify-items: flex-start;
  flex-flow: row nowrap;

  .switch-item {
    margin-bottom: 0;
    width: 50%;
    line-height: 29px;
    text-align: center;
    position: relative;
    cursor: pointer;
    &.active {
      color: #fff;
      background-color: #000;
      border-radius: 16px;
    }
    &.inactive {
      color: #000;
      background-color: #fff;
      border-radius: 16px;
    }
  }
}
</style>
