/**
 * 电子仓
 *  2018-11-12
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi','swalApi'],
    function (module, controllerApi, base_obj_prop,requestApi,swalApi) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.data = {};
                $scope.data.currItem = {};

                //继承主控制器    
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //隐藏标签页
                $scope.tabs.wf.hide = true;
                $scope.tabs.attach.hide = true;
                //修改标签页标题
                $scope.tabs.base.title = '常规';

            }
        ]
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);