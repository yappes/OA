<template>
  <div>
    <aui-input type="text" placeholder="选择成员" id="input" v-model="userNamesString"  @focus="dialogEditMember=true" clearable></aui-input>
    <!-- 申请人 -->
    <aui-dialog title="选择成员" :visible.sync="dialogEditMember" v-if='dialogEditMember' :modal='true' :close-on-click-modal="false" :modal-append-to-body="true" append-to-body width="80%">
      <aui-form :inline="true" label-width="100px" class="demo-form-inline" style="width:100%">
        <aui-form-item label="当前成员">
          <aui-input v-model="myMembers" :disabled="true" placeholder="当前成员" style="width:300%"></aui-input>
        </aui-form-item>
      </aui-form>
      <div class="showMembers">
        <aui-form :inline="true" label-width="100px" style="width:100%" class="demo-form-inline">
          <aui-form-item style="width:30%">
            <aui-input placeholder="输入组织部门进行过滤" style="float:left;width:120%;" v-model="filterText"></aui-input>
          </aui-form-item>
          <aui-form-item label="按姓名搜索" style="width: 60%;float:right">
            <span @keyup.enter="findUserByName">
              <aui-input style="width:260px;" v-model="member" placeholder="请输入申请人姓名"></aui-input>
            </span>
            <aui-button type="text" @click='findUserByName'>搜 索</aui-button>
          </aui-form-item>
        </aui-form>
        <aui-tree class="filter-tree" style="border:none;float:left;height:245px;width:30%;overflow-y:auto;" :data="orgTree" default-expand-all ref="tree2" highlight-current @node-click="handleNodeClick">
        </aui-tree>

        <aui-table ref="table" :data="memberMessage" stripe tooltip-effect="dark" :row-key='getRowKey' v-loading='loading'
          style="width: 60%;margin-left:35%;overflow-y:auto; overflow-x:hidden;height:260px" @select='handleSelect' @select-all='handleSelect' @current-radio-change='handleRadio'>
          <aui-table-column :type="choose" width="30px"> 
          </aui-table-column>
          <aui-table-column label="姓名" prop="userName">
          </aui-table-column>
          <aui-table-column label="ID" prop="userId">
          </aui-table-column>
          <aui-table-column prop="email" label="邮箱">
          </aui-table-column>
        </aui-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <aui-button :plain="true" @click="dialogEditMember=false">取 消</aui-button>
        <aui-button type="primary" @click="submit">确 定</aui-button>
      </div>
    </aui-dialog>
  </div>
