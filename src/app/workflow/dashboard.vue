<template>
  <pui-layout class="pui-workflow-dashboard">
    <pui-nav-top slot="nav"></pui-nav-top>
    <aui-container slot="full" class="pui-dashboard__container">
      <aui-header>
        <!-- <li v-for="item in dashboardList" :key="item.id" @click="handleClick4Menu(item.viewId)">
          <pui-dashboard-content data=config> -->
        <pui-dashboard-up class="pui-dashboard-up" :data="config.up"></pui-dashboard-up>
      </aui-header>
      <aui-container class="aui-container">
        <aui-main>
          <pui-dashboard-detail class="pui-dashboard-detail" :data="config.detail"></pui-dashboard-detail>
        </aui-main>
        <aui-aside width="40%">
          <pui-dashboard-right class="pui-dashboard-right" :data="config.menu"></pui-dashboard-right>
        </aui-aside>

      <!-- <li v-for="item in dashboardList" :key="item.id" @click="handleClick4Menu(item.viewId)">
          <if dashboard.type="list">
            <pui-dashboard-list data=dashboard>
              <pui-dashboard-chart data=dashboard>
                <pui-dashboard-content data=dashboard>
                  <pui-dashboard-extend data=dashboard>
               <if dashboard.type="chart">
              <pui-dashboard-c data=config.chart>
          <vfor> -->


      </aui-container>
    </aui-container>
  </pui-layout>
</template>

<script>
import {  workflowModelService } from 'paas-web-utils/services'
  // const dashboardlist = [
  //   {
  //     dashboardTitle:"预约金额排行榜",
  //     order:"1",
  //     type:"list",
  //     viewId:"371",
  //     height:12,
  //     width:50,
  //     buttons:[
  //       {
  //         btnTtile:"",
  //         btnClick:"function",
  //       }
  //     ],
  //     content: [
  //       { title: "审批1", detail: "像一颗海草海草海草海草，随风飘摇" },
  //       { title: "审批2", detail: "只因为在人群中多看了你一眼" },
  //       {
  //         title: "审批3",
  //         detail: "他是六世达赖，他是雪域的王，他是世间最美的情郎"
  //       },
  //       {
  //         title: "审批4",
  //         detail: "他的一生是一个难以捉摸的迷，也是一个永恒不朽的传奇"
  //       },
  //       {
  //         title: "审批5",
  //         detail: "我生命中的千山万水，任你一一告别，世间事，除了生死，哪一桩不是闲事？"
  //       }
  //     ]
  //   },
  //   {
  //     dashboardTitle:"待审核",
  //     type:"chart",
  //     height:12,
  //     width:50,
  //     buttons:[
  //       {
  //         btnTtile:"",
  //         btnClick:"function",
  //       }
  //     ],
  //     content: [
        

  //     ]
  //   },
  //    {
  //     dashboardTitle:"草稿箱",
  //     type:"chart",
  //     height:12,
  //     width:50,
  //     buttons:[
  //       {
  //         btnTtile:"",
  //         btnClick:"function",
  //       }
  //     ],
  //     content: [
        

  //     ]
  //   },
  // ]

export default {
  name: "workflowDashboard",
  components: {},
  // props:{
  //   dashboard:{}
  // },
  data() {
    return {
      config: {
        up: [
          { class: "我发起的审批", total: "5" },
          { class: "待审核", total: "11" },
          { class: "已完成", total: "30" }
          // { class: '我发起的审批', total: '5' },
        ],
        detail: [
          {
            class: "我发起的审批",
            content: [
              { title: "我发起的审批", detail: "我要发起审批啦" },
              { title: "我发起的审批", detail: "我要发起审批啦" },
              { title: "我发起的审批", detail: "我要发起审批啦" },
              { title: "我发起的审批", detail: "我要发起审批啦" },
              { title: "我发起的审批", detail: "我要发起审批啦" }
            ]
          },
          {
            class: "待审核",
            content: [
              { title: "待审核", detail: "我要待审核啦" },
              { title: "待审核", detail: "我要待审核啦" },
              { title: "待审核", detail: "我要待审核啦" },
              { title: "待审核", detail: "我要待审核啦" },
              {
                title: "待审核",
                detail: "我要待审核啦我要待审核啦我要待审核啦我要待审核啦"
              }
            ]
          },
          {
            class: "草稿箱",
            content: [
              { title: "草稿箱", detail: "像一颗海草海草海草海草，随风飘摇" },
              { title: "草稿箱", detail: "只因为在人群中多看了你一眼" },
              {
                title: "草稿箱",
                detail: "他是六世达赖，他是雪域的王，他是世间最美的情郎"
              },
              {
                title: "草稿箱",
                detail: "他的一生是一个难以捉摸的迷，也是一个永恒不朽的传奇"
              },
              {
                title: "草稿箱",
                detail:
                  "我生命中的千山万水，任你一一告别，世间事，除了生死，哪一桩不是闲事？"
              }
            ]
          },
          {
            class: "已完成",
            content: [
              {
                title: "已完成",
                detail:
                  "第一最好不相见，如此便可不相恋。第二最好不相知，如此便可不相思。"
              },
              {
                title: "佛前",
                detail:
                  "我是佛前一朵莲花，我到人世来，被世人所悟，我不是普渡众生的佛，我来寻我今生的情！"
              },
              {
                title: "那一月",
                detail:
                  "自恐多情损梵行，入山又拍误倾城。世间安得双全法，不负如来不负卿！"
              },
              {
                title: "那一年",
                detail:
                  "但曾相见便相知，相见何如不见。安得与君相决绝，免教生死作相思！"
              }
            ]
          }
        ],
        menu: [
          { label: "1", menuTitle: "发起审批" },
          { label: "2", menuTitle: "一周内审批" },
          { label: "3", menuTitle: "我代理的审批" },
          { label: "4", menuTitle: "流程配置" }
        ]
      },
      paocessStatus: '',
      processName: "",
      categoryCode: ""
    };
  },
  mounted() {
    this.getData(); 
  },
  methods: {
    getData() {
      workflowModelService
        .findList({
          state: this.processStatus,
          categoryCode: this.categoryCode,
          processName: this.processName,
          // pageNow: this.page.pageNow,
          // pageSize: this.page.pageSize
        })
        .then(data => {
          console.log("获取到的数据",data);
        })
    }
     
  }
 
};
</script>

<style lang="scss" scoped>
@import "~theme/mixins/mixins";
@import "~theme/mixins/utils";
@import "~theme/common/var";
  $--body-bdColor: #E7E7E7;
  $--border-padding: 4%;
  $--detail-color: #a39c9c;
.pui-workflow-dashboard {
  .pui-dashboard__container {
    margin: -($--layout-topBar-height) auto 30px;
    .aui-header {
      min-height: 138px;
      max-height: 276px;
      padding: 0;
    }
    .aui-aside {
      margin: 20px 0;
      background: $--inner-body-bgcolor;
      border: 1px solid $--body-bdColor;
      box-sizing: border-box;
      height: 926px;
    }
    .aui-main {
      padding: 20px 20px 20px 0;
    }
  }
}
</style>


