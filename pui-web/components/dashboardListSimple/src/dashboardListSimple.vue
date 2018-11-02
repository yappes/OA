<template>
  <div class="pui-dashboard-list-simple">
    <ul class="pui-dashboard-list-simple__list" v-if="dashboardData">
      <li class="list-item" v-for="(item, index) in dashboardData.dataInfo" :key="index">
        <div class="order-num">{{index + 1}}</div>
        <div class="content">
          <div class="title">{{item.title}}</div>
          <div class="desc">{{item.content}}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'puiDashboardListSimple',
  props: {
    dashboardData: Object,
  },
  data(){
    return{
      
    }
  },
  created(){
    
  },
  methods:{
    
  },
}
</script>

<style lang="scss">
@import './dashboardListSimple.scss'
</style>


