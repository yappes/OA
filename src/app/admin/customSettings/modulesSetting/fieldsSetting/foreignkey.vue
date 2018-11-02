<template>
  <div class="pui-foreign-key">
    <div class="pui-foreign-key__content" v-loading="loading">
      <aui-form :model="form" :rules="rules" ref="form" label-width="130px" class="form">
        <aui-form-item label="字段名称" prop="columnName">
          <aui-input v-model="form.columnName" placeholder="请输入字段名称"></aui-input>
        </aui-form-item>
        <aui-form-item label="字段编码" prop="columnCode">
          <aui-input v-model="form.columnCode" :disabled="isDisabled" placeholder="请输入字段编码"></aui-input>
        </aui-form-item>
        <aui-form-item label="属性类型" prop="columnType">
          <aui-select v-model="form.columnType" placeholder="请选择">
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
        <aui-form-item label="约束" prop="colConstraint" class="colConstraint">
          <aui-select v-model="form.colConstraint" multiline placeholder="请选择">
            <aui-option v-for="item in colConstraintOpt" :key="item.id" :label="item.constraintName" :value="item.id">
            </aui-option>
          </aui-select>
          <span class="add-colConstraint" @click="openAddConstrain">+</span>
        </aui-form-item>
        <aui-form-item label="外键" prop="relyModuleId">
          <aui-select v-model="form.relyModuleId" placeholder="请选择" filterable  @change="changeModule">
            <aui-option v-for="item in relModuleOpt" :key="item.id" :label="item.moduleName" :value="item.id">
            </aui-option>
          </aui-select>
        </aui-form-item>
        <aui-form-item label="显示值" prop="relyColumnId">
          <aui-select v-model="form.relyColumnId" filterable placeholder="请选择">
            <aui-option v-for="item in showColumnOpt" :key="item.id" :label="item.columnName" :value="item.id">
            </aui-option>
          </aui-select>
        </aui-form-item>
        <aui-form-item label="关联页面" prop="selectViewId">
          <aui-select v-model="form.selectViewId" filterable placeholder="请选择">
            <aui-option v-for="item in relShowViewOpt" :key="item.id" :label="item.viewName" :value="item.id">
            </aui-option>
          </aui-select>
        </aui-form-item>
        <aui-form-item label="移动端关联页面" prop="mobileSelectViewId">
          <aui-select v-model="form.mobileSelectViewId" filterable placeholder="请选择">
            <aui-option v-for="item in showMobileViewOpt" :key="item.value" :label="item.viewName" :value="item.id">
            </aui-option>
          </aui-select>
        </aui-form-item>
        <aui-form-item label="是否唯一" prop="isUnique">
          <aui-switch v-model="form.isUnique" :active-value="1" :inactive-value="0"></aui-switch>
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
    <constraint :constraintShow="constraintShow" @closeConstrain="closeConstrain" @updateConstrain="updateConstrain"></constraint>
  </div>
</template>

<script>
import { modulesInfoService } from "paas-web-utils/services";
import { columnService } from "paas-web-utils/services";
import { viewService } from "paas-web-utils/services";
import Constraint from "./constrain";

