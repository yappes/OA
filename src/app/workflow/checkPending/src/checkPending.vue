<template>
  <div class="pui-check-pending">
    <!-- <h2>待审核</h2> -->
    <div class="pui-check-pending__up" ref="checkPendingUp">
      <div class="pui-check-pending__item">
        <label for="select1" class="pui-check-pending__label">任务类型:</label>
        <aui-select v-model="taskValue" placeholder="请选择" id="select1">
          <aui-option v-for="item in taskType" :key="item.taskValue" :label="item.label" :value="item.taskValue"></aui-option>
        </aui-select>
      </div>
      <div class="pui-check-pending__item">
        <label for="input" class="pui-check-pending__label">申请人:</label>
        <aui-input type="text" placeholder="选择成员" id="input" v-model="myMembers" @focus="dialogEditMember=true"></aui-input>
      </div>
      <div class="pui-check-pending__item">
        <label for="date" class="pui-check-pending__label">申请起始日期:</label>
        <aui-date-picker v-model="dateValue" type="date" id="date" placeholder="选择日期"></aui-date-picker>
      </div>
      <div class="pui-check-pending__item">
        <label for="select2" class="pui-check-pending__label">流程分类:</label>
        <aui-select v-model="processValue" placeholder="请选择" id="select2">
          <aui-option v-for="item in processClasses" :key="item.processValue" :label="item.label" :value="item.processValue"></aui-option>
        </aui-select>
      </div>
      <div class="pui-check-pending__item">
        <label for="select3" class="pui-check-pending__label">所属部门:</label>
        <aui-select v-model="departmentValue" placeholder="请选择" id="select3">
          <aui-option v-for="item in department" :key="item.departmentValue" :label="item.label" :value="item.departmentValue"></aui-option>
        </aui-select>
      </div>
      <!-- <div class="pui-check-pending__button">
        <pui-btn :heightStr="heightStr" :widthStr="widthStr" type="primary" @click='onsearch'>查询</pui-btn>
        <pui-btn :heightStr="heightStr" :widthStr="widthStr" :plain="true" @click="reset">重置</pui-btn>
      </div> -->
      <div class="pui-drafts__operations">
        <pui-btn  @click='onsearch' :heightStr="heightStr" :widthStr="widthStr" class="pui-list-grid__oper">查询</pui-btn>
        <pui-btn  @click='reset' :heightStr="heightStr" :widthStr="widthStr" class="pui-list-grid__oper">重置</pui-btn>
      </div>
    </div>
    <div class="pui-check-pending__main" :style="{minHeight:minHeight}">
      <!-- <div class="pui-check-pending__btns">
        <pui-btn class="pui-check-pending__btn" :heightStr="heightStr" type="primary" @click="showPassDialog">通过</pui-btn>
        <pui-btn class="pui-check-pending__btn" :heightStr="heightStr" type="primary" @click="showDialog">驳回</pui-btn>
      </div> -->
      <div class="pui-drafts__operations">
        <pui-btn  :heightStr="heightStr" :widthStr="widthStr" class="pui-list-grid__oper" @click="showPassDialog" :loading="passLoading">通过</pui-btn>
        <pui-btn  :heightStr="heightStr" :widthStr="widthStr" class="pui-list-grid__oper" @click="showDialog" :loading="bohuiLoading">驳回</pui-btn>
      </div>
      <div class="pui-check-pending__down">
        <aui-tabs v-model="activeName" @tab-click="handleClick">
          <aui-tab-pane label="全部" name="ALL">
            <aui-table @row-click="topush" empty-text="暂无数据" v-loading="loading" ref="multipleTable" stripe :data="allTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
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
              <aui-table-column prop="taskAssigneeName" label="当前审批人" show-overflow-tooltip minWidth="120"> </aui-table-column>
              <aui-table-column prop="createTime" label="任务时间" show-overflow-tooltip minWidth="160"> </aui-table-column>
              <aui-table-column prop="approveStatus" label="审批状态" show-overflow-tooltip> </aui-table-column>
            </aui-table>
          </aui-tab-pane>
          <aui-tab-pane label="本人" name="ME">
            <aui-table @row-click="topush" empty-text="暂无数据" v-loading="loading" ref="multipleTable" stripe :data="allTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
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
              <aui-table-column prop="taskAssigneeName" label="申请人" show-overflow-tooltip minWidth="120"> </aui-table-column>
              <aui-table-column prop="orgName" label="所属部门" show-overflow-tooltip minWidth="120"> </aui-table-column>
              <aui-table-column prop="taskAssigneeName" label="当前审批人" show-overflow-tooltip minWidth="120"> </aui-table-column>
              <aui-table-column prop="createTime" label="任务时间" show-overflow-tooltip minWidth="160"> </aui-table-column>
              <aui-table-column prop="approveStatus" label="审批状态" show-overflow-tooltip> </aui-table-column>
            </aui-table>
          </aui-tab-pane>
          <aui-tab-pane label="代理" name="AGENT">
            <aui-table @row-click="topush" empty-text="暂无数据" v-loading="loading" ref="multipleTable" stripe :data="allTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
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
              <aui-table-column prop="taskAssigneeName" label="申请人" show-overflow-tooltip minWidth="120"> </aui-table-column>
              <aui-table-column prop="orgName" label="所属部门" show-overflow-tooltip minWidth="120"> </aui-table-column>
              <aui-table-column prop="taskAssigneeName" label="当前审批人" show-overflow-tooltip minWidth="120"> </aui-table-column>
              <aui-table-column prop="createTime" label="任务时间" show-overflow-tooltip minWidth="160"> </aui-table-column>
              <aui-table-column prop="approveStatus" label="审批状态" show-overflow-tooltip> </aui-table-column>
            </aui-table>
          </aui-tab-pane>
        </aui-tabs>
        <pui-workflow-pagination :currentPage='page.pageNow' :pageSize='page.pageSize' :totalRecord='page.totalRecord' @select-page="pageChange" style="margin-top:30px;">
        </pui-workflow-pagination>

        <!--驳回-->
        <aui-dialog title="请输入驳回审批意见" :visible.sync="dialogVisible" :close-on-click-modal="false" style="width:100%;margin:0 auto">
          <aui-form>
            <aui-form-item label="节点:" prop='activityId' label-width="120px">
              <aui-select v-model="activityId" placeholder="请选择节点">
                <aui-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </aui-option>
              </aui-select>
            </aui-form-item>
            <aui-form-item label="审批意见:" label-width="120px">
              <aui-input type='textarea' :autosize="{ minRows: 4}" style='width:85%;' class="comment" placeholder="请输入内容" v-model="comment"></aui-input>
            </aui-form-item>
          </aui-form>
          <span slot="footer" class="dialog-footer">
            <aui-button :plain="true" @click="dialogVisible=false">取 消</aui-button>
            <aui-button type="primary" @click="rejectProcess">确 定</aui-button>
          </span>
        </aui-dialog>
        <!--通过-->
        <aui-dialog title="请输入通过审批意见" :visible.sync="agreeDialog" :close-on-click-modal="false" width="30%">
          <aui-form ref="passForm">
            <aui-form-item label="审批意见">
              <aui-input class="comment" v-model="comment" type='textarea' :autosize="{ minRows: 4}" style="width:85%;" placeholder="请输入内容"></aui-input>
            </aui-form-item>
          </aui-form>
          <span slot="footer" class="dialog-footer">
            <aui-button :plain="true" @click="agreeDialog = false">取 消</aui-button>
            <aui-button type="primary" @click="passProcess">确 定</aui-button>
          </span>
        </aui-dialog>
        <!-- 申请人 -->
        <aui-dialog title="选择成员" :visible.sync="dialogEditMember" :close-on-click-modal="false" width="80%">
          <aui-form :inline="true" label-width="100px" class="demo-form-inline" style="width:100%">
            <aui-form-item label="当前成员">
              <aui-input v-model="myMembers" :disabled="true" placeholder="当前成员" style="width:300%"></aui-input>
              <!--<aui-button type="text" :disabled="showTreeTable" @click='onClearMember'>选择成员</aui-button>-->
            </aui-form-item>
          </aui-form>
          <div class="showMembers">
            <aui-form :inline="true" label-width="100px" style="width:100%" class="demo-form-inline" ref="searchForm">
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
  workflowTaskService,
  workflowCategoryService,
  workflowProcessService,
  workflowAuthService,
  viewService
} from "paas-web-utils/services";
export default {
  name: "PuiCheckPending",
  mixins: [pageMixin],
  component: {},
  data() {
    return {
      loading: true,
      passLoading:false,
      bohuiLoading:false,
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
      taskType: [
        { taskValue: "APPROVAL", label: "指定审批人" },
        { taskValue: "CANDIDATE", label: "指定任务候选人" },
        { taskValue: "CANDIDATEGROUP", label: "指定候选工作组" }
      ],
      taskValue: "APPROVAL",
      selectType: "ALL",
      agreeDialog: false,
      taskIds: [],
      comment: "",
      dialogVisible: false,
      options: [],
      activityId: "",
      myMembers: "",
      dialogEditMember: false,
      filterText: "",
      member: "",
      treeData: [],
      orgCode: "",
      memberMessage: [],
      userIds: [],
      minHeight: "",
      memberArray:[],
    };
  },
  mounted() {
    this.getProcessClasses();
    this.getAllTableData();
    this.getOrgAll();
    this.high();
  },
  created() {
    this.getLastMonth();
    this.$store.dispatch("adminNav/changeHeaderTitle", "待审核");
  },
  methods: {
    cancleCheck(){
      this.dialogEditMember=false;
      this.$refs.memberTable.clearSelection();
      this.memberArray=[];
      this.myMembers="";
      this.userIds=[]
    },
    onsearch() {
      this.getAllTableData();
    },
    handleClick(tab, event) {
      //console.log(tab,event);
      this.selectType = tab.name;
      this.getAllTableData();
    },
    handleNodeClick(data) {
      console.log(data.orgCode);
      this.orgCode = data.orgCode;
      this.getUserOrg();
      
    },
    handleClose() {},
    topush(row, event, column,index){
      viewService.findViewById({
        id:row.formId,
        isOwnItem:true
      }).then(data=>{
        console.log(data)
        if(data.viewType==4){
          this.toDetail(row, event, column,index)
        }else{
          this.toEdit(row, event, column,index)
        }
      })
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
          taskId: row.id,
          recordId: row.businessId,
          type: 'detail'
        }
      });
      // this.$router.push(
      //   `/workflow/${row.formId}?recordId=${
      //     row.businessId
      //   }&type=detail&taskId=${row.id}&processInstanceId=${
      //     row.processInstanceId
      //   }`
      // );
    },
    toEdit(row, event, column,index) {
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
    //   console.log("selection",selection)
    //   this.userIds = [];
    //   let myMembers = [];
    //   for (let i = 0; i < selection.length; i++) {
    //     this.userIds.push(selection[i].userId);
    //     myMembers.push(selection[i].userName);
    //   }
    //   console.log(myMembers);
    //   this.myMembers = myMembers.join("，");
    //   console.log(this.userIds);
     },
    handleSelectionChange(selection) {
      // this.multipleSelection = val ;
      console.log(selection);
      this.taskIds = [];
      for (let i = 0; i < selection.length; i++) {
        this.taskIds.push(selection[i].id);
      }
      console.log(this.taskIds[0]);
    },
    searchMember() {},
    // 获取企业组织
    showPassDialog() {
      if (this.taskIds.length != 0) {
        this.agreeDialog = true;
      } else {
        this.$aui.message.show({
          message: "未选择操作对象",
          type: "warning"
        });
      }
    },
    passProcess() {
      this.passLoading=true;
      console.log(this.taskIds, this.comment);
      workflowProcessService
        .completeTasksByIds({
          taskIds: this.taskIds,
          comment: this.comment
        })
        .then(data => {
          this.$aui.message.show({
            message: "审核通过",
            type: "success"
          });
          this.agreeDialog = false;
          this.getAllTableData();
          this.passLoading=false;
        });
    },
    showDialog() {
      if (this.taskIds.length == 1) {
        this.dialogVisible = true;
        this.getTree();
      } else if (this.taskIds.length > 1) {
        this.$aui.message.show({
          message: "一次只可选择一个可驳回对象",
          type: "warning"
        });
      } else {                                                                          
        this.$aui.message.show({
          message: "未选择操作对象",
          type: "warning"
        });
      }
    },
    // 获取可驳回的节点
    getTree() {
      workflowProcessService
        .findRejectListByTaskId({
          taskId: this.taskIds[0]
        })
        .then(data => {
          this.options = [];
          for (var i = 0; i < data.length; i++) {
            this.options.push({ label: data[i].name, value: data[i].id });
          }
        });
    },
    // 驳回
    rejectProcess() {
      this.bohuiLoading=true;
      workflowProcessService
        .rejectTaskById({
          taskId: this.taskIds[0],
          activityId: this.activityId,
          comment: this.comment
        })
        .then(data => {
          this.$aui.message.show({
            message: "驳回成功",
            type: "success"
          });
          this.dialogVisible = false;
          this.getAllTableData();
          this.bohuiLoading=false;
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
    // 获取企业组织架构
    getOrgAll() {
      workflowAuthService.findOrgAll().then(data => {
        this.treeData = this.listToTree("orgCode", "orgParentCode", data);
      });
    },
    reset() {
      this.userIds = [];
      this.processValue = "";
      this.getLastMonth();
      this.myMembers = "";
      this.$refs.memberTable.clearSelection();
      this.memberArray=[];
    },
    getAllTableData() {
      this.loading = true;
      workflowTaskService
        .pageDeals({
          taskType: this.taskValue,
          startTime: this.switchDate(this.dateValue),
          selectType: this.selectType,
          userIds: this.userIds,
          categoryCode: this.processValue,
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
              list[i].createTime = this.switchDate(list[i].createTime);
            }
            this.allTableData = list;
            console.log(this.allTableData);
            this.updatePage(data);
            this.loading = false;
          }
        });
        this.$store.dispatch("badgeNumber/getBadgeNumber");
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
    high() {
      var height = this.$refs.checkPendingUp.offsetHeight;
      this.minHeight = window.innerHeight - height - 48 - 50 - 45 + "px";
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./checkPending.scss";
.pui-check-pending__label {
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

