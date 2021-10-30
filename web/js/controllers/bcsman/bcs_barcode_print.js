/**
 * 2021-10-30
 * 条码扫码打印
 */
define(["module", "controllerApi", "base_obj_list"], function (
  module,
  controllerApi,
  base_obj_list
) {
  var controller = [
    "$scope",
    function ($scope) {
      !$scope.searchObj && ($scope.searchObj = {});
      /**搜索模板 */
      $scope.searchprint = {
        action: "search",
        sqlWhere: "outeruse = 2",
        afterOk: function (result) {
          Object.assign($scope.searchObj, {
            temp_name: result.temp_name,
            temp_id: result.temp_id,
            temp_content: result.temp_content,
            print_software: result.print_software,
            temp_width: result.temp_width,
            temp_height: result.temp_height,
          });
          console.log("$scope.searchObj", $scope.searchObj);
        },
      };

      // 回车查询条码
      $scope.handlePressEnter = function (e) {
        console.log("handlePressEnter", e);
      };
    },
  ];

  // 继承列表页基础控制器
  controllerApi.extend({
    controller: base_obj_list.controller,
    scope: $scope,
  });

  // 使用控制器Api注册控制器
  // 需传入require模块和控制器定义
  return controllerApi.controller({
    module: module,
    controller: controller,
  });
});
