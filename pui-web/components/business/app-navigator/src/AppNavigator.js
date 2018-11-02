import Vue from 'vue';
import array from '../../../../../paas-web-utils/common/array';
const {arrayToTree} = array;

const MENU_ID = "id";
const MENU_PARENT_ID = "parentId";

const DEFAULT_NAVS = [
    {
      id: "GoManage",
      imgSrc: false,
      iconClass: "iconfont icon-shezhi",
      name: "设置", 
        path:"/settings"
    },
    {
      imgSrc: "../../../../../static/images/comm/head.png",
      iconClass: false,
      name: "匿名用户",
        path:'',
      child: [
        {
          id: "GoUserInfo",
          imgSrc: false,
          iconClass: false,
          name: "个人信息",
            path:''
        },
        {
          id: "GoEditPassword",
          imgSrc: false,
          iconClass: false,
          name: "修改密码",
            path:''
        },
        {
          id: "GoPersonalityMenu",
          imgSrc: false,
          iconClass: false,
          name: "快捷菜单",
            path:''
        }
      ]
    }
];

//查询全局菜单集合
const listMenuService = () => {
    return Vue.axios.post('auth/A05007',{ sourceType: 0 }).then(resp => resp.data).then(data => {
        if (!data || data.length <= 0) return;
        return arrayToTree(data, MENU_ID, MENU_PARENT_ID);
    });
}

//查询快捷菜单集合
const listShortMenuService = () => {
    return Vue.axios.post('auth/A05009',{ userId: this.userId }).then(resp => resp.data).then(data => {
        if (!data || data.length <= 0) return;
        return arrayToTree(data, MENU_ID, MENU_PARENT_ID);
    });
}

export {
    DEFAULT_NAVS,
    listMenuService,
    listShortMenuService
}