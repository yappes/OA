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
      <aui-form-item label="约束" prop="colConstraint">
        <aui-select v-model="form.colConstraint" multiline placeholder="请选择">
          <aui-option v-for="item in colConstraintOpt" :key="item.id" :label="item.constraintName" :value="item.id">
          </aui-option>
        </aui-select>
      </aui-form-item>
    </pui-col>
    <pui-col>
      <aui-form-item label="可输入最大长度" prop="maxLen">
        <aui-input-number v-model="form.maxLen" controls-position="right" :min="1" :max="60"></aui-input-number>
      </aui-form-item>
    </pui-col>
    <pui-col>
      <aui-form-item label="可输入最小长度" prop="minLen">
        <aui-input-number v-model="form.minLen" controls-position="right" :min="0" :max="59"></aui-input-number>
      </aui-form-item>
    </pui-col>
    <pui-col>
      <aui-form-item label="默认存储值" prop="defaultVal">
        <aui-input v-model="form.defaultVal"></aui-input>
      </aui-form-item>
    </pui-col>
    <pui-col>
      <aui-form-item label="是否唯一" prop="isUnique">
        <aui-switch v-model="form.isUnique"></aui-switch>
      </aui-form-item>
    </pui-col>
    <pui-col>
      <aui-form-item label="隐藏类型" prop="valHideType">
        <aui-select v-model="form.valHideType" multiline placeholder="请选择">
          <aui-option v-for="item in valHideTypeOpt" :key="item.id" :label="item.label" :value="item.value">
          </aui-option>
        </aui-select>
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
import config from "./mixins.js";

export default {
  name: "NormalInput",
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
      colConstraintOpt: [],
      showTypeOpt: [
        // (1、文本框 2、单选框 3、复选框 4、下拉框 5、多行文本框 6、日期控件 7、数据选择 8、文件上传 9、图片上传 10、富文本 )
        {
          label: "文本框",
          value: "1"
        },
        {
          label: "多行文本框",
          value: "5"
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
        columnType: "text",
        columnCode: "",
        showColValSet: "1",
        columnName: "",
        maxLen: 60,
        minLen: 1,
        colConstraint: "",
        defaultVal: "",
        displayPosition: [],
        showType: "1",
        showColVal: "",
        fieldIptPrompt: "",
        readonlyScope: [],
        colMark: "NORMAL",
        colAttrIsmodify: "",
        isUnique: false,
        valHideType: "NORMAL",
        description: ""
      }
    };
  },
  mixins: [config],
  methods:{
  },
  created: function() {
    this.addBusListener();
  }
};
</script>

<style lang="scss">

</style>
