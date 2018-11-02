import { CONDITION_TYPE } from "paas-web-utils/rules/enum";
import RelatedInput from "./related-input";
import FileUpload from "./file-upload";
import ImageUpload from "./image-upload";
import BatchUpload from "./batch-upload";
import week from "./week.vue";

export default {
  name: "PuiInputAdaptive",
  componentName: "PuiInputAdaptive",
  components: { RelatedInput, FileUpload, ImageUpload, BatchUpload,week },
  props: {
    column: {},
    value: {},
    conditionType: {},
    batch: Boolean
  },
  computed: {
    condition() {
      if (this.conditionType) {
        for (const key in CONDITION_TYPE) {
          if (CONDITION_TYPE.hasOwnProperty(key)) {
            const element = CONDITION_TYPE[key];
            if (this.conditionType == element.value) {
              return element.type || "";
            }
          }
        }
      }
      return "";
    },
    itemType() {
      let itemType = this.column.type.val;
      let condition = this.condition;
      if (this.batch) {
        switch (itemType) {
          case "checkbox":
          case "radio":
          case "radioGroup":
          case "checkboxGroup":
          case "select":
            itemType = "select";
            break;
          case "textArea":
          case "input":
            itemType = "input";
            break;
          case 'file':
          case 'image':
            itemType = "batchUpload";
            break;
        }
      }
      return `${itemType}${condition}`;
    }
  },
  watch: {
    value(val) {
      // 改变内容重写显示数据
      if(this.column.isDict){
        let values = String(val).split(",");
        let showValues = [];
          for (const value of values) {
            let dist = this.column.datasource.loadVal(value);
            if(dist){
              showValues.push(dist.then(function(dictObj){
                return dictObj.dictName
              }))
            }
          }
          Promise.all(showValues).then((values) => {
            this.column.triggerShowValueChanage(values.join(","))
          });
      }
      if (this.currentValue !== val) {
        this.currentValue = val;
        // 内容改变
        this.changeEmit();
      }
    },
    column() {
      if (this.$dictWatchFn) {
        this.$dictWatchFn();
        delete this.$dictWatchFn;
      }
      this.initDictWatch();
    }
  },
  data() {
    return {
      options: [],
      currentValue: this.value
    };
  },
  created() {
    this.initDictWatch();
  },
  methods: {
    inputEmit(val) {
      if (val instanceof Array) {
        val = val.join(",");
      }
      this.$emit("input", val);
    },
    changeEmit() {
      if (this.$refs.selectInstance) {
        this.$refs.selectInstance.dispatch('AuiFormItem', 'aui.form.blur', [this.currentValue]);
      }
      if (this.$refs.radioGroupInstance) {
        this.$refs.radioGroupInstance.dispatch('AuiFormItem', 'aui.form.blur', [this.currentValue]);
      }
      this.$emit("change", this.currentValue);
      console.log(`【${this.column.label}】数据改变: `, this.currentValue, this);
    },
    initDictWatch() {
      // 字典字段
      if (this.column.isDict) {
        this.$dictWatchFn = this.$watch("column.datasource.reload", val => {
          if (val) {
            this.dictLoading();
            this.$set(this.column.datasource, "reload", false);
          }
        });
        this.dictLoading();
      }
    },
    dictLoading() {
      this.column.datasource.loading().then(res => {
        this.options.splice(0, this.options.length);
        (res || []).forEach(element => {
          this.$set(this.options, this.options.length, element);
        });
      });
    }
  },
  render(h) {
    let dynamic = <span />;
    let append = h(false);
    let config = {
      props: {
        value: this.currentValue,
        placeholder: this.column.placeholder,
        disabled: this.column.readonly
      },
      on: {
        input: this.inputEmit
      }
    };
    if (this.column.componentRender) {
      return this.column.componentRender(h, config);
    }
    switch (this.itemType) {
      case "textArea":
        dynamic = <aui-input type="textarea" rows={4} {...config} />;
        break;
      case "money":
        dynamic = <pui-money {...config} column={this.column}/>;
        break;
      case "file":
        config.props['action'] = this.column.datasource.action;
        config.props['accept'] = this.column.datasource.accept;
        config.props['multiple'] = this.column.datasource.multiple;
        dynamic = (<FileUpload {...config}></FileUpload>);
        break;
      case "image":
        config.props['action'] = this.column.datasource.action;
        config.props['accept'] = this.column.datasource.accept;
        config.props['multiple'] = this.column.datasource.multiple;
        dynamic = (<ImageUpload {...config}></ImageUpload>);
        break;
      case "batchUpload":
        config.props['datasource'] = this.column.datasource;
        config.props['title'] = this.column.label;
        config.props['type'] = this.column.type.val;
        dynamic = <BatchUpload {...config}>{this.column.label}</BatchUpload>
        break;
      case "radio":
        dynamic = <aui-input {...config} />;
        break;
      case "radioGroup":
        dynamic = (
          <aui-radio-group {...config} ref="radioGroupInstance">
            {this._l(this.options, option => {
              return <aui-radio style="top:-5px" label={option.value}>{option.label}</aui-radio>;
            })}
          </aui-radio-group>
        );
        break;
      case "checkbox":
        dynamic = <aui-input {...config} />;
        break;
      case "checkboxGroup":
        config.props.value = this.currentValue ? this.currentValue.split(",") : [];
        dynamic = (
          <aui-checkbox-group {...config}>
            {this._l(this.options, option => {
              return (
                <aui-checkbox label={option.value}>{option.label}</aui-checkbox>
              );
            })}
          </aui-checkbox-group>
        );
        break;
      case "month":
      case "year-month":
        dynamic = <aui-date-picker {...config} type="month" value-format="timestamp" />;
        break;
      case "year":
        dynamic = <aui-date-picker {...config} type="year" value-format="timestamp" />;
        break;
      case "week":
        config.props.value = this.currentValue?new Date(this.currentValue):undefined;
        dynamic = <week {...config}/>;
        break;
      case "time":
        let pickerOptions = {
          selectableRange: '00:00:00 - 23:59:59',
        }
        dynamic = <aui-time-picker {...config} picker-options={pickerOptions} value-format="timestamp" format='HH:mm'/>;
        break;
      case "monthDay":
        dynamic = (
          <aui-date-picker
            {...config}
            format="MM-dd"
            value-format="timestamp"
          />
        );
        break;
      case "date":
        dynamic = (
          <aui-date-picker
            {...config}
            format="yyyy-MM-dd"
            value-format="timestamp"
          />
        );
        break;
      case "datetime":
        dynamic = (
          <aui-date-picker
            type="datetime"
            {...config}
            value-format="timestamp"
            format="yyyy-MM-dd HH:mm"
          />
        );
        break;
      case "datetimeSelect":
        config.props.value = this.currentValue ? this.currentValue.split(",") : [];
        dynamic = (
          <aui-date-picker
            type="daterange"
            {...config}
            value-format="timestamp"
            format="yyyy-MM-dd"
          />
        );
        break;
      case "datetimeRegion":
        dynamic = (
          <aui-select {...config} clearable>
            <aui-option label="今天" value={1} />
            <aui-option label="昨天" value={2} />
            <aui-option label="明天" value={3} />
            <aui-option label="本周" value={4} />
            <aui-option label="上周" value={5} />
            <aui-option label="本月" value={6} />
            <aui-option label="上月" value={7} />
            <aui-option label="本年" value={8} />
            <aui-option label="上年" value={9} />
          </aui-select>
        );
        break;
      case "color":
        dynamic = <aui-color-picker {...config} show-alpha />;
        break;
      case "select":
        if (this.column.isMultiple) {
          config.props.value = this.currentValue ? this.currentValue.split(",") : [];
        }
        dynamic = (
          <aui-select {...config} multiple={this.column.isMultiple} ref="selectInstance">
            {this._l(this.options, option => {
              return <aui-option label={option.label} value={option.value} key={'option-' + option.value} />;
            })}
          </aui-select>
        );
        break;
      case "dataFkSelect":
      case "dataSelect":
        dynamic = (
          <pui-data-selection
            {...config}
            column={this.column}
            multiple={this.column.isMultiple}
          />
        );
        break;
      case "userSelect":
        dynamic = (
          <pui-user-selection {...config} column={this.column} multiple={this.column.isMultiple} />
        );
        break;
      case "deptSelect":
        dynamic = <pui-dept-selection {...config} />;
        break;
      case "address":
        dynamic = <pui-address {...config} />;
        break;
        case "input":
        if (this.column.unit) {
          append = <template slot="append">{this.column.unit}</template>;
        }
        dynamic = <aui-input {...config} clearable={!this.column.readonly}>{append}</aui-input>;
        break;
      // case "numberPercent":
      //   config.props.value = Number(this.currentValue) * 100
      //   config.on.input = val => {
      //     this.currentValue = Number(val) / 100
      //   }
      //   let append = <template slot="append">%</template>;
      //   dynamic = <aui-input-number {...config} controls={false}>{append}</aui-input-number>;
      //   break;
      case "relatedInput":
      default:
        dynamic = <aui-input {...config} />;
        break;
    }
    return dynamic;
  }
};
