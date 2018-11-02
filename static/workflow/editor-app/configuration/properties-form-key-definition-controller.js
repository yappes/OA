/**
 * Form Key Definition
 */
var KisBpmFormKeyDefinitionCtrl = ['$scope', '$modal', '$timeout', function ($scope, $modal, $timeout) {
  console.log("KisBpmFormKeyDefinitionCtrl", $scope)

  $scope.viewName = (viewMapings[$scope.property.value] || {}).viewName;

  // Config for the modal window
  var opts = {
    template: 'editor-app/configuration/properties/form-key-definition-popup.html?version=' + Date.now(),
    scope: $scope
  };
  // Open the dialog
  $modal(opts);
}];

var viewMapings = {};

var KisBpmFormKeyDefinitionReadCtrl = ['$scope', '$timeout', function ($scope, $timeout) {
  $scope.viewName = $scope.property.value;
  if (viewMapings[$scope.property.value]) {
    $scope.viewName = (viewMapings[$scope.property.value] || {}).viewName;
  } else {
    // 根据视图Id 查询视图信息
    axios.post(ACTIVITI.CONFIG.platform + 'custom/C11002', {
      viewId: $scope.property.value,
      isOwnItem: false
    }).then(function (res) {
      var view = res.data
      viewMapings[$scope.property.value] = view;
      $scope.$apply(function () {
        $scope.viewName = viewMapings[$scope.property.value].viewName;
      });
    })
  }
}];

/**
 * Form Key Definition Popup
 */
var KisBpmFormKeyDefinitionPopupCtrl = ['$scope', '$q', '$element', '$timeout', function ($scope, $q, $element, $timeout) {
  $scope.modules = [];
  $scope.moduleMaps = {};
  $scope.views = [];

  $timeout(function(){
    jQuery(".chosen-select", $element).select2({
      width: "250px",
      language: "zh-CN"
    }).change(function (event) {
      console.log("触发event", $scope.moduleId)
      $scope.moduleId = Number(jQuery(event.target).val());
      console.log("触发event", $scope.moduleId)
      loadingViews($scope.moduleId);
    });
  })
  
  // 查询模块集合
  axios.post('platform://custom/C10003', {
    isDelete: 0,
    isProcess: 1
  }).then(function (res) {
    // 模块Id
    for (var index = 0; index < res.data.length; index++) {
      var data = res.data[index];
      $scope.modules.push({
        lable: data.moduleName,
        value: data.id
      });
      $scope.moduleMaps[data.id] = data.moduleName;
    }
    $scope.moduleId = (viewMapings[$scope.property.value] || {}).moduleId || $scope.modules[0].value;
    $timeout(function () {
      jQuery(".chosen-select", $element).val($scope.moduleId);
    }, 1000);
    loadingViews($scope.moduleId);
  });



  /**
   * 加载视图集合
   */
  var loadingViews = function (moduleId) {
    $scope.views = [];
    axios.post('platform://custom/C11008', '{"moduleId": ' + moduleId + ', "viewFlag":0, "viewTypes": [2, 3, 4, 5, 6, 7, 8]}').then(function (res) {
      $scope.$apply(function () {
        $scope.views = res.data;
      });
      for (var index in $scope.views) {
        var view = $scope.views[index];
        viewMapings[view.id] = view;
      }
    });
  }

  $scope.selectView = function (view) {
    $scope.property.value = view.id;
  }

  // Click handler for save button
  $scope.save = function () {
    $scope.updatePropertyInModel($scope.property);
    $scope.close();
  };

  $scope.cancel = function () {
    $scope.$hide();
    $scope.property.mode = 'read';
  };

  // Close button handler
  $scope.close = function () {
    $scope.$hide();
    $scope.property.mode = 'read';
  };
}];
