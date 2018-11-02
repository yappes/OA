<template>
  <div class="pui-add-menu">
    <aui-dialog 
    :close-on-click-modal="false"
        title="新增菜单" width="40%"
        :visible="isVisible" 
        @hide="handleClose">
      <aui-form :model="newMenu" ref="form" :rules="rules" label-width="100px" class="pui-add-menu__form">
        <aui-form-item label="菜单名称" prop="menuName">
          <aui-input v-model="newMenu.menuName" class="pui-add-menu-input" placeholder="请输入名称"></aui-input>
        </aui-form-item>
        <aui-form-item label="排序" prop="menuOrder">
          <aui-input v-model="newMenu.menuOrder" class="pui-add-menu-input" placeholder="请输入"></aui-input>
        </aui-form-item>
        <aui-form-item label="选择模块" prop="moduleId">
          <aui-select v-model="newMenu.moduleId" filterable placeholder="请选择" @change="findViews">
            <aui-option  
                v-for="item in modules"
                :key="item.id"
                :label="item.moduleName"
                :value="item.id">
            </aui-option>
          </aui-select>
        </aui-form-item>
        <aui-form-item label="选择视图" prop="viewId">
          <aui-select v-model="newMenu.viewId" filterable placeholder="请选择">
            <aui-option  
                v-for="item in views"
                :key="item.id"
                :label="item.viewName"
                :value="item.id">
            </aui-option>
          </aui-select>
        </aui-form-item>
        <aui-form-item label="菜单样式">
          <aui-input v-model="newMenu.iconClass" disabled @click.native="chooseIcon"></aui-input>
        </aui-form-item>
        <aui-form-item label="菜单颜色">
          <aui-input v-model="newMenu.iconColor" type="color"></aui-input>
          <!-- <aui-color-picker v-model="newMenu.iconColor"></aui-color-picker> -->
        </aui-form-item>
        <aui-form-item label="是否启用">
          <aui-radio v-model="newMenu.isEnable" :label="1">启用</aui-radio>
          <aui-radio v-model="newMenu.isEnable" :label="0">禁用</aui-radio>
        </aui-form-item>
        <aui-form-item label="菜单描述">
          <aui-input type="textarea" v-model="newMenu.menuDesc" class="pui-add-menu-input" placeholder="请输入模块描述"></aui-input>
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
import {menuService} from 'paas-web-utils/services';
import { mapGetters, mapActions } from "vuex";
import ChooseIcon from './chooseIcon'
export default {
  name: "AddMenu",
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
      newMenu:{
        "menuName":"", 
        "menuDesc":"", 
        "menuGroup":null, 
        "parentId":0, 
        "iconClass":"", 
        "isEnable":1, 
        "menuOrder":'', 
        "viewId":'', 
        "sourceType":0, 
        "iconColor":"#fff", 
        "moduleId":'',
      },
      rules:{
        menuName: { required: true, message: "请输入菜单名称", trigger: "blur" },
        menuOrder:{ required: true, validator: checkOrder, trigger: 'blur'},
        moduleId:{ required: true, message: "请选择模块", trigger: "change" },
        viewId:{ required: true, message: "请选择视图", trigger: "change" },
      },
      modules:null,
      views:null,
      iconShow:false,
    }
  },
  props:{
    isVisible: {
      type: Boolean,
      default: false
    },
  },
  computed:mapGetters({
    parentId: "menuSetting/parentId",
  }),
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
        "moduleId": this.newMenu.moduleId,
        "viewFlag":0,
        "viewTypes": []
      }
      menuService.findViews(parame).then(data=>{
        this.views = data
        this.newMenu.viewId = null
      })
    },
    //保存菜单
    addMenu(formName){
      let form = this.$refs[formName];
      form.validate(valid=>{
        if(valid){
          this.newMenu.parentId = this.parentId;
          let parame = this.newMenu;
          menuService.addMenu(parame).then(data=>{
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
      this.newMenu.iconClass = iconInfo;
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
    this.findModules();
  },
  mounted(){
    
  }
}
</script>
<style lang="scss" scoped>
// .pui-add-menu-input{
  // width: 170px;
// }
.pui-add-menu {
  .pui-add-menu__form {
    padding: 0px 9% 0px 3%;
    min-width: 300px;
  }
}
</style>

       
        