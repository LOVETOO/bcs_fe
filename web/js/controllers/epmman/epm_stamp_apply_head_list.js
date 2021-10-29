/**
 * create by liujianbing 2019/05/24
 * 用章申请功能
 **/
define(
    ['module','controllerApi','base_obj_list'],
    function (module,controllerApi,base_obj_list) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {

                $scope.data = {
                    currItem: {}
                };

                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'stat',
                            headerName: '流程状态',
                            hcDictCode: 'stat'
                        }, {
                            field: 'apply_bill_no',
                            headerName: '申请单号'
                        }, {
                            field: 'apply_bill_date',
                            headerName: '申请日期',
                            type: '日期'

                        }, {
                            field: 'apply_person_name',
                            headerName: '申请人'
                        }, {
                            field: 'apply_dept_name',
                            headerName: '申请部门'
                        },
                        // {
                        //     field: 'apply_type',
                        //     headerName: '具体用章项'
                        // },
                        // {
                        //     field: 'carry',
                        //     headerName: '外带',
                        //     type: '是否'
                        // },
                         {
                            field: 'apply_project_name',
                            headerName: '使用项目'
                        },
                        // {
                        //     field: 'apply_partner_name',
                        //     headerName: '使用合伙人'
                        // }, {
                        //     field: 'apply_holder_name',
                        //     headerName: '使用业主'
                        // },
                        {
                            field: 'apply_reason',
                            headerName: '用章事由'
                        }, {
                            field: 'create_by_name',
                            headerName: '创建人'
                        }, {
                            field: 'create_date',
                            headerName: '创建时间'
                        }
                    ]

                }

                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

            }
        ]




        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }

)