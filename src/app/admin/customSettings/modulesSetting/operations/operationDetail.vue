<template>
  <div class="pui-operation-detail" v-loading="loading">
    <div class="content">
      <aui-form :model="form" :rules="rules" ref="form" label-width="130px" class="form">
        <pui-col>
          <aui-form-item label="操作名称" prop="operationName">
            <aui-input v-model="form.operationName" placeholder="请输入操作名称"></aui-input>
          </aui-form-item>
        </pui-col>
        <pui-col>
          <aui-form-item label="排序" prop="sort">
            <aui-input v-model="form.sort" placeholder="请输入"></aui-input>
          </aui-form-item>
        </pui-col>
        <pui-col>
          <aui-form-item label="目标页面" prop="selectViewName">
            <aui-input v-model="form.selectViewName" @click.native="openActiveView" disabled></aui-input>
          </aui-form-item>
        </pui-col>
        <pui-col>
          <aui-form-item label="关联页面" prop="viewId">
            <aui-select v-model="form.viewId" @click.native="openView" multiple @remove-tag="removeTag">
              <aui-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </aui-option>
            </aui-select>
          </aui-form-item>
        </pui-col>
        <pui-col>
          <aui-form-item label="状态">
            <aui-radio v-model="form.status" :label="0">启用</aui-radio>
            <aui-radio v-model="form.status" :label="1">禁用</aui-radio>
          </aui-form-item>
        </pui-col>
        <pui-col>
          <aui-form-item label="描述" prop="description">
            <aui-input type="textarea" :rows="2" v-model="form.description" placeholder="请输入模块描述"></aui-input>
          </aui-form-item>
        </pui-col>
      </aui-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <aui-button :plain="true" @click="cancel">取 消</aui-button>
      <aui-button type="primary" @click="submitForm('form')">确定</aui-button>
    </div>
    <choose-view :isVisible="chooseViewShow" :viewType="viewType" :selectedData="form.viewId" @closeDialog="closeChooseView" @getActiveViewMore="getActiveViewMore"></choose-view>
    <choose-active-view :isVisible="chooseActiveViewShow" :viewType="viewType" @closeDialog="closeChooseActiveView" @getActiveView="getActiveView"></choose-active-view>
  </div>
