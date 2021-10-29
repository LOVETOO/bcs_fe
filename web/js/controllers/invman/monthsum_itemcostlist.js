/**
 * 成本明细账查询
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi', 'numberApi', 'dateApi'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi, numberApi, dateApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {


                $scope.data = {};
                $scope.data.currItem = {
                    year_month: dateApi.nowYear() + '-' + dateApi.nowMonth()
                };


                $scope.gridOptions = {
                    hcSearchWhenReady: false,
                    columnDefs: [{
                        type: '序号'
                    }, {
                        headerName: "记账日期",
                        field: "date_bill",
                        type: "日期"
                    }, {
                        headerName: "单据号/行号",
                        field: "billlineno"
                    }, {
                        headerName: "订单号/行号",
                        field: "mono"
                    }, {
                        headerName: "摘要",
                        field: "excerpta"
                    }, {
                        headerName: "入库",
                        children: [
                            {
                                id: 'qty_in',
                                headerName: "数量",
                                field: "qty_in",
                                type: "数量"
                            }, {
                                id: 'price_in',
                                headerName: "单价",
                                field: "price_in",
                                type: "金额"
                            }, {
                                id: 'amount_in',
                                headerName: "金额",
                                field: "amount_in",
                                type: "金额"
                            }
                        ]
                    }, {
                        headerName: "出库",
                        children: [
                            {
                                id: 'qty_out',
                                headerName: "数量",
                                field: "qty_out",
                                type: "数量"
                            }, {
                                id: 'price_out',
                                headerName: "单价",
                                field: "price_out",
                                type: "金额"
                            }, {
                                id: 'amount_out',
                                headerName: "金额",
                                field: "amount_out",
                                type: "金额"
                            }
                        ]
                    }, {
                        headerName: "结存",
                        children: [
                            {
                                id: 'qty_blnc',
                                headerName: "数量",
                                field: "qty_blnc",
                                type: "数量"
                            }, {
                                id: 'price_blnc',
                                headerName: "单价",
                                field: "price_blnc",
                                type: "金额"
                            }, {
                                id: 'amount_blnc',
                                headerName: "金额",
                                field: "amount_blnc",
                                type: "金额"
                            }
                        ]
                    }, {
                        headerName: "单据类型名称",
                        field: "billtypename"
                    }, {
                        headerName: "其他单据名称",
                        field: "billtype2name"
                    }, {
                        headerName: "更新日期",
                        field: "date_invbill"
                    }
                    ]
                };

                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });


                $scope.item_org = {
                    classId: 'item_org',
                    title: '产品查询',
                    //sqlWhere: 'usable = 2 and warehouse_type = 1',
                    afterOk: function (result) {
                        $scope.data.currItem.item_id = result.item_id;
                        $scope.data.currItem.item_code = result.item_code;
                        $scope.data.currItem.item_name = result.item_name;
                    }
                };


                //添加按钮
                $scope.toolButtons = {
                    search: {
                        title: '查询',
                        icon: 'fa fa-search',
                        click: function () {
                            $scope.search && $scope.search();
                        }
                    },
                    export: {
                        title: '导出',
                        icon: 'glyphicon glyphicon-log-out',
                        click: function () {
                            $scope.export && $scope.export();
                        }

                    }
                };


                $scope.refresh = function () {
                    $scope.search();
                }


                $scope.export = function () {
                    $scope.gridOptions.hcApi.exportToExcel();
                }

                $scope.search = function () {
                    if (check([]).length == 0) {
                        var postData = {
                            classId: "inv_monthsum",
                            action: 'itemcostlist',
                            data: $scope.data.currItem
                        };
                        return requestApi.post(postData)
                            .then(function (data) {
                                $scope.gridOptions.hcApi.setRowData(data.inv_monthsumofinv_monthsums);
                            });
                    } else {
                        swalApi.info(check([]));
                    }
                }

                //检查筛选月份期间
                function check(arr) {
                    if (!$scope.data.currItem.year_month) {
                        arr.push("请选择月份");
                    }
                    if (!$scope.data.currItem.item_id) {
                        arr.push("请选择产品");
                    }
                    return arr;
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