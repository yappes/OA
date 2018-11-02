<template>
  <aui-col class="pui-dashboard-common" :span="dashboardData.span">
    <div 
    class="pui-dashboard-common-grid" 
    :class="{ 'is-edit': !isHomePage }"
    :draggable="!isHomePage"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @dragenter="handleDragEnter"
    @dragover="handleDragOver">
      <div class="pui-dashboard-common-grid__title">
        <span class="title">{{dashboardData.title}}</span>
        <div class="change-width-btn" v-if="!isHomePage">
          <aui-tooltip class="item" effect="dark" content="调整宽度" placement="top">
             <i 
              class="aui-icon aui-icon-arrow-left"
              :class="{ 'is-disabled': dashboardData.span <= 6 }" 
              @click="operation.handleChangeWidth(dashboardData, 'reduce')">
              </i>
          </aui-tooltip>
          <aui-tooltip class="item" effect="dark" content="调整宽度" placement="top">
            <i 
              class="aui-icon aui-icon-arrow-right"
              :class="{ 'is-disabled': dashboardData.span >= 24 }" 
              @click="operation.handleChangeWidth(dashboardData, 'add')">
            </i>
          </aui-tooltip>
        </div>
        <div class="right-btn">
          <i class="aui-icon aui-icon-refresh" v-if="isHomePage" @click="operation.handleRefresh(dashboardData)"></i>
          <i class="aui-icon aui-icon-delete" v-if="!isHomePage" @click="operation.handleDelete(dashboardData)"></i>
        </div>
      </div>
      <div class="pui-dashboard-common-grid__main" :ref="'grid_' + dashboardData.id" v-loading="dashboardData.loading">
        <grid-main :dashboardData="dashboardData"></grid-main>
      </div>
    </div>  
    <height-block v-if="!isHomePage" :dashboardData="dashboardData" @save-height="handleSaveHeight" @change-height="handleChangeHeight"></height-block>
  </aui-col>
</template>

<script>
export default {
  name:'PuiDashboardCommon',

  props: {
    dashboardData: Object
  },

  components: {
    'grid-main': {
      props: {
        dashboardData: Object
      },
      render(createElement) {
        let databoardType = 'content';
        if(this.dashboardData.type) {
          let type = this.dashboardData.type.toLowerCase();
          databoardType = type.replace(/\_/, '-');
        }

        const component = createElement(
          'pui-dashboard-' + databoardType, 
          {
            props: { dashboardData: this.dashboardData },
            style: { 'box-sizing': 'border-box', 'height': '100%' }
          }
        );

        return (
          <div class="grid-wrapper">{component}</div>
        )
      }
    },
    'height-block': {
      props: {
        dashboardData: Object
      },
      data() {
        return {
          startY: null, // 开始时鼠标纵坐标
          endY: null, // 结束时鼠标纵坐标
          isPress: false, // 鼠标是否按下
        }
      },
      methods: {
        // 鼠标事件
        mousemoveEvent(e) {
          if(!this.isPress) return;
          let distance = e.clientY - this.startY;
          // 改变高度
          this.$emit('change-height', distance);
        },
        mouseupEvent(e) {
          this.isPress = false;
          this.startY = null;
          this.endY = null;
        },
      },
      render(createElement) {
        const heightConfig= {
          on: { 
            mousedown: (event) => {
              event.preventDefault();
              event.stopPropagation();
              this.isPress = true;
              this.startY = event.clientY;
              // 保存原始高度
              this.$emit('save-height');
              // document 绑定鼠标事件
              document.addEventListener('mousemove', (e) => this.mousemoveEvent(e));
              document.addEventListener('mouseup', (e) =>  this.mouseupEvent(e));
            },
            mouseleave: () => {
              // 解绑鼠标事件
              document.removeEventListener('mousemove', (e) => this.mousemoveEvent(e));
              document.removeEventListener('mouseup', (e) => this.mouseupEvent(e));
            }
          }
        }

        return (
          <div class="pui-dashboard-common__height" {...heightConfig}></div>
        );
      }
    },
  },

  data() {
    return {
      operation: null, // 操作
      originalHeight: null, // 原始高度
    }
  },

  computed: {
    isHomePage() {
      return this.dashboardData.viewType === 'homepage';
    }
  },

  mounted() {
    this.$set(this, 'operation', this.dashboardData.operation);
    // 根据保存的高度渲染
    let saveHeight = this.dashboardData.height;
    saveHeight && (this.$refs['grid_' + this.dashboardData.id].style.height = saveHeight + 'px');
  },

  methods: {
    handleDragStart($event) {
      if(this.isHomePage) return false;
      this.operation.handleDragStart(this.dashboardData, $event);
    },

    handleDragEnd($event) {
      if(this.isHomePage) return false;
      this.operation.handleDragEnd($event);
    },

    handleDragEnter($event) {
      if(this.isHomePage) return false;
      this.operation.handleDragEnter(this.dashboardData, $event);
    },

    handleDragOver($event) {
      if(this.isHomePage) return false;
      this.operation.handleDragOver($event);
    },

    // 保存高度
    handleSaveHeight() {
      this.originalHeight = this.$refs['grid_' + this.dashboardData.id].offsetHeight;
    },

    // 改变高度
    handleChangeHeight(distance) {
      let height = this.originalHeight + distance;
      this.$refs['grid_' + this.dashboardData.id].style.height = height + 'px';
      this.$set(this.dashboardData, 'height', height);
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "./dashboardCommon.scss";
</style>


