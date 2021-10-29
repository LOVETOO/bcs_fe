/**
 * 销售预算编制-属性页
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
                        },
                        // {
                        //     headerName: '本年销售预计',
                        //     children: [
                        //         {
                        //             field: 'sales_price1',
                        //             headerName: '销售均价',
                        //             type: '金额'
                        //         },{
                        //             field: 'sales_qty1',
                        //             headerName: '销量',
                        //             type: '数量'
                        //         }
                        //         ,{
                        //             field: 'sales_amt1',
                        //             headerName: '销售金额',
                        //             type: '金额'
                        //         }
                        //     ]
                        // },
                        {
                            headerName: '明年销售预算',
                            children: [
                                {
                                    field: 'sales_qty2',
                                    headerName: '销量',
                                    type: '数量'
                                },
                                {
                                    field: 'sales_price2',
                                    headerName: '销售均价',
                                    type: '金额'
                                }, {
                                    field: 'sales_amt2',
                                    headerName: '销售金额',
                                    type: '金额'
                                }
                            ]
                        },
                        // {
                        //     headerName: '同比增长率',
                        //     children: [
                        //         {
                        //             field: 'growth_rate1',
                        //             headerName: '销售均价',
                        //             type: '百分比'
                        //         },{
                        //             field: 'growth_rate2',
                        //             headerName: '销量',
                        //             type: '百分比'
                        //         }
                        //         ,{
                        //             field: 'growth_rate3',
                        //             headerName: '销售金额',
                        //             type: '百分比'
                        //         }
                        //     ]
                        // },
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
                                        if (args.oldValue == args.newValue)
                                            return;
                                        setSalesAmtMonth(args);
                                        args.api.refreshCells();
                                    },
                                    type: '数量'
                                }
                                , {
                                    field: 'sales_amt_month1',
                                    headerName: '销售金额',
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
                                        if (args.oldValue == args.newValue)
                                            return;
                                        setSalesAmtMonth(args);
                                        args.api.refreshCells();
                                    },
                                    type: '数量'
                                }
                                , {
                                    field: 'sales_amt_month2',
                                    headerName: '销售金额',
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
                                        if (args.oldValue == args.newValue)
                                            return;
                                        setSalesAmtMonth(args);
                                        args.api.refreshCells();
                                    },
                                    type: '数量'
                                }
                                , {
                                    field: 'sales_amt_month3',
                                    headerName: '销售金额',
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
                                        if (args.oldValue == args.newValue)
                                            return;
                                        setSalesAmtMonth(args);
                                        args.api.refreshCells();
                                    },
                                    type: '数量'
                                }
                                , {
                                    field: 'sales_amt_month4',
                                    headerName: '销售金额',
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
                                        if (args.oldValue == args.newValue)
                                            return;
                                        setSalesAmtMonth(args);
                                        args.api.refreshCells();
                                    },
                                    type: '数量'
                                }
                                , {
                                    field: 'sales_amt_month5',
                                    headerName: '销售金额',
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
                                        if (args.oldValue == args.newValue)
                                            return;
                                        setSalesAmtMonth(args);
                                        args.api.refreshCells();
                                    },
                                    type: '数量'
                                }
                                , {
                                    field: 'sales_amt_month6',
                                    headerName: '销售金额',
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
                                        if (args.oldValue == args.newValue)
                                            return;
                                        setSalesAmtMonth(args);
                                        args.api.refreshCells();
                                    },
                                    type: '数量'
                                }
                                , {
                                    field: 'sales_amt_month7',
                                    headerName: '销售金额',
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
                                        if (args.oldValue == args.newValue)
                                            return;
                                        setSalesAmtMonth(args);
                                        args.api.refreshCells();
                                    },
                                    type: '数量'
                                }
                                , {
                                    field: 'sales_amt_month8',
                                    headerName: '销售金额',
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
                                        if (args.oldValue == args.newValue)
                                            return;
                                        setSalesAmtMonth(args);
                                        args.api.refreshCells();
                                    },
                                    type: '数量'
                                }
                                , {
                                    field: 'sales_amt_month9',
                                    headerName: '销售金额',
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
                                        if (args.oldValue == args.newValue)
                                            return;
                                        setSalesAmtMonth(args);
                                        args.api.refreshCells();
                                    },
                                    type: '数量'
                                }
                                , {
                                    field: 'sales_amt_month10',
                                    headerName: '销售金额',
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
                                        if (args.oldValue == args.newValue)
                                            return;
                                        setSalesAmtMonth(args);
                                        args.api.refreshCells();
                                    },
                                    type: '数量'
                                }
                                , {
                                    field: 'sales_amt_month11',
                                    headerName: '销售金额',
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
                                        if (args.oldValue == args.newValue)
                                            return;
                                        setSalesAmtMonth(args);
                                        args.api.refreshCells();
                                    },
                                    type: '数量'
                                }
                                , {
                                    field: 'sales_amt_month12',
                                    headerName: '销售金额',
                                    type: '金额'
                                }
                            ]
                        }
                        , {
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
                            classId: 'fin_bud_sales_head',
                            postData: {},
                            action: 'search',
                            title: "年度销售预算",
                            gridOptions: {
                                columnDefs: [{
                                    headerName: "预算单号",
                                    field: "sales_bud_head_no"
                                }, {
                                    headerName: "编制年度",
                                    field: "bud_year"
                                }]
                            }
                        })
                        .result//响应数据
                        .then(function (response) {
                            var postData = {
                                classId: "fin_bud_sales_head",
                                action: 'select',
                                data: {sales_bud_head_id: response.sales_bud_head_id}
                            };
                            requestApi.post(postData).then(function (data) {
                                delete data.creator;
                                delete data.create_time;
                                delete data.updator;
                                delete data.stat;
                                delete data.wfflag;
                                delete data.wfid;
                                delete data.update_time;
                                angular.extend(getCurrItem(), data);
                                getCurrItem().fin_bud_sales_month_lines = data.fin_bud_sales_lines;
                                $scope.gridOptions.hcApi.setRowData(getCurrItem().fin_bud_sales_month_lines);
                                $scope.initHeader();
                            });
                        })
                };
                /*-------------------通用查询结束---------------------*/


                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //计算月份分解金额
                function setSalesAmtMonth(args) {
                    args.data.sales_amt_month1 = numberApi.toNumber(args.data.sales_price2, 0) * numberApi.toNumber(args.data.sales_qty_month1);
                    args.data.sales_amt_month2 = numberApi.toNumber(args.data.sales_price2, 0) * numberApi.toNumber(args.data.sales_qty_month2);
                    args.data.sales_amt_month3 = numberApi.toNumber(args.data.sales_price2, 0) * numberApi.toNumber(args.data.sales_qty_month3);
                    args.data.sales_amt_month4 = numberApi.toNumber(args.data.sales_price2, 0) * numberApi.toNumber(args.data.sales_qty_month4);

                    args.data.sales_amt_month5 = numberApi.toNumber(args.data.sales_price2, 0) * numberApi.toNumber(args.data.sales_qty_month5);
                    args.data.sales_amt_month6 = numberApi.toNumber(args.data.sales_price2, 0) * numberApi.toNumber(args.data.sales_qty_month6);
                    args.data.sales_amt_month7 = numberApi.toNumber(args.data.sales_price2, 0) * numberApi.toNumber(args.data.sales_qty_month7);
                    args.data.sales_amt_month8 = numberApi.toNumber(args.data.sales_price2, 0) * numberApi.toNumber(args.data.sales_qty_month8);

                    args.data.sales_amt_month9 = numberApi.toNumber(args.data.sales_price2, 0) * numberApi.toNumber(args.data.sales_qty_month9);
                    args.data.sales_amt_month10 = numberApi.toNumber(args.data.sales_price2, 0) * numberApi.toNumber(args.data.sales_qty_month10);
                    args.data.sales_amt_month11 = numberApi.toNumber(args.data.sales_price2, 0) * numberApi.toNumber(args.data.sales_qty_month11);
                    args.data.sales_amt_month12 = numberApi.toNumber(args.data.sales_price2, 0) * numberApi.toNumber(args.data.sales_qty_month12);

                }


                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    checkData(invalidBox);
                };


                function checkData(reason) {
                    $scope.gridOptions.api.stopEditing();
                    if (getCurrItem().fin_bud_sales_month_lines.length == 0) {
                        reason.push('请添加明细！');
                    }
                    var lineData = getCurrItem().fin_bud_sales_month_lines;

                    lineData.forEach(function (line, index) {
                        var row = index + 1;
                        if (!line.item_id) {
                            reason.push('第' + row + '行产品不能为空');
                        }
                        if (line.sales_qty2 !=
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
                            reason.push('第' + row + '行分解销售数量之和不等于' + getCurrItem().bud_year + "预计销量");
                        }
                    });

                }

                /**
                 * 计算合计数据
                 */
                $scope.calSum = function () {
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            sales_qty2: numberApi.sum(getCurrItem().fin_bud_sales_month_lines, 'sales_qty2'),
                            sales_amt2: numberApi.sum(getCurrItem().fin_bud_sales_month_lines, 'sales_amt2'),

                            sales_qty_month1: numberApi.sum(getCurrItem().fin_bud_sales_month_lines, 'sales_qty_month1'),
                            sales_amt_month1: numberApi.sum(getCurrItem().fin_bud_sales_month_lines, 'sales_amt_month1'),
                            sales_qty_month2: numberApi.sum(getCurrItem().fin_bud_sales_month_lines, 'sales_qty_month2'),
                            sales_amt_month2: numberApi.sum(getCurrItem().fin_bud_sales_month_lines, 'sales_amt_month2'),

                            sales_qty_month3: numberApi.sum(getCurrItem().fin_bud_sales_month_lines, 'sales_qty_month3'),
                            sales_amt_month3: numberApi.sum(getCurrItem().fin_bud_sales_month_lines, 'sales_amt_month3'),
                            sales_qty_month4: numberApi.sum(getCurrItem().fin_bud_sales_month_lines, 'sales_qty_month4'),
                            sales_amt_month4: numberApi.sum(getCurrItem().fin_bud_sales_month_lines, 'sales_amt_month4'),

                            sales_qty_month5: numberApi.sum(getCurrItem().fin_bud_sales_month_lines, 'sales_qty_month5'),
                            sales_amt_month5: numberApi.sum(getCurrItem().fin_bud_sales_month_lines, 'sales_amt_month5'),
                            sales_qty_month6: numberApi.sum(getCurrItem().fin_bud_sales_month_lines, 'sales_qty_month6'),
                            sales_amt_month6: numberApi.sum(getCurrItem().fin_bud_sales_month_lines, 'sales_amt_month6'),

                            sales_qty_month7: numberApi.sum(getCurrItem().fin_bud_sales_month_lines, 'sales_qty_month7'),
                            sales_amt_month7: numberApi.sum(getCurrItem().fin_bud_sales_month_lines, 'sales_amt_month7'),
                            sales_qty_month8: numberApi.sum(getCurrItem().fin_bud_sales_month_lines, 'sales_qty_month8'),
                            sales_amt_month8: numberApi.sum(getCurrItem().fin_bud_sales_month_lines, 'sales_amt_month8'),

                            sales_qty_month9: numberApi.sum(getCurrItem().fin_bud_sales_month_lines, 'sales_qty_month9'),
                            sales_amt_month9: numberApi.sum(getCurrItem().fin_bud_sales_month_lines, 'sales_amt_month9'),
                            sales_qty_month10: numberApi.sum(getCurrItem().fin_bud_sales_month_lines, 'sales_qty_month10'),
                            sales_amt_month10: numberApi.sum(getCurrItem().fin_bud_sales_month_lines, 'sales_amt_month10'),

                            sales_qty_month11: numberApi.sum(getCurrItem().fin_bud_sales_month_lines, 'sales_qty_month11'),
                            sales_amt_month11: numberApi.sum(getCurrItem().fin_bud_sales_month_lines, 'sales_amt_month11'),
                            sales_qty_month12: numberApi.sum(getCurrItem().fin_bud_sales_month_lines, 'sales_qty_month12'),
                            sales_amt_month12: numberApi.sum(getCurrItem().fin_bud_sales_month_lines, 'sales_amt_month12')

                        }
                    ]);
                };

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData);
                    bizData.bud_year = new Date().getFullYear() + 1;
                    bizData.stat = 1;
                    bizData.create_time = new Date().Format('yyyy-MM-dd hh:mm:ss');
                    bizData.fin_bud_sales_month_lines = [];
                    $scope.gridOptions.hcApi.setRowData(bizData.fin_bud_sales_month_lines);
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.fin_bud_sales_month_lines);
                    $scope.calSum();
                };

                /**
                 * 初始化
                 */
                $scope.doInit = function () {
                    $scope.hcSuper.doInit().then($scope.initHeader).then(function () {
                        $scope.gridOptions.columnApi.autoSizeAllColumns();
                    });
                };

                /**
                 * 初始化表头
                 */
                $scope.initHeader = function () {
                    $scope.gridOptions.columnDefs[5].headerName = getCurrItem().bud_year + "销售预算";
                    $scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs);
                }

                /**
                 * 批量导入
                 */
                $scope.batchImport = function () {
                    if (!getCurrItem().sales_bud_head_no) {
                        return swalApi.info('请先选择销售预算单');
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
                                angular.extend(getCurrItem().fin_bud_sales_month_lines[i], data);
                            });
                            $scope.gridOptions.hcApi.setRowData($scope.data.currItem.fin_bud_sales_month_lines);
                        }).then($scope.calSum);
                };


                $scope.setPercent = function () {
                    var tasks = [];
                    //取行
                    $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                        var data = node.data;
                        tasks.push({node: node, data: data});
                    });
                    tasks.forEach(function (value) {
                        $scope.searchPercent(value).then(function (result) {
                            // if(result.percents.length>0){
                            //     var percent = result.percents[0];
                            //     var month_1_11_qty = numberApi.divide(value.data.sales_qty2,12).toFixed(0);
                            //     var month_12_qty = numberApi.sum(value.data.sales_qty2,-numberApi.mutiply(month_1_11_qty,11));
                            //     var month_1_11_amt = numberApi.mutiply(value.data.sales_price2,month_1_11_qty);
                            //     var month_12_amt = numberApi.mutiply(value.data.sales_price2,month_12_qty);
                            //     $scope.gridOptions.columnDefs.forEach(function (field,index) {
                            //         if(index>5&&index<17){
                            //             value.data[field.children[0].field] = month_1_11_qty;
                            //             value.data[field.children[1].field] = month_1_11_amt;
                            //         }else if(index == 17){
                            //             value.data[field.children[0].field] = month_12_qty;
                            //             value.data[field.children[1].field] =  month_12_amt;
                            //         }
                            //     });
                            // }
                            if (result.percents.length > 0) {
                                var percent = result.percents[0];
                                //按月度 1-11月费用金额按进度比例分解，有小数点的四舍五入保留两位小数，12月=总费用-（1-11月费用）
                                var total_qty_1_11 = 0, total_amt_1_11 = 0;
                                var idx = 0;
                                $scope.gridOptions.columnDefs.forEach(function (field, index) {
                                    if (index > 5 && index < 17) {
                                        idx++;
                                        value.data[field.children[0].field] =
                                            numberApi.mutiply(value.data.sales_qty2, percent["percent_month" + idx]).toFixed(0);
                                        value.data[field.children[1].field] =
                                            numberApi.mutiply(value.data.sales_price2, value.data[field.children[0].field]).toFixed(2);
                                        total_qty_1_11 = numberApi.sum(total_qty_1_11, value.data[field.children[0].field]);
                                        total_amt_1_11 = numberApi.sum(total_amt_1_11, value.data[field.children[1].field]);

                                    } else if (index == 17) {
                                        value.data[field.children[0].field] = numberApi.sum(value.data.sales_qty2, -total_qty_1_11);
                                        value.data[field.children[1].field] = numberApi.sum(value.data.sales_amt2, -total_amt_1_11);
                                    }
                                });
                            }
                            return result;
                        }).then(function (v) {
                            $scope.gridOptions.api.refreshCells({
                                rowNodes: [v.node]
                            });
                        })
                    });

                }

                //查询预算进度
                $scope.searchPercent = function (value) {
                    var postData = {
                        classId: "month_bud_percent",
                        action: 'search',
                        data: {
                            dept_id: $scope.data.currItem.org_id,
                            bud_year: $scope.data.currItem.bud_year,
                            crm_entid: value.data.crm_entid
                        }
                    };
                    return requestApi.post(postData).then(
                        function (data) {
                            value.percents = data.month_bud_percents;
                            return value;
                        }
                    );
                }


                /**
                 * 按钮
                 * @type {{title: string, click: click, hide: hide}}
                 */
                $scope.footerLeftButtons = {
                    batchImport: {
                        title: '批量导入',
                        click: function () {
                            $scope.batchImport && $scope.batchImport();
                        },
                        hide: function () {
                            return $scope.data.currItem.stat > 1;
                        }
                    },
                    setPercent: {
                        title: '按进度分解',
                        click: function () {
                            $scope.setPercent && $scope.setPercent();
                        },
                        hide: function () {
                            return $scope.data.currItem.stat > 1;
                        }
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
