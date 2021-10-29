/**
 * 其他入库单-列表页
 * date:2018-12-18
 */
define(
    ['module', 'controllerApi', 'base_obj_list', 'swalApi', 'requestApi'],
    function (module, controllerApi, base_obj_list, swalApi, requestApi) {
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
                        field: 'invbillno',
                        headerName: '入库单号',
                    }, {
                        field: 'stat',
                        headerName: '单据状态',
                        hcDictCode: "stat"
                    }, {
                        field: 'warehouse_code',
                        headerName: '入库仓编码',

                    }, {
                        field: 'warehouse_name',
                        headerName: '入库仓名称',
                    }, {
                        field: 'in_ware_type_name',
                        headerName: '入库类型',
                    }, {
                        field: 'customer_code',
                        headerName: '客户编码',
                    }, {
                        field: 'customer_name',
                        headerName: '客户名称'
                    }, {
                        field: 'vendor_code',
                        headerName: '供应商编码'
                    }, {
                        field: 'vendor_name',
                        headerName: '供应商名称'
                    }, {
                        field: 'total_qty',
                        headerName: '合计数量',
                        type: '数量'
                    }, {
                        field: 'amount_total',
                        headerName: '合计金额',
                        type: '金额'
                    },{
                        field: 'total_cubage',
                        headerName: '合计体积'
                    }, {
                        field: 'note',
                        headerName: '备注'
                    }, {
                        field: 'creator',
                        headerName: '创建人'
                    }, {
                        field: 'create_date',
                        headerName: '创建日期'
                    }
                    ],
                    hcObjType: $stateParams.objtypeid,
                    hcBeforeRequest: function (searchObj) {
                        searchObj.searchflag = 6;
                    }
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