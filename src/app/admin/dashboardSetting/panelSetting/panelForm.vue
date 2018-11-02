<template>
  <div class="pui-panel-form">
    <aui-dialog 
    :close-on-click-modal="false"
        :title="dialogTitle" width="40%"
        :visible="isVisible" 
        @hide="handleClose">
      <aui-form :model="form" :rules="rules" ref="form" label-width="130px" class="form" v-loading="loading">
        <aui-form-item label="面板标题" prop="title">
          <aui-input v-model="form.title" placeholder="请输入面板标题"></aui-input>
        </aui-form-item>
        <aui-form-item label="面板类型" prop="type">
          <aui-select v-model="form.type" placeholder="请选择" class="pui-search-select" :disabled="editRow !== null">
            <aui-option v-for="item in typeOpt" :key="item.value" :label="item.label" :value="item.value"></aui-option>
          </aui-select>
        </aui-form-item>
        <aui-form-item label="角色" prop="roleIds">
          <aui-select v-model="form.roleIds" placeholder="请选择" multiple>
            <aui-option v-for="item in roles" :key="item.id" :label="item.roleName" :value="item.id">
            </aui-option>
          </aui-select>
        </aui-form-item>
        <aui-form-item label="面板的最小长度" prop="showMinLength">
          <aui-input-number v-model="form.showMinLength" :min="1" :max="10"></aui-input-number>
        </aui-form-item>
        <aui-form-item label="选择模块" prop="moduleId" v-if="form.type === 'LIST_SIMPLE' || form.type === 'LIST'">
          <aui-select v-model="form.moduleId" filterable placeholder="请选择" @change="changeModule">
            <aui-option  
                v-for="item in modules"
                :key="item.id"
                :label="item.moduleName"
                :value="item.id">
            </aui-option>
          </aui-select>
        </aui-form-item>
        <aui-form-item label="选择视图" prop="viewId" v-if="form.type === 'LIST_SIMPLE' || form.type === 'LIST'">
          <aui-select v-model="form.viewId" filterable placeholder="请选择" @change="changeView">
            <aui-option  
                v-for="item in views"
                :key="item.id"
                :label="item.viewName"
                :value="item.id">
            </aui-option>
          </aui-select>
        </aui-form-item>
        <aui-form-item label="标题字段" prop="titleColumnId" v-if="form.type === 'LIST_SIMPLE'">
          <aui-select v-model="form.titleColumnId" filterable placeholder="请选择">
            <aui-option  
                v-for="item1 in columns"
                :key="item1.id"
                :label="item1.columnName"
                :value="item1.id">
            </aui-option>
          </aui-select>
        </aui-form-item>
        <aui-form-item label="内容字段" prop="contentColumnId" v-if="form.type === 'LIST_SIMPLE'">
          <aui-select v-model="form.contentColumnId" filterable placeholder="请选择">
            <aui-option  
                v-for="item2 in columns"
                :key="item2.id"
                :label="item2.columnName"
                :value="item2.id">
            </aui-option>
          </aui-select>
        </aui-form-item>
        <aui-form-item label="数据源" prop="dataSourceUrl" v-if="form.type === 'CONTENT' || form.type === 'CHART' || form.type === 'LIST_CUSTOM'">
          <aui-input v-model="form.dataSourceUrl" placeholder="请输入数据源"></aui-input>
        </aui-form-item>
        <aui-form-item label="页面地址" prop="viewUrl" v-if="form.type === 'CUSTOM_URL'">
          <aui-input v-model="form.viewUrl" placeholder="请输入页面地址"></aui-input>
        </aui-form-item>
        <aui-form-item label="组件名称" prop="platformName" v-if="form.type === 'CUSTOM_COMPONENT'">
          <aui-input v-model="form.platformName" placeholder="请输入组件名称"></aui-input>
        </aui-form-item>
        <aui-form-item label="自定义文本" prop="content" v-if="form.type === 'CUSTOM_TEXT'">
          <aui-input v-model="form.content" placeholder="请输入组件名称"></aui-input>
        </aui-form-item>
        <aui-form-item label="描述" prop="description">
          <aui-input type="textarea" :rows="2" placeholder="请输入描述信息" v-model="form.description"></aui-input>
        </aui-form-item>
      </aui-form>
      <span slot="footer" class="dialog-footer">
        <aui-button :plain="true"  @click="handleClose">取消</aui-button>
        <aui-button type="primary" @click="addMenu('form')">确定</aui-button> 
      </span>
    </aui-dialog>
  </div>
