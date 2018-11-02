<template>
  <div class="pui-nav-top ">
    <div class="common-menu">
      <div class="common-menu__item">
        <i class="logo" :style="logoStyle"></i>
      </div>
      <i class="pui-icon-menu common-menu-item">
        <pui-menu></pui-menu>
      </i>
      <router-link :to="{name: 'dashboard'}" class="router-link">
        <i class="pui-icon-index-copy common-menu-item"></i>
      </router-link>
      <router-link :to="{name: 'workflow'}" class="router-link" v-if="user.isWorkflow">
        <i class="pui-icon-gongyingshang common-menu-item"></i>
      </router-link>
    </div>
    <ul class="quick-menu">
      <li class="menu-item" v-for='qmItem in quickMenuList' :key="qmItem.id">
        <!-- <div class="qm-box">{{qmItem.menuName}}<i class="pui-icon-down" v-if="qmItem.children && qmItem.children.length>0"></i></div> -->
        <div class="qm-box" :class='{cursor: qmItem.children && qmItem.children.length>0}' @click='clickQmItem(qmItem)'>{{qmItem.menuName}}</div>
        <ul class="submenu" v-if="qmItem.children && qmItem.children.length>0">
          <li v-for="item in qmItem.children" :key="item.id" @click="handleClick4Menu(item.viewId)">
            <a>
              <i :class="item.iconClass" class="submenu-icon" v-if="item.iconClass" :style="'color:'+item.iconColor"></i>
              <span>{{item.menuName}}</span>
            </a>
          </li>
        </ul>
      </li>
    </ul>
    <ul class="nav-bd-r">
      <!-- TODO:隐藏消息图标 -->
      <li class="menu-item">
        <!-- 鼠标滑动信封，出现相关摘要或进度条 -->
        <span class="box-message">
          <i class="pui-icon-xiaoxi">
            <span class="message"></span>
            <pui-message></pui-message>
          </i>

        </span>
      </li>
      <li class="menu-item" v-if="user.isAdmin">
        <router-link :to="{ name: 'admin' }" class="router-link">

          <i class="pui-icon-shezhi"></i>

        </router-link>
      </li>
      <li class="menu-item personal">
        <span class="box"><img class="head" src="../../../assets/head.png" alt="">
          <span class="user-name">{{user.realName}}
            <i class="pui-icon-down"></i>
          </span>
        </span>
        <ul class="submenu">
          <li @click="dialogVisible = true">菜单设置</li>
          <li @click="handleClearCache">清空缓存</li>
          <li @click="dialogPassWord=true">修改密码</li>
          <li @click="logout">退出登录</li>
        </ul>
      </li>
    </ul>
    <aui-dialog :close-on-click-modal="false" title="自定义快捷菜单" width="80%" :visible.sync="dialogVisible" class="pui-business-export-dialog" v-loading="customQuickMenuStatus">
      <div>
        <pui-custom-quick-menu ref="customQuickMenu" :quickMenuList="quickMenuList" :visible="dialogVisible" :status.sync="customQuickMenuStatus"></pui-custom-quick-menu>
      </div>
      <div class="custom-quick-menu-footer">
        <aui-button :plain="true" @click="dialogVisible = false">取 消</aui-button>
        <aui-button type="primary" @click="saveCustomQuickMenu()">确 定</aui-button>
      </div>
    </aui-dialog>
    <aui-dialog :close-on-click-modal="false" :title="resetPassword? '初始化密码' : '修改密码'" width="50%" :visible.sync="dialogPassWord" class="pui-business-export-dialog" v-loading="customQuickMenuStatus">
      <aui-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
        <aui-form-item label="原密码" prop="oldPassWord" v-show="!resetPassword">
          <aui-input v-model="ruleForm.oldPassWord" type="password"></aui-input>
        </aui-form-item>
        <aui-form-item label="新密码" prop="newPassWord">
          <aui-input v-model="ruleForm.newPassWord" type="password"></aui-input>
        </aui-form-item>
        <aui-form-item label="确认密码" prop="confirmPassWord">
          <aui-input v-model="ruleForm.confirmPassWord" type="password"></aui-input>
        </aui-form-item>
      </aui-form>
      <div class="custom-quick-menu-footer">
        <aui-button :plain="true" @click="dialogPassWord = false">取 消</aui-button>
        <aui-button type="primary" @click="changePassWord('ruleForm')">确 定</aui-button>
      </div>
    </aui-dialog>
  </div>
</template>
<script>
import axios from "paas-web-utils/common/http";

import { authService, userService } from "paas-web-utils/services";
import EventBus from "paas-web-utils/rules/event-bus";
import { viewCache } from "paas-web-utils/rules";
import loginUser from "paas-web-utils/services/login-user";
import shortcutMenuSetting from "./shortcutMenuSetting.vue";
const NAV_CACHE = {};

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
  name: "PuiNavTop",
  // components: { PuiMenu },
  data() {
    var check = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请再次输入密码"));
      } else if (value != this.ruleForm.newPassWord) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    return {
      isLogin: false,
      resetPassword: false,
      user: {},
      quickMenuList: {},
      dialogVisible: false,
      customQuickMenuStatus: false,
      dialogPassWord: false,
      ruleForm: {
        oldPassWord: "",
        newPassWord: "",
        confirmPassWord: ""
      },
      // ruleForm: {},
      rules: {
        oldPassWord: [
          { required: true, message: "请输入原密码", trigger: "blur" }
        ],
        newPassWord: [
          { required: true, message: "请输入新密码", trigger: "blur" }
        ],
        confirmPassWord: [{ validator: check, trigger: "blur" }]
      }
    };
  },
  computed: {
    logoStyle() {
      return {
        "background-image": 'url("static/aos-logo.png")'
      };
    }
  },
  mounted() {
    this.getQuickMenu();
    if (this.$root) {
      this.$root.$on("PUI_CLEAR_CACHE", this.clearCache);
    }
    loginUser.get().then(user => {
      this.$set(this, "user", user);
      // 判断当前用户是否需要初始化密码
      if(loginUser.isResetPassword()){
        this.resetPassword = true
        this.ruleForm.oldPassWord = 888888
        this.$nextTick(() => {
          loginUser.disableResetPwd()
          this.dialogPassWord = true
        })
      }
    });
    console.log("quickMenuList", this.quickMenuList);
  },
  methods: {
    clickQmItem(item) {
      if(item.children && item.children.length > 0) {
        return 
      }
      console.log(`跳转进入${item.menuName}页面`)
      this.$router.push({ name: "business", params: { viewId: item.viewId } });
    },
    changePassWord(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          userService.changePassWord({
              oldPwd: this.ruleForm.oldPassWord,
              newPwd: this.ruleForm.newPassWord
            }).then(data => {
              if (data === "U00002") {
                this.$aui.notify.show.error({
                  title: "修改密码",
                  message: "原密码不正确"
                });
              } else {
                this.$aui.notify.show.success({
                  title: "修改密码",
                  message: "密码修改成功！"
                });
                this.ruleForm.oldPassWord = undefined;
                this.ruleForm.newPassWord = undefined;
                this.ruleForm.confirmPassWord = undefined;
                this.dialogPassWord = false;
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    saveCustomQuickMenu() {
      let vm = this;
      vm.$refs.customQuickMenu.setQuickMenu().then(
        bool => {
          vm.dialogVisible = false;
          vm.getQuickMenu(true);
        },
        () => Promise.reject(`自定义快捷菜单保存失败.`)
      );
    },
    clearCache() {
      for (const key in NAV_CACHE) {
        if (NAV_CACHE.hasOwnProperty(key)) {
          delete NAV_CACHE[key];
        }
      }
      this.getQuickMenu(true);
    },
    handleClearCache() {
      if (this.$root) {
        this.$root.$emit("PUI_CLEAR_CACHE");
      }
      EventBus.$emit("PUI_CLEAR_CACHE");
      axios.post("platform://base/B06001", {}).then(() => {
        this.$aui.notify.show({
          title: "清理缓存",
          message: "清理缓存数据成功",
          type: "success"
        });
      });
    },
    logout() {
      axios.logout().finally(() => {
        window.location.href = 'login.html'
      });
    },
    handleClick4Menu(viewId) {
      //跳转
      this.$router.push({ name: "business", params: { viewId: viewId } });
    },
    getQuickMenu(clear = false) {
      //获取快捷菜单
      var vm = this;
      loginUser.get().then(user => {
        console.log('NAV_CACHE', NAV_CACHE)
        if (!clear && NAV_CACHE[user.userCode]) {
          return NAV_CACHE[user.userCode];
        }
        return authService.findMenuByQuick().then(data => {
          if (!data || data.length <= 0) {
            return [];
          }
          NAV_CACHE[user.userCode] = arrayToTree(data, "id", "parentId");
          return NAV_CACHE[user.userCode];
        });
      }).then(quickMenuList => {
        vm.$set(vm, "quickMenuList", quickMenuList);
      });
    }
  },
  beforeDestroy() {
    if (this.$root) {
      this.$root.$off("PUI_CLEAR_CACHE", this.clearCache);
    }
  }
};
</script>
<style lang='scss'>
@import "./nav-top.scss";

.pui-icon-menu {
  &:hover {
    .pui-menu {
      display: block;
    }
  }
}

.pui-icon-xiaoxi {
  &:hover {
    .pui-message {
      display: block;
    }
  }
}
.pui-business-export-dialog {
  z-index: 3000 !important;
  .aui-dialog__body {
    overflow-x: auto;
  }
}
.button {
  text-align: center;
  width: 120px;
  height: 34px;
  border: 1px solid #26b7ae;
}
.custom-quick-menu-footer {
  text-align: center;
}
.pui-work-group__label {
  display: inline-block;
  width: 100px;
  text-align: right;
}
.cursor {
  cursor: default !important;
}
</style>
