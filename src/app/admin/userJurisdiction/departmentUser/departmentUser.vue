<template>
  <div class="pui-department-user" name="right-content" ref='mainRight'>
    <div class="pui-list-grid__top">
      <div class="pui-list-grid__operations-wrapper"><aui-button @click="handleAdd" class="pui-list-grid__oper">新增</aui-button></div>
      <!-- <div class="pui-list-grid__operations-wrapper1"><span  class="pui-list-grid__oper1">编辑</span></div>
      <div class="pui-list-grid__operations-wrapper1"><span  class="pui-list-grid__oper1">修改密码</span></div>
      <div class="pui-list-grid__operations-wrapper1"><span  class="pui-list-grid__oper1">数据转移</span></div>
      <div class="pui-list-grid__operations-wrapper1"><span  class="pui-list-grid__oper1">删除</span></div>
      <div class="pui-list-grid__operations-wrapper1"><span  class="pui-list-grid__oper1">更多</span></div> -->
      <aui-input v-model="fuzzyKey" @keyup.enter.native="enterKeyEvent()" size="medium" clearable class="pui-list-grid__fuzzy-search" placeholder="搜索" prefix-icon="aui-icon-search">
      </aui-input>
    </div>
    <div class="pui-list-grid__table-wrapper">
      <aui-table empty-text="暂无数据" @row-click="showDetail"  @sort-change="handleSortChange"  stripe :data="tableData.record" tooltip-effect="dark" style="width: 100%">
        <aui-table-column label="操作" width="55" fixed>
          <template slot-scope="scope">
            <aui-popover ref="popover1" placement="bottom-start" trigger="hover">
              <ul>
                <li class="pui-list-grid__oper-in-row-item" @click.stop="handleEdit(scope.row)">编辑</li>
                <li class="pui-list-grid__oper-in-row-item" @click.stop="handleDelete(scope.row)">删除</li>
              </ul>
            </aui-popover> 
            <i class="pui-icon-fenlei" @click.stop v-popover:popover1></i> 
          </template>
        </aui-table-column>
        <aui-table-column prop="realName" sortable=“custom” label="姓名" show-overflow-tooltip></aui-table-column>
        <aui-table-column label="性别" sortable=“custom” show-overflow-tooltip>
          <template slot-scope="scope" >
            <span v-if="scope.row.sex == 0">女</span>
            <span v-if="scope.row.sex == 1">男</span>
          </template>
        </aui-table-column>
        <aui-table-column prop="mobile" label="手机号" sortable="custom" show-overflow-tooltip width="150"></aui-table-column>
        <aui-table-column prop="orgName" label="部门" sortable=“custom” show-overflow-tooltip ></aui-table-column>
        <aui-table-column prop="createTime" sortable=“custom” label="日期" show-overflow-tooltip width="200">
          <template slot-scope="scope">
            {{scope.row.createTime | timestampStringify}}
          </template>
        </aui-table-column>
        <aui-table-column label="状态" sortable=“custom” show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0">禁用</span>
            <span v-if="scope.row.status == 1">启用</span>
          </template>
        </aui-table-column>
      </aui-table>
    </div> 
    <div class="pagination-outer">
      <pui-pagination
        ref="pagination" 
        style="margin:5px 0;minWidth:825px" 
        :datasource="{ 'currentPage': query.currentPage, 'pageSize': query.pageSize, 'reload':query.reload}" 
        :totalRecord="tableData.totalRecord" 
        v-show="tableData.totalRecord !== 0"
        @changeCurrentPage="changeCurrentPage"
        @changePageSize="changePageSize">
      </pui-pagination>
    </div>
   
    <pui-user-add v-if="addShow" :isVisible="addShow" @closeDialog="handleCloseAdd" @initView="initView"></pui-user-add>
    <pui-user-edit v-if="editShow" :isVisible="editShow" @closeDialog="handleCloseEdit" @initView="initView" :editRow="editRow"></pui-user-edit>
  </div>
</template>

