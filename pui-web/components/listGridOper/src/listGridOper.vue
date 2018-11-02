<template>
  <div class="pui-list-grid__operations-wrapper">
    <template v-for="oper in buttonGroups.groups">
      <aui-tooltip class="item" effect="dark" v-if="oper.description && !oper.hidden" :key="oper.$id" :content="oper.description" placement="top-start">
        <!-- <pui-btn type="primary" class="pui-list-grid__oper" :heightStr="heightStr" :loading="oper.loadingStatus" @click="handleButtonClick(oper)">{{oper.lable}}</pui-btn> -->
        <aui-button class="pui-list-grid__oper"  :loading="oper.loadingStatus" @click="handleButtonClick(oper)">{{oper.lable}}</aui-button>
      </aui-tooltip>
      <!-- <pui-btn v-else type="primary" class="pui-list-grid__oper" :heightStr="heightStr" :key="oper.$id" :loading="oper.loadingStatus" @click="handleButtonClick(oper)">{{oper.lable}}</pui-btn> -->
      <aui-button v-else-if="!oper.hidden" class="pui-list-grid__oper" :key="oper.$id" :loading="oper.loadingStatus" @click="handleButtonClick(oper)">{{oper.lable}}</aui-button>
      
    </template>
    <aui-dropdown v-if="buttonGroups.more.length > 0" @command="(oper) => handleButtonClick(oper)">
      <pui-btn  class="pui-list-grid__oper" :style="{'line-height': false, 'height': false}">
        更多按钮
        <i class="aui-icon-arrow-down aui-icon--right"></i>
      </pui-btn>
      <aui-dropdown-menu slot="dropdown">
        <aui-dropdown-item v-for="oper in buttonGroups.more" :key="oper.$id" :command="oper">{{oper.lable}}</aui-dropdown-item>
      </aui-dropdown-menu>
    </aui-dropdown>
  </div>
</template>

<script>
export default {
  name: "PuiListGridOper",

  props: {
    columns: {
      type: Array,
      default: () => {
        return [];
      }
    },
    buttons: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  computed: {
    buttonGroups() {
      let buttonGroups = {
        groups: [],
        more: []
      };
      let buttons = [];
      for (const iterator of this.buttons) {
        buttons.push(iterator);
      }
      buttonGroups.groups = buttons.splice(0, 5);
      buttonGroups.more = buttons.splice(0, buttons.length);
      return buttonGroups;
    }
  },
  mounted() {
    // console.log("buttonGroups", this.buttonGroups);
  },
  methods: {
    handleButtonClick(button) {
      this.$emit("button-click", button, "SELECT_DATA_LIST");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./listGridOper.scss";
.aui-button {
  border-radius: 0;
}
</style>