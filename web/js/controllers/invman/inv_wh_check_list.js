/**
 * 仓库盘点单-列表页
 * date:2018-01-14
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
                            field: 'invbill_no',
                            headerName: '盘点单号',

                        },
                        {
                            field: 'year_month',
                            headerName: '盘点月份',

                        },
                        {
                            field: 'date_invbill',
                            headerName: '盘点日期',

                        }, {
                            field: 'crm_entid',
                            headerName: '品类',

                        },
                        {
                            headerName: '部门',
                            children: [
                                {
                                    field: 'dept_code',
                                    headerName: '编码',
                                    editable: false
                                },
                                {
                                    field: 'dept_name',
                                    headerName: '名称',
                                    editable: false
                                }
                            ]
                        },
                        {
                            headerName: '盘点仓库',
                            children: [
                                {
                                    field: 'warehouse_code',
                                    headerName: '编码',
                                    editable: false
                                },
                                {
                                    field: 'warehouse_name',
                                    headerName: '名称',
                                    editable: false
                                }
                            ]
                        },
                        {
                            headerName: '仓管员',
                            children: [
                                {
                                    field: 'whemployee_code',
                                    headerName: '编码',
                                    editable: false
                                },
                                {
                                    field: 'whemployee_name',
                                    headerName: '名称',
                                    editable: false
                                }
                            ]
                        },
                        {
                            field: 'invinbillno',
                            headerName: '盘盈入库单号',
                        },
                        {
                            field: 'invoutbillno',
                            headerName: '盘亏出库单号'
                        },
                        {
                            field: 'remark',
                            headerName: '备注',
                            maxWidth: 500
                        },
                        {
                            field: 'created_by',
                            headerName: '创建人'
                        },
                        {
                            field: 'creation_date',
                            headerName: '创建日期'
                        },
                        {
                            field: 'last_updated_by',
                            headerName: '最后修改人'
                        },
                        {
                            field: 'last_update_date',
                            headerName: '最后修改日期'
                        }
                    ],
                    hcObjType: $stateParams.objtypeid,
                    hcBeforeRequest: function (searchObj) {
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