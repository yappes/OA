<template>
  <div class="pui-dashboard-up">
    <div class="pui-dashboard-up__content" v-for="(item,index) in data" :key="index">
      {{item.class}} <span>{{item.total}}</span> 条
    </div>
  </div>
</template>

<script>
export default {
  name: 'puiDashboardUp',
  props: {
    data: Array
  }
}
</script>

<style lang="scss">
@import "./dashboardUp.scss";
  
</style>