<template>
  <div class="pui-normal-input">
    <div class="pui-normal-input__content">
      <aui-form :model="form" :rules="rules" ref="form" label-width="130px" class="form">
        <aui-form-item label="字段名称" prop="columnName">
          <aui-input v-model="form.columnName"  placeholder="请输入字段名称"></aui-input>
        </aui-form-item>
        <aui-form-item label="字段编码" prop="columnCode">
          <aui-input v-model="form.columnCode" :disabled="isDisabled"  placeholder="请输入字段编码"></aui-input>
        </aui-form-item>
        <aui-form-item label="只读范围" prop="readonlyScope">
          <aui-checkbox-group v-model="form.readonlyScope">
            <aui-checkbox label="0">新增页面</aui-checkbox>
            <aui-checkbox label="1">编辑页面</aui-checkbox>
          </aui-checkbox-group>
        </aui-form-item>
        <aui-form-item label="显示值类型" prop="showType">
          <aui-select v-model="form.showType" placeholder="请选择">
            <aui-option v-for="item in showTypeOpt" :key="item.value" :label="item.label" :value="item.value">
            </aui-option>
          </aui-select>
        </aui-form-item>
        <aui-form-item label="约束" prop="colConstraint" class="colConstraint">
          <aui-select v-model="form.colConstraint" multiline placeholder="请选择">
            <aui-option v-for="item in colConstraintOpt" :key="item.id" :label="item.constraintName" :value="item.id">
            </aui-option>
          </aui-select>
          <span class="add-colConstraint" @click="openAddConstrain">+</span>
        </aui-form-item>
        <aui-form-item label="可输入最大长度" prop="maxLen">
          <aui-input-number v-model="form.maxLen" controls-position="right" :min="1" :max="100"></aui-input-number>
        </aui-form-item>
        <aui-form-item label="可输入最小长度" prop="minLen">
          <aui-input-number v-model="form.minLen" controls-position="right" :min="1" :max="99"></aui-input-number>
        </aui-form-item>
        <aui-form-item label="默认存储值" prop="defaultVal">
          <aui-input v-model="form.defaultVal"  placeholder="请输入默认存储值"></aui-input>
        </aui-form-item>
        <aui-form-item label="字段输入提示" prop="fieldIptPrompt">
          <aui-input v-model="form.fieldIptPrompt"  placeholder="请输入字段提示"></aui-input>
        </aui-form-item>
        <aui-form-item label="是否唯一" prop="isUnique">
          <aui-switch v-model="form.isUnique" :active-value="1" :inactive-value="0"></aui-switch>
        </aui-form-item>
        <aui-form-item label="隐藏类型" prop="valHideType">
          <aui-select v-model="form.valHideType" multiline placeholder="请选择">
            <aui-option v-for="item in valHideTypeOpt" :key="item.id" :label="item.label" :value="item.value">
            </aui-option>
          </aui-select>
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
    <constraint :constraintShow="constraintShow" @closeConstrain="closeConstrain" @updateConstrain="updateConstrain"></constraint>
  </div>
</template>

<script>
import Constraint from './constrain'
import { columnService } from "paas-web-utils/services";
export default {
  name: "NormalInput",
  components: { Constraint },
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
      rules: {
        columnName: [
          { required: true, message: "请输入字段名称", trigger: "blur" }
        ],
        columnCode: { required: true, validator: checkColumnCode, trigger: 'blur'},
        showType:{required: true,message: "请选择显示值类型",trigger: "change"},
        //colConstraint:{required: true,message: "请选择约束条件",trigger: "change"},
        maxLen:{required: true,message: "请输入可输入最大长度",trigger: "blur"},
        minLen:{required: true,message: "请输入可输入最小长度",trigger: "blur"},
      },
      showTypeOpt: [
        // (1、文本框 2、单选框 3、复选框 4、下拉框 5、多行文本框 6、日期控件 7、数据选择 8、文件上传 9、图片上传 10、富文本 )
        { label: "文本框", value: "1" },
        { label: "多行文本框", value: "5" }
      ],
      valHideTypeOpt: [
        { value: "NORMAL", label: "不隐藏" },
        { value: "NAME", label: "名称格式" },
        { value: "PHONE", label: "手机格式" },
        { value: "TOTAL", label: "全部隐藏" }
      ],
      form: {
        moduleCode: "",
        columnType: "varchar",
        columnCode: "",
        showColValSet: "1",
        columnName: "",
        moduleId: null,
        maxLen: 100,
        minLen: 1,
        colConstraint: "",
        defaultVal: "",
        displayPosition: "1,2,3,4",
        showType: "",
        showColVal: "",
        fieldIptPrompt: "",
        readonlyScope: [],
        colMark: this.colMark,
        colAttrIsmodify: 1,
        isUnique: 0,
        valHideType: "NORMAL",
        description: "",
        isRuleCode: 0
      },
      constraintShow: false,
      isDisabled: false
    };
  },
  props: {
    colConstraintOpt: {
      type: Array
    },
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
    //打开约束新增编辑框
    openAddConstrain() {
      this.constraintShow = true;
    },
    //触发更新约束数据
    updateConstrain() {
      this.$emit("updateConstrain");
    },
    //关闭对话框
    cancel() {
      this.initForm();
      this.$emit("cancel", this.$refs.form.resetFields());
      this.isDisabled = false;
    },
    closeConstrain() {
      this.constraintShow = false;
    },
    //初始化表单数据
    initForm() {
      this.form = {
        moduleCode: "",
        columnType: "varchar",
        columnCode: "",
        showColValSet: "1",
        columnName: "",
        moduleId: null,
        maxLen: 100,
        minLen: 1,
        colConstraint: "",
        defaultVal: "",
        displayPosition: "1,2,3,4",
        showType: "",
        showColVal: "",
        fieldIptPrompt: "",
        readonlyScope: [],
        colMark: this.colMark,
        colAttrIsmodify: 1,
        isUnique: 0,
        valHideType: "NORMAL",
        description: "",
        isRuleCode: 0
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
          let colConstraint  = parseInt(data.colConstraint);
          columnService.findConstraint({'constraintIdList':[colConstraint]}).then(data=>{
            if(data.length){
              this.form.colConstraint = colConstraint;
            }else{
              this.form.colConstraint = '';
            }
          })
        }else{
          this.form.colConstraint = '';
        }
        this.form.defaultVal = data.defaultVal;
        this.form.displayPosition = data.displayPosition
        this.form.showType = data.showType;
        this.form.showColVal = data.showColVal;
        this.form.fieldIptPrompt = data.fieldIptPrompt;
        if(data.readonlyScope){
          this.form.readonlyScope = data.readonlyScope.split(',');
        }else{
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
.pui-normal-input {
  height: 600px;
  .pui-normal-input__content {
    // height: 560px;
    height: 515px;
    overflow-y: scroll;
  }
}
</style>

