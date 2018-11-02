<template>
  <div class='group-form'>
    <div :class='{"form-title-none":titleNone, "form-title-top":titleTop}'>{{formData.title}}</div>
    <!-- 隐藏label -->
    <aui-form :inline="formData.inline" :model="formModel" ref='form' class='form-content' :show-message='showErrMessage' v-if='hideLabel'>
      <my-col v-for='(item, index) in formData.head' :key='index' :status='fullStatus(item)'>
        <aui-form-item :prop='item.prop' :rules='item.rules' :style='{"margin-bottom": marginBottom}' v-if='showFormItem(item.show)'>
          <input-adapt :type='item.type' v-model='formModel[item.prop]' :placeholder='item.placeholder' 
            :options='item.options' :filterable='item.filterable' :changeEvent='item.changeEvent' :visibleChange='item.visibleChange'
            :accept='item.accept' :action='item.action' :multiple='item.multiple' @valid-change='handlerValidChange(item.prop)'></input-adapt>
        </aui-form-item>
      </my-col>
      <my-col status='inline'>
        <!-- <aui-form-item :prop='item.prop' :rules='item.rules' :style='{"margin-bottom": marginBottom}' v-if='showFormItem(item.show)'> -->
          <!-- <input-adapt :type='item.type' v-model='formModel[item.prop]' :placeholder='item.placeholder' 
            :options='item.options' :filterable='item.filterable' :changeEvent='item.changeEvent' :visibleChange='item.visibleChange'></input-adapt> -->
          <slot name='puiInput'></slot>
        <!-- </aui-form-item> -->
      </my-col>
      <my-col status='inline'>
        <slot name='button'></slot>
      </my-col>
      <div :style='{"clear": "both"}'></div>
    </aui-form>
    <!-- 显示label -->
    <aui-form :inline="formData.inline" :model="formModel" ref='form' class='form-content' :show-message='showErrMessage' v-if='showLabel'>
      <my-col v-for='(item, index) in formData.head' :key='index' :status='fullStatus(item)'>
        <aui-form-item  :label="item.label" v-if='showFormItem(item.show)' :label-width='labelWidth' :prop='item.prop' :rules='item.rules' :style='{"margin-bottom": marginBottom}' >
          <input-adapt :type='item.type' v-model='formModel[item.prop]' :placeholder='item.placeholder' 
            :options='item.options' :filterable='item.filterable' :changeEvent='item.changeEvent' :visibleChange='item.visibleChange'
            :choose='item.choose' :accept='item.accept' :action='item.action' :multiple='item.multiple' @valid-change='handlerValidChange(item.prop)'></input-adapt>
        </aui-form-item>
      </my-col>
      <my-col status='inline'>
        <slot name='button'></slot>
      </my-col>
      <div :style='{"clear": "both"}'></div>
    </aui-form>
  </div>

</template>

<script>
import inputAdapt from './inputAdapt'
import myCol from './col'
export default {
  components: {
    inputAdapt,
    myCol,
  },
  props: {
    formData: {
      type: Object,
      required: true,
    },
    value: {
      required: true,
    },
    titlePosition: {
      default: 'none'
    },
    showErrMessage: {
      default: true,
    },
    labelWidth: {
      default: '100px',
    }
  },
  data() {
    return {
      colWidth: '300px'
    }
  },
  computed: {
    formModel: {
      get() {
        return this.value
      },
      set(newValue) {
        // this.value = newValue
        this.$emit('input', newValue)
      }
    },
    hideLabel() {
      return this.formData.showLabel === false
    },
    showLabel() {
      return this.formData.showLabel === undefined || this.formData.showLabel === true
    },
    titleNone() {
      return this.titlePosition === 'none'
    },
    titleTop() {
      return this.titlePosition === 'top'
    },
    marginBottom() {
      if (!this.showErrMessage) {
        return '0'
      }
    },
  },
  methods: {
    handlerValidChange(prop) {
      console.log('handlerValidChange', prop)
      this.$refs.form.validateField(prop)
    },
    fullStatus(item) {
      if(this.formData.inline) {
        return 'inline'
      }
      if(item.full === undefined) {
        return 'full'
      }
      let r = item.full === true ? 'full' : 'half'
      return r
    },
    showFormItem(show) {
      if(show === undefined) {
        return true
      }
      return show
    },
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          setTimeout(() =>{
            if (valid && this.formModel) {
              let result = {}
              result[this.formData.formName] = this.formModel
              resolve(result);
            } else {
              console.log('error', this.formData)
              let title = this.formData.title
              reject(title);
            }
          });
        });
      });
    },
    resetForm() {
      this.$refs.form.resetFields();
    },
  },
}
</script>
<style lang="scss" scoped>
  .group-form{
    width: 100%;
    .form-title-none {
      display: none;
    }
    .form-title-top {
      font-family: STHeitiSC-Medium;
      font-size: 18px;
      color: #2f3748;
      background: #fcfdff;
      line-height: 43px;
      height: 43px;
      padding-left: 20px;
      border-bottom: solid 1px #f1f1f1;
    }
    .form-content {
      // padding: 20px 20px 0 0;
      background-color: #fff;
      font-family: STHeitiSC-Medium;
      font-size: 14px;
      color: #a39c9c;
    }
  }
</style>


