/**
 * 产品分类-属性页
 * 2018-11-9
 */
define(
    ['module', 'controllerApi', 'base_obj_prop','swalApi', 'numberApi'],
    function (module, controllerApi, base_obj_prop,swalApi, numberApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope','$stateParams',
            //控制器函数
            function ($scope,$stateParams) {
                $scope.data = {};
                $scope.data.currItem = {};

                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                //隐藏标签页
                $scope.tabs.wf.hide = true;
                $scope.tabs.attach.hide = true;

                // 将所需要的参数superid 设置到增加方法所传的数据对象中
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);

                    bizData.item_usable = 2;
                    bizData.item_class_pid = $stateParams.item_class_pid;
                    bizData.item_class_level = numberApi.toNumber($stateParams.item_class_level) +1;

                    //console.log(bizData,"bizData");
                };

                //修改标签页标题
                $scope.tabs.base.title = '产品分类';

                $scope.tabs.other = {
                    title:"其他"
                }
                
            }        
        ];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);

    // $scope.saveData = function () {
    //     if ($scope.data.currItem.item_class_name == "" || $scope.data.currItem.item_class_name == undefined) {
    //         BasemanService.swal("提示", "分类名称不能为空"  );
    //         return;
    //     }
    //     if ($scope.data.currItem.item_class_code == "" || $scope.data.currItem.item_class_code == undefined) {
    //         BasemanService.swal("提示", "分类编码不能为空"  );
    //         return;
    //     }
    //     if ($scope.data.currItem.item_class_level == "" || $scope.data.currItem.item_class_level == undefined) {
    //         BasemanService.swal("提示", "分类等级不能为空"  );
    //         return;
    //     }
    //     var action = param.action;
    //     if ($scope.data.currItem.item_class_id > 0) {
    //         action = "update";
    //     }
    //
    //     if (action == "update") {
    //         //调用后台保存方法
    //         BasemanService.RequestPost("item_class", action, JSON.stringify($scope.data.currItem))
    //             .then(function () {
    //                 BasemanService.swalSuccess("成功", "保存成功！"  );
    //                 $scope.closeWindow();
    //                 return;
    //             });
    //     }
    //     if (action == "insert") {
    //         $scope.data.currItem.item_class_pid = param.pid;
    //         BasemanService.RequestPost("item_class", action, JSON.stringify($scope.data.currItem))
    //             .then(function (data) {
    //                 BasemanService.swalSuccess("成功", "保存成功！"  );
    //                 $scope.closeWindow();
    //                 return;
    //             });
    //
    //     }
    // }
    //
    // /**
    //  * 查询详情
    //  * @param args
    //  */
    // $scope.init = function () {
    //     if ($scope.data.currItem.item_class_id > 0) {
    //         //调用后台select方法查询详情
    //         BasemanService.RequestPost("item_class", "select", JSON.stringify($scope.data.currItem))
    //             .then(function (data) {
    //                 $scope.data.currItem = data;
    //             });
    //     } else {
    //         $scope.data.currItem = {
    //             "item_class_id": 0,
    //             "item_usable":2,
    //             "item_class_level": Number(param.item_class_level)+1
    //         };
    //     }
    //
    // };

