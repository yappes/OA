export default {
  generalInfo() {
    return {
      name: '',
      type: '',
      tiggerTime: '',
      tiggerType: '',
      moduleId: '',
      description: '',
    }
  },
  stepNameType() {
    return {
      name: '',
      type: '',
      isContinue: '',
      description: '',
    }
  },
  outParam() {
    return {
      param: '',
      valType: '',
      val: '',
    }
  },
  inputParam() {
    return {
      param: '',
      valType: '',
      val: '',
    }
  },
  RPC() {
    return {
      am: {
        rpcUrl: '',
        submitType: '',
      },
      requiredParameter: [
      //   {
      //   param: '',
      //   valType: '',
      //   val: '',
      // }
    ],
      protocolHead: [
      //   {
      //   header: '',
      //   val: ''
      // }
    ],
    }
  },
  sql(data) {
    let func = (arr) => {
      return arr.map(e => {
        return {
          columnCode: e.columnCode,
          columnVal: e.columnVal,
          colMark: e.colMark,
        }
      })
    }
    let col = [{
      columnCode: '',
      columnVal: '',
      colMark: '',
    }]
    return {
      type: {
        setType: data && data.type ? data.type.setType : '',
        sqlType: data && data.type ? data.type.sqlType : '',
        moduleId: data && data.type ? data.type.moduleId : '',
      },
      customSQL : {
        customSQL: data && data.customSQL ? data.customSQL.customSQL : '',
      },
      column: data && data.column ? func(data.column): col,
      conditionList: data && data.conditionList ? data.conditionList : this.conditionListNotEmpty()
    }
  },
  notify() {
    return {
      msgType: '',
      receiveType: '',
      receiveUser: '',
      tempId: '',
      sendUser: '',
    }
  },
  conditionListNotEmpty() {
    return {
      singleItem: [{
        conditionColumn: '',
        conditionType: '',
        conditionVal: '',
        colMark: '',
      }],
      conditionType: 'AND',
    }
  },
  conditionListEmpty() {
    return {
      singleItem: [],
      conditionType: 'AND',
    }
  },
}