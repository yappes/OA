<template>
  <div class="pui-editPage">
    <pui-layout>
      <pui-nav-top slot="nav"></pui-nav-top>
      <pui-btns-top slot="topBar"></pui-btns-top>
      <div slot="main">
        <div class="pui-editPage__header-wrapper">
          <div class="pui-editPage__title"><i class="aui-icon-upload"></i>{{editTitle}}
          </div>
        </div>
        <pui-batch-import></pui-batch-import>
      </div>
    </pui-layout>
  </div>
</template>

<script>
export default {
  name: 'editPage',
  data: function () {
    return {
      editTitle: '数据批量导入'
    }
  },
  components: {
  }
}

</script>
<style lang='scss'>
@import '~theme/common/var';
@import "~theme/mixins/utils";

.pui-editPage__header-wrapper {
  @include utils-clearfix;
}

.pui-editPage__title {
  float: left;
  font-size: $--font-size-largest;
  color: $--color-primary;
  font-weight: $--font-weight-primary;

  .aui-icon-upload {
    font-size: inherit;
    font-weight: inherit;
    margin-right: 7px;
  }
}

</style>
