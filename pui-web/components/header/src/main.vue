<template>
  <header class="pui-header" :style="{ height }">
    <slot></slot>
  </header>
</template>

<script>
  export default {
    name: 'PuiHeader',

    componentName: 'PuiHeader',

    props: {
      height: {
        type: String,
        default: '48px'
      }
    }
  };
</script>
<style lang="scss">
@import './header.scss';
</style>