/*
 * Activiti Modeler component part of the Activiti project
 * Copyright 2005-2014 Alfresco Software, Ltd. All rights reserved.
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.

 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 */

/*
 * Condition expression
 */

var KisBpmConditionExpressionCtrl = ['$scope', '$modal', function ($scope, $modal) {

  // Config for the modal window
  var opts = {
    template: 'editor-app/configuration/properties/condition-expression-popup.html?version=' + Date.now(),
    scope: $scope
  };

  // Open the dialog
  $modal(opts)
}];
// const appKey = window.sessionStorage.getItem("paas:cloud:platform:appKey");
var modelId = EDITOR.UTIL.getParameterByName('modelId');

var modelRelMaps = {};

var systemParamsGroup = {
  label: "系统参数",
  columns: [{
    label: "发起人",
    value: "startUser",
    type: "input"
  }, {
    label: "审批类型",
    value: "approvalStatus",
    type: "input"
  }, {
    label: "上一审批人",
    value: "lastApprover",
    type: "input"
  }, {
    label: "发起人所在部门",
    value: "currentOrg",
    type: "input"
  }, {
    label: "当前发起人所属小组",
    value: "currentGroup",
    type: "input"
  }, {
    label: "发起人上级领导",
    value: "superiorLeader",
    type: "input"
  }, {
    label: "上一审批人的上级领导",
    value: "lastApproverSuperiorLeader",
    type: "input"
  }, {
    label: "上级领导的上级领导",
    value: "superiorLeaderSuperiorLeader",
    type: "input"
  }, {
    label: "上级领导的上级领导的上级领导",
    value: "superiorLeaderSuperiorLeaderSuperiorLeader",
    type: "input"
  }, {
    label: "上级领导的上级领导的上级领导的上级领导",
    value: "superiorLeaderSuperiorLeaderSuperiorLeaderSuperiorLeader",
    type: "input"
  }, {
    label: "会签节点审批通过总数",
    value: "successCount",
    type: "input"
  }, {
    label: "会签节点审批不通过总数",
    value: "loseCount",
    type: "input"
  }]
};
/**
 * 处理规则
 */
var handlerRule = function (rule, column) {
  if (!Boolean(rule.columnKey) || !Boolean(rule.operator)) {
    return "";
  }
  var value = column.format ? column.format(rule.value) : rule.value;
  switch (rule.operator) {
    case 'notempty':
      return '(!empty  ' + rule.columnKey + ')';
    case 'empty':
      return '(empty  ' + rule.columnKey + ')';
    case 'eq':
      return rule.columnKey + ' eq ' + value;
    case 'ne':
      return rule.columnKey + ' ne ' + value;
    case 'gt':
      return rule.columnKey + ' > ' + value;
    case 'ge':
      return rule.columnKey + ' >= ' + value;
    case 'lt':
      return rule.columnKey + ' < ' + value;
    case 'le':
      return rule.columnKey + ' <= ' + value;
    case 'expr':
      return rule.columnKey + ' ' + rule.value;
  }
}
/**
 * 处理分组
 */
var handlerGroup = function (group, columnMaps) {
  var rules = [];
  angular.forEach(group.rules, function (rule) {
    var _rule = '';
    if (rule.type === 'rule') {
      _rule = handlerRule(rule, columnMaps[rule.columnKey]);
    } else if (rule.type === 'group') {
      _rule = handlerGroup(rule, columnMaps);
      if (_rule !== '') {
        // 拼接数据到分组
        _rule = '(' + _rule + ')';
      }
    }

    if (_rule !== '') {
      rules.push(_rule);
    }
  });
  return rules.join(group.cond === 'AND' ? ' && ' : ' || ');
}

var dataStringFormat = function (value) {
  return "'" + value + "'";
}

var dataTypeFormat = function (column) {
  switch (column.columnType) {
    case 'varchar':
      return this.dataStringFormat;
  }
}

var handlerColumnType = function (column) {
  // 依赖字段默认为输入框
  if (column.relyModuleId) {
    return 'input';
  }
  switch (Number(column.showType)) {
    case 1:
      switch (column.colMark) {
        case "FOREIGNKEY":
          return 'data-select';
        case "AUTOCODE":
        case "MONEY":
        case "NUMBER":
        case "RELATED":
        default:
          return 'input';
      }
    case 2:
    case 3:
    case 4:
      return 'dict';
    case 5:
      return 'input';
    case 6:
      return 'input';
    case 7:
      switch (column.colMark) {
        case "CHOSENDATA":
          return 'data-select';
        case "DEPARTMENT":
          switch (Number(column.showColValSet)) {
            case 3:
              return 'dept-select';
            case 4:
              return 'user-select';
            case 5:
              break;
          }
          break;
      }
    case 8:
    case 9:
    case 10:
    case 50:
    default:
      return 'input';
  }
}
/**
 * 表达式编辑
 */
