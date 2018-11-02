<template>
 <div class="pui-dashboard-custom-text">
    <div>{{dashboardData.content}}</div>
  </div>
</template>

<script>
export default {
  name: 'puiDashboardCustomText',
  props: {
    dashboardData: Object
  },
  data() {
    return {
      
    }
  },
}
</script>

<style lang="scss">
@import './dashboardCustomText.scss'
</style>


