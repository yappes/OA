<template>
  <div class="pui-dictionary" ref='mainRight'>
    <div class="pui-list-grid__top">
      <div class="pui-list-grid__operations-wrapper">
        <aui-button @click="handleAdd" class="pui-list-grid__oper">新增</aui-button>
      </div>
      <div class="pui-list-grid__operations-wrapper">
        <aui-button @click="editGroup" class="pui-list-grid__oper">批量编辑</aui-button>
      </div>
      <div class="pui-list-grid__operations-wrapper">
        <aui-button @click="handleRemoveGroup" class="pui-list-grid__oper">批量删除</aui-button>
      </div>
      <aui-input v-model="fuzzyKey" @keyup.enter.native="enterKeyEvent()" size="medium" clearable class="pui-list-grid__fuzzy-search" placeholder="搜索" prefix-icon="aui-icon-search">
      </aui-input>
    </div>
    <div class="pui-list-grid__table-wrapper">
      <aui-table empty-text="暂无数据" 
        @row-click="showDetail" 
        :data="tableData.record" 
        tooltip-effect="dark" 
        stripe style="width: 100%" 
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange">
        <aui-table-column type="selection" width="55" fixed></aui-table-column>
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
        <aui-table-column prop="dictName" label="字典名称" sortable=“custom” show-overflow-tooltip></aui-table-column>
        <aui-table-column prop="dictCode" label="字典编码" sortable=“custom” show-overflow-tooltip></aui-table-column>
        <aui-table-column prop="dictType" label="所属业务类别编码" sortable=“custom” show-overflow-tooltip></aui-table-column>
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
   
    <pui-add-dictionary v-if="addShow" :isVisible="addShow" @closeDialog="handleCloseAdd" @initView="initView"></pui-add-dictionary>
    <pui-edit-dictionary v-if="editShow" :isVisible="editShow" @closeDialog="handleCloseEdit" :activeGroup="activeGroup" @initView="initView"></pui-edit-dictionary>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { dictionaryService } from "paas-web-utils/services";
import puiAddDictionary from "./addDictionary";
import puiEditDictionary from "./editDictionary";
export default {
  name: "Dictionary",
  components: {
    puiAddDictionary,
    puiEditDictionary
  },
  data: function() {
    return {
      query: {
        currentPage: 1,
        pageSize: 10,
        reload:false,
      },
      detailRow: null,
      fuzzyKey: "",
      addShow: false,
      editShow: false,
      activeGroup: [],
      activeRow: null,
      dictCode: [],
      tableData:{},
      orderData: {
        sidx: "",
        order: ""
      }
    };
  },
  computed: mapGetters({
    // tableData: "dictionary/tableData",
    dictType: "dictionary/dictType",
    // totalRecord: "dictionary/totalRecord"
  }),
  created() {
    this.initView();
    this.$store.dispatch("adminNav/changeHeaderTitle", "系统字典");
  },
  watch:{
    'dictType':function(){
      this.query.currentPage = 1;
      this.query.pageSize = 10;
      this.query.reload = false;
      this.initView();
    }
  },
  methods: {
    //初始化页面数据
    initView() {
      // this.$store.dispatch("dictionary/getTableData");
      if(this.dictType){
        let params = {
          "pageSize": this.query.pageSize,
          "currentPage": this.query.currentPage,
          "dictType": this.dictType,
          "dictName": this.fuzzyKey,
          "sidx":this.orderData.sidx,
          "order": this.orderData.order,
        };
        dictionaryService.findDictionariesPage(params).then(data => {
          this.tableData = data;
          this.query.reload = true;
          setTimeout(() => {
          this.$store.dispatch('asideHeight/setAsideHeight',this.$refs.mainRight.offsetHeight-150+'px')
          });
        });
      }
    },
      // 改变顺序
    handleSortChange(data) {
      //console.log("this.handleSortChange.data",data);
      if (data.column === null || data.prop === null) {
        this.$set(this.orderData, "sidx", "");
        this.$set(this.orderData, "order", "");
      } else {
        this.$set(this.orderData, "sidx", data.prop);
        this.$set(this.orderData, "order", data.order === "ascending" ? "asc" : "desc");
      }
      this.initView();
      console.log("改变顺序", data);
    },
    showDetail(row) {
      this.detailRow = row;
    },
    //新增
    handleAdd() {
      if (!this.dictType) {
        this.$aui.message.show({
          message: "请选择业务类别",
          type: "warning"
        });
      } else {
        this.addShow = true;
      }
    },
    //单选编辑
    handleEdit(activeData) {
      this.editShow = true;
      this.activeGroup[0] = activeData;
    },
    //单选删除
    handleDelete(activeData) {
      this.$aui.confirm
      .show('确定删除吗？', '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        let parame = {'dictIds':[activeData.id]};
        dictionaryService.removeDictionary(parame).then(data=>{
          this.initView();
        })
      })
      .catch(()=>{});
    },
    //勾选
    handleSelectionChange(val) {
      this.dictCode = [];
      this.activeGroup = val;
      for(let i=0; i<this.activeGroup.length; i++){
        this.dictCode.push(this.activeGroup[i].dictCode);
      }
    },
    //多选编辑
    editGroup() {
      if (this.dictCode.length != 0) {
        this.editShow = true;
      } else {
        this.$aui.message.show({
          message: "请选择数据项",
          type: "warning"
        });
      }
    },
    //多选删除
    handleRemoveGroup() {
      if (this.dictCode.length == 0) {
        this.$aui.message.show({
          message: "请选择数据项",
          type: "warning"
        })
      } else {
        this.$aui.confirm
        .show('确定删除吗？', '提示', {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let arr = [];
          this.activeGroup.forEach((v,k) => {
            arr.push(v.id)
          });
          let parame = {'dictIds':arr};
          dictionaryService.removeDictionary(parame).then(data=>{
            this.initView();
          })
        })
        .catch(()=>{});
      }
    },
    removeGroup() {
      let arr = [];
      this.activeGroup.forEach((v, k) => {
        arr.push(v.id);
      });
      let parame = { dictIds: arr };
      dictionaryService.removeDictionary(parame).then(data => {
        this.initView();
      });
    },
    //查询
    enterKeyEvent() {
      this.query.currentPage = 1;
      this.query.pageSize = 10;
      this.query.reload = false;
      // this.$store.dispatch("dictionary/changeSearchKey", this.fuzzyKey);
      // this.$store.dispatch("dictionary/changePageNow", 1);
      this.initView()
    },
    //分页
    //改变当前页码
    changeCurrentPage(currentPage) {
      // this.$store.dispatch("dictionary/changePageNow", currentPage);
      this.query.currentPage = currentPage;
      this.initView();
    },
    //改变页面显示数量
    changePageSize(pageSize) {
      // this.$store.dispatch("dictionary/changePageSize", pageSize);
      this.query.pageSize = pageSize;
      this.initView();
    },
    //关闭对话框
    handleCloseAdd() {
      this.addShow = false;
    },
    handleCloseEdit() {
      this.editShow = false;
    },
    closeInfo() {
      this.infoShow = false;
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
@import "./dictionary.scss";
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
.delete-dialog {
  .aui-dialog {
    border-radius: 10px;
    .delete-text {
      font-size: 16px;
      padding: 20px 40px 0;
    }
  }
}
//分页样式
.pui-dictionary {
  .pagination-outer {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    margin:25px 0;
  }
}
</style>

