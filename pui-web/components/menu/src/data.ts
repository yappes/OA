var data = {
  menuListChildLength:5,
  menuList: [{
    id: 1,
    url: '',
    menuName: '客户',
    children: [{
      id: 11,
      menuName: '公海客户',
      url: '',
      iconClass: 'pui-icon-genzongmubiaoshezhi',
      iconColor: '#ff2019'
    }, {
      id: 12,
      menuName: '区域客户',
      url: '',
      iconClass: 'pui-icon-image',
      iconColor: '#DB7BA9'

    }, {
      id: 13,
      menuName: '联系人',
      iconClass: 'pui-icon-money',
      iconColor: '#50AA00'
    }]
  }, {
    id: 2,
    url: '',
    name: '竞品信息',
    children: [{
      id: 21,
      menuName: '那你呢',
      iconClass: 'pui-icon-list',
      iconColor: '#50AA00'
    }]
  }, {
    id: 3,
    url: '',
    menuName: '客户'
  }]
};
export default function () { return data };
