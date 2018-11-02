<template>
  <div class="pui-field-form">
    <!-- width="820px" -->
    <aui-dialog :close-on-click-modal="false" :title="dialogTitle" width="50%" show-full-icon @hide="cancel" :visible="show">
      <aui-tabs type="border-card" tab-position="left" @tab-click="handleTabClick"  v-model="activeName" class="pui-field-form-tabs">
        <aui-tab-pane :disabled="isEdit&&activeName!='NORMAL'" label="普通输入" name="NORMAL">
          <normal-input v-if="activeName == 'NORMAL'" :editRow="editRow" :module="module" :colMark="colMarkOpt.normal" @submitFormData="submitForm" :colConstraintOpt="colConstraintOpt" @cancel="cancel" @updateConstrain="findConstraint"></normal-input>
        </aui-tab-pane>
        <aui-tab-pane :disabled="isEdit&&activeName!='SIMDITOR'" label="富文本" name="SIMDITOR">
          <rich-text v-if="activeName == 'SIMDITOR'" :editRow="editRow" :module="module" :colMark="colMarkOpt.simditor" @submitFormData="submitForm" @cancel="cancel"></rich-text>
        </aui-tab-pane>
        <aui-tab-pane :disabled="isEdit&&activeName!='DATE'" label="日期" name="DATE">
          <date v-if="activeName == 'DATE'" :editRow="editRow" :module="module" :colMark="colMarkOpt.date" @submitFormData="submitForm" @cancel="cancel"></date>
        </aui-tab-pane>
        <aui-tab-pane :disabled="isEdit&&activeName!='FOREIGNKEY'" label="外键" name="FOREIGNKEY">
          <foreign-key v-if="activeName == 'FOREIGNKEY'" :editRow="editRow" :module="module" :colMark="colMarkOpt.foreignKey" @submitFormData="submitForm" :colConstraintOpt="colConstraintOpt" @cancel="cancel" @updateConstrain="findConstraint"></foreign-key>
        </aui-tab-pane>
        <aui-tab-pane :disabled="isEdit&&activeName!='DICTIONARY'" label="字典" name="DICTIONARY">
          <dictionary v-if="activeName == 'DICTIONARY'" :editRow="editRow" :module="module" :colMark="colMarkOpt.dictionary" @submitFormData="submitForm" @cancel="cancel"></dictionary>
        </aui-tab-pane>
        <aui-tab-pane :disabled="isEdit&&activeName!='RELATED'" label="依赖关系" name="RELATED">
          <dependency v-if="activeName == 'RELATED'" :editRow="editRow" :module="module" :colMark="colMarkOpt.related" @submitFormData="submitForm" @cancel="cancel"></dependency>
        </aui-tab-pane>
        <aui-tab-pane :disabled="isEdit&&activeName!='CHOSENDATA'" label="数据选择" name="CHOSENDATA">
          <data-select v-if="activeName == 'CHOSENDATA'" :editRow="editRow" :module="module" :colMark="colMarkOpt.chosenData" @submitFormData="submitForm" @cancel="cancel"></data-select>
        </aui-tab-pane>
        <aui-tab-pane :disabled="isEdit&&activeName!='NUMBER'" label="数字和浮点" name="NUMBER">
          <number-chose v-if="activeName == 'NUMBER'" :editRow="editRow" :module="module" :colMark="colMarkOpt.numberChose" @submitFormData="submitForm" :colConstraintOpt="colConstraintOpt" @cancel="cancel" @updateConstrain="findConstraint"></number-chose>
        </aui-tab-pane>
        <aui-tab-pane :disabled="isEdit&&activeName!='MONEY'" label="金额" name="MONEY">
          <amount v-if="activeName == 'MONEY'" :editRow="editRow" :module="module" :colMark="colMarkOpt.money" @submitFormData="submitForm" :colConstraintOpt="colConstraintOpt" @cancel="cancel" @updateConstrain="findConstraint"></amount>
        </aui-tab-pane>
        <aui-tab-pane :disabled="isEdit&&activeName!='UPLOAD'" label="上传" name="UPLOAD">
          <upload v-if="activeName == 'UPLOAD'" :editRow="editRow" :module="module" :colMark="colMarkOpt.upload" @submitFormData="submitForm" @cancel="cancel"></upload>
        </aui-tab-pane>
        <aui-tab-pane :disabled="isEdit&&activeName!='DEPARTMENT'" label="部门、人员" name="DEPARTMENT">
          <dept-user v-if="activeName == 'DEPARTMENT'" :editRow="editRow" :module="module" :colMark="colMarkOpt.department" @submitFormData="submitForm" @cancel="cancel"></dept-user>
        </aui-tab-pane>
        <aui-tab-pane :disabled="isEdit&&activeName!='ADDRESS'" label="省市级联" name="ADDRESS">
          <pui-address v-if="activeName == 'ADDRESS'" :editRow="editRow" :module="module" :colMark="colMarkOpt.address" @submitFormData="submitForm" @cancel="cancel"></pui-address>
        </aui-tab-pane>
        <aui-tab-pane :disabled="isEdit&&activeName!='AUTOCODE'" label="自动编码" name="AUTOCODE">
          <auto-encode v-if="activeName == 'AUTOCODE'" :editRow="editRow" :module="module" :colMark="colMarkOpt.autoCode" @submitFormData="submitForm" @cancel="cancel"></auto-encode>
        </aui-tab-pane>
      </aui-tabs>
    </aui-dialog>
  </div>
