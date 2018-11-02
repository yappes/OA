<template>
  <div class="pui-query-condition">
    <div class="pui-query-condition__up">
    </div>
  <aui-tabs v-model="activeName" class='tab'>
    <aui-tab-pane label="新增标签" name="add"></aui-tab-pane>
    <aui-tab-pane label="编辑标签" name="edit"></aui-tab-pane>
    <!-- <aui-tab-pane label="复制标签" name="copy"></aui-tab-pane> -->
  </aui-tabs>
    <div class="pui-query-condition__group">
      <aui-row class='pui-query-condition__group__item'>
        <aui-col :span="4" class='tag-name-col'>标签名称：</aui-col>
        <aui-col :span="5" style='width:18%'>
          <aui-input type="text" v-model="formModel.tagName" placeholder="请输入标签名称" class="pui-query-condition__input"></aui-input>
        </aui-col>
        <aui-col :span="4" class='tag-name-col' v-if='activeName==="add"'>复制标签：</aui-col>
        <aui-col :span="4" class='tag-name-col' v-if='activeName==="edit"'>选择标签：</aui-col>
        <aui-col :span="5" style='width:18%'>
          <aui-select v-model="conditionsId" placeholder="请选择" @change="copyConditions(conditionsId)" clearable>
            <!-- 数据库原本数据 -->
            <aui-option v-for="item in allSearchLabels.searchLabelsReadonly" :key="item.id" :label="item.tagName" :value="item.id" :style="{color: (item.id === selectTagId ? '#26B7AE' : '#606266')}">
            </aui-option>
            <!-- 自定义数据 -->
            <aui-option class="searchLabelsCtrl-select-option" v-for="item in allSearchLabels.searchLabelsCtrl" :key="item.id" :label="item.tagName" :value="item.id" :style="{color: (item.id ===  selectTagId ? '#26B7AE' : '#606266')}">
              {{item.tagName}}
            </aui-option>
          </aui-select>
        </aui-col>
      </aui-row>
      <aui-row v-for="(item, $index) in formModel.searchs" :key="'row-' + $index" class='pui-query-condition__group__item' v-loading="loadingStatus[$index]">
        <aui-col :span="3" class='tag-name-col'>字段：</aui-col>
        <aui-col :span="5" style='width:18.5%'>
          <aui-select v-model="item.columnId" filterable clearable @change="(value) => handlerColumnChange(item, value, $index)" placeholder="请选择字段">
            <template v-for="(group, index) in options">
              <aui-option-group :key="'group-' + index" :label="group.label">
                <aui-option v-for="item in group.list" :key="item.id" :value="item.value" :label="item.label">
                </aui-option>
              </aui-option-group>
            </template>
          </aui-select>
        </aui-col>
        <aui-col :span="3" class='tag-name-col margin-left'>条件：</aui-col>
        <aui-col :span="5" style='width:18.5%'>
          <aui-select v-if="columnMaps[item.columnId]" v-model="item.searchType" @change="() => handlerSearchTypeChange(item, $index)" placeholder="请选择条件">
            <aui-option v-for="conditionType in (columnMaps[item.columnId].conditionTypes || [])" :key="conditionType.value" :value="conditionType.value" :label="conditionType.label">
            </aui-option>
          </aui-select>
          <aui-select v-else value="" placeholder="请选择条件"></aui-select>
        </aui-col>
        <aui-col :span="3" class='tag-name-col value-margin-left'>值：</aui-col>
        <aui-col :span="9" style='width:22%'>
          <pui-input-adaptive style="width:93%" class="input-adaptive" v-if="columnMaps[item.columnId] && !loadingStatus[$index]" :column="columnMaps[item.columnId]" :condition-type="item.searchType" :style="{marginTop: (item.searchType=== 'date'? '3px': '0')}" :batch="true" v-model="item.screenVal" />
          <aui-input v-else placeholder="请输入条件值" style='width: 93%'></aui-input>
        </aui-col>
        <aui-col :span="1" class='item-icons'>
          <i class="aui-icon-plus item-icon" @click="addItem()"></i>
          <i class="aui-icon-minus item-icon" @click="deleteItem($index)" v-show="formModel.searchs.length > 1"></i>
        </aui-col>
      </aui-row>
    </div>
    <span class="pui-query-condition__footer">
      <aui-button  :plain="true" @click="cancel()">取消</aui-button>
      <aui-button  :disabled='btnYesDisabled' type="primary" @click="keep()">保存</aui-button>
    </span>
  </div>
</template>

