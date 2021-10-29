/**
 * 发票抬头 invoice title_list
 * Created by zhl on 2019/2/15.
 */
define(
    ['module', 'controllerApi', 'base_obj_list' ],
    function (module, controllerApi, base_obj_list) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$stateParams',
            //控制器函数
            function ($scope, $stateParams) {
                $scope.data = {};
                $scope.data.currItem = {};
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'company_name',
                        headerName: '名称',
                        minWidth:300
                    }, {
                        field: 'tax_no',
                        headerName: '纳税人识别号',
                        minWidth:300
                    }, {
                        field: 'address',
                        headerName: '单位地址',
                        minWidth:300
                    }, {
                        field: 'phone',
                        headerName: '电话号码',
                        minWidth:300
                    }, {
                        field: 'bank',
                        headerName: '开户银行',
                        minWidth:250
                    }, {
                        field: 'account_no',
                        headerName: '银行账号',
                        minWidth:300
                    }],
                    hcObjType: $stateParams.objtypeid
                };

                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

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




