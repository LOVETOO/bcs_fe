/**
 * 行政区域-属性页
 * @since 2018-10-15
 */
define(
    ['module','controllerApi','base_obj_prop'],
    function (module,controllerApi,base_obj_prop) {
        'use strict'

        var controller = [
            //声明依赖注入
            '$scope',
            function ($scope) {

                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                })
            }
        ];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            controller: controller,
            module: module
        })

    }
);



// function scparea_pro($scope, BaseService, BasemanService, $stateParams) {
//
//     $scope.levs = [
//         {id: 1, name: "洲"},
//         {id: 2, name: "国家"},
//         {id: 3, name: "区域"},
//         {id: 4, name: "省/直辖市"},
//         {id: 5, name: "地级市/地区"},
//         {id: 6, name: "县级市/县/区"},
//         {id: 7, name: "乡镇/街道"}
//     ];
//
//
//     /**
//      * 保存数据
//      */
//     $scope.saveData = function () {
//
//         var action = param.action;
//         $scope.data.currItem.pareacode = param.pareacode;
//         if (action == "update") {
//             //调用后台保存方法
//             BasemanService.RequestPost("scparea", action, JSON.stringify($scope.data.currItem))
//                 .then(function () {
//                     BasemanService.swalSuccess("成功", "保存成功！"  );
//                     $scope.closeWindow();
//                     return;
//                 });
//         }
//         if (action == "insert") {
//             $scope.data.currItem.superid = param.pid;
//             BasemanService.RequestPost("scparea", action, JSON.stringify($scope.data.currItem))
//                 .then(function (data) {
//                     BasemanService.swalSuccess("成功", "保存成功！"  );
//                     $scope.closeWindow();
//                     return;
//                 });
//
//         }
//     }
//
//
//     /**
//      * 初始化
//      * @param args
//      */
//     $scope.init = function () {
//         if ($scope.data.currItem.areaid > 0) {
//             //调用后台select方法查询详情
//             BasemanService.RequestPost("scparea", "select", JSON.stringify($scope.data.currItem))
//                 .then(function (data) {
//                     $scope.data.currItem = data;
//                 });
//         } else {
//             $scope.data.currItem = {
//                 "areaid": 0
//             };
//         }
//     };
//
//
// }