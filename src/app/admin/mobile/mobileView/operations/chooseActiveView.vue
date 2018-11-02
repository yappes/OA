<template>
  <div class="pui-choose-view">
    <aui-dialog class="pui-choose-view-dialog"
    :close-on-click-modal="false"
        title="选择视图"
        :visible="isVisible" 
        @hide="handleClose"
        append-to-body>
      <div class="pui-choose-view-select">
        <div class="left-module">
          <!-- 增加搜索框 -->
          <div class='left-module-search'>
            <aui-input v-model='searchLeft' placeholder='输入筛选模块' @input='searchLeftHandler(searchLeft)' clearable></aui-input>
          </div>
          <ul class="left-module-ul">
            <li class="left-module-li" :class='{"left-module-li-active": isActive(item)}' v-for="item in showModuleList" :key="item.id" @click="changeModule(item.id)">{{item.moduleName}}</li>
          </ul>
        </div>
        <div class="right-view">
          <div class='right-module-search'>
            <aui-input v-model='searchRight' placeholder='输入筛选视图' @input='searchRightHandler(searchRight)' clearable></aui-input>
          </div>
          <div class='right-view-table'>
            <aui-table
              :data="showViewList"
              tooltip-effect="dark"
              style="width: 100%" stripe
              @row-click="selectView">
              <aui-table-column label="视图名称" prop="viewName" width="400" fixed="left"></aui-table-column>
            </aui-table>
          </div>
        </div>
      </div>
    </aui-dialog>
  </div>
</template>
<script>
import { modulesInfoService } from "paas-web-utils/services";
import { viewService } from "paas-web-utils/services";
export default {
  name:"ChooseActiveView",
  props:{
    isVisible: {
      type: Boolean,
      default: false,
    },
    viewType:{
      type:String,
      default:'',
    }
  },
  data(){
    return{
      //搜索数据
      searchLeft: '',
      searchRight: '',
      //过滤后的moduleList数据
      showModuleList: [],
      showViewList: [],
      moduleList:[],
      viewList:[],
      moduleId:null,
      selectViewData:[],
      viewTypes:[],
    }
  },
  created(){
    this.getmoduleList();
    //目标页面选择
    //viewTypes: 视图类型集合
    switch(this.viewType){
      //新增
      // case 'add' : this.viewTypes = [2];
      case 'add' : this.viewTypes = [2, 5];
        break;
      //新增关联模块数据
      case 'addModule' : this.viewTypes = [2,5];
        break;
      //批量操作
      case 'batchCtrl' : this.viewTypes = [1];
        break;
      //数据导入
      case 'dataInsert' : this.viewTypes = [1];
        break;
      //数据导出
      case 'dataOut' : this.viewTypes = [1];
        break;
      //删除
      case 'delete' : this.viewTypes = [1];
        break;
      //明细查询
      case 'detail' : this.viewTypes = [4,5];
        break;
      //编辑
      // case 'edit' : this.viewTypes = [8];
      case 'edit' : this.viewTypes = [3, 5, 8];
        break;
      //流程提交
      case 'processSubmit' : this.viewTypes = [1];
        break;
      //提交
      case 'submit' : this.viewTypes = [1,2,5];
        break;
      //确认提交
      case 'submitConfirm' : this.viewTypes = [1,2];
        break;
    }
  },
  methods:{
    //选中条目颜色设置
    isActive(item) {
      return item.id === this.moduleId
    },
    //增加搜索框进行筛选
    searchLeftHandler(val) {
      if(val) {
        let r = this.moduleList.filter(el => {
          return el.moduleName.indexOf(this.searchLeft) >= 0
        })
        this.showModuleList = r
      } else {
        this.showModuleList = this.moduleList
      }
    },
    searchRightHandler(val) {
      if(val) {
        let r = this.viewList.filter(el => {
          return el.viewName.indexOf(this.searchRight) >= 0
        })
        this.showViewList = r
      } else {
        this.showViewList = this.viewList
      }
    },
    //获取模块集合
    getmoduleList(){
      let moduleParams = {
        moduleIds: [],
        isRelated: 0,
        isCustom: 1,
        isDelete: 0
      };
      modulesInfoService.findModules(moduleParams).then(data => {
        this.moduleList = data;
        this.showModuleList = data
        this.moduleId = this.moduleList[0].id
        this.getViewList();
      });
    },
    //获取视图集合
    getViewList(){
      let params = {
        moduleId: this.moduleId,
        viewFlag: 1,
        viewTypes: this.viewTypes,
      };
      viewService.findViewsByModuleId(params).then(data => {
        if(data instanceof Array){
          this.viewList = data;
        }else {
          this.viewList = []
        }
        this.searchRightHandler(this.searchRight)
      });
    },
    //点击模块选择视图
    changeModule(activeModuleId){
      this.viewList = [];
      this.searchRight = ''
      this.moduleId = activeModuleId;
      this.getViewList()
    },
    //单选数据
    selectView(row, event, column){
      this.$emit('getActiveView',row);
      this.handleClose();
    },
    //关闭对话框
    handleClose(){
      this.$emit('closeDialog');
    },
  }
}
</script>
<style lang="scss" scoped>

  .pui-choose-view-select{
    height: 600px;
    display: flex;
    border-bottom: 1px solid #ccc;
    .left-module{
      width: 160px;
      border-right: 1px solid #ccc;
      height: 100%;
      // overflow-y: scroll;
      padding-left: 10px;
      .left-module-search {
        height: 40px;
        padding: 5px 20px 5px 0;
      }
      .left-module-ul{
        height: 550px;
        overflow-y: scroll;
        line-height: 26px;
        font-size: 14px;
        .left-module-li{
          cursor: pointer;
        }
        .left-module-li-active {
          color: #26B7AE;
        }
      }
    }
    .right-view{
      flex: 1;
      margin-left: 20px;
      .right-module-search {
        height: 40px;
        width: 450px;
        padding: 5px 0;
      }
      .right-view-table {
        height: 550px;
        overflow-y: scroll;
      }

    }
  }

</style>
