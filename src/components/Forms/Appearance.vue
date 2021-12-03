<!-- 按照设计稿实现的用于覆盖样式的中间组件 -->

<template>
  <section class="appearance-override">
    <slot></slot>
  </section>
</template>

<style lang="scss">
.appearance-override {
  .el-input--small .el-input__inner {
    border-radius: 16px;
  }

  .el-form-item__label {
    line-height: 28px;
  }

  .el-form-item__content {
    line-height: 28px;
  }

  .el-input--small {
    font-size: 14px;
  }

  .appearance-label {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .label-name {
      color: #000;
      font-size: 14px;
      margin-bottom: 0;
      margin-right: 16px;
    }
  }
}
</style>
