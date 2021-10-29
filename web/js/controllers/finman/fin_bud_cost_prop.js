/**
 * 成本预算编制-属性页
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
                            editable: function (args) {
                                return editable(args)
                            },
                            pinned: 'left',
                            onCellDoubleClicked: function (args) {
                                $scope.chooseItem(args);
                            },
                            onCellValueChanged: function (args) {

                                if (args.newValue === args.oldValue)
                                    return;

                                getItem(args.newValue)
                                    .catch(function (reason) {
                                        return {
                                            item_id: 0,
                                            item_code: '',
                                            item_name: reason
                                        };
                                    })
                                    .then(function (line) {
                                        angular.extend(args.data, line);
                                        return args.data.item_id;
                                    })
                                    .then(getItemCostAmt)
                                    .then(function (amt) {
                                        args.data.cost_amt = amt;
                                        args.api.refreshCells();
                                    });
                            }
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
                        }
                        , {
                            field: 'sales_qty',
                            headerName: '销售数量',
                            editable: function (args) {
                                return editable(args)
                            },
                            onCellValueChanged: function (args) {
                                setSaleQty(args);
                            },
                            type: '数量'
                        },
                        {
                            field: 'sales_price',
                            headerName: '销售单价',
                            editable: function (args) {
                                return editable(args)
                            },
                            onCellValueChanged: function (args) {
                                if (getCurrItem().cost_kind == 1) {
                                    setCostRgAmt(args);
                                    setCostZzAmt(args);
                                    setXsAmt(args);
                                    args.api.refreshCells();
                                }
                            },
                            type: '金额'
                        },
                        {
                            id: "cost_amt",
                            field: 'cost_amt',
                            headerName: '预算材料成本/单台',
                            // editable : function (args) {
                            //     return editable(args)
                            // },
                            onCellValueChanged: function (args) {
                                setDiffAmt(args);
                                setCostRgAmt(args);
                                setCostZzAmt(args);
                                setXsAmt(args);
                                args.api.refreshCells();
                            },
                            type: '金额'
                        },
                        {
                            id: "diff_amt",
                            field: 'diff_amt',
                            headerName: '预计材料成本差异金额/单台',
                            type: '金额'
                        },
                        {
                            id: "cost_rg_amt",
                            field: 'cost_rg_amt',
                            headerName: '预算人工成本/单台',
                            type: '金额',
                            editable: editable,
                            onCellValueChanged: function (args) {
                                if (getCurrItem().cost_kind == 1) {
                                    setXsAmt(args);
                                    args.api.refreshCells();
                                }
                            }
                        },
                        {
                            id: "cost_zz_amt",
                            field: 'cost_zz_amt',
                            headerName: '预算制造费用/单台',
                            type: '金额',
                            editable: editable,
                            onCellValueChanged: function (args) {
                                if (getCurrItem().cost_kind == 1) {
                                    setXsAmt(args);
                                    args.api.refreshCells();
                                }
                            }
                        },
                        {
                            field: 'cost_xs_amt',
                            headerName: '销售成本/单台',
                            type: '金额',
                            editable: function (args) {
                                return editable(args) && getCurrItem().cost_kind == 2;
                            },
                            onCellValueChanged: function (args) {
                                setHeadTotalAmt();
                            }
                        },
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
                 * 查部门
                 */

                //$scope.chooseOrg = function () {
                //    $modal.openCommonSearch({
                //            classId: 'dept',
                //            postdata: {sqlwhere: "isfeecenter = 2"},
                //        })
                //        .result//响应数据
                //        .then(function (result) {
                //            $scope.data.currItem.org_id = result.dept_id;
                //            $scope.data.currItem.org_code = result.dept_code;
                //            $scope.data.currItem.org_name = result.dept_name;
                //            $scope.getSalesBudLine();
                //        });
                //};

                /**
                 * 查产品
                 */
                $scope.chooseItem = function (args) {
                    $modal.openCommonSearch({
                            classId: 'item_org',
                            postData: {},
                            action: 'search',
                            title: "产品资料",
                            gridOptions: {
                                columnDefs: [{
                                    headerName: "产品编码",
                                    field: "item_code"
                                }, {
                                    headerName: "产品名称",
                                    field: "item_name"
                                }, {
                                    headerName: "计量单位",
                                    field: "uom_name"
                                }]
                            }
                        })
                        .result//响应数据
                        .then(function (result) {
                            if (checkItem(result.item_code)) {
                                return swalApi.info("产品已存在列表中，不能重复添加！");
                            }
                            args.data.item_id = result.item_id;
                            args.data.item_code = result.item_code;
                            args.data.item_name = result.item_name;
                            args.data.uom_id = result.uom_id;
                            args.data.uom_name = result.uom_name;
                            args.data.crm_entid = result.crm_entid;
                            return args.data.item_id
                        }).then(getItemCostAmt).then(function (amt) {
                        args.data.cost_amt = amt;
                        args.api.refreshView();
                    })
                };

                function checkItem(item_code) {
                    var flag = false;
                    getCurrItem().fin_bud_cost_lines.forEach(function (value) {
                        if (value.item_code == item_code && value.item_id > 0) {
                            flag = true;
                            return false;
                        }
                    });
                    return flag;
                }

                function getItem(code) {
                    if (checkItem(code)) {
                        return $q.reject("产品已存在列表中，不能重复添加！");
                    }
                    var postData = {
                        classId: "item_org",
                        action: 'search',
                        data: {sqlwhere: "item_code = '" + code + "'"}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            if (data.item_orgs.length > 0) {
                                return data.item_orgs[0];
                            } else {
                                return $q.reject("产品编码【" + code + "】不可用");
                            }
                        });
                }

                function getItemCostAmt(item_id) {
                    var postData = {
                        classId: "fin_bud_material_cost_head",
                        action: 'getcostbud',
                        data: {item_id: item_id, bud_year: $scope.data.currItem.bud_year}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            return data.bud_material_cost;
                        });
                }

                /**
                 * 设置行销售成本/单台
                 * @param args
                 */
                function setXsAmt(args) {
                    if (getCurrItem().cost_kind == 1) {
                        var cost_amt = numberApi.toNumber(args.data.cost_amt, 0);
                        var diff_amt = numberApi.toNumber(args.data.diff_amt, 0);
                        var cost_rg_amt = numberApi.toNumber(args.data.cost_rg_amt, 0);
                        var cost_zz_amt = numberApi.toNumber(args.data.cost_zz_amt, 0);
                        args.data.cost_xs_amt = numberApi.sum(cost_amt, diff_amt, cost_rg_amt, cost_zz_amt);
                    } else {
                        args.data.cost_xs_amt = numberApi.mutiply(args.data.sales_qty, args.data.sales_price);
                    }

                    setHeadTotalAmt();
                }

                /**
                 * 设置行销售成本/单台
                 * @param args
                 */
                function setXsAmt_v2(item) {
                    var cost_amt = numberApi.toNumber(item.cost_amt, 0);
                    var diff_amt = numberApi.toNumber(item.diff_amt, 0);
                    var cost_rg_amt = numberApi.toNumber(item.cost_rg_amt, 0);
                    var cost_zz_amt = numberApi.toNumber(item.cost_zz_amt, 0);
                    item.cost_xs_amt = numberApi.sum(cost_amt, diff_amt, cost_rg_amt, cost_zz_amt);
                }

                /**
                 * 设置表头 预算销售总量
                 * @param args
                 */
                function setSaleQty(args) {
                    getCurrItem().total_sales_qty = numberApi.sum(getCurrItem().fin_bud_cost_lines, "sales_qty");
                    setHeadTotalAmt();
                }

                /**
                 * 设置行 预计材料成本差异金额/单台
                 * @param args
                 */
                function setDiffAmt(args) {
                    var cost_amt = numberApi.toNumber(args.data.cost_amt, 0);
                    args.data.diff_amt = cost_amt * numberApi.toNumber(getCurrItem().cost_diff_rate);
                }

                /**
                 * 设置行 预算人工成本/单台
                 * @param args
                 */
                function setCostRgAmt(args) {
                    if (getCurrItem().cost_type == 1) {//材料成本方式
                        var cost_amt = numberApi.toNumber(args.data.cost_amt, 0);
                        args.data.cost_rg_amt = cost_amt * numberApi.toNumber(getCurrItem().cost_rg_rate, 0);
                    }

                    if (getCurrItem().cost_type == 2) {//销售收入方式
                        var sales_price = numberApi.toNumber(args.data.sales_price, 0);
                        args.data.cost_rg_amt = sales_price * numberApi.toNumber(getCurrItem().cost_rg_rate, 0);
                    }
                }

                /**
                 * 设置行 预算制造费用/单台
                 * @param args
                 */
                function setCostZzAmt(args) {
                    if (getCurrItem().cost_type == 1) {//材料成本方式
                        var cost_amt = numberApi.toNumber(args.data.cost_amt, 0);
                        args.data.cost_zz_amt = cost_amt * numberApi.toNumber(getCurrItem().fee_zz_rate, 0);
                    }

                    if (getCurrItem().cost_type == 2) {//销售收入方式
                        var sales_price = numberApi.toNumber(args.data.sales_price, 0);
                        args.data.cost_zz_amt = sales_price * numberApi.toNumber(getCurrItem().fee_zz_rate, 0);
                    }
                }


                /**
                 * 表头差异率改变触发明细重新计算差异金额
                 */
                $scope.onDiffRateChange = function () {
                    $.each(getCurrItem().fin_bud_cost_lines, function (index, item) {
                        var cost_amt = numberApi.toNumber(item.cost_amt, 0);
                        item.diff_amt = cost_amt * numberApi.toNumber(getCurrItem().cost_diff_rate);

                        setXsAmt_v2(item);
                    });
                    setHeadTotalAmt();
                    $scope.gridOptions.api.redrawRows();
                }

                /**
                 * 表头人工成本率改变触发明细重新计算人工成本
                 */
                $scope.onRgRateChange = function () {
                    if (getCurrItem().cost_type == 1) {
                        $.each(getCurrItem().fin_bud_cost_lines, function (index, item) {
                            var cost_amt = numberApi.toNumber(item.cost_amt, 0);
                            item.cost_rg_amt = cost_amt * numberApi.toNumber(getCurrItem().cost_rg_rate);

                            setXsAmt_v2(item);
                        });
                    }
                    if (getCurrItem().cost_type == 2) {
                        $.each(getCurrItem().fin_bud_cost_lines, function (index, item) {
                            var sales_price = numberApi.toNumber(item.sales_price, 0);
                            item.cost_rg_amt = sales_price * numberApi.toNumber(getCurrItem().cost_rg_rate);

                            setXsAmt_v2(item);
                        });
                    }
                    setHeadTotalAmt();
                    $scope.gridOptions.api.redrawRows();
                }

                /**
                 * 计算合计数据
                 */
                $scope.calSum = function () {
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            sales_qty: numberApi.sum(getCurrItem().fin_bud_cost_lines, 'sales_qty'),

                        }
                    ]);
                }

                /**
                 * 表头制造费用率改变触发明细重新计算制造费用
                 */
                $scope.onZzRateChange = function () {
                    if (getCurrItem().cost_type == 1) {
                        $.each(getCurrItem().fin_bud_cost_lines, function (index, item) {
                            var cost_amt = numberApi.toNumber(item.cost_amt, 0);
                            item.cost_zz_amt = cost_amt * numberApi.toNumber(getCurrItem().fee_zz_rate);

                            setXsAmt_v2(item);
                        });
                    }
                    if (getCurrItem().cost_type == 2) {
                        $.each(getCurrItem().fin_bud_cost_lines, function (index, item) {
                            var sales_price = numberApi.toNumber(item.sales_price, 0);
                            item.cost_zz_amt = sales_price * numberApi.toNumber(getCurrItem().fee_zz_rate);

                            setXsAmt_v2(item);
                        });
                    }
                    setHeadTotalAmt();
                    $scope.gridOptions.api.redrawRows();
                }

                $scope.onCostTypeChange = function () {
                    if (getCurrItem().cost_type == 1) {
                        $.each(getCurrItem().fin_bud_cost_lines, function (index, item) {
                            var cost_amt = numberApi.toNumber(item.cost_amt, 0);
                            item.cost_zz_amt = cost_amt * numberApi.toNumber(getCurrItem().fee_zz_rate);
                            item.cost_rg_amt = cost_amt * numberApi.toNumber(getCurrItem().cost_rg_rate);
                            setXsAmt_v2(item);
                        });
                    }
                    if (getCurrItem().cost_type == 2) {
                        $.each(getCurrItem().fin_bud_cost_lines, function (index, item) {
                            var sales_price = numberApi.toNumber(item.sales_price, 0);
                            item.cost_zz_amt = sales_price * numberApi.toNumber(getCurrItem().fee_zz_rate);
                            item.cost_rg_amt = sales_price * numberApi.toNumber(getCurrItem().cost_rg_rate);
                            setXsAmt_v2(item);
                        });
                    }
                    setHeadTotalAmt();
                    $scope.gridOptions.api.redrawRows();
                }

                /**
                 * 求和表头合计金额
                 */
                function setHeadTotalAmt() {
                    var cost_cl_amt = 0;
                    var cost_diff_amt = 0;
                    var fee_zz_amt = 0;
                    var cost_rg_amt = 0;
                    var cost_xs_amt = 0;
                    var total_sales_qty = 0;
                    $.each(getCurrItem().fin_bud_cost_lines, function (index, item) {
                        if (getCurrItem().cost_kind == 1) {
                            cost_cl_amt = cost_cl_amt + numberApi.toNumber(item.cost_amt, 0) * numberApi.toNumber(item.sales_qty, 0);
                            cost_diff_amt = cost_diff_amt + numberApi.toNumber(item.diff_amt, 0) * numberApi.toNumber(item.sales_qty, 0);
                            fee_zz_amt = fee_zz_amt + numberApi.toNumber(item.cost_zz_amt, 0) * numberApi.toNumber(item.sales_qty, 0);
                            cost_rg_amt = cost_rg_amt + numberApi.toNumber(item.cost_rg_amt, 0) * numberApi.toNumber(item.sales_qty, 0);
                            total_sales_qty += numberApi.toNumber(item.sales_qty, 0);
                        } else {
                            cost_xs_amt = cost_xs_amt + numberApi.mutiply(item.cost_xs_amt, item.sales_qty);
                        }

                    });
                    if (getCurrItem().cost_kind == 1)
                        cost_xs_amt = numberApi.sum(cost_cl_amt, cost_diff_amt, fee_zz_amt, cost_rg_amt);

                    getCurrItem().cost_cl_amt = cost_cl_amt;
                    getCurrItem().cost_diff_amt = cost_diff_amt;
                    getCurrItem().fee_zz_amt = fee_zz_amt;
                    getCurrItem().cost_rg_amt = cost_rg_amt;
                    getCurrItem().total_cost_amt = cost_xs_amt;
                    getCurrItem().total_sales_qty = total_sales_qty;
                }

                //获取销售预算编制明细
                $scope.getSalesBudLine = function () {
                    if (getCurrItem().bud_year && !isNaN(getCurrItem().bud_year) && getCurrItem().bud_year > 0) {
                        var postData = {
                            classId: "fin_bud_sales_head",
                            action: 'getSalesBudLine',
                            data: {bud_year: getCurrItem().bud_year}
                        };
                        return requestApi.post(postData)
                            .then(function (data) {
                                if (data.fin_bud_sales_lines.length > 0) {
                                    getCurrItem().fin_bud_cost_lines = data.fin_bud_sales_lines;
                                } else {
                                    swalApi.info('未找到' + getCurrItem().bud_year + '年销售预算数据！');
                                    getCurrItem().fin_bud_cost_lines = [];
                                }
                                $scope.gridOptions.hcApi.setRowData(getCurrItem().fin_bud_cost_lines);
                                setHeadTotalAmt();
                            });
                    }
                }

                /**
                 * 获取销售预算明细 和 公司销售目标
                 */
                $scope.onBudYearChange = function () {
                    $scope.getSalesBudLine();
                    getCompStrategyAmt();
                }


                $scope.initColumns = function () {


                    $scope.gridOptions.columnDefs.forEach(function (c) {
                        if (getCurrItem().cost_kind == 2) {
                            if (c.field == 'cost_xs_amt') {
                                c.headerName = "采购成本/单台"
                            }
                        } else {
                            if (c.field == 'cost_xs_amt') {
                                c.headerName = "销售成本/单台"
                            }
                        }
                    });
                    $scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs);
                    var columns = ['cost_amt', 'diff_amt', 'cost_rg_amt', 'cost_zz_amt'];
                    if (getCurrItem().cost_kind == 2) {
                        $scope.gridOptions.columnApi.setColumnsVisible(columns, false);
                    } else {
                        $scope.gridOptions.columnApi.setColumnsVisible(columns, true);
                    }
                }

                $scope.onCostKindChange = function () {
                    $scope.initColumns();
                    $scope.getSalesBudLine();
                }

                /*-------------------通用查询结束---------------------*/


                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });


                $scope.validCheck = function (invalidBox) {
                    $scope.gridOptions.api.stopEditing();

                    $scope.hcSuper.validCheck(invalidBox);

                    if (getCurrItem().fin_bud_cost_lines.length == 0) {
                        invalidBox.push('请添加明细！');
                    }
                    var lineData = getCurrItem().fin_bud_cost_lines;
                    lineData.forEach(function (line, index) {
                        var row = index + 1;
                        if (!line.item_id)
                            invalidBox.push('第' + row + '行产品不能为空');
                    });
                };


                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData);
                    bizData.bud_year = new Date().getFullYear() + 1;
                    bizData.stat = 1;
                    bizData.cost_kind = 1;
                    bizData.create_time = new Date().Format('yyyy-MM-dd hh:mm:ss');
                    bizData.fin_bud_cost_lines = [];
                    $scope.gridOptions.hcApi.setRowData(bizData.fin_bud_cost_lines);
                    getCompStrategyAmt();
                    $scope.getSalesBudLine();
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.fin_bud_cost_lines);
                    $scope.initColumns();
                    $scope.calSum();
                };

                /**
                 * 初始化
                 */
                $scope.doInit = function () {
                    $scope.hcSuper.doInit();
                };


                /**
                 * 获取公司年度销售目标
                 * @param code
                 */
                function getCompStrategyAmt() {
                    if (getCurrItem().bud_year && !isNaN(getCurrItem().bud_year) && getCurrItem().bud_year > 0) {
                        var postData = {
                            classId: "fin_strategy_target_exp_head",
                            action: 'getstrategyamt',
                            data: {strategy_year: getCurrItem().bud_year, flag: 1}
                        };
                        return requestApi.post(postData)
                            .then(function (data) {
                                getCurrItem().comp_target_salesamt = data.total_sale_in_amt;
                            });
                    }
                }

                /**
                 * 增加行
                 */
                $scope.add_line = function () {
                    $scope.gridOptions.api.stopEditing();
                    swal({
                        title: '请输入要增加的行数',
                        type: 'input', //类型为输入框
                        inputValue: 1, //输入框默认值
                        closeOnConfirm: false, //点击确认不关闭，由后续代码判断是否关闭
                        showCancelButton: true //显示【取消】按钮
                    }, function (inputValue) {
                        if (inputValue === false) {
                            swal.close();
                            return;
                        }

                        var rowCount = Number(inputValue);
                        if (rowCount <= 0) {
                            swal.showInputError('请输入有效的行数');
                            return;
                        }
                        else if (rowCount > 1000) {
                            swal.showInputError('请勿输入过大的行数(1000以内为宜)');
                            return;
                        }

                        swal.close();

                        var data = getCurrItem().fin_bud_cost_lines;

                        for (var i = 0; i < rowCount; i++) {
                            var newLine = {};
                            data.push(newLine);
                        }

                        $scope.gridOptions.hcApi.setRowData(data);
                        $scope.gridOptions.hcApi.setFocusedCell(data.length - rowCount, 'item_code');
                    });
                };

                /**
                 * 删除行
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        getCurrItem().fin_bud_cost_lines.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData(getCurrItem().fin_bud_cost_lines);
                        setHeadTotalAmt();
                    }
                };


                //底部左边按钮
                $scope.footerLeftButtons.add_line = {
                    title: '增加行',
                    click: function () {
                        $scope.add_line && $scope.add_line();
                    },
                    hide: function () {
                        return $scope.data.currItem.stat > 1;
                    }
                };
                $scope.footerLeftButtons.del_line = {
                    title: '删除行',
                    click: function () {
                        $scope.del_line && $scope.del_line();
                    },
                    hide: function () {
                        return $scope.data.currItem.stat > 1;
                    }
                };

                /**
                 * 批量导入
                 */
                $scope.batchImport = function () {

                    var titleToField = {};
                    $.each($scope.gridOptions.columnDefs, function (index, item) {
                        titleToField[$scope.gridOptions.columnDefs[index].headerName]
                            = $scope.gridOptions.columnDefs[index].field;
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
                                getCurrItem().fin_bud_cost_lines.push(data);
                            });
                        }).then(function () {
                        var postData = {
                            classId: "fin_bud_cost_head",
                            action: 'checkdata',
                            data: {fin_bud_cost_lines: getCurrItem().fin_bud_cost_lines}
                        };
                        return requestApi.post(postData)
                            .then(function (data) {
                                getCurrItem().fin_bud_cost_lines = data.fin_bud_cost_lines;
                                $scope.gridOptions.hcApi.setRowData(getCurrItem().fin_bud_cost_lines);
                                setHeadTotalAmt();
                            });
                    });

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
