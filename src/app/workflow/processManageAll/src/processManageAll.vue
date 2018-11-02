<template>
  <div class="manage-all" slot="right-content" style="background: #eef1f5">
      <!-- <h2 style="padding-left:10px;padding-top:10px">流程管理</h2>
      <process-manager-aside slot="main-right-aside" style="float:left;width:280px" @categoryCode='handleCategoryCode'>流程管理左侧</process-manager-aside>
      <process-manager slot="right-content" style="float:left" :categoryCode="categoryCode">流程管理</process-manager> -->
       <!-- <aui-container>
            <aui-header style="padding:0">
                <h2 style="padding-left:10px;padding-top:10px">流程管理</h2>
            </aui-header> -->
            <aui-container>
                <aui-aside width="285px" style="background:#FFF" :style="{minHeight:minHeight}">
                    <process-manager-aside  @categoryCode='handleCategoryCode'>流程管理左侧</process-manager-aside>
                </aui-aside>
                <aui-main style="margin-left:15px;padding:0;background: #FFF" :style="{minHeight:minHeight}">
                   <process-manager  :categoryCode="categoryCode">流程管理</process-manager>
                </aui-main>
            </aui-container>
        <!-- </aui-container> -->
  </div>
</template>
<script>
    import processManager from '../../processManager/src/processManager.vue'
    import processManagerAside from '../../processManagerAside/src/processManagerAside.vue'
    export default {
        data() {
            return { 
                categoryCode: undefined,
                minHeight:''
            }
        },
        created() { 
            this.asideHeight();
            this.$store.dispatch("adminNav/changeHeaderTitle", "流程管理");
            
        },
        methods: {
            handleCategoryCode(categoryCode) {
            //    console.log('cate', categoryCode)
               this.categoryCode = categoryCode
            },
            asideHeight() {
                this.minHeight = window.innerHeight - 48 - 50 - 30 + "px"; 
            }
        },
        components:{
            processManager,processManagerAside
        }
    }
</script>
<style lang="scss" scoped>
@import "~theme/mixins/mixins";
@import "~theme/mixins/utils";
@import "~theme/common/var";

.manage-all{
    /* padding: 15px; */ //工作流页面启用
    padding: 0;  // 后台设置启用
    background: $--body-bgcolor; //标签内样式 后台设置启用
}
</style>
