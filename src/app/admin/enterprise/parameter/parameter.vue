<template>
  <div class="pui-parameter">
    <aui-form label-width="120px" :model="parameter">
      <aui-form-item label="文件上传路径" >
        <aui-input v-model="parameter.filePath" class="pui-parameter-input" placeholder="请输入"></aui-input>
        <aui-radio-group v-model="parameter.status">
          <aui-radio :label="1">启用</aui-radio>
          <aui-radio :label="0">禁用</aui-radio>
        </aui-radio-group>
      </aui-form-item>
    </aui-form>
    <div class="pui-parameter-ctrl">
      <aui-button type="primary" class="pui-parameter-add" @click="addParame">添加新的企业参数</aui-button>
      <aui-button type="primary" class="pui-parameter-update" >更新参数</aui-button>
    </div>
    <add-parame v-if="showAdd" :isVisible="showAdd" @closeDialog="handleCloseAdd"></add-parame>
  </div>
</template>
<script>
import addParame from './addparame'
export default {
  name:'Parameter',
  components:{
    addParame
  },
  data(){
    return{
      showAdd:false,
      parameter:{
        filePath:'',
        status:'',
      },
    }
  },
  created(){
    this.$store.dispatch("adminNav/changeHeaderTitle", '企业参数'); 
  },
  methods:{
    //获取企业参数
    
    //添加企业参数
    addParame(){
      this.showAdd = true;
    },
    //关闭对话框
    handleCloseAdd(){
      this.showAdd = false;
    }
  }
}
</script>
<style lang="scss" scoped>
.pui-parameter{
  padding: 35px 20px;
  .pui-parameter-input{
    width: 230px;
  }
  .pui-parameter-add{
    display: inline-block;
    margin-left: 35%;
  }
  .pui-parameter-update{
    display: inline-block;
    margin-left:20px;
  }
}

</style>
