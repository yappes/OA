<template>
  <div>
    <aui-table ref="multipleTable" :data="formModel" :row-key="getRowKeys" :row-style="handleRowStyle" :cell-style="handleCellStyle" max-height="350" tooltip-effect="dark" style="width: 100%">
      <aui-table-column type="index" width="40" fixed="left" align="center"></aui-table-column>
      <aui-table-column 
        v-for="column in columns" 
        :key="column.$id" 
        :label="column.gridLabel" 
        :prop="'' + column.$id"
        show-overflow-tooltip 
        :formatter="(row) => handleFormatter(row, column)" 
        min-width="200" 
        v-if="!column.hidden">
      </aui-table-column>
    </aui-table>
  </div>
</template>

<script>
export default {
  name: "PuiDetailBatchForm",
  props: {
    model: {}
  },
  computed: {
    columns(){
      return this.model.columns;
    },
    formModel() {
      return this.model.formModel;
    },
    batchRows(){
      return this.model.batchRows;
    }
  },
  methods: {
    // 格式化列
    handleFormatter(row, col) {
      let rowIndex = this.formModel.indexOf(row);
      let batchRow = this.batchRows[rowIndex];
      if(batchRow.status === 'is-remove'){
        let value =  row[col.valKey];
        if (col.type && col.type.format) {
          return col.type.format(value);
        }
        if (value === null || value === "null") {
          return undefined;
        }
      }
      return row[col.showValKey] || row[col.valKey];
    },

    // 获取row的key值
    getRowKeys(row) {
      return row.ID;
    },

    handleRowStyle({ rowIndex }) {
      let batchRow = this.batchRows[rowIndex];
      let bgColour = false;
      if(batchRow.status === 'is-remove'){
        bgColour = "#fef0f0";
      } else if(batchRow.status === 'is-create'){
        bgColour = "#f0f9eb";
      }
      return {
        "background-color": bgColour
      };
    },

    handleCellStyle({row, column, rowIndex}){
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
    }

  }
};
</script>
