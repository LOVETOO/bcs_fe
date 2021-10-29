/**
 * 配件采购申请
 * 2019/7/24.
 * zhuohuixiong

 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';

        /**
         * 控制器
         */
        var controller = [
            '$scope',
            function ($scope) {
                //继承列表页基础控制器
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'stat',
                        headerName: '单据状态',
                        hcDictCode: 'stat'
                    }, {
                        field: 'apply_no',
                        headerName: '单据编号'
                    }, {
                        field: 'fix_org_name',
                        headerName: '网点名称'
                    }, {
                        field: 'in_warehouse_name',
                        headerName: '入库仓'
                    }, {
                        field: 'out_warehouse_name',
                        headerName: '出库仓'
                    }, {
                        field: 'note',
                        headerName: '备注'
                    }, {
                        field: 'to_area_name',
                        headerName: '收货城市'
                    }, {
                        field: 'to_name',
                        headerName: '收货人'
                    }, {
                        field: 'to_tel',
                        headerName: '收货人电话'
                    }, {
                        field: 'out_org_name',
                        headerName: '受理机构名称'
                    }, {
                        field: 'out_fix_org_name',
                        headerName: '受理网点名称'
                    }
                    ]
                };

            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    });