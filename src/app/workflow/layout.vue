<template>
  <div class="pui-home">
    <template v-if="!isEditorLayout">
      <pui-container>
        <pui-header>
          <pui-nav-top></pui-nav-top>
        </pui-header>
        <pui-container style="minWidth:1200px">
          <pui-aside width="229px" class="pui-aside" :style="{minHeight:Height}">
            <!-- <aui-menu router background-color="#2F3748" text-color="#FCFDFF"> -->
            <aui-menu router background-color="#2F3748" active-text-color="#26B7AE" :default-active="activeIndex">
              <aui-submenu index="1">
                <template slot="title">
                  <span slot="title" class="pui-aside__title">
                    <i class="aui-icon-message"></i>流程审批</span>
                </template>
                <aui-menu-item index='/workflow/checkPending' class="pui-aside__item">待审核</aui-menu-item>
                <aui-menu-item index="/workflow/checked" class="pui-aside__item">已审核</aui-menu-item>
                <aui-menu-item index="/workflow/launchProcessAll" class="pui-aside__item">发起流程</aui-menu-item>
              </aui-submenu>
              <aui-submenu index="2">
                <template slot="title">
                  <span slot="title" class="pui-aside__title">
                    <i class="aui-icon-message"></i>我的事务</span>
                </template>
                <aui-menu-item index="/workflow/myChecked" class="pui-aside__item">我发起的审批</aui-menu-item>
                <aui-menu-item index="/workflow/drafts" class="pui-aside__item">草稿箱</aui-menu-item>
              </aui-submenu>
              <!-- <aui-submenu index="3" v-if="isAdmin">
                <template slot="title">
                  <span slot="title" class="pui-aside__title">
                    <i class="aui-icon-message"></i>流程配置</span>
                </template>
                <aui-menu-item index="/workflow/processManageAll" class="pui-aside__item">流程管理</aui-menu-item>
                <aui-menu-item index="/workflow/workGroup" class="pui-aside__item">工作组</aui-menu-item>
                <aui-menu-item index="#" @click="syncEntInfo" class="pui-aside__item">同步用户</aui-menu-item>
              </aui-submenu> -->
            </aui-menu>
          </pui-aside>
          <pui-main-right class="pui-main-right">
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
          </pui-main-right>
        </pui-container>
      </pui-container>
    </template>
    <template v-else>
      <router-view></router-view>
    </template>
  </div>
</template>

<script>
import { workflowAuthService } from "paas-web-utils/services";
import loginUser from "paas-web-utils/services/login-user";
export default {
  name: "home",
  data() {
    return {
      Height: "",
      isAdmin: false
    };
  },
  mounted() {
    this.setHeight();
    loginUser.get().then(user => {
      this.isAdmin = user.isAdmin;
    });
  },
  computed: {
    headerTitle() {
      return this.$store.getters["adminNav/getHeaderTitle"];
    },
    activeIndex() {
      return this.$route.path.replace("", "");
    },
    isEditorLayout() {
      return this.$route.meta.isEditorLayout || false;
    }
  },
  methods: {
    setHeight() {
      this.Height = window.innerHeight - 48 + "px";
    },
    syncEntInfo() {
      console.log(1);
      workflowAuthService.syncEntInfo().then(data => {
        if (data.message == "success!") {
          this.$aui.message.show({
            message: "用户同步成功",
            type: "success"
          });
        } else {
          this.$aui.message.show({
            message: data.msg,
            type: "warning"
          });
        }
      });
    }
  }
  // components: {CheckPending}
};
</script>

<style lang='scss' scoped>
@import "~theme/common/var";
@import "~theme/mixins/utils";

.syc-li {
  cursor: pointer;
  background: $--nav-bgcolor;
  &:hover {
    background: #212838;
    & > .pui-aside__item {
      background: #212838;
      color: #26b7ae;
    }
  }
}
.syc-span {
  padding-left: 40px;
  height: 50px;
  line-height: 1;
  min-width: 200px;
}
.pui-home {
  .pui-aside {
    background: $--nav-bgcolor;
    & > .aui-menu {
      border: 0;
    }
    & .pui-aside__title {
      color: #fcfdff;
    }
    & .pui-aside__item {
      font-family: STHeitiSC-Medium;
      font-size: 14px;
      color: #808da5;
      letter-spacing: 0px;
    }
  }
}
</style>

