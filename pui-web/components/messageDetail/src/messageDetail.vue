<template>
<div class="pui-message-detail">
  <div class="pui-message-detail__top">
    <pui-btn :heightStr="heightStr" :padding="paddingStr" :plain="true">返回消息列表</pui-btn>
  </div>
  <div class="pui-message-detail__group">
    <div class="pui-message-detail__up">
      <p class="pui-message-detail__title">{{messageDetail[0].title}}</p>
      <p class="pui-message-detail__time">{{messageDetail[0].createTime}}</p>
    </div> 
    <div class="pui-message-detail__down">
      <div class="pui-message-detail__content">{{messageDetail[0].content}}</div>
    </div>
  </div> 
</div>
</template>

<script>
import data from "./data.ts";

export default {
  name:"PuiMessageDetail",
  data:data
}
</script>

<style lang="scss">
  @import "./messageDetail.scss";
</style>

