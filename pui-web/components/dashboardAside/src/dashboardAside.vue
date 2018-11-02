<template>
  <div class="pui-dashboard-aside">
   <pui-dashboard-common  class="pui-dashboard-aside__common" :isList="true" :data="res[0]"></pui-dashboard-common>
   <pui-dashboard-common  class="pui-dashboard-aside__common" :isList="true" :data="res[1]"></pui-dashboard-common>
  </div>
</template>

<script>
export default {
  name:'PuiDashboardAside',
  props: {
    res: Array
  }
}
</script>

<style lang="scss" scoped>
  @import "./dashboardAside.scss";
</style>