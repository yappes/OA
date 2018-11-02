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
      <aui-form-item label="数据模块">

      </aui-form-item>
    </pui-col>
    <pui-col>
      <aui-form-item label="数据视图">

      </aui-form-item>
    </pui-col>
    <pui-col>
      <aui-form-item label="数据移动端视图">

      </aui-form-item>
    </pui-col>
    <pui-col>
      <aui-form-item label="数据显示值字段">

      </aui-form-item>
    </pui-col>
    <pui-col>
      <aui-form-item label="可选择多条数据" prop="isMoreData">
        <aui-switch v-model="form.isMoreData"></aui-switch>
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
  import config from "./mixins.js";
  
  export default {
    name: "DataSelect",
    data() {
      return {
        rules: {
          columnName: [{
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
          columnCode: [{
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
          isMoreData: true,
          description: ""
        }
      };
    },
    mixins: [config],
    created: function() {
      this.addBusListener();
    }
  };
</script>

<style lang="scss">
  
</style>
