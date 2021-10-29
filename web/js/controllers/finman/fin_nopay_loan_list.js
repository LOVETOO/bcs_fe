/**
 * 未还款明细查询
 * 2018-11-20
 */
define(
    ['module', 'controllerApi', 'base_diy_page','requestApi','loopApi', 'openBizObj'],
    function (module, controllerApi, base_diy_page, requestApi,loopApi, openBizObj) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope','$stateParams',
            //控制器函数
            function ($scope, $stateParams) {
                $scope.gridOptions = {
                    onRowDoubleClicked: openLoanProp,
                    columnDefs : [
                        {
                            type: '序号'
                        }
                        , {
                            field: 'fee_loan_no',
                            headerName: '借款单号'
                        }
                        , {
                            field: 'allow_amt',
                            headerName: '批准金额',
                            type: '金额'
                        }
                        , {
                            field: 'finish_payed_amt',
                            headerName: '已还款金额',
                            type: '金额'
                        }
                        , {
                            field: 'nopay_amt',
                            headerName: '未还款金额',
                            type: '金额'
                        }
                        , {
                            field: 'estimated_pay_time',
                            headerName: '预计还款时间',
                            type: '日期'
                        }
                    ],
                    pinnedBottomRowData: [{seq: "合计"}]
                };

                controllerApi.run({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                /**
                 * 查看借款详情
                 */
                function openLoanProp () {
                    var bizData = $scope.gridOptions.hcApi.getFocusedData();

                    return openBizObj({
                        stateName: 'finman.fin_fee_loan_prop',
                        params: {
                            id: bizData.fee_loan_id
                        }
                    }).result
                };  
                $scope.openLoanProp = openLoanProp;

                /**
                 * 初始化
                 */
                $scope.doInit = function () {
                    $scope.hcSuper.doInit()
                    .then($scope.searchNoPayLoan)
                    .then(function (response) {
                        $scope.gridOptions.hcApi.setRowData(response.fin_fee_loan_nopay_lines);

                        //合计行
                        var nopays = response.fin_fee_loan_nopay_lines.slice(0);
                        var sum_allow_amt = 0;
                        var sum_finish_payed_amt = 0;
                        var sum_nopay_amt = 0;
                        loopApi.forLoop(nopays.length, function (i) {
                            sum_allow_amt += parseFloat(nopays[i].allow_amt);
                            sum_finish_payed_amt += parseFloat(nopays[i].finish_payed_amt);
                            sum_nopay_amt += parseFloat(nopays[i].nopay_amt);
                        })

                        $scope.gridOptions.api.setPinnedBottomRowData([
                            {
                                seq: '合计', 
                                allow_amt: sum_allow_amt,
                                finish_payed_amt : sum_finish_payed_amt,
                                nopay_amt: sum_nopay_amt
                            }
                        ]);
                    })
                };

                /**
                 * 查询未还款单明细
                 */
                $scope.searchNoPayLoan = function () {
                    var postData = {
                        searchflag: 1,
                        creator: $stateParams.creator
                    }
                    return requestApi.post('fin_fee_loan_header','search',postData)
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
