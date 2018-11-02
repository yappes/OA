<template>
  <pui-main class="pui-main-right">
    <pui-header height="48px" class="pui-main-right__header">
      <span class="pui-main-right__header-title">{{headerTitle}}</span>
      <!-- <span class="pui-main-right__header-menu">{{menuGroupName}}</span> -->
      <span class="pui-main-right__header-right">
        <slot name="header-right"></slot>
      </span>
    </pui-header>
    <pui-container>
      <pui-aside class="pui-main-right__aside" v-if="$route.name == 'departmentUser'" width="322px">
        <pui-main-right-aside style="height:100%" ></pui-main-right-aside>
      </pui-aside>
      <pui-aside class="pui-main-right__aside" v-if="$route.name == 'dictionary'" width="322px">
        <pui-main-right-dictionary></pui-main-right-dictionary>
      </pui-aside>
      <pui-aside class="pui-main-right__aside" v-if="$route.name == 'menuSetting'" width="322px">
        <pui-main-right-menu></pui-main-right-menu>
      </pui-aside>
      <pui-main class="pui-main-right__right-content">
        <slot name="right-content"></slot>
      </pui-main>
    </pui-container>
  </pui-main>
</template>

<script>
export default {
  name: "PuiMainRightAdmin",
  components: {},
  computed: {
    headerTitle() {
      return this.$store.getters["adminNav/getHeaderTitle"];
    },
    menuGroupName() {
      return this.$store.getters["adminNav/getMenuGroupName"];
    }
  },
  methods: {
    // detailWidth() {
    //   var el = this.$refs.container.$el;
    //   // console.log("111",wid);
    //   if(this.$route.name ===
    //    'detail'||'parameter') {
    //     el.style.width = "100%";
    //   }
    // },
  }
};
</script>

<style lang='scss' scoped>
@import "./mainRight.scss";
.pui-main-right {
  .pui-main-right__aside {
    /deep/ .aui-input__inner {
      border: 0;
    }
  }
}
  
</style>