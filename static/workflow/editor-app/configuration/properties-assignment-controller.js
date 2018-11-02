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
// var appKey = window.sessionStorage.getItem("paas:cloud:platform:appKey");
var params = "";
var assigneeUserOptionMaps = {
  "assigneeFieldSelectUser": "指定用户",
  "startUser": "发起人",
  "lastApprover": "上一审批人",
  "superiorLeader": "发起人上级领导",
  "lastApproverSuperiorLeader": "上一审批人的上级领导",
  "superiorLeaderSuperiorLeader": "上级领导的上级领导",
  "superiorLeaderSuperiorLeaderSuperiorLeader": "上级领导的上级领导的上级领导",
  "superiorLeaderSuperiorLeaderSuperiorLeaderSuperiorLeader": "上级领导的上级领导的上级领导的上级领导",
};

var candidateUserOptionMaps = {
  "currentOrg": "发起人部门下的工作组",
  "currentGroup": "发起人下的指定工作组",
  "designateOrg": "指定部门下的工作组",
  "designateGroup": "指定工作组下的指定工作组",
  "designate": "指定工作组",
};

var paramsOptionMaps = {};

/*
 * Assignment
 */
var KisBpmAssignmentCtrl = ['$scope', '$modal', function ($scope, $modal) {

  // Config for the modal window
  var opts = {
    template: 'editor-app/configuration/properties/assignment-popup.html?version=' + Date.now(),
    scope: $scope
  };

  // Open the dialog
  axios.get(`workflow://param/${$scope.workflowModel.modelRel.modelId}/${appKey}`).then(function (res) {
    paramsOptionMaps = {};
    angular.forEach(res.data, function (data) {
      paramsOptionMaps[data.inputParam] = data.name;
    })
    $modal(opts);
  })
}];

/**
 * 
 */
var KisBpmAssignmentPopupCtrl = ['$scope', function ($scope) {

  // Put json representing assignment on scope
  if ($scope.property.value !== undefined && $scope.property.value !== null &&
    $scope.property.value.assignment !== undefined &&
    $scope.property.value.assignment !== null) {
    $scope.assignment = $scope.property.value.assignment;
  } else {
    $scope.assignment = {};
  }

  if ($scope.assignment.candidateUsers == undefined || $scope.assignment.candidateUsers.length == 0) {
    $scope.assignment.candidateUsers = [{
      value: ''
    }];
  }
  // 同步assignee 用户选择数据
  $scope.syncAssigneeUser = {
    isCandidateUser: false,
    clear: function () {
      for (var key in this) {
        if (this.hasOwnProperty(key)) {
          if (['isCandidateUser', 'clear', 'value'].indexOf(key) < 0) {
            delete this[key];
          }
        }
      }
    }
  };

  Object.defineProperty($scope.syncAssigneeUser, "value", {
    get: function () {
      return $scope.assignment.assignee || '';
    },
    set: function (value) {
      $scope.assignment.assignee = value;
    }
  })

  $scope.proxyValue = function (candidateUser) {
    var proxyCandidateUser = {
      isCandidateUser: true,
      clear: function () {
        for (var key in this) {
          if (this.hasOwnProperty(key)) {
            if (['isCandidateUser', 'clear', 'value'].indexOf(key) < 0) {
              delete this[key];
            }
          }
        }
      }
    };
    Object.defineProperty(proxyCandidateUser, "value", {
      get: function () {
        return candidateUser.value || '';
      },
      set: function (value) {
        candidateUser.value = value;
      }
    })
    return proxyCandidateUser;
  }


  // Click handler for + button after enum value
  $scope.addCandidateUserValue = function () {
    $scope.assignment.candidateUsers.push({
      value: ''
    })
  };

  // Click handler for - button after enum value
  $scope.removeCandidateUserValue = function (candidateUser) {
    var index = $scope.assignment.candidateUsers.indexOf(candidateUser);
    $scope.assignment.candidateUsers.splice(index, 1);
  };

  if ($scope.assignment.candidateGroups == undefined || $scope.assignment.candidateGroups.length == 0) {
    $scope.assignment.candidateGroups = [{
      value: ''
    }];
  }

  // 初始化候选分组内容

  $scope.addCandidateGroupValue = function () {
    $scope.assignment.candidateGroups.push({
      value: ''
    });
  };

  // Click handler for - button after enum value
  $scope.removeCandidateGroupValue = function (candidateGroup) {
    var index = $scope.assignment.candidateGroups.indexOf(candidateGroup);
    $scope.assignment.candidateGroups.splice(index, 1);
  };

  $scope.save = function () {

    $scope.property.value = {};
    handleAssignmentInput($scope);
    $scope.property.value.assignment = $scope.assignment;

    $scope.updatePropertyInModel($scope.property);
    $scope.close();
  };

  // Close button handler
  $scope.close = function () {
    handleAssignmentInput($scope);
    $scope.property.mode = 'read';
    $scope.$hide();
  };

  var handleAssignmentInput = function ($scope) {
    if ($scope.assignment.candidateUsers) {
      var emptyUsers = true;
      var toRemoveIndexes = [];
      for (var i = 0; i < $scope.assignment.candidateUsers.length; i++) {
        if ($scope.assignment.candidateUsers[i].value != '') {
          emptyUsers = false;
        } else {
          toRemoveIndexes[toRemoveIndexes.length] = i;
        }
      }

      for (var i = 0; i < toRemoveIndexes.length; i++) {
        $scope.assignment.candidateUsers.splice(toRemoveIndexes[i], 1);
      }

      if (emptyUsers) {
        $scope.assignment.candidateUsers = undefined;
      }
    }

    if ($scope.assignment.candidateGroups) {
      var emptyGroups = true;
      var toRemoveIndexes = [];
      for (var i = 0; i < $scope.assignment.candidateGroups.length; i++) {
        if ($scope.assignment.candidateGroups[i].value != '') {
          emptyGroups = false;
        } else {
          toRemoveIndexes[toRemoveIndexes.length] = i;
        }
      }

      for (var i = 0; i < toRemoveIndexes.length; i++) {
        $scope.assignment.candidateGroups.splice(toRemoveIndexes[i], 1);
      }

      if (emptyGroups) {
        $scope.assignment.candidateGroups = undefined;
      }
    }
  };
}];

