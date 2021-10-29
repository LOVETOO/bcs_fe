/**
 * 业务渠道维护-编辑列表页
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
                            field: 'sales_channel',
                            headerName: '销售渠道',
                            hcDictCode: 'sales.channel'
                        }, {
                            field: 'business_type',
                            headerName: '业务类型',
                            hcDictCode: 'epm.business_type'
                        }, {
                            field: 'is_promotional',
                            headerName: '含促销政策',
                            type: '是否'
                        }, {
                            field: 'business_channel',
                            headerName: '业务渠道',
                            hcDictCode: 'epm.business_channel'
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
