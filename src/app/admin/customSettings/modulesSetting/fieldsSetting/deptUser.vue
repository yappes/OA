<template>
  <div class="pui-deptUser">
    <div class="pui-deptUser__content">
      <aui-form :model="form" :rules="rules" ref="form" label-width="130px" class="form">
        <aui-form-item label="字段名称" prop="columnName">
          <aui-input v-model="form.columnName"  placeholder="请输入字段名称"></aui-input>
        </aui-form-item>
        <aui-form-item label="字段编码" prop="columnCode">
          <aui-input v-model="form.columnCode" :disabled="isDisabled"  placeholder="请输入字段编码"></aui-input>
        </aui-form-item>
        <aui-form-item label="显示值来源" prop="showColValSet">
          <aui-select v-model="form.showColValSet" placeholder="请选择">
            <aui-option v-for="item in showColValSetOpt" :key="item.value" :label="item.label" :value="item.value">
            </aui-option>
          </aui-select>
        </aui-form-item>
        <aui-form-item v-if='form.showColValSet==="4"' label="支持多选" prop="isMoreData">
          <aui-switch v-model="form.isMoreData" :active-value="1" :inactive-value="0"></aui-switch>
        </aui-form-item>
        <aui-form-item label="字段输入提示" prop="fieldIptPrompt">
          <aui-input v-model="form.fieldIptPrompt" placeholder="请输入字段提示"></aui-input>
        </aui-form-item>
        <aui-form-item label="描述" prop="description">
          <aui-input type="textarea" :rows="2" v-model="form.description"  placeholder="请输入模块描述"></aui-input>
        </aui-form-item>
      </aui-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <aui-button :plain="true" @click="cancel">取 消</aui-button>
      <aui-button type="primary" @click="submitForm('form')">确定</aui-button>
    </div>
  </div>
</template>

<script>
import { columnService } from "paas-web-utils/services";
export default {
  name: "DeptOrPerson",
  props: {
    colMark: {
      type: String
    },
    module:{
      type: [Number, Object],
      default: null
    },
    editRow: {
      type: Object,
      default: {}
    }
  },
  data() {
    //字段编码正则验证
    var checkColumnCode = (rule, value, callback) => {
      if(!this.editRow){
        if(!value){
          callback(new Error('请输入字段编码'));
        }else{
          var myreg=/^[a-zA-Z][a-zA-Z0-9_]*$/;  
          if (!myreg.test(value)) {  
            callback(new Error('字段编码必须以字母开头')); 
          } else {  
            let parame = {
              "moduleId":this.module,
              "columnCode":value
            }
            columnService.checkColumnCode(parame).then(data=>{
              if(data == 'NOTEXIST'){  
                callback();  
              }  else{
                callback(new Error('字典编码已存在')); 
              }
            })   
          }  
        }
      }else{
        callback()
      }
    };
    return {
      isDisabled: false,
      rules: {
        columnName: [
          { required: true, message: "请输入字段名称", trigger: "blur" }
        ],
        columnCode: { required: true, validator: checkColumnCode, trigger: 'blur'},
        showColValSet:{required: true,message: "请选择显示值来源",trigger: "change"},
      },
      showColValSetOpt: [
        { label: "部门选择", value: "3" },
        { label: "人员选择", value: "4" }
      ],
      form: {
        moduleCode: "",
        columnType: "varchar",
        columnCode: "",
        showColValSet: "",
        columnName: "",
        moduleId: null,
        maxLen: 60,
        minLen: 1,
        colConstraint: "",
        defaultVal: "",
        displayPosition: "1,2,3,4",
        showType: "7",
        showColVal: "",
        fieldIptPrompt: "",
        readonlyScope: [],
        colMark: this.colMark,
        colAttrIsmodify: 1,
        isUnique: 0,
        valHideType: "NORMAL",
        description: "",
        isRuleCode: 0,
        isMoreData:0,
      }
    };
  },
  methods: {
    //提交表单数据
    submitForm(formName) {
      let form = this.$refs[formName];
      form.validate(valid => {
        if (valid) {
          let params = this.form;
          params.readonlyScope = params.readonlyScope.toString();
          this.$emit("submitFormData", params);
          this.initForm();
        } else {
          return false;
        }
      });
    },
    //关闭对话框
    cancel() {
      this.initForm();
      this.$emit("cancel", this.$refs.form.resetFields());
      this.isDisabled = false;
    },
    //初始化表单数据
    initForm() {
      this.form = {
        moduleCode: "",
        columnType: "varchar",
        columnCode: "",
        showColValSet: "",
        columnName: "",
        moduleId: null,
        maxLen: 60,
        minLen: 1,
        colConstraint: "",
        defaultVal: "",
        displayPosition: "1,2,3,4",
        showType: "7",
        showColVal: "",
        fieldIptPrompt: "",
        readonlyScope: [],
        colMark: this.colMark,
        colAttrIsmodify: 1,
        isUnique: 0,
        valHideType: "NORMAL",
        description: "",
        isRuleCode: 0,
        isMoreData:0
      };
    }
  },
  created() {
    if (this.editRow) {
      this.isDisabled = true;
      let params = {
        "columnId":this.editRow.id,
        "columnCode":"",
        "moduleCode":"",
        "phyColumnCode":"",
        "moduleId":null
      }
      columnService.findFieldById(params).then(data=>{
        this.form.moduleCode = data.moduleCode;
        this.form.columnType = data.columnType;
        this.form.columnCode = data.columnCode;
        this.form.showColValSet = data.showColValSet;
        this.form.columnName = data.columnName;
        this.form.moduleId = data.moduleId;
        this.form.maxLen = data.maxLen;
        this.form.minLen = data.minLen;
        if(data.colConstraint){
          this.form.colConstraint = parseInt(data.colConstraint);
        }else{
          this.form.colConstraint = '';
        }
        this.form.defaultVal = data.defaultVal;
        this.form.displayPosition = data.displayPosition
        this.form.showType = data.showType;
        this.form.showColVal = data.showColVal;
        this.form.fieldIptPrompt = data.fieldIptPrompt;
        if (data.readonlyScope) {
          this.form.readonlyScope = data.readonlyScope.split(",");
        } else {
          this.form.readonlyScope = [];
        }
        this.form.colMark = data.colMark;
        this.form.colAttrIsmodify = data.colAttrIsmodify;
        this.form.isUnique = data.isUnique;
        this.form.valHideType = data.valHideType;
        this.form.description = data.description;
        this.form.isRuleCode = data.isRuleCode;
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.pui-deptUser {
  height: 600px;
  .pui-deptUser__content {
    // height: 560px;
    height: 515px;
    overflow-y: scroll;
  }
}
</style>
