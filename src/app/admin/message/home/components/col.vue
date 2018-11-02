<template>
  <div :class='{half: isHalf, full: isFull, inline: isinline}' style='{"min-width": "370px"}'>
    <slot></slot>
    <!-- <div v-if='isHalf || isFull' class='clear'></div> -->
  </div>
</template>
<script>
export default {
  props: {
    status: {
      type: String,
      default: 'full',
    }
  },
  computed: {
    isHalf() {
      return this.status === 'half'
    },
    isFull() {
      return this.status === 'full'
    },
    isinline() {
      return this.status === 'inline'
    }
  }
}
</script>
<style lang="scss" scoped>
  .half {
    float: left;
    width: 50%;
  }
  .full {
    float: left;
    width: 100%;
    min-width: 100%;
  }
  .inline{
    display: inline-block;
    vertical-align: middle;
    text-align: center;        

  }
  // .clear {
  //   clear: both;
  // }
</style>

