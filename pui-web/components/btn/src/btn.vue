<template>
  <button :disabled="disabled || loading" class="pui-btn" @click="handleClick" 
    :style="'height:'+heightStr+';line-height:'+heightStr+';padding:'+ padding +';width:'+widthStr+';'+borderRadiusStr" 
    :type="nativeType" 
    :class="[
      icon ? 'pui-icon-'+icon:'',
      type ? 'pui-btn--' + type : '',
      {
        'is-disabled': disabled || loading,
        'is-plain': plain
      }
    ]">
    <i class="aui-icon-loading" v-if="loading"></i>
    <span v-if="$slots.default"><slot></slot></span>
  </button>
</template>
<script>
export default {
  name: 'PuiBtn',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    heightStr: { type: String, default: '100%' },
    padding: { type: String, default: '0' },
    borderRadius: { type: String, default: '0' },
    widthStr: { type: String, default: 'auto' },
    icon: {
      type: String,
      default: ''
    },
    nativeType: {
      type: String,
      default: 'button'
    },
    disabled: Boolean,
    loading: Boolean,
    plain: Boolean
  },
  computed: {
    borderRadiusStr: function () {
      let borderRadius = this.borderRadius
      return `border-radius:${borderRadius};-webkit-border-radius:${borderRadius};-moz-border-radius:${borderRadius};`
    }
  },
  methods: {
    goBack: function () {
      this.$router.go(-1)
    },
    handleClick: function (evt) {
      this.$emit('click', evt)
    }
  }
}

</script>
<style lang="scss" scoped>
@import './btn.scss';

.pui-btn+.pui-btn {
  margin-left: 10px;
}

</style>
