<template>
    <div class="main-right-menu">
      <div class="main-right-menu-top">
        <span class="main-right-menu-top-title">一级菜单配置</span>
        <p class="main-right-menu-top-ctrl">
          <i class="aui-icon-plus" style="cursor:pointer" @click="openAddFirst"></i>
        </p>
      </div>
      <aui-input v-model="searchVal" @keyup.enter.native="enterKeyEvent()" size="medium" clearable class="pui-list-grid__fuzzy-search" placeholder="请输入一级菜单名称" prefix-icon="aui-icon-search">
      </aui-input>
      <div class="main-right-mobile-menu-list" :style="{height:treeHeight}">
        <ul>
          <li v-for="(item,index) in listData" :key="index" class="main-right-dictionary-list-option" :class="{ bgColor:active == index }"
            @click="selectDic(index)">
            <span class="ellipsis">{{item.menuName}}</span> 
            <span class="btn-ctrl">
              <i class="aui-icon-edit icon" @click.stop="editInfo(item)"></i>
              <i class="aui-icon-delete icon" @click.stop="handleDelete(item)"></i>
            </span>
          </li>
        </ul>
      </div>
      <aui-dialog
      :close-on-click-modal="false" 
        title="新增菜单"
        width="40%" 
        :visible="addShow" 
        v-if="addShow"
        append-to-body
        @hide="closeAddShow">
        <aui-form :model="newMenu" :rules="rules" ref="form" label-width="100px" class="pui-edit-menu__form">
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
          <aui-form-item label="是否启用">
            <aui-radio-group v-model="newMenu.isEnable">
              <aui-radio :label="1">启用</aui-radio>
              <aui-radio :label="0">禁用</aui-radio>
            </aui-radio-group>
          </aui-form-item>
          <aui-form-item label="菜单描述">
            <aui-input type="textarea" v-model="newMenu.menuDesc" class="pui-add-menu-input" placeholder="请输入模块描述"></aui-input>
          </aui-form-item>
        </aui-form>
        <span slot="footer" class="dialog-footer">
          <aui-button :plain="true" @click="closeAddShow">取消</aui-button>
          <aui-button type="primary" @click="addMenu('form')">确定</aui-button> 
        </span>
      </aui-dialog>
      <aui-dialog 
      :close-on-click-modal="false"
        title="编辑菜单"
        width="40%" 
        :visible="editShow" 
        v-if="editShow"
        append-to-body
        @hide="closeEditShow">
        <aui-form :model="editMenu" :rules="rules" ref="form" label-width="100px" class="pui-edit-menu__form">
          <aui-form-item label="菜单名称" prop="menuName">
            <aui-input v-model="editMenu.menuName" class="pui-add-menu-input" placeholder="请输入名称"></aui-input>
          </aui-form-item>
          <aui-form-item label="排序" prop="menuOrder">
            <aui-input v-model="editMenu.menuOrder" class="pui-add-menu-input" placeholder="请输入"></aui-input>
          </aui-form-item>
          <aui-form-item label="选择模块" prop="moduleId">
            <aui-select v-model="editMenu.moduleId" placeholder="请选择" @change="findViews">
              <aui-option  
                  v-for="item in modules"
                  :key="item.id"
                  :label="item.moduleName"
                  :value="item.id">
              </aui-option>
            </aui-select>
          </aui-form-item>
          <aui-form-item label="选择视图" prop="viewId">
            <aui-select v-model="editMenu.viewId" placeholder="请选择">
              <aui-option  
                  v-for="item in views"
                  :key="item.id"
                  :label="item.viewName"
                  :value="item.id">
              </aui-option>
            </aui-select>
          </aui-form-item>
          <aui-form-item label="是否启用">
            <aui-radio v-model="editMenu.isEnable" :label="1">启用</aui-radio>
            <aui-radio v-model="editMenu.isEnable" :label="0">禁用</aui-radio>
          </aui-form-item>
          <aui-form-item label="菜单描述">
            <aui-input type="textarea" v-model="editMenu.menuDesc" class="pui-add-menu-input" placeholder="请输入模块描述"></aui-input>
          </aui-form-item>
        </aui-form>
        <span slot="footer" class="dialog-footer">
          <aui-button :plain="true" @click="closeEditShow">取消</aui-button>
          <aui-button type="primary" @click="saveMenu('form')">确定</aui-button> 
        </span>
      </aui-dialog>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { menuService } from 'paas-web-utils/services';
