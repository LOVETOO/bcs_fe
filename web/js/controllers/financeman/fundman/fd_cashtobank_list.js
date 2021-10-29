/**
 * 银行存取款
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
                    columnDefs : [
                        {
                            type: '序号',
                            headerCheckboxSelection: true,
                            headerCheckboxSelectionFilteredOnly: true,
                            checkboxSelection: true,
                            width:100
                        }, {
                            field: 'ordinal_no',
                            headerName: '流水号'
                        },{
                            field: 'stat',
                            headerName: '状态',
                            hcDictCode: '*'
                        }
                        , {
                            field: 'date_fund',
                            headerName: '记账日期',
                            type:"日期"
                        }
                        , {
                            field: 'year_month',
                            headerName: '记账月份'
                        }
                        , {
                            field: 'date_busine',
                            headerName: '业务日期',
                            type:"日期"
                        }
                        ,
                        {
                            field: 'fund_account_code_from',
                            headerName: '支出资金账号编码'
                        }
                        , {
                            field: 'fund_account_name_from',
                            headerName: '支出资金账号名称'
                        } ,
                        {
                            field: 'fund_account_code_to',
                            headerName: '收入资金账号编码'
                        }
                        , {
                            field: 'fund_account_name_to',
                            headerName: '收入资金账号名称'
                        }
                        ,
                        {
                            field: 'amount',
                            headerName: '金额',
                            type:'金额'
                        },{
                            field: 'balance_type_code',
                            headerName: '结算方式编码'
                        }
                        , {
                            field: 'balance_type_name',
                            headerName: '结算方式名称'
                        }
                        , {
                            field: 'source_bill_type',
                            headerName: '来源单据类型',
                            hcDictCode:"source_bill_type"
                        }
                        , {
                            field: 'bill_no',
                            headerName: '票据号'
                        },
                        {
                            field: 'employee_code',
                            headerName: '经办人编码'
                        }
                        , {
                            field: 'employee_name',
                            headerName: '经办人名称'
                        },
                        {
                            field: 'billno_out',
                            headerName: '支出流水号'
                        },
                        {
                            field: 'billno_in',
                            headerName: '收入流水号'
                        }
                        , {
                            field: 'created_by',
                            headerName: '创建人'
                        }
                        , {
                            field: 'creation_date',
                            headerName: '创建时间'
                        }, {
                            field: 'last_updated_by',
                            headerName: '修改人'
                        }
                        , {
                            field: 'last_update_date',
                            headerName: '修改时间'
                        }
                    ]
                };

                controllerApi.run({
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
