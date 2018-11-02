<template>
  <div class="pui-dashboard-menu">
    <div class="pui-dashboard-menu__title">
      {{data.dashboardUpTitle}}
    </div>
    <div class="pui-dashboard-menu__number">
      {{data.num}}
    </div>
    <!-- <aui-tabs class="pui-dashboard-menu__tabs" v-model="activeName" @tab-click="handleClick">
      <aui-tab-pane label="本日" name="first"></aui-tab-pane>
      <aui-tab-pane label="本周" name="second"></aui-tab-pane>
      <aui-tab-pane label="本月" name="third"></aui-tab-pane>
    </aui-tabs> -->
    <ul class="pui-dashboard-menu__ul">
      <li v-for="(tab,index) in data.link" :key="index" @click="changeColor(index)"><a href="#" :class="{active: isActive==index}">{{tab.name}}</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "puiDashboardMenu",
  props: {
    data: Object
  },
  data() {
    return {
      isActive: 0
    }
  },
  methods: {
    changeColor(index) {
      this.isActive = index ;
      console.log("this.isActive",this.isActive);
    }
  }
};
</script>

<style lang="scss">
@import "./dashboardMenu.scss";
</style>