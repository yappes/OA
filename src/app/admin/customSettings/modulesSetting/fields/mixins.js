import { constraintService } from "paas-web-utils/services";

const config = {
  data() {
    return { formRefName: "form" };
  },
  computed: {
    curModuleId() {
      return this.$store.getters['modulesSetting/curModuleId'];
    }
  },
  methods: {
    submitForm() {
      let form = this.$refs[this.formRefName];
      let model = form.model;
      let params = {
        column : Object.assign({}, model, {moduleId: this.curModuleId})
      };//model与moduleId合并成column 

      if(model.hasOwnProperty("moduleRelated")){//外键需要把关联模块对象抽出成平级
        params['moduleRelated'] = model.moduleRelated;
        delete params.column.moduleRelated;
      }
      console.info(params)
      form.validate(valid => {
        if (valid) {
          //通知fieldForm进行数据持久化
          this.$emit("formPersistence", params, function() {
            //调用fieldForm的持久化成功后form数据恢复初始化状态
            form.resetFields();
          });
        } else {
          return false;
        }
      });
    },
    addBusListener() {
      this.$root.Bus.$on("fieldForm-Submit", () => {
        if (this.$parent.active === true) {
          this.submitForm();
        }
      });
    },
    getConstraints(){
      var params = {
        constraintIdList: null
      };
      constraintService.findConstraints(params).then(res => {
        this.colConstraintOpt = res;
      });
    }
  }
};
export default config;
