/**
 * 调度配置属性页
 */
define(
    ['module', 'controllerApi', 'base_obj_prop'],
    function (module, controllerApi, base_obj_prop) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                /**定义数据 */
                $scope.data = {};
                $scope.data.currItem = {};
                /**定义方法 */
                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //隐藏标签页
                $scope.tabs.base.hide = true;
                $scope.tabs.wf.hide = true;
                $scope.tabs.attach.hide = true;
            }

        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    });