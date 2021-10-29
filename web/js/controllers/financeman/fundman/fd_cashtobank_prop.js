/**
 * 银行存取款
 * 2018-11-16
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'openBizObj', 'swalApi', '$q', 'numberApi', 'dateApi', 'loopApi'],
    function (module, controllerApi, base_obj_prop, requestApi, openBizObj, swalApi, $q, numberApi, dateApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数
            function ($scope, $modal) {

                /*-------------------数据定义开始------------------------*/
                function getCurrItem() {
                    return $scope.data.currItem;
                }

                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /*-------------------通用查询开始------------------------*/
                /**
                 * 资金账户
                 */
                $scope.chooseAccount = function (args) {
                    $modal.openCommonSearch({
                            classId: 'fd_fund_account',
                            postdata: {},
                        })
                        .result//响应数据
                        .then(function (result) {
                            if (args == 1) {
                                $scope.data.currItem.fd_fund_account_id_from = result.fd_fund_account_id;
                                $scope.data.currItem.fund_account_code_from = result.fund_account_code;
                                $scope.data.currItem.fund_account_name_from = result.fund_account_name;
                            } else {
                                $scope.data.currItem.fd_fund_account_id_to = result.fd_fund_account_id;
                                $scope.data.currItem.fund_account_code_to = result.fund_account_code;
                                $scope.data.currItem.fund_account_name_to = result.fund_account_name;
                            }
                        }).then(function () {
                        if (args == 1)
                            getCurBalance();
                    });
                };

                /**
                 * 结算方式
                 */
                $scope.chooseBalanceType = function () {
                    $modal.openCommonSearch({
                            classId:'base_balance_type'
                        })
                        .result//响应数据
                        .then(function(result){
                            $scope.data.currItem.base_balance_type_id = result.base_balance_type_id;
                            $scope.data.currItem.balance_type_code = result.balance_type_code;
                            $scope.data.currItem.balance_type_name = result.balance_type_name;
                        });
                };

                /**
                 * 收支类型
                 */
                $scope.chooseIoType = function () {
                    $modal.openCommonSearch({
                            classId:'fd_io_type'
                        })
                        .result//响应数据
                        .then(function(result){
                            $scope.data.currItem.fd_io_type_id = result.fd_io_type_id;
                            $scope.data.currItem.io_type_code = result.io_type_code;
                            $scope.data.currItem.io_type_name = result.io_type_name;
                        });
                };

                /**
                 * 经办人
                 */
                $scope.chooseEmployee = function () {
                    $modal.openCommonSearch({
                            classId:'erpemployee'
                        })
                        .result//响应数据
                        .then(function(result){
                            $scope.data.currItem.employee_id = result.employee_id;
                            $scope.data.currItem.employee_code = result.employee_code;
                            $scope.data.currItem.employee_name = result.employee_name;
                        });
                };

                function getCurBalance() {
                    var postData = {
                        classId: "fd_cur_fund_balance",
                        action: 'getcurbalance',
                        data: {fd_fund_account_id: getCurrItem().fd_fund_account_id_from}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            getCurrItem().curr_amt = data.amount_blnc;
                        });
                }

                /*-------------------通用查询结束---------------------*/

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData);
                    bizData.stat = 1;
                    bizData.source_bill_type = 0;
                    bizData.date_fund = dateApi.today();
                    bizData.date_busine = dateApi.today();
                    bizData.year_month = bizData.date_fund.substr(0, 7);
                }

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    getCurBalance();
                };

                /**
                 * 数据校验
                 * @param invalidBox
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    if (invalidBox.length == 0)checkData(invalidBox);
                };

                function checkData(invalidBox) {
                    if (!getCurrItem().amount > 0) {
                        invalidBox.push('金额必须大于0，请修改！');
                    }
                    if (getCurrItem().curr_amt < getCurrItem().amount) {
                        invalidBox.push('账户余额不足，请确认！');
                    }
                    if (getCurrItem().fd_fund_account_id_from == getCurrItem().fd_fund_account_id_to) {
                        invalidBox.push('支出与收入账号不能为同一账号，请修改！');
                    }
                }

                $scope.ondatefundchange = function () {
                    getCurrItem().year_month = getCurrItem().date_fund.substr(0, 7);
                }

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
