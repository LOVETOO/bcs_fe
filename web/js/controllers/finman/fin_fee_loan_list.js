/**
 * 费用借款查询-列表页
 * 2018-11-19
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
                            checkboxSelection: true
                        }
                        , {
                            field: 'stat',
                            headerName: '单据状态',
                            hcDictCode: '*'
                        }
                        , {
                            field: 'fee_loan_no',
                            headerName: '借款单号'
                        }
                        , {
                            field: 'org_code',
                            headerName: '申请部门编码'
                        }
                        , {
                            field: 'org_name',
                            headerName: '申请部门名称'
                        }
                        , {
                            field: 'chap_name',
                            headerName: '申请人'
                        }
                        , {
                            field: 'total_apply_amt',
                            headerName: '借款申请总额',
                            type: '金额'
                        }
                        , {
                            field: 'total_allow_amt',
                            headerName: '借款批准总额',
                            type: '金额'
                        }
                        , {
                            field: 'balance_type_name',
                            headerName: '结算方式'
                        }
                        , {
                            field: 'estimated_pay_time',
                            headerName: '预计还款时间',
                            type: '日期'
                        }
                        , {
                            field: 'fee_apply_no',
                            headerName: '费用申请单号'
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
                            field: 'loan_purpose',
                            headerName: '借款用途'
                        }
                        , {
                            field: 'creator',
                            headerName: '制单人'
                        }
                        , {
                            field: 'create_time',
                            headerName: '制单时间'
                        },{
                            field: 'credence_no',
                            headerName: '凭证号'
                        }
                    ],
                    hcObjType: 181119
                };

                controllerApi.run({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                $scope.toolButtons.add.hide = true;
                $scope.toolButtons.delete.hide = true;

                //增加按钮：导出，打印
                $scope.toolButtons.export = {
                    title: '导出',
                    icon: 'glyphicon glyphicon-log-out',
                    click: function () {
                        $scope.export && $scope.export();
                    }
                };
                $scope.toolButtons.print = {
                    title: '打印',
                    icon: 'fa fa-print',
                    click: function () {
                        $scope.print && $scope.print();
                    }
                };
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
