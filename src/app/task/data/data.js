export default {
  conditionType: [
    {
      label: "等于",
      value: 3
    }, {
      label: "大于等于",
      value: 4
    }, {
      label: "大于",
      value: 1
    }, {
      label: "小于等于",
      value: 5
    }, {
      label: "小于",
      value: 2
    }, {
      label: "包含",
      value: 6
    }, {
      label: "不等于",
      value: 7
    }, {
      label: "自定义",
      value: 8,
      type: "Region"
    }, {
      label: "时间间隔",
      value: 9,
      type: "Select"
    }
  ],
  conditionColumn: [],
  conditionColumnSource: [],
  valType: [{
    label: '字符串',
    value: 'string',
  }, {
    label: '整数',
    value: 'int',
  }, {
    label: '浮点数',
    value: 'float',
  }, {
    label: '日期',
    value: 'date',
  }, ]
}