<template>
  <div class="pui-btns-top" :class="{'is-fixed':isScrolling}">
    <pui-btn :heightStr="heightStr" :padding="paddingStr" type="primary" :icon="'fanhui'"  @click="back">返回</pui-btn>       
    <pui-btn :heightStr="heightStr" :padding="paddingStr" :plain="true" @click="submitForm">保存</pui-btn>
    <!-- <pui-btn :heightStr="heightStr" :padding="paddingStr" :plain="true" @click="addStep">添加步骤</pui-btn> -->
  </div>
</template>
<script>
export default {
  props: {
    isWatchScroll: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      heightStr: "34px",
      paddingStr: "0 20px",
      isScrolling: false,
    };
  },

  methods: {
    back() {
      this.$router.go(-1);
    },
    submitForm() {
      this.$emit('submit')
    },
    addStep() {
      this.$emit('add-step')
    },
    onScroll: function() {
      var vm = this;
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      let scrollScope = this.topBarScrollScope;
      window.requestAnimationFrame(function() {
        if (scrollTop > scrollScope) {
          vm.isScrolling = true;
        } else {
          vm.isScrolling = false;
        }
      });
    },

    getElementTop: function(element) {
      var actualTop = element.offsetTop;
      var current = element.offsetParent;
      while (current && current !== null) {
        actualTop += current.offsetTop;
        current = current.offsetParent;
      }
      return actualTop;
    },

    watchScroll: function() {
      let btnGroupEle = this.$el;
      const scrollScope = this.getElementTop(btnGroupEle);
      this.topBarScrollScope = scrollScope;
      this.$nextTick(function() {
        window.addEventListener("scroll", this.onScroll);
      });
    },
  },
  mounted() {
    this.isWatchScroll && this.watchScroll();
  }


}
</script>
<style lang="scss" scoped>
  @import "~theme/mixins/mixins";
  $--btnsTop-height:50px;
  @include b(btns-top) {
    width: 100%;
    box-sizing: border-box;
    height: $--btnsTop-height;
    line-height: $--btnsTop-height;
    background-color: $--color-white;
    padding: 0 2%;
    font-size: $--font-size-base;
    border-bottom:solid 1px #f1f1f1;
    &>* {
      vertical-align: middle !important;
    }
    @include when(fixed) {
      position: fixed;
      top: 0;
      z-index: 4;
    }
  }
</style>


