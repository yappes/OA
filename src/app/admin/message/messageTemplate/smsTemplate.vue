<template>
  <div class="pui-message-template">
    <div style="margin:-13px -20px">
      <div class="prompt" style="">{{prompt}}</div>
      <div class="pui-home-page-setting__middle"></div>
      <div class="pui-home-page-setting__main">
        <div class="pui-home-page-setting__operations">
          <pui-btn @click="handleAdd" :heightStr="heightStr" :widthStr="widthStr" class="pui-list-grid__oper">创建</pui-btn>
        </div>
        <div class="pui-list-grid__table-wrapper">
          <aui-table empty-text="暂无数据" @row-click="showDetail" :data="tableData" tooltip-effect="dark" stripe style="width: 100%" @selection-change="handleSelectionChange">
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
            <aui-table-column prop="id" label="模板ID"   show-overflow-tooltip></aui-table-column>
            <aui-table-column prop="sign" label="短信签名"  show-overflow-tooltip></aui-table-column>
            <aui-table-column label="短信类型"  show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.type == 'NOTIFY'">通知类</span>
                <span v-if="scope.row.type == 'CODE'">验证码</span>
              </template>
            </aui-table-column>
            <aui-table-column label="审核状态" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.checkStatus == 'CHECKING'">审核中</span>
                <span v-if="scope.row.checkStatus == 'SUCCESS'">审核通过</span>
                <span v-if="scope.row.checkStatus == 'FAIL'">审核失败</span>
              </template>
            </aui-table-column>
            <aui-table-column prop="reason" label="审核未通过原因"   show-overflow-tooltip></aui-table-column>
             <aui-table-column prop="content" label="内容"  show-overflow-tooltip></aui-table-column>
            <aui-table-column prop="createTime"  label="创建时间" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.createTime | timestampStringify}}
              </template>
            </aui-table-column>
          </aui-table>
        </div>
        <pui-pagination ref="pagination" style="margin:30px 0;" :datasource="{ 'currentPage': query.currentPage, 'pageSize': query.pageSize}" :totalRecord="totalRecord" v-show="totalRecord !== 0" @changeCurrentPage="changeCurrentPage" @changePageSize="changePageSize">
        </pui-pagination>
      </div>
      <create-sms :isShow="isShow" :type="type" :editForm="editForm" @refreshData="getAllTableData" @dialogStatus="switchDialog"></create-sms>
    </div>

  </div>
</template>

<script>
import { dashboardService } from "paas-web-utils/services";
import createSms from "../createTemplate/createSms.vue"
// import messageService from "../service/messageService.js";
import messageService from "../service/message-service.js";
export default {
  name: "messageTemplate",
  components:{
    createSms
  },
  data() {
    return {
      prompt:"因运营商要求，短信内容需审核。模板审核通过后，可以通过API调用的形式发送。",
      isShow:false,
      dialogMessage: false,
      heightStr: "35px",
      widthStr: "60px",
      searchTitle: "",
      status: null,
      totalRecord: 0,
      query: {
        currentPage: 1,
        pageSize: 10
      },
      tableData: [],
      type:"",
      editForm:{},
    };
  },
  created() {
    this.$store.dispatch("adminNav/changeHeaderTitle", "短信模板");
    this.initView();
  },
  mounted(){
    this.getAllTableData();
  },
  methods: {
    getAllTableData(){
      messageService.getAllSmsTemp({
        pageNow:this.query.currentPage,
        pageSize:this.query.pageSize,
      }).then(data=>{
        this.totalRecord=data.totalRecord;
        this.tableData=data.record;
        console.log('data',data)
      })
    },
    showDetail(row) {},
    //获取列表数据
    initView() {},
    //查询
    handleSearch() {},
    //重置搜索条件
    clearSearch() {},
    //启用
    handleUse() {},
    //禁用
    handleBan() {},
    //创建
    handleAdd() {
      this.isShow=true;
      this.type="add"
    },
    handleSelectionChange(value) {},
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
          messageService.delSmsTemplate({
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
    switchDialog(){
      this.isShow=false;
    }
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
.prompt{
    font-size: 12px;
    padding: 13px 19px;
    color:#26B7AE;
    background-color: #e5f6ff;
    border: 1px solid #bce8f1;
}
.margin-box{
  height: 15px;
  background: #f5f5f5
}
</style>

