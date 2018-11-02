<template>
  <div class="pui-drafts">
    <!-- <h2>草稿箱</h2> -->
    <div class="pui-drafts__up" ref="up">
      <div class="pui-drafts__item1">
        <label for="select2" class="pui-drafts__label">流程分类:</label>
        <aui-select v-model="processValue" placeholder="请选择" id="select2">
          <aui-option v-for="item in processClasses" :key="item.processValue" :label="item.label" :value="item.processValue"></aui-option>
        </aui-select>
      </div>
      <div class="pui-drafts__item1">
        <label for="date" class="pui-drafts__label">起始日期:</label>
        <aui-date-picker v-model="dateValue" type="date" id="date" placeholder="选择日期"></aui-date-picker>
      </div>
      <div class="pui-drafts__operations">
        <pui-btn :heightStr="heightStr" :widthStr="widthStr" class="pui-list-grid__oper" @click='onsearch'>查询</pui-btn>
        <pui-btn :heightStr="heightStr" :widthStr="widthStr" class="pui-list-grid__oper"  @click="reset">重置</pui-btn>
      </div>
    </div>
    <div class="pui-drafts__main" :style="{minHeight:minHeight}">
      <div class="pui-drafts__operations">
        <pui-btn :heightStr="heightStr" class="pui-list-grid__oper" @click="operateDrafts('CHECK')" :loading="submitLoading">批量提交草稿</pui-btn>
        <pui-btn :heightStr="heightStr" class="pui-list-grid__oper"  index="delete" @click="operateDrafts('DELETE')" :loading="deletLoading">批量删除草稿</pui-btn>
      </div>
      <div class="pui-drafts__down">
        <aui-tabs v-model="activeName" @tab-click="handleClick">
          <aui-tab-pane label="全部" name="ALL">
            <aui-table @row-click="toDetail" empty-text="暂无数据" v-loading="loading" ref="multipleTable" stripe :data="allTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
              <aui-table-column type="selection" minWidth="40" fixed></aui-table-column>
              <aui-table-column label="操作" minWidth="55" fixed="left" align='center'>
                <template slot-scope="scope">
                  <aui-popover ref="popover1" placement="bottom-start" trigger="hover">
                    <ul>
                      <li class="pui-list-grid__oper-in-row-item" @click="toDetail(scope.row,'','',scope.$index)">详情</li>
                      <li class="pui-list-grid__oper-in-row-item" @click="toEdit(scope.$index, scope.row)">修改</li>
                    </ul>
                  </aui-popover>
                  <i class="pui-icon-fenlei" @click.stop v-popover:popover1></i>
                </template>
              </aui-table-column>
              <aui-table-column prop="serialNumber" label="序号" minWidth="80" fixed> </aui-table-column>
              <aui-table-column prop="title" label="流程标题" show-overflow-tooltip min-width="250"> </aui-table-column>
              <aui-table-column prop="processDefinitionName" label="流程名称" show-overflow-tooltip minWidth="150"> </aui-table-column>
              <aui-table-column prop="categoryName" label="流程分类" show-overflow-tooltip minWidth="150"> </aui-table-column>
              <aui-table-column prop="userName" label="申请人" show-overflow-tooltip minWidth="150"> </aui-table-column>
              <aui-table-column prop="orgName" label="所属部门" show-overflow-tooltip minWidth="150"> </aui-table-column>
              <aui-table-column prop="createTime" label="任务时间" show-overflow-tooltip minWidth="160"> </aui-table-column>
              <aui-table-column prop="approvalStatus" label="分类" show-overflow-tooltip> </aui-table-column>
            </aui-table>
          </aui-tab-pane>
          <aui-tab-pane label="驳回" name="REJECT">
            <aui-table @row-click="toDetail" empty-text="暂无数据" v-loading="loading" ref="multipleTable" stripe :data="allTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
              <aui-table-column type="selection" minWidth="40" fixed></aui-table-column>
              <aui-table-column label="操作" minWidth="55" fixed="left" align='center'>
                <template slot-scope="scope">
                  <aui-popover ref="popover1" placement="bottom-start" trigger="hover">
                    <ul>
                      <li class="pui-list-grid__oper-in-row-item" @click="toDetail(scope.row,'','',scope.$index)">详情</li>
                      <li class="pui-list-grid__oper-in-row-item" @click="toEdit(scope.$index, scope.row)">修改</li>
                    </ul>
                  </aui-popover>
                  <i class="pui-icon-fenlei" @click.stop v-popover:popover1></i>
                </template>
              </aui-table-column>
              <aui-table-column prop="serialNumber" label="序号" minWidth="80" fixed> </aui-table-column>
              <aui-table-column prop="title" label="流程标题" show-overflow-tooltip min-width="250"> </aui-table-column>
              <aui-table-column prop="processDefinitionName" label="流程名称" show-overflow-tooltip minWidth="150"> </aui-table-column>
              <aui-table-column prop="categoryName" label="流程分类" show-overflow-tooltip minWidth="150"> </aui-table-column>
              <aui-table-column prop="userName" label="申请人" show-overflow-tooltip minWidth="150"> </aui-table-column>
              <aui-table-column prop="orgName" label="所属部门" show-overflow-tooltip minWidth="150"> </aui-table-column>
              <aui-table-column prop="createTime" label="任务时间" show-overflow-tooltip> </aui-table-column>
            </aui-table>
          </aui-tab-pane>
          <aui-tab-pane label="草稿" name="DRAFT">
            <aui-table @row-click="toDetail" empty-text="暂无数据" v-loading="loading" ref="multipleTable" stripe :data="allTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
              <aui-table-column type="selection" minWidth="40" fixed></aui-table-column>
              <aui-table-column label="操作" minWidth="55" fixed="left" align='center'>
                <template slot-scope="scope">
                  <aui-popover ref="popover1" placement="bottom-start" trigger="hover">
                    <ul>
                      <li class="pui-list-grid__oper-in-row-item" @click="toDetail(scope.row,'','',scope.$index)">详情</li>
                      <li class="pui-list-grid__oper-in-row-item" @click="toEdit(scope.$index, scope.row)">修改</li>
                    </ul>
                  </aui-popover>
                  <i class="pui-icon-fenlei" @click.stop v-popover:popover1></i>
                </template>
              </aui-table-column>
              <aui-table-column prop="serialNumber" label="序号" minWidth="80" fixed> </aui-table-column>
              <aui-table-column prop="title" label="流程标题" show-overflow-tooltip min-width="250"> </aui-table-column>
              <aui-table-column prop="processDefinitionName" label="流程名称" show-overflow-tooltip minWidth="150"> </aui-table-column>
              <aui-table-column prop="categoryName" label="流程分类" show-overflow-tooltip minWidth="150"> </aui-table-column>
              <aui-table-column prop="userName" label="申请人" show-overflow-tooltip minWidth="150"> </aui-table-column>
              <aui-table-column prop="orgName" label="所属部门" show-overflow-tooltip minWidth="150"> </aui-table-column>
              <aui-table-column prop="createTime" label="任务时间" show-overflow-tooltip> </aui-table-column>
            </aui-table>
          </aui-tab-pane>
        </aui-tabs>
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
export default {
  name: "PuiDrafts",
  mixins: [pageMixin],
  component: {},
  data() {
    return {
      submitLoading:false,
      deletLoading:false,
      processClasses: [],
      processValue: "",
      activeName: "ALL",
      allTableData: [],
      selectType: "ALL",
      heightStr: "35px",
      widthStr: "60px",
      isShow: false,
      dateValue: "",
      taskIds: [],
      record: [],
      loading: true,
      minHeight: ""
    };
  },
  created() {
    this.getLastMonth();
    this.$store.dispatch("adminNav/changeHeaderTitle", "草稿箱");
  },
  mounted() {
    this.getProcessClasses();
    this.getAllTableData();
    this.high();
  },
  methods: {
    onsearch() {
      this.getAllTableData();
    },
    handleSend(index, row) {
      console.log(row);
      // this.$router.push({'/');
    },
    handleClick(tab, event) {
      //console.log(tab,event);
      this.selectType = tab.name;
      this.getAllTableData();
    },
    // 详情
    toDetail(row, event, column,index) {
      console.log(row);
      this.$router.push({
        name: "workflowBusiness",
        params: {
          formId: row.formId,
          processDefinitionId: row.processDefinitionId
        },
        query: {
          processInstanceId: row.processInstanceId,
          recordId: row.businessId,
          type: 'detail',
          hide: 'workflow-form'
        }
      });
      // this.$router.push(
      //   `/workflow/${row.formId}?recordId=${
      //     row.businessId
      //   }&type=detail&hide=workflow-form&processInstanceId=${row.processInstanceId}`
      // );
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
    handleSelectionChange(val) {
      // this.multipleSelection = val ;
      console.log(val);
      this.taskIds = [];
      this.record = [];
      for (let i = 0; i < val.length; i++) {
        this.taskIds.push(val[i].id);
        workflowProcessService
          .findShipInfoByTaskId({ taskId: val[i].id })
          .then(data => {
            this.record.push({});
            this.record[i].moduleId = parseInt(data.moduleId);
            this.record[i].businessId = parseInt(data.businessId);
          });
      }
      console.log("record", this.record);
      console.log("taskIds", this.taskIds);
    },
    // 获取record集合
    // getRecord(){
    //   this.record=[];
    //   for(let i=0;i<this.taskIds.length;i++){
    //     workflowProcessService.findShipInfoByTaskId({taskId:this.taskIds[i]}).then(data=>{
    //       this.record.push({});
    //       this.record[i].moduleId=data.moduleId;
    //       this.record[i].businessId=data.businessId;
    //     })
    //   }
    // },
    // 批量提交和删除草稿
    operateDrafts(type) {
      if (this.taskIds.length == 0) {
        this.$aui.message.show({
          message: "未选择操作对象",
          type: "warning"
        });
      } else {
        if (type == "CHECK") {
          this.submitLoading=true;
          workflowProcessService
            .submitDrafts({ taskIds: this.taskIds, record: this.record })
            .then(data => {
              this.$aui.message.show({
                message: "提交成功",
                type: "success"
              });
              this.getAllTableData();
              this.submitLoading=false;
            });
        } else if (type == "DELETE") {
          this.deletLoading=true;
          workflowProcessService
            .delDrafts({ taskIds: this.taskIds, record: this.record })
            .then(data => {
              this.$aui.message.show({
                message: "删除成功",
                type: "success"
              });
              this.getAllTableData();
              this.deletLoading=false;
            });
        }
      }
    },
    getProcessClasses() {
      workflowCategoryService.findAll().then(data => {
        for (var i = 0; i < data.length; i++) {
          this.processClasses.push({
            label: data[i].categoryName,
            processValue: data[i].categoryCode
          });
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
    reset() {
      this.processValue = "";
      this.getLastMonth();
    },
    getAllTableData() {
      this.loading = true;
      workflowTaskService
        .pageDrafts({
          startTime: this.switchDate(this.dateValue),
          categoryCode: this.processValue,
          selectType: this.selectType,
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
              list[i].createTime = this.switchDate(list[i].createTime);
              list[i].approvalStatus = list[i].approvalStatus == "DRAFT" ? "草稿" : "驳回";
            }
            this.allTableData = list;
            this.updatePage(data);
            this.loading = false;
          }
        });
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
@import "./drafts.scss";
.pui-drafts__label {
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
  
  