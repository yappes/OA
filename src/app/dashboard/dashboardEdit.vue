<template>
  <div class="pui-dashboard-edit">
    <header slot="title" class="pui-dashboard-edit__header">
      <pui-btn heightStr="34px" padding="0 20px" @click="handleCancel">取消</pui-btn>
      <pui-btn heightStr="34px" padding="0 20px" v-if="homepageType == 'user' && viewId" @click="handleDelete">删除</pui-btn>
      <pui-btn heightStr="34px" padding="0 20px" type="primary" @click="isSaveDialog = true">保存</pui-btn>
    </header>
    <section class="pui-dashboard-edit__section">
      <div class="pui-dashboard-edit-content-wrapper">
        <div class="pui-dashboard-edit-content-wrapper__left">
          <div class="header">面板库</div>
          <div class="panel-list-wrapper">
            <aui-input v-model="panelSearchKey" @keyup.enter.native="enterKeyEvent()" class="fuzzy-search" clearable placeholder="请输入面板名称检索" prefix-icon="aui-icon-search"></aui-input>
            <ul class="panel-list">
              <li 
              class="panel-item" 
              :class="{ 'is-selected': panel.selected}" 
              v-for="(panel, index) in panelList" 
              :key="panel.id"
              @click="panel.operation.handleAdd(panel)">
                <div class="panel-name">{{panel.title}}</div>
                <div class="panel-desc">{{panel.description}}</div>
                <span class="panel-type">
                  <aui-tag :type="panel.tagsType" size="mini">{{panel.type | panelTypeFilter}}</aui-tag>
                </span>  
              </li>
            </ul>
          </div>
        </div>
        <div class="pui-dashboard-edit-content-wrapper__right">
          <pui-dashboard-main :dashboardList="viewData.layoutContent"></pui-dashboard-main>
        </div>
      </div>
    </section>

    <aui-dialog :close-on-click-modal="false" title="保存主页" show-full-icon @hide="closeSaveDialog"  :visible="isSaveDialog" width="60%">
      <aui-form :model="viewData" :rules="rules" ref="form" label-width="100px">
        <aui-form-item label="主页名称" prop="name" class="dashboard-info-item">
          <aui-input v-model="viewData.name"></aui-input>
        </aui-form-item>
        <aui-form-item label="用户" class="dashboard-info-item" v-if="homepageType == 'system'">
          <aui-select v-model="viewData.userIds" multiple filterable placeholder="请选择">
            <aui-option v-for="user in userList" :key="user.id" :label="user.realName" :value="String(user.id)">
            </aui-option>
          </aui-select>
        </aui-form-item>
        <aui-form-item label="状态" prop="status">
          <aui-radio v-model="viewData.status" label="ENABLE">启用</aui-radio>
          <aui-radio v-model="viewData.status" label="DISENABLE">禁用</aui-radio>
        </aui-form-item>
        <aui-form-item label="主页描述" prop="description" class="dashboard-info-item">
          <aui-input type="textarea" v-model="viewData.description"></aui-input>
        </aui-form-item>
      </aui-form>
      <div slot="footer" class="dialog-footer">
        <aui-button :plain="true"  @click="closeSaveDialog">取消</aui-button>
        <aui-button type="primary" @click="submitForm('form')">确定</aui-button>
      </div>
    </aui-dialog>
  </div>
