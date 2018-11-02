<template>
  <div class="pui-role-edit">
    <aui-dialog :close-on-click-modal="false" :title="dialogTitle" show-full-icon @hide="closeDialog" :visible="isVisible" width="40%">
      <aui-form :model="reqData" :rules="rules" ref="form" label-width="100px" class="pui-role-edit__form">
        <aui-form-item label="角色名称" prop="roleName">
          <aui-input v-model="reqData.roleName" placeholder="请输入角色名称"></aui-input>
        </aui-form-item>

        <aui-form-item label="数据权限">
          <aui-select v-model="reqData.dataPermission" placeholder="请选择">
            <aui-option :label="item.content" :value="item.value" v-for="(item, index) in permissionList" :key="index"></aui-option>
          </aui-select>
        </aui-form-item>

        <aui-form-item label="自定义部门" class="select-org-item" v-if="reqData.dataPermission == 4">
          <aui-popover
            placement="bottom-start"
            title="部门"
            trigger="click"
            popper-class="select-org-popper"
            width="350">
            <aui-tree 
            ref="orgTree" 
            :data="orgTreeData" 
            :props="defaultProps" 
            node-key="orgCode"
            :render-after-expand="false" 
            show-checkbox 
            @check-change="handleCheckOrg"></aui-tree>
            <aui-select slot="reference" v-model="reqData.orgCode" placeholder="请选择" multiple :popper-append-to-body="false" class="select-org-dropdown" @remove-tag="handleRemoveTag">
              <aui-option :label="item.orgName" :value="item.orgCode" v-for="(item, index) in orgList" :key="index"></aui-option>
            </aui-select>
          </aui-popover>
        </aui-form-item>

        <!-- TODO:此字段暂时无用，隐藏 -->
        <aui-form-item label="是否为管理员" v-if="isEdit===true && false">
          <aui-radio-group v-model="reqData.isAdmin">
            <aui-radio label="0">否</aui-radio>
            <aui-radio label="1">是</aui-radio>
          </aui-radio-group>
        </aui-form-item>

        <aui-form-item label="描述" prop="description">
          <aui-input type="textarea" :rows="2" placeholder="请输入描述" v-model="reqData.roleDesc"></aui-input>
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
  name: "PuiRoleEdit",

  data() {
    return {
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 2, message: "至少2个字符", trigger: "blur" }
        ]
      },
      isVisible: false,
      dialogTitle: '新增角色',
      reqData: {
        roleName: '',
        dataPermission: '5',
        isAdmin: '0',
        roleDesc: '',
        orgCode: '',
      },
      permissionList: [{
        value: '5',
        content: '全部',
      },{
        value: '1',
        content: '当前用户',
      },{
        value: '2',
        content: '当前部门',
      },{
        value: '3',
        content: '当前部门及下属部门',
      },{
        value: '4',
        content: '自定义数据权限',
      },],
      orgList: [],
      orgTreeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
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
    this.findOrgList();
    if(this.isEdit) {
      this.getRoleInfo();
    } else {
      this.isVisible = true;
    }
  },

  methods: {
    getRoleInfo() {
      this.dialogTitle = '编辑角色';
      let row = this.editRow;
      let params = { roleId: row.id };
      roleService.findRoleById(params).then(res => {
        this.reqData.roleName = res.roleName;
        this.reqData.dataPermission = res.dataPermission.toString();
        this.reqData.isAdmin = res.isAdmin.toString();
        this.reqData.roleDesc = res.roleDesc;

        if(res.dataPermission == 4 && res.orgCode) {
          this.reqData.orgCode = res.orgCode.split(',');
          this.$nextTick(function() {
            this.$refs.orgTree.setCheckedKeys(this.reqData.orgCode);
          })
        }
        this.isVisible = true;
      });
    },

    // 查询组织架构集合
    findOrgList() {
      roleService.findOrgList({
        orgParentCode: 0
      }).then(res => {
        this.orgList = res.organzationList;
        this.initTreeData(res);
      })
    },

    // 初始化树形数据
    initTreeData(res) {
      let orgList = [],
          orgTreeData = [];
      res.organzationList && (orgList = JSON.parse(JSON.stringify(res.organzationList)));

      // 初始化最外层父级节点
      for(let i = 0; i < orgList.length; i++) {
        if(orgList[i].orgParentCode == 0) {
          orgTreeData.push({
            ...orgList[i],
            label: orgList[i].orgName,
            children: [],
          })
          orgList.splice(i, 1);
          i--;
        }
      }
      orgTreeData = this.initTreeChildrenData(orgList, orgTreeData);
      this.orgTreeData = orgTreeData;
    },

    // 初始化子节点
    initTreeChildrenData(orgList, orgTreeData) {
      if(orgList.length) {
        for(let i = 0; i < orgTreeData.length; i++) {
          for(let j = 0; j < orgList.length; j++) {
            if(orgList[j].orgParentCode == orgTreeData[i].orgCode) {
              orgTreeData[i].children.push({
                ...orgList[j],
                label: orgList[j].orgName,
                children: [],
              })
              orgList.splice(j, 1);
              j--;
            }
          }
          this.initTreeChildrenData(orgList, orgTreeData[i].children);
        }
      }
      return orgTreeData;
    },

    // 选择组织节点
    handleCheckOrg(data, isChecked) {
      if(isChecked) {
        this.reqData.orgCode.push(data.orgCode);
      } else {
        let index = this.reqData.orgCode.indexOf(data.orgCode);
        index >= 0 && this.reqData.orgCode.splice(index, 1);
      }
    },

    // 删除选中的部门
    handleRemoveTag(orgCode) {
      this.$refs.orgTree.setChecked(orgCode, false, true);
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if(valid) {
          let orgCode = '';
          if(this.reqData.dataPermission == 4 && this.reqData.orgCode && this.reqData.orgCode.length) {
            orgCode = this.reqData.orgCode.join(',');
          } 

          let params = {
            ...this.reqData,
            orgCode: orgCode
          };

          if (this.isEdit) {
            params.roleId = this.editRow.id;
            roleService.updateRole(params).then(res => {
              this.hideAndRefresh();
            });
          } else {
            roleService.addRole(params).then(res => {
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
  
<style lang="scss">
  @import "./roleEdit.scss";  
</style>  