<script>
import { columnService, queryService, moduleService } from "paas-web-utils/services";
import { Column } from "paas-web-utils/rules";
export default {
  name: "PuiQueryCondition",
  props: {
    datasource: {},
    viewId: {},
    moduleId: {},
    visible: Boolean,
    allSearchLabels: {},
    selectTagId: {},
  },
  data() {
    return {
      widthStr: "70px",
      heightStr: "40px",
      options: [],
      columnMaps: {},
      loadingStatus: {},
      formModel: {
        moduleId: this.moduleId,
        tagName: "",
        viewId: this.viewId,
        searchs: []
      },
      btnYesDisabled: false,
      conditionsId: "",
      activeName: 'add',
    };
  },
  watch: {
    visible(visible) {
      if (visible) {
        this.formModel = {
          moduleId: this.moduleId,
          tagName: "",
          viewId: this.viewId,
          searchs: []
        };
        this.btnYesDisabled = false;
        this.loadingColumn();
        this.addItem();
      }
    },
    viewId(viewId) {
      if (viewId) {
        this.formModel.viewId = this.viewId;
        this.loadingColumn(true);
      }
    }
  },
  mounted() {
    this.formModel = {
      moduleId: this.moduleId,
      tagName: "",
      viewId: this.viewId,
      searchs: []
    };
    this.loadingColumn();
    this.addItem();
  },
  methods: {
    loadingColumn(isClear = false) {
      if (isClear || !this.loadColumn) {
        //获取字段查询数据
        this.loadColumn = columnService
          .findByViewId({ viewId: this.viewId })
          .then(data => {
            this.options = [];
            for (const option of data) {
              let group = {
                label: option.name,
                list: []
              };
              this.$set(this.options, this.options.length, group);
              for (const col of option.list) {
                let column = new Column();
                column.render(col);
                this.$set(group.list, group.list.length, {
                  value: `${col.moduleCode}.${col.phyColumnName}`,
                  label: column.label
                });
                this.$set(
                  this.columnMaps,
                  `${col.moduleCode}.${col.phyColumnName}`,
                  column
                );
              }
            }
          });
      }
    },
    handlerColumnChange(item, value, $index) {
      if (value && value !== null && value !== "") {
        let column = this.columnMaps[value];
        this.$set(this.loadingStatus, $index, true);
        if (column.isForeignKey && !column[Column.relatedDataKey]) {
          // 获取字段外键数据
          moduleService
            .findModuleRelated({ columnId: column.$id })
            .then(relatedData => {
              column.render(column.columnData);
              column[Column.relatedDataKey] = relatedData;
              setTimeout(() => {
                this.$set(this.loadingStatus, $index, false);
              });
            });
        } else {
          setTimeout(() => {
            this.$set(this.loadingStatus, $index, false);
          }, 500);
        }
        this.$set(item, "moduleId", column.moduleId);
        this.$set(item, "searchType", undefined);
        this.$set(item, "screenVal", undefined);
      } else {
        this.$set(item, "moduleId", undefined);
      }
    },
    handlerSearchTypeChange(item, $index) {
      item.screenVal = undefined;
      this.$set(this.loadingStatus, $index, true);
      setTimeout(() => {
        this.$set(this.loadingStatus, $index, false);
      }, 500);
    },
    keep() {
      //disable按钮，防止多次点击触发
      this.btnYesDisabled = true;
      // 点击保存
      if(this.activeName === 'add') {
        console.log(this.activeName)
        queryService.save(this.formModel).then(() => {
          this.btnYesDisabled = false;
          this.$emit("update:visible", false);
          this.$emit("submit-success");
          this.conditionsId="";
        });
      }else if(this.activeName === 'edit') {
        console.log(this.activeName,this.formModel)
        queryService.update({
          tagId: this.conditionsId,
          tagName: this.formModel.tagName,
          viewId: this.formModel.viewId,
          moduleId: this.formModel.moduleId,
          searchs: this.formModel.searchs
        }).then(data => {
          this.btnYesDisabled = false;
          this.$emit("update:visible", false);
          this.$emit("submit-success");
          this.conditionsId="";
        })
      }
    },
    cancel() {
      this.$emit("update:visible", false);
      this.conditionsId="";
    },
    //增加一行筛选条件
    addItem() {
      this.formModel.searchs.push({
        columnId: undefined,
        moduleId: undefined,
        searchType: undefined,
        screenVal: undefined
      });
    },
    //删除一行筛选条件
    deleteItem(index) {
      this.formModel.searchs.splice(index, 1);
    },
    //获得外键数据显示值
    columnShowVal(item, value, $index) {
      if (value && value !== null && value !== "") {
        let column = this.columnMaps[value];
        if(!column) {
          console.log('选择字段不存在')
          return
        }
        this.$set(this.loadingStatus, $index, true);
        if (column.isForeignKey && !column[Column.relatedDataKey]) {
          // 获取字段外键数据
          moduleService
            .findModuleRelated({ columnId: column.$id })
            .then(relatedData => {
              column.render(column.columnData);
              column[Column.relatedDataKey] = relatedData;
              setTimeout(() => {
                this.$set(this.loadingStatus, $index, false);
              });
            });
        } else {
          setTimeout(() => {
            this.$set(this.loadingStatus, $index, false);
          }, 500);
        }
      } else {
        this.$set(item, "moduleId", undefined);
      }
    },
    copyConditions(value){
      if(!value) {
        this.formModel.searchs = [{
          columnId: undefined,
          searchType: undefined,
          screenVal: undefined,
        }]
        return 
      }
      queryService.findInfByTagId({tagId:this.conditionsId}).then(data=>{
        this.formModel.searchs=[];
        for(let i=0;i<data.length;i++){
          this.formModel.searchs.push({
            columnId:data[i].columnId,
            searchType:Number(data[i].searchType),
            screenVal:data[i].screenVal
          })
        }
        this.formModel.searchs.forEach((item, index) => {
          let value = item.columnId
          this.columnShowVal(item, value, index)
        })  
      });
    }
  }
};
</script>

<style lang="scss">
@import "./queryCondition.scss";
.aui-button {
  border-radius: 0;
}
.tab {
  padding-left: 20px;
}
</style>


