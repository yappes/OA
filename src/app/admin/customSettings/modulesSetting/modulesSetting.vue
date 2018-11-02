<template>
  <div class="pui-modules-setting" ref="modulesSetting" style="padding-bottom:0">
    <aui-select class="pui-modules-setting__module-select" ref="moduleSelect" :value="selectModule" @change="handleSelectModule" filterable placeholder="请输入或者选择模块">
      <aui-option v-for="item in moduleOptions" :key="item.id" :label="item.moduleName" :value="item.id" filterable>
      </aui-option>
    </aui-select>
    <aui-tabs v-model="activeName" @tab-click="handleClick">
      <aui-tab-pane label="字段" name="field">
        <pui-fields-setting :module="selectModule" v-if="activeName == 'field'"></pui-fields-setting>
      </aui-tab-pane>
      <aui-tab-pane label="视图" name="view" >
        <pui-views-setting :moudle="selectModule" v-if="activeName == 'view'"></pui-views-setting>
      </aui-tab-pane>
      <aui-tab-pane label="操作" name="operation">
        <pui-operation-setting :module="selectModule" v-if="activeName == 'operation'"></pui-operation-setting>
      </aui-tab-pane>
      <aui-tab-pane label="视图公式" name="viewFormula">
        <pui-view-formulas-setting :moudle="selectModule" v-if="activeName == 'viewFormula'"></pui-view-formulas-setting>
      </aui-tab-pane>
      <aui-tab-pane label="视图条件" name="viewRule">
        <pui-view-rules-setting :moudle="selectModule" v-if="activeName == 'viewRule'"></pui-view-rules-setting>
      </aui-tab-pane>
      <aui-tab-pane label="操作条件" name="operationRule">
        <pui-operation-rules-setting :moudle="selectModule" v-if="activeName == 'operationRule'"></pui-operation-rules-setting>
      </aui-tab-pane>
    </aui-tabs>
  </div>
</template>

<script>
import { modulesInfoService } from "paas-web-utils/services";
import puiViewsSetting from "./views/viewsSetting.vue";
import puiFieldsSetting from "./fieldsSetting/fieldsSetting.vue";
import puiViewFormulasSetting from "./viewFormulas/viewFormulasSetting.vue";
import puiViewRulesSetting from "./viewRules/viewRulesSetting.vue";
import puiOperationRulesSetting from "./operationRules/operationRulesSetting.vue";
import puiOperationSetting from "./operations/operationsSetting.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "modulesSettingPage",
  data() {
    return {
      activeName: "field",
    };
  },
  mounted() {
    this.getParamsId();
    
  },
  watch:{
    moduleOptions(){
      // this.getParamsId();
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    //获取 在模块信息页面点击列表操作项中的模块配置 跳转至该页面后所传递来的id
    getParamsId() {
      let routerParamsId = this.$route.params.id ;
      // console.log("this.$route.params.id",this.$route.params.id);
      //  console.log("selectModule",this.selectModule);
      //  console.log("moduleOptions",this.moduleOptions);
      //if(!routerParamsId) return;
      // this.handleSelectModule(routerParamsId || this.moduleOptions[0].id);
      this.handleSelectModule(routerParamsId);
      //  console.log("selectModule",this.selectModule);
      
    },
    handleSelectModule(val) {
      this.$store.dispatch(
        "modulesSetting/changeCurModuleId",
        val
      );
    },
  },
  components: {
    puiFieldsSetting,
    puiViewsSetting,
    puiViewFormulasSetting,
    puiViewRulesSetting,
    puiOperationRulesSetting,
    puiOperationSetting,
  },
  computed: mapGetters({
    moduleOptions: "modulesSetting/allModules",
    selectModule: "modulesSetting/curModuleId",
    
  }),
  created() {
    this.$store.dispatch("adminNav/changeHeaderTitle", "模块配置");
    this.$store.dispatch("modulesSetting/getAllModulesOpt");
  }
};
</script>

<style lang='scss'>
@import "./modulesSetting.scss";
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