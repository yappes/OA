<template>
  <div class="pui-pagination" v-show='totalRecord!==0'>
    <button class="pui-pagination__first pg" @click="handleFirst">首页</button>
    <div class='pui-pagination__number-list'>
      <div class="pui-pagination__number btn-prev" @click="handlePrev" :class='{disable: internalCurrentPage<=1}'>
        <i class="aui-icon-arrow-left"></i>
      </div>
      <div
        class="pui-pagination__number"
        :class="{active: internalCurrentPage == page }"
        v-for="(page, index) in pagers"
        :key="index"
        @click="handleNumber(page)">
        {{page}}
      </div>
      <div class="pui-pagination__number btn-next" @click="handleNext" :class='{disable: internalCurrentPage>=pageCount}'>
        <i class="aui-icon-arrow-right"></i>
      </div>

    </div>
    <button class="pui-pagination__last pg" @click="handleLast">尾页</button>
    <div class="pui-pagination__jump">第
      <!-- <input type="number" min="1" number="true" :max="pageCount" class="pui-pagination__editor" v-model="inputPg" name="页码">页 -->
      <aui-input-number class="pui-pagination__editor" v-model="inputPg" :min="1" :max="pageCount" controls-position="right" size='mini'></aui-input-number>
      页
      <div class="pg" @click="handleConfirmInput">确定</div>
    </div>
    <div class="pui-pagination__total-pg">共
      <span class="pui-pagination__total"> {{pageCount}} </span>页
    </div>
    <div class="pui-pagination__sizes">
      <!-- <button class="pg pui-pagination__size" :class="{ active: internalPageSize == 20 }" @click="internalPageSize=20">20条</button>
      <button class="pg pui-pagination__size" :class="{ active: internalPageSize == 30 }" @click="internalPageSize=30">30条</button>
      <button class="pg pui-pagination__size" :class="{ active: internalPageSize == 50 }" @click="internalPageSize=50">50条</button> -->
      <aui-select v-model="value" placeholder="请选择每页显示条数" @change="handlePageSize(value)">
        <aui-option label="10条" :value="10"></aui-option>
        <aui-option label="15条" :value="15"></aui-option>
        <aui-option label="20条" :value="20"></aui-option>
        <aui-option label="30条" :value="30"></aui-option>
        <aui-option label="50条" :value="50"></aui-option>
        <aui-option label="100条" :value="100"></aui-option>
        <aui-option label="200条" :value="200"></aui-option>
      </aui-select>
      <span class="pui-pagination__total-wrapper">共
        <span class="pui-pagination__total">{{totalRecord}} </span>条
      </span>
    </div>
  </div>
</template>
<script>
import { business } from "paas-web-utils/services";

export default {
  name: 'PuiWorkflowPagination',

  props: {
    //总条
    totalRecord: Number,
    //当前页
    currentpage: Number,
    //每页条数
    pageSize: Number,
  },

   data() {
    return {
      // internalCurrentPage: 1, // 当前页（当前实例）
      // internalPageSize: 10, // 每页条数（当前实例）
      // inputPg: 1, // 当前输入页码
      // internalDatasource: {},
      // pageNum: 5,
      internalCurrentPage: this.currentpage || 1, // 当前页（当前实例）
      internalPageSize: this.pageSize || 10, // 每页条数（当前实例）
      inputPg: 1, // 当前输入页码
      // totalRecord: this.totalRecord, //总条
      pageNum: 5,
      value: this.pageSize || 10
    }
  },

  watch: {
    internalCurrentPage() {
      this.changeCurrentPage();
      this.inputPg = this.internalCurrentPage
    },

    internalPageSize() {
      this.changePageSize();
    },
  },

  computed: {
    // 总页数
    pageCount() {
      if (typeof this.totalRecord === 'number') {
        return Math.ceil(this.totalRecord / this.internalPageSize);
      }
      return null;
    },

    // 页码数组 只显示最多pageNum个页码数组，其余的省略
    pagers() {
      let pageNum = this.pageNum
      let half = Math.floor(pageNum / 2)
      let pageCount = Number(this.pageCount);
      let pageNow = Number(this.internalCurrentPage)
      let array = [];
      if (pageCount <= pageNum) {
        for (let i = 1; i <= pageCount; i++) {
          array.push(i)
        }
      }else {
        if(pageNow <= half ) {
          for (let i = 1; i <= pageNum; i++) {
            array.push(i)
          }
        }else if (pageNow >= pageCount - half) {
          for(let i = pageNum; i >= 1; i--){
            array.push(pageCount - (i - 1))
          }
        }else {
          for(let i = pageNum; i >= 1; i--){
            array.push(pageNow + half - i + 1)
          }
        }        
      }
      return array;
    },
  },

  mounted() {
    // console.log(this.internalCurrentPage, this.internalPageSize, this.totalRecord)
    console.log(this.totalRecord)
  },
 
  methods: {
    // 点击数字
    handleNumber(page) {
      this.internalCurrentPage = page;
    },

    // 上一页
    handlePrev() {
      if(this.internalCurrentPage > 1) {
        this.internalCurrentPage--;
      } else {
        return false;
      }
    },

    // 下一页
    handleNext() {
      if(this.internalCurrentPage < this.pageCount) {
        this.internalCurrentPage++;
      } else {
        return false;
      }
    },

    // 首页
    handleFirst() {
      if(this.internalCurrentPage <= 1) {
        return 
      }
      this.internalCurrentPage = 1;
    },

    // 尾页
    handleLast() {
      if(this.internalCurrentPage >= this.pageCount) {
        return 
      }
      this.internalCurrentPage = this.pageCount;
    },

    // 确定查询输入的页码
    handleConfirmInput() {
      if(typeof(this.inputPg)=="undefined"||(!this.inputPg)){
        this.inputPg = this.internalCurrentPage;
      }
      if(this.inputPg < 1) {
        this.inputPg = 1;
      } else if(this.inputPg > this.pageCount) {
        this.inputPg = this.pageCount;
      }
      this.internalCurrentPage = Number(this.inputPg);
    },

    // 选择每页条数
    handlePageSize(size) {
      this.internalPageSize = size;
      this.internalCurrentPage = 1;
    },

    // 页码改变自定义事件
    changeCurrentPage() {
      // this.$set(this.internalDatasource, 'currentPage', this.internalCurrentPage);
      // this.$set(this.internalDatasource, 'reload', true);
      let data = {
        pageNow: this.internalCurrentPage,
        pageSize: this.internalPageSize,
      }
      this.$emit("select-page", data)
    },

    // 每页条数改变
    changePageSize() {
      // this.$set(this.internalDatasource, 'pageSize', this.internalPageSize);
      // this.$set(this.internalDatasource, 'reload', true);
      let data = {
        pageNow: 1,
        pageSize: this.internalPageSize,
      }
      this.$emit("select-page", data)
    }
  }
}

</script>
<style lang="scss" scoped>
@import "./workflowPagenation.scss";
</style>
