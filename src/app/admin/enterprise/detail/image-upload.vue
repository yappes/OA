<template>
  <div>
    <aui-upload :action="action" 
      :multiple="multiple" 
      :limit="1"
      :accept="uploadAccept" 
      :disabled="disabled" 
      :on-success="handleSuccess" 
      :on-remove="handleRemove" 
      :on-preview="handlePictureCardPreview" 
      :file-list="fileList" list-type="picture-card"
      :before-upload="beforeUpload">
      <i class="aui-icon-plus"></i>
      <div slot="tip" class="aui-upload__tip">{{uploadTip}}</div>
    </aui-upload>
  </div>
</template>

<script>
import { CONTENT_TYPE } from "paas-web-utils/rules/enum";
export default {
  name: "ImageUpload",
  props: {
    multiple: Boolean,
    disabled: Boolean,
    action: String,
    accept: {
      type: String
    },
    value: [String,Number]
  },
  computed: {
    uploadTip() {
      if (!this.accept || this.accept === "*") return "可以上传所有类型文件";
      let accept = this.accept.toLowerCase();
      return `只能上传${accept.split(",").join("/")}文件`;
    },
    uploadAccept() {
      if (!this.accept) return CONTENT_TYPE["*"];
      let uploadAccept = [];
      let accept = this.accept.toLowerCase();
      for (const acceptKey of accept.split(",")) {
        if (CONTENT_TYPE[acceptKey]) {
          uploadAccept.push(CONTENT_TYPE[acceptKey]);
        }
      }
      if (uploadAccept.length === 0) {
        uploadAccept.push(CONTENT_TYPE["*"]);
      }
      return uploadAccept.join(",");
    }
  },
  data() {
    return {
      fileList: [],
      currentValue: this.value
    };
  },
  watch: {
    value(value) {
      if (this.currentValue === value) return;
      this.handleFileList(value);
    }
  },
  mounted() {
    this.handleFileList(this.value);
  },
  methods: {
    handleFileList(value) {
      let fileValues = [];
      if (typeof value === "string" && value !== "") {
        fileValues = JSON.parse(value);
      }
      for (const file of fileValues) {
        this.fileList.push({
          name: file.msg,
          url: file.url,
          status: "finished",
          response: file
        });
      }
      this.currentValue = value;
    },
    handleRemove(file, fileList) {
      let fileValues = [];
      for (const _file of fileList) {
        fileValues.push(_file.response);
      }
      if (fileValues.length === 0) {
        this.currentValue = undefined;
      } else {
        this.currentValue = JSON.stringify(fileValues);
      }
      this.$emit("input", this.currentValue);
      this.$emit("change", this.currentValue);
    },
    handleSuccess(response, file, fileList) {
      let fileValues = [];
      for (const _file of fileList) {
        fileValues.push(_file.response);
      }
      if (fileValues.length === 0) {
        this.currentValue = undefined;
      } else {
        this.currentValue = JSON.stringify(fileValues);
      }
      this.$emit("input", this.currentValue);
      this.$emit("change", this.currentValue);
    },
    handlePictureCardPreview(file) {
      const renderMessage = (h, { url, name }) => {
        return <img width="100%" src={url} alt={name} />;
      };
      this.$aui.msgbox.show({
        message: renderMessage(this.$createElement, file),
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: "关闭"
      });
    },
    beforeUpload(file) {
      const isLt500kb =  file.size / 1024  <  500  ;
      if (!isLt500kb) {
          this.$aui.message.show({
            message: '上传头像图片大小不能超过 500kb!',
            type: 'error'
          });
        }
        return isLt500kb;
    }
  }
};
</script>
