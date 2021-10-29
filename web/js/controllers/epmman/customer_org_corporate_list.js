/**
 * 法人客户
 * 2019/7/5
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
                        field: 'valid',
                        headerName: '状态',
                        hcDictCode:'valid',
                        cellStyle:function (args) {
                            return {
                                'color':args.data.valid == 2 ? "green" : args.data.valid == 1 ? "gray" : "red"
                            }
                        }
                    },{
                        field: 'customer_code',
                        headerName: '客户编码'
                    }, {
                        field: 'short_name',
                        headerName: '客户简称'
                    }, {
                        field: 'customer_name',
                        headerName: '客户名称'
                    }, {
                        field: 'customer_class',
                        headerName: '客户分类',
                        hcDictCode:'epm.customer_class'
                    }, {
                        field: 'crm_cust_code',
                        headerName: '旧编码'
                    }, {
                        field: 'manager',
                        headerName: '责任人'
                    }, {
                        field: 'contact',
                        headerName: '联系电话'
                    }, {
                        field: 'fax',
                        headerName: '传真'
                    }, {
                        field: 'email',
                        headerName: '电子邮箱'
                    }, {
                        field: 'area_full_name',
                        headerName: '省-市-区'
                    }, {
                        field: 'address',
                        headerName: '详细地址'
                    }, {
                        field: 'invoice_type',
                        headerName: '发票类型',
                        hcDictCode:'epm.invoice_type'
                    }, {
                        field: 'currency_name',
                        headerName: '结算货币'
                    }, {
                        field: 'tax_rate',
                        headerName: '默认税率'
                    }, {
                        field: 'attribute1',
                        headerName: '现金流量表项',
                        hcDictCode:'epm.cash_flow_item'
                    }, {
                        field: 'tax_type',
                        headerName: '纳税人类型',
                        hcDictCode:'tax_type'
                    }, {
                        field: 'tax_no',
                        headerName: '纳税人识别号'
                    }, {
                        field: 'bank',
                        headerName: '开户银行'
                    }, {
                        field: 'bank_accno',
                        headerName: '银行账号'
                    }, {
                        field: 'is_project_entity',
                        headerName: '是否工程法人',
                        type : '是否'
                    }, {
                        field: 'is_base',
                        headerName: '是否基地',
                        type : '是否'
                    }, {
                        field: 'created_by_name',
                        headerName: '创建人'
                    }, {
                        field: 'creation_date',
                        headerName: '创建时间',
                        type:'时间'
                    }, {
                        field: 'last_updated_by_name',
                        headerName: '修改人'
                    }, {
                        field: 'last_update_date',
                        headerName: '修改时间',
                        type:'时间'
                    }],
                    hcPostData: {
                        search_flag : 123//查询法人客户
                    },
                    hcAfterRequest:function(response){//请求完表格事件后触发
                        response.customer_orgs.forEach(function (value) {
                            value.area_full_name = value.province_name + "-"
                                + value.city_name + "-"
                                + value.district_name
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

