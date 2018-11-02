<template>
  <div class="pui-infoCenterPage">
    <pui-container>
      <pui-header>
        <pui-nav-top></pui-nav-top>
      </pui-header>
      <pui-container>
        <pui-aside width="240px">
          <pui-nav-left :navLeftTitle="navLeftTitle" :navLeftList="navLeftList"></pui-nav-left>
        </pui-aside>
        <pui-main-right :headerTitle="headerTitle" :headerMenu="headerMenu">
          <div class="pui-infoCenterPage__lists" slot="right-content">
            <div class="pui-infoCenterPage__lists-top" >
              <div class="pui-infoCenterPage__operations-wrapper">
                <pui-btn :heightStr="heightStr" :padding="paddingStr" :plain="true"  v-for="oper in operations" :key="oper.id" class="pui-infoCenterPage__oper">{{oper.name}}</pui-btn> 
              </div>
              <span class="pui-infoCenterPage__messages-number">消息{{messageCount}}条</span>
            </div>
            <div class="pui-infoCenterPage__table-wrapper">
              <aui-table ref="multipleTable" :data="messageList" tooltip-effect="dark" style="width: 100%">
                <aui-table-column type="selection" width="100">
                </aui-table-column>
                <aui-table-column prop="title" label="标题内容" width="600" show-overflow-tooltip></aui-table-column>
                <aui-table-column prop="type" label="消息类型" width="150">
                </aui-table-column>
                <aui-table-column prop="createTime" label="创建时间" ></aui-table-column>
              </aui-table>
            </div>
            <pui-pagination style="margin-top:30px;"></pui-pagination>
          </div>
        </pui-main-right >
      </pui-container>
    </pui-container>
  </div>
</template>

<script>
import data from "./infoCenterPage.js";
export default {
  name: "infoCenterPage",
  data: data,
  components: {}
};
</script>

<style lang='scss' scoped>
@import "~theme/common/var";
@import "~theme/mixins/utils";

.pui-infoCenterPage__lists-top {
  @include utils-clearfix;
  height: 34px;
  line-height: 34px;
  margin: 13px 28px 23px 20px;
  font-size: $--font-size-base;
  color: #31394a;
  & > .pui-infoCenterPage__operations-wrapper {
    float: left;
    & > .pui-infoCenterPage__oper {
      margin-right: 10px;
      cursor: pointer;
    }
  }
  & > .pui-infoCenterPage__messages-number {
    float: right;
  }
}
.pui-infoCenterPage__table-wrapper{
  margin-top: 10px;
  position: relative;
}

</style>