</template>

<script>
  import {constraintService} from "paas-web-utils/services";
  import {columnService} from "paas-web-utils/services";
  
  import NormalInput from "./normalnput.vue";
  import RichText from "./richText.vue";
  import Date from "./date.vue";
  import ForeignKey from "./foreignkey.vue";
  import Dictionary from "./dictionary.vue";
  import Dependency from "./dependency.vue";
  import DataSelect from "./dataSelect.vue";
  import NumberChose from "./numberChose.vue";
  import Amount from "./amount.vue";
  import Upload from "./upload.vue";
  import deptUser from "./deptUser.vue";
  import AutoEncode from "./autoEncode.vue";
  import PuiAddress from "./address.vue";

  export default {
    name: "fieldForm",
    components: {
      NormalInput,
      RichText,
      Date,
      ForeignKey,
      Dictionary,
      Dependency,
      DataSelect,
      NumberChose,
      Amount,
      Upload,
      deptUser,
      AutoEncode,
      PuiAddress,
    },
    data() {
      return {
        dialogTitle:'新增字段',
        colConstraintOpt:[],
        activeName:"NORMAL",
        colMarkOpt:{
          normal:'NORMAL',
          simditor:'SIMDITOR',
          date:'DATE',
          foreignKey:'FOREIGNKEY',
          dictionary:'DICTIONARY',
          related:'RELATED',
          chosenData:'CHOSENDATA',
          numberChose:'NUMBER',
          money:'MONEY',
          upload:'UPLOAD',
          department:'DEPARTMENT',
          autoCode:'AUTOCODE',
          address:"ADDRESS",
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
      },
      module:{
        type: [Number, Object],
        default: null
      }
    },
    created(){
      this.findConstraint()
      if(this.isEdit){
        this.dialogTitle = '编辑字段';
        this.activeName = this.editRow.colMark;
      }
    },
    mounted(){
      this.$watch('editRow',()=>{
        console.log('this.editRow',this.editRow)
        this.activeName = this.editRow.colMark;
      })
    },
    methods: {
      //查询约束数据
      findConstraint(){
        let params = {'constraintIdList':[]}
        columnService.findConstraint(params).then(data=>{
          this.colConstraintOpt = data;
        })
      },
      //保存数据
      submitForm(params) {
        if(this.isEdit){
          this.$set(params,'id',this.editRow.id)
          let reqData = null;
          if(params.colMark == 'FOREIGNKEY'){
            reqData = {
                            "column":params,
                            "moduleRelated": {
                                "relModuleId": params.relyModuleId,
                                "showColumnId": params.relyColumnId,
                                "showViewId": params.selectViewId,
                                "showMobileViewId": params.mobileSelectViewId,
                            },
            };
          }else{
            reqData = {"column":params}
          }
          columnService.updateField(reqData).then(data=>{
            console.log('编辑成功')
            this.hideAndRefresh()
          })
        }else{
          params.moduleId = this.module;
          let reqData = null;
          if(params.colMark == 'FOREIGNKEY'){
            reqData = {
                            "column":params,
                            "moduleRelated": {
                                "relModuleId": params.relyModuleId,
                                "showColumnId": params.relyColumnId,
                                "showViewId": params.selectViewId,
                                "showMobileViewId": params.mobileSelectViewId,
                            },
            };
          }else{
            reqData = {"column":params}
          }
          columnService.addField(reqData).then(data=>{
            this.hideAndRefresh()
            console.log('新增成功')
          })
        }
      },
      handleTabClick(tab, event) {
        console.log('this.activeName',this.activeName)
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
.pui-field-form {
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
