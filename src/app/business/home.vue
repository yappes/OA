<template>
   <div class="pui-home">
    <pui-container>
      <pui-header>
        <pui-nav-top></pui-nav-top>
      </pui-header>
      <pui-container>
        <pui-aside width="240px">
          <pui-nav-left  :navLeftTitle="navLeftTitle" :navLeftList="navLeftList"></pui-nav-left>
        </pui-aside>
        <pui-main-right :headerTitle="headerTitle" :headerMenu="headerMenu">
          <!-- <pui-check-pending slot="right-content">待审核</pui-check-pending> -->
          <!-- <pui-checked slot="right-content">已审核</pui-checked>  -->
          <!-- <pui-my-checked slot="right-content">我发起的审批</pui-my-checked> -->
          <!-- <pui-drafts slot="right-content">草稿箱</pui-drafts> -->
          <!-- <pui-work-group slot="right-content">工作组</pui-work-group> -->
          <!-- <pui-launch-process-aside slot="main-right-aside">发起流程左侧</pui-launch-process-aside>
          <pui-launch-process slot="right-content">发起流程</pui-launch-process> -->
          <!-- <pui-processManager-aside slot="main-right-aside">流程管理左侧</pui-processManager-aside> -->
         <!-- <pui-processManager slot="right-content">流程管理</pui-processManager> -->
            <router-view slot="right-content"></router-view>
        </pui-main-right >
      </pui-container>
    </pui-container>
  </div>
</template>

<script>
  import data from "./home.js";
  import CheckPending from '../workflow/checkPending/src/checkPending.vue'
  export default {
    name: "home",
    data: data,
    // components: {CheckPending}
    // created() {
    //   // let s = '@ABS($COL_1)#FIX_2'
    //   let s = '@SUB($COL_1, $COL_2, $COL_3)#FIX_3'
    //   let r = custonFormula.process(s)
    //   console.log(r)
    // }
  };
</script>

<style lang='scss' scoped>
 @import "~theme/common/var";
 @import "~theme/mixins/utils";
</style>

