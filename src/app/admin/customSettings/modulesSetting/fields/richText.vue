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
      <aui-form-item label="描述" prop="description">
        <aui-input type="textarea" :rows="2" placeholder="请输入模块描述" v-model="form.description"></aui-input>
      </aui-form-item>
    </pui-col>
  </aui-form>
</template>

<script>
import config from './mixins.js'
export default {
  name: "RichText",
  data() {
    return {
      rules: {
        columnName: [
          {
            required: true,
            message: "请输入模块名称",
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
            message: "请输入模块名称",
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
        columnName: "",
        columnCode: "",
        displayPosition: [],
        colMark: "NORMAL",
        description: ""
      }
    };
  },
  mixins:[config],
  created: function() {
    this.addBusListener();
  }
};
</script>
