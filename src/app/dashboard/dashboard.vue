<template>
  <div class="pui-dashboard" :style="{ height: contentHeight }">
    <pui-container>
      <pui-header>
        <pui-nav-top></pui-nav-top>
      </pui-header>
      <pui-main>
        <router-view></router-view>
      </pui-main>
    </pui-container>
  </div>
</template>

<script>
export default {
  name: "PuiDashBoard",

  data() {
    return {
      contentHeight: ''
    }
  },

  created() {
    this.setContentHeight();
  },

  methods: {
    setContentHeight() {
      this.contentHeight = window.innerHeight + "px";
    }
  }
}
</script>

<style lang="scss" scoped>
@import './dashboard.scss'; 
</style>
  
  