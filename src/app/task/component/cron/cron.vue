<template>
  <div id='app'>
    <aui-input type="text" placeholder="输入触发时间" v-model="formModel"  @focus="openDialog" clearable></aui-input>
    <aui-dialog title="触发时间" :visible.sync="dialogShow" :modal='true' :close-on-click-modal="false" :modal-append-to-body="true" width="800px">
      <aui-form>
        <aui-form-item>
          <gua v-model='cronExpression' ref='gua'></gua>
        </aui-form-item>
      </aui-form>
      <div slot="footer" class="dialog-footer">
        <aui-button :plain="true" @click="clear" :style='{"float":"left","margin-right":"20px"}'>重 置</aui-button>
        <aui-button :plain="true" @click="cancel">取 消</aui-button>
        <aui-button type="primary" @click="submit">确 定</aui-button>
      </div>
    </aui-dialog>
  </div>
</template>

<script>
import gua from './gua'
export default {
  name: 'cron',
  props: {
    value: {
      type: String,
      required: true,
      default: '',
    }
  },
  components: {
    gua,
  },
  data () {
    return {
      dialogShow: false,
      cronExpression: '',
    }
  },
  computed: {
    formModel: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    openDialog() {
      this.dialogShow = true
    },
    submit() {
      this.validate().then(data => {
        if(data) {
          this.formModel = this.cronExpression
          this.dialogShow = false
        }
      })
    },
    cancel() {
      this.dialogShow = false
    },
    clear() {
      this.$refs.gua.clearModel()
    },
    validate() {
      return this.$refs.gua.validate().then(data => {
        return true
      }).catch(err => {
          this.$aui.notify.show.error({
          title: '错误',
          message: err,
        })
        return false
      })
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
