<template>
  <div class="pui-edit-menu">
    <aui-dialog 
    :close-on-click-modal="false"
        title="修改菜单信息" width="40%"
        :visible="isVisible" 
        @hide="handleClose">
      <aui-form :model="editMenu" :rules="rules" ref="form" label-width="100px" class="pui-edit-menu__form" v-loading="loading">
        <aui-form-item label="菜单名称" prop="menuName">
          <aui-input v-model="editMenu.menuName" class="pui-edit-menu-input" placeholder="请输入名称"></aui-input>
        </aui-form-item>
        <aui-form-item label="排序" prop="menuOrder">
          <aui-input v-model="editMenu.menuOrder" class="pui-add-menu-input" placeholder="请输入"></aui-input>
        </aui-form-item>
        <aui-form-item label="选择模块" prop="moduleId">
          <aui-select v-model="editMenu.moduleId" filterable placeholder="请选择" @change="findViews">
            <aui-option  
                v-for="item in modules"
                :key="item.id"
                :label="item.moduleName"
                :value="item.id">
            </aui-option>
          </aui-select>
        </aui-form-item>
        <aui-form-item label="选择视图" prop="viewId">
          <aui-select v-model="editMenu.viewId" filterable placeholder="请选择">
            <aui-option  
                v-for="item in views"
                :key="item.id"
                :label="item.viewName"
                :value="item.id">
            </aui-option>
          </aui-select>
        </aui-form-item>
        <aui-form-item label="菜单样式">
          <aui-input v-model="editMenu.iconClass" disabled @click.native="chooseIcon"></aui-input>
        </aui-form-item>
        <aui-form-item label="菜单颜色">
          <aui-input v-model="editMenu.iconColor" type="color"></aui-input>
        </aui-form-item>
        <aui-form-item label="是否启用">
          <aui-radio v-model="editMenu.isEnable" :label="1">启用</aui-radio>
          <aui-radio v-model="editMenu.isEnable" :label="0">禁用</aui-radio>
        </aui-form-item>
        <aui-form-item label="菜单描述">
          <aui-input type="textarea" v-model="editMenu.menuDesc" class="pui-edit-menu-input" placeholder="请输入模块描述"></aui-input>
        </aui-form-item>
      </aui-form>
      <span slot="footer" class="dialog-footer">
        <aui-button :plain="true"  @click="handleClose">取消</aui-button>
        <aui-button type="primary" @click="addMenu('form')">确定</aui-button> 
      </span>
    </aui-dialog>
    <choose-icon v-if="iconShow" :iconShow="iconShow" @closeIcon="closeIcon" @getIconClass="getIconClass"></choose-icon>
  </div>
</template>
<script>
import {menuService} from 'paas-web-utils/services'
import ChooseIcon from './chooseIcon'
export default {
  name: "EditMenu",
  components:{ChooseIcon},
  data(){
    //排序正则验证
    var checkOrder = (rule, value, callback) => {
      if(!value){
        callback(new Error('请输入排序内容'));
      }else{
        var myreg=/^[0-9]{1,9}$/;  
        if (!myreg.test(value)) {  
          callback(new Error('排序内容为数字')); 
        } else {  
          callback();  
        }  
      }
    };
    return{
      loading:true,
      editMenu:{
        "id": null,
        "menuName":"", 
        "menuDesc":"", 
        "menuGroup":null, 
        "parentId":null, 
        "iconClass":"aIcon aIcon-wode", 
        "isEnable":1, 
        "menuOrder":null, 
        "viewId":null, 
        "sourceType":null,
        "iconColor":"", 
        "moduleId":null,
      },
      rules:{
        menuName:{ required: true, message: "请输入菜单名称", trigger: "blur" },
        menuOrder:{ required: true, validator: checkOrder, trigger: 'blur'},
        moduleId:{ required: true, message: "请选择模块", trigger: "change" },
        viewId:{ required: true, message: "请选择视图", trigger: "change" },
      },
      modules:[],
      views:[],
      iconShow:false,
    }
  },
  props:{
    isVisible: {
      type: Boolean,
      default: false
    },
    editData:{
      type:Object,
    },
  },
  methods:{
    //查询模块集合
    findModules(){
      let parame = {
        "moduleIds": [],
        "isRelated": 0,
        "isEqModuleId": true,
        "isCustom":1,
        "isDelete" : 0
      }
      menuService.findModules(parame).then(data=>{
        this.modules = data;
      })
    },
    //查询视图集合
    findViews(){
      let parame = {
        "moduleId": this.editMenu.moduleId,
        "viewFlag":0,
        "viewTypes": []
      }
      menuService.findViews(parame).then(data=>{
        this.views = data
        this.editMenu.viewId = null
      })
    },
    //保存菜单
    addMenu(formName){
      let form = this.$refs[formName];
      form.validate(valid=>{
        if(valid){
          let parame = this.editMenu;
          menuService.editMenu(parame).then(data=>{
            console.log('修改成功');
            this.handleClose();
            this.$emit('initView');
          })
        }else{
          return false
        }
      })
    },
    //选择图标
    chooseIcon(){
      this.iconShow = true;
    },
    //获取图标信息
    getIconClass(iconInfo){
      this.editMenu.iconClass = iconInfo;
    },
    //取消 关闭对话框
    handleClose(){
      this.$emit('closeDialog');
      this.$refs.form.resetFields();
    },
    closeIcon(){
      this.iconShow = false;
    },
  },
  created(){
      menuService.findMenuDetail({menuId:this.editData.id}).then(data=>{
        this.editMenu.id = data.id;
        this.editMenu.menuName = data.menuName;
        this.editMenu.menuDesc = data.menuDesc;
        this.editMenu.menuGroup = data.menuGroup;
        this.editMenu.parentId = data.parentId;
        this.editMenu.iconClass = data.iconClass;
        this.editMenu.isEnable = data.isEnable;
        this.editMenu.menuOrder = data.menuOrder;
        this.editMenu.sourceType = data.sourceType;
        this.editMenu.iconClass = data.iconClass;
        this.editMenu.iconColor = data.iconColor;
        // 模块 视图回填
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
            menuService.findModules(parameModule),
            menuService.findViews(parameView),
          ])
          promise.then(res=>{
            this.modules = res[0];
            this.views = res[1];
            this.editMenu.moduleId = data.moduleId;
            if(data.viewId){
              menuService.findViewById({id:data.viewId}).then(viewDetail=>{
                if(viewDetail.viewName){
                  this.editMenu.viewId = data.viewId;
                }else{
                  this.editMenu.viewId = null;
                }
                this.loading = false;
              })
            }else{
              this.form.viewId = null;
                this.loading = false;
            }
          })
        }else{
          this.editMenu.moduleId = null;
        }
        
        
      })
  },
  mounted(){
    
  }
}
</script>
<style lang="scss" scoped>
// .pui-edit-menu-input{
  // width: 170px;
// }
.pui-edit-menu {
  & .pui-edit-menu__form {
    padding: 0px 9% 0px 3%;
    min-width: 300px;
  }
}
</style>

       
        