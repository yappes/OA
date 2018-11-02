<template>
  <div class='condition' :style='{"background-color":color(count)}'>
    <div class='btn-top'>
      <aui-radio-group v-model="formModel.conditionType" size="mini" :disabled='conditionDisable'>
        <aui-radio-button label="AND"></aui-radio-button>
        <aui-radio-button label="OR"></aui-radio-button>
      </aui-radio-group>
      <div class='right'>
        <aui-button @click='insertData' class='btn' size='mini'>添加单条</aui-button>
        <aui-button @click='insertGroup' class='btn' size='mini'>添加分组</aui-button>
        <aui-button @click='handleDeleteGroup' size='mini' v-if='!deleteDisabled' type='danger'>删除本组</aui-button>
      </div>
    </div>
    <!-- <group-form :formData='formData' v-for='(item, index) in formModel.singleItem' :key='index' 
      v-model='formModel.singleItem[index]' :showErrMessage='false' ref='singleItem' class='condition-item'>
      <span slot='button'>
        <aui-button size="medium" type="text" icon="aui-icon-delete" @click='handledeleteData(index)' :disabled='deleteDataDisabled' style="padding:0 20px"></aui-button>
      </span>
    </group-form> -->
    <condition-item v-for='(item, index) in formModel.singleItem' :key='getKey(index)' v-model='formModel.singleItem[index]' :condition='conditionColumn' :hasModuleName='hasModuleName'
      ref='singleItem' class='condition-item' :deleteDataDisabled='deleteDataDisabled' @delete-item='handledeleteData(index)'></condition-item>
    <template v-for='(childGroup, i) in formModel.groupArray'> 
      <condition v-if='groupArrayShow' :key='"childGroup"+i' :formData='formData' v-model='formModel.groupArray[i]' :conditionColumn='conditionColumn'
        @delete-group='groupDel' :deleteDisabled='false' :delDataDisabled='false' :count='count+1' :hasModuleName='hasModuleName' :style='{"margin":margin,"background-color":color(count+1)}'
        ref='groupArray'>
      </condition>
    </template>
  </div>
</template>

<script>
import groupForm from './groupForm'
import conditionItem from './conditionItem'
import mixin from '../mixin/mixin'
import defaultFormModel from '../data/defaultFormModel'

