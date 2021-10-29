/**
 * 其他出库单-详情页
 * date:2018-12-21
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi', 'dateApi', 'numberApi'],
    function (module, controllerApi, base_obj_prop, swalApi, requestApi, dateApi, numberApi) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope', '$stateParams', '$modal', '$q',
            //控制器函数
            function ($scope, $stateParams, $modal, $q) {
                /**数据定义 */
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
                            hcRequired: true,
                            editable: Editable,
                            onCellDoubleClicked: chooseItem,
                            onCellValueChanged: function (args) {
                                if (args)
                                    if (args.newValue === args.oldValue)
                                        return;
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
                                        return args.data;
                                    })
                                    .then(function () {
                                        args.api.refreshView();
                                    });
                            }
                        }, {
                            field: 'item_name',
                            headerName: '产品名称',
                            onCellDoubleClicked: chooseItem
                        }, {
                            field: 'uom_name',
                            headerName: '单位',
                        }, {
                            field: 'warehouse_code',
                            headerName: '仓库编码',
                            hcRequired: true,
                            onCellDoubleClicked: chooseWareHouse
                        }, {
                            field: 'warehouse_name',
                            headerName: '仓库名称',
                            onCellDoubleClicked: chooseWareHouse
                        }, {
                            field: 'qty_bill',
                            headerName: '出库数量',
                            editable: Editable,
                            hcRequired: true,
                            type: '数量',
                            onCellValueChanged: function (args) {
                                checkGridMoneyInput(args, [countQty_sum, countAmount_bill, countCubage, calSum]);
                            }
                        },
                        {
                            field: 'price_bill',
                            headerName: '出库单价',
                            editable: Editable,
                            type: '金额',
                            onCellValueChanged: function (args) {
                                checkGridMoneyInput(args, [countAmount_bill]);
                            }
                        },
                        {
                            field: 'amount_bill',
                            headerName: '出库金额',
                            type: '金额',
                            onCellValueChanged: function (args) {
                                checkGridMoneyInput(args, [countAmount_bill, calSum]);
                            }
                        }, {
                            field: 'spec_qty',
                            headerName: '包装数量',
                            type: '数量'
                        },
                        {
                            field: 'single_cubage',
                            headerName: '单位体积(m³)',
                            onCellValueChanged: function (args) {
                                checkGridMoneyInput(args, [countCubage, calSum]);
                            },
                            type: "体积"
                        }, {
                            field: 'cubage',
                            headerName: '发货体积(m³)',
                            type: "体积"
                        }, {
                            field: 'sum_red_out',
                            headerName: '累计红冲量',
                            type: '数量'
                        }, {
                            field: 'note',
                            headerName: '备注',
                            editable: Editable
                        }
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
                function Editable(args) {
                    if (args && args.data.seq == "合计") {
                        return false;
                    }
                    return true;
                }

                function checkGridMoneyInput(args, functions) {
                    if (args.newValue === args.oldValue)
                        return;
                    if (numberApi.isNum(args.newValue) || numberApi.isStrOfNum(args.newValue)) {
                        functions.forEach(function (value) {
                            value(args.data);
                        })
                        args.api.refreshView();
                    } else {
                        return swalApi.info("请输入有效数字");
                    }
                }

                /**======================点击事件==========================**/



                //左下按钮
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

                /*$scope.footerLeftButtons.copyAndAdd_line = {
                 title: '批量导入',
                 click: function () {
                 $scope.copyAndAdd_line && $scope.copyAndAdd_line();
                 }
                 };*/
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
                        } else if (rowCount > 1000) {
                            swal.showInputError('请勿输入过大的行数(1000以内为宜)');
                            return;
                        }

                        swal.close();

                        var data = $scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads;

                        for (var i = 0; i < rowCount; i++) {
                            var newLine = {
                                warehouse_code: $scope.data.currItem.warehouse_code,
                                warehouse_id: $scope.data.currItem.warehouse_id,
                                warehouse_name: $scope.data.currItem.warehouse_name
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
                            countTotal_bud_invest_amt();
                        },
                        okTitle: '删除成功'
                    });
                }
                /**============================逻辑计算====================================**/

                var param_value = 0;
                requestApi.post('inv_param', 'select', {param_code: 'NOSTOCKCANAUDITING'})
                    .then(function (response) {
                        param_value = response.param_value;
                    });

                /**
                 * 检查数据
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.stopEditingAllGrid();
                    $scope.hcSuper.validCheck(invalidBox);
                    if (!$scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads.length > 0) {
                        invalidBox.push("明细不能为空");
                    }
                    if (param_value != 2) {
                        var defer = $q.defer();
                        var promises = [];
                        $scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads.forEach(function (item, i) {
                            if (item.item_id) {
                                var postData = {
                                    item_id: item.item_id ? item.item_id : 0,
                                    search_flag: 2,
                                    plan_flag: 2,
                                    warehouse_id: item.warehouse_id ? item.warehouse_id : 0
                                };
                                promises.push(requestApi.post('inv_current_inv', 'search', postData))
                            }
                        });

                        return $q.all(promises)
                            .then(function (responses) {
                                responses.forEach(function (response, i) {
                                    var lineRow = $scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads[i];
                                    var rowCountStr = "第" + (i + 1) + "行";
                                    if (response.inv_current_invs.length > 0 && lineRow.item_id && lineRow.warehouse_id) {
                                        var stock = response.inv_current_invs[0].qty_plan;
                                        if (numberApi.compare(stock, lineRow.qty_bill) == -1) {
                                            invalidBox.push(rowCountStr + '仓库[' + lineRow.warehouse_name + ']' +
                                                '产品[' + lineRow.item_name + ']可使用库存数量[' + stock + ']小于出库数量[' + lineRow.qty_bill + ']');
                                        }
                                    } else if (response.inv_current_invs.length == 0 && lineRow.item_id && lineRow.warehouse_id) {
                                        invalidBox.push(rowCountStr + '仓库[' + lineRow.warehouse_name + ']' +
                                            '产品[' + lineRow.item_name + ']没有匹配到可使用库存数量');
                                    }
                                });
                                defer.resolve();
                                return invalidBox;
                            })
                    } else {
                        return invalidBox;
                    }
                };

                /**
                 * 计算明细行发货体积;
                 *出库数量*单位体积
                 * @param data
                 */
                function countCubage(data) {
                    if (HczyCommon.isNotNull(data.single_cubage) && HczyCommon.isNotNull(data.qty_bill)) {
                        data.cubage = numberApi.mutiply(data.single_cubage, data.qty_bill);
                    }
                    countTotal_Cubage();
                }

                /**
                 * 计算明细行出库金额;
                 *出库数量*出库单价
                 * @param data
                 */
                function countAmount_bill(data) {
                    if (HczyCommon.isNotNull(data.price_bill) && HczyCommon.isNotNull(data.qty_bill)) {
                        data.amount_bill = numberApi.mutiply(data.price_bill, data.qty_bill);
                    }
                    countTotal_Amount_bill();
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
                    calSum();
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
                    calSum();
                }

                /**
                 * 计算合计数据
                 */
                function calSum() {
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            qty_bill: numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'qty_bill'),
                            amount_bill: numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'amount_bill'),
                            sum_red_out: numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'sum_red_out'),
                            cubage: numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'cubage'),
                        }
                    ]);
                }

                /**输入框改变时自动查询产品 **/
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
                                return {
                                    item_id: item.item_id,
                                    item_code: item.item_code,
                                    item_name: item.item_name,
                                    uom_name: item.uom_name,
                                    uom_id: item.uom_id,
                                    single_cubage: item.cubage,
                                    spec_qty: item.spec_qty
                                }
                                    ;
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
                        inv_out_type: 1,
                        billtypecode: "0299",
                    })
                    ;
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
                /**============================通用查询 ===================**/

                /**
                 * 人员查询
                 */
                $scope.chooseUser = function () {
                    $modal.openCommonSearch({
                        classId: 'base_view_erpemployee_org'
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
                        postData: {search_flag: 3},
                        action: 'search',
                        title: "部门",
                    })
                        .result//响应数据
                        .then(function (result) {
                            $scope.data.currItem.dept_id = result.dept_id;
                            $scope.data.currItem.dept_code = result.dept_code;
                            $scope.data.currItem.dept_name = result.dept_name;
                        });
                }

                $scope.chooseOrg = chooseOrg;

                /**
                 * 查仓库
                 */
                $scope.chooseWareHouse = chooseWareHouse;

                function chooseWareHouse(args) {
                    if (args && args.data.seq == "合计") {
                        return;
                    }
                    $modal.openCommonSearch({
                        classId: 'warehouse',
                        sqlWhere: ' usable =2 and warehouse_type = 1 and is_end = 2 '
                    })
                        .result//响应数据
                        .then(function (response) {
                            if (args) {
                                args.data.warehouse_id = response.warehouse_id;
                                args.data.warehouse_name = response.warehouse_name;
                                args.data.warehouse_code = response.warehouse_code;
                                args.data.dept_name = response.dept_name;
                                args.data.dept_id = response.dept_id;
                                args.data.dept_code = response.dept_code;
                                args.api.refreshView();
                            } else {
                                $scope.data.currItem.warehouse_name = response.warehouse_name;
                                $scope.data.currItem.warehouse_code = response.warehouse_code;
                                $scope.data.currItem.warehouse_id = response.warehouse_id;
                            }
                        });
                }

                /**
                 * 通用查询设置
                 * @type {{chooseWareType: {afterOk: afterOk}}}
                 */
                $scope.commonSearchSetting = {
                    chooseWareType: {
                        postData: {
                            flag: 2
                        },
                        afterOk: function (result) {
                            $scope.data.currItem.out_ware_type_code = result.out_ware_type_code;
                            $scope.data.currItem.out_ware_type_name = result.out_ware_type_name;
                            $scope.data.currItem.out_ware_type_id = result.out_ware_type_id;
                        },
                        sqlwhere: " out_ware_direction = 1 and is_active = 2 "
                    }
                };


                /**
                 * 组织客户查询
                 */
                $scope.customerSearch = function () {
                    $modal.openCommonSearch({
                        classId: 'customer_org',
                        sqlWhere: 'co.usable = 2'
                    })
                        .result//响应数据
                        .then(function (result) {
                            $scope.data.currItem.customer_name = result.customer_name;
                            $scope.data.currItem.customer_code = result.customer_code;
                            $scope.data.currItem.customer_id = result.customer_id;
                            $scope.data.currItem.dept_name = result.dept_name;
                            $scope.data.currItem.dept_id = result.dept_id;
                            $scope.data.currItem.dept_code = result.dept_code;
                            getCustomerDefaultAdress();
                        });
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
                        action: 'getCustomerInfo',
                        title: "收货地址",
                        sqlWhere: ' customer_id = ' + $scope.data.currItem.customer_id,
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
                            $scope.data.currItem.cust_name = response.take_man;
                            $scope.data.currItem.cust_phone = response.phone_code;
                        });
                };

                /**
                 * 取客户默认地址
                 */
                function getCustomerDefaultAdress() {
                    var postData = {
                        classId: "customer_org",
                        action: 'select',
                        data: {customer_id: $scope.data.currItem.customer_id}
                    };
                    return requestApi.post(postData)
                        .then(function (response) {
                            if (response.customer_addressofcustomer_orgs.length) {
                                for (var i = 0; i < response.customer_addressofcustomer_orgs.length; i++) {
                                    if (parseInt(response.customer_addressofcustomer_orgs[i].defaulted) == 2) {
                                        $scope.data.currItem.address1 = response.customer_addressofcustomer_orgs[i].address1;
                                        $scope.data.currItem.cust_phone = response.customer_addressofcustomer_orgs[i].phone_code;
                                        $scope.data.currItem.cust_name = response.customer_addressofcustomer_orgs[i].take_man;
                                    }
                                }
                            }
                        })
                }

                /**
                 * 查产品
                 */
                $scope.chooseItem = chooseItem

                /**
                 * 选择产品
                 * @return {Promise}
                 */
                function chooseItem(args) {
                    if (args && args.data.seq == "合计") {
                        return;
                    }
                    return $modal.openCommonSearch({
                        classId: 'item_org'
                    })
                        .result//响应数据
                        .then(function (data) {
                            [
                                'item_id',
                                'item_code',
                                'item_name',
                                'uom_name',
                                'uom_id',
                                'spec_qty'
                            ]
                                .forEach(function (key) {
                                    args.data[key] = data[key];
                                });
                            args.data.single_cubage = data.cubage;
                            args.api.refreshView();

                        });
                }

                /**
                 * 查发运方式
                 */
                $scope.chooseShip = function () {
                    $modal.openCommonSearch({
                        classId: 'shipmode'
                    })
                        .result//响应数据
                        .then(function (response) {
                            $scope.data.currItem.shipmode_name = response.shipmode_name;
                            $scope.data.currItem.shipmode_code = response.shipmode_code;
                            $scope.data.currItem.shipmode_id = response.shipmode_id;

                        });
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