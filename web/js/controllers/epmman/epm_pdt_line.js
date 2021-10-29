/**
 * 产品线维护-编辑列表页
 * author:shenguocheng
 * since 2019-08-06
 */
define(
    ['module', 'controllerApi', 'base_edit_list'],
    function (module, controllerApi, base_edit_list) {
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
                            field: 'bill_type',
                            headerName: '订单类型',
                            hcDictCode: 'epm.bill_type'
                        }, {
                            field: 'division_name',
                            headerName: '事业部',
                            hcDictCode: 'epm.division'
                        }, {
                            field: 'order_pdt_line',
                            headerName: '订单产品线',
                            hcDictCode: 'epm.order_pdt_line'
                        }, {
                            field: 'is_major_data',
                            headerName: '主数据专用',
                            type: '是否'
                        }, {
                            field: 'is_project_report',
                            headerName: '工程报备专用',
                            type: '是否'
                        }]
                };

                //继承控制器
                controllerApi.extend({
                    controller: base_edit_list.controller,
                    scope: $scope
                });

                /**
                 * 重写方法，对保存后数据刷新
                 * @param responseData 响应的数据
                 */
                $scope.doAfterSave = function (responseData) {
                    $scope.gridOptions.hcApi.search();
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
