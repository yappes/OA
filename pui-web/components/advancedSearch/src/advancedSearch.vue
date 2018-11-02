<template>
  <div>
     <!-- :class="{slideInLeft: !isShowAlternative, slideOutLeft: isShowAlternative}" -->
    <div class="pui-advanced-search">
      <aui-button class="pui-advanced-search__btn" size="mini" style="border-radius:0" @click="queryConditionVisible = true">
        高级搜索
      </aui-button>
      <!-- <aui-tag class="pui-advanced-search__tag" v-for="item in searchLabelsReadonly" :key="item.id" :style="{color: (item.id === selectTagId ? '#26B7AE' : '#606266'), borderColor: (item.id === selectTagId ? '#26B7AE' : '#dcdfe6')}" style="cursor:pointer;" @click.native="selectTag(item)">{{item.tagName}}</aui-tag> -->
      <!-- <aui-tag class="pui-advanced-search__tag" v-for="(item,index) in searchLabelsCtrl1" :key="item.id" style="cursor:pointer;" :type="item.id === selectTagId ? '':'info'" :style="{color: (item.id === selectTagId ? '#26B7AE' : '#606266'), borderColor: (item.id === selectTagId ? '#26B7AE' : '#dcdfe6')}" @click.native="selectTag(item)" closable @close="handleClose(index)">{{item.tagName}}
      </aui-tag> -->
      <aui-select class="pui-advanced-search__select searchLabelsCtrl-select"  v-model="value" placeholder="请选择查询条件"  @change="selectTag(value)" clearable>
         <!-- 数据库原本数据 -->
         <aui-option
          v-for="item in allSearchLabels.searchLabelsReadonly"
          :key="item.id"
          :label="item.tagName"
          :value="item.id"
          :style="{color: (item.id === selectTagId ? '#26B7AE' : '#606266')}">
        </aui-option>
        <!-- 自定义数据 -->
        <aui-option class="searchLabelsCtrl-select-option"
          v-for="(item,index) in allSearchLabels.searchLabelsCtrl"
          :key="item.id"
          :label="item.tagName"
          :value="item.id"
          :style="{color: (item.id ===  selectTagId ? '#26B7AE' : '#606266')}">
          {{item.tagName}}
          <i class="aui-icon-delete " style="position:absolute;line-height:36px;right:10px;color:#c0c4cc" @click="handleClose(index)"></i>
        </aui-option>

      </aui-select>
    </div>
    
    <aui-dialog :close-on-click-modal="false" title="配置查询条件" class="pui-advanced-search__dialog" :visible.sync="queryConditionVisible" width="80%">
      <pui-query-condition class='query-condition' :selectTagId="selectTagId" :allSearchLabels="allSearchLabels" :view-id="viewId" :module-id="moduleId" :visible.sync="queryConditionVisible" @submit-success="getQueryData">
      </pui-query-condition>
    </aui-dialog>

  </div>
</template>

<script>
import { queryService } from "paas-web-utils/services";

export default {
  name: "PuiAdvancedSearch",
  props: {
    viewId: {},
    moduleId: {},
    selectTagId: {},
    // isShowAlternative: {
    //   type: Boolean,
    //   required: true
    // },
    advancedSearchDialog: {
      type: Boolean
    }
  },
  data() {
    return {
      allSearchLabels:{
        searchLabelsCtrl:[],
        searchLabelsReadonly: [],
      },
      // searchLabelsCtrl:[],
      // value: "",
      value: this.selectTagId,
      deleteTag: false,
      // valueTag: "",
      // searchLabelsReadonly: [],
      queryConditionVisible: this.advancedSearchDialog,
      paddingStr: "9px 10px"
    };
  },
  watch: {
    viewId() {
      //系统标签
      queryService.findSystemTagByViewId({ viewId: this.viewId }).then(data => {
        this.allSearchLabels.searchLabelsReadonly = data;
        // console.log('searchLabelsReadonly',data)
      });
      this.getQueryData();
    }
  },
  mounted() {
    //系统标签
    queryService.findSystemTagByViewId({ viewId: this.viewId }).then(data => {
      this.allSearchLabels.searchLabelsReadonly = data;
      // console.log('searchLabelsReadonly',data,this.searchLabelsReadonly)
       console.log('searchLabelsReadonly',this.allSearchLabels.searchLabelsReadonly);
    });
    this.getQueryData();
    console.log('selectTagId', this.selectTagId)
      
    
  },
  methods: {
    selectTag(item) {
      // console.log("this.item",item);
      if(!this.deleteTag) {
        this.$emit("select-tag", item);
      }
    },
    // selectTag2(item) {
    //   console.log("selectItem=>",item);
    //   this.$emit("select-tag", item.id);
    //   this.valueTag="";
    // },
    //获取标签组数据
    getQueryData() {
      //用户自定义标签
      queryService.findCustomTagByViewId({ viewId: this.viewId }).then(data => {
        // console.log("data",data)
        this.allSearchLabels.searchLabelsCtrl = data;
        this.allSearchLabels.searchLabelsCtrl.forEach(v=>{
          v.isSearchLabelsCtrl = true;
         });
        console.log('searchLabel',this.allSearchLabels.searchLabelsCtrl);
        // console.log("this.allSearchLabels.searchLabelsCtrl ", this.allSearchLabels.searchLabelsCtrl );
      });
    },
    //删除标签
    handleClose(tag) {
      // console.log("tag",tag);
        this.deleteTag = true
        // this.value="";
        queryService.delById({ id: this.allSearchLabels.searchLabelsCtrl[tag].id }).then(() => {
        this.getQueryData();
        this.$emit("select-tag", undefined);
        this.value="";
        this.deleteTag = false
      });
    },
    showQueryCondition: function() {
      //鼠标移入显示编辑框
      // this.queryConditionVisible = true;
    }
    // blurFn() {
    //   this.queryConditionVisible = false;
    //   console.log(this.queryConditionVisible);
    // }
  }
};
</script>
<style lang="scss">
@import "./advancedSearch.scss";
//高级搜索鼠标滑入显示相关内容
.pui-advanced-search__new {
  position: relative;
}
.pui-advanced-search .aui-tag {
  margin: 0 10px;
}
.pui-advanced-search__dialog {
  & .aui-dialog__body {
    padding: 0;
  }
  & .pui-query-condition {
    //margin-left: 100px;
    // top: 35px !important;
    // left: -110px;
    .pui-query-condition__triange,
    .pui-query-condition__triange1 {
      left: 40px;
    }
  }
}

</style>
