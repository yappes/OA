<template>
  <div class="pui-col" :style="minWidthStyle" :class="{ 'is-full': full}">
    <slot></slot>
  </div> 
</template>
<script>
export default {
  name: "PuiCol",
  componentName: "PuiCol",
  computed: {
    minWidthStyle: function() {
      return "min-width:" + this.minWidth + "px";
    }
  },
  props: {
    full: {
      type: Boolean,
      default: false
    },
    minWidth: {
      type: Number,
      default: 370
    }
  }
};
</script>

<style lang="scss">
@import "./col.scss";
</style>