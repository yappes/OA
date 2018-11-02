<template>
  <div class="pui-detail">
    <aui-form label-width="120px" :rules="rules" :model="detail" ref="form">
      <aui-form-item label="企业名称" prop="entName" >
        <aui-input v-model="detail.entName" class="pui-detail-input"  placeholder="请输入"></aui-input>
      </aui-form-item>
      <aui-form-item label="企业账号" prop="entAccount">
        <aui-input v-model="detail.entAccount" disabled class="pui-detail-input"  placeholder="请输入"></aui-input>
      </aui-form-item>
      <aui-form-item label="企业地址" prop="address" >
        <aui-input v-model="detail.address" class="pui-detail-input"  placeholder="请输入"></aui-input>
      </aui-form-item>
      <aui-form-item label="企业邮箱" prop="email" >
        <aui-input v-model="detail.email" class="pui-detail-input"  placeholder="请输入"></aui-input>
      </aui-form-item>
      <aui-form-item label="企业邮箱密码" prop="emailPwd">
        <aui-input v-model="detail.emailPwd" class="pui-detail-input"  placeholder="请输入"></aui-input>
      </aui-form-item>
      <aui-form-item label="加密方式" prop="emailEncryption">
        <aui-radio-group v-model="detail.emailEncryption">
          <aui-radio :label="'SSL'">SSL</aui-radio>
          <aui-radio :label="'TLS'">TLS</aui-radio>
        </aui-radio-group>
      </aui-form-item>
      <aui-form-item label="传真" prop="fax">
        <aui-input v-model="detail.fax" class="pui-detail-input"  placeholder="请输入"></aui-input>
      </aui-form-item>
      <aui-form-item label="手机号码" prop="mobile" >
        <aui-input v-model="detail.mobile" class="pui-detail-input"  placeholder="请输入"></aui-input>
      </aui-form-item>
      <aui-form-item label="企业站点" prop="website">
        <aui-input v-model="detail.website" class="pui-detail-input"  placeholder="请输入"></aui-input>
      </aui-form-item>
      <aui-form-item label="企业电话" prop="telephone" >
        <aui-input v-model="detail.telephone" class="pui-detail-input"  placeholder="请输入"></aui-input>
      </aui-form-item>
      <aui-form-item label="企业LOGO" prop="logoAttcId">
        <!-- <aui-upload
          class="upload-demo"
          action="saveFile/aos/file">
          <aui-button size="small" type="primary" ref="upload" @click="submitUpload">点击上传</aui-button>
          <div slot="tip" class="aui-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </aui-upload> -->
        <!-- :multiple=""  :disabled="" :action="" :accept="" :value="" -->
        <image-upload :multiple="false" :disabled="false" :accept="'jpg/png'"  :value="fileName" v-model="detail.logoAttcId"  :action="action"></image-upload>
      </aui-form-item>
    </aui-form>
    <div class="pui-detail-ctrl">
      <aui-button type="primary" class="pui-detail-save" @click="changeDetail('form')">保存</aui-button>
    </div>
  </div>
</template>
<script>
import {entService} from 'paas-web-utils/services'
import ImageUpload from "./image-upload";
import loginUser from "paas-web-utils/services/login-user";
export default {
  name:'PuiDetail',
  components: { ImageUpload },
  data(){
    //手机号正则验证
    var checkMobile = (rule, value, callback) => {
      if(!value){
        callback(new Error('请输入手机号'));
      }else{
        var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;  
        if (!myreg.test(value)) {  
          callback(new Error('请输入正确手机号')); 
        } else {  
          callback();  
        }  
      }
    };
    //邮箱正则验证
    var checkEmail = (rule, value, callback) => {
      if(!value){
        callback(new Error('请输入邮箱'));
      }else{
        var myreg=/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;  
        if (!myreg.test(value)) {  
          callback(new Error('请输入正确邮箱')); 
        } else {  
          callback();  
        }  
      }
    };
    return{
      action: "",
      fileName: "",
      detail:{},
      rules:{
        entName: { required: true, message: "请输入企业名称", trigger: "blur" },
        address: { required: true, message: "请输入企业地址", trigger: "blur" },
        mobile: [
          { required: true, validator: checkMobile, trigger: 'blur'},
        ],
        email: [
          { required: true, validator: checkEmail, trigger: 'blur'},
        ],
      }
    }
  },
  props:{

  },
  created(){
    this.$store.dispatch("adminNav/changeHeaderTitle", '企业信息'); 
    this.getDetail();
  },
  mounted() {
    this.getUploadUrl();
  },
  methods:{
    //获取企业参数信息
    getDetail(){
      let parame = {'id':null};
      entService.findEnterpriseData(parame).then(data=>{
        this.$set(this,'detail',data);
        console.log("this.detail",this.detail)

      })
    },
    //更新企业参数
    changeDetail(formName){
      let form = this.$refs[formName];
      form.validate(valid=>{
        if(valid){
          let parame = {
            "id": this.detail.id,
            "entName": this.detail.entName,
            "address": this.detail.address,
            "contact": this.detail.contact,
            "corporate": this.detail.corporate,
            "email": this.detail.email,
            "emailPwd": this.detail.emailPwd,
            "emailHost": this.detail.emailHost,
            "emailEncryption": this.detail.emailEncryption,
            "emailHostPort": this.detail.emailHostPort,
            "fax": this.detail.fax,
            "mobile": this.detail.mobile,
            "website": this.detail.website,
            "telephone": this.detail.telephone,
            "logoAttcId": this.detail.logoAttcId,
          };
          entService.updateEnterpriseData(parame).then(data=>{
            console.log(data);
            this.$aui.message.show({
              message:'保存成功',
              type:'success',
            })
          })
        }else{
          return false
        }
      })
      
    },
    //获取上传的目标地址
    getUploadUrl() {
      loginUser.get().then((user) => {
        // console.log("user",user);
          this.$set(this,"action",loginUser.newUri(user.fileUri,`saveFile/${user.entCode}/file`));
        });
    },
    

  },

}
</script>
<style lang="scss" scoped>
.pui-detail{
  padding: 35px 20px;
  .pui-detail-input{
    width: 230px;
  }
  .pui-detail-save{
    display: block;
    margin: 0 auto;
  }
  /*dialog弹框*/
  /deep/ .aui-dialog__body {
    overflow-x: auto;
  }
}
</style>
