<template>
  <div class="pui-batch-table">
    <aui-form :model="{formModel}" :show-message="false" ref="form">
      <aui-table ref="multipleTable" :data="formModel" :row-style="handleRowStyle" :cell-style="HandleCellStyle" max-height="350" tooltip-effect="dark" style="width: 100%">
        <aui-table-column type="index" width="40" fixed="left" align="center"></aui-table-column>
        <template v-for="column in columns">
          <aui-table-column :key="column.$id" :prop="column.$id + ''" :render-header="(h)=>handleLable(h, column)" min-width="200">
            <template slot-scope="scope">
              <form-column :batch-rows="batchRows" :row-index="scope.$index" :column-id="column.$id"></form-column>
            </template>
          </aui-table-column>
        </template>
        <aui-table-column width="75" fixed="right" :render-header="renderHeader" align="center" v-if="showBtn">
          <template slot-scope="scope">
            <aui-button type="text" size="medium" icon="pui-icon-shanchu" :disabled="deleteStatus" @click="deleteData(scope)" v-show="batchRows[scope.$index].status !== 'is-remove'"></aui-button>
          </template>
        </aui-table-column>
      </aui-table>
    </aui-form>
  </div>
</template>
<script>
export default {
  name: "PuiBatchTable",
  data: function() {
    return {
      formModel: this.batchView.formModel,
      batchRows: this.batchView.batchRows
      // allChecked: false,
      // heightStr: "30px",
      // paddingStr: "0 20px"
    };
  },
  props: {
    batchView: {
      type: Object
    },
    showBtn: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    columns() {
      return this.batchView.columns.filter(function(column) {
        return !column.hidden;
      });
    },
    insertStatus() {
      if (!this.batchView.maxLen) return false;
      return this.batchRows.length >= this.batchView.maxLen;
    },
    deleteStatus() {
      return this.batchRows.length <= this.batchView.minLen;
    }
  },
  methods: {
    handleLable(h, column) {
      if (column.isRequired) {
        return (
          <span>
            {column.label}
            <font style="color: red;font-weight: 700;">*</font>
          </span>
        );
      }
      return <span>{column.label}</span>;
    },
    handleRowStyle({ row, rowIndex }) {
      let batchRow = this.batchRows[rowIndex];
      let bgColor = false;
      if (batchRow.status === "is-create") {
        bgColor = "#f0f9eb";
      } else if (batchRow.status === "is-remove") {
        bgColor = "#fef0f0";
      }
      return {
        "background-color": bgColor
      };
    },
    HandleCellStyle({ row, column, rowIndex }) {
      let batchRow = this.batchRows[rowIndex];
      let bgColor = false;
      if (column.property) {
        let col = batchRow.columnMap[column.property];
        if (col.isHighlight) {
          bgColor = "#fef0f0";
        }
      }
      return {
        "background-color": bgColor
      };
    },
    handleValueInput(index, valKey, value) {
      let model = this.formModel[index];
      this.$set(model, valKey, value);
      this.formModel.splice(index, 1, model);
    },
    insertData() {
      let error = this.batchView.insertData();
      if (error instanceof Error) {
        this.$aui.message.show.error(error.message);
      }
    },
    deleteData(scope) {
      let error = this.batchView.deleteData([scope.$index]);
      if (error instanceof Error) {
        this.$aui.message.show.error(error.message);
      }
    },
    validate() {
      if (this.batchRows.length < this.batchView.minLen) {
        let error = new Error(
          `子表【${this.batchView.title}】最少提交${
            this.batchView.minLen
          }条记录`
        );
        this.$aui.message.show.error(error.message);
        return Promise.reject(error);
      } else {
        return new Promise((resolve, reject) => {
          this.$refs.form.validate(function(bool, msg) {
            setTimeout(function() {
              if (bool) {
                resolve(bool);
              } else {
                reject(msg);
              }
            });
          });
        });
      }
    },
    renderHeader(h) {
      return (
        <span>
          <aui-button
            size="medium"
            type="text"
            icon="pui-icon-jiahao"
            disabled={this.insertStatus}
            onClick={this.insertData}
            style="padding:0 20px"
          />
        </span>
      );
    }
  },
  components: {
    FormColumn: {
      props: {
        batchRows: {},
        rowIndex: {},
        columnId: {}
      },
      computed: {
        batchRow() {
          return this.batchRows[this.rowIndex];
        },
        formModel() {
          return this.batchRow.formModel;
        },
        column() {
          return this.batchRow.columnMap[this.columnId];
        },
        itemProp() {
          return `formModel.${this.rowIndex}.${this.column.valKey}`;
        },
        hidden() {
          return this.column.hidden;
        },
        inputValue: {
          get() {
            return this.formModel[this.column.valKey];
          },
          set(value) {
            this.$set(this.formModel, this.column.valKey, value);
          }
        }
      },
      methods: {
        handleValueChanage() {
          this.column.triggerChange(this.formModel);
        },
        format(formModel, column) {
          if (column.type.format) {
            return (
              column.type.format(formModel[column.valKey]) ||
              formModel[column.showValKey]
            );
          }
          let showVal = formModel[column.showValKey];
          if (showVal === null || showVal === "null") showVal = undefined;
          let val = formModel[column.valKey];
          if (val === null || val === "null") val = undefined;
          return showVal || val;
        }
      },
      render(h) {
        if (this.batchRow.status === "is-remove") {
          return <span>{this.format(this.formModel, this.column)}</span>;
        }
        let itemConfig = {
          props: {
            prop: this.itemProp,
            rules: this.column.rules
          },
          style: {
            "margin-bottom": "0px",
            display: this.hidden ? "none" : "block"
          }
        };
        let adaptiveConfig = {
          props: {
            value: this.inputValue
          },
          on: {
            input: value => {
              this.inputValue = value;
            },
            change: this.handleValueChanage
          }
        };
        return (
          <aui-form-item {...itemConfig} label-width="0px">
            <pui-input-adaptive
              column={this.column}
              {...adaptiveConfig}
              batch
            />
          </aui-form-item>
        );
      }
    }
  }
};
</script>
<style lang='scss' scoped>
@import "./batchTable.scss";
</style>
