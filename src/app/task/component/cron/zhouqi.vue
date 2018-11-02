<template>
  <div>
    <span>{{data.text[0]}}</span>
    <aui-input-number size="mini" v-model="start" :min='Number(startMin)' :max='Number(startMax)'></aui-input-number>
    <span>{{data.text[1]}}</span>
    <aui-input-number size="mini" v-model="end" :min='Number(endMin)||1' :max='Number(endMax)'></aui-input-number>
    <span>{{data.text[2]}}</span>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  computed: {
    start: {
      get() {
        return Number(this.value.split(this.data.devideString)[0]) || 1
      },
      set(val) {
        let r = val + this.data.devideString + this.end
        this.$emit('input', r)
      }
    },
    end: {
      get() {
        return Number(this.value.split(this.data.devideString)[1]) || 1
      },
      set(val) {
        let r = this.start + this.data.devideString + val
        this.$emit('input', r)
      }
    },
    startMin() {
      if(Array.isArray(this.data.min)) {
        return this.data.min[0]
      }
      return this.data.min
    },
    startMax() {
      if(Array.isArray(this.data.max)) {
        return this.data.max[0]
      }
      return this.data.max
    },
    endMin() {
      if(Array.isArray(this.data.min)) {
        return this.data.min[1]
      }
      return this.data.min
    },
    endMax() {
      if(Array.isArray(this.data.max)) {
        return this.data.max[1]
      }
      return this.data.max
    },
  },
  methods: {
  },
  mounted() {
    // console.log('mounted', this.value, this.start)
  }
}
</script>
<style lang="scss" scoped>

</style>


