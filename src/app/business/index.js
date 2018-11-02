import rules, { viewCache } from "paas-web-utils/rules";
import ListPage from "./listPage";
import EditPage from "./editPage";
import DetailPage from "./detailPage";

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

const IndexComponent = {
  name: "BusinessIndex",
  components: { ListPage, EditPage, DetailPage },
  template: `<div v-loading.fullscreen.lock="loading"><component :is="componentType" :view="view"></component></div>`,
  data() {
    return {
      proxy: {
        view: {}
      },
      loading: false
    };
  },
  computed: {
    view() {
      return this.proxy.view;
    },
    componentType() {
      let componentType = undefined;
      switch (this.view.type) {
        case "list":
          componentType = "ListPage";
          break;
        case "insert":
        case "update":
          componentType = "EditPage";
          break;
        case "detail":
          componentType = "DetailPage";
          break;
      }
      return componentType;
    }
  },
  watch: {
    $route(go) {
      this.dataLoading(go.params.viewId, go.query.recordId);
    },
    view() {
      console.log("更新内容", this.view);
    }
  },
  mounted() {
    this.dataLoading(this.$route.params.viewId, this.$route.query.recordId);
  },
  methods: {
    dataLoading(viewId, recordId) {
      this.loading = true;
      rules.loading().then(() => {
        this.renderView(viewId, recordId);
      }, () => {
        this.$aui.notify.show.error({
          title: '错误',
          message: '组织架构或字典加载错误'
        });
      });
    },
    renderView(viewId, recordId) {
      this.loading = true;
      viewCache.getViewType(viewId).then(viewEnum => {
        if (viewEnum.value === "CUSTOM") {
          // 自定义视图
          viewCache.get(viewId).then((view) => {
            this.$router.replace(appendParamsUrl(view.viewUrl, {
              sourceViewId: viewId,
              recordId
            }));
          });
          return Promise.reject("进入自定义视图");
        }
        let oldView = this.proxy.view;
         // 清空视图信息
         this.$set(this.proxy, "view", {});
         
         oldView.$destroy && oldView.$destroy();

        console.log("recordId", recordId);

        return new viewEnum.class().render(viewId, recordId);
      }).then(view => {
        if (view.triggerRelation && this.$route.query.relationId) {
          view.triggerRelation({
            relationId: this.$route.query.relationId,
            relationModuleId: `,${this.$route.query.relationModuleId},`,
            relationViewId: this.$route.query.relationViewId
          });
        }
        // 绑定视图到当前组件
        setTimeout(() => {
          this.$set(this.proxy, "view", view);
          this.loading = false;
        });
      });
    },
  },
  beforeDestroy(){
    this.proxy.view.$destroy && this.proxy.view.$destroy();
    this.$delete(this.proxy, "view");
  }
};

export default {
  path: "/business",
  name: "businessIndex",
  component: {
    template: `<router-view/>`
  },
  children: [
    {
      path: ":viewId",
      name: "business",
      component: IndexComponent,
    }
  ]
};
