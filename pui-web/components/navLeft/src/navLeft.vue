<template>
  <div class="pui-nav-left">
    <div class="pui-nav-left__top-title">{{navLeftTitle}}</div>
    <slot name="search"></slot>
    <aui-menu default-active="2" class="aui-menu-vertical-demo" router="true" @open="handleOpen" @close="handleClose">
      <!-- <aui-submenu index="1">
        <template slot="title"><i class="aui-icon-message"></i>消息</template>
          <aui-menu-item index="1-1">消息列表</aui-menu-item>
          <aui-menu-item index="1-2">系统公告</aui-menu-item>
      </aui-submenu> -->
      <aui-submenu  :index="index+1+''" v-for="(navMenuFirst,index) in navLeftList" :key="index">
        <template slot="title"><i class="aui-icon-message"></i>{{navMenuFirst.classes}}</template>
          <aui-menu-item v-for="(navMenuSecond,key) in navMenuFirst.navLeftItem" :key="key" :index="navMenuSecond.index">{{navMenuSecond.item}}</aui-menu-item>
      </aui-submenu>
    </aui-menu>
  </div>
</template>
<script>
export default {
  name: 'PuiNavLeft',
  props:['navLeftTitle','navLeftList'],
  // data: data,
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  components: {}
}

</script>
<style lang='scss'>
@import './navLeft.scss';

</style>
