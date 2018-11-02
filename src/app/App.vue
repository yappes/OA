<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      view: {}
    };
  },
  mounted() {
    //全局获得顶部消息框的消息
    this.$store.dispatch('messageTop/findMessages')
  }
};
</script>
<style>
@import "normalize.css";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
