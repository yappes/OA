<template>
  <div>
    <aui-dialog :show-full-icon="true" @hide="dialogClose" title="创建短信模板" :visible.sync="dialogMessage" :close-on-click-modal="false" width="40%">
      <aui-form ref="form" :rules="rules" :model="form" label-width="130px">
        <aui-form-item label="短信签名" prop="name">
          <aui-select v-model="form.sign" style="width:290px">
            <aui-option v-for="item in options" :key="item.label" :label="item.label" :value="item.label">
            </aui-option>
          </aui-select>
          <aui-tooltip class="item" effect="dark" :content="prompt" placement="top">
            <i class="pui-icon-jinggaofull" style="font-size:20px;color:#51c5be;margin-left:10px;"></i>
          </aui-tooltip>
          <!-- <div style="font-size:12px;color:#26B7AE;height:10px">{{prompt}}</div> -->
        </aui-form-item>
        <aui-form-item label="短信类型">
          <aui-radio v-model="form.type" label="NOTIFY">通知类</aui-radio>
          <aui-radio v-model="form.type" label="CODE">验证码类</aui-radio>
        </aui-form-item>
        <aui-form-item label="短信内容" prop="content">
          <aui-select v-model="template" placeholder="请选择常用模板" style="width:290px" @change="moduledChange">
            <aui-option v-for="item in templates" :key="item.label" :label="item.label" :value="item.label">
            </aui-option>
          </aui-select>
          <aui-button type="primary" @click="use" size="small">使用</aui-button>
          <aui-tooltip class="item" effect="dark" placement="left">
            <div slot="content">
              赞同为您推荐一些常用模板,您可以在常用模板的基础上修改。<br>
              如果您需要自己写模板,推荐这样操作<br>
              1.输入您希望发送的内容。<br>
              2.将短信内容中会变的部分(发给不同用户是不同内容)替换为变量格式。<br>
              3.变量格式为两边是#,中间是英文单词,如#username#
            </div>
            <i class="pui-icon-jinggaofull" style="font-size:20px;color:#51c5be;margin-left:10px;"></i>
          </aui-tooltip>
          <aui-input type="textarea" style="width:80%;margin-top:10px" :rows="4" placeholder="请输入内容" v-model="form.content">
          </aui-input>
        </aui-form-item>
      </aui-form>
      <div slot="footer" class="dialog-footer">
        <aui-button :plain="true" @click="dialogMessage=false">取 消</aui-button>
        <aui-button type="primary" @click="addSmsTemplate">确 定</aui-button>
      </div>
    </aui-dialog>
  </div>
</template>
<script>
// import messageService from "../service/messageService.js";
import messageService from "../service/message-service.js";
export default {
  props: {
    isShow: false,
    editForm:Object,
    type:String
  },
  name: "createSms",
  data() {
    return {
      dialogMessage: false,
      prompt:"签名显示在短信内容的最前面，显示这条短信来自哪家公司/产品/网站。",
      template:"",
      templates:[
        {
          label:"您的验证码是#code#"
        },{
          label:"您的验证码是#code#。如非本人操作，请忽略本短信"
        },{
          label:"亲爱的#name#，您的验证码是#code#。有效期为#hour#，请尽快验证"
        },{
          label:"感谢您注册#app#，您的验证码是#code#"
        },{
          label:"欢迎使用#app#，您的手机验证码是#code#。本条信息无需回复"
        },{
          label:"正在进行登录操作，您的验证码是#code#"
        },{
          label:"验证码是#code#。如非本人操作，请致电#tel#"
        },{
          label:"#code#(#app#手机验证码，请完成验证)，如非本人操作，请忽略本短信"
        }
      ],
      options:[{
        label:"【赞同科技】"
      }],
      form: {
        sign: "【赞同科技】",
        content: "",
        type: "NOTIFY"
      },
      rules: {
        content: [
          { required: true, message: "请输入短信内容", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    isShow() {
      this.dialogMessage = this.isShow;
      console.log(this.type);
      if(this.isShow&&this.type==="edit"){
        this.form.sign=this.editForm.sign;
        this.form.content=this.editForm.content;
        this.form.type=this.editForm.type;
        this.form.id=this.editForm.id;
        console.log(this.form)
      }else{
        this.form={
          sign: "【赞同科技】",
          content: "",
          type: "NOTIFY"
        }
      }
    }
  },
  methods: {
    moduledChange(){

    },
    dialogClose() {
      this.$emit("dialogStatus");
    },
    addSmsTemplate() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if(this.type==="add"){
            messageService.addSmsTemp(this.form).then(data => {
              this.$aui.message.show({
                message: "创建成功",
                type: "success"
              });
              this.dialogMessage=false;
              this.$emit("refreshData");
            });
          }else if(this.type==="edit"){
            messageService.editSmsTemp(this.form).then(data => {
              this.$aui.message.show({
                message: "修改成功",
                type: "success"
              });
              this.dialogMessage = false;
              this.$emit("refreshData");
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    use(){
      this.form.content=this.template;
    }
  }
};
</script>
