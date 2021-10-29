/**
 *  项目到款认领
 *  2019/7/10.
 *  zengjinhua
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
                    }, {
                        field: 'stat',
                        headerName: '单据状态',
                        hcDictCode : 'stat'
                    }, {
                        field: 'payment_allot_code',
                        headerName: '认款单号'
                    }, {
                        field: 'payment_import_code',
                        headerName: '到款单号'
                    }, {
                        field: 'serial_number',
                        headerName: '银行流水号'
                    }, {
                        field: 'receive_date',
                        headerName: '收款日期',
                        type : '日期'
                    }, {
                        field: 'receive_amt',
                        headerName: '收款金额',
                        type : '金额'
                    }, {
                        field: 'allot_amt',
                        headerName: '已认款金额',
                        type : '金额'
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
                        field: 'remit_account',
                        headerName: '汇款账号'
                    }, {
                        field: 'division_name',
                        headerName: '事业部'
                    }, {
                        field: 'payment_remark',
                        headerName: '打款说明'
                    }, {
                        field: 'payment_allot_stat',
                        headerName: '状态',
                        hcDictCode: 'epm.payment_allot_stat'
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

