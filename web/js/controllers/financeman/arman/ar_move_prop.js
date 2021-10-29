/**
 * 应付转移-属性页
 * 2019-01-08
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'dateApi', 'numberApi','loopApi'],
    function (module, controllerApi, base_obj_prop, requestApi, dateApi, numberApi, loopApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {

                /*-------------------数据定义开始------------------------*/
                $scope.commonSearchSetting = {};
                $scope.data = {};

                /*-------------------数据定义结束------------------------*/

                /*-------------------通用查询开始------------------------*/

                /**
                 * 通用查询设置
                 */
                $scope.commonSearchSetting = {
                    //转出部门
                    dept_from: {
                        afterOk: doAfterSearchDept('from')
                    },
                    //转入部门
                    dept_to: {
                        afterOk: doAfterSearchDept('to')
                    },
                    //转出客户
                    customer_org_from: {
                        sqlWhere: ' usable = 2',
                        afterOk: function (item) {
                            $scope.data.currItem.from_customer_id = item.customer_id;
                            $scope.data.currItem.customer_id = item.customer_id;
                            $scope.data.currItem.customer_org_id = item.customer_org_id;

                            $scope.data.currItem.moveout_code = item.customer_code;
                            $scope.data.currItem.moveout_name = item.customer_name;

                            doAfterSearchCustomer('from')
                        }
                    },
                    //转入客户
                    customer_org_to: {
                        sqlWhere: ' usable = 2',
                        afterOk: function (item) {
                            $scope.data.currItem.to_customer_id = item.customer_id;
                            $scope.data.currItem.customer_id = item.customer_id;
                            $scope.data.currItem.customer_org_id = item.customer_org_id;

                            $scope.data.currItem.movein_code = item.customer_code;
                            $scope.data.currItem.movein_name = item.customer_name;

                            doAfterSearchCustomer('to')
                        }
                    }
                };

                /**
                 * 部门通用查询后做的事，返回function
                 * @param type
                 * @returns {Function}
                 */
                function doAfterSearchDept(type) {
                    return function () {
                        $scope.data.currItem[type+'_dept_id'] = response.dept_id;
                        $scope.data.currItem[type+'_dept_code'] = response.dept_code;
                        $scope.data.currItem[type+'_dept_name'] = response.dept_name;
                    }
                }
                /**
                 * 客户通用查询后做的事
                 */
                function doAfterSearchCustomer(type) {
                    $scope.getCustomerAmountSum()
                        .then(function (data) {
                            if(data){
                                $scope.data.currItem['amount_sum_'+type] = data.amount_sum;
                            }
                            //查对应部门信息:
                            $scope.getDept(type);
                        })
                }

                /*-------------------通用查询结束---------------------*/


                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /**
                 * 根据客户和品类查部门
                 */
                $scope.getDept = function (type) {
                    // --若客户资料【经销品类】有对应品类的记录，则带出对应的部门编码及名称；
                    // --若匹配不到，则带出客户资料【常规信息】处的“销售归属部门”对应部门编码及名称。
                    if($scope.data.currItem.customer_org_id){
                        return requestApi.post('customer_org', 'select' ,
                            {customer_org_id: $scope.data.currItem.customer_org_id})
                            .then(function (data) {
                                var cusInfo = data.customer_salepriceofcustomer_orgs.slice(0);

                                $scope.data.currItem.crm_entid = $scope.data.currItem.crm_entid || 0;
                                $scope.data.currItem.to_crm_entid = $scope.data.currItem.to_crm_entid || 0;

                                var crm_entid = 'from' === type ?
                                    $scope.data.currItem.crm_entid : $scope.data.currItem.to_crm_entid;

                                if(cusInfo.length) {
                                    loopApi.forLoop(cusInfo.length, function (i) {
                                        if(cusInfo[i].crm_entid == crm_entid){
                                            $scope.data.currItem[type+'_dept_id'] = cusInfo[i].dept_id;
                                            $scope.data.currItem[type+'_dept_code'] = cusInfo[i].dept_code;
                                            $scope.data.currItem[type+'_dept_name'] = cusInfo[i].dept_name;

                                            return true;
                                        }else{
                                            $scope.data.currItem[type+'_dept_id'] = data.dept_id;
                                            $scope.data.currItem[type+'_dept_code'] = data.dept_code;
                                            $scope.data.currItem[type+'_dept_name'] = data.dept_name;
                                        }
                                    })
                                }else{
                                    $scope.data.currItem[type+'_dept_id'] = data.dept_id;
                                    $scope.data.currItem[type+'_dept_code'] = data.dept_code;
                                    $scope.data.currItem[type+'_dept_name'] = data.dept_name;
                                }
                            })
                    }

                };

                /**
                 * 初始化数据
                 */
                $scope.initData = function (bizData) {
                    bizData.created_by = strUserId;
                    bizData.creation_date = dateApi.now();
                    bizData.last_updated_by = strUserId;
                    bizData.last_update_date = dateApi.now();

                    bizData.bill_date = dateApi.today();
                    bizData.year_month = new Date(bizData.bill_date).Format('yyyy-MM');

                    bizData.move_type = 4;
                };

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);

                    $scope.initData(bizData);
                };

                /**
                 * 复制数据
                 */
                $scope.copyBizData = function (bizData) {
                    $scope.hcSuper.copyBizData(bizData);

                    bizData.credence_no_s = '';

                    $scope.initData(bizData);
                };

                /**
                 * 保存前校验
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);

                    var from_customer_id = numberApi.toNumber($scope.data.currItem.from_customer_id);
                    var to_customer_id = numberApi.toNumber($scope.data.currItem.to_customer_id);
                    var from_crm_entid = numberApi.toNumber($scope.data.currItem.crm_entid);
                    var to_crm_entid = numberApi.toNumber($scope.data.currItem.to_crm_entid);

                    if(from_customer_id && to_customer_id && from_crm_entid && to_crm_entid){
                        if(from_customer_id == to_customer_id && from_crm_entid == to_crm_entid){
                            invalidBox.push('转出信息与转入信息相同，不允许保存！');
                        }
                    }

                };

                /**
                 * 取客户对应应付账款余额
                 * 参数：记账月份、客户id
                 */
                $scope.getCustomerAmountSum = function () {
                    var postdata = {
                        customer_id: $scope.data.currItem.customer_id,
                        year_month: $scope.data.currItem.year_month
                    };
                    return requestApi.post('ar_month_sum','getcustomeraramount',postdata)
                };

                /**
                 * 表单控件改变事件
                 */
                $scope.changeEvent = function (name) {
                    if('bill_date' === name){
                        if($scope.data.currItem.bill_date){
                            $scope.data.currItem.year_month
                                = new Date($scope.data.currItem.bill_date).Format('yyyy-MM')
                        }
                    }
                    if('out_crm_entid' === name){
                        if(!$scope.data.currItem.customer_org_id && $scope.data.currItem.from_customer_org_id){
                            $scope.data.currItem.customer_org_id = $scope.data.currItem.from_customer_org_id;
                        }
                        $scope.getDept('from');
                    }
                    if('in_crm_entid' === name){
                        if(!$scope.data.currItem.customer_org_id && $scope.data.currItem.to_customer_org_id){
                            $scope.data.currItem.customer_org_id = $scope.data.currItem.to_customer_org_id;
                        }
                        $scope.getDept('to');
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
