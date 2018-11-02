<template>
  <div class='form' :class='scrollClass'>
    <div class='form-title-top'>步骤{{showStepIndex}}
      <!-- <pui-btn heightStr="34px" padding="0 20px" class='add-step' :plain="true" @click="addStep">添加步骤</pui-btn> -->
      <div v-if='stepNum>1' class='delete-step' @click='deleteStep'><i class="aui-icon-delete"></i></div>
      <pui-btn heightStr="34px" padding="0 20px" class='add-step' :plain="true" @click="addStep">添加步骤</pui-btn>
    </div>
    <div class='form-content'>
      <group-form class='form-content-item' :formData='moduleData.stepNameType' v-model='formModel.stepNameType' ref='form_0'></group-form>
      <step-form class='form-content-item' :formData='moduleData.inputParams' ref='form_1' v-model='formModel.inputParams'></step-form>
      <step-form class='form-content-item' :formData='moduleData.outParams' ref='form_3' v-model='formModel.outParams'></step-form>
      <condition-group class='form-content-item' v-model='formModel.conditionList' ref='form_2' :conditionColumn='conditionColumn' :required='false' :hasModuleName='true'></condition-group>
      <rpc class='form-content-item' v-model='formModel.RPC' ref='form_4' v-if='showRPC'> </rpc>
      <sql class='form-content-item' v-if='showSQL' :formData='moduleData.sql' v-model='formModel.sql' :conditionColumn='conditionColumn' ref='form_5'></sql>
      <notify class='form-content-item' v-if='showNotify' :formData='moduleData.notify' v-model='formModel.notify' ref='form_6'></notify>
    </div>
    <!-- <aui-dialog title="新建动作" :visible.sync="dialogVisiable" show-full-icon width='90%'>
      <action-form :formData='moduleData'></action-form>
    </aui-dialog> -->
  </div>
</template>

<script>
import stepForm from './stepForm.vue'
import actionForm from './actionForm'
import groupForm from './groupForm'
import conditionGroup from '../component/conditionGroup'
import mixin from '../mixin/mixin'
import rpc from './rpc'
import sql from './sql'
import notify from './notify'
export default {
  name: 'step',
  mixins: [mixin],
  components: {
    stepForm,
    actionForm,
    groupForm,
    conditionGroup,
    rpc,
    sql,
    notify,
  },
  props: {
    moduleData: {
      type: Object,
      required: true,
    },
    value: {
      type: Object,
      required: true,
    },
    conditionColumn: {
      type: Object,
      default: () => {
        return {}
      },
    },
    scrollClass: String,
    stepIndex: {
      type: Number,
      default: 0,
    },
    stepNum: {
      type: Number,
    }
  },
  data() {
    return {
      // dialogVisiable: false,
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
    showStepIndex() {
      return `-${this.stepIndex + 1}`
    },
    showRPC() {
      return this.formModel.stepNameType.type === 'RPC'
    },
    showSQL() {
      return this.formModel.stepNameType.type === 'SQL'
    },
    showNotify() {
      return this.formModel.stepNameType.type === 'NOTIFY'
    },
  },
  methods: {
    // actionRowClick(data) {
    //   // console.log('Row click', data)
    //   this.dialogVisiable = true
    // },
    addStep() {
      this.$emit('add-step')
    },
    deleteStep() {
      this.deleteMessage(() => {
        // console.log('shanchu step')
        this.$emit('delete-step', this.formModel)
      })
    },
    validate() {
      let formName = ['form_0', 'form_1', 'form_2', 'form_3', 'form_4', 'form_5', 'form_6']
      // let formName = 'form'
      let promises = [];
      formName.forEach(fn => {
        if(this.$refs[fn]) {
          promises.push(this.$refs[fn].validate());
        }
      })
      let result = {}
      //TODO: 传递formModel
      return Promise.all(promises).then(data => {
        data.forEach(d => {
          if(d) {
            Object.assign(result, d)
          }
        })
        // console.log('step result', data)
        return result
      })
    }
  },  
}
</script>
<style lang="scss" scoped>
  .form{
    width: 100%;
    margin-top: 25px;
    background-color: #fff;
    border-bottom: solid 1px #f1f1f1;
    .form-title-top {
      font-family: STHeitiSC-Medium;
      font-size: 18px;
      color: #2f3748;
      background: #fcfdff;
      line-height: 43px;
      height: 43px;
      padding-left: 20px;
      border-bottom: solid 1px #f1f1f1;
      .add-step {
        float: right;
        line-height: 34px;
        padding: 0 15px !important;
        color:white !important; 
        background-color:#26B7AE !important; 
        padding: 0 20px;
        font-size: 14px;
        margin: 5px 20px;
        // &:hover {
        //   background-color: #26B7AE;
        //   color: white !important;
        // }
      }
      .delete-step {
        width: 40px;
        float: right;
        margin-right: 15px;
        text-align: center;
        cursor: pointer;
        color: #26B7AE;
      }
    }
    .form-content {
      .form-content-item {
        box-sizing: border-box;
        padding:20px 20px 20px 0;
        border-bottom: solid 1px #f1f1f1;
      }
    }
  }

</style>


