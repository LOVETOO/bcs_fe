/**
 * 采购付款-属性页
 * 2018-12-22
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'dateApi', 'swalApi'],
    function (module, controllerApi, base_obj_prop, requestApi, dateApi,swalApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {

                /*-------------------数据定义开始------------------------*/
                $scope.data = {};

                /*-------------------数据定义结束------------------------*/

                /*-------------------通用查询开始------------------------*/
                /**
                 * 通用查询设置
                 */
                $scope.commonSearchSetting = {
                    //部门
                    dept: {
                        afterOk: function (response) {
                            $scope.data.currItem.dept_id = response.dept_id;
                            $scope.data.currItem.dept_code = response.dept_code;
                            $scope.data.currItem.dept_name = response.dept_name;
                        }
                    },
                    //供应商
                    vendor_org: {
                        sqlWhere: ' usable = 2',
                        afterOk: function (response) {
                            $scope.data.currItem.vendor_id = response.vendor_id;
                            $scope.data.currItem.vendor_code = response.vendor_code;
                            $scope.data.currItem.vendor_name = response.vendor_name;
                        }
                    },
                    //结算方式
                    balance_type: {
                        sqlWhere: ' is_ap = 2',
                        afterOk: function (response) {
                            $scope.data.currItem.balance_type_name = response.balance_type_name;
                            $scope.data.currItem.base_balance_type_id = response.base_balance_type_id;

                            //1.现金 2.银行 3.票据 9.其他
                            $scope.data.currItem.settlement_type = response.settlement_type;

                            //若结算方式类型为‘其他’，则清空资金账户
                            if($scope.data.currItem.fd_fund_account_id && $scope.data.currItem.settlement_type == 9){
                                $scope.data.currItem.fd_fund_account_id = 0;
                                $scope.data.currItem.fund_account_code = '';
                                $scope.data.currItem.fund_account_name = '';
                            }
                        }
                    },
                    //往来对象
                    ac_object: {
                        afterOk: function (response) {
                            $scope.data.currItem.base_ac_object_code = response.base_ac_object_code;
                            $scope.data.currItem.base_ac_object_name = response.base_ac_object_name;
                            $scope.data.currItem.base_ac_object_id = response.base_ac_object_id;
                        }
                    },
                    //收支类型
                    io_type: {
                        sqlWhere: ' usable = 2',
                        afterOk: function (response) {
                            $scope.data.currItem.fd_io_type_id = response.fd_io_type_id;
                            $scope.data.currItem.io_type_code = response.io_type_code;
                            $scope.data.currItem.io_type_name = response.io_type_name;
                        }
                    }
                };

                //资金账户
                $scope.getCommonSearchSetting_fund_account = function(){
                    return {
                        beforeOpen: function () {
                            if(!$scope.data.currItem.settlement_type) {
                                swalApi.info('请先选择结算方式');
                                return false;
                            }
                        },
                        sqlWhere: ' fund_account_status = 2 and ' +
                            'fund_account_type = ' + $scope.data.currItem.settlement_type,
                        afterOk: function (response) {
                            $scope.data.currItem.fd_fund_account_id = response.fd_fund_account_id;
                            $scope.data.currItem.fund_account_code = response.fund_account_code;
                            $scope.data.currItem.fund_account_name = response.fund_account_name;
                        }
                    }
                };

                /*-------------------通用查询结束---------------------*/


                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);

                    $scope.initData(bizData);
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);

                    //本单据可编辑权限
                    $scope.data.canEdit = bizData.bx_id == 0;
                };

                /**
                 * 复制数据
                 */
                $scope.copyBizData = function (bizData) {
                    $scope.hcSuper.copyBizData(bizData);

                    $scope.initData(bizData);

                    bizData.bx_id = 0;
                    bizData.bx_no = '';
                    bizData.credence_no = '';
                    bizData.is_feebxcreate = 0;
                    bizData.attribute11 = '';
                };

                /**
                 * 初始化数据
                 */
                $scope.initData = function (bizData) {
                    bizData.syscreate_type = 0;
                    bizData.created_by = strUserId;
                    bizData.creation_date = dateApi.now();
                    bizData.date_fund = dateApi.today();
                    bizData.bx_id = 0;

                    bizData.searchflag = 7;

                    $scope.data.canEdit = true;
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
