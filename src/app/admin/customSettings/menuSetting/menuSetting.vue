<template>
  <div class="pui-menu-setting" ref='mainRight'>
    <div class="pui-list-grid__top">
      <div class="pui-list-grid__operations-wrapper"><aui-button @click="handleAdd" class="pui-list-grid__oper">新增</aui-button></div>
      <aui-input v-model="fuzzyKey" @keyup.enter.native="enterKeyEvent()" size="medium" clearable class="pui-list-grid__fuzzy-search" placeholder="搜索" prefix-icon="aui-icon-search">
      </aui-input>
    </div>
    <div class="pui-list-grid__table-wrapper">
      <aui-table empty-text="暂无数据" @row-click="showDetail" 
        :data="tableData.record" 
        tooltip-effect="dark" stripe
        :default-sort = "{prop: 'menuOrder', order: 'ascending'}"
        @sort-change="handleSortChange"
        style="width: 100%">
        <aui-table-column label="操作" minWidth="55" fixed>
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
        <!-- <aui-table-column sortable="custom"  label="菜单样式" show-overflow-tooltip>
          <template slot-scope="scope" >
            <i :class="scope.row.iconClass" v-if="scope.row.iconClass" :style="'color:'+scope.row.iconColor+';position:static'"></i>
          </template>
        </aui-table-column> -->
        <aui-table-column sortable="custom" label="二级菜单名称" show-overflow-tooltip>
          <template slot-scope="scope" >
            <i :class="scope.row.iconClass" :style="'color:'+scope.row.iconColor+';position:static;width:20px;display:inline-block'"></i>
            <span>{{scope.row.menuName}}</span>
          </template>
        </aui-table-column>
        <aui-table-column prop="menuOrder"  sortable="custom" label="菜单排序" show-overflow-tooltip></aui-table-column>
        <aui-table-column label="状态"   sortable="custom" show-overflow-tooltip>
          <template slot-scope="scope" >
            <span v-if="scope.row.isEnable == 0">禁用</span>
            <span v-if="scope.row.isEnable == 1">启用</span>
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
   
    <pui-add-menu v-if="addShow" :isVisible="addShow" @closeDialog="handleCloseAdd" @initView="initView"></pui-add-menu>
    <pui-edit-menu v-if="editShow" :isVisible="editShow" @closeDialog="handleCloseEdit" @initView="initView" :editData="editData"></pui-edit-menu>
  </div>
</template>
<script>
import {menuService} from 'paas-web-utils/services';
import { mapGetters, mapActions } from "vuex";
import puiAddMenu from './addMenu';
import puiEditMenu from './editMenu';
export default {
  name: "MenuSetting",
  components:{
    puiAddMenu,
    puiEditMenu,
  },
  data(){
    return {
      query: {
        currentPage: 1,
        pageSize: 10,
        reload:false,
      },
      addShow:false,
      editShow:false,
      editData:null,
      fuzzyKey:'',
      tableData:{},
      orderData: {
        // sidx: "createTime",
        // order: "ASC"
        sidx: "",
        order: ""
      }
    }
  },
  created(){
    this.$store.dispatch("adminNav/changeHeaderTitle", '菜单设置'); 
    this.initView();
  },
  computed:mapGetters({
    // tableData: "menuSetting/tableData",
    parentId: "menuSetting/parentId",
  }),
  watch:{
    'parentId':function(){
      this.query.currentPage = 1;
      this.query.pageSize = 10;
      this.query.reload = false;
      this.initView();
    }
  },
  methods:{
    //菜单列表模糊查询
    enterKeyEvent() {
      this.query.currentPage = 1;
      this.query.pageSize = 10;
      this.query.reload = false;
      // this.$store.dispatch("menuSetting/changeSearchVal",this.fuzzyKey);
      // this.$store.dispatch("menuSetting/changePageNow",1);
      this.initView();
    },
    //初始化页面数据
    initView(){
      // this.$store.dispatch("menuSetting/getTableData");
      let params = {
        "searchVal": this.fuzzyKey,
        "parentId": this.parentId,
        "sourceType": 0,
        "sidx":this.orderData.sidx,
        "order": this.orderData.order,
        "pageNow": this.query.currentPage,
        "pageSize": this.query.pageSize,
      };
      menuService.findMenuPage(params).then(data => {
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
     // 改变顺序
    // handleSortChange(data) {
    //   // console.log("this.handleSortChange.data",data);
    //   if (data.column === null || data.prop === null) {
    //     this.$store.dispatch("menuSetting/changeSidx","createTime");
    //     this.$store.dispatch("menuSetting/changeOrder","ASC");
    //   } else if(data.column.label==="状态") {
    //     this.$store.dispatch("menuSetting/changeSidx","isEnable");
    //     this.$store.dispatch("menuSetting/changeOrder",data.order === "ascending" ? "asc" : "desc");
    //   } else {
    //     this.$store.dispatch("menuSetting/changeSidx",data.prop);
    //     this.$store.dispatch("menuSetting/changeOrder",data.order === "ascending" ? "asc" : "desc");
    //   }
    //   // console.log("改变顺序", data);
    // },
    showDetail(row) {
      this.detailRow = row;
    },
    //打开新增对话框
    handleAdd(){
      if(!this.parentId){
        this.$aui.message.show({
          message: "请选择一级菜单",
          type: "warning"
        })
      }else{
        this.addShow = true;
      }
    },
    //打开编辑对话框
    handleEdit(active) {
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
      // this.$store.dispatch("menuSetting/changePageNow",currentPage);
      this.query.currentPage = currentPage;
      this.initView();
    },
    //改变页面显示数量
    changePageSize(pageSize){
      // this.$store.dispatch("menuSetting/changePageSize",pageSize);
      this.query.pageSize = pageSize;
      this.initView();
    }
  },
}
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
@import './menuSetting.scss';

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
.pui-menu-setting {
  .pagination-outer {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    margin:25px 0;
  }
}
</style>
