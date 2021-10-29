/**
 * Created by zhl on 2019/7/22.
 * css_fitting_inbill_list 配件采购入库
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
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'purchase_no',
                        headerName: '单据编号'
                    }, {
                        field: 'stat',
                        headerName: '状态',
                        hcDictCode: 'stat'
                    }, {
                        field: 'org_name',
                        headerName: '所属机构'
                    }, {
                        field: 'in_warehouse_name',
                        headerName: '入库仓库'
                    }, {
                        field: 'total_qty',
                        headerName: '总数量',
                        type: '数量'
                    }, {
                        field: 'total_amount',
                        headerName: '总金额',
                        type: '金额'
                    }, {
                        field: 'creator',
                        headerName: '制单人'
                    }, {
                        field: 'create_time',
                        headerName: '制单时间'
                    }, {
                        field: 'note',
                        headerName: '备注'
                    }]
                };

                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);

                    console.log(bizData, 'bizdata');
                };


            }
        ];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.registerController({
            module: module,
            controller: controller
        });
    }
);