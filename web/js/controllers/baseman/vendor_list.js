/**供应商档案 - 列表页
 * 2018-12-4
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
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'vendor_code',
                        headerName: '供应商编码'
                    }, {
                        field: 'vendor_name',
                        headerName: '供应商名称'
                    },/* {
                        field: 'crm_entid',
                        headerName: '品类',
                        hcDictCode: "crm_entid"
                    }, */{
                        field: 'contact',
                        headerName: '联系人'
                    }, {
                        field: 'tele',
                        headerName: '联系电话'
                    }, {
                        field: 'usable',
                        headerName: '有效',
                        type: '是否'
                    }, {
                        field: 'address',
                        headerName: '供应商地址'
                    }, {
                        field: 'currency_name',
                        headerName: '结算货币'
                    }, {
                        field: 'vendortaxrate_percent',
                        headerName: '默认税率',
                        type: "百分比"
                    }, {
                        field: 'bank',
                        headerName: '开户银行'
                    }, {
                        field: 'bank_accno',
                        headerName: '开户行账号'
                    }, {
                        field: 'vendortaxno',
                        headerName: '税务登记号'
                    }, {
                        field: 'account_days',
                        headerName: '账期天数',
                        hcDictCode: 'ap_period'
                    }, {
                        field: 'name_noinv',
                        headerName: '无票应付科目'
                    }, {
                        field: 'name_ap',
                        headerName: '应付票据科目'
                    }, {
                        field: 'name_inv',
                        headerName: '有票应付科目'
                    }, {
                        field: 'ap_invoice_type',
                        headerName: '发票产生方式',
                        hcDictCode: "ap_invoice_type"
                    }, {
                        field: 'price_from',
                        headerName: '价格来源',
                        hcDictCode:'price_from'
                    }, {
                        field: 'pay_type',
                        headerName: '付款说明'
                    }, {
                        field: 'note',
                        headerName: '备注'
                    }
                        /* {
                         field: 'temp',
                         headerName: 'temp'
                         },*/],

                    hcPostData : {
                        vendor_type : 1
                    }
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