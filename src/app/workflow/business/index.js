import rules, {
  viewCache,
  InsertView,
  DetailView,
  EditView
} from "paas-web-utils/rules";
import {
  operationService,
  workflowProcessService,
  workflowModelService
} from "paas-web-utils/services";
import alteration from "./alteration.js";
import EditPage from "./editPage.vue";
import DetailPage from "./detailPage.vue";

const appendParamsUrl = function (url, data) {
  if (typeof url === "string") {
    let params = [];
    for (const key in data) {
      if (data[key]) {
        params.push(`${key}=${encodeURIComponent(data[key])}`)
      }
    }
    if (url.indexOf("?") > 0) {
      return url + "&" + params.join("&");
    } else {
      return url + "?" + params.join("&");
    }
  } else {
    url.query || (url.query = {});
    url.query = Object.assign(url.query, data);
    return url;
  }
}
/**
 * 当前首页
 */
const IndexComponent = {
  name: "workflowBusiness",
  template: `<div v-loading.fullscreen.lock="loading"><component 
              :is="componentType" 
              :view="proxy.view" 
              :buttons="proxy.buttons" 
              :is-alteration="proxy.isAlteration"></component></div>`,
  components: {
    EditPage,
    DetailPage,
    EmptyPage: {
      template: `<div></div>`
    }
  },
  data() {
    return {
      proxy: {
        view: {},
        buttons: [{
            lable: "提交",
            type: "SUBMIT",
            uri: "/workflow/myChecked",
            status: true
          },
          {
            lable: "保存草稿",
            type: "SAVEDRAFT",
            uri: "/workflow/drafts",
            status: true
          }
        ],
        isAlteration: false
      },
      loading: false
    };
  },
  watch: {
    $route() {
      this.renderView();
    },
    view() {
      console.log("更新内容", this.proxy.view);
    }
  },
  computed: {
    componentType() {
      let componentType = "EmptyPage";
      switch (this.proxy.view.type) {
        case "insert":
        case "update":
          componentType = "EditPage";
          break;
        case "detail":
          componentType = "DetailPage";
          break;
      }
      return componentType;
    },
    type() {
      return this.$route.query.type;
    },
    recordId() {
      return this.$route.query.recordId
    },
    viewId() {
      return this.$route.params.formId;
    }
  },
  mounted() {
    console.log('this.$route', this.$route)
    this.renderView();
  },
  methods: {
    loadingBtn() {
      let promises = [];
      if (this.$route.query.submitId) {
        let promise = operationService.findOperationDetail({
          id: this.$route.query.submitId
        });
        promise = promise.then((data) => {
          if (data.type === 0 && data.submitType === 2) {
            this.proxy.buttons[0]['submitUri'] = data.submitUrl
          }
        })
        promises.push(promise);
      }
      if (this.$route.query.savedraftId) {
        let promise = operationService.findOperationDetail({
          id: this.$route.query.savedraftId
        });
        promise = promise.then((data) => {
          if (data.type === 0 && data.submitType === 2) {
            this.proxy.buttons[1]['submitUri'] = data.submitUrl
          }
        })
        promises.push(promise);
      }
      return Promise.all(promises);
    },
    renderView() {
      let view = undefined;
      this.loading = true;
      switch (this.type) {
        case 'insert':
        case 'process':
          if (!this.recordId) {
            view = new InsertView();
            break;
          }
        case 'edit':
        case 'alterationProcess':
          view = new EditView();
          break;
        case 'detail':
        default:
          view = new DetailView();
          break;
      }
      viewCache.getViewType(this.viewId).then((viewEnum) => {
        if (viewEnum.value === "CUSTOM") {
          // 自定义视图
          viewCache.get(this.viewId).then((view) => {
            setTimeout(() => {
              this.$router.replace(appendParamsUrl(view.viewUrl, Object.assign({
                sourceViewId: this.viewId,
                recordId: this.recordId
              }, this.$route.query)));
            }, 200);
          });
          return Promise.reject("进入自定义视图");
        }
        let oldView = this.proxy.view;
        // 清空视图信息
        this.$set(this.proxy, "view", {});

        oldView.$destroy && oldView.$destroy();

        return workflowProcessService.findModelRelByProcessDefinitionId({
          processDefinitionId: this.$route.params.processDefinitionId
        })
      }).then((res) => {
        if (res && res.isChange === 'TRUE') {
          this.proxy.isAlteration = true
          // 获取变更数据
          return workflowProcessService.getChangeData({
            processInstanceId: this.$route.query.processInstanceId,
          });
        }
        return undefined
      }).then((params) => {
        //
        return rules.loading().then(() => {
          return params
        })
      }).then((params) => {
        let viewId = this.viewId;
        if (Boolean(params)) {
          // console.log(params)
          console.log('processInstanceId', this.$route.params.processInstanceId)
          params = JSON.parse(params);
          viewId = params.viewId;
        } else {
          params = false;
        }
        let promise = this.loadingBtn().then(() => {
          return view.render(viewId, this.recordId);
        });
        // 处理变更数据
        promise = promise.then(() => {
          return alteration(view, params);
        });
        return promise;
      }).then((_view) => {
        setTimeout(() => {
          this.$set(this.proxy, "view", _view);
          this.loading = false;
        });
      });
    }
  },
  beforeDestroy() {
    this.proxy.view.$destroy && this.proxy.view.$destroy();
  }
};


const ProxyComponent = {
  template: `<div v-loading.fullscreen.lock="true"></div>`,
  data() {
    return {
      modelRel: {},
      processDefinition: {}
    }
  },
  computed: {
    modelId() {
      return this.$route.params.modelId
    },
    recordId() {
      return this.$route.query.recordId
    }
  },
  mounted() {
    this.initProxyData().then(() => {
      this.routerReplace();
    })
  },
  methods: {
    initProxyData() {
      return workflowModelService.findById({
        modelId: this.modelId
      }).then((data) => {
        this.modelRel = data.modelRel;
        this.processDefinition = data.processDefinition;
        return true;
      })
    },
    routerReplace() {
      this.$router.replace({
        name: 'workflowBusiness',
        params: {
          processDefinitionId: this.processDefinition.id,
          formId: this.modelRel.viewId
        },
        query: {
          moduleId: this.modelRel.moduleId,
          recordId: this.recordId,
          businessId: this.recordId,
          submitId: this.$route.query.submitId,
          savedraftId: this.$route.query.savedraftId,
          type: this.$route.query.type ? this.$route.query.type : 'alterationProcess'
        }
      })
    }
  }
}

export default [{
    path: "/workflow/:processDefinitionId/:formId",
    name: "workflowBusiness",
    component: IndexComponent
  },
  {
    path: "/workflow/:modelId",
    name: "business-to-workflow",
    component: ProxyComponent
  }
];
