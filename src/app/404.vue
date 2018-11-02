<template>
  <div class="pui-not-found" :style="{height:notFoundHeight}">
    <pui-layout >
      <pui-nav-top slot="nav"></pui-nav-top>
      <div slot="full" class="pui-not-found__main">
        <span class="pui-not-found__lf">
          <img  src="../../pui-web/assets/gougou1.jpg" alt="">
          <!-- <img  src="../../pui-web/assets/gougou.jpg" alt=""> -->
          
        </span>
        
        <div class="pui-not-found__rt">
          <!-- <img src="../../pui-web/assets/404logo.jpg" alt=""> -->

          <span class="pui-not-found__int"> 4 0 4</span>
          <span class="pui-not-found__english"> Not Found This Page</span>
          <p class="pui-not-found__describe">真遗憾，您的页面被狗狗叼走啦!</p>
           
          <!-- <div class="pui-not-found__OMG">
            <img src="../../pui-web/assets/OMG.jpg" width="35%" alt="">
            <span class="pui-not-found__span"> 您的页面被狗狗叼走啦! </span>
          </div> -->
         

          <p class="pui-not-found__describe">( <span>友情提示 :</span> 您可能输入了错误的网址，或者该网页已删除或移动！)</p>
          <pui-btn class="pui-not-found__btn" type="primary" :widthStr="widthStr" :heightStr="heightStr" @click="goBack">返回上一页</pui-btn>
        </div>
      </div>
    </pui-layout>
  </div>
</template>

<script>
export default {
  name: "NotFound",
  data() {
    return {
      notFoundHeight: "",
      widthStr: "90px",
      heightStr: "35px"
    }
  },
  mounted() {
    this.high();
  },
  methods: {
    high() {
      this.notFoundHeight = window.innerHeight + "px";
    },
    goBack() {
      // this.$router.push("business/dashboard");
      this.$router.go(-1);
    }
  }
};
</script>


<style scoped>
.pui-not-found__int,.pui-not-found__english {
  animation: pact 5s 1;
}
@keyframes pact {
  from { opacity: 0 }
  to { opacity: .6 }
}
</style>

<style lang="scss" scoped>
@import "~theme/mixins/mixins";
@import "~theme/mixins/utils";
@import "~theme/common/var";


.pui-not-found {
  background: #f6f6f6;
  // background: #fff;
  .pui-layout {
    margin-bottom: 0;
    background: #f6f6f6;
    min-width: 1160px;
  }
  & .pui-not-found__main {
    @include utils-clearfix;
    &>.pui-not-found__lf {
      float:left;
      width: 45%;
      padding-left:5%;
      // padding: 5% 0 0 5%;
      box-sizing: border-box;
    }
    &>.pui-not-found__rt {
      margin-top: 30px;
      // margin: 30px 0 0 50%;
  
      &>.pui-not-found__int {
        font-weight: bold;
        display: inline-block;
        font-size: 72px;
        margin: 2% 10%;
        opacity: .6 ;
      }
      &>.pui-not-found__english {
        font-size:48px;
        font-weight:bold;
        display:inline-block;
        opacity: .6 ;
      }
      &>.pui-not-found__OMG {
        position: relative;
        &>.pui-not-found__span {
          position: absolute;
          top: 60%;
          left:8%;
        }
      }
      &>.pui-not-found__describe {
        margin-top:3%;
        // color: $--color-primary;
        &>span {
          color: $--color-primary;
        }
      }
      &>.pui-not-found__btn {
        margin:1% 12%;
      }
    }
  }
}

</style>

