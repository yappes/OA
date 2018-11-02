<template>
  <div>
    <span>{{data.text[0]}}</span>
    <aui-input-number size="mini" v-model="model" :min='Number(data.min)' :max='Number(data.max)'></aui-input-number>
    <span>{{data.text[1]}}</span>
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
    model: {
      get() {
        return Number(this.value.split(this.data.devideString)[0]) || 1
      },
      set(val) {
        let r = String(val) + this.data.devideString
        this.$emit('input', r)
      }
    },
  },
  methods: {
  },
  mounted() {
    console.log('workday', this.value, this.model)
  }
}
</script>
<style lang="scss" scoped>

</style>


