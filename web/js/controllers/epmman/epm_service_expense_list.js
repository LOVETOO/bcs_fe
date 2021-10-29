/**
 * 工程服务费核算
 * 2019/08/05
 * weihualin
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
                        },
                        {
                            field: 'stat',
                            headerName: '单据状态',
                            hcDictCode: 'stat'
                        },
                        {
                            field: 'service_expense_no',
                            headerName: '服务费编号'
                        },
                        // {
                        //     field: 'billing_unit_name',
                        //     headerName: '开票单位'
                        // },
                        // {
                        //     field: 'project_code',
                        //     headerName: '工程项目编码'
                        // },
                        // {
                        //     field: 'project_name',
                        //     headerName: '工程项目名称'
                        // },
                        {
                            field: 'customer_code',
                            headerName: '客户编码'
                        },
                        {
                            field: 'customer_name',
                            headerName: '客户名称'
                        },
                        {
                            field: 'billing_unit_code',
                            headerName: '开票单位编码'
                        },
                        {
                            field: 'billing_unit_name',
                            headerName: '开票单位名称'
                        },
                        {
                            field: 'total_auditt_amt',
                            headerName: '合同发货总额',
                            type:'金额'
                        },
                        {
                            field: 'total_check_amt',
                            headerName: '发货结算总额',
                            type:'金额'
                        },
                        {
                            field: 'total_cash_amt',
                            headerName: '已兑现总额',
                            type:'金额'
                        },
                        {
                            field: 'total_uncash_amt',
                            headerName: '未兑现总额'
                        },
                        {
                            field: 'service_amt',
                            headerName: '服务费金额',
							type:'金额'
                        },
                        {
                            field: 'remark',
                            headerName: '备注'
                        },
                        {
                            field: 'creator_name',
                            headerName: '创建人'
                        },
                        {
                            field: 'createtime',
                            headerName: '创建时间'
                        },
                        {
                            field: 'updator_name',
                            headerName: '修改人'
                        },
                        {
                            field: 'updatetime',
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