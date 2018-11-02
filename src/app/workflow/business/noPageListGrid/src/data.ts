var data = {
  allChecked: false,
  fuzzyKey: '',
  operations: [{
    id: 1,
    name: '新增'
  }, {
    id: 2,
    name: '编辑'
  }, {
    id: 3,
    name: '转意向'
  }],
  tableData3: [{
    operations: [{ id: 1, name: '预览' }, { id: 2, name: '发送检查' }],
    date: '2016-05-03',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  }, {
    operations: [{ id: 1, name: '预览' }, { id: 2, name: '发送检查' }],
    date: '2016-05-02',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  }, {
    operations: [{ id: 1, name: '预览' }, { id: 2, name: '发送检查' }],
    date: '2016-05-04',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  }, {
    operations: [{ id: 1, name: '预览' }, { id: 2, name: '发送检查' }],
    date: '2016-05-01',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  }, {
    operations: [{ id: 1, name: '预览' }, { id: 2, name: '发送检查' }],
    date: '2016-05-08',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  }, {
    operations: [{ id: 1, name: '预览' }, { id: 2, name: '发送检查' }],
    date: '2016-05-06',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  }, {
    operations: [{ id: 1, name: '预览' }, { id: 2, name: '发送检查' }],
    date: '2016-05-07',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  }],
  multipleSelection: [],
  outerVisible:false,
  innerVisible:false,
  // 设置按钮内容
  setDialogVisible:false,
  optioned:[
    { id: 1, name: '操作' }, 
    { id: 2, name: '序号' }, 
    { id: 3, name: '公司名称' }, 
    { id: 4, name: '公司类型' },
    { id: 5, name: '状态' },
    { id: 6, name: '姓名' },
    { id: 7, name: '手机' },
    { id: 8, name: '电话' },
    { id: 9, name: '日期' }
  ],
  optional:[
    { id: 1, name: '姓名2' }, 
    { id: 2, name: '手机2' }, 
    { id: 3, name: '电话2' }, 
    { id: 4, name: '字段一' },
    { id: 5, name: '字段二' },
    { id: 6, name: '姓名2' },
    { id: 7, name: '手机2' },
    { id: 8, name: '电话2' },
    { id: 9, name: '字段一' },
    { id: 10, name: '字段二' }
  ],
  //设置与高级查询按钮都需要
  heightStr:"34px",
  widthStr:"120px",
  // 高级查询按钮内容
  queryDialogVisible:false,
  fuzzyKey1:'',
  tableData: [{
    date: '2016-05-02',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  }, {
    date: '2016-05-04',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1517 弄'
  }, {
    date: '2016-05-01',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1519 弄'
  }, {
    date: '2016-05-03',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1516 弄'
  }],
  //高级搜索按钮显示的内容
  searchDialogVisible:false,
  input1:'',
  input2:'',
  background:"#FFFFFF",
  width:"160px",
  heightStr2:"25px",
  widthStr2:"50px",
  heightStr1:"34px",
  widthStr1:"120px",
  options1: [
    {
      value1: '选项1',
      label: '名称'
    },
    {
      value1: '选项2',
      label: '数量'
    }
  ],
  options2: [
    {
      value2: '选项1',
      label: '等于'
    },
    {
      value2: '选项2',
      label: '大于'
    }, 
    {
      value2: '选项3',
      label: '小于'
    }, 
    {
      value2: '选项4',
      label: '包含'
    }, 
    {
      value2: '选项5',
      label: '不包含'
    }
  ],
  value1: '',
  value2: '',
  //快捷菜单设置显示的内容
  menuDialogVisible: false,
  widthStr3: "120px",
  heightStr3: "34px",
  menu:[
    {
      classes: '首页',
      list: [ ],
      checkAll: false,
      checked: [],
      isIndeterminate: true
    },
    {
      classes: '客户',
      list:[ '客户列表', '新建客户', '修改客户' ],
      checkAll: false,
      checked: [],
      isIndeterminate: true
    },
    {
      classes: '跟进',
      list: [ '客户列表', '新建客户', '修改客户', '查看客户详情' ],
      checkAll: false,
      checked: [],
      isIndeterminate: true
    },
    {
      classes: '商机',
      list: [ '客户列表', '新建客户', '修改客户', '查看客户详情', '修改客户', '删除客户', '转移客户', '合并客户', '锁定客户', '新建客户', '修改客户', '查看客户详情', '移动客户' ],
      checkAll: false,
      checked: [],
      isIndeterminate: true
    },
    {
      classes: '服务资料',
      list: [ '新建联系人', '修改联系人', '删除联系人' ],
      checkAll: false,
      checked: [],
      isIndeterminate: true
    },
    {
      classes: '销售',
      list: [ '查看联系人', '转移联系人', '删除联系人' ],
      checkAll: false,
      checked: [],
      isIndeterminate: true
    },
    {
      classes: '竞品信息',
      list: [ '联系人列表', '新建客户', '修改客户', '查看客户详情', '查看客户详情', '客户列表', '新建客户', '修改客户', '查看客户详情', '查看客户详情', '客户列表', '新建客户', '修改客户' ],
      checkAll: false,
      checked: [],
      isIndeterminate: true
    },
    {
      classes: '客户',
      list: [ '客户列表', '新建客户', '修改客户' ],
      checkAll: false,
      checked: [],
      isIndeterminate: true
    },
    {
      classes: '客户',
      list: [ '客户列表', '新建客户', '修改客户' ],
      checkAll: false,
      checked: [],
      isIndeterminate: true
    },
    {
      classes: '竞品信息',
      list: [ '联系人列表', '新建客户', '修改客户', '查看客户详情', '查看客户详情', '客户列表', '新建客户', '修改客户', '查看客户详情', '查看客户详情', '客户列表', '新建客户', '修改客户' ],
      checkAll: false,
      checked: [],
      isIndeterminate: true
    }
  ],
  menu2:{
    classes: '客户',
    list: [ '客户列表', '新建客户', '修改客户' ],
    checkAll: false,
    checked: [],
    isIndeterminate: true
  },
  //人员选择按钮显示的内容
  selectionDialogVisible: false,
  widthStr4: "120px",
  heightStr4: "34px",
  fuzzyKey2: '',
  fuzzyKey3: '',
  organization: [{
    label: '赞同科技(2660)',
    children: [
      {
        label: '人力资源部(25)'
      },{
        label: '财务办(36)'
      },{
        label: '行政部(567)'
      },{
        label: '市场部(1546)',
        children: [{
          label: '华北市场(255)',
          children: [{
            label: '北京市场(25)'
          }]
        }]
      },{
        label: '运营管理部(25)',
        children: [{
          label: '管理办公室(23)',
          children: [{
            label: '预算管理(33)'
          }]
        }]
      },{
        label: '大客户部(270)',
      },{
        label: '技术委员会部(567)',
        children:[
          {
            label: '支付预算事业部(25)'
          },{
            label: '交付中心(36)'
          }
        ]
      }
    ]
  }],
  defaultProps:{
    children: 'children',
    label: 'label'
  },
  personData:[
    {
      name: '花袭人',
      tel: '18709092354',
      createTime: "2017-02-25"
    },{
      name: '轻轻',
      tel:'1356547892',
      createTime:'2018-03-23'
    },{
      name: '高文',
      tel:'1356547894',
      createTime:'2018-02-23'
    },{
      name: '雅雅',
      tel:'1356547891',
      createTime:'2018-01-23'
    },{
      name: '乐乐',
      tel:'1356547392',
      createTime:'2018-03-13'
    },{
      name: '天天',
      tel:'1356547592',
      createTime:'2017-03-23'
    },{
      name: '雯雯',
      tel:'1356547692',
      createTime:'2018-04-01'
    },{
      name: '静静',
      tel:'1356547872',
      createTime:'2018-03-22'
    }
  ],
  multipleSelection1:[]
};
export default data;

