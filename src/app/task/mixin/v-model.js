export default {
  props: {
    value: {
      required: true,
    }
  },
  computed: {
    formModel: {
      get() {
        return this.value
      },
      set(newValue) {
        this.$emit('input', newValue)
      }
    },
  }
}