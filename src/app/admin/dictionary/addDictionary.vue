<template>
  <div class="pui-add-dictionary">
    <aui-dialog :close-on-click-modal="false" title="新增字典" width="49%" :visible="isVisible" @hide="handleClose">
      <aui-form :model="newDictionary" ref="form" label-width="40%" :inline="true" style="minWidth:665px">
        <div v-for="(item,index) in newDictionary.dicList" :key="item.id">
          <aui-form-item label="字典名称" :prop="'dicList.' + index + '.dictName'" :rules="{ required: true, message: '请输入字典名称', trigger: 'blur' }">
            <aui-input v-model="item.dictName" class="pui-add-dictionary-input" placeholder="请输入字典名称"></aui-input>
          </aui-form-item>
          <aui-form-item label="字典编码" :prop="'dicList.' + index + '.dictCode'" :rules="{ required: true, validator: checkDicCode, trigger: 'blur'}">
            <aui-input v-model="item.dictCode" class="pui-add-dictionary-input" placeholder="请输入字典编码"></aui-input>
          </aui-form-item>
          <!-- <span @click="addList" class="pui-add-dictionary-add">+</span>
          <span @click="removeList(index)" class="pui-add-dictionary-remove" v-if="newDictionary.dicList.length > 1">－</span> -->
          <i class="aui-icon-plus item-icon" @click="addList"></i>
          <i class="aui-icon-minus item-icon" @click="removeList(index)" v-if="newDictionary.dicList.length > 1"></i>
        </div>
      </aui-form>
      <span slot="footer" class="dialog-footer">
        <aui-button :plain="true" @click="handleClose">取消</aui-button>
        <aui-button type="primary" @click="addDictionary('form')">确定</aui-button>
      </span>
    </aui-dialog>
  </div>
</template>
<script>
import { dictionaryService } from "paas-web-utils/services";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "AddDictionary",
  data() {
    return {
      newDictionary: {
        dicList: [
          {
            dictName: "",
            dictCode: "",
            dictParentCode: "0",
            dictType: "",
            sort: null
          }
        ]
      }
    };
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    //字典编码唯一性验证／正则验证
    checkDicCode(rule, value, callback) {
      if (!value) {
        callback(new Error("请输入字典编码"));
      } else {
        let myreg = /^[a-zA-Z0-9_-]{1,20}$/;
        if (!myreg.test(value)) {
          callback(new Error("字典编码格式错误"));
        } else {
          let parame = {
            dict_code: value,
            dict_parent_code: this.nowType
          };
          dictionaryService.checkDictCode(parame).then(data => {
            if (data == "NOTEXIST") {
              callback();
            } else {
              callback(new Error("字典编码已存在"));
            }
          });
        }
      }
    },
    //保存字典
    addDictionary(formName) {
      let form = this.$refs[formName];
      form.validate(valid => {
        if (valid) {
          this.newDictionary.dicList.forEach(v => {
            v.dictType = this.nowType;
            v.dictParentCode = this.nowType;
          });
          let parame = { dictList: this.newDictionary.dicList };
          dictionaryService.addDictionary(parame).then(data => {
            this.handleClose();
            this.$emit("initView");
          });
        } else {
          return false;
        }
      });
    },
    //取消 关闭对话框
    handleClose() {
      this.$emit("closeDialog");
      this.$refs.form.resetFields();
    },
    //添加一条字典编辑
    addList() {
      let dicOption = {
        dictName: "",
        dictCode: "",
        dictParentCode: "0",
        dictType: "",
        sort: null
      };
      this.newDictionary.dicList.push(dicOption);
    },
    //删除当前字典编辑
    removeList(index) {
      this.newDictionary.dicList.splice(index, 1);
    }
  },
  computed: mapGetters({
    nowType: "dictionary/dictType"
  }),
  mounted() {}
};
</script>
<style lang="scss" scoped>
@import "~theme/common/var";
// .pui-add-dictionary-input{
// width: 170px;
// }
// .pui-add-dictionary-add,
// .pui-add-dictionary-remove {
//   cursor: pointer;
//   font-size: 24px;
//   line-height: 38px;
//   // margin-left: 20px;
//   margin-left: 2%;
// }
//加减号样式
.item-icon {
  margin-right: 2%;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
  color: $--font-color-gray;
  &:hover {
    color: #26b7ae;
  }
}

//弹框样式
.pui-add-dictionary /deep/ {
  & .aui-form-item {
    width: 42%;
    & .aui-form-item__content {
      width: 56%;
    }
  }
}
</style>

       
        