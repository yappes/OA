<template>
  <aui-date-picker v-model='week' type="week" format="yyyy 第 WW 周" :disabled='disabled' :placeholder='placeholder' @change='changeDate'></aui-date-picker>
</template>

<script>
export default {
  props: {
    value: Date,
    placeholder: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      week:'',
      currentValue: undefined,
    }
  },
  watch: {
    value(val) {
      if (val === this.currentValue) return;
      this.currentValue = val;
    }
  },
  mounted(){
    if(this.value){
      this.week = this.value;
      this.currentValue = new Date(this.value).getTime();
    }
  },
  methods: {
    changeDate(){
      if(this.week){
        this.currentValue = new Date(this.week).getTime();
      }else{
        this.currentValue = undefined;
      }
      this.$emit('input',this.currentValue)
    }
  }
}
</script>