</template>
<script>
import {dashboardService} from 'paas-web-utils/services';
export default {
  name: "PanelForm",
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    editRow: {
      type: Object,
      default: null,
    }
  },
  data(){
    return {
      loading:false,
      dialogTitle:'新增面板',
      modules:null,
      views:null, 
      columns:null,
      roles:null,
      form:{
        title:'',
        type:null,
        roleIds:null,
        viewId:null,
        moduleId:null,
        titleColumnId:null,
        contentColumnId:null,
        groupColumnIds:null,
        orderColumnId:null,
        orderType:'ASC',
        showMinLength:5,
        viewUrl:'',
        dataSourceUrl:'',
        content:'',
        platformName:'',
        description:'',
      },
      rules:{
        title:{ required: true, message: "请输入面板标题", trigger: "change" },
        type:{ required: true, message: "请选择面板类型", trigger: "change" },
        roleIds:{ required: true, message: "请选择角色", trigger: "change" },
        showMinLength:{ required: true, message: "请输入面板最小长度", trigger: "blur" },
        moduleId:{ required: true, message: "请选择模块", trigger: "change" },
        viewId:{ required: true, message: "请选择视图", trigger: "change" },
        titleColumnId:{ required: true, message: "请输入标题字段", trigger: "change" },
        contentColumnId:{ required: true, message: "请输入内容字段", trigger: "change" },
        dataSourceUrl:{ required: true, message: "请输入数据源", trigger: "blur" },
        viewUrl:{ required: true, message: "请输入页面地址", trigger: "blur" },
        platformName:{ required: true, message: "请输入组件名称", trigger: "blur" },
        content:{ required: true, message: "请输入文本内容", trigger: "blur" },
      },
      typeOpt:[
        {value:'CONTENT',label:'内容'},
        {value:'CHART',label:'图表'},
        {value:'LIST_SIMPLE',label:'列表(简洁)'},
        {value:'LIST',label:'列表(标准)'},
        {value:'LIST_CUSTOM',label:'列表(自定义)'},
        {value:'CUSTOM_URL',label:'自定义(链接)'},
        {value:'CUSTOM_COMPONENT',label:'自定义(组件)'},
        {value:'CUSTOM_TEXT',label:'文本'},
      ],
    }
  },
  methods:{
    //新增面板
    addMenu(formName){
      let form = this.$refs[formName];
      form.validate(valid=>{
        if(valid){
          if(this.editRow){
            let params = this.form;
            this.$set(params,'id',this.editRow.id)
            dashboardService.editPanel(params).then(data=>{
              console.log('编辑成功')
              this.handleClose();
            })
          }else{
            let params = this.form;
            dashboardService.addPanel(params).then(data=>{
              console.log('新增成功')
              this.handleClose();
            })
          }
        }else{
          return false
        }
      })
    },
    //关闭对话框
    handleClose(){
      this.$emit('closeDialog');
      this.$emit('initView');
      this.$refs.form.resetFields();
    },
    //查询角色信息
    findRoles() {
      let params = { roleIds: "" };
      dashboardService.findRoles(params).then(data => {
        this.roles = data;
      });
    },
    //查询模块集合
    findModules(){
      let parame = {
        "moduleIds": [],
        "isRelated": 0,
        "isEqModuleId": true,
        "isCustom":1,
        "isDelete" : 0
      }
      dashboardService.findModules(parame).then(data=>{
        this.modules = data;
      })
    },
    //改变模块选择更新视图数据
    changeModule(){
      this.findViews();
      this.form.viewId = null;
      this.form.titleColumnId = null;
      this.form.contentColumnId = null;
    },
    //查询视图集合
    findViews(){
      let params = {
        "moduleId": this.form.moduleId,
        "viewFlag":0,
        "viewTypes": [1]
      }
      dashboardService.findViews(params).then(data=>{
        this.views = data
      })
    },
    //改变视图选择更新字段数据
    changeView(){
      this.findColumns();
      this.form.titleColumnId = null;
      this.form.contentColumnId = null;
    },
    //查询字段集合
    findColumns(){
      let params = {
        "viewId":this.form.viewId
      }
      dashboardService.findColumns(params).then(data=>{
        this.columns = data;
      })
    }
  },
  created(){
    this.findRoles();
    if(this.editRow){
      this.loading = true;
      this.dialogTitle = '编辑面板';
      let params = {
        panelId:this.editRow.id,
      }
      dashboardService.findPanelDetail(params).then(data=>{
        this.form.title = data.title;
        this.form.type = data.type;
        this.form.roleIds = data.roleIds;
        this.form.groupColumnIds = data.groupColumnIds;
        this.form.orderColumnId = data.orderColumnId;
        this.form.viewUrl = data.viewUrl;
        this.form.dataSourceUrl = data.dataSourceUrl;
        this.form.content = data.content;
        this.form.platformName = data.platformName;
        this.form.description = data.description;
        this.form.showMinLength = data.showMinLength;
        if(data.moduleId){
          let promise = undefined;
          let parameModule = {
            "moduleIds": [],
            "isRelated": 0,
            "isEqModuleId": true,
            "isCustom":1,
            "isDelete" : 0
          }
          let parameView = {
            "moduleId": data.moduleId,
            "viewFlag":0,
            "viewTypes": []
          }
          promise = Promise.all([
            dashboardService.findModules(parameModule),
            dashboardService.findViews(parameView),
          ])
          promise.then(res=>{
            this.modules = res[0];
            this.views = res[1];
            this.form.moduleId = data.moduleId;
            if(data.viewId){
              dashboardService.findViewById({id:data.viewId}).then(viewDetail=>{
                if(viewDetail.viewName){
                  this.form.viewId = data.viewId;
                  dashboardService.findColumns({"viewId":data.viewId}).then(columnData=>{
                    this.columns = columnData;
                    this.form.titleColumnId = data.titleColumnId;
                    this.form.contentColumnId = data.contentColumnId;
                    this.loading = false;
                  })
                }else{
                  this.form.viewId = null;
                  this.loading = false;
                }
              })
            }else{
              this.form.viewId = null;
              this.loading = false;
            }
          })
        }else{
          this.form.moduleId = null;
          this.loading = false;
        }
      })
    }else{
      this.findModules();
    }
  },
}
</script>
<style lang="scss" scoped>

</style>


