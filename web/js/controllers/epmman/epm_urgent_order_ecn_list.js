/**
 * 提货时间变更
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';
        /**
         * 控制器
         */
        var controller = [
            '$scope',
            function ($scope) {

                $scope.gridOptions = {
                    hcPostData: {
                        search_flag: 2 //查询场景：提货时间变更
                    },
                    columnDefs: [{
                        type: '序号'
                    }, 
                    {
                        field: 'stat',
                        headerName: '单价状态',
                        hcDictCode : 'stat'
                    }, 
                    {
                        field: 'sa_salebillno',
                        headerName: '要货单号'
                    },
                    {
                        field: 'date_approval',
                        headerName: '审批日期',
                        type : '日期'
                    },
                    {
                        field: 'date_invbill',
                        headerName: '订单日期',
                        type : '日期'
                    },
                    {
                        field: 'customer_code',
                        headerName: '客户编码'
                    },
                    {
                        field: 'customer_name',
                        headerName: '客户名称'
                    },
                    {
                        field: 'trading_company_name',
                        headerName: '交易公司'
                    },
                    {
                        field: 'billing_unit_name',
                        headerName: '开票单位'
                    },
                    {
                        field: 'bill_type',
                        headerName: '订单类型',
                        hcDictCode : 'epm.bill_type'
                    },
                    {
                        field: 'order_stat',
                        headerName: '订单状态',
                        hcDictCode : 'epm.require_bill.order_stat'
                    },
                    {
                        field: 'in_date',
                        headerName: '期望到达日期',
                        type : '日期'
                    },
                    {
                        field: 'remark',
                        headerName: '备注'
                    },
                    {
                        field: 'creator',
                        headerName: '创建人'
                    },
                    {
                        field: 'createtime',
                        headerName: '创建时间',
                        type : '时间'
                    },
                    {
                        field: 'updator',
                        headerName: '修改人'
                    },
                    {
                        field: 'updatetime',
                        headerName: '修改时间',
                        type : '时间'
                    }]
                };
                //继承列表页基础控制器
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
    });