</template>
<script>
import DashboardEdit from './dashboardEdit.js';
import { dashboardService } from 'paas-web-utils/services';
export default {
  name: "PuiDashBoardEdit",

  data() {
    return {
      rules: {
        name: [
          { required: true, message: '请输入主页名称', trigger: 'blur' },
          { min: 2, message: '至少2个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入主页描述', trigger: 'blur' }
        ],
      },
      userList: [],
      panelList: [],
      view: {},
      viewData: {},
      viewId: null,
      homepageType: null,
      panelSearchKey: '', // 面板集合查询关键字
      isSaveDialog: false,
      tagType: ["success","info","warning","","danger"]
    }
  },

  filters: {
    panelTypeFilter(val) {
      let typeName = '';
      switch(val) {
        case 'CONTENT': typeName = '内容'; break;
        case 'CHART': typeName = '图表'; break;
        case 'LIST_SIMPLE': typeName = '简洁列表'; break;
        case 'LIST': typeName = '标准列表'; break;
        case 'LIST_CUSTOM': typeName = '自定义列表'; break;
        case 'CUSTOM_URL': typeName = '自定义链接'; break;
        case 'CUSTOM_COMPONENT': typeName = '自定义组件'; break;
        case 'CUSTOM_TEXT': typeName = '自定义文本'; break;
        default: typeName = '未定义';
      }
      return typeName;
    }
  },

  mounted() {
    this.createView();
    this.findUserList();
  },

  methods: {
    // 创建视图
    createView() {
      // 新增:viewId == 0; 编辑:viewId > 0
      this.$route.params.viewId && (this.viewId = Number(this.$route.params.viewId));
      this.homepageType = this.$route.params.homepageType;

      new DashboardEdit().render(this.viewId, this.homepageType).then(view => {
        this.$set(this, 'view', view);
        this.$set(this, 'viewData', view.viewData);
        // this.$set(this, 'panelList', view.panelList);
        let list =  view.panelList, k=0;
        for (var i=0;i<list.length;i++) {
          list[i].tagsType= this.tagType[k];
          if(k<4){
            k++
          }else{
            k = 0;
          }
        }
        this.$set(this, 'panelList', list);
      });
    },

    // 查询所有角色集合
    findUserList() {
      dashboardService.findUsers({
        userIdList: null,
        orgCode: null,
        roleId: null,
      }).then(res => {
        this.userList = res;
      })
    },

    // 面板关键字查询
    enterKeyEvent() {
      this.view.searchPanelList(this.panelSearchKey).then(panelList => {
        this.$set(this, 'panelList', panelList);
      });
    },

    // 保存
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if(valid) {
          let layoutContent = [];

          if(this.viewData.layoutContent) {
            this.viewData.layoutContent.forEach(panel => {
              let newPanel= {
                id: panel.id,
                span: panel.span,
                height: panel.height,
              }
              layoutContent.push(newPanel);
            })
          } 
          
          let params = {
            name: this.viewData.name,
            status: this.viewData.status,
            description: this.viewData.description,
            layoutContent: JSON.stringify(layoutContent)
          };

          // 系统主页
          if(this.homepageType == 'system') {
            let userIds = '';
            this.viewData.userIds && (userIds = JSON.parse(JSON.stringify(this.viewData.userIds)).join(',')); 
            params.userIds = userIds;
            if(this.viewId) {
              params.id = this.viewId;
              dashboardService.updateDashboard(params).then(() => this.$router.go(-1));
            } else {
              dashboardService.addDashboard(params).then(() => this.$router.go(-1));
            }
          } 
          // 用户个人主页
          else if(this.homepageType == 'user') {
            if(this.viewId) {
              params.id = this.viewId;
              dashboardService.updateUserDashboard(params).then(() => this.$router.go(-1));
            } else {
              dashboardService.addUserDashboard(params).then(() => this.$router.go(-1));
            }
          } 
          // 编辑主页时，有可能用系统主页模板新增个人主页
          else if(this.homepageType == 'userSystem') {
            dashboardService.addUserDashboard(params).then(() => this.$router.go(-1));
          }
        } else {
          return false;
        }
      });
    },

    // 取消
    handleCancel() {
      this.$router.go(-1);
    },

    // 删除
    handleDelete() {
      this.$aui.confirm
      .show("确定删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        dashboardService.deleteUserDashboard({ id: this.viewId }).then(() => this.$router.go(-1));
      }, () => {
        return false;
      });
    },

    // 关闭保存视图对话框
    closeSaveDialog() {
      this.isSaveDialog = false;
      this.$refs.form.resetFields();
    },
  }
}
</script>
<style lang="scss">
@import './dashboardEdit.scss'; 
</style>

