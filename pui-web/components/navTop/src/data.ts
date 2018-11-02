var data = {
  isLogin: false,
  userInfo: {
    name: '纪晓岚',
    personalMenus: [{
      id: 101,
      name: '退出登录',
      url: '',
      iconClass: ''
    }]
  },
  quickMenuList: [{
    id: 1,
    url: '',
    menuName: '跟进',
    children: [{
      id: 11,
      menuName: '客户跟进',
      url: '',
      iconClass: 'pui-icon-genzongmubiaoshezhi'
    }, {
      id: 12,
      menuName: '重点跟进',
      url: '',
      iconClass: 'pui-icon-image'
    }, {
      id: 13,
      menuName: '你尺寸尺寸错',
      iconClass: 'pui-icon-money'
    }]
  }, {
    id: 2,
    url: '',
    menuName: '竞品信息'
  }, {
    id: 3,
    url: '',
    menuName: '客户'
  }]
};
export default function () { return data };
