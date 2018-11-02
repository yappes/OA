<template>
  <div class="pui-process-manager">
    <div class="pui-process-manager__up">
      <div class="pui-process-manager__item1">
        <label for="input1" class="pui-process-manager__label">流程名称:</label>
        <aui-input type="text" placeholder="请输入流程名称" id="input1" v-model="processName"></aui-input>
      </div>
      <div class="pui-process-manager__item1">
        <label for="select2" class="pui-process-manager__label">流程状态:</label>
        <aui-select v-model="processValue" placeholder="请选择流程状态" id="select2">
          <aui-option v-for="item in processClasses" :key="item.processValue" :label="item.label" :value="item.processValue"></aui-option>
        </aui-select>
      </div>
      <div class="pui-drafts__operations">
        <pui-btn :heightStr="heightStr" :widthStr="widthStr" class="pui-list-grid__oper" @click='onSearch'>查询</pui-btn>
        <pui-btn :heightStr="heightStr" :widthStr="widthStr" class="pui-list-grid__oper" @click="onReset">重置</pui-btn>
      </div>
    </div>
    <div class="pui-process-manager__bgColor"></div>
    <div class="pui-process-manager__main">
      <div class="pui-drafts__operations">
        <pui-btn :heightStr="heightStr" class="pui-list-grid__oper" @click="creat">新建</pui-btn>
        <pui-btn :heightStr="heightStr" class="pui-list-grid__oper" @click="amend">修改</pui-btn>
        <pui-btn :heightStr="heightStr" class="pui-list-grid__oper" @click="activateProcess">启用</pui-btn>
        <pui-btn :heightStr="heightStr" class="pui-list-grid__oper" @click="suspendProcess">禁用</pui-btn>
        <pui-btn :heightStr="heightStr" class="pui-list-grid__oper" @click="issue">发布</pui-btn>
      </div>
      <div class="pui-process-manager__down">
        <aui-table empty-text="暂无数据" v-loading="loading" ref="multipleTable" stripe :data="managerTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <aui-table-column type="selection" minWidth="40" fixed></aui-table-column>
          <aui-table-column label="操作" minWidth="55" fixed="left" align='center'>
            <template slot-scope="scope">
              <aui-popover ref="popover1" placement="bottom-start" trigger="hover">
                <ul>
                  <li class="pui-list-grid__oper-in-row-item" @click="handleEdit(scope.$index, scope.row)">布局</li>
                  <li class="pui-list-grid__oper-in-row-item" @click="editVar(scope.$index, scope.row)">参数</li>
                  <li class="pui-list-grid__oper-in-row-item" @click="expo(scope.$index, scope.row)">导出</li>
                </ul>
              </aui-popover>
              <i class="pui-icon-fenlei" @click.stop v-popover:popover1></i>
            </template>
          </aui-table-column>
          <aui-table-column prop="id" label="模型ID" minWidth="80"> </aui-table-column>
          <aui-table-column prop="name" label="流程名称" show-overflow-tooltip minWidth="120"> </aui-table-column>
          <aui-table-column prop="createUserName" label="创建人" show-overflow-tooltip minWidth="120"> </aui-table-column>
          <aui-table-column prop="metaInfo.description" label="描述" show-overflow-tooltip minWidth="120"> </aui-table-column>
          <aui-table-column prop="createTime" label="创建日期" show-overflow-tooltip minWidth="160"> </aui-table-column>
          <aui-table-column prop="state" label="流程状态" show-overflow-tooltip> </aui-table-column>
        </aui-table>
        <div class="pagination-outer">
          <pui-workflow-pagination :currentPage='page.pageNow' :pageSize='page.pageSize' :totalRecord='page.totalRecord' @select-page="pageChange"  style="margin:5px 0;minWidth:825px">
          </pui-workflow-pagination>
        </div>
      </div>
    </div>

    <aui-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" width="50%">
      <aui-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="170px" class="demo-ruleForm" style="padding:0 9% 0 3%;minWidth:300px">
        <aui-form-item label="流程名称" prop='name'>
          <aui-input v-model="ruleForm.name" placeholder="请输入流程名称"></aui-input>
        </aui-form-item>
        <!-- <aui-form-item  v-if="title=='创建'" label="流程编号" prop='key'>
          <aui-input v-model="ruleForm.key" placeholder="请输入数字值和字母(不能是纯数字)"></aui-input>
        </aui-form-item>
        <aui-form-item v-if="title=='修改'" label="流程编号" >
          <aui-input v-model="ruleForm.key" disabled></aui-input>
        </aui-form-item> -->
        <aui-form-item label="流程分类" prop='categoryCode'>
          <aui-select v-model="ruleForm.categoryCode" placeholder="请选择流程分类">
            <aui-option v-for="item in classOptions" :key="item.value" :label="item.label" :value="item.value">
            </aui-option>
          </aui-select>
        </aui-form-item>
        <aui-form-item label="所属模块" prop="moduleId">
          <aui-select v-model="ruleForm.moduleId" placeholder="请选择所属模块" @change="change1">
            <aui-option v-for="item in moduleIdOptions" :key="item.value" :label="item.label" :value="item.value">
            </aui-option>
          </aui-select>
        </aui-form-item>
        <aui-form-item label="发起视图" prop="viewId">
          <aui-select v-model="ruleForm.viewId" placeholder="请选择发起视图" @change="change2">
            <aui-option v-for="item in viewIdOptions" :key="item.value" :label="item.label" :value="item.value">
            </aui-option>
          </aui-select>
        </aui-form-item>
        <aui-form-item label="详情视图" prop="viewLookId">
          <aui-select v-model="ruleForm.viewLookId" placeholder="请选择详情视图">
            <aui-option v-for="item in viewIdOptions" :key="item.value" :label="item.label" :value="item.value">
            </aui-option>
          </aui-select>
        </aui-form-item>
        <aui-form-item label="标题字段" prop="title">
          <aui-select v-model="ruleForm.title" placeholder="请选择标题字段">
            <aui-option v-for="(item,index) in titleOptions" :key="index" :label="item.label" :value="item.value">
            </aui-option>
          </aui-select>
        </aui-form-item>
        <aui-form-item label="可发起的用户" prop='myMembers'>
          <aui-input v-model="ruleForm.myMembers" @focus="dialogEditMember=true" placeholder="请选择可发起的用户"></aui-input>
        </aui-form-item>
        <aui-form-item label="可发起的工作组" prop='groups'>
          <aui-input v-model="ruleForm.groups" @focus="getGroup" placeholder="请选择可发起的工作组"></aui-input>
        </aui-form-item>
        <aui-form-item label="可发起的组织" prop='orgName'>
          <aui-input v-model="ruleForm.orgName" @focus="getOrg" placeholder="请选择可发起的组织"></aui-input>
        </aui-form-item>
        <aui-form-item label="是否为变更流程" prop="isChange" @click='change'>
          <aui-radio v-model="ruleForm.isChange" label="FALSE">否</aui-radio>
          <aui-radio v-model="ruleForm.isChange" label="TRUE">是</aui-radio>
        </aui-form-item>
        <aui-form-item label="流程结束是否提交数据" prop="isSubmitChange">
          <aui-radio v-model="ruleForm.isSubmitChange" label="FALSE">否</aui-radio>
          <aui-radio v-model="ruleForm.isSubmitChange" label="TRUE">是</aui-radio>
        </aui-form-item>
        <aui-form-item label="流程描述" prop="description">
          <aui-input style="minWidth:200px;" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="ruleForm.description"> </aui-input>
        </aui-form-item>
      </aui-form>
      <div slot="footer" class="dialog-footer">
        <div v-if="title== '创建'">
          <aui-button type="primary" @click="submitMessage('ruleForm','go')">保存并布局</aui-button>
          <aui-button type="primary" @click="submitMessage('ruleForm')">保存</aui-button>
          <aui-button :plain="true" @click="onCancel('ruleForm')">取消</aui-button>
        </div>
        <div v-else>
          <aui-button type="primary" @click="submitRevise('ruleForm')">确定</aui-button>
          <aui-button :plain="true" @click="onCancel('ruleForm')">取消</aui-button>
        </div>
      </div>
      <!-- <aui-row>
        <aui-col :push="5">
          <div v-if="title== '创建'">
            <aui-button type="primary" @click="submitMessage('ruleForm','go')">保存并布局</aui-button>
            <aui-button type="primary" @click="submitMessage('ruleForm')">保存</aui-button>
            <aui-button :plain="true" @click="onCancel('ruleForm')">取消</aui-button>
          </div>
          <div v-else>
            <aui-button type="primary" @click="submitRevise('ruleForm')">确定</aui-button>
            <aui-button :plain="true" @click="onCancel('ruleForm')">取消</aui-button>
          </div>
        </aui-col>
      </aui-row> -->
      <aui-dialog title="选择成员"  :visible.sync="dialogEditMember" :modal="false" :close-on-click-modal="true" width="60%">
        <aui-form :inline="true" label-width="100px" class="demo-form-inline" style="width:100%">
          <aui-form-item label="当前成员">
            <aui-input v-model="this.ruleForm.myMembers" :disabled="true" placeholder="当前成员" style="width:300%"></aui-input>
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
          <aui-tree class="filter-tree" style="border:none;float:left;height:245px;width:30%;overflow-y:auto;" :data="treeData" default-expand-all ref="tree2" highlight-current  @node-click="handleNodeClick">
          </aui-tree>

          <aui-table ref="memberTable" :data="memberMessage" stripe tooltip-effect="dark" style="width: 60%;margin-left:35%;overflow-y:auto; overflow-x:hidden;height:260px" @select="selectMember" @select-all="selectAll" @selection-change='handleSelect'>
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
      <aui-dialog title="选择工作组" :visible.sync="dialogGroup" :modal="false" :close-on-click-modal="false" width="80%">
        <aui-table ref="groupTable" :data="groupData" stripe tooltip-effect="dark" style="width: 80%;" @selection-change='groupSelect'>
          <aui-table-column type="selection" width="30px"> </aui-table-column>
          <aui-table-column label="工作组名称" prop="groupName">
          </aui-table-column>
          <aui-table-column label="描述" prop="description">
          </aui-table-column>
        </aui-table>
        <pui-workflow-pagination :currentPage='page.pageNow' :pageSize='page.pageSize' :totalRecord='page.totalRecord' @select-page="pageChange" style="margin-top:30px;">
        </pui-workflow-pagination>
        <div slot="footer" class="dialog-footer">
          <aui-button :plain="true" @click="groupCancle">取 消</aui-button>
          <aui-button type="primary" @click="dialogGroup=false">确 定</aui-button>
        </div>
      </aui-dialog>
      <aui-dialog title="选择组织" :visible.sync="dialogOrg" :modal="false" :close-on-click-modal="false" width="50%">
        <aui-tree class="filter-tree" node-key="orgCode" :check-strictly="true" show-checkbox @check-change="handleCheckChange"  style="border:none;height:300px;width:80%;overflow-y:auto;" :data="treeData" default-expand-all ref="tree3" highlight-current>
        </aui-tree>
        <div slot="footer" class="dialog-footer">
          <aui-button :plain="true" @click="orgCancle">取 消</aui-button>
          <aui-button type="primary" @click="dialogOrg=false">确 定</aui-button>
        </div>
      </aui-dialog>
    </aui-dialog>
    <!-- 编辑 -->
    <aui-dialog title="编辑" :visible.sync="editDialog" :close-on-click-modal="false" width="60%" :before-close="handleCloseEdit">
      <aui-form :inline="true" :model="editForm" :rules="rules" ref="editForm" class="demo-ruleForm">
        <div>
          <div label-width="90px">
            <div class="show" v-for="(variable, index) in editForm.variables" :key='"variables-" + index'>

              <aui-form-item label="变量名  " style="margin-left:13px" 
                :prop="'variables.' + index + '.key'" 
                :rules="{required: true, message: '变量不能为空', trigger: 'change'}">
                <aui-select style="width: 100px;margin-right:5px;" v-model="variable.key" placeholder="请选择">
                  <aui-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </aui-option>
                </aui-select>
              </aui-form-item>

              <aui-form-item label="自定义名  " 
                :prop="'variables.' + index + '.value'" 
                :rules="{ required: true, message: '自定义名不能为空', trigger: 'blur' }">
                <aui-input style="width: 100px;" v-model="variable.value"></aui-input>
                <aui-button @click.prevent="removeVariable(variable)">删除</aui-button>
              </aui-form-item>
            </div>

            <div class="show" v-for="(item, index) in editForm.consts" :key='"consts-" +index'>

              <aui-form-item label="入参名称  " :prop="'consts.' + index + '.inputParam'" :rules="{
            required: true, message: '参数不能为空', trigger: 'blur'
                 }">
                <aui-input style="width: 100px;margin-right:5px;" v-model="item.inputParam"></aui-input>
              </aui-form-item>

              <aui-form-item label="出参名称  " :prop="'consts.' + index + '.outParam'" :rules="{
            required: true, message: '参数不能为空', trigger: 'blur'
                 }">
                <aui-input style="width: 100px;margin-right:5px;" v-model="item.outParam"></aui-input>
              </aui-form-item>

              <aui-form-item label="默认值  ">
                <aui-input style="width: 100px;margin-right:5px;" v-model="item.defaultVal"></aui-input>
              </aui-form-item>

              <aui-form-item style="margin-left:1px" :prop="'consts.'+index+'.isConvert'" label="是否转换 : " :rules="{
              required: false, message: '转换不能为空',trigger: 'change'
                 }">
                <aui-select style="width: 100px" v-model="item.isConvert" placeholder="请选择">
                  <aui-option v-for="(it,index) in isConvertOption" :key="index" :label="it.label" :value="it.value">
                  </aui-option>
                </aui-select>
                <aui-button @click.prevent="removeConsts(item)">删除</aui-button>
              </aui-form-item>
            </div>
          </div>
        </div>
      </aui-form>
      <div slot="footer" class="dialog-footer">
        <aui-button type="primary" @click="submitForm('editForm')">提交</aui-button>
        <aui-button :plain="true" @click="addDomain('variables')">新增变量</aui-button>
        <aui-button :plain="true" @click="addDomain('consts')">新增参数</aui-button>
      </div>
    </aui-dialog>
  </div>
