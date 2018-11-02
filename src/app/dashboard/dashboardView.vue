<template>
  <div class="pui-dashboard-view">
    <pui-header class="pui-dashboard-view__header" height="60px">
      <span class="welcome">
        <span class="huanying">欢迎</span> 
        {{orgName}}
        {{userName}}
      </span>
      <div class="right">
        <aui-select v-model="viewId" placeholder="请选择" class="homepage-select" @change="handleChangeHomepage">
          <aui-option-group v-for="homepage in homepageList" :key="homepage.id" :label="homepage.name">
            <aui-option v-for="item in homepage.list" :key="item.id" :label="item.name" :value="item.id">
            </aui-option>
          </aui-option-group>
        </aui-select>
        <aui-dropdown>
          <span class="aui-dropdown-link">
            <i class="aui-icon aui-icon-setting"></i>
          </span>
          <aui-dropdown-menu slot="dropdown">
            <aui-dropdown-item @click.native="handleAdd">创建新主页</aui-dropdown-item>
            <aui-dropdown-item @click.native="handleEdit">编辑当前主页</aui-dropdown-item>
          </aui-dropdown-menu>
        </aui-dropdown>
      </div>
    </pui-header>
    <pui-main class="pui-dashboard-view__main">
      <pui-dashboard-main :dashboardList="viewData.layoutContent"></pui-dashboard-main>
    </pui-main>
  </div>
</template>

<script>
import DashboardView from './dashboardView.js';
import { dashboardService } from 'paas-web-utils/services';
import loginUser from 'paas-web-utils/services/login-user';
export default {
  name: "PuiDashBoardView",

  data() {
    return {
      homepageList: [], // 所有有权限的主页集合
      currentHomepage: {}, // 当前主页
      view: {},
      viewId: null, // 当前主页id
      viewData: {},
      orgName: '', // 当前用户所属部门名称
      userName: '', // 当前用户名
    }
  },

  created() {
    loginUser.get().then(res => {
      this.orgName = res.orgName;
      this.userName = res.realName;
    });
  },

  mounted() {
    this.findDashboardList();
  },

  methods: {
    // 创建视图
    createView() {
      new DashboardView().render(this.viewId, this.currentHomepage.type).then(view => {
        this.$set(this, 'view', view);
        this.$set(this, 'viewData', view.viewData);
      });
    },

    // 查询所有有权限的主页集合
    findDashboardList() {
      return dashboardService.findAllLimitDashboardList({}).then(res => {
        res.system.forEach(item => item.type = 'system');
        res.user.forEach(item => item.type = 'user');
        let newList = [{
          id: 0,
          name: '系统',
          list: res.system
        },{
          id: 1,
          name: '用户',
          list: res.user
        }]
        this.$set(this, 'homepageList', newList);

        // TODO 需要改成默认主页
        // this.$set(this, 'viewId', res.user[0].id || res.system[0].id);
        // this.$set(this, 'currentHomepage', res.user[0] || res.system[0]);
        // this.createView();
        if(res.user[0] && res.user[0].id){
          this.$set(this, 'viewId', res.user[0].id);
          this.$set(this, 'currentHomepage', res.user[0]);
          this.createView();
        }else if(res.system[0] && res.system[0].id){
          this.$set(this, 'viewId',res.system[0].id);
          this.$set(this, 'currentHomepage',res.system[0]);
          this.createView();
        }
      })
    },

    handleChangeHomepage(val) {
      this.$set(this, 'view', {});
      this.$set(this, 'viewData', {});
      this.homepageList.forEach(homepage => {
        homepage.list.forEach(item => {
          val == item.id && this.$set(this, 'currentHomepage', item);
        })
      })
      this.createView();
    },

    handleAdd() {
      this.$router.push({ name: 'dashboardEdit', params: { homepageType: 'user', viewId: 0} });
    },

    handleEdit() {
      // 编辑主页时，有可能用系统主页模板新增个人主页
      let homepageType = (this.currentHomepage.type == 'system' ? 'userSystem' : 'user'); 
      this.$router.push({ name: 'dashboardEdit', params: { homepageType: homepageType, viewId: this.currentHomepage.id } });
    }
  }
}
</script>

<style lang="scss" scoped>
@import './dashboardView.scss'; 
</style>
  
  