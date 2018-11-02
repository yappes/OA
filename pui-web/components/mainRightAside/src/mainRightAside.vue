<template>
    <div class="main-right-aside" ref="rightAside">
      <div class="main-right-aside-top" ref="rightAsideTop">
        <span class="main-right-aside-top-title">组织架构</span>
        <p class="main-right-aside-top-ctrl">
          <i class="aui-icon-plus" style="cursor:pointer" @click="addOrgFirst"></i>
        </p>
      </div>
      <aui-input v-model="filterText" size="medium" clearable class="pui-list-grid__fuzzy-search" placeholder="请输入搜索的部门" prefix-icon="aui-icon-search">
      </aui-input>
      <aui-tree class="pui-user-selection__org" :style="{height:rightAsideHeight}"
        :data="orgTree" 
        :props="defaultProps" 
        :highlight-current="true"
        :filter-node-method="filterNode"
        :render-after-expand="false"
        :default-expand-all="true"
        ref="tree"
        node-key="orgCode"
        :expand-on-click-node="false"
        @node-click="handleNodeClick">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span class="ellipsis">{{ node.label }}</span> 
        <span class="btn-ctrl">
          <i class="aui-icon-plus icon" @click.stop="() => openAdd(node,data)"></i>
          <i class="aui-icon-edit icon"  @click.stop="() => openEdit(node, data)"></i>
          <i class="aui-icon-delete icon" @click.stop="() => handleDelete(node, data)" v-if="data.orgParentCode != 0"></i>          
        
        </span>
      </span>
      </aui-tree>
      <aui-dialog 
        :close-on-click-modal="false"
        title="新增部门"
        width="40%" 
        :visible="addShow" 
        append-to-body
        @hide="closeAddShow">
        <aui-form :model="reqData" :rules="rules" ref="form" label-width="100px" style="padding: 0px 9% 0px 3%;minWidth: 300px;">
          <aui-form-item label="部门名称" prop="orgName">
            <aui-input v-model="reqData.orgName" placeholder="请输入部门名称"></aui-input>
          </aui-form-item>
          <aui-form-item label="部门描述" prop="orgDesc">
            <aui-input v-model="reqData.orgDesc" placeholder="请输入部门描述"></aui-input>
          </aui-form-item>
        </aui-form>
        <span slot="footer" class="dialog-footer">
          <aui-button :plain="true" @click="closeAddShow">取消</aui-button>
          <aui-button type="primary" @click="append('form')">确定</aui-button> 
        </span>
      </aui-dialog>
      <aui-dialog 
        :close-on-click-modal="false"
        title="新增部门"
        width="40%" 
        :visible="addFirstShow" 
        append-to-body
        @hide="closeFirstShow">
        <aui-form :model="reqData" :rules="rules" ref="form" label-width="100px" style="padding: 0px 9% 0px 3%;minWidth: 300px;">
          <aui-form-item label="部门名称" prop="orgName">
            <aui-input v-model="reqData.orgName" placeholder="请输入部门名称"></aui-input>
          </aui-form-item>
          <aui-form-item label="部门描述" prop="orgDesc">
            <aui-input v-model="reqData.orgDesc" placeholder="请输入部门描述"></aui-input>
          </aui-form-item>
        </aui-form>
        <span slot="footer" class="dialog-footer">
          <aui-button :plain="true" @click="closeFirstShow">取消</aui-button>
          <aui-button type="primary" @click="saveOrgFirst('form')">确定</aui-button> 
        </span>
      </aui-dialog>
      <aui-dialog 
        :close-on-click-modal="false"
        title="修改部门信息"
        width="40%" 
        :visible="editShow" 
        append-to-body
        @hide="closeEditShow">
        <aui-form :model="reqData" :rules="rules" ref="form" label-width="100px" style="padding: 0px 9% 0px 3%;minWidth: 300px;">
          <aui-form-item label="部门名称" prop="orgName">
            <aui-input v-model="reqData.orgName" placeholder="请输入部门名称"></aui-input>
          </aui-form-item>
          <aui-form-item label="部门描述" prop="orgDesc">
            <aui-input v-model="reqData.orgDesc" placeholder="请输入部门描述"></aui-input>
          </aui-form-item>
        </aui-form>
        <span slot="footer" class="dialog-footer">
          <aui-button :plain="true" @click="closeEditShow">取消</aui-button>
          <aui-button type="primary" @click="editSave('form')">确定</aui-button> 
        </span>
      </aui-dialog>
    </div>
