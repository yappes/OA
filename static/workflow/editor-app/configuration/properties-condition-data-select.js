/**
 * 计算字符像素大小
 * @param {*} str 
 */
function calcStringPixelsCount($element, str) {
  // 字符串字符个数
  var stringCharsCount = str.length;

  // 字符串像素个数
  var stringPixelsCount = 0;

  // JS 创建HTML元素：span
  var elementPixelsLengthRuler = document.createElement("span");
  elementPixelsLengthRuler.style.visibility = "hidden"; // 设置span不可见
  elementPixelsLengthRuler.style.display = "inline-block";
  elementPixelsLengthRuler.style.wordBreak = "break-all !important"; // 打断单词

  // 添加span
  $element[0].appendChild(elementPixelsLengthRuler);

  for (var i = 0; i < stringCharsCount; i++) {
    // 判断字符是否为空格，如果是用&nbsp;替代，原因如下：
    // 1）span计算单个空格字符（ ），其像素长度为0
    // 2）空格字符在字符串的开头或者结果，计算时会忽略字符串
    if (str[i] == " ") {
      elementPixelsLengthRuler.innerHTML = "&nbsp;";
    } else {
      elementPixelsLengthRuler.innerHTML = str[i];
    }

    stringPixelsCount += elementPixelsLengthRuler.offsetWidth;
    if (stringPixelsCount > 135) {
      str = str.substr(0, i - 1) + '...';
      break;
    }
  }

  $element[0].removeChild(elementPixelsLengthRuler);
  return str;
}
/**
 * 数据选择
 */
var KisBpmDataSelectPopupCtrl = ['$scope', '$element', function ($scope, $element) {
  var column = $scope.column;
  $scope.$selectData = {};
  $scope.view = {};
  var cacheMaps = {};


  function loadingView() {
    column.foreignKeyView().then(function (view) {
      angular.extend(view.datasource, {
        totalPage: 1
      });
      $scope.$apply(function () {
        $scope.view = view;
      });
      $scope.loadingData(1);
      console.log("view", view);
    });
  }

  if (column['[[relatedData]]']) {
    loadingView();
  } else {
    // 获取字段外键信息
    axios.post("platform://custom/C03003", {
      columnId: column.$id
    }).then(function (res) {
      column[Column.relatedDataKey] = res.data;
      column['[[relatedData]]'] = true;
      loadingView();
    });
  }

  var formatVal = function (row, col) {
    var value = row[col.valKey];
    if (col.type && col.type.format) {
      return col.type.format(value);
    }
    if (value === null || value === "null") {
      return undefined;
    }
    return row[col.showValKey] || row[col.valKey];
  }

  $scope.showTextConfig = function (row, col) {
    var id = Date.now().toString(32);
    var text = formatVal(row, col);
    var textPixels = calcStringPixelsCount($element, text || "");
    cacheMaps[id] = {
      id: id,
      text: textPixels,
      title: text,
      toggle: textPixels !== text ? 'popover' : 'disabled'
    };
    return cacheMaps[id];
  }

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
      $scope.loadingData();
    }, 500);
  });

  $scope.dataRecords = [];

  $scope.selectData = function (data) {
    $scope.$selectData.$active = false;
    $scope.$selectData = data;
    $scope.$selectData.$active = true;
  }


  $scope.loadingData = function (currentPage) {
    if (currentPage < 1 || currentPage > $scope.view.datasource.totalPage) {
      return;
    }
    if (currentPage) {
      $scope.view.datasource.currentPage = currentPage;
    }
    // 请求数据
    axios.post('platform://custom/C12002', $scope.view.datasource).then(function (res) {
      var data = res.data;
      cacheMaps = {};
      $scope.$apply(function () {
        $scope.view.datasource.currentPage = Boolean(data.currentPage) ? data.currentPage : 1;
        $scope.view.datasource.totalPage = Boolean(data.totalPage) ? data.totalPage : 1;
        $scope.view.datasource.pageSize = data.pageSize || 10;
        $scope.dataRecords = data.record || [];
        setTimeout(() => {
          // 初始化提示框
          angular.forEach(jQuery('[data-toggle="popover"]', $element), function (el) {
            var $el = jQuery(el);
            $el.popover({
              trigger: 'hover focus',
              placement: "top",
              container: "#popoverContainer",
              template: `<div class="popover" role="tooltip"><div class="popover-content"></div></div>`,
              content: cacheMaps[$el.attr('id')].title
            });
            $el.on('hidden.bs.popover', function () {
              $el.show();
            });
          });
        }, 200);
      });
    });
  }


  $scope.save = function () {
    $scope.$emit('select-data', $scope.$selectData);
    $scope.close();
  };

  // Close button handler
  $scope.close = function () {
    $scope.$hide();
  };
}];
