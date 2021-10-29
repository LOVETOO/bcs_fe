/**
 * 费用申请-列表页
 * 2018-11-16
 */
define(
    ['module', 'controllerApi', 'base_obj_list', 'openBizObj','swalApi','requestApi'],
    function (module, controllerApi, base_obj_list, openBizObj, swalApi, requestApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope','$stateParams',
            //控制器函数
            function ($scope, $stateParams) {
                $scope.gridOptions = {
                    columnDefs : [
                        {
                            type: '序号'
                        }
                        , {
                            field: 'stat',
                            headerName: '单据状态',
                            hcDictCode: '*'
                        }
                        , {
                            field: 'fee_apply_no',
                            headerName: '申请单号'
                        }
                        // , {
                        //     field: 'bud_type_name',
                        //     headerName: '预算类别'
                        // }
                        , {
                            field: 'chap_name',
                            headerName: '申请人'
                        }
                        , {
                            field: 'org_name',
                            headerName: '申请部门'
                        }
                        , {
                            field: 'year_month',
                            headerName: '年月'
                        }
                        , {
                            field: 'bx_end_date',
                            headerName: '报销截止时间',
                            type: '日期'
                        }
                        , {
                            field: 'total_apply_amt',
                            headerName: '申请总额',
                            type: '金额'
                        }
                        , {
                            field: 'total_allow_amt',
                            headerName: '批准总额',
                            type: '金额'
                        }
                        , {
                            field: 'creator',
                            headerName: '创建人'
                        }
                        , {
                            field: 'create_time',
                            headerName: '创建时间'
                        }
                        // , {
                        //     field: 'fee_loan_no',
                        //     headerName: '借款单号'
                        // }
                        , {
                            field: 'balance_type_name',
                            headerName: '结算方式'
                        }
                        , {
                            field: 'estimated_pay_time',
                            headerName: '预计还款时间',
                            type: '日期'
                        }
                        // , {
                        //     field: 'loan_total_apply_amt',
                        //     headerName: '借款申请总额',
                        //     type: '金额'
                        // }
                        // , {
                        //     field: 'loan_total_allow_amt',
                        //     headerName: '借款批准总额',
                        //     type: '金额'
                        // }
                        // , {
                        //     field: 'overdue_reason',
                        //     headerName: '逾期原因'
                        // }
                    ],
                    hcObjType: 1280,
                    hcBeforeRequest: function (searchObj) {
                        if(!$scope.data.isApply){
                            searchObj.flag = 3;
                        }
                    }
                };

                $scope.data = $scope.data || {};
                $scope.data.isApply = $stateParams.isApply === 'true' ? true : false;

                if(!$scope.data.isApply) {
                    $scope.filterSetting = null;
                }

                controllerApi.run({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                //按钮
                $scope.toolButtons.add.hide = !$scope.data.isApply;
                $scope.toolButtons.delete.hide = !$scope.data.isApply;

                if(!$scope.data.isApply){
                    $scope.toolButtons.copy.hide = true;
                }

                /**
                 * 向属性页传菜单url参数
                 * @returns {{isApply: *|string}}
                 */
                $scope.getPropRouterParams = function () {
                    return {
                        isApply: $stateParams.isApply
                    };
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