export default {
  name: "PuiMainRightMenu",
  data() {
      return {
        listData:[],
        searchVal:'',
        active:-1,
        addShow:false,
        editShow:false,
        defaultProps: {
          children: 'children',
          label: 'menuName',
        },
        newMenu:{
          "menuName":"", 
          "menuDesc":"", 
          "menuGroup":null, 
          "parentId":0, 
          "iconClass":"aIcon aIcon-wode", 
          "isEnable":1, 
          "menuOrder":'', 
          "viewId":'', 
          "sourceType":0, 
          "iconColor":"white", 
          "moduleId":'',
        },
        editMenu:{
          "id": null,
          "menuName":"", 
          "menuDesc":"", 
          "menuGroup":null, 
          "parentId":0, 
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
          menuOrder:{ required: true, message: "请输入菜单排序", trigger: "blur" },
          moduleId:{ required: true, message: "请选择模块", trigger: "change" },
          viewId:{ required: true, message: "请选择视图", trigger: "change" },
        },
        modules:null,
        views:null,
      }
    },
  methods: {
    //查询
    enterKeyEvent(){
      this.listData = [];
      this.initView();
    },
    //查询模块集合
    findModules(){
      let parame = {
        "moduleIds": [],
        "isRelated": 0,
        "isEqModuleId": true,
        "isCustom":1,
        "isDelete" : 0,
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
        "viewTypes": [],
      }
      menuService.findViews(parame).then(data=>{
        this.views = data
        this.newMenu.viewId = null
        this.editMenu.viewId = null
      })
    },
    //获取菜单数据
    initView(){
      this.listData = [];
      let parame = {
        "parentId": null,
        "sourceType": 0,
        "menuIdList": null,
        "searchVal": this.searchVal,
      }
      menuService.findMenu(parame).then(data=>{
        data.forEach(v => {
          if(v.parentId == 0){
            this.listData.push(v);
          }
        });
      })
    },
    //点击节点筛选
    selectDic(index){
      let id = this.listData[index].id;
      let menuName = this.listData[index].menuName;
      this.$store.dispatch("menuSetting/changeParentId",id);
      this.$store.dispatch("adminNav/changeHeaderTitle",menuName);
      // this.$store.dispatch("menuSetting/changePageNow",1);
      this.active = index;
    },
    //增加最外层菜单
    openAddFirst(){
      this.addShow = true;
    },
    //保存菜单
    addMenu(formName){
      let form = this.$refs[formName];
      form.validate(valid=>{
        if(valid){
          let parame = this.newMenu;
          menuService.addMenu(parame).then(data=>{
            console.log(data,'保存成功')
            this.closeAddShow();
            this.initView()
          })
        }else{
          return false
        }
      })
    },
    //编辑
    editInfo(activeData){
      this.editShow = true;
      this.editMenu.id = activeData.id;
      this.editMenu.menuName = activeData.menuName;
      this.editMenu.menuDesc = activeData.menuDesc;
      this.editMenu.menuGroup = activeData.menuGroup;
      this.editMenu.parentId = activeData.parentId;
      this.editMenu.iconClass = activeData.iconClass;
      this.editMenu.isEnable = activeData.isEnable;
      this.editMenu.menuOrder = activeData.menuOrder;
      this.editMenu.sourceType = activeData.sourceType;
      this.editMenu.iconColor = activeData.iconColor;
      //模块回填
        if(activeData.moduleId){
          let parameModule = {
            "moduleIds": [],
            "isRelated": 0,
            "isEqModuleId": true,
            "isCustom":1,
            "isDelete" : 0
          }
          menuService.findModules(parameModule).then(res=>{
            this.modules = res;
            this.editMenu.moduleId = activeData.moduleId;
            //视图回填
            if(activeData.viewId){
                let parameView = {
                  "moduleId": this.editMenu.moduleId,
                  "viewFlag":0,
                  "viewTypes": []
                }
                menuService.findViews(parameView).then(data2=>{
                  this.views = data2
                  menuService.findViewById({id:activeData.viewId}).then(data3=>{
                    if(data3.viewName){
                      this.editMenu.viewId = activeData.viewId;
                    }else{
                      this.editMenu.viewId = null;
                    }
                  })
                })
            }else{
              this.editMenu.viewId = activeData.viewId;
            }
          })
        }else{
          this.editMenu.moduleId = activeData.moduleId;
        }
    },
    saveMenu(formName){
      let form = this.$refs[formName];
      form.validate(valid=>{
        if(valid){
          let parame = this.editMenu;
          menuService.editMenu(parame).then(data=>{
            console.log('修改成功');
            this.closeEditShow();
            this.initView();
          })
        }else{
          return false
        }
      })
    },
    //删除
    handleDelete(activeData){
      this.$aui.confirm
      .show('确定删除吗？', '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        let params = {"menuId":activeData.id};
        menuService.removeMenu(params).then(data=>{
          console.log('删除成功');
          this.listData = [];
          let parame = {
            "parentId": null,
            "sourceType": 0,
            "menuIdList": null,
            "searchVal": this.searchVal,
          }
          menuService.findMenu(parame).then(data=>{
            data.forEach(m => {
              if(m.parentId == 0){
                this.$set(m,'children',[]);
                this.listData.push(m);
              }
            });
            this.$store.dispatch("menuSetting/changeParentId",this.listData[0].id);
            this.$store.dispatch("adminNav/changeHeaderTitle",this.listData[0].menuName);
          })
        })
      })
      .catch(()=>{});
    },
    //关闭对话框
    closeAddShow(){
      this.addShow = false;
      this.$refs.form.resetFields();
    },
    closeEditShow(){
      this.editShow = false;
      this.$refs.form.resetFields();
    },
  },
  created(){
    this.$store.dispatch('asideHeight/setAsideHeight','491px')
    this.initView();
    this.findModules();
  },
  computed: {
    treeHeight(){
      return this.$store.getters["asideHeight/asideHeight"];
    }
  }
};
</script>