export default {
  name: "ForeignKey",
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
      loading:false,
      isDisabled: false,
      relModuleOpt: [],
      showColumnOpt: [],
      relShowViewOpt: [],
      showMobileViewOpt: [],
      constraintShow: false,
      columnTypeOpt: [
        { label: "字符串", value: "varchar" },
        { label: "整数", value: "int" }
      ],
      valHideTypeOpt: [
        { value: "NORMAL", label: "不隐藏" },
        { value: "NAME", label: "名称格式" },
        { value: "PHONE", label: "手机格式" },
        { value: "TOTAL", label: "全部隐藏" }
      ],
      rules: {
        columnName: [
          { required: true, message: "请输入字段名称", trigger: "blur" }
        ],
        columnCode: { required: true, validator: checkColumnCode, trigger: 'blur'},
        columnType:{required: true,message: "请选择属性类型",trigger: "change"},
        //colConstraint:{required: true,message: "请选择约束条件",trigger: "change"},
        relyModuleId:{required: true,message: "请选择外键",trigger: "change"},
        relyColumnId:{required: true,message: "请选择显示值",trigger: "change"},
        selectViewId:{required: true,message: "请选择关联页面",trigger: "change"},
      },
      form: {
        moduleCode: "",
        columnType: "",
        columnCode: "",
        showColValSet: "1",
        columnName: "",
        moduleId: null,
        maxLen: 100,
        minLen: 1,
        colConstraint: "",
        defaultVal: "",
        displayPosition: "1,2,3,4",
        showType: "1",
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
        mobileSelectViewId: null
      }
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
    //监听模块选择
    changeModule() {
      this.getShowColumnOpt();
      this.getRelShowViewOpt();
      this.getShowMobileViewOpt();
      this.form.relyColumnId = null;
      this.form.selectViewId = null;
      this.form.mobileSelectViewId = null;
    },
    //打开约束新增编辑框
    openAddConstrain() {
      this.constraintShow = true;
    },
    //触发更新约束数据
    updateConstrain() {
      this.$emit("updateConstrain");
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
    closeConstrain() {
      this.constraintShow = false;
    },
    //初始化表单数据
    initForm() {
      this.form = {
        moduleCode: "",
        columnType: "",
        columnCode: "",
        showColValSet: "1",
        columnName: "",
        moduleId: null,
        maxLen: 100,
        minLen: 1,
        colConstraint: "",
        defaultVal: "",
        displayPosition: "1,2,3,4",
        showType: "1",
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
        mobileSelectViewId: null
      };
    },
    //获取模块集合
    getRelModuleOpt() {
      var moduleParams = {
        moduleIds: [],
        isRelated: 0,
        isCustom: 1,
        isDelete: 0
      };
      modulesInfoService.findModules(moduleParams).then(res => {
        this.relModuleOpt = res;
      });
    },
    //模块id查询字段集合
    getShowColumnOpt() {
      let params = {
        moduleId: this.form.relyModuleId
      };
      columnService.findFieldsByModuleId(params).then(res => {
        this.showColumnOpt = res;
      });
    },
    //模块id查询视图集合
    getRelShowViewOpt() {
      let params = {
        moduleId: this.form.relyModuleId,
        viewFlag: 0,
        viewTypes: [1]
      };
      viewService.findViewsByModuleId(params).then(res => {
        this.relShowViewOpt = res;
      });
    },
    //模块id查询移动端视图集合
    getShowMobileViewOpt() {
      let params = {
        moduleId: this.form.relyModuleId,
        viewFlag: 1,
        viewTypes: [1]
      };
      viewService.findViewsByModuleId(params).then(res => {
        this.showMobileViewOpt = res;
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
        this.form.isMoreData = data.isMoreData;
        this.form.isRuleCode = data.isRuleCode;
      })
      columnService.findRelatedModule({columnId:this.editRow.id}).then(data=>{
        //模块回填
        if(data.relModuleId){
          let promise = undefined;
          let moduleParams = {
            moduleIds: [],
            isRelated: 0,
            isCustom: 1,
            isDelete: 0
          };
          let paramsView = {
            moduleId: data.relModuleId,
            viewFlag: 0,
            viewTypes: [1]
          };
          let paramsMobileView = {
            moduleId: data.relModuleId,
            viewFlag: 1,
            viewTypes: [1]
          };
          promise = Promise.all([
            modulesInfoService.findModules(moduleParams),
            columnService.findFieldsByModuleId({moduleId: data.relModuleId}),
            viewService.findViewsByModuleId(paramsView),
            viewService.findViewsByModuleId(paramsMobileView),
          ])
          promise.then(res=>{
            this.relModuleOpt = res[0];
            this.showColumnOpt = res[1];
            this.relShowViewOpt = res[2];
            this.showMobileViewOpt = res[3];
            this.form.relyModuleId = data.relModuleId;
            this.form.relyColumnId = data.showColumnId;
            viewService.findViewById({id:data.showViewId}).then(data2=>{
              if(data2.viewName){
                this.form.selectViewId = data.showViewId;
              }else{
                this.form.selectViewId = null;
              }
              this.loading = false;
            })
            if(data.showMobileViewId){
              viewService.findViewById({id:data.showMobileViewId}).then(data3=>{
                if(data3.viewName){
                  this.form.mobileSelectViewId = data.showMobileViewId;
                }else{
                  this.form.mobileSelectViewId = null;
                }
                this.loading = false;
              })
            }else{
              this.form.mobileSelectViewId = null;
              this.loading = false;
            }
          })
        }else{
          this.form.relyModuleId = data1.relModuleId;
          this.loading = false;
        }
      })
    }else{
      this.getRelModuleOpt();
    }
  }
};
</script>

<style lang="scss" scoped>
.pui-foreign-key {
  height: 600px;
  .pui-foreign-key__content {
    // height: 560px;
    height: 515px;
    overflow-y: scroll;
  }
}
</style>
