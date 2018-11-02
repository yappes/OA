<template>
    <div class="launch-process-all" slot="right-content">
        <!-- <h2 style="padding-left:10px;padding-top:10px">发起流程</h2> -->
        <!-- <launchProcessAside slot="main-right-aside" @categoryCode='handleCategoryCode' style="float:left;width:23%">发起流程左侧</launchProcessAside> -->
        <!-- <launchProcess :categoryCode='categoryCode' style="float:left">发起流程</launchProcess> -->
        <!-- <aui-container>
            <aui-header style="padding:0">
                <h2 style="padding-left:10px;padding-top:10px">发起流程</h2>
            </aui-header> -->
            <aui-container>
                <aui-aside width="285px" style="background:#FFF" :style="{minHeight:minHeight}">
                    <pui-launch-process-aside @categoryCode='handleCategoryCode' :asideMinHeight="minHeight">发起流程左侧</pui-launch-process-aside>
                </aui-aside>
                <aui-main style="margin-left:15px;background:#FFF" :style="{minHeight:minHeight}">
                    <pui-launch-process :categoryCode='categoryCode'>发起流程</pui-launch-process>
                </aui-main>
            </aui-container>
        <!-- </aui-container> -->
    </div>
</template>
<script>
export default {
  data() {
    return {
      categoryCode: undefined,
        minHeight: ""
    };
  },
   created() {
    this.asideHeight();
    this.$store.dispatch("adminNav/changeHeaderTitle", "发起流程");
  },
  methods: {
    handleCategoryCode(categoryCode) {
      //    console.log('cate', categoryCode)
      this.categoryCode = categoryCode;
    },
    asideHeight() {
      this.minHeight = window.innerHeight - 48 - 50 - 30 + "px"; 
    }
  }
};
</script>
<style>
.launch-process-all {
  padding: 15px;
}
</style>
