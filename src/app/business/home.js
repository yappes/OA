var data={
  headerTitle:"流程审批",
  headerMenu:"待审批",
  navLeftTitle:"",
  navLeftList:[
    {
      id: 1 , 
      classes: '流程审批',
      navLeftItem: [
        { index: {name:'checkPending'}, item: '待审批' },
        { index: {name:'checked'}, item: '已审核' },
        { index: {name:'launchProcessAll'}, item: '发起流程'}
      ]
    },
    {
      id: 2 , 
      classes: '我的事务',
      navLeftItem: [
        { index: {name:'myChecked'}, item: '我发起的审批' },
        { index: {name:'drafts'}, item: '草稿箱' },
      ]
    },
    {
      id: 3 , 
      classes: '流程配置',
      navLeftItem: [
        { index: {name:'processManager'}, item: '流程管理' },
        { index: {name:'workGroup'}, item: '工作组' },
        {  item: '同步用户' },
      ]
    }
  ]
};


export default function () { return data };
