<template>
  <div class="pui-module-form">
   <aui-dialog :close-on-click-modal="false" :title="dialogTitle" show-full-icon @hide="cancel" :visible="show" width="40%">
      <aui-form :model="form" :rules="rules" ref="form" label-width="100px" class="pui-module-form__form">
      
          <aui-form-item label="模块名称" prop="moduleName">
            <aui-input v-model="form.moduleName" placeholder="请输入模块名称"></aui-input>
          </aui-form-item>
      
     
          <aui-form-item label="模块编码" prop="moduleCode">
            <aui-input v-model="form.moduleCode" :disabled="isEdit" placeholder="请输入模块编码"></aui-input>
          </aui-form-item>

           <aui-form-item label="是否启用流程" prop="isProcess">
            <aui-switch v-model="form.isProcess" :active-value="1" :inactive-value="0"></aui-switch>
          </aui-form-item>
        
          <aui-form-item label="启用数据权限" prop="dpEnable">
            <aui-switch v-model="form.dpEnable" :active-value="1" :inactive-value="0"></aui-switch>
          </aui-form-item>

          <aui-form-item v-if="form.dpEnable === 1" label="启用数据分享" prop="isDataSharing">
            <aui-switch v-model="form.isDataSharing" :active-value="1" :inactive-value="0"></aui-switch>
          </aui-form-item>
        
          <aui-form-item label="描述" prop="description">
            <aui-input type="textarea" :rows="2" placeholder="请输入模块描述" v-model="form.description"></aui-input>
          </aui-form-item>
           
      </aui-form>
      <div slot="footer" class="dialog-footer">
        <aui-button :plain="true"  @click="cancel">取 消</aui-button>
        <aui-button type="primary" @click="submitForm('form')">确定</aui-button>
      </div>
    </aui-dialog>
  </div>
</template>

<script>
import { object } from "paas-web-utils/common/index.js";
import { modulesInfoService } from "paas-web-utils/services";

export default {
  name: "PuiModuleForm",
  data(){
    //模块编码验证
    var checkModuleCode = (rule, value, callback) => {
      if(!this.isEdit){
        if(!value){
          callback(new Error('请输入模块编码'));
        }else{
          var myreg=/^[a-zA-Z][a-zA-Z0-9_]*$/; 
          var length_reg = /^\w{1,9}$/; 
          if (!myreg.test(value)) {  
            callback(new Error('模块编码必须以字母开头')); 
          } else if(!length_reg.test(value)){ 
            callback(new Error('模块编码必须小于等于9位')); 
          }else{ 
            let params = {
              "moduleCode":value,
            }
            modulesInfoService.checkModuleCode(params).then(data => {
              if(data == 'EXIST'){
                callback(new Error('模块编码已存在')); 
              }else if(data == 'NOTEXIST'){
                callback()
              }
            })
          }  
        }
      }else{
        callback()
      }
    };
    return {
      dialogTitle:'新增模块',
      rules: {
        moduleName: [
          { required: true, message: "请输入模块名称", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ],
        moduleCode: { required: true, validator: checkModuleCode, trigger: 'blur'},
      },
      form: {
        moduleName: "",
        moduleCode: "",
        dpEnable: 0,
        isDataSharing: 0,
        isCustomModule: 1,
        isProcess: 0,
        description: "",
        isDelete:0,
      }
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    editRow: {
      type: Object
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    submitForm(formName) {
      let form = this.$refs[formName];
      form.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            let params = this.form;
            modulesInfoService.updateModule(params).then(data => {
              this.hideAndRefresh();
            });
          } else {
            let params = this.form;
            modulesInfoService.addModule(params).then(data => {
              this.hideAndRefresh();
            });
          }
        } else {
          return false;
        }
      });
    },
    hideAndRefresh() {
      this.cancel();
      this.$emit("refreshTable");//刷新列表
    },
    cancel() {
      this.$emit("closeDialog");
      this.$refs.form.resetFields();
    }
  },
  created(){
    if(this.isEdit){
      this.dialogTitle = '编辑模块';
      modulesInfoService.findModuleDetail({moduleId:this.editRow.id}).then(data=>{
        this.form.id = data.id
        this.form.moduleName = data.moduleName
        this.form.moduleCode = data.moduleCode
        this.form.dpEnable = data.dpEnable
        this.form.isDataSharing = data.isDataSharing
        this.form.isProcess =  parseInt(data.isProcess)
        this.form.description = data.description
      })
    }
  },
};
</script>

<style lang="scss" scoped>
@import "./modulesInfo.scss";
.pui-module-form {
  & .pui-module-form__form {
    padding: 0px 9% 0px 3%;
    // min-width: 300px;
    min-width: 390px;
  }
}
</style>

