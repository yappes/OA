<template>
  <div class="pui-view-formulas-edit">
    <aui-dialog :close-on-click-modal="false" :title="dialogTitle" width="40%" show-full-icon @hide="closeDialog" :visible="isVisible">
      <aui-form :model="reqData" :rules="rules" ref="form" label-width="100px"  class="pui-view-formulas-edit__form">
        <aui-form-item label="公式名称" prop="formuleName">
          <aui-input v-model="reqData.formuleName" placeholder="请输入公式名称"></aui-input>
        </aui-form-item>

        <aui-form-item label="配置方式" prop="type">
          <aui-radio-group v-model="reqData.type" @change="handleChangeType">
            <aui-radio label="1">默认值</aui-radio>
            <aui-radio label="0">自定义处理URL</aui-radio>
            <aui-radio label="2">公式计算</aui-radio>
          </aui-radio-group>
        </aui-form-item>

        <aui-form-item label="目标字段" prop="targetColumnId">
          <aui-select v-model="reqData.targetColumnId"  placeholder="请选择">
            <aui-option v-for="col in targetColumns" :key="col.id" :label="col.columnName" :value="col.id"></aui-option>
          </aui-select>
        </aui-form-item>

        <aui-form-item label="来源字段" prop="sourceColumnIds" v-if="reqData.type == 0">
          <aui-select v-model="reqData.sourceColumnIds" multiple placeholder="请选择">
            <aui-option-group v-for="(group, index) in sourceColumns" :key="index" :label="group.name">
              <aui-option v-for="col in group.list" :key="col.id" :label="col.columnName" :value="String(col.id)"></aui-option>
            </aui-option-group>  
          </aui-select>
        </aui-form-item>

        <aui-form-item label="数据值" prop="defaultVal" v-if="reqData.type == 1">
          <aui-input v-model="reqData.defaultVal" placeholder="请输入"></aui-input>
        </aui-form-item>

        <aui-form-item label="URL地址" prop="customUrl" v-if="reqData.type == 0">
          <aui-input v-model="reqData.customUrl" placeholder="请输入"></aui-input>
        </aui-form-item>

        <aui-form-item label="公式内容" prop="content" v-if="reqData.type == 2">
          <aui-input type="textarea" :rows="2" placeholder="请输入" v-model="reqData.content"></aui-input>
        </aui-form-item>
      </aui-form>
      <div slot="footer" class="dialog-footer">
        <aui-button  :plain="true" @click="closeDialog">取 消</aui-button>
        <aui-button type="primary" @click="submitForm('form')">确定</aui-button>
      </div>
    </aui-dialog>
  </div>
</template>

<script>
import { viewFormulaService } from "paas-web-utils/services";

export default {
  name: "PuiViewFormulasEdit",

  data() {
    return {
      isVisible: false,
      dialogTitle: '新增视图公式',
      reqData: {
        entCode: '',
        userCode: '',
        formuleName: '',
        moduleId: '',
        targetColumnId: '',
        sourceColumnIds: [],
        type: '1',
        content: '',
        customUrl: '',
        defaultVal: '',
      },
      targetColumns: [], // 目标字段集合
      sourceColumns: [], // 来源字段集合
    };
  },

  props: {
    editRow: {
      type: Object
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    moduleId: {
      type: Number
    }
  },

  computed: {
    rules() {
      return {
        formuleName: [
          { required: true, message: "请输入公式名称", trigger: "blur" },
          { min: 2, message: "至少2个字符", trigger: "blur" }
        ],
        targetColumnId: [
          { required: true, message: "请选择目标字段", trigger: "change" },
        ],
        sourceColumnIds: [
          { required: this.reqData.type == 0, message: "请选择来源字段", trigger: "change" },
        ],
        defaultVal: [
          { required: this.reqData.type == 1, message: "请输入数据值", trigger: "blur" },
        ],
        customUrl: [
          { required: this.reqData.type == 0, message: "请输入URL地址", trigger: "blur" },
        ],
        content: [
          { required: this.reqData.type == 2, message: "请输入公式内容", trigger: "blur" },
        ]
      }
    }
  },

  created() {
    if(this.isEdit) {
      this.findViewFormulaById();
    } else {
      this.isVisible = true;
    }
    this.findTargetColumns();
    this.findSourceColumns();
  },

  methods: {
    findViewFormulaById() {
      this.dialogTitle = '编辑视图公式';
      viewFormulaService.findViewFormulaById({ 
        entCode: '',
        formulaId: this.editRow.id
      }).then(res => {
        let data = res;
        if(data.sourceColumnIds) {
          data.sourceColumnIds = data.sourceColumnIds.split(',');
        } else {
          data.sourceColumnIds = [];
        }
        data.type = data.type.toString();
        this.reqData = data;
        this.isVisible = true;
      });
    },

    // 根据模块id获取目标字段集合
    findTargetColumns() {
      viewFormulaService.findTargetColumnsByModuleId({
        moduleId: this.moduleId
      }).then(res => {
        this.targetColumns = res[0].columnList;
      })
    },

    // 根据模块id获取来源字段集合
    findSourceColumns() {
      viewFormulaService.findSourceColumnsByModuleId({
        moduleId: this.moduleId
      }).then(res => {
        this.sourceColumns = res;
      })
    },

    // 改变配置方式
    handleChangeType(val) {
      if(val == 0) {
        this.reqData.defaultVal = '';
        this.reqData.content = '';
      } else if(val == 1) {
        this.reqData.customUrl = '';
        this.reqData.content = '';
        this.reqData.sourceColumnIds = [];
      } else if(val == 2) {
        this.reqData.customUrl = '';
        this.reqData.defaultVal = '';
        this.reqData.sourceColumnIds = [];
      }
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            ...this.reqData,
            ...{ moduleId: this.moduleId },
            ...{ sourceColumnIds: this.reqData.sourceColumnIds.join(',')}
          };

          if (this.isEdit) {
            params.id = this.editRow.id;
            viewFormulaService.updateViewFormula(params).then(res => {
              this.hideAndRefresh();
            });
          } else {
            viewFormulaService.addViewFormula(params).then(res => {
              this.hideAndRefresh();
            });
          }
        } else {
          return false;
        }
      });
    },

    hideAndRefresh() {
      this.closeDialog();
      this.$emit("getTableData");
    },

    closeDialog() {
      this.$emit("closeDialog");
      this.$refs.form.resetFields();
    }
  }
};
</script>
  
<style lang="scss" scoped>
// .pui-view-formulas-edit {
//   & .pui-view-formulas-edit__form {
//     padding: 0px 9% 0px 3%;
//     min-width: 300px;
//   }
// }
</style>