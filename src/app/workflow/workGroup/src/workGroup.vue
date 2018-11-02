<template>
  <div class="pui-work-group" style="background: #eef1f5">
    <!-- <h2>工作组</h2> -->
    <div class="pui-work-group__up" ref="up">
      <div class="pui-work-group__item1">
        <label for="input1" class="pui-work-group__label">工作组名称:</label>
        <aui-input type="text" placeholder="工作组名称" id="input1" v-model="groupName"></aui-input>
      </div>
      <div class="pui-work-group__item1">
        <label for="input2" class="pui-work-group__label">工作组编码:</label>
        <aui-input type="text" placeholder="工作组编码" id="input2" v-model="groupCode"></aui-input>
      </div>
      <div class="pui-drafts__operations">
        <pui-btn :heightStr="heightStr" :widthStr="widthStr" class="pui-list-grid__oper" @click="getAllTableData">查询</pui-btn>
        <pui-btn :heightStr="heightStr" :widthStr="widthStr" class="pui-list-grid__oper" @click="groupName='';groupCode=''">重置</pui-btn>
      </div>
    </div>
    <div class="pui-work-group__main" :style="{minHeight:minHeight}">
      <div class="pui-drafts__operations">
        <pui-btn :heightStr="heightStr" class="pui-list-grid__oper" @click="dialogFormVisible=true">新增</pui-btn>
        <pui-btn :heightStr="heightStr" class="pui-list-grid__oper" @click="editWorkGroup">编辑</pui-btn>
        <pui-btn :heightStr="heightStr" class="pui-list-grid__oper" @click='disableWorkGroup'>停用</pui-btn>
        <pui-btn :heightStr="heightStr" class="pui-list-grid__oper" @click="enableWorkGroup">启用</pui-btn>
        <pui-btn :heightStr="heightStr" class="pui-list-grid__oper" @click="manintain">维护成员</pui-btn>
        <pui-btn :heightStr="heightStr" class="pui-list-grid__oper" @click="syncEntInfo">同步企业用户</pui-btn>
        <pui-btn :heightStr="heightStr" class="pui-list-grid__oper" @click="syncOrganization">同步组织架构</pui-btn>
        <pui-btn :heightStr="heightStr" class="pui-list-grid__oper" @click="batchDel">批量删除</pui-btn>
      </div>
      <div class="pui-work-group__down">
        <aui-table empty-text="暂无数据" v-loading="loading" ref="multipleTable" stripe :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <aui-table-column type="selection" minWidth="40" fixed></aui-table-column>
          <aui-table-column prop="serialNumber" label="序号" minWidth="80" fixed></aui-table-column>
          <aui-table-column prop="groupName" label="工作组名称" show-overflow-tooltip minWidth="180"> </aui-table-column>
          <aui-table-column prop="groupCode" label="工作组编码" show-overflow-tooltip minWidth="180"> </aui-table-column>
          <aui-table-column prop="classes" label="分类" show-overflow-tooltip minWidth="150"> </aui-table-column>
          <aui-table-column prop="description" label="描述" show-overflow-tooltip minWidth="180"> </aui-table-column>
          <aui-table-column prop="createTime" label="创建时间" show-overflow-tooltip minWidth="150"> </aui-table-column>
          <aui-table-column prop="status" label="状态" show-overflow-tooltip> </aui-table-column>
        </aui-table>
        <pui-workflow-pagination :currentPage='page.pageNow' :pageSize='page.pageSize' :totalRecord='page.totalRecord' @select-page="pageChange" style="margin:30px 0;">
        </pui-workflow-pagination>
      </div>
    </div>

    <!-- 新增工作组弹窗 -->
    <aui-dialog title="新增工作组" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <aui-form label-width="100px">
        <aui-form-item label="工作组名称" prop='groupName'>
          <aui-input v-model="form.groupName" auto-complete="off" placeholder="请输入工作组名称"></aui-input>
        </aui-form-item>
        <aui-form-item label="工作组编码" prop='groupCode'>
          <aui-input v-model="form.groupCode" auto-complete="off" placeholder="请输入工作组编码"></aui-input>
        </aui-form-item>
        <aui-form-item label="工作组类别">
          <aui-radio class="radio" v-model="form.type" label="DEPT">部门</aui-radio>
          <aui-radio class="radio" v-model="form.type" label="TEMPORARY">临时</aui-radio>
        </aui-form-item>
        <aui-form-item label="工作组状态">
          <aui-radio class="radio" v-model="form.state" label="ENABLE">启用</aui-radio>
          <aui-radio class="radio" v-model="form.state" label="DISABLE">禁用</aui-radio>
        </aui-form-item>

        <aui-form-item label="工作组描述">
          <aui-input type="textarea" :rows="2" placeholder="请输入描述内容" v-model="form.description"></aui-input>
        </aui-form-item>
      </aui-form>
      <div slot="footer" class="dialog-footer">
        <aui-button :plain="true" @click="onCancel()">取 消</aui-button>
        <aui-button type="primary" @click="onSure()">确 定</aui-button>
      </div>
    </aui-dialog>
    <!-- 编辑弹窗 -->
    <aui-dialog title="编辑工作组" :visible.sync="dialogEditFormVisible" :close-on-click-modal="false">
      <aui-form label-width="100px" :model="editForm">
        <aui-form-item label="工作组名称" prop='groupName'>
          <aui-input v-model="editForm.groupName" auto-complete="off" placeholder="请输入工作组名称"></aui-input>
        </aui-form-item>
        <aui-form-item label="工作组类别">
          <aui-radio class="radio" v-model="editForm.type" label="DEPT">部门</aui-radio>
          <aui-radio class="radio" v-model="editForm.type" label="TEMPORARY">临时</aui-radio>
        </aui-form-item>
        <aui-form-item label="工作组状态">
          <aui-radio class="radio" v-model="editForm.state" label="ENABLE">启用</aui-radio>
          <aui-radio class="radio" v-model="editForm.state" label="DISABLE">禁用</aui-radio>
        </aui-form-item>
        <aui-form-item label="工作组描述">
          <aui-input type="textarea" :rows="2" placeholder="请输入描述内容" v-model="editForm.description"></aui-input>
        </aui-form-item>
      </aui-form>
      <div slot="footer" class="dialog-footer">
        <aui-button :plain="true" @click="dialogEditFormVisible=false">取 消</aui-button>
        <aui-button type="primary" @click="confirmEdit('editForm')">确 定</aui-button>
      </div>
    </aui-dialog>
    <!-- 删除 -->
    <aui-dialog :close-on-click-modal="false" title="批量删除" :visible.sync="deleteDialog">
      <aui-form>
        <p>确认删除吗？</p>
      </aui-form>
      <div slot="footer" class="dialog-footer">
        <aui-button :plain="true" @click="deleteDialog = false">取消</aui-button>
        <aui-button type="primary" @click="shanchu">确 定</aui-button>
      </div>
    </aui-dialog>
    <!-- 维护成员 -->
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

        <aui-table ref="multipleTable" :data="memberMessage" tooltip-effect="dark" style="width: 60%;margin-left:35%;overflow-y:auto; overflow-x:hidden;height:260px" @selection-change='handleSelect'>
          <aui-table-column type="selection" width="30px"> </aui-table-column>
          <aui-table-column label="姓名" prop="userName">
          </aui-table-column>
          <aui-table-column prop="email" label="邮箱">
          </aui-table-column>
        </aui-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <aui-button :plain="true" @click="dialogEditMember=false">取 消</aui-button>
        <aui-button type="primary" @click="sureMain">确 定</aui-button>
      </div>
    </aui-dialog>
  </div>
