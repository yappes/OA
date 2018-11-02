var data = {
  managerAsideData:[
    {
      label: 'AOS',
      children: [
        { label: '请假' },
        { label: '入职' },
        { label: '离职' },
        { label: '招聘' },
        { label: '转正' },
        { label: '调动' },
        { label: 'hr审批流程' }
      ]
    }
  ],
  defaultProps: {
    children: 'children',
    label: 'label'
  }
}

export default function () { return data };