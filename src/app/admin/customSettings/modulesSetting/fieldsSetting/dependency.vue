<template>
  <div class="pui-dependency">
    <div class="pui-dependency__content" v-loading="loading">
      <aui-form :model="form" :rules="rules" ref="form" label-width="130px" class="form">
        <aui-form-item label="字段名称" prop="columnName">
          <aui-input v-model="form.columnName" placeholder="请输入字段名称"></aui-input>
        </aui-form-item>
        <aui-form-item label="字段编码" prop="columnCode">
          <aui-input v-model="form.columnCode" :disabled="isDisabled" placeholder="请输入字段编码"></aui-input>
        </aui-form-item>
        <aui-form-item label="属性类型" prop="columnType">
          <aui-select v-model="form.columnType" placeholder="请选择" @change="changeColumnType">
            <aui-option v-for="item in columnTypeOpt" :key="item.value" :label="item.label" :value="item.value">
            </aui-option>
          </aui-select>
        </aui-form-item>
        <aui-form-item label="只读范围" prop="readonlyScope">
          <aui-checkbox-group v-model="form.readonlyScope">
            <aui-checkbox label="0">新增页面</aui-checkbox>
            <aui-checkbox label="1">编辑页面</aui-checkbox>
          </aui-checkbox-group>
        </aui-form-item>
        <aui-form-item label="显示值类型" prop="showType">
          <aui-select v-if="form.columnType != 'datetime'" v-model="form.showType" placeholder="请选择">
            <aui-option v-for="item in showTypeOpt" :key="item.value" :label="item.label" :value="item.value">
            </aui-option>
          </aui-select>
          <aui-select v-if="form.columnType == 'datetime'" v-model="form.showType" placeholder="请选择">
            <aui-option label="日期控件" value="6">
            </aui-option>
          </aui-select>
        </aui-form-item>
        <aui-form-item label="依赖表" prop="relyModuleId">
          <aui-select v-model="form.relyModuleId" placeholder="请选择" filterable  @change="changeModule">
            <aui-option v-for="item in relyModuleOpt" :key="item.id" :label="item.moduleName" :value="item.id">
            </aui-option>
          </aui-select>
        </aui-form-item>
        <aui-form-item label="依赖表字段" prop="relyColumnId">
          <aui-select v-model="form.relyColumnId" filterable placeholder="请选择">
            <aui-option v-for="item in relyColumnOpt" :key="item.id" :label="item.columnName" :value="item.id">
            </aui-option>
          </aui-select>
        </aui-form-item>
        <aui-form-item label="字段数据单位" prop="columnUnit">
          <aui-input v-model="form.columnUnit" placeholder="请输入字段数据单位"></aui-input>
        </aui-form-item>
        <aui-form-item label="字段输入提示" prop="fieldIptPrompt">
          <aui-input v-model="form.fieldIptPrompt" placeholder="请输入字段提示"></aui-input>
        </aui-form-item>
        <aui-form-item label="描述" prop="description">
          <aui-input type="textarea" :rows="2" v-model="form.description" placeholder="请输入模块描述"></aui-input>
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
import { modulesInfoService } from "paas-web-utils/services";
import { columnService } from "paas-web-utils/services";

export default {
  name: "Dependency",
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
        columnType:{required: true,message: "请选择属性类型",trigger: "change"},
        showType:{required: true,message: "请选择显示值类型",trigger: "change"},
        relyModuleId:{required: true,message: "请选择依赖表",trigger: "change"},
        relyColumnId:{required: true,message: "请选择依赖表字段",trigger: "change"},
      },

      showTypeOpt: [
        // (1、文本框 2、单选框 3、复选框 4、下拉框 5、多行文本框 6、日期控件 7、数据选择 8、文件上传 9、图片上传 10、富文本 )
        { label: "文本框", value: "1" },
        { label: "单选框", value: "2" },
        { label: "复选框", value: "3" },
        { label: "下拉框", value: "4" }
      ],
      relyModuleOpt: [],
      relyColumnOpt: [],
      //可选 字符串、日期、数字、浮点数字(varchar\datetime\int\decimal)
      columnTypeOpt: [
        { label: "字符串", value: "varchar" },
        { label: "日期", value: "datetime" },
        { label: "数字", value: "int" },
        { label: "浮点数字", value: "decimal" }
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
        isRuleCode: 0,
        relyModuleId: null,
        relyColumnId: null,
        selectViewId: null,
        mobileSelectViewId: null,
        columnUnit: ""
      }
    };
  },
  methods: {
    //监听模块选择
    changeModule() {
      this.getRelyColumnOpt();
      this.form.relyColumnId = null;
    },
    //监听显示值类型选择
    changeColumnType() {
      this.form.showType = null;
    },
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
        isRuleCode: 0,
        relyModuleId: null,
        relyColumnId: null,
        selectViewId: null,
        mobileSelectViewId: null,
        columnUnit: ""
      };
    },
    //获取模块集合
    getRelyModuleOpt() {
      var moduleParams = {
        isRelated: 1,
        moduleIds: [],
        isEqModuleId: true,
        isCustom: 1
      };
      modulesInfoService.findModules(moduleParams).then(res => {
        this.relyModuleOpt = res;
      });
    },
    //根据模块id查询字段集合
    getRelyColumnOpt() {
      let params = {
        moduleId: this.form.relyModuleId
      };
      columnService.findFieldsByModuleId(params).then(res => {
        this.relyColumnOpt = res;
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
        if(data.relyModuleId){
          let promise = undefined;
          let moduleParams = {
            isRelated: 1,
            moduleIds: [],
            isEqModuleId: true,
            isCustom: 1
          };
          promise = Promise.all([
            modulesInfoService.findModules(moduleParams),
            columnService.findFieldsByModuleId({moduleId: data.relyModuleId})
          ])
          promise.then(res=>{
            this.relyModuleOpt = res[0];
            this.relyColumnOpt = res[1];
            this.form.relyModuleId = data.relyModuleId;
            this.form.relyColumnId = data.relyColumnId;
            this.loading = false;
          })
        }else{
          this.form.relyModuleId = data.relyModuleId;
          this.loading = false;
        }
        
        this.form.selectViewId = data.selectViewId;
        this.form.mobileSelectViewId = data.mobileSelectViewId;
        this.form.columnUnit = data.columnUnit;
      })
    }else{
      this.getRelyModuleOpt();
    }
    
  }
};
</script>

<style lang="scss" scoped>
.pui-dependency {
  height: 600px;
  .pui-dependency__content {
    // height: 560px;
    height: 515px;
    overflow-y: scroll;
  }
}
</style>
