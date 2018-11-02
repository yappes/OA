<template>
    <group-form :formData='formData' v-model='formModel' ref='form'></group-form>
</template>

<script>
import groupForm from './groupForm'
export default {
  components: {
    groupForm
  },
  props: {
    formModel: {
      type: Object,
    }
  },
  data() {
    return {
      formData: {
        formName: 'addNotify',
        inline: false,
        title: '新增通知/公告',
        head: [{
          type: 'INPUT',
          placeholder: '请输入主题',
          label: '主题',
          prop: 'subject',
          rules: [{required: true, message: '请输入主题', trigger: 'blur'}]
        },{     
          type: 'RADIO',
          placeholder: '请选择类型',
          label: '类型',
          prop: 'type',
          options: [{
            value: 'NOTIFY',
            label: '通知',
          }, {
            value: 'ANNOUNCEMENT',
            label: '公告',
          }],
          rules: [{required: true, message: '请选择类型', trigger: 'change'}]
        },{     
          type: 'TEXTAREA',
          placeholder: '请输入内容',
          label: '内容',
          prop: 'content',
          rules: [{required: true, message: '请输入内容', trigger: 'blur'}]
        },{
          type: 'RADIO',
          placeholder: '请选择发送类型',
          label: '发送类型',
          prop: 'senderType',
          options: [{
            value: 'ALL',
            label: '全部人员',
          }, {
            value: 'GROUP',
            label: '指定群发',
          }],
          rules: [{required: true, message: '请选择发送类型', trigger: 'change'}]
        }, {
          type: 'USERSELECTION',
          placeholder: '请选择接收人集合',
          label: '接收人集合',
          prop: 'toAddress',
          choose: 'selection',
          show: false,
          rules: [{required: true, message: '请选择接收人集合', trigger: 'change'}]
        }, {
          type: 'FILEUPLOAD',
          placeholder: '请选文件',
          label: '上传文件',
          prop: 'attachment',
          accept: 'rar,zip,doc,docx,xls,xlsx,pdf,jpg',
          action: "saveFile/AOS/file",
          multiple: false,
          rules: [{required: false, message: '请选文件', trigger: 'change'}]
        }]    
      },
      // formModel: {
      //   subject: '',
      //   type: '',
      //   content: '',
      //   tipsType: '',
      //   senderType: '',
      //   toAddress: '',
      // }
    }
  },
  watch:{
    'formModel.senderType'(val) {
      if(val === 'GROUP') {
        this.formData.head.forEach(e => {
          if(e.prop === 'toAddress') {
            e.show = true
          }
        })
      } else {
        this.formData.head.forEach(e => {
          if(e.prop === 'toAddress') {
            e.show = false
          }
        })
      }
    }
  },
  methods: {
    validate() {
      return this.$refs['form'].validate().then((data) => {
        return data
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

