/**
 * 标书制作 列表
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
                            field: 'project_code',
                            headerName: '项目编码'
                        }, {
                            field: 'project_name',
                            headerName: '项目名称'
                        }, {
                            field: 'making_type',
                            headerName: '标书类型'
                        }, {
                            field: 'bid_open_time',
                            headerName: '开标时间',
                            type: "日期"
                        }, {
                            field: 'producer',
                            headerName: '标书制作人'
                        }, {
                            field: 'project_status',
                            headerName: '项目阶段'
                        }, {
                            field: 'contract_amount',
                            headerName: '合同金额(元)',
                            type: '金额'
                        }, {
                            field: 'create_by_name',
                            headerName: '创建人'
                        }, {
                            field: 'create_date',
                            headerName: '创建时间'
                        }, {
                            field: 'last_update_by_name',
                            headerName: '修改人'
                        }, {
                            field: 'last_update_date',
                            headerName: '修改时间'
                        }
                    ]
                };

                //继承控制器
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