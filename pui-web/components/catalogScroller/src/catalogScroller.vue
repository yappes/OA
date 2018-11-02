<template>
  <div class="pui-catalog-scroller">
    <div class="pui-catalog-scroller__side-bar" :style="{height:this.sideBarHeight}">
      <em class="circle start"></em>
      <em class="circle end"></em>
    </div>
    <div class="pui-catalog-scroller__wrapper" ref="wrapper">
      <dl class="catalog-list" ref="catalog-list">
        <template v-for="(item, index) in scrollData.tabList">
          <dt 
          class="pui-catalog-scroller__title" 
          :class="{'is-current': scrollData.selectIndex == index}"
          :key="item.$id" v-if="!item.hidden">
            <em class="pointer"></em>
            <a href="javascript:void(0)" class="title-link" @click="selectHandle(index)">{{item.title}}</a>
          </dt>
        </template>
      </dl>
    </div>
  </div>
</template>
<script>
// import puiListGrid from '@/components/listgrid/listgrid'
export default {
  name: "PuiCatalogScroller",
  data:function(){
    return {
      sideBarHeight: ""
    }
  },
  props: {
    scrollData: Object
  },
  watch: {
    "scrollData.selectIndex": function(index) {
      this.handleElPointer(index);
    },
    "scrollData.tabList": function() {
      this.sideBarHeight = (this.scrollData.tabList.length <= 9 ? 40*this.scrollData.tabList.length+50+'px' :'370px' );
      console.log("118",this.sideBarHeight);
    }
  },
  methods: {
    selectHandle(index) {
      this.$emit("select", index);
    },
    handleElPointer(index) {
      index = index + 1;
      // tab 大于 9时才处理
      if (this.scrollData.tabList.length <= 9) return;
      let wrapperEl = this.$refs.wrapper;
      if (index <= 5) {
        wrapperEl.scrollTop = 0;
      } else if (this.scrollData.tabList.length - index >= 4) {
        wrapperEl.scrollTop = 40 * (index - 4);
      }
    }
  }
};
</script>
<style lang='scss' scoped>
@import "./catalogScroller.scss";
// 清理浮动样式
.clearfix {
  &::after {
    display: block;
    clear: both;
    content: "";
  }
}
</style>
