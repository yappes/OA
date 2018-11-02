<template>
  <div class="pui-modulesInfo">
    <div class="pui-list-grid__top">
      <div class="pui-list-grid__operations-wrapper">
        <aui-button @click="handleAdd" class="pui-list-grid__oper">新增</aui-button>
      </div>
    </div>
    <div class="pui-list-grid__table-wrapper">
      <aui-tabs v-model="activeName" @tab-click="handleClick">
        <aui-tab-pane label="邮箱配置" name="email">
          <aui-table empty-text="暂无数据" :data="tableData" tooltip-effect="dark" style="width: 100%">
            <aui-table-column type="index" label="序号" minWidth="55" fixed></aui-table-column>
            <aui-table-column label="操作" minWidth="55" fixed>
              <template slot-scope="scope">
                <aui-popover ref="popover1" placement="bottom-start" trigger="hover">
                  <ul>
                    <li class="pui-list-grid__oper-in-row-item" @click.stop="handleEdit(scope.$index, scope.row)">编辑</li>
                    <li class="pui-list-grid__oper-in-row-item" @click.stop="handleDelete(scope.$index, scope.row)">删除</li>
                  </ul>
                </aui-popover>
                <i class="pui-icon-fenlei" @click.stop v-popover:popover1></i>
              </template>
            </aui-table-column>
            <aui-table-column prop="name" label="邮箱名称" show-overflow-tooltip minWidth="200"></aui-table-column>
            <aui-table-column prop="address" label="邮箱地址" show-overflow-tooltip minWidth="200"></aui-table-column>
            <aui-table-column prop="host" label="服务器地址" show-overflow-tooltip minWidth="200"></aui-table-column>
            <aui-table-column prop="hostPort" label="服务器端口" show-overflow-tooltip minWidth="200"></aui-table-column>
            <aui-table-column prop="encryption" label="协议类型" show-overflow-tooltip minWidth="200"></aui-table-column>
          </aui-table>
        </aui-tab-pane>
      </aui-tabs>
    </div>
    <pui-pagination ref="pagination" style="margin:30px 0;" :datasource="{ 'currentPage': query.currentPage, 'pageSize': query.pageSize}" :totalRecord="totalRecord" v-show="totalRecord !== 0" @changeCurrentPage="changeCurrentPage" @changePageSize="changePageSize">
    </pui-pagination>
    <add-message v-if="activeName=='email'" @refreshData="getAllTableData" :isShow="isShow" @dialogStatus="dialogStatus" :editForm="editForm" :type="type"></add-message>
  </div>
</template>

<script>
import addMessage from "./addMessage.vue";
// import messageService from "../service/messageService.js";
import messageService from "../service/message-service.js";
export default {
  name: "messageConfig",
  components: {
    addMessage
  },
  data() {
    return {
      activeName:"email",
      isShow: false,
      query: {
        currentPage: 1,
        pageSize: 10,
      },
      totalRecord: 0,
      editRow: null,
      detailRow: null,
      tableData: [],
      fuzzyKey: "",
      showFormDialog: false,
      isEdit: false,
      showDetailDialog: false,
      editForm: {},
      type: ""
    };
  },
  mounted() {
    this.getAllTableData();
  },
  methods: {
    dialogStatus() {
      this.isShow = false;
    },
    getAllTableData() {
      if(this.activeName==="email"){
        messageService.getAllEntEmailPage({
          pageSize: this.query.pageSize,
          pageNow:this.query.currentPage,
        }).then(data => {
          console.log(data);
          this.tableData = data.record;
          console.log("data>>>>>>>>>>>", data);
          this.totalRecord = data.totalRecord;
        });
      }
    },
    //打开新增
    handleAdd() {
      this.isShow = true;
      this.type = "add";
    },
    //打开编辑
    handleEdit(index, row) {
      console.log(row);
      this.type = "edit";
      this.editForm = row;
      this.isShow = true;
    },
    // //删除
    handleDelete(index, row) {
      this.$aui.confirm
        .show("确定删除吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          console.log(row);
          messageService
            .delEntEmail({
              id: row.id
            })
            .then(data => {
              this.$aui.message.show({
                message: "删除成功",
                type: "success"
              });
              this.getAllTableData();
            });
        });
    },
    // 改变每页条数
    changePageSize(pageSize) {
      this.query.pageSize = pageSize;
      this.getAllTableData();
    },

    // 改变当前页码
    changeCurrentPage(currentPage) {
      this.query.currentPage = currentPage;
      this.getAllTableData();
    },
    handleClick(){

    }
  },
  created() {
    this.$store.dispatch("adminNav/changeHeaderTitle", "消息配置");
  }
};
</script>

<style lang="scss">
.aui-button {
  border-radius: 0;
}
/*表格样式*/
.aui-table__header thead th {
  background: #fff;
  height: 50px;
}
.aui-table th.is-leaf,
.aui-table td {
  border-bottom: none;
}
.aui-table tr {
  // box-shadow: inset 0px -1px 0px 0px #E5EBF4, inset 0px 1px 0px 0px #E5E3F4;
  box-shadow: none;
}
.aui-table__header {
  border-top: 1px solid #e5ebf4;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid #e5ebf4;
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

<style lang="scss" scoped>
.pui-modulesInfo {
  @import "./messageConfig.scss";
  // background: white;
  // padding:13px 20px;
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
.delete-dialog {
  .aui-dialog {
    border-radius: 10px;
    .aui-dialog__header {
      border-radius: 10px 10px 0 0;
    }
    .delete-text {
      font-size: 16px;
      padding: 20px 40px 0;
    }
  }
}
</style>


