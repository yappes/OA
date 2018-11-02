<template>
  <div class="pui-data-select">
    <div class="pui-data-select__content" v-loading="loading">
      <aui-form :model="form" :rules="rules" ref="form" label-width="130px" class="form">
        <aui-form-item label="字段名称" prop="columnName">
          <aui-input v-model="form.columnName" placeholder="请输入字段名称"></aui-input>
        </aui-form-item>
        <aui-form-item label="字段编码" prop="columnCode">
          <aui-input v-model="form.columnCode" :disabled="isDisabled" placeholder="请输入字段编码"></aui-input>
        </aui-form-item>
        <aui-form-item label="数据模块" prop="relyModuleId">
          <aui-select v-model="form.relyModuleId" placeholder="请选择" filterable  @change="changeModule">
            <aui-option v-for="item in relModuleOpt" :key="item.id" :label="item.moduleName" :value="item.id">
            </aui-option>
          </aui-select>
        </aui-form-item>
        <aui-form-item label="数据显示值字段" prop="relyColumnId">
          <aui-select v-model="form.relyColumnId" placeholder="请选择">
            <aui-option v-for="item in showColumnOpt" :key="item.id" filterable  :label="item.columnName" :value="item.id">
            </aui-option>
          </aui-select>
        </aui-form-item>
        <aui-form-item label="数据视图" prop="selectViewId">
          <aui-select v-model="form.selectViewId" placeholder="请选择">
            <aui-option v-for="item in relShowViewOpt" :key="item.id" filterable  :label="item.viewName" :value="item.id">
            </aui-option>
          </aui-select>
        </aui-form-item>
        <aui-form-item label="数据移动端视图">
          <aui-select v-model="form.mobileSelectViewId" filterable placeholder="请选择">
            <aui-option v-for="item in showMobileViewOpt" :key="item.value" :label="item.viewName" :value="item.id">
            </aui-option>
          </aui-select>
        </aui-form-item>
        <aui-form-item label="可选择多条数据" prop="isMoreData">
          <aui-switch v-model="form.isMoreData" :active-value="1" :inactive-value="0"></aui-switch>
        </aui-form-item>
        <aui-form-item label="字段输入提示" prop="fieldIptPrompt">
          <aui-input v-model="form.fieldIptPrompt"></aui-input>
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
import { viewService } from "paas-web-utils/services";
export default {
  name: "DataSelect",
  props: {
    colMark: {
      type: String
    },
    editRow: {
      type: Object,
      default: {}
    },
    module: {
      type: [Number, Object],
      default: null
    }
  },
  data() {
    //字段编码正则验证
    var checkColumnCode = (rule, value, callback) => {
      if (!this.editRow) {
        if (!value) {
          callback(new Error("请输入字段编码"));
        } else {
          var myreg = /^[a-zA-Z][a-zA-Z0-9_]*$/;
          if (!myreg.test(value)) {
            callback(new Error("字段编码必须以字母开头"));
          } else {
            let parame = {
              moduleId: this.module,
              columnCode: value
            };
            columnService.checkColumnCode(parame).then(data => {
              if (data == "NOTEXIST") {
                callback();
              } else {
                callback(new Error("字典编码已存在"));
              }
            });
          }
        }
      } else {
        callback();
      }
    };
    return {
      loading:false,
      isDisabled: false,
      relModuleOpt: [],
      showColumnOpt: [],
      relShowViewOpt: [],
      showMobileViewOpt: [],
      rules: {
        columnName: [
          { required: true, message: "请输入字段名称", trigger: "blur" }
        ],
        columnCode: {
          required: true,
          validator: checkColumnCode,
          trigger: "blur"
        },
        relyModuleId: {
          required: true,
          message: "请选择数据模块",
          trigger: "change"
        },
        relyColumnId: {
          required: true,
          message: "请选择显示字段",
          trigger: "change"
        },
        selectViewId: {
          required: true,
          message: "请选择数据视图",
          trigger: "change"
        },
      },
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
        showType: "7",
        showColVal: "",
        fieldIptPrompt: "",
        readonlyScope: [],
        colMark: this.colMark,
        colAttrIsmodify: 1,
        isUnique: 0,
        valHideType: "NORMAL",
        description: "",
        isMoreData: 0,
        isRuleCode: 0,
        relyModuleId: null,
        relyColumnId: null, 
        selectViewId: null,
        mobileSelectViewId: null,
      }
    };
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
    },
    //提交表单数据
      submitForm(formName){
        let form = this.$refs[formName];
        this.$set(this.form,'selectModuleId',this.form.relyModuleId)
        this.$set(this.form,'selectShowColId',this.form.relyColumnId)
        form.validate(valid=>{
          if(valid){
            let params = this.form;
            params.readonlyScope = params.readonlyScope.toString();
            this.$emit('submitFormData',params)
            this.initForm()
          }else{
            return false
          }
        })
      },
      //初始化表单数据
      initForm(){
        this.form = {
          moduleCode:"",
          columnType: "varchar",
          columnCode: "",
          showColValSet: "1",
          columnName: "",
          moduleId:null,
          maxLen: 100,
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
          isMoreData: 0,
          isRuleCode: 0,
          relyModuleId: null,
          relyColumnId: null,
          selectViewId: null,
          mobileSelectViewId: null,
        }
      },
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
        this.form.displayPosition = data.displayPosition;
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
        //模块 视图 字段回填
        if(data.relyModuleId){
          let promise = undefined;
          var moduleParams = {
            isRelated: 1,
            moduleIds: [],
            isEqModuleId: true,
            isCustom: 1
          };
          let paramsView = {
            moduleId: data.relyModuleId,
            viewFlag: 0,
            viewTypes: [1]
          };
          let paramsMobileView = {
            moduleId: data.relyModuleId,
            viewFlag: 1,
            viewTypes: [1]
          };
          promise = Promise.all([
            modulesInfoService.findModules(moduleParams),
            columnService.findFieldsByModuleId({moduleId: data.relyModuleId}),
            viewService.findViewsByModuleId(paramsView),
            viewService.findViewsByModuleId(paramsMobileView),
          ])
          promise.then(res=>{
            this.relyModuleOpt = res[0];
            this.showColumnOpt = res[1];
            this.relShowViewOpt = res[2];
            this.showMobileViewOpt = res[3];
            this.form.relyModuleId = data.relyModuleId;
            this.form.relyColumnId = data.relyColumnId;
            viewService.findViewById({id:data.selectViewId}).then(data2=>{
              if(data2.viewName){
                this.form.selectViewId = data.selectViewId;
              }else{
                this.form.selectViewId = null;
              }
              this.loading = false;
            })
            if(data.mobileSelectViewId){
              viewService.findViewById({id:data.mobileSelectViewId}).then(data3=>{
                if(data3.viewName){
                  this.form.mobileSelectViewId = data.mobileSelectViewId;
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
          this.form.relyModuleId = null;
          this.loading = false;
        }
      })
    }
    this.getRelModuleOpt();
  }
};
</script>

<style lang="scss" scoped>
.pui-data-select {
  height: 600px;
  .pui-data-select__content {
    // height: 560px;
    height: 515px;
    overflow-y: scroll;
  }
}
</style>
