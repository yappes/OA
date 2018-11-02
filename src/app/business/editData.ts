var data = {
  editTitle: "销售机会详情",
  modules: [{
    id: 1,
    title: "基本信息",
    isListGrid: false,
    feilds: [{
      id: 11,
      colMark: "text",
      label: "单据状态",
      config: {
        value: 0,
        colType: "text",
        showValue: "审核通过"
      }
    }, {
      id: 12,
      colMark: "text",
      label: "记录时间",
      config: {
        value: 0,
        colType: "date",
        showValue: ""
      }
    }, {
      id: 13,
      colMark: "text",
      label: "经营(联络)地址",
      isFull: true,
      config: {
        value: "上海市杨浦区政立路415号中航天盛广场B座7楼上海市杨浦区政立路415号中航天盛广场B座7楼上海市杨浦区政立路415号中航天盛广场B座7楼上海市杨浦区政立路415号中航天盛广场B座7楼",
        colType: "textarea"
      }
    }, {
      id: 14,
      colMark: "userSelect",
      label: "人员选择",
      isFull: true,
      config: {
        value: "0",
        colType: "userSelect"
      }
    }]
  }, {
    id: 2,
    title: "基本信息",
    isListGrid: false,
    feilds: [{
      id: 21,
      colMark: "text",
      label: "单据状态",
      config: {
        value: 0,
        colType: "text",
        showValue: "审核通过"
      }
    }, {
      id: 22,
      colMark: "text",
      label: "记录时间",
      config: {
        value: 0,
        colType: "datetime",
        showValue: ""
      }
    }, {
      id: 23,
      colMark: "text",
      label: "经营(联络)地址",
      isFull: true,
      config: {
        value: "上海市杨浦区政立路415号中航天盛广场B座7楼上海市杨浦区政立路415号中航天盛广场B座7楼上海市杨浦区政立路415号中航天盛广场B座7楼上海市杨浦区政立路415号中航天盛广场B座7楼",
        colType: "textarea",
        readonly: true
      }
    }]
  }, {
    id: 3,
    title: "基本信息",
    isListGrid: false,
    feilds: [{
      id: 31,
      colMark: "text",
      label: "单据状态",
      config: {
        value: 0,
        colType: "text",
        showValue: "审核通过"
      }
    }, {
      id: 32,
      colMark: "text",
      label: "记录时间",
      config: {
        value: 0,
        colType: "time",
        showValue: ""
      },
      value: "意向客户"
    }, {
      id: 33,
      colMark: "text",
      label: "经营(联络)地址",
      isFull: true,
      config: {
        value: "上海市杨浦区政立路415号中航天盛广场B座7楼上海市杨浦区政立路415号中航天盛广场B座7楼上海市杨浦区政立路415号中航天盛广场B座7楼上海市杨浦区政立路415号中航天盛广场B座7楼",
        colType: "textarea",
        readonly: true
      }
    }]
  }, {
    title: "关联渠道商",
    isListGrid: false,
    isBatch: true
  }]
};
export default function () { return data };
