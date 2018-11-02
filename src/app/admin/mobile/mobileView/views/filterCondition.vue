<template>
  <div class="pui-filter-condition">
    <aui-dialog :close-on-click-modal="false" title="配置过滤条件" width="70%" show-full-icon @hide="handleClose" :visible="isVisible">
      <aui-form :model="reqData" :rules="rules" ref="form" label-width="80px">
        <aui-form-item label="标题" prop="title">
          <aui-input v-model="reqData.title"></aui-input>
        </aui-form-item>

        <aui-form-item label="配置条件">
          <condition-list
            ref="conditionVM" 
            :condition="reqData.content" 
            :sourceColumns="sourceColumns"
            :columnMaps="columnMaps">
          </condition-list>
        </aui-form-item>

        <aui-form-item>
          <aui-button @click="handleSql" class="btn" size="mini">SQL</aui-button>
          <aui-button @click="handleSqlStatement" class="btn" size="mini">SQL statement(?)</aui-button>
        </aui-form-item>

        <aui-form-item>
          <aui-input type="textarea" v-model="reqData.sqlContent" disabled autosize></aui-input>
        </aui-form-item>
      </aui-form>
      <div slot="footer" class="dialog-footer">
        <aui-button @click="handleClose">取消</aui-button>
        <aui-button type="primary" @click="handleSubmit('form')">确定</aui-button>
      </div>
    </aui-dialog>
  </div>
</template>

