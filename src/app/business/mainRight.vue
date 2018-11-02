<template>
  <pui-main class="pui-main-right">
    <pui-container>
      <pui-header height="48px" class="pui-main-right__header">
        <span class="pui-main-right__header-title">消息列表</span>
        <span class="pui-main-right__header-menu">消息</span>
        <span class="pui-main-right__header-right">
          <slot name="header-right"></slot>
        </span>
      </pui-header>
      <pui-main class="pui-main-right__right-content"><slot name="right-content"></slot></pui-main>
    </pui-container>
  </pui-main>
</template>

<script>
export default {
  name: "PuiMainRight",
  components: {}
  
};
</script>

<style lang='scss' scoped>
@import "./mainRight.scss";
</style>