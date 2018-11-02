<template>
  <div class="pui-launch-process">
    <aui-table v-loading="loading" class="pui-launch-process__table"  stripe ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <aui-table-column prop="serialNumber" label="序号" fixed  minWidth="50"> </aui-table-column>
      <aui-table-column prop="deploymentName" label="流程名称" show-overflow-tooltip  minWidth="120"> </aui-table-column>
      <aui-table-column prop="categoryName" label="流程分类" show-overflow-tooltip  minWidth="100"> </aui-table-column>
      <aui-table-column prop="description" label="描述" show-overflow-tooltip minWidth="120"> </aui-table-column>
      <aui-table-column prop="deploymentTime" label="部署时间" show-overflow-tooltip  minWidth="160"> </aui-table-column>
      <aui-table-column prop="isSuspended" label="状态" show-overflow-tooltip minWidth="80"> </aui-table-column>
      <aui-table-column  label="发起流程" fixed="right" minWidth="100"> 
        <template slot-scope="scope">
          <aui-button size="mini" @click="handleSend(scope.$index, scope.row)">发起流程</aui-button>
        </template>
      </aui-table-column>
    </aui-table>
    <!-- <div class="pagination-outer"> -->
      <pui-workflow-pagination :currentPage='page.pageNow' :pageSize='page.pageSize' :totalRecord='page.totalRecord'  @select-page="pageChange"
      style="margin-top:30px;margin-right: -18px">
      </pui-workflow-pagination>
    <!-- </div> -->
   
  </div>
</template>

<script>
import pageMixin from "../../mixin/index.js";
import { workflowTaskService,workflowProcessService } from "paas-web-utils/services";
export default {
  name: "PuiLaunchProcess",
  mixins: [pageMixin],
  component: {},
  props: ["categoryCode"],
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      loading:true,
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSend(index, row) {
      console.log(index, row);
      // this.$router.push({'/');
      workflowProcessService.findModelRelByProcessDefinitionId({
        processDefinitionId: row.id
      }).then(data=>{
        console.log('data',data);
        this.$router.push({
        name: "workflowBusiness",
        params: {
          formId: data.viewId,
          processDefinitionId: row.id
        },
        query: {
          taskId: row.id,
          title: row.deploymentName,
          moduleId: data.moduleId,
          type: 'process'
        }
      });
        // this.$router.push(`/workflow/${data.viewId}?type=process&processDefinitionId=${row.id}&title=${row.deploymentName}&moduleId=${data.moduleId}`)
      })

    },
    getTableData() {
      this.loading=true;
      console.log('getTableData', this.page)
      workflowTaskService
        .findPeocessListByCategoryCode({ 
          categoryCode: this.categoryCode,
          pageNow: this.page.pageNow,
          pageSize: this.page.pageSize,
        })
        .then(data => {
          if (data == null || data.record == null) {
            this.tableData = [];
          } else {
            let list = data.record;
            for (let i = 0; i < list.length; i++) {
              list[i].serialNumber = i + 1;
              list[i].deploymentTime = this.switchDate(list[i].deploymentTime);
              list[i].isSuspended =
                list[i].isSuspended == false ? "正常" : "挂起";
            }
            this.tableData = list;
            this.loading=false;
            console.log(list);
            this.updatePage(data)
          }
        });
    },
    switchDate(date) {
      if (date == null) {
        return;
      }
      let myDate = new Date(date);
      let year = myDate.getFullYear();
      let month = myDate.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      let day = myDate.getDate();
      day = day < 10 ? "0" + day : day;
      let hours = myDate.getHours();
      hours = hours < 10 ? "0" + hours : hours;
      let minutes = myDate.getMinutes();
      minutes = minutes < 10 ? "0" + minutes : minutes;
      let seconds = myDate.getSeconds();
      seconds = seconds < 10 ? "0" + seconds : seconds;
      let newDate =
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds;
      return newDate;
    }
  },
  watch: {
    categoryCode() {
      console.log("categoryCode", this.categoryCode);
      this.getTableData();
    }
  }
};
</script>

<style lang="scss">
@import "./launchProcess.scss";
</style>