// const conditionTypeDefault = 'AND'
export default {
  name: 'condition',
  mixins: [mixin],
  components: {
    groupForm,
    conditionItem,
  },
  props: {
    formData: {
      type: Object,
      required: true,
    },
    value: {
      type: Object,
      required: true,
    },
    deleteDisabled: {
      default: true,
    },
    delDataDisabled: {
      default: true,
    },
    count: {
      type: Number,
      default: 0,
    },
    conditionColumn: {
      type: Object,
      default: () => {
        return {}
      },
    },
    required: {
      type: Boolean,
      default: true,
    },
    hasModuleName: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      margin: '10px 10px 0 20px',
      // color: '#000000',
    }
  },
  computed: {
    formModel: {
      get() {
        return this.value
      },
      set(newValue) {
        this.$emit('input', newValue)
      }
    },
    groupArrayShow() {
      let r = this.formModel.groupArray && this.formModel.groupArray.length > 0
      return r
    },
    groupArrayNotValid() {
      return !this.formModel.groupArray || this.formModel.groupArray.length === 0
    },
    deleteDataDisabled() {
      //第一级的单条删除的禁用
      //required:true时必填，故必须保留一条
      if(!this.required) {
        return false
      }
      let r = this.formModel.singleItem && (this.formModel.singleItem.length === 1) && this.delDataDisabled && this.groupArrayNotValid
      return r
    },
    conditionDisable() {
      return this.groupArrayNotValid && this.formModel.singleItem.length <= 1
    },
  },
  watch: {
    'formModel.groupArray'() {
      if(this.formModel.singleItem.length === 0 && this.groupArrayNotValid) {
        if(this.delDataDisabled) {
          this.insertData()
        }else {
          this.deleteGroup()
        }      
      }
    }
  },
  methods: {
    getKey(index) {
      let unix = new Date().getTime()
      return `${unix}_${index}`
      // return String(index)
    },
    color(count) {
      return '#ffffff'
    },
    dafaultConditionItem() {
      let r = {}
      this.formData.head.forEach(e => {
         r[e.prop] = ''
      })
      r.colMark = ''
      return r
    },

    insertData() {
      this.formModel.singleItem.push(this.dafaultConditionItem())
    },
    deleteData(index) {
      // this.$refs.singleItem.forEach(item => {
      //   item.clearTag = false
      // })
      this.formModel.singleItem.splice(index, 1)
      if(this.formModel.singleItem.length === 0 && this.groupArrayNotValid) {
        this.deleteGroup()
      }
    },
    handledeleteData(index) {
      this.deleteMessage(() => {
        this.deleteData(index)
      })
    },
    deleteGroup() {
      // console.log('delete-group', this.formModel)
      this.$emit('delete-group', this.formModel)
    },
    handleDeleteGroup() {
      this.deleteMessage(() => {
        this.deleteGroup()
      })
    },
    groupDel(data) {
      let index = this.formModel.groupArray.indexOf(data)
      if(index !== -1) {
        this.formModel.groupArray.splice(index, 1)
      }
    },
    insertGroup() {
      // console.log('insertGroup', this.formModel.groupArray)
      let data =  defaultFormModel.conditionListNotEmpty()
      if(!this.formModel.groupArray) {
        this.$set(this.formModel, 'groupArray', [])
      }
      this.formModel.groupArray.push(data)
      // console.log('after push', this.formModel.groupArray)
    },
    validate() {
      // let result = {}
      // 进行单条的校验 singleItem的校验
      let formName_0 = 'singleItem'
      let promises_0 = [];
      if(!this.$refs[formName_0]) {
        return Promise.resolve(this.formModel)
      }
      this.$refs[formName_0].forEach((f, index) => {
        if(f.validate()) {
          promises_0.push(f.validate())
        }
      })
      let promiseAll_0 = Promise.all(promises_0).then(data => {
        let result = {}
        let singleItem = data.map(d => {
          for (const key in d) {
            if (d.hasOwnProperty(key)) {
              const element = d[key];
              return element
            }
          }
        })
        result.singleItem = singleItem
        result.conditionType = this.formModel.conditionType
        return result
      })

      //进行groupArray的校验，方法相同
      let formName_1 = 'groupArray'
      let promises_1
      let promiseAll_1
      if(this.$refs[formName_1]) {
        promises_1 = []
        this.$refs[formName_1].forEach((f, index) => {
          if(f.validate()) {
            promises_1.push(f.validate())
          }
        })
      }
      if(promises_1) {
        promiseAll_1 = Promise.all(promises_1).then(data => {
          let result = {
            groupArray: data,
          }
          return result
        })
      }
      // console.log('now', promises_1, promiseAll_1)
      // if(promises_1) {
      //   console.log('huahuahau')
      //   return Promise.all([promiseAll_0, promiseAll_1]).then(data => {
      //     let result = {}
      //     data.forEach(d => {
      //       if(d) {
      //         Object.assign(result, d)
      //       }
      //     })
      //     console.log('alllllll======', data, result)
      //     return result
      //   })
      // } else {
      //   return promiseAll_0
      // }
      
      /**
       * 对总singleItem,groupArray两部分进行校验，对分别的校验结果进行Promise.all
       */
      return Promise.all([promiseAll_0, promiseAll_1]).then(data => {
        let result = {}
        data.forEach(d => {
          if(d) {
            Object.assign(result, d)
          }
        })
        return result
      })
    }
  },
  mounted() {
    // console.log(this.formModel)
  }
}
</script>
<style lang="scss" scoped>
.condition {
  border: solid 1px #cecaca;
  padding: 10px;
  .btn-top {
    padding-bottom: 5px;
    .right {
      float: right;
      .btn {
        background-color: #26B7AE;
        color: white;
      }
    }
    .delete-btn {
      width: 40px;
      float: right;
      text-align: center;
      cursor: pointer;
      color: #f56c6c;
    }
  }
}
</style>

