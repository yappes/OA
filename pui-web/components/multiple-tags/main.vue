<template>
  <div>
    <aui-popover :disabled="disabled" class="aui-select-dropdown" ref="selectpopover" :width="inputWidth" trigger="hover" @show="resetInputWidth">
      <template v-if="!value || value.length === 0">
        <div>{{placeholder}}</div>
      </template>
      <template v-else>
        <aui-tag v-for="(item, index) in value" :key="index" style="margin: 4px 10px;" closable size="small" info="info" @close="close(index)">{{item}}</aui-tag>
      </template>
    </aui-popover>
    <div class="aui-select" v-popover:selectpopover>
      <div class="aui-select__tags">
        <aui-tag v-if="value && value[0]" closable size="small" info="info" @close="close(0)">{{value[0]}}</aui-tag>
        <aui-tag v-if="value && value.length > 1">+{{value.length - 1}}</aui-tag>
      </div>
      <aui-input ref="reference" @focus="focusHandler" :placeholder="placeholder" :value="inputValue" :disabled="disabled" readonly>
        <i slot="suffix" class="aui-input__icon" :class="iconClass" @click="focusHandler"></i>
      </aui-input>
    </div>
  </div>
</template>

<script>
export default {
  name: "PuiMultipleTags",
  props: {
    value: {
      type: Array,
      default: []
    },
    placeholder: {},
    iconClass: {
      type: String,
      default: "pui-icons pui-icon-yonghu"
    },
    disabled: Boolean,
    focusHandler: {}
  },
  data() {
    return {
      inputWidth: 0
    };
  },
  computed: {
    inputValue() {
      if (this.value && this.value.length > 0) {
        return "  ";
      } else {
        return undefined;
      }
    }
  },
  methods: {
    close(index) {
      if (this.disabled) return;
      this.$emit("close-tag", index);
    },
    closeAll() {
      if (this.disabled) return;
      this.$emit("close-all");
    },
    resetInputWidth() {
      this.inputWidth =
        this.$refs.reference.$el.getBoundingClientRect().width - 32;
    }
  }
};
</script>
