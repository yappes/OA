<template>
  <div class="pui-admin-date">
    <div class="pui-admin-data-content">
      <!-- <aui-card class="pui-admin-date__statement-box-card" ref="card" style="background: #f0f9eb">
        <div slot="header" class="clearfix">
          <span>默认值当前时间的编码参数规范：</span>
          <aui-button style="float: right; padding: 3px 0;color:#67c23a" type="text" @click="close">X</aui-button>
        </div>
        <div class="item">
          <ul class="format-box">
            <li>$YY:年</li>
            <Li>$MN:月</Li>
            <li>$DD:日</li>
            <li>$HH:时</li>
            <li>$MM:分</li>
          </ul>
          <br>如：$YY-$MN-$DD $HH:$MM 生成后为：2015-05-22 01:01
        </div>
      </aui-card> -->
      <aui-form :model="form" :rules="rules" ref="form" label-width="130px" class="form">
        
          <aui-form-item label="字段名称" prop="columnName">
            <aui-input v-model="form.columnName" placeholder="请输入字段名称"></aui-input>
          </aui-form-item>
       
          <aui-form-item label="字段编码" prop="columnCode">
            <aui-input v-model="form.columnCode" :disabled="isDisabled" placeholder="请输入字段编码"></aui-input>
          </aui-form-item>
        
          <aui-form-item label="只读范围" prop="readonlyScope">
            <aui-checkbox-group v-model="form.readonlyScope">
              <aui-checkbox label="0">新增页面</aui-checkbox>
              <aui-checkbox label="1">编辑页面</aui-checkbox>
            </aui-checkbox-group>
          </aui-form-item>
     
          <aui-form-item label="日期类型" prop="dateType">
            <aui-select v-model="form.dateType">
              <aui-option v-for="item in dateTypeOpt" :key="item.value" :label="item.label" :value="item.value">
              </aui-option>
            </aui-select>
          </aui-form-item>
        
          <aui-form-item label="默认存储值" prop="defaultVal"  class="colConstraint">
            <aui-input v-model="form.defaultVal" placeholder="请输入默认存储值"></aui-input>
            <div class="add-colConstraint" style="font-size:16px">
              <span>?</span>
               <aui-card class="card" ref="card" style="background: #f0f9eb">
                    <div slot="header" class="clearfix">
                      <span>默认值当前时间的编码参数规范：</span>
                    </div>
                    <div class="item">
                      <ul class="format-box">
                        <li>$YY:年</li>
                        <Li>$MN:月</Li>
                        <li>$DD:日</li>
                        <li>$HH:时</li>
                        <li>$MM:分</li>
                      </ul>
                      <br>
                      <div>如：$YY-$MN-$DD $HH:$MM 生成后为：2015-05-22 01:01</div> 
                    </div>
                  </aui-card>
            </div>
          </aui-form-item>
          <aui-form-item label="字段输入提示" prop="fieldIptPrompt">
            <aui-input v-model="form.fieldIptPrompt" placeholder="请输入字段提示"></aui-input>
          </aui-form-item>
       
          <aui-form-item label="描述" prop="description">
            <aui-input type="textarea" :rows="2" placeholder="请输入模块描述" v-model="form.description"></aui-input>
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
  import { columnService } from "paas-web-utils/services";
  export default {
    name: "Date",
    props:{
      colMark:{
        type:String,
      },
      editRow:{
        type:Object,
        default:{},
      },
      module:{
        type: [Number, Object],
        default: null
      },
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
        isDisabled: false,
        rules: {
          columnName: [
            {required: true,message: "请输入字段名称",trigger: "blur"},
          ],
          columnCode: { required: true, validator: checkColumnCode, trigger: 'blur'},
          dateType:{required: true,message: "请选择日期类型",trigger: "change"},
        },
        dateTypeOpt: [
          {label: "日期+时间",value: "DATETIME"},
          {label: "日期",value: "DATE"},
          {label: "时间",value: "TIME"},
          {label: '年月',value: "YEAR_MONTH"},
          {label: "年",value: "YEAR"},
          {label: "月",value: "MONTH"},
          {label: "周",value: "WEEK"},
          {label: '月日',value: "MONTH_DAY"},
        ],
        form: {
          moduleCode:"",
          columnType: "datetime",
          columnCode: "",
          showColValSet: "1",
          columnName: "",
          moduleId:null,
          maxLen: 100,
          minLen: 1,
          colConstraint: "",
          defaultVal: "",
          displayPosition: "1,2,3,4",
          showType: "6",
          showColVal: "",
          fieldIptPrompt: "",
          readonlyScope: [],
          colMark: this.colMark,
          colAttrIsmodify: 1,
          isUnique: 0,
          valHideType: "NORMAL",
          description: "",
          isRuleCode: 0,
          dateType:'',
        },
      //   title:`
      //           <div class="item">
      //             默认值当前时间的编码参数规范：
      //             <ul class="format-box">
      //               <li>$YY:年</li>
      //               <Li>$MN:月</Li>
      //               <li>$DD:日</li>
      //               <li>$HH:时</li>
      //               <li>$MM:分</li>
      //             </ul>
      //             <br/>如：$YY-$MN-$DD $HH:$MM 生成后为：2015-05-22 01:01
      //           </div>
      //         `
      };
    },
    methods:{
      //提交表单数据
      submitForm(formName){
        let form = this.$refs[formName];
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
          columnType: "datetime",
          columnCode: "",
          showColValSet: "1",
          columnName: "",
          moduleId:null,
          maxLen: 100,
          minLen: 1,
          colConstraint: "",
          defaultVal: "",
          displayPosition: "1,2,3,4",
          showType: "6",
          showColVal: "",
          fieldIptPrompt: "",
          readonlyScope: [],
          colMark: this.colMark,
          colAttrIsmodify: 1,
          isUnique: 0,
          valHideType: "NORMAL",
          description: "",
          isRuleCode: 0,
          dateType:'',
        }
      },
      //关闭对话框
      cancel() {
        this.initForm();
        this.$emit("cancel", this.$refs.form.resetFields());
        this.isDisabled = false;
      },
      //关闭卡片提示框
      close() {
        this.$refs.card.$el.style.display = "none";
      },
    },
    created: function() {
      if(this.editRow){
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
          this.form.dateType = data.dateType;
        })
      }
    },
  }
</script>

<style lang="scss" scoped>
@import "~theme/common/var";
.pui-admin-date {
  height: 600px;
  .pui-admin-data-content {
    // height: 560px;
    height: 515px;
    overflow-y: scroll;
  }
  // .pui-admin-date__statement-box-card {
  // .card {
  //   margin-bottom: 20px;
  //   color: #67c23a;
  //   display: none;
  //   position: absolute;
  //   right:0;
  //   top:34px;
  //   z-index:10;
  //   width: 450px;
  //   .item {
  //     padding-left: 20px;
  //     text-align: left;
  //   }
  //   .format-box {
  //     padding-left: 20px;
  //     & > li {
  //       list-style-type: decimal;
        
  //     }
  //   }
  // }
  .add-colConstraint {
    position: relative;
    &:hover {
      .card {
        display:block;
      }
    }
  }
}
</style>
