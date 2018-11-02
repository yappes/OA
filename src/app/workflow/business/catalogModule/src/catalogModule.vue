<script>
import detailBatchForm from "./detail-batch-form.vue";
import listGrid from '../../noPageListGrid/src/listGrid.vue';
import workflowFormLayout from "../../formLayout/src/formLayout.vue";
const config = {
  props: {
    isDetail: { type: Boolean, required: true },
    model: Object,
  }
};
export default {
  name: "PuiCatalogModule",
  componentName: "PuiCatalogModule",
  props: {
    isDetail: { type: Boolean, required: true },
    model: {
      type: Object
    }
  },
  components: {
    formLayout: {
      mixins: [config],
      components:{workflowFormLayout},
      methods: {
        validate() {
          return this.$refs.form.validate();
        }
      },
      render(h) {
        return (
          <workflow-form-layout
            ref="form"
            form-view={this.model}
            is-detail={this.isDetail}
          />
        );
      }
    },
    batchForm: {
      mixins: [config],
      methods: {
        validate() {
          return this.$refs.form.validate();
        }
      },
      render(h) {
        return <pui-batch-table ref="form" batch-view={this.model} />;
      }
    },
    list: {
      components:{listGrid},
      mixins: [config],
      render(h) {
        let listGridConfig = {
          props: {
            datasource: this.model.datasource,
            rowStyle: row => {
              this.model.rowStyle(row);
            },
            componentBtns: this.model.operations.component,
            columns: this.model.columns,
            isShowAdvanced: false,
            recordData: this.model.formModel
          },
          on: {
            "row-click": row => {
              this.model.rowClick(this, row);
            },
            "button-click": (button, row) => {
              button.triggerClick(this, row);
            }
          }
        };
        return <list-grid {...listGridConfig}  style="padding-top:0"/>;
      }
    },
    loading: {
      render(h) {
        return <div style="height: 400px;" />;
      }
    },
    detailBatchForm
  },
  methods: {
    validate() {
      if (this.$refs.component && this.$refs.component.validate) {
        return this.$refs.component.validate();
      }
      return Promise.resolve(true);
    }
  },
  render(h) {
    if (this.model.hidden) {
      return h(false);
    }
    let component = h(false);
    if (this.model.componentRender) {
      // 可替换其他布局
      component = this.model.componentRender(h, {
        props: { model: this.model, isDetail: this.isDetail },
        ref: "component"
      });
    } else {
      component = h(this.model.type, {
        props: { model: this.model, isDetail: this.isDetail },
        ref: "component"
      });
    }
    const directives = [
      { name: 'loading', value: this.model.type === "loading", modifiers: { lock: true } }
    ];
    return (
      <div class="pui-catalog-module" {...{ directives }}>
        <div
          class="pui-catalog-module__title"
          // style={{ backgroundColor: this.isDetail ? "#eef1f5" : "#E0E5ED" }}
        >
          {this.model.title}
        </div>
        <div class="pui-catalog-module__all-type-wrapper">{component}</div>
      </div>
    );
  }
};
</script>
<style lang='scss' scoped>
@import "./catalogModule.scss";
</style>
