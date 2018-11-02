<template>
  <div class="pui-field-form">
    <aui-dialog :close-on-click-modal="false" title="新增模块" width="820px" show-full-icon @hide="cancel()" :visible="show">
      <aui-tabs type="border-card" tab-position="left" @tab-click="handleTabClick">
        <aui-tab-pane>
          <span slot="label">普通输入</span>
          <normal-input @formPersistence="formPersistenceHandler"></normal-input>
        </aui-tab-pane>
        <aui-tab-pane label="富文本">
          <rich-text @formPersistence="formPersistenceHandler"></rich-text>
        </aui-tab-pane>
        <aui-tab-pane label="日期">
          <date @formPersistence="formPersistenceHandler"></date>
        </aui-tab-pane>
        <aui-tab-pane label="外键">
          <foreign-key @formPersistence="formPersistenceHandler"></foreign-key>
        </aui-tab-pane>
        <aui-tab-pane label="字典"><dictionary></dictionary></aui-tab-pane>
        <aui-tab-pane label="依赖关系"><dependency></dependency></aui-tab-pane>
        <aui-tab-pane label="数据选择"><data-select></data-select></aui-tab-pane>
        <aui-tab-pane label="数字和浮点"><number></number></aui-tab-pane>
        <aui-tab-pane label="金额"><amount></amount></aui-tab-pane>
        <aui-tab-pane label="上传"><upload></upload></aui-tab-pane>
        <aui-tab-pane label="部门、人员"><dept-or-person></dept-or-person></aui-tab-pane>
        <aui-tab-pane label="自动编码"><auto-encode></auto-encode></aui-tab-pane>
        <!-- <aui-tab-pane v-for="(form,index) in forms" :label="form.label" :key="index">
            <component :is="form.type" ref="component"></component>
          </aui-tab-pane>  -->
      </aui-tabs>
      <div slot="footer" class="dialog-footer">
        <aui-button :plain="true" @click="cancel()">取 消</aui-button>
        <aui-button type="primary" @click="submitForm">确定</aui-button>
      </div>
    </aui-dialog>
  </div>
</template>

<script>
  import {
    constraintService
  } from "paas-web-utils/services";
  import {
    columnService
  } from "paas-web-utils/services";
  
  import NormalInput from "./normalnput.vue";
  import RichText from "./richText.vue";
  import Date from "./date.vue";
  import ForeignKey from "./foreignkey.vue";
  import Dictionary from "./dictionary.vue";
  import Dependency from "./dependency.vue";
  import DataSelect from "./dataSelect.vue";
  import Number from "./number.vue";
  import Amount from "./amount.vue";
  import Upload from "./upload.vue";
  import DeptOrPerson from "./deptOrPerson.vue";
  import AutoEncode from "./autoEncode.vue"

  export default {
    name: "fieldForm",
    components: {
      NormalInput,
      RichText,
      Date,
      ForeignKey,
      Dictionary,
      Dependency,
      DataSelect,
      Number,
      Amount,
      Upload,
      DeptOrPerson,
      AutoEncode
      // normalInput: {
      //   mixins: [config],
      //   render(h) {
      //     return <NormalInputForm/>;
      //   }
      // },
      // richText: {
      //   mixins: [config],
      //   render(h) {
      //     return <RichTextForm/> ;
      //   }
      // },
      // date: {
      //   mixins: [config],
      //   render(h) {
      //     return < DateForm/>;
      //   }
      // },
      // foreignKey: {
      //   mixins: [config],
      //   render(h) {
      //     return <ForeignKeyForm/>;
      //   }
      // }
    },
    data() {
      return {
        forms: [{
          type: "normalInput",
          label: "普通输入"
        }, {
          type: "richText",
          label: "富文本"
        }, {
          type: "date",
          label: "日期"
        }, {
          type: "foreignKey",
          label: "外键"
        }],
        isSubmit: false
      };
    },
    props: {
      show: {
        type: Boolean,
        default: false
      },
      editRow: {
        type: Object
      },
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      hideAndRefresh() {
        this.cancel();
        this.$emit("refreshTable"); //刷新列表
      },
      cancel() {
        this.$emit("closeDialog");
      },
      submitForm() {
        this.$root.Bus.$emit("fieldForm-Submit");
      },
      formPersistenceHandler(formData, cb = function() {}) {
        if (this.isEdit === false) {
          columnService.addField(formData).then(res => {
            // console.info("持久化完成");
            cb();
            this.hideAndRefresh();
          });
        }
      },
      handleTabClick(tab, event) {
        // console.log(tab, event);
      }
    },
    created: function() {}
  };
</script>

<style lang="scss">


.pui-field-form {
  & .aui-dialog__body {
    padding: 0;
  }
  & .dialog-footer {
    text-align: right;
    padding: 25px 20px 20px 20px;
  }
  & .aui-tabs--border-card {
    &>.aui-tabs__content {
      padding: 15px 0 0 15px;
    }
  }
  & .aui-input-number {
    width: 240px;
  }
}

</style>
