<template>
  <aui-form :model="form" :rules="rules" :ref="formRefName" label-width="130px">
    <pui-col>
      <aui-form-item label="字段名称" prop="columnName">
        <aui-input v-model="form.columnName"></aui-input>
      </aui-form-item>
    </pui-col>
    <pui-col>
      <aui-form-item label="字段编码" prop="columnCode">
        <aui-input v-model="form.columnCode"></aui-input>
      </aui-form-item>
    </pui-col>
    <pui-col>
      <aui-form-item label="数据类型" prop="columnType">
        <aui-select v-model="form.columnType" placeholder="请选择">
          <aui-option v-for="item in columnTypeOpt" :key="item.value" :label="item.label" :value="item.value">
          </aui-option>
        </aui-select>
      </aui-form-item>
    </pui-col>
    <pui-col :minWidth="400">
      <aui-form-item label="显示位置" prop="displayPosition">
        <aui-checkbox-group v-model="form.displayPosition">
          <aui-checkbox label="1">列表</aui-checkbox>
          <aui-checkbox label="2">新增</aui-checkbox>
          <aui-checkbox label="3">修改</aui-checkbox>
          <aui-checkbox label="4">详情</aui-checkbox>
        </aui-checkbox-group>
      </aui-form-item>
    </pui-col>
    <pui-col>
      <aui-form-item label="只读范围" prop="readonlyScope">
        <aui-checkbox-group v-model="form.readonlyScope">
          <aui-checkbox label="0">新增页面</aui-checkbox>
          <aui-checkbox label="1">编辑页面</aui-checkbox>
        </aui-checkbox-group>
      </aui-form-item>
    </pui-col>
    <pui-col>
      <aui-form-item label="约束" prop="colConstraint">
        <aui-select v-model="form.colConstraint" multiline placeholder="请选择">
          <aui-option v-for="item in colConstraintOpt" :key="item.id" :label="item.constraintName" :value="item.id">
          </aui-option>
        </aui-select>
      </aui-form-item>
    </pui-col>
    <pui-col>
      <aui-form-item label="外键" prop="moduleRelated.relModuleId">
        <aui-select v-model="form.moduleRelated.relModuleId" placeholder="请选择">
          <aui-option v-for="item in relModuleOpt" :key="item.id" :label="item.moduleName" :value="item.id">
          </aui-option>
        </aui-select>
      </aui-form-item>
    </pui-col>
    <pui-col>
      <aui-form-item label="显示值" prop="moduleRelated.showColumnId">
        <aui-select v-model="form.moduleRelated.showColumnId" placeholder="请选择">
          <aui-option v-for="item in showColumnOpt" :key="item.id" :label="item.columnName" :value="item.id">
          </aui-option>
        </aui-select>
      </aui-form-item>
    </pui-col>
    <pui-col>
      <aui-form-item label="关联页面" prop="moduleRelated.showViewId">
        <aui-select v-model="form.moduleRelated.showViewId" placeholder="请选择">
          <aui-option v-for="item in relShowViewOpt" :key="item.id" :label="item.viewName" :value="item.id">
          </aui-option>
        </aui-select>
      </aui-form-item>
    </pui-col>
    <pui-col>
      <aui-form-item label="移动端关联页面" prop="moduleRelated.showMobileViewId">
        <aui-select v-model="form.moduleRelated.showMobileViewId" placeholder="请选择">
          <aui-option v-for="item in showMobileViewOpt" :key="item.value" :label="item.viewName" :value="item.id">
          </aui-option>
        </aui-select>
      </aui-form-item>
    </pui-col>
    <pui-col>
      <aui-form-item label="是否唯一" prop="isUnique">
        <aui-switch v-model="form.isUnique"></aui-switch>
      </aui-form-item>
    </pui-col>
    <pui-col>
      <aui-form-item label="字段输入提示" prop="fieldIptPrompt">
        <aui-input v-model="form.fieldIptPrompt"></aui-input>
      </aui-form-item>
    </pui-col>
    <pui-col>
      <aui-form-item label="描述" prop="description">
        <aui-input type="textarea" :rows="2" v-model="form.description"></aui-input>
      </aui-form-item>
    </pui-col>
  </aui-form>
