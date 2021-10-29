/**
 * 表管理 - 对象列表页
 * @since 2018-12-17
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
                            field: 'package_name',
                            headerName: '包名称'
                        }
                        , {
                            field: 'table_name',
                            headerName: '表名称'
                        }, {
                            field: 'note',
                            headerName: '备注'
                        }
                        , {
                            field: 'is_creatied',
                            headerName: '已创建',
                            type: '是否'
                        }
                        ,
                        {
                            field: 'creator',
                            headerName: '创建人'
                        }
                        , {
                            field: 'create_time',
                            headerName: '创建时间'
                        }
                        // , {
                        //     field: 'updator',
                        //     headerName: '更新人'
                        // }
                        // , {
                        //     field: 'update_time',
                        //     headerName: '更新时间'
                        // }
                    ]
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