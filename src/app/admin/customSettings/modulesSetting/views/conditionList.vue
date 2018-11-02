<template>
  <div class="condition-list">
    <div class="btn-top">
      <aui-radio-group v-model="condition.conditionType" size="mini" :disabled="conditionDisable">
        <aui-radio-button label="AND"></aui-radio-button>
        <aui-radio-button label="OR"></aui-radio-button>
      </aui-radio-group>
      <div class="right">
        <aui-button @click="handleInsertData" class="btn" size="mini">添加单条</aui-button>
        <aui-button @click="handleInsertGroup" class="btn" size="mini">添加分组</aui-button>
        <aui-button @click="handleDeleteGroup" v-if="!deleteGroupDisabled" size="mini" type="danger">删除分组</aui-button>
      </div>

      <div class="condition">
        <template v-for="(item, index) in conditionList">
          <!-- 单条查询 -->
          <condition-item 
            :key="index"
            v-if="!item.isGroup"
            :sourceColumns="sourceColumns" 
            :columnMaps="columnMaps"
            :condition="item"
            @delete="() => handleDeleteData(item, index)">
          </condition-item> 

          <!-- 分组查询 -->
          <div :key="index" v-else class="condition-group-gather">
            <condition-list 
              :sourceColumns="sourceColumns" 
              :columnMaps="columnMaps"
              :condition="item"
              :deleteGroupDisabled="false"
              @delete="conditionList.splice(index, 1)">
            </condition-list>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import conditionItem from './conditionItem';

  export default {
    name: 'ConditionList',

    components: {
      conditionItem
    },

    props: {
      // 视图过滤条件
      condition: {
        type: Object,
        default: () => {
          return {
            conditionList: [],
            conditionType: ''
          }
        }
      },

      // 可过滤字段集合
      sourceColumns: {
        type: Array,
        default: () => {
          return []
        }
      },

      // 是否禁用删除分组
      deleteGroupDisabled: {
        type: Boolean,
        default: true
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
        conditionList: [{
          columnId: '',
          filterType: 'LIKE',
          filterValue: '',
          isGroup: false
        }],
      }
    },

    computed: {
      // 是否禁用AND OR
      conditionDisable() { 
        return this.conditionList.length <= 1;
      }
    },

    mounted() {
      this.condition.conditionList && this.$set(this, 'conditionList', this.condition.conditionList);
    },

    methods: {
      // 添加单条
      handleInsertData() {
        let condition = {
          columnId: '',
          filterType: 'LIKE',
          filterValue: '',
          isGroup: false
        }
        this.conditionList.push(condition);
      },

      // 删除单条
      handleDeleteData(condition, index) {
        this.conditionList.splice(index, 1);
      },

      // 添加分组
      handleInsertGroup() {
        let child = {
          conditionType: '',
          conditionList: [{
            columnId: '',
            filterType: 'LIKE',
            filterValue: '',
            isGroup: false
          }],
          isGroup: true
        }
        this.conditionList.push(child);
      },

      // 删除分组
      handleDeleteGroup(condition, index) {
        this.$emit('delete');
      }
    }
  }
</script>

<style lang="scss" scoped>
  .condition-list {
    border: solid 1px #cecaca;
    padding: 10px;
    .btn-top {
      padding-bottom: 5px;
      .right {
        float: right;
        .btn {
          background-color: #26B7AE;
          color: white;
        }
      }
      .delete-btn {
        width: 40px;
        float: right;
        text-align: center;
        cursor: pointer;
        color: #f56c6c;
      }
    }
    .condition-group-gather {
      margin-top: 10px;
    }
  }
</style>
