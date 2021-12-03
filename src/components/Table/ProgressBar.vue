<template>
  <section class="table-progress-bar">
    <p class="title"><span>{{this.completed}}</span><span>/{{this.total}}</span></p>
    <div class="progress-bar">
      <p class="progress">{{percent}}%</p>
      <p class="bar" :style="'width: ' + percent + '%'"></p>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    completed: {
      type: Number,
      default: 1,
    },
    total: {
      type: Number,
      default: 10,
    }
  },
  computed: {
    percent() {
      return Math.floor(this.completed / this.total * 100);
    }
  }
}
</script>

<style lang="scss" scoped>
.table-progress-bar {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  font-weight: bold;
  p {
    margin-bottom: 0;
  }
  .title {
    background-image: linear-gradient(to right, #7635E6, #AB62F3);
    -webkit-background-clip: text;
    color: transparent;
    >span:nth-child(1) {
      font-size: 56px;
    }
    >span:nth-child(2) {
      font-size: 32px;
    }
  }
  .progress-bar {
    position: relative;
    width: 956px;
    height: 24px;
    margin-left: 73px;
    border-radius: 8px;
    background-color: rgba(92,113,128,0.04);

    .progress {
      color: #7635E6;
      font-size: 32px;
      line-height: 38px;
      position: absolute;
      top: -38px;
      left: 50%;
      transform: translateX(-50%);
    }
    .bar {
      height: 100%;
      background: linear-gradient(90deg, #AE65F4 0%, #7635E6 100%);
      border-radius: 8px;
    }
  }
}
</style>
