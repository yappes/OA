<template>
  <aui-input v-model='inputValue' @change='handleChange' ref='inputInstance' @blur='showValue(inputValue)' @focus='handleFocus' :clearable='column.readonly' :disabled='disabled' :placeholder='placeholder'>
    <template v-if='column.unit' slot="append">{{column.unit}}</template>
  </aui-input>
</template>
<script>
import Address from "paas-web-utils/rules/address";
export default {
  name: "PuiMoney",
  props: {
    column:{},
    value: [Number,String],
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String
    }
  },
  data() {
    return {
      inputValue:'',
      currentValue: this.value
    };
  },
  watch: {
    value(val) {
      if (Number(this.currentValue) === Number(val)) return;
      this.currentValue = val;
      this.showValue(this.currentValue);
    },
    inputValue(val) {
      this.handleChange(val);
    }
  },
  mounted() {
    if (this.value) {
      this.currentValue = String(this.value);
      console.log("this.currentValue", this.currentValue);
      this.showValue(this.currentValue)
    }
  },
  methods: {
    showValue(value){
      let showValue = '';
      let len = this.column.columnData.decimalLen;
      if ((value&&String(value).match(/^(\-?)\d+(\.\d+)?$/g) !== null)||value===0) {
        if(len && len !== "0"){
          showValue = String(Number(value).toFixed(len));
        }else{
          showValue = String(value);
        }
        let arr = showValue.split('.')
        var re=/(\d)(\d{3}),/;
        arr[0] = arr[0] +','
        while(re.test(arr[0])){
          arr[0]=arr[0].replace(re,"$1,$2,");
        }
        arr[0] = arr[0].slice(0,arr[0].length-1);
        if(arr[1] && arr[1]!=="undefined" && arr[1]!=="null"){
          showValue=`${arr[0]}.${arr[1]}`
        }else{
          showValue=`${arr[0]}`
        }
      }else{
        showValue = value
      }
      this.inputValue = showValue;
    },
    handleFocus(){
      this.inputValue = String(this.inputValue).replace(/,/g,'');
    },
    handleChange: function(data) {
      this.currentValue = String(data).replace(/,/g,'');
      this.$emit("input", this.currentValue);
      this.$refs.inputInstance.dispatch("AuiFormItem", "aui.form.blur", [
        this.inputValue
      ]);
    }
  }
};
</script>
<style scoped>
* {
  box-sizing: border-box;
}
</style>