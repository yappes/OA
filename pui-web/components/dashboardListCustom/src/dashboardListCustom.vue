<template>
 <div class="pui-dashboard-list-custom">
    <aui-table :data="records" v-if="records" style="width: 100%">
      <aui-table-column
        v-for="col in cloumns"
        :key="col.id"
        :label="col.gridLabel" 
        :prop="col.gridKey">
      </aui-table-column>
    </aui-table>

    <pui-pagination
    ref="pagination" 
    style="margin: 30px 0;" 
    :datasource="{ 'currentPage': page.currentPage, 'pageSize': page.pageSize }" 
    :totalRecord="page.totalRecord" 
    v-if="page && page.totalRecord >= 0"
    @changeCurrentPage="changeCurrentPage"
    @changePageSize="changePageSize">
    </pui-pagination>
  </div>
</template>

<script>
export default {
  name: 'puiDashboardListCustom',

  props: {
    dashboardData: {
      type: Object,
      default: () => {
        return {
          dataInfo: {}
        }
      }
    }
  },

  data() {
    return {
      records: [],
      cloumns: {},
      page: {}
    }
  },

  watch: {
    'dashboardData.dataInfo': function(info) {
      if(info) {
        this.$set(this, 'records', info.records);
        this.$set(this, 'cloumns', info.cloumns);
        this.$set(this, 'page', info.page);
      }
    }
  },

  methods: {
    // 改变每页条数
    changePageSize(pageSize) {
      this.dashboardData.operation.handlePageInfo(
        this.dashboardData, 
        {
          currentPage: 1,
          pageSize: pageSize
        }
      );
    },

    // 改变当前页码
    changeCurrentPage(currentPage) {
      this.dashboardData.operation.handlePageInfo(
        this.dashboardData, 
        {
          currentPage: currentPage,
          pageSize: this.page.pageSize
        }
      );;
    }
  }
}
</script>

<style lang="scss">
@import './dashboardListCustom.scss'
</style>


