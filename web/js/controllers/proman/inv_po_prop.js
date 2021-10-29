/**
 * 采购订单-属性页
 * 2018-12-18 inv_po_prop.js
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'openBizObj', 'swalApi', 'loopApi', 'numberApi'],
    function (module, controllerApi, base_obj_prop, requestApi, openBizObj, swalApi, loopApi, numberApi) {
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
                                getSalaryGroup(args.newValue)
                                    .catch(function (reason) {
                                        return {
                                            item_id: 0,
                                            item_code: '',
                                            item_name: reason
                                        };
                                    })
                                    .then(function (line) {
                                        angular.extend(args.data, line);
                                        args.data.item_id = line.item_id;
                                        args.data.item_code = line.item_code;
                                        args.data.item_name = line.item_name;
                                        args.data.uom_name = line.uom_name;
                                        args.data.cubage = line.cubage;
                                        args.data.count_percase = line.spec_qty;
                                        args.data.qty_po = 0;
                                        args.data.price_potaxprice = 0;
                                        return args.data;
                                    }).then(function () {
                                        args.api.refreshView();
                                    })
                                    //重算体积金额
                                    .then($scope.settotal_cubage).then(setAmount)
                                    .then(function () {
                                        args.api.refreshView();
                                    }).then($scope.calTotal);
                            },
                        }, {
                            field: 'item_name',
                            headerName: '产品名称',
                        }, {
                            field: 'uom_name',
                            headerName: '单位',
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
                            headerName: '仓库名称',
                        }, {
                            field: 'qty_po',
                            headerName: '订购数量',
                            type: '数量',
                            editable: function (args) {
                                return editable(args) && args.data.item_id > 0
                            },
                            onCellDoubleClicked: function (args) {
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
                            field: 'price_potaxprice',
                            headerName: '含税价格',
                            type: '金额',
                            editable: function (args) {
                                return editable(args) && $scope.data.currItem.price_from != 2;
                            },
                            onCellValueChanged: function (args) {
                                setAmount(args);
                                args.api.refreshView();
                            }
                        }, {
                            field: 'amount_potax',
                            headerName: '含税金额',
                            editable: false,
                            type: '金额'
                        }, {
                            field: 'cubage',
                            headerName: '单品体积',
                            type: '体积'
                        }, {
                            field: 'total_cubage',
                            headerName: '本次采购体积',
                            editable: false,
                            type: '体积'
                        }, {
                            field: 'count_percase',
                            headerName: '包装数量',
                            editable: false,
                            type: '数量'
                        }, {
                            field: 'line_remark',
                            headerName: '备注',
                            editable: function (args) {
                                return editable(args)
                            }
                        }, {
                            field: 'qty_sum',
                            headerName: '已入库数量',
                            type: '数量'
                        }
                    ]
                };

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

                //查产品
                $scope.chooseItem = function (args) {
                    $modal.openCommonSearch({
                            classId: 'item_org',
                            action: 'search',
                            title: "产品",
                            gridOptions: {
                                columnDefs: [
                                    {
                                        headerName: "产品编码",
                                        field: "item_code"
                                    }, {
                                        headerName: "产品名称",
                                        field: "item_name"
                                    }, {
                                        headerName: "体积",
                                        field: "cubage"
                                    }, {
                                        headerName: "包装数量",
                                        field: "count_percase"
                                    }
                                ]
                            }
                        })
                        .result//响应数据
                        .then(function (result) {
                            if (result.item_id != args.data.item_id) {
                                args.data.item_id = result.item_id;
                                args.data.item_code = result.item_code;
                                args.data.item_name = result.item_name;
                                args.data.uom_name = result.uom_name;
                                args.data.cubage = result.cubage;
                                args.data.count_percase = result.spec_qty;
                                args.data.qty_po = 0;
                                args.data.price_potaxprice = 0;
                            }
                            return args;
                        })//重算体积金额
                        .then($scope.settotal_cubage).then(setAmount)
                        .then(function () {
                            args.api.refreshView();
                        }).then($scope.calTotal)
                };

                //查供应商
                // 用户名查询
                $scope.chooseVendor = {
                    sqlWhere: "usable = 2",
                    afterOk: function (result) {
                        $scope.data.currItem.vendor_id = result.vendor_id;
                        $scope.data.currItem.vendor_code = result.vendor_code;
                        $scope.data.currItem.vendor_name = result.vendor_name;
                        if (!$scope.data.currItem.contact) {
                            $scope.data.currItem.contact = result.contact;
                        }
                        ;
                        if (!$scope.data.currItem.tele) {
                            $scope.data.currItem.tele = result.tele;
                        }
                        ;
                        if (result.price_from == "" || result.price_from == null || result.price_from == 0) {
                            $scope.data.currItem.price_type = 1;
                        }
                        if (result.price_from == 1) {
                            $scope.data.currItem.price_type = undefined;
                        }
                        if (result.price_from == 2) {
                            $scope.data.currItem.price_type = 1;
                        }
                        $scope.data.currItem.price_from = result.price_from;
                        clearGridData();
                    }
                };

                function clearGridData() {
                    $scope.data.currItem.srm_po_lineofsrm_po_heads = [];
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.srm_po_lineofsrm_po_heads);
                }

                /**
                 * 查仓库
                 */
                $scope.chooseWarehouse = function (args) {
                    $modal.openCommonSearch({
                            classId: 'warehouse',
                            action: 'search',
                            sqlWhere: 'warehouse_type = 1 and warehouse_property = 1 and usable = 2',//有效的实物仓&&正品仓
                            title: "仓库资料",
                            gridOptions: {
                                columnDefs: [
                                    {
                                        headerName: "编码",
                                        field: "warehouse_code"
                                    }, {
                                        headerName: "名称",
                                        field: "warehouse_name"
                                    }
                                ]
                            }
                        })
                        .result//响应数据
                        .then(function (result) {
                            if (args) {
                                args.data.warehouse_id = result.warehouse_id;
                                args.data.warehouse_code = result.warehouse_code;
                                args.data.warehouse_name = result.warehouse_name;
                                $scope.calTotal();
                                args.api.refreshView();
                            } else {
                                $scope.data.currItem.warehouse_name = result.warehouse_name;
                                $scope.data.currItem.warehouse_code = result.warehouse_code;
                                $scope.data.currItem.warehouse_id = result.warehouse_id;
                                $scope.calTotal();
                            }
                        })
                };


                $scope.chooseDept = {
                    afterOk: function (result) {
                        $scope.data.currItem.dept_id = result.dept_id;
                        $scope.data.currItem.dept_code = result.dept_code;
                        $scope.data.currItem.dept_name = result.dept_name;
                    }
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
                 * 查询含税价格
                 * 取对应供应商、价格类型、有效期内的采购价格表中的含税单价
                 */
                $scope.queryPriceBill = function (args) {
                    var postdata = {
                        vendor_id: $scope.data.currItem.vendor_id,
                        item_id: args.data.item_id,
                        qty_po: args.data.qty_po,
                        price_type: $scope.data.currItem.price_type
                    };
                    return requestApi.post('srm_purchase_price', 'getprice', postdata)
                        .then(function (response) {
                            args.data.price_potaxprice = response.price_tax;
                            if (args.data.qty_po && args.data.price_potaxprice) {
                                args.data.amount_potax = numberApi.mutiply(args.data.qty_po, args.data.price_potaxprice);
                            }
                            return args;
                        }, function () {
                            args.data.price_potaxprice = 0;
                            args.data.amount_potax = 0;
                            return args;
                        });
                };

                //计算合计体积
                $scope.settotal_cubage = function (args) {
                    args.data.total_cubage = numberApi.mutiply(args.data.cubage, args.data.qty_po);
                    return args;
                };

                function setAmount(args) {
                    args.data.amount_potax = numberApi.mutiply(args.data.qty_po, args.data.price_potaxprice);
                }

                /*-------------------通用查询结束------------------------*/

                /*-------------------计算逻辑开始------------------------*/
                /**
                 * 计算总额
                 */
                $scope.calTotal = function () {

                    //合计数量
                    $scope.data.currItem.total_qty
                        = numberApi.sum($scope.data.currItem.srm_po_lineofsrm_po_heads, 'qty_po');

                    //合计体积
                    $scope.data.currItem.total_cubage
                        = numberApi.sum($scope.data.currItem.srm_po_lineofsrm_po_heads, 'total_cubage');

                    //合计金额
                    $scope.data.currItem.amount_potax
                        = numberApi.sum($scope.data.currItem.srm_po_lineofsrm_po_heads, 'amount_potax');
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            qty_po: numberApi.sum($scope.data.currItem.srm_po_lineofsrm_po_heads, 'qty_po'),
                            total_cubage: numberApi.sum($scope.data.currItem.srm_po_lineofsrm_po_heads, 'total_cubage'),
                            amount_potax: numberApi.sum($scope.data.currItem.srm_po_lineofsrm_po_heads, 'amount_potax'),
                        }
                    ]);
                };
                /*-------------------计算逻辑结束------------------------*/


                /**
                 * 新增时数据、网格默认设置
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData);
                    bizData.srm_po_lineofsrm_po_heads = [];
                    $scope.gridOptions.hcApi.setRowData(bizData.srm_po_lineofsrm_po_heads);
                    var formal_li = new Date();
                    var year = formal_li.getFullYear();
                    var month = formal_li.getMonth() + 1;
                    if (month < 10) {
                        month = "0" + month;
                    }
                    var today = formal_li.getDate();
                    if (today < 10) {
                        today = "0" + today;
                    }
                    bizData.podate = year + "-" + month + "-" + today;
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.srm_po_lineofsrm_po_heads);
                    $scope.calTotal();
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
                };
                $scope.footerLeftButtons.deleteRow.hide = function () {
                    return $scope.data.currItem.stat > 1;
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
                    $scope.data.currItem.srm_po_lineofsrm_po_heads.push(line);
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.srm_po_lineofsrm_po_heads);
                };

                /**
                 * 删除行
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.srm_po_lineofsrm_po_heads.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.srm_po_lineofsrm_po_heads);
                        $scope.calTotal();
                    }
                };

                function editable(args) {
                    if ($scope.data.currItem.stat == 1)
                        return true;
                    return false;
                }

                //明细验证
                $scope.validCheck = function (invalidBox) {
                    $scope.gridOptions.api.stopEditing();

                    $scope.hcSuper.validCheck(invalidBox);

                    var lineData = $scope.data.currItem.srm_po_lineofsrm_po_heads;
                    lineData.forEach(function (line, index) {
                        var row = index + 1;
                        if (!line.qty_po)
                            invalidBox.push('第' + row + '行订购数量不能为空');
                        if (!line.price_potaxprice && line.price_potaxprice == 0)
                            invalidBox.push('第' + row + '行订非法的价格数据');
                        if (!line.item_id)
                            invalidBox.push('第' + row + '行订产品不能为空');
                        if (!line.warehouse_id)
                            invalidBox.push('第' + row + '行订仓库不能为空');

                    });
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

