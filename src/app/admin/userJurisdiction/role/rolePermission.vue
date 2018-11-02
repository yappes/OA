<template>
  <div class="pui-role-permission">
    <aui-dialog :close-on-click-modal="false" title="设置权限" show-full-icon @hide="closeDialog" :visible="isVisible">
      <div class="aui-loading-wrapper">
        <div class="pui-role-permission__left">
          <aui-input v-model="searchModuleName" placeholder="搜索" clearable prefix-icon="aui-icon-search" @keyup.enter.native="fuzzyQuery" class="module-search">
          </aui-input>
          <div class="module-list-wrapper" id="module-list-wrapper">
            <div v-if="!moduleList.length" style="text-align: center; font-size: 14px;">暂无数据</div>
            <ul v-else class="module-list" id="module-list">
              <li class="module-item" :class="{'active': scrollData.selectIndex == index}" v-for="(module, index) in moduleList" :key="module.id" @click="selectModule(module, index)">{{module.moduleName}}</li>
            </ul>
          </div>
        </div>
        <template>
          <div v-if="rightPrompt" class="pui-role-permission__right right-prompt">{{rightPrompt}}</div>
          <div v-else class="pui-role-permission__right">
            <div class="pui-moudle-per-item__header">
              <span class="pui-moudle-per-item__header-span">{{currentModule.moduleName}}</span>
              <aui-checkbox v-model="currentModule.checkedAll" @change="checkModulePerAll">全选</aui-checkbox>
            </div>
            <dl class="pui-moudle-per-item__content">
              <li class="per-sort">
                <div class="label">网页菜单</div>
                <div class="checkbox-list">
                  <template v-for="(per, index) in currentModule.MENU">
                    <aui-tooltip class="item" effect="light" :content="per.permName" placement="top">
                      <aui-checkbox v-model="per.checked" :key="index">{{per.permName}}</aui-checkbox>
                    </aui-tooltip>
                  </template>
                  </div>
              </li>
              <li class="per-sort">
                <div class="label">移动菜单</div>
                <div class="checkbox-list">
                  <template v-for="(per, index) in currentModule.MOBILEMENU">
                    <aui-tooltip class="item" effect="light" :content="per.permName" placement="top">
                      <aui-checkbox v-model="per.checked" :key="index">{{per.permName}}</aui-checkbox>
                    </aui-tooltip>
                  </template> 
                </div>
              </li>
              <li class="per-sort">
                <div class="label">网页操作</div>
                <div class="checkbox-list">
                  <template v-for="(per, index) in currentModule.OPERATION">
                    <aui-tooltip class="item" effect="light" :content="per.permName+(per.permDesc?'('+ per.permDesc +')':'')" placement="top">
                      <aui-checkbox v-model="per.checked" :key="index">{{per.permName}}{{per.permDesc?'('+ per.permDesc +')':''}}</aui-checkbox>
                    </aui-tooltip>
                  </template> 
                </div>
              </li>
              <li class="per-sort">
                <div class="label">移动操作</div>
                <div class="checkbox-list">
                  <template v-for="(per, index) in currentModule.MOBILEOPERATION">
                    <aui-tooltip class="item" effect="light" :content="per.permName+(per.permDesc?'('+ per.permDesc +')':'')" placement="top">
                      <aui-checkbox v-model="per.checked" :key="index">{{per.permName}}{{per.permDesc?'('+ per.permDesc +')':''}}</aui-checkbox>
                    </aui-tooltip>
                  </template> 
                </div>
              </li>
            </dl>
          </div>
        </template>
      </div>
      <div slot="footer" class="dialog-footer">
        <aui-checkbox v-model="checkedAll" class="check-all" @change="checkAll">赋予角色所有的权限</aui-checkbox>
        <aui-button :plain="true" @click="closeDialog">取 消</aui-button>
        <aui-button type="primary" @click="submitForm">确定</aui-button>
      </div>
    </aui-dialog>
  </div>
</template>

<script>
import { roleService } from "paas-web-utils/services";

