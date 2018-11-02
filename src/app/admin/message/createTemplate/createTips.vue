<template>
  <div>
    <aui-dialog :show-full-icon="true" @hide="dialogClose" title="创建提醒模板" :visible.sync="dialogTips" :close-on-click-modal="false" width="40%">
      <aui-form ref="form" :rules="rules" :model="form" label-width="130px">
        <aui-form-item label="模板主题" prop="subject">
          <aui-input v-model="form.subject" style="width:80%" placeholder="请输入模板主题"></aui-input>
        </aui-form-item>
        <aui-form-item label="状态">
          <aui-radio v-model="form.state" label="ENABLE">启用</aui-radio>
          <aui-radio v-model="form.state" label="DISABLE">禁用</aui-radio>
        </aui-form-item>
        <aui-form-item label="模板内容" prop="content">
          <aui-input type="textarea" style="width:80%" :rows="2" placeholder="请输入内容" v-model="form.content">
          </aui-input>
        </aui-form-item>
      </aui-form>
      <div slot="footer" class="dialog-footer">
        <aui-button :plain="true" @click="dialogTips=false">取 消</aui-button>
        <aui-button type="primary" @click="addSmsTemplate">确 定</aui-button>
      </div>
    </aui-dialog>
  </div>
</template>
<script>
import messageService from "../service/messageService.js";
export default {
  props: {
    isShow: false,
    type: String,
    editForm: Object
  },
  name: "createTips",
  data() {
    return {
      dialogTips: false,
      form: {
        subject: "",
        content: "",
        state: "ENABLE"
      },
      rules: {
        subject: [
          { required: true, message: "请输入模板主题", trigger: "blur" }
        ],
        content: [
          { required: true, message: "请输入模板内容", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    isShow() {
      this.dialogTips = this.isShow;
      if (this.isShow && this.type === "edit") {
        this.form.subject = this.editForm.subject;
        this.form.content = this.editForm.content;
        this.form.state = this.editForm.state;
        this.form.id = this.editForm.id;
      } else {
        this.form = {
          subject: "",
          content: "",
          state: "ENABLE"
        };
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("dialogStatus");
    },
    addSmsTemplate() {
      this.$refs["form"].validate(valid => {
        console.log(valid);
        if (valid) {
          if (this.type === "add") {
            messageService.addTipsTemp(this.form).then(data => {
              this.$aui.message.show({
                message: "创建成功",
                type: "success"
              });
              this.dialogTips = false;
              this.$emit("refreshData");
            });
          } else {
            console.log(111111111111);
            messageService.editTipsTemplate(this.form).then(data => {
              this.$aui.message.show({
                message: "修改成功",
                type: "success"
              });
              this.dialogTips = false;
              this.$emit("refreshData");
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
