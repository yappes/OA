<template>
  <div class="pui-edit-dictionary">
    <aui-dialog 
    :close-on-click-modal="false"
        title="编辑字典"
        width="49%"
        :visible="isVisible" 
        @hide="handleClose">
      <aui-form :model="editDictionary" ref="form" label-width="40%" :inline="true" style="minWidth:575px">
        <div v-for="(item,index) in editDictionary.dicList" :key="item.id">
          <aui-form-item label="字典名称" 
            :prop="'dicList.' + index + '.dictName'"
            :rules="{ required: true, message: '字典名称', trigger: 'blur' }">
            <aui-input v-model="item.dictName" class="pui-edit-dictionary-input" placeholder="请输入"></aui-input>
          </aui-form-item>
          <aui-form-item label="字典编码">
            <aui-input v-model="item.dictCode" :disabled="true" class="pui-edit-dictionary-input" placeholder="请输入"></aui-input>
          </aui-form-item>
        </div>
      </aui-form>
      <span slot="footer" class="dialog-footer">
        <aui-button :plain="true"  @click="handleClose">取消</aui-button>
        <aui-button type="primary" @click="saveEdit('form')">确定</aui-button> 
      </span>
    </aui-dialog>
  </div>
</template>
<script>
import {dictionaryService} from 'paas-web-utils/services'
export default {
  name: "EditDictionary",
  data(){
    return{
      editDictionary:{
        dicList:[]
      },
    }
  },
  props:{
    isVisible: {
      type: Boolean,
      default: false
    },
    activeGroup:{
      type: Array,
    },
  },
  methods:{
    //保存字典
    saveEdit(formName){
      let form = this.$refs[formName];
      form.validate(valid=>{
        if(valid){
          let parame = {"dictList":this.editDictionary.dicList};
          dictionaryService.editDictionary(parame).then(data=>{
            this.handleClose();
            this.$emit('initView');
          })
        }else{
          return false
        }
      })
      
    },
    //取消 关闭对话框
    handleClose(){
      this.$emit('closeDialog');
      this.$refs.form.resetFields();
    },
    //获取当前字典信息
    getActiveDictionary(){
      for(let i=0; i<this.activeGroup.length; i++){
        let oneDic = {
            "dictName": this.activeGroup[i].dictName,
            "dictCode": this.activeGroup[i].dictCode,
            "dictParentCode": this.activeGroup[i].dictParentCode,
            "dictType": this.activeGroup[i].dictType,
            "sort": this.activeGroup[i].sort,
            "dictId": this.activeGroup[i].id,
            "isDelete": this.activeGroup[i].isDelete,
            "status": this.activeGroup[i].status,
        }
        this.editDictionary.dicList.push(oneDic)
      }
    }
  },
  created(){
    this.getActiveDictionary()
  }
}
</script>
<style lang="scss" scoped>
// .pui-edit-dictionary-input{
//   width: 170px;
// }
.pui-edit-dictionary /deep/ {
  & .aui-form-item {
    width: 49%;
    margin-right: 0;
    & .aui-form-item__content {
      width: 56%;
    }
  }
}
</style>

       
        