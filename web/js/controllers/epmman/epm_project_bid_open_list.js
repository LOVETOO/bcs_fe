/**
 * 项目现场开标 列表
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
                            field: 'report_time',
                            headerName: '报备时间',
                            type: "时间"
                        }, {
                            field: 'project_source',
                            headerName: '工程类型',
                            hcDictCode:'epm.project_source'
                        }, {
                            field: 'bid_open_time',
                            headerName: '开标时间',
                            type: "日期"
                        }, {
                            field: 'bid_open_method',
                            headerName: '开标方式',
                            hcDictCode: 'epm.bid_open_method'
                        }, {
                            field: 'bid_open_primary',
                            headerName: '开标授权人'
                        }, {
                            field: 'bid_open_attendee',
                            headerName: '开标出场人'
                        }, {
                            field: 'bid_open_address',
                            headerName: '开标地点'
                        }, {
                            field: 'create_by_name',
                            headerName: '创建人'
                        }, {
                            field: 'createtime',
                            headerName: '创建时间'
                        }, {
                            field: 'modify_by_name',
                            headerName: '修改人'
                        }, {
                            field: 'modify_date',
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