<template>
  <div class="pui-role-clone">
    <aui-dialog :close-on-click-modal="false" title="克隆角色" show-full-icon @hide="closeDialog" :visible="isVisible" width="40%">
      <aui-form :model="reqData" :rules="rules" ref="form" label-width="120px" class="pui-role-clone__form">
        <aui-form-item label="角色" prop="roleName">
          <aui-input v-model="reqData.roleName" disabled></aui-input>
        </aui-form-item>

        <aui-form-item label="被克隆的角色" prop="cloneRoleId">
          <aui-select v-model="reqData.cloneRoleId" placeholder="请选择">
            <aui-option :label="item.roleName" :value="item.id" v-for="(item, index) in roleList" :key="index"></aui-option>
          </aui-select>
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
import { roleService } from "paas-web-utils/services";

export default {
  name: "PuiRoleClone",

  data() {
    return {
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 2, message: "至少2个字符", trigger: "blur" }
        ],
        cloneRoleId: [
          { required: true, message: "请选择角色", trigger: "change" },
        ]
      },
      isVisible: true,
      reqData: {
        roleId: null,
        roleName: '',
        cloneRoleId: null,
      },
      roleList: [],
    };
  },

  props: {
    editRow: {
      type: Object
    }
  },

  created() {
    this.reqData.roleName = this.editRow.roleName;
    this.findRoleAll();
  },

  methods: {
    findRoleAll() {
      let row = this.editRow;
      let params = { roleId: row.id };
      roleService.findRoleAll({}).then(res => {
        this.roleList = res;
        this.roleList = res.filter(role => {
          return role.id != this.editRow.id;
        })
      });
    },

    submitForm(formName) {
      let form = this.$refs[formName];
      form.validate(valid => {
        if (valid) {
          roleService.cloneRole({
            roleId: this.editRow.id,
            cloneRoleId: this.reqData.cloneRoleId
          }).then(res => {
            this.hideAndRefresh();
          });
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
  @import "./roleClone.scss";  
</style>  