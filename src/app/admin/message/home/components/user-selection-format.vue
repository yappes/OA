<template>
  <user-selection v-model='currentValue' :choose='choose'></user-selection>
</template>

<script>
import userSelection from './user-selection'
export default {
  name: 'userSelectionFormat',
  components: {
    userSelection,
  },
  props: {
    value: {
      type: [String, Array]
    },
    choose: String,
  },
  computed: {
    currentValue: {
      get() {
        if(this.choose=== 'radio') {
          return this.value
        }
        if(this.choose=== 'selection') {
          return this.value.join(',')
        }
      },
      set(val) {
        let newValue = undefined
        if(this.choose=== 'radio') {
          newValue = val
        }else {
          newValue = val.split(',')
        }
        this.$emit('input', newValue)
      }
    }
  }
  
}
</script>

