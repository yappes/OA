<template>
  <div class="pui-checked" slot="right-content">
    <!-- <h2 @click="getOrgAll">已审核</h2> -->
    <div class="pui-checked__up" ref="up">
      <div class="pui-checked__item">
        <label for="input" class="pui-checked__label">申请人:</label>
        <aui-input type="text" placeholder="选择成员" id="input" v-model="myMembers" @focus="dialogEditMember=true"></aui-input>
      </div>
      <div class="pui-checked__item">
        <label for="date" class="pui-checked__label">申请起始日期:</label>
        <aui-date-picker v-model="dateValue" type="date" id="date" placeholder="选择日期"></aui-date-picker>
      </div>
      <div class="pui-checked__item">
        <label for="select2" class="pui-checked__label">流程分类:</label>
        <aui-select v-model="processValue" placeholder="请选择" id="select2">
          <aui-option v-for="item in processClasses" :key="item.processValue" :label="item.label" :value="item.processValue"></aui-option>
        </aui-select>
      </div>
      <div class="pui-checked__item">
        <label for="select3" class="pui-checked__label">所属部门:</label>
        <aui-select v-model="departmentValue" placeholder="请选择" id="select3">
          <aui-option v-for="item in department" :key="item.departmentValue" :label="item.label" :value="item.departmentValue"></aui-option>
        </aui-select>
      </div>
      <div class="pui-drafts__operations">
        <pui-btn :heightStr="heightStr" :widthStr="widthStr" class="pui-list-grid__oper" @click='getAllTableData'>查询</pui-btn>
        <pui-btn :heightStr="heightStr" :widthStr="widthStr" class="pui-list-grid__oper" @click="reset">重置</pui-btn>
      </div>
    </div>
    <div class="pui-check-pending__main" :style="{minHeight:minHeight}">
      <div class="pui-checked__down">
        <aui-tabs v-model="activeName" @tab-click="handleClick">
          <aui-tab-pane label="全部" name="ALL">
            <aui-table @row-click="toDetail" empty-text="暂无数据" v-loading="loading" ref="multipleTable" stripe :data="allTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
              <aui-table-column type="selection" minWidth="40" fixed></aui-table-column>
              <aui-table-column label="操作" minWidth="55" fixed="left" align='center'>
                <template slot-scope="scope">
                  <aui-popover ref="popover1" placement="bottom-start" trigger="hover">
                    <ul>
                      <li class="pui-list-grid__oper-in-row-item" @click="toDetail(scope.row,'','',scope.$index)">详情</li>
                      <!-- <li class="pui-list-grid__oper-in-row-item" @click="toEdit(scope.$index, scope.row)">修改</li> -->
                    </ul>
                  </aui-popover>
                  <i class="pui-icon-fenlei" @click.stop v-popover:popover1></i>
                </template>
              </aui-table-column>
              <aui-table-column prop="serialNumber" label="序号" minWidth="80" fixed> </aui-table-column>
              <aui-table-column prop="title" label="流程标题" show-overflow-tooltip min-width="250"> </aui-table-column>
              <aui-table-column prop="processDefinitionName" label="流程名称" show-overflow-tooltip minWidth="120"> </aui-table-column>
              <aui-table-column prop="categoryName" label="流程分类" show-overflow-tooltip minWidth="120"> </aui-table-column>
              <aui-table-column prop="userName" label="申请人" show-overflow-tooltip minWidth="120"> </aui-table-column>
              <aui-table-column prop="orgName" label="所属部门" show-overflow-tooltip minWidth="120"> </aui-table-column>
              <aui-table-column prop="createTime" label="任务时间" show-overflow-tooltip minWidth="160"> </aui-table-column>
              <aui-table-column prop="endTime" label="处理时间" show-overflow-tooltip minWidth="160"> </aui-table-column>
              <aui-table-column prop="isAgent" label="是否代理" show-overflow-tooltip minWidth="120"> </aui-table-column>
              <aui-table-column prop="approveStatus" label="审批状态" show-overflow-tooltip> </aui-table-column>
            </aui-table>
          </aui-tab-pane>
          <aui-tab-pane label="本人" name="ME">
            <aui-table @row-click="toDetail" empty-text="暂无数据" v-loading="loading" ref="multipleTable" stripe :data="allTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
              <aui-table-column type="selection" minWidth="40" fixed></aui-table-column>
              <aui-table-column label="操作" minWidth="55" fixed="left" align='center'>
                <template slot-scope="scope">
                  <aui-popover ref="popover1" placement="bottom-start" trigger="hover">
                    <ul>
                      <li class="pui-list-grid__oper-in-row-item" @click="toDetail(scope.row,'','',scope.$index)">详情</li>
                      <!-- <li class="pui-list-grid__oper-in-row-item" @click="toEdit(scope.$index, scope.row)">修改</li> -->
                    </ul>
                  </aui-popover>
                  <i class="pui-icon-fenlei" @click.stop v-popover:popover1></i>
                </template>
              </aui-table-column>
              <aui-table-column prop="serialNumber" label="序号" minWidth="80" fixed> </aui-table-column>
              <aui-table-column prop="title" label="流程标题" show-overflow-tooltip min-width="250"> </aui-table-column>
              <aui-table-column prop="processDefinitionName" label="流程名称" show-overflow-tooltip minWidth="120"> </aui-table-column>
              <aui-table-column prop="categoryName" label="流程分类" show-overflow-tooltip minWidth="120"> </aui-table-column>
              <aui-table-column prop="userName" label="申请人" show-overflow-tooltip minWidth="120"> </aui-table-column>
              <aui-table-column prop="orgName" label="所属部门" show-overflow-tooltip minWidth="120"> </aui-table-column>
              <aui-table-column prop="createTime" label="任务时间" show-overflow-tooltip minWidth="160"> </aui-table-column>
              <aui-table-column prop="endTime" label="处理时间" show-overflow-tooltip minWidth="160"> </aui-table-column>
              <aui-table-column prop="isAgent" label="是否代理" show-overflow-tooltip minWidth="120"> </aui-table-column>
              <aui-table-column prop="approveStatus" label="审批状态" show-overflow-tooltip> </aui-table-column>
            </aui-table>
          </aui-tab-pane>
          <aui-tab-pane label="代理" name="AGENT">
            <aui-table @row-click="toDetail" empty-text="暂无数据" v-loading="loading" ref="multipleTable" stripe :data="allTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
              <aui-table-column type="selection" minWidth="40" fixed></aui-table-column>
              <aui-table-column label="操作" minWidth="55" fixed="left" align='center'>
                <template slot-scope="scope">
                  <aui-popover ref="popover1" placement="bottom-start" trigger="hover">
                    <ul>
                      <li class="pui-list-grid__oper-in-row-item" @click="toDetail(scope.row,'','',scope.$index)">详情</li>
                      <!-- <li class="pui-list-grid__oper-in-row-item" @click="toEdit(scope.$index, scope.row)">修改</li> -->
                    </ul>
                  </aui-popover>
                  <i class="pui-icon-fenlei" @click.stop v-popover:popover1></i>
                </template>
              </aui-table-column>
              <aui-table-column prop="serialNumber" label="序号" minWidth="80" fixed> </aui-table-column>
              <aui-table-column prop="title" label="流程标题" show-overflow-tooltip min-width="250"> </aui-table-column>
              <aui-table-column prop="processDefinitionName" label="流程名称" show-overflow-tooltip minWidth="120"> </aui-table-column>
              <aui-table-column prop="categoryName" label="流程分类" show-overflow-tooltip minWidth="120"> </aui-table-column>
              <aui-table-column prop="userName" label="申请人" show-overflow-tooltip minWidth="120"> </aui-table-column>
              <aui-table-column prop="orgName" label="所属部门" show-overflow-tooltip minWidth="120"> </aui-table-column>
              <aui-table-column prop="createTime" label="任务时间" show-overflow-tooltip minWidth="160"> </aui-table-column>
              <aui-table-column prop="endTime" label="处理时间" show-overflow-tooltip minWidth="160"> </aui-table-column>
              <aui-table-column prop="isAgent" label="是否代理" show-overflow-tooltip minWidth="120" > </aui-table-column>
              <aui-table-column prop="approveStatus" label="审批状态" show-overflow-tooltip> </aui-table-column>
            </aui-table>
          </aui-tab-pane>
        </aui-tabs>
        <pui-workflow-pagination :currentPage='page.pageNow' :pageSize='page.pageSize' :totalRecord='page.totalRecord' @select-page="pageChange" style="margin-top:30px;">
        </pui-workflow-pagination>
        <!-- 申请人 -->
        <aui-dialog title="选择成员" :visible.sync="dialogEditMember" :close-on-click-modal="false" width="80%">
          <aui-form :inline="true" label-width="100px" class="demo-form-inline" style="width:100%">
            <aui-form-item label="当前成员">
              <aui-input v-model="myMembers" :disabled="true" placeholder="当前成员" style="width:300%"></aui-input>
              <!--<aui-button type="text" :disabled="showTreeTable" @click='onClearMember'>选择成员</aui-button>-->
            </aui-form-item>
          </aui-form>
          <div class="showMembers">
            <aui-form :inline="true" label-width="100px" style="width:100%" class="demo-form-inline">
              <aui-form-item style="width:30%">
                <aui-input placeholder="输入组织部门进行过滤" style="float:left;width:120%;" v-model="filterText">
                </aui-input>
              </aui-form-item>
              <aui-form-item label="按姓名搜索" style="width: 60%;float:right">
                <span @keyup.enter="findUserByName">
                  <aui-input style="width:260px;" v-model="member" placeholder="请输入申请人姓名"></aui-input>
                </span>
                <aui-button type="text" @click='findUserByName'>搜 索</aui-button>
              </aui-form-item>
            </aui-form>
            <aui-tree class="filter-tree" style="border:none;float:left;height:245px;width:30%;overflow-y:auto;" :data="treeData" default-expand-all ref="tree2" highlight-current @node-click="handleNodeClick">
            </aui-tree>

            <aui-table ref="memberTable" :data="memberMessage" stripe tooltip-effect="dark" style="width: 60%;margin-left:35%;overflow-y:auto; overflow-x:hidden;height:260px" @select="select" @select-all="selectAll" @selection-change='handleSelect'>
              <aui-table-column type="selection" width="30px"> </aui-table-column>
              <aui-table-column label="姓名" prop="userName">
              </aui-table-column>
              <aui-table-column prop="email" label="邮箱">
              </aui-table-column>
            </aui-table>
          </div>
          <div slot="footer" class="dialog-footer">
            <aui-button :plain="true" @click="cancleCheck">取 消</aui-button>
            <aui-button type="primary" @click="dialogEditMember=false">确 定</aui-button>
          </div>
        </aui-dialog>
      </div>
    </div>

  </div>
