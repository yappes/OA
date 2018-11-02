<template>
  <div>
    <pui-btn @click="actionCreatedClick" heightStr="34px" padding="0 20px" class='creat-btn' type='primary'>新建动作</pui-btn>
    <step-form :formData='formData' v-model='form' @table-row-click='actionRowClick' :rowDelete='deleteRow' ref='form' :required='true'></step-form>
    <aui-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogVisiable" show-full-icon width='1200px' v-if='dialogVisiable'>
      <action-form :model='insertData' @dialog-close='dialogVisiable=false' @dialog-valid='dialogValid' ref='form_1' :key='actionFormKey(clickItem)'></action-form>
      <!-- <action-form :model='insertData' @dialog-close='dialogVisiable=false' @dialog-valid='dialogValid' :conditionColumn='conditionColumn' ref='form_1' :key='actionFormKey(clickItem)'></action-form> -->
    </aui-dialog>
  </div>
  
</template>

<script>
import stepForm from './stepForm'
import actionForm from './actionForm'
import vmodel from '../mixin/v-model'
import defaultFormModel from '../data/defaultFormModel'
export default {
  components: {
    stepForm,
    actionForm
  },
  mixins: [vmodel],
  props: {
    formData: {
      required: true,
    },
    conditionColumn: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      //dialog加上v-if,关闭的同时销毁组件，避免组件的复用
      dialogVisiable: false,
      clickItem: -1,
      insertData: defaultFormModel.sql(),
      // tableFormModel: this.form()
    }
  },
  computed: {
    form() {
      return this.formModel.map(f => {
        return f.type
      })
    },
    dialogTitle() {
      if(this.clickItem === -1) {
        return '新建动作'
      }
      return '修改动作'
    }
  },
  methods: {
    actionFormKey(clickItem) {
      // let unix = new Date().getTime()
      // let r = `${unix}_${clickItem}`
      // return r
      return String(clickItem)
    },
    deleteRow(index) {
      // console.log('deleteRow',index)
      this.formModel.splice(index, 1)
      // console.log('after delete', this.formModel)
    },
    actionCreatedClick() {
      // console.log(this.formModel)
      this.dialogVisiable = true
      this.clickItem = -1
      this.insertData = defaultFormModel.sql()
    },
    actionRowClick(data) {
      // console.log('Row click', data)
      this.dialogVisiable = true
      this.clickItem = data.index
      this.insertData = defaultFormModel.sql(this.formModel[this.clickItem])
    },
    dialogValid(data) {
      if(this.clickItem === -1) {
        // console.log('新增', this.formModel)
        // let length = this.formModel.length
        // this.$set(this.formModel, length, data)
        this.formModel.push(data)
      } else {
        // console.log('编辑', this.formModel, data)
        this.$set(this.formModel, this.clickItem, data)
      }
    },
    validate() {
      return this.$refs.form.validate().then(data => {
        let result = {
          sql: this.formModel
        }
        return result
      }).then(data => {
        if (this.formModel.length === 0 ) {
          throw 'sql类型'
        }
        return data
      }) 
    },
  }
}
</script>

<style lang="scss" scoped>
  .creat-btn {
    margin-bottom: 10px;
    margin-left: 100px;
  }
</style>

