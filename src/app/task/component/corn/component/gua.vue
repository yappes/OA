<template lang="html">
  <div class="cron">
    <aui-button @click='clearModel'>clear</aui-button>
    <aui-tabs v-model="activeName">
      <aui-tab-pane label="秒" name="s">
        <table-pane v-model="model.s" lable="秒" :config='config.s'></table-pane>
      </aui-tab-pane>
      <aui-tab-pane label="分" name="m">
        <table-pane v-model="model.m" lable="分" :config='config.m'></table-pane >
      </aui-tab-pane>
      <aui-tab-pane label="时" name="h">
        <table-pane v-model="model.h" lable="时" :config='config.h'></table-pane >
      </aui-tab-pane>
      <aui-tab-pane label="日" name="d">
        <table-pane v-model="model.d" lable="日" :config='config.d'></table-pane >
      </aui-tab-pane>
      <aui-tab-pane label="月" name="month">
        <table-pane v-model="model.month" lable="月" :config='config.month'></table-pane >
      </aui-tab-pane>
      <aui-tab-pane label="周" name="week">
        <table-pane v-model="model.week" lable="周" :config='config.week'></table-pane >
      </aui-tab-pane>
      <aui-tab-pane label="年" name="year">
        <table-pane v-model="model.year" lable="年" :config='config.year'></table-pane >
      </aui-tab-pane>
    </aui-tabs>
    <!-- table -->
    <aui-table
       :data="tableModel"
       size="mini"
       border
       style="width: 100%;">
       <aui-table-column
         prop="s"
         label="秒"
         width="70">
       </aui-table-column>
       <aui-table-column
         prop="m"
         label="分"
         width="70">
       </aui-table-column>
       <aui-table-column
         prop="h"
         label="时"
         width="70">
       </aui-table-column>
       <aui-table-column
         prop="d"
         label="日"
         width="70">
       </aui-table-column>
      <aui-table-column
         prop="month"
         label="月"
         width="70">
      </aui-table-column>
      <aui-table-column
         prop="week"
         label="周"
         width="70">
      </aui-table-column>
      <aui-table-column
         prop="year"
         label="年">
       </aui-table-column>
     </aui-table>
  </div>
</template>

<script>
import tablePane from './table-pane'
export default {
  props: {
    value: {
      type: String,
    }
  },
  data () {
    return {
      model: this.getModel(),
      activeName: 's',
      config: {
        s: {
          unit: '秒',
          showRadio: ['1','2','3','4','7'],
          zhouqi: {
            min: 0,
            max: 59,
            text: [
              '从',
              '至',
              '秒',
            ],
          },
          xunhuan: {
            min: 0,
            max: 59,
            text: [
              '从',
              '秒开始，每',
              '秒执行一次',
            ],
          },
          checkBox: {
            num: 59,
            zero: true,
          },
        },
        m: {
          unit: '分',
          showRadio: ['1','2','3','4','7'],
          zhouqi: {
            min: 0,
            max: 59,
            text: [
              '从',
              '至',
              '分',
            ]
          },
          xunhuan: {
            min: 0,
            max: 59,
            text: [
              '从',
              '分开始，每',
              '分执行一次',
            ]
          },
          checkBox: {
            num: 59,
            zero: true,
          },
        },
        h: {
          unit: '时',
          showRadio: ['1','2','3','4','7'],
          zhouqi: {
            min: 0,
            max: 24,
            text: [
              '从',
              '至',
              '时',
            ]
          },
          xunhuan: {
            min: 0,
            max: 24,
            text: [
              '从',
              '时开始，每',
              '时执行一次',
            ]
          },
          checkBox: {
            num: 24,
            zero: true,
          },
        },
        d: {
          unit: '日',
          showRadio: ['1','2','3','4','5','6','7'],
          zhouqi: {
            min: 1,
            max: 31,
            text: [
              '从',
              '至',
              '日',
            ]
          },
          xunhuan: {
            min: 1,
            max: 31,
            text: [
              '从',
              '日开始，每',
              '日执行一次',
            ]
          },
          workday: {
              min: 1,
              max: 31,
              text: [
                '本月',
                '号，最近的工作日',
              ]
            },
          checkBox: {
            num: 31,
            zero: false,
          },
        },
        week: {
          unit: '周',
          showRadio: ['1','2','3','4','8','9','7'],
          zhouqi: {
            min: 1,
            max: 7,
            text: [
              '从星期',
              '至星期',
              '',
            ]
          },
          xunhuan: {
            min: 1,
            max: 7,
            text: [
              '从星期',
              '开始，每',
              '天执行一次',
            ]
          },
          checkBox: {
            num: 7,
            zero: false,
          },
          thisWeek: {
            min: 1,
            max: [4, 7]
          },
          weekLast: {
            min: 1,
            max: 7,
          },
        },
        month: {
          unit: '月',
          showRadio: ['1','2','3','4','7'],
          zhouqi: {
            min: 1,
            max: 12,
            text: [
              '从',
              '至',
              '月',
            ]
          },
          xunhuan: {
            min: 1,
            max: 12,
            text: [
              '从',
              '月开始，每',
              '月执行一次',
            ]
          },
          checkBox: {
            num: 12,
            zero: false,
          },
        },
        year: {
          unit: '年',
          showRadio: ['1','2','3'],
          zhouqi: {
            min: 2018,
            max: 2118,
            text: [
              '从',
              '至',
              '年',
            ]
          },
        }
      }
    }
  },
  computed: {
    tableModel() {
      if(this.model === '') {
        return []
      }
      return [this.model]
    },
  },
  watch: {
    value(val) {
      this.model = this.getModel()
    },
    'model.s'(val) {
      console.log('second', val)
      this.emitModel()
    },
    'model.m'(val) {
      console.log('min', val)
      this.emitModel()
    },
    'model.h'(val) {
      console.log('hour', val)
      this.emitModel()
    },
    'model.d'(val) {
      console.log('day', val)
      this.emitModel()
    },
    'model.week'(val) {
      console.log('week', val)
      this.emitModel()
    },
    'model.month'(val) {
      console.log('month', val)
      this.emitModel()
    },
    'model.year'(val) {
      console.log('year', val)
      this.emitModel()
    },
    model(val) {
      console.log('guaguagau. model')
      if(val === '') {
        this.clearModel()
      }
      this.emitModel()
    },
  },
  methods: {
    clearModel() {
      this.model = {
        s: '?',
        m: '?',
        h: '?',
        d: '?',
        week: '?',
        month: '?',
        year: '?',
      }
    },
    getModel() {
      let val = this.value.split(' ')
      // let val = []
      let r = {
        s: val[0] || '?',
        m: val[1] || '?',
        h: val[2] || '?',
        d: val[3] || '?',
        month: val[4] || '?',
        week: val[5] || '?',
        year: val[6] || '?',
      }
      return r
    },
    emitModel() {
      let val = this.model
      let s = val.s || '?'
      let m = val.m || '?'
      let h = val.h || '?'
      let d = val.d || '?'
      let month = val.month || '?'
      let week = val.week || '?'
      let year = val.year || '?'
      let r = `${s} ${m} ${h} ${d} ${month} ${week} ${year}`
      this.$emit('input', r)
    },
    errNotify(mes) {
      this.$aui.notify.show.error({
        title: '错误',
        message: mes,
      })
    },
  },
  created () {
  },
  components: {
    tablePane,
  }
}
</script>

<style lang="css" scoped>
.cron {
  text-align: left;
  padding: 10px;
  background: #fff;
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
}
</style>