export default {
  name: "PuiRolePermission",

  data() {
    return {
      isVisible: true,
      reqData: {
        roleName: '',
        dataPermission: '',
        isAdmin: '0',
        roleDesc: '',
      },
      moduleList: [], // 模块集合
      allPermissionList: [], // 所有权限集合
      searchModuleName: '',
      // 当前选中的模块
      currentModule: {
        moduleId: 0,
        moduleName: '',
        MENU: [],
        MOBILEMENU: [],
        OPERATION: [],
        MOBILEOPERATION: [],
        checkedAll: false,
      }, 
      checkedAll: false,
      scrollData: {
        selectIndex: 0, // 当前目录索引
        off: true, // 是否滚动
        itemHeight: 34, // 每个目录的高度
      },
      rightPrompt: '.', // 右侧部分提示语
    };
  },

  props: {
    editRow: {
      type: Object
    }
  },

  watch: {
    // 监听是否勾选所有全选和模块的全选
    allPermissionList: {
      handler: function(list) {
        let checkAll = true,
          currentCheckAll = true;
        list.forEach(item => {
          if(!item.checked) {
            checkAll = false;
          }

          if(item.moduleId == this.currentModule.moduleId && !item.checked) {
            currentCheckAll = false;
          }
        })
        this.$set(this, 'checkedAll', checkAll);
        this.$set(this.currentModule, 'checkedAll', currentCheckAll);
      },
      deep: true
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.$aui.loading.show({
        target: '.aui-loading-wrapper',
        text: '权限加载中...',
        background: 'rgba(255, 255, 255, 1)'
      })
      this.createView();

      // 挂载滚动事件
      document.getElementById("module-list-wrapper").addEventListener('scroll', this.onScroll);
    })
  },

  methods: {
    // 初始化页面 
    createView() {
      let promise = Promise.all([
        roleService.getModuleList({ isDelete: 0, moduleName: this.searchModuleName }), 
        roleService.getPermissionList({}), 
        roleService.getRolePerById({ roleIdList: [this.editRow.id] })
      ]);

      promise.then(resList => {
        this.handleModuleList(resList[0]);
        this.allPermissionList = resList[1];
        this.handleRolePerList(resList[2]);
      })
    },
    searchResult(){
      let promise = Promise.all([
        roleService.getModuleList({ isDelete: 0, moduleName: this.searchModuleName }), 
      ]);

      promise.then(resList => {
        this.handleModuleList(resList[0]);
        this.currentModule.MENU.splice(0, this.currentModule.MENU.length);
        this.currentModule.MOBILEMENU.splice(0, this.currentModule.MOBILEMENU.length);
        this.currentModule.OPERATION.splice(0, this.currentModule.OPERATION.length);
        this.currentModule.MOBILEOPERATION.splice(0, this.currentModule.MOBILEOPERATION.length);
        this.allPermissionList.forEach(item => {
          // 添加进模块数组
          if(item.moduleId == this.currentModule.moduleId) {
            //已包含的不再push
            let include = this.currentModule[item.bizType].some(e => {
              return e.id === item.id
            })
            if(!include) {
              this.currentModule[item.bizType].push(item);
            }
            this.rightPrompt = '';
          }
        })
        this.$aui.loading.hide();
      })
    },

    // 处理模块集合
    handleModuleList(res) {
      if(res && res.length) {
        this.scrollData.selectIndex = 0;
        this.moduleList = res;
        this.currentModule.moduleName = res[0].moduleName;
        this.currentModule.moduleId = res[0].id;
        this.rightPrompt = '权限加载中...';
      } else {
        this.moduleList.splice(0, this.moduleList.length);
        this.rightPrompt = '暂无数据';
        this.selectModule({
          id: '',
          moduleName: '',
        });
      }
    },

    // 处理角色权限集合
    handleRolePerList(res) {
      this.currentModule.MENU.splice(0, this.currentModule.MENU.length);
      this.currentModule.MOBILEMENU.splice(0, this.currentModule.MOBILEMENU.length);
      this.currentModule.OPERATION.splice(0, this.currentModule.OPERATION.length);
      this.currentModule.MOBILEOPERATION.splice(0, this.currentModule.MOBILEOPERATION.length);
      this.allPermissionList.forEach(item => {
        this.$set(item, 'checked', false);

        // 默认勾选角色已经选择的权限
        res.rolePermissionList && res.rolePermissionList.forEach(per => {
          if(per.permissionId == item.id) {
            this.$set(item, 'checked', true);
          }
        })
        // 添加进模块数组
        if(item.moduleId == this.currentModule.moduleId) {
          //已包含的不再push
          let include = this.currentModule[item.bizType].some(e => {
            return e.id === item.id
          })
          if(!include) {
            this.currentModule[item.bizType].push(item);
          }
          this.rightPrompt = '';
        }
      })
      this.$aui.loading.hide();
    },

    // 选择模块
    selectModule(module, index){
      index != undefined && (this.scrollData.selectIndex = index);
      this.currentModule.moduleId = module.id;
      this.currentModule.moduleName = module.moduleName;
      this.currentModule.MENU.splice(0, this.currentModule.MENU.length);
      this.currentModule.MOBILEMENU.splice(0, this.currentModule.MOBILEMENU.length);
      this.currentModule.OPERATION.splice(0, this.currentModule.OPERATION.length);
      this.currentModule.MOBILEOPERATION.splice(0, this.currentModule.MOBILEOPERATION.length);

      let currentCheckAll = true;
      this.allPermissionList.forEach(item => {
        if(item.moduleId == this.currentModule.moduleId) {
          this.currentModule[item.bizType].push(item);

          // 设置全选
          if(!item.checked) {
            currentCheckAll = false;
          }
        }
      })
      this.$set(this.currentModule, 'checkedAll', currentCheckAll);
    },

    // 搜索模块
    fuzzyQuery() {
      this.$aui.loading.show({
        target: '.module-list-wrapper',
        text: '权限加载中...',
        background: 'rgba(255, 255, 255, 1)'
      })
      this.rightPrompt = ' ';
      // this.createView();
      this.searchResult();
    },

    // 确认
    submitForm() {
      this.$aui.loading.show({
        target: '.aui-loading-wrapper',
        text: '数据提交中...',
      })
      let permissionIdList = [];
      permissionIdList = this.allPermissionList.filter(item => {
        return item.checked;
      }).map(item => {
        return item.id;
      })
      roleService.updateRolePermission({
        roleId: this.editRow.id,
        permissionIdList: permissionIdList
      }).then(res => {
        this.hideAndRefresh();
      });
    },

    // 关闭并刷新
    hideAndRefresh() {
      this.closeDialog();
      this.$emit("getTableData");
    },

    // 关闭
    closeDialog() {
      this.$aui.loading.hide();
      this.$emit("closeDialog");
    },

    // 切换每个模块的全选勾选状态
    checkModulePerAll(val) {
      this.allPermissionList.forEach(item => {
        if(item.moduleId == this.currentModule.moduleId) {
          this.$set(item, 'checked', val);
        }
      })
    },

    // 切换所有权限的全选勾选状态
    checkAll(val) {
      this.allPermissionList.forEach(item => {
        this.$set(item, 'checked', val);
      })
    },

    // 滚动事件
    onScroll() {
      let leftWrapper = document.getElementById("module-list-wrapper");
      let leftInner = document.getElementById("module-list");
      // 滚动条距顶部距离
      let scrollTop = leftWrapper.scrollTop;
      let scrollHeight = leftWrapper.scrollHeight;
      let wrapperHeight = leftWrapper.offsetHeight;

      // 如果滚动条到顶部，tab为第一个；如果左侧滚动条到底部，tab为最后一个；否则在中间位置
      if(scrollTop <= 0) {
        this.scrollData.selectIndex = 0;
      } else if(scrollTop + wrapperHeight >= scrollHeight) {
        this.scrollData.selectIndex = this.moduleList.length - 1;
      } else {
        this.scrollData.selectIndex = Math.round(scrollTop / this.scrollData.itemHeight) + 5;
      }

      // 右侧延时出现
      if(this.scrollData.off) {
        this.scrollData.off = false;
        setTimeout(() => {
          this.selectModule(this.moduleList[this.scrollData.selectIndex]);
          this.scrollData.off = true;
        }, 500);
      } else {
        return false;
      }
    },
  }
};
</script>
  
<style lang="scss">
  @import "./rolePermission.scss";  
</style>