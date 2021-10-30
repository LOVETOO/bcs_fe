/**
 * 2021-10-30
 * 条码扫码打印
 */
define([
  "module",
  "controllerApi",
  "$q",
  "swalApi",
  "requestApi",
  "base_obj_list",
], function (module, controllerApi, $q, swalApi, requestApi, base_obj_list) {
  var controller = [
    "$scope",
    function ($scope) {
      if ($scope.$state.objConf.error) {
        console.log("🚀 ~ $scope", $scope);
      }

      /**搜索模板 */
      $scope.searchprint = {
        action: "search",
        sqlWhere: "outeruse = 2",
        afterOk: function (result) {
          var searchObj = $scope.searchObj || {};
          Object.assign(searchObj, {
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
      $scope.handlePressEnter = function () {
        console.log("handlePressEnter", $scope.searchObj);
        let searchObj = $scope.searchObj;
        if (!searchObj.barcode) {
          setTimeout(function () {
            swalApi.error("请扫码条码或输入条码");
          }, 300);
          return;
        }

        // 获取详情
        requestApi
          .post({
            classId: "Bcs_Mo_Barcode",
            action: "select",
            data: {
              Short_Barcode: searchObj.barcode,
            },
          })
          .then(function (res) {
            console.log("🚀  59 ~ res", res);
          });

        if (!searchObj.temp_id) {
          setTimeout(function () {
            swalApi.error("请选择模板");
          }, 300);
          return;
        }
      };

      // 继承列表页基础控制器
      controllerApi.extend({
        controller: base_obj_list.controller,
        scope: $scope,
      });
    },
  ];

  // 使用控制器Api注册控制器
  // 需传入require模块和控制器定义
  return controllerApi.controller({
    module: module,
    controller: controller,
  });
});
