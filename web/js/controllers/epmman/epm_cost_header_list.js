/**
 * 工程成本信息-列表页
 * shenguocheng
 * 2019-07-19
 */
define(
    ['module', 'controllerApi', 'base_diy_page'],
    function (module, controllerApi, base_diy_page) {
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
                            field: 'chap_name',
                            headerName: '记账月份'
                        }, {
                            field: 'org_name',
                            headerName: '产品编码'
                        }, {
                            field: 'balance_type_name',
                            headerName: '产品名称',
                            width: 283
                        }, {
                            field: 'fee_apply_no',
                            headerName: '产品单位'
                        }, {
                            field: 'total_apply_amt',
                            headerName: '成本单价(元)',
                            type: '金额'
                        }, {
                            field: 'total_allow_amt',
                            headerName: '备注',
                            width: 282
                        }
                    ]
                };

                //继承控制器
                controllerApi.run({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                //定义 筛选 按钮
                $scope.toolButtons.search = {
                    title: '筛选',
                    icon: 'iconfont hc-shaixuan',
                    //click: function () {
                    //    $scope.gridOptions.hcApi.search();
                    //}
                };
                //定义 同步产品成本 按钮
                $scope.toolButtons.synchronizedProductCost = {
                    title: '同步产品成本',
                    //click: function () {
                    //    $scope.gridOptions.hcApi.search();
                    //}
                };


            }];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);
