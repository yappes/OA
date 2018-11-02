<template>
  <div class="pui-dashboard-custom-url">
    <iframe :src="dashboardData.viewUrl" width="100%" height="100%"></iframe>
  </div>
</template>

<script>
export default {
  name: 'puiDashboardCustomUrl',
  props: {
    dashboardData: Object
  },
}
</script>

<style lang="scss">
@import './dashboardCustomUrl.scss'
</style>


