<template>
  <div class="page-layout">
    <div class="app-nav">
      <div class="pfa-app-nav">
        <div class="pfa-nav-befor">
          <ul>
            <li><i class="pfa-logo-img" :style="logoStyle"></i></li>
            <li>
              <div class="pfa-app-menu" style="position: relative;">
                <ul class="pfa-app-menu-content">
                  <li v-for="(menuGroup, index) in menuList" :key="'menu_' + index">
                    <a href="javascript:void(0);">
                                            <span>
                                                <i :class="'iconfont icon-' + menuGroup.iconClass" v-if="menuGroup.iconClass" :style="'color:' + menuGroup.iconColor"></i>
                                                {{menuGroup.menuName}}
                                            </span>
                                        </a>
                    <ul class="pfa-app-menu-group-content">
                      <li v-for="(menuData, $index) in menuGroup.child" :key="'menu_' +index+ '_' + $index" @click="handleClick('menu', menuData,$event)">
                        <router-link :to="'/home/list/'+ menuData.viewId">
                          <i :class="'iconfont icon-' + menuData.iconClass" v-if="menuData.iconClass" :style="'color:' + menuData.iconColor"></i>
                          <span>{{menuData.menuName}}</span>
                        </router-link>
                      </li>
                    </ul>
                  </li>
                </ul>
                <i class="iconfont icon-menu"></i>
              </div>
            </li>
            <li @click="handleClick('home')">
              <router-link to="/home/list/148"><i class="iconfont icon-index-copy"></i></router-link>
            </li>
            <li v-for="(shortcutMenuGroup, index) in personalityMenu" :key="'shortcutMenu_' + index">
              <template v-if="shortcutMenuGroup.child && shortcutMenuGroup.child.length > 0">
                <a href="javascript:void(0);">{{shortcutMenuGroup.menuName}}</a>
                <i class="iconfont icon-down"></i>
                <ul class="pfa-nav-menu">
                  <li v-for="(shortcutMenu, $index) in shortcutMenuGroup.child" :key="'shortcutMenu_' +index+ '_' + $index">
                    <router-link @click="handleClick('shortcutMenu', shortcutMenu)" :to="'/home/list/'+shortcutMenu.viewId">
                      <i :class="'iconfont icon-' + shortcutMenu.iconClass" v-if="shortcutMenu.iconClass" :style="'color:' + shortcutMenu.iconColor"></i> {{shortcutMenu.menuName}}
                    </router-link>
                  </li>
                </ul>
              </template>
              <template v-else>
                <a @click="jumpLine(shortcutMenuGroup)" href="javascript:void(0);">
                                    <i :class="'iconfont icon-' + shortcutMenuGroup.iconClass" v-if="shortcutMenu.iconClass" :style="'color:' + shortcutMenuGroup.iconColor"></i>
                                    {{shortcutMenuGroup.menuName}}
                                </a>
              </template>
            </li>
          </ul>
        </div>
        <div class="pfa-nav-after">
          <ul>
            <li v-for="(userData, index) in rightNavs" :key="'rightNav_' + index">
              <router-link @click="handleClick('right', userData)" :to="userData.path">
                <img class="pfa-user-img" v-if="!!userData.imgSrc" :src="userData.imgSrc" />
                <i :class="userData.iconClass" v-else-if="userData.iconClass"></i>
                <span>{{userData.name}}</span>
              </router-link>
              <ul class="pfa-nav-menu" v-if="userData.child && userData.child.length > 0">
                <li v-for="(listData, $index) in userData.child" @click="handleClick('right', listData)" :key="'rightNav_' +index + '_' + $index">
                  <router-link :to="listData.path">
                    <i v-if="listData.iconClass" :class="listData.iconClass"></i>
                    <span>{{listData.name}}</span>
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="page-main">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import { DEFAULT_NAVS, listMenuService, listShortMenuService } from './AppNavigator';
import array from '../../../../../paas-web-utils/common/array';
const { arrayToTree } = array;

export default {
  name: "PuiAppNavigator",
  props: {
    logoImg: {
      type: String,
      default: "../../../../../static/images/comm/menu-logo.png"
    },
    config: {
      type: [Object, Boolean],
      default: function () {
        return {
          menuList: [],
          personalityMenu: []
        };
      }
    },
    afterNavs: {
      type: Array,
      default: function () {
        return DEFAULT_NAVS;
      }
    },
    userId: String
  },
  data: function () {
    return {
      menuList: [],
      personalityMenu: [],
    };
  },
  methods: {
    handleClick: function (type, data, e) {

    }
  },
  computed: {
    logoStyle() {
      return "background-image:url(" + this.logoImg + ");";
    },
    rightNavs() {
      return this.afterNavs.reverse();
    }
  },
  mounted: function () {
    this.reload();
    document.querySelector('.pfa-app-menu').addEventListener('mouseover', function () {
      document.querySelector(".pfa-app-menu-content").classList.remove('hide')
    }, false)
  },
  methods: {
    handleClick: function (type, data, e) {
      if (data && data.noClick) return;
      let menuBox = document.querySelector(".pfa-app-menu-content");
      menuBox.classList.add('hide');
    },
    reload() {
      var vm = this;
      listMenuService().then(data => vm.menuList = data);
      listShortMenuService().then(data => vm.personalityMenu = data);
    }
  }
};

