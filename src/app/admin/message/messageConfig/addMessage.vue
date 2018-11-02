<template>
  <div>
    <aui-dialog :show-full-icon="true" @hide="dialogClose" title="消息配置" :visible.sync="dialogConfig" :close-on-click-modal="false" width="40%">
      <aui-form ref="form1" :model="form" :rules="rules" label-width="100px">
        <aui-form-item label="邮箱名称" prop="name">
          <aui-input v-model="form.name"></aui-input>
        </aui-form-item>
        <aui-form-item label="服务器地址" prop="host">
          <aui-input v-model="form.host"></aui-input>
        </aui-form-item>
        <aui-form-item label="服务器端口" prop="hostPort">
          <aui-input v-model="form.hostPort"></aui-input>
        </aui-form-item>
        <aui-form-item label="邮箱地址" prop="address">
          <aui-input v-model="form.address"></aui-input>
        </aui-form-item>
        <aui-form-item label="邮箱密码" prop="password">
          <aui-input v-model="form.password" type="password"></aui-input>
        </aui-form-item>
        <aui-form-item label="加密方式" prop="encryption">
          <aui-select v-model="form.encryption" placeholder="请选择加密方式">
            <aui-option label="SSL" value="SSL"></aui-option>
            <aui-option label="TSL" value="TSL"></aui-option>
          </aui-select>
        </aui-form-item>
      </aui-form>
      <div slot="footer" class="dialog-footer">
        <aui-button :plain="true" @click="dialogConfig=false">取 消</aui-button>
        <aui-button type="primary" @click="addEntEmail()">确 定</aui-button>
      </div>
    </aui-dialog>
  </div>
</template>
<script>
// import messageService from "../service/messageService.js";
import messageService from "../service/message-service.js";
export default {
  props: {
    isShow: Boolean,
    editForm: Object,
    type: String
  },
  name: "messageConfig",
  data() {
    var validatePass = (rule, value, callback) => {
      var re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      if (!re.test(value)) {
        callback(new Error("请输入正确的邮箱地址"));
      } else {
        callback();
      }
    };
    let validateHostport = (rule, value, callback) => {
      let reg = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
      if(!reg.test(value)) {
        callback(new Error("请出入正确的端口"))
      } else {
        callback()
      }
    }
    return {
      dialogConfig: false,
      activeName: "",
      activeName: "email",
      form: {
        name: "",
        address: "",
        hostPort: "",
        host: "",
        password: "",
        encryption: "SSL"
      },
      rules: {
        name: [{ required: true, message: "请输入邮箱名称", trigger: "blur" }],
        host: [
          { required: true, message: "请输入服务器地址", trigger: "blur" }
        ],
        hostPort: [
          { required: true, message: "请输入服务器端口", trigger: "blur" },
          { validator: validateHostport, trigger: 'blur'}
        ],
        address: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入邮箱密码", trigger: "blur" }
        ],
        encryption: [
          { required: true, message: "请选择加密方式", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    handleClick() {},
    dialogClose() {
      this.$emit("dialogStatus");
    },
    addEntEmail() {
      // console.log(this.$refs["form1"].validate)
      this.$refs["form1"].validate(valid => {
        console.log(valid);
        if (valid) {
          if (this.type === "add") {
            messageService.registerEntEmail(this.form).then(data => {
              this.$aui.message.show({
                message: "创建成功",
                type: "success"
              });
              this.dialogConfig = false;
              this.$emit("refreshData");
            });
          } else if (this.type === "edit") {
            messageService.editEntEmail(this.form).then(data => {
              this.$aui.message.show({
                message: "修改成功",
                type: "success"
              });
              this.dialogConfig = false;
              this.$emit("refreshData");
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  created() {
    this.$store.dispatch("adminNav/changeHeaderTitle", "消息配置");
  },
  watch: {
    isShow() {
      if (this.type === "edit" && this.isShow) {
        this.form.name = this.editForm.name;
        this.form.address = this.editForm.address;
        this.form.hostPort = this.editForm.hostPort;
        this.form.password = this.editForm.password;
        this.form.host = this.editForm.host;
        this.form.encryption = this.editForm.encryption;
        this.form.id = this.editForm.id;
      } else {
        this.form = {
          name: "",
          address: "",
          hostPort: "",
          host: "",
          password: "",
          encryption: "SSL"
        };
      }
      this.dialogConfig = this.isShow;
    }
  }
};
</script>
<style lang="scss" scoped>
// .config{
//   padding: 15px;
//   box-sizing: border-box;
//   background: #fff;
//   width: 1000px;
//   margin-top: 15px;
//   margin-left: 15px
// }
</style>
