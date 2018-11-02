<template>
  <aui-dialog
  :close-on-click-modal="false"
        title="自定义约束"
        width="40%" 
        :visible="constraintShow" 
        append-to-body
        @hide="cancel">
    <aui-form :model="form" :rules="rules" ref="form" label-width="130px" class="constraint-form">
      <pui-col>
        <aui-form-item label="约束名称" prop="constraintName">
          <aui-input v-model="form.constraintName" placeholder="请输入"></aui-input>
        </aui-form-item>
      </pui-col>
      <pui-col>
        <aui-form-item label="正则表达式" prop="regularExpression">
          <aui-input v-model="form.regularExpression" placeholder="请输入"></aui-input>
        </aui-form-item>
      </pui-col>
      <pui-col>
        <aui-form-item label="提示内容" prop="promptContent">
          <aui-input v-model="form.promptContent" placeholder="请输入"></aui-input>
        </aui-form-item>
      </pui-col>
      <pui-col>
        <aui-form-item label="描述" prop="description">
          <aui-input v-model="form.description" placeholder="请输入"></aui-input>
        </aui-form-item>
      </pui-col>
    </aui-form>
    <div slot="footer" class="dialog-footer">
      <aui-button :plain="true" @click="cancel">取 消</aui-button>
      <aui-button type="primary" @click="submitForm('form')">确定</aui-button>
    </div>
  </aui-dialog>
</template>

<script>
import {columnService} from "paas-web-utils/services";
export default {
  name: "Constrain",
  data() {
    return {
      rules: {
        constraintName: [
          {required: true,message: "请输入约束名称",trigger: "blur"},
          {min: 2,max: 15,message: "长度在 2 到 15 个字符",trigger: "blur"}
        ],
        promptContent: [
          {required: true,message: "请输入提示内容",trigger: "blur"},
          {min: 2,max: 15,message: "长度在 2 到 15 个字符",trigger: "blur"}
        ],
        regularExpression:{required: true,message: "请输入正则表达式",trigger: "blur"},
      },
      form: {
        "constraintName":"",
        "promptContent":"",
        "regularExpression":"",
        "description":"",
      }
    };
  },
  props:{
    constraintShow:{
      type:Boolean,
      default:false,
    }
  },
  methods:{
    //提交表单数据
    submitForm(formName){
      let form = this.$refs[formName];
        form.validate(valid=>{
          if(valid){
            let params = this.form;
            columnService.addConstraint(params).then(data=>{
              console.log('新增约束')
              this.$emit('updateConstrain')
              this.cancel();
            })
          }else{
            return false
          }
        })
      
    },
    //关闭对话框
    cancel(){
      this.$emit('closeConstrain')
      this.initForm()
    },
    //初始化表单数据
    initForm(){
      this.form = {
        "constraintName":"",
        "promptContent":"",
        "regularExpression":"",
        "description":""
      }
    }
  },
  created: function() {
  },
};
</script>

<style lang="scss" scoped>
@import "~theme/mixins/utils.scss";
.constraint-form {
  padding: 0px 9% 0px 3%;
  min-width: 300px;
  @include utils-clearfix;
  .pui-col {
    width: 100%;
  }
}
</style>
