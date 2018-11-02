var data = {
  taskType: [
    { taskValue: '选项1' , label: '指定审批人' },
    { taskValue: '选项2' , label: '指定任务候选人' },
    { taskValue: '选项3' , label: '指定候选工作组' }
  ],
  taskValue: '',
  input: '',
  dateValue: '',
  processClasses: [
    { processValue: '选项1' , label: 'AOs' },
    { processValue: '选项2' , label: '请假' },
    { processValue: '选项3' , label: '入职' },
    { processValue: '选项4' , label: '离职' },
    { processValue: '选项5' , label: '招聘' },
    { processValue: '选项6' , label: '转正' },
    { processValue: '选项7' , label: '调动' }
  ],
  processValue: '',
  department: [
    // { departmentValue: '' , label: '' }
  ],
  departmentValue: '',
  heightStr: '35px',
  widthStr: '60px',
  isShow: false,
  activeName: 'first',
  allTableData: [
    {
      operations: [{ id: 1, name: '详情' }, { id: 2, name: '修改' }],
      serialNumber: 1,
      processTitle: '软件测试工程师_20180327_2人_招聘需求发起人_华北_行政办公室_招聘需求流程',
      processName: '招聘需求发起',
      processClass: '招聘',
      approver: '周伟',
      taskTime: '2018-03-27 10:37:58',
      endTime: '--- ---',
      approveStatus: '审核中'
    },
    {
      operations: [{ id: 1, name: '详情' }, { id: 2, name: '修改' }],
      serialNumber: 2,
      processTitle: '测试22-0022-调动申请流程',
      processName: '调动',
      processClass: '调动',
      approver: '周伟',
      taskTime: '2018-03-27 10:37:58',
      endTime: '--- ---',
      approveStatus: '审核中'
    },
    {
      operations: [{ id: 1, name: '详情' }, { id: 2, name: '修改' }],
      serialNumber: 3,
      processTitle: '测试06-录用申请流程',
      processName: '应聘候选人录用审批',
      processClass: '招聘',
      approver: '周伟',
      taskTime: '2018-03-27 10:37:58',
      endTime: '--- ---',
      approveStatus: '审核中'
    },
    {
      operations: [{ id: 1, name: '详情' }, { id: 2, name: '修改' }],
      serialNumber: 4,
      processTitle: '测试06-录用申请流程',
      processName: '招聘需求发起',
      processClass: '招聘',
      approver: '周伟',
      taskTime: '2018-03-27 10:37:58',
      endTime: '--- ---',
      approveStatus: '审核中'
    },
    {
      operations: [{ id: 1, name: '详情' }, { id: 2, name: '修改' }],
      serialNumber: 5,
      processTitle: '测试06-录用申请流程',
      processName: '招聘需求发起',
      processClass: '招聘',
      approver: '周伟',
      taskTime: '2018-03-27 10:37:58',
      endTime: '--- ---',
      approveStatus: '审核中'
    },
    {
      operations: [{ id: 1, name: '详情' }, { id: 2, name: '修改' }],
      serialNumber: 6,
      processTitle: '测试06-录用申请流程',
      processName: '招聘需求发起',
      processClass: '招聘',
      approver: '周伟',
      taskTime: '2018-03-27 10:37:58',
      endTime: '--- ---',
      approveStatus: '审核中'
    }
  ],
  multipleSelection: [],
  ownTableData: [
    {
      operations: [{ id: 1, name: '详情' }, { id: 2, name: '修改' }],
      serialNumber: 1,
      processTitle: '软件测试工程师_20180327_2人_招聘需求发起人_华北_行政办公室_招聘需求流程',
      processName: '招聘需求发起',
      processClass: '招聘',
      approver: '周伟',
      taskTime: '2018-03-27 10:37:58',
      endTime: '--- ---',
      approveStatus: '审核中'
    },
    {
      operations: [{ id: 1, name: '详情' }, { id: 2, name: '修改' }],
      serialNumber: 2,
      processTitle: '测试22-0022-调动申请流程',
      processName: '调动',
      processClass: '调动',
      approver: '周伟',
      taskTime: '2018-03-27 10:37:58',
      endTime: '--- ---',
      approveStatus: '审核中'
    },
    {
      operations: [{ id: 1, name: '详情' }, { id: 2, name: '修改' }],
      serialNumber: 3,
      processTitle: '测试06-录用申请流程',
      processName: '应聘候选人录用审批',
      processClass: '招聘',
      approver: '周伟',
      taskTime: '2018-03-27 10:37:58',
      endTime: '--- ---',
      approveStatus: '审核中'
    },
    {
      operations: [{ id: 1, name: '详情' }, { id: 2, name: '修改' }],
      serialNumber: 4,
      processTitle: '测试06-录用申请流程',
      processName: '招聘需求发起',
      processClass: '招聘',
      approver: '周伟',
      taskTime: '2018-03-27 10:37:58',
      endTime: '--- ---',
      approveStatus: '审核中'
    },
    {
      operations: [{ id: 1, name: '详情' }, { id: 2, name: '修改' }],
      serialNumber: 5,
      processTitle: '测试06-录用申请流程',
      processName: '招聘需求发起',
      processClass: '招聘',
      approver: '周伟',
      taskTime: '2018-03-27 10:37:58',
      endTime: '--- ---',
      approveStatus: '审核中'
    },
    {
      operations: [{ id: 1, name: '详情' }, { id: 2, name: '修改' }],
      serialNumber: 6,
      processTitle: '测试06-录用申请流程',
      processName: '招聘需求发起',
      processClass: '招聘',
      approver: '周伟',
      taskTime: '2018-03-27 10:37:58',
      endTime: '--- ---',
      approveStatus: '审核中'
    }
  ],
  agentTableData: [
    {
      operations: [{ id: 1, name: '详情' }, { id: 2, name: '修改' }],
      serialNumber: 1,
      processTitle: '软件测试工程师_20180327_2人_招聘需求发起人_华北_行政办公室_招聘需求流程',
      processName: '招聘需求发起',
      processClass: '招聘',
      approver: '周伟',
      taskTime: '2018-03-27 10:37:58',
      endTime: '--- ---',
      approveStatus: '审核中'
    },
    {
      operations: [{ id: 1, name: '详情' }, { id: 2, name: '修改' }],
      serialNumber: 2,
      processTitle: '测试22-0022-调动申请流程',
      processName: '调动',
      processClass: '调动',
      approver: '周伟',
      taskTime: '2018-03-27 10:37:58',
      endTime: '--- ---',
      approveStatus: '审核中'
    },
    {
      operations: [{ id: 1, name: '详情' }, { id: 2, name: '修改' }],
      serialNumber: 3,
      processTitle: '测试06-录用申请流程',
      processName: '应聘候选人录用审批',
      processClass: '招聘',
      approver: '周伟',
      taskTime: '2018-03-27 10:37:58',
      endTime: '--- ---',
      approveStatus: '审核中'
    },
    {
      operations: [{ id: 1, name: '详情' }, { id: 2, name: '修改' }],
      serialNumber: 4,
      processTitle: '测试06-录用申请流程',
      processName: '招聘需求发起',
      processClass: '招聘',
      approver: '周伟',
      taskTime: '2018-03-27 10:37:58',
      endTime: '--- ---',
      approveStatus: '审核中'
    },
    {
      operations: [{ id: 1, name: '详情' }, { id: 2, name: '修改' }],
      serialNumber: 5,
      processTitle: '测试01-录用申请流程',
      processName: '招聘需求发起',
      processClass: '招聘',
      approver: '周伟',
      taskTime: '2018-03-27 10:37:58',
      endTime: '--- ---',
      approveStatus: '审核中'
    },
    {
      operations: [{ id: 1, name: '详情' }, { id: 2, name: '修改' }],
      serialNumber: 6,
      processTitle: '测试01-录用申请流程',
      processName: '招聘需求发起',
      processClass: '招聘',
      approver: '周伟',
      taskTime: '2018-03-27 10:37:58',
      endTime: '--- ---',
      approveStatus: '审核中'
    }
  ],
}

export default function () { return data };