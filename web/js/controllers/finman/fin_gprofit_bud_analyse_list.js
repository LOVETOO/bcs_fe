/**
 * 毛利预算分析
 * date:2019-1-4
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi', 'numberApi'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi, numberApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.data = {};
                $scope.data.currItem = {};
                $scope.gridOptions = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [{
                        id: 'seq',
                        type: '序号'
                    }, {
                        id: 'unknown',
                        headerName: "产品编码",
                        field: "uom_name"
                    }, {
                        id: 'unknown',
                        headerName: "产品名称",
                        field: "uom_name"
                    }, {
                        id: 'unknown',
                        headerName: "所属品类",
                        field: "uom_name"
                    }, {
                        id: 'unknown',
                        headerName: "销售单价",
                        field: "uom_name"
                    }, {
                        id: 'unknown',
                        headerName: "销售数量",
                        field: "uom_name"
                    }, {
                        id: 'unknown',
                        headerName: "销售总额",
                        field: "uom_name"
                    }, {
                        id: 'unknown',
                        headerName: "销售成本/单台",
                        field: "uom_name"
                    }, {
                        id: 'unknown',
                        headerName: "毛利/单台",
                        field: "uom_name"
                    }, {
                        id: 'unknown',
                        headerName: "毛利总额",
                        field: "uom_name"
                    }, {
                        id: 'unknown',
                        headerName: "毛利率",
                        field: "uom_name"
                    }, {
                        id: 'unknown',
                        headerName: "1月份",
                        children: [
                            {
                                id: 'unknown',
                                headerName: "销售数量",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "成本金额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "销售总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利率",
                                field: "unknown"
                            }
                        ]
                    }, {
                        id: 'unknown',
                        headerName: "2月份",
                        children: [
                            {
                                id: 'unknown',
                                headerName: "销售数量",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "成本金额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "销售总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利率",
                                field: "unknown"
                            }
                        ]
                    }, {
                        id: 'unknown',
                        headerName: "3月份",
                        children: [
                            {
                                id: 'unknown',
                                headerName: "销售数量",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "成本金额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "销售总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利率",
                                field: "unknown"
                            }
                        ]
                    }, {
                        id: 'unknown',
                        headerName: "4月份",
                        children: [
                            {
                                id: 'unknown',
                                headerName: "销售数量",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "成本金额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "销售总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利率",
                                field: "unknown"
                            }
                        ]
                    }, {
                        id: 'unknown',
                        headerName: "5月份",
                        children: [
                            {
                                id: 'unknown',
                                headerName: "销售数量",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "成本金额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "销售总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利率",
                                field: "unknown"
                            }
                        ]
                    }, {
                        id: 'unknown',
                        headerName: "6月份",
                        children: [
                            {
                                id: 'unknown',
                                headerName: "销售数量",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "成本金额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "销售总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利率",
                                field: "unknown"
                            }
                        ]
                    }, {
                        id: 'unknown',
                        headerName: "7月份",
                        children: [
                            {
                                id: 'unknown',
                                headerName: "销售数量",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "成本金额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "销售总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利率",
                                field: "unknown"
                            }
                        ]
                    }, {
                        id: 'unknown',
                        headerName: "8月份",
                        children: [
                            {
                                id: 'unknown',
                                headerName: "销售数量",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "成本金额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "销售总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利率",
                                field: "unknown"
                            }
                        ]
                    }, {
                        id: 'unknown',
                        headerName: "9月份",
                        children: [
                            {
                                id: 'unknown',
                                headerName: "销售数量",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "成本金额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "销售总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利率",
                                field: "unknown"
                            }
                        ]
                    }, {
                        id: 'unknown',
                        headerName: "10月份",
                        children: [
                            {
                                id: 'unknown',
                                headerName: "销售数量",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "成本金额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "销售总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利率",
                                field: "unknown"
                            }
                        ]
                    }, {
                        id: 'unknown',
                        headerName: "11月份",
                        children: [
                            {
                                id: 'unknown',
                                headerName: "销售数量",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "成本金额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "销售总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利率",
                                field: "unknown"
                            }
                        ]
                    }, {
                        id: 'unknown',
                        headerName: "12月份",
                        children: [
                            {
                                id: 'unknown',
                                headerName: "销售数量",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "成本金额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "销售总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利率",
                                field: "unknown"
                            }
                        ]
                    }
                    ],//columnDefs 列定义结束
                };

                $scope.groupGridOptions = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [{
                        id: 'seq',
                        type: '序号'
                    }, {
                        id: 'unknown',
                        headerName: "所属品类",
                        field: "unknown",
                        pinned: 'left'
                    }, {
                        id: 'unknown',
                        headerName: "销售数量",
                        field: "unknown",
                        pinned: 'left'
                    }, {
                        id: 'unknown',
                        headerName: "销售总额",
                        field: "unknown",
                        pinned: 'left'
                    }, {
                        id: 'unknown',
                        headerName: "毛利总额",
                        field: "unknown",
                        pinned: 'left'
                    }, {
                        id: 'unknown',
                        headerName: "毛利率",
                        field: "unknown",
                        pinned: 'left'
                    }, {
                        id: 'unknown',
                        headerName: "1月份",
                        children: [
                            {
                                id: 'unknown',
                                headerName: "销售数量",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "销售总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利率",
                                field: "unknown"
                            }
                        ]
                    }, {
                        id: 'unknown',
                        headerName: "2月份",
                        children: [
                            {
                                id: 'unknown',
                                headerName: "销售数量",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "销售总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利率",
                                field: "unknown"
                            }
                        ]
                    }, {
                        id: 'unknown',
                        headerName: "3月份",
                        children: [
                            {
                                id: 'unknown',
                                headerName: "销售数量",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "销售总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利率",
                                field: "unknown"
                            }
                        ]
                    }, {
                        id: 'unknown',
                        headerName: "4月份",
                        children: [
                            {
                                id: 'unknown',
                                headerName: "销售数量",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "销售总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利率",
                                field: "unknown"
                            }
                        ]
                    }, {
                        id: 'unknown',
                        headerName: "5月份",
                        children: [
                            {
                                id: 'unknown',
                                headerName: "销售数量",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "销售总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利率",
                                field: "unknown"
                            }
                        ]
                    }, {
                        id: 'unknown',
                        headerName: "6月份",
                        children: [
                            {
                                id: 'unknown',
                                headerName: "销售数量",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "销售总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利率",
                                field: "unknown"
                            }
                        ]
                    }, {
                        id: 'unknown',
                        headerName: "7月份",
                        children: [
                            {
                                id: 'unknown',
                                headerName: "销售数量",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "销售总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利率",
                                field: "unknown"
                            }
                        ]
                    }, {
                        id: 'unknown',
                        headerName: "8月份",
                        children: [
                            {
                                id: 'unknown',
                                headerName: "销售数量",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "销售总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利率",
                                field: "unknown"
                            }
                        ]
                    }, {
                        id: 'unknown',
                        headerName: "9月份",
                        children: [
                            {
                                id: 'unknown',
                                headerName: "销售数量",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "销售总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利率",
                                field: "unknown"
                            }
                        ]
                    }, {
                        id: 'unknown',
                        headerName: "10月份",
                        children: [
                            {
                                id: 'unknown',
                                headerName: "销售数量",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "销售总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利率",
                                field: "unknown"
                            }
                        ]
                    }, {
                        id: 'unknown',
                        headerName: "11月份",
                        children: [
                            {
                                id: 'unknown',
                                headerName: "销售数量",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "销售总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利率",
                                field: "unknown"
                            }
                        ]
                    }, {
                        id: 'unknown',
                        headerName: "12月份",
                        children: [
                            {
                                id: 'unknown',
                                headerName: "销售数量",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "销售总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利总额",
                                field: "unknown"
                            }, {
                                id: 'unknown',
                                headerName: "毛利率",
                                field: "unknown"
                            }
                        ]
                    }
                    ]
                };//groupGridOptions 结束网格定义

                //$scope.gridOptions.hcClassId = 'inv_current_inv';
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });


                /*-------------------通用查询开始------------------------*/


                /*-------------------通用查询结束------------------------*/


                /*------------------- 数据设置开始------------------------*/
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);

                    bizData.unknown1 = 1;
                };
                /*-------------------数据设置结束------------------------*/


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
                    },

                    show_group: {
                        title: '显示汇总',
                        icon: 'glyphicon glyphicon-indent-right',
                        click: function () {
                            $scope.group && $scope.group(this.title);
                        }
                    }
                };

                // 查询
                $scope.search = function () {
                    $('#tab11').tab('show');
                    $scope.data.lines = [];
                    $scope.groupGridOptions.hcApi.setRowData([]);
                    return $scope.gridOptions.hcApi.search();
                };

                $scope.refresh = function () {
                    $scope.search();
                };

                $scope.export = function () {
                    $scope.gridOptions.hcApi.exportToExcel();
                }

                $scope.data.lines = [];
                $scope.group = function (title) {
                    if ($scope.data.lines.length == 0) {
                        $scope.data.lines = $scope.gridOptions.hcApi.getRowData();
                    }

                    $("#groupModal").modal();
                }

                $scope.columns = [];
                $scope.initGroup = function () {
                    var columns = [];
                    if ($scope.warehouse == 2)columns.push("仓库");
                    if ($scope.item == 2)columns.push("产品");
                    if ($scope.crm_entid == 2)columns.push("品类");
                    if ($scope.entorgid == 2)columns.push("产品线");
                    if ($scope.item_class == 2)columns.push("产品分类");
                    if (columns.length == 0) {
                        swalApi.info("请选择汇总项");
                        return;
                    }
                    $scope.columns = columns;
                    $scope.groupGridOptions.columnDefs.forEach(function (column) {
                        if (columns.indexOf(column.headerName) >= 0) {
                            $scope.groupGridOptions.columnApi.setColumnVisible(column.id, true);
                            if (column.children) {
                                column.children.forEach(function (child) {
                                    $scope.groupGridOptions.columnApi.setColumnVisible(child.id, true);
                                });
                            }
                        } else {
                            $scope.groupGridOptions.columnApi.setColumnVisible(column.id, false);
                            if (column.children) {
                                column.children.forEach(function (child) {
                                    $scope.groupGridOptions.columnApi.setColumnVisible(child.id, false);
                                });
                            }
                        }
                    });

                    if ($scope.data.currItem.plan_flag == 2) {
                        $scope.groupGridOptions.columnApi.setColumnsVisible(['qty_keep', 'qty_plan'], true);
                    }
                    $scope.groupGridOptions.columnApi.setColumnsVisible(['qty_onhand', 'seq'], true);

                    $("#groupModal").modal('hide');

                    $('#tab22').tab('show');

                    //数据分组
                    groupData($scope.data.lines, columns);
                }


                function groupData(lines, columns) {
                    var map = {};
                    var key = "";
                    var group_data = [];
                    for (var i = 0; i < lines.length; i++) {
                        var ai = lines[i];
                        key = "";
                        columns.forEach(function (v) {
                            if (v == '仓库')key += ai.warehouse_code;
                            if (v == '产品')key += ai.item_code;
                            if (v == '品类')key += ai.crm_entid;
                            if (v == '产品线')key += ai.entorgid;
                            if (v == '产品分类')key += ai.item_class;
                        });
                        if (!map[key]) {
                            map[key] = [ai];
                        } else {
                            map[key].push(ai);
                        }
                    }
                    Object.keys(map).forEach(function (key) {
                        var row = map[key][0];
                        row.qty_onhand = numberApi.sum(map[key], 'qty_onhand');
                        row.qty_keep = numberApi.sum(map[key], 'qty_keep');
                        row.qty_plan = numberApi.sum(map[key], 'qty_plan');
                        group_data.push(row);
                    });
                    $scope.groupGridOptions.hcApi.setRowData(group_data);
                }

                $scope.onPlanflagChange = function () {
                    if ($scope.data.currItem.plan_flag == 2) {
                        $scope.gridOptions.columnApi.setColumnsVisible(['qty_keep', 'qty_plan'], true);
                    } else {
                        $scope.gridOptions.columnApi.setColumnsVisible(['qty_keep', 'qty_plan'], false);
                    }
                    $scope.search();
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