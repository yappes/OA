<template>
  <div id='app'>
    <aui-input type="text" placeholder="输入触发时间" v-model="formModel"  @focus="openDialog" clearable></aui-input>
    <aui-dialog  title="触发时间" :visible.sync="dialogShow" :modal='true' :close-on-click-modal="false" :modal-append-to-body="true" width="650px">
      <!-- <cron v-model="cronExpression"></cron> -->
      <gua v-model='cronExpression'></gua>
      <div slot="footer" class="dialog-footer">
        <aui-button :plain="true" @click="cancel">取 消</aui-button>
        <aui-button type="primary" @click="submit">确 定</aui-button>
      </div>
    </aui-dialog>
  </div>
</template>

<script>
import cron from './cron'
import vmodel from '../../mixin/v-model'
import gua from './component/gua'
export default {
  name: 'App',
  mixins: [vmodel],
  components: {
    cron,
    gua,
  },
  data () {
    return {
      dialogShow: false,
      cronExpression: '',
    }
  },
  methods: {
    openDialog() {
      setTimeout(() => {
        this.dialogShow = true
      })
    },
    submit() {
      this.formModel = this.cronExpression
      this.dialogShow = false
    },
    cancel() {
      this.dialogShow = false
    },
  },
  watch: {
    dialogShow(val) {
      if(val) {
        this.cronExpression = this.formModel
      } else {
        this.cronExpression = ''
      }
    },
    formModel(val) {
      this.cronExpression = val
    },
    cronExpression(val) {
      // this.formModel = val
    }
  }
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* width: 700px; */
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
