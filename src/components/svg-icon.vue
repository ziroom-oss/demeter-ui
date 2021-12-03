<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
import '@/assets/iconfont/iconfont.js'
export default {
  name: 'icon-svg',
  props: {
    iconname: {
      type: String,
      required: true
    }
  },
  computed: {
    iconName() {
      return `#${this.iconname}`
    }
  }
}
</script>

<style>
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  font-size: 20px;
}
</style>