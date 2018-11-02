import defaultFormModel from './defaultFormModel'
export default {
  flat(obj_1, obj_2) {
    Object.assign(obj_1, obj_2)
  },
  conditionDataOut(data) {
    // let isSingle = (!data.groupArray || data.groupArray.length === 0) && data.singleItem.length === 1
    // let isGroup = data.groupArray && data.groupArray.length > 0
    let unit = unitObj => {
      return {
        type: 'rule',
        columnKey: unitObj.conditionColumn,
        operator: unitObj.conditionType,
        value: unitObj.conditionVal,
        colMark: unitObj.colMark,
      }
    }
    let dataOut = data => {
      let r = {}
      r.cond = data.conditionType
      r.type = 'group'
      let rules = []
      if(data.groupArray && data.groupArray.length > 0) {
        data.groupArray.forEach(group => {
          let item = dataOut(group)
          rules.push(item)
        })
      } 
      if (data.singleItem && data.singleItem.length > 0) {
        data.singleItem.forEach(item => {
          rules.push(unit(item))
        })
      }
      r.rules = rules
      return r
    }
    let res = dataOut(data)
    if(res.rules.length === 0) {
      res = null
    }
    return {
      content: null,
      jsonContent: JSON.stringify(res)
    }
  },
  conditionDataIn(data) {
    let unit = unitObj => {
      return {
        conditionColumn: unitObj.columnKey,
        conditionType: unitObj.operator,
        conditionVal: unitObj.value,
      }
    }
    let ArrayValidate = array => {
      return array && array.length > 0
    }
    let emptyData = {
      cond: 'AND',
      type: 'group',
      rules: [],
    }
    if(data === null) {
      data = emptyData
    }
    let r = {}
    r.singleItem = []
    let groupArray = []
    r.conditionType = data.cond
    if(ArrayValidate(data.rules)) {
      // let groupArray = []
      data.rules.forEach(item => {
        if(item.type === 'rule') {
          r.singleItem.push(unit(item))
        } else if(item.type === 'group') {
          let result = this.conditionDataIn(item)
          groupArray.push(result)
        }
      })
      //TODO:此部分看时机情况考虑是否需要
    } else {
      // r.singleItem.push(unit(data))
    }
    if(ArrayValidate(groupArray)) {
      r.groupArray = groupArray
    }
    // console.log('gaugaugau', r)
    return r
  },
  sqlDataOut(data) {
    let r = {}
    r.setType = data.type.setType
    r.sqlType = data.type.sqlType
    r.moduleId = data.type.moduleId
    // r.content = {}
    if(data.type.setType === 'SQL') {
      //setType:自定义SQL
      r.content = data.customSQL.customSQL
    } else if(data.type.setType === 'CONFIG') {
      //setType:配置
      r.content = {}
      if(r.sqlType === 'INSERT') {
        r.content.column = data.column
      }else if(r.sqlType === 'UPDATE') {
        r.content.column = data.column
        r.content.condition = this.conditionDataOut(data.conditionList)
      }else if(r.sqlType === 'DELETE') {
        r.content.condition = this.conditionDataOut(data.conditionList)
      }
    }
    r.jsonSql = JSON.stringify(r.content)
    return r
  },
  formArrayToObj(arr, keyProp, valProp) {
    let r = {}
    arr.forEach(e => {
      let key = String(e[keyProp])
      let val = e[valProp]
      r[key] = val
    })
    return r
  },
  RPCdataOut(data) {
    let protocolHead = this.formArrayToObj(data.protocolHead, 'header', 'val')
    let requiredParameter = this.formArrayToObj(data.requiredParameter, 'param', 'val')
    return {
       rpcUrl: data.am.rpcUrl,
       submitType: data.am.submitType,
       protocolHead: JSON.stringify(protocolHead),
       requiredParameter: JSON.stringify(requiredParameter),
    }
  },
  notifydataOut(data) {
    if(data.tempId === '') {
      data.tempId = null
    }
    return data
  },
  //event属性的输出格式
  eventOut(step, type) {
    let r = []
    if(type === 'SQL'){
      step.sql.forEach(f => {
        r.push(this.sqlDataOut(f))
      })
    }else if(type === 'RPC') {
      r.push(this.RPCdataOut(step.RPC))
    }else if(type === 'NOTIFY') {
      r.push(this.notifydataOut(step.notify))
    }
    return r
  },
  //整体的formModel整理成后台要求的数据格式
  formModelOut(formModel) {
    let r = {}
    let generalInfo = formModel.generalInfo
    let stepList = formModel.stepList
    this.flat(r, generalInfo)
    // let step_temp = {}
    r.stepList = stepList.map(step => {
      let step_temp = {}
      this.flat(step_temp, step.stepNameType)
      step_temp.outParams = step.outParams
      step_temp.inputParams = step.inputParams
      step_temp.sort = step.sort
      step_temp.ruleType = step.ruleType || 'MZTJ'
      step_temp.condition = this.conditionDataOut(step.conditionList)
      step_temp.event = this.eventOut(step, step.stepNameType.type)
      // console.log('event', step_temp.event)
      return step_temp
    })
    // console.log('formModelOut', r)
    // console.log(JSON.stringify(r))
    return r
  },

  generalInfoIn(data) {
    return {
      name: data.name,
      type: data.type,
      tiggerType: data.tiggerType ,
      tiggerTime: data.tiggerTime,
      moduleId: data.moduleId,
      description: data.description,
    }
  },
  formObjToArray(obj, keyProp, valProp) {
    let arr = []
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const val = obj[key];
        let r = {}
        r[keyProp] = key,
        r[valProp] = val,
        arr.push(r)
      }
    }
    return arr
  },
  RPCdataIn(data) {
    let protocolHead = data && data.protocolHead ? this.formObjToArray(JSON.parse(data.protocolHead), 'header', 'val') : []
    let requiredParameter = data && data.requiredParameter ? this.formObjToArray(JSON.parse(data.requiredParameter), 'param', 'val') : []
    let RPC = {}
    RPC.am = {
      rpcUrl: data ? data.rpcUrl : '',
      submitType: data ?data.submitType : '',
    }
    RPC.protocolHead = protocolHead
    RPC.requiredParameter = requiredParameter
    return RPC
  },
  sqlDataIn(data) {
    let r = defaultFormModel.sql()
    let setType = data.setType
    let sqlType = data.sqlType
    let moduleId = data.moduleId || null
    r.type = {
      setType,
      sqlType,
      moduleId,
    }
    if(setType === 'SQL') {
      r.customSQL.customSQL = data.content
    }else if(setType === 'CONFIG') {
      if(sqlType === 'INSERT' || sqlType === 'UPDATE') {
        let content = JSON.parse(data.content)
        r.column = content.column
      }
      if(sqlType === 'DELETE' || sqlType === 'UPDATE') {
        let content = JSON.parse((JSON.parse(data.content)).condition.jsonContent)
        r.conditionList = this.conditionDataIn(content)
      }
    }
    return r
  },
  notifyDataIn(data) {
    if(!data.sendUser) {
      data.sendUser = data.senderUser
    }
    if(data.tempId === null) {
      data.tempId = ''
    }
    return data
  },
  stepIn(data) {
    let stepNameType =  {
      "name": data.name,
      "type": data.type,
      "isContinue": data.isContinue,
      "description": data.description,
      "ruleType": data.ruleType,
    }
    let outParams = data.outParams
    let inputParams = data.inputParams
    let sort = data.sort
    let conditionData = data.conditionList ? JSON.parse(data.conditionList.jsonContent) : null
    let conditionList = this.conditionDataIn(conditionData)
    let RPC = defaultFormModel.RPC()
    let sql = [defaultFormModel.sql()]
    let notify = defaultFormModel.notify()
    // console.log('data.event', data.event)
    let event = Array.isArray(data.event) ? data.event : [data.event]
    if(data.type === 'RPC') {
      RPC = this.RPCdataIn(event[0])
    }else if(data.type === 'SQL') {
      sql = event.map(d => {
        return this.sqlDataIn(d)
      })
    }else if(data.type === 'NOTIFY') {
      notify = this.notifyDataIn(event[0])
    }
    return {
      stepNameType,
      outParams,
      inputParams,
      sort,
      conditionList,
      RPC,
      sql,
      notify,
    }
  },
  formModelIn(data) {
    let r = {}
    r.generalInfo = this.generalInfoIn(data)
    // r.stepList = this.stepListIn(data.stepList)
    r.stepList = data.stepList.map(step => {
      return this.stepIn(step)
    })
    // console.log('formModelIn')
    // console.log(JSON.stringify(r))
    return r
  }
}