var data = {
  input1: '',
  processClasses: [
    { processValue: '选项1' , label: '已禁用' },
    { processValue: '选项2' , label: '已启用' },
    { processValue: '选项3' , label: '未发布' },
    { processValue: '选项4' , label: '已发布' }
  ],
  processValue: '',
  heightStr: '35px',
  widthStr: '60px',
  buttons: [
    { id: 1 , name: '修改' },
    { id: 2 , name: '启用' },
    { id: 3 , name: '禁用' },
    { id: 4 , name: '发布' }
  ],
  managerTableData: [
    {
      operations: [{ id : 1, name : '布局' },{ id : 2, name : '参数' },{ id : 3, name : '导出' }],
      modelId: 80105,
      processName: '录用审批test',
      creater: '系统管理员',
      describe: '录用审批123',
      createTime: '2018-03-28 14:53:37',
      status: '未发布'
    },
    {
      operations: [{ id : 1, name : '布局' },{ id : 2, name : '参数' },{ id : 3, name : '导出' }],
      modelId: 80106,
      processName: '录用审批test',
      creater: '系统管理员',
      describe: '录用审批123',
      createTime: '2018-03-28 14:53:37',
      status: '未发布'
    },
    {
      operations: [{ id : 1, name : '布局' },{ id : 2, name : '参数' },{ id : 3, name : '导出' }],
      modelId: 80107,
      processName: '录用审批test',
      creater: '系统管理员',
      describe: '录用审批123',
      createTime: '2018-03-28 14:53:37',
      status: '未发布'
    },
    {
      operations: [{ id : 1, name : '布局' },{ id : 2, name : '参数' },{ id : 3, name : '导出' }],
      modelId: 80108,
      processName: '录用审批test',
      creater: '系统管理员',
      describe: '录用审批123',
      createTime: '2018-03-28 14:53:37',
      status: '未发布'
    }
    
  ],
  multipleSelection: [],
}

export default function () { return data };