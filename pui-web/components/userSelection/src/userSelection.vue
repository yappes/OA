<template>
  <div class="pui-user-selection">
    <template v-if="multiple">
      <multiple-tags :value="inputValue" :placeholder="placeholder" :disabled="disabled" :focus-handler="focusHandler" @close-tag="closeTag"></multiple-tags>
    </template>
    <template v-else>
      <aui-input @focus="focusHandler" ref="inputInstance" :placeholder="placeholder" :value="inputValue" :disabled="disabled" readonly @mouseenter.native='moveIntoInput=true' @mouseleave.native='moveIntoInput=false'>
        <i slot="suffix" v-show='showSearchIcon' class="aui-search__icon pui-icon-yonghu" @click="focusHandler"></i>
        <i slot="suffix" v-show='showCloseIcon' class="aui-close__icon aui-icon-circle-close" @click="cleanData(inputValue = '')"></i>
        <!-- <i slot="suffix" class="aui-input__icon pui-icons pui-icon-yonghu" @click="focusHandler"></i> -->
      </aui-input>
    </template>
    <aui-dialog :close-on-click-modal="false" lock-scroll title="选择用户" :visible.sync="dialogVisible" width="80%" append-to-body>
      <aui-tree class="pui-user-selection__org" node-key="orgCode" :data="orgDatas" :props="defaultProps" accordion @node-click="handleNodeClick">
      </aui-tree>
      <div class="pui-user-selection__list-box">
        <aui-input @keyup.enter.native="enterKeyEvent" size="medium" clearable class="pui-user-selection__fuzzy-search" placeholder="请输入姓名" prefix-icon="aui-icon-search" v-model="fuzzyKey">
        </aui-input>
        <aui-table max-height="450" highlight-current-row emptyText="暂无数据" stripe ref="multipleTable" @row-click="handleRowClick	" @selection-change="handleSelectionChange" :data="userData" style="min-height: 400px;" class="pui-user-selection__list" border>
          <aui-table-column type="selection" min-width="40" v-if="multiple" fixed="left"></aui-table-column>
          <aui-table-column type="index" min-width="40" fixed="left"></aui-table-column>
          <aui-table-column prop="realName" label="姓名" min-width="120"></aui-table-column>
          <aui-table-column prop="mobile" label="手机号" min-width="120"></aui-table-column>
          <aui-table-column prop="createTime" label="创建时间" min-width="140" :formatter="dateFormatter"></aui-table-column>
        </aui-table>
      </div>
      <div slot="footer" v-if="multiple">
        <aui-button @click="dialogVisible = false">取 消</aui-button>
        <aui-button type="primary" @click="confirmHandler">确定</aui-button>
      </div>
    </aui-dialog>
  </div>
</template>

