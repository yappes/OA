<template>
  <div class="pui-listPage">
    <pui-layout>
      <pui-nav-top slot="nav"></pui-nav-top>
      <pui-breadcrumb slot="topBar"></pui-breadcrumb>
      <div class="change-password-wrapper" slot="full">
        <div class="title pui-icon-mima1">修改密码</div>
        <pui-change-password></pui-change-password>
      </div>
    </pui-layout>
  </div>
</template>
<script>
export default {
  name: 'changePasswordPage',
  components: {
  }
}

</script>
<style lang='scss' scoped>
@import "~theme/common/var";

.pass-listPage {
  width: 100%;
}

.title {
  margin-top: 20px;
  padding-left: 25px;
  font-size: $--font-size-large;

  &::before {
    color: #59aad9;
    margin-right: 8px;
  }
}

.change-password-wrapper {
  background-color: $--color-white;
}

</style>
