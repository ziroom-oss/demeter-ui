<template>
  <div :id="id" class="ziroom-tree-graph"></div>
</template>

<script>
import { random } from 'lodash-es';
export default {
  data () {
    return {
      id: '',
    }
  },
  mounted () {
    if (!this.id) {
      this.id = 'ZiroomTreeGraph-' + random(10000, 99999);
    }
  },
  methods: {
    getElementId() {
      return this.id;
    }
  }
}
</script>

<style type="text/css" scoped>
  .ziroom-tree-graph {
    width:  100%;
    height:  100%;
  }
</style>
