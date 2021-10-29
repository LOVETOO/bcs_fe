/**
 * 入库单列表0101(采购入库单)  0103(委外加工入库单)  0199(其他入库单)
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope', '$stateParams',
            //控制器函数
            function ($scope) {
                $scope.data = {};
                $scope.data.currItem = {};
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'invbillno',
                        headerName: '单据号',
                    }, {
                        field: 'invbilldate',
                        headerName: '单据日期',
                        type:"日期"
                    }, {
                        field: 'billtypename',
                        headerName: '单据类型'
                    }, {
                        field: 'warehouse_code',
                        headerName: '仓库代码',

                    }, {
                        field: 'warehouse_name',
                        headerName: '仓库名称',
                    }, {
                        field: 'in_ware_type_name',
                        headerName: '入库类型',
                    }, {
                        field: 'vendor_code',
                        headerName: '供应商编码',
                    }, {
                        field: 'vendor_name',
                        headerName: '供应商名称',
                    }, {
                        field: 'tax_rate',
                        headerName: '税率',
                        type:"百分比不转换"
                    },{
                        field: 'dept_code',
                        headerName: '部门编码',
                    }, {
                        field: 'dept_name',
                        headerName: '部门名称',
                    },{
                        field: 'customer_code',
                        headerName: '客户编码',
                    }, {
                        field: 'customer_name',
                        headerName: '客户名称',
                    },{
                        field: 'stat',
                        headerName: '单据状态',
                        hcDictCode:'stat'
                    }, {
                        field: 'is_auditing_wh',
                        headerName: '仓库审核',
                        type: '是否'
                    }, {
                        field: 'iscredence',
                        headerName: '已生成凭证',
                        type: '是否'
                    }, {
                        field: 'creator',
                        headerName: '创建人'
                    }, {
                        field: 'create_date',
                        headerName: '创建时间'
                    }
                    ],
                    hcBeforeRequest: function (searchObj) {
                        searchObj.searchflag = 9;
                    }
                };
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                $scope.toolButtons.add.hide = true;
                $scope.toolButtons.delete.hide = true;

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