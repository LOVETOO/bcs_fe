/**
 * 销售回款单-列表页
 * date:2018-12-21
 */
define(
    ['module', 'controllerApi', 'base_obj_list', 'swalApi', 'requestApi'],
    function (module, controllerApi, base_obj_list, swalApi, requestApi) {
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
                        },
                        {
                            field: 'ordinal_no',
                            headerName: '销售回款单编码',
                            editable: false
                        },
                        {
                            field: 'stat',
                            headerName: '单据状态',
                            editable: false,
                            hcDictCode: 'stat'
                        },
                        {
                            field: 'amount_debit',
                            headerName: '回款金额',
                            editable: false,
                            type: '金额'
                        },
                        {
                            headerName: '客户',
                            children: [
                                {
                                    field: 'customer_code',
                                    headerName: '客户编码',
                                    editable: false
                                },
                                {
                                    field: 'customer_name',
                                    headerName: '客户名称',
                                    editable: false
                                }
                            ]
                        },
                        {
                            field: 'date_fund',
                            headerName: '记账日期',
                            editable: false,
                            type: '日期'
                        },
                        {
                            field: 'return_type',
                            headerName: '回款类型',
                            editable: false,
                            hcDictCode: "fund_business_return_type"
                        },
                        {
                            field: 'crm_entid',
                            headerName: '品类',
                            editable: false,
                            hcDictCode: "crm_entid"
                        },
                        {
                            field: 'sale_employee_name',
                            headerName: '业务员',
                            editable: false
                        },
                        {
                            headerName: '部门',
                            children: [
                                {
                                    field: 'dept_code',
                                    headerName: '部门编码',
                                    editable: false
                                },
                                {
                                    field: 'dept_name',
                                    headerName: '部门名称',
                                    editable: false
                                }]
                        },
                        {
                            field: 'balance_type_name',
                            headerName: '结算方式',
                            editable: false
                        },
                        {
                            headerName: '资金账户',
                            children: [
                                {
                                    field: 'fund_account_code',
                                    headerName: '资金账户编码',
                                    editable: false
                                }, {
                                    field: 'fund_account_name',
                                    headerName: '资金账户名称',
                                    editable: false
                                }
                            ]
                        },
                        {
                            field: 'credence_no',
                            headerName: '凭证号',
                            editable: false
                        },
                        {
                            field: 'io_type_name',
                            headerName: '收支类型',
                            editable: false
                        },
                        {
                            field: 'syscreate_type',
                            headerName: '来源单据类型',
                            editable: false,
                            hcDictCode: "SysCreate_Type"
                        },
                        {
                            field: 'creation_date',
                            headerName: '创建时间',
                            editable: false
                        },
                        {
                            field: 'created_by',
                            headerName: '创建人',
                            editable: false
                        },
                        {
                            field: 'note',
                            headerName: '备注',
                            editable: false
                        },
                        {
                            field: 'last_updated_by',
                            headerName: '更新人',
                            editable: false
                        },
                        {
                            field: 'last_update_date',
                            headerName: '更新时间',
                            editable: false
                        }
                    ],
                    hcObjType: $stateParams.objtypeid,
                    hcBeforeRequest: function (searchObj) {
                        searchObj.searchflag = 6;
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