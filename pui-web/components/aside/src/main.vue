<template>
  <aside class="pui-aside" :style="{ width }">
    <slot></slot>
  </aside>
</template>

<script>
  export default {
    name: 'PuiAside',

    componentName: 'PuiAside',

    props: {
      width: {
        type: String,
        default: '300px'
      }
    }
  };
</script>
<style lang="scss">
@import './aside.scss';
</style>