/**
 * 应付转移-属性页
 * 2019-01-08
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'dateApi', 'numberApi'],
    function (module, controllerApi, base_obj_prop, requestApi, dateApi, numberApi) {
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
                    //转出供应商
                    vendor_org_from: {
                        sqlWhere: ' usable = 2',
                        afterOk: function (item) {
                            $scope.data.currItem.from_vendor_id = item.vendor_id;
                            $scope.data.currItem.vendor_id = item.vendor_id;

                            $scope.data.currItem.moveout_code = item.vendor_code;
                            $scope.data.currItem.moveout_name = item.vendor_name;

                            doAfterSearchVendor('from')
                        }
                    },
                    //转入供应商
                    vendor_org_to: {
                        sqlWhere: ' usable = 2',
                        afterOk: function (item) {
                            $scope.data.currItem.to_vendor_id = item.vendor_id;
                            $scope.data.currItem.vendor_id = item.vendor_id;

                            $scope.data.currItem.movein_code = item.vendor_code;
                            $scope.data.currItem.movein_name = item.vendor_name;

                            doAfterSearchVendor('to')
                        }
                    }
                };

                /**
                 * 供应商通用查询后做的事
                 * @param type
                 */
                function doAfterSearchVendor(type) {
                    $scope.getVendorAmountSum()
                        .then(function (data) {
                            if(data){
                                $scope.data.currItem['amount_sum_'+type] = data.amount_sum;
                            }
                        })
                }

                /*-------------------通用查询结束---------------------*/


                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

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

                    bizData.move_type = 1;
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

                    var from_vendor_id = numberApi.toNumber($scope.data.currItem.from_vendor_id);
                    var to_vendor_id = numberApi.toNumber($scope.data.currItem.to_vendor_id);
                    if(from_vendor_id && to_vendor_id){
                        if(from_vendor_id == to_vendor_id){
                            invalidBox.push('转出信息与转入信息相同，不允许保存！');
                        }
                    }

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
                $scope.changeEvent = function () {
                    if($scope.data.currItem.bill_date){
                        $scope.data.currItem.year_month
                            = new Date($scope.data.currItem.bill_date).Format('yyyy-MM')
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
