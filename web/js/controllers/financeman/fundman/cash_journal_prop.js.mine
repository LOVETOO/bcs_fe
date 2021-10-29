/**
 * 现金日记账
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
                $scope.chooseAccount = function () {
                    $modal.openCommonSearch({
                            classId: 'fd_fund_account',
                            postdata: {settlement_type: 1},
                        })
                        .result//响应数据
                        .then(function (result) {
                            $scope.data.currItem.fd_fund_account_id = result.fd_fund_account_id;
                            $scope.data.currItem.fund_account_code = result.fund_account_code;
                            $scope.data.currItem.fund_account_name = result.fund_account_name;
                        }).then(getCurBalance);
                };

                /**
                 * 结算方式
                 */
                $scope.chooseBalanceType = function () {
                    $modal.openCommonSearch({
                            classId: 'base_balance_type',
                            postdata: {},
                        })
                        .result//响应数据
                        .then(function (result) {
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
                            classId: 'fd_io_type',
                            postdata: {},
                        })
                        .result//响应数据
                        .then(function (result) {
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
                            classId: 'erpemployee',
                            postdata: {},
                        })
                        .result//响应数据
                        .then(function (result) {
                            $scope.data.currItem.employee_id = result.employee_id;
                            $scope.data.currItem.employee_code = result.employee_code;
                            $scope.data.currItem.employee_name = result.employee_name;
                        });
                };

                /**
                 * 查部门
                 */
                $scope.chooseOrg = function () {
                    $modal.openCommonSearch({
                            classId: 'dept',
                            postdata: {},
                        })
                        .result//响应数据
                        .then(function (result) {
                            $scope.data.currItem.dept_id = result.dept_id;
                            $scope.data.currItem.dept_code = result.dept_code;
                            $scope.data.currItem.dept_name = result.dept_name;
                        });
                };

                function getCurBalance() {
                    var postData = {
                        classId: "fd_cur_fund_balance",
                        action: 'getcurbalance',
                        data: {fd_fund_account_id: getCurrItem().fd_fund_account_id}
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
                    bizData.syscreate_type = 0;
                    bizData.amount_debit = 0;
                    bizData.amount_credit = 0;
                    bizData.is_need_creedence = 2;
                    bizData.date_fund = dateApi.today();
                    bizData.date_busine = dateApi.today();
                    bizData.year_month = bizData.date_fund.substr(0, 7);
                    bizData.searchflag = 1;
                }

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    getCurBalance();
                    bizData.searchflag = 1;
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
                    if (getCurrItem().amount_debit == 0 && getCurrItem().amount_credit == 0) {
                        invalidBox.push('"借方金额"' + "和" + '"贷方金额"' + "不能同时为0")
                    } else if (getCurrItem().amount_debit != 0 && getCurrItem().amount_credit != 0) {
                        invalidBox.push('"借方金额"' + "和" + '"贷方金额"' + "必须一方为0")
                    }
                    if (getCurrItem().date_fund < getCurrItem().date_busine) {
                        invalidBox.push('"记账日期"' + "不能小于" + '"业务日期"');
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
