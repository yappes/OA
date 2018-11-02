<template>
  <div>
    <div>
      <aui-radio v-if='radioShow("1")' v-model="radio" label="1" border>不指定</aui-radio>
      <aui-radio v-if='radioShow("2")' v-model="radio" label="2" border>每{{config.unit}}</aui-radio>
      <aui-radio v-if='radioShow("3")' v-model="radio" label="3" border>周期</aui-radio>
      <aui-radio v-if='radioShow("4")' v-model="radio" label="4" border>循环</aui-radio>
      <aui-radio v-if='radioShow("5")' v-model="radio" label="5" border>工作日</aui-radio>
      <aui-radio v-if='radioShow("8")' v-model="radio" label="8" border>指定周</aui-radio>
      <aui-radio v-if='radioShow("9")' v-model="radio" label="9" border>本月最后一个</aui-radio>
      <aui-radio v-if='radioShow("6")' v-model="radio" label="6" border>本月最后一天</aui-radio>
      <aui-radio v-if='radioShow("7")' v-model="radio" label="7" border>指定</aui-radio>
    </div>
    <div>
      <zhouqi v-if='radio==="3"' :data='zhouqi' v-model='day'></zhouqi>
      <zhouqi v-else-if='radio==="4"' :data='xunhuan' v-model='day'></zhouqi>
      <workday v-else-if='radio==="5"' :data='workday' v-model='day'></workday>
      <workday v-else-if='radio==="9"' :data='weekLast' v-model='day'></workday>
      <zhouqi v-else-if='radio==="8"' :data='thisWeek' v-model='day'></zhouqi>
      <checkbox v-else-if='radio==="7"' :data='checkBox' v-model='day'></checkbox>
    </div>
  </div> 
</template>
<script>
import zhouqi from '../component/zhouqi'
import checkbox from '../component/checkbox'
import workday from '../component/workday'
export default {
  components: {
    zhouqi,
    checkbox,
    workday,
  },
  props: {
    value: {
      type: String,
      required: true,
      default: '?'
    },
    config: {
      type: Object,
      default: () => {
        return {
          unit: '日',
          showRadio: ['1','2','3','4','5','6','7','8'],
          zhouqi: {
            min: 1,
            max: 31,
          },
          xunhuan: {
            min: 1,
            max: 31,
          },
          workday: {
            min: 1,
            max: 31,
          },
          checkBox: {
            num: 31,
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
        }
      }
    }
  },
  data() {
    return {
      zhouqi: {
        min: this.config.zhouqi.min,
        max: this.config.zhouqi.max,
        devideString: '-',
        text: this.config.zhouqi ? this.config.zhouqi.text : [
          '从',
          '至',
          this.config.unit,
        ],
      },
      xunhuan: {
        min: this.config.xunhuan ? this.config.xunhuan.min : 1,
        max: this.config.xunhuan ? this.config.xunhuan.max : 31,
        devideString: '/',
        text: this.config.xunhuan ? this.config.xunhuan.text : [
          '从',
          '日开始，每',
          '日执行一次',
        ]
      },
      workday: {
        min: this.config.workday ? this.config.workday.min : 1,
        max: this.config.workday ? this.config.workday.max : 31,
        devideString: 'W',
        text: this.config.workday ? this.config.workday.text : [
          '本月',
          '号，最近的工作日',
        ],
      },
      checkBox: {
        num: this.config.checkBox ? this.config.checkBox.num : 31,
        zero: this.config.checkBox ? this.config.checkBox.zero : false,
      },
      thisWeek: {
        min: this.config.thisWeek ? this.config.thisWeek.min : 1,
        max: this.config.thisWeek ? this.config.thisWeek.max : [4, 7],
        devideString: '#',
        text: [
          '本月第',
          '周，星期',
          '',
        ],
      },
      weekLast: {
        min: this.config.weekLast ? this.config.weekLast.min : 1,
        max: this.config.weekLast ? this.config.weekLast.max : 7,
        devideString: 'L',
        text: [
          '星期',
          '',
        ],
      }
    }
  },
  computed: {
    radio: {
      get() {
        console.log('radio get', this.value)
        let val = this.value
        if(val === '?') {
          return '1'
        } else if (val === '*') {
          return '2'
        } else if(val.indexOf('-') > -1) {
          return'3'
        } else if(val.indexOf('/') > -1) {
          return '4'
        } else if(val.indexOf('W') > -1) {
          return '5'
        } else if(val === 'L') {
          return '6'
        } else if(!isNaN(val) || val.indexOf(',') > -1 || !val) {
          return '7'
        } else if (val.indexOf('#') > -1) {
          return '8'
        } else if (val.indexOf('L') > -1 && val !== 'L') {
          return '9'
        }
      },
      set(val) {
        console.log('radio set', val)
        if(val === '1') {
          this.day = '?'
        } else if(val === '2') {
          this.day = '*'
        } else if(val === '3') {
          this.day = '1-1'
        } else if(val === '4') {
          this.day = '1/1'
        } else if(val === '5') {
          this.day = '1W'
        } else if(val === '6') {
          this.day = 'L'
        } else if(val === '7') {
          this.day = ''
        } else if(val === '8') {
          this.day = '1#1'
        } else if(val === '9') {
          this.day = '1L'
        }
      }
    },
    day: {
      get() {
        let val = this.value
        return val
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    radioShow(str) {
      return this.config.showRadio.includes(str)
    }
  },
  created() {
    // console.log('created', this.config)
    // this.radio = '2'
  }  
}
</script>
<style lang="scss" scoped>

</style>


