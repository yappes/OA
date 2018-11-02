<template>
  <div class="pui-listPage">
    <pui-layout>
      <pui-nav-top slot="nav"></pui-nav-top>
      <pui-breadcrumb slot="topBar"></pui-breadcrumb>
      <div slot="full">
        <pui-avatar></pui-avatar>
        <pui-profile-basic></pui-profile-basic>
      </div>
    </pui-layout>
  </div>
</template>
<script>
export default {
  name: 'profilePage',
  components: {
  }
}

</script>
<style lang='scss' scoped>
.pass-listPage {
  width: 100%;
}

</style>