</template>

<script>

import {orgService, userService} from 'paas-web-utils/services'
export default {
  name: "PuiMainRightAside",
  data() {
      return {
        filterText:'',
        addShow:false,
        editShow:false,
        addFirstShow:false,
        orgList:[],
        orgTree:[],
        active:null,
        activeData:null,
        defaultProps: {
          children: 'children',
          label: 'orgName',
        },
        reqData: {
          orgName: '',
          orgDesc: '',
        },
        rules: {
          orgName: [
            { required: true, message: "请输入部门名称", trigger: "blur" },
            { min: 2, message: "至少2个字符", trigger: "blur" }
          ],
          orgDesc: [
            { required: true, message: "请输入部门描述", trigger: "blur" },
            { min: 2, message: "至少2个字符", trigger: "blur" }
          ]
        },
      }
    },
  methods: {
    //获取部门信息
    findOrgData(){
      orgService.findOrgList().then(data=>{
        this.initTreeData(data)
      });
    },
    // 初始化树形数据
    initTreeData(data) {
      let orgList = [],
          orgTreeData = [];
      data.organzationList && (orgList = JSON.parse(JSON.stringify(data.organzationList)));
      // 初始化最外层父级节点
      for(let i = 0; i < orgList.length; i++) {
        if(orgList[i].orgParentCode == 0) {
          orgTreeData.push({
            ...orgList[i],
            label: orgList[i].orgName,
            children: [],
          })
          orgList.splice(i, 1);
          i--;
        }
      }
      orgTreeData = this.initTreeChildrenData(orgList, orgTreeData);
      this.orgTree = orgTreeData;
      console.log(this.orgTree)
    },
    // 初始化子节点
    initTreeChildrenData(orgList, orgTreeData) {
      if(orgList.length) {
        for(let i = 0; i < orgTreeData.length; i++) {
          for(let j = 0; j < orgList.length; j++) {
            if(orgList[j].orgParentCode == orgTreeData[i].orgCode) {
              orgTreeData[i].children.push({
                ...orgList[j],
                label: orgList[j].orgName,
                children: [],
              })
              orgList.splice(j, 1);
              j--;
            }
          }
          this.initTreeChildrenData(orgList, orgTreeData[i].children);
        }
      }
      return orgTreeData;
    },
    //新增最高级部门
    addOrgFirst(){
      this.addFirstShow = true;
    },
    saveOrgFirst(formName){
      let form = this.$refs[formName]
      form.validate(valid=>{
        if(valid){
          let newPar = {
            orgName: this.reqData.orgName,
            orgParentCode:0,
            orgCode:new Date().getTime(),
          }
          this.$refs.tree.append(newPar);
          let id = 0;
          let orgName = this.reqData.orgName;
          let orgDesc = this.reqData.orgDesc;
          orgService.addOrg(orgName,orgDesc,id).then(data=>{
            this.closeFirstShow();
            this.findOrgData()
          })
        }else{
          return false;
        }
      })
    },
    //打开新增对话框，获取当前选中信息
    openAdd(node,data){
      this.$set(this,'activeData',data)
      this.addShow = true;
      this.active = data;
    },
    //保存新增信息
    append(formName) {
      let form = this.$refs[formName]
      form.validate(valid=>{
        if(valid){
          let newChild = { orgName: this.reqData.orgName,
                      orgParentCode:this.activeData.orgCode,
                      orgDesc:this.reqData.orgDesc,
                      };
          this.$refs.tree.append(newChild,this.activeData)

          let id = this.active.orgCode;
          let orgName = this.reqData.orgName;
          let orgDesc = this.reqData.orgDesc;
          orgService.addOrg(orgName,orgDesc,id).then(data=>{
            this.closeAddShow();
            // this.findOrgData()
          })
        }else{
          return false;
        }
      })
      
    },
    //打开修改对话框，获取当前选中信息
    openEdit(data){
      this.editShow = true;
      this.active = data.data;
      this.reqData.orgName = this.active.orgName;
      this.reqData.orgDesc = this.active.orgDesc;
    },
    //保存修改信息
    editSave(formName) {
      let form = this.$refs[formName]
      form.validate(valid=>{
        if(valid){
          this.active.orgName = this.reqData.orgName;
          let orgId = this.active.id;
          let orgName = this.reqData.orgName;
          let orgDesc = this.reqData.orgDesc;
          orgService.editOrg(orgId,orgName,orgDesc).then(data=>{
            this.closeEditShow()
            this.findOrgData()
          })
        }else{
          return false
        }
      })
    },
    //删除部门信息
    handleDelete(node,data){
      //先查询部门下是否有用户。没有用户再进行删除操作
      userService.findUserByPage({
        orgCode: data.orgCode,
        currentPage: 1,
        order: "ASC",
        orgId: null,
        pageSize: 10,
        searchKey: "",
        sidx: "createTime",
      }).then(data => {
        let record = data.record
        if(record && record.length > 0) {
          this.$aui.confirm.show('请删除本部门内所有用户后再删除本部门',{
            type: 'error',
            confirmButtonText: '确定',
            showCancelButton: false,
          })
        }else {
          this.$aui.confirm
          .show('确定删除吗？', '提示', {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            let orgId = data.id;
            this.$refs.tree.remove(data);
            orgService.removeOrg(orgId).then(data=>{
              console.log('删除成功');
              // this.findOrgData()
              this.$store.dispatch("userSelectByOrg/changeCurOrgCode",this.orgTree[0].orgCode);
              this.$store.dispatch("adminNav/changeHeaderTitle",this.orgTree[0].orgName);
            });
          })
          .catch(()=>{});
        }
      })
    },
    //查询部门信息
    filterNode(value, data) {
      if (!value) return true;
      return data.orgName.indexOf(value) !== -1;
    },
    //点击部门树发送选中部门信息到vuex
    handleNodeClick(data) {
      let activeOrgCode = data.orgCode;
      let activeOrgName = data.orgName
      this.$store.dispatch("adminNav/changeHeaderTitle", activeOrgName);   
      this.$store.dispatch("userSelectByOrg/changeCurOrgCode",activeOrgCode);
    },
    //关闭对话框
    closeAddShow(){
      this.addShow = false;
      this.reqData.orgName = '';
      this.reqData.orgDesc = '';
    },
    closeFirstShow(){
      this.addFirstShow = false;
      this.reqData.orgName = '';
      this.reqData.orgDesc = '';
    },
    closeEditShow(){
      this.editShow = false;
      this.reqData.orgName = '';
      this.reqData.orgDesc = '';
    },
   
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  computed: {
   rightAsideHeight(){
     return this.$store.getters['asideHeight/asideHeight'];
   }
  },
  created(){
    this.findOrgData();
    this.$store.dispatch("asideHeight/setAsideHeight", '491px'); 
    this.$store.dispatch("adminNav/changeHeaderTitle", '赞同股份'); 
  },
};
</script>

<style lang='scss' scoped>
@import "~theme/common/var";
@import "~theme/mixins/utils";
.main-right-aside{
  width: 280px;
  background: #FFFFFF;
  // border: 1px solid #DFE2E6;
  margin: 0;
  overflow: hidden;
  // height: 850px;
  .custom-tree-node{
    &:hover{
      .ellipsis{
        display: inline-block;
        max-width:130px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }
    
  }
  

  .main-right-aside-top{
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
    .main-right-aside-top-title{
      font-family: STHeitiSC-Medium;
      font-size: 16px;
      color: #313A4D;
      letter-spacing: 0px;
    }
    .main-right-aside-top-ctrl{
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
  .pui-user-selection__org{
    width: 100%;
    // height: 750px;
    overflow-y: scroll;
    max-height:unset;
  }
  .pui-list-grid__fuzzy-search{
    width: 100%;
  }
  /deep/ .aui-tree-node__content{
    // padding-left: 0 !important;
    .custom-tree-node {
      width: 100%;
    }
    // .ellipsis {
    //   display: inline-block;
    //   width: 190px;
    //   @include utils-ellipsis;
    // }
    .btn-ctrl{
      display: none;
      float: right;
      // margin-right: 2px;
      .icon {
        margin-right:1px;
      }
    }
    &:hover{
      .btn-ctrl{
        display: inline-block;
        
      }
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
//组件树高亮背景色
.main-right-aside /deep/ {
   .aui-tree-node__content:hover {
    background-color: $--hover-bgColor;
    // background-color: $--color-primary;
  }
  & .aui-tree-node:focus > .aui-tree-node__content {
    background-color: $--hover-bgColor;
    // background-color: $--color-primary;  
  }
  // .aui-tree--highlight-current
  &  .aui-tree-node.is-current > .aui-tree-node__content {
     background-color: $--hover-bgColor; 
  }
}
</style>