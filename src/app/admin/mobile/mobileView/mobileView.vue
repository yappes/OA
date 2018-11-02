<template>
  <div class="pui-mobile-view">
    <aui-select class="pui-mobile-view__module-select" v-model="selectModuleId" filterable placeholder="请选择模块">
      <aui-option v-for="item in moduleList" :key="item.id" :label="item.moduleName" :value="item.id">
      </aui-option>
    </aui-select>

    <aui-tabs v-model="activeName">
      <aui-tab-pane label="视图" name="view" >
        <pui-views-setting :moudle="selectModuleId" v-if="activeName == 'view'"></pui-views-setting>
      </aui-tab-pane>
      <aui-tab-pane label="操作" name="operation">
        <pui-operation-setting :module="selectModuleId" v-if="activeName == 'operation'"></pui-operation-setting>
      </aui-tab-pane>
      <aui-tab-pane label="视图公式" name="viewFormula">
        <pui-view-formulas-setting :moudle="selectModuleId" v-if="activeName == 'viewFormula'"></pui-view-formulas-setting>
      </aui-tab-pane>
      <aui-tab-pane label="视图条件" name="viewRule">
        <pui-view-rules-setting :moudle="selectModuleId" v-if="activeName == 'viewRule'"></pui-view-rules-setting>
      </aui-tab-pane>
      <aui-tab-pane label="操作条件" name="operationRule">
        <pui-operation-rules-setting :moudle="selectModuleId" v-if="activeName == 'operationRule'"></pui-operation-rules-setting>
      </aui-tab-pane>
    </aui-tabs>
  </div>
</template>
<script>
import { mobileViewService } from 'paas-web-utils/services';
import puiViewsSetting from './views/viewsSetting.vue';
import puiOperationSetting from './operations/operationsSetting.vue';
import puiViewRulesSetting from "./viewRules/viewRulesSetting.vue";
import puiOperationRulesSetting from "./operationRules/operationRulesSetting.vue";
import puiViewFormulasSetting from "./viewFormulas/viewFormulasSetting.vue";
export default {
  name: "PuiMobileView",

  components: {
    puiViewsSetting,
    puiOperationSetting,
    puiViewRulesSetting,
    puiOperationRulesSetting,
    puiViewFormulasSetting
  },

  data() {
    return {
      moduleList: [],
      selectModuleId: null,
      activeName: 'view',
    };
  },

  created() {
    this.$store.dispatch("adminNav/changeHeaderTitle", "移动端视图配置");
    this.findModuleList();
  },

  methods: {
    // 查询所有模块
    findModuleList() {
      mobileViewService.findModuleList({
        isDelete: 0
      }).then(res => {
        if(res && res.length) {
          this.moduleList = res;
          this.selectModuleId = res[0].id;
        }
      });
    },
  },
};
</script>

<style lang="scss">
  @import "./mobileView.scss";
</style>
