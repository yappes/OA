<template>
  <div class="pui-dictionary">
    <div class="pui-dictionary__content" v-loading="loading">
      <aui-form :model="form" :rules="rules" ref="form" label-width="130px" class="form">
        <aui-form-item label="字段名称" prop="columnName">
          <aui-input v-model="form.columnName" placeholder="请输入字段名称"></aui-input>
        </aui-form-item>
        <aui-form-item label="字段编码" prop="columnCode">
          <aui-input v-model="form.columnCode" :disabled="isDisabled" placeholder="请输入字段编码"></aui-input>
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
        <aui-form-item label="选择字典" prop="showColVal">
          <aui-select filterable v-model="form.showColVal" placeholder="请选择">
            <aui-option v-for="item in dictionaryOpt" :key="item.id" :label="item.dictName" :value="item.dictCode">
            </aui-option>
          </aui-select>
        </aui-form-item>
        <aui-form-item label="是否唯一" prop="isUnique">
          <aui-switch v-model="form.isUnique" :active-value="1" :inactive-value="0"></aui-switch>
        </aui-form-item>
        <aui-form-item label="默认存储值" prop="defaultVal">
          <aui-input v-model="form.defaultVal" placeholder="请输入默认存储值"></aui-input>
        </aui-form-item>
        <aui-form-item label="字段输入提示" prop="fieldIptPrompt">
          <aui-input v-model="form.fieldIptPrompt" placeholder="请输入字段提示"></aui-input>
        </aui-form-item>
        <aui-form-item label="描述" prop="description">
          <aui-input type="textarea" :rows="2" placeholder="请输入模块描述" v-model="form.description"></aui-input>
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
import { dictionaryService } from "paas-web-utils/services";
import { columnService } from "paas-web-utils/services";
export default {
  name: "Dictionary",
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
      loading:false,
      isDisabled: false,
      rules: {
        columnName: [
          { required: true, message: "请输入字段名称", trigger: "blur" }
        ],
        columnCode: { required: true, validator: checkColumnCode, trigger: 'blur'},
        showType:{required: true,message: "请选择显示值类型",trigger: "change"},
        showColVal:{required: true,message: "请选择字典",trigger: "change"},
      },
      showTypeOpt: [
        // (1、文本框 2、单选框 3、复选框 4、下拉框 5、多行文本框 6、日期控件 7、数据选择 8、文件上传 9、图片上传 10、富文本 )
        { label: "下拉框", value: "4" },
        { label: "单选框", value: "2" },
        { label: "复选框", value: "3" }
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
        showColValSet: "2",
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
      dictionaryOpt: []
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
      console.log("初始化表单数据");
      this.form = {
        moduleCode: "",
        columnType: "varchar",
        columnCode: "",
        showColValSet: "2",
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
    },
    getDictionaries() {
      let params = {
        isFindAll: 0,
        dictName: "",
        dictType: "",
        dictIdList: "",
        ownParentFlag: "",
        condition: ""
      };
      dictionaryService.findDictionaries(params).then(data => {
        data.forEach(v => {
          if (v.dictParentCode == "0") {
            this.dictionaryOpt.push(v);
          }
        });
      });
    }
  },
  created: function() {
    
    if (this.editRow) {
      this.loading = true;
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
        if(data.showColVal){
          let params = {
            isFindAll: 1,
            dictName: "",
            dictType: "",
            dictIdList: "",
            ownParentFlag: "",
            condition: ""
          };
          dictionaryService.findDictionaries(params).then(res => {
            res.forEach(v => {
              if (v.dictParentCode == "0") {
                this.dictionaryOpt.push(v);
              }
            });
            this.form.showColVal = data.showColVal;
            this.loading = false;
          });
        }else{
          this.form.showColVal = data.showColVal;
          this.loading = false;
        }
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
    }else{
      this.getDictionaries();
    }
  }
};
</script>

<style lang="scss" scoped>
.pui-dictionary {
  height: 600px;
  .pui-dictionary__content {
    // height: 560px;
    height: 515px;
    overflow-y: scroll;
  }
}
</style>
