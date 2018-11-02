var data={
  heightStr: '34px',
  paddingStr: '0 19px',
  //isScrolling: false,
  headerTitle:"消息列表",
  headerMenu:"消息",
  navLeftTitle:"消息中心",
  navLeftList:[{
    id: 1 , 
    classes: '消息',
    navLeftItem: [
      { index: '1-1', item: '消息列表' },
      { index: '1-2', item: '系统公告' }
    ]
  }],
  operations: [
      {
          id: 1,
          name: "删除"
      },
      {
          id: 2,
          name: '标记已读'
      }
  ],
  messageCount:67,
  messageList:[
      {
          id:1,
          type:"系统消息",
          title:"第1条信息",
          createTime:"2017-12-20 18:23:21"
      },
      {
          id:2,
          type:"活动消息",
          title:"第2条信息活动活动",
          createTime:"2017-12-20 18:23:41"
      },
      {
          id:3,
          type:"订单消息",
          title:"第3条信息订单来啦订单来啦订单来啦",
          createTime:"2017-11-20 18:23:21",
          percentAge:20
      },
      {
          id:4,
          type:"客户消息",
          title:"第4条信息客户来啦客户来啦客户来啦客户来啦客户来啦",
          createTime:"2018-01-20 18:23:21"
      },
      {
          id:5,
          type:"客户消息",
          title:"第5条信息5条信息5条信息5条信息5条信息5条信息5条信息",
          createTime:"2018-02-20 18:23:21",
          percentAge:60
      },
      {
          id:6,
          type:"订单消息",
          title:"第6条信息第6条信息第6条信息第6条信息第6条信息第6条信息第6条信息第6条信息第6条信息第6条信息第6条信息第6条信息",
          createTime:"2018-02-20 18:23:21"
      },
  ]
};


export default function () { return data };