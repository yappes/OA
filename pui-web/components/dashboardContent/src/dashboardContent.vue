<template>
 <div class="pui-dashboard-content">
    <div>{{dashboardData.dataInfo}}</div>
  </div>
</template>

<script>
export default {
  name: 'puiDashboardContent',
  props: {
    dashboardData: Object
  },
  data(){
    return{
      
    }
  }
}
</script>

<style lang="scss">
@import './dashboardContent.scss'
</style>


