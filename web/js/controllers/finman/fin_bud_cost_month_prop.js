/**
 * 月度成本预算编制-属性页
 * 2018-11-27
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'openBizObj', 'swalApi', '$q', 'numberApi', 'fileApi', 'loopApi'],
    function (module, controllerApi, base_obj_prop, requestApi, openBizObj, swalApi, $q, numberApi, fileApi, loopApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数
            function ($scope, $modal) {


                function getCurrItem() {
                    return $scope.data.currItem;
                }

                function editable(args) {
                    if (!arguments[0].node.id) {
                        return false;
                    }
                    if (getCurrItem().stat == 1)
                        return true;
                    return false;
                }

                /*-------------------数据定义开始------------------------*/
                $scope.gridOptions = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [
                        {
                            type: '序号'
                        }
                        , {
                            field: 'item_code',
                            headerName: '产品编码',
                            pinned: 'left'
                        }
                        , {
                            field: 'item_name',
                            headerName: '产品名称'
                        }
                        , {
                            field: 'crm_entid',
                            headerName: '所属品类',
                            hcDictCode: 'crm_entid'
                        }
                        , {
                            field: 'uom_name',
                            headerName: '计量单位',
                            type: '单位'
                        }, {
                            field: 'sales_qty',
                            headerName: '销售数量',
                            type: '数量'
                        },
                        {
                            field: 'sales_price',
                            headerName: '销售单价',
                            type: '金额'
                        },
                        {
                            id: 'cost_amt',
                            field: 'cost_amt',
                            headerName: '预算材料成本/单台',
                            type: '金额'
                        },
                        {
                            id: 'diff_amt',
                            field: 'diff_amt',
                            headerName: '预计材料成本差异金额/单台',
                            type: '金额'
                        },
                        {
                            id: 'cost_rg_amt',
                            field: 'cost_rg_amt',
                            headerName: '预算人工成本/单台',
                            type: '金额'
                        },
                        {
                            id: 'cost_zz_amt',
                            field: 'cost_zz_amt',
                            headerName: '预算制造费用/单台',
                            type: '金额'
                        },
                        {
                            field: 'cost_xs_amt',
                            headerName: '销售成本/单台',
                            type: '金额'
                        },
                        {
                            headerName: '1月份',
                            children: [
                                {
                                    field: 'sales_qty_month1',
                                    headerName: '销售数量',
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        if (args.newValue == args.oldValue)
                                            return
                                        setCostAmtMonth(args);
                                        args.api.refreshCells();
                                    },
                                    type: '数量'
                                }
                                , {
                                    field: 'cost_amt_month1',
                                    headerName: '成本金额',
                                    type: '金额'
                                }
                            ]
                        },
                        {
                            headerName: '2月份',
                            children: [
                                {
                                    field: 'sales_qty_month2',
                                    headerName: '销售数量',
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        if (args.newValue == args.oldValue)
                                            return
                                        setCostAmtMonth(args);
                                        args.api.refreshCells();
                                    },
                                    type: '数量'
                                }
                                , {
                                    field: 'cost_amt_month2',
                                    headerName: '成本金额',
                                    type: '金额'
                                }
                            ]
                        },
                        {
                            headerName: '3月份',
                            children: [
                                {
                                    field: 'sales_qty_month3',
                                    headerName: '销售数量',
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        if (args.newValue == args.oldValue)
                                            return
                                        setCostAmtMonth(args);
                                        args.api.refreshCells();
                                    },
                                    type: '数量'
                                }
                                , {
                                    field: 'cost_amt_month3',
                                    headerName: '成本金额',
                                    type: '金额'
                                }
                            ]
                        },
                        {
                            headerName: '4月份',
                            children: [
                                {
                                    field: 'sales_qty_month4',
                                    headerName: '销售数量',
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        if (args.newValue == args.oldValue)
                                            return
                                        setCostAmtMonth(args);
                                        args.api.refreshCells();
                                    },
                                    type: '数量'
                                }
                                , {
                                    field: 'cost_amt_month4',
                                    headerName: '成本金额',
                                    type: '金额'
                                }
                            ]
                        },
                        {
                            headerName: '5月份',
                            children: [
                                {
                                    field: 'sales_qty_month5',
                                    headerName: '销售数量',
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        if (args.newValue == args.oldValue)
                                            return
                                        setCostAmtMonth(args);
                                        args.api.refreshCells();
                                    },
                                    type: '数量'
                                }
                                , {
                                    field: 'cost_amt_month5',
                                    headerName: '成本金额',
                                    type: '金额'
                                }
                            ]
                        },
                        {
                            headerName: '6月份',
                            children: [
                                {
                                    field: 'sales_qty_month6',
                                    headerName: '销售数量',
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        if (args.newValue == args.oldValue)
                                            return
                                        setCostAmtMonth(args);
                                        args.api.refreshCells();
                                    },
                                    type: '数量'
                                }
                                , {
                                    field: 'cost_amt_month6',
                                    headerName: '成本金额',
                                    type: '金额'
                                }
                            ]
                        },
                        {
                            headerName: '7月份',
                            children: [
                                {
                                    field: 'sales_qty_month7',
                                    headerName: '销售数量',
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        if (args.newValue == args.oldValue)
                                            return
                                        setCostAmtMonth(args);
                                        args.api.refreshCells();
                                    },
                                    type: '数量'
                                }
                                , {
                                    field: 'cost_amt_month7',
                                    headerName: '成本金额',
                                    type: '金额'
                                }
                            ]
                        },
                        {
                            headerName: '8月份',
                            children: [
                                {
                                    field: 'sales_qty_month8',
                                    headerName: '销售数量',
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        if (args.newValue == args.oldValue)
                                            return
                                        setCostAmtMonth(args);
                                        args.api.refreshCells();
                                    },
                                    type: '数量'
                                }
                                , {
                                    field: 'cost_amt_month8',
                                    headerName: '成本金额',
                                    type: '金额'
                                }
                            ]
                        },
                        {
                            headerName: '9月份',
                            children: [
                                {
                                    field: 'sales_qty_month9',
                                    headerName: '销售数量',
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        if (args.newValue == args.oldValue)
                                            return
                                        setCostAmtMonth(args);
                                        args.api.refreshCells();
                                    },
                                    type: '数量'
                                }
                                , {
                                    field: 'cost_amt_month9',
                                    headerName: '成本金额',
                                    type: '金额'
                                }
                            ]
                        },
                        {
                            headerName: '10月份',
                            children: [
                                {
                                    field: 'sales_qty_month10',
                                    headerName: '销售数量',
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        if (args.newValue == args.oldValue)
                                            return
                                        setCostAmtMonth(args);
                                        args.api.refreshCells();
                                    },
                                    type: '数量'
                                }
                                , {
                                    field: 'cost_amt_month10',
                                    headerName: '成本金额',
                                    type: '金额'
                                }
                            ]
                        },
                        {
                            headerName: '11月份',
                            children: [
                                {
                                    field: 'sales_qty_month11',
                                    headerName: '销售数量',
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        if (args.newValue == args.oldValue)
                                            return
                                        setCostAmtMonth(args);
                                        args.api.refreshCells();
                                    },
                                    type: '数量'
                                }
                                , {
                                    field: 'cost_amt_month11',
                                    headerName: '成本金额',
                                    type: '金额'
                                }
                            ]
                        },
                        {
                            headerName: '12月份',
                            children: [
                                {
                                    field: 'sales_qty_month12',
                                    headerName: '销售数量',
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        if (args.newValue == args.oldValue)
                                            return
                                        setCostAmtMonth(args);
                                        args.api.refreshCells();
                                    },
                                    type: '数量'
                                }
                                , {
                                    field: 'cost_amt_month12',
                                    headerName: '成本金额',
                                    type: '金额'
                                }
                            ]
                        }
                        ,
                        {
                            field: 'note',
                            headerName: '说明',
                            editable: function (args) {
                                return editable(args)
                            }
                        }
                    ]
                };

                /*-------------------数据定义结束------------------------*/
                /*-------------------通用查询开始------------------------*/
                /**
                 * 查年度销售预算
                 */
                $scope.chooseFee = function (args) {
                    $modal.openCommonSearch({
                            classId: 'fin_bud_cost_head',
                            postData: {search_flag: 1},
                            action: 'search',
                            title: "年度成本预算",
                            gridOptions: {
                                columnDefs: [{
                                    headerName:  "预算单号",
                                    field: "cost_bud_head_no"
                                }, {
                                    headerName: "编制年度",
                                    field: "bud_year"
                                }]
                            }
                        })
                        .result//响应数据
                        .then(function (result) {
                            var postData = {
                                classId: "fin_bud_cost_head",
                                action: 'select',
                                data: {cost_bud_head_id: result.cost_bud_head_id, search_flag: 1}
                            };
                            requestApi.post(postData).then(function (data) {
                                delete data.creator;
                                delete data.create_time;
                                delete data.stat;
                                delete data.wfflag;
                                delete data.wfid;
                                delete data.updator;
                                delete data.update_time;
                                angular.extend(getCurrItem(), data);
                                $scope.initColumns();
                                getCurrItem().fin_bud_cost_month_lines = data.fin_bud_cost_lines;
                                $scope.gridOptions.hcApi.setRowData(getCurrItem().fin_bud_cost_month_lines);
                            });
                        })
                };
                /*-------------------通用查询结束---------------------*/


                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //计算月份分解金额
                function setCostAmtMonth(args) {
                    args.data.cost_amt_month1 = numberApi.toNumber(args.data.cost_xs_amt, 0) * numberApi.toNumber(args.data.sales_qty_month1);
                    args.data.cost_amt_month2 = numberApi.toNumber(args.data.cost_xs_amt, 0) * numberApi.toNumber(args.data.sales_qty_month2);
                    args.data.cost_amt_month3 = numberApi.toNumber(args.data.cost_xs_amt, 0) * numberApi.toNumber(args.data.sales_qty_month3);
                    args.data.cost_amt_month4 = numberApi.toNumber(args.data.cost_xs_amt, 0) * numberApi.toNumber(args.data.sales_qty_month4);

                    args.data.cost_amt_month5 = numberApi.toNumber(args.data.cost_xs_amt, 0) * numberApi.toNumber(args.data.sales_qty_month5);
                    args.data.cost_amt_month6 = numberApi.toNumber(args.data.cost_xs_amt, 0) * numberApi.toNumber(args.data.sales_qty_month6);
                    args.data.cost_amt_month7 = numberApi.toNumber(args.data.cost_xs_amt, 0) * numberApi.toNumber(args.data.sales_qty_month7);
                    args.data.cost_amt_month8 = numberApi.toNumber(args.data.cost_xs_amt, 0) * numberApi.toNumber(args.data.sales_qty_month8);

                    args.data.cost_amt_month9 = numberApi.toNumber(args.data.cost_xs_amt, 0) * numberApi.toNumber(args.data.sales_qty_month9);
                    args.data.cost_amt_month10 = numberApi.toNumber(args.data.cost_xs_amt, 0) * numberApi.toNumber(args.data.sales_qty_month10);
                    args.data.cost_amt_month11 = numberApi.toNumber(args.data.cost_xs_amt, 0) * numberApi.toNumber(args.data.sales_qty_month11);
                    args.data.cost_amt_month12 = numberApi.toNumber(args.data.cost_xs_amt, 0) * numberApi.toNumber(args.data.sales_qty_month12);

                }

                /**
                 * 计算合计数据
                 */
                $scope.calSum = function () {
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            sales_qty: numberApi.sum(getCurrItem().fin_bud_cost_month_lines, 'sales_qty'),
                            sales_qty_month1: numberApi.sum(getCurrItem().fin_bud_cost_month_lines, 'sales_qty_month1'),
                            cost_amt_month1: numberApi.sum(getCurrItem().fin_bud_cost_month_lines, 'cost_amt_month1'),
                            sales_qty_month2: numberApi.sum(getCurrItem().fin_bud_cost_month_lines, 'sales_qty_month2'),
                            cost_amt_month2: numberApi.sum(getCurrItem().fin_bud_cost_month_lines, 'cost_amt_month2'),
                            sales_qty_month3: numberApi.sum(getCurrItem().fin_bud_cost_month_lines, 'sales_qty_month3'),
                            cost_amt_month3: numberApi.sum(getCurrItem().fin_bud_cost_month_lines, 'cost_amt_month3'),
                            sales_qty_month4: numberApi.sum(getCurrItem().fin_bud_cost_month_lines, 'sales_qty_month4'),
                            cost_amt_month4: numberApi.sum(getCurrItem().fin_bud_cost_month_lines, 'cost_amt_month4'),
                            sales_qty_month5: numberApi.sum(getCurrItem().fin_bud_cost_month_lines, 'sales_qty_month5'),
                            cost_amt_month5: numberApi.sum(getCurrItem().fin_bud_cost_month_lines, 'cost_amt_month5'),
                            sales_qty_month6: numberApi.sum(getCurrItem().fin_bud_cost_month_lines, 'sales_qty_month6'),
                            cost_amt_month6: numberApi.sum(getCurrItem().fin_bud_cost_month_lines, 'cost_amt_month6'),
                            sales_qty_month7: numberApi.sum(getCurrItem().fin_bud_cost_month_lines, 'sales_qty_month7'),
                            cost_amt_month7: numberApi.sum(getCurrItem().fin_bud_cost_month_lines, 'cost_amt_month7'),
                            sales_qty_month8: numberApi.sum(getCurrItem().fin_bud_cost_month_lines, 'sales_qty_month8'),
                            cost_amt_month8: numberApi.sum(getCurrItem().fin_bud_cost_month_lines, 'cost_amt_month8'),
                            sales_qty_month9: numberApi.sum(getCurrItem().fin_bud_cost_month_lines, 'sales_qty_month9'),
                            cost_amt_month9: numberApi.sum(getCurrItem().fin_bud_cost_month_lines, 'cost_amt_month9'),
                            sales_qty_month10: numberApi.sum(getCurrItem().fin_bud_cost_month_lines, 'sales_qty_month10'),
                            cost_amt_month10: numberApi.sum(getCurrItem().fin_bud_cost_month_lines, 'cost_amt_month10'),
                            sales_qty_month11: numberApi.sum(getCurrItem().fin_bud_cost_month_lines, 'sales_qty_month11'),
                            cost_amt_month11: numberApi.sum(getCurrItem().fin_bud_cost_month_lines, 'cost_amt_month11'),
                            sales_qty_month12: numberApi.sum(getCurrItem().fin_bud_cost_month_lines, 'sales_qty_month12'),
                            cost_amt_month12: numberApi.sum(getCurrItem().fin_bud_cost_month_lines, 'cost_amt_month12')
                        }
                    ]);
                }


                $scope.validCheck = function (invalidBox) {
                    $scope.gridOptions.api.stopEditing();
                    $scope.hcSuper.validCheck(invalidBox);

                    if (getCurrItem().fin_bud_cost_month_lines.length == 0) {
                        invalidBox.push('请添加明细！');
                    }
                    var lineData = getCurrItem().fin_bud_cost_month_lines;
                    lineData.forEach(function (line, index) {
                        var row = index + 1;
                        if (!line.item_id)
                            invalidBox.push('第' + row + '行产品不能为空');
                        if (line.sales_qty !=
                            numberApi.sum(
                                line.sales_qty_month1,
                                line.sales_qty_month2,
                                line.sales_qty_month3,
                                line.sales_qty_month4,
                                line.sales_qty_month5,
                                line.sales_qty_month6,
                                line.sales_qty_month7,
                                line.sales_qty_month8,
                                line.sales_qty_month9,
                                line.sales_qty_month10,
                                line.sales_qty_month11,
                                line.sales_qty_month12
                            )) {
                            invalidBox.push('第' + row + '行1-12月分解销售数量之和不等于销售数量');
                        }
                    });
                };


                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData);
                    //bizData.bud_year = new Date().getFullYear()+1;
                    bizData.stat = 1;
                    bizData.create_time = new Date().Format('yyyy-MM-dd hh:mm:ss');
                    bizData.fin_bud_cost_month_lines = [];
                    $scope.gridOptions.hcApi.setRowData(bizData.fin_bud_cost_month_lines);
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.initColumns();
                    $scope.gridOptions.hcApi.setRowData(bizData.fin_bud_cost_month_lines);
                    $scope.calSum();
                };

                /**
                 * 初始化
                 */
                $scope.doInit = function () {
                    $scope.hcSuper.doInit();
                };

                $scope.initColumns = function () {
                    var columns = ['cost_amt', 'diff_amt', 'cost_rg_amt', 'cost_zz_amt'];
                    if (getCurrItem().cost_kind == 2) {
                        $scope.gridOptions.columnApi.setColumnsVisible(columns, false);
                    } else {
                        $scope.gridOptions.columnApi.setColumnsVisible(columns, true);
                    }
                }

                /**
                 * 批量导入
                 */
                $scope.batchImport = function () {
                    if (!getCurrItem().sales_bud_head_no) {
                        return swalApi.info('请先选择成本预算单');
                    }
                    var titleToField = {};

                    $.each($scope.gridOptions.columnDefs, function (index, item) {
                        if (item.children && item.children.length > 0) {
                            $.each(item.children, function (j, it) {
                                titleToField[$scope.gridOptions.columnDefs[index].headerName
                                + $scope.gridOptions.columnDefs[index].children[j].headerName]
                                    = $scope.gridOptions.columnDefs[index].children[j].field;
                            });
                        }
                    });

                    fileApi.chooseExcelAndGetData()
                        .then(function (excelData) {
                            var importLines = excelData.rows;
                            loopApi.forLoop(importLines.length, function (i) {
                                var data = {};
                                Object.keys(titleToField).forEach(function (key) {
                                    var field = titleToField[key];
                                    var value = importLines[i][key];
                                    data[field] = value;
                                });
                                angular.extend(getCurrItem().fin_bud_cost_month_lines[i], data);
                            });
                            $scope.gridOptions.hcApi.setRowData(getCurrItem().fin_bud_cost_month_lines);
                        }).then($scope.calSum);
                };


                /**
                 * 按钮
                 * @type {{title: string, click: click, hide: hide}}
                 */
                $scope.footerLeftButtons.batchImport = {
                    title: '批量导入',
                    click: function () {
                        $scope.batchImport && $scope.batchImport();
                    },
                    hide: function () {
                        return $scope.data.currItem.stat > 1;
                    }
                };

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
