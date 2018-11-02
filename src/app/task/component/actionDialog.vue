<template>
  
    <!-- <aui-form :model="form">
      <aui-form-item label="活动名称" :label-width="formLabelWidth">
        <aui-input v-model="form.name" auto-complete="off"></aui-input>
      </aui-form-item>
      <aui-form-item label="活动区域" :label-width="formLabelWidth">
        <aui-select v-model="form.region" placeholder="请选择活动区域">
          <aui-option label="区域一" value="shanghai"></aui-option>
          <aui-option label="区域二" value="beijing"></aui-option>
        </aui-select>
      </aui-form-item>
    </aui-form>
    <div slot="footer">
      <aui-button @click="dialogFormVisible = false">取 消</aui-button>
      <aui-button type="primary" @click="dialogFormVisible = false">确 定</aui-button>
    </div> -->
  <div>guaguagua</div>
</template>

<script>
export default {
  prop: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // isVisiable: true,
      // dialogFormVisible: false,
      // fullscreen: true,
      // form: {
      //   name: '',
      //   region: '',
      //   date1: '',
      //   date2: '',
      //   delivery: false,
      //   type: [],
      //   resource: '',
      //   desc: ''
      // },

    }
  },
  mounted() {
    console.log('guagaugua', this.isVisiable)
  }
}
</script>

<style lang="scss" scoped>

</style>