</template>
<script>
import {
  workflowCategoryService,
  workflowTaskService,
  workflowAuthService,
  workflowProcessService,
  orgService,
  userService,
} from "paas-web-utils/services";
export default {
  props: {
    // value: Array,
    value: {
      type: [Array, String],
    },
    default: "",
    //是否多选 selection:多选, radio:单选
    choose: {
      type: String,
      default: "selection"
    }
  },
  data() {
    return {
      loading: false,
      dialogEditMember: false,
      userNamesString: '',
      myMembers: "",
      selection: [],
      filterText: "",
      member: "",
      treeData: [],
      memberMessage: [],
      orgCode: "",
      userIds: [],
      orgTree: [],
    };
  },
  computed: {
    userIdString: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit("input", newValue);
      }
    },
    memberIds() {
      return this.memberMessage.map(data => {
        return String(data.userId)
      })
    },
    userNameArray: {
      get() {
        return this.userNamesString.split('，')
      },
      set(val) {
        this.userNamesString = val.join('，')
      }
    }
  },
  mounted() {
    this.getOrgAll();
    this.findNamesStringByIds()
  },
  methods: {
    getNameString(datas) {
      let names = datas.map(data => {
        return data.realName;
      });
      return names.join("，");
    },
    getIdString(datas) {
      let ids = datas.map(data => {
        return data.userId;
      });
      return ids.join(",");
    },
    getRowKey(row) {
      return row.userId;
    },
    findNamesStringByIds() {
      if (this.userIdString) {
        this.userIds = this.userIdString.split(',')
        userService.findUserList({
          userIdList: this.userIds
        }).then(datas => {
          this.userNamesString = this.getNameString(datas)
          // this.myMembers = this.getNameString(datas)
        })
      }
    },
    //TODO:搜索查询接口，暂用分页查询接口
    findUserByName() {
      this.loading = true
      userService.findUserByPage({
        searchKey: this.member,
        sidx: "createTime",
        order: "ASC",
        pageNow: 1,
        pageSize: 100,
      }).then(data => {
        this.loading = false
        this.memberMessage = data.record.map(item => {
          return {
            userName: item.realName,
            userId: item.id,
            email: item.email,
          }
        })
      });
    },
    handleNodeClick(data) {
      this.orgCode = data.orgCode;
      this.getUserOrg();
      //用setTimeout-200才能正确实现勾选的回显
      setTimeout(() => {
        this.getSelected()
      }, 200)
    },
    // 获取部门下用户
    getUserOrg() {
      this.loading = true
      userService
        .findUserList({ orgCode: this.orgCode })
        .then(data => {
          // console.log(data)
          this.loading = false
          if(!data || JSON.stringify(data) === '{}') {
            this.memberMessage = []
            return
          }
          this.memberMessage = data.map(item => {
            return {
              userName: item.realName,
              userId: item.id,
              email: item.email,
            }
          })
        });
    },
    handleSelect(selection) {
      let selectionIds = selection.map(e => {
        return String(e.userId)
      })
      let tempIds = [] 
      this.userIds.forEach(id => {
        if(this.memberIds.indexOf(id) < 0) {
          tempIds.push(id)
        }
      })
      //得到每次选择后的this.userId
      this.userIds = [...tempIds, ...selectionIds]
      // console.log('this.userIds', this.userIds)
      userService.findUserList({
        userIdList: this.userIds
      }).then(datas => {
        // console.log('选择的用户信息', datas)
        this.myMembers = this.getNameString(datas)
      })
    },
    handleRadio(val, old) {
      this.userIds = [String(val.userId)];
      this.$set(this, "myMembers", val.userName);
    },
    getOrgAll() {
      orgService.findOrgList().then(data => {
        this.treeData = this.listToTree("orgCode", "orgParentCode", data)
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
      // console.log(this.orgTree)
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
          row.label = row.orgName;
          nodes.push(row);
          this.treeId = row.id;
        }
      }
      var toDo = [];
      for (var i = 0; i < nodes.length; i++) {
        nodes[i].label = nodes[i].orgName;
        toDo.push(nodes[i]);
      }
      while (toDo.length) {
        var node = toDo.shift(); // the parent node
        // get the children nodes
        for (var i = 0; i < list.length; i++) {
          var row = list[i];
          if (row[pId] == node[myId]) {
            //var child = {id:row.id,text:row.name};
            row.label = row.orgName;
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
    getSelected() {
      // console.log(this.memberMessage, this.userIds)
      this.memberMessage.forEach(row => {
        let id = String(row.userId)
        if(this.userIds.indexOf(id) >= 0) {
          // console.log('回显勾选 index', row)
          this.$nextTick(() => {
            this.$refs.table.toggleRowSelection(row, true)
          })
        }
      })
    },
    submit() {
      //提交的时候才赋值给外层的input框
      this.userNamesString = this.myMembers;
      this.userIdString = this.userIds.join(',')
      this.dialogEditMember = false;
    }
  },
  watch: {
    dialogEditMember(val) {
      if (val) {
        this.myMembers = this.userNamesString;
        this.findNamesStringByIds()
        //弹窗时回显勾选
        this.getSelected()
      } else {
        this.$refs.table.clearSelection();
      }
    },
    userNamesString(val) {
      if(!val) {
        this.userIdString = ''
        this.userIds = []
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

