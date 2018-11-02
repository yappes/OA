<template>
  <div class="pui-login">
    <div class="pui-login__bg"></div>
    <div class="pui-login__form-wrapper">
      <div class="headerImg"></div>
      <div class="pui-login__form">
        <aui-input class="pui-login__form-item" placeholder="请输入企业编码" clearable suffix-icon="el-icon-date"> <i slot="suffix" class="pui-icon-yonghuming"></i></aui-input>
        <aui-input class="pui-login__form-item" placeholder="账户" clearable> <i slot="suffix" class="pui-icon-yonghuming"></i></aui-input>
        <aui-input class="pui-login__form-item" placeholder="密码" clearable> <i slot="suffix" class="pui-icon-mima"></i></aui-input>
        <div class="pui-login__error">您输入的账号或密码错误，请重新输入。</div>
        <pui-btn style="width:100%;" :borderRadius=borderRadius :heightStr="heightStr" type="primary">登录</pui-btn>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'puiLogin',
  data: function () {
    return {
      heightStr: '40px',
      borderRadius: '4px'
    }
  },
  components: {

  }
}

</script>
<style lang='scss' scoped>
@import "~theme/mixins/mixins";
@import "~theme/mixins/utils";
@import "~theme/common/var";

@include b(login) {
  width: 100%;
  background-color: $--color-white;

  @include utils-clearfix;

  @include e(bg) {
    float: left;
    width: 60%;
    height: 768px;
    background-size: cover;
    /*background-image: url('../../assets/timg.jpeg');*/
  }

  @include e(form-wrapper) {
    width: 40%;
    float: right;
  }

  @include e(form) {
    width: 340px;
    margin: 150px auto 0 auto;
  }

  @include e(form-item) {
    margin-bottom: 10px;
  }

  @include e(error) {
    color: $--font-color-error;
    font-size: $--font-size-smallest;
    margin-bottom: 10px;
  }
}

</style>
