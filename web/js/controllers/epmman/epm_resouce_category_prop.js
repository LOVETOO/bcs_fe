define(
    ['module', 'controllerApi', 'base_obj_prop'],
    function (module, controllerApi, base_obj_prop) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$stateParams',
            //控制器函数
            function ($scope, $stateParams) {

                $scope.data = {
                    currItem: {},
                };
 
                /**
                 * 继承控制器
                 **/
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    $scope.data.currItem.resouce_category_pid = $stateParams.pid;
                    $scope.data.currItem.resouce_category_code = $stateParams.code;
                    $scope.data.currItem.resouce_type = $stateParams.type;
                    $scope.data.currItem.idpath = $stateParams.idpath;
                };
            }
        ]
        
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });


    }
)