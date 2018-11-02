<template>
  <aui-time-select v-model='currentValue' :placeholder='placeholder' :disabled='disabled' :picker-options='pickerOptions'/>
</template>

<script>
import date from 'paas-web-utils/common/date'
export default {
  /**
   * aui-time-select 的value为HH:mm 格式的字符串
   * time-select组件将value转换为时间戳格式，年月日为当前年月日
   */
  props: {
    //时间戳
    value: {
      required: true,
    },
    placeholder: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    pickerOptions: {
      type: Object,
      default: () => {
        return {
          start: '00:00',
          end: '24:00',
          step: '00:30',
        }
      },
    },
  },
  data() {
    return {
      //HH:mm
      currentValue: this.unixToTimeString(this.value),
    }
  },
  watch: {
    value(val) {
      this.currentValue = this.unixToTimeString(val)
    },
    currentValue(val) {
      let emitValue = this.timeStringToUnix(val)
      this.$emit('input', emitValue)
    },
  },
  methods: {
    unixToTimeString(unix) {
      if(!unix) {
        return null
      }
      let h = this.format(date.getHours(unix))
      let m = this.format(date.getMinutes(unix))
      let sep = ':'
      return h + sep + m
    },
    timeStringToUnix(string) {
      if(!string) {
        return null
      }
      let now = new Date().getTime()
      let year = date.getFullYear(now)
      let month = date.getMonth(now)
      let day = date.getDate(now)
      let dateTime = `${year}/${month}/${day} ${string}`
      let unix = new Date(dateTime).getTime()
      return unix
    },
    //时分添0补位
    format(string) {
      let n = Number(string)
      if(!n && n !== 0) {
        return string
      }
      if(n < 10) {
        return '0' + string
      }
      return string
    }
  }
}
</script>

