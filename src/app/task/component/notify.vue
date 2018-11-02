<template>
  <div>
    <group-form :formData='formData' v-model='formModel' ref='form'>
    </group-form>
  </div>
  
</template>
<script>
import groupForm from './groupForm'
import vmodel from '../mixin/v-model'
export default {
  mixins:[vmodel],
  components: {
    groupForm,
  },
  props: {
    formData: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
    }
  },
  methods: {
    validate() {
      return this.$refs.form.validate().then(data => {
        // console.log('notyfy valid', data)
        let result = data.notify
        return {
          event: result
        }
      })
    }
  },
  mounted() {
    // console.log('notify mounted', this.formModel)
  },
}
</script>
<style lang="scss" scoped>

</style>
