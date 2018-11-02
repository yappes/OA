<template>
  <div>
    <template v-if="multiple">
      <multiple-tags :value="inputValue" :placeholder="placeholder" :disabled="disabled" :focus-handler="focusHandler" icon-class="aui-icon-search" @close-tag="closeTag"></multiple-tags>
    </template>
    <template v-else>
      <aui-input 
        @focus="focusHandler" 
        ref="inputInstance" 
        :placeholder="placeholder" 
        :value="inputValue" 
        :disabled="disabled" 
        readonly 
        @mouseenter.native='moveIntoInput = true' 
        @mouseleave.native='moveIntoInput = false'>
        <i slot="suffix" v-show='showSearchIcon' class="aui-search__icon aui-icon-search" @click="focusHandler"></i>
        <i slot="suffix" v-show='showCloseIcon' class="aui-close__icon aui-icon-circle-close" @click="cleanData(inputValue = '')"></i>
      </aui-input>
    </template>
    <!-- 点击 数据选择 按钮 显示内容 -->
    <aui-dialog :close-on-click-modal="false" title="选择数据" width="80%" 
      :visible.sync="dialogVisible" class="pui-list-grid__hquery" append-to-body>
      <div class="pui-list-grid__hquery-body">
        <pui-list-grid ref="multipleList" slot="full" 
          :columns="columns" 
          :datasource="datasource" 
          :default-sort="view.sort" 
          height='450px' 
          :multiple="multiple" 
          :rowStyle="rowStyleProxy" 
          @selection-change="handleSelectionChange" 
          @row-click="handleRowClick">
        </pui-list-grid>
      </div>
      <span slot="footer" class="dialog-footer">
        <aui-button :plain="true" @click="dialogVisible = false">取消</aui-button>
        <aui-button type="primary" @click="handleConfirm">确定</aui-button>
      </span>
    </aui-dialog>
  </div>
</template>