</template>

<script>
import { modulesInfoService } from "paas-web-utils/services";
import { columnService } from "paas-web-utils/services";
import { viewService } from "paas-web-utils/services";
import config from "./mixins.js";

export default {
  name: "ForeignKey",
  data() {
    return {
      colConstraintOpt: [],
      relModuleOpt: [],
      showColumnOpt: [],
      relShowViewOpt: [],
      showMobileViewOpt: [],
      columnTypeOpt: [
        {
          //varchar/datetime/decimal(浮点数字)/int（整数）/text
          label: "字符串",
          value: "varchar"
        },
        {
          label: "浮点数字",
          value: "decimal"
        },
        {
          label: "整数",
          value: "int"
        },
        {
          label: "长文本",
          value: "text"
        },
        {
          label: "日期",
          value: "datetime"
        }
      ],
      valHideTypeOpt: [
        {
          value: "NORMAL",
          label: "不隐藏"
        },
        {
          value: "NAME",
          label: "名称格式"
        },
        {
          value: "PHONE",
          label: "手机格式"
        },
        {
          value: "TOTAL",
          label: "全部隐藏"
        }
      ],
      rules: {
        columnName: [
          {
            required: true,
            message: "请输入字段名称",
            trigger: "blur"
          },
          {
            min: 3,
            max: 5,
            message: "长度在 3 到 5 个字符",
            trigger: "blur"
          }
        ],
        columnCode: [
          {
            required: true,
            message: "请输入字段名称",
            trigger: "blur"
          },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur"
          }
        ]
      },
      form: {
        columnType: "",
        columnCode: "",
        columnName: "",
        colConstraint: "",
        displayPosition: [],
        // showType: "1",
        // showColVal: "",
        fieldIptPrompt: "",
        readonlyScope: [],
        colMark: "NORMAL",
        colAttrIsmodify: "",
        isUnique: false,
        valHideType: "NORMAL",
        description: "",
        moduleRelated: {
          relModuleId: null,
          showColumnId: null,
          showViewId: null,
          showMobileViewId: null
        }
      }
    };
  },
  props: {},
  watch: {
    "form.moduleRelated.relModuleId": function(newId, oldId) {
      this.form.moduleRelated.showColumnId =null;
      this.getShowColumnOpt();
      this.getRelShowViewOpt();
      this.getShowMobileViewOpt();
    }
  },
  methods: {
    getRelModuleOpt() {
      var moduleParams = {
        // moduleIds: [173],
        isRelated: 2,
        isCustom: 1,
        isDelete: 0
      };
      modulesInfoService.findModules(moduleParams).then(res => {
        this.relModuleOpt = res;
      });
    },
    getShowColumnOpt() {
      let params = {
        moduleId: this.form.moduleRelated.relModuleId
      };
      columnService.findFieldsByModuleId(params).then(res => {
        this.showColumnOpt = res;
      });
    },
    getRelShowViewOpt() {
      let params = {
        moduleId: this.form.moduleRelated.relModuleId,
        viewFlag: 0,
        viewTypes: [1]
      };
      viewService.findViews(params).then(res => {
        this.relShowViewOpt = res;
      });
    },
    getShowMobileViewOpt() {
      let params = {
        moduleId: this.form.moduleRelated.relModuleId,
        viewFlag: 1,
        viewTypes: [1]
      };
      viewService.findViews(params).then(res => {
        this.showMobileViewOpt = res;
      });
    }
  },
  mixins: [config],
  created: function() {
    this.getConstraints();
    this.getRelModuleOpt();
    this.addBusListener();
  }
};
</script>

<style lang="scss">

</style>
