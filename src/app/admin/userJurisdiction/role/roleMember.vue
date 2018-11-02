<template>
  <div class="pui-role-member">
    <aui-dialog :close-on-click-modal="false" :title="dialogTitle" show-full-icon @hide="closeDialog" :visible="isVisible">
      <div class="main-content" v-loading="loading">
        <p class="header">从组织架构选择添加角色的成员：</p>
        <div class="pui-role-member__org">
          <div class="title">组织架构</div>
          <aui-input placeholder="请输入搜索的成员..." v-model="filterText"></aui-input>
          <div class="org-content">
            <aui-tree 
            ref="orgTree"
            :data="orgTreeData" 
            :props="defaultProps"
            node-key="orgCode" 
            :render-after-expand="false" 
            accordion 
            :filter-node-method="filterNode">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <aui-checkbox v-model="data.checked" v-if="data.isMember" @change="handleCurrentChecked(data)"></aui-checkbox>
                <span>{{ node.label }}</span>
              </span>
            </aui-tree>
          </div>
        </div>
        <div class="pui-role-member__list">
          <div class="title">已赋予角色的成员</div>
          <div class="member-content">
              <aui-table
              emptyText="暂无数据" 
              ref="multipleTable" 
              :data="showMemberList" 
              :show-header="false" stripe 
              class="pui-user-selection__list">
                <aui-table-column prop="realName" label="" min-width="60" fixed></aui-table-column>
                <aui-table-column prop="mobile" label="" min-width="80"></aui-table-column>
                <aui-table-column min-width="40">
                  <template slot-scope="scope">
                    <span class="delete-btn" @click="handleDelete(scope.row)">X</span>
                  </template>
                </aui-table-column>
              </aui-table>
          </div>
        </div>
      </div>
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
  name: "PuiRoleMember",

  data() {
    return {
      isVisible: true,
      loading: true,
      dialogTitle: '',
      memberList: [],
      allMemberList: [],
      orgTreeData: [],
      defaultProps: {
        children: 'children',
        label: 'orgName'
      },
      filterText: '',
    };
  },

  props: {
    editRow: {
      type: Object
    }
  },

  watch: {
    filterText(val) {
      let datas = this.allMemberList.filter(item => {
        return item.realName.includes(val)
      })
      this.$refs.orgTree.filter(val);
    }
  },

  computed: {
    showMemberList() {
      return this.memberList.filter(item => {
        return item.realName.includes(this.filterText)
      })
    }
  },

  created() {
    this.dialogTitle = '为' + this.editRow.roleName + '角色添加成员';

    Promise.all([
      roleService.findUserList({ userIdList: [], orgCode: null, roleId: null }),
      roleService.findOrgList({ orgParentCode: 0 })
    ]).then(resList => {
      this.handleAllUser(resList[0]);
      this.initTreeData(resList[1]);
      this.loading = false;
    })
  },

  methods: {
    // 处理所有用户集合
    handleAllUser(res) {
      // 默认勾选
      res && res.forEach(member => {
        if(member.roleIds) {
          let roleIdList = member.roleIds.split(',');
          roleIdList.forEach(roleId => {
            if(roleId == this.editRow.id) {
              this.$set(member, 'checked', true);
              this.memberList.push(member);
            }
          })
        }
      })
      res && res.length && (this.allMemberList = res);
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
      orgTreeData = this.initMember(orgTreeData);
      this.orgTreeData = orgTreeData;
      // console.log('this.orgTreeData', this.orgTreeData)
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

    initMember(orgTreeData) {
      orgTreeData.forEach(org => {
        if(org.children.length) {
          this.initMember(org.children);
        } else {
          for(let i = 0; i < this.allMemberList.length; i++) {
            if(this.allMemberList[i].orgCode == org.orgCode) {
              let child = {
                ...this.allMemberList[i], 
                ...{
                  orgCode: this.allMemberList[i].orgCode + '00' +this.allMemberList[i].id,
                  orgName: this.allMemberList[i].realName,
                  isMember: true
                }
              }
              org.children.push(child);
              this.allMemberList.splice(i, 1);
              i--;
            }
          }
        }
      })
      return orgTreeData;
    },

    // 过滤
    filterNode(value, data, node) {
      // console.log('过滤方法', value, data, node)
      if (!value) {
        return true;
      }
      return data.realName && data.realName.includes(value);
    },

    // 节点选中状态发生变化时的回调
    handleCurrentChecked(current) {
      if(current.checked) {
        this.memberList.push(current);
      } else {
        this.memberList = this.memberList.filter(item => {
          return item.id != current.id;
        })
      }
    },

    // 删除成员
    handleDelete(row) {
      this.memberList = this.memberList.filter(item => {
        return item.id != row.id;
      })
      this.loopOrgTreeData(this.orgTreeData, row);
    },

    loopOrgTreeData(orgTreeData, row) {
      orgTreeData.length && orgTreeData.forEach(org => {
        if(org.isMember) {
          if(org.id == row.id) {
            this.$set(org, 'checked', false);
            return false;
          }
        } else {
          this.loopOrgTreeData(org.children, row);
        }
      })
    },

    // 确认提交
    submitForm(formName) {
      let userIdList = [];
      userIdList = this.memberList.map(item => {
        return item.id;
      })

      roleService.grantRole({
        userIdList: userIdList,
        roleId: this.editRow.id
      }).then(res => {
        this.hideAndRefresh();
      })
    },

    hideAndRefresh() {
      this.closeDialog();
      this.$emit("getTableData");
    },

    closeDialog() {
      this.$emit("closeDialog");
    },
  }
};
</script>
  
<style lang="scss" scoped>
  @import "./roleMember.scss";  
</style>  