var KisBpmConditionExpressionPopupCtrl = ['$scope', '$translate', '$element', function ($scope, $translate, $element) {

  $scope.columnGroups = [systemParamsGroup];

  $scope.popupStatus = true;

  $scope.conditionBuilder = {
    id: Date.now().toString(36),
    cond: 'AND',
    rules: []
  };

  if (modelRelMaps[modelId]) {
    loadViewColumn();
  } else {
    axios.get("workflow://model/" + modelId + "/" + appKey).then(function (res) {
      modelRelMaps[modelId] = res.data.modelRel;
      loadViewColumn();
    });
  }

  $scope.columnMaps = {};

  angular.forEach(systemParamsGroup.columns, function (column) {
    $scope.columnMaps[column.value] = column;
  })
  /**
   * 加载当前视图所有字段信息
   */
  function loadViewColumn() {
    axios.post('platform://custom/C01016', {
      viewId: modelRelMaps[modelId].viewId
    }).then(function (res) {
      var columnGroup = {
        label: "业务字段",
        columns: []
      };
      $scope.columnGroups = [systemParamsGroup, columnGroup];
      angular.forEach(res.data, function (_column) {
        var column = {
          '[[column]]': _column,
          format: dataTypeFormat(_column),
          type: handlerColumnType(_column),
          label: _column.columnName,
          value: _column.moduleCode + "_" + _column.phyColumnName
        };
        $scope.columnMaps[column.value] = column;
        columnGroup.columns.push(column)
      })
      console.log("columnGroups", $scope.columnMaps)
      setTimeout(() => {
        jQuery('.chosen-select-filter', $element).trigger("chosen:updated");
      });
    })
  }

  $scope.includeTemplate = function (rule) {
    if (rule.operator === "expr") {
      return 'rule-value-input.html';
    }
    var column = $scope.columnMaps[rule.columnKey] || {};
    var type = column.type || 'input';
    return 'rule-value-' + type + '.html';
  }

  $scope.$watch('conditionBuilder', function (conditionBuilder) {
    var conditionExpression = handlerGroup(conditionBuilder, $scope.columnMaps);
    if (Boolean(conditionExpression)) {
      $scope.conditionExpression.value = '${' + conditionExpression + '}';
    }
  }, true)

  // Put json representing condition on scope
  if ($scope.property.value !== undefined && $scope.property.value !== null) {

    $scope.conditionExpression = {
      value: $scope.property.value
    };

  } else {
    $scope.conditionExpression = {
      value: ''
    };
  }


  // function

  $scope.pushConditionBuilder = function (condition, type) {
    if (type == 'group') {
      condition.rules.push({
        id: Date.now().toString(36),
        type: 'group',
        cond: "AND",
        rules: []
      })
    } else if (type == 'rule') {
      condition.rules.push({
        id: Date.now().toString(36),
        type: 'rule',
        columnKey: undefined,
        operator: undefined,
        value: undefined
      });
    }
  }


  $scope.removeRule = function (condition, rule) {
    condition.rules.splice(condition.rules.indexOf(rule), 1);
  }

  $scope.removeGroup = function (pgroup, condition) {
    pgroup.rules.splice(pgroup.rules.indexOf(condition), 1);
  }

  var chosenConfig = {
    columnKey: {
      minimumResultsForSearch: 10,
      selectOnClose: true,
      placeholder: '请选择参数',
      language: "zh-CN",
      width: "250px"
    },
    operator: {
      minimumResultsForSearch: 10,
      placeholder: '请选择操作符',
      selectOnClose: true,
      language: "zh-CN",
      width: "150px"
    }
  }

  $scope.initChosen = function (rule, valueKey) {
    setTimeout(() => {
      jQuery('#chosen-select-' + valueKey + '-' + rule.id).select2(chosenConfig[valueKey]).change(function (event) {
        $scope.$apply(function () {
          rule[valueKey] = jQuery(event.target).val();
          if (valueKey === "columnKey") {
            rule.value = undefined;
          }
        });
      });
    });
  }



  $scope.save = function () {
    $scope.property.value = $scope.conditionExpression.value;
    $scope.updatePropertyInModel($scope.property);
    $scope.close();
  };

  // Close button handler
  $scope.close = function () {
    $scope.property.mode = 'read';
    $scope.$hide();
  };
}];

