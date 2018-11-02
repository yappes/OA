<template>
  <aui-checkbox-group v-model="formModel" @change="handleChecked">
    <!-- <div  v-for="i in num" :key="String(i)" style="margin-left: 10px;  line-height: 25px;"> -->
      <aui-checkbox v-for="i in numArray" :key="String(i)" style="margin-left: 10px;  line-height: 25px;" :label='formayString(i)'></aui-checkbox>
    <!-- </div> -->
  </aui-checkbox-group>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {
        return {
          num: 31,
          zero: false,
        }
      }
    },
    value: {
      type: String,
      required: true,
    }
  },
  computed: {
    formModel: {
      get() {
        if(this.value === '') {
          return []
        }
        let r = this.value.split(',')
        let sort = this.sort(r)
        let res = sort.map(e => {
          return this.formayString(e)
        })
        return res
      },
      set(val) {
        let r = this.formatNumber(val)
        let sort = this.sort(r)
        let res = sort.join(',')
        this.$emit('input', res)
      }
    },
    numArray() {
      let start = this.data.zero ? 0 : 1
      let r = []
      for(let i = start; i <= this.data.num; i++) {
        r.push(i)
      }
      return r
    }
  },
  methods: {
    handleChecked() {
      // console.log(this.value)
    },
    formayString(i) {
      let s = String(i)
      if(i < 10) {
        return '0' + s
      }
      return s
    },
    formatNumber(arr) {
      return arr.map(e => {
        let n = Number(e)
        return n
      })
    },
    sort(arr) {
      let a = arr
      a.sort((a, b) => {
        return Number(a) > Number(b)
      })
      return a
    }
  },
  mounted() {
    // console.log(this.value, this.formModel)
  }
  
}
</script>
<style lang="scss" scoped>

</style>

