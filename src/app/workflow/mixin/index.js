export default {
  data() {
    return {
      page: {
        pageNow: 1,
        pageSize: 10,
        totalRecord: 0,
      },
    }
  },

  methods: {
    updatePage(data) {
      this.page = {
        currentPage: data.currentPage,
        pageSize: data.pageSize,
        totalRecord: data.totalRecord,
      }
    },
    pageChange(pageData) {
      this.page = {
        pageNow: pageData.pageNow,
        pageSize: pageData.pageSize,
        totalRecord: this.page.totalRecord,
      }
      let name = this.$route.name
      if(name ==='launchProcessAll') {
        this.getTableData()
      }else{
        this.getAllTableData();
      }
    }
  },
}