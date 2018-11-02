<template>
  <div class="pui-choose-icon">
    <aui-dialog class="pui-choose-icon-dialog"
    :close-on-click-modal="false"
        title="选择菜单图标"
        :visible="iconShow" 
        @hide="closeIcon">
      <div class="icon-list">
        <ul>
          <li v-for="item in iconList" :key="item" @click="getIconClass(item)" class="icon-list-item">
            <i :class="item" class="icon-list-item-pic"></i>
          </li>
        </ul>
      </div>
    </aui-dialog>
  </div>
</template>
<script>
import Data from './icon.json'
export default {
  name:'ChooseIcon',
  data(){
    return{
      iconList:[],
    }
  },
  props:{
    iconShow:{
      type:Boolean,
      default:false,
    }
  },
  created(){
    this.iconList = Data;
  },
  methods:{
    //获取选中图标信息
    getIconClass(iconClass){
      this.$emit('getIconClass',iconClass);
      this.closeIcon();
    },
    //关闭对话框
    closeIcon(){
      this.$emit('closeIcon');
    },
  }
}
</script>
<style lang="scss" scoped>
.icon-list{
  .icon-list-item{
    float: left;
    width: 10%;
    .icon-list-item-pic{
      width: 100%;
      height: 60px;
    }
  }
}
</style>


