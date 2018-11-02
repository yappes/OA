<template>
  <span>
    <aui-button type="text" v-for="file in fileList" :key="file.hash" @click="preview(file)">{{file.msg}}</aui-button>
    <aui-dialog :close-on-click-modal="false" :title="'预览：' + previewFile.msg" :visible.sync="dialogVisible" class="file-preview" append-to-body>
      <aui-alert v-if="!isImg" title="当前附件不支持预览，请选择下载附件进行查看！" type="warning" :closable="false"></aui-alert>
      <img v-else :src="fileUrl" style="max-height: 450px"/>
      <span slot="footer" class="dialog-footer">
        <a :href="fileUrl" target="fileDownload"><aui-button type="primary" @click="dialogVisible = false">下载附件</aui-button></a>
      </span>
    </aui-dialog>
  </span>
</template>

<script>
import { HTTP_CONFIG } from "paas-web-utils/common/http.js";
export default {
  name: "FilePreview",
  props: {
    files: String
  },
  data() {
    return {
      dialogVisible: false,
      previewFile: {},
      isImg: false
    };
  },
  computed: {
    fileList() {
      if (Boolean(this.files)) {
        return JSON.parse(this.files);
      }
      return [];
    },
    fileUrl() {
      let fileUri = HTTP_CONFIG.mapping.file
      let include = this.previewFile.url && this.previewFile.url.indexOf(fileUri) > -1
      if(include) {
        return this.previewFile.url
      }
      let r = fileUri + this.previewFile.url
      return r
    }
  },
  methods: {
    preview(file) {
      this.previewFile = file;
      let fileName = (file.msg || "").toLowerCase();
      var suffix = fileName.substring(fileName.lastIndexOf("."));
      this.isImg = false;
      if (`.png,.gif,.jpeg,.jpg,.bmp,.webp`.indexOf(suffix) >= 0) {
        this.isImg = true;
      }
      this.dialogVisible = true;
    },
  },
};
</script>

<style>
.file-preview .aui-dialog__body{
  overflow:auto;
}
</style>
