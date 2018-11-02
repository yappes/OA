<template>
  <div class="pui-layout">
    <!-- 页面顶部导航插槽 -->
    <slot name='nav'></slot>
    <div class="pui-layout__topBar-wrapper">
      <slot name='topBar'></slot>
    </div>
    <!-- 无左侧导航的主页面布局 -->
    <div class="pui-layout__content">
      <slot name="full"></slot>
      <div class="pui-layout__content-main" v-if="showMain">
        <slot name="main"></slot>
      </div>
      <div class="pui-layout__content-side" v-if="showSide">
        <slot name="side"></slot>
      </div>
    </div>
    <!-- Dialog对话框 -->
    <slot name="dialog"></slot>
  </div>
</template>
<script>
export default {
  name: 'PuiLayout',
  props: {
    withLeftNav: {
      type: Boolean,
      default: false
    }
  },
  computed:{
    showBar(){
      return this.$slots.topBar;
    },
    showMain(){
      return this.$slots.main;
    },
    showSide(){
      return this.$slots.side;
    }
  },
  components: {}
}

</script>
<style lang='scss'>
@import "./layout.scss";

</style>
