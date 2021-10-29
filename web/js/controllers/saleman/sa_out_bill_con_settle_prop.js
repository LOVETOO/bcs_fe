/**
 * 委托代销结算-详情页
 * huderong
 * date:2018-12-25
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi', 'dateApi', 'numberApi', 'loopApi'],
    function (module, controllerApi, base_obj_prop, swalApi, requestApi, dateApi, numberApi, loopApi) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope', '$stateParams', '$modal', '$q',
            //控制器函数
            function ($scope, $stateParams, $modal, $q) {
                /**数据定义 */
                $scope.data = {};
                $scope.data.currItem = {};

                function editable() {
                    if ($scope.data.currItem.stat == 1)
                        return true;
                    return false;
                }

                $scope.gridOptions = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [
                        {
                            type: '序号'
                        },
                        {
                            field: 'sa_salebillno',
                            headerName: '委托代销单号'
                        }, {
                            field: 'item_code',
                            headerName: '产品编码',
                            editable: function (args) {
                                return editable();
                            },
                            onCellDoubleClicked: chooseItem,
                            onCellValueChanged: function (args) {
                                if (args)
                                    if (args.newValue === args.oldValue)
                                        return;

                                if (!$scope.data.currItem.crm_entid) {
                                    swalApi.info("请先选择品类");
                                    return
                                }
                                //获取产品
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
                                        args.data.spec_qty = line.spec_qty;//凑整数量
                                        return args.data;
                                    })
                                    .then(getPrice)//取特价
                                    .then(getNormalStock)
                                    .then(reCountAllRow)
                                    .then(function () {
                                        args.api.refreshView();
                                    });
                            }
                        }, {
                            field: 'item_name',
                            headerName: '产品名称',
                            onCellDoubleClicked: chooseItem
                        }, {
                            field: 'bar_code',
                            headerName: '产品条码'
                        },
                        {
                            field: 'uom_name',
                            headerName: '单位'
                        }, {
                            field: 'warehouse_code',
                            headerName: '代销仓库编码',
                            onCellDoubleClicked: chooseWareHouse
                        }, {
                            field: 'warehouse_name',
                            headerName: '代销仓库名称',
                            onCellDoubleClicked: chooseWareHouse
                        },
                        {
                            field: "attribute11",
                            headerName: "是否赠品",
                            type: "是否",
                            editable: function (args) {
                                return editable();
                            },
                        }
                        , {
                            field: 'qty_onhand',
                            headerName: '实际库存数量',
                            type: '数量'
                        }, {
                            field: 'qty_plan',
                            headerName: '可使用库存数量',
                            type: '数量'
                        },
                        {
                            field: 'attribute41',
                            headerName: '代销开单数量',
                            type: '数量'
                        },
                        {
                            field: 'qty_bill',
                            headerName: '本次结算量',
                            type: '数量',
                            editable: function (args) {
                                return editable();
                            },
                            onCellValueChanged: function (args) {
                                checkGridMoneyInput(args, LogicCountFuncArr);
                            }
                        },
                        {
                            field: 'price_bill',
                            headerName: '结算单价（折前）',
                            type: '金额',
                            editable: function (args) {
                                return editable();
                            },
                            onCellValueChanged: function (args) {
                                checkGridMoneyInput(args, LogicCountFuncArr);
                            }
                        },
                        {
                            field: 'amount_bill',
                            headerName: '结算金额（折前）',
                            type: '金额',
                            onCellValueChanged: function (args) {
                                checkGridMoneyInput(args, LogicCountFuncArr);
                            }
                        }, {
                            field: 'discount_tax',
                            headerName: '折扣率',
                            type: '百分比',
                            editable: function (args) {
                                return editable();
                            },
                            onCellValueChanged: function (args) {
                                checkGridMoneyInput(args, LogicCountFuncArr);
                            }
                        }, {
                            field: 'wtamount_discount',
                            headerName: '折扣金额',
                            type: '金额'
                        },
                        {
                            field: 'price_bill_f',
                            headerName: '结算单价（折后）',
                            type: '金额'
                        },
                        {
                            field: 'amount_bill_f',
                            headerName: '结算金额（折后）',
                            type: '金额'
                        }
                        , {
                            field: 'reference_price',
                            headerName: '参考价',
                            type: '金额'
                        }
                        , {
                            field: 'qty_complete',
                            headerName: '已结算量',
                            type: '金额'
                        }
                        , {
                            field: 'single_cubage',
                            headerName: '单位体积',
                            type: '体积',
                            onCellValueChanged: function (args) {
                                checkGridMoneyInput(args, [countCubage]);
                            }
                        }, {
                            field: 'cubage',
                            headerName: '体积',
                            type: '体积'
                        },
                        {
                            field: 'note',
                            headerName: '备注',
                            editable: function (args) {
                                return editable();
                            }
                        },
                        {
                            field: 'price_bill_notax',
                            headerName: '结算未税价（折前）',
                            type: '金额'
                        },
                        {
                            field: 'amount_bill_notax',
                            headerName: '结算未税金额（折前）',
                            type: '金额'
                        }, {
                            field: 'wtamount_discount_notax',
                            headerName: '折扣金额（未税）',
                            type: '金额'
                        },
                        {
                            field: 'price_bill_notax_f',
                            headerName: '结算未税价（折后）',
                            type: '金额'
                        }, {
                            field: 'amount_bill_notax_f',
                            headerName: '结算未税金额（折后）',
                            type: '金额'
                        },
                    ],
                    hcObjType: $stateParams.objtypeid
                };
                /**通用查询 */

                /**继承主控制器 */
                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /**
                 *
                 * @constructor
                 */


                function checkGridMoneyInput(args, functions) {
                    if (args.newValue === args.oldValue)
                        return;
                    if (numberApi.isNum(args.newValue) || numberApi.isStrOfNum(args.newValue)) {
                        functions.forEach(function (value) {
                            value(args.data);
                        })
                        args.api.refreshView();
                    }
                    else {
                        return swalApi.info("请输入有效数字");
                    }
                }

                /**======================点击事件==========================**/
                    //左下按钮
                $scope.footerLeftButtons.addRow.click = function () {
                    $scope.add_line && $scope.add_line();
                };
                $scope.footerLeftButtons.addRow.hide = function () {
                    return $scope.data.currItem.stat > 1;
                };
                $scope.footerLeftButtons.deleteRow.click = function () {
                    $scope.del_line && $scope.del_line();
                };
                $scope.footerLeftButtons.deleteRow.hide = function () {
                    return $scope.data.currItem.stat > 1;
                };

                $scope.footerLeftButtons.copyAndAdd_line = {
                    title: '批量导入',
                    click: function () {
                        $scope.copyAndAdd_line && $scope.copyAndAdd_line();
                    }
                };
                $scope.add_line = function () {
                    if (!$scope.data.currItem.crm_entid) {
                        swalApi.info('请先选择品类');
                        return;
                    }
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

                        var data = $scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads;

                        for (var i = 0; i < rowCount; i++) {
                            var newLine = {
                                warehouse_code: $scope.data.currItem.warehouse_code,
                                warehouse_id: $scope.data.currItem.warehouse_id,
                                warehouse_name: $scope.data.currItem.warehouse_name,
                                attribute11: 1
                            };
                            data.push(newLine);
                        }
                        $scope.gridOptions.hcApi.setRowData(data);
                        $scope.gridOptions.hcApi.setFocusedCell(data.length - rowCount, 'item_code');
                    });
                }
                $scope.del_line = function () {
                    var index = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (index < 0) {
                        return swalApi.info("请选中要删除的行");
                    }
                    return swalApi.confirmThenSuccess({
                        title: "确定要删除第" + (index + 1) + "行吗?",
                        okFun: function () {
                            //函数区域
                            var rowData = $scope.gridOptions.hcApi.getRowData();
                            if (index == (rowData.length - 1)) {
                                $scope.gridOptions.api.focusedCellController.clearFocusedCell();
                            }
                            rowData.splice(index, 1);
                            $scope.gridOptions.hcApi.setRowData(rowData);
                            $scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads = rowData;
                            reCountAllRow();
                        },
                        okTitle: '删除成功'
                    });
                }
                /**============================逻辑计算====================================**/
                /**
                 * 检查数据
                 */
                /**
                 * 保存前验证
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.stopEditingAllGrid();
                    $scope.hcSuper.validCheck(invalidBox);

                    $.each($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, function (i, row) {

                        //初始化数据
                        var qty_plan = HczyCommon.isNull(row.qty_plan) ? 0 : row.qty_plan;//可使用库存数量
                        var qty_bill = HczyCommon.isNull(row.qty_bill) ? 0 : row.qty_bill;//本次结算量
                        var attribute41 = HczyCommon.isNull(row.attribute41) ? 0 : row.attribute41;//代销开单数量
                        var qty_complete = HczyCommon.isNull(row.qty_complete) ? 0 : row.qty_complete;//已结算量
                        var count = numberApi.sub(attribute41, qty_complete);//（代销单数量 - 已结算量）
                        var rowNumStr = "对不起，第" + (i + 1) + "行";

                        //不引用委托代销开单进行结算时
                        if (HczyCommon.isNull($scope.data.currItem.parent_billno)) {
                            //结算单价（折前）不能为0（除非赠品选择项打勾）
                            if (!row.attribute11 || (parseInt(row.attribute11) < 2 && (HczyCommon.isNull(row.price_bill) || parseFloat(row.price_bill) <= 0))) {
                                invalidBox.push('第' + (i + 1) + '行结算单价（折前）不能为0');
                            }
                        }
                        //引用委托代销开单进行结算时
                        else {
                            //本次结算量 <= 代销单数量 - 已结算量 且 本次结算量 <= 对应仓库对应产品的实际可用库存
                            if (numberApi.compare(qty_bill, count) > 0) {
                                invalidBox.push(rowNumStr + "本次结算量应该小于等于（代销单数量 - 已结算量）之和[" + count + "]");
                            }
                        }

                        //最后 必须判断“本次结算数量” <= 对应仓库对应产品的实际可用库存
                        if (numberApi.compare(qty_bill, qty_plan) > 0) {
                            invalidBox.push(rowNumStr + "本次结算量应该小于等于对应仓库对应产品的实际可用库存量[" + qty_plan + "]");
                        }
                    });

                    return invalidBox;
                };

                /**所有计算方法集合
                 * @type {*[]}
                 */
                var LogicCountFuncArr = [countDiscount, countPrice_bill_f, CountPrice_bill_notax, CountAmount_bill_notax, CountWtamount_Discount_Notax, CountPrice_bill_notax_f, countAmount_bill_f, countAmount_bill, CountAmount_bill_notax_f
                    , countTotal_Amount_bill, countCubage, countTotal_Cubage, countQty_sum, calSum];

                /**
                 * 计算明细行开单体积;
                 * 开单数量* 单位体积
                 * @param data
                 */
                function countCubage(data) {
                    if (HczyCommon.isNotNull(data.qty_bill) && HczyCommon.isNotNull(data.single_cubage)) {
                        data.cubage = numberApi.mutiply(data.qty_bill, data.single_cubage);
                    }
                    return data;
                }

                /**
                 * 计算明细行结算金额（折前）;
                 *  本次结算量 * 结算单价（折前)
                 * @param data
                 */
                function countAmount_bill(data) {
                    if (HczyCommon.isNotNull(data.qty_bill) && HczyCommon.isNotNull(data.price_bill)) {
                        data.amount_bill = numberApi.mutiply(data.qty_bill, data.price_bill);
                    }
                    return data;
                }

                /**
                 * 计算明细行结算金额（折后）;
                 *  =本次结算量 * 结算单价（折后)
                 * @param data
                 */
                function countAmount_bill_f(data) {
                    if (HczyCommon.isNotNull(data.qty_bill) && HczyCommon.isNotNull(data.price_bill_f)) {
                        data.amount_bill_f = numberApi.mutiply(data.qty_bill, data.price_bill_f);
                    }
                    return data;
                }


                /**
                 * 计算明细行折扣金额
                 * 结算未税价（折前）*折扣率
                 */
                function countDiscount(data) {
                    if (HczyCommon.isNotNull(data.amount_bill) && HczyCommon.isNotNull(data.discount_tax)) {
                        data.wtamount_discount = numberApi.mutiply(data.amount_bill, data.discount_tax);
                    }
                    return data;
                }

                /**
                 * 计算结算单价（折后）
                 * 含税价 * （1-折扣率）
                 */
                function countPrice_bill_f(data) {
                    if (HczyCommon.isNotNull(data.price_bill) && HczyCommon.isNotNull(data.discount_tax)) {
                        var a = numberApi.sub(1, data.discount_tax);
                        data.price_bill_f = numberApi.mutiply(data.price_bill, a);
                    }
                    return data;
                }

                /**
                 *计算结算未税价(折前)
                 * 结算单价（折前）/ (1+ 税率)
                 */
                function CountPrice_bill_notax(data) {
                    if (HczyCommon.isNotNull(data.price_bill) && HczyCommon.isNotNull($scope.data.currItem.tax_rate)) {
                        var tax_rate = numberApi.divide($scope.data.currItem.tax_rate, 100).toFixed(2);
                        data.price_bill_notax = numberApi.divide(data.price_bill, numberApi.sum(tax_rate, 1));
                    }
                    return data;
                }

                /**
                 *结算未税金额（折前）
                 * 等于结算未税价（折前）/ 结算数量
                 */
                function CountAmount_bill_notax(data) {
                    if (HczyCommon.isNotNull(data.price_bill_notax) && HczyCommon.isNotNull(data.qty_bill)) {
                        data.amount_bill_notax = numberApi.mutiply(data.price_bill_notax, data.qty_bill);
                    }
                    return data;
                }

                /**
                 *  折扣金额（未税）
                 * 等于折扣金额  / (1+ 税率)
                 */
                function CountWtamount_Discount_Notax(data) {
                    if (HczyCommon.isNotNull(data.wtamount_discount) && HczyCommon.isNotNull($scope.data.currItem.tax_rate)) {
                        var tax_rate = numberApi.divide($scope.data.currItem.tax_rate, 100).toFixed(2);
                        data.wtamount_discount_notax = numberApi.divide(data.wtamount_discount, numberApi.sum(tax_rate, 1));
                    }
                    return data;
                }

                /**
                 *  结算未税价（折后）
                 * 等于结算未税价（折前)*(1-折扣率)
                 */
                function CountPrice_bill_notax_f(data) {
                    if (HczyCommon.isNotNull(data.price_bill_notax) && HczyCommon.isNotNull(data.discount_tax)) {
                        data.price_bill_notax_f = numberApi.mutiply(data.price_bill_notax, numberApi.sub(1, data.discount_tax));
                    }
                    return data;
                }

                /**
                 *  结算未税金额（折后）
                 * 等于结算未税金额（折前）* (1-折扣率)
                 */
                function CountAmount_bill_notax_f(data) {
                    if (HczyCommon.isNotNull(data.amount_bill_notax) && HczyCommon.isNotNull(data.discount_tax)) {
                        data.amount_bill_notax_f = numberApi.mutiply(data.amount_bill_notax, numberApi.sub(1, data.discount_tax));
                    }
                    return data;
                }

                /**
                 * 计算总金额
                 */
                function countTotal_Amount_bill() {
                    var amount_total = numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'amount_bill');
                    if (numberApi.isNum(amount_total)) {
                        HczyCommon.safeApply($scope, function () {
                            $scope.data.currItem.amount_total = amount_total;
                        })
                    }
                }

                /**
                 * 计算总数量
                 */
                function countQty_sum() {
                    var qty_sum = numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'qty_bill');
                    if (numberApi.isNum(qty_sum)) {
                        HczyCommon.safeApply($scope, function () {
                            $scope.data.currItem.qty_sum = qty_sum;
                        })
                    }
                }

                /**
                 * 计算总体积
                 */
                function countTotal_Cubage() {
                    var total_cubage = numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'cubage');
                    if (numberApi.isNum(total_cubage)) {
                        HczyCommon.safeApply($scope, function () {
                            $scope.data.currItem.total_cubage = total_cubage;
                        })
                    }
                }


                /**
                 * 计算合计数据
                 */
                function calSum() {
                    //合计数量
                    $scope.data.currItem.qty_sum
                        = numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'qty_bill');
                    //合计体积
                    $scope.data.currItem.total_cubage
                        = numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'cubage');
                    //合计金额
                    $scope.data.currItem.amount_total
                        = numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'amount_bill');
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            qty_bill: numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'qty_bill'),//数量
                            amount_bill: numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'amount_bill'),//结算金额（折前）
                            cubage: numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'cubage'),//体积
                            attribute41: numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'attribute41'),//代销开单数量
                            wtamount_discount: numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'wtamount_discount'),//折扣金额
                            amount_bill_f: numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'amount_bill_f'),//结算金额（折后）
                            qty_complete: numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'qty_complete')//已结算量
                        }
                    ]);
                }

                /**输入框改变时自动查询产品 **/
                function getItem(code) {
                    var sqlw = '';
                    var needCheckCrm_entid = false;
                    if (parseInt($scope.data.currItem.crm_entid) != -1) { //不等于 所有品类-1 的话 需要根据品类过滤
                        sqlw = " and crm_entid = " + $scope.data.currItem.crm_entid;
                        needCheckCrm_entid = true;
                    }
                    var postData = {
                        classId: "item_org",
                        action: 'search',
                        data: {sqlwhere: "item_code = '" + code + "' " + sqlw}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            if (data.item_orgs.length > 0) {
                                var item = data.item_orgs[0];

                                if (needCheckCrm_entid && parseInt($scope.data.currItem.crm_entid) != parseInt(item.crm_entid)) {
                                    return $q.reject("产品编码[" + code + "不归属于当前所选品类")
                                }
                                return {
                                    item_id: item.item_id,
                                    item_code: item.item_code,
                                    item_name: item.item_name,
                                    uom_name: item.uom_name,
                                    uom_id: item.uom_id,
                                    spec_qty: item.spec_qty,
                                    bar_code: item.bar_code,
                                    single_cubage: item.cubage
                                };

                            } else {
                                return $q.reject("产品编码【" + code + "】不可用");
                            }
                        });
                }

                /**============================数据处理 ================================**/
                /**
                 * 新建单据时初始化数据
                 * @param bizData
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData); //继承基础控制器的方法，类似Java的super
                    angular.extend($scope.data.currItem, {
                        creator: strUserName,
                        create_time: dateApi.now(),
                        date_invbill: dateApi.today(),
                        inv_out_bill_lineofinv_out_bill_heads: [],
                        stat: 1,
                        inv_out_type: 8,
                        billtypecode: "0214",
                        bluered: 'B',
                        year_month: new Date(dateApi.today()).Format('yyyy-MM'),
                        shipmode_name: "汽运月结",
                        shipmode_code: "01",
                        shipmode_id: 1
                    });
                    $scope.gridOptions.api.setRowData($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads);
                };

                /**
                 * 设置表格数据
                 * @param bizData
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.inv_out_bill_lineofinv_out_bill_heads);
                    calSum();
                };

                /**
                 * 重新计算所有逻辑计算
                 */
                function reCountAllRow() {
                    var data = $scope.gridOptions.hcApi.getRowData();
                    data.forEach(function (row) {
                        LogicCountFuncArr.forEach(function (func) {
                            func(row);
                        })
                    })
                }

                /**============================通用查询 ===================**/

                /**
                 * 人员查询
                 */
                $scope.chooseUser = function () {
                    $modal.openCommonSearch({
                            classId: 'base_view_erpemployee_org',
                            sqlWhere: ''
                        })
                        .result//响应数据
                        .then(function (response) {
                            $scope.data.currItem.creator = response.employee_name;
                        });
                };

                /**
                 * 查部门
                 */
                function chooseOrg() {
                    $modal.openCommonSearch({
                            classId: 'dept',
                            sqlWhere: ''
                        })
                        .result//响应数据
                        .then(function (response) {
                            $scope.data.currItem.dept_id = response.dept_id;
                            $scope.data.currItem.dept_code = response.dept_code;
                            $scope.data.currItem.dept_name = response.dept_name;
                        })
                };
                $scope.chooseOrg = chooseOrg;

                /**
                 * 查仓库
                 */
                $scope.chooseWareHouse = chooseWareHouse;

                function chooseWareHouse(args) {
                    if (!$scope.data.currItem.customer_id) {
                        swalApi.info("请先选择客户");
                        return;
                    }
                    var sqlBlock = ' usable =2 and warehouse_type = 1 and warehouse_property = 1 and is_end =2 '; //搜实物正品仓
                    if (args && args == 'sa') {
                        sqlBlock = ' usable =2 and warehouse_type = 1 and warehouse_property = 4 and is_end =2 ' +
                            'and customer_id = ' + $scope.data.currItem.customer_id;//搜实物代销仓
                    }
                    $modal.openCommonSearch({
                            classId: 'warehouse',
                            sqlWhere: sqlBlock
                        })
                        .result//响应数据
                        .then(function (response) {
                            if (args && args.data) {
                                args.data.warehouse_id = response.warehouse_id;
                                args.data.warehouse_name = response.warehouse_name;
                                args.data.warehouse_code = response.warehouse_code;
                                args.api.refreshView();
                            } else if (args && args == 'sa') { //代销
                                $scope.data.currItem.warehouse_name = response.warehouse_name;
                                $scope.data.currItem.warehouse_code = response.warehouse_code;
                                $scope.data.currItem.warehouse_id = response.warehouse_id;
                                $scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads.forEach(function (row) {
                                    getNormalStock(row);
                                })
                            }
                        });
                }


                /**
                 * 查客户地址
                 */
                $scope.chooseAddress = function () {
                    if (!$scope.data.currItem.customer_id) {
                        return swalApi.info('请选择客户！');
                    }
                    $modal.openCommonSearch({
                            classId: 'customer_org',
                            postData: {},
                            action: 'getcustomerinfo',
                            sqlWherer: ' customer_id = ' + $scope.data.currItem.customer_id,
                            title: "收货地址",
                            gridOptions: {
                                columnDefs: [{
                                    headerName: "地址",
                                    field: "address1"
                                }, {
                                    headerName: "收货人",
                                    field: "take_man"
                                }, {
                                    headerName: "收货电话",
                                    field: "phone_code"
                                }]
                            }
                        })
                        .result//响应数据
                        .then(function (response) {
                            $scope.data.currItem.address1 = response.address1;
                            $scope.data.currItem.take_man = response.take_man;
                            $scope.data.currItem.phone_code = response.phone_code;
                        })
                };

                /**
                 * 组织客户查询
                 */
                $scope.customerSearch = function () {
                    $modal.openCommonSearch({
                            classId: 'customer_org',
                            sqlWhere: 'co.usable = 2',
                            postData: {
                                search_flag: 111
                            }
                        })
                        .result//响应数据
                        .then(function (result) {
                            $scope.data.currItem.customer_name = result.customer_name;
                            $scope.data.currItem.customer_code = result.customer_code;
                            $scope.data.currItem.customer_id = result.customer_id;
                            $scope.data.currItem.employee_name = result.employee_name;
                            $scope.data.currItem.employee_code = result.employee_code;
                            $scope.data.currItem.employee_id = result.sale_employee_id;
                            $scope.data.currItem.dept_code = result.dept_code;
                            $scope.data.currItem.dept_name = result.dept_name;
                            $scope.data.currItem.dept_id = result.dept_id;
                            $scope.data.currItem.tax_rate = result.tax_rate;

                            //带出第一行品类
                            requestApi.post('customer_org', 'select', {'customer_id': $scope.data.currItem.customer_id,})
                                .then(function (response) {
                                    if (response.customer_salepriceofcustomer_orgs.length && response.customer_salepriceofcustomer_orgs.length > 0) {
                                        $scope.data.currItem.crm_entid = response.customer_salepriceofcustomer_orgs[0].crm_entid;
                                    } else {
                                        $scope.data.currItem.crm_entid = 0;
                                    }
                                });
                            $scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads = [];
                            $scope.gridOptions.api.setRowData($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads);
                            reCountAllRow();
                        });
                };

                /**
                 * 选择产品
                 * @return {Promise}
                 */
                $scope.chooseItem = chooseItem

                function chooseItem(args) {
                    if (args && args.data.seq == "合计") {
                        return;
                    }
                    var sqlBlock = '';
                    if (parseInt($scope.data.currItem.crm_entid) != -1) { //不等于所有品类-1 的话 需要根据品类过滤
                        sqlBlock = " crm_entid = " + $scope.data.currItem.crm_entid
                    }
                    $modal.openCommonSearch({
                            classId: 'item_org',
                            sqlWhere: sqlBlock
                        })
                        .result//响应数据
                        .then(function (data) {
                            [
                                'item_id',
                                'item_code',
                                'item_name',
                                'uom_name',
                                'uom_id',
                                'bar_code'
                            ]
                                .forEach(function (key) {
                                    args.data[key] = data[key];
                                });
                            args.data.spec_qty = data.spec_qty;
                            args.data.single_cubage = data.cubage;
                            return args.data;
                        })
                        .then(getPrice)//取特价
                        .then(getNormalStock) //查正品库存
                        .then(countCubage)
                        .then(function () {
                            args.api.refreshView();
                        })
                }

                /**
                 * 查发运方式
                 */
                $scope.chooseShip = function () {
                    $modal.openCommonSearch({
                            classId: 'shipmode',
                            sqlWhere: ''
                        })
                        .result//响应数据
                        .then(function (response) {
                            $scope.data.currItem.shipmode_name = response.shipmode_name;
                            $scope.data.currItem.shipmode_code = response.shipmode_code;
                            $scope.data.currItem.shipmode_id = response.shipmode_id;
                        });
                };

                /**
                 * 查其他出库单（已审核）
                 */
                $scope.chooseOtherOut = function () {
                    $modal.openCommonSearch({
                            classId: 'inv_out_bill_head',
                            postData: {
                                search_flag: 1
                            },
                            action: 'search',
                            sqlWhere: ' stat = 5',
                            title: "其他出库单",
                            gridOptions: {
                                columnDefs: [{
                                    headerName: "其他出库单号",
                                    field: "invbillno"
                                }, {
                                    headerName: "客户编码",
                                    field: "customer_code"
                                }, {
                                    headerName: "客户名称",
                                    field: "customer_name"
                                }, {
                                    headerName: "部门",
                                    field: "dept_name"
                                }]
                            }
                        })
                        .result//响应数据
                        .then(function (response) {
                            $scope.data.currItem = angular.extend({}, response);

                            $scope.data.currItem.parent_id = response.inv_out_bill_head_id;
                            $scope.data.currItem.parent_billno = response.invbillno;
                            $scope.data.currItem.invbillno = '';

                            $scope.data.currItem.inv_out_bill_head_id = 0;

                            $scope.newBizData($scope.data.currItem);

                            return requestApi.post('inv_out_bill_head', 'select', {
                                inv_out_bill_head_id: $scope.data.currItem.parent_id
                            })
                        })
                        .then(function (response) {
                            loopApi.forLoop(response.inv_out_bill_lineofinv_out_bill_heads.length, function (i) {
                                response.inv_out_bill_lineofinv_out_bill_heads[i].p_inv_out_bill_line_id
                                    = response.inv_out_bill_lineofinv_out_bill_heads[i].inv_out_bill_line_id;

                                response.inv_out_bill_lineofinv_out_bill_heads[i].invbillno = $scope.data.currItem.parent_billno;
                            });
                            $scope.gridOptions.hcApi.setRowData(response.inv_out_bill_lineofinv_out_bill_heads);
                            $scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads = response.inv_out_bill_lineofinv_out_bill_heads;
                            calSum();
                        })
                };


                /**
                 * 查发运方式
                 */
                $scope.chooseShipmod = function () {
                    $modal.openCommonSearch({
                            classId: 'shipmode',
                            sqlWhere: ''
                        })
                        .result//响应数据
                        .then(function (response) {
                            $scope.data.currItem.shipmode_name = response.shipmode_name;
                            $scope.data.currItem.shipmode_code = response.shipmode_code;
                            $scope.data.currItem.shipmode_id = response.shipmode_id;
                        });
                };

                /**
                 * 取正品仓库存
                 * @param data
                 */
                function getNormalStock(data) {
                    if (data && data.warehouse_id) {
                        var postData = {
                            item_id: data.item_id,
                            search_flag: 2,
                            plan_flag: 2
                        };
                        postData.warehouse_id = data.warehouse_id;
                        return requestApi.post('inv_current_inv', 'search', postData)
                            .then(function (response) {
                                if (response.inv_current_invs.length) {
                                    data.qty_onhand = response.inv_current_invs[0].qty_onhand;
                                    data.qty_plan = response.inv_current_invs[0].qty_plan;
                                } else {
                                    data.qty_onhand = 0;
                                    data.qty_plan = 0;
                                }
                                return data;
                            })
                    }
                    return data;
                }

                /**
                 * 取特价作为单价
                 * @param data
                 */
                function getPrice(data) {
                    if (data.item_id && $scope.data.currItem.customer_id) {
                        //先取特价
                        var postData = {
                            item_id: data.item_id,
                            customer_id: $scope.data.currItem.customer_id,
                            date_invbill: $scope.data.currItem.date_invbill,
                            search_flag: 1,
                            warning_flag: 1
                        };
                        return requestApi.post('sa_saleprice_head', 'getprice', postData)
                            .then(function (response) {
                                data.price_bill = response.price_bill;
                                data.sa_saleprice_line_id = response.sa_confer_price_line_id;
                                return data;
                            }, function () {
                                return swalApi.error("产品编码【" + data.item_code + "】未维护价格，请手动输入");
                            }).catch(function (msg) {
                                data.price_bill = 0;
                                return data;
                            });
                    }

                }

                /**
                 * 查委托代销开单（已审核）
                 */
                $scope.chooseSaleOut = function () {
                    $modal.openCommonSearch({
                            classId: 'sa_out_bill_head',
                            postData: {
                                search_flag: 2
                            },
                            sqlWhere: ' stat = 5',
                            action: 'search',
                            title: "委托代销开单",
                            gridOptions: {
                                columnDefs: [{
                                    headerName: "委托代销开单号",
                                    field: "sa_salebillno"
                                }, {
                                    headerName: "客户编码",
                                    field: "customer_code"
                                }, {
                                    headerName: "客户名称",
                                    field: "customer_name"
                                }, {
                                    headerName: "部门",
                                    field: "dept_name"
                                }]
                            }
                        })
                        .result//响应数据
                        .then(function (response) {
                            $scope.data.currItem = angular.extend({}, response);

                            $scope.data.currItem.parent_id = response.sa_out_bill_head_id;
                            $scope.data.currItem.parent_billno = response.sa_salebillno;
                            $scope.data.currItem.invbillno = '';

                            $scope.data.currItem.inv_out_bill_head_id = 0;
                            $scope.data.currItem.qty_sum = 0
                            $scope.newBizData($scope.data.currItem);

                            return requestApi.post('sa_out_bill_head', 'select', {
                                sa_out_bill_head_id: $scope.data.currItem.parent_id
                            })
                        })
                        .then(function (response) {
                            var inv_out_bill_lineofinv_out_bill_heads = [];

                            loopApi.forLoop(response.sa_out_bill_lines.length, function (i) {
                                inv_out_bill_lineofinv_out_bill_heads[i] = response.sa_out_bill_lines[i];
                                inv_out_bill_lineofinv_out_bill_heads[i].p_inv_out_bill_line_id
                                    = response.sa_out_bill_lines[i].sa_out_bill_line_id;

                                //取数 将原单字段和本单字段对应起来
                                inv_out_bill_lineofinv_out_bill_heads[i].sa_salebillno = $scope.data.currItem.parent_billno;//
                                inv_out_bill_lineofinv_out_bill_heads[i].attribute41 = response.sa_out_bill_lines[i].qty_bill;//原开单量 (销售开单数)
                                inv_out_bill_lineofinv_out_bill_heads[i].single_cubage = response.sa_out_bill_lines[i].attribute51; //单位体积
                                // inv_out_bill_lineofinv_out_bill_heads[i].qty_complete = 0; //已结算数量

                                inv_out_bill_lineofinv_out_bill_heads[i].qty_bill = 0;//本次结算量
                                inv_out_bill_lineofinv_out_bill_heads[i].amount_bill = 0;//本次金额

                            });
                            $scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads = inv_out_bill_lineofinv_out_bill_heads;
                            $scope.gridOptions.hcApi.setRowData($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads);
                            reCountAllRow();
                        })
                };

                /**
                 * 查配送区域
                 */
                $scope.chooseDeliverArea = function () {
                    $modal.openCommonSearch({
                            classId: 'sa_deliver_area',
                            sqlWhere: ''
                        })
                        .result//响应数据
                        .then(function (response) {
                            $scope.data.currItem.sa_deliver_area_name = response.deliver_area_name;
                            $scope.data.currItem.sa_deliver_area_code = response.deliver_area_code;
                            $scope.data.currItem.sa_deliver_area_id = response.sa_deliver_area_id;
                        });
                };

                /**
                 * 客户或记账日期改变时 重新取价格,重新计算
                 */
                $scope.onCustomerOrdate_invbillChange = function () {
                    $scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads.forEach(function (row) {
                        $q.when()
                            .then(getPrice.bind(undefined, row))
                            .then(getNormalStock)
                            .then(reCountAllRow)
                            .then(function () {
                                $scope.gridOptions.api.setRowData($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads);
                            });
                    })
                }


                /**===============================输入时的逻辑校验============================**/
                /**
                 * 单据日期值改变事件
                 */
                $scope.dateChangeEvent = function () {
                    if ($scope.data.currItem.date_invbill) {
                        $scope.data.currItem.year_month
                            = new Date($scope.data.currItem.date_invbill).Format('yyyy-MM');
                    }
                    $scope.onCustomerOrdate_invbillChange();
                };

                /**
                 *检查是否先选择客户再选择品类
                 */
                $scope.crm_entidChange = function () {
                    if (!$scope.data.currItem.customer_id) {
                        $scope.data.currItem.crm_entid = 0;
                        swalApi.info("请先选择客户");
                    } else {
                        $scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads = [];
                        $scope.gridOptions.api.setRowData($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads);
                        requestApi.post('customer_org', 'select', {'customer_id': $scope.data.currItem.customer_id,})
                            .then(function (response) {
                                //dept_code
                                if (response.customer_salepriceofcustomer_orgs.length && response.customer_salepriceofcustomer_orgs.length > 0) {
                                    response.customer_salepriceofcustomer_orgs.forEach(function (row) {
                                        if (row.crm_entid === $scope.data.currItem.crm_entid) {
                                            $scope.data.currItem.dept_id = row.dept_id;
                                            $scope.data.currItem.dept_code = row.dept_code;
                                            $scope.data.currItem.dept_name = row.dept_name;
                                        }
                                    })
                                }
                            })

                    }
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