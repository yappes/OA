<template>
  <pui-layout class="pui-workfolw-editor" v-loading="loading">
    <pui-nav-top slot="nav"></pui-nav-top>
    <div slot="full" class="embed-responsive embed-responsive-16by9">
      <iframe class="embed-responsive-item" :src="frameSrc" allowfullscreen ref="iframe" scrolling="no"></iframe>
    </div>
  </pui-layout>
</template>

<script>
import http, { HTTP_CONFIG } from "paas-web-utils/common/http.js";
import { ListView } from "paas-web-utils/rules";
import Column from "paas-web-utils/rules/column";
import LoginUser from "paas-web-utils/services/login-user";
import axios from "axios"
export default {
  name: "WorkfolwEditor",
  data() {
    return {
      loading: true,
      frameSrc: ""
    };
  },
  computed: {
    modelId() {
      return this.$route.params.modelId;
    }
  },
  watch: {
    modelId() {
      this.showLoading();
      this.frameSrc = "";
      setTimeout(() => {
        this.frameSrc = `static/workflow/modeler.html?modelId=${this.modelId}`;
      }, 500);
    }
  },
  mounted() {
    this.showLoading();
    this.addEventIFrame();
    this.frameSrc = `static/workflow/modeler.html?modelId=${this.modelId}`;
  },
  methods: {
    addEventIFrame() {
      let iframe = this.$refs.iframe;
      if (!/*@cc_on!@*/ 0) {
        // 非IE浏览器
        iframe.onload = () => {
          this.initEnvironment(iframe.contentWindow);
          this.hideLoading();
        };
      } else {
        iframe.onreadystatechange = () => {
          if (iframe.readyState == "complete") {
            this.initEnvironment(iframe.contentWindow);
            this.hideLoading();
          }
        };
      }
    },
    initEnvironment(iWindow) {
      // iWindow
      // 代理回退按钮
      iWindow.history.back = () => {
        this.$router.back();
      };
      // 注入网络通信地址
      let ACTIVITI = iWindow.ACTIVITI || {};

      ACTIVITI.CONFIG = HTTP_CONFIG.mapping;
      ACTIVITI.CONFIG.contextRoot = `${HTTP_CONFIG.mapping.workflow}service`;

      iWindow.ACTIVITI = ACTIVITI;

      // 规则库导入
      iWindow['httpVue'] = http;
      iWindow['axios'] = axios;
      iWindow['ListView'] = ListView;
      iWindow['Column'] = Column;
      iWindow['LoginUser'] = LoginUser;
      
      // 初始化
      if (iWindow["[[initEnvironmentFn]]"]) {
        iWindow["[[initEnvironmentFn]]"]();
      }
      iWindow["[[initEnvironment]]"] = true;
      console.log("iframe.contentWindow", iWindow);
    },

    showLoading() {
      this.loading = true;
    },
    hideLoading() {
      setTimeout(() => {
        this.loading = false;
      }, 100);
    }
  }
};
</script>
<style>
.pui-workfolw-editor.pui-layout {
  margin: 0;
}
.pui-workfolw-editor .pui-layout__topBar-wrapper {
  display: none;
}
.pui-workfolw-editor .pui-layout__content {
  width: 100%;
  margin: 0;
}
.pui-workfolw-editor *,
.pui-workfolw-editor ::after,
.pui-workfolw-editor ::before {
  box-sizing: border-box;
}
.embed-responsive {
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  overflow: hidden;
}

.embed-responsive::before {
  display: block;
  content: "";
}

.embed-responsive .embed-responsive-item,
.embed-responsive iframe,
.embed-responsive embed,
.embed-responsive object,
.embed-responsive video {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.embed-responsive-21by9::before {
  padding-top: calc(42.857143% - 100px);
}

.embed-responsive-16by9::before {
  padding-top: calc(56.25% - 100px);
}

.embed-responsive-4by3::before {
  padding-top: calc(75% - 100px);
}

.embed-responsive-1by1::before {
  padding-top: calc(100% - 100px);
}
</style>
