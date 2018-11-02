<template>
  <div class="pui-process-manager-aside" style="position:relative">
    <i class="aui-icon-plus icon add-icon" @click="addNode"></i>
    <aui-tree :data="managerAsideData" :props="defaultProps" @node-click="handleNodeClick" default-expand-all>
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span class="ellipsis">{{ node.label }}</span>
        <span class="btn-ctrl">
          <i class="aui-icon-plus icon" @click.stop="() => openAdd(node,data)"></i>
          <i class="aui-icon-edit icon" @click.stop="() => openEdit(node, data)"></i>
          <i class="aui-icon-delete icon" @click.stop="() => handleDelete(node, data)" v-if="data.orgParentCode != 0"></i>
        </span>
      </span>
    </aui-tree>
    <aui-dialog 
    :title="title"
    width="40%" 
    :visible="addFirstShow" 
    append-to-body 
    @hide="closeFirstShow">
      <aui-form :model="reqData" :rules="rules" ref="form" label-width="100px" style="padding: 0px 9% 0px 3%;minWidth: 300px;">
        <aui-form-item label="分类名称" prop="categoryName">
          <aui-input v-model="reqData.categoryName" placeholder="请输入分类名称"></aui-input>
        </aui-form-item>
        <aui-form-item label="分类编码" v-if="this.type=='add'||'addNull'" prop="categoryCode">
          <aui-input v-model="reqData.categoryCode" placeholder="请输入分类编码"></aui-input>
        </aui-form-item>
      </aui-form>
      <span slot="footer" class="dialog-footer">
        <aui-button :plain="true" @click="closeFirstShow">取消</aui-button>
        <aui-button type="primary" @click="saveOrgFirst()">确定</aui-button>
      </span>
    </aui-dialog>
  </div>
</template>

<script>
import data from "./data.js";
import { workflowCategoryService } from "paas-web-utils/services";
export default {
  name: "PuiProcessManagerAside",
  data() {
    return {
      managerAsideData: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      categoryCode: "",
      active:undefined,
      addFirstShow:false,
      reqData:{
        categoryName:"",
        categoryCode:""
      },
      rules: {
        categoryName: [
          { required: true, message: "请输入流程名称", trigger: "blur" },
        ],
        categoryCode: [
          { required: true, message: "请输入流程编码", trigger: "blur" },
        ]
      },
      type:"",
      title:""
    };
  },
  mounted() {
    this.getTreeData();
  },
  methods: {
    addNode(){
      this.addFirstShow=true;
      this.type="addNull";
      this.title="新增部门"
    },
    openAdd(node, data) {
      console.log(node, data);
      this.active=data;
      this.addFirstShow=true;
      this.type="add";
      this.title="新增部门"
    },
    openEdit(node, data){
      this.active=data;
      this.addFirstShow=true;
      this.type="edit";
      this.title="编辑部门";
      this.reqData.categoryName=data.categoryName;
    },
    saveOrgFirst(){
      console.log(this.type);
      console.log(this.reqData)
      console.log(this.active)
      if(this.type=="add"){
        workflowCategoryService.save({
          categoryName: this.reqData.categoryName,
          categoryCode: this.reqData.categoryCode,
          pid: (this.active.pid)||0,
        }).then(data=>{
          console.log(data)
          this.addFirstShow=false;
          this.getTreeData()
        })
      }else if(this.type=="edit"){
        workflowCategoryService.update({
          categoryName: this.reqData.categoryName,
          categoryCode: this.reqData.categoryCode,
          id: this.active.id,
          pid: this.active.pid,
          isDelete:this.active.isDelete
        }).then(data=>{
          console.log(data)
          this.addFirstShow=false;
          this.getTreeData()
        })
      }else if(this.type="addNull"){
        workflowCategoryService.save({
          categoryName: this.reqData.categoryName,
          categoryCode: this.reqData.categoryCode,
          pid:0,
        }).then(data=>{
          console.log(data)
          this.addFirstShow=false;
          this.getTreeData()
        })
      }
    },
    handleDelete(node,data){
      this.$aui.confirm
      .show('确定删除吗？', '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        workflowCategoryService.delById({
          id:data.id
        }).then(data=>{
          this.getTreeData();
        })
      })
      .catch(()=>{});
    },
    handleNodeClick(data) {
      this.categoryCode = data.categoryCode;
      this.$emit("categoryCode", this.categoryCode);
      console.log(this.categoryCode);
    },
    closeFirstShow(){
      this.addFirstShow=false;
    },
    listToTree(myId, pId, list) {
      function exists(list, parentId) {
        for (var i = 0; i < list.length; i++) {
          if (list[i][myId] == parentId) return true;
        }
        return false;
      }

      var nodes = [];
      // get the top level nodes
      for (var i = 0; i < list.length; i++) {
        var row = list[i];
        if (!exists(list, row[pId])) {
          row.label = row.categoryName;
          nodes.push(row);
        }
      }

      var toDo = [];
      for (var i = 0; i < nodes.length; i++) {
        nodes[i].label = nodes[i].categoryName;
        toDo.push(nodes[i]);
      }
      while (toDo.length) {
        var node = toDo.shift(); // the parent node
        // get the children nodes
        for (var i = 0; i < list.length; i++) {
          var row = list[i];
          if (row[pId] == node[myId]) {
            //var child = {id:row.id,text:row.name};
            row.label = row.categoryName;
            if (node.children) {
              node.children.push(row);
            } else {
              node.children = [row];
            }
            toDo.push(row);
          }
        }
      }
      return nodes;
    },
    getTreeData() {
      workflowCategoryService.findAll().then(data => {
        this.managerAsideData = this.listToTree("id", "pid", data);
      });
    }
  }
};
</script>

<style  lang="scss">
@import "./processManagerAside.scss";
.add-icon{
  position: absolute;
  right:20px; 
  top:20px;
  font-size: 20px;
  cursor: pointer;
}
.pui-process-manager-aside {
  /deep/ .aui-tree-node__content {
    // padding-left: 0 !important;
    .custom-tree-node {
      width: 100%;
    }
    // .ellipsis {
    //   display: inline-block;
    //   width: 190px;
    //   @include utils-ellipsis;
    // }
    .btn-ctrl {
      display: none;
      float: right;
      // margin-right: 2px;
      .icon {
        margin-right: 1px;
      }
    }
    &:hover {
      .btn-ctrl {
        display: inline-block;
      }
    }
  }
}
</style>


