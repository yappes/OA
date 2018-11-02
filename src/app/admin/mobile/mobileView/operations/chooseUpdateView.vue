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
          <ul class="left-module-ul">
            <li class="left-module-li" v-for="item in moduleList" :key="item.id" @click="changeModule(item.id)">{{item.moduleName}}</li>
          </ul>
        </div>
        <div class="right-view">
          <aui-table
            :data="viewList"
            tooltip-effect="dark"
            style="width: 100%" stripe
            @row-click="selectView">
            <aui-table-column label="视图名称" prop="viewName" width="400" fixed="left"></aui-table-column>
          </aui-table>
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
  },
  data(){
    return{
      moduleList:null,
      viewList:null,
      moduleId:null,
      selectViewData:[],
    }
  },
  created(){
    this.getmoduleList();
  },
  watch:{
  
  },
  methods:{
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
        this.moduleId = this.moduleList[0].id
        this.getViewList();
      });
    },
    //获取视图集合
    getViewList(){
      let params = {
        moduleId: this.moduleId,
        viewFlag: 1,
        viewTypes: []
      };
      viewService.findViewsByModuleId(params).then(data => {
        this.viewList = data;
      });
    },
    //点击模块选择视图
    changeModule(activeModuleId){
      this.viewList = [];
      this.moduleId = activeModuleId;
      this.getViewList()
    },
    //单选数据
    selectView(row, event, column){
      if(!this.isMore){
        this.$emit('getUpdateView',row);
        this.handleClose();
      }
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
      overflow-y: scroll;
      padding-left: 10px;
      .left-module-ul{
        line-height: 26px;
        font-size: 14px;
        .left-module-li{
          cursor: pointer;
        }
      }
    }
    .right-view{
      flex: 1;
    }
  }

</style>
