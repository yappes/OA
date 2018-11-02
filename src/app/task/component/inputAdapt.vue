<template>
  <div>
    <aui-input v-if='type==="INPUT"' v-model='model' :placeholder='placeholder' clearable > 
    </aui-input>
    <aui-select v-else-if='type==="SELECT"' v-model="model" :placeholder="placeholder" 
      clearable :filterable='filterable' @change='changeEvent' @visible-change='visibleChange'>
      <aui-option
        v-for="option in options"
        :key="option.value"
        :label="option.label"
        :value="option.value">
      </aui-option>
    </aui-select>
    <aui-date-picker v-else-if='type==="DATE"' type='datetime' value-format="timestamp" v-model="model" :placeholder="placeholder" clearable>
    </aui-date-picker>
    <aui-input v-else-if='type==="TEXTAREA"' type="textarea" resize='none' :rows=5 :placeholder="placeholder" v-model="model">
    </aui-input>
    <aui-radio-group v-else-if='type==="RADIO"' v-model="model">
      <aui-radio v-for="option in options" :key="option.value" :label="option.value">{{option.label}}</aui-radio>
    </aui-radio-group>
    <!-- <aui-input-number v-else-if='type==="NUMBER"' v-model="model" :controls='false'></aui-input-number> -->
    <aui-input v-else-if='type==="NUMBER"' v-model="model" :controls='false' clearable></aui-input>
    <user-selection v-else-if='type==="USERSELECTION"' v-model='model' :choose='choose'></user-selection>
    <cron v-else-if='type==="CRON"' v-model='model'></cron>
  </div>
</template>
  
<script>
import userSelection from './user-selection'
import cron from './cron/cron'
export default {
  name:'inputAdapt',
  components: {
    userSelection,
    cron,
  },
  props: {
    options: Array,
    type: String,
    placeholder: String,
    choose: {
      type: String,
      required: false,
      default: 'radio',
    },
    value: {
      required: true,
    },
    filterable: {
      default: false,
    },
    changeEvent: {
      type: Function,
      default: () => {
        // console.log('select changeEvent')
      }
    },
    visibleChange: {
      type: Function,
      default: (bool) => {
        // console.log('visibleChange', bool)
      }
    }
  },
  data() {
    return {
    }
  },
  computed: {
    model: {
      get() {
        return this.value
      },
      set(newValue) {
        this.$emit('input', newValue)
      }
    }
  },
};
</script>

<style lang="scss" scoped>
</style>


