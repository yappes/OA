<template>
  <div class="pui-admin-auto-encode">
    <div class="pui-admin-auto-encode-content">
      <!-- <aui-card class="pui-admin-auto-encode__statement-box-card" ref="card" style="background: #f0f9eb">
        <div slot="header" class="clearfix">
          <span>默认值当前时间的编码参数规范：</span>
          <aui-button style="float: right; padding: 3px 0;color:#67c23a" type="text" @click="close">X</aui-button>
        </div>
        <div class="item">
          <ul class="format-box">
            <li>$YY:&nbsp;&nbsp;&nbsp;年</li>
            <li>$MN:&nbsp;&nbsp;&nbsp;月</li>
            <li>$DD:&nbsp;&nbsp;&nbsp;日</li>
            <li>$HH:&nbsp;&nbsp;&nbsp;时</li>
            <li>$MM:&nbsp;&nbsp;&nbsp;分</li>
            <li>$COL[字段物理编码code]: 物理字段编码（即真实字段名）</li>
            <li>$VLEN[长度]: 自动增长值编号长度 $VLEN[5]</li>
          </ul>
          <br>如：ME_$YY/$MN/$DD-$VLEN[4]&nbsp;&nbsp;生成后为：ME_2015/05/22-0001 带根据某个字段值，生成相应规则的自动编码：ME_$COL[s_type]_$YY/$MN/$DD-$VLEN[4]
          <br>注：除自动编码规范的参数外，其它字符则会被看成固定连接字符，如上面实例中的"ME_"、"/"、"-"
        </div>
      </aui-card> -->
      <aui-form :model="form" :rules="rules" ref="form" label-width="130px" class="form">
        <aui-form-item label="字段名称" prop="columnName">
          <aui-input v-model="form.columnName" placeholder="请输入字段名称"></aui-input>
        </aui-form-item>
        <aui-form-item label="字段编码" prop="columnCode">
          <aui-input v-model="form.columnCode" :disabled="isDisabled" placeholder="请输入字段编码"></aui-input>
        </aui-form-item>
        <aui-form-item label="编码格式" prop="ruleCode"  class="colConstraint">
          <aui-input v-model="form.ruleCode" placeholder="请输入编码格式"></aui-input>
          <div class="add-colConstraint" style="font-size:16px">
              <span >?</span>
              <aui-card class="card" ref="card" style="background: #f0f9eb">
                <div slot="header" class="clearfix">
                  <span>编码格式当前时间的编码参数规范：</span>
                </div>
                <div class="item">
                  <ul class="format-box">
                    <li>$YY:&nbsp;&nbsp;&nbsp;年</li>
                    <li>$MN:&nbsp;&nbsp;&nbsp;月</li>
                    <li>$DD:&nbsp;&nbsp;&nbsp;日</li>
                    <li>$HH:&nbsp;&nbsp;&nbsp;时</li>
                    <li>$MM:&nbsp;&nbsp;&nbsp;分</li>
                    <li>$COL[字段物理编码code]: 物理字段编码（即真实字段名）</li>
                    <li>$VLEN[长度]: 自动增长值编号长度 $VLEN[5]</li>
                  </ul>
                  <br>如：ME_$YY/$MN/$DD-$VLEN[4]&nbsp;&nbsp;生成后为：ME_2015/05/22-0001 带根据某个字段值，生成相应规则的自动编码：ME_$COL[s_type]_$YY/$MN/$DD-$VLEN[4]
                  <br>注：除自动编码规范的参数外，其它字符则会被看成固定连接字符，如上面实例中的"ME_"、"/"、"-"
                </div>
              </aui-card>
            </div>
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
  </div>
</template>

<script>
import { columnService } from "paas-web-utils/services";
export default {
  name: "AutoEncode",
  props: {
    colMark: {
      type: String
    },
    module: {
      type: [Number, Object],
      default: null
    },
    editRow: {
      type: Object,
      default: {}
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
      isDisabled: false,
      rules: {
        columnName: [
          { required: true, message: "请输入字段名称", trigger: "blur" }
        ],
        columnCode: {
          required: true,
          validator: checkColumnCode,
          trigger: "blur"
        },
        ruleCode: { required: true, message: "请输入编码格式", trigger: "blur" }
      },
      form: {
        moduleCode: "",
        columnType: "varchar",
        columnCode: "",
        showColValSet: "",
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
        isRuleCode: 1,
        ruleCode: ""
      }
    };
  },
  methods: {
    //提交表单数据
    submitForm(formName) {
      let form = this.$refs[formName];
      form.validate(valid => {
        console.log(111);
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
    //初始化表单数据
    initForm() {
      this.form = {
        moduleCode: "",
        columnType: "varchar",
        columnCode: "",
        showColValSet: "",
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
        isRuleCode: 1,
        ruleCode: ""
      };
    },
    //关闭卡片提示框
    close() {
      this.$refs.card.$el.style.display = "none";
    }
  },
  created() {
    if (this.editRow) {
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
        this.form.ruleCode = data.ruleCode;
      })
    }
  }
};
</script>

<style lang="scss" scoped>
// .pui-admin-date__statement {
// .pui-admin-auto-encode {
  // .format-box {
  //   padding-left: 20px;
  // }
// }
.pui-admin-auto-encode {
  height: 600px;
  .pui-admin-auto-encode-content {
    // height: 560px;
    height: 515px;
    overflow-y: scroll;
  }
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