<script>
import { ListView } from "paas-web-utils/rules";
import { businessService } from "paas-web-utils/services";
import MultipleTags from "../../multiple-tags/main.vue";
export default {
  name: "PuiDataSelection",
  components: { MultipleTags },
  props: {
    column: Object,
    placeholder: {},
    value: {},
    multiple: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String
    }
  },

  data() {
    let inputDefaultValue = this.multiple ? [] : undefined;
    return {
      currentValue: this.value,
      view: {},
      columns: [],
      datasource: {},
      dialogVisible: false,
      inputValue: inputDefaultValue,
      // multiple: true,
      multipleSelection: [], // 选中行的数据
      moveIntoInput: false
    };
  },

  computed: {
    showSearchIcon() {
      if (this.disabled) {
        return false;
      }
      return !this.showCloseIcon;
    },
    showCloseIcon() {
      if (this.disabled) {
        return false;
      }
      return (
        this.moveIntoInput &&
        this.inputValue !== undefined &&
        this.inputValue !== ""
      );
    }
  },

  watch: {
    dialogVisible(val) {
      if (val) {
        this.initData();
        setTimeout(() => {
          this.$set(this.datasource, "currentPage", 1);
          this.$set(this.datasource, "reload", true);
        });
      }
    },
    value(val) {
      if (val === this.currentValue) return;
      this.currentValue = val;
      this.dataEcho(val);
      this.handleInput();
    },
  },

  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.loading = true;
      this.column.foreignKeyView().then(view => {
        this.$set(this, "datasource", view.datasource);
        this.$set(this, "view", view);
        this.$set(this, "columns", this.view.columns);
        delete this.loading;
        this.dataEcho(this.value);
        if (this.isDialogVisible) {
          this.$aui.loading.hide();
          delete this.isDialogVisible;
          this.dialogVisible = true;
        }
      });
    },
    dataEcho(val) {
      if (this.loading) return;
      if (!val) {
        if (this.multiple) {
          this.inputValue = [];
        } else {
          this.inputValue = undefined;
        }
        return;
      }
      let values = this.strToArray(val);
      let inputValue = [];
      businessService.findAllByViewIdAndRecordIds({
          viewId: this.column.datasource.viewId,
          // viewId: 1090,
          recordIds: values
        }).then(multipleSelection => {
          this.column.dataShowColumn().then(column => {
            multipleSelection.forEach(item => {
              inputValue.push(item[column.showValKey] || item[column.valKey]);
            });
            if (this.multiple) {
              this.inputValue = inputValue;
              this.column.triggerShowValueChanage(this.inputValue.join(","));
            } else {
              this.inputValue = inputValue[0];
              this.column.triggerShowValueChanage(this.inputValue);
            }
          });
        });
    },

    strToArray(str) {
      if (!str || str === null || str === "") return [];
      str = String(str);
      if (str.charAt(0) === ",") {
        str = str.substr(1);
      }
      if (str.charAt(str.length - 1) === ",") {
        str = str.substr(0, str.length - 1);
      }
      return str.split(",");
    },

    closeTag(index) {
      this.inputValue.splice(index, 1);
      let selectedIds = this.strToArray(this.currentValue);
      selectedIds.splice(index, 1);
      if (selectedIds.length > 0) {
        this.currentValue = `,${selectedIds.join(",")},`;
      } else {
        this.currentValue = "";
      }

      this.handleInput();
    },

    focusHandler() {
      if (this.disabled) return;
      if (this.loading) {
        this.isDialogVisible = true;
        this.$aui.loading.show({
          lock: true,
          text: "弹框加载中"
        });
      } else {
        this.dialogVisible = true;
      }
    },

    cleanData(value) {
      if (!Boolean(value)) {
        this.currentValue = null;
        this.multipleSelection = [];
        this.handleInput();
      }
    },

    // row-style 处理方法
    rowStyleProxy(val) {
      this.view.rowStyle(val);
    },

    // 行点击
    handleRowClick(row, toggleRowSelection) {
      // 多选/单选
      if (this.multiple) {
        toggleRowSelection(row);
      } else {
        this.multipleSelection = [row];
        this.handleConfirm();
      }
    },

    // 勾选行
    handleSelectionChange(list) {
      this.multipleSelection = list;
    },

    handleValue(column) {
      let showValues = [];
      let values = [];
      // 多选/单选模式
      if (this.multiple) {
        // 多选反选模式
        this.multipleSelection.forEach(item => {
          showValues.push(item[column.showValKey] || item[column.valKey]);
          values.push(item["ID"]);
        });
        let currentValue = this.strToArray(this.currentValue);
        for (const index in values) {
          let selectedId = values[index];
          if (currentValue.indexOf(String(selectedId)) >= 0) continue;
          this.inputValue.push(showValues[index]);
          currentValue.push(selectedId);
        }
        if (currentValue.length > 0) {
          this.currentValue = `,${currentValue.join(",")},`
        }
        this.column.triggerShowValueChanage(this.inputValue.join(","));
      } else {
        this.inputValue = this.multipleSelection[0][column.showValKey] || this.multipleSelection[0][column.valKey];
        this.currentValue = this.multipleSelection[0]["ID"];
        this.column.triggerShowValueChanage(this.inputValue);
      }
      this.dialogVisible = false;
      this.handleInput();
    },

    // 确定数据选择
    handleConfirm() {
      this.column.dataShowColumn().then(column => {
        this.handleValue(column);
      });
    },
    handleInput() {
      this.$emit("input", this.currentValue);
      if (this.$refs.inputInstance) {
        this.$refs.inputInstance.dispatch("AuiFormItem", "aui.form.blur", [
          this.inputValue
        ]);
      }
    }
  }
};
</script>

<style lang='scss'>
@import "./dataSelection.scss";
.pui-list-grid__hquery-body {
  .aui-input__validateIcon {
    display: none;
  }
}
.aui-button {
  border-radius: 0;
}
</style>
