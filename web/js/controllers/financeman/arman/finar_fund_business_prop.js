/**
 * 销售回款单-详情页
 * date:2018-12-21
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi', 'dateApi', 'numberApi'],
    function (module, controllerApi, base_obj_prop, swalApi, requestApi, dateApi, numberApi) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数
            function ($scope, $modal) {
                /**数据定义 */
                $scope.data = {};
                $scope.data.currItem = {};

                /**通用查询 */

                /**继承主控制器 */
                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /**
                 *
                 * @constructor
                 */
                function Editable() {
                    return true;
                }

                function checkGridMoneyInput(args, functions) {
                    if (args.newValue === args.oldValue)
                        return;
                    if (numberApi.isNum(args.newValue) || numberApi.isStrOfNum(args.newValue)) {
                        functions.forEach(function (value) {
                            value(args.data);
                        })
                        args.api.refreshView();
                    }
                    else {
                        return swalApi.info("请输入有效数字");
                    }
                }

                /**======================点击事件==========================**/

                /**============================逻辑计算====================================**/

                /**============================数据处理 ================================**/

                /**
                 * 保存前验证
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    // //校验资金账号
                    // var settlement_type = parseInt($scope.data.currItem.settlement_type);
                    // if ([1, 2, 3].indexOf(settlement_type) >= 0) {
                    //     if ($scope.data.currItem.fund_account_name === undefined) {
                    //         invalidBox.push('资金账号不能为空');
                    //     }
                    // }
                    return invalidBox;
                };

                /**
                 * 新建单据时初始化数据
                 * @param bizData
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData); //继承基础控制器的方法，类似Java的super
                    angular.extend($scope.data.currItem, {
                        created_by: strUserName,
                        creation_date: dateApi.now(),
                        date_fund: new Date(dateApi.now()).Format('yyyy-MM-dd'),
                        stat: 1,
                        sale_employee_name: strUserName,
                        syscreate_type: 0,
                        searchflag: 6,
                        return_type: 1,
                        is_ar_fund: 2
                    });

                    requestApi.post('sale_employee', 'search',
                        {sqlwhere: " employee_name = '" + strUserName + "' "})
                        .then(function (response) {
                            if (response.sale_employees.length) {
                                $scope.data.currItem.sale_employee_id = response.sale_employees[0].sale_employee_id;
                            } else {
                                $scope.data.currItem.sale_employee_name = "";
                            }
                        })
                };

                /**
                 * 设置表格数据
                 * @param bizData
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                };

                /**
                 * 单据复制重新赋值
                 * @param bizData
                 */
                $scope.copyBizData = function (bizData) {
                    $scope.hcSuper.copyBizData(bizData);
                    bizData.date_fund = new Date(dateApi.now()).Format('yyyy-MM-dd');
                    bizData.creation_date = dateApi.now()
                };
                /**============================通用查询 ===================**/

                /**
                 * 业务员查询
                 */
                $scope.employeeSearch = function () {
                    $modal.openCommonSearch({
                            classId: 'sale_employee',
                            postData: {
                                sqlwhere: " 1=1 "
                            }
                        })
                        .result//响应数据
                        .then(function (result) {
                            $scope.data.currItem.sale_employee_id = result.sale_employee_id;
                            $scope.data.currItem.sale_employee_name = result.employee_name;
                        });
                };

                /**
                 * 查部门
                 */
                function chooseOrg() {
                    $modal.openCommonSearch({
                            classId: 'dept'
                        })
                        .result//响应数据
                        .then(function (result) {
                            $scope.data.currItem.dept_id = result.dept_id;
                            $scope.data.currItem.dept_code = result.dept_code;
                            $scope.data.currItem.dept_name = result.dept_name;
                        });
                };
                /*function chooseOrg() {
                 return Baseman Service.chooseDept({
                 scope: $scope,
                 realtime: true
                 }).then(function (response) {
                 $scope.data.currItem.dept_id = response.dept_id;
                 $scope.data.currItem.dept_code = response.dept_code;
                 $scope.data.currItem.dept_name = response.dept_name;
                 })
                 }*/

                $scope.chooseOrg = chooseOrg;
                /**
                 * 组织客户查询
                 */
                $scope.customerSearch = function () {
                    $modal.openCommonSearch({
                            classId: 'customer_org',
                            postData: {
                                maxsearchrltcmt: 10,
                                searchflag: 1
                            },
                            sqlWhere: " usable = 2"
                        })
                        .result//响应数据
                        .then(function (result) {
                            $scope.data.currItem.customer_name = result.customer_name;
                            $scope.data.currItem.customer_code = result.customer_code;
                            $scope.data.currItem.customer_id = result.customer_id;
                            $scope.data.currItem.sale_employee_id = result.sale_employee_id;
                            $scope.data.currItem.sale_employee_name = result.employee_name;
                            $scope.data.currItem.sale_employee_code = result.employee_code;
                            $scope.data.currItem.dept_code = result.dept_code;
                            $scope.data.currItem.dept_name = result.dept_name;
                            $scope.data.currItem.dept_id = result.dept_id;
                        });
                };


                /**
                 * 结算方式查询
                 */
                $scope.searchBase_balance_type = function () {
                    $modal.openCommonSearch({
                            classId: 'base_balance_type',
                            sqlWhere: " is_ar = 2"
                        })
                        .result//响应数据
                        .then(function (result) {
                            $scope.data.currItem.balance_type_code = result.balance_type_code;
                            $scope.data.currItem.balance_type_name = result.balance_type_name;
                            $scope.data.currItem.base_balance_type_id = result.base_balance_type_id;
                            $scope.data.currItem.settlement_type = parseInt(result.settlement_type);
                            $scope.data.currItem.fd_fund_account_id = 0;
                            $scope.data.currItem.fund_account_name = "";
                            $scope.data.currItem.fund_account_code = "";
                        });
                };

                /**
                 * 查询收支类型
                 */
                $scope.searchFd_io_type = function () {
                    $modal.openCommonSearch({
                            classId: 'fd_io_type',
                            dataRelationName: 'fd_io_types'
                        })
                        .result//响应数据
                        .then(function (result) {
                            $scope.data.currItem.fd_io_type_id = result.fd_io_type_id;
                            $scope.data.currItem.io_type_code = result.io_type_code;
                            $scope.data.currItem.io_type_name = result.io_type_name;
                        });
                };

                /**
                 * 银行账户查询
                 */
                $scope.fd_fund_accountSearch = function () {
                    if ($scope.data.currItem.settlement_type && $scope.data.currItem.settlement_type > 0) {
                        $modal.openCommonSearch({
                                classId: 'fd_fund_account',
                                dataRelationName: 'fd_fund_accounts',
                                postData: {
                                    maxsearchrltcmt: 10
                                },
                                sqlWhere: " fund_account_type =" + $scope.data.currItem.settlement_type
                            })
                            .result//响应数据
                            .then(function (result) {
                                $scope.data.currItem.fd_fund_account_id = result.fd_fund_account_id;
                                $scope.data.currItem.fund_account_name = result.fund_account_name;
                                $scope.data.currItem.fund_account_code = result.fund_account_code;
                            });
                    } else {
                        $modal.openCommonSearch({
                                classId: 'fd_fund_account',
                                dataRelationName: 'fd_fund_accounts',
                                postData: {
                                    maxsearchrltcmt: 10
                                }
                            })
                            .result//响应数据
                            .then(function (result) {
                                $scope.data.currItem.fd_fund_account_id = result.fd_fund_account_id;
                                $scope.data.currItem.fund_account_name = result.fund_account_name;
                                $scope.data.currItem.fund_account_code = result.fund_account_code;
                            });
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