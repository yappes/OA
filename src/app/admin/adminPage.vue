<template>
  <div class="pui-adminPage">
    <pui-container>
      <pui-header>
        <pui-nav-top></pui-nav-top>
      </pui-header>
      <pui-container class="pui-adminPage__container">
        <pui-aside width="229px" :style="{minHeight:Height}">
          <pui-nav-left-admin></pui-nav-left-admin>
        </pui-aside>
        <pui-main-right-admin>
          <router-view slot="right-content" class="right-content" ref="rightContent" :style="{minHeight:rightContentHeight}"></router-view>
        </pui-main-right-admin>
      </pui-container>
    </pui-container>
  </div>
</template>
<script>
export default {
  name: "adminPage",
  components: {},
  data() {
    return {
      Height: "",
      rightContentHeight: "",
      
    }
  },
  mounted() {
    this.setHeight();
    this.rcHeight();
  },
  methods: {
    setHeight() {
      this.Height = window.innerHeight - 48 + "px";
    },
    rcHeight() {
      this. rightContentHeight = window.innerHeight - 48 - 48 - 26 + "px";
    },
  }
};
</script>

<style lang='scss'>
@import "~theme/common/inituseragent";
@import "~theme/common/var";
@import '~theme/icon';
.aui-button {
  border-radius: 0;
}
.pui-main{
  // min-height: 670px;
  background: $--body-bgcolor;
}
.right-content{
  padding:13px 20px;
  margin: 13px 20px;
  background: $--inner-body-bgcolor;
  box-sizing: border-box;
}
.pui-adminPage {
  .pui-adminPage__container {
    min-width: 1200px;
    &>.pui-aside {
    background: $--nav-bgcolor;
  }
  }
}
</style>