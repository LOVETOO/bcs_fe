/**
 *  create by ljb
 *  2019-6-3
 */
define(
    ['module', 'controllerApi', 'base_obj_prop'],
    function (module, controllerApi, base_obj_prop) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {

                $scope.data = {
                    currItem: {}
                };

                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /**
                 * 新增设置数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    $scope.data.currItem.usable=2;
                    $scope.data.currItem.vendor_type=2;
                }

                /**
                 * 通用查询函数
                 */
                //部门通用查询
                $scope.commonSearchSettingOfDept = {
                    afterOk: function (result) {
                        $scope.data.currItem.dept_id = result.dept_id;
                        $scope.data.currItem.dept_code = result.dept_code;
                        $scope.data.currItem.dept_name = result.dept_name;
                    }
                };
                //分类编码通用查询
                $scope.commonSearchSettingOfVendorClassCode = {
                    sqlWhere:"vendor_class_id>0 and vendor_class_id<4",
                    afterOk: function (result) {
                        $scope.data.currItem.vendor_class_id = result.vendor_class_id;
                        $scope.data.currItem.vendor_class_code = result.vendor_class_code;
                        $scope.data.currItem.vendor_class_name = result.vendor_class_name;
                    }
                };
                //货币编码通用查询
                $scope.commonSearchSettingOfCurrencyCode = {
                    afterOk: function (result) {
                        $scope.data.currItem.base_currency_id = result.base_currency_id
                        $scope.data.currItem.currency_code = result.currency_code;
                        $scope.data.currItem.currency_name = result.currency_name;
                    }
                };
                //无票应付通用查询
                $scope.commonSearchSettingOfCodeNoinv = {
                    afterOk: function (result) {
                        $scope.data.currItem.gl_account_subject_id_noinv = result.gl_account_subject_id;
                        $scope.data.currItem.code_noinv = result.km_code;
                        $scope.data.currItem.name_noinv = result.km_name;
                    }
                };
                //有票应付通用查询
                $scope.commonSearchSettingOfCodeInv = {
                    afterOk: function (result) {
                        $scope.data.currItem.gl_account_subject_id_inv = result.gl_account_subject_id;
                        $scope.data.currItem.code_inv = result.km_code;
                        $scope.data.currItem.name_inv = result.km_name;
                    }
                };
                //应付票据通用查询
                $scope.commonSearchSettingOfCodeAp = {
                    afterOk: function (result) {

                        $scope.data.currItem.gl_account_subject_id_ap = result.gl_account_subject_id;
                        $scope.data.currItem.code_ap = result.km_code;
                        $scope.data.currItem.name_ap = result.km_name;
                    }
                };

        }]

    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: controller
    });
})