var KisBpmAssignmentCandidateGroupCtrl = ['$scope', '$element', function ($scope, $element) {
  var $groupEl = jQuery('[data-toggle="candidateGroup"]', $element);
  $groupEl = $groupEl.select2({
    width: "100%",
    language: "zh-CN",
    placeholder: '请选择候选分组',
    minimumResultsForSearch: 10,
    ajax: {
      delay: 250,
      url: 'workflow://auth/group/list/' + appKey,
      data: function (params) {
        var query = {
          "groupName": params.term || undefined,
          "pageNow": params.page || 1,
          "pageSize": 20
        };
        return query;
      },
      transport: function (params, success, failure) {
        axios.post(params.url, params.data).then(success, failure);
      },
      processResults: function (res) {
        var data = res.data;
        var records = [];
        for (var index in data.record) {
          var record = data.record[index];
          records.push({
            id: record.groupId,
            text: record.groupName
          })
        }
        return {
          results: records,
          pagination: {
            more: data.totalPage > data.currentPage
          }
        };
      }
    }
  });

  $groupEl.change(function (event) {
    var value = jQuery(event.target).val();
    if (Boolean(value) && value.length > 0) {
      setTimeout(() => {
        $scope.$apply(function () {
          $scope.candidateGroup.value = value;
        });
      });
    }
  });
  var appKey = window.sessionStorage.getItem("paas:cloud:platform:appKey");
  if (Boolean($scope.candidateGroup.value)) {
    axios.get("workflow://auth/group/" + $scope.candidateGroup.value + "/" + appKey).then(function (res) {
      $groupEl.append(new Option(res.data.groupName, res.data.groupId, false, true))
    })
    $groupEl.trigger('change');
  }

}]

/**
 * 用户选择
 */
