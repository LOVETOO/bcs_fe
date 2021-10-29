/**
 * 采购入库单  inv_in_bill_list
 * 2018-12-20 zhl
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
                /*   $scope.data = {};
                 $scope.data.currItem = {};*/
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'stat',
                            headerName: '单据状态',
                            hcDictCode: 'stat'
                        }, {
                            field: 'invbilldate',
                            headerName: '单据日期',
                            type:'日期'
                        }, {
                            field: 'invbillno',
                            headerName: '入库单号'
                        }, {
                            field: 'pono',
                            headerName: '采购订单号'
                        }, {
                            field: 'vendor_code',
                            headerName: '供应商编码'
                        }, {
                            field: 'vendor_name',
                            headerName: '供应商名称'
                        }, {
                            field: 'price_type',
                            headerName: '价格类型',
                            hcDictCode:'price_type'
                        }, {
                            field: 'warehouse_code',
                            headerName: '仓库编码'
                        }, {
                            field: 'warehouse_name',
                            headerName: '仓库名称'
                        },/* {
                            field: 'vendorbillno',
                            headerName: '送货单号',
                        }, */{
                            field: 'total_qty',
                            headerName: '合计入库数量',
                            type:'数量'
                        }, {
                            field: 'amount_total',
                            headerName: '合计金额',
                            type:'金额'
                        },{
                            field: 'total_cubage',
                            headerName: '合计体积',
                            type:'体积'
                        }, {
                            field: 'creator',
                            headerName: '创建人'
                        }, {
                            field: 'create_date',
                            headerName: '创建时间'
                        }, {
                            field: 'note',
                            headerName: '备注'
                        }
                    ],
                    hcObjType: 11555,
                    hcBeforeRequest: function (searchObj) {
                        searchObj.searchflag = 3;
                    }
                };

                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                $scope.toolButtons = {};
                $scope.toolButtons = {

                    add: {
                        title: '新增',
                        icon: 'fa fa-plus',
                        click: function () {
                            $scope.add && $scope.add();
                        }
                    },
                    delete: {
                        title: '删除',
                        icon: 'fa fa-minus',
                        click: function () {
                            $scope.delete && $scope.delete();
                        }
                    },
                    openProp: {
                        title: '查看',
                        icon: '',
                        click: function () {
                            $scope.openProp && $scope.openProp();
                        }
                    },
                    refresh: {
                        title: '刷新',
                        icon: 'fa fa-refresh',
                        click: function () {
                            $scope.refresh && $scope.refresh();
                        }
                    },
                    search: {
                        title: '筛选',
                        icon: 'fa fa-search',
                        click: function () {
                            $scope.search && $scope.search();
                        }
                    }
                };

                $scope.toolButtons.import = {
                    title: '导入',
                    icon: 'glyphicon glyphicon-log-in',
                    click: function () {
                        $scope.import && $scope.import();
                    }
                };

                //导入
                $scope.import = function () {

                }

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
