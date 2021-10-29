/**
 * 采购入库单-无订单-属性页
 * 2018-12-11 inv_in_bill_none.js
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'openBizObj', 'swalApi', 'loopApi', 'numberApi', 'dateApi'],
    function (module, controllerApi, base_obj_prop, requestApi, openBizObj, swalApi, loopApi, numberApi, dateApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal', '$q',
            //控制器函数
            function ($scope, $modal, $q) {

                $scope.data = {};
                $scope.data.currItem = {};

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
                                if (!editable(args)) {
                                    return;
                                }
                                $scope.chooseItem(args);
                            },
                            onCellValueChanged: function (args) {
                                if (args.newValue === args.oldValue)
                                    return;
                                getSalaryGroup(args.newValue)
                                    .catch(function (reason) {
                                        return {
                                            item_id: 0,
                                            item_code: '',
                                            item_name: reason,
                                            uom_name: '',
                                            cubage: 0,
                                            qty_invbill: 0,
                                            price_bill: 0
                                        };
                                    })
                                    .then(function (line) {
                                        angular.extend(args.data, line);
                                        args.data.qty_invbill = 0;
                                        args.data.single_cubage = line.cubage;
                                        args.data.cubage = 0;
                                        args.data.price_bill = 0;
                                        args.data.amount_bill = 0;
                                        args.data.warehouse_id = $scope.data.currItem.warehouse_id;
                                        args.data.warehouse_code = $scope.data.currItem.warehouse_code;
                                        args.data.warehouse_name = $scope.data.currItem.warehouse_name;
                                        return args.data;
                                    }).then(function () {
                                        args.api.refreshView();
                                    })
                                    //重算体积金额
                                    .then($scope.settotal_cubage).then(function () {
                                    args.data.amount_bill = numberApi.mutiply(args.data.qty_invbill, args.data.price_bill);
                                    args.api.refreshView();
                                }).then($scope.calTotal);

                            }
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
                                if (!editable(args)) {
                                    return;
                                }
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
                            field: 'qty_invbill',
                            headerName: '数量',
                            type: '数量',
                            editable: function (args) {
                                return editable(args) && args.data.item_id > 0
                            },
                            onCellDoubleClicked: function (args) {
                                if (!editable(args)) {
                                    return;
                                }
                                $scope.checkInput(args);
                            },
                            onCellValueChanged: function (args) {
                                if (args.newValue === args.oldValue)
                                    return;
                                //获取价格
                                $scope.queryPriceBill(args)
                                    //设置总体积
                                    .then($scope.settotal_cubage)
                                    .then(function (args) {
                                        args.api.refreshView();
                                        return args;
                                    })
                                    //计算表头合计
                                    .then($scope.calTotal);

                            }
                        }, {
                            field: 'price_bill',
                            headerName: '含税价格',
                            type: '金额',
                            editable: function (args) {
                                return editable(args) && $scope.data.currItem.price_from < 2;
                            },
                            onCellValueChanged: function (args) {
                                if (args.newValue === args.oldValue)
                                    return;

                                args.data.amount_bill = numberApi.mutiply(args.data.qty_invbill, args.data.price_bill);

                                $scope.calTotal();
                            }

                        }, {
                            field: 'amount_bill',
                            headerName: '含税金额',
                            type: '金额'
                        }, {
                            field: 'single_cubage',
                            headerName: '单品体积'
                        }, {
                            field: 'cubage',
                            headerName: '本次入库体积'
                        }, {
                            field: 'qty_red_bill',
                            headerName: '累计红冲数量',
                            type: '数量'
                        }, {
                            field: 'remark',
                            headerName: '备注',
                            editable: function (args) {
                                return editable(args)
                            }
                        }
                    ],
                    hcReady: $q.deferPromise()
                };

                /*-------------------检查、计算结束------------------------*/

                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /*-------------------通用查询开始------------------------*/

                //copy产品处理
                function getSalaryGroup(code) {
                    var postData = {
                        classId: "item_org",
                        action: 'search',
                        data: {
                            item_code: code
                        }
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
                 * 查供应商
                 */
                $scope.chooseVendor = function () {
                    $modal.openCommonSearch({
                            classId: 'vendor_org',
                            sqlWhere: "usable = 2"
                        })
                        .result//响应数据
                        .then(function (result) {
                            $scope.data.currItem.vendor_name = response.vendor_name;
                            $scope.data.currItem.vendor_code = response.vendor_code;
                            $scope.data.currItem.vendor_id = response.vendor_id;
                            if (response.price_from == "" || response.price_from == null || response.price_from == 0) {
                                $scope.data.currItem.price_type = 1;
                            }
                            if (response.price_from == 1) {
                                $scope.data.currItem.price_type = undefined;
                            }
                            if (response.price_from == 2) {
                                $scope.data.currItem.price_type = 1;
                            }
                            $scope.data.currItem.price_from = response.price_from;
                            args.api.refreshView();
                        });
                };

                //查产品
                $scope.chooseItem = function (args) {
                    $modal.openCommonSearch({
                            classId: 'item_org',
                            postData: {},
                            action: 'search',
                            title: "产品",
                            gridOptions: {
                                columnDefs: [{
                                    headerName: "产品编码",
                                    field: "item_code"
                                }, {
                                    headerName: "产品名称",
                                    field: "item_name"
                                }, {
                                    headerName: "体积",
                                    field: "cubage"
                                }]
                            }
                        })
                        .result//响应数据
                        .then(function (result) {
                            if (result.item_id == args.data.item_id) return args;
                            args.data.item_id = result.item_id;
                            args.data.item_code = result.item_code;
                            args.data.item_name = result.item_name;
                            args.data.uom_name = result.uom_name;
                            args.data.single_cubage = result.cubage;
                            args.data.qty_invbill = 0;
                            args.data.price_bill = 0;
                            return args;
                        })
                        //重算体积金额
                        .then($scope.settotal_cubage).then(function () {
                        args.data.amount_bill = numberApi.mutiply(args.data.qty_invbill, args.data.price_bill);
                        args.api.refreshView();
                    }).then($scope.calTotal);
                };

                /**
                 * 查仓库
                 */
                $scope.chooseWarehouse = function (args) {
                    $modal.openCommonSearch({
                            classId: 'warehouse',
                            sqlWhere: 'warehouse_type = 1 and warehouse_property = 1 and usable = 2 and is_end = 2 '
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
                                if ($scope.data.currItem.inv_in_bill_lines.length == 1) {
                                    $scope.data.currItem.inv_in_bill_lines[0].warehouse_name
                                    if ($scope.data.currItem.inv_in_bill_lines[0].warehouse_name == undefined
                                        || $scope.data.currItem.inv_in_bill_lines[0].warehouse_name == null
                                        || $scope.data.currItem.inv_in_bill_lines[0].warehouse_name == "") {
                                        $scope.data.currItem.inv_in_bill_lines[0].warehouse_name = response.warehouse_name;
                                        $scope.data.currItem.inv_in_bill_lines[0].warehouse_code = response.warehouse_code;
                                        $scope.data.currItem.inv_in_bill_lines[0].warehouse_id = response.warehouse_id;
                                    }
                                }
                            }
                        })
                };

                /*-------------------通用查询结束------------------------*/

                /*-------------------检查、计算开始------------------------*/

                /*
                 * 调出含税价前检查输入（供应商、产品、数量）
                 * */
                $scope.checkInput = function (args) {
                    if (!args.data.item_id) {
                        //移开焦点
                        $scope.gridOptions.hcApi.setFocusedCell(1, 'item_code');
                        return swalApi.info('请先选择该行的产品编码,再输入数量');
                    }
                }

                /**
                 * 查询含税价格
                 * 取对应供应商、价格类型、有效期内的采购价格表中的含税单价
                 */
                $scope.queryPriceBill = function (args) {
                    var postdata = {
                        vendor_id: $scope.data.currItem.vendor_id,
                        item_id: args.data.item_id,
                        qty_po: args.data.qty_invbill,
                        price_type: $scope.data.currItem.price_type
                    };
                    return requestApi.post('srm_purchase_price', 'getprice', postdata)
                        .then(function (response) {
                            args.data.price_bill = response.price_tax;
                            args.data.amount_bill = numberApi.mutiply(args.data.qty_invbill, args.data.price_bill);
                            return args;
                        }, function () {
                            args.data.price_bill = 0;
                            args.data.amount_bill = 0;
                            return args;
                        });
                };

                //计算合计体积
                $scope.settotal_cubage = function (args) {
                    args.data.cubage = numberApi.mutiply(args.data.single_cubage, args.data.qty_invbill);
                    return args;
                };

                /**
                 * 计算总额
                 */
                $scope.calTotal = function () {
                    //合计数量
                    $scope.data.currItem.total_qty
                        = numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'qty_invbill');

                    //合计体积
                    $scope.data.currItem.total_cubage
                        = numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'cubage');

                    //合计金额
                    $scope.data.currItem.amount_total
                        = numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'amount_bill');

                    $scope.calSum();

                };

                $scope.copyBizData = function (bizData) {
                    $scope.hcSuper.copyBizData(bizData);

                    bizData.iscredence = 1;
                    bizData.gl_credence_head_id = 0;
                };


                /**
                 * 新增时数据、网格默认设置
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    bizData.create_date = dateApi.now();
                    bizData.invbilldate = dateApi.today();
                    bizData.year_month = new Date().Format('yyyy-MM');
                    bizData.billtypecode = '0101';
                    bizData.is_have_order = 1;
                    bizData.inv_in_bill_lines = [];
                    $scope.gridOptions.hcReady.then(function () {
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.inv_in_bill_lines);
                        $scope.add_line && $scope.add_line();
                    })
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.inv_in_bill_lines);
                    $scope.calSum();
                };

                //底部左边按钮
                $scope.footerLeftButtons.addRow.click = function () {
                    $scope.add_line && $scope.add_line();
                };
                $scope.footerLeftButtons.addRow.hide = function () {
                    return $scope.data.currItem.stat > 1;
                };
                $scope.footerLeftButtons.deleteRow.click = function () {
                    $scope.del_line && $scope.del_line();
                    $scope.calTotal();
                };
                $scope.footerLeftButtons.deleteRow.hide = function () {
                    return $scope.data.currItem.stat > 1;
                };


                $scope.can_add = function () {
                    var msg = [];
                    $scope.hcSuper.validCheck(msg);
                    return msg;
                }

                $scope.onPriceTypeChange = function () {
                    clearGridData();
                    $scope.calTotal();
                }

                function clearGridData() {
                    $scope.data.currItem.inv_in_bill_lines = [];
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.inv_in_bill_lines);
                }

                //明细验证
                $scope.validCheck = function (invalidBox) {
                    $scope.gridOptions.api.stopEditing();

                    $scope.hcSuper.validCheck(invalidBox);
                    if ($scope.data.currItem.note != undefined && $scope.data.currItem.note.length >= 375) {
                        invalidBox.push('备注不能超过375字');
                    }
                    var lineData = $scope.data.currItem.inv_in_bill_lines;
                    lineData.forEach(function (line, index) {
                        var row = index + 1;
                        if (!line.qty_invbill)
                            invalidBox.push('第' + row + '行入库数量不能为空');
                        if (!line.price_bill && line.price_bill == 0)
                            invalidBox.push('第' + row + '行订非法的价格数据');
                        if (!line.item_id)
                            invalidBox.push('第' + row + '行订产品不能为空');
                        if (!line.warehouse_id)
                            invalidBox.push('第' + row + '行订仓库不能为空');
                    });
                };

                /**
                 * 增加行
                 */
                $scope.add_line = function () {
                    $scope.gridOptions.api.stopEditing();

                    var line = {
                        warehouse_id: $scope.data.currItem.warehouse_id,
                        warehouse_code: $scope.data.currItem.warehouse_code,
                        warehouse_name: $scope.data.currItem.warehouse_name
                    };

                    $scope.data.currItem.inv_in_bill_lines.push(line);
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.inv_in_bill_lines);
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
                    if ($scope.data.currItem.inv_in_bill_lines.length < 1) {
                        $scope.add_line && $scope.add_line();
                    }
                };


                function editable(args) {
                    if ($scope.data.currItem.stat == 1 && !args.node.rowPinned)
                        return true;
                    return false;
                }

                $scope.onInvbilldateChange = function () {
                    $scope.data.currItem.year_month = new Date($scope.data.currItem.invbilldate).Format('yyyy-MM');
                }

                /**
                 * 计算合计数据
                 */
                $scope.calSum = function () {
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            qty_red_bill: numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'qty_red_bill'),
                            cubage: numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'cubage'),
                            amount_bill: numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'amount_bill'),
                            qty_invbill: numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'qty_invbill')
                        }
                    ]);
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






