<template>
  <div class='manage'>
    <!-- 查询模块 -->
    <div class='query'>
      <group-form :formData='query.formData' v-model='query.formModel' :showErrMessage='false' 
        labelWidth='80px'  ref='form' class='query-form'>
      </group-form>
      <div class='query-button'>
        <aui-button class='pui-list-grid__oper' @click='querySubmit'>查询</aui-button>
        <aui-button class='pui-list-grid__oper' @click='queryReset'>重置</aui-button>
      </div>
    </div>
    <!-- 分页表格 -->
    <table-list :search='this.search' class='tablelist'></table-list>
  </div>
</template>

<script>
import groupForm from '../component/groupForm'
import tableList from '../component/tableList'
import {moduleService} from 'paas-web-utils/services'

export default {
  name: 'manage',
  components: {
    groupForm,
    tableList,
  },
  data() {
    return {
      search: {},
      query: {
        formData: {
          formName: 'query',
          inline: true,
          title: '查询',
          head: [{
            type: 'INPUT',
            placeholder: '请输入任务名称',
            label: '任务名称',
            prop: 'name',
            rules: [{required: false, message: '请输入任务名称', trigger: 'blur'}]
          },{     
            type: 'SELECT',
            placeholder: '请选择任务状态',
            label: '状态',
            prop: 'status',
            options: [{
              value: 'ENABLE',
              label: '启用',
            }, {           
              value: 'DISABLE',
              label: '禁用',
            }],
            rules: [{required: false, message: '请选择任务状态', trigger: 'change'}]
          }, {     
            type: 'SELECT',
            placeholder: '请选择模块',
            label: '模块',
            prop: 'moduleId',
            filterable: true,
            options: [],
            rules: [{required: false, message: '请选择模块', trigger: 'change'}]
          }],
        },
        formModel: {
          name: null,
          status: null,
          moduleId: null,
        },
      },
    }
  },
  methods: {
    clickToInsertPage() {
      this.$router.push({
        name: "creatTask"
      });
    },
    querySubmit() {
      return this.$refs.form.validate().then(data => {
        //每次点击都会触发
        this.search = {
          name: this.query.formModel.name,
          status: this.query.formModel.status,
          moduleId: this.query.formModel.moduleId,
        }
        // this.search = this.query.formModel
        //只有在属性有变化的时候才会触发
        // this.$set(this.search, 'name', this.query.formModel.name)
        // this.$set(this.search, 'status', this.query.formModel.status)
        // this.$set(this.search, 'moduleId', this.query.formModel.moduleId)
      })
    },
    queryReset() {
      this.$refs.form.resetForm()
      this.search = this.query.formModel
    },
  },
  mounted() {
        //获取关联模块ID选项
    moduleService.findModules({}).then(data => {
      this.query.formData.head.forEach(info => {
        if(info.prop === 'moduleId') {
          info.options = data.map(d => {
            return {
              value: d.id,
              label: d.moduleName,
            }
          })
          return
        }
      })
    })
  }
};
</script>

<style lang="scss" scoped>
@import "~theme/mixins/mixins";
@import "~theme/mixins/utils";
@import "~theme/common/var";
@import '~theme/icon';

.manage {
  margin: 15px;
  padding: 0;
  box-sizing: border-box;
  min-width: 1200px;
  background-color: #eef1f5;
  .query{
    // padding: 1.5% 15px 1.5% 15px;
    padding: 1.5% 1.5% 1.5% 0;
    background-color: white;
    box-sizing: border-box;
  }
  .query-form { 
    background: #fff;
    display: inline-block;
    width: 80%;
    margin: 12px 0 12px 40px;
  }
  .query-button {
    float: right;
    margin: 12px 0;
    .pui-list-grid__oper {
      display: inline-block;
      line-height: 34px;
      padding: 0 15px !important;
      color:$--color-primary !important; 
      padding: 0 20px;
      font-size: $--font-size-base;
      &:hover {
        background-color: $--color-primary;
        color: $--color-white !important;
      }
    }
  }
  .tablelist {
    margin-top: 15px;
    background-color: white;
    padding: 15px;
  }

  // .query-form /deep/ {
  //   .inline {
  //     width: 33%;
  //   }
  //   .aui-form--inline .aui-form-item__label {
  //     // width: 30%;
  //   }
  //   .aui-form--inline .aui-form-item__content {
  //     width: 60%;
  //   }
  // }
}
</style>

