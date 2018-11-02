<template>
  <aui-cascader class="cascader" 
    :options="options" 
    :props="props" 
    v-model="selectedOptions" 
    @change="handleChange" 
    :placeholder="placeholder" 
    :disabled="disabled" 
    style="width: 100%"
    clearable>
  </aui-cascader>
</template>
<script>
import Address from "paas-web-utils/rules/address";
export default {
  name: "PuiAddress",
  props: {
    value: String,
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
      options: [],
      currentValue: this.value,
      props: {
        children: "children",
        label: "name",
        value: "value",
        disabled: "disabled"
      },
      selectedOptions: []
    };
  },
  watch: {
    value(val) {
      if (this.currentValue === val) return;
      this.currentValue = val;
      this.selectedOptions = val.split(',')
    }
  },
  mounted() {
    Address.loading().then(data => {
      this.$set(this, "options", data);
    });
    this.currentValue = this.value;
    console.log("this.currentValue", this.currentValue);
    if (this.currentValue) {
      // 存在 则加载全路径
      this.selectedOptions = this.currentValue.split(',')
    }
  },
  methods: {
    handleChange: function(data) {
      console.log('data',data)
      this.$emit("input", data.join(','));
    }
  }
};
</script>
<style scoped>
* {
  box-sizing: border-box;
}
</style>