/**
 * 费用列表页
 *  2018-10-27
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type:"序号"
                        },
                       {
                            field: 'period_year',
                            headerName: '年度'
                        }
                        , {
                            field: 'period_type',
                            headerName: '预算期间类别',
                            hcDictCode:'period_type'
                        }
                        , {
                            field: 'entname',
                            headerName: '经营单位'
                        }
                        , {
                            field: 'description',
                            headerName: '描述'
                        }
                    ]
                };
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });


                $scope.toolButtons.add.hide = true;
                $scope.toolButtons.delete.hide = true;


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