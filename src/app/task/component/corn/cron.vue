<template lang="html">
  <div class="cron" :val="value_">
    <aui-tabs v-model="activeName">
      <aui-tab-pane label="秒" name="s">
        <second-and-minute v-model="sVal" lable="秒"></second-and-minute >
      </aui-tab-pane>
      <aui-tab-pane label="分" name="m">
        <second-and-minute v-model="mVal" lable="分"></second-and-minute >
      </aui-tab-pane>
      <aui-tab-pane label="时" name="h">
        <hour v-model="hVal" lable="时"></hour>
      </aui-tab-pane>
      <aui-tab-pane label="日" name="d">
        <day v-model="dVal" lable="日"></day>
      </aui-tab-pane>
      <aui-tab-pane label="月" name="month">
        <month v-model="monthVal" lable="月"></month>
      </aui-tab-pane>
      <aui-tab-pane label="周" name="week">
        <week v-model="weekVal" lable="周"></week>
      </aui-tab-pane>
      <aui-tab-pane label="年" name="year">
        <year v-model="yearVal" lable="年"></year>
      </aui-tab-pane>
    </aui-tabs>
    <!-- table -->
    <aui-table
       :data="tableData"
       size="mini"
       border
       style="width: 100%;">
       <aui-table-column
         prop="sVal"
         label="秒"
         width="70">
       </aui-table-column>
       <aui-table-column
         prop="mVal"
         label="分"
         width="70">
       </aui-table-column>
       <aui-table-column
         prop="hVal"
         label="时"
         width="70">
       </aui-table-column>
       <aui-table-column
         prop="dVal"
         label="日"
         width="70">
       </aui-table-column>
       <aui-table-column
         prop="monthVal"
         label="月"
         width="70">
       </aui-table-column>
       <aui-table-column
         prop="weekVal"
         label="周"
         width="70">
       </aui-table-column>
       <aui-table-column
         prop="yearVal"
         label="年">
       </aui-table-column>
     </aui-table>
  </div>
</template>

<script>
import SecondAndMinute from './cron/secondAndMinute'
import hour from './cron/hour'
import day from './cron/day'
import month from './cron/month'
import week from './cron/week'
import year from './cron/year'
export default {
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      //
      activeName: 's',
      sVal: '',
      mVal: '',
      hVal: '',
      dVal: '',
      monthVal: '',
      weekVal: '',
      yearVal: ''
    }
  },
  watch: {
    'value' (a, b) {
      this.updateVal()
    }
  },
  computed: {
    tableData () {
      return [{
        sVal: this.sVal,
        mVal: this.mVal,
        hVal: this.hVal,
        dVal: this.dVal,
        monthVal: this.monthVal,
        weekVal: this.weekVal,
        yearVal: this.yearVal
      }]
    },
    value_ () {
      if (!this.dVal && !this.weekVal) {
        return ''
      }
      if (this.dVal === '?' && this.weekVal === '?') {
        // this.$message.error('日期与星期不可以同时为“不指定”')
        this.errNotify('日期与星期不可以同时为“不指定”')
      }
      if (this.dVal !== '?' && this.weekVal !== '?') {
        // this.$message.error('日期与星期必须有一个为“不指定”')
        this.errNotify('日期与星期必须有一个为“不指定”')
      }
      let v = `${this.sVal} ${this.mVal} ${this.hVal} ${this.dVal} ${this.monthVal} ${this.weekVal} ${this.yearVal}`
      if (v !== this.value) {
        console.log('guaguagau', this.value)
        console.log(v)
        this.$emit('input', v)
      } 
      return v
    }
  },
  methods: {
    errNotify(mes) {
      this.$aui.notify.show.error({
        title: '错误',
        message: mes,
      })
    },
    updateVal () {
      if (!this.value) {
        return
      }
      let arrays = this.value.split(' ')
      // console.log(arrays, this.value)
      this.sVal = arrays[0]
      this.mVal = arrays[1]
      this.hVal = arrays[2]
      this.dVal = arrays[3]
      this.monthVal = arrays[4]
      this.weekVal = arrays[5]
      this.yearVal = arrays[6]
    }
  },
  created () {
    // console.log('value', this.value)
    this.updateVal()
  },
  components: {
    SecondAndMinute, hour, day, month, week, year
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