<script>
import MultipleTags from "../../multiple-tags/main.vue";
import __ORG_MANAGE__ from "paas-web-utils/rules/organization";
import { formatDate } from "paas-web-utils/rules/enum";
import { userService } from "paas-web-utils/services";
// 获取所有的用户信息
let allUserPromise = undefined;
const allUserMaps = {};
export default {
  name: "PuiUserSelection",
  components: { MultipleTags },
  props: {
    column: {},
    value: {},
    multiple: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String
    }
  },
  data() {
    let confirmHandler = this.multiple
      ? this.selectionHandlerMutiple
      : this.selectionHandler;
    let inputDefaultValue = this.multiple ? [] : undefined;
    return {
      dialogVisible: false,
      fuzzyKey: "",
      userData: [],
      orgDatas: [],
      orgData: {},
      inputValue: inputDefaultValue,
      currentValue: this.value,
      multipleSelection: [],
      defaultProps: {
        children: "children",
        label: "orgName"
      },
      confirmHandler: confirmHandler,
      moveIntoInput: false
    };
  },

  computed: {
    showSearchIcon() {
      if (this.disabled) {
        return false;
      }
      return !this.showCloseIcon;
    },
    showCloseIcon() {
      if (this.disabled) {
        return false;
      }
      return (
        this.moveIntoInput &&
        this.inputValue !== undefined &&
        this.inputValue !== ""
      );
    }
  },

  watch: {
    value(val) {
      if (val === this.currentValue) return;
      this.currentValue = val;
      this.dataEcho(val);
    },
    fuzzyKey: function() {
      if (this._timeoutId) {
        clearTimeout(this._timeoutId);
      }
      this._timeoutId = setTimeout(() => {
        this.enterKeyEvent();
      }, 500);
    }
  },
  mounted() {
    __ORG_MANAGE__.loading().then(data => {
      this.orgDatas = data;
    });
    if (!allUserPromise) {
      allUserPromise = userService.findUserList({}).then(allUser => {
        for (const iterator of allUser) {
          allUserMaps[iterator.id] = iterator;
        }
        return allUser;
      });
    }
    allUserPromise.then(allUser => {
      this.userData = allUser.splice(0, 100);
      this.dataEcho(this.value ? String(this.value) : this.value);
    });
  },
  methods: {
    dataEcho(val) {
      let values = this.strToArray(val);
      let inputValue = [];
      for (const value of values) {
      if (!value || value == null || value == "null" || value == "undefined" || value == "") continue;
        let user = allUserMaps[value];
        console.log("allUserMaps[value]", value, (user || {}).realName);
        if (user) {
          inputValue.push(user.realName);
        } else {
          inputValue.push(value);
        }
      }
      if (this.multiple) {
        this.inputValue = inputValue;
        this.column.triggerShowValueChanage(inputValue.join(","));
      } else {
        this.inputValue = inputValue[0];
        if(this.column){
          this.column.triggerShowValueChanage(this.inputValue);
        }
      }
    },
    closeTag(index) {
      this.inputValue.splice(index, 1);
      let selectedIds = this.strToArray(this.currentValue);
      selectedIds.splice(index, 1);
      if (selectedIds.length > 0) {
        this.currentValue = `,${selectedIds.join(",")},`;
      } else {
        this.currentValue = "";
      }
      this.handleInput();
    },
    handleNodeClick(data) {
      this.orgData = data;
      this.getUserData({
        orgCode: data.orgCode
      });
    },
    focusHandler() {
      if (this.disabled) return;
      this.dialogVisible = true;
      if (this.multiple && this.$refs.multipleTable) {
        this.$refs.multipleTable.clearSelection();
      }
    },
    cleanData(value) {
      if (!Boolean(value)) {
        this.currentValue = null;
        this.handleInput();
      }
    },
    getUserData(params) {
      return userService.findUserList(params).then(data => {
        if (Object.keys(data).length === 0) {
          this.userData = [];
        } else {
          this.userData = data.splice(0, 100);
        }
        return this.userData;
      });
    },
    enterKeyEvent() {
      userService
        .findUserByPage({
          searchKey: this.fuzzyKey,
          orgCode: null,
          orgId: null
        })
        .then(data => {
          if (Object.keys(data).length === 0 || data.totalRecord === 0) {
            this.userData = [];
          } else {
            this.userData = data.record;
          }
        });
    },
    strToArray(str) {
      if (!str || str === null || str === "") return [];
      str = String(str);
      if (str.charAt(0) === ",") {
        str = str.substr(1);
      }
      if (str.charAt(str.length - 1) === ",") {
        str = str.substr(0, str.length - 1);
      }
      return str.split(",");
    },
    selectionHandlerMutiple() {
      let inputValue = [];
      let selectedIds = [];
      let multipleSelection = this.multipleSelection;
      // 多选情况下 可以选择某部门下的所有用户
      if (this.multiple && multipleSelection.length === 0) {
        multipleSelection = this.userData;
      }
      multipleSelection.forEach(item => {
        inputValue.push(item.realName);
        selectedIds.push(item.id);
      });
      if (this.multiple) {
        // 合并老的数据 和新的数据
        let currentValue = this.strToArray(this.currentValue);
        for (const index in selectedIds) {
          let selectedId = selectedIds[index];
          // 存在
          if (currentValue.indexOf(String(selectedId)) >= 0) continue;
          this.inputValue.push(inputValue[index]);
          currentValue.push(selectedId);
        }
        if (currentValue.length > 0) {
          this.currentValue = `,${currentValue.join(",")},`;
        }
        this.column.triggerShowValueChanage(this.inputValue.join(","));
      } else {
        this.inputValue = inputValue[0];
        this.currentValue = selectedIds[0];
        if(this.column){
          this.column.triggerShowValueChanage(this.inputValue);
        }
      }
      this.dialogVisible = false;
      this.handleInput();
    },
    handleInput() {
      this.$emit("input", this.currentValue);
      if (this.$refs.inputInstance) {
        this.$refs.inputInstance.dispatch("AuiFormItem", "aui.form.blur", [
          this.inputValue
        ]);
      }
    },
    handleRowClick(row, event, column, index) {
      if (this.multiple) {
        // 多选模式
        this.$refs.multipleTable.toggleRowSelection(row);
      } else {
        this.multipleSelection = [this.userData[index]];
        this.selectionHandlerMutiple();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    dateFormatter(row, column, cellValue) {
      cellValue = new Date(cellValue);
      return formatDate(cellValue, "yyyy-MM-dd hh:mm");
    }
  }
};
</script>

<style lang='scss'>
@import "./userSelection.scss";
</style>
