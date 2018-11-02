<template>
  <div class="pui-role">
    <div class="pui-list-grid__top">
      <div class="pui-list-grid__operations-wrapper">
        <aui-button @click="handleAdd" class="pui-list-grid__oper">新增</aui-button>
      </div>
      <aui-input @keyup.enter.native="enterKeyEvent()" size="medium" clearable class="pui-list-grid__fuzzy-search" placeholder="搜索" prefix-icon="aui-icon-search" v-model="fuzzyKey">
      </aui-input>
    </div>
    <div class="pui-list-grid__table-wrapper">
      <aui-table :data="tableData" @sort-change="handleSortChange" tooltip-effect="dark" stripe style="width: 100%">
        <aui-table-column label="操作" width="55" fixed>
          <template slot-scope="scope">
            <aui-popover ref="popover1" placement="bottom-start" trigger="hover">
              <ul>
                <li class="pui-list-grid__oper-in-row-item" @click.stop="handleSetPermission(scope.$index, scope.row)">设置权限</li>
                <li class="pui-list-grid__oper-in-row-item" @click.stop="handleEdit(scope.$index, scope.row)">编辑</li>
                <li class="pui-list-grid__oper-in-row-item" @click.stop="handleClone(scope.$index, scope.row)">克隆角色</li>
                <li class="pui-list-grid__oper-in-row-item" @click.stop="handleMember(scope.$index, scope.row)">授权角色</li>
                <li class="pui-list-grid__oper-in-row-item" v-if='allUsers' @click.stop="handleDelete(scope.$index, scope.row)">删除</li>
              </ul>
            </aui-popover>
            <i class="pui-icon-fenlei" @click.stop v-popover:popover1></i>
          </template>
        </aui-table-column>
        <aui-table-column type="index" :index="changeIndex" label="序号" width="55" fixed></aui-table-column>
        <aui-table-column prop="roleName" label="角色名称" sortable=“custom” show-overflow-tooltip></aui-table-column>
        <aui-table-column prop="roleCode" label="角色Code" sortable=“custom” show-overflow-tooltip></aui-table-column>
        <aui-table-column prop="isAdmin" label="是否为管理员" sortable=“custom” show-overflow-tooltip width="130">
          <template slot-scope="scope">
            {{scope.row.isAdmin | booleanStringify}}
          </template>
        </aui-table-column>
        <aui-table-column prop="roleDesc" label="角色描述" sortable=“custom” show-overflow-tooltip></aui-table-column>
        <aui-table-column prop="createTime" sortable=“custom” label="创建时间" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.createTime | timestampStringify}}
          </template>
        </aui-table-column>
      </aui-table>
    </div>

    <pui-pagination
    ref="pagination" 
    style="margin:30px 0;" 
    :datasource="{ 'currentPage': query.currentPage, 'pageSize': query.pageSize, 'reload':query.reload}" 
    :totalRecord="totalRecord" 
    v-show="totalRecord !== 0"
    @changeCurrentPage="changeCurrentPage"
    @changePageSize="changePageSize">
    </pui-pagination>

    <pui-role-edit v-if="showEditDialog" :editRow="editRow" :isEdit="isEdit" @getTableData="getTableData()" @closeDialog="handleCloseEdit"></pui-role-edit>
    <pui-role-permission v-if="showPerDialog" :editRow="editRow" @getTableData="getTableData()" @closeDialog="handleClosePer"></pui-role-permission>
    <pui-role-clone v-if="showCloneDialog" :editRow="editRow" @getTableData="getTableData()" @closeDialog="handleCloseClone"></pui-role-clone>
    <pui-role-member v-if="showMemberDialog" :editRow="editRow" @getTableData="getTableData()" @closeDialog="handleCloseMember"></pui-role-member>
  </div>
