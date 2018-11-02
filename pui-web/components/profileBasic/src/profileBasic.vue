<template>
  <div class="pui-profile">
    <div class="pui-profile__basic-wrapper">
      <div class="title pui-icon-xinxi1">基本信息</div>
      <pui-form-layout :columns="feilds">
      </pui-form-layout>
      <pui-btn class="save" :heightStr="'34px'" :widthStr="'120px'" type="primary">保存</pui-btn>
    </div>
  </div>
</template>
<script>
import renderData from './data.ts'
export default {
  name: 'PuiProfileBasic',
  data: function () {
    return Object.assign({}, renderData, {
      //此处添加其他数据
    })
  }
}

</script>
<style lang='scss'>
@import './profileBasic.scss';
</style>
