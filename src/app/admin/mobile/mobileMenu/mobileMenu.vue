<template>
  <div class="pui-mobile-menu">
    <div class="pui-list-grid__top">
      <div class="pui-list-grid__operations-wrapper"><aui-button @click="handleAdd" class="pui-list-grid__oper">新增</aui-button></div>
      <aui-input v-model="fuzzyKey" @keyup.enter.native="enterKeyEvent()" size="medium" clearable class="pui-list-grid__fuzzy-search" placeholder="搜索" prefix-icon="aui-icon-search">
      </aui-input>
    </div>
    <div class="pui-list-grid__table-wrapper">
      <aui-table empty-text="暂无数据" @row-click="showDetail" 
        :data="tableData.record" 
        :default-sort = "{prop: 'menuOrder', order: 'ascending'}"
        tooltip-effect="dark" stripe
        @sort-change="handleSortChange"
        style="width: 100%">
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
        <aui-table-column label="菜单名称" sortable="custom" show-overflow-tooltip>
          <template slot-scope="scope" >
            <i :class="scope.row.iconClass" :style="'color:'+scope.row.iconColor+';position:static;width:20px;display:inline-block'"></i>
            <span>{{scope.row.menuName}}</span>
          </template>
        </aui-table-column>
        <aui-table-column prop="menuOrder" label="菜单排序" sortable="custom" show-overflow-tooltip></aui-table-column>
        <aui-table-column label="状态" sortable="custom" show-overflow-tooltip>
          <template slot-scope="scope" >
            <span v-if="scope.row.isEnable == 0">禁用</span>
            <span v-if="scope.row.isEnable == 1">启用</span>
          </template>
        </aui-table-column>
      </aui-table>
    </div>
    <pui-pagination
      ref="pagination" 
      style="margin:30px 0;" 
      :datasource="{ 'currentPage': query.currentPage, 'pageSize': query.pageSize, 'reload':query.reload}" 
      :totalRecord="tableData.totalRecord" 
      v-show="tableData.totalRecord !== 0"
      @changeCurrentPage="changeCurrentPage"
      @changePageSize="changePageSize">
    </pui-pagination>
    <pui-add-menu v-if="addShow" :isVisible="addShow" @closeDialog="handleCloseAdd" @initView="initView"></pui-add-menu>
    <pui-edit-menu v-if="editShow" :isVisible="editShow" @closeDialog="handleCloseEdit" @initView="initView" :editData="editData"></pui-edit-menu>
  </div>
</template>
<script>
import {menuService} from 'paas-web-utils/services';
import puiAddMenu from './addMenu';
import puiEditMenu from './editMenu'
export default {
  name: "PuiMobileMenu",
  components:{
    puiAddMenu,
    puiEditMenu,
    reload:false,
  },
  data() {
    return {
      query: {
        currentPage: 1,
        pageSize: 10,
      },
      fuzzyKey:'',
      addShow:false,
      editShow:false,
      editData:null,
      tableData:{},
      orderData: {
        sidx: "",
        order: ""
      }
    };
  },
  created() {
    this.$store.dispatch("adminNav/changeHeaderTitle", "移动端菜单配置");
    this.initView();
  },
  methods: {
    //查询
    enterKeyEvent(){
      this.query.currentPage = 1;
      this.query.pageSize = 10;
      this.query.reload = false;
      this.initView();
    },
    showDetail(row) {
      this.detailRow = row;
    },
    //获取数据
    initView(){
      let params = {
        "searchVal": this.fuzzyKey,
        "pageNow": this.query.currentPage,
        "pageSize": this.query.pageSize,
        "parentId":null,
        "sourceType": 1,
        "sidx":this.orderData.sidx,
        "order": this.orderData.order,
      };
      menuService.findMenuPage(params).then(data => {
        this.tableData = data;
        this.query.reload = true;
      });
    },
    // 改变顺序
    handleSortChange(data) {
      // console.log("this.handleSortChange.data",data);
      if (data.column === null || data.prop === null) {
        this.$set(this.orderData, "sidx", "");
        this.$set(this.orderData, "order", "");
      }  else if(data.column.label==="状态") {
        this.$set(this.orderData, "sidx", "isEnable");
        this.$set(this.orderData, "order", data.order === "ascending" ? "asc" : "desc");
      } else {
        this.$set(this.orderData, "sidx", data.prop);
        this.$set(this.orderData, "order", data.order === "ascending" ? "asc" : "desc");
      }
      this.initView();
      console.log("改变顺序", data);
    },
    //打开新增
    handleAdd(){
      this.addShow = true;
    },
    //打开编辑
    handleEdit(active){
      this.editShow = true;
      this.$set(this,'editData',active);
    },
    //删除
    handleDelete(active){
      this.$aui.confirm
      .show('确定删除吗？', '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        let params = {"menuId":active.id};
        menuService.removeMenu(params).then(data=>{
          console.log('删除成功');
          this.initView();
        })
      })
      .catch(()=>{});
    },
    //分页
    //改变当前页码
    changeCurrentPage(currentPage){
      this.query.currentPage = currentPage;
      this.initView();
    },
    //改变页面显示数量
    changePageSize(pageSize){
      this.query.pageSize = pageSize;
      this.initView();
    },
    //关闭对话框
    handleCloseAdd(){
      this.addShow = false;
    },
    handleCloseEdit(){
      this.editShow = false;
    },
  },
};
</script>

<style lang="scss">
.aui-button {
  border-radius: 0;
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
<style lang="scss" scoped>
@import './mobileMenu.scss';
.delete-dialog{
  .aui-dialog{
    border-radius:10px;
    .delete-text{
      font-size: 16px;
      padding: 20px 40px 0;
    }
  }
}
.pui-list-grid__oper-in-row-item {
  padding: 5px 10px;
  margin: 0 -12px;
  line-height: 24px;
  box-sizing: border-box;
  &:hover {
    background-color: #e5f9f7;
  }
}
</style>  