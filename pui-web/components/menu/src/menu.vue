<template>
  <div class="pui-menu" :style="columnCountStyle">
    <ul class="pui-menu__group" v-for="item in menuList" :key="item.id">
      <li class="group-name" :class='{cursor: item.children && item.children.length>0}' @click='handleClick1Menu(item)'>{{item.menuName}}</li>
      <li v-for="child in item.children" v-if="item.children && item.children.length>0" :key="child.id" @click="handleClick4Menu(child)">
        <a>
          <i :class="child.iconClass" :style="'color:'+ child.iconColor"></i>{{child.menuName}}</a>
      </li>
    </ul>
  </div>
</template>
<script>
import { authService } from "paas-web-utils/services";
import { viewCache } from "paas-web-utils/rules";
import loginUser from "paas-web-utils/services/login-user";
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
  name: "PuiMenu",
  data() {
    return {
      menuListChildLength: MENU_CACHE['menuListChildLength'],
      isLoading: true,
      menuList: [{ menuName: "菜单加载中...", noClick: false }]
    };
  },
  computed: {
    /**
     * [根据接口请求的菜单数量来定显示的列数 description]
     * @return {[string]} [column-count的样式]
     */
    columnCountStyle() {
      // todo 接口请求完菜单数据的data长度 暂定5
      //var menuListLength = 5
      var menuListLength = this.menuListChildLength;
      var rate = Math.ceil(menuListLength / 8);
      let count = 1;
      if (rate < 5) {
        count = rate;
      } else if (rate >= 5) {
        count = 4;
      }
      return {
        "column-count": count,
        "-moz-column-count": count,
        "-webkit-column-count": count
      };
    }
  },
  mounted() {
    this.getMainMenu();
    if (this.$root) {
      this.$root.$on("PUI_CLEAR_CACHE", this.clearCache);
    }
    console.log("child", this.menuList);
  },
  methods: {
    //没有子项时可以跳转进入对应页面
    handleClick1Menu(item) {
      if(item.children && item.children.length > 0) {
        return 
      }
      this.$router.push({ name: "business", params: { viewId: item.viewId } });
    },
    handleClick4Menu: function(item) {
      if(item.noClick === false) return;
      //跳转
      this.$router.push({ name: "business", params: { viewId: item.viewId } });
    },
    getMainMenu(clear = false) {
      //获取有权限的菜单
      var vm = this;
      loginUser.get().then(user => {
          if (!clear && MENU_CACHE[user.userCode]) {
            let data = MENU_CACHE[user.userCode]
            MENU_CACHE['menuListChildLength'] = data.length || 1;
            vm.menuListChildLength = data.length || 1;
            return MENU_CACHE[user.userCode];
          }
          return authService.findMenuByAuth().then(data => {
            if (!data || data.length <= 0) {
              vm.menuList = [{ menuName: "暂无数据", noClick: false }];
              return false;
            }
            MENU_CACHE[user.userCode] = arrayToTree(data, "id", "parentId");
            MENU_CACHE['menuListChildLength'] =  MENU_CACHE[user.userCode].length || 1;
            vm.menuListChildLength = MENU_CACHE[user.userCode].length || 1;
            return MENU_CACHE[user.userCode];
          });
        })
        .then(menuList => {
          this.isLoading = false;
          if (!menuList) return;
          vm.$set(vm, "menuList", menuList);
        });
    },
    clearCache() {
      for (const key in MENU_CACHE) {
        if (MENU_CACHE.hasOwnProperty(key)) {
          delete MENU_CACHE[key];
        }
      }
      this.getMainMenu(true);
    }
  },
  beforeDestroy() {
    if (this.$root) {
      this.$root.$off("PUI_CLEAR_CACHE", this.clearCache);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./menu.scss";
.cursor {
  cursor: default !important;
}
</style>
