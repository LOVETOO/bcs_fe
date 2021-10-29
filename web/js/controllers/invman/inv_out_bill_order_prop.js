/**
 * 销售订单出库属性页
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'openBizObj', 'swalApi', 'numberApi', 'dateApi'],
    function (module, controllerApi, base_obj_prop, requestApi, openBizObj, swalApi, numberApi, dateApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal', '$q',
            //控制器函数
            function ($scope, $modal, $q) {

                /*获取数据模型*/
                function getCurrItem() {
                    return $scope.data.currItem;
                }

                /*能否编辑*/
                function editable() {
                    if (getCurrItem().stat == 1)
                        return true;
                    return false;
                }

                $scope.crm_entid_datas = [];
                $scope.crm_entid = [];
                $scope.crm_entidChange = function () {
                    getCurrItem().sa_out_bill_lines = [];
                    $scope.gridOptions.hcApi.setRowData(getCurrItem().sa_out_bill_lines);
                    $scope.calSum();
                    setTotalAmt();
                    setTotalQty();
                    $scope.crm_entid_datas.forEach(function (value) {
                        if (getCurrItem().crm_entid == value.crm_entid) {
                            if (value.dept_id > 0) {
                                getCurrItem().dept_code = value.dept_code;
                                getCurrItem().dept_name = value.dept_name;
                                getCurrItem().dept_id = value.dept_id;
                            }
                            if (value.sale_employee_id > 0) {
                                getCurrItem().employee_id_operation = value.sale_employee_id;
                                getCurrItem().employee_name_operation = value.sale_employee_name;
                            }
                        }
                    });
                }

                $scope.gridOptions = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'item_code',
                            headerName: '产品编码',
                            hcRequired: true,
                            pinned: 'left',
                            // onCellDoubleClicked: function (args) {
                            //     $scope.chooseItem(args);
                            // },
                            // onCellValueChanged: function (args) {
                            //
                            //     if (args.newValue === args.oldValue)
                            //         return;
                            //     //获取产品
                            //     getItem(args.newValue)
                            //         .catch(function (reason) {
                            //             return {
                            //                 item_id: 0,
                            //                 item_code: '',
                            //                 item_name: reason
                            //             };
                            //         })
                            //         .then(function (line) {
                            //             angular.extend(args.data, line);
                            //             return args.data;
                            //         })
                            //         //获取价格和设置价格信息以及体积
                            //         .then(getPrice)
                            //         .then(getItemQtyStock)
                            //         .then(setPriceData)
                            //         .then(setCubageData)
                            //         .then(setTotalAmt)
                            //         .then(setTotalQty)
                            //         .then(function () {
                            //             args.api.refreshView();
                            //         },function () {
                            //             args.api.refreshView();
                            //         });
                            // }
                        }, {
                            field: 'item_name',
                            headerName: '产品名称'
                        }, {
                            field: 'uom_name',
                            headerName: '单位'
                        }, {
                            field: 'warehouse_code',
                            headerName: '仓库编码',
                            hcRequired: true,
                            editable: function (args) {
                                return editable();
                            },
                            onCellDoubleClicked: function (args) {
                                $scope.chooseWareHouse(args);
                            },
                            onCellValueChanged: function (args) {

                                if (args.newValue === args.oldValue)
                                    return;

                                getWarehouse(args.newValue)
                                    .catch(function (reason) {
                                        return {
                                            warehouse_id: 0,
                                            warehouse_code: '',
                                            warehouse_name: reason
                                        };
                                    })
                                    .then(function (line) {
                                        angular.extend(args.data, line);
                                        return args.data;
                                    })
                                    .then(getItemQtyStock)
                                    .then(function () {
                                        args.api.refreshView();
                                    });
                            }
                        }, {
                            field: 'warehouse_name',
                            headerName: '仓库名称'
                        }, {
                            field: 'qty_onhand',
                            headerName: '可用库存数量',
                            type: '数量'
                        }, {
                            field: 'qty_bill',
                            headerName: '本次出库数量',
                            hcRequired: true,
                            editable: function (args) {
                                return editable();
                            },
                            type: '数量',
                            onCellValueChanged: function (args) {
                                if (args.newValue === args.oldValue)
                                    return;
                                if (args.newValue > args.oldValue) {
                                    args.data.qty_bill = args.oldValue;
                                    return;
                                }
                                qtyChange(args);
                                args.api.refreshCells();
                            }
                        }, {
                            field: 'audit_qty',
                            headerName: '累计出库数量',
                            type: '数量'
                        }, {
                            field: 'order_qty',
                            headerName: '订单数量'
                        }, {
                            field: 'price_bill',
                            headerName: '含税价',
                            type: '金额'
                        }, {
                            field: 'amount_bill',
                            headerName: '含税金额',
                            type: '金额'
                        }, {
                            field: 'spec_qty',
                            headerName: '包装数量',
                            type: '数量'
                        }, {
                            field: 'single_cubage',
                            headerName: '单品体积',
                            type: '体积'
                        }, {
                            field: 'cubage',
                            headerName: '体积',
                            type: '体积'
                        }, {
                            field: 'remark',
                            editable: function (args) {
                                return editable();
                            },
                            headerName: '备注'
                        }]
                };

                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /**
                 * 查产品
                 */
                $scope.chooseItem = function (args) {
                    $modal.openCommonSearch({
                            classId: 'item_org',
                            postData: {crm_entid: getCurrItem().crm_entid}
                        })
                        .result//响应数据
                        .then(function (response) {
                            args.data.item_id = response.item_id;
                            args.data.item_code = response.item_code;
                            args.data.item_name = response.item_name;
                            args.data.uom_id = response.uom_id;
                            args.data.uom_name = response.uom_name;
                            args.data.single_cubage = response.outbox_cubage;
                            args.data.spec_qty = response.spec_qty;
                            return args.data;
                        }).then(getPrice)
                        .then(getItemQtyStock)
                        .then(setPriceData)
                        .then(setCubageData)
                        .then(setTotalAmt)
                        .then(setTotalQty)
                        .then(function () {
                            args.api.refreshView();
                        });
                };

                /**
                 * 查仓库
                 */
                $scope.chooseWareHouse = function (args) {
                    $modal.openCommonSearch({
                            classId: 'warehouse',
                            sqlWhere: 'usable = 2 and warehouse_type = 1 and warehouse_property = 1'
                        })
                        .result//响应数据
                        .then(function (response) {
                            args.data.warehouse_id = response.warehouse_id;
                            args.data.warehouse_name = response.warehouse_name;
                            args.data.warehouse_code = response.warehouse_code;
                            return args.data;
                        }).then(getItemQtyStock).then(function () {
                        args.api.refreshView();
                    });
                };

                function getItem(code) {
                    var postData = {
                        classId: "item_org",
                        action: 'search',
                        data: {sqlwhere: "item_code = '" + code + "'"}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            if (data.item_orgs.length > 0) {

                                var item = data.item_orgs[0];
                                if (getCurrItem().crm_entid == item.crm_entid) {
                                    item.single_cubage = item.outbox_cubage;
                                    delete item.warehouse_id;
                                    return item;
                                } else {
                                    return $q.reject("编码" + code + "不归属于当前所选品类");
                                }
                            } else {
                                return $q.reject("产品编码【" + code + "】不可用");
                            }
                        });
                }

                function getWarehouse(code) {
                    var postData = {
                        classId: "warehouse",
                        action: 'search',
                        data: {sqlwhere: "warehouse_code = '" + code + "' and usable = 2 and warehouse_type = 1 and warehouse_property = 1"}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            if (data.warehouses.length > 0) {
                                return data.warehouses[0];
                            } else {
                                return $q.reject("仓库编码【" + code + "】不可用");
                            }
                        });
                }

                function getPrice(item) {
                    if (item.item_id > 0) {
                        var postData = {
                            classId: "sa_saleprice_head",
                            action: 'getprice',
                            data: {
                                item_id: item.item_id,
                                customer_id: getCurrItem().customer_id,
                                date_invbill: dateApi.today(),
                                search_flag: 1
                            }
                        };
                        return requestApi.post(postData).then(function (data) {
                            item.price_bill = data.price_bill;
                            item.sa_saleprice_line_id = data.sa_confer_price_line_id;
                            item.saleprice_type_name = data.attribute11;
                            return item;
                        }, function () {
                            return $q.reject("产品编码【" + item.item_code + "】未维护价格");
                        }).catch(function (msg) {
                            item.item_id = 0;
                            item.item_code = '';
                            item.item_name = msg;
                            return item;
                        });
                    } else {
                        return $q.reject("产品编码【" + item.item_code + "】不可用");
                    }

                }


                /**
                 * 查库存量
                 */
                function getItemQtyStock(data) {
                    if (data.item_id && data.warehouse_id) {
                        var postData = {
                            classId: "inv_current_inv",
                            action: 'search',
                            data: {
                                item_id: data.item_id,
                                warehouse_id: data.warehouse_id,
                                search_flag: 2,
                                plan_flag: 2
                            }
                        };
                        return requestApi.post(postData)
                            .then(function (response) {
                                if (response.inv_current_invs.length) {
                                    data.qty_onhand = response.inv_current_invs[0].qty_plan;
                                } else {
                                    data.qty_onhand = 0;
                                }
                                return data;
                            });
                    } else {
                        return data;
                    }
                }

                //设置明细行价格信息
                function setPriceData(item) {
                    item.price_bill_notax = numberApi.divide(item.price_bill, numberApi.sum(1, getCurrItem().tax_rate));  //price/1+r  未税价格
                    return item;
                }

                //设置明细行金额信息
                function setAmountData(item) {
                    item.amount_bill = numberApi.mutiply(item.qty_bill, item.price_bill);//含税金额
                    item.amount_bill_notax = numberApi.mutiply(item.qty_bill, item.price_bill_notax);//含税金额

                    return item;
                }

                //设置明细行体积信息
                function setCubageData(item) {
                    item.cubage = numberApi.mutiply(item.qty_bill, item.single_cubage);//总体积
                    return item;
                }

                //数量改变触发 修改体积  修改金额
                function qtyChange(args) {
                    setCubageData(args.data);
                    setAmountData(args.data);
                    setTotalAmt();
                    setTotalQty();
                }

                //计算合计金额
                function setTotalAmt() {
                    getCurrItem().amount_total = numberApi.sum(getCurrItem().inv_out_bill_lineofinv_out_bill_heads, 'amount_bill');//含税
                    getCurrItem().amount_total_notax = numberApi.sum(getCurrItem().inv_out_bill_lineofinv_out_bill_heads, 'amount_bill_notax');//不含税
                }

                //计算合计数量 体积
                function setTotalQty() {
                    getCurrItem().total_cubage = numberApi.sum(getCurrItem().inv_out_bill_lineofinv_out_bill_heads, 'cubage');
                    getCurrItem().qty_sum = numberApi.sum(getCurrItem().inv_out_bill_lineofinv_out_bill_heads, 'qty_bill');
                }


                $scope.customerObj = {
                    sqlWhere: "usable = 2",
                    afterOk: function (result) {
                        getCurrItem().customer_id = result.customer_id;
                        getCurrItem().customer_code = result.customer_code;
                        getCurrItem().customer_name = result.customer_name;
                        getCurrItem().tax_rate = result.tax_rate;
                        getCurrItem().take_man = result.take_man;
                        getCurrItem().address1 = result.address1;
                        getCurrItem().phone_code = result.phone_code;

                        getCurrItem().dept_id = result.dept_id;
                        getCurrItem().dept_code = result.dept_code;
                        getCurrItem().dept_name = result.dept_name;

                        getCurrItem().shipmode_id = result.shipmode_id;
                        getCurrItem().shipmode_code = result.shipmode_code;
                        getCurrItem().shipmode_name = result.shipmode_name;

                        getCurrItem().employee_id_operation = result.sale_employee_id;
                        getCurrItem().employee_code_operation = result.employee_code;
                        getCurrItem().employee_name_operation = result.employee_name;

                        getCurrItem().sale_area_id = result.sale_area_id;
                        getCurrItem().sale_area_code = result.sale_area_code;
                        getCurrItem().sale_area_name = result.sale_area_name;

                        getCurrItem().base_balance_type_id = result.base_balance_type_id;
                        getCurrItem().balance_type_code = result.balance_type_code;
                        getCurrItem().balance_type_name = result.balance_type_name;

                        doSelectCustomer(getCurrItem().customer_id);

                        $scope.crm_entidChange();
                    }
                };

                $scope.shipmodeObj = {
                    afterOk: function (result) {
                        getCurrItem().shipmode_id = result.shipmode_id;
                        getCurrItem().shipmode_code = result.shipmode_code;
                        getCurrItem().shipmode_name = result.shipmode_name;
                    }
                }

                $scope.balanceTypeObj = {
                    afterOk: function (result) {
                        getCurrItem().base_balance_type_id = result.base_balance_type_id;
                        getCurrItem().balance_type_code = result.balance_type_code;
                        getCurrItem().balance_type_name = result.balance_type_name;
                    }
                }

                $scope.deptObj = {
                    afterOk: function (result) {
                        getCurrItem().dept_id = result.dept_id;
                        getCurrItem().dept_code = result.dept_code;
                        getCurrItem().dept_name = result.dept_name;
                    }
                };

                $scope.warehouseObj = {
                    sqlWhere: "usable = 2 and warehouse_type = 1 and warehouse_property = 1",
                    afterOk: function (result) {
                        getCurrItem().warehouse_id = result.warehouse_id;
                        getCurrItem().warehouse_code = result.warehouse_code;
                        getCurrItem().warehouse_name = result.warehouse_name;
                    }
                }

                $scope.saleEmployeeObj = {
                    afterOk: function (result) {
                        getCurrItem().employee_id = result.sale_employee_id;
                        getCurrItem().employee_code = result.employee_code;
                        getCurrItem().employee_name = result.employee_name;
                    }
                }

                $scope.customerAddressObj = {
                    classId: 'customer_org',
                    title: '客户收货地址查询',
                    //postData:{search_flag:1,customer_id:getCurrItem().customer_id},
                    gridOptions: {
                        "columnDefs": [
                            {
                                headerName: "收货地址",
                                field: "address"
                            },
                            {
                                headerName: "收货人",
                                field: "take_man"
                            },
                            {
                                headerName: "电话",
                                field: "phone_code"
                            }
                        ]
                    },
                    beforeOpen: function () {
                        $scope.customerAddressObj.postData =
                        {search_flag: 1, customer_id: getCurrItem().customer_id};
                    },
                    afterOk: function (result) {
                        getCurrItem().address1 = result.address;
                        getCurrItem().take_man = result.take_man;
                        getCurrItem().phone_code = result.phone_code;
                        getCurrItem().customer_address_id = result.customer_address_id;
                    }
                }

                $scope.accountObj = {
                    title: "资金账户",
                    classId: "fd_fund_account",
                    gridOptions: {
                        "columnDefs": [
                            {
                                headerName: "账户编码",
                                field: "fund_account_code"
                            },
                            {
                                headerName: "账户名称",
                                field: "fund_account_name"
                            }
                        ]
                    },
                    afterOk: function (result) {
                        getCurrItem().fd_fund_account_id = result.fd_fund_account_id;
                        getCurrItem().fund_account_code = result.fund_account_code;
                        getCurrItem().fund_account_name = result.fund_account_name;
                    }
                }


                $scope.orderObj = {
                    classId: 'sa_out_bill_head',
                    title: '订单查询',
                    postData: {search_flag: 0},
                    sqlWhere: "stat = 5",
                    gridOptions: {
                        "columnDefs": [
                            {
                                headerName: "订单编号",
                                field: "sa_salebillno"
                            },
                            {
                                headerName: "客户编码",
                                field: "customer_code"
                            },
                            {
                                headerName: "客户名称",
                                field: "customer_name"
                            }, {
                                field: 'qty_sum',
                                headerName: '合计数量',
                                type: '数量'
                            }, {
                                field: 'amount_total',
                                headerName: '含税总额',
                                type: '金额'
                            }, {
                                headerName: "创建人",
                                field: "created_by"
                            },
                            {
                                headerName: "创建时间",
                                field: "creation_date"
                            }
                        ]
                    },
                    afterOk: function (result) {
                        getOrder(result.sa_out_bill_head_id);
                    }
                }

                function getOrder(id) {
                    var postData = {
                        classId: "sa_out_bill_head",
                        action: 'selectbillout',
                        data: {sa_out_bill_head_id: id}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            delete data.stat;
                            delete data.billtypecode;
                            angular.extend(getCurrItem(), data);
                            getCurrItem().inv_out_bill_lineofinv_out_bill_heads = data.sa_out_bill_lines;
                            $scope.gridOptions.hcApi.setRowData(getCurrItem().inv_out_bill_lineofinv_out_bill_heads);
                        });
                }

                $scope.directChange = function () {
                    if (getCurrItem().is_direct == 1) {
                        getCurrItem().fd_fund_account_id = 0;
                        getCurrItem().fund_account_code = "";
                        getCurrItem().fund_account_name = "";
                        getCurrItem().base_balance_type_id = 0;
                        getCurrItem().balance_type_code = "";
                        getCurrItem().balance_type_name = "";
                    }
                }

                // /*底部左边按钮*/
                // $scope.footerLeftButtons.add_line = {
                //     title: '增加行',
                //     click: function() {
                //         $scope.add_line && $scope.add_line();
                //     },
                //     hide: function () {
                //         return $scope.data.currItem.stat > 1;
                //     }
                // };
                $scope.footerLeftButtons.del_line = {
                    title: '删除行',
                    click: function () {
                        $scope.del_line && $scope.del_line();
                    },
                    hide: function () {
                        return $scope.data.currItem.stat > 1;
                    }
                };

                //验证表头信息是否填完
                $scope.validHead = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    return invalidBox;
                }

                /**
                 * 计算合计数据
                 */
                $scope.calSum = function () {
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            qty_bill: numberApi.sum(getCurrItem().inv_out_bill_lineofinv_out_bill_heads, 'qty_bill'),
                            order_qty: numberApi.sum(getCurrItem().inv_out_bill_lineofinv_out_bill_heads, 'order_qty'),
                            amount_bill: numberApi.sum(getCurrItem().inv_out_bill_lineofinv_out_bill_heads, 'amount_bill'),
                            cubage: numberApi.sum(getCurrItem().inv_out_bill_lineofinv_out_bill_heads, 'cubage'),
                            audit_qty: numberApi.sum(getCurrItem().inv_out_bill_lineofinv_out_bill_heads, 'audit_qty')

                        }
                    ]);
                }

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    bizData.stat = 1;
                    bizData.date_invbill = dateApi.today();
                    bizData.create_time = dateApi.now();
                    bizData.bluered = 'B';
                    bizData.billtypecode = "0204";
                    bizData.inv_out_type = 1;
                    bizData.inv_out_bill_lineofinv_out_bill_heads = [];
                    $scope.gridOptions.hcApi.setRowData(bizData.inv_out_bill_lineofinv_out_bill_heads);

                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.inv_out_bill_lineofinv_out_bill_heads);
                    if (bizData.is_copy == 2) {
                        $scope.refreshLine();
                    } else {
                        $scope.calSum();
                    }

                };


                $scope.copyBizData = function (bizData) {
                    //基础控制器的处理复制对象，已处理了ID、状态等字段
                    $scope.hcSuper.copyBizData(bizData);
                    bizData.date_invbill = dateApi.today();
                    bizData.create_time = dateApi.now();
                    bizData.creator = strUserId;
                    bizData.is_copy = 2;
                };

                //刷新库存 价格等信息
                $scope.refreshLine = function () {
                    var tasks = [];
                    //取行
                    $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                        var data = node.data;
                        tasks.push({
                            node: node,
                            data: data
                        });
                        tasks.forEach(function (value) {
                            getPrice(value.data).then(getItemQtyStock).then(function () {
                                $scope.gridOptions.api.refreshCells({
                                    rowNodes: [value.node]
                                });
                                setTotalAmt();
                                $scope.calSum();
                            });
                        });

                    });
                }

                /*底部左边按钮-函数定义*/
                $scope.add_line = function () {
                    var msg = $scope.validHead([]);
                    if (msg.length > 0) {
                        return swalApi.info(msg);
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

                        var data = getCurrItem().inv_out_bill_lineofinv_out_bill_heads;

                        for (var i = 0; i < rowCount; i++) {
                            var newLine = {
                                warehouse_id: getCurrItem().warehouse_id,
                                warehouse_code: getCurrItem().warehouse_code,
                                warehouse_name: getCurrItem().warehouse_name
                            };
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
                        getCurrItem().inv_out_bill_lineofinv_out_bill_heads.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData(getCurrItem().inv_out_bill_lineofinv_out_bill_heads);
                        setTotalQty();
                        setTotalAmt();
                        $scope.calSum();
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