</template>
<script>
import { object } from "paas-web-utils/common/index.js";
import { roleService } from "paas-web-utils/services";
import puiRoleEdit from "./roleEdit.vue";
import puiRolePermission from "./rolePermission.vue";
import puiRoleClone from "./roleClone.vue";
import puiRoleMember from "./roleMember.vue";
export default {
  name: "PuiRole",

  components: {
    puiRoleEdit,
    puiRolePermission,
    puiRoleClone,
    puiRoleMember
  },

  data() {
    return {
      query: {
        currentPage: 1,
        order: "asc",
        pageSize: 20,
        sidx: "id",
        keyWord: null,
        isDelete: 0,
        reload:false,
      },
      tableData: [],
      totalRecord: 0,
      receiveCurrentPage: 1,
      editRow: null,
      detailRow: null,
      isEdit: false,
      fuzzyKey: "",
      showEditDialog: false,
      showPerDialog: false,
      showCloneDialog: false,
      showMemberDialog: false,
      allUsers: null
    };
  },

  created() {
    this.getTableData();
    this.$store.dispatch("adminNav/changeHeaderTitle", "角色权限");
    this.getAllUsers()
  },

  methods: {
    getAllUsers() {
      roleService.findUserList({ userIdList: [], orgCode: null, roleId: null }).then(data => {
        this.allUsers = data
      })
    }, 

    getRoleMembersByRoleId(id) {
      if(!this.allUsers) {
        return 
      }
      let roleMembers = []
      this.allUsers.forEach(member => {
        if(member.roleIds) {
          let roleIdList = member.roleIds.split(',');
          roleIdList.forEach(roleId => {
            if(roleId == id) {
              // this.$set(member, 'checked', true);
              roleMembers.push(member);
            }
          })
        }
      })
     return roleMembers
    },

    getTableData(params) {
      var params = params ? Object.assign({}, this.query, params) : this.query;
      roleService.findRoleByPage(params).then(data => {
        this.tableData = data.record;
        this.query.reload = true;
        this.totalRecord = data.totalRecord || 0;
        this.receiveCurrentPage = data.currentPage || 1;
      });
    },

     // 改变顺序
    handleSortChange(data) {
      if (data.column === null || data.prop === null) {
        this.$set(this.query, "sidx", "id");
        this.$set(this.query, "order", "asc");
      } else {
        this.$set(this.query, "sidx", data.prop);
        this.$set(this.query, "order", data.order === "ascending" ? "asc" : "desc");
      }
      this.getTableData();
      console.log("改变顺序", data);
    },
    
    enterKeyEvent() {
      this.query.currentPage = 1;
      this.query.pageSize = 10;
      this.query.reload = false;
      this.query.keyWord = this.fuzzyKey;
      this.$refs.pagination.customCurrentPage();
      this.getTableData();
    },

    handleAdd() {
      this.showEditDialog = true;
      this.isEdit = false;
    },

    handleEdit(index, row) {
      this.editRow = row;
      this.isEdit = true;
      this.showEditDialog = true;
    },

    handleClone(index, row) {
      this.editRow = row;
      this.showCloneDialog = true;
    },

    handleMember(index, row) {
      this.editRow = row;
      this.showMemberDialog = true;
    },

    handleDelete(index, row) {
      let id = row.id
      let roleMembers = this.getRoleMembersByRoleId(id)
      if(roleMembers && roleMembers.length > 0) {
        this.$aui.confirm.show('请删除本角色内所有用户后再删除本角色',{
          type: 'error',
          confirmButtonText: '确定',
          showCancelButton: false,
        })
        return
      }
      this.$aui.confirm
        .show("确定删除吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          roleService.deleteRole({ roleId: row.id }).then(res => {
            this.getTableData();
          });
        });
    },

    // 打开设置权限
    handleSetPermission(index, row) {
      this.editRow = row;
      this.showPerDialog = true;
    },

    // 关闭新增/编辑
    handleCloseEdit() {
      this.showEditDialog = false;
      this.isEdit = false;
    },

    // 关闭设置权限
    handleClosePer() {
      this.showPerDialog = false;
    },

    // 关闭角色克隆
    handleCloseClone() {
      this.showCloneDialog = false;
    },

    // 关闭角色成员
    handleCloseMember() {
      this.showMemberDialog = false;
    },

    // 改变序号
    changeIndex(index) {
      return (
        index + (this.receiveCurrentPage - 1) * this.query.pageSize + 1
      );
    },

    // 改变每页条数
    changePageSize(pageSize) {
      this.query.pageSize = pageSize;
      this.getTableData();
    },

    // 改变当前页码
    changeCurrentPage(currentPage) {
      this.query.currentPage = currentPage;
      this.getTableData();
    }
  }
};
</script>

<style lang='scss' scoped>
  /*messageBox组件中的第一个 按钮样式*/
  // .aui-message-box__wrapper {
  //   .aui-message-box {
  //     &>.aui-message-box__btns {
  //       &>.aui-button:first-child {
  //         &:hover {
  //           background: #ffffff;
  //         }
  //       }
  //     }
  //   }
  // }

</style>

<style lang='scss'>
@import "./role.scss";
.aui-button {
  border-radius: 0;
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

/*表格样式*/
  .aui-table__header thead th {
    background:#FFF;
    height: 50px;
  }
  .aui-table th.is-leaf, .aui-table td {
    border-bottom: none;
  }
  .aui-table tr {
    // box-shadow: inset 0px -1px 0px 0px #E5EBF4, inset 0px 1px 0px 0px #E5E3F4;
    box-shadow:none;
  }
  .aui-table__header {
    border-top: 1px solid #E5EBF4;
    border-left: none;
    border-right: none;
    border-bottom:  1px solid #E5EBF4;
  }
  .aui-table__header thead th .cell {
    color: #909399;
    font-weight: bold;
  }
  .aui-table--striped .aui-table__body tr.aui-table__row--striped td {
    background: #f7f7f7;
  }
/*dialog弹框*/
.aui-dialog__body {
  overflow-x: auto;
}

</style>
