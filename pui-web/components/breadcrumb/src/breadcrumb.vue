<template>
  <div class='pui-breadcrumb__wrap'>
    <div class="pui-breadcrumb">
      <div class="pui-breadcrumb__current">
        <span class="pui-breadcrumb__current-span">{{currentGroup}}</span>
        <i class="pui-icon-superior-icon"></i>
        <span class="pui-breadcrumb__current-span">{{currentItem}}</span>
        <!-- @click="handleToggle" -->
        <i id="btn-toggle" class="pui-icon-sjiantou02"></i>
      </div>
      <div class="pui-breadcrumb__toggle-bar">
        <!-- :class="{slideInLeft:isShowAlternative,slideOutLeft:!isShowAlternative}" -->
        <ul class="pui-breadcrumb__alternative">
          <li class="pui-breadcrumb__alternative__item" v-for="item in realAlternativeItems.showItems" :key="item.id">
              <div @click="menuClick(item)"><i class="icon" :class="item.iconClass" :style="'color:'+item.iconColor"></i>{{item.name}}</div>
          </li>
          <aui-dropdown v-show='realAlternativeItems.isHidden' class="pui-breadcrumb__alternative__item"  @command='menuClick'>
            <span class='more'>
              ...
              <!-- <i class="aui-icon-arrow-down aui-icon--right"></i> -->
            </span>
            <aui-dropdown-menu slot="dropdown" class='dropdown'>
              <aui-dropdown-item v-for='item in realAlternativeItems.hiddenItems' :key='item.id' :command='item'  :style='{minWidth: "150px"}'>
                <i style="marginRight:3px" :class="item.iconClass" :style="'color:'+item.iconColor"></i>{{item.name}}
              </aui-dropdown-item>
            </aui-dropdown-menu>
          </aui-dropdown>
        </ul>
        <!-- <pui-advanced-search 
        :isShowAlternative="isShowAlternative" 
        :advancedSearchDialog="advancedSearchDialog" 
        @select-tag="selectTag"
        :view-id="viewId"
        :select-tag-id="selectTagId"
        :module-id="moduleId">
        </pui-advanced-search> -->
      </div>
    </div>
  </div>
</template>

<script>
import { breadCrumbService } from "paas-web-utils/services";

export default {
  name: "PuiBreadcrumb",
  props: {
    moduleId: {},
    viewId: {},
    selectTagId: {},
  },
  data: function() {
    return {
      advancedSearchDialog: false,
      // isShowAlternative: false,
      currentGroup: "加载中",
      currentItem: "...",
      alternativeItems: [],
      showAlternativeItemsLength: 5,
    };
  },
  watch: {
    viewId(viewId) {
      this.loadData(viewId);
    }
  },
  mounted() {
    if (this.viewId) {
      this.loadData(this.viewId);
    }
  },
  computed: {
    realAlternativeItems() {
      let length = this.alternativeItems.length
      //是否折叠选项
      let isHidden = length > this.showAlternativeItemsLength
      let l = isHidden ? this.showAlternativeItemsLength : length
      //折叠的选项数组
      let hiddenItems = isHidden ? this.alternativeItems.slice(l) : []
      //显示的选项数组
      let showItems = this.alternativeItems.slice(0, l)
      let r = {
        isHidden,
        showItems,
        hiddenItems,
      }
      return r
    },
  },
  methods: {
    selectTag(tagId){
      this.$emit('select-tag', tagId);
    },
    // handleToggle: function() {
    //   this.isShowAlternative = !this.isShowAlternative;
    // },
    loadData(viewId) {
      breadCrumbService.findByViewId(viewId).then(data => {
        let datas = data;
        this.alternativeItems = [];
        for (var index in datas) {
          let data = datas[index];
          if (data.pid === 0) {
            this.currentGroup = data.name;
          } else if (Number(data.viewId) === Number(viewId)) {
            this.currentItem = data.name;
          } else {
            this.alternativeItems.push(data);
          }
        }
      });
    },
    menuClick(item) {
      this.$router.push({ name: "business", params: { viewId: item.viewId } });
    },
  }
};
</script>
<style lang="scss">
@import "./breadcrumb.scss";
</style>
