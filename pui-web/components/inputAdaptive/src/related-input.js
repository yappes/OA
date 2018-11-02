export default {
  name: "RelatedInput",
  componentName: "RelatedInput",
  props: {
    value: {},
    placeholder: {},
    disabled: Boolean,
    column: Object
  },
  data() {
    return {
      currentValue: undefined,
      showValue: undefined,
      dataRelationColumn: undefined,
    };
  },
  watch: {
    value(val) {
      if (this.currentValue === val) return;
      this.currentValue = val;
      this.showValue = this.formatValue(val) || val;
    }
  },
  mounted() {
    this.currentValue = this.value;
    this.column.dataRelationColumn().then((column) => {
      this.dataRelationColumn = column;
      this.initColumn = true;
      this.showValue = this.formatValue(this.currentValue) || this.currentValue;
    });
  },
  methods: {
    formatValue(val) {
      if (!this.initColumn) return;
      if (this.dataRelationColumn && this.dataRelationColumn.type.format) {
        let value = this.dataRelationColumn.type.format(val);
        if (value) {
          return value;
        }
      } else {
        switch (this.column.view.type) {
          case 'insert':
          case 'update':
            let group = this.column.view.findViewGroupByColumnId(this.column.$id);
            if (group) {
              val = group.formModel[this.column.showValKey];
            }
            break;
          case 'batchFormRow':
            val = this.column.view.formModel[this.column.showValKey];
            break;
        }
      }
      return val;
    }
  },
  render(h) {
    let config = {
      props: {
        value: this.showValue,
        disabled: this.disabled,
        placeholder: this.placeholder
      }
    };
    return (<aui-input { ...config}/>);
  }
};