var KisBpmAssignmentUserCtrl = ['$scope', '$modal', '$element', function ($scope, $modal, $element) {
  var userOPtionMaps = angular.extend({}, assigneeUserOptionMaps, paramsOptionMaps);
  var userArrayOPtionMaps = angular.extend({}, userOPtionMaps, candidateUserOptionMaps);
  var assigneeSelectUser = $scope.assigneeSelectUser;

  $scope.assigneeUserOptions = userOPtionMaps;
  if (assigneeSelectUser.isCandidateUser) {
    $scope.assigneeUserOptions = userArrayOPtionMaps;
  }



  function assigneeSelectUserVal() {
    // 候选用户
    if (candidateUserOptionMaps[assigneeSelectUser.type]) {
      if (!assigneeSelectUser[assigneeSelectUser.type] || assigneeSelectUser[assigneeSelectUser.type].length <= 0) return;
      switch (assigneeSelectUser.type) {
        case 'designate':
        case 'currentOrg':
        case 'currentGroup':
          var tempStr = assigneeSelectUser[assigneeSelectUser.type].join("_R_");
          assigneeSelectUser.value = assigneeSelectUser.type + '_R_' + tempStr;
          break;
        case 'designateOrg':
          if (assigneeSelectUser.orgCode) {
            var tempArray = [assigneeSelectUser.orgCode];
            tempArray.push.apply(tempArray, assigneeSelectUser[assigneeSelectUser.type]);
            assigneeSelectUser.value = assigneeSelectUser.type + '_' + tempArray.join("_R_");
          }
          break;
        case 'designateGroup':
          if (assigneeSelectUser.groupId) {
            var tempArray = [assigneeSelectUser.groupId];
            tempArray.push.apply(tempArray, assigneeSelectUser[assigneeSelectUser.type]);
            assigneeSelectUser.value = assigneeSelectUser.type + '_' + tempArray.join("_R_");
          }
          break;
      }
    } else if (assigneeSelectUser.type !== "assigneeFieldSelectUser") {
      assigneeSelectUser.value = '${' + assigneeSelectUser.type + '}';
    }
  }

  setTimeout(() => {
    // 类型
    var $typeEl = jQuery('[data-toggle="chosen"]', $element);
    // 分组多选
    var $groupEl = jQuery('[data-toggle="group"]', $element);
    // 指定分组
    var $designateGroupEl = jQuery('[data-toggle="designateGroup"]', $element);

    $typeEl = $typeEl.select2({
      minimumResultsForSearch: 10,
      placeholder: '请选择',
      language: "zh-CN"
    });
    $typeEl.change(function (event) {
      $scope.$apply(function () {
        assigneeSelectUser.clear();
        assigneeSelectUser.type = jQuery(event.target).val();
        $groupEl.val([]).trigger('change');
        $designateGroupEl.val('').trigger('change');
        assigneeSelectUserVal();
      });
    });

    $groupEl = $groupEl.select2({
      width: "100%",
      multiple: true,
      language: "zh-CN",
      placeholder: '请选择分组',
      minimumResultsForSearch: 10,
      ajax: {
        delay: 250,
        url: 'workflow://auth/group/list?entCode=' + $scope.loginUser.entCode,
        data: function (params) {
          var query = {
            "groupName": params.term || undefined,
            "pageNow": params.page || 1,
            "pageSize": 20
          };
          return query;
        },
        transport: function (params, success, failure) {
          axios.post(params.url, params.data).then(success, failure);
        },
        processResults: function (res) {
          var data = res.data;
          var records = [];
          for (var index in data.record) {
            var record = data.record[index];
            records.push({
              id: record.groupId,
              text: record.groupName
            })
          }
          return {
            results: records,
            pagination: {
              more: data.totalPage > data.currentPage
            }
          };
        }
      }
    });
    $groupEl.change(function (event) {
      var value = jQuery(event.target).val();
      if (Boolean(value) && value.length > 0) {
        setTimeout(() => {
          $scope.$apply(function () {
            assigneeSelectUser[assigneeSelectUser.type] = value;
            assigneeSelectUserVal();
          });
        });
      }
    })

    $designateGroupEl = $designateGroupEl.select2({
      width: "100%",
      language: "zh-CN",
      placeholder: '请选择指定工作组',
      minimumResultsForSearch: 10,
      ajax: {
        delay: 250,
        url: 'workflow://auth/group/list/' + appKey,
        data: function (params) {
          var query = {
            "groupName": params.term || undefined,
            "pageNow": params.page || 1,
            "pageSize": 20
          };
          return query;
        },
        transport: function (params, success, failure) {
          // 处理分页内容
          axios.post(params.url, params.data).then(success, failure);
        },
        processResults: function (res) {
          var data = res.data;
          var records = [];
          for (var index in data.record) {
            var record = data.record[index];
            records.push({
              id: record.groupId,
              text: record.groupName
            })
          }
          return {
            results: records,
            pagination: {
              more: data.totalPage > data.currentPage
            }
          };
        }
      }
    });
    $designateGroupEl.change(function (event) {
      var value = jQuery(event.target).val();
      if (Boolean(value)) {
        setTimeout(() => {
          $scope.$apply(function () {
            assigneeSelectUser.groupId = value;
            assigneeSelectUserVal();
          });
        });
      }
    })


    var keysMap = [];
    var keysIndex = [];
    for (var key in userOPtionMaps) {
      keysMap.push('${' + key + '}');
      keysIndex.push(key);
    };
    var index = keysMap.indexOf(assigneeSelectUser.value);
    var type = keysIndex[index];
    if (!type) {
      for (var key in candidateUserOptionMaps) {
        if (assigneeSelectUser.value.indexOf(key) === 0) {
          type = key;
          break;
        }
      }
      if (!type) {
        type = 'assigneeFieldSelectUser';
      }
    }
    // 重新初始化用户信息
    if (type === "assigneeFieldSelectUser" && Boolean(assigneeSelectUser.value)) {
      axios.get("workflow://auth/user/" + params + "/" + appKey).then(function (res) {
        $scope.$apply(function () {
          assigneeSelectUser.showValue = (res.data || {}).userName || assigneeSelectUser.value;
        });
      })
    }
    var value = assigneeSelectUser.value;

    $typeEl.val(type).trigger('change');

    if (candidateUserOptionMaps[type]) {
      switch (type) {
        case 'designate':
        case 'currentOrg':
        case 'currentGroup':
          value = value.replace(type + '_R_', '');
          assigneeSelectUser[type] = value.split('_R_');
          // 设置分组内容
          break;
        case 'designateOrg':
          value = value.replace(type + '_', '');
          value = value.split('_R_');
          assigneeSelectUser.orgCode = value.splice(0, 1)[0];
          assigneeSelectUser[type] = value;
          break;
        case 'designateGroup':
          value = value.replace(type + '_', '');
          value = value.split('_R_');
          assigneeSelectUser.groupId = value.splice(0, 1)[0];
          assigneeSelectUser[type] = value;
          break;
      }
    }

    if (Boolean(assigneeSelectUser.orgCode)) {
      // 显示内容
      axios.post("platform://org/O02004", {
        orgCode: assigneeSelectUser.orgCode
      }).then(function (res) {
        $scope.$apply(function () {
          assigneeSelectUser.orgShowVal = res.data.organzation.orgName;
        });
      })
    }

    if (assigneeSelectUser.groupId) {
      axios.get("workflow://auth/group/" + assigneeSelectUser.groupId + "/" + appKey).then(function (res) {
        $designateGroupEl.append(new Option(res.data.groupName, res.data.groupId, false, true))
      })
      $designateGroupEl.trigger('change');
    }

    if (assigneeSelectUser[type]) {
      var promises = [];
      angular.forEach(assigneeSelectUser[type], function (groupId) {
        promises.push(axios.get("workflow://auth/group/" + groupId + "/" + appKey));
      })
      Promise.all(promises).then(function (resArray) {
        angular.forEach(resArray, function (res) {
          $groupEl.append(new Option(res.data.groupName, res.data.groupId, false, true))
        })
        $groupEl.trigger('change');
      })
    }

  });

  $scope.$watch('assigneeSelectUser.showValue', function () {
    if (assigneeSelectUser.showValue && assigneeSelectUser.showValue.indexOf("$") >= 0) {
      $scope.assigneeSelectUser.value = assigneeSelectUser.showValue;
    }
  })

  $scope.$on('select-dept', function (event, dept) {
    event.stopPropagation();
    setTimeout(() => {
      $scope.$apply(function () {
        assigneeSelectUser.orgCode = dept.orgCode;
        assigneeSelectUser.orgShowVal = dept.label;
      });
    });
  })

  $scope.$on('select-user', function (event, user) {
    event.stopPropagation();
    setTimeout(() => {
      $scope.$apply(function () {
        let appKey = window.sessionStorage.getItem("paas:cloud:platform:appKey");
        // assigneeSelectUser.value = appKey + '@' + user.id;
        assigneeSelectUser.value = "${assigneeServer.set(execution," + user.id + ")}"
        assigneeSelectUser.showValue = user.realName;
        params = appKey + '@' + user.id
      });
    });
  });

  $scope.isGroup = function (key) {
    return !!candidateUserOptionMaps[key] && !paramsOptionMaps[key];
  }

  $scope.groupClass = function (assigneeSelectUser) {
    if (assigneeSelectUser.type === 'designateOrg' || assigneeSelectUser.type === 'designateGroup') {
      return "col-sm-6";
    }
    return '';
  }

  $scope.showUserPopup = function () {
    $modal({
      template: 'editor-app/configuration/properties/assignee-user-select-popup.html?version=' + Date.now(),
      scope: $scope,
      backdrop: false
    });
  }

  $scope.showDeptPopup = function () {
    $modal({
      template: 'assignment-dept-select.html',
      scope: $scope,
      backdrop: false
    });
  }
}];

var KisBpmAssignmentDeptSelectPopupCtrl = ['$scope', function ($scope) {
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

    $scope.selectBranch = {};


    $scope.selectOrgHandler = function (branch) {
      if (branch.orgCode !== "0") {
        $scope.selectBranch = branch;
      }
    }

    $scope.save = function () {
      $scope.$emit('select-dept', $scope.selectBranch);
      $scope.close();
    };

    // Close button handler
    $scope.close = function () {
      $scope.$hide();
    };


  });
}];
