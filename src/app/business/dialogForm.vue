<template>
  <div class="pui-dialogform">
    <pui-layout>
      <pui-nav-top slot="nav"></pui-nav-top>
      <pui-breadcrumb slot="topBar"></pui-breadcrumb>
      <div slot="full">
        <pui-btn :heightStr="'34px'" :widthStr="'120px'" :plain="true" @click="outerVisible = true">打开表单弹窗</pui-btn>
        <aui-dialog :close-on-click-modal="false" title="外层 Dialog" show-full-icon :visible.sync="outerVisible">
          <pui-form-layout :isDetail="false" :columns="feilds"></pui-form-layout>
          <div slot="footer" class="dialog-footer">
            <aui-button @click="outerVisible = false">取 消</aui-button>
            <aui-button type="primary">打开内层 Dialog</aui-button>
          </div>
        </aui-dialog>
      </div>
    </pui-layout>
  </div>
</template>

<script>
  import data from "./dialogFormData.js";
  export default {
    name: "dialogFormPage",
    data: function() {
      return Object.assign({}, {
          outerVisible: false
        },data);
    },
    components: {}
  };
</script>

<style lang='scss' scoped>
  
</style>
