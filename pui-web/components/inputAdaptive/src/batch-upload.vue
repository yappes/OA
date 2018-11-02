<template>
  <div>
    <aui-button size="medium" @click="uploadDialogVisible = true">
      <slot></slot>
    </aui-button>
    <aui-dialog :close-on-click-modal="false" :title="title" :visible.sync="uploadDialogVisible" append-to-body>
      <component :is="uploadType" 
        :headers="headers"
        :action="datasource.action" 
        :accept="datasource.accept" 
        :multiple="datasource.multiple"
        :value="value"
        @input="inputEmit"></component>
    </aui-dialog>
  </div>
</template>

<script>
import FileUpload from "./file-upload";
import ImageUpload from "./image-upload";
export default {
  name: "BatchUpload",
  components: { FileUpload, ImageUpload },
  props: {
    datasource: {},
    value: {},
    type: {
      tyep: String,
      default: "file"
    },
    title: {
      tyep: String,
      default: "文件上传"
    }
  },
  computed: {
    uploadType() {
      if (this.type === "image") {
        return "ImageUpload";
      } else {
        return "FileUpload";
      }
    },
    headers(){
      let headers = {}
      let jsonStr = window.sessionStorage.getItem('paas:cloud:platform:toekn')
      if (Boolean(jsonStr)) {
        let authToken = JSON.parse(jsonStr)
        headers['Authorization'] = `${authToken.token_type} ${authToken.access_token}`
      } 
      return headers
    }
  },
  data() {
    return {
      uploadDialogVisible: false
    };
  },
  methods:{
    inputEmit(value){
      this.$emit('input', value);
    }
  }
};
</script>
