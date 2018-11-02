export default {
  created() {
    this.$aui.loading.show({
      lock: true,
      // text: "页面加载中",
      // spinner: "aui-icon-loading",
      // background: "rgba(0, 0, 0, 0.7)"
    });
  },
  beforeDestroy() {
    this.$aui.loading.hide();
  },
  render(h) {
    return <div />;
  }
};