</template>
<script>
import ChooseView from "./chooseView";
import ChooseActiveView from "./chooseActiveView";
import { viewService } from "paas-web-utils/services";
import { operationService } from "paas-web-utils/services";
export default {
  name: "OperationDetail",
  components: {
    ChooseView,
    ChooseActiveView
  },
  props: {
    editRow: {
      type: Object,
      default: {}
    }
  },
  data() {
    //排序正则验证
    var checkOrder = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入排序内容"));
      } else {
        var myreg = /^[0-9]{1,9}$/;
        if (!myreg.test(value)) {
          callback(new Error("排序内容为数字"));
        } else {
          callback();
        }
      }
    };
    return {
      loading:false,
      options:[],
      viewType: "detail",
      chooseViewShow: false,
      chooseActiveViewShow: false,
      selectViewMoreName1: [],
      rules: {
        operationName: [
          { required: true, message: "请输入操作名称", trigger: "blur" },
          { min: 2, max: 15, message: "长度在 2 到 15 个字符", trigger: "blur" }
        ],
        sort: { required: true, validator: checkOrder, trigger: "blur" },
        selectViewName: {
          required: true,
          message: "请选择目标页面",
          trigger: "change"
        },
        viewId: {
          required: true,
          message: "请选择关联页面",
          trigger: "change"
        }
      },
      form: {
        batchType: "UPDATE",
        batchUpdateViewId: 1,
        description: "",
        flag: 0,
        flushType: "",
        followType: 1,
        forwardVid: null,
        iconClass: "",
        moduleId: null,
        operationName: "",
        operationPosition: 1,
        operationType: 1,
        ruleId: 1,
        sort: null,
        status: 0,
        submitDataType: "",
        submitType: null,
        submitUrl: "url",
        type: 4,
        viewId: [],
        selectViewName: "",
        selectViewMoreName: []
      }
    };
  },
  methods: {
    //提交表单数据
    submitForm(formName) {
      let form = this.$refs[formName];
      form.validate(valid => {
        if (valid) {
          let params = this.form;
          params.sort = parseInt(params.sort);
          this.$emit("submitFormData", params);
          this.initForm();
        } else {
          return false;
        }
      });
    },
    //关闭对话框
    cancel() {
      this.initForm();
      this.$emit("cancel", this.$refs.form.resetFields());
      this.selectViewMoreName1 = [];
    },
    closeChooseView() {
      this.chooseViewShow = false;
    },
    closeChooseActiveView() {
      this.chooseActiveViewShow = false;
    },
    //初始化表单数据
    initForm() {
      this.form = {
        batchType: "UPDATE",
        batchUpdateViewId: 1,
        description: "",
        flag: 0,
        flushType: "",
        followType: 1,
        forwardVid: null,
        iconClass: "",
        moduleId: null,
        operationName: "",
        operationPosition: 1,
        operationType: 1,
        ruleId: 1,
        sort: null,
        status: 0,
        submitDataType: "",
        submitType: null,
        submitUrl: "url",
        type: 4,
        viewId: [],
        selectViewName: "",
        selectViewMoreName: []
      };
    },
    //打开选择视图
    openView() {
      this.chooseViewShow = true;
    },
    openActiveView() {
      this.chooseActiveViewShow = true;
    },
    //目标页面单选数据
    getActiveView(selectView) {
      this.form.forwardVid = selectView.id;
      this.form.selectViewName = selectView.viewName;
    },
    //关联页面多选数据
    getActiveViewMore(selectViewData) {
      selectViewData.forEach(v => {
        // if (this.selectViewMoreName1.indexOf(v.viewName) == -1) {
        if (this.form.viewId.indexOf(v.id) == -1) {
          // this.form.viewId.push(v.id);
          this.selectViewMoreName1.push(v.viewName);
          // this.options.push({label:v.viewName,value:v.id});
        }
      });
      this.options = selectViewData.map(e=> {
        return {
          label: e.viewName,
          value: e.id,
        }
      })
      this.form.viewId = selectViewData.map(e => {
        return e.id
      })
      this.$refs.form.validateField('viewId')
      this.form.selectViewMoreName = this.selectViewMoreName1;
    },
    //关联页面多选删除
    removeTag(activeTag) {
      // let index = this.selectViewMoreName1.indexOf(activeTag);
      // this.selectViewMoreName1.splice(index, 1);
      // this.form.viewId.splice(index, 1);
      this.options = this.options.filter(e => {
        return e.value !== activeTag
      })
    }
  },
  created() {
    if (this.editRow) {
      this.loading = true;
      operationService
        .findOperationDetail({ id: this.editRow.id })
        .then(data => {
          this.form.batchType = data.batchType;
          this.form.batchUpdateViewId = data.batchUpdateViewId;
          this.form.description = data.description;
          this.form.flag = data.flag;
          this.form.flushType = data.flushType;
          this.form.followType = data.followType;
          this.form.forwardVid = data.forwardVid;
          this.form.iconClass = data.iconClass;
          this.form.moduleId = data.moduleId;
          this.form.operationName = data.operationName;
          this.form.operationPosition = data.operationPosition;
          this.form.operationType = data.operationType;
          this.form.ruleId = data.ruleId;
          this.form.sort = data.sort;
          this.form.status = data.status;
          this.form.submitDataType = data.submitDataType;
          this.form.submitType = data.submitType;
          this.form.submitUrl = data.submitUrl;
          this.form.type = data.type;
          this.form.viewId = data.viewId;
          if (this.form.forwardVid) {
            let params = {
              id: this.form.forwardVid,
              isOwnItem: false
            };
            viewService.findViewById(params).then(data => {
              this.form.selectViewName = data.viewName;
            });
          }
          if (this.form.viewId) {
            this.form.viewId = this.form.viewId.split(",");
            for (let i = this.form.viewId.length - 1; i > -1; i--) {
              if (!this.form.viewId[i]) {
                this.form.viewId.splice(i, 1);
              } else {
                this.form.viewId[i] = Number(this.form.viewId[i]);
              }
            }
            let viewList = [];
            viewList = this.form.viewId.map(function(data) {
              return +data;
            });
            let reqViewList = [];
            viewList.forEach(v => {
              if ((v != 0) & (v != "")) {
                reqViewList.push(v);
              }
            });
            let params = {
              moduleId: this.form.moduleId,
              viewFlag: 0,
              viewTypes: [],
              viewIdList: reqViewList
            };
            viewService.findViewsByModuleId(params).then(data => {
              data.forEach(v => {
                this.selectViewMoreName1.push(v.viewName);
                // this.options.push({ label: v.viewName, value: v.id });
              });
              this.form.selectViewMoreName = this.selectViewMoreName1;
              this.loading = false;
            });
            //设置跳转页面输入框的options
            let promises = []
            this.form.viewId.forEach(id => {
              let p = viewService.findViewById({
                id,
                isOwnItem: false,
              })
              promises.push(p)
            })
            Promise.all(promises).then(datas => {
              this.options = datas.map(e => {
                return {
                  value: e.id,
                  label: e.viewName,
                }
              })
            })
          }
        });
    }
  }
};
</script>
<style lang="scss">
.pui-operation-detail {
  .pui-col {
    .aui-form-item {
      .aui-form-item__content {
        .aui-select {
          .aui-input__suffix {
            display: none;
          }
          .aui-select-dropdown {
            display: none;
          }
          .aui-select__tags {
            span:not(.aui-tag) {
              width: 0;
            }
          }
        }
      }
    }
  }
}
</style>
