
/**
 * 价格类型-属性页
 * 2018-10-11 .js
 */
define(
    ['module', 'controllerApi', 'base_obj_prop'],
    function (module, controllerApi ,base_obj_prop) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {

                $scope.data = {};
                $scope.data.currItem = {};

                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                //隐藏标签页
                $scope.tabs.wf.hide = true;
                $scope.tabs.attach.hide = true;
                //修改标签页标题
                $scope.tabs.base.title = '基本信息';

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

