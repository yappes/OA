<template>
  <div>
    <div>
      <aui-radio v-if='radioShow("1")' v-model="radio" label="1" border>不指定</aui-radio>
      <aui-radio v-if='radioShow("2")' v-model="radio" label="2" border>每日</aui-radio>
      <aui-radio v-if='radioShow("3")' v-model="radio" label="3" border>周期</aui-radio>
      <aui-radio v-if='radioShow("4")' v-model="radio" label="4" border>循环</aui-radio>
      <aui-radio v-if='radioShow("5")' v-model="radio" label="5" border>工作日</aui-radio>
      <aui-radio v-if='radioShow("6")' v-model="radio" label="6" border>本月最后一天</aui-radio>
      <aui-radio v-if='radioShow("7")' v-model="radio" label="7" border>指定</aui-radio>
    </div>
    <div>
      <zhouqi v-if='radio==="3"' :data='zhouqi' v-model='day'></zhouqi>
      <zhouqi v-else-if='radio==="4"' :data='xunhuan' v-model='day'></zhouqi>
      <workday v-else-if='radio==="5"' :data='workday' v-model='day'></workday>
      <checkbox v-else-if='radio==="7"' :num='num' v-model='day'></checkbox>
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
    showRadio: {
      type: Array,
      default: () => {
        return ['1','2','3','4','5','6','7']
      }
    }
  },
  data() {
    return {
      zhouqi: {
        min: 1,
        max: 31,
        devideString: '-',
        text: [
          '从',
          '至',
          '日',
        ],
      },
      xunhuan: {
        min: 1,
        max: 31,
        devideString: '/',
        text: [
          '从',
          '日开始，每',
          '日执行一次',
        ]
      },
      workday: {
        min: 1,
        max: 31,
        devideString: 'W',
        text: [
          '本月',
          '号，最近的工作日',
        ],
      },
      num: 31,
    }
  },
  computed: {
    radio: {
      get() {
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
        } else if(val.indexOf('L') > -1) {
          return '6'
        } else if(!isNaN(val) || val.indexOf(',') > -1 || !val) {
          return '7'
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
        }
      }
    },
    day: {
      get() {
        let val = this.value
        // let map = {
        //   '?': '1',
        //   '*': '2',
        //   '-': '3',
        //   '/': '4',
        //   'W': '5',
        //   'L': '6',
        //   ',': '7'
        // }
        return val
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    radioShow(str) {
      return this.showRadio.includes(str)
    }
  }  
}
</script>
<style lang="scss" scoped>

</style>


