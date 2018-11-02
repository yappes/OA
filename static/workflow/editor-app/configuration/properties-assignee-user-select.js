/**
 * 用户选择
 */

var KisBpmUserSelectPopupCtrl = ['$scope', '$translate', function ($scope, $translate) {
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

  $scope.userRecord = [];
  $scope.$selectUser = {};
  $scope.selectUser = function (user) {
    $scope.$selectUser.$active = false;
    $scope.$selectUser = user;
    $scope.$selectUser.$active = true;
  };

  $scope.page = {
    orgCode: undefined,
    searchKey: undefined,
    currentPage: 1,
    pageSize: 15,
    totalPage: 1
  };

  $scope.getArray = function (num) {
    var arr4 = new Array();
    var i = 1;
    do {
      arr4.push(i);
      i++;
    }
    while (i <= num)
    return arr4;
  }

  $scope.$watch('page.searchKey', function () {
    if (this['[[timeoutId]]']) {
      clearTimeout(this['[[timeoutId]]']);
    }
    var _this = this;
    this['[[timeoutId]]'] = setTimeout(function () {
      delete _this['[[timeoutId]]'];
      $scope.loadingUser();
    }, 500);
  });

  $scope.loadingUser = function (currentPage) {
    if (currentPage < 1 || currentPage > $scope.page.totalPage) {
      return;
    }
    if (currentPage) {
      $scope.page.currentPage = currentPage;
    }
    axios.post("platform://auth/A02009", $scope.page).then(function (res) {
      $scope.$apply(function () {
        var userPage = res.data;
        $scope.page.totalPage = Boolean(userPage.totalPage) ? userPage.totalPage : 1;
        $scope.page.pageSize = userPage.pageSize;
        $scope.page.currentPage = Boolean(userPage.currentPage) ? userPage.currentPage : 1;
        $scope.userRecord = userPage.record;
      });
    });
  }

  $scope.loadingUser();

  $scope.selectOrgHandler = function (branch) {
    if (branch.orgCode === "0") {
      $scope.page.orgCode = undefined;
    } else {
      $scope.page.orgCode = branch.orgCode;
    }
    $scope.loadingUser(1);
  }

  $scope.save = function () {
    $scope.$emit('select-user', $scope.$selectUser);
    $scope.close();
  };

  // Close button handler
  $scope.close = function () {
    $scope.$hide();
  };
}];
