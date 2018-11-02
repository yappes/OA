<template>
    <div class="main-right-dictionary">
      <div class="main-right-dictionary-top">
        <span class="main-right-dictionary-top-title">业务类别</span>
        <p class="main-right-dictionary-top-ctrl">
          <i class="aui-icon-plus" style="cursor:pointer" @click="addDictType"></i>
        </p>
      </div>
      <aui-input v-model="fuzzyKey" @keyup.enter.native="enterKeyEvent()" size="medium" clearable class="pui-list-grid__fuzzy-search" placeholder="请输入搜索的业务类别" prefix-icon="aui-icon-search">
      </aui-input>
      <div class="main-right-dictionary-list" :style="{height:treeHeight}">
        <ul>
          <li v-for="(item,index) in listData" :key="index" class="main-right-dictionary-list-option" @click="selectDic(index)" :class="{ bgColor:active == index }">
            <span class="ellipsis">{{item.dictName}}</span> 
            <span class="btn-ctrl">
              <i class="aui-icon-edit icon"  @click.stop="editInfo(item)"></i>
              <i class="aui-icon-delete icon" @click.stop="handleDelete(item)"></i>
            </span>
          </li>
        </ul>
      </div>
      <aui-dialog class="main-right-dictionary__add-dialog"
        title="新增业务类别"
        width="49%" 
        :visible="addShow"
        :close-on-click-modal="false" 
        append-to-body
        @hide="closeAddShow">
        <aui-form :model="newDic" ref="form" label-width="40%" :inline="true" style="minWidth:665px">
          <div v-for="(item,index) in newDic.dicList" :key="item.id">
            <aui-form-item label="业务类别名称"
              :prop="'dicList.' + index + '.dictName'"
              :rules="{ required: true, message: '请输入业务类别名称', trigger: 'blur' }">
              <aui-input v-model="item.dictName" class="pui-add-dictionary-input" placeholder="请输入业务类别名称"></aui-input>
            </aui-form-item>
            <aui-form-item label="业务类别编码"
              :prop="'dicList.' + index + '.dictCode'"
              :rules="{ required: true, validator: checkDicCode, trigger: 'blur'}">
              <aui-input v-model="item.dictCode" class="pui-add-dictionary-input"  placeholder="请输入业务类别编码"></aui-input>
            </aui-form-item>
            <!-- <span @click="addList" class="pui-add-dictionary-add">+</span>
            <span @click="removeList(index)" class="pui-add-dictionary-remove" v-if="newDic.dicList.length > 1">－</span> -->
            <i class="aui-icon-plus item-icon" @click="addList"></i>
            <i class="aui-icon-minus item-icon" @click="removeList(index)" v-if="newDic.dicList.length > 1"></i>
          </div>
        </aui-form>
        <span slot="footer" class="dialog-footer">
          <aui-button :plain="true" @click="closeAddShow">取消</aui-button>
          <aui-button type="primary" @click="append('form')">确定</aui-button> 
        </span>
      </aui-dialog>
      <aui-dialog
        :close-on-click-modal="false" 
        title="修改业务类别"
        width="44%" 
        :visible="editShow" 
        append-to-body
        @hide="closeEditShow">
        <aui-form :model="editDic" ref="form" label-width="120px" style="padding: 0px 9% 0px 3%;min-width: 300px;">
          <div v-for="(item,index) in editDic.dicList" :key="item.id">
            <aui-form-item label="业务类别名称"
              :prop="'dicList.' + index + '.dictName'"
              :rules="{ required: true, message: '请输入业务类别名称', trigger: 'blur' }">
              <aui-input v-model="item.dictName" placeholder="请输入"></aui-input>
            </aui-form-item>
            <aui-form-item label="业务类别编码">
              <aui-input v-model="item.dictCode" :disabled="true" placeholder="请输入"></aui-input>
            </aui-form-item>
          </div>
        </aui-form>
        <span slot="footer" class="dialog-footer">
          <aui-button :plain="true" @click="closeEditShow">取消</aui-button>
          <aui-button type="primary" @click="editSave('form')">确定</aui-button> 
        </span>
      </aui-dialog>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {dictionaryService} from 'paas-web-utils/services';
