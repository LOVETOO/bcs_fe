/**
 * 采购入库红冲-属性  inv_in_bill_red_prop
 * 2018-12-24 zhl
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'openBizObj', 'swalApi', 'loopApi', 'numberApi', 'dateApi'],
    function (module, controllerApi, base_obj_prop, requestApi, openBizObj, swalApi, loopApi, numberApi, dateApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数
            function ($scope, $modal) {

                $scope.data = {};
                $scope.data.currItem = {};

                $scope.gridOptions = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'invbillno_relevant',
                            headerName: '采购入库单号',
                            editable: false
                        }, {
                            field: 'item_code',
                            headerName: '产品编码'
                        }, {
                            field: 'item_name',
                            headerName: '产品名称'
                        }, {
                            field: 'uom_name',
                            headerName: '单位'
                        }, {
                            field: 'warehouse_code',
                            headerName: '仓库编码',
                            editable: function (args) {
                                return editable(args)
                            },
                            onCellDoubleClicked: function (args) {
                                $scope.chooseWarehouse(args);
                            },
                            onCellValueChanged: function (args) {
                                if (args.newValue === args.oldValue)
                                    return;
                            }
                        }, {
                            field: 'warehouse_name',
                            headerName: '仓库名称'
                        }, {
                            field: 'qty_red',
                            headerName: '本次红冲数量',
                            type: '数量',
                            editable: function (args) {
                                return editable(args)
                            },
                            onCellValueChanged: function (args) {
                                if (args.newValue === args.oldValue)
                                    return;
                                $scope.toNegative(args);

                                //计算含税红冲数量
                                args.data.amount_bill = numberApi.mutiply(args.data.qty_red, args.data.price_bill);
                                args.data.cubage = numberApi.mutiply(args.data.qty_red, args.data.single_cubage);
                                calSum();
                            }
                        }, {
                            field: 'qty_invbill',
                            headerName: '原入库数量',
                            type: '数量',
                            editable: false,
                            onCellValueChanged: function (args) {
                                if (args.newValue === args.oldValue)
                                    return;
                            }
                        }, {
                            field: 'price_bill',
                            headerName: '含税价格',
                            type: '金额'

                        }, {
                            field: 'amount_bill',
                            headerName: '红冲金额',
                            type: '金额'
                        }, {
                            field: 'single_cubage',
                            headerName: '单品体积',
                            type: '体积'
                        }, {
                            field: 'cubage',
                            headerName: '本次红冲体积',
                            type: '体积'
                        }, {
                            field: 'qty_red_bill',
                            headerName: '已红冲数量',
                            type: '数量'
                        }, {
                            field: 'remark',
                            headerName: '备注',
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
                /*-------------------通用查询开始------------------------*/

                /**
                 * 计算合计数据
                 */
                function calSum() {
                    //合计红冲数量
                    $scope.data.currItem.total_qty
                        = numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'qty_red');
                    //合计红冲体积
                    $scope.data.currItem.total_cubage
                        = numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'cubage');
                    //合计红冲金额
                    $scope.data.currItem.amount_total
                        = numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'amount_bill');
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            qty_red: numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'qty_red'),//红冲数量
                            qty_invbill: numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'qty_invbill'),//原入库数量
                            amount_bill: numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'amount_bill'),//红冲金额
                            cubage: numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'cubage'),//本次红冲体积
                            qty_red_bill: numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'qty_red_bill')//已红冲数量
                        }
                    ]);
                }

                /**
                 * 查供应商
                 */
                $scope.chooseVendor = function () {
                    $modal.openCommonSearch({
                            classId: 'vendor_org',
                            sqlWhere: ' usable =2 '
                        })
                        .result//响应数据
                        .then(function (response) {
                            $scope.data.currItem.vendor_name = response.vendor_name;
                            $scope.data.currItem.vendor_code = response.vendor_code;
                            $scope.data.currItem.vendor_id = response.vendor_id;

                        });
                };


                /**
                 * 查仓库
                 */
                $scope.chooseWarehouse = function (args) {
                    $modal.openCommonSearch({
                            classId: 'warehouse',
                            sqlWhere: 'warehouse_type = 1 and warehouse_property = 1 and usable = 2'
                        })
                        .result//响应数据
                        .then(function (response) {
                            if (args) {
                                args.data.warehouse_id = response.warehouse_id;
                                args.data.warehouse_code = response.warehouse_code;
                                args.data.warehouse_name = response.warehouse_name;
                                args.api.refreshView();
                            } else {
                                $scope.data.currItem.warehouse_name = response.warehouse_name;
                                $scope.data.currItem.warehouse_code = response.warehouse_code;
                                $scope.data.currItem.warehouse_id = response.warehouse_id;
                            }


                        })
                };

                //查采购订单
                $scope.chooseInvBill = function () {
                    $modal.openCommonSearch({
                            classId: 'inv_in_bill_head',
                            postData: {
                                searchflag: 5
                            },
                            sqlWhere: 'stat = 5 ',
                            action: 'search',
                            title: "采购入库单",
                            gridOptions: {
                                columnDefs: [{
                                    headerName: "入库订单号",
                                    field: "invbillno"
                                }, {
                                    headerName: "供应商编码",
                                    field: "vendor_code"
                                }, {
                                    headerName: "供应商名称",
                                    field: "vendor_name"
                                }, {
                                    headerName: "合计数量",
                                    field: "total_qty"
                                }, {
                                    headerName: "合计金额",
                                    field: "amount_total"
                                }, {
                                    headerName: "单据日期",
                                    field: "invbilldate"
                                }, {
                                    headerName: "备注",
                                    field: "note"
                                }]
                            }
                        })
                        .result//响应数据
                        .then(function (response) {
                            $scope.data.currItem.inv_in_bill_lines = [];
                            // 发送请求带出明细 ,补充到采购入库红冲明细
                            var postdata = {
                                inv_in_bill_head_id: response.inv_in_bill_head_id
                            };
                            return requestApi.post('inv_in_bill_head', 'select', postdata)
                                .then(function (response) {
                                    $scope.data.currItem.invbillno_relevant = response.invbillno;
                                    $scope.data.currItem.vendor_id = response.vendor_id;
                                    $scope.data.currItem.vendor_code = response.vendor_code;
                                    $scope.data.currItem.vendor_name = response.vendor_name;
                                    $scope.data.currItem.warehouse_id = response.warehouse_id;
                                    $scope.data.currItem.warehouse_code = response.warehouse_code;
                                    $scope.data.currItem.warehouse_name = response.warehouse_name;
                                    $scope.data.currItem.price_type = response.price_type;

                                    var lineData = response.inv_in_bill_lines;
                                    var lineNum = lineData.length;//返回数据的长度
                                    var data;
                                    for (var i = 0; i < lineNum; i++) {
                                        //如果未完全红冲则加入到明细
                                        if (numberApi.toNumber(lineData[i].qty_invbill, 0) > numberApi.toNumber(lineData[i].qty_red_bill, 0)) {
                                            $scope.add_line(lineData[i]);
                                        }
                                    }
                                    calSum();
                                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.inv_in_bill_lines);
                                });
                        });
                }


                /*-------------------通用查询结束------------------------*/

                /*-------------------明细检查、计算、变值开始------------------------*/


                //本次红冲数量正数转负数
                $scope.toNegative = function (args) {
                    if (args && args.data.qty_red > 0) {
                        args.data.qty_red = 0 - args.data.qty_red;
                    }
                };

                /*-------------------明细检查、计算、变值结束------------------------*/


                //明细验证
                $scope.validCheck = function (invalidBox) {
                    $scope.gridOptions.api.stopEditing();

                    $scope.hcSuper.validCheck(invalidBox);

                    var lineData = getCurrItem().inv_in_bill_lines;
                    lineData.forEach(function (line, index) {
                        var row = index + 1;
                        //验证红冲数量小于|入库数量-已红冲数量|
                        var c = numberApi.sum(line.qty_red, line.qty_invbill, line.qty_red_bill);
                        if (c < 0) {
                            invalidBox.push('第' + row + '行本次红冲数量不能大于' + numberApi.sum(line.qty_invbill, line.qty_red_bill));
                        }
                    });
                };


                /**
                 * 新增时数据、网格默认设置
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    bizData.create_date = dateApi.now();
                    bizData.invbilldate = dateApi.today();
                    bizData.year_month = new Date(bizData.invbilldate).Format('yyyy-MM');
                    bizData.billtypecode = '0101';
                    bizData.red_type = 2;//设置红冲类型
                    bizData.inv_in_bill_lines = [];
                    $scope.gridOptions.hcApi.setRowData(bizData.inv_in_bill_lines);

                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.inv_in_bill_lines);
                };

                $scope.footerLeftButtons.deleteRow.click = function () {
                    $scope.del_line && $scope.del_line();
                };
                $scope.footerLeftButtons.deleteRow.hide = function () {
                    return $scope.data.currItem.stat > 1;
                };

                /**
                 * 增加行
                 */
                $scope.add_line = function (data) {
                    $scope.gridOptions.api.stopEditing();
                    var line = {};
                    if (data) {
                        line.item_id = data.item_id;
                        line.item_code = data.item_code;
                        line.item_name = data.item_name;
                        line.uom_id = data.uom_id;
                        line.uom_name = data.uom_name;
                        line.warehouse_id = data.warehouse_id;
                        line.warehouse_code = data.warehouse_code;
                        line.warehouse_name = data.warehouse_name;
                        line.qty_red = -numberApi.sum(numberApi.toNumber(data.qty_invbill, 0), numberApi.toNumber(data.qty_red_bill, 0));
                        line.price_bill = data.price_bill;
                        line.remark = data.remark;
                        line.qty_invbill = data.qty_invbill;
                        line.qty_red_bill = data.qty_red_bill;
                        line.amount_bill = numberApi.mutiply(line.qty_red, data.price_bill);
                        line.single_cubage = data.single_cubage;
                        line.cubage = numberApi.mutiply(line.qty_red, data.single_cubage);
                        line.source_bill_line_id = data.inv_in_bill_line_id;
                        line.invbillno_relevant = $scope.data.currItem.invbillno_relevant;

                    }
                    $scope.data.currItem.inv_in_bill_lines.push(line);
                    calSum();
                };

                /**
                 * 删除行
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.inv_in_bill_lines.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.inv_in_bill_lines);
                    }
                    calSum()
                };

                function getCurrItem() {
                    return $scope.data.currItem;
                }

                function editable(args) {
                    if (getCurrItem().stat == 1)
                        return true;
                    return false;
                }

                $scope.onInvbilldateChange = function () {
                    getCurrItem().year_month = new Date(getCurrItem().invbilldate).Format('yyyy-MM');
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






