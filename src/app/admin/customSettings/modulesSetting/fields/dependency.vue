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
      <aui-form-item label="属性类型" prop="columnType">
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
      <aui-form-item label="显示值类型" prop="showType">
        <aui-select v-model="form.showType" placeholder="请选择">
          <aui-option v-for="item in showTypeOpt" :key="item.value" :label="item.label" :value="item.value">
          </aui-option>
        </aui-select>
      </aui-form-item>
    </pui-col>
    <pui-col>
      <aui-form-item label="依赖表" prop="relyModuleId">
        <aui-select v-model="form.relyModuleId" placeholder="请选择">
          <aui-option v-for="item in relyModuleOpt" :key="item.id" :label="item.moduleName" :value="item.id">
          </aui-option>
        </aui-select>
      </aui-form-item>
    </pui-col>
    <pui-col>
      <aui-form-item label="依赖表字段" prop="relyColumnId">
        <aui-select v-model="form.relyColumnId" placeholder="请选择">
          <aui-option v-for="item in relyColumnOpt" :key="item.id" :label="item.columnName" :value="item.id">
          </aui-option>
        </aui-select>
      </aui-form-item>
    </pui-col>
    <pui-col>
      <aui-form-item label="字段数据单位" prop="columnUnit">
        <aui-input v-model="form.columnUnit"></aui-input>
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
import config from "./mixins.js";

export default {
  name: "Dependency",
  data() {
    return {
      rules: {
        columnName: [
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

      showTypeOpt: [
        // (1、文本框 2、单选框 3、复选框 4、下拉框 5、多行文本框 6、日期控件 7、数据选择 8、文件上传 9、图片上传 10、富文本 )
        {
          label: "文本框",
          value: "1"
        },
        {
          label: "单选框",
          value: "2"
        },
        {
          label: "复选框",
          value: "3"
        },
        {
          label: "下拉框",
          value: "4"
        }
      ],
      relyModuleOpt: [],
      relyColumnOpt: [],
      //可选 字符串、日期、数字、浮点数字(varchar\datetime\int\decimal)
      columnTypeOpt:[{
        label:"字符串",
        value:"varchar"
      },{
        label:"日期",
        value:"datetime"
      },{
        label:"数字",
        value:"int"
      },{
        label:"浮点数字",
        value:"decimal"
      }],
      form: {
        columnType: "varchar",      
        relyModuleOpt: [],
        relyColumnOpt: [],
        columnCode: "",
        columnName: "",
        displayPosition: [],
        showType: "1",
        fieldIptPrompt: "",
        readonlyScope: [],
        colMark: "RELATED",
        columnUnit:"",
        description: "",
        relyModuleId:null,
        relyColumnId:null
      }
    };
  },
  watch:{
    'form.relyModuleId':function(){
      this.form.relyColumnId = null;
      this.getRelyColumnOpt();
    }
  },
  methods:{
    getRelyModuleOpt() {
      var moduleParams = {
        isRelated : 1,
        moduleIds:[],
        isEqModuleId:true,
        isCustom:1
      };
      modulesInfoService.findModules(moduleParams).then(res => {
        this.relyModuleOpt = res;
      });
    },
    getRelyColumnOpt() {
      let params = {
        moduleId: this.form.relyModuleId
      };
      columnService.findFieldsByModuleId(params).then(res => {
        this.relyColumnOpt = res;
      });
    },
  },
  mixins: [config],
  created: function() {
    this.addBusListener();
    this.getRelyModuleOpt();
  }
};
</script>

<style lang="scss">

</style>
