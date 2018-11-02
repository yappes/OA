<template>
  <div class="pui-operation-form">
    <aui-dialog :close-on-click-modal="false" :title="dialogTitle" width="50%" show-full-icon @hide="cancel" :visible="show">
      <aui-tabs type="border-card" tab-position="left" @tab-click="handleTabClick"  v-model="activeType" class="pui-field-form-tabs">
        <aui-tab-pane :disabled="isEdit&&activeType!=0" label="提交" name="0">
          <operation-submit v-if="activeType == '0'" :editRow="editRow" @submitFormData="submitForm" @cancel="cancel"></operation-submit>
        </aui-tab-pane>
        <aui-tab-pane :disabled="isEdit&&activeType!=1" label="新增" name="1">
          <operation-add v-if="activeType == '1'" :editRow="editRow" @submitFormData="submitForm" @cancel="cancel"></operation-add>
        </aui-tab-pane>
        <aui-tab-pane :disabled="isEdit&&activeType!=2" label="修改" name="2">
          <operation-edit v-if="activeType == '2'" :editRow="editRow" @submitFormData="submitForm" @cancel="cancel"></operation-edit>
        </aui-tab-pane>
        <aui-tab-pane :disabled="isEdit&&activeType!=3" label="删除" name="3">
          <operation-delete v-if="activeType == '3'" :editRow="editRow" @submitFormData="submitForm" @cancel="cancel"></operation-delete>
        </aui-tab-pane>
        <aui-tab-pane :disabled="isEdit&&activeType!=4" label="明细查询" name="4">
          <operation-detail v-if="activeType == '4'" :editRow="editRow" @submitFormData="submitForm" @cancel="cancel"></operation-detail>
        </aui-tab-pane>
        <aui-tab-pane :disabled="isEdit&&activeType!=5" label="流程提交" name="5">
          <operation-process-submit v-if="activeType == '5'" :editRow="editRow" @submitFormData="submitForm" @cancel="cancel"></operation-process-submit>
        </aui-tab-pane>
        <aui-tab-pane :disabled="isEdit&&activeType!=6" label="数据导入" name="6">
          <operation-data-insert v-if="activeType == '6'" :editRow="editRow" @submitFormData="submitForm" @cancel="cancel"></operation-data-insert>
        </aui-tab-pane>
        <aui-tab-pane :disabled="isEdit&&activeType!=7" label="批量操作" name="7">
          <operation-batch-ctrl v-if="activeType == '7'" :editRow="editRow" @submitFormData="submitForm" @cancel="cancel"></operation-batch-ctrl>
        </aui-tab-pane>
        <aui-tab-pane :disabled="isEdit&&activeType!=8" label="新增关联模块数据" name="8">
          <operation-add-module v-if="activeType == '8'" :editRow="editRow" @submitFormData="submitForm" @cancel="cancel"></operation-add-module>
        </aui-tab-pane>
        <aui-tab-pane :disabled="isEdit&&activeType!=9" label="提交确认" name="9">
          <operation-submit-confirm v-if="activeType == '9'" :editRow="editRow" @submitFormData="submitForm" @cancel="cancel"></operation-submit-confirm>
        </aui-tab-pane>
        <aui-tab-pane :disabled="isEdit&&activeType!=10" label="数据导出" name="10">
          <operation-data-out v-if="activeType == '10'" :editRow="editRow" @submitFormData="submitForm" @cancel="cancel"></operation-data-out>
        </aui-tab-pane>
      </aui-tabs>
    </aui-dialog>
  </div>
</template>

