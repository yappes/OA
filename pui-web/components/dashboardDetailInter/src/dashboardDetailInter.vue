<template>
  <div class="pui-dashboard-detail-inter">
    <div class="pui-dashboard-detail-inter__content" v-for="(contents,index) in res" :key="index">
      <span class="pui-dashboard-detail-inter__aside">
        <i class="aui-icon-message"></i>
      </span>
      <div class="pui-dashboard-detail-inter__main">
        <p>{{contents.title}}</p>
        <!-- <p :title="contents.detail">{{contents.detail}}</p> -->
        <aui-tooltip class="item" effect="light" :content="contents.detail" placement="bottom-start">
          <p>{{contents.detail}}</p>
        </aui-tooltip>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "puiDashboardDetailInter",
  props: {
    res: Array
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" > 
@import './dashboardDetailInter.scss';
</style>


