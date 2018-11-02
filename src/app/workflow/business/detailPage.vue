<template>
  <div class="pui-workflow-business">
    <pui-layout>
      <pui-btns-top slot="topBar" ref="btnsTop" back is-watch-scroll></pui-btns-top>
      <div slot="full">
        <div class="pui-detailPage__header-wrapper">
          <!-- <pui-btns-top slot="topBar" ref="btnsTop" back is-watch-scroll></pui-btns-top> -->
          <div class="pui-detailPage__title">
            <i class="pui-icon-xiangqing1"></i>{{view.title}}
          </div>
        </div>
        <template v-for="group in groups">
          <catalog-module :is-detail="true" :key="group.id" :model="group"></catalog-module>
        </template>
      </div>
    </pui-layout>
  </div>
</template>

<script>
import {
  workflowTaskService,
  workflowProcessService
} from "paas-web-utils/services";
import ViewGroup from "paas-web-utils/rules/view-group.js";
import workflowDetail from "./workflow-detail.vue";
import catalogModule from "./catalogModule/src/catalogModule.vue";
export default {
  props: {
    view: Object,
    isAlteration: Boolean
  },
  components: {
    workflowDetail,
    catalogModule
  },
  computed: {
    groups() {
      if (this.$route.query.hide) {
        return this.view.groups;
      }
      let groups = [];
      for (const group of this.view.groups) {
        groups.push(group);
      }
      if (!this["[[workflowDetail]]"]) {
        this["[[workflowDetail]]"] = new ViewGroup(this.view, {
          name: this.$route.query.taskId ? "流程审批" : "流程历史",
          colList: []
        });
        this["[[workflowDetail]]"].render();
        this["[[workflowDetail]]"].appointRender(() => {
          return <workflowDetail />;
        });
      }
      groups.push(this["[[workflowDetail]]"]);
      console.log('detail groups', groups)
      return groups;
    }
  },
  mounted() {
    console.log("view", this.view);
    for (const group of this.view.groups) {
      if (group.operations) {
        this.$set(group.operations, "buttons", []);
        this.$set(group.operations, "component", []);
        this.$set(group.operations, "detail", []);
      }
    }
  },
  methods: {
    change() {
      workflowTaskService
        .findCommentsByTaskIdOrInstanceId({ taskId: this.$route.query.taskId })
        .then(data => {
          console.log("data", data);
        });
    }
  }
};
</script>
<style lang='scss'>
@import "~theme/common/var";
@import "~theme/mixins/utils";

.pui-workflow-business {
  height: calc(100% - 150px);
}

.pui-detailPage__header-wrapper {
  @include utils-clearfix;
}

.pui-detailPage__title {
  float: left;
  font-size: $--font-size-largest;
  color: $--color-primary;
  font-weight: $--font-weight-primary;
  

  .pui-icon-xiangqing1 {
    font-size: inherit;
    font-weight: inherit;
    margin-right: 7px;
  }

  .data {
    width: 100%;
    height: 400px;
  }

  .history {
    margin: 80px;
    width: 60%;
  }
  .show {
    position: relative;
    left: -32px;
    display: block;
    margin: auto 0;
    /* display: block;
  width: 30px; */
  }
  .ability {
    position: relative;
    left: 80px;
  }
}
</style>
