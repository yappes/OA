<template>
  <div class="pui-avatar">
    <img class="pui-avatar__img" src="../../../assets/head.png" alt="">
    <div class="pui-avatar__right">
      <pui-btn :heightStr="'34px'" :padding="'0 10px'" :borderRadius="'5px'" type="primary"><i class="pui-icon-jiantou-copy"></i>本地上传</pui-btn>
      <div class="tip">120x120像素
        <br>请上传小于5M的JPG、GIF或PNG文件；该头像会对外显示，请您注意不要上传私密头像。</div>
    </div>
  </div>
</template>
<script>
// import puiBtn from '@/components/btn/btn'

export default {
  name: 'PuiAvatar',
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
@import './avatar.scss'

</style>
