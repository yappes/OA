<template>
  <div>
    <aui-form ref="form" :rules="rules" :model="form" label-width="100px">
      <aui-form-item label="标题" prop="title">
        <aui-input v-model="form.title" style="width:500px" placeholder="请输入邮件标题"></aui-input>
      </aui-form-item>
      <aui-form-item label="消息类型">
        <aui-radio v-model="form.radio" label="1">公告</aui-radio>
        <aui-radio v-model="form.radio" label="2">通知</aui-radio>
      </aui-form-item>
      <aui-form-item label="模板内容" prop="content">
        <aui-input type="textarea" :rows="4" placeholder="请输入内容" style="width:500px" v-model="form.content">
        </aui-input>
      </aui-form-item>
      <aui-form-item label="附件">
        <aui-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" multiple :limit="3">
          <aui-button size="small" type="primary">点击上传</aui-button>
          <div slot="tip" class="aui-upload__tip">支持扩展名：.rar .zip .doc .docx .pdf .jpg...</div>
        </aui-upload>
      </aui-form-item>
    </aui-form>
    <div slot="footer" class="dialog-footer">
      <aui-button :plain="true" @click="dialogEmail=false">取 消</aui-button>
      <aui-button type="primary" @click="dialogEditMember=false">确 定</aui-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "sendAnnouncement",
  data() {
    return {
      title: "发送公告/通知",
      fullscreenLoading: false,
      index: 0, //闪光标的位置
      editorOption: {},
      form: {
        title: "",
        radio: "1",
        content: ""
      },
      moduleIdOptions: [],
      columnOptions: [],
      minHeight: "",
      rules: {
        title: [{ required: true, message: "请输入邮件标题", trigger: "blur" }],
        content: [
          { required: true, message: "请输入模板内容", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.high();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    submitForm() {},
    high() {
      this.minHeight = window.innerHeight - 50 + "px";
    }
  }
};
</script>
<style lang="scss" scoped>
@import "pui-web/components/btnsTop/src/btnsTop.scss";
@import "~theme/mixins/mixins";
@import "~theme/common/var";
@import "~theme/mixins/utils";
.layout-main {
  margin: $--btnsTop-height 0 0 0;
  padding: 12px;
  background: #eef1f5;
  .pui-editPage__header-wrapper {
    @include utils-clearfix;
    margin-left: 25px;
    .pui-editPage__title {
      float: left;
      font-size: 20px;
      color: $--color-primary;
      font-weight: $--font-weight-primary;
    }
  }
}
.pui-editPage__header-wrapper {
  @include utils-clearfix;
  // margin: $--btnsTop-height auto
}

.pui-editPage__title {
  float: left;
  font-size: $--font-size-largest;
  color: $--color-primary;
  font-weight: $--font-weight-primary;
}

.page {
  width: 100%;
  min-width: 1024px;
  background-color: #eef1f5;
  font-size: 14px;
  color: #333333;
  .content {
    width: 70%;
    margin-left: 50px;
    margin-top: 35px;
    height: 100%;
    padding-bottom: 100px;
    background: #fff;
    padding: 30px 10px;
  }
}
</style>
