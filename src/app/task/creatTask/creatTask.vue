<template>
  <div class="pui-editPage">
    <pui-layout>
      <pui-nav-top slot="nav"></pui-nav-top>
      <btn-top slot="topBar" ref="btnsTop" is-watch-scroll @submit='submitForm' @add-step='addStep'></btn-top>
      <div slot="main">
        <div class="pui-editPage__header-wrapper">
          <div class="pui-editPage__title">
            <i class="pui-icon-xiangqing1"></i>{{title}}
          </div>
        </div>
        <div class='content'>
          <general-info v-model='formModel.generalInfo' :scrollClass='scrollClassName' ref='generalInfoRef' 
            @clear-condition='clearCondition' @condition-column='getConditionColumn' class='content-general-info'></general-info>
          <steps ref='steps' v-model='formModel.stepList' :condition-column='conditionColumn' :scrollClass='scrollClassName' @add-step='addStep'></steps>
        </div>
      </div>
      <pui-catalog-scroller slot="side" :scrollData="scrollData" @select="selectHandle"></pui-catalog-scroller>
    </pui-layout>
  </div>
</template>
  
<script>
import btnTop from '../component/btn-top'
import steps from "../component/steps";
import generalInfo from "../component/generalInfo";
import defaultFormModel from '../data/defaultFormModel';
import method from '../data/method';
import testData from '../data/test-data';
import { taskService } from "paas-web-utils/services";
import { HTTP_CONFIG } from "paas-web-utils/common/http.js";
export default {
  name:'creatTask',
  components: {
    steps,
    generalInfo,
    btnTop,
  },
  data() {
    return {
      user: '',
      fullscreenLoading: false,
      title: '新建任务',
      taskId: undefined,
      conditionColumn: {},
      // isScrolling: false,
      scrollData: {
        selectIndex: 0, //当前目录索引
        tabList: [], //目录列表
        off: true, //是否滚动
        topHeight: 0 //距离顶部的高度
      },
      scrollClassName: 'pui-catalog-module',
      formModel: {
        generalInfo: defaultFormModel.generalInfo(),
        stepList: [{
          stepNameType: defaultFormModel.stepNameType(),
          outParams: [],
          inputParams: [],
          RPC: defaultFormModel.RPC(),
          sql: [],
          notify: defaultFormModel.notify(),
          conditionList: defaultFormModel.conditionListEmpty()
        }]
      },
    }
  },
  computed: {
    tabList() {
      // console.log(this.$refs.generalInfoRef)
      let general = {
        title: '基本信息',
        hidden: false,
      }
      let steps = this.formModel.stepList.map((step, index) => {
        return {
          title: `步骤-${index + 1}`,
          hidden: false,
        }
      })
      // return [this.formModel.generalInfo, ...this.formModel.stepList]
      return [general, ...steps]
    }
  },
  watch: {
    tabList() {
      this.$set(this.scrollData, "tabList", this.tabList);
    }
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    clearCondition() {
      this.formModel.stepList.forEach(step => {
        step.conditionList = defaultFormModel.conditionListEmpty()
        step.sql.forEach(sqlItem => {
          sqlItem.conditionList = defaultFormModel.conditionListNotEmpty()
        })
      })
    },
    getConditionColumn(data) {
      this.conditionColumn = data
    },
    save() {
      this.fullscreenLoading = true
      let res = method.formModelOut(this.formModel)
      return taskService.save(res).then(data => {
        this.fullscreenLoading = false
        this.back()
      })
    },
    update() {
      this.fullscreenLoading = true
      let res = method.formModelOut(this.formModel)
      res.id = this.taskId
      return taskService.update(res).then(data => {
        this.fullscreenLoading = false
        this.back()
      })
    },
    detail(taskId) {
      this.title = '修改任务'
      this.fullscreenLoading = true
      return taskService.findOne({
        taskId
      }).then(data => {
        this.formModel = method.formModelIn(data)
        this.fullscreenLoading = false
      })
    },
    submitForm() {
      // let formName = ['generalInfoRef', 'steps', 'condition']
      let formName = ['generalInfoRef', 'steps']
      let promises = [];
      formName.forEach(fn => {
        if(this.$refs[fn]) {
          promises.push(this.$refs[fn].validate());
        }
      })
      let result = {}
      return Promise.all(promises).then(data => {
        // console.log('promise.all', data, this.formModel)
        data.forEach(d => {
          if(d) {
            Object.assign(result, d)
          }
        })
        if(this.taskId) {
          this.update()
        } else {
          this.save()
        }
      }).catch(title => {
        let errTitle = title === false ? '' : `【${title}】`
        this.$aui.notify.show.error({
          title: '校验错误',
          message: `请确认表单${errTitle}输入正确`
        });
      })

    },
    addStep() {
      this.formModel.stepList.push({
        stepNameType: defaultFormModel.stepNameType(),
        outParams: [],
        inputParams: [],
        RPC: defaultFormModel.RPC(),
        sql: [],
        notify: defaultFormModel.notify(),
        conditionList: defaultFormModel.conditionListEmpty()
      })
    },
    // resetForm() {
    //   // let formName = this.formRef
    //   let formName = 'form_0'
    //   this.$refs[formName].resetForm();
    // }
    onScroll() {
      if (this.scrollData.off) {
        // 滚动条距顶部距离
        let scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop;
        let offsetEle = document.querySelectorAll(".pui-catalog-module");

        for (let i = 0; i < offsetEle.length; i++) {
          // 元素距顶部的距离
          let index = i;
          let offsetH = offsetEle[index].offsetTop + this.scrollData.topHeight;
          if (scrollTop >= offsetH) {
            this.scrollData.selectIndex = index;
          }
        }

        // 判断滚动条到底部
        let clientHeight =
          document.documentElement.clientHeight || document.body.clientHeight;
        if (this.$el.scrollHeight - scrollTop == clientHeight) {
          this.scrollData.selectIndex = offsetEle.length - 1;
        }
      } else {
        return false;
      }
    },
    selectHandle(index, event) {
      this.scrollData.off = false;
      this.scrollData.selectIndex = index;
      // 滚动条距顶部距离
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      //当前元素距顶部距离
      let offsetEle = document.querySelectorAll(".pui-catalog-module");
      let eleTop = offsetEle[index].offsetTop + this.scrollData.topHeight;

      // 平滑滚动
      let speed = eleTop / 50;
      if (eleTop > scrollTop) {
        smoothDown();
      } else {
        let newTotal = scrollTop - eleTop;
        speed = newTotal / 50;
        smoothUp();
      }
      this.scrollData.off = true;

      function smoothDown() {
        if (scrollTop < eleTop) {
          scrollTop += speed;
          document.body.scrollTop = scrollTop;
          document.documentElement.scrollTop = scrollTop;
          setTimeout(smoothDown, 10);
        } else {
          document.body.scrollTop = eleTop;
          document.documentElement.scrollTop = eleTop;
        }
      }

      function smoothUp() {
        if (scrollTop > eleTop) {
          scrollTop -= speed;
          document.body.scrollTop = scrollTop;
          document.documentElement.scrollTop = scrollTop;
          setTimeout(smoothUp, 10);
        } else {
          document.body.scrollTop = eleTop;
          document.documentElement.scrollTop = eleTop;
        }
      }
    }
  },
  mounted() {
    let taskId = this.$route.query.taskId
    this.taskId = taskId
    if(taskId) {
      this.detail(taskId)
    }
    // 将数据使用getter和setter方法设置到上下文中
    // console.log(this.tabList, this.$refs)
    this.$set(this.scrollData, "tabList", this.tabList);
    // 挂载滚动事件
    this.$nextTick(() => {
      this.$set(this.scrollData, "topHeight", this.$refs.btnsTop.$el.offsetHeight);
      window.addEventListener("scroll", this.onScroll);
    });
    // console.log('HTTP_CONFIG', HTTP_CONFIG)
  }
};
</script>

<style lang="scss" scoped>
  @import "pui-web/components/btnsTop/src/btnsTop.scss";
  @import "~theme/common/var";
  @import "~theme/mixins/utils";
.pui-btns-top-button {
  height: 34px;
  padding: 0 24px;
}
.pui-editPage__header-wrapper {
  @include utils-clearfix;
  .pui-editPage__title {
    float: left;
    font-size: $--font-size-largest;
    color: $--color-primary;
    font-weight: $--font-weight-primary;
    .pui-icon-xiangqing1 {
      font-size: inherit;
      font-weight: inherit;
      margin-right: 7px;
    }
  }
}
.content {
  margin-top: 15px;
  .content-general-info {
    background-color: white;
    box-sizing: border-box;
    // padding: 20px 20px 20px 0;
  }
}


</style>


