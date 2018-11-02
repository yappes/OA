<template>
  <div class="pui-editPage">
    <pui-layout>
      <pui-btns-top slot="topBar" ref="btnsTop" :operations="buttons" back @button-click="validate"></pui-btns-top>
      <div slot="full">
        <div class="pui-editPage__header-wrapper">
          <div class="pui-editPage__title">
            <i class="pui-icon-xiangqing1"></i>{{view.title}}
          </div>
        </div>
        <template v-for="group in showGroups">
          <pui-catalog-module :isDetail="false" :key="group.$id" :model="group" ref="catalogs"></pui-catalog-module>
        </template>
      </div>
    </pui-layout>
  </div>
</template>
<script>
import axios from "axios"
import {
  workflowAuthService,
  workflowProcessService
} from "paas-web-utils/services";
import { InsertView, ViewGroup, BatchView } from "paas-web-utils/rules";
import workflowForm from "./workflow-form";
export default {
  components: { workflowForm },
  props: {
    view: Object,
    buttons: Array,
    isAlteration: Boolean
  },
  data() {
    return {};
  },
  computed: {
    type() {
      return this.query.type;
    },
    query() {
      return this.$route.query;
    },
    processDefinitionId() {
      return this.$route.params.processDefinitionId;
    },
    //筛选出hidden为true的groups，自定义页面会修改group的hidden
    //过滤掉隐藏的group，防止污染scroller的index
    showGroups() {
      let showGroups = this.view.groups.filter(group => {
        return !group.hidden;
      });
      if (!this["[[workflowForm]]"]) {
        this["[[workflowForm]]"] = new ViewGroup(this.view, {
          id: "workflowForm",
          name: "流程信息",
          colList: []
        });
        this["[[workflowForm]]"].render();
        this["[[workflowForm]]"].appointRender((createElement, config) => {
          return this.$createElement("workflowForm", config);
        });
      }
      showGroups.splice(0, 0, this["[[workflowForm]]"]);
      return showGroups;
    },
    workflowModel() {
      return this.$refs.component.formModel;
    }
  },
  methods: {
    validate(btn) {
      let promises = [this.$refs.component.validate()];
      this.$refs.catalogs.forEach(catalog => {
        promises.push(catalog.validate());
      });
      return Promise.all(promises).then(
        () => {
          this.buttonClick(btn);
        },
        error => {
          if (!(error instanceof Error)) {
            this.$aui.notify.show.error({
              title: "校验错误",
              message: "表单校验未通过"
            });
          }
        }
      );
    },
    buttonClick(btn) {
      let res = this.view.submitModel;
      let submitData = {};
      let promise = undefined;
      if (this.type == "process") {
        submitData = {
          processDefinitionId: this.processDefinitionId,
          title: this.workflowModel.title,
          level: this.workflowModel.level,
          currentGroup: this.workflowModel.groupId,
          flowType: btn.type,
          columnMap: res.columnMap,
          batchColumn: res.batchColumn,
          variables: {},
          viewId: res.viewId,
          moduleId: this.query.moduleId
        };
        if (btn.submitUri) {
          promise = axios.post(btn.submitUri, submitData);
        } else {
          promise = workflowProcessService.saveColumnAndStart(submitData);
        }
      } else if (this.type == "edit" || this.type == "alterationProcess") {
        // 判断是否为变更流程
        submitData = {
          processDefinitionId: this.processDefinitionId,
          taskId: this.query.taskId,
          businessId: this.query.businessId,
          title: this.workflowModel.title,
          level: this.query.level,
          currentGroup: this.query.currentGroup,
          flowType: btn.type,
          moduleId: this.query.moduleId,
          record: res,
          isChange: this.isAlteration ? "TRUE" : "FALSE",
          changeRecord: this.isAlteration ? JSON.stringify(this.view.getChangeContent()) : ""
        };
        if (btn.submitUri) {
          promise = axios.post(btn.submitUri, submitData);
        } else {
          promise = workflowProcessService.updateDraft(submitData);
        }
      }

      promise.then(() => {
        this.$aui.message.show({
          message: "操作成功",
          type: "success"
        });
        this.$router.push(btn.uri);
      });
    }
  }
};
</script>
<style lang='scss'>
@import "~theme/common/var";
@import "~theme/mixins/utils";

.pui-editPage__header-wrapper {
  @include utils-clearfix;
}

.pui-editPage__title {
  float: left;
  font-size: $--font-size-largest;
  color: $--color-primary;
  font-weight: $--font-weight-primary;

  .pui-icon-xiangqing1 {
    font-size: inherit;
    font-weight: inherit;
    margin-right: 7px;
  }
}
</style>
