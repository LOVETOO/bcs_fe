/**
 * 费用报销-列表页
 * 2018-11-22
 */
define(
    ['module', 'controllerApi', 'base_obj_list', 'openBizObj','swalApi','requestApi'],
    function (module, controllerApi, base_obj_list, openBizObj, swalApi, requestApi) {
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
                            checkboxSelection: true
                        }
                        , {
                            field: 'stat',
                            headerName: '单据状态',
                            hcDictCode: '*'
                        }
                        , {
                            field: 'bx_no',
                            headerName: '报销单号'
                        }
                        // , {
                        //     field: 'bud_type_name',
                        //     headerName: '预算类别'
                        // }
                        , {
                            field: 'chap_name',
                            headerName: '报销人'
                        }
                        , {
                            field: 'org_name',
                            headerName: '报销部门'
                        }
                        , {
                            field: 'balance_type_name',
                            headerName: '结算方式'
                        }
                        , {
                            field: 'year_month',
                            headerName: '年月'
                        }
                        , {
                            field: 'fee_apply_no',
                            headerName: '申请单号'
                        }
                        , {
                            field: 'total_apply_amt',
                            headerName: '报销申请总额',
                            type: '金额'
                        }
                        , {
                            field: 'total_allow_amt',
                            headerName: '报销批准总额',
                            type: '金额'
                        }
                        , {
                            field: 'purpose',
                            headerName: '费用用途'
                        }
                        , {
                            field: 'receiver',
                            headerName: '收款人'
                        }
                        , {
                            field: 'receive_bank',
                            headerName: '收款银行'
                        }
                        , {
                            field: 'receive_accno',
                            headerName: '收款账号'
                        }
                        , {
                            field: 'creator',
                            headerName: '创建人'
                        }
                        , {
                            field: 'create_time',
                            headerName: '创建时间'
                        }
                        , {
                            field: 'credence_number',
                            headerName: '凭证号'
                        }
                    ],
                    hcOpenState: {
                        'fee_apply_no': {
                            name: 'finman.fin_fee_apply_prop',
                            idField: 'fee_apply_id',
                            params: {
                                isApply: true
                            }
                        }
                    }
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
