<template>
  <aui-upload 
    :headers="headers"
    :action="fileAction" 
    :multiple="multiple" 
    :accept="uploadAccept" 
    :on-success="handleSuccess" 
    :on-remove="handleRemove" 
    :on-error='handelError'
    :file-list="fileList">
    <aui-button size="small" type="primary">点击上传</aui-button>
    <div slot="tip" class="aui-upload__tip">{{uploadTip}}</div>
  </aui-upload>
</template>
<script>
import { CONTENT_TYPE } from "paas-web-utils/rules/enum";
import { HTTP_CONFIG } from "paas-web-utils/common/http.js";
export default {
  name: "upload",
  props: {
    value: String,
    //支持的文件类型，用,隔开的string
    accept: String,
    multiple: Boolean,
    //文件中心路径后缀
    action: String,
  },
  computed: {
    //类型提示
    uploadTip() {
      if (!this.accept || this.accept === "*") {
        return "可以上传所有类型文件";
      }
      let accept = this.accept.toLowerCase();
      return `只能上传${accept.split(",").join("/")}文件`;
    },
    //解析后的文件类型
    uploadAccept() {
      if (!this.accept) {
        return CONTENT_TYPE["*"];
      }
      let uploadAccept = [];
      let accept = this.accept.toLowerCase();
      for (const acceptKey of accept.split(",")) {
        if(CONTENT_TYPE[acceptKey]){
          uploadAccept.push(CONTENT_TYPE[acceptKey]);
        }
      }
      // console.log('uploadAccept', accept, CONTENT_TYPE)
      if(uploadAccept.length === 0){
        uploadAccept.push(CONTENT_TYPE["*"]);
      }
      return uploadAccept.join(",");
    },
    //为请求头添加token
    headers(){
      let headers = {}
      let jsonStr = window.sessionStorage.getItem('paas:cloud:platform:toekn')
      if (Boolean(jsonStr)) {
        let authToken = JSON.parse(jsonStr)
        headers['Authorization'] = `${authToken.token_type} ${authToken.access_token}`
      } 
      return headers
    },
    //文件中心路径
    fileAction() {
      return HTTP_CONFIG.mapping.file + this.action
      // return HTTP_CONFIG.mapping.file + "saveFile/AOS/file"
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
    //整理文件中心url,去掉开始的 HTTP_CONFIG.mapping.file
    formatUrl(url) {
      let subStr = HTTP_CONFIG.mapping.file
      let length = subStr.length
      let index = url.indexOf(subStr)
      if(index > -1) {
        return url.slice(length)
      }
      return url
    },
    handleFileList(value) {
      let fileValues = [];
      if (typeof value === "string" && value !== "") {
        fileValues = JSON.parse(value) || [];
        fileValues.forEach(file => {
          file.url = this.formatUrl(file.url)
        })
      }
      for (const file of fileValues) {
        this.fileList.push({
          name: file.msg,
          url: this.formatUrl(file.url),
          status: "finished",
          response: file
        });
      }
      this.currentValue = JSON.stringify(fileValues);
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
      this.$emit('input', this.currentValue)
    },
    handleSuccess(response, file, fileList) {
      let fileValues = [];
      for (const _file of fileList) {
        if(_file.response) {
          _file.response.msg = _file.name
          fileValues.push(_file.response);
        }
      }
      if (fileValues.length === 0) {
        this.currentValue = undefined;
      } else {
        this.currentValue = JSON.stringify(fileValues);
      }
      this.$emit('input', this.currentValue)
    },
    handelError(err, file, fileList) {
      console.log(err.message)
      this.$aui.notify.show.error({
        title: '上传失败',
        message: err.message,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
