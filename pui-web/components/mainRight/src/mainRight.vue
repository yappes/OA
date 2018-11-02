<template>
  <pui-main class="pui-main-right" style="background:#eef1f5">
    <pui-aside class="pui-main-right__aside">
      <slot name="main-right-aside"></slot>
    </pui-aside>
    <pui-container class="pui-main-right__container">
      <pui-header height="48px" class="pui-main-right__header">
        <span class="pui-main-right__header-title">{{headerTitle}}</span>
        <span class="pui-main-right__header-menu">{{headerMenu}}</span>
        <span class="pui-main-right__header-right">
          <slot name="header-right"></slot>
        </span>
      </pui-header>
      <pui-main class="pui-main-right__right-content">
        <slot name="right-content"></slot>
      </pui-main>
    </pui-container>
  </pui-main>
</template>

<script>
export default {
  name: "PuiMainRight",
  components: {},
  // props: ["headerTitle", "headerMenu"],
  // data() {return { headerTitle:"" } },
  computed: {
    
    headerTitle() {
      return this.$store.getters['adminNav/getHeaderTitle'];
    },
    headerMenu(){
      return this.$store.getters['adminNav/getHeaderMenu'];
    }
  }
};
</script>

<style lang='scss' scoped>
@import "./mainRight.scss";

</style>