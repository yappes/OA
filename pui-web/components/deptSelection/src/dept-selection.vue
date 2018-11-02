<template>
  <aui-cascader class="cascader" 
    :options="options" 
    :props="props" 
    v-model="selectedOptions" 
    @change="handleChange" 
    :placeholder="placeholder" 
    :disabled="disabled" 
    style="width: 100%"
    change-on-select
    clearable>
  </aui-cascader>
</template>
<script>
import __ORG_MANAGE__ from "paas-web-utils/rules/organization";

export default {
  name: "PuiDeptSelection",
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
        label: "orgName",
        value: "orgCode",
        disabled: "disabled"
      },
      selectedOptions: []
    };
  },
  watch: {
    value(val) {
      if (this.currentValue === val) return;
      this.currentValue = val;
      __ORG_MANAGE__.loadVal(val).then(data => {
        this.selectedOptions = data;
      });
    }
  },
  mounted() {
    __ORG_MANAGE__.loading().then(data => {
      this.$set(this, "options", data);
    });
    this.currentValue = this.value;
    console.log("this.currentValue", this.currentValue);
    if (this.currentValue) {
      // 存在 则加载全路径
      __ORG_MANAGE__.loadVal(this.currentValue).then(data => {
        this.selectedOptions = data;
      });
    }
  },
  methods: {
    handleChange: function(data) {
      this.$emit("input", data[data.length - 1]);
    }
  }
};
</script>
<style scoped>
* {
  box-sizing: border-box;
}
</style>