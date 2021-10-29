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


                function editable(args) {
                    if (!arguments[0].node.id) {
                        return false;
                    }
                    if ($scope.data.currItem.stat == 1 && (args.data.salesdata_line_id == undefined || args.data.salesdata_line_id == 0))
                        return true;
                    return false;
                }

                function editable_v1(args) {
                    if ($scope.data.currItem.stat == 1)
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
                                if (editable(args)) {
                                    $scope.chooseItem(args).then(function (args) {
                                        args.api.refreshView();
                                    });
                                }

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
                        },
                        {
                            headerName: '本年销售预计',
                            children: [
                                {
                                    field: 'sales_qty1',
                                    headerName: '销量',
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        setRate2(args);
                                        setAmt1(args);
                                        setRate3(args);
                                        args.api.refreshCells();
                                    },
                                    type: '数量'
                                },
                                {
                                    field: 'sales_price1',
                                    headerName: '销售均价',
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        setRate1(args);
                                        setAmt1(args);
                                        setRate3(args);
                                        args.api.refreshCells();
                                    },
                                    type: '金额'
                                }, {
                                    field: 'sales_amt1',
                                    headerName: '销售金额',
                                    // editable : function (args) {
                                    //     return editable(args)
                                    // },
                                    // onCellValueChanged:function (args) {
                                    //     setRate3(args);
                                    //     args.api.refreshCells();
                                    // },
                                    type: '金额'
                                }
                            ]
                        },
                        {
                            headerName: '明年销售预计',
                            children: [
                                {
                                    field: 'sales_qty2',
                                    headerName: '销量',
                                    editable: function (args) {
                                        return editable_v1(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        setRateQu5(args);
                                        setAmt2(args);
                                        setRate3(args);
                                        setSaleQtyAndAmt();
                                        setProductSalesShare();
                                        args.api.refreshCells();
                                    },
                                    type: '数量'
                                },
                                {
                                    field: 'sales_price2',
                                    headerName: '销售均价',
                                    editable: function (args) {
                                        return editable_v1(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        setRate1(args);
                                        setAmt2(args);
                                        setRate3(args);
                                        setSaleQtyAndAmt();
                                        setProductSalesShare();
                                        args.api.refreshCells();
                                    },
                                    type: '金额'
                                }, {
                                    field: 'sales_amt2',
                                    headerName: '销售金额',
                                    // editable : function (args) {
                                    //     return editable_v1(args)
                                    // },
                                    // onCellValueChanged:function (args) {
                                    //     setRate3(args);
                                    //     setSaleQtyAndAmt();
                                    //     args.api.refreshCells();
                                    // },
                                    type: '金额'
                                }
                            ]
                        },
                        {
                            field: 'product_sales_share',
                            headerName: '产品销售占比',
                            type: '百分比'
                        },
                        {
                            headerName: '同比增长率',
                            children: [
                                {
                                    field: 'growth_rate2',
                                    headerName: '销量',
                                    editable: function (args) {
                                        return editable_v1(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        setRateTong(args);
                                        setAmt2(args);
                                        setSaleQtyAndAmt();
                                        setProductSalesShare();
                                        setRate3(args);
                                        args.api.refreshCells();
                                    },
                                    type: '百分比'
                                },
                                {
                                    field: 'growth_rate1',
                                    headerName: '销售均价',
                                    editable: function (args) {
                                        return editable_v1(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        setRateTong3(args);
                                        setAmt2(args);
                                        setSaleQtyAndAmt();
                                        setProductSalesShare();
                                        setRate3(args);
                                        args.api.refreshCells();
                                    },
                                    type: '百分比'
                                }, {
                                    field: 'growth_rate3',
                                    headerName: '销售金额',
                                    type: '百分比'
                                }
                            ]
                        }
                        , {
                            field: 'note',
                            headerName: '说明',
                            editable: function (args) {
                                return editable_v1(args)
                            }
                        }
                    ]
                };

                /*-------------------数据定义结束------------------------*/

                /*-------------------通用查询开始------------------------*/
                /**
                 * 查部门
                 */
                $scope.chooseOrg = function () {
                    $modal.openCommonSearch({
                            classId: 'dept',
                            sqlWhere: "isfeecenter = 2"
                        })
                        .result//响应数据
                        .then(function (response) {
                            $scope.data.currItem.org_id = response.dept_id;
                            $scope.data.currItem.org_code = response.dept_code;
                            $scope.data.currItem.org_name = response.dept_name;
                            getCompStrategyAmt();
                            getDeptStrategyAmt();
                            getSalesDataLine();
                        });
                };


                //获取销售预算编制明细
                function getSalesDataLine() {
                    if ($scope.data.currItem.org_id && !isNaN($scope.data.currItem.org_id) && $scope.data.currItem.org_id > 0
                        && $scope.data.currItem.bud_year && !isNaN($scope.data.currItem.bud_year) && $scope.data.currItem.bud_year > 0) {
                        var postData = {
                            classId: "fin_salesdata_head",
                            action: 'getsalesdataline',
                            data: {org_id: $scope.data.currItem.org_id, sales_year: $scope.data.currItem.bud_year}
                        };
                        return requestApi.post(postData)
                            .then(function (data) {
                                if (data.fin_salesdata_lines.length > 0) {
                                    $scope.data.currItem.fin_bud_sales_lines = data.fin_salesdata_lines;
                                } else {
                                    swalApi.info('未找到' + $scope.data.currItem.bud_year + '年的历史销售数据！');
                                    $scope.data.currItem.fin_bud_sales_lines = [];
                                }
                                $scope.gridOptions.hcApi.setRowData($scope.data.currItem.fin_bud_sales_lines);
                                setSaleQtyAndAmt();
                            });
                    }
                }

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
                        .then(function (response) {
                            if (checkItem(response.item_code)) {
                                return swalApi.info("产品已存在列表中，不能重复添加！");
                            }
                            args.data.item_id = response.item_id;
                            args.data.item_code = response.item_code;
                            args.data.item_name = response.item_name;
                            args.data.uom_id = response.uom_id;
                            args.data.uom_name = response.uom_name;
                            args.data.crm_entid = response.crm_entid;
                            return args;
                        });
                };
                function checkItem(item_code) {
                    var flag = false;
                    $scope.data.currItem.fin_bud_sales_lines.forEach(function (value) {
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

                /**
                 * 获取公司年度销售目标
                 * @param code
                 */
                function getCompStrategyAmt() {
                    if ($scope.data.currItem.bud_year && !isNaN($scope.data.currItem.bud_year) && $scope.data.currItem.bud_year > 0
                        && $scope.data.currItem.org_id && !isNaN($scope.data.currItem.org_id) && $scope.data.currItem.org_id > 0) {
                        var postData = {
                            classId: "fin_strategy_target_exp_head",
                            action: 'getstrategyamt',
                            data: {
                                strategy_year: $scope.data.currItem.bud_year,
                                dept_id: $scope.data.currItem.org_id,
                                flag: 1
                            }
                        };
                        return requestApi.post(postData)
                            .then(function (data) {
                                $scope.data.currItem.comp_target_salesamt = data.total_sale_in_amt;
                            });
                    }
                }

                /**
                 * 获取部门年度销售目标
                 * @param code
                 */
                function getDeptStrategyAmt() {
                    if ($scope.data.currItem.bud_year && !isNaN($scope.data.currItem.bud_year) && $scope.data.currItem.bud_year > 0
                        && $scope.data.currItem.org_id && !isNaN($scope.data.currItem.org_id) && $scope.data.currItem.org_id > 0) {
                        var postData = {
                            classId: "fin_strategy_target_exp_head",
                            action: 'getstrategyamt',
                            data: {
                                strategy_year: $scope.data.currItem.bud_year,
                                dept_id: $scope.data.currItem.org_id,
                                flag: 2
                            }
                        };
                        return requestApi.post(postData)
                            .then(function (data) {
                                $scope.data.currItem.dept_target_salesamt = data.total_sale_in_amt;
                            });
                    }
                }

                /*-------------------通用查询结束---------------------*/


                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /**
                 * 计算均价增长率
                 */
                function setRate1(args) {
                    if (args.data.sales_price1 && !isNaN(args.data.sales_price1)
                        && args.data.sales_price2 && !isNaN(args.data.sales_price2) && args.data.sales_price1 > 0) {
                        args.data.growth_rate1 = ((args.data.sales_price2 - args.data.sales_price1) / args.data.sales_price1).toFixed(4);
                    }
                }

                /**
                 * 均价改变或数量改变 计算销售金额
                 */
                function setAmt1(args) {
                    if (args.data.sales_price1 && !isNaN(args.data.sales_price1) && args.data.sales_price1 > 0
                        && args.data.sales_qty1 && !isNaN(args.data.sales_qty1) && args.data.sales_qty1 > 0) {
                        args.data.sales_amt1 = args.data.sales_qty1 * args.data.sales_price1;
                    }
                }

                /**
                 * 均价改变或数量改变 计算销售金额
                 */
                function setAmt2(args) {
                    if (args.data.sales_price2 && !isNaN(args.data.sales_price2) && args.data.sales_price2 > 0
                        && args.data.sales_qty2 && !isNaN(args.data.sales_qty2) && args.data.sales_qty2 > 0) {
                        args.data.sales_amt2 = args.data.sales_qty2 * args.data.sales_price2;
                    }
                }

                function setProductSalesShare() {
                    $scope.data.currItem.fin_bud_sales_lines.forEach(function (val) {
                        if (val.sales_amt2 > 0 && val.sales_amt2 != undefined && val.sales_amt2 != null && val.sales_amt2 != "") {
                            val.product_sales_share = val.sales_amt2 / $scope.data.currItem.total_sales_amt;
                        }

                    })
                }


                /**
                 * 计算销量增长率
                 */
                function setRate2(args) {
                    if (args.data.sales_qty1 && !isNaN(args.data.sales_qty1)
                        && args.data.sales_qty2 && !isNaN(args.data.sales_qty2) && args.data.sales_qty1 > 0) {
                        args.data.growth_rate2 = ((args.data.sales_qty2 - args.data.sales_qty1) / args.data.sales_qty1).toFixed(4);
                    }
                }

                /**
                 * 计算销量增长率setRateQu5
                 */
                function setRateQu5(args) {
                    if (args.data.sales_qty1 && !isNaN(args.data.sales_qty1)
                        && args.data.sales_qty2 && !isNaN(args.data.sales_qty2) && args.data.sales_qty1 > 0) {
                        args.data.growth_rate2 = ((args.data.sales_qty2 - args.data.sales_qty1) / args.data.sales_qty1).toFixed(4);
                    }
                    if (args.data.sales_qty1 == 0 || args.data.sales_qty1 == null || args.data.sales_qty1 == undefined || args.data.sales_qty1 == "") {
                        args.data.growth_rate2 = 0;
                    }
                }

                /**
                 * 计算销量增长率setRateTong
                 */
                function setRateTong(args) {
                    if (args.data.sales_qty1 && !isNaN(args.data.sales_qty1) && args.data.sales_qty1 > 0) {
                        args.data.sales_qty2 = parseInt(args.data.growth_rate2 * args.data.sales_qty1) + parseInt(args.data.sales_qty1);
                    }
                    if (args.data.sales_qty1 == 0 || args.data.sales_qty1 == null || args.data.sales_qty1 == undefined || args.data.sales_qty1 == "") {
                        args.data.sales_qty2 = 0;
                    }
                }

                /**
                 * 计算销量增长率setRateTong3
                 */
                function setRateTong3(args) {
                    if (args.data.sales_qty1 && !isNaN(args.data.sales_qty1) && args.data.sales_qty1 > 0) {
                        var sgsq = args.data.growth_rate1 * args.data.sales_price1;
                        args.data.sales_price2 = numberApi.sum(sgsq, args.data.sales_price1);
                    }
                    if (args.data.sales_qty1 == 0 || args.data.sales_qty1 == null || args.data.sales_qty1 == undefined || args.data.sales_qty1 == "") {
                        args.data.sales_price2 = 0;
                    }
                }

                /**
                 * 计算销售额增长率
                 */
                function setRate3(args) {
                    if (args.data.sales_amt1 && !isNaN(args.data.sales_amt1)
                        && args.data.sales_amt2 && !isNaN(args.data.sales_amt2) && args.data.sales_amt1 > 0) {
                        args.data.growth_rate3 = ((args.data.sales_amt2 - args.data.sales_amt1) / args.data.sales_amt1).toFixed(4);
                    }
                }

                /**
                 * 计算销售额增长率
                 */
                /*function setRsateQu(args) {
                 if(args.data.sales_amt1&&!isNaN(args.data.sales_amt1)
                 &&args.data.sales_amt2&&!isNaN(args.data.sales_amt2)&&args.data.sales_amt1>0){
                 args.data.growth_rate3 = ((args.data.sales_amt2-args.data.sales_amt1)/args.data.sales_amt1).toFixed(4);
                 }
                 }*/

                /**
                 * 设置表头总数量和金额
                 */
                function setSaleQtyAndAmt() {
                    $scope.data.currItem.total_sales_qty = numberApi.sum($scope.data.currItem.fin_bud_sales_lines, 'sales_qty2');
                    $scope.data.currItem.total_sales_amt = numberApi.sum($scope.data.currItem.fin_bud_sales_lines, 'sales_amt2');
                    $scope.calSum();
                }

                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    checkData(invalidBox);
                };


                function checkData(reason) {
                    $scope.gridOptions.api.stopEditing();
                    if ($scope.data.currItem.fin_bud_sales_lines.length == 0) {
                        reason.push('请添加明细！');
                    }
                    var lineData = $scope.data.currItem.fin_bud_sales_lines;

                    lineData.forEach(function (line, index) {
                        var row = index + 1;
                        if (!line.item_id)
                            reason.push('第' + row + '行产品不能为空');
                    });

                }


                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData);
                    bizData.bud_year = new Date().getFullYear() + 1;
                    bizData.stat = 1;
                    bizData.create_time = new Date().Format('yyyy-MM-dd hh:mm:ss');
                    bizData.fin_bud_sales_lines = [];
                    $scope.gridOptions.hcApi.setRowData(bizData.fin_bud_sales_lines);
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.fin_bud_sales_lines);
                    $scope.calSum();
                    setProductSalesShare();
                };

                /**
                 * 初始化
                 */
                $scope.doInit = function () {
                    $scope.hcSuper.doInit().then($scope.initHeader);
                };

                /**
                 * 初始化表头
                 */
                $scope.initHeader = function () {
                    return $q.when().then(function () {
                        var last_year = Number($scope.data.currItem.bud_year) - 1;
                        $scope.gridOptions.columnDefs[5].headerName = "本年(" + last_year + ")销售预计";
                        $scope.gridOptions.columnDefs[6].headerName = $scope.data.currItem.bud_year + "销售预算";
                        $scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs);
                    }).then(function () {
                        $scope.gridOptions.columnApi.autoSizeAllColumns();
                    });

                }

                /**
                 * 计算合计数据
                 */
                $scope.calSum = function () {
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            sales_qty1: numberApi.sum($scope.data.currItem.fin_bud_sales_lines, 'sales_qty1'),//销量
                            sales_amt1: numberApi.sum($scope.data.currItem.fin_bud_sales_lines, 'sales_amt1'),
                            sales_qty2: numberApi.sum($scope.data.currItem.fin_bud_sales_lines, 'sales_qty2'),//销量
                            sales_amt2: numberApi.sum($scope.data.currItem.fin_bud_sales_lines, 'sales_amt2'),
                            growth_rate3: (numberApi.sum($scope.data.currItem.fin_bud_sales_lines, 'sales_amt2') - numberApi.sum($scope.data.currItem.fin_bud_sales_lines, 'sales_amt1')) / numberApi.sum($scope.data.currItem.fin_bud_sales_lines, 'sales_amt1'),
                            growth_rate2: (numberApi.sum($scope.data.currItem.fin_bud_sales_lines, 'sales_qty2') - numberApi.sum($scope.data.currItem.fin_bud_sales_lines, 'sales_qty1')) / numberApi.sum($scope.data.currItem.fin_bud_sales_lines, 'sales_qty1')//销量
                        }
                    ]);
                };


                $scope.onBudYearChange = function () {
                    $scope.initHeader().then(getSalesDataLine).then(getCompStrategyAmt).then(getDeptStrategyAmt);
                };

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

                        var data = $scope.data.currItem.fin_bud_sales_lines;

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
                        $scope.data.currItem.fin_bud_sales_lines.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.fin_bud_sales_lines);
                        setSaleQtyAndAmt();
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
                // $scope.footerLeftButtons.copyAndAdd_line = {
                //     title: '批量导入',
                //     click: function() {
                //         $scope.copyAndAdd_line && $scope.copyAndAdd_line();
                //     },
                //     hide: function () {
                //         return $scope.data.currItem.stat > 1;
                //     }
                // };

                /**
                 * 批量导入
                 */
                $scope.copyAndAdd_line = function () {
                    var titleToField = {
                        '产品编码': 'item_code'

                    };
                    fileApi.chooseExcelAndGetData()
                        .then(function (excelData) {
                            var importLines = excelData.rows;
                            var validLines = [];

                            loopApi.forLoop(importLines.length, function (i) {
                                var data = {};
                                Object.keys(titleToField).forEach(function (key) {
                                    var field = titleToField[key];
                                    var value = importLines[i][key];

                                    data[field] = value;
                                });

                                validLines.push(data);
                            });

                            var lines = validLines;
                            loopApi.forLoop(lines.length, function (i) {
                                if (lines[i].fee_code && $scope.data.fees.length) {
                                    loopApi.forLoop($scope.data.fees.length, function (j) {
                                        if ($scope.data.fees[j].fee_code == lines[i].fee_code) {
                                            lines[i].fee_id = $scope.data.fees[j].fee_id;
                                            lines[i].fee_name = $scope.data.fees[j].fee_name;

                                            return requestApi.post('fin_fee_header', 'select',
                                                {fee_id: lines[i].fee_id})
                                                .then(function (response) {
                                                    lines[i].subject_id = response.subject_id;
                                                    lines[i].subject_code = response.subject_no;
                                                    lines[i].subject_name = response.subject_name;

                                                    Array.prototype.push.apply($scope.data.currItem.fin_bud_fee_lines, validLines);

                                                    $scope.calSum();

                                                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.fin_bud_fee_lines);
                                                })
                                        }
                                    })
                                }
                            });


                        })
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
