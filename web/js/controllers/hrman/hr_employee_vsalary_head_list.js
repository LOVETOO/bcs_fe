/**
 * 变动薪资导入列表
 * Created by sgc
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
                        }, {
                            field: 'bill_no',
                            headerName: '单据号',

                        }, {
                            field: 'year_month',
                            headerName: '生效年月',

                        }, {
                            field: 'salary_group_name',
                            headerName: '薪资组'
                        }, {
                            field: 'remark',
                            headerName: '备注'
                        }, {
                            field: 'created_by',
                            headerName: '创建人'
                        }, {
                            field: 'creation_date',
                            headerName: '创建时间'
                        }, {
                            field: 'last_updated_by',
                            headerName: '修改人'
                        }, {
                            field: 'last_update_date',
                            headerName: '修改时间'
                        }
                    ]
                };
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });
                //导入
                $scope.toolButtons.import.hide = false;
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