/**
 * 字典类型
 */
var KisBpmConditionExpressionPopupDictCtrl = ['$scope', '$translate', '$element', function ($scope, $translate, $element) {
  $scope.dicts = [];

  function initDictData() {
    var column = $scope.column = $scope.columnMaps[$scope.rule.columnKey];
    var columnData = column['[[column]]'];
    axios.post('platform://base/B03008', {
      idFindAll: 0,
      dictType: columnData.showColVal
    }).then(function (res) {
      $scope.dicts.splice(0, $scope.dicts.length);
      angular.forEach(res.data, function (data) {
        $scope.dicts.push({
          label: data.dictName,
          value: data.dictCode
        });
      });
      setTimeout(() => {
        $scope.$apply();
      });
    });
  };

  // 初始化
  setTimeout(() => {
    jQuery(".chosen-select", $element).select2({
      width: "150px",
      minimumResultsForSearch: 10,
      placeholder: '请选择字典值',
      language: "zh-CN"
    }).change(function (event) {
      $scope.$apply(function () {
        $scope.rule.value = jQuery(event.target).val();
      });
    })
  });

  $scope.$watch('rule.columnKey', initDictData);
}];


/**
 * 部门选择
 */
var KisBpmConditionExpressionDeptSelectPopupCtrl = ['$scope', '$modal', '$element', function ($scope, $modal, $element) {

  $scope.showVal = $scope.rule.value;

  var treeControl = $scope.$treeControl = {};
  $scope.treeData = [];

  axios.post("platform://org/O02006", {}).then(function (res) {
    var organzationList = res.data.organzationList;
    $scope.treeData.splice(0, $scope.treeData.length);
    var organzationMaps = {};
    angular.forEach(organzationList, function (org) {
      organzationMaps[org.orgCode] = {
        '[[organzation]]': org,
        label: org.orgName,
        orgCode: org.orgCode,
        orgParentCode: org.orgParentCode,
      };
    });
    for (var key in organzationMaps) {
      if (organzationMaps.hasOwnProperty(key)) {
        var element = organzationMaps[key];
        var parentOrg = organzationMaps[element.orgParentCode];
        var children = $scope.treeData;
        if (parentOrg) {
          parentOrg.children || (parentOrg.children = []);
          children = parentOrg.children;
        }
        children.push(element);
      }
    }

    setTimeout(() => {
      treeControl.select_first_branch();
      treeControl.expand_branch();
    });
  });

  setTimeout(() => {
    jQuery('.abn-tree', $element).modal({
      show: false,
      backdrop: false,
    });
  });

  $scope.selectOrgHandler = function (branch) {
    if (branch.orgCode !== "0") {
      $scope.showVal = branch.label;
      $scope.rule.value = branch.orgCode;
    }
  }

  $scope.showDeptPopup = function () {
    jQuery('.abn-tree', $element).modal('show');
  }

  $scope.hideDeptPopup = function () {
    jQuery('.abn-tree', $element).modal('hide');
  }
}];

/**
 * 用户选择
 */
var KisBpmConditionExpressionUserSelectPopupCtrl = ['$scope', '$modal', function ($scope, $modal) {
  $scope.showVal = $scope.rule.value;

  $scope.$on('select-user', function (event, user) {
    event.stopPropagation();
    setTimeout(() => {
      $scope.$apply(function () {
        $scope.showVal = user.realName;
        $scope.rule.value = user.entCode + '_' + user.id;;
      });
    });
  });

  $scope.showUserPopup = function () {
    $modal({
      template: 'editor-app/configuration/properties/assignee-user-select-popup.html?version=' + Date.now(),
      scope: $scope
    });
  }
}];

/**
 * 外键/数据选择
 */
var KisBpmConditionExpressionDataSelectPopupCtrl = ['$scope', '$modal', function ($scope, $modal) {
  $scope.showVal = $scope.rule.value;
  var columnData = $scope.columnMaps[$scope.rule.columnKey]['[[column]]'];

  // 处理字段显示属性和数据属性
  var column = $scope.column = new Column();

  column.render(columnData);
  $scope.$on("select-data", function (event, record) {
    event.stopPropagation();
    column.dataShowColumn().then(function (_column) {
      $scope.$apply(function () {
        $scope.showVal = record[_column.showValKey];
        $scope.rule.value = record["ID"] || record["id"];
      });
    })
  })

  $scope.showDataSelectPopup = function () {
    $modal({
      template: 'editor-app/configuration/properties/condition-data-select-popup.html?version=' + Date.now(),
      scope: $scope
    });
  }
}];
