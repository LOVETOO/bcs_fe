/**
 * 家装到款引入
 * 2020-3-27
 * wujiyou
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
                    columnDefs: [{
                        type: '序号'
                    }
                    // , {
                    //     field: 'payment_import_code',
                    //     headerName: '到款单号'
                    // }
                    ,{
                        field: 'serial_number',
                        headerName: '银行流水号'
                    }, {
                        field: 'receive_date',
                        headerName: '收款日期',
                        type:'日期'
                    },  {
                        field: 'receive_amt',
                        headerName: '收款金额',
                        type:'金额'
                    }, {
                        field: 'currency_name',
                        headerName: '币别'
                    }, {
                        field: 'exchange_rate',
                        headerName: '汇率',
                        cellStyle: {
                            'text-align': 'center'
                        }
                    }, {
                        field: 'customer_code',
                        headerName: '客户编码'
                    }, {
                        field: 'customer_name',
                        headerName: '客户名称'
                    }, {
                        field: 'crm_cust_code',
                        headerName: '客户旧编码'
                    }, {
                        field: 'receive_unit_name',
                        headerName: '收款公司'
                    }, {
                        field: 'receive_bank',
                        headerName: '收款银行'
                    }, {
                        field: 'receive_account',
                        headerName: '收款账号'
                    }, {
                        field: 'remit_unit_code',
                        headerName: '汇款单位编码'
                    }, {
                        field: 'remit_unit_name',
                        headerName: '汇款单位名称'
                    }, {
                        field: 'remit_unit_old_code',
                        headerName: '汇款单位旧编码'
                    }, {
                        field: 'payment_remark',
                        headerName: '打款说明'
                    }, {
                        field: 'stat',
                        headerName: '状态',
                        hcDictCode:'stat'
                    }, {
                        field: 'confirmed_amt',
                        headerName: '已认款金额',
                        type:'金额'
                    }, {
                        field: 'creator_name',
                        headerName: '创建人'
                    }, {
                        field: 'createtime',
                        headerName: '创建时间'
                    }],
                    hcPostData : {
                        is_home : 2 //家装
                    }
                };
                //继承列表页基础控制器
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                /** 隐藏按钮 */
                $scope.toolButtons.delete.hide = true;
                $scope.toolButtons.add.hide = true;

            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    });

