<template>
    <div class="main-right-mobile-menu">
      <div class="main-right-mobile-menu-top">
        <span class="main-right-mobile-menu-top-title">移动端菜单分组</span>
        <p class="main-right-mobile-menu-top-ctrl">
          <i class="aui-icon-plus" style="cursor:pointer" @click="openAddFirst"></i>          
        </p>
      </div>
      <aui-input v-model="searchVal" @keyup.enter.native="enterKeyEvent()" size="medium" clearable class="pui-list-grid__fuzzy-search" placeholder="请输入搜索的菜单" prefix-icon="aui-icon-search">
      </aui-input>
      <div class="main-right-mobile-menu-list">
        <ul>
          <li v-for="(item,index) in listData" :key="index" class="main-right-dictionary-list-option" :class="{ bgColor:active == index }" @click="selectDic(index)">
            <span class="ellipsis">{{item.dictName}}</span> 
            <span class="btn-ctrl">
              <i class="aui-icon-edit icon" @click.stop="editInfo(item)"></i>
              <i class="aui-icon-delete icon" @click.stop="handleDelete(item)"></i>
            </span>
          </li>
        </ul>
      </div>
      <aui-dialog 
      :close-on-click-modal="false"
        title="新增分组"
        width="40%" 
        :visible="addShow" 
        append-to-body
        @hide="closeAddShow">
        <aui-form :model="newMenu.dictList[0]" :rules="rules" ref="form" label-width="100px" class="pui-add-menu__form">
          <aui-form-item label="菜单组名称" prop="dictName">
            <aui-input v-model="newMenu.dictList[0].dictName" class="pui-add-menu-input" placeholder="请输入名称"></aui-input>
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
        append-to-body
        @hide="closeEditShow">
        <aui-form :model="editMenu.dictList[0]" :rules="rules" ref="form" label-width="100px" class="pui-add-menu__form">
          <aui-form-item label="菜单名称" prop="dictName">
            <aui-input v-model="editMenu.dictList[0].dictName" class="pui-add-menu-input" placeholder="请输入名称"></aui-input>
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
import { dictionaryService } from 'paas-web-utils/services';
export default {
  name: "PuiMainRightMobileMenu",
  data() {
      return {
        searchVal:'',
        isFindAll:1,
        active:-1,
        addShow:false,
        editShow:false,
        newMenu:{
          "dictList": [
            {
                "dictName": "",
                "dictCode": 1,
                "dictParentCode": 0,
                "dictType": 'GROUP',
                "sort": null
            }
          ]
        },
        editMenu:{
          "dictList": [{
              "dictName": "",
              "dictCode": 1,
              "dictParentCode": 0,
              "dictType": 'GROUP',
              "sort": 0,
              "dictId": null,
              "isDelete": 0,
              "status": 0
          }]
        },
        rules:{
          dictName:{ required: true, message: "请输入菜单名称", trigger: "blur" },
        },
        editData:null,
        listData:[],
      }
  },
  methods: {
    //查询
    enterKeyEvent(){
      this.isFindAll=0;
      this.initView();
    },
    //获取菜单数据
    initView(){
      let parame = {
        "isFindAll": this.isFindAll,
        "dictName": this.searchVal,
        "dictType": "GROUP",
        "dictIdList": "",
        "ownParentFlag": "",
        "condition": "",
      }
      dictionaryService.findDictionaries(parame).then(data=>{
        let leftData = [];
        data.forEach(v => {
          if(v.dictParentCode == 0){
            leftData.push(v)
          }
        });
        this.$set(this,'listData',leftData)
      });
    },
    //点击节点筛选
    selectDic(index){
      let groupId = this.listData[index].id;
      let groupName = this.listData[index].dictName;
      this.$store.dispatch("mobileMenu/changeGroupId",groupId);
      this.$store.dispatch("adminNav/changeHeaderTitle",groupName);
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
          this.newMenu.dictList[0].dictCode = new Date().getTime()
          let parame = this.newMenu;
          dictionaryService.addDictionary(parame).then(data=>{
            this.newMenu.dictList.forEach(v=>{
              v.dictName ='';
            })
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
      this.editMenu.dictList[0].dictName = activeData.dictName;
      this.editMenu.dictList[0].dictCode = activeData.dictCode;
      this.editMenu.dictList[0].dictParentCode = activeData.dictParentCode;
      this.editMenu.dictList[0].dictId = activeData.id;
    },
    saveMenu(formName){
      let form = this.$refs[formName];
      form.validate(valid=>{
        if(valid){
          let parame = this.editMenu;
          dictionaryService.editDictionary(parame).then(data=>{
            this.closeEditShow()
            this.initView()
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
        let parame ={"dictIds":[activeData.id]};
        dictionaryService.removeDictionary(parame).then(data=>{
          this.closeRemove();
          let parame = {
            "isFindAll": this.isFindAll,
            "dictName": this.searchVal,
            "dictType": "GROUP",
            "dictIdList": "",
            "ownParentFlag": "",
            "condition": "",
          }
          dictionaryService.findDictionaries(parame).then(data=>{
            let leftData = [];
            data.forEach(v => {
              if(v.dictParentCode == 0){
                leftData.push(v)
              }
            });
            this.$set(this,'listData',leftData)
            this.$store.dispatch("mobileMenu/changeGroupId",this.listData[0].id);
            this.$store.dispatch("adminNav/changeHeaderTitle",this.listData[0].dictName);
          });
        })
      })
      .catch(()=>{});
    },
    //关闭对话框
    closeAddShow(){
      this.addShow = false;
    },
    closeRemove(){
      this.removeShow = false;
    },
    closeEditShow(){
      this.editShow = false;
    },
  },
  created(){
    this.initView();
  },
};
</script>

<style lang='scss' scoped>
@import "~theme/common/var";
@import "~theme/mixins/utils";
.main-right-mobile-menu{
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
  .main-right-mobile-menu-top{
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
    .main-right-mobile-menu-top-title{
      font-family: STHeitiSC-Medium;
      font-size: 16px;
      color: #313A4D;
      letter-spacing: 0px;
    }
    .main-right-mobile-menu-top-ctrl{
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
  .main-right-mobile-menu-list{
    width: 100%;
    // height: 750px;
    // height:550px;
    overflow-y: scroll;
    // border-top: 1px solid #D8D8E3;
    padding: 20px 10px;
    box-sizing: border-box;
    font-size: 14px;
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
      .btn-ctrl{
        float: right;
        display: none;
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
}
.pui-add-menu__form {
  padding: 0px 9% 0px 3%;
  min-width: 300px;
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


</style>