</script>
<style lang="scss">
$menuColor: #5b5b5b;
@mixin transition($transition) {
  -webkit-transition: $transition;
  -moz-transition: $transition;
  -ms-transition: $transition;
  -o-transition: $transition;
  transition: $transition;
  backface-visibility: hidden;
  perspective: 1000;
}

@mixin transform($transform) {
  -webkit-transform: $transform;
  -moz-transform: $transform;
  -ms-transform: $transform;
  -o-transform: $transform;
  transform: $transform;
}

body {
  background-color: #edf0f5;
}

.hide {
  display: none;
}

.page-layout {
  height: 100%;
  padding-top: 50px;
  position: relative;
  background-color: #EDF0F5;
  .app-nav {
    top: 0;
    width: 100%;
    height: 75px;
    z-index: 9;
    position: absolute;
    .pfa-app-nav {
      width: 100%;
      height: 50px;
      color: white;
      display: flex;
      align-items: center;
      background-color: #2f3748;
      a {
        text-decoration: none;
      }
      .pfa-nav-befor,
      .pfa-nav-after {
        &,
        &>ul,
        &>ul>li {
          margin: 0;
          height: 100%;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          vertical-align: middle;
        }
      }
      .pfa-nav-befor,
      .pfa-nav-after {
        &>ul>li {
          cursor: pointer;
          font-size: 14px;
          position: relative;
          min-width: 50px;
          text-align: center;
          justify-content: center;
          &:after,
          &:before {
            right: 1px;
            content: "";
            height: 20px;
            position: absolute;
            border-right: solid 1px #21252d;
          }
          &:before {
            right: 0;
            border-right: solid 1px #394457;
          }
          &:hover {
            background-color: #394457;
            &:after,
            &:before {
              border-color: transparent;
            }
            &,
            >a {
              color: white;
            }
          }
          &:last-child {
            &:after,
            &:before {
              border-color: transparent;
            }
          }
          .pfa-nav-menu {
            top: 100%;
            left: 0;
            width: 100%;
            display: none;
            position: absolute;
            background: white;
            box-shadow: 1px 1px 5px 1px #ececec;
            margin: 0;
            li {
              color: #444444;
              padding: 5px 0px;
              line-height: 20px;
              a {
                color: #444444;
              }
              &:hover {
                background-color: #f4f7c7;
              }
              a {
                color: #444444;
              }
            }
          }
          &:hover {
            .pfa-nav-menu {
              display: block;
              li {
                a {
                  color: #444444;
                }
              }
            }
          }
        }
      }
      .pfa-nav-befor {
        flex: 1;
        >ul>li {
          color: #d6ccb9;
          padding: 0 20px;
          z-index: 1000;
          line-height: 50px;
          &:nth-child(2),
          &:nth-child(3) {
            padding: 0; //background-color: #484848;
            background-color: #394457;
            &,
            >* {
              >.iconfont {
                /*color: #c79631;*/
                color: #ffffff;
                font-size: 20px;
                @include transition("font-size 0.1s,color 0.6s");
              }
            }
            &:hover {
              &,
              >* {
                &>.iconfont {
                  color: white;
                  font-size: 24px;
                }
              } //background-color: #5f5d5d;
              background-color: #45536b;
            }
          }
          &:nth-child(1) {
            padding: 0 20px; //background-color: #540b0b;
            background-color: #394457;
            &:after,
            &:before {
              top: 0;
              height: 100%;
            }
            &:after {
              border-color: #475369;
            }
            &:before {
              border-color: #383942;
            }
            &:hover {
              //background-color: #540b0b;
              background-color: #45536b;
            }
            a {
              color: #c1a632;
            }
          }
          &:first-child {
            padding: 0 10px;
            .pfa-logo-img {
              background-position: center center;
              width: 100px;
              height: 49px;
              background-size: cover;
            }
          }
          &:nth-child(2) {
            &:after,
            &:before {
              top: 0;
              height: 100%;
              border-right: solid 1px #383942;
            }
            &:before {
              border-right: solid 1px #475369;
            }
            .pfa-app-menu {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              &:hover {
                .pfa-app-menu-content {
                  @include transform(scale(1, 1));
                  >li {
                    a {
                      color: $menuColor;
                      justify-content: left !important;
                    }
                  }
                }
              }
              a {
                color: $menuColor;
              }
              >.pfa-app-menu-content {
                left: 0;
                top: 100%;
                z-index: 99;
                padding: 20px;
                transform: translateZ(0);
                cursor: initial;
                position: absolute;
                @include transform(scale(0, 0));
                border: solid 1px #e8e7e7;
                background-color: white;
                transform-origin: 0 0;
                -moz-column-gap: 20px;
                /* Firefox */
                -webkit-column-gap: 20px;
                /* Safari and Chrome */
                column-gap: 20px;
                margin: 0;
                @include transition(transform 0.3s ease-in-out);
                column-count: 4;
                -moz-column-count: 4;
                -webkit-column-count: 4;
                &.loading {
                  height: 75px;
                  width: 100px;
                  font-size: 20px;
                  color: #d6d5d5;
                  p {
                    font-size: 12px;
                  }
                }
                >li {
                  width: 190px;
                  color: #535353;
                  text-align: left;
                  >a {
                    height: 30px;
                    display: flex;
                    align-items: center;
                    position: relative;
                    font-size: 14px; //margin-top: 10px;
                    padding-left: 10px;
                    background-color: #f9fdf8;
                    border: solid 1px #f0f9f3;
                    @include transition(background-color 0.3s);
                    &:before {
                      left: -5px;
                      content: "";
                      height: 10px;
                      display: inline-block;
                      position: relative;
                      border-left: dotted 2px #bbd6b6;
                    }
                    span {
                      color: #4a5f90;
                    }
                    &:hover {
                      background-color: #fffac3;
                      &:before {
                        border-left: dotted 2px #e2b28a;
                      }
                      span {
                        color: #dc9241;
                      }
                    }
                  }
                  >.pfa-app-menu-group-content {
                    margin: 0;
                    li {
                      /*height: 32px;*/
                      line-height: 32px;
                      color: #6e6e6e;
                      padding-left: 14px;
                      &:hover {
                        background-color: #eae8cb;
                      }
                    }
                    a {
                      width: 100%;
                      height: 100%;
                      display: flex;
                      align-items: center;
                      >span {
                        padding-left: 4px;
                        color: #5b5b5b;
                      }
                    }
                  }
                }
              }
            }
          }
          &:nth-child(3) {
            &:after,
            &:before {
              top: 0;
              height: 100%;
              border-color: #1e304e;
            }
            &:before {
              top: 0;
              height: 100%;
              border-color: #464c56;
            }
          }
          a {
            color: #f5f4f4;
            display: flex;
            justify-content: center;
          }
        }
      }
      .pfa-nav-after {
        >ul>li {
          padding: 0 15px;
          z-index: 1000;
          line-height: 50px;
          &,
          >a {
            color: #a5a5a5;
            >.iconfont {
              font-size: 20px;
              margin-right: 3px;
            }
            .pfa-user-img {
              background-size: 100% 100%;
              width: 35px;
              height: 35px;
              margin-right: 10px;
              vertical-align: middle;
            }
          }
        }
      }
    }
  }

  .page-main {
    overflow-y: scroll;
    width: 100%;
    height: 100%;
    /*padding: 50px 0;*/
    &::-webkit-scrollbar {
      height: 10px;
      width: 10px;
    } //表格右侧内容X轴滚动条默认底色颜色
    &::-webkit-scrollbar-track {
      background-color: #e4e8ea;
      border-radius: 10px;
    } //表格右侧内容X轴滚动条鼠标初始化颜色
    &::-webkit-scrollbar-thumb {
      background-color: #acc1c0;
      border-radius: 10px;
    } //表格右侧内容X轴滚动条鼠标划过颜色
    &::-webkit-scrollbar-thumb:hover {
      background-color: #00b5a5;
      border-radius: 10px;
    } //表格右侧内容X轴滚动条鼠标点击颜色
    &::-webkit-scrollbar-thumb:active {
      background-color: #00AC9D;
      border-radius: 10px;
    } //表格右侧内容X轴滚动条高度
    &::-webkit-scrollbar {
      height: 10px;
    }
  }
}

.base-scroll {
  &::-webkit-scrollbar {
    height: 8px;
    width: 8px;
  } //表格右侧内容X轴滚动条默认底色颜色
  &::-webkit-scrollbar-track {
    background-color: #ececec;
    border-radius: 10px;
  } //表格右侧内容X轴滚动条鼠标初始化颜色
  &::-webkit-scrollbar-thumb {
    background-color: #A1A9B4;
    border-radius: 10px;
  } //表格右侧内容X轴滚动条鼠标划过颜色
  &::-webkit-scrollbar-thumb:hover {
    background-color: #8e9092;
    border-radius: 10px;
  } //表格右侧内容X轴滚动条鼠标点击颜色
  &::-webkit-scrollbar-thumb:active {
    background-color: #8e9092;
    border-radius: 10px;
  } //表格右侧内容X轴滚动条高度
  &::-webkit-scrollbar {
    height: 10px;
  }
}

</style>
