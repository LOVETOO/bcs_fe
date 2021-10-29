/**
 * 发票抬头-属性页 invoice_title_prop
 * Created by zhl on 2019/2/15.
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