<style lang='scss' scoped>
@import "~theme/common/var";
@import "~theme/mixins/utils";
.main-right-menu{
  width: 280px;
  background: #FFFFFF;
  // border: 1px solid #DFE2E6;
  margin: 0;
  overflow: hidden;
  // height: 850px;
  .pui-user-selection__org{
    width: 100%;
    // height: 750px;
    overflow-y: scroll;
  }
  .pui-list-grid__fuzzy-search{
    width: 100%;
  }
  .main-right-menu-top{
    width: 278px;
    // height:59px;
    height: 36px;
    display: flex;
    // line-height: 59px;
    line-height: 36px;
    margin-bottom: 10px;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 10px;
    .main-right-menu-top-title{
      font-family: STHeitiSC-Medium;
      font-size: 16px;
      color: #313A4D;
      letter-spacing: 0px;
    }
    .main-right-menu-top-ctrl{
      display: inline;
      font-size: 16px;
      color: #8A97AB;
      margin: 0;
      // line-height: 59px;
      line-height: 36px;
      // span{
      //   display: inline-block;
      //   line-height: 59px;
      // }
    }
  }
}
.main-right-mobile-menu-list{
  width: 100%;
  // height: 750px;
  // height: 550px;
  overflow-y: scroll;
  // border-top: 1px solid #D8D8E3;
  // padding: 20px 10px;
  padding: 20px 0; 
  box-sizing: border-box;
  font-size: 14px;
  color: #606266;
  .main-right-dictionary-list-option{
    padding: 0 15px;
    // height: 40px;
    // line-height: 40px;
    height: 26px;
    line-height: 26px;
    box-sizing: border-box;
    cursor: pointer;
    .ellipsis {
      display: inline-block;
      width: 190px;
      @include utils-ellipsis;
    }
    // .btn-ctrl{
    //   float: right;
    //   margin-left: 15px;
    //   display: none;
    // }
    .btn-ctrl{
      display: none;
      float: right;
      // margin-right: 2px;
      .icon {
        margin-right:2px;
      }
    }
    &:hover{
      // background: #d5ddf1;
      background-color: $--hover-bgColor;
      .btn-ctrl{
        display: inline;
      }
    }
  }
  .bgColor{
    // background: #5278C7;
    background-color: $--hover-bgColor;
    .btn-ctrl{
      display: inline;
    }
  }
}


.delete-dialog{
  .aui-dialog{
    border-radius:10px;
    .delete-text{
      font-size: 16px;
      padding: 20px 40px 0;
    }
  }
}
.pui-edit-menu__form {
  padding: 0px 9% 0px 3%;
  min-width: 300px;
}
</style>