<script>
import { orgService,userService } from "paas-web-utils/services";
import { mapGetters, mapActions } from "vuex";
import puiUserAdd from './userAdd'; 
import puiUserEdit from './userEdit';
export default {
  name: "DepartmentUser",
  components:{
    puiUserAdd,
    puiUserEdit,
  },
  data: function() {
    return {
      query: {
        currentPage: 1,
        pageSize: 10,
        reload:false,
      },
      tableData:{},
      editRow: null,
      detailRow:null,
      fuzzyKey: "",
      showFormDialog: false,
      isEdit: false,
      showDetailDialog: false,
      addShow:false,
      editShow:false,
      orderData: {
        sidx: "createTime",
        order: "ASC"
      }
    };
  },
  computed: mapGetters({
    // tableData: "userSelectByOrg/tableData",
    curOrgCode: "userSelectByOrg/curOrgCode",
  }),
  created: function() {
    this.initView();
  },
  watch:{
    'curOrgCode':function(){
      this.query.currentPage = 1;
      this.query.pageSize = 10;
      this.query.reload = false;
      this.initView();
    }
  },
  methods: {
    //查询
    enterKeyEvent(){
      this.query.currentPage = 1;
      this.query.pageSize = 10;
      this.query.reload = false;
      // this.$store.dispatch("userSelectByOrg/changeSearchKey",this.fuzzyKey);
      this.initView();
    },
    //初始化页面数据
    initView(){
      // this.$store.dispatch("userSelectByOrg/getTableData");
      let params = {
        "orgId":null,
        "searchKey":this.fuzzyKey,
        "orgCode":this.curOrgCode,
       "sidx":this.orderData.sidx,
        "order": this.orderData.order,
        "currentPage": this.query.currentPage,
        "pageSize": this.query.pageSize,
      }
      userService.findUserByPage(params).then(data => {
        this.tableData = data;
        this.query.reload = true;
        setTimeout(() => {
         this.$store.dispatch('asideHeight/setAsideHeight',this.$refs.mainRight.offsetHeight-150+'px')
        });
      });
    },
      // 改变顺序
    handleSortChange(data) {
      //console.log("this.handleSortChange.data",data);
      if (data.column === null || data.prop === null) {
        this.$set(this.orderData, "sidx", "createTime");
        this.$set(this.orderData, "order", "ASC");
      } 
      else if(data.column.label==="性别") {
        this.$set(this.orderData, "sidx", "sex");
        this.$set(this.orderData, "order", data.order === "ascending" ? "asc" : "desc");
      } else if(data.column.label==="状态") {
       this.$set(this.orderData, "sidx", "status");
        this.$set(this.orderData, "order", data.order === "ascending" ? "asc" : "desc");
      } 
      else {
        this.$set(this.orderData, "sidx", data.prop === "orgName"?"orgCode":data.prop);
        this.$set(this.orderData, "order", data.order === "ascending" ? "asc" : "desc");
      }
      this.initView();
      console.log("改变顺序", data);
    },
    //新增
    handleAdd(){
      this.addShow = true;
    },
    //
    showDetail(row) {
      this.detailRow = row;
      this.showDetailDialog = true;
    },
    //编辑
    handleEdit(activeData) {
      this.editShow = true;
      this.editRow = activeData;
    },
    //删除
    handleDelete(activeData) {
      this.$aui.confirm
      .show('确定删除吗？', '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        let params = {'userId':activeData.id};
        userService.removeUser(params).then(data=>{
          this.initView();
        })
      });
    },
    //关闭对话框
    handleCloseAdd(){
      this.addShow = false;
    },
    handleCloseEdit(){
      this.editShow = false;
    },
    //分页
    //改变当前页码
    changeCurrentPage(currentPage){
      // this.$store.dispatch("userSelectByOrg/getTableData",{currentPage:currentPage});
      this.query.currentPage = currentPage;
      this.initView();
    },
    //改变页面显示数量
    changePageSize(pageSize){
      // this.$store.dispatch("userSelectByOrg/getTableData",{pageSize:pageSize});
      this.query.pageSize = pageSize;
      this.initView();
    },
  },
};
</script>


<style lang="scss">
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

<style lang="scss" scoped>
@import "./departmentUser.scss";
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
.delete-dialog{
  .aui-dialog{
    border-radius:10px;
    .delete-text{
      font-size: 16px;
      padding: 20px 40px 0;
    }
  }
}
//分页样式
.pui-department-user {
  .pagination-outer {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    margin:25px 0;
  }
}

//弹框样式
.pui-department-user /deep/ {
  .pui-user-ctrl__form {
    padding: 0px 9% 0px 3%;
    min-width: 300px;
  }
  .pui-col {
    width: 100%;
  }
}
</style>

