/**
 * 应付应付对冲-属性页
 * 2019-01-14
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
                 * 查部门
                 */
                $scope.commonSearchSetting.dept = {
                    afterOk: function (item) {
                        $scope.data.currItem.from_dept_id = item.dept_id;
                        $scope.data.currItem.from_dept_code = item.dept_code;
                        $scope.data.currItem.from_dept_name = item.dept_name;

                        return getOk('from');
                    }
                };

                /**
                 * 查供应商
                 */
                $scope.commonSearchSetting.vendor_org = {
                    sqlWhere: ' usable = 2 ',
                    afterOk: function (item) {
                        $scope.data.currItem.to_vendor_id = item.vendor_id;
                        $scope.data.currItem.movein_code = item.vendor_code;
                        $scope.data.currItem.movein_name = item.vendor_name;

                        $scope.data.currItem.vendor_id = item.vendor_id;

                        $scope.getVendorAmountSum()
                            .then(function (data) {
                                if(data){
                                    $scope.data.currItem.amount_sum_to = data.amount_sum;
                                }
                            })
                    }
                };

                /**
                 * 查客户
                 */
                $scope.commonSearchSetting.customer_org = {
                    sqlWhere: ' usable = 2 ',
                    afterOk: function (item) {
                        $scope.data.currItem.from_customer_id = item.customer_id;
                        $scope.data.currItem.moveout_code = item.customer_code;
                        $scope.data.currItem.moveout_name = item.customer_name;

                        $scope.data.currItem.customer_org_id = item.customer_org_id;

                        $scope.data.currItem.customer_id = item.customer_id;

                        $scope.getCustomerAmountSum()
                            .then(function (data) {
                                if(data){
                                    $scope.data.currItem.amount_sum_from = data.amount_sum;
                                }
                                //查对应部门信息:
                                $scope.getDept();
                            })
                    }
                };

                /*-------------------通用查询结束---------------------*/


                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /**
                 * 根据客户和品类查部门
                 */
                $scope.getDept = function () {
                    // --若客户资料【经销品类】有对应品类的记录，则带出对应的部门编码及名称；
                    // --若匹配不到，则带出客户资料【常规信息】处的“销售归属部门”对应部门编码及名称。
                    if($scope.data.currItem.customer_org_id){
                        return requestApi.post('customer_org', 'select' ,
                            {customer_org_id: $scope.data.currItem.customer_org_id})
                            .then(function (data) {
                                var cusInfo = data.customer_salepriceofcustomer_orgs.slice(0);

                                $scope.data.currItem.crm_entid = $scope.data.currItem.crm_entid || 0;

                                if(cusInfo.length) {
                                    loopApi.forLoop(cusInfo.length, function (i) {
                                        if(cusInfo[i].crm_entid == $scope.data.currItem.crm_entid){
                                            $scope.data.currItem.from_dept_id = cusInfo[i].dept_id;
                                            $scope.data.currItem.from_dept_code = cusInfo[i].dept_code;
                                            $scope.data.currItem.from_dept_name = cusInfo[i].dept_name;

                                            return true;
                                        }else{
                                            $scope.data.currItem.from_dept_id = data.dept_id;
                                            $scope.data.currItem.from_dept_code = data.dept_code;
                                            $scope.data.currItem.from_dept_name = data.dept_name;
                                        }
                                    })
                                }else{
                                    $scope.data.currItem.from_dept_id = data.dept_id;
                                    $scope.data.currItem.from_dept_code = data.dept_code;
                                    $scope.data.currItem.from_dept_name = data.dept_name;
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

                    bizData.move_type = 3;
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
                 * 取供应商对应应付账款余额
                 * 参数：记账月份、供应商id
                 */
                $scope.getVendorAmountSum = function () {
                    var postdata = {
                        vendor_id: $scope.data.currItem.vendor_id,
                        year_month: $scope.data.currItem.year_month
                    };
                    return requestApi.post('ap_month_sum','getvendorapamount',postdata)
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
                        $scope.getDept();
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
