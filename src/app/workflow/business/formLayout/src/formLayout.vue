<template>
  <div class="pui-form-layout">
    <aui-form :model="formModel" :rules="rules" ref="form">
      <pui-col :key="column.$id" v-for="column in columns" class="pui-form-layout__items" 
        :full="column.full" :class="{'pui-form-layout__item--detail': isDetail}" v-show="!column.hidden">
        <aui-form-item 
          :class="['pui-form-layout__form-item',{'is-highlight': column.isHighlight}]" 
          :label="isDetail ? column.gridLabel : column.label" 
          :prop="column.valKey" 
          :status-icon="false" 
          label-width="160px">
          <template v-if="!isDetail || isEdits[column.$id]">
            <from-adaptive :form-model="formModel" :column="column"></from-adaptive>
          </template>
          <template v-else class="pui-form-item__content">
            <!-- <file-preview v-if="column.type.val === 'image' || column.type.val === 'file'" :files="formModel[column.showValKey]"></file-preview> -->
            <file-preview-history v-if="column.type.val === 'image' || column.type.val === 'file'" :files="formModel[column.showValKey]"></file-preview-history>
            <span v-else class="showValue pui-form-layout__detail" style="width:100%;word-wrap:break-word" v-html="showValue(formModel, column)"></span>
          </template>
          <!-- <template v-if="isDetail && !column.isRelated && !column.isOtherModuleRelated">
              <span class="edit-operation-wrapper">
                <i class="pui-icon-xieyoujian" @click="editField(column)" v-show="isDetail && !isEdits[column.$id]"></i>
                <i class="pui-icon-baocun" @click="cancelField(column)" v-show="isEdits[column.$id]"></i>
                <i class="pui-icon-close" @click="cancelField(column)" v-show="isEdits[column.$id]"></i>
              </span>
            </template> -->
        </aui-form-item>
      </pui-col>
    </aui-form>
  </div>
</template>
<script>
import FilePreview from "./file-preview";
import FilePreviewHistory from "./file-preview-history";
export default {
  name: "PuiFormLayout",
  props: {
    isDetail: {
      type: Boolean,
      default: false
    },
    formView: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isEdits: {},
      columns: [],
      rules: {},
      formModel: {}
      // labelColor: (this.isDetail?'#ACBBD3':'#31394A'),
      // labelAlign: (this.isDetail?'left':'right')
    };
  },
  mounted() {
    // 将数据使用getter和setter方法设置到上下文中
    this.$set(this, "formModel", this.formView.formModel);
    this.$set(this, "rules", this.formView.rules);
    this.$set(this, "columns", this.formView.columns);
    this.isEdit = !this.isDetail;
    console.log(this.formView.title, "formModel", this.formModel);
    console.log(this.formView.title, "formView", this.formView);
  },
  methods: {
    showValue(formModel, column) {
      let value = formModel[column.valKey];
      if (column.type.format) {
        if(column.columnData.colMark === "MONEY"){
          if(String(value).indexOf('=>') === -1){
            return (
            column.type.format(value,column.columnData.decimalLen) ||
            formModel[column.showValKey]
          );
          }else{
            return value;
          }
        }else if(column.columnData.colMark === "DATE" || column.columnData.colMark === "NUMBER"){
          if(String(value).indexOf('=>') === -1){
            return (
              column.type.format(value) ||
              formModel[column.showValKey]
            );
          }else{
            return value;
          }
        }else{
          return (
            column.type.format(value) ||
            formModel[column.showValKey]
          );
        }
      }
      let showVal = formModel[column.showValKey];
      if (showVal === null || showVal === "null") showVal = undefined;
      let val = formModel[column.valKey];
      if (val === null || val === "null") val = undefined;
      return showVal || val;
    },
    editField(column) {
      this.$set(this.isEdits, `${column.$id}`, true);
    },
    submitField(column) {
      let submitModel = {
        viewId: column.view.$id,
        columnMap: {}
      };
      submitModel.columnMap[column.fromSubmitKey] = this.formModel[
        column.valKey
      ];
      submitModel.columnMap["obj.ID"] = column.view.recordId;
      // TODO: AJAX提交数据 自动刷新数据 (异步)
      this.$set(this.isEdits, `${column.$id}`, false);
    },
    cancelField(column) {
      this.$refs.form.resetFields();
      this.$set(this.isEdits, `${column.$id}`, false);
    },
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(function(bool, msg) {
          if (bool) {
            resolve(bool);
          } else {
            reject(msg);
          }
        });
      });
    }
  },
  components: {
    FilePreview,
    FilePreviewHistory,
    FromAdaptive: {
      name: "FromAdaptive",
      props: {
        formModel: {},
        column: {}
      },
      computed: {
        inputValue: {
          get() {
            if(this.column.columnData.columnCode === "C_USER_CODE" || this.column.columnData.columnCode === "U_USER_CODE"){
              return this.formModel[this.column.showValKey] || this.formModel[this.column.valKey];
            }
            return this.formModel[this.column.valKey];
          },
          set(value) {
            this.$set(this.formModel, this.column.valKey, value);
          }
        }
      },
      render(h) {
        let config = {
          props: {
            column: this.column,
            value: this.inputValue
          },
          on: {
            input: value => {
              this.inputValue = value;
            },
            change: () => {
              this.column.triggerChange(this.formModel);
            }
          }
        };
        return <pui-input-adaptive {...config} />;
      }
    }
  }
};
</script>
<style lang='scss'>
@import "./formLayout.scss";
</style>
