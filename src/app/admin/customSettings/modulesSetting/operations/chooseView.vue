<template>
  <div class="pui-choose-view">
    <aui-dialog class="pui-choose-view-dialog"
    :close-on-click-modal="false"
        title="选择视图"
        :visible.sync="isShowVisible" 
        @hide="handleClose"
        @show="showView"
        append-to-body>
      <div class="pui-choose-view-select">
        <div class="left-module">
          <!-- 增加搜索框 -->
          <div class='left-module-search'>
            <aui-input v-model='searchLeft' placeholder='输入筛选模块' @input='searchLeftHandler(searchLeft)' clearable></aui-input>
          </div>
          <ul class="left-module-ul">
            <!-- :class="{ bgColor:active == item.id }" -->
            <li class="left-module-li" :class='{"left-module-li-active": isActive(item)}' v-for="item in showModuleList" :key="item.id" @click="changeModule(item.id)" >{{item.moduleName}}</li>
          </ul>
        </div>
        <div class="right-view">
          <div class='right-module-search'>
            <aui-input v-model='searchRight' placeholder='输入筛选视图' @input='searchRightHandler(searchRight)' clearable></aui-input>
          </div>
          <div class='right-view-table'>
            <aui-table
              :data="showViewList"
              ref="tableList"
              tooltip-effect="dark"
              style="width: 100%" stripe
              @select="selectViewMore"
              @select-all="selectViewMore">
              <aui-table-column label="视图名称" prop="viewName" width="400" fixed="left"></aui-table-column>
              <aui-table-column type="selection" width="55"></aui-table-column>
            </aui-table>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <aui-button :plain="true" @click="handleClose">取消</aui-button>
        <aui-button type="primary" @click="addMenu('form')">确定</aui-button> 
      </span>
    </aui-dialog>
  </div>
</template>
<script>
import { modulesInfoService } from "paas-web-utils/services";
import { viewService } from "paas-web-utils/services";
export default {
  name:"ChooseView",
  props:{
    isVisible: {
      type: Boolean,
      default: false
    },
    viewType:{
      type:String,
      default:'',
    },
    selectedData: {
      type: [Array, String]
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
      selectViewData: [],
      viewTypes:[],
      isShowVisible: false,
      _selectedData: this.selectedData,
    }
  },
  created(){
    this.getmoduleList();
    switch(this.viewType){
      case 'add' : this.viewTypes = [1,4,5];
        break;
      case 'addModule' : this.viewTypes = [1,4,5];
        break;
      case 'batchCtrl' : this.viewTypes = [1];
        break;
      case 'dataInsert' : this.viewTypes = [1,5];
        break;
      case 'dataOut' : this.viewTypes = [1,5];
        break;
      case 'delete' : this.viewTypes = [1,4,5];
        break;
      case 'detail' : this.viewTypes = [1,5];
        break;
      case 'edit' : this.viewTypes = [1,4,5];
        break;
      case 'processSubmit' : this.viewTypes = [1,5];
        break;
      case 'submit' : this.viewTypes = [1,2,3,4,5,8];
        break;
      case 'submitConfirm' : this.viewTypes = [1,2,3,4,5];
        break;
    }
  },
  watch:{
    isVisible(val){
      this.isShowVisible = val;
    },
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
    //表格弹框显示之后再调用
    showView() {
      let promises = []
      if(typeof this.selectedData === 'string') {
        this._selectedData = this.selectedData.split(',')
      } else {
        this._selectedData = this.selectedData
      }
      this._selectedData.forEach(id => {
        let p = viewService.findViewById({
          id,
          isOwnItem: false,
        })
        promises.push(p)
      })
      Promise.all(promises).then(datas => {
        //将prop数据selectedData添加到已选数据中
        this.selectViewData = datas
        this.setCheckedState();
      })
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
        this.setCheckedState();
      });
    },
    //获取视图集合
    getViewList(){
      let params = {
        moduleId: this.moduleId,
        viewFlag: 0,
        viewTypes: this.viewTypes,
      };
      viewService.findViewsByModuleId(params).then(data => {
        if(data != {}){
          this.viewList = data;
        }else{
          this.viewList = [];
        }
        this.searchRightHandler(this.searchRight)
      });
    },
    //弹框显示时获取已选择菜单并勾选
    setCheckedState(){
      let vm = this;
      if(this.viewList){
        this.viewList.forEach((row)=>{
          for (const data of vm.selectViewData) {
            if(row.id === data.id) {
              vm.$refs.tableList.toggleRowSelection(row,true);
            }
          }
        })
      }
    },
    //点击模块选择视图
    changeModule(activeModuleId){
      this.viewList = [];
      this.searchRight = ''
      this.moduleId = activeModuleId;
      this.getViewList();
      setTimeout(()=>{
        this.setCheckedState();
      },200);
    },
    //多选数据
    selectViewMore(selection, row){
      let viewIdList = this.viewList.map(e => {
        return e.id
      })
      //分两步得到勾选项
      this.selectViewData = this.selectViewData.filter(data => {
        return viewIdList.indexOf(data.id) < 0
      })
      this.selectViewData = [...this.selectViewData, ...selection];
    },
    // //保存多选
    addMenu(){
      console.log("勾选数据",this.selectViewData);
      this.$emit('getActiveViewMore',this.selectViewData)
      this.handleClose();
     
    },
    //关闭对话框
    handleClose(){
      this.$emit('closeDialog');
      this.selectViewData = [];
      this.$refs.tableList.clearSelection()
    },
  }
}
</script>
<style lang="scss" scoped>
@import "~theme/common/var";
  .pui-choose-view-select{
    height: 600px;
    display: flex;
    border-bottom: 1px solid #ccc;
    min-width: 630px;
    .left-module{
      // width: 160px;
      min-width: 160px;
      border-right: 1px solid #ccc;
      height: 100%;
      // overflow-y: scroll;
      padding-left: 10px;
      .left-module-search {
        height: 40px;
        padding: 5px 20px 5px 0;
      }
      .left-module-ul{
        line-height: 26px;
        font-size: 14px;
        height: 550px;
        overflow-y: scroll;
        .left-module-li{
          cursor: pointer;
          &:hover {
            background: $--hover-bgColor;
          }
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
    //  .bgColor{
    //   background: red;
    //   display:inline-block
    // }
  }

</style>
