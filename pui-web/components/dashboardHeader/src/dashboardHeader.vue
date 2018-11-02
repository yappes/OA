<template>
  <div class="pui-dashboard-header">
    <div class="pui-dashboard-header__lf">
      <span>欢迎，{{name}}</span>
      <pui-btn :heightStr="heightStr" :widthStr="widthStr" type="primary">设置您的后台</pui-btn> 
    </div>
    <div class="pui-dashboard-header__rt">天气预报</div>
  </div>
</template>

<script>
export default {
  name:'PuiDashboardHeader',
  props:{
    name:String
  },
  data:function(){
    return {
      heightStr: '45px',
      widthStr: '165px'
    }
  },
  
}
</script>

<style lang="scss" scoped>
@import "./dashboardHeader.scss";
</style>


