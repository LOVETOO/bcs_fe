/**
 * 售后BOM通用
 * createby limeng
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';
        /**
         * 控制器
         */
        var CssItemBomList = [
            '$scope',
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'drp_item_code',
                        headerName: '产品编码'
                    }, {
                        field: 'drp_item_name',
                        headerName: '产品名称'
                    }, {
                        field: 'item_code',
                        headerName: '配件编码'
                    }, {
                        field: 'item_name',
                        headerName: '配件名称'
                    }, {
                        field: 'qty',
                        type: "数量",
                        headerName: 'BOM数量'
                    }, {
                        field: 'creator',
                        headerName: '创建人'
                    }, {
                        field: 'create_time',
                        headerName: '创建时间'
                    }, {
                        field: 'updator',
                        headerName: '修改人',
                        type: '日期'
                    }, {
                        field: 'update_time',
                        headerName: '修改时间',
                        type: '日期'
                    }
                    ]
                };
                //继承列表页基础控制器
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
            controller: CssItemBomList
        });
    });

