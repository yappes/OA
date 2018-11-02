/**
 * 自定义任务
 */
var KisBpmTaskDispatchCtrl = ['$scope', '$modal', '$timeout', function ($scope, $modal, $timeout) {

  // Config for the modal window
  var opts = {
    template: 'editor-app/configuration/properties/task-dispatch-popup.html?version=' + Date.now(),
    scope: $scope
  };
  // Open the dialog
  $modal(opts);

}];



var KisBpmTaskDispatchPopupCtrl = ['$scope', '$timeout', '$element', function ($scope, $timeout, $element) {
  var taskDispatchs = $scope.taskDispatchs = [];
  if ($scope.property.value && $scope.property.value.length > 0) {
    angular.forEach($scope.property.value, function (val) {
      taskDispatchs.push(angular.copy(val));
    });
  }

  $scope.initEventTypeSelect = function (taskDispatch) {
    $timeout(function () {
      var eventTypeEl = jQuery('.eventType-' + taskDispatch.$$hashKey, $element);
      eventTypeEl.select2({
        width: "100%",
        language: "zh-CN",
        placeholder: '请选择事件类型',
        minimumResultsForSearch: 10,
      });
      eventTypeEl.val(taskDispatch.eventType).trigger('change');
      eventTypeEl.change(function (event) {
        $timeout(function () {
          $scope.$apply(function () {
            taskDispatch.eventType = jQuery(event.target).val();
          });
        })
      })
    });
  }

  $scope.initTaskDispatchSelect = function (taskDispatch) {
    $timeout(function () {
      var taskEl = jQuery('.taskSelect-' + taskDispatch.$$hashKey, $element);
      // 任务分页
      taskEl.select2({
        width: "100%",
        language: "zh-CN",
        placeholder: '请选择执行任务',
        minimumResultsForSearch: 10,
        ajax: {
          delay: 250,
          url: 'platform://qrtz/Q01002',
          data: function (params) {
            var query = {
              "name": params.term || undefined,
              "status": "ENABLE",
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
                id: record.id,
                text: record.name
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
      if (taskDispatch.taskId) {
        axios.post("platform://qrtz/Q01005", {
          taskId: taskDispatch.taskId
        }).then(function (res) {
          taskEl.append(new Option(res.data.name, res.data.id, false, true));
        });
      }
      taskEl.change(function (event) {
        $timeout(function () {
          var value = jQuery(event.target).val();
          if (!Boolean(value)) return;
          $scope.$apply(function () {
            taskDispatch.taskId = Number(value);
          });
        })
      })
    })
  }

  $scope.addTaskDispatchValue = function () {
    taskDispatchs.push({
      taskId: undefined,
      eventType: 'COMPLETE',
      comments: undefined
    })
  }

  $scope.removeTaskDispatchValue = function (taskDispatch) {
    var index = taskDispatchs.indexOf(taskDispatch);
    if (index >= 0) {
      taskDispatchs.splice(index, 1);
    }
  }


  $scope.save = function () {
    $scope.property.value = taskDispatchs;
    $scope.updatePropertyInModel($scope.property);
    $scope.close();
  };

  // Close button handler
  $scope.close = function () {
    $scope.$hide();
  };
}];
