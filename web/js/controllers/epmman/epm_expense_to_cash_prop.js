/**
 * 工程服务费兑换
 *  2019/8/17
 *  zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi', 'numberApi'],
    function (module, controllerApi, base_obj_prop, swalApi, requestApi, numberApi) {
        'use strict';
        var controller = [
            '$scope',
            function ($scope) {
                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /*----------------------------------通用查询-------------------------------------------*/

                /**
                 * 服务费编号
                 */
                $scope.commonSearchExpense = {
                    postData : function(){
                        return {
                            search_flag : 1,
                            customer_id : user.isCustomer ? $scope.data.currItem.customer_id : 0
                        }
                    },
                    afterOk: function (result) {
                        var fileds = [
                            "service_expense_head_id",     //服务费id
                            "service_expense_no",          //服务费编号
                            "billing_unit_name",           //开票单位
                            "billing_unit_code",           //法人
                            "total_auditt_amt",            //合同发货总额
                            "total_check_amt",             //发货结算总额
                            "service_amt",                 //应结算服务费
                            "total_cash_amt",              //已兑现总额
                            "total_uncash_amt"             //未兑现金额
                        ];
                        if (!user.isCustomer) {
                            //不是经销商登陆还需带入经销商信息
                            fileds.push(
                                'customer_id',				//经销商ID
                                'customer_code',			//经销商编码
                                'customer_name' 			//经销商名称
                            )
                        }
                        fileds.forEach(function (filed) {
                            $scope.data.currItem[filed] = result[filed];
                        });
                    }
                };


                /*----------------------------------方法定义-------------------------------------------*/
                /**
                 * 本次可兑现金额计算方法
                 */
                $scope.setCashableAmt = function () {
                    if(!$scope.data.currItem.service_expense_head_id > 0){
                        swalApi.info("请先选择服务费编号");
                        var fileds = [
                            "deposit_deduct",
                            "taxes_deduct",
                            "other_deduct",
                            "cashable_amt",
                            "interest_on_credit"
                        ];
                        //置空
                        fileds.forEach(function (filed) {
                            $scope.data.currItem[filed] = undefined;
                        });
                    }else{
                        var filedes = [
                            "deposit_deduct",
                            "taxes_deduct",
                            "other_deduct",
                            "interest_on_credit"
                        ];
                        var shouldDeduct = 0;
                        filedes.forEach(function (filed) {
                            if($scope.data.currItem[filed] > 0){
                                shouldDeduct = numberApi.sum(shouldDeduct, $scope.data.currItem[filed]);
                            }
                        });
                        $scope.data.currItem.cashable_amt = numberApi
                            .sub($scope.data.currItem.total_uncash_amt, shouldDeduct);
                    }
                };

                /**
                 * 修改服务费编号方法
                 */
                $scope.setServiceExpenseNo = function () {
                    if($scope.data.currItem.service_expense_no == ""
                        || $scope.data.currItem.service_expense_no == null
                        || $scope.data.currItem.service_expense_no == undefined){
                        //清空数据
                        var fileds = [
                            "service_expense_head_id",     //服务费id
                            "service_expense_no",          //服务费编号
                            "billing_unit_name",           //开票单位
                            "project_code",                //项目编码
                            "project_name",                //项目名称
                            "total_auditt_amt",            //合同发货总额
                            "total_check_amt",             //发货结算总额
                            "service_amt",                 //应结算服务费
                            "total_cash_amt",              //已兑现总额
                            "total_uncash_amt"             //未兑现金额
                        ];
                        if (!user.isCustomer) {
                            //不是经销商登陆还需清空经销商信息
                            fileds.push(
                                'customer_id',				//经销商ID
                                'customer_code',			//经销商编码
                                'customer_name' 			//经销商名称
                            );
                        }
                        fileds.forEach(function (filed) {
                            $scope.data.currItem[filed] = undefined;
                        });
                    }
                };
                /*----------------------------------按钮方法数据 定义-------------------------------------------*/
                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    //判断是否为经销商账户登陆
                    if(user.isCustomer){
                        $scope.data.currItem.customer_id = customer.customer_id;
                        $scope.data.currItem.customer_code = customer.customer_code;
                        $scope.data.currItem.customer_name = customer.customer_name;
                    }
                };

                /**
                 * 保存验证
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    if($scope.data.currItem.apply_amt <= 0){
                        invalidBox.push("本次实际兑现金额必须大于零，请修改！");
                    }else if($scope.data.currItem.apply_amt > $scope.data.currItem.cashable_amt){
                        invalidBox.push("本次实际兑现金额必须≤本次可兑现金额，请修改！");
                    }
                    if ($scope.data.currItem.cashing_way == 2){
                        //当兑现类型为委托支付时，附件必须上传
                        if($scope.projAttachController.getAttaches().length <= 0 ){
                            invalidBox.push("请上传'委托支付'附件！");
                        }else {
                            var whether = true;
                            $scope.projAttachController.getAttaches().forEach(function (value) {
                                if(value.attach_type == "委托支付"){
                                    whether = false;
                                }
                            });
                            if(whether){
                                invalidBox.push("请上传'委托支付'附件！");
                            }
                        }
                    }

                    return invalidBox;
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                };
            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    });