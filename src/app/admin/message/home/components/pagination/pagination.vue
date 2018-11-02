<template>
  <div class="pui-pagination" v-if='pageCount>0'>
    <button class="pui-pagination__first pg" @click="handleFirst">首页</button>
    <div class='pui-pagination__number-list'>
      <div class="pui-pagination__number btn-prev" @click="handlePrev" :class='{disable: currentPage<=1}'>
        <i class="pui-icon-left"></i>
      </div>
      <div
        class="pui-pagination__number"
        :class="{active: currentPage == page }"
        v-for="(page, index) in pagers"
        :key="index"
        @click="handleNumber(page)">
        {{page}}
      </div>
      <div class="pui-pagination__number btn-next" @click="handleNext" :class='{disable: currentPage>=pageCount}'>
        <i class="pui-icon-right"></i>
      </div>

    </div>
    <button class="pui-pagination__last pg" @click="handleLast">尾页</button>
    <div class="pui-pagination__jump">第
      <!-- <input type="number" min="1" number="true" :max="pageCount" class="pui-pagination__editor" v-model="inputPg" name="页码">页 -->
      <aui-input-number class="pui-pagination__editor" v-model="inputPg"  :min="1" :max="pageCount" controls-position="right" size='mini'></aui-input-number>
      页
      <div class="pg" @click="handleConfirmInput">确定</div>
    </div>
    <div class="pui-pagination__total-pg">共
      <span class="pui-pagination__total"> {{pageCount}} </span>页
    </div>
    <div class="pui-pagination__sizes">
      <!-- <button class="pg pui-pagination__size" :class="{ active: size == 10 }" @click="handlePageSize(10)">10条</button>
      <button class="pg pui-pagination__size" :class="{ active: size == 20 }" @click="handlePageSize(20)">20条</button>
      <button class="pg pui-pagination__size" :class="{ active: size == 30 }" @click="handlePageSize(30)">30条</button>
      <button class="pg pui-pagination__size" :class="{ active: size == 50 }" @click="handlePageSize(50)">50条</button> -->
      <aui-select v-model="value" placeholder="请选择每页显示条数" @change="handlePageSize(value)">
        <aui-option label="10条" value="10"></aui-option>
        <aui-option label="15条" value="15"></aui-option>
        <aui-option label="20条" value="20"></aui-option>
        <aui-option label="30条" value="30"></aui-option>
        <aui-option label="50条" value="50"></aui-option>
        <aui-option label="100条" value="100"></aui-option>
        <aui-option label="200条" value="200"></aui-option>
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
  props: {
    totalRecord: { // 总记录数
      default: 0
    },
    currentPage: {
      default: 0
    },
    size: {
      default: 10,
    },
  },

   data() {
    return {
        // totalRecord: 112,
        pageSize: this.size,
        pageNow: this.currentPage,
        inputPg: this.currentPage, // 当前输入页码
        pageNum: 5,
        value: 10
    }
  },

  watch: {
    pageNow(value) {
      // console.log('watch pageNow', value)
      if(isNaN(value)|| value < 0){
        this.pageNow = 1;
      }else if(value > this.pageCount) {
        this.pageNow = this.pageCount;
      }
      this.inputPg = value
      this.$emit('page', {
        pageNow: value,
        pageSize: this.pageSize,
        type: 'page',
      })
      // console.log('emit page Now', value)
    },
    pageSize(value) {
      this.$emit('page', {
        pageNow: this.pageNow,
        pageSize: this.pageSize,
        type: 'size',
      })
    },

    currentPage(value) {
      this.pageNow = value
      this.inputPg = value
    },

    size(value) {
      this.pageSize = value
    }
    
  },

  computed: {
    // 总页数
    pageCount() {
      if (typeof this.totalRecord === 'number') {
        return Math.ceil(this.totalRecord / this.size);
      }
      return null;
    },

    // 页码数组 只显示最多pageNum个页码数组，其余的省略
    pagers() {
      let pageNum = this.pageNum
      let half = Math.floor(pageNum / 2)
      let pageCount = Number(this.pageCount);
      // let pageNow = Number(this.pageNow)
      let pageNow = Number(this.currentPage)
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
  },
 
  methods: {
    // 点击数字
    handleNumber(page) {
      // console.log('click', page, typeof page)
      this.pageNow = page;
    },

    // 上一页
    handlePrev() {
      if(this.pageNow > 1) {
        this.pageNow--;
      } else {
        return false;
      }
    },

    // 下一页
    handleNext() {
      if(this.pageNow < this.pageCount) {
        this.pageNow++;
      } else {
        return false;
      }
    },

    // 首页
    handleFirst() {
      if(this.pageNow <= 1) {
        return 
      }
      this.pageNow = 1;
    },

    // 尾页
    handleLast() {
      if(this.pageNow >= this.pageCount) {
        return 
      }
      this.pageNow = this.pageCount;
    },

    // 确定查询输入的页码
    handleConfirmInput() {
      this.pageNow = this.inputPg;
    },

    // 选择每页条数
    handlePageSize(size) {
      this.pageSize = size;
    },
  }
}

</script>
<style lang="scss" scoped>
@import "./pagination.scss";
</style>
