<template>
  <div class="pui-dashboard-custom-component">
    <div :is="dashboardData.platformName"></div>
  </div>
</template>

<script>
export default {
  name: 'puiDashboardCustomComponent',

  props: {
    dashboardData: Object
  },
}
</script>

<style lang="scss">
@import './dashboardCustomComponent.scss'
</style>


