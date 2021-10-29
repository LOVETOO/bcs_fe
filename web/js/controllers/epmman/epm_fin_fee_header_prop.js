/**
 * 工程费用项目-属性页
 * 2019-6-15
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

                /*-------------------数据定义开始------------------------*/
                $scope.data = {
                    currItem : {}
                };

                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //新增时的默认数据设置
                $scope.newBizData = function (bizData) {
                    //调用基础控制器的newBizData
                    $scope.hcSuper.newBizData(bizData);
                    $scope.data.currItem.fee_kind = 2;//1-费用项目（预算管理） 2-工程费用项目（工程管理）
                };

                /*-------------------数据定义结束------------------------*/
                

                //修改标签页标题
                $scope.tabs.base.title = '工程费用项目';

            }
        ];

        //使用控制器Api注册控制器 2019-6-15
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);