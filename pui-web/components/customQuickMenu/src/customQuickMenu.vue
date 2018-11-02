<template>
  <div style="min-height: 100px;"  v-loading="loading" agree-loading-text="菜单加载中">
    <div v-for="menu in menuList" :key="menu.id">
      <div class="parentMenu">
        <aui-checkbox :indeterminate="menu.isIndeterminate" v-model="menu.checkAll" @change="handleCheckAllChange(menu.checkAll,menu)">
          <span class="parentMenu__menuName">{{menu.menuName}}</span>
        </aui-checkbox>
      </div>
      <div class="childMenu">
        <aui-checkbox-group v-model="menu.checkedChild" @change="handleCheckedChildChange(menu.checkedChild,menu)">
          <aui-checkbox v-for="child in menu.children" :label="child.id" :key="child.id">
            <span class="childMenu__menuName">{{child.menuName}}</span>
          </aui-checkbox>
        </aui-checkbox-group>
      </div>
      <i class="line"></i>
      <!--<hr style="border:1px dotted;marign:30px" /> -->
    </div>
  </div>
</template>
<script>
import { authService } from "paas-web-utils/services";
import loginUser from "paas-web-utils/services/login-user";
// import loading from '../../../../src/app/business/loading';
const MENU_CACHE = {};

function arrayToTree(array, id = "id", pid = "pid") {
  array = array.deepClone();
  let tempMap = {};
  array.forEach(function(value) {
    tempMap[value[id]] = value;
  });
  let treeData = [];
  tempMap.forEach(function(value) {
    let p = tempMap[value[pid]];
    if (p) {
      if (!p.children) p.children = [];
      p.children.push(value);
      s(p.children);
    } else {
      treeData.push(value);
    }
  });

  return s(treeData);
}
function s(arr) {
  //升序
  for (var i = 0; i < arr.length; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i].menuOrder > arr[j].menuOrder) {
        var tem = arr[i];
        arr[i] = arr[j];
        arr[j] = tem;
      }
    }
  }
  return arr;
}

export default {
  name: "PuiCustomQuickMenu",
  props: {
    visible: Boolean,
    status: Boolean,
    quickMenuList: [ Array,Object ]
  },
  data(){
    return {
      loading: true,
      menuList: []
    }
  },
  mounted: function() {
    this.getMainMenu();
    if (this.$root) {
      this.$root.$on("PUI_CLEAR_CACHE", this.clearCache);
    }
  },
  watch: {
    visible: function() {
      if (this.visible) {
        this.getMainMenu();
      }
    }
  },
  methods: {
    getMainMenu(clear = false) {
      //获取有权限的菜单
      var vm = this;
      vm.menuList = [];
      this.$emit('update:status', true)
      loginUser.get().then(user => {
          if (!clear && MENU_CACHE[user.userCode]) {
            return MENU_CACHE[user.userCode];
          }
          return authService.findMenuByAuth().then(data => {
            if (!data || data.length <= 0) {
              vm.menuList = [{ name: "暂无数据", noClick: false }];
              return false;
            }
            vm.menuListChildLength = data.length;
            MENU_CACHE[user.userCode] = arrayToTree(data, "id", "parentId");
            return MENU_CACHE[user.userCode];
          });
        }).then(menuList => {
          vm.loading=false;
          setTimeout(() => {
            this.$emit('update:status', false)
          });
          if (!menuList) return;
          for (const menu of menuList) {
            menu.isIndeterminate = false;
            menu.checkedChild = [];
            menu.checkAll = false;
          }
          if (vm.quickMenuList) {
            for (const menu of menuList) {
              for (const quickMenu of vm.quickMenuList) {
                if (menu.id == quickMenu.id) {
                  if(!quickMenu.children){
                    quickMenu.children=[];
                  }
                  for (const quickChild of quickMenu.children) {
                    menu.checkedChild.push(quickChild.id);
                  }
                  if(!menu.children){
                    menu.children = [];
                  }
                  if (menu.children.length == quickMenu.children.length) {
                    menu.isIndeterminate = false;
                    menu.checkAll = true;
                  } else {
                    menu.isIndeterminate = true;
                    menu.checkAll = false;
                  }
                }
              }
            }
          }
          vm.$set(vm, "menuList", menuList);
        });
    },
    handleCheckAllChange(val, menu) {
      if (val) {
        if(menu.children){
          for (const child of menu.children) {
            menu.checkedChild.push(child.id);
          }
        }
        menu.checkAll = true;
        menu.isIndeterminate = false;
      } else {
        menu.checkAll = false;
        menu.checkedChild = [];
        menu.isIndeterminate = false;
      }
    },
    handleCheckedChildChange(val, menu) {
      if (val.length == 0) {
        menu.isIndeterminate = false;
        menu.checkAll = false;
      } else if (val.length < menu.children.length) {
        menu.isIndeterminate = true;
        menu.checkAll = false;
      } else {
        menu.isIndeterminate = false;
        menu.checkAll = true;
      }
    },
    setQuickMenu() {
      let menuIds = "";
      console.log('this.menuList',this.menuList)
      for (const menu of this.menuList) {
        let len = menu.checkedChild.length;
        if(len > 0 || menu.checkAll){
          menuIds = menuIds + "," + menu.id;
        }
        if (len > 0) {
          for (const child of menu.checkedChild) {
            menuIds = menuIds + "," + child;
          }
        }
      }
      return authService.setMenuByQuick(menuIds);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./customQuickMenu.scss";
</style>
