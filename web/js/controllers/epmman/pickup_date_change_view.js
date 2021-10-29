/**
 * 提货时间报表
 * zengjinhua
 * 2019/12/30
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
                    columnDefs: [
                        {
                            type: '序号'
                        },
                        {
                            field: 'sa_salebillno',
                            headerName: '要货单号'
                        },
                        {
                            field: 'urgent_order_billno',
                            headerName: '紧急要货单号'
                        },
                        {
                            field: 'short_name',
                            headerName: '客户简称'
                        },
                        {
                            field: 'item_code',
                            headerName: '产品编码'
                        },
                        {
                            field: 'item_name',
                            headerName: '产品名称'
                        },
                        {
                            field: 'uom_name',
                            headerName: '单位'
                        },
                        {
                            field: 'qty_bill',
                            headerName: '订单数量',
                            type : '数量'
                        },
                        {
                            field: 'urgent_qty',
                            headerName: '紧急要货数量',
                            type : '数量'
                        },
                        {
                            field: 'delivery_base_name',
                            headerName: '发货基地'
                        },
                        {
                            field: 'old_pick_up_date',
                            headerName: '原提货日期',
                            type : '日期'
                        },
                        {
                            field: 'new_pick_up_date',
                            headerName: '新提货日期',
                            type : '日期'
                        },
                        {
                            field: 'valid_date',
                            headerName: '有效期至',
                            type : '日期'
                        },
                        {
                            field: 'reserved_qty',
                            headerName: '当时保留数量',
                            type : '数量'
                        },
                        {
                            field: 'pre_reserved_qty',
                            headerName: '当时预占数量',
                            type : '数量'
                        },
                        {
                            field: 'released_qty',
                            headerName: '当时已释放数量',
                            type : '数量'
                        },
                        {
                            field: 'creator_name',
                            headerName: '操作人'
                        },
                        {
                            field: 'createtime',
                            headerName: '操作时间',
                            type : '时间'
                        }
                    ],
                    hcRequestAction: 'selectpickupview', //打开页面前的请求方法
                    hcDataRelationName: 'epm_urgent_orders',
                    hcClassId: 'epm_urgent_order'
                };

                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                /*---------------------按钮隐藏--------------------------*/
                $scope.toolButtons.add.hide = true;
                $scope.toolButtons.delete.hide = true;
                $scope.toolButtons.openProp.hide = true;
                $scope.toolButtons.filter.hide = true;
                $scope.toolButtons.refresh.hide = true;

                $scope.toolButtonGroups.more.hide = true;

                /*---------------------通用查询--------------------------*/
                /**
                 * 通用查询
                 */
                $scope.commonSearch = {
                    /*客户编码*/
                    customer_org: {
                        afterOk: function (result) {
                            $scope.searchObj.customer_code = result.customer_code;
                            $scope.searchObj.short_name = result.short_name;
                        }
                    },
                    /* 交易公司查询
                     * */
                    trading_company_name: {
                        title: '发货基地',
                        postData: {
                            search_flag: 3
                        },
                        gridOptions: {
                            columnDefs: [
                                {
                                    headerName: "发货基地编码",
                                    field: "trading_company_code"
                                }, {
                                    headerName: "发货基地名称",
                                    field: "trading_company_name"
                                }
                            ]
                        },
                        afterOk: function (result) {
                            $scope.searchObj.delivery_base_name = result.trading_company_name;
                        }
                    },
                    /* 产品查询 */
                    item_code: {
                        postData: function () {
                            return {
                                need_price: 2
                            };
                        },
                        afterOk: function (item) {
                            $scope.searchObj.item_code = item.item_code;
                            $scope.searchObj.item_name = item.item_name;
                        }
                    }
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
