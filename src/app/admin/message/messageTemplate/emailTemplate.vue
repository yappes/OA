<template>
  <div class="pui-message-template">
    <div style="margin:-13px -20px">
      <div class="pui-list-grid__top">
        <div class="pui-search">
          <label for="search1" class="pui-search__label">模板名称：</label>
          <aui-input v-model="name" size="medium" clearable id="search1" class="pui-search-input" placeholder="请输入模板名称">
          </aui-input>
        </div>
        <div class="pui-home-page-setting__operations">
          <pui-btn @click="handleSearch" :heightStr="heightStr" :widthStr="widthStr" class="pui-list-grid__oper">查询</pui-btn>
          <pui-btn @click="clearSearch" :heightStr="heightStr" :widthStr="widthStr" class="pui-list-grid__oper">重置</pui-btn>
        </div>
      </div>
      <div class="pui-home-page-setting__middle"></div>
      <div class="pui-home-page-setting__main">
        <div class="pui-home-page-setting__operations">
          <pui-btn @click="handleAdd" :heightStr="heightStr" :widthStr="widthStr" class="pui-list-grid__oper">创建</pui-btn>
        </div>
        <div class="pui-home-page-setting__operations">
          <pui-btn :heightStr="heightStr" @click="changeState('ENABLE')" :widthStr="widthStr" class="pui-list-grid__oper">启用</pui-btn>
        </div>
        <div class="pui-home-page-setting__operations">
          <pui-btn :heightStr="heightStr" @click="changeState('DISABLE')" :widthStr="widthStr" class="pui-list-grid__oper">禁用</pui-btn>
        </div>
        <div class="pui-list-grid__table-wrapper">
          <aui-table empty-text="暂无数据" :data="tableData" tooltip-effect="dark" stripe style="width: 100%" @selection-change="handleSelectionChange">
            <aui-table-column type="selection" width="55">
            </aui-table-column>
            <aui-table-column label="操作" width="55" fixed>
              <template slot-scope="scope">
                <aui-popover ref="popover1" placement="bottom-start" trigger="hover">
                  <ul>
                    <li class="pui-list-grid__oper-in-row-item" @click.stop="handleEdit(scope.row)">编辑</li>
                    <li class="pui-list-grid__oper-in-row-item" @click.stop="handleDelete(scope.row)">删除</li>
                  </ul>
                </aui-popover>
                <i class="pui-icon-fenlei" @click.stop v-popover:popover1></i>
              </template>
            </aui-table-column>
            <aui-table-column prop="name" label="模板名称" show-overflow-tooltip></aui-table-column>
            <aui-table-column prop="title" label="标题" show-overflow-tooltip></aui-table-column>
            <aui-table-column label="状态" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.state == 'ENABLE'">启用</span>
                <span v-if="scope.row.state == 'DISABLE'">禁用</span>
              </template>
            </aui-table-column>
            <aui-table-column prop="createTime" label="创建时间">
              <template slot-scope="scope">
                {{scope.row.createTime | timestampStringify}}
              </template>
            </aui-table-column>
          </aui-table>
        </div>
        <pui-pagination ref="pagination" style="margin:30px 0;" :datasource="{ 'currentPage': query.currentPage, 'pageSize': query.pageSize}" :totalRecord="totalRecord" v-show="totalRecord !== 0" @changeCurrentPage="changeCurrentPage" @changePageSize="changePageSize">
        </pui-pagination>
      </div>

    </div>
    <create-email :type="type" :editForm="editForm" @dialogStatus="dialogStatus" :isShow="isShow" @refreshData="getAllTableData">
    </create-email>
  </div>
</template>

<script>
import createEmail from "../createTemplate/createEmail.vue";
import { moduleService } from "paas-web-utils/services";
// import messageService from "../service/messageService.js";
import messageService from "../service/message-service.js";
export default {
  name: "emailTemplate",
  components: {
    createEmail
  },
  data() {
    return {
      isShow: false,
      heightStr: "35px",
      widthStr: "60px",
      name: "",
      status: null,
      totalRecord: 0,
      query: {
        currentPage: 1,
        pageSize: 10
      },
      tableData: [],
      moduleIdOptions: [],
      columnOptions: [],
      type: "",
      editForm: {},
      emailIds:undefined,
    };
  },
  created() {
    this.$store.dispatch("adminNav/changeHeaderTitle", "邮件模板");
  },
  mounted() {
    this.getAllTableData();
  },
  methods: {
    getAllTableData() {
      // 获取邮件模板列表数据
      messageService.getAllEmail({
        pageNow:this.query.currentPage,
        pageSize:this.query.pageSize,
        searchKey: this.name,
      }).then(data => {
        this.tableData = data.record;
        this.totalRecord = data.totalRecord;
      });
    },
    dialogStatus() {
      this.isShow = false;
    },
    //查询
    handleSearch() {
      messageService.getAllEmail({
        searchKey: this.name,
        pageNow:this.query.currentPage,
        pageSize:this.query.pageSize
      }).then(data => {
        this.tableData = data.record;
        this.totalRecord = data.totalRecord;
      });
    },
    //重置搜索条件
    clearSearch() {
      this.name=""
    },
    //启用/禁用
    changeState(state) {
      messageService.emailChangeState({
        state:state,
        ids:this.emailIds
      }).then(data=>{
        this.getAllTableData();
        this.$aui.message.show({
          message: "状态修改成功",
          type: "success"
        });
      })
    },

    //创建
    handleAdd() {
      this.type = "add";
      this.isShow = true;
    },
    handleSelectionChange(value) {
      this.emailIds=[];
      for(let i=0;i<value.length;i++){
        this.emailIds.push(value[i].id)
      }
      console.log(this.emailIds)
    },
    //编辑
    handleEdit(row) {
      this.type = "edit";
      this.editForm = row;
      this.isShow = true;
    },
    //删除
    handleDelete(row) {
      this.$aui.confirm
        .show("确定删除吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          messageService.delEmailTemplate({
            id:row.id
          }).then(data=>{
            this.$aui.message.show({
              message: "删除成功",
              type: "success"
            });
            this.getAllTableData();
          })
        });
    },
    //分页
    changePageSize(pageSize) {
      this.query.pageSize = pageSize;
      this.getAllTableData();
    },

    // 改变当前页码
    changeCurrentPage(currentPage) {
      this.query.currentPage = currentPage;
      this.getAllTableData();
    },
  }
};
</script>

<style lang="scss" scoped>
@import "./messageTemplate.scss";

// .pui-search {
// .pui-search-label {
// float: left;
// width: 50px;
// line-height: 36px;
// margin: 0;
// }
// .pui-search-input,
// .pui-search-select {
//   float: left;
//   width: 300px;
//   height: 36px;
//   margin-right: 40px;
// }
// }
.pui-list-grid__operations-wrapper {
  margin: 20px 0;
}
.pui-list-grid__oper-in-row-item {
  padding: 5px 10px;
  margin: 0 -12px;
  line-height: 24px;
  box-sizing: border-box;
  &:hover {
    background-color: #e5f9f7;
  }
}
</style>