<script>
  import {operationService} from "paas-web-utils/services";
  import operationSubmit from "./operationSubmit.vue"
  import operationAdd from "./operationAdd.vue"
  import operationEdit from "./operationEdit.vue"
  import operationDelete from "./operationDelete.vue"
  import operationDetail from "./operationDetail.vue"
  import operationProcessSubmit from "./operationProcessSubmit.vue"
  import operationDataInsert from "./operationDataInsert.vue"
  import operationBatchCtrl from "./operationBatchCtrl.vue"
  import operationAddModule from "./operationAddModule.vue"
  import operationSubmitConfirm from "./operationSubmitConfirm.vue"
  import operationDataOut from "./operationDataOut.vue"
  export default {
    name: "fieldForm",
    components: {
      operationSubmit,
      operationAdd,
      operationEdit,
      operationDelete,
      operationDetail,
      operationProcessSubmit,
      operationDataInsert,
      operationBatchCtrl,
      operationAddModule,
      operationSubmitConfirm,
      operationDataOut,
    },
    data() {
      return {
        dialogTitle:'新增操作',
        colConstraintOpt:[],
        activeType:'0',
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
      },
      module:{
        type: [Number, Object],
        default: null
      }
    },
    created(){
      if(this.isEdit){
        this.dialogTitle = '编辑操作';
        this.activeType = this.editRow.type.toString();
      }
    },
    mounted(){
      this.$watch('editRow',()=>{
        this.activeType = this.editRow.type.toString();
      })
    },
    methods: {
      //保存数据
      submitForm(params) {
        console.log('执行submitForm', params, this.isEdit)
        if(this.isEdit){
          this.$set(params,'id',this.editRow.id)
          params.viewId = params.viewId.toString();
          params.flag = 1
          operationService.editOperation(params).then(data=>{
            console.log('编辑成功')
            this.hideAndRefresh()
          }).catch(err => {
            params.viewId = params.viewId.split(',').map(item => {
              return Number(item)
            });
          })
        }else{
          params.moduleId = this.module;
          params.viewId = params.viewId.toString();
          params.flag = 1
          operationService.addOperation(params).then(data=>{
            this.hideAndRefresh()
            console.log('新增成功')
          }).catch(err => {
            params.viewId = params.viewId.split(',').map(item => {
              return Number(item)
            });
          })
        }
      },
      handleTabClick(tab, event) {
        
      },
      //关闭对话框
      hideAndRefresh() {
        this.cancel();
        this.$emit("refreshTable"); //刷新列表
      },
      cancel(callBack) {
        this.$emit("closeDialog");
        callBack;
        this.$emit('clearEditRow')
      },
    },
    
  };
</script>

<style lang="scss">
.pui-operation-form {
  & .aui-dialog__body {
    padding: 0;
  }
  & .dialog-footer {
    text-align: right;
    padding: 25px 20px 20px 20px;
  }
  & .aui-tabs--border-card {
    &>.aui-tabs__content {
      padding: 15px 0 0 15px;
    }
  }
  //弹框中的内容样式
  & .content {
    // height: 365px;
    height: 510px;
    overflow-y: auto;
    & .pui-col {
      width:100%;
    }
  }
  //弹框中的表单样式
  & .form {
    width: 90%;
    min-width: 400px;
    // //行高一致
    //  .aui-form-item__content , .aui-form-item__label , .aui-checkbox-group {
    //   line-height: 34px;
    //   height: 34px;
    // }
    // 鼠标移至 问号 提示的内容 样式
    .card {
      margin-bottom: 20px;
      color: #67c23a;
      display: none;
      position: absolute;
      right:0;
      top:34px;
      z-index:10;
      // width: 450px;
      width:1400%;
      .item {
        padding-left: 20px;
        text-align: left;
      }
      .format-box {
        padding-left: 20px;
        & > li {
          list-style-type: decimal;
        }
      }
    }
    // 加号 和 问号 的样式
    .add-colConstraint {
      display: inline-block;
      font-size: 30px;
      // border: 1px solid #eee;
      border: 1px solid #c0c4cc;
      box-sizing: border-box;
      width: 32px;
      height: 34px;
      line-height: 34px;
      text-align: center;
      color: #ccc;
      cursor: pointer;
      margin-top: 3px;
    }
    // .add-colConstraint {
    //   border:  1px solid #eee;
    //   box-sizing: border-box;
    //   display: inline-block;
    //   width:  32px;
    //   text-align: center;
    //   cursor: pointer;
    //   height: 34px;
    //   margin-top: 3px;
    // }
    //加号前面的选择框
    .colConstraint {
      .aui-select, .aui-form-item__content>.aui-input {
        width: calc(100% - 32px);
        float: left;
      }
    }
    //可输入最大最小长度
    & .aui-input-number {
      width: 100%;
    }
  }
}
</style>
