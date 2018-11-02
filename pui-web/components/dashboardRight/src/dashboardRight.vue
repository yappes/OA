<template>
  <div class="pui-dashboard-right">
    <dl class="pui-dashboard-right__dl">
      <dt>快捷导航</dt>
      <dd v-for="(condition,index) in data" :key="index" class="pui-dashboard-right__dd">
        <a class="pui-dashboard-right__a" href="#">
          <i class="aui-icon-arrow-left"></i>
          {{condition.menuTitle}}
        </a> 
      </dd>
    </dl>
  </div>
</template>

<script>
export default {
  name: 'puiDashboardRight',
  props: {
    data: Array,
  }
}
</script>

<style lang="scss">
@import './dashboardRight.scss';
</style>