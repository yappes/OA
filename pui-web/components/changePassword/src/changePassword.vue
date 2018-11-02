<template>
  <div class="pui-change-password">
    <ul class="pui-form-layout">
      <li class="pui-form-layout__item"><span class="value"><aui-input placeholder="请输入内容"></aui-input></span><span class="label required">旧密码</span></li>
      <li class="pui-form-layout__item"><span class="value"><aui-input placeholder="请输入内容"></aui-input></span><span class="label required">新密码</span></li>
      <li class="pui-form-layout__item"><span class="value"><aui-input placeholder="请输入内容"></aui-input></span><span class="label required">确认密码</span></li>
    </ul>
    <pui-btn class="save" :heightStr="'34px'" :widthStr="'120px'" type="primary">保存</pui-btn>
  </div>
</template>
<script>
// import puiBtn from '@/components/btn/btn'

export default {
  name: 'PuiChangePassword',
  // components: {
  //   puiBtn
  // },
  data: function () {
    return {
      value: ''
    }
  }
}

</script>
<style lang='scss'>
@import './changePassword.scss'

</style>
