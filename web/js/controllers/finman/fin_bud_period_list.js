/**
 * 费用期间 - 对象列表页
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
                            type: '序号'
                        }
                        , {
                            field: 'period_year',
                            headerName: '年度',
                            pinned: 'left'
                        }
                        , {
                            field: 'period_type',
                            headerName: '预算期间类别',
                            hcDictCode:'Period_Type',
                            pinned: 'left'
                        }
                        , {
                            field: 'description',
                            headerName: '描述',
                            pinned: 'left'
                        }
                       
                    ],
                    hcObjType: 181027
                };

                controllerApi.extend({
                    controller: base_obj_list.controller,
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