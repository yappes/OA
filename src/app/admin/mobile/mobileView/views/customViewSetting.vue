<template>
  <div class="pui-custom-view-setting">
    <aui-dialog :close-on-click-modal="false" :title="dialogTitle" show-full-icon @hide="closeDialog" :visible="isVisible" width="40%">
      <aui-form :model="reqData" :rules="rules" ref="form" label-width="100px" class="form">
        <aui-form-item label="视图名称" prop="viewName">
          <aui-input v-model="reqData.viewName" placeholder="请输入视图名称"></aui-input>
        </aui-form-item>

        <aui-form-item label="自定义URL" prop="viewUrl">
          <aui-input v-model="reqData.viewUrl" placeholder="请输入自定义URL"></aui-input>
        </aui-form-item>

        <aui-form-item label="描述" prop="description">
          <aui-input type="textarea" v-model="reqData.description" placeholder="请输入模块描述"></aui-input>
        </aui-form-item>
      </aui-form>
      <div slot="footer" class="dialog-footer">
        <aui-button :plain="true"  @click="closeDialog">取 消</aui-button>
        <aui-button type="primary" @click="submitForm('form')">确定</aui-button>
      </div>
    </aui-dialog>
  </div>
</template>

<script>
import { viewService } from "paas-web-utils/services";

export default {
  name: "PuiCustomViewSetting",

  data() {
    return {
      rules: {
        viewName: [
          { required: true, message: "请输入视图名称", trigger: "blur" },
          { min: 2, message: "至少2个字符", trigger: "blur" }
        ],
        viewUrl: [
          { required: true, message: "请输入URL", trigger: "blur" },
        ]
      },
      isVisible: false,
      dialogTitle: '新增自定义视图',
      moduleColumns: [], // 当前模块所有字段集合
      reqData: {
        moduleId: '',
        viewType: 5,
        viewName: '',
        layoutType: '',
        dpEnable: 'TRUE',
        requiredCols: '',
        columnAssemble: '',
        mobileShowColumns: '', // 必传，暂时不用该字段
        showColumns: '',
        viewSpcShows: [],
        batchCtrls: [],
        dataPermission: '',
        flag: 1,
        searchColumns: '',
        fuzzyQueryCols: '',
        viewUrl: '',
        description: '',
      },
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

  created() {
    this.findColumnsByModuleId();
    if(this.isEdit) {
      this.findViewById();
    } else {
      this.isVisible = true;
    }
  },

  methods: {
    // 查询当前模块下字段集合
    findColumnsByModuleId() {
      viewService.findColumnsByModuleId({ 
        moduleId: this.moduleId
      }).then(res => {
        this.moduleColumns = res[0].columnList;
      })
    },

    // 根据id查询自定义视图详情
    findViewById() {
      this.dialogTitle = '编辑自定义视图';
      viewService.findViewById({ 
        id: this.editRow.id,
        isOwnItem: false
      }).then(res => {
        this.reqData = res;
        this.isVisible = true;
      });
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            ...this.reqData,
            moduleId: this.moduleId
          };

          if(this.isEdit) {
            params.id = this.editRow.id;
            viewService.updateView(params).then(res => {
              this.hideAndRefresh();
            });
          } else {
            viewService.addView(params).then(res => {
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
      this.$emit("get-table-data");
    },

    closeDialog() {
      this.$emit("handle-cancel", 'CustomView');
      this.$refs.form.resetFields();
    }
  }
};
</script>
  
<style lang="scss" scoped>
  @import "./customViewSetting.scss";
</style>