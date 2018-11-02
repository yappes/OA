<template>
  <aui-row :gutter="20" type="flex" align="top" class="pui-dashboard-main">
    <pui-dashboard-common :ref="'common_' + dashboard.id" v-for="dashboard in dashboardList" :key="dashboard.id" :dashboardData="dashboard"></pui-dashboard-common>
  </aui-row>
</template>

<script>
export default {
  name:'PuiDashboardMain',
  props:{
    dashboardList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./dashboardMain.scss";
</style>