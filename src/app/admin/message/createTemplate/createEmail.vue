<template>
  <aui-dialog :show-full-icon="true" @hide="dialogClose" title="创建邮件模板" :visible.sync="dialogEmail" :close-on-click-modal="false" width="50%">
    <aui-form ref="form" :rules="rules" :model="form" label-width="130px">
      <aui-form-item label="模板名称" prop="name">
        <aui-input v-model="form.name" style="width:500px" placeholder="请输入模块名称"></aui-input>
      </aui-form-item>
      <aui-form-item label="邮件标题" prop="title">
        <aui-input v-model="form.title" style="width:500px" placeholder="请输入邮件标题"></aui-input>
      </aui-form-item>
      <aui-form-item label="发件邮箱">
        <aui-select v-model="form.senderMail" placeholder="请选择发件邮箱" style="width:500px">
          <aui-option v-for="item in senderOption" :key="item.id" :label="item.name" :value="item.id">
          </aui-option>
        </aui-select>
      </aui-form-item>
      <aui-form-item label="状态">
        <aui-radio v-model="form.state" label="ENABLE">启用</aui-radio>
        <aui-radio v-model="form.state" label="DISABLE">禁用</aui-radio>
      </aui-form-item>
      <aui-form-item label="">
        <aui-select v-model="form.moduleId" placeholder="请选择模块" style="width:200px" @change="moduledChange">
          <aui-option v-for="item in moduleIdOptions" :key="item.id" :label="item.moduleName" :value="item.id">
          </aui-option>
        </aui-select>
        <aui-select v-model="form.column" placeholder="请选择字段" style="width:200px">
          <aui-option v-for="item in columnOptions" :key="item.columnCode" :label="item.columnName" :value="item.columnCode">
          </aui-option>
        </aui-select>
        <aui-button type="primary" @click="insert" size="small">插入字段</aui-button>
      </aui-form-item>
      <aui-form-item label="模板内容" prop="content">
        <quillEditor ref="myTextEditor" v-model="form.content" style="width:90%;background:#fff">
        </quillEditor>
      </aui-form-item>
    </aui-form>
    <div slot="footer" class="dialog-footer">
      <aui-button :plain="true" @click="dialogEmail=false">取 消</aui-button>
      <aui-button type="primary" @click="addEmailTemp">确 定</aui-button>
    </div>
  </aui-dialog>
</template>
<script>
import Vue from "vue";
import { moduleService } from "paas-web-utils/services";
import messageService from "../service/messageService.js";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import VueQuillEditor from "vue-quill-editor";
import { quillEditor } from "vue-quill-editor";
Vue.use(VueQuillEditor /* { default global options } */);
export default {
  name: "createEmail",
  components: {
    quillEditor
  },
  props: {
    isShow: Boolean,
    type: String,
    editForm: Object
  },
  data() {
    return {
      index: 0, //闪光标的位置,
      dialogEmail: false,
      title: "创建邮件模板",
      fullscreenLoading: false,
      form: {
        name: "",
        title: "",
        senderMail: "",
        moduleId: "",
        column: "",
        content: "",
        state: "ENABLE"
      },
      moduleIdOptions: [],
      columnOptions: [],
      senderOption: [],
      rules: {
        name: [{ required: true, message: "请输入模块名称", trigger: "blur" }],
        title: [{ required: true, message: "请输入邮件标题", trigger: "blur" }],
        content: [
          { required: true, message: "请输入模板内容", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    isShow(val) {
      if(val) {
        this.getgetAllEntEmail()
      }
      console.log(this.editForm);
      if (this.type === "edit" && this.isShow) {
        this.form.name = this.editForm.name;
        this.form.title = this.editForm.title;
        this.form.senderMail = this.editForm.senderMail;
        this.form.content = this.editForm.content;
        this.form.state = this.editForm.state;
        this.form.id = this.editForm.id;
      } else {
        this.form = {
          name: "",
          title: "",
          senderMail: "",
          moduleId: "",
          column: "",
          content: "",
          state: "ENABLE"
        };
      }
      this.dialogEmail = this.isShow;
    }
  },
  mounted() {
    this.getModuleIdOptions();
    this.getgetAllEntEmail();
  },
  methods: {
    dialogClose() {
      this.$emit("dialogStatus");
    },
    submitForm() {},
    insert() {
      for (const row of this.moduleIdOptions) {
        if (row.id === this.form.moduleId) {
          let content = "${" + row.moduleCode + "." + this.form.column + "}";
          var range = this.$refs.myTextEditor.quill.getSelection();
          console.log("range", range);
          var length = range.index || 0;
          this.$refs.myTextEditor.quill.insertText(
            length,
            content,
            "bold",
            true
          );
        }
      }
    },
    // 获取发件邮箱
    getgetAllEntEmail() {
      messageService.getAllEntEmail({}).then(data => {
        this.senderOption = data;
      });
    },
    //所属模块
    getModuleIdOptions() {
      moduleService.findModules({}).then(data => {
        this.moduleIdOptions = data;
      });
    },
    moduledChange(index) {
      console.log("index", index);
      this.form.column = "";
      messageService
        .findSourceColumnsByModuleId({
          moduleId: this.form.moduleId
        })
        .then(data => {
          console.log(data);
          this.columnOptions = data[0].list;
        });
    },
    // 新增和编辑
    addEmailTemp() {
      this.$refs["form"].validate(valid => {
        console.log(valid);
        if (valid) {
          if (this.type === "add") {
            messageService.addEmailTemp(this.form).then(data => {
              this.$aui.message.show({
                message: "创建成功",
                type: "success"
              });
              this.dialogEmail = false;
              this.$emit("refreshData");
            });
          } else if (this.type === "edit") {
            console.log("this.form", this.form);
            messageService.editEmailTemplate(this.form).then(data => {
              this.$aui.message.show({
                message: "修改成功",
                type: "success"
              });
              this.dialogEmail = false;
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
<style lang="scss" scoped>
@import "pui-web/components/btnsTop/src/btnsTop.scss";
@import "~theme/mixins/mixins";
@import "~theme/common/var";
@import "~theme/mixins/utils";
</style>