</template>

<script>
import { HTTP_CONFIG } from "paas-web-utils/common/http.js";
import pageMixin from "../../mixin/index.js";
import data from "./data.js";
import {
  moduleService,
  workflowCategoryService,
  workflowModelService,
  viewService,
  columnService,
  workflowProcessService,
  workflowParamService,
  workflowAuthService
} from "paas-web-utils/services";
export default {
  name: "PuiProcessManager",
  mixins: [pageMixin],
  component: {},
  data() {
    var checkAge = (rule, value, callback) => {
      workflowModelService.checkKey({ key: value }).then(data => {
        console.log("data", data);
        if (data) {
          return callback(new Error("流程编号重复，请重新输入！"));
        }
      });
      if (!value) {
        return callback(new Error("流程编号不能为空"));
      }
      setTimeout(() => {
        // if (!value.match(/^[0-9a-zA_Z]+$/)) {
        if (!value.match(/(?!^[0-9]*$)^([a-zA-Z0-9]{4,})$/)) {
          callback(new Error("请输入数字值和字母(最少4位)"));
        } else {
          callback();
        }
      }, 300);
    };
    return {
      loading: true,
      processName: "",
      processClasses: [
        { processValue: "DISABLE", label: "已禁用" },
        { processValue: "ENABLE", label: "已启用" },
        { processValue: "NORELEASE", label: "未发布" },
        { processValue: "RELEASE", label: "已发布" }
      ],
      radio1: false,
      radio2: {
        radio: false
      },
      processValue: "",
      heightStr: "35px",
      widthStr: "60px",
      managerTableData: [],
      classOptions: [],
      moduleIdOptions: [],
      viewIdOptions: [],
      titleOptions: [],
      ruleForm: {
        viewId: "",
        viewLookId: "",
        categoryCode: "",
        moduleId: "",
        name: "",
        description: "",
        title: "",
        isChange: "FALSE",
        isSubmitChange: "FALSE",
        modelId:"",
        userIds:"",
        myMembers:"",
        groupIds:"",
        groups:"",
        orgName:"",
        orgCodes:""
      },
      dialogVisible: false,
      title: "",
      rules: {
        // 验证规则
        name: [
          {
            required: true,
            message: "请输入流程名称",
            trigger: "blur"
          }
        ],
        key: [
          {
            required: true,
            validator: checkAge,
            trigger: "blur"
          }
        ],
        description: [
          {
            required: true,
            message: "请输入流程描述",
            trigger: "blur"
          }
        ],
        moduleId: [
          {
            required: true,
            message: "请选择所属模块",
            trigger: "blur"
          }
        ],
        viewId: [
          {
            required: true,
            message: "请选择发起的视图",
            trigger: "blur"
          }
        ],
        viewLookId: [
          {
            required: true,
            message: "请选择发起的视图",
            trigger: "blur"
          }
        ],
        categoryCode: [
          {
            required: true,
            message: "请填写流程描述",
            trigger: "blur"
          }
        ],
        title: [
          {
            required: true,
            message: "请选择标题字段",
            trigger: "blur"
          }
        ]
      },
      select: "",
      processDefinitionIds: [],
      modelId: "",
      editDialog: false,
      editForm: {
        variables: [],
        consts: []
      },
      options: [],
      isConvertOption: [
        { label: "是", value: "1" },
        { label: "否", value: "0" }
      ],
      dialogEditMember:false,
      myMembers: "",
      filterText: "",
      member: "",
      treeData: [],
      orgCode: "",
      memberMessage: [],
      userIds: [],
      dialogGroup:false,
      groupData:[],
      dialogOrg:false,
      memberArray:[],
      orgTreeData:[]
    };
  },
  props: ["categoryCode"],
  mounted() {
    this.getAllTableData();
    this.getProcessClasses();
    this.getModuleIdOptions();
    this.getOrgAll();
    workflowAuthService.getWorkGroupPage({}).then(data=>{
      if(data.record){
        this.groupData=data.record
      }
    })
  },
  methods: {
    cancleCheck(){
      this.dialogEditMember=false;
      this.$refs.memberTable.clearSelection();
      this.ruleForm.userIds="";
      this.ruleForm.myMembers="";
      this.memberArray=[];
    },
    change() {
      console.log(1111);
      console.log(this.ruleForm);
    },
    onSearch() {
      this.getAllTableData();
    },
    onReset() {
      this.processName = "";
      this.processValue = "";
    },
    handleClick(tab, event) {
      //console.log(tab,event);
    },
    handleSelectionChange(val) {
      if (val.length == 0) {
        this.select = [];
        this.processDefinitionIds = [];
        this.modelId = undefined;
        return;
      }
      // this.multipleSelection = val;
      if (val.length == 1) {
        this.ruleForm.name = val[0].name;
        this.ruleForm.viewId = val[0].modelRel.viewId;
        this.ruleForm.viewLookId = val[0].modelRel.viewLookId;
        this.ruleForm.moduleId = val[0].modelRel.moduleId;
        this.ruleForm.description = val[0].metaInfo.description;
        this.ruleForm.categoryCode = val[0].category;
        this.ruleForm.title = val[0].modelRel.title;
        this.ruleForm.isChange = val[0].modelRel.isChange;
        this.ruleForm.isSubmitChange = val[0].modelRel.isSubmitChange;
        this.ruleForm.modelId=val[0].modelRel.modelId;
        this.ruleForm.userIds=val[0].modelRel.userIds;
        this.ruleForm.groupIds=val[0].modelRel.groupIds;
        this.ruleForm.orgCodes=val[0].modelRel.orgCodes;
        this.ruleForm.myMembers="";
        if(this.ruleForm.userIds){
         let userIdsArray=this.ruleForm.userIds.split(",");
          let myMembers=[];
          this.memberArray=[];
          console.log('userIdsArray',userIdsArray);
          for(let i=0;i<userIdsArray.length;i++){
            workflowAuthService.findInfoByUserId({userId:userIdsArray[i]}).then(data=>{
              console.log('data',data);
              this.memberArray.push({
                userId:data.userId,
                userName:data.userName,
                email:data.email
              })
              myMembers.push(data.userName)
            })
          }
          setTimeout(()=>{
            this.ruleForm.myMembers=myMembers.join(',');
            // console.log('myMembers',myMembers)
          },1000)
        }
        if(this.ruleForm.groupIds){
          console.log('this.groupData',this.groupData)
          let groupIdsArray=this.ruleForm.groupIds.split(",");
          let groupName =[];
          for(let i=0;i<groupIdsArray.length;i++){
            for(let j=0;j<this.groupData.length;j++){
              if(groupIdsArray[i]===this.groupData[j].groupId){
                // setTimeout(()=>{
                //   console.log('this.$refs.groupTable',this.$refs.groupTable)
                // this.$refs.groupTable.toggleRowSelection(this.groupData[j],true)
                // console.log('groupIdsArray[i]',groupIdsArray[i])
                // console.log('this.groupData[j]',this.groupData[j])
                // })
                groupName.push(this.groupData[j].groupName)
              }
            }
          }
          this.ruleForm.groups=groupName.join(',');
        }
        if(this.ruleForm.orgCodes){
          let orgCodesArray=this.ruleForm.orgCodes.split(',');
          console.log('orgCodesArray',orgCodesArray)
          let orgName=[];
          for(let i=0;i<orgCodesArray.length;i++){
            for(let j=0;j<this.orgTreeData.length;j++){
              if(orgCodesArray[i]===this.orgTreeData[j].orgCode){
                console.log('this.orgTreeData[j].orgName',this.orgTreeData[j].orgName)
                orgName.push(this.orgTreeData[j].orgName);
              }
            }
          }
          this.ruleForm.orgName=orgName.join(',');
        }
      }
      this.select = val;
      console.log(this.select);
      let arr = [];
      for (let i = 0; i < val.length; i++) {
        arr.push(val[i].id);
      }
      this.processDefinitionIds = arr;
      this.modelId = val[0].modelRel.modelId;
      console.log("modelId", this.modelId);
      console.log('this.ruleForm',this.ruleForm)
    },
    handleCloseEdit() {
      this.editDialog = false;
      this.$refs["editForm"].resetFields();
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let opt = { modelId: "", paramList: [] };
          console.log("this.editRow", this.editRow);
          opt.modelId = this.editRow.modelRel.modelId;
          for (let i = 0; i < this.editForm.variables.length; i++) {
            if (
              this.editForm.variables[i].key != "" &&
              this.editForm.variables[i].value != ""
            ) {
              opt.paramList.push({});
              opt.paramList[i].inputParam = this.editForm.variables[i].key;
              opt.paramList[i].outParam = this.editForm.variables[i].value;
              opt.paramList[i].name = this.columnMaps[this.editForm.variables[i].key] ||"name";
              opt.paramList[i].defaultVal = null;
            }
          }
          let index = this.editForm.variables.length;
          for (let i = 0; i < this.editForm.consts.length; i++) {
            opt.paramList.push({});
            opt.paramList[index + i].inputParam = this.editForm.consts[i].inputParam;
            opt.paramList[index + i].outParam = this.editForm.consts[i].outParam;
            opt.paramList[index + i].defaultVal = this.editForm.consts[
              i
            ].defaultVal;
            opt.paramList[index + i].isConvert = this.editForm.consts[
              i
            ].isConvert;
          }
          console.log("opt is ：", opt);
          workflowParamService.save(opt.modelId, opt.paramList).then(data => {
            this.editDialog = false;
            this.$refs[formName].resetFields();
          });
        } else {
          return false;
        }
      });
    },
    //清空表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //删除变量
    removeVariable(item) {
      var index = this.editForm.variables.indexOf(item);
      if (index !== -1) {
        this.editForm.variables.splice(index, 1);
      }
    },
    //删除常量
    removeConsts(item) {
      var index = this.editForm.consts.indexOf(item);
      if (index !== -1) {
        this.editForm.consts.splice(index, 1);
      }
    },
    //新增变量
    addDomain(item) {
      console.log("item is variables or consts :", item);
      if (item == "variables") {
        this.editForm[item].push({
          value: "",
          key: ""
        });
      } else if (item == "consts") {
        this.editForm[item].push({
          inputParam: "",
          outParam: "",
          defaultVal: "",
          isConvert: "0"
        });
      }
    },
    // 参数
    editVar(index, row) {
      this.editDialog = true;
      console.log("row.modelRel.modelId", row.modelRel.modelId);
      this.editForm = { variables: [], consts: [] };
      workflowParamService
        .findAllByModelId({ modelId: row.modelRel.modelId })
        .then(data => {
          console.log("getList is", data.data);
          if (data.length) {
            for (let i = 0; i < data.length; i++) {
              this.editForm.consts.push({});
              this.editForm.consts[i].outParam = data[i].outParam;
              this.editForm.consts[i].inputParam = data[i].inputParam;
              this.editForm.consts[i].defaultVal = data[i].defaultVal;
              this.$set(
                this.editForm.consts[i],
                "isConvert",
                data.data[i].isConvert == "0" ? "0" : "1"
              );
            }
            console.log("this.editForm.consts", this.editForm.consts);
          } else {
            this.editForm = {
              variables: [
                {
                  key: "",
                  value: ""
                }
              ],
              consts: [
                {
                  outParam: "",
                  inputParam: "",
                  defaultVal: "",
                  isConvert: "0"
                }
              ]
            };
          }
        });
      this.columnMaps = {};
      columnService.findFieldsByModuleId({ moduleId: row.modelRel.moduleId })
        .then(data => {
          let columnList = data[0].columnList;
          console.log("data123", data);
          for (let i = 0; i < data.length; i++) {
            this.options.push({});
            this.options[i].label = data[i].columnName;
            this.options[i].value = data[i].columnCode;
            this.columnMaps[data[i].columnCode] = data[i].columnName;
          }
          console.log("options", this.options);
        });
      this.editRow = row;
    },
    // 布局
    handleEdit(index, row) {
      this.$router.push({
        name: "workflowEditor",
        params: {
          modelId: row.modelRel.modelId
        }
      });
      // window.open(`${HTTP_CONFIG.mapping.workflow}static/modeler.html?modelId=${row.modelRel.modelId}`);
    },
    // 导出
    expo(index, row) {
      // window.open('http://139.198.3.73:81/workflow/Model/export/'+ row.modelRel.modelId);
      window.open(
        `${HTTP_CONFIG.mapping.workflow}model/export/${row.modelRel.modelId}`
      );
    },
    // 发布
    issue() {
      this.warningAlert();
      if (this.select.length == 1) {
        workflowModelService
          .deploy({
            modelId: this.modelId
          })
          .then(data => {
            if (data.message == "success!") {
              this.$aui.message.show({
                message: "发布成功",
                type: "success"
              });
              this.getAllTableData();
            } else {
              this.$aui.message.show({
                message: data.message,
                type: "warning"
              });
            }
          });
      }
    },
    // 启用
    activateProcess() {
      if (this.select.length == 0) {
        this.$aui.message.show({
          message: "未选择操作对象",
          type: "warning"
        });
      } else {
        for (let i = 0; i < this.select.length; i++) {
          if (
            this.select[i].processDefinition == null ||
            this.select[i].processDefinition.isSuspended == false
          ) {
            this.$aui.message.show({
              message: "操作对象错误",
              type: "warning"
            });
            return;
          }
        }
        workflowProcessService
          .activateProcessInstance({
            instanceIds: this.processDefinitionIds
          })
          .then(data => {
            this.$aui.message.show({
              message: "启用成功",
              type: "success"
            });
            this.getAllTableData();
          });
      }
    },
    // 禁用
    suspendProcess() {
      if (this.select.length == 0) {
        this.$aui.message.show({
          message: "未选择操作对象",
          type: "warning"
        });
      } else {
        for (let i = 0; i < this.select.length; i++) {
          if (
            this.select[i].processDefinition == null ||
            this.select[i].processDefinition.isSuspended == true
          ) {
            this.$aui.message.show({
              message: "操作对象错误",
              type: "warning"
            });
            return;
          }
        }
        workflowProcessService
          .suspendProcessInstance({
            instanceIds: this.processDefinitionIds
          })
          .then(data => {
            this.$aui.message.show({
              message: "禁用成功",
              type: "success"
            });
            this.getAllTableData();
          });
      }
    },
    // 新建
    submitMessage(formName) {
      console.log(this.$refs[formName]);
      this.$refs[formName].validate(valid => {
        if (valid) {
          workflowModelService.newModel(this.ruleForm).then(data => {
            this.$aui.message.show({
              message: "创建成功",
              type: "success"
            });
            this.getAllTableData();
            this.dialogVisible = false;
            this.ruleForm = {
              viewId: "",
              viewLookId: "",
              categoryCode: "",
              moduleId: "",
              name: "",
              description: "",
              title: "",
              isChange: "FALSE",
              isSubmitChange: "FALSE",
              modelId:"",
              userIds:"",
              myMembers:"",
              groupIds:"",
              groups:"",
              orgName:"",
              orgCodes:""
            };
            this.memberArray=[];
          });
        }
      });
    },
    creat() {
      this.ruleForm = {
        viewId: "",
        viewLookId: "",
        categoryCode: "",
        moduleId: "",
        name: "",
        description: "",
        title: "",
        isChange: "FALSE",
        isSubmitChange: "FALSE",
        modelId:"",
        userIds:"",
        myMembers:"",
        groupIds:"",
        groups:"",
        orgName:"",
        orgCodes:""
      };
      this.memberArray=[];
      this.dialogVisible = true;
      this.title = "创建";
    },
    // 修改
    amend() {
      this.warningAlert();
      if (this.select.length == 1) {
        this.dialogVisible = true;
        this.title = "修改";
        this.getViewIdOptions();
        this.getTitleOptions();
      }
    },
    submitRevise(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          workflowModelService.update(this.ruleForm).then(data => {
            this.$aui.message.show({
              message: "修改成功",
              type: "success"
            });
            this.getAllTableData();
            this.dialogVisible = false;
            this.ruleForm = {
              viewId: "",
              viewLookId: "",
              categoryCode: "",
              moduleId: "",
              name: "",
              description: "",
              title: "",
              isChange: "FALSE",
              isSubmitChange: "FALSE",
              modelId:"",
              myMembers:"",
              groupIds:"",
              groups:"",
              orgName:"",
              orgCodes:""
            };
            this.memberArray=[];
          });
        }
      });
    },
    // 取消
    onCancel() {
      this.ruleForm = {
        viewId: "",
        viewLookId: "",
        categoryCode: "",
        moduleId: "",
        name: "",
        description: "",
        title: "",
        isChange: "FALSE",
        isSubmitChange: "FALSE",
        modelId:"",
        myMembers:"",
        groupIds:"",
        groups:"",
        orgName:"",
        orgCodes:""
      };
      this.memberArray=[];
      this.dialogVisible = false;
    },
    // 流程状态
    getProcessClasses() {
      let arr = [];
      workflowCategoryService.findAll().then(data => {
        for (var i = 0; i < data.length; i++) {
          arr.push({
            label: data[i].categoryName,
            value: data[i].categoryCode
          });
          this.classOptions = arr;
        }
      });
    },
    //所属模块
    getModuleIdOptions() {
      moduleService.findModules({ isProcess: 1 }).then(data => {
        let arr = [];
        for (let i = 0; i < data.length; i++) {
          arr.push({
            label: data[i].moduleName,
            value: data[i].id
          });
          this.moduleIdOptions = arr;
        }
      });
    },
    // 视图
    getViewIdOptions() {
      viewService
        .findViewsByModuleId({
          moduleId: this.ruleForm.moduleId,
          viewTypes: [2, 3, 4, 5, 6, 7, 8]
        })
        .then(data => {
          let arr = [];
          console.log(data);
          for (let i = 0; i < data.length; i++) {
            arr.push({ label: data[i].viewName, value: data[i].id });
          }
          this.viewIdOptions = arr;
        });
    },
    // 字段
    getTitleOptions() {
      console.log(this.ruleForm.viewId);
      columnService
        .findColumnByViewId({ viewId: this.ruleForm.viewId })
        .then(data => {
          console.log("data", data);
          let arr = [];
          for (let i = 0; i < data.length; i++) {
            arr.push({
              label: data[i].columnName,
              value: data[i].columnCode
            });
          }
          this.titleOptions = arr;
          console.log("titleop", this.titleOptions);
        });
    },
    getAllTableData() {
      this.loading = true;
      workflowModelService
        .findList({
          state: this.processValue,
          categoryCode: this.categoryCode,
          processName: this.processName,
          pageNow: this.page.pageNow,
          pageSize: this.page.pageSize
        })
        .then(data => {
          console.log(data);
          if (data == null || data.record == null) {
            this.managerTableData = [];
            this.loading = false;
          } else {
            let list = data.record;
            for (let i = 0; i < list.length; i++) {
              list[i].operations = [
                { id: 1, name: "布局" },
                { id: 2, name: "参数" },
                { id: 3, name: "导出" }
              ];
              list[i].createTime = this.switchDate(list[i].createTime);
              if (list[i].processDefinition == null) {
                list[i].state = "未发布";
              } else if (list[i].processDefinition.isSuspended == true) {
                list[i].state = "已禁用";
              } else {
                list[i].state = "已启用";
              }
            }
            this.managerTableData = list;
            console.log(this.managerTableData);
            this.loading = false;
            this.updatePage(data);
          }
        });
    },
    change1() {
      this.ruleForm.viewId = "";
      this.getViewIdOptions();
    },
    change2() {
      this.ruleForm.title = "";
      this.getTitleOptions();
    },
    // 警告框
    warningAlert() {
      console.log('length',this.select.length)
      if (this.select.length == 0) {
        this.$aui.message.show({
          message: "未选择操作对象",
          type: "warning"
        });
      } else if (this.select.length > 1) {
        this.$aui.message.show({
          message: "只能选择一个操作对象",
          type: "warning"
        });
      }
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
    selectMember(selection, row){
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
      this.ruleForm.userIds=this.userIds.join(',');
      this.ruleForm.myMembers=this.myMembers;
      console.log('this.ruleForm.myMembers',this.ruleForm.myMembers)
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
      for(let i=0;i<this.memberArray.length;i++){
        console.log(11111)
        this.userIds.push(this.memberArray[i].userId);
        myMembers.push(this.memberArray[i].userName);
      }
      this.myMembers = myMembers.join(",");
      this.ruleForm.userIds=this.userIds.join(',');
      this.ruleForm.myMembers=this.myMembers;
      console.log('this.ruleForm.myMembers',this.ruleForm.myMembers)
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
      // this.ruleForm.userIds=this.userIds.join(',');
      // this.ruleForm.myMembers=this.myMembers;
      // console.log(this.userIds);
    },
    // handleSelectionChange(selection) {
    //   // this.multipleSelection = val ;
    //   console.log(selection);
    //   this.taskIds = [];
    //   for (let i = 0; i < selection.length; i++) {
    //     this.taskIds.push(selection[i].id);
    //   }
    //   console.log(this.taskIds[0]);
    // },
    handleNodeClick(data) {
      console.log(data)
      console.log(data.orgCode);
      this.orgCode = data.orgCode;
      this.getUserOrg();
    },
    // 获取企业组织架构
    getOrgAll() {
      workflowAuthService.findOrgAll().then(data => {
        this.treeData = this.listToTree("orgCode", "orgParentCode", data);
        console.log('data',data)
        this.orgTreeData=data;
      });
    },
    groupSelect(selection){
      console.log(selection);
      this.ruleForm.groups=[];
      this.ruleForm.groupIds=[];
      for(let i=0;i<selection.length;i++){
        this.ruleForm.groups.push(selection[i].groupName);
        this.ruleForm.groupIds.push(selection[i].groupId);
      }
      this.ruleForm.groups=this.ruleForm.groups.join(',');
      this.ruleForm.groupIds=this.ruleForm.groupIds.join(',')
      console.log('this.ruleForm.groups',this.ruleForm.groups);
      console.log('this.ruleForm.groupIds',this.ruleForm.groupIds)
    },
    groupCancle(){
      this.$refs.groupTable.clearSelection();
      this.dialogGroup=false;
    },
    handleCheckChange(data, checked, indeterminate) {
      let orgData=this.$refs.tree3.getCheckedNodes()
      console.log(this.$refs.tree3.getCheckedNodes());
      console.log(data);
      this.ruleForm.orgCodes=[];
      this.ruleForm.orgName=[];
      for(let i=0;i<orgData.length;i++){
        this.ruleForm.orgCodes.push(orgData[i].orgCode);
        this.ruleForm.orgName.push(orgData[i].orgName);
      }
      this.ruleForm.orgCodes=this.ruleForm.orgCodes.join(',');
      this.ruleForm.orgName=this.ruleForm.orgName.join(',');
      console.log('this.ruleForm.orgCodes',this.ruleForm.orgCodes);
      console.log('this.ruleForm.orgName',this.ruleForm.orgName)
    },
    orgCancle(){
      this.$refs.tree3.setCheckedKeys([]);
      this.ruleForm.orgName="";
      this.ruleForm.orgCode="";
      this.dialogOrg=false;
    },
    getGroup(){
      this.dialogGroup=true;
      if(this.ruleForm.groupIds){
        console.log('this.groupData',this.groupData)
        let groupIdsArray=this.ruleForm.groupIds.split(",");
        let groupName =[];
        for(let i=0;i<groupIdsArray.length;i++){
          for(let j=0;j<this.groupData.length;j++){
            if(groupIdsArray[i]===this.groupData[j].groupId){
              setTimeout(()=>{
                console.log('this.$refs.groupTable',this.$refs.groupTable)
              this.$refs.groupTable.toggleRowSelection(this.groupData[j],true)
              console.log('groupIdsArray[i]',groupIdsArray[i])
              console.log('this.groupData[j]',this.groupData[j])
              })
            }
          }
        }
      }
    },
    getOrg(){
      this.dialogOrg=true;
      if(this.ruleForm.orgCodes){
        let orgCodesArray=this.ruleForm.orgCodes.split(',');
        console.log('orgCodesArray',orgCodesArray)
        let orgName=[];
        let arr=[];
        for(let i=0;i<orgCodesArray.length;i++){
          for(let j=0;j<this.orgTreeData.length;j++){
            if(orgCodesArray[i]===this.orgTreeData[j].orgCode){
              arr.push(this.orgTreeData[j].orgCode)
            }
          }
        }
        setTimeout(()=>{
          this.$refs.tree3.setCheckedKeys(arr,true);
        })
      }
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
        var node = toDo.shift(); 
        for (var i = 0; i < list.length; i++) {
          var row = list[i];
          if (row[pId] == node[myId]) {
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
  },
  watch: {
    categoryCode() {
      console.log("categoryCode", this.categoryCode);
      this.getAllTableData();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./processManager.scss";
.pui-process-manager__label {
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

