/**
 * 应付账款余额初始化 ar_balance_init
 * Created by zhl on 2019/3/25.
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'directive/hcImportConsole'],
    function (module, controllerApi, base_diy_page) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.data = {};
                $scope.data.currItem = {};

                //配置导入请求
                $scope.importSettingInfo = {
                    classId : 'fd_fund_business',
                    action : 'import_ar'
                };

                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }
                    ]
                };

                //继承基础控制器
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

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



