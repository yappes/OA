export default {
  methods: {
    deleteMessage(callback) {
      this.$aui.confirm.show('是否继续删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        callback()
        this.$aui.message.show({
          type: 'success',
          message: '删除成功!'
        });
      }).catch((err) => {
        console.log(err)
        this.$aui.message.show({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    ableMessage(string, callback) {
      this.$aui.confirm.show(`确定${string}选中条目?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        callback()
        this.$aui.message.show({
          type: 'success',
          message: '成功!'
        });
      }).catch((err) => {
        this.$aui.message.show({
          type: 'info',
          message: '已取消'
        });          
      });
    },

  }
}