<script>
  import conditionList from './conditionList';

  export default {
    name: 'PuiFilterCondition',

    components: {
      conditionList
    },

    props: {
      // 视图过滤条件
      viewDataConds: {
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
        rules: {
          title: [
            { required: true, message: "请输入标题", trigger: "blur" },
            { min: 2, message: "至少2个字符", trigger: "blur" }
          ]
        },
        isVisible: true,
        reqData: {
          title: '',
          content: {},
          sqlContent: ''
        },
        sql: '',
        sqlStatement: '',
        filterValueList: [],
        isSubmit: true,
      }
    },

    mounted() {
      this.$set(this.reqData, 'title', this.viewDataConds.title);
      this.$set(this.reqData, 'sqlContent', this.viewDataConds.sqlContent);

      if(this.viewDataConds.content) {
        this.$set(this.reqData, 'content', JSON.parse(this.viewDataConds.content));
      }
    },

    methods: {
      handleSubmit(formName) {
        this.$refs[formName].validate(valid => {
          if(valid) {
            this.handleSql();
            if(this.isSubmit) {
              let conditionData = {
                title: this.reqData.title,
                content: {
                  conditionType: this.$refs.conditionVM.condition.conditionType,
                  conditionList: this.$refs.conditionVM.conditionList,
                },
                sqlContent: this.sql
              }
              conditionData.content = JSON.stringify(conditionData.content);
              this.$emit('submit', conditionData);
            } else {
              this.sql = '';
              return false;
            }
          } else {
            return false;
          }
        });
      },

      handleClose() {
        this.$emit('close');
      },

      // 生成sql
      handleSql() {
        this.sql = '';
        let content = this.handleColumn();
        this.handleRecurseSql(content);
        this.reqData.sqlContent = `"${this.sql}"`;
      },

      // 生成sqlStatement
      handleSqlStatement() {
        this.sqlStatement = '';
        this.filterValueList.splice(0, this.filterValueList.length);
        let content = this.handleColumn();
        this.handleRecurseSqlStatement(content);

        let filterValue = '[ \n ';
        this.filterValueList.forEach((item, index) => {
          filterValue += `  ${item}`;
          if(index < this.filterValueList.length - 1) filterValue += ',';
          filterValue += ' \n ';
        })
        filterValue +=  ']';
        this.reqData.sqlContent = `"${this.sqlStatement}" \n  \n ${filterValue}`;
      },

      // 处理选择的字段数据
      handleColumn() {
        let content = {
          conditionType: this.$refs.conditionVM.condition.conditionType,
          conditionList: this.$refs.conditionVM.conditionList,
        };

        this.sourceColumns.forEach(source => {
          source.list.forEach(sourceCol => {
            this.handleRecurseCol(content, sourceCol);
          })
        })

        return content;
      },

      // 递归字段
      handleRecurseCol(content, sourceCol) {
        content.conditionList.forEach(col => {
          if(!col.isGroup) {
            if(sourceCol.id === col.columnId) {
              console.log('sourceCol.moduleCode', sourceCol.moduleCode)
              this.$set(col, 'phyColumnName', sourceCol.phyColumnName);
              this.$set(col, 'phyModuleName', `${sourceCol.moduleCode}`);
              this.$set(col, 'columnType', `${sourceCol.columnType}`);
            }
          } else {
            this.handleRecurseCol(col, sourceCol);
          }
        })
      },

      // 递归处理sql
      handleRecurseSql(content) {
        let list = content.conditionList;
        for(let i = 0; i < list.length; i++) {
          if(!list[i].isGroup) { 
            if(!list[i].columnId) {
              this.$aui.message.show({
                message: "请选择字段",
                type: "warning"
              });
              this.sql = '';
              this.isSubmit = false;
              break;
            }

            if(list[i].filterValue === null || list[i].filterValue === undefined) {
              this.$aui.message.show({
                message: "条件值不能为空",
                type: "warning"
              });
              this.sql = '';
              this.isSubmit = false;
              break;
            }

            if(i && !content.conditionType) {
              this.$aui.message.show({
                message: "请选择条件关系",
                type: "warning"
              });
              this.sql = '';
              this.isSubmit = false;
              break;
            }

            this.isSubmit = true;
            let val = null;
            if(list[i].columnType !== 'int' || list[i].columnType !== 'datetime' || list[i].columnType !== 'decimal') {
              val = `'${list[i].filterValue}'`;
            }
            this.sql += `${list[i].phyModuleName}.${list[i].phyColumnName} ${list[i].filterType} ${val}`;
          } else {
            if(content.conditionList.length > 1) this.sql += '( ';
            this.handleRecurseSql(list[i]);
            if(content.conditionList.length > 1) this.sql += ' )';
          }

          if(i < content.conditionList.length - 1) {
            this.sql += ` ${content.conditionType} `;
          }
        }
      },

      // 递归处理sqlStatement
      handleRecurseSqlStatement(content) {
        let list = content.conditionList;
        for(let i = 0; i < list.length; i++) {
          if(!list[i].isGroup) { 
            if(!list[i].columnId) {
              this.$aui.message.show({
                message: "请选择字段",
                type: "warning"
              });
              this.sqlStatement = '';
              this.isSubmit = false;
              break;
            }

            if(list[i].filterValue === null || list[i].filterValue === undefined) {
              this.$aui.message.show({
                message: "条件值不能为空",
                type: "warning"
              });
              this.sqlStatement = '';
              this.isSubmit = false;
              break;
            }

            if(i && !content.conditionType) {
              this.$aui.message.show({
                message: "请选择条件关系",
                type: "warning"
              });
              this.sqlStatement = '';
              this.isSubmit = false;
              break;
            }
            
            this.isSubmit = true;
            let val = null;
            if(list[i].columnType !== 'int' || list[i].columnType !== 'datetime' || list[i].columnType !== 'decimal') {
              val = `'${list[i].filterValue}'`;
            }
            this.filterValueList.push(val);

            let valReplace = null;
            if(list[i].filterType === 'LIKE' || list[i].filterType === 'NOT LIKE') {
              valReplace = `(?)`;
            } else {
              valReplace = ' ?';
            }
            this.sqlStatement += `${list[i].phyModuleName}.${list[i].phyColumnName} ${list[i].filterType}${valReplace}`;
          } else {
            if(content.conditionList.length > 1) this.sqlStatement += '( ';
            this.handleRecurseSqlStatement(list[i]);
            if(content.conditionList.length > 1) this.sqlStatement += ' )';
          }

          if(i < content.conditionList.length - 1) {
            this.sqlStatement += ` ${content.conditionType} `;
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
