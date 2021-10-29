/**
 * 其他出库红冲单-列表页
 * date:2018-12-26
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
                    columnDefs: [
                        {
                            type: '序号'
                        },
                        {
                            field: 'stat',
                            headerName: '单据状态',
                            hcDictCode:'stat',
                            editable: false
                        },
                        {
                            field: 'invbillno',
                            headerName: '出库红冲单号',
                            editable: false,
                        },
                        {
                            field: 'parent_billno',
                            headerName: '出库单号',
                            editable: false,
                        },
                        {
                            field: 'date_invbill',
                            headerName: '单据日期',
                            type: '日期'
                        },
                        {
                            field: 'warehouse_code',
                            headerName: '调出库编码',
                            editable: false,
                        },
                        {
                            field: 'warehouse_name',
                            headerName: '调出库名称',
                            editable: false,
                        },
                        {
                            field: 'out_ware_type_name',
                            headerName: '出库类型',
                            editable: false,
                        },
                        {
                            field: 'customer_code',
                            headerName: '客户编码',
                            editable: false,
                        },
                        {
                            field: 'customer_name',
                            headerName: '客户名称',
                            editable: false,
                        },
                        {
                            field: 'qty_sum',
                            headerName: '合计红冲数量',
                            editable: false,
                        },
                        {
                            field: 'amount_total',
                            headerName: '合计红冲金额',
                            editable: false,
                        },
                        {
                            field: 'total_cubage',
                            headerName: '合计红冲体积',
                            editable: false,
                            type: '体积'
                        },
                        {
                            field: 'dept_code',
                            headerName: '部门编码',
                            editable: false,
                        },
                        {
                            field: 'dept_name',
                            headerName: '部门名称',
                            editable: false,
                        },
                        // {
                        //     field: 'shipmode_name',
                        //     headerName: '发运方式',
                        //     editable: false,
                        // },
                        // {
                        //     field: 'send_time',
                        //     headerName: '送货日期',
                        //     editable: false,
                        // }, {
                        //     field: 'cust_name',
                        //     headerName: '收货人',
                        //     editable: false,
                        // },
                        // {
                        //     field: 'cust_phone',
                        //     headerName: '收货电话',
                        //     editable: false,
                        // },
                        // {
                        //     field: 'address1',
                        //     headerName: '收货地址',
                        //     editable: false,
                        // },
                        {
                            field: 'note',
                            headerName: '备注',
                            editable: false,
                        }, {
                            field: 'creator',
                            headerName: '创建人',
                            editable: false,
                        },
                        {
                            field: 'create_time',
                            headerName: '创建时间',
                            editable: false,
                        },
                        // {
                        //     field: 'updator',
                        //     headerName: '更新人',
                        //     editable: false,
                        // },
                        // {
                        //     field: 'update_time',
                        //     headerName: '更新时间',
                        //     editable: false,
                        // },
                    ],
                    hcObjType: $stateParams.objtypeid,
                    hcBeforeRequest: function (searchObj) {
                        searchObj.search_flag = 4;
                    }
                }
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