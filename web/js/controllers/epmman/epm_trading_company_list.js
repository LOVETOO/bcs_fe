/**
 * 交易公司
 * 2019/8/22
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';
        var CustomerOrgCorproateList = [
            '$scope',
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'trading_company_code',
                        headerName: '交易公司编码'
                    },{
                        field: 'trading_company_name',
                        headerName: '交易公司名称'
                    }, {
                        field: 'manager',
                        headerName: '责任人'
                    }, {
                        field: 'manager_tel',
                        headerName: '联系电话'
                    }, {
                        field: 'tax_type',
                        headerName: '纳税人类型',
                        hcDictCode:'tax_type'
                    }, {
                        field: 'tax_no',
                        headerName: '纳税人识别号'
                    }, {
                        field: 'invoice_type',
                        headerName: '发票类型',
                        hcDictCode : 'epm.invoice_type'
                    }, {
                        field: 'tax_rate',
                        headerName: '默认税率'
                    }, {
                        field: 'site',
                        headerName: '地址'
                    }, {
                        field: 'address',
                        headerName: '详细地址'
                    }, {
                        field: 'disable',
                        headerName: '不可用',
                        type : '是否'
                    }],
                    hcAfterRequest:function(response){//请求完表格事件后触发
                        response.epm_trading_companys.forEach(function (value) {
                            value.site = value.province_name + "-"
                                + value.city_name + "-"
                                + value.area_name
                        })
                    }
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
            controller: CustomerOrgCorproateList
        });
    });

