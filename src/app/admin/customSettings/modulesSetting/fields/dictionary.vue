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
      <aui-form-item label="选择字典" prop="dictCode">
        <aui-select filterable v-model="form.dictCode" placeholder="请选择">
          <aui-option v-for="item in dictionaryOpt" :key="item.id" :label="item.dictName" :value="item.dictCode">
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
      <aui-form-item label="默认存储值" prop="defaultVal">
        <aui-input v-model="form.defaultVal"></aui-input>
      </aui-form-item>
    </pui-col>
    <pui-col>
      <aui-form-item label="字段输入提示" prop="fieldIptPrompt">
        <aui-input v-model="form.fieldIptPrompt"></aui-input>
      </aui-form-item>
    </pui-col>
    <pui-col>
      <aui-form-item label="描述" prop="description">
        <aui-input type="textarea" :rows="2" placeholder="请输入模块描述" v-model="form.description"></aui-input>
      </aui-form-item>
    </pui-col>
  </aui-form>
</template>

<script>
import { dictionaryService } from "paas-web-utils/services";
import { Dict } from "paas-web-utils/rules";
import config from "./mixins.js";

export default {
  name: "Dictionary",
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
      dictionaryOpt: [],
      showTypeOpt: [
        // (1、文本框 2、单选框 3、复选框 4、下拉框 5、多行文本框 6、日期控件 7、数据选择 8、文件上传 9、图片上传 10、富文本 )
        {
          label: "下拉框",
          value: "4"
        },
        {
          label: "单选框",
          value: "2"
        },
        {
          label: "复选框",
          value: "3"
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
      form: {
        columnType: "varchar",
        columnCode: "",
        showColValSet: "2",
        columnName: "",
        colConstraint: "",
        defaultVal: "",
        displayPosition: [],
        showType: "4",
        showColVal: "",
        fieldIptPrompt: "",
        readonlyScope: [],
        colMark: "DICTIONARY",
        isUnique: false,
        description: "",
        dictCode:null
      }
    };
  },
  mixins: [config],
  methods: {
    getDictionaries() {
      let params = {
        isFindAll: 1,
        dictType: "",
        ownParentFlag: "0",
        condition:"",
        // dictParentCode: "0"
      };
      dictionaryService.findDictionaries(params).then(res => {
        this.dictionaryOpt = res;
      });
      // Dict.loadAll().then(res=>{
      //   console.info(res);
      // });
    }
  },
  created: function() {
    this.addBusListener();
  }
};
</script>

<style lang="scss">

</style>
