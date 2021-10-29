/**
 * 历史销售记录-属性页面
 * 2018-11-16
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

                /*-------------------数据定义开始------------------------*/

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

                $scope.gridOptions = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'item_code',
                            headerName: '产品编码',
                            editable: function (args) {
                                return editable(args)
                            },
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
                                        args.api.refreshView();
                                    });
                            }
                        }
                        , {
                            field: 'item_name',
                            headerName: '产品名称'

                        }
                        , {
                            field: 'uom_name',
                            headerName: '计量单位',
                            type: '单位'
                        }
                        , {
                            field: 'customer_code',
                            headerName: '客户编码',
                            editable: function (args) {
                                return editable(args)
                            },
                            onCellDoubleClicked: function (args) {
                                $scope.chooseCustomer(args);
                            },
                            onCellValueChanged: function (args) {

                                if (args.newValue === args.oldValue)
                                    return;

                                getCustomer(args.newValue)
                                    .catch(function (reason) {
                                        return {
                                            customer_id: 0,
                                            customer_code: '',
                                            customer_name: reason
                                        };
                                    })
                                    .then(function (line) {
                                        angular.extend(args.data, line);
                                        args.api.refreshView();
                                    });
                            }
                        }
                        , {
                            field: 'customer_name',
                            headerName: '客户名称'
                        }
                        , {
                            field: 'org_code',
                            headerName: '部门编码',
                            editable: function (args) {
                                return editable(args)
                            },
                            onCellDoubleClicked: function (args) {
                                $scope.chooseOrg(args);
                            },
                            onCellValueChanged: function (args) {

                                if (args.newValue === args.oldValue)
                                    return;

                                getOrg(args.newValue)
                                    .catch(function (reason) {
                                        return {
                                            org_id: 0,
                                            org_code: '',
                                            org_name: reason
                                        };
                                    })
                                    .then(function (line) {
                                        angular.extend(args.data, line);
                                        args.api.refreshView();
                                    });
                            }
                        }
                        , {
                            field: 'org_name',
                            headerName: '部门名称'
                        }
                        ,
                        {
                            headerName: '去年销售数据',
                            children: [
                                {
                                    field: 'lyear_sales_qty',
                                    headerName: '销售数量',
                                    type: '数量',
                                    onCellValueChanged: function (args) {
                                        $scope.setSalesAmt(args);
                                        $scope.setCostAmt(args);
                                        $scope.setTotalAmt();
                                        args.api.refreshCells();
                                    },
                                    editable: function (args) {
                                        return editable(args)
                                    }
                                }
                                , {
                                    field: 'lyear_sales_price',
                                    headerName: '销售单价',
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        $scope.setSalesAmt(args);
                                        $scope.setTotalAmt();
                                        args.api.refreshCells();
                                    },
                                    type: '金额'
                                }
                                , {
                                    field: 'lyear_sales_amt',
                                    headerName: '销售金额',
                                    type: '金额',
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        $scope.setTotalAmt();
                                    }
                                }
                                , {
                                    field: 'lyear_cost_price',
                                    headerName: '成本单价',
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        $scope.setCostAmt(args);
                                        args.api.refreshCells();
                                    },
                                    type: '金额'
                                }
                                , {
                                    field: 'lyear_cost_amt',
                                    headerName: '成本金额',
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    type: '金额'
                                }
                            ]
                        }
                        , {
                            headerName: '本年1-10月实际销售数据',
                            children: [
                                {
                                    field: 'tyear1_sales_qty',
                                    headerName: '销售数量',
                                    type: '数量',
                                    onCellValueChanged: function (args) {
                                        $scope.setSales1Amt(args);
                                        $scope.setCost1Amt(args);
                                        $scope.setTotalAmt();
                                        args.api.refreshCells();
                                    },
                                    editable: function (args) {
                                        return editable(args)
                                    }
                                }
                                , {
                                    field: 'tyear1_sales_price',
                                    headerName: '销售单价',
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        $scope.setSales1Amt(args);
                                        $scope.setTotalAmt();
                                        args.api.refreshCells();
                                    },
                                    type: '金额'
                                }
                                , {
                                    field: 'tyear1_sales_amt',
                                    headerName: '销售金额',
                                    type: '金额',
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        $scope.setTotalAmt();
                                    }
                                }
                                , {
                                    field: 'tyear1_cost_price',
                                    headerName: '成本单价',
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        $scope.setCost1Amt(args);
                                        args.api.refreshCells();
                                    },
                                    type: '金额'
                                }
                                , {
                                    field: 'tyear1_cost_amt',
                                    headerName: '成本金额',
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    type: '金额'
                                }
                            ]
                        }, {
                            headerName: '本年11-12月预计销售数据',
                            children: [
                                {
                                    field: 'tyear2_sales_qty',
                                    headerName: '销售数量',
                                    type: '数量',
                                    onCellValueChanged: function (args) {
                                        $scope.setSales2Amt(args);
                                        $scope.setCost2Amt(args);
                                        args.api.refreshCells();
                                    },
                                    editable: function (args) {
                                        return editable(args)
                                    }
                                }
                                , {
                                    field: 'tyear2_sales_price',
                                    headerName: '销售单价',
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        $scope.setSales2Amt(args);
                                        args.api.refreshCells();
                                    },
                                    type: '金额'
                                }
                                , {
                                    field: 'tyear2_sales_amt',
                                    headerName: '销售金额',
                                    type: '金额',
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        $scope.setTotalAmt();
                                    }
                                }
                                , {
                                    field: 'tyear2_cost_price',
                                    headerName: '成本单价',
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        $scope.setCost2Amt(args);
                                        args.api.refreshCells();
                                    },
                                    type: '金额'
                                }
                                , {
                                    field: 'tyear2_cost_amt',
                                    headerName: '成本金额',
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    type: '金额'
                                }
                            ]
                        }
                        , {
                            headerName: '本年销售数据',
                            children: [
                                {
                                    field: 'tyear3_sales_qty',
                                    headerName: '销售数量',
                                    type: '数量',
                                    onCellValueChanged: function (args) {
                                        $scope.setSales3Amt(args);
                                        $scope.setCost3Amt(args);
                                        args.api.refreshCells();
                                    },
                                    editable: function (args) {
                                        return editable(args)
                                    }
                                }
                                , {
                                    field: 'tyear3_sales_price',
                                    headerName: '销售单价',
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        $scope.setSales3Amt(args);
                                        args.api.refreshCells();
                                    },
                                    type: '金额'
                                }
                                , {
                                    field: 'tyear3_sales_amt',
                                    headerName: '销售金额',
                                    type: '金额',
                                    editable: function (args) {
                                        return editable(args)
                                    }

                                }
                                , {
                                    field: 'tyear3_cost_price',
                                    headerName: '成本单价',
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        $scope.setCost3Amt(args);
                                        args.api.refreshCells();
                                    },
                                    type: '金额'
                                }
                                , {
                                    field: 'tyear3_cost_amt',
                                    headerName: '成本金额',
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    type: '金额'
                                }
                            ]
                        }
                        , {
                            field: 'note',
                            headerName: '备注说明',
                            editable: function (args) {
                                return editable(args)
                            }
                        }
                    ]
                };


                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                /*-------------------数据定义结束------------------------*/

                /*-------------------通用查询开始------------------------*/
                /**
                 * 查部门
                 */
                $scope.chooseOrg = function (args) {
                    $modal.openCommonSearch({
                            classId: 'dept'
                        })
                        .result//响应数据
                        .then(function (response) {
                            if (args) {
                                args.data.org_id = response.dept_id;
                                args.data.org_code = response.dept_code;
                                args.data.org_name = response.dept_name;
                                args.api.refreshView();
                            } else {
                                getCurrItem().org_id = response.dept_id;
                                getCurrItem().org_code = response.dept_code;
                                getCurrItem().org_name = response.dept_name;
                            }
                        });
                };

                /**
                 * 查客户
                 */
                $scope.chooseCustomer = function (args) {
                    $modal.openCommonSearch({
                            classId: 'customer_org',
                            title: "客户资料"
                        })
                        .result//响应数据
                        .then(function (response) {
                            args.data.customer_name = response.customer_name;
                            args.data.customer_code = response.customer_code;
                            args.data.customer_id = response.customer_id;
                            args.api.refreshView();
                        });
                };

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
                            args.data.item_id = response.item_id;
                            args.data.item_code = response.item_code;
                            args.data.item_name = response.item_name;
                            args.data.uom_id = response.uom_id;
                            args.data.uom_name = response.uom_name;
                            args.api.refreshView();
                        });
                };

                //输入、粘贴时 查询客户
                function getCustomer(code) {
                    //不校验控制
                    if (code == ' ')
                        return {};

                    var postData = {
                        classId: "customer_org",
                        action: 'search',
                        data: {sqlwhere: "customer_code = '" + code + "'"}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            if (data.customer_orgs.length > 0) {
                                return data.customer_orgs[0];
                            } else {
                                return $q.reject("客户编码【" + code + "】不可用");
                            }
                        });
                }


                function getItem(code) {
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

                function getOrg(code) {
                    var postData = {
                        classId: "dept",
                        action: 'search',
                        data: {sqlwhere: "dept_code = '" + code + "'"}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            if (data.depts.length > 0) {
                                var dept = data.depts[0];
                                return {org_id: dept.dept_id, org_code: dept.dept_code, org_name: dept.dept_name};
                            } else {
                                return $q.reject("部门编码【" + code + "】不可用");
                            }
                        });
                }


                /*-------------------通用查询结束---------------------*/


                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData);
                    bizData.sales_year = new Date().getFullYear();
                    bizData.stat = 1;
                    bizData.create_time = new Date().Format('yyyy-MM-dd hh:mm:ss');
                    bizData.fin_salesdata_lines = [];
                    $scope.gridOptions.hcApi.setRowData(bizData.fin_salesdata_lines);
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.fin_salesdata_lines);
                    $scope.calSum();
                };


                /**
                 * 计算合计数据
                 */
                $scope.calSum = function () {
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            lyear_sales_qty: numberApi.sum(getCurrItem().fin_salesdata_lines, 'lyear_sales_qty'),
                            lyear_sales_amt: numberApi.sum(getCurrItem().fin_salesdata_lines, 'lyear_sales_amt'),
                            lyear_cost_amt: numberApi.sum(getCurrItem().fin_salesdata_lines, 'lyear_cost_amt'),
                            tyear1_sales_qty: numberApi.sum(getCurrItem().fin_salesdata_lines, 'tyear1_sales_qty'),
                            tyear1_sales_amt: numberApi.sum(getCurrItem().fin_salesdata_lines, 'tyear1_sales_amt'),
                            tyear1_cost_amt: numberApi.sum(getCurrItem().fin_salesdata_lines, 'tyear1_cost_amt'),
                            tyear2_sales_qty: numberApi.sum(getCurrItem().fin_salesdata_lines, 'tyear2_sales_qty'),
                            tyear2_sales_amt: numberApi.sum(getCurrItem().fin_salesdata_lines, 'tyear2_sales_amt'),
                            tyear2_cost_amt: numberApi.sum(getCurrItem().fin_salesdata_lines, 'tyear2_cost_amt'),
                            tyear3_sales_qty: numberApi.sum(getCurrItem().fin_salesdata_lines, 'tyear3_sales_qty'),
                            tyear3_sales_amt: numberApi.sum(getCurrItem().fin_salesdata_lines, 'tyear3_sales_amt'),
                            tyear3_cost_amt: numberApi.sum(getCurrItem().fin_salesdata_lines, 'tyear3_cost_amt'),
                        }
                    ]);
                };


                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    checkData(invalidBox);
                };


                function checkData(reason) {
                    $scope.gridOptions.api.stopEditing();
                    if (getCurrItem().fin_salesdata_lines.length == 0) {
                        reason.push('请添加明细！');
                    }
                    var lineData = getCurrItem().fin_salesdata_lines;

                    lineData.forEach(function (line, index) {
                        var row = index + 1;

                        if (!line.item_id)
                            reason.push('第' + row + '行产品不能为空');

                        /*if (!line.customer_id)
                         reason.push('第' + row + '行客户不能为空');*/

                        if (!line.org_id)
                            reason.push('第' + row + '行部门不能为空');
                    });
                }

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
                    var last_year = Number(getCurrItem().sales_year) - 2;
                    var this_year = Number(getCurrItem().sales_year) - 1;
                    $scope.gridOptions.columnDefs[8].headerName = last_year + "年销售数据";
                    $scope.gridOptions.columnDefs[9].headerName = this_year + "年前三季度累计销售数据";
                    $scope.gridOptions.columnDefs[10].headerName = this_year + "年第四季度预计销售数据";
                    $scope.gridOptions.columnDefs[11].headerName = this_year + "年销售数据";
                    $scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs);
                }

                /**
                 * 统计表头合计金额
                 */
                $scope.setTotalAmt = function () {
                    var l_total = 0;
                    var t_total = 0;
                    //HczyCommon.stringPropToNum(getCurrItem().fin_salesdata_lines);
                    $.each(getCurrItem().fin_salesdata_lines, function (index, item) {
                        if (!isNaN(item.lyear_sales_amt)) {
                            l_total += numberApi.toNumber(item.lyear_sales_amt, 0);
                        }
                        if (!isNaN(item.tyear1_sales_amt)) {
                            t_total = t_total + numberApi.toNumber(item.tyear1_sales_amt, 0) + numberApi.toNumber(item.tyear2_sales_amt);
                        }
                    });
                    getCurrItem().total_lyear_sales_amt = l_total;
                    getCurrItem().total_tyear_sales_amt = t_total;
                }

                /**
                 * 统计表体销售金额
                 */
                $scope.setSalesAmt = function (args) {
                    args.data.lyear_sales_amt = numberApi.toNumber(args.data.lyear_sales_qty, 0) * numberApi.toNumber(args.data.lyear_sales_price, 0);
                }

                /**
                 * 统计表体成本金额
                 */
                $scope.setCostAmt = function (args) {
                    args.data.lyear_cost_amt = numberApi.toNumber(args.data.lyear_sales_qty, 0) * numberApi.toNumber(args.data.lyear_cost_price, 0);
                }

                /**
                 * 统计表体本年1-10销售金额
                 */
                $scope.setSales1Amt = function (args) {
                    args.data.tyear1_sales_amt = numberApi.toNumber(args.data.tyear1_sales_qty, 0) * numberApi.toNumber(args.data.tyear1_sales_price, 0);
                }

                /**
                 * 统计表体本年1-10成本金额
                 */
                $scope.setCost1Amt = function (args) {
                    args.data.tyear1_cost_amt = numberApi.toNumber(args.data.tyear1_sales_qty, 0) * numberApi.toNumber(args.data.tyear1_cost_price, 0);
                }

                /**
                 * 统计表体本年11-12销售金额
                 */
                $scope.setSales2Amt = function (args) {
                    args.data.tyear2_sales_amt = numberApi.toNumber(args.data.tyear2_sales_qty, 0) * numberApi.toNumber(args.data.tyear2_sales_price, 0);
                }

                /**
                 * 统计表体本年11-12成本金额
                 */
                $scope.setCost2Amt = function (args) {
                    args.data.tyear2_cost_amt = numberApi.toNumber(args.data.tyear2_sales_qty, 0) * numberApi.toNumber(args.data.tyear2_cost_price, 0);
                }

                /**
                 * 统计表体本年销售金额
                 */
                $scope.setSales3Amt = function (args) {
                    args.data.tyear3_sales_amt = numberApi.toNumber(args.data.tyear3_sales_qty, 0) * numberApi.toNumber(args.data.tyear3_sales_price, 0);
                }

                /**
                 * 统计表体本年成本金额
                 */
                $scope.setCost3Amt = function (args) {
                    args.data.tyear3_cost_amt = numberApi.toNumber(args.data.tyear3_sales_qty, 0) * numberApi.toNumber(args.data.tyear3_cost_price, 0);
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

                        var data = getCurrItem().fin_salesdata_lines;

                        for (var i = 0; i < rowCount; i++) {
                            var newLine = {};
                            data.push(newLine);
                        }

                        $scope.gridOptions.hcApi.setRowData(data);
                        $scope.gridOptions.hcApi.setFocusedCell(data.length - rowCount, 'customer_code');
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
                        getCurrItem().fin_salesdata_lines.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData(getCurrItem().fin_salesdata_lines);
                    }
                };

                // $scope.confirm_state = function () {
                //     return swalApi.confirmThenSuccess({
                //         title: "是否提交确认？",
                //         okFun: function () {
                //             var postData = {
                //                 classId: "fin_salesdata_head",
                //                 action: 'confirm_state',
                //                 data: {salesdata_head_id : getCurrItem().salesdata_head_id}
                //             };
                //
                //             return requestApi.post(postData)
                //                 .then($scope.doInit);
                //         },
                //         okTitle: '确认成功'
                //     });
                // }


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
                        if (item.children && item.children.length > 0) {
                            $.each(item.children, function (j, it) {
                                titleToField[$scope.gridOptions.columnDefs[index].headerName
                                + $scope.gridOptions.columnDefs[index].children[j].headerName]
                                    = $scope.gridOptions.columnDefs[index].children[j].field;
                            });
                        } else {
                            titleToField[$scope.gridOptions.columnDefs[index].headerName]
                                = $scope.gridOptions.columnDefs[index].field;
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
                                getCurrItem().fin_salesdata_lines.push(data);
                            });
                        }).then(function () {
                        var postData = {
                            classId: "fin_salesdata_head",
                            action: 'checkdata',
                            data: {fin_salesdata_lines: getCurrItem().fin_salesdata_lines}
                        };
                        return requestApi.post(postData)
                            .then(function (data) {
                                getCurrItem().fin_salesdata_lines = data.fin_salesdata_lines;
                                $scope.gridOptions.hcApi.setRowData(getCurrItem().fin_salesdata_lines);
                                $scope.setTotalAmt();
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