export default {
  name: "PuiMainRightDictionary",
  data() {
      return {
        addShow:false,
        editShow:false,
        fuzzyKey:'',
        listData:[],
        editActive:null,
        isFindAll:0,
        active:-1,
        newDic:{
          dicList:[{
            "dictName":'',
            "dictCode":'',
            "dictParentCode": "0",
            "dictType": "",
            "sort": null
          }]
        },
        editDic:{
          dicList:[{
            "dictName":'',
            "dictCode":'',
            "dictParentCode": "0",
            "dictType": "",
            "sort": null,
            "dictId": null,
            "isDelete": null,
            "status": 0
          }]
        },
      }
    },
  methods: {
    //字典编码正则验证
    checkDicCode(rule, value, callback){
      if(!value){
        callback(new Error('请输入业务类别编码'));
      }else{
        var myreg=/^[a-zA-Z][a-zA-Z0-9_]*$/;  
        if (!myreg.test(value)) {  
          callback(new Error('业务类别编码必须以字母开头')); 
        } else {  
          let parame = {
            dict_code: value,
          };
          dictionaryService.checkDictCode(parame).then(data => {
            if (data == "NOTEXIST") {
              callback();
            } else {
              callback(new Error("业务类别编码已存在"));
            }
          });
        }  
      }
    },
    //查询
    enterKeyEvent(){
      this.initView();
    },
    //获取业务类别
    initView(){
      let parame = {
        "isFindAll": this.isFindAll,
        "dictName": this.fuzzyKey,
        "dictType": "",
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
        this.$store.dispatch("dictionary/changeDictType",leftData[0].dictCode);
        this.$store.dispatch("adminNav/changeHeaderTitle", leftData[0].dictName);  
      })
    },
    //添加业务类别
    addDictType(){
      this.addShow = true;
    },
    //保存新增
    append(formName){
      let form = this.$refs[formName];
      form.validate(valid=>{
        if(valid){
          let parame = {'dictList':this.newDic.dicList}
          dictionaryService.addDictionary(parame).then(data=>{
            this.newDic.dicList.forEach(v=>{
              v.dictName ='';
              v.dictCode ='';
            })
            this.closeAddShow();
            this.initView()
          })
        }else{
          return false
        }
      })
    },
    //打开修改
    editInfo(active){
      this.editShow = true;
      this.$set(this,'editActive',active);
      this.editDic.dicList[0].dictName = this.editActive.dictName;
      this.editDic.dicList[0].dictCode = this.editActive.dictCode;
      this.editDic.dicList[0].dictId = this.editActive.id;
      this.editDic.dicList[0].isDelete = this.editActive.isDelete;
      this.editDic.dicList[0].status = this.editActive.status;
    },
    //保存修改
    editSave(formName){
      let form = this.$refs[formName];
      form.validate(valid=>{
        if(valid){
          let parame = {'dictList':this.editDic.dicList};
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
    handleDelete(active){
      this.$aui.confirm
      .show('确定删除吗？', '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        let parame ={"dictIds":[active.id]};
        dictionaryService.removeDictionary(parame).then(data=>{
          let parame = {
            "isFindAll": this.isFindAll,
            "dictName": this.fuzzyKey,
            "dictType": "",
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
            this.$store.dispatch("adminNav/changeHeaderTitle", this.listData[0].dictName);
            this.$store.dispatch("dictionary/changeDictType",this.listData[0].dictCode);
          })
        })
      })
      .catch(()=>{});
    },
    //点击业务类别筛选右侧字典列表
    selectDic(index){
      let activeRow = this.listData[index];
      this.$store.dispatch("dictionary/changeDictType",activeRow.dictCode);
      this.$store.dispatch("adminNav/changeHeaderTitle", activeRow.dictName);  
      this.active = index;
    },
    //添加一条字典编辑
    addList(){
      let dicOption = {
        "dictName":'',
        "dictCode":'',
        "dictParentCode": "0",
        "dictType": "test",
        "sort": null
      }
      this.newDic.dicList.push(dicOption);
    },
    //删除当前字典编辑
    removeList(index){
      this.newDic.dicList.splice(index,1);
    },
    //关闭对话框
    closeAddShow(){
      this.addShow = false;
      this.$refs.form.resetFields();
    },
    closeEditShow(){
      this.editShow =false;
      this.$refs.form.resetFields();
    },
  },
  created(){
    this.$store.dispatch('asideHeight/setAsideHeight','491px')
    this.initView();
  },
  computed:{
    treeHeight(){
      return this.$store.getters["asideHeight/asideHeight"];
    }
  }
};
</script>

<style lang='scss' scoped>
@import "~theme/common/var";
@import "~theme/mixins/utils";
// 弹框样式
.main-right-dictionary__add-dialog /deep/ {
    .aui-form-item {
      width: 42%;
      margin-right: 0;
      .aui-form-item__content {
        width: 56%;
      }
    }
  }


.main-right-dictionary{
  width: 280px;
  background: #FFFFFF;
  // border: 1px solid #DFE2E6;
  margin: 0;
  overflow: hidden;
  // height: 850px;
  .main-right-dictionary-top{
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
    .main-right-dictionary-top-title{
      font-family: STHeitiSC-Medium;
      font-size: 16px;
      color: #313A4D;
      letter-spacing: 0px;
    }
    .main-right-dictionary-top-ctrl{
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
  .main-right-dictionary-list{
    width: 100%;
    // height: 750px;
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
          display: inline-block;
        }
      }
      // span{
        // float: right;
        // margin-left: 15px;
      // }
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
// .pui-add-dictionary-input{
//     width: 170px;
//   }
  // .pui-add-dictionary-add , .pui-add-dictionary-remove{
  //   cursor: pointer;
  //   font-size: 24px;
  //   line-height: 38px;
  //   // margin-left: 20px;
  //   margin-left: 2%;
  // }
  //加减号样式
.item-icon {
  margin-left: 2%;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
  color: $--font-color-gray;
  &:hover {
    color: #26b7ae;
  }
}
  .pui-list-grid__fuzzy-search{
    width: 100%;
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