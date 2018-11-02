export default {
  data: {
    "generalInfo": {
      "name": "123",
      "type": "任务类型_value_2",
      "triggerType": "DELETE",
      "triggerTime": 1530535256000,
      "moduleId": 2,
      "description": "123"
    },
    "stepList": [{
      "stepNameType": {
        "name": "123",
        "type": "RPC",
        "isContinue": "OVER",
        "description": "123",
        "ruleType": null
      },
      "outParams": [{
        "param": "123",
        "valType": "string-??",
        "val": "321"
      }],
      "inputParams": [{
        "param": "123",
        "valType": "int",
        "val": "321"
      }],
      "sort": 1,
      "conditionList": {
        "singleItem": [{
          "conditionColumn": "法人主体",
          "conditionType": 2,
          "conditionVal": "321"
        }],
        "conditionType": "AND"
      },
      "RPC": {
        "am": {
          "rpcUrl": "123",
          "submitType": "POST"
        },
        "protocolHead": [{
          "header": "123",
          "val": "321"
        }],
        "requiredParameter": [{
          "param": "123",
          "valType": "float",
          "val": "123"
        }]
      },
      "sql": [{
        "type": {
          "setType": "SQL",
          "sqlType": "UPDATE"
        },
        "customSQL": {
          "customSQL": ""
        },
        "column": [{
          "columnName": "",
          "columnVal": ""
        }],
        "conditionList": {
          "singleItem": [{
            "conditionColumn": "",
            "conditionType": "",
            "conditionVal": ""
          }],
          "conditionType": "AND"
        }
      }]
    }, {
      "stepNameType": {
        "name": "21",
        "type": "SQL",
        "isContinue": "OVER",
        "description": "123",
        "ruleType": null
      },
      "outParams": [{
        "param": "sd",
        "valType": "int-??",
        "val": "dsa"
      }],
      "inputParams": [{
        "param": "asd",
        "valType": "int",
        "val": "dsa"
      }],
      "sort": 2,
      "conditionList": {
        "singleItem": [{
          "conditionColumn": "财务主体",
          "conditionType": 3,
          "conditionVal": "asd"
        }, {
          "conditionColumn": "法人主体",
          "conditionType": 3,
          "conditionVal": "dsa"
        }],
        "conditionType": "AND"
      },
      "RPC": {
        "am": {
          "rpcUrl": "",
          "submitType": ""
        },
        "requiredParameter": [{
          "param": "",
          "valType": "",
          "val": ""
        }],
        "protocolHead": [{
          "header": "",
          "val": ""
        }]
      },
      "sql": [{
        "type": {
          "setType": "SQL",
          "sqlType": "UPDATE"
        },
        "customSQL": {
          "customSQL": "sadada"
        },
        "column": [{
          "columnName": "",
          "columnVal": ""
        }],
        "conditionList": {
          "singleItem": [{
            "conditionColumn": "",
            "conditionType": "",
            "conditionVal": ""
          }],
          "conditionType": "AND"
        }
      }, {
        "type": {
          "setType": "CONFIG",
          "sqlType": "INSERT"
        },
        "customSQL": {
          "customSQL": ""
        },
        "column": [{
          "columnName": "dsa",
          "columnVal": "sd"
        }],
        "conditionList": {
          "singleItem": [{
            "conditionColumn": "",
            "conditionType": "",
            "conditionVal": ""
          }],
          "conditionType": "AND"
        }
      }, {
        "type": {
          "setType": "CONFIG",
          "sqlType": "UPDATE"
        },
        "customSQL": {
          "customSQL": ""
        },
        "column": [{
          "columnName": "sss",
          "columnVal": "dddd"
        }],
        "conditionList": {
          "singleItem": [{
            "conditionColumn": "财务主体",
            "conditionType": 4,
            "conditionVal": "dadada"
          }, {
            "conditionColumn": "财务主体",
            "conditionType": 1,
            "conditionVal": "dasdada"
          }],
          "conditionType": "AND"
        }
      }, {
        "type": {
          "setType": "CONFIG",
          "sqlType": "DELETE"
        },
        "customSQL": {
          "customSQL": ""
        },
        "column": [{
          "columnName": "",
          "columnVal": ""
        }],
        "conditionList": {
          "singleItem": [{
            "conditionColumn": "法人主体",
            "conditionType": 4,
            "conditionVal": "dsawd"
          }],
          "conditionType": "AND"
        }
      }]
    }]
  },
  data_2: {
    "generalInfo": {
      "name": "123",
      "type": "任务类型_value_2",
      "triggerType": "DELETE",
      "triggerTime": 1530535256000,
      "moduleId": 2,
      "description": "123"
    },
    "stepList": [{
      "stepNameType": {
        "name": "123",
        "type": "RPC",
        "isContinue": "OVER",
        "description": "123",
        "ruleType": null
      },
      "outParams": [],
      "inputParams": [],
      "sort": 1,
      "conditionList": {
        "singleItem": [{
          "conditionColumn": "法人主体",
          "conditionType": 2,
          "conditionVal": "321"
        }],
        "conditionType": "AND"
      },
      "RPC": {
        "am": {
          "rpcUrl": "123",
          "submitType": "POST"
        },
        "protocolHead": [],
        "requiredParameter": []
      },
      "sql": [{
        "type": {
          "setType": "SQL",
          "sqlType": "UPDATE"
        },
        "customSQL": {
          "customSQL": ""
        },
        "column": [{
          "columnName": "",
          "columnVal": ""
        }],
        "conditionList": {
          "singleItem": [{
            "conditionColumn": "",
            "conditionType": "",
            "conditionVal": ""
          }],
          "conditionType": "AND"
        }
      }]
    }, {
      "stepNameType": {
        "name": "21",
        "type": "SQL",
        "isContinue": "OVER",
        "description": "123",
        "ruleType": null
      },
      "outParams": [],
      "inputParams": [],
      "sort": 2,
      "conditionList": {
        "singleItem": [{
          "conditionColumn": "财务主体",
          "conditionType": 3,
          "conditionVal": "asd"
        }, {
          "conditionColumn": "法人主体",
          "conditionType": 3,
          "conditionVal": "dsa"
        }],
        "conditionType": "AND"
      },
      "RPC": {
        "am": {
          "rpcUrl": "",
          "submitType": ""
        },
        "requiredParameter": [{
          "param": "",
          "valType": "",
          "val": ""
        }],
        "protocolHead": [{
          "header": "",
          "val": ""
        }]
      },
      "sql": []
    }]
  }


}
