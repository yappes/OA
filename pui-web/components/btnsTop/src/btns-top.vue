<template>
  <div class="pui-btns-top" :class="{'is-fixed':isScrolling}" v-if="back || buttons.length != 0">
    <pui-btn :heightStr="heightStr" :padding="paddingStr" type="primary" :icon="'fanhui'" v-if="back" @click="goBack">返回</pui-btn>
    <pui-btn v-for="btn in buttonGroups.groups" :key="btn.$id" :heightStr="heightStr" :padding="paddingStr" v-show="!btn.hidden" :loading="btn.loadingStatus" :plain="true" @click="handleButtonClick(btn)">
      {{btn.lable}}
    </pui-btn>
    <aui-dropdown v-if="buttonGroups.more.length > 0" @command="(oper) => handleButtonClick(oper)" :style="{'line-height': heightStr, 'height': heightStr, 'padding': paddingStr}">
      <pui-btn padding="0 10px 0 20px" :plain="true">
        更多按钮
        <i class="aui-icon-arrow-down aui-icon--right"></i>
      </pui-btn>
      <aui-dropdown-menu slot="dropdown">
        <aui-dropdown-item v-for="oper in buttonGroups.more" :key="oper.$id" :command="oper">{{oper.lable}}</aui-dropdown-item>
      </aui-dropdown-menu>
    </aui-dropdown>
  </div>
</template>

<script>
export default {
  name: "PuiBtnsTop",

  data: function() {
    return {
      heightStr: "34px",
      paddingStr: "0 20px",
      isScrolling: false,
      buttons: []
    };
  },

  props: {
    operations: {
      type: Array,
      default: () => {
        return [];
      }
    },
    back: {
      type: Boolean,
      default: false
    },
    isWatchScroll: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    buttonGroups() {
      let buttonGroups = {
        groups: [],
        more: []
      };
      let buttons = [];
      for (const iterator of this.buttons) {
        if (!iterator.hidden) buttons.push(iterator);
      }
      buttonGroups.groups = buttons.splice(0, 6);
      buttonGroups.more = buttons.splice(0, buttons.length);
      return buttonGroups;
    }
  },

  mounted() {
    this.$set(this, "buttons", this.operations);
    this.isWatchScroll && this.watchScroll();
  },

  methods: {
    goBack: function() {
      this.$router.go(-1);
    },

    onScroll: function() {
      var vm = this;
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        // console.log('scrollTop', scrollTop)
      let scrollScope = this.topBarScrollScope;
      window.requestAnimationFrame(function() {
        if (scrollTop > scrollScope) {
          console.log('true', scrollScope, scrollTop)
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

    // 按钮点击事件
    handleButtonClick(button) {
      this.$emit("button-click", button);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./btnsTop.scss";
</style>
