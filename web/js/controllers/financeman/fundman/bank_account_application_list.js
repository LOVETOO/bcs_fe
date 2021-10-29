/**
 * 银行开户申请 bank_account_application_list
 * Created by zhl on 2019/2/11.
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$stateParams',
            //控制器函数
            function ($scope, $stateParams) {
                $scope.data = {};
                $scope.data.currItem = {};

                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'apply_bill_no',
                            headerName: '申请单号'
                        }, {
                            field: 'bank_acct_name',
                            headerName: '账户名称'
                        }, {
                            field: 'bank_acct_no',
                            headerName: '银行账号'
                        }, {
                            field: 'city_name',
                            headerName: '所在省市'
                        }, {
                            field: 'bank_name',
                            headerName: '开户行'
                        }, {
                            field: 'lianhang_no',
                            headerName: '联行号'
                        }, {
                            field: 'bank_type',
                            headerName: '银行类别',
                            hcDictCode:'bank_type'
                        }, {
                            field: 'acct_type',
                            headerName: '账户类别',
                            hcDictCode:'acct_type'
                        }, {
                            field: 'acct_property',
                            headerName: '账户属性',
                            hcDictCode:'acct_property'
                        }, {
                            field: 'acct_nature',
                            headerName: '账户性质',
                            hcDictCode:'acct_nature'
                        }, {
                            field: 'open_acct_company',
                            headerName: '开户单位'
                        }, {
                            field: 'curr_type',
                            headerName: '货币类型',
                            hcDictCode:'currency_name'
                        }, {
                            field: 'is_initial_acct',
                            headerName: '是否初期账户',
                            type:'是否'
                        }, {
                            field: 'is_ec_acct',
                            headerName: '是否为电票专户',
                            type:'是否'
                        }, {
                            field: 'is_sweep_acct',
                            headerName: '是否扫户',
                            type:'是否'
                        }, {
                            field: 'note',
                            headerName: '开户用途'
                        }
                    ],
                    hcObjType: $stateParams.objtypeid
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





