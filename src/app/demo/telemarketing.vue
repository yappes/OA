<template>
  <pui-layout class="pui-telemarketing" style="margin-bottom: 15px">
    <pui-nav-top slot="nav"></pui-nav-top>
    <aui-container slot="full" class="pui-dashboard__container">
      <aui-header>
        <div class="pui-dashboard__menu" v-for="(dashboardMenu,index) in dashboardUp" :key="index">
          <pui-dashboard-menu :data="dashboardMenu"></pui-dashboard-menu>
        </div>
      </aui-header>
      <aui-container class="aui-container">
        <aui-main class="pui-telemarketing__main">
          <div v-for="(dashboard,index) in dashboardlists" :key="index" class="pui-telemarketing__dashboard">
            <pui-dashboard-list v-if="dashboard.type=='list'" :data="dashboard"></pui-dashboard-list>
            <pui-dashboard-content v-else-if="dashboard.type=='content'" :data="dashboard"></pui-dashboard-content>
            <pui-dashboard-chart v-else-if="dashboard.type=='chartHistogram'||'chartPie'" :data="dashboard"></pui-dashboard-chart>
            <pui-dashboard-extend v-else-if="dashboard.type=='extend'" :data="dashboard"></pui-dashboard-extend>
          </div>
        </aui-main>
      </aui-container>
    </aui-container>
  </pui-layout>
</template>

<script>
import { workflowModelService } from "paas-web-utils/services";

export default {
  name: "telemarketing",
  components: {},
  data() {
    return {
      config: {
        up: [
          { class: "我发起的审批", total: "5" },
          { class: "待审核", total: "11" },
          { class: "已完成", total: "30" }
          // { class: '我发起的审批', total: '5' },
        ],
        // detail: [
        //   {
        //     class: "我发起的审批",
        //     content: [
        //       { title: "我发起的审批", detail: "我要发起审批啦" },
        //       { title: "我发起的审批", detail: "我要发起审批啦" },
        //       { title: "我发起的审批", detail: "我要发起审批啦" },
        //       { title: "我发起的审批", detail: "我要发起审批啦" },
        //       { title: "我发起的审批", detail: "我要发起审批啦" }
        //     ]
        //   },
        //   {
        //     class: "待审核",
        //     content: [
        //       { title: "待审核", detail: "我要待审核啦" },
        //       { title: "待审核", detail: "我要待审核啦" },
        //       { title: "待审核", detail: "我要待审核啦" },
        //       { title: "待审核", detail: "我要待审核啦" },
        //       {
        //         title: "待审核",
        //         detail: "我要待审核啦我要待审核啦我要待审核啦我要待审核啦"
        //       }
        //     ]
        //   },
        //   {
        //     class: "草稿箱",
        //     content: [
        //       { title: "草稿箱", detail: "像一颗海草海草海草海草，随风飘摇" },
        //       { title: "草稿箱", detail: "只因为在人群中多看了你一眼" },
        //       {
        //         title: "草稿箱",
        //         detail: "他是六世达赖，他是雪域的王，他是世间最美的情郎"
        //       },
        //       {
        //         title: "草稿箱",
        //         detail: "他的一生是一个难以捉摸的迷，也是一个永恒不朽的传奇"
        //       },
        //       {
        //         title: "草稿箱",
        //         detail:
        //           "我生命中的千山万水，任你一一告别，世间事，除了生死，哪一桩不是闲事？"
        //       }
        //     ]
        //   },
        //   {
        //     class: "已完成",
        //     content: [
        //       {
        //         title: "已完成",
        //         detail:
        //           "第一最好不相见，如此便可不相恋。第二最好不相知，如此便可不相思。"
        //       },
        //       {
        //         title: "佛前",
        //         detail:
        //           "我是佛前一朵莲花，我到人世来，被世人所悟，我不是普渡众生的佛，我来寻我今生的情！"
        //       },
        //       {
        //         title: "那一月",
        //         detail:
        //           "自恐多情损梵行，入山又拍误倾城。世间安得双全法，不负如来不负卿！"
        //       },
        //       {
        //         title: "那一年",
        //         detail:
        //           "但曾相见便相知，相见何如不见。安得与君相决绝，免教生死作相思！"
        //       }
        //     ]
        //   }
        // ],
        menu: [
          { label: "1", menuTitle: "发起审批" },
          { label: "2", menuTitle: "一周内审批" },
          { label: "3", menuTitle: "我代理的审批" },
          { label: "4", menuTitle: "流程配置" }
        ]
      },
      dashboardUp: [
        {
          dashboardUpTitle: "待分配数据",
          num: 300,
          link: [
            { label: "1", name: "本日" },
            { label: "2", name: "本周" },
            { label: "3", name: "本月" }
          ]
        },
        {
          dashboardUpTitle: "待电话客户数",
          num: 120,
          link: [
            { label: "1", name: "本日" },
            { label: "2", name: "本周" },
            { label: "3", name: "本月" }
          ]
        },
        {
          dashboardUpTitle: "意向客户数",
          num: 666,
          link: [
            { label: "1", name: "本日" },
            { label: "2", name: "本周" },
            { label: "3", name: "本月" }
          ]
        },
        {
          dashboardUpTitle: "已签约客户",
          num: 2999,
          link: [
            { label: "1", name: "本日" },
            { label: "2", name: "本周" },
            { label: "3", name: "本月" }
          ]
        }
      ],
      dashboardlists: [
        {
          dashboardTitle: "预约金额排行榜",
          order: "1",
          type: "list",
          viewId: "111",
          tabs: [
            { label: "月", name: "first" },
            { label: "日", name: "second" },
            { label: "周", name: "third" }
          ],
          content: [
            { ranking: 1, title: "团队1", detail: "530000" },
            { ranking: 2, title: "团队2", detail: "410000" },
            { ranking: 3, title: "团队3", detail: "230000" },
            { ranking: 4, title: "团队4", detail: "170000" },
            { ranking: 5, title: "团队5", detail: "120000" }
          ]
        },
        {
          dashboardTitle: "扣款金额排行榜",
          order: "2",
          type: "list",
          viewId: "112",
          tabs: [
            { label: "月", name: "first" },
            { label: "日", name: "second" },
            { label: "周", name: "third" }
          ],
          content: [
            { ranking: 1, title: "团队3", detail: "660000" },
            { ranking: 2, title: "团队2", detail: "520000" },
            { ranking: 3, title: "团队1", detail: "300000" },
            { ranking: 4, title: "团队4", detail: "220000" },
            { ranking: 5, title: "团队5", detail: "120000" }
          ]
        },
        {
          dashboardTitle: "个人预约排名",
          order: "3",
          type: "list",
          viewId: "113",
          tabs: [
            { label: "月", name: "first" },
            { label: "日", name: "second" },
            { label: "周", name: "third" }
          ],
          content: [
            { ranking: 1, title: "电销5", detail: "770000" },
            { ranking: 2, title: "电销3", detail: "660000" },
            { ranking: 3, title: "电销1", detail: "560000" },
            { ranking: 4, title: "电销9", detail: "350000" },
            { ranking: 5, title: "电销6", detail: "210000" }
          ]
        },
        {
          dashboardTitle: "个人扣款排名",
          order: "4",
          type: "list",
          viewId: "114",
          tabs: [
            { label: "月", name: "first" },
            { label: "日", name: "second" },
            { label: "周", name: "third" }
          ],
          content: [
            { ranking: 1, title: "电销6", detail: "710000" },
            { ranking: 2, title: "电销9", detail: "630000" },
            { ranking: 3, title: "电销19", detail: "540000" },
            { ranking: 4, title: "电销3", detail: "370000" },
            { ranking: 5, title: "电销7", detail: "270000" }
          ]
        },
        {
          dashboardTitle: "产品周期1-20日",
          order: "5",
          type: "chartHistogram",
          viewId: "115",
          // tabs: [{}],
          production: [
            { value: "选项1", label: "产品1" },
            { value: "选项2", label: "产品2" },
            { value: "选项3", label: "产品3" },
            { value: "选项4", label: "产品4" },
            { value: "选项5", label: "产品5" }                
          ],
          chartData: {
            columns: ["日期", "预约金额", "扣款金额", "剩余金额"],
            rows: [
              { 日期: "01", 预约金额: 4593, 扣款金额: 4293, 剩余金额: 300 },
              { 日期: "02", 预约金额: 4693, 扣款金额: 4093, 剩余金额: 0.78 },
              { 日期: "03", 预约金额: 3693, 扣款金额: 3393, 剩余金额: 0.32 },
              { 日期: "04", 预约金额: 3530, 扣款金额: 3230, 剩余金额: 0.26 },
              { 日期: "05", 预约金额: 2923, 扣款金额: 2623, 剩余金额: 0.76 },
              { 日期: "06", 预约金额: 1723, 扣款金额: 1423, 剩余金额: 0.49 },
              { 日期: "07", 预约金额: 3792, 扣款金额: 3492, 剩余金额: 0.323 },
              { 日期: "08", 预约金额: 4593, 扣款金额: 4293, 剩余金额: 0.78 },
              { 日期: "09", 预约金额: 5593, 扣款金额: 3393, 剩余金额: 0.32 },
              { 日期: "10", 预约金额: 3530, 扣款金额: 3230, 剩余金额: 0.26 },
              { 日期: "11", 预约金额: 3530, 扣款金额: 3230, 剩余金额: 0.26 },
              { 日期: "12", 预约金额: 2923, 扣款金额: 2623, 剩余金额: 0.76 },
              { 日期: "13", 预约金额: 1723, 扣款金额: 1423, 剩余金额: 0.49 },
              { 日期: "14", 预约金额: 3792, 扣款金额: 3492, 剩余金额: 0.323 },
              { 日期: "15", 预约金额: 4593, 扣款金额: 4293, 剩余金额: 0.78 },
              { 日期: "16", 预约金额: 1393, 扣款金额: 1093, 剩余金额: 0.26 },
              { 日期: "18", 预约金额: 2923, 扣款金额: 2623, 剩余金额: 0.76 },
              { 日期: "19", 预约金额: 1723, 扣款金额: 1423, 剩余金额: 0.49 },
              { 日期: "20", 预约金额: 3792, 扣款金额: 3492, 剩余金额: 0.323 }
            ]
          }
        },
        {
          dashboardTitle: "产品剩余",
          order: "6",
          type: "chartPie",
          viewId: "116",
          tabs: [
            // { label: "扣款", name: "first" },
            // { label: "预约", name: "second" }
            { }
          ],
          chartData: {
            columns: ["产品", "剩余金额"],
            rows: [
              { 产品: "理财1", 剩余金额: 1393 },
              { 产品: "理财2", 剩余金额: 3530 },
              { 产品: "理财3", 剩余金额: 2923 },
              { 产品: "理财4", 剩余金额: 1723 },
              { 产品: "理财5", 剩余金额: 3792 },
              { 产品: "理财6", 剩余金额: 4593 }
            ]
          }
        }
      ],
    };
  },
  mounted() {
   
  },
  methods: {
    
  }
};
</script>

