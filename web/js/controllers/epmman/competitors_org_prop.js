define(
    ['module', 'controllerApi', 'base_obj_prop'],
    function (module, controllerApi, base_obj_prop) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {


                /**
                 * 继承控制器
                 **/
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                /**
                 * 隐藏保存并新增按钮
                 **/
                $scope.footerRightButtons.saveThenAdd.hide=true;


            }
        ];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
)