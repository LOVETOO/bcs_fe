/**
 * Created by zhl on 2019/7/24.
 * 配件库存 css_inventory_list
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
                //库存明细
                $scope.gridOptions = {
                    columnDefs: [{
                        id: 'seq',
                        type: '序号'
                    }, {
                        headerName: "部门",
                        children: [
                            {
                                id: 'org_code',
                                headerName: "部门编码",
                                field: "org_code",
                                pinned: 'left'
                            }, {
                                id: 'org_name',
                                headerName: "部门名称",
                                field: "org_name",
                                pinned: 'left'
                            }
                        ]
                    }, {
                        headerName: "网点",
                        children: [
                            {
                                id: 'fix_org_code',
                                headerName: "网点编码",
                                field: "fix_org_code",
                                pinned: 'left'
                            }, {
                                id: 'fix_org_name',
                                headerName: "仓库网点名称",
                                field: "fix_org_name",
                                pinned: 'left'
                            }
                        ]
                    }, {
                        headerName: "仓库",
                        children: [
                            {
                                id: 'warehouse_code',
                                headerName: "仓库编码",
                                field: "warehouse_code",
                                pinned: 'left'
                            }, {
                                id: 'warehouse_name',
                                headerName: "仓库名称",
                                field: "warehouse_name",
                                pinned: 'left'
                            }
                        ]
                    }, {
                        field: 'css_item_name',
                        headerName: '配件'
                    }, {
                        field: 'inv_qty',
                        headerName: '实际库存'
                    }, {
                        field: 'qty_keep',
                        headerName: '预占库存'
                    }],
                    hcClassId: 'css_inventory',
                    hcBeforeRequest: function (searchObj) {
                        angular.extend(searchObj, $scope.data.currItem);
                    }
                };

                //明细汇总
                $scope.groupGridOptions = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [{
                        type: '序号'
                    }, {
                        headerName: "配件",
                        children: [
                            {
                                headerName: "配件编码",
                                field: "css_item_code",
                                pinned: 'left'
                            }, {
                                headerName: "配件名称",
                                field: "css_item_name",
                                pinned: 'left'
                            }
                        ]
                    }, {
                        id: 'org',
                        headerName: "部门",
                        children: [
                            {
                                id: 'org_code',
                                headerName: "部门编码",
                                field: "org_code",
                                pinned: 'left'
                            }, {
                                id: 'org_name',
                                headerName: "部门名称",
                                field: "org_name",
                                pinned: 'left'
                            }
                        ]
                    }, {
                        id: 'fixorg',
                        headerName: "网点",
                        children: [
                            {
                                id: 'fix_org_code',
                                headerName: "网点编码",
                                field: "fix_org_code",
                                pinned: 'left'
                            }, {
                                id: 'fix_org_name',
                                headerName: "仓库网点名称",
                                field: "fix_org_name",
                                pinned: 'left'
                            }
                        ]
                    }, {
                        id: 'warehouse',
                        headerName: "仓库",
                        children: [
                            {
                                id: 'warehouse_code',
                                headerName: "仓库编码",
                                field: "warehouse_code",
                                pinned: 'left'
                            }, {
                                id: 'warehouse_name',
                                headerName: "仓库名称",
                                field: "warehouse_name",
                                pinned: 'left'
                            }
                        ]
                    }, {
                        headerName: "实际库存量",
                        field: "inv_qty",
                        type: "数量"
                    }/*, {
                     id: 'qty_keep',
                     headerName: "预占库存量",
                     field: "qty_keep",
                     hide: true,
                     type: "数量"
                     }, {
                     id: 'qty_plan',
                     headerName: "可使用库存量",
                     field: "qty_plan",
                     hide: true,
                     type: "数量"
                     }*/]
                };

                //$scope.gridOptions.hcClassId = 'css_inventory';

                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                function getCurrItem() {
                    return $scope.data.currItem;
                }

                /*---------------------通用查询配置--------------------------*/

                //查询仓库
                $scope.commonSearchSettingOfWarehouse = {
                    afterOk: function (result) {
                        getCurrItem().warehouse_name = result.warehouse_name;
                        getCurrItem().warehouse_code = result.warehouse_code;
                        getCurrItem().warehouse_id = result.warehouse_id;
                    }
                };

                //查询部门（机构）
                $scope.commonSearchSettingOfScporg = {
                    afterOk: function (result) {
                        if (!result.code)
                            getCurrItem().org_code = '该部门无编码';
                        else
                            getCurrItem().org_code = result.code;
                        getCurrItem().org_id = result.orgid;
                        getCurrItem().org_name = result.orgname;
                    }
                };

                //查询网点
                $scope.commonSearchSettingOfFixorg = {
                    sqlWhere: ' usable = 2 ',
                    afterOk: function (result) {
                        getCurrItem().fix_org_id = result.fix_org_id;
                        getCurrItem().fix_org_code = result.fix_org_code;
                        getCurrItem().fix_org_name = result.fix_org_name;
                    }
                };

                /*---------------------按钮定义--------------------------*/

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
                };

                /*---------------------汇总功能--------------------------*/

                //库存明细表格数据
                $scope.data.lines = [];
                //分类汇总（明细汇总）
                $scope.group = function (title) {
                    if ($scope.data.lines.length == 0) {
                        $scope.data.lines = $scope.gridOptions.hcApi.getRowData();
                    }

                    $("#groupModal").modal();

                };

                $scope.columns = [];
                $scope.initGroup = function () {
                    //汇总所依据的列
                    var columns = [];
                    if ($scope.summaryBasis.org == 2)columns.push("部门");
                    if ($scope.summaryBasis.fixorg == 2)columns.push("网点");
                    if ($scope.summaryBasis.warehouse == 2)columns.push("仓库");
                    if (columns.length == 0) {
                        swalApi.info("请选择汇总项");
                        return;
                    }

                    $scope.columns = columns;

                    //控制汇总表格中列的显隐
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

                    $("#groupModal").modal('hide');

                    $('#tab22').tab('show');

                    var lines = angular.copy($scope.data.lines);
                    //数据分组
                    groupData(lines, columns);
                };

                //数据分组
                function groupData(lines, columns) {
                    var map = {};
                    var key = "";
                    //明细汇总表格数据
                    var group_data = [];
                    for (var i = 0; i < lines.length; i++) {
                        var lines_element = lines[i];
                        key = "";
                        columns.forEach(function (v) {
                            if (v == '部门')key += lines_element.org_name;
                            if (v == '网点')key += lines_element.fix_org_name;
                            if (v == '仓库')key += lines_element.warehouse_name;
                        });
                        if (!map[key]) {
                            map[key] = [lines_element];
                        } else {
                            map[key].push(lines_element);
                        }
                    }
                    console.log(map,'map');
                    //合计值计算
                    Object.keys(map).forEach(function (key) {
                        var row = map[key][0];
                        row.inv_qty = numberApi.sum(map[key], 'inv_qty');
                        //row.qty_keep = numberApi.sum(map[key], 'qty_keep');
                        //row.qty_plan = numberApi.sum(map[key], 'qty_plan');
                        group_data.push(row);
                    });

                    $scope.groupGridOptions.hcApi.setRowData(group_data);
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