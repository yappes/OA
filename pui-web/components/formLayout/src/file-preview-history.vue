<template>
  <div style='display:inline-block !important'>
    <!-- <template v-for='(file, index) in fileList'> -->
      <file-preview v-if='fileList[0]!=="null"' :files='fileList[0]' :style="{width:fileList[1]?'45%':'100%','display':'inline-block'}"></file-preview>
      <span v-else class="showValue pui-form-layout__detail" style="width:100%;word-wrap:break-word" :style="{width:fileList[1]?'45%':'100%','display':'inline-block'}">null</span>
      <span v-if='fileList[1]' :style="{width:'10%','display':'inline-block'}">=></span>
      <file-preview v-if='fileList[1]&&fileList[1]!=="null"' :files='fileList[1]' :style="{width:'45%','display':'inline-block'}"></file-preview>
      <span v-if='fileList[1]==="null"' class="showValue pui-form-layout__detail" style="width:100%;word-wrap:break-word" :style="{width:'45%','display':'inline-block'}">null</span>
    <!-- </template> -->
  </div>
</template>
<script>
import filePreview from './file-preview'
export default {
  components: {
    filePreview,
  },
  props: {
    files: String,
  },
  computed: {
    fileList() {
      if(!this.files) {
        return []
      }
      if(this.files.includes('=>')) {
        let r = this.files.split('=>')
        return r
      }
      return [this.files]
    }
  }
}
</script>
<style lang='scss'>
  @import "./formLayout.scss";
</style>


