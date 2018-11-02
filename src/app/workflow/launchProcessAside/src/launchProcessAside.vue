<template>
  <div class="pui-launch-process-aside" @click="getTreeData" >
    <aui-tree :data="processAsideData" :props="defaultProps" @node-click="handleNodeClick" default-expand-all></aui-tree>
  </div>
</template>

<script>
import { workflowCategoryService } from "paas-web-utils/services";
export default {
  name: "PuiLaunchProcessAside",
  data() {
    return {
      processAsideData: [], 
      defaultProps: {
        children: "children",
        label: "label"
      },
      categoryCode: "",
    };
  },
  mounted() {
    this.getTreeData();
  },
  methods: {
    handleNodeClick(data) {
      // console.log("data",data);
      this.categoryCode = data.categoryCode;
      //  console.log('emit categoryCode', this.categoryCode)
      this.$emit("categoryCode", this.categoryCode);
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
        this.processAsideData = this.listToTree("id", "pid", data);
      });
    },
  }
};
</script>

<style lang="scss">
@import "./launchProcessAside.scss";
</style>


