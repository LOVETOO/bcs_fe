/**
 * 工程项目到款-自定义列表页
 * shenguocheng
 * 2019-07-23
 * updateBy:zengjinhua
 * updateTime:2019-7-30
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'payment_record_code',
                            headerName: '到款单号'
                        }, {
                            field: 'project_code',
                            headerName: '项目编码'
                        }, {
                            field: 'project_name',
                            headerName: '项目名称',
                            width: 200
                        }, {
                            field: 'customer_code',
                            headerName: '客户编码'
                        }, {
                            field: 'customer_name',
                            headerName: '客户名称',
                            width: 200
                        }, {
                            field: 'received_amt',
                            headerName: '到款金额',
                            type: '金额'
                        }, {
                            field: 'currency_name',
                            headerName: '币别'
                        }, {
                            field: 'remark',
                            headerName: '备注'
                        }
                    ],
                    hcClassId: 'epm_payment_record',
                    hcOpenState: {
                        'remark': {
                            name: 'epmman.epm_payment_allot_prop',
                            idField: 'source_bill_id'
                        }
                    }
                };

                //继承控制器
                controllerApi.run({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                //取消双击打开详情页事件
                $scope.gridOptions.hcEvents = $scope.gridOptions.hcEvents || {};
                $scope.gridOptions.hcEvents.cellDoubleClicked = function () {
                    // $scope.openProp();
                };

                //隐藏按钮
                $scope.toolButtons.add.hide = true;
                $scope.toolButtons.delete.hide = true;
                $scope.toolButtons.openProp.hide = true;
            }];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);
