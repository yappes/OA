<template>
  <div class="pui-add-parame">
    
    <aui-dialog 
    :close-on-click-modal="false"
        title="添加企业参数"
        width="40%"
        :visible="isVisible" 
        @hide="handleClose">
      <aui-form label-width="120px" :model="newParame" :inline="true" :rules="rules" ref="form" style="minWidth:570px">
        <aui-form-item label="企业参数名称" prop="filePath">
          <aui-input v-model="newParame.filePath" class="pui-parameter-input" placeholder="请输入"></aui-input>
        </aui-form-item>
        <aui-form-item label="参数值" prop="value">
          <aui-input v-model="newParame.value" class="pui-parameter-input" placeholder="请输入"></aui-input>
        </aui-form-item>
        <aui-form-item label="默认启用" >
          <aui-radio-group v-model="newParame.status">
            <aui-radio :label="1">启用</aui-radio>
          </aui-radio-group>
        </aui-form-item>
      </aui-form>
      <span slot="footer" class="dialog-footer">
        <aui-button :plain="true" @click="handleClose">取消</aui-button>
        <aui-button type="primary" @click="saveParame('form')">确定</aui-button> 
      </span>
    </aui-dialog>
    
  </div>
</template>
<script>
export default {
  name:'AddParame',
  data(){
    return{
      newParame:{
        filePath:'',
        value:'',
        status:0,
      },
      rules:{
        filePath:[
          { required: true, message: "请输入企业参数名称", trigger: "blur" },
          { min: 2, message: "至少2个字符", trigger: "blur" }
        ],
        value:[
          { required: true, message: "请输入企业参数名称", trigger: "blur" },
          { min: 2, message: "至少2个字符", trigger: "blur" }
        ],
      },
    }
  },
  props:{
    isVisible: {
      type: Boolean,
      default: false
    },
  },
  created(){
    
  },
  methods:{
    //保存企业参数
    saveParame(formName){
      let form = this.$refs[formName];
      form.validate(valid=>{
        if(valid){
          
        }
      })
      this.$emit('closeDialog');
      console.log(this.newParame)
    },
    handleClose(){
      this.$emit('closeDialog');
    }
  }
}
</script>
<style lang="scss" scoped>
.pui-parameter-input{
  width: 230px;
   
}

.pui-add-parame {
  /*dialog弹框*/
  /deep/ .aui-dialog__body {
    overflow-x: auto;
  }
}
</style>
