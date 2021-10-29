/**
 * 采购退货出库-属性页
 * 2018-12-10
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

                /*-------------------数据定义开始------------------------*/
                $scope.data = {};
                $scope.data.currItem = {};

                function editable(args) {
                    if ($scope.data.currItem.stat == 1)
                        return true;
                    return false;
                }

                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }
                        , {
                            field: 'item_code',
                            headerName: '产品编码',
                            pinned: 'left',
                            editable: function (args) {
                                return editable(args)
                            },
                            onCellDoubleClicked: function (args) {
                                if (editable(args)) {
                                    $scope.chooseItem(args);
                                }
                            },
                            onCellValueChanged: function (args) {
                                if (!args.newValue || args.newValue === args.oldValue) {
                                    return;
                                }
                                var postdata = {
                                    sqlwhere: " item_usable=2 " +
                                    " and item_code='" + args.data.item_code + "'"
                                };
                                requestApi.post('item_org', 'search', postdata)
                                    .then(function (res) {
                                        if (res.item_orgs.length) {
                                            var data = res.item_orgs[0];

                                            args.data.item_name = data.item_name;
                                            args.data.item_code = data.item_code;
                                            args.data.item_id = data.item_id;
                                            args.data.uom_id = data.uom_id;
                                            args.data.uom_code = data.uom_code;
                                            args.data.uom_name = data.uom_name;
                                            args.data.single_cubage = data.cubage;
                                            args.data.qty_invbill = 0;
                                            args.data.price_bill = 0;
                                            return args;
                                        } else {
                                            swalApi.info('产品编码【' + args.data.item_code + '】不存在');
                                            args.data.item_id = 0;
                                            args.data.item_name = '';
                                            args.data.item_code = '';
                                            args.api.refreshView();
                                            return;
                                        }
                                    })
                                    //重算体积金额
                                    .then($scope.settotal_cubage).then(function () {
                                        args.data.amount_bill = numberApi.mutiply(args.data.qty_invbill, args.data.price_bill);
                                        args.api.refreshView();
                                    })
                                    .then($scope.calTotal);
                            }
                        }
                        , {
                            field: 'item_name',
                            headerName: '产品名称',
                            pinned: 'left'
                        }
                        , {
                            field: 'uom_name',
                            headerName: '单位'
                        }
                        , {
                            field: 'qty_invbill',
                            headerName: '退货数量',
                            hcRequired: true,
                            type: '数量',
                            editable: function (args) {
                                return editable(args) && args.data.item_id > 0;
                            },
                            onCellDoubleClicked: function (args) {
                                $scope.checkInput(args);
                            },
                            onCellValueChanged: function (args) {
                                if (args.newValue === args.oldValue)
                                    return;
                                $scope.toNegative(args);
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
                        }
                        , {
                            field: 'price_bill',
                            headerName: '含税价格',
                            type: '金额',
                            editable: function (args) {
                                return editable(args) && getCurrItem().price_from < 2;
                            },
                            onCellValueChanged: function (args) {
                                if (args.data.qty_invbill && args.data.price_bill) {
                                    args.data.amount_bill = numberApi.mutiply(args.data.qty_invbill, args.data.price_bill);
                                }
                                $scope.calTotal();
                            }
                        }
                        , {
                            field: 'amount_bill',
                            headerName: '含税金额',
                            type: '金额'
                        }
                        , {
                            field: 'warehouse_code',
                            headerName: '仓库编码',
                            editable: function (args) {
                                return editable(args)
                            },
                            onCellDoubleClicked: function (args) {
                                if (editable(args)) {
                                    $scope.chooseWarehouse(args);
                                }
                            },
                            onCellValueChanged: function (args) {
                                if (!args.newValue || args.newValue === args.oldValue) {
                                    return;
                                }

                                var postdata = {
                                    sqlwhere: " usable=2 and warehouse_type = 1" +
                                    " and warehouse_property = 1" +
                                    " and warehouse_code='" + args.data.warehouse_code + "'"
                                };
                                requestApi.post('warehouse', 'search', postdata)
                                    .then(function (res) {
                                        if (res.warehouses.length) {
                                            var data = res.warehouses[0];

                                            args.data.warehouse_id = data.warehouse_id;
                                            args.data.warehouse_code = data.warehouse_code;
                                            args.data.warehouse_name = data.warehouse_name;

                                            args.api.refreshView();
                                        } else {
                                            swalApi.info('仓库编码【' + args.data.warehouse_code + '】不存在');
                                            args.data.warehouse_id = 0;
                                            args.data.warehouse_name = '';
                                            args.data.warehouse_code = '';
                                            args.api.refreshView();
                                            return;
                                        }
                                    })
                            }
                        }
                        , {
                            field: 'warehouse_name',
                            headerName: '仓库名称'
                        }
                        , {
                            field: 'single_cubage',
                            headerName: '单品体积',
                            type: '体积'
                        }, {
                            field: 'cubage',
                            headerName: '本次退货体积',
                            type: '体积'
                        }
                        , {
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
                /*-------------------数据定义结束------------------------*/

                /*-------------------通用查询开始------------------------*/
                /**
                 * 查产品
                 */
                $scope.chooseItem = function (args) {
                    $modal.openCommonSearch({
                            classId: 'item_org',
                            sqlWhere: ' item_usable = 2'
                        })
                        .result//响应数据
                        .then(function (response) {
                            if (response.item_id == args.data.item_id) return args;
                            args.data.item_name = response.item_name;
                            args.data.item_code = response.item_code;
                            args.data.item_id = response.item_id;
                            args.data.uom_id = response.uom_id;
                            args.data.uom_code = response.uom_code;
                            args.data.uom_name = response.uom_name;
                            args.data.single_cubage = response.cubage;
                            args.data.qty_invbill = 0;
                            args.data.price_bill = 0;
                            return args;
                        })
                        //重算体积金额
                        .then($scope.settotal_cubage).then(function () {
                            args.data.amount_bill = numberApi.mutiply(args.data.qty_invbill, args.data.price_bill);
                            args.api.refreshView();
                        })
                        .then($scope.calTotal);
                };

                /**
                 * 查仓库
                 */
                $scope.chooseWarehouse = function (args) {
                    $modal.openCommonSearch({
                            classId: 'warehouse',
                            sqlWhere: 'warehouse_type = 1 and warehouse_property <> 4 and usable = 2 and is_end = 2 '
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
                /**
                 * 查供应商
                 */
                $scope.chooseVendor = function () {
                    $modal.openCommonSearch({
                            classId: 'vendor_org',
                        })
                        .result//响应数据
                        .then(function (response) {
                            $scope.data.currItem.vendor_name = response.vendor_name;
                            $scope.data.currItem.vendor_code = response.vendor_code;
                            $scope.data.currItem.vendor_id = response.vendor_id;
                            $scope.data.currItem.price_from = response.price_from;

                        });
                };

                /*-------------------通用查询结束---------------------*/


                //计算合计体积
                $scope.settotal_cubage = function (args) {
                    args.data.cubage = numberApi.mutiply(args.data.single_cubage, -args.data.qty_invbill);
                    return args;
                };

                /*
                 * 调出含税价前检查输入（供应商、产品、数量）
                 * */
                $scope.checkInput = function (args) {
                    if (!args.data.item_id) {
                        //移开焦点
                        $scope.gridOptions.hcApi.setFocusedCell(1, 'item_code');
                        return swalApi.info('请先选择该行的产品编码,再输入数量');
                    }
                };

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData);
                    bizData.inv_in_bill_lines = [];
                    bizData.create_date = dateApi.now();
                    bizData.invbilldate = dateApi.today();
                    bizData.year_month = new Date(bizData.invbilldate).Format('yyyy-MM');
                    bizData.billtypecode = '0101';
                    bizData.is_return_type = 2;
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.inv_in_bill_lines);
                };

                //数量正数转负数
                $scope.toNegative = function (args) {
                    if (args && args.data.qty_invbill > 0) {
                        args.data.qty_invbill = 0 - args.data.qty_invbill;
                    }
                };

                /**
                 * 保存前验证
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);

                    //检验‘退货数量’值（负数）
                    if ($scope.data.currItem.inv_in_bill_lines.length) {
                        loopApi.forLoop($scope.data.currItem.inv_in_bill_lines.length, function (i) {
                            var line = $scope.data.currItem.inv_in_bill_lines[i];
                            var row = i + 1;
                            if (!line.qty_invbill)
                                invalidBox.push('第' + row + '行退货数量不能为空');
                            if (!line.price_bill && line.price_bill == 0)
                                invalidBox.push('第' + row + '行订非法的价格数据');
                            if (!line.item_id)
                                invalidBox.push('第' + row + '行订产品不能为空');
                            if (!line.warehouse_id)
                                invalidBox.push('第' + row + '行订仓库不能为空');
                        });

                    }
                };

                $scope.can_add = function () {
                    var msg = [];
                    $scope.hcSuper.validCheck(msg);
                    return msg;
                };

                /**
                 * 明细行申请金额改变事件
                 */
                $scope.applyAmtChanged = function (args) {
                    if (args.data.apply_amt && args.data.apply_amt > 0) {
                        args.data.allow_amt = args.data.apply_amt;
                    }
                    args.api.refreshView();

                    //计算总额
                    $scope.calTotal();
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
                        = Math.abs(numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'cubage'));

                    //合计金额
                    $scope.data.currItem.amount_total
                        = numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'amount_bill');
                };


                function getCurrItem() {
                    return $scope.data.currItem;
                }

                /**
                 * 查询含税价格
                 * 取对应供应商、价格类型、有效期内的采购价格表中的含税单价
                 */
                $scope.queryPriceBill = function (args) {
                    var postdata = {
                        vendor_id: getCurrItem().vendor_id,
                        item_id: args.data.item_id,
                        qty_po: -args.data.qty_invbill,
                        price_type: getCurrItem().price_type
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


                /**
                 * 单据日期值改变事件
                 */
                $scope.dateChangeEvent = function () {
                    if ($scope.data.currItem.invbilldate) {
                        $scope.data.currItem.year_month
                            = new Date($scope.data.currItem.invbilldate).Format('yyyy-MM');
                    }
                };


                /**
                 * 增加行
                 */
                $scope.add_line = function () {
                    var msg = $scope.can_add();
                    if (msg.length > 0) {
                        return swalApi.info(msg);
                    }
                    $scope.gridOptions.api.stopEditing();
                    var line = {};
                    if ($scope.data.currItem.warehouse_id) {
                        line.warehouse_id = $scope.data.currItem.warehouse_id;
                        line.warehouse_code = $scope.data.currItem.warehouse_code;
                        line.warehouse_name = $scope.data.currItem.warehouse_name;
                    }
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
                };


                //底部左边按钮
                $scope.footerLeftButtons.add_line = {
                    icon: 'fa fa-plus',
                    click: function () {
                        $scope.add_line && $scope.add_line();
                    }
                };
                $scope.footerLeftButtons.del_line = {
                    icon: 'fa fa-minus',
                    click: function () {
                        $scope.del_line && $scope.del_line();
                        $scope.calTotal();
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
