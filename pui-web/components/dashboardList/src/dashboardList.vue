<template>
  <div class="pui-dashboard-list">
    <pui-list-grid v-if="dashboardData.dataInfo" :columns="dashboardData.dataInfo.columns" :datasource="dashboardData.dataInfo.datasource" :isShowTop="false"></pui-list-grid>
  </div>
</template>

<script>
export default {
  name: "puiDashboardList",

  props: {
    dashboardData: {
      type: Object,
      default: () => {
        return {
          dataInfo: {
            columns: [],
            datasource: {},
          }
        }
      }
    }
  },
};
</script>

<style lang="scss">
@import "./dashboardList.scss";
</style>