</template>

<script>
import pageMixin from "../../mixin/index.js";
import data from "./data.js";
import {
  workflowAuthService,
  workflowProcessService
} from "paas-web-utils/services";
export default {
  name: "PuiWorkGroup",
  mixins: [pageMixin],
  component: {},
  data() {
    return {
      loading: true,
      input1: "",
      input2: "",
      heightStr: "35px",
      widthStr: "60px",
      buttons: [
        { id: 1, name: "新增" },
        { id: 2, name: "编辑" },
        { id: 3, name: "停用" },
        { id: 4, name: "启用" },
        { id: 5, name: "维护成员" },
        { id: 6, name: "批量删除" }
      ],
      tableData: [],
      groupName: "",
      groupCode: "",
      groupIds: [],
      form: {
        //工作组id需要唯一 AOS_+唯一id
        groupName: "",
        groupCode: "",
        type: "DEPT",
        state: "ENABLE",
        description: ""
      },
      dialogFormVisible: false,
      editForm: {
        groupId: "", //工作组id需要唯一 AOS_+唯一id
        groupName: "",
        type: "",
        state: "",
        description: ""
      },
      dialogEditFormVisible: false,
      deleteDialog: false,
      dialogEditMember: false,
      filterText: "",
      member: "",
      treeData: [],
      orgCode: "",
      memberMessage: [],
      userIds: [],
      myMembers: "",
      minHeight: ""
    };
  },
  mounted() {
    this.getAllTableData();
    // this.getOrgAll();
    this.$store.dispatch("adminNav/changeHeaderTitle", "工作组");
    this.high();
  },
  methods: {
    handleClick(tab, event) {
      //console.log(tab,event);
    },
    handleSelectionChange(val) {
      // this.multipleSelection = val ;
      this.groupIds = [];
      for (let i = 0; i < val.length; i++) {
        this.groupIds.push(val[i].groupId);
      }
      if (val.length == 1) {
        this.editForm.groupId = val[0].groupId;
        this.editForm.groupName = val[0].groupName;
        this.editForm.groupCode = val[0].groupCode;
        this.editForm.type = val[0].type;
        this.editForm.state = val[0].state;
        this.editForm.description = val[0].description;
        console.log(this.editfrom);
      }
    },
    syncEntInfo() {
      console.log(1);
      workflowProcessService.syncUser({}).then(data => {
        this.$aui.message.show({
          message: "用户同步成功",
          type: "success"
        });
      });
    },
    syncOrganization() {
      workflowProcessService.syncOrganization({}).then(data => {
        this.$aui.message.show({
          message: "组织同步成功",
          type: "success"
        });
      });
    },
    // 维护成员
    // 获取部门下用户
    getUserOrg() {
      workflowAuthService
        .findUserOrgCode({ orgCode: this.orgCode })
        .then(data => {
          this.memberMessage = data;
        });
    },
    // 模糊查询用户
    findUserByName() {
      workflowAuthService.findUserByName({ name: this.member }).then(data => {
        this.memberMessage = data;
      });
    },
    handleSelect(selection) {
      this.userIds = [];
      let myMembers = [];
      for (let i = 0; i < selection.length; i++) {
        this.userIds.push(selection[i].userId);
        myMembers.push(selection[i].userName);
      }
      console.log(myMembers);
      this.myMembers = myMembers.join("，");
      console.log(this.userIds);
    },
    // 获取企业组织架构
    getOrgAll() {
      workflowAuthService.findOrgAll().then(data => {
        this.treeData = this.listToTree("orgCode", "orgParentCode", data);
      });
    },
    handleNodeClick(data) {
      console.log(data.orgCode);
      this.orgCode = data.orgCode;
      this.getUserOrg();
    },
    manintain() {
      if (this.groupIds.length == 0) {
        this.$aui.message.show({
          message: "未选择操作对象",
          type: "warning"
        });
      } else if (this.groupIds.length > 1) {
        this.$aui.message.show({
          message: "只能选择一个操作对象",
          type: "warning"
        });
      } else {
        this.dialogEditMember = true;
      }
    },
    sureMain() {
      workflowAuthService
        .bindShipByGroupIdAndUserId({
          groupId: this.groupIds[0],
          userIds: this.userIds
        })
        .then(data => {
          this.$aui.message.show({
            message: "维护成功",
            type: "success"
          });
        });
    },
    // 批量删除
    shanchu() {
      workflowAuthService.delGroups({ groupIds: this.groupIds }).then(data => {
        this.$aui.message.show({
          message: "删除成功",
          type: "success"
        });
        this.getAllTableData();
        this.deleteDialog = false;
      });
    },
    batchDel() {
      if (this.groupIds.length == 0) {
        this.$aui.message.show({
          message: "未选择操作对象",
          type: "warning"
        });
      } else {
        this.deleteDialog = true;
      }
    },
    // 新建工作组
    onSure() {
      workflowAuthService.saveGroup(this.form).then(data => {
        this.$aui.message.show({
          message: "创建成功",
          type: "success"
        });
        this.getAllTableData();
        this.dialogFormVisible = false;
        this.form = {
          groupName: "",
          groupCode: "",
          type: "DEPT",
          state: "ENABLE",
          description: ""
        };
      });
    },
    onCancel() {
      this.dialogFormVisible = false;
      this.form = {
        groupName: "",
        groupCode: "",
        type: "DEPT",
        state: "ENABLE",
        description: ""
      };
    },
    // 编辑工作组
    editWorkGroup() {
      if (this.groupIds.length == 0) {
        this.$aui.message.show({
          message: "未选择操作对象",
          type: "warning"
        });
      } else if (this.groupIds.length > 1) {
        this.$aui.message.show({
          message: "只能选择一个操作对象",
          type: "warning"
        });
      } else {
        this.dialogEditFormVisible = true;
      }
    },
    confirmEdit() {
      workflowAuthService.update(this.editForm).then(data => {
        this.$aui.message.show({
          message: "编辑成功",
          type: "success"
        });
        this.dialogEditFormVisible = false;
        this.getAllTableData();
      });
    },
    // 启用工作组
    enableWorkGroup() {
      if (this.groupIds.length == 0) {
        this.$aui.message.show({
          message: "未选择操作对象",
          type: "warning"
        });
      } else {
        workflowAuthService
          .enableGroupsByIds({ groupIds: this.groupIds })
          .then(data => {
            this.$aui.message.show({
              message: "启用成功",
              type: "success"
            });
            this.getAllTableData();
          });
      }
    },
    // 禁用工作组
    disableWorkGroup() {
      if (this.groupIds.length == 0) {
        this.$aui.message.show({
          message: "未选择操作对象",
          type: "warning"
        });
      } else {
        workflowAuthService
          .disableGroupsByIds({ groupIds: this.groupIds })
          .then(data => {
            this.$aui.message.show({
              message: "禁用成功",
              type: "success"
            });
            this.getAllTableData();
          });
      }
    },
    getAllTableData() {
      (this.loading = true),
        workflowAuthService
          .findGroups({
            groupName: this.groupName,
            groupCode: this.groupCode,
            pageNow: this.page.pageNow,
            pageSize: this.page.pageSize
          })
          .then(data => {
            if (data == null || data.record == null) {
              this.tableData = [];
              this.loading = false;
            } else {
              let list = data.record;
              for (let i = 0; i < list.length; i++) {
                list[i].serialNumber = i + 1;
                list[i].status = list[i].state == "ENABLE" ? "启用" : "禁用";
                list[i].classes = list[i].type == "TEMPORARY" ? "临时" : "部门";
                list[i].createTime = this.switchDate(list[i].createTime);
              }
              this.tableData = list;
              this.loading = false;
              this.updatePage(data);
            }
          });
    },
    switchDate(date) {
      if (data == null) {
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
      var height = this.$refs.up.offsetHeight;
      this.minHeight = window.innerHeight - height - 48 - 50 - 45 + "px";
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./workGroup.scss";
.pui-work-group__label {
  display: inline-block;
  width: 100px;
  text-align: right;
}
.aui-button {
  border-radius: 0;
}
.pui-work-group {
  // padding: 15px;  //工作流页面启用
  padding: 0; //后台设置启用
  box-sizing: border-box;
  background: $--body-bgcolor; //标签内样式 后台设置启用
}
</style>

