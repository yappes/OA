<template>
  <div class="pui-dashboard-detail">
    <div class="pui-dashboard-detail__outer" v-for="(classes,index) in data" :key="index">
      <div class="pui-dashboard-detail__top">
        <span class="pui-dashboard-detail__class">{{classes.class}}</span>
        <pui-btn class="pui-dashboard-detail__btn" type="primary" :heightStr="heightStr" :widthStr="widthStr">更多</pui-btn>
      </div>
      <pui-dashboard-detail-inter :res="classes.content"></pui-dashboard-detail-inter>
    </div>
  </div>
</template>

<script>
export default {
  name: 'puiDashboardDetail',
  props: {
    data: Array
  },
  data() {
    return {
      heightStr: "30px",
      widthStr: "65px",
    }
  },
 
}
</script>

<style lang="scss">
@import './dashboardDetail.scss'
</style>


