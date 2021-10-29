/**
 * 委托代销开单-属性页
 * 2018-12-25
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'numberApi', 'loopApi',
        'swalApi', 'dateApi', 'fileApi'],
    function (module, controllerApi, base_obj_prop, requestApi, numberApi, loopApi,
              swalApi, dateApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数
            function ($scope, $modal) {

                /*-------------------数据定义开始------------------------*/

                $scope.data = $scope.data || {};
                $scope.data.currItem = $scope.data.currItem || {};

                function editable(args) {
                    if ($scope.$eval('data.currItem.stat') == 1 && !args.node.rowPinned)
                        return true;
                    return false;
                }

                $scope.gridOptions = {
                    pinnedBottomRowData: [{seq: '合计'}],
                    columnDefs: [
                        {
                            type: '序号'
                        }
                        , {
                            field: 'item_code',
                            headerName: '产品编码',
                            pinned: 'left',
                            editable: function (args) {
                                return editable(args);
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
                                if ($scope.data.currItem.crm_entid > 0) {
                                    postdata.sqlwhere += " and crm_entid=" + $scope.data.currItem.crm_entid;
                                }

                                requestApi.post('item_org', 'search', postdata)
                                    .then(function (res) {
                                        if (res.item_orgs.length) {
                                            var data = res.item_orgs[0];

                                            args.data.item_id = data.item_id;
                                            args.data.item_name = data.item_name;

                                            //单位
                                            args.data.uom_id = data.uom_id;
                                            args.data.uom_name = data.uom_name;
                                            //条码
                                            args.data.bar_code = data.bar_code;
                                            //单位体积
                                            args.data.attribute51 = numberApi.toNumber(data.cubage);
                                            //凑整数量
                                            args.data.spec_qty = data.spec_qty;

                                            return args.data;
                                        } else {
                                            swalApi.info('产品编码【' + args.data.item_code + '】不存在');
                                            args.data.item_id = 0;
                                            args.data.item_name = '';
                                            args.data.item_code = '';
                                            args.api.refreshView();
                                            return;
                                        }
                                    })
                                    .then($scope.getPrice)
                                    .then($scope.getStock)
                                    .then(function () {
                                        args.api.refreshView();

                                        $scope.calLineData();

                                        $scope.calTotal();
                                    })
                            }
                        }
                        , {
                            field: 'item_name',
                            headerName: '产品名称',
                            pinned: 'left'
                        }
                        , {
                            field: 'bar_code',
                            headerName: '产品条码'
                        }
                        , {
                            field: 'uom_name',
                            headerName: '单位'
                        }
                        , {
                            field: 'qty_min_po',
                            headerName: '代销仓实物库存',
                            type: '数量'
                        }
                        , {
                            field: 'warehouse_code',
                            headerName: '发货仓库编码',
                            editable: function (args) {
                                return editable(args)
                            },
                            onCellDoubleClicked: function (args) {
                                if (editable(args)) {
                                    $scope.chooseWarehouse('', args);
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
                                            return args.data;
                                        } else {
                                            swalApi.info('仓库编码【' + args.data.warehouse_code + '】不存在');
                                            args.data.warehouse_id = 0;
                                            args.data.warehouse_name = '';
                                            args.data.warehouse_code = '';
                                            args.api.refreshView();
                                            return;
                                        }
                                    })
                                    .then($scope.getStock)
                                    .then(function () {
                                        args.api.refreshView();
                                    })
                            }
                        }
                        , {
                            field: 'warehouse_name',
                            headerName: '发货仓库名称'
                        }
                        , {
                            field: 'qty_onhand',
                            headerName: '当前库存'
                        }
                        , {
                            field: 'qty_plan',
                            headerName: '可用库存'
                        }
                        , {
                            field: 'qty_bill',
                            headerName: '开单数',
                            hcRequired: true,
                            type: '数量',
                            editable: function (args) {
                                return editable(args)
                            },
                            onCellValueChanged: function () {
                                $scope.calLineData();
                                $scope.calTotal();
                            }
                        }
                        , {
                            field: 'is_present',
                            headerName: '赠品',
                            type: '是否',
                            editable: function (args) {
                                return editable(args)
                            }
                        }
                        , {
                            field: 'spec_qty',
                            headerName: '凑整数量',
                            type: '数量'
                        }
                        , {
                            field: 'price_bill',
                            headerName: '参考价',
                            type: '金额',
                            editable: function (args) {
                                return editable(args)
                            },
                            onCellValueChanged: function () {
                                $scope.calLineData();
                                $scope.calTotal();
                            }
                        }
                        , {
                            field: 'amount_bill',
                            headerName: '金额',
                            type: '数量'
                        }
                        , {
                            field: 'attribute51',
                            headerName: '单位体积',
                            type: '体积'
                        }
                        , {
                            field: 'cubage',
                            headerName: '发货体积',
                            type: '体积'
                        }
                        , {
                            field: 'remark',
                            headerName: '备注',
                            editable: function (args) {
                                return editable(args)
                            }
                        }
                        // , {
                        //     field: 'remark_order_no',
                        //     headerName: '订单号',
                        //     editable : function (args) {
                        //         return editable(args)
                        //     }
                        // }
                    ]
                };

                /*-------------------数据定义结束------------------------*/

                /*-------------------通用查询开始------------------------*/

                $scope.commonSearchSetting = {
                    deliverArea: {
                        afterOk: function (response) {
                            $scope.data.currItem.item_class1 = response.item_class_id;
                            $scope.data.currItem.deliver_area_code = response.deliver_area_code;
                            $scope.data.currItem.deliver_area_name = response.deliver_area_name;
                        }
                    }
                };

                /**
                 * 查部门
                 */
                $scope.chooseOrg = function () {
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

                /**
                 * 查客户
                 */
                $scope.chooseCustomer = function (args) {
                    $modal.openCommonSearch({
                            classId: 'customer_org',
                            sqlWhere: ' usable = 2 and sale_type = 5'//有效且发货类型为‘委托代销’
                        })
                        .result//响应数据
                        .then(function (response) {
                            $scope.data.currItem.customer_name = response.customer_name;
                            $scope.data.currItem.customer_code = response.customer_code;
                            $scope.data.currItem.customer_id = response.customer_id;

                            $scope.data.currItem.employee_id = response.employee_id;
                            $scope.data.currItem.employee_name = response.employee_name;

                            return requestApi.post('customer_org', 'select',
                                {customer_org_id: response.customer_org_id})
                        })
                        .then(function (response) {
                            //客户有多个地址时可选择
                            $scope.data.currItem.is_singleAddr = 2;

                            if (response.customer_addressofcustomer_orgs.length) {
                                if (response.customer_addressofcustomer_orgs.length > 1) {
                                    $scope.data.currItem.is_singleAddr = 1;
                                }
                                loopApi.forLoop(response.customer_addressofcustomer_orgs.length, function (i) {
                                    //默认地址
                                    if (response.customer_addressofcustomer_orgs[i].defaulted = 2) {
                                        $scope.data.currItem.address1 = response.customer_addressofcustomer_orgs[i].address1;
                                        $scope.data.currItem.take_man = response.customer_addressofcustomer_orgs[i].take_man;
                                        $scope.data.currItem.phone_code = response.customer_addressofcustomer_orgs[i].phone_code;
                                    }
                                })
                            }
                            //带出第一行品类
                            if (response.customer_salepriceofcustomer_orgs.length && response.customer_salepriceofcustomer_orgs.length > 0) {
                                $scope.data.currItem.crm_entid = response.customer_salepriceofcustomer_orgs[0].crm_entid;
                            } else {
                                $scope.data.currItem.crm_entid = 0;
                            }

                        })
                };

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
                            sqlWhere: ' customer_id = ' + $scope.data.currItem.customer_id,
                            action: 'getCustomerInfo',
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
                 * 查产品
                 */
                $scope.chooseItem = function (args) {
                    var sql = ' item_usable = 2 ';
                    if ($scope.data.currItem.crm_entid) {
                        sql += ' and crm_entid = ' + $scope.data.currItem.crm_entid;
                    }
                    $modal.openCommonSearch({
                            classId: 'item_org',
                            sqlWhere: sql
                        })
                        .result//响应数据
                        .then(function (response) {
                            args.data.item_name = response.item_name;
                            args.data.item_code = response.item_code;
                            args.data.item_id = response.item_id;

                            //单位
                            args.data.uom_id = response.uom_id;
                            args.data.uom_name = response.uom_name;

                            //条码
                            args.data.bar_code = response.bar_code;

                            //单位体积
                            args.data.attribute51 = numberApi.toNumber(response.cubage);
                            //凑整数量
                            args.data.spec_qty = response.spec_qty;

                            return args.data;

                        })
                        .then($scope.getPrice)
                        .then($scope.getStock)
                        .then(function () {
                            args.api.refreshView();

                            $scope.calLineData();

                            $scope.calTotal();
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
                 * 查仓库
                 */
                $scope.chooseWarehouse = function (type, args) {
                    var sql = ' usable =2 and warehouse_type = 1 and is_end =2 ';//实物仓
                    if ('proxy' === type) {
                        if (!$scope.data.currItem.customer_id) {
                            return swalApi.info('请选择客户');
                        }
                        sql += ' and warehouse_property = 4 and customer_id = '
                            + $scope.data.currItem.customer_id;//代销仓
                    } else {
                        sql += ' and warehouse_property = 1  ';//正品仓
                    }
                    $modal.openCommonSearch({
                            classId: 'warehouse',
                            sqlWhere: sql
                        })
                        .result//响应数据
                        .then(function (response) {
                            if ('' === type && args) {
                                args.data.warehouse_id = response.warehouse_id;
                                args.data.warehouse_code = response.warehouse_code;
                                args.data.warehouse_name = response.warehouse_name;

                                args.api.refreshView();
                            } else if ('proxy' === type) {
                                $scope.data.currItem.proxy_warehouse_name = response.warehouse_name;
                                $scope.data.currItem.proxy_warehouse_code = response.warehouse_code;
                                $scope.data.currItem.proxy_warehouse_id = response.warehouse_id;
                            } else {
                                $scope.data.currItem.warehouse_name = response.warehouse_name;
                                $scope.data.currItem.warehouse_code = response.warehouse_code;
                                $scope.data.currItem.warehouse_id = response.warehouse_id;
                            }

                            return args.data;
                        })
                        .then($scope.getStock)
                        .then(function () {
                            args.api.refreshView();
                        })
                };

                /*-------------------通用查询结束---------------------*/


                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /**
                 * 新增时数据
                 * @param bizData
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);

                    bizData.is_sec = 1;//非二级代理商
                    bizData.is_exprot = 1;//是内销
                    bizData.is_have_order = 1;//无订单
                    bizData.sale_type = 3;//订单类型:3.委托代销
                    bizData.bill_type = 1;//单据类型:1.销售发货
                    bizData.bluered = 'B';//蓝单

                    bizData.date_invbill = dateApi.today();

                    bizData.created_by = strUserId;
                    bizData.creation_date = dateApi.now();

                    bizData.sa_out_bill_lines = [];

                    bizData.shipmode_id = 1;//默认汽运
                    return requestApi.post('shipmode', 'select', {shipmode_id: bizData.shipmode_id})
                        .then(function (data) {
                            bizData.shipmode_name = data.shipmode_name;
                        });
                };


                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);

                    $scope.gridOptions.hcApi.setRowData(bizData.sa_out_bill_lines);
                    $scope.calSum();
                    $scope.calTotal();
                };

                /**
                 * 保存前验证
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);

                    //校验开单数是否小于等于可用库存
                    var lines = $scope.data.currItem.sa_out_bill_lines.slice(0);
                    if (lines.length) {
                        loopApi.forLoop(lines.length, function (i) {
                            if (numberApi.toNumber(lines[i].qty_bill) > numberApi.toNumber(lines[i].qty_plan)) {
                                invalidBox.push(
                                    '发货仓【' + lines[i].warehouse_name + '】 ' +
                                    '产品【' + lines[i].item_name + '】的' +
                                    '可用库存【' + lines[i].qty_plan + '】' +
                                    '小于开单数【' + lines[i].qty_bill + '】')
                            }
                        });
                    }

                    return invalidBox;
                };

                /**
                 * 明细行值计算
                 */
                $scope.calLineData = function () {
                    var lineData = $scope.data.currItem.sa_out_bill_lines;

                    loopApi.forLoop(lineData.length, function (i) {
                        //金额 = 开单数*参考价
                        if (lineData[i].qty_bill && lineData[i].price_bill) {
                            lineData[i].amount_bill = numberApi.toNumber(lineData[i].qty_bill)
                                * numberApi.toNumber(lineData[i].price_bill);
                        }
                        //发货体积 = 开单数*单位体积
                        if (lineData[i].attribute51 && lineData[i].qty_bill) {
                            lineData[i].cubage = (numberApi.toNumber(lineData[i].qty_bill)
                            * numberApi.toNumber(lineData[i].attribute51));
                        }
                    });

                    $scope.gridOptions.hcApi.setRowData(lineData);

                    $scope.calSum();
                };

                /**
                 * 计算合计数据
                 */
                $scope.calTotal = function () {
                    //合计数量
                    $scope.data.currItem.qty_sum
                        = numberApi.sum($scope.data.currItem.sa_out_bill_lines, 'qty_bill');
                    //合计体积
                    $scope.data.currItem.total_cubage
                        = numberApi.sum($scope.data.currItem.sa_out_bill_lines, 'cubage');
                    //合计金额
                    $scope.data.currItem.amount_total
                        = numberApi.sum($scope.data.currItem.sa_out_bill_lines, 'amount_bill');
                };

                /**
                 * 计算合计行数据
                 */
                $scope.calSum = function () {
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            qty_bill: numberApi.sum($scope.data.currItem.sa_out_bill_lines, 'qty_bill'),
                            amount_bill: numberApi.sum($scope.data.currItem.sa_out_bill_lines, 'amount_bill'),
                            cubage: numberApi.sum($scope.data.currItem.sa_out_bill_lines, 'cubage')
                        }
                    ]);
                };

                /**
                 * 取价格
                 */
                $scope.getPrice = function (item) {
                    var postData = {
                        item_id: item.item_id,
                        customer_id: $scope.data.currItem.customer_id,
                        date_invbill: $scope.data.currItem.date_invbill,
                        search_flag: 1
                    };
                    return requestApi.post('sa_saleprice_head', 'getprice', postData)
                        .then(function (data) {
                            item.price_bill = data.price_bill;
                            item.sa_saleprice_line_id = data.sa_confer_price_line_id;
                            item.saleprice_type_name = data.attribute11;
                            return item;
                        }, function () {
                            return swalApi.error("产品编码【" + item.item_code + "】未维护价格");
                        }).catch(function (msg) {
                            item.item_id = 0;
                            item.item_code = '';
                            item.item_name = msg;
                            return item;
                        });
                };

                /**
                 * 取库存
                 */
                $scope.getStock = function (data) {
                    if (data.item_id) {
                        var postData = {
                            item_id: data.item_id,
                            search_flag: 2,
                            plan_flag: 2
                        };
                        if (data.warehouse_id) {
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
                                })
                                .then(function () {
                                    if ($scope.data.currItem.proxy_warehouse_id) {
                                        postData.warehouse_id = $scope.data.currItem.proxy_warehouse_id;

                                        return requestApi.post('inv_current_inv', 'search', postData)
                                    }
                                })
                                .then(function (response) {
                                    if (response.inv_current_invs.length) {
                                        data.qty_min_po = response.inv_current_invs[0].qty_onhand;
                                    } else {
                                        data.qty_min_po = 0;
                                    }
                                })
                        }

                    }
                };


                /**
                 * 增加行
                 */
                $scope.add_line = function () {
                    //先校验必填项
                    var invalidBox = $scope.validCheck([]);
                    if (invalidBox.length) {
                        return swalApi.info(invalidBox);
                    }

                    $scope.gridOptions.api.stopEditing();

                    var line = {};
                    if ($scope.data.currItem.warehouse_id) {
                        line.warehouse_id = $scope.data.currItem.warehouse_id;
                        line.warehouse_code = $scope.data.currItem.warehouse_code;
                        line.warehouse_name = $scope.data.currItem.warehouse_name;
                    }

                    line.discount_tax = 0;

                    $scope.data.currItem.sa_out_bill_lines.push(line);

                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.sa_out_bill_lines);
                };

                /**
                 * 删除行
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.sa_out_bill_lines.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.sa_out_bill_lines);
                    }
                };


                /**
                 * 标签页
                 */
                $scope.tabs.attach.hide = true;

                //按钮
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
