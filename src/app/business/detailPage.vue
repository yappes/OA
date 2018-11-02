<template>
  <div class="pui-detailPage">
    <pui-layout>
      <pui-nav-top slot="nav"></pui-nav-top>
      <pui-btns-top slot="topBar" ref="btnsTop" :operations="view.operations" @button-click="buttonClick" is-watch-scroll back></pui-btns-top>
      <div slot="main">
        <div class="pui-detailPage__header-wrapper">
          <div class="pui-detailPage__title"><i class="pui-icon-xiangqing1"></i>{{view.title}}
          </div>
        </div>
        <template v-for="group in showGroups" >
          <pui-catalog-module :is-detail="true" :key="group.id" :model="group"></pui-catalog-module>
        </template>
      </div>
      <pui-catalog-scroller slot="side" :scrollData="scrollData" @select="selectHandle"></pui-catalog-scroller>
    </pui-layout>
  </div>
</template>
<script>
export default {
  name: "detailPage",
  props: {
    view: Object
  },
  data() {
    return {
      scrollData: {
        selectIndex: 0, //当前目录索引
        tabList: [], //目录列表
        off: true, //是否滚动
        topHeight: 0, //距离顶部的高度
      }
    }
  },
  watch: {
    showGroups(){
      this.$set(this.scrollData, "tabList", this.showGroups);
    }
  },
  computed: {
    //筛选出hidden为true的groups，自定义页面会修改group的hidden
    //过滤掉隐藏的group，防止污染scroller的index
    showGroups() {
      let r = this.view.groups.filter(group => {
        return !group.hidden
      })
      return r
    }
  },
  mounted() {
    // 将数据使用getter和setter方法设置到上下文中
    this.$set(this.scrollData, "tabList", this.showGroups);

    // 挂载滚动事件
    this.$nextTick(() => {
      this.$set(this.scrollData, "topHeight", this.$refs.btnsTop.$el.offsetHeight);
      window.addEventListener('scroll', this.onScroll);
    })
  },
  methods: {
    buttonClick(button){
      button.triggerClick(this, this.view.renderData.record);
    },
    onScroll() {
      if(this.scrollData.off) {
        // 滚动条距顶部距离
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        let offsetEle = document.querySelectorAll('.pui-catalog-module');

        for(let i = 0; i < offsetEle.length; i++) {
          // 元素距顶部的距离
          let index = i;
          let offsetH = offsetEle[index].offsetTop + this.scrollData.topHeight;
          if(scrollTop >= offsetH) {
            this.scrollData.selectIndex = index;
          }
        }

        // 判断滚动条到底部
        let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
        if(this.$el.scrollHeight - scrollTop == clientHeight) {
          this.scrollData.selectIndex = offsetEle.length - 1;
        }
      } else {
        return false;
      }
    },
    selectHandle(index, event){
      this.scrollData.off = false;
      this.scrollData.selectIndex = index;
      // 滚动条距顶部距离
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      //当前元素距顶部距离
      let offsetEle = document.querySelectorAll('.pui-catalog-module');
      let eleTop = offsetEle[index].offsetTop + this.scrollData.topHeight;

      // 平滑滚动
      let speed = eleTop / 50;
      if(eleTop > scrollTop) {
        smoothDown();
      } else {
        let newTotal = scrollTop - eleTop;
        speed = newTotal / 50;
        smoothUp();
      }
      this.scrollData.off = true;     

      function smoothDown() {
        if(scrollTop < eleTop) {
          scrollTop += speed;
          document.body.scrollTop = scrollTop;
          document.documentElement.scrollTop = scrollTop;
          setTimeout(smoothDown, 10);
        } else {
          document.body.scrollTop = eleTop;
          document.documentElement.scrollTop = eleTop;
        }
      }
      
      function smoothUp() {
        if(scrollTop > eleTop) {
          scrollTop -= speed;
          document.body.scrollTop = scrollTop;
          document.documentElement.scrollTop = scrollTop;
          setTimeout(smoothUp, 10);
        } else {
          document.body.scrollTop = eleTop;
          document.documentElement.scrollTop = eleTop;
        }
      }
    }
  }
};
</script>
<style lang='scss'>
@import "~theme/common/var";
@import "~theme/mixins/utils";

.pui-detailPage__header-wrapper {
  @include utils-clearfix;
}

.pui-detailPage__title {
  float: left;
  font-size: $--font-size-largest;
  color: $--color-primary;
  font-weight: $--font-weight-primary;

  .pui-icon-xiangqing1 {
    font-size: inherit;
    font-weight: inherit;
    margin-right: 7px;
  }
}
</style>
