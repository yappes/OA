<template>
  <!-- 点击 字段选择 设置 显示内容 -->
  <aui-dialog :close-on-click-modal="false" title="请选择显示的字段" append-to-body :visible.sync="dialogVisible" :data="columnsMini" class="pui-list-grid__set">
    <div class="pui-list-grid__body">
      <div class="pui-list-grid__setup">
        <p>已选字段：</p>
        <span class="pui-list-grid__setup-oper" v-for="column in columnsMini" :key="column.$id" v-if="column.hidden==false">
          {{column.label}}
          <i class="aui-icon-close" @click="delSettingDialog(column.$id)"></i>
        </span>
      </div>

      <div class="pui-list-grid__setdown">
        <p>可选字段：</p>
        <span class="pui-list-grid__setdown-oper" v-for="column in columnsMini" :key="column.$id" v-if="column.hidden==true">
          {{column.label}}
          <i class="aui-icon-plus" @click="addSettingDialog(column.$id)"></i>
        </span>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <aui-button :heightStr="heightStr" :widthStr="widthStr" :plain="true" @click="dialogVisible = false">取消</aui-button>
      <aui-button :heightStr="heightStr" :widthStr="widthStr" type="primary" @click="confirmSetting">保存</aui-button>
    </span>
  </aui-dialog>
</template>

<script>
export default {
  name: "PuiFieldSelection",

  props: {
    columns: {
      type: Array,
      default: () => {
        return [];
      }
    },
    isDisplay: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      dialogVisible: false,
      // heightStr: '34px',
      // widthStr: '120px',
      widthStr: "70px",
      heightStr: "40px",
      interColumns: [],
      columnsMini: []
    };
  },

  watch: {
    isDisplay(val) {
      val && (this.dialogVisible = true);
    },

    dialogVisible(val) {
      !val && this.$emit("close-field-selection");
      if (val) {
        this.reloadColums();
      }
    }
  },

  mounted() {
    this.$set(this, "interColumns", this.columns);
    this.reloadColums();
  },

  methods: {
    reloadColums() {
      //拷贝interColumns数据做弹窗内的增删
      let columnsMini = [];
      for (var i = 0; i < this.interColumns.length; i++) {
        var newColumn = { $id: null, label: "", hidden: null };
        newColumn.$id = this.interColumns[i].$id;
        newColumn.label = this.interColumns[i].label;
        newColumn.hidden = this.interColumns[i].hidden;
        columnsMini.push(newColumn);
      }
      this.columnsMini = columnsMini;
    },
    //关闭弹窗保存设置
    confirmSetting: function() {
      let bool = true;
      for (var i = 0; i < this.interColumns.length; i++) {
        for (var j = 0; j < this.columnsMini.length; j++) {
          if (this.interColumns[i].$id == this.columnsMini[j].$id) {
            this.interColumns[i].hidden = this.columnsMini[j].hidden;
            bool = bool && !this.columnsMini[j].hidden;
          }
        }
      }
      this.dialogVisible = false;
      if (bool) {
        this.$emit("change-column");
      }
      this.$emit('reload-storage')
    },

    //删除已选项
    delSettingDialog: function($id) {
      this.columnsMini.forEach((v, k) => {
        if (v.$id == $id) {
          v.hidden = true;
        }
      });
    },

    //增加选择项
    addSettingDialog: function($id) {
      this.columnsMini.forEach((v, k) => {
        if (v.$id == $id) {
          v.hidden = false;
        }
      });
    }
  }
};
</script>

<style lang='scss'>
@import "./fieldSelection.scss";
.aui-button {
  border-radius: 0;
}
</style>
