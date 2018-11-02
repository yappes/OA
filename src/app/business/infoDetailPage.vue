<template>
  <div class="pui-infoDetailPage">
    <pui-container>
      <pui-header>
        <pui-nav-top></pui-nav-top>
      </pui-header>
      <pui-container>
        <pui-aside width="240px">
          <pui-nav-left :navLeftTitle="navLeftTitle" :navLeftList="navLeftList"></pui-nav-left>
        </pui-aside>
        <pui-main-right :headerTitle="headerTitle" :headerMenu="headerMenu">
          <pui-message-detail slot="right-content">此处是个列表组件/详情组件</pui-message-detail>
        </pui-main-right>
      </pui-container>
    </pui-container>
  </div>
</template>

<script>

export default {
  name: "infoDetailPage",
  data:function(){
    return {
      headerTitle:"消息列表",
      headerMenu:"消息",
      navLeftTitle:'消息中心',
      navLeftList:[{
        id: 1 , 
        classes: '消息',
        navLeftItem: [
          { index: '1-1', item: '消息列表' },
          { index: '1-2', item: '系统公告' }
       ]
      }]
    }
  },

  components: {}
};
</script>

<style lang='scss'>
@import "~theme/common/var";
@import "~theme/mixins/utils";
</style>
