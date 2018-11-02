var data = {
  input1: '',
  input2: '',
  heightStr: '35px',
  widthStr: '60px',
  buttons: [
    { id: 1 , name: "新增" },
    { id: 2 , name: "编辑" },
    { id: 3 , name: "停用" },
    { id: 4 , name: "启用" },
    { id: 5 , name: "维护成员" },
    { id: 6 , name: "批量删除" },
  ],
  tableData: [
    // {
    //   serialNumber: null,
    //   workGroupName: '',
    //   workGroupCoding:'',
    //   classes: '',
    //   describe: '',
    //   createTime: '',
    //   status: ''
    // }
  ],
  multipleSelection: []
}

export default function () { return data };