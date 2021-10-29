/**
 * 采购订单  inv_po_list
 * 2018-12-18 zhl
 */
define(
    ['module', 'controllerApi', 'base_obj_list', 'swalApi', 'requestApi'],
    function (module, controllerApi, base_obj_list, swalApi, requestApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.data = {};
                $scope.data.currItem = {};
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'stat',
                            headerName: '单据状态',
                            hcDictCode:'stat'
                        }, {
                            field: 'pono',
                            headerName: '采购单号'
                        }, {
                            field: 'podate',
                            headerName: '单据日期',
                            type:'日期'
                        }, {
                            field: 'vendor_code',
                            headerName: '供应商编码'
                        }, {
                            field: 'vendor_name',
                            headerName: '供应商名称'
                        },{
                            field: 'price_type',
                            headerName: '采购价格类型',
                            hcDictCode:'price_type'
                        },/* {
                            field: 'buyer_name',
                            headerName: '采购员'
                        },*/ /*{
                            field: 'contact',
                            headerName: '联系人'
                        }, {
                            field: 'tele',
                            headerName: '联系人电话'
                        }, */
                        {
                            field: 'warehouse_code',
                            headerName: '仓库编码'
                        }, {
                            field: 'warehouse_name',
                            headerName: '仓库名称'
                        },{
                            field: 'dept_code',
                            headerName: '部门编码'
                        }, {
                            field: 'dept_name',
                            headerName: '部门名称'
                        }, {
                            field: 'total_cubage',
                            headerName: '合计体积'
                        }, {
                            field: 'total_qty',
                            headerName: '合计数量',
                            type:'数量'
                        },  {
                            field: 'amount_potax',
                            headerName: '合计金额',
                            type:'金额'
                        },{
                            field: 'create_date',
                            headerName: '创建时间'
                        }, {
                            field: 'creator',
                            headerName: '创建人'
                        },{
                            field: 'poremark',
                            headerName: '备注'
                        }
                    ],
                    hcClassId: 'srm_po_head'
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