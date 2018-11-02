<template>
  <!-- 单条查询 -->
  <div class="condition-item-gather">
    <aui-form-item class="condition-item">
      <aui-select v-model="condition.columnId" placeholder="请选择字段" clearable @change="handleColumnChange">
        <aui-option-group v-for="(group, index) in sourceColumns" :key="index" :label="group.name">
          <aui-option v-for="col in group.list" :key="col.id" :label="col.columnName" :value="col.id"></aui-option>
        </aui-option-group>  
      </aui-select>
    </aui-form-item>
    <aui-form-item class="condition-item">
      <aui-select v-model="condition.filterType" placeholder="请选择条件">
        <aui-option v-for="item in conditionTypeList" :key="item.value" :value="item.value" :label="item.label"></aui-option>
      </aui-select>
    </aui-form-item>
    <aui-form-item class="condition-item">
      <pui-input-adaptive
        class="input-adaptive"
        :column="columnMaps[condition.columnId]" 
        :condition-type="condition.filterType" 
        :batch="true" 
        v-if="columnMaps[condition.columnId]"
        v-model="condition.filterValue">
        </pui-input-adaptive>
      <aui-input v-else v-model="condition.filterValue"></aui-input>
    </aui-form-item>
    <aui-form-item class="condition-btn">
      <aui-button size="medium" icon="aui-icon-delete" style="border: 0" @click="handleDeleteData"></aui-button>
    </aui-form-item>
  </div>
</template>

<script>
  export default {
    name: 'ConditionItem',

    props: {
      // 某一行过滤条件
      condition: {
        type: Object,
        default: () => {
          return {}
        }
      },

      // 可过滤字段集合
      sourceColumns: {
        type: Array,
        default: () => {
          return []
        }
      },
      
      // 字段配置
      columnMaps: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },

    data() {
      return {
        conditionTypeList: [{
          value: 'LIKE',
          label: '包含'
        }, {
          value: 'NOT LIKE',
          label: '不包含'
        }, {
          value: '=',
          label: '等于'
        }, {
          value: '!=',
          label: '不等于'
        }]
      }
    },

    methods: {
      // 删除单条
      handleDeleteData(condition) {
        this.$emit('delete');
      },

      // 切换字段
      handleColumnChange(value) {
        this.$set(this.condition, 'filterValue', '');
      },
    }
  }
</script>

<style lang="scss" scoped>
  .condition-item-gather {
    margin-top: 10px;
  }
  .condition-item {
    display: inline-block;
    width: calc((100% - 60px) / 3);
  }
  .condition-btn {
    display: inline-block;
    width: 40px;
  }
</style>