<style lang="scss" scoped>
@import "~theme/mixins/mixins";
@import "~theme/mixins/utils";
@import "~theme/common/var";
$--body-bdColor: #e7e7e7;
$--border-padding: 4%;
$--detail-color: #a39c9c;

.pui-telemarketing {
  // & .pui-layout__content {
    // width: 100% !important;
  // }
  .pui-dashboard__container {
    margin: -($--layout-topBar-height) auto 0;
    .aui-header {
      min-height: 115px;
      max-height: 276px;
      height: 0;
      // padding: 30px;
      padding: 0;
      // background: $--inner-body-bgcolor;
      background-color: $--body-bgcolor;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      width: 100%;
    }
    .aui-aside {
      margin: 20px 0;
      background: $--inner-body-bgcolor;
      border: 1px solid $--body-bdColor;
      box-sizing: border-box;
      height: 926px;
    }
    .aui-main {
      padding: 20px 0 0;
      // padding: 0;
      // box-sizing: border-box;
    }
    .pui-dashboard__menu {
      width: 24%;
    }
    .pui-telemarketing__main {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      width: 96%;
      // box-sizing: border-box;
      // min-height: 958px;
      overflow: visible;
      & > .pui-telemarketing__dashboard {
        background: $--inner-body-bgcolor;
        border: 1px solid $--body-bdColor;
        box-sizing: border-box;
        width: 24%;
      }
      // &>.pui-telemarketing__dashboard:nth-child(1),&>.pui-telemarketing__dashboard:nth-child(2) {
      //   width:35%;
      // }
      // &>.pui-telemarketing__dashboard:nth-child(3) {
      //   width:27%;
      // }
      & > .pui-telemarketing__dashboard:nth-child(5),
      & > .pui-telemarketing__dashboard:nth-child(6) {
        width: 49.3%;
        margin-top: 20px;
      }
    }
  }
}

</style>


