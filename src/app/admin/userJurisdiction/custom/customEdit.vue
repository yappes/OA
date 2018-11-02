<template>
  <div class="pui-custom-edit">
    <aui-dialog :close-on-click-modal="false" :title="dialogTitle" show-full-icon @hide="closeDialog" :visible="isVisible" width="40%">
      <aui-form :model="reqData" :rules="rules" ref="form" label-width="100px" class="pui-custom-edit__form">
        <aui-form-item label="权限名称" prop="name">
          <aui-input v-model="reqData.name" placeholder="请输入权限名称"></aui-input>
        </aui-form-item>

        <aui-form-item label="描述" prop="description">
          <aui-input type="textarea" :rows="2" placeholder="请输入描述" v-model="reqData.description"></aui-input>
        </aui-form-item>
      </aui-form>
      <div slot="footer" class="dialog-footer">
        <aui-button :plain="true" @click="closeDialog">取 消</aui-button>
        <aui-button type="primary" @click="submitForm('form')">确定</aui-button>
      </div>
    </aui-dialog>
  </div>
</template>

<script>
import { customPermissionService } from "paas-web-utils/services";

export default {
  name: "PuiCustomEdit",

  data() {
    return {
      rules: {
        name: [
          { required: true, message: "请输入权限名称", trigger: "blur" },
          { min: 2, message: "至少2个字符", trigger: "blur" }
        ]
      },
      isVisible: false,
      dialogTitle: '新增自定义权限',
      reqData: {
        name: '',
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
    }
  },

  created() {
    if(this.isEdit) {
      this.getPermissionInfo();
    } else {
      this.isVisible = true;
    }
  },

  methods: {
    getPermissionInfo() {
      this.dialogTitle = '编辑自定义权限';
      customPermissionService.findPermissionById({ 
        customPermissionId: this.editRow.id
      }).then(res => {
        this.reqData.name = res.customPermission.name;
        this.reqData.description = res.customPermission.description;
        this.isVisible = true;
      });
    },

    submitForm(formName) {
      let form = this.$refs[formName];
      let params = form.model;
      form.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            params.customPermissionId = this.editRow.id;
            customPermissionService.updatePermission(params).then(res => {
              this.hideAndRefresh();
            });
          } else {
            customPermissionService.addPermission(params).then(res => {
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
  @import "./customEdit.scss";  
</style>