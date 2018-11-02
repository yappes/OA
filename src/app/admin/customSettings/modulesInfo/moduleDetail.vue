<template>
  <div class="pui-module-detail">
    <aui-dialog :close-on-click-modal="false" title="模块详情" show-full-icon @hide="cancel" :visible="show">
      <pui-col :minWidth="puiColMinWidth">
        <div class="pui-module-detail__item pui-module-detail__item--detail">
          <span class="feild-label">模块名称</span>
          <span class="feild-value">{{detailRow.moduleName}}</span>
        </div>
      </pui-col>
      <pui-col :minWidth="puiColMinWidth">
        <div class="pui-module-detail__item pui-module-detail__item--detail">
          <span class="feild-label">模块编码</span>
          <span class="feild-value">{{detailRow.moduleCode}}</span>
        </div>
      </pui-col>
      <pui-col :minWidth="puiColMinWidth">
        <div class="pui-module-detail__item pui-module-detail__item--detail">
          <span class="feild-label">创建用户编码</span>
          <span class="feild-value">{{detailRow.cUserCode}}</span>
        </div>
      </pui-col>
      <pui-col :minWidth="puiColMinWidth">
        <div class="pui-module-detail__item pui-module-detail__item--detail">
          <span class="feild-label">创建时间</span>
          <span class="feild-value">{{detailRow.createTime | timestampStringify}}</span>
        </div>
      </pui-col>
      <pui-col :minWidth="puiColMinWidth">
        <div class="pui-module-detail__item pui-module-detail__item--detail">
          <span class="feild-label">启用</span>
          <span class="feild-value">{{detailRow.dpEnable | booleanStringify}}</span>
        </div>
      </pui-col>
      <pui-col :minWidth="puiColMinWidth">
        <div class="pui-module-detail__item pui-module-detail__item--detail">
          <span class="feild-label">启用流程</span>
          <span class="feild-value">{{detailRow.isProcess | booleanStringify}}</span>
        </div>
      </pui-col>
      <pui-col :minWidth="puiColMinWidth">
        <div class="pui-module-detail__item pui-module-detail__item--detail">
          <span class="feild-label">是否自定义模块</span>
          <span class="feild-value">{{detailRow.isCustomModule | booleanStringify}}</span>
        </div>
      </pui-col>
      <pui-col :minWidth="puiColMinWidth">
        <div class="pui-module-detail__item pui-module-detail__item--detail">
          <span class="feild-label">启用数据分享</span>
          <span class="feild-value">{{detailRow.isDataSharing | booleanStringify}}</span>
        </div>
      </pui-col>
      <pui-col :minWidth="puiColMinWidth" full>
        <div class="pui-module-detail__item pui-module-detail__item--detail">
          <span class="feild-label">描述</span>
          <span class="feild-value">{{detailRow.description}}</span>
        </div>
      </pui-col>
    </aui-dialog>
  </div>
</template>

<script>
import { object } from "paas-web-utils/common/index.js";
import { modulesInfoService } from "paas-web-utils/services";

export default {
  name: "PuiModuleDetail",
  data(){
    return {
      puiColMinWidth: 200
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    detailRow: {
      type: Object
    }
  },
  methods: {
    cancel() {
      this.$emit("closeDialog");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./moduleDetail.scss";
</style>

