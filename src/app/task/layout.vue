<template>
  <div class="pui-home">
    <template v-if="!isEditorLayout">
      <pui-container>
        <pui-header>
          <pui-nav-top></pui-nav-top>
        </pui-header>
        <pui-container style="minWidth:1200px">
          <pui-aside width="229px" class="pui-aside" :style="{minHeight:Height}">
            <aui-menu router background-color="#2F3748" active-text-color="#26B7AE" :default-active="activeIndex">
              <aui-submenu index="1">
                <template slot="title">
                  <span slot="title" class="pui-aside__title">
                    <i class="aui-icon-message"></i>任务中心</span>
                </template>
                <aui-menu-item index='/task/manage' class="pui-aside__item">任务管理</aui-menu-item>
                <aui-menu-item index="/task/detection" class="pui-aside__item">任务监控</aui-menu-item>
              </aui-submenu>
            </aui-menu>
          </pui-aside>
          <!-- <div>
            <router-view slot="right-content"></router-view>
          </div> -->
          <pui-main-right class="pui-main-right">
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
  },
  computed: {
    // headerTitle() {
    //   return this.$store.getters["adminNav/getHeaderTitle"];
    // },
    activeIndex() {
      console.log(this.$route.path)
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
  }
};
</script>

<style lang='scss' scoped>
@import "~theme/common/var";
@import "~theme/mixins/utils";

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

