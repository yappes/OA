<template>
  <div class="pui-nav-left">
    <div class="pui-nav-left__top-title">{{navLeftTitle}}</div>
    <slot name="search"></slot>
    <aui-menu  class="aui-menu-vertical-demo" router 
      background-color="#2F3748" active-text-color="#26B7AE" 
      :default-active="activeIndex"
      @open="handleOpen"
      @close="handleClose">
      <!-- <aui-submenu index="0"> -->
        <!-- <template slot="title" class="pui-aside__title"><i class="aui-icon-message"></i>消息</template>
          <aui-menu-item index="0-1" class="pui-menu__item">消息列表</aui-menu-item>
          <aui-menu-item index="0-2" class="pui-menu__item">系统公告</aui-menu-item> -->
      <!-- </aui-submenu> -->
      <aui-submenu index="1">
        <template slot="title"><i class="aui-icon-message"></i>用户权限配置</template>
          <aui-menu-item index="departmentUser" class="pui-menu__item">部门/用户</aui-menu-item>
          <aui-menu-item index="rolePermission" class="pui-menu__item">角色/权限</aui-menu-item>
          <aui-menu-item index="customPermission" class="pui-menu__item">自定义权限</aui-menu-item>
      </aui-submenu>
      <aui-submenu index="2">
        <template slot="title"><i class="aui-icon-message"></i>企业配置</template>
          <!-- <aui-menu-item index="parameter" class="pui-menu__item">企业参数</aui-menu-item> -->
          <aui-menu-item index="detail" class="pui-menu__item">企业信息</aui-menu-item>
      </aui-submenu>
      <aui-submenu index="3">
        <template slot="title"><i class="aui-icon-message"></i>系统配置</template>
          <aui-menu-item index="dictionary" class="pui-menu__item">系统字典</aui-menu-item>
      </aui-submenu>
      <aui-submenu index="4">
        <template slot="title"><i class="aui-icon-message"></i>自定义配置</template>
          <aui-menu-item index="modulesInfo" class="pui-menu__item">模块信息</aui-menu-item>
          <aui-menu-item index="modulesSetting" class="pui-menu__item">模块配置管理</aui-menu-item>
          <aui-menu-item index="menuSetting" class="pui-menu__item">菜单设置</aui-menu-item>
      </aui-submenu>
      <aui-submenu index="5">
        <template slot="title"><i class="aui-icon-message"></i>移动端配置</template>
          <aui-menu-item index="mobileView" class="pui-menu__item">视图配置</aui-menu-item>
          <aui-menu-item index="mobileMenu" class="pui-menu__item">菜单配置</aui-menu-item>
      </aui-submenu>
      <aui-submenu index="6">
        <template slot="title"><i class="aui-icon-message"></i>面板中心</template>
          <aui-menu-item index="homePageSetting" class="pui-menu__item">主页管理</aui-menu-item>
          <aui-menu-item index="panelSetting" class="pui-menu__item">面板管理</aui-menu-item>
      </aui-submenu>
      <aui-submenu index="7">
        <template slot="title"><i class="aui-icon-message"></i>任务中心</template>
          <aui-menu-item index="taskManage" class="pui-menu__item">任务管理</aui-menu-item>
          <!-- <aui-menu-item index="taskDetection" class="pui-menu__item">任务监控</aui-menu-item> -->
      </aui-submenu>
      <aui-submenu index="8">
        <template slot="title"><i class="aui-icon-message"></i>流程配置</template>
          <aui-menu-item index="processManageAll" class="pui-menu__item">流程管理</aui-menu-item>
          <aui-menu-item index="workGroup" class="pui-menu__item">工作组</aui-menu-item>
      </aui-submenu>
      <aui-submenu index="9">
        <template slot="title"><i class="aui-icon-message"></i>消息中心</template>
          <aui-menu-item index="messageConfig" class="pui-menu__item">消息配置</aui-menu-item>
          <aui-menu-item index="emailTemplate" class="pui-menu__item">邮件模板</aui-menu-item>
          <aui-menu-item index="smsTemplate" class="pui-menu__item">短信模板</aui-menu-item>
          <aui-menu-item index="tipsTemplate" class="pui-menu__item">提醒模板</aui-menu-item>
      </aui-submenu>
    </aui-menu>
  </div>
</template>
<script>
export default {
  name: "PuiNavLeftAdmin",
  props: ["navLeftTitle", "navLeftList"],
  computed: {
    activeIndex() {
      return this.$route.path.replace("/admin/", "");
    },
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log("打开", key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log("关闭", key, keyPath);
    }
  },
  components: {}
};
</script>
<style lang='scss'>
@import "./navLeft.scss";
</style>
