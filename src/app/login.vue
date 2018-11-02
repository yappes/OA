<template>
  <div class="pui-login">
    <div class="pui-login__left">
      <img src="../../pui-web/assets/timg.jpg" alt="" :style="{height:imgHeight}">
    </div>
    <div class="pui-login__right">
      <div class="pui-login__header">
        <div class="pui-login__header-logo">
          <img class="header-logo" src="../../static/icons/agree.png" alt="">
          <span class="pui-login__header-logo-title">赞同运营管理系统(AOS)</span>
        </div>
        <div class="pui-login__header-tishi">
          <img class="tishi" src="../../pui-web/assets/tishi.jpg" alt="">
          <span> 公共场所不建议自动登陆，以防账户丢失</span>
        </div>
      </div>

      <aui-form :model="form" ref="form" :rules="rules" class="pui-login__form">
        <aui-form-item label="" prop="corporateAccount">
          <aui-input v-model="form.corporateAccount" @keyup.enter.native="changeLogin(form)" placeholder="请输入您的企业账号" clearable>
            <img slot="prepend" class="pui-login__form-img" src="../../pui-web/assets/01.jpg" alt="">
          </aui-input>
        </aui-form-item>
        <aui-form-item label="" prop="account">
          <aui-input v-model="form.account" @keyup.enter.native="changeLogin(form)" placeholder="请输入您的账号" clearable>
            <img slot="prepend" class="pui-login__form-img" src="../../pui-web/assets/02.jpg" alt="">
          </aui-input>
        </aui-form-item>
        <aui-form-item label="" prop="password">
          <aui-input v-model="form.password" type="password" @keyup.enter.native="changeLogin(form)" placeholder="请输入您的密码" clearable>
            <img slot="prepend" class="pui-login__form-img" src="../../pui-web/assets/03.jpg" alt="">
          </aui-input>
        </aui-form-item>
      </aui-form>
      <aui-button type="primary" class="pui-login__submit" @click="changeLogin(form)">登录</aui-button>
    </div>
    <!-- / -->
    <aui-dialog :close-on-click-modal="false" title="请选择进入应用" :visible.sync="dialogVisible" :show-close="false" :before-close="handleClose">
      <aui-row>
        <aui-col :span="4" v-for="app in appList" :key="app.appKey">
          <aui-card :body-style="{ padding: '0px' }" style="cursor: pointer;" @click.native="settingEntApp(app)">
            <template v-if="app.logo">
              <img :src="app.logo" class="pui-app-list___item-thumbnail">
            </template>
            <template v-else>
              <span class="pui-app-list___item__text">{{app.entCode}}</span>
            </template>
            <div style="padding: 14px;">
              <span>{{app.name}}</span>
            </div>
          </aui-card>
        </aui-col>
      </aui-row>
    </aui-dialog>
  </div>
</template>

