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
        formName: 'addLetter',
        inline: false,
        title: '新增私信',
        head: [{     
          type: 'TEXTAREA',
          placeholder: '请输入内容',
          label: '内容',
          prop: 'content',
          rules: [{required: true, message: '请输入内容', trigger: 'blur'}]
        }, {
          type: 'USERSELECTION',
          placeholder: '请选择接收人集合',
          label: '接收人集合',
          prop: 'toAddress',
          rules: [{required: false, message: '请选择接收人集合', trigger: 'change'}]
        }, {
          type: 'FILEUPLOAD',
          placeholder: '请选文件',
          label: '上传文件',
          prop: 'attachment',
          accept: 'rar,zip,doc,docx,xls,xlsx,pdf,jpg',
          action: "saveFile/AOS/file",
          multiple: true,
          rules: [{required: false, message: '请选文件', trigger: 'change'}]
        }]    
      },
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