</template>

<script>
import pageMixin from "../../mixin/index.js";
import {
  workflowCategoryService,
  workflowTaskService,
  workflowAuthService,
  workflowProcessService
} from "paas-web-utils/services";
export default {
  name: "PuiChecked",
  mixins: [pageMixin],
  component: {},
  data() {
    return {
      dateValue: "",
      input: "",
      departmentValue: "",
      department: [],
      processClasses: [],
      processValue: "",
      heightStr: "35px",
      widthStr: "60px",
      isShow: false,
      activeName: "ALL",
      allTableData: [],
      selectType: "ALL",
      dialogEditMember: false,
      filterText: "",
      member: "",
      treeData: [],
      orgCode: "",
      memberMessage: [],
      userIds: [],
      myMembers: "",
      loading: true,
      minHeight: "",
      memberArray:[],
      // page: {
      //   pageNow: 1,
      //   pageSize: 20,
      //   totalRecord: 1,
      // },
    };
  },
  mounted() {
    this.getLastMonth();
    this.getProcessClasses();
    this.getAllTableData();
    this.getOrgAll();
    this.$store.dispatch("adminNav/changeHeaderTitle", "已审核");
    this.high();
    console.log(this.page);
  },
  methods: {
    cancleCheck(){
      this.dialogEditMember=false;
      this.$refs.memberTable.clearSelection();
      this.memberArray=[];
      this.myMembers="";
      this.userIds=[]
    },
    handleClick(tab, event) {
      //console.log(tab,event);
      this.selectType = tab.name;
      console.log(this.selectType);
      this.getAllTableData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 详情
    toDetail(row, event, column,index) {
      console.log("row", row);
      this.$router.push({
        name: "workflowBusiness",
        params: {
          formId: row.formId,
          processDefinitionId: row.processDefinitionId
        },
        query: {
          processInstanceId: row.processInstanceId,
          recordId: row.businessId,
          type: 'detail'
        }
      });
      // this.$router.push(
      //   `/workflow/${row.formId}?recordId=${
      //     row.businessId
      //   }&type=detail&processInstanceId=${row.processInstanceId}`
      // );
    },
    toEdit(index, row) {
      console.log("row", row);
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
          type: 'edit',
          hide: 'workflow-form'
        }
      });
      // this.$router.push(
      //   `/workflow/${row.formId}?recordId=${row.businessId}&type=edit&taskId=${
      //     row.id
      //   }&businessId=${row.businessId}&title=${row.title}&level=${
      //     row.level
      //   }&currentGroup=${row.currentGroup}&processInstanceId=${
      //     row.processInstanceId
      //   }`
      // );
    },
    reset() {
      this.processValue = "";
      this.userIds = [];
      this.myMembers = "";
      this.getLastMonth();
      this.$refs.memberTable.clearSelection();
      this.memberArray=[];
    },
    getAllTableData() {
      this.loading = true;
      workflowTaskService
        .pageComplete({
          startTime: this.switchDate(this.dateValue),
          selectType: this.selectType,
          categoryCode: this.processValue,
          userIds: this.userIds,
          pageNow: this.page.pageNow,
          pageSize: this.page.pageSize
        })
        .then(data => {
          console.log(data);
          if (data == null || data.record == null) {
            this.allTableData = [];
            this.loading = false;
          } else {
            let list = data.record;
            for (let i = 0; i < list.length; i++) {
              list[i].serialNumber = i + 1;
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
            this.loading = false;
            this.updatePage(data);
          }
        });
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
    switchDate(date) {
      if (!date || date == null || date == '') {
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
    // 获取企业组织架构
    getOrgAll() {
      workflowAuthService.findOrgAll().then(data => {
        this.treeData = this.listToTree("orgCode", "orgParentCode", data);
      });
    },
    listToTree(myId, pId, list) {
      function exists(list, parentId) {
        for (var i = 0; i < list.length; i++) {
          if (list[i][myId] == parentId) return true;
        }
        return false;
      }

      var nodes = [];
      // get the top level nodes
      for (var i = 0; i < list.length; i++) {
        var row = list[i];
        if (!exists(list, row[pId])) {
          row.label = row.orgName;
          nodes.push(row);
          this.treeId = row.id;
        }
      }
      var toDo = [];
      for (var i = 0; i < nodes.length; i++) {
        nodes[i].label = nodes[i].orgName;
        toDo.push(nodes[i]);
      }
      while (toDo.length) {
        var node = toDo.shift(); // the parent node
        // get the children nodes
        for (var i = 0; i < list.length; i++) {
          var row = list[i];
          if (row[pId] == node[myId]) {
            //var child = {id:row.id,text:row.name};
            row.label = row.orgName;
            if (node.children) {
              node.children.push(row);
            } else {
              node.children = [row];
            }
            toDo.push(row);
          }
        }
      }
      return nodes;
    },
    handleNodeClick(data) {
      console.log(data.orgCode);
      this.orgCode = data.orgCode;
      this.getUserOrg();
    },
    setCheck(){
      setTimeout(() => {
        if(this.memberArray.length===0||(this.memberMessage&&this.memberMessage.length===0)){
          return
        }else{
          for(let i=0;i<this.memberArray.length;i++){
            for(let j=0;j<this.memberMessage.length;j++){
              if(this.memberArray[i].userId==this.memberMessage[j].userId){
                console.log(this.memberMessage[j])
                this.$refs.memberTable.toggleRowSelection(this.memberMessage[j],true)
                console.log(2222222222)
              }
            }
          }
        }
      });
    },
    // 获取部门下用户
    getUserOrg() {
      workflowAuthService
        .findUserOrgCode({ orgCode: this.orgCode })
        .then(data => {
          this.memberMessage = data;
          this.setCheck();
        });
    },
    // 模糊查询用户
    findUserByName() {
      workflowAuthService.findUserByName({ name: this.member }).then(data => {
        this.memberMessage = data;
        this.setCheck();
      });
    },
    select(selection, row){
      console.log("selection, row",selection, row)
      let flag = false;
      for(let i=0;i<selection.length;i++){
        if(selection[i]===row){
          flag = true;
          break;
        }
      }
      if(flag){
        this.memberArray.push(row)
      }else{
        for(let i=0;i<this.memberArray.length;i++){
          if(this.memberArray[i].userId===row.userId){
            this.memberArray.splice(i,1);
            break
          }
        }
      }
      console.log('this.memberArray',this.memberArray)
      this.userIds = [];
      let myMembers = [];
      for(let i=0;i<this.memberArray.length;i++){
        console.log(11111)
        this.userIds.push(this.memberArray[i].userId);
        myMembers.push(this.memberArray[i].userName);
      }
      this.myMembers = myMembers.join(",");
      console.log('this.myMembers',this.myMembers)
    },
    selectAll(selection){
      console.log(selection)
      if(selection.length){
        for(let i=0;i<selection.length;i++){
          let flag = true;
          for(let j=0;j<this.memberArray.length;j++){
            if(selection[i].userId===this.memberArray[j].userId){
              flag = false;
              break;
            }
          }
          if(flag){
              this.memberArray.push(selection[i])
          };
        }
      }else{
        for(let i=0;i<this.memberMessage.length;i++){
          for(let j=0;j<this.memberArray.length;j++){
            if(this.memberMessage[i].userId==this.memberArray[j].userId){
              this.memberArray.splice(j,1)
              break
            }
          }
        }
      }
      this.userIds = [];
      let myMembers = [];
      console.log('this.memberArray',this.memberArray)
      for(let i=0;i<this.memberArray.length;i++){
        console.log(11111)
        this.userIds.push(this.memberArray[i].userId);
        myMembers.push(this.memberArray[i].userName);
      }
      this.myMembers = myMembers.join(",");
      console.log('this.myMembers',this.myMembers)
    },
    handleSelect(selection) {
      // this.userIds = [];
      // let myMembers = [];
      // for (let i = 0; i < selection.length; i++) {
      //   this.userIds.push(selection[i].userId);
      //   myMembers.push(selection[i].userName);
      // }
      // console.log(myMembers);
      // this.myMembers = myMembers.join("，");
      // console.log(this.userIds);
    },
    high() {
      var height = this.$refs.up.offsetHeight;
      this.minHeight = window.innerHeight - height - 48 - 50 - 45 + "px";
    }
    // pageChange(pageData) {
    //   this.page = {
    //     pageNow: pageData.pageNow,
    //     pageSize: pageData.pageSize,
    //     totalRecord: this.page.totalRecord,
    //   }
    //   this.getAllTableData();
    // }
  }
};
</script>

<style lang="scss" scoped>
@import "./checked.scss";
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
.aui-button {
  border-radius: 0;
}
</style>