<script>
import axios from "paas-web-utils/common/http";
import MD5 from "md5";
export default {
  name: "login",
  data() {
    //企业账号验证规则
    var checkCorporateAccount = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入企业账号"));
      } else {
        var myreg = /^[0-9A-Za-z_]{2,32}$/;
        if (!myreg.test(value)) {
          callback(new Error("请输入正确的企业账号"));
        } else {
          callback();
        }
      }
    };
    //账号验证规则
    var checkAccount = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入您的账号"));
      } else {
        var myreg = /^[0-9A-Za-z]{3,32}$/;
        if (!myreg.test(value)) {
          callback(new Error("请输入正确的账号"));
        } else {
          callback();
        }
      }
    };
    //密码验证规则
    var checkPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入您的密码"));
      } else {
        var myreg = /^[0-9A-Za-z]{3,32}$/;
        if (!myreg.test(value)) {
          callback(new Error("请输入正确的密码"));
        } else {
          callback();
        }
      }
    };
    return {
      dialogVisible: false,
      appList: [],
      imgHeight: "",
      form: {
        corporateAccount: "",
        account: "",
        password: ""
      },
      rules: {
        // 验证规则
        corporateAccount: [
          {
            required: true,
            validator: checkCorporateAccount,
            trigger: "blur"
          }
        ],
        account: [
          {
            required: true,
            validator: checkAccount,
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            validator: checkPassword,
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.leftHigh();
    window.addEventListener("resize", this.leftHigh);
  },
  methods: {
    leftHigh() {
      this.imgHeight = window.innerHeight - 5 + "px";
    },
    handleClose(done) {
      if (!window.sessionStorage.getItem("paas:cloud:platform:appKey")) {
        // 不存在AppKey 则不能跳转
        this.$aui.notify.show.error({
          title: "错误操作",
          message: "请选择需要进入的应用"
        });
      } else {
        done()
      }
    },
    settingEntApp(app){
      window.sessionStorage.setItem('paas:cloud:platform:appKey', app.appKey)
      // this.$
      this.dialogVisible = false;
      this.$nextTick(() => {
        window.location.href = './'
      });
    },
    getEntApp() {
      this.$aui.loading.show()
      axios.getEntApp().then(res => {
        this.appList = res;
        if(res.length === 1){
          this.settingEntApp(res[0])
        }else{
          this.$nextTick(() => {
          this.dialogVisible = true;
        });
        }
      }).finally(() => {
        this.$aui.loading.hide();
      })
    },
    login(form) {
      axios.login({
          entAccount: form.corporateAccount,
          username: form.account,
          password: form.password
        }).then(
          res => {
            this.$aui.notify.show.success({
              title: "登录",
              message: "用户登录成功"
            });
            this.getEntApp();
          },
          error => {
            let message = "用户名或密码错误";
            if (error.data && error.data.error_description) {
              message = error.data.error_description;
            } else if (error.data && error.data.message) {
              message = error.data.message;
            }
            this.$aui.notify.show.error({
              title: "登录失败",
              message: message
            });
          }
        );
    },
    changeLogin(form) {
      this.$refs.form.validate().then(() => {
        this.login(form);
      });
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.leftHigh);
  }
};
</script>

<style lang="scss">
@import "~theme/mixins/utils.scss";
@import "~theme/common/inituseragent";
@import "~theme/common/var";
@import "~theme/icon";

.aui-button {
  border-radius: 0;
}
.pui-login {
  min-width: 1200px;
  @include utils-clearfix;
  padding: 0;
  margin: 0;
  background-color: #fff;
  & .pui-login__left {
    float: left;
    width: 60.7%;
    height: 100%;
    overflow: hidden;
  }
  & .pui-login__right {
    float: left;
    width: 26%;
    height: 100%;
    margin-left: 50px;
    & > .pui-login__header {
      margin: 100px 0 30px 0;
      & .header-logo {
        height: 25px;
        vertical-align: middle;
        margin-bottom: 8px;
      }
      & .pui-login__header-logo-title {
        font-size: 22px;
      }
      & > .pui-login__header-tishi {
        overflow: hidden;
        border: 1px solid #ffe57e;
        background: #fff7d3;
        height: 25px;
        line-height: 25px;
        margin: 30px 0;
        & > .tishi {
          width: 20px;
          margin: 0 18px 0 10px;
        }
        & > span {
          display: inline-block;
          font-size: 12px;
          line-height: 25px;
          vertical-align: top;
          color: #333;
        }
      }
    }
    & > .pui-login__form {
      & .pui-login__form-img {
        width: 28px;
        position: relative;
        top: 2px;
      }
      /deep/ .aui-input-group__prepend {
        background: #f3f3f3;
      }
      /deep/ .aui-input__inner:focus,
      /deep/ .aui-input__inner:hover,
      /deep/ .aui-input__inner,
      /deep/ .aui-input-group__prepend {
        border: 0;
      }
      /deep/ .aui-input {
        border: 1px solid #bdbdbd;
        .aui-input-group__prepend {
          border-right: 1px solid #bdbdbd;
        }
        &:hover {
          border: 1px solid $--color-primary;
          .aui-input-group__prepend {
            border-right: 1px solid $--color-primary;
          }
        }
      }
      /deep/ .aui-form-item__error {
        left: 70px;
      }
    }

    & > .pui-login__submit {
      color: #fff;
      width: 100%;
      display: block;
      height: 34px;
    }
  }
}

.pui-app-list___item__text {
  vertical-align: middle;
  width: 100vh;
  height: 146px;
  text-align: center;
  white-space: nowrap;
  font-weight: bold;
  font-size: 25px;
  position: relative;
  display: table-cell !important;
  line-height: 1;
  background-color: #00bcd4;
  color: rgba(255, 255, 255, 0.87);
}

.pui-app-list___item-thumbnail {
  width: 100vh;
  height: 146px;
}
.aui-dialog__body{
  overflow-x: auto;
}
</style>


