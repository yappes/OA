<template>
  <div class="pui-my-checked">
    <!-- <h2>我发起的审批</h2> -->
    <div class="pui-my-checked__up" ref="up">
      <div class="pui-my-checked__item">
        <label for="date" class="pui-my-checked__label">申请起始日期:</label>
        <aui-date-picker v-model="dateValue" type="date" id="date" placeholder="选择日期" :picker-options="pickerOptions"></aui-date-picker>
      </div>
      <div class="pui-my-checked__item">
        <label for="select2" class="pui-my-checked__label">流程分类:</label>
        <aui-select v-model="processValue" placeholder="请选择" id="select2">
          <aui-option v-for="item in processClasses" :key="item.processValue" :label="item.label" :value="item.processValue"></aui-option>
        </aui-select>
      </div>
      <div class="pui-drafts__operations">
        <pui-btn :heightStr="heightStr" :widthStr="widthStr" class="pui-list-grid__oper" @click='onsearch'>查询</pui-btn>
        <pui-btn :heightStr="heightStr" :widthStr="widthStr" class="pui-list-grid__oper"  @click="reset">重置</pui-btn>
      </div>
    </div>
    <div class="pui-my-checked__main" :style="{minHeight:minHeight}">
      <div class="pui-my-checked__down">
        <aui-tabs v-model="activeName" @tab-click="handleClick">
          <aui-tab-pane label="全部" name="ALL">
            <aui-table empty-text="暂无数据" @row-click="toDetail" v-loading="loading" ref="multipleTable" stripe :data="allTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
              <aui-table-column type="selection" minWidth="40" fixed="left"></aui-table-column>
              <!--<aui-table-column label="操作" minWidth="55" fixed="left" align='center'>
                <template slot-scope="scope">
                  <aui-popover ref="popover1" placement="bottom-start" trigger="hover">
                    <ul>
                      <li class="pui-list-grid__oper-in-row-item" @click="toDetail(scope.row,'','',scope.$index)">详情</li>
                    </ul>
                  </aui-popover> 
                  <i class="pui-icon-fenlei" @click.stop v-popover:popover1></i>
                </template>
              </aui-table-column>-->
              <aui-table-column prop="serialNumber" label="序号" minWidth="80" fixed="left"> </aui-table-column>
              <aui-table-column prop="title" label="流程标题" show-overflow-tooltip min-width="250"> </aui-table-column>
              <aui-table-column prop="processDefinitionName" label="流程名称" show-overflow-tooltip minWidth="120"> </aui-table-column>
              <aui-table-column prop="categoryName" label="流程分类" show-overflow-tooltip minWidth="120"> </aui-table-column>
              <aui-table-column prop="taskAssigneeList" label="当前审批人" show-overflow-tooltip minWidth="120"> </aui-table-column>
              <aui-table-column prop="createTime" label="任务时间" show-overflow-tooltip minWidth="160"> </aui-table-column>
              <aui-table-column prop="endTime" label="结束时间" show-overflow-tooltip minWidth="160"> </aui-table-column>
              <aui-table-column prop="approveStatus" label="审批状态" show-overflow-tooltip> </aui-table-column>
            </aui-table>
          </aui-tab-pane>
          <aui-tab-pane label="已结束" name="COMPLETE">
            <aui-table empty-text="暂无数据" @row-click="toDetail" v-loading="loading" ref="multipleTable" stripe :data="allTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
              <aui-table-column type="selection" minWidth="40" fixed="left"></aui-table-column>
              <aui-table-column label="操作" minWidth="55" fixed="left" align='center'>
                <template slot-scope="scope">
                  <aui-popover ref="popover1" placement="bottom-start" trigger="hover">
                    <ul>
                      <!-- <li class="pui-list-grid__oper-in-row-item" @click="toDetail(scope.row,'','',scope.$index)">详情</li> -->
                      <li class="pui-list-grid__oper-in-row-item" @click="toEdit(scope.$index, scope.row)">修改</li>
                    </ul>
                  </aui-popover>
                  <i class="pui-icon-fenlei" @click.stop v-popover:popover1></i>
                </template>
              </aui-table-column>
              <aui-table-column prop="serialNumber" label="序号" minWidth="80" fixed="left"> </aui-table-column>
              <aui-table-column prop="title" label="流程标题" show-overflow-tooltip min-width="250"> </aui-table-column>
              <aui-table-column prop="processDefinitionName" label="流程名称" show-overflow-tooltip minWidth="120"> </aui-table-column>
              <aui-table-column prop="categoryName" label="流程分类" show-overflow-tooltip minWidth="120"> </aui-table-column>
              <aui-table-column prop="taskAssigneeList" label="当前审批人" show-overflow-tooltip minWidth="120"> </aui-table-column>
              <aui-table-column prop="createTime" label="任务时间" show-overflow-tooltip minWidth="160"> </aui-table-column>
              <aui-table-column prop="endTime" label="结束时间" show-overflow-tooltip minWidth="160"> </aui-table-column>
              <aui-table-column prop="approveStatus" label="审批状态" show-overflow-tooltip> </aui-table-column>
            </aui-table>
          </aui-tab-pane>
          <aui-tab-pane label="审核中" name="PENDING">
            <aui-table @row-click="toDetail" empty-text="暂无数据" v-loading="loading" ref="multipleTable" stripe :data="allTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
              <aui-table-column type="selection" minWidth="40" fixed="left"></aui-table-column>
              <aui-table-column label="操作" minWidth="55" fixed="left" align='center'>
                <template slot-scope="scope">
                  <aui-popover ref="popover1" placement="bottom-start" trigger="hover">
                    <ul>
                      <!-- <li class="pui-list-grid__oper-in-row-item" @click="toDetail(scope.row,'','',scope.$index)">详情</li> -->
                      <li class="pui-list-grid__oper-in-row-item" @click="toEdit(scope.$index, scope.row)">修改</li>
                    </ul>
                  </aui-popover>
                  <i class="pui-icon-fenlei" @click.stop v-popover:popover1></i>
                </template>
              </aui-table-column>
              <aui-table-column prop="serialNumber" label="序号" minWidth="80" fixed="left"> </aui-table-column>
              <aui-table-column prop="title" label="流程标题" show-overflow-tooltip min-width="250"> </aui-table-column>
              <aui-table-column prop="processDefinitionName" label="流程名称" show-overflow-tooltip minWidth="120"> </aui-table-column>
              <aui-table-column prop="categoryName" label="流程分类" show-overflow-tooltip minWidth="120"> </aui-table-column>
              <aui-table-column prop="taskAssigneeList" label="当前审批人" show-overflow-tooltip minWidth="120"> </aui-table-column>
              <aui-table-column prop="createTime" label="任务时间" show-overflow-tooltip minWidth="160"></aui-table-column>
              <aui-table-column prop="endTime" label="结束时间" show-overflow-tooltip minWidth="160"> </aui-table-column>
              <aui-table-column prop="approveStatus" label="审批状态" show-overflow-tooltip> </aui-table-column>
            </aui-table>
          </aui-tab-pane>
        </aui-tabs>
        <!-- <pui-pagination style="margin-top:30px;"></pui-pagination> -->
        <pui-workflow-pagination :currentPage='page.pageNow' :pageSize='page.pageSize' :totalRecord='page.totalRecord' @select-page="pageChange" style="margin-top:30px;">
        </pui-workflow-pagination>

      </div>
    </div>

  </div>
</template>

<script>
import pageMixin from "../../mixin/index.js";
import {
  workflowTaskService,
  workflowCategoryService,
  workflowProcessService
} from "paas-web-utils/services";
import data from "./data.js";
export default {
  name: "PuiMyChecked",
  mixins: [pageMixin],
  component: {},
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      processClasses: [],
      processValue: "",
      dateValue: "",
      departmentValue: "",
      heightStr: "35px",
      widthStr: "60px",
      isShow: false,
      activeName: "ALL",
      allTableData: [],
      dateValue: "",
      approvalStatus: "ALL",
      loading: true,
      minHeight: ""
    };
  },

  mounted() {
    this.getProcessClasses();
    this.getAllTableData();
    this.high();
  },
  created() {
    this.getLastMonth();
    this.$store.dispatch("adminNav/changeHeaderTitle", "我发起的审批");
  },
  methods: {
    change() {
      console.log(1);
    },
    onsearch() {
      this.getAllTableData();
      console.log(this.dateValue);
    },
    handleClick(tab, event) {
      this.approvalStatus = tab.name;
      this.getAllTableData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 详情
    toDetail(row, event, column,index) {
      console.log(row);
      workflowProcessService
        .findModelRelByProcessDefinitionId({
          processDefinitionId: row.processDefinitionId
        }).then(data => {
          console.log(data);
          this.$router.push({
            name: "workflowBusiness",
            params: {
              formId: data.viewLookId,
              processDefinitionId: row.processDefinitionId
            },
            query: {
              processInstanceId: row.processInstanceId,
              taskId: row.id,
              recordId: row.businessId,
              type: "detail"
            }
          });
          // this.$router.push(
          //   `/workflow/${data.viewLookId}?recordId=${
          //     row.businessId
          //   }&type=detail&processInstanceId=${row.processInstanceId}`
          // );
        });
      // this.$router.push(`/workflow/${row.formId}?bussinessId=${row.businessId}&type=detail`)
    },
    toEdit(index, row) {
      this.$router.push({
        name: "workflowBusiness",
        params: {
          formId: row.formId,
          processDefinitionId: row.processDefinitionId
        },
        query: {
          recordId: row.businessId,
          businessId: row.businessId,
          taskId: row.id,
          title: row.title,
          level: row.level,
          moduleId: row.moduleId,
          currentGroup: row.currentGroup,
          processInstanceId: row.processInstanceId,
          type: 'edit'
        }
      });
      // this.$router.push(
      //   `/workflow/${row.formId}?recordId=${row.businessId}&type=edit&taskId=${
      //     row.id
      //   }&businessId=${row.businessId}&title=${row.title}&level=${
      //     row.level
      //   }&currentGroup=${row.currentGroup}&moduleId=${
      //     row.moduleId
      //   }&processInstanceId=${row.processInstanceId}`
      // );
    },
    getProcessClasses() {
      workflowCategoryService.findAll().then(data => {
        for (var i = 0; i < data.length; i++) {
          this.processClasses.push({
            label: data[i].categoryName,
            processValue: data[i].categoryCode
          });
        }
        console.log(this.processClasses);
      });
    },
    reset() {
      this.processValue = "";
      this.getLastMonth();
    },
    getAllTableData() {
      this.loading = true;
      workflowTaskService
        .pageUserApproval({
          startTime: this.switchDate(this.dateValue),
          approvalStatus: this.approvalStatus,
          categoryCode: this.processValue,
          pageNow: this.page.pageNow,
          pageSize: this.page.pageSize
        })
        .then(data => {
          if (data == null || data.record == null) {
            this.allTableData = [];
            this.loading = false;
          } else {
            let list = data.record;
            for (var i = 0; i < list.length; i++) {
              list[i].operations = [
                { id: 1, name: "详情" },
                { id: 2, name: "修改" }
              ];
              list[i].serialNumber = i + 1;
              if (list[i].taskAssigneeList == null) {
                list[i].taskAssigneeList = "";
              } else if (typeof list[i].taskAssigneeList == Array) {
                list[i].taskAssigneeList = list[i].taskAssigneeList.join(" ");
              }
              list[i].createTime = this.switchDate(list[i].createTime);
              list[i].endTime = this.switchDate(list[i].endTime);
              switch (list[i].approvalStatus) {
                case "DRAFTS":
                  list[i].approveStatus = "草稿箱";
                  break;
                case "PENDING":
                  list[i].approveStatus = "审批中";
                  break;
                case "COMPLETE":
                  list[i].approveStatus = "已完成";
                  break;
              }
            }
            this.allTableData = list;
            this.updatePage(data);
            this.loading = false;
          }
        });
    },
    getLastMonth() {
      var myDate = new Date();
      let year = myDate.getFullYear();
      let month = myDate.getMonth();
      month = month < 10 ? "0" + month : month;
      let hours = myDate.getHours();
      hours = hours < 10 ? "0" + hours : hours;
      let minutes = myDate.getMinutes();
      minutes = minutes < 10 ? "0" + minutes : minutes;
      let seconds = myDate.getSeconds();
      seconds = seconds < 10 ? "0" + seconds : seconds;
      if (month == "0") {
        month = 12;
        year = year - 1;
      }
      let day = myDate.getDate();
      day = day < 10 ? "0" + day : day;
      this.dateValue =
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
      console.log(this.dateValue);
    },
    switchDate(date) {
      if (!date || date == null || date == "") {
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
    },
    high() {
      var height = this.$refs.up.offsetHeight;
      this.minHeight = window.innerHeight - height - 48 - 50 - 45 + "px";
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./myChecked.scss";
.pui-checked__label {
  display: inline-block;
  width: 100px;
  text-align: right;
}
.pui-list-grid__oper-in-row-item {
  padding: 5px 10px;
  margin: 0 -12px;
  line-height: 24px;
  // line-height: 18px;
  // height: 24px;
  box-sizing: border-box;
  &:hover {
    // background-color: $--color-primary;
    // color: $--color-white;
    background-color: #e5f9f7;
  }
}
</style>


