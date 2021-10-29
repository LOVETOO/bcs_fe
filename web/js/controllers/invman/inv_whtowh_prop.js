/**
 * 商品调拨单-属性页
 * date:2018-12-24
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


                // /**数据定义 */
                // $scope.data = {};
                // $scope.data.currItem = {};


                $scope.gridOptions = {
                    pinnedBottomRowData: [{seq: "合计:"}],
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
                                    .then(searchItemQty)
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
                            headerName: '单位'
                        }, {
                            field: 'warehouse_code_out',
                            headerName: '调出仓库编码',
                            hcRequired: true,
                            onCellDoubleClicked: chooseWareHouse,
                            onCellValueChanged: wareHouseChangeEvent,
                            editable: Editable
                        }, {
                            field: 'warehouse_name_out',
                            headerName: '调出仓库名称',
                            onCellDoubleClicked: chooseWareHouse
                        },
                        {
                            field: 'qty_onhand',
                            headerName: '实际库存量',
                            type: '数量',
                        }, {
                            field: 'qty_plan',
                            headerName: '可用库存量',
                            type: '数量'
                        }, {
                            field: 'qty_moved',
                            headerName: '调拨数量',
                            hcRequired: true,
                            editable: Editable,
                            type: '数量',
                            onCellValueChanged: function (args) {
                                checkGridMoneyInput(args, [countAmount_bill, countCubage]);
                            }
                        },
                        {
                            field: 'price_bill',
                            headerName: '单价',
                            editable: Editable,
                            hcRequired: true,
                            type: '金额',
                            onCellValueChanged: function (args) {
                                checkGridMoneyInput(args, [countAmount_bill]);
                            }
                        },
                        {
                            field: 'amount_bill',
                            headerName: '金额',
                            type: '金额',
                            onCellValueChanged: function (args) {
                                checkGridMoneyInput(args, [countAmount_bill]);
                            }
                        },
                        {
                            field: 'warehouse_code_in',
                            headerName: '调入仓库编码',
                            hcRequired: true,
                            onCellDoubleClicked: chooseWareHouse,
                            onCellValueChanged: wareHouseChangeEvent,
                            editable: Editable
                        }, {
                            field: 'warehouse_name_in',
                            headerName: '调入仓库名称',
                            onCellDoubleClicked: chooseWareHouse
                        },
                        {
                            field: 'single_cubage',
                            headerName: '单位体积(m³)',
                            onCellValueChanged: function (args) {
                                checkGridMoneyInput(args, [countCubage]);
                            },
                            type: "体积"
                        },
                        {
                            field: 'cubage',
                            headerName: '发货体积(m³)',
                            type: "体积"
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
                    if (args.data.seq == "合计:") {
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
                    }
                    else {
                        return swalApi.info("请输入有效数字");
                    }
                }

                /**======================点击事件==========================**/
                /*底部左边按钮*/
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

                        var data = $scope.data.currItem.inv_whtowh_lineofinv_whtowh_heads;

                        for (var i = 0; i < rowCount; i++) {
                            var newLine = {
                                warehouse_id_in: $scope.data.currItem.to_wh_id,
                                warehouse_code_in: $scope.data.currItem.to_wh_code,
                                warehouse_name_in: $scope.data.currItem.to_wh_name,
                                warehouse_id_out: $scope.data.currItem.from_wh_id,
                                warehouse_code_out: $scope.data.currItem.from_wh_code,
                                warehouse_name_out: $scope.data.currItem.from_wh_name,
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
                            if (index === (rowData.length - 1)) {
                                $scope.gridOptions.api.focusedCellController.clearFocusedCell();
                            }
                            rowData.splice(index, 1);
                            $scope.gridOptions.hcApi.setRowData(rowData);
                            $scope.data.currItem.inv_whtowh_lineofinv_whtowh_heads = rowData;
                        },
                        okTitle: '删除成功'
                    });
                }

                /**
                 * 更新调出仓库
                 */
                $scope.fromWareHouse = function () {
                    if (!$scope.data.currItem.from_wh_id) {
                        swalApi.info("请先选择调出仓库");
                    } else {
                        swalApi.confirmThenSuccess({
                            title: "将设置明细里所有调出仓库为[" + $scope.data.currItem.from_wh_name + "]",
                            okFun: function () {
                                $scope.data.currItem.inv_whtowh_lineofinv_whtowh_heads.forEach(function (row) {
                                    row.warehouse_id_out = $scope.data.currItem.from_wh_id;
                                    row.warehouse_code_out = $scope.data.currItem.from_wh_code;
                                    row.warehouse_name_out = $scope.data.currItem.from_wh_name;
                                    $q.when()
                                        .then(searchItemQty.bind(undefined, row))
                                        .then(function () {
                                            $scope.gridOptions.api.setRowData($scope.data.currItem.inv_whtowh_lineofinv_whtowh_heads);
                                        });
                                })
                            },
                            okTitle: '设置成功'
                        });
                    }
                };

                /**
                 * 更新调入仓库
                 */
                $scope.toWareHouse = function () {
                    if (!$scope.data.currItem.to_wh_id) {
                        swalApi.info("请先选择调入仓库");
                    } else {
                        swalApi.confirmThenSuccess({
                            title: "将设置明细里所有调入仓库为[" + $scope.data.currItem.to_wh_name + "]",
                            okFun: function () {
                                $scope.data.currItem.inv_whtowh_lineofinv_whtowh_heads.forEach(function (row) {
                                    row.warehouse_id_in = $scope.data.currItem.to_wh_id;
                                    row.warehouse_code_in = $scope.data.currItem.to_wh_code;
                                    row.warehouse_name_in = $scope.data.currItem.to_wh_name;
                                })
                                $scope.gridOptions.api.setRowData($scope.data.currItem.inv_whtowh_lineofinv_whtowh_heads);
                            },
                            okTitle: '设置成功'
                        });
                    }
                };
                /**============================逻辑计算====================================**/
                /**
                 * 检查数据
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    $scope.stopEditingAllGrid();
                };

                /**
                 * 计算明细行发货体积;
                 *出库数量*单位体积
                 * @param data
                 */
                function countCubage(data) {
                    if (HczyCommon.isNotNull(data.single_cubage) && HczyCommon.isNotNull(data.qty_moved)) {
                        data.cubage = numberApi.mutiply(data.single_cubage, data.qty_moved);
                    }
                    calSum();
                }

                /**
                 * 计算明细行出库金额;
                 *出库数量*出库单价
                 * @param data
                 */
                function countAmount_bill(data) {
                    if (HczyCommon.isNotNull(data.price_bill) && HczyCommon.isNotNull(data.qty_moved)) {
                        data.amount_bill = numberApi.mutiply(data.price_bill, data.qty_moved);
                    }
                    calSum();
                }


                /**
                 * 计算合计数据
                 */
                function calSum() {
                    //合计数量
                    $scope.data.currItem.qty_sum
                        = numberApi.sum($scope.data.currItem.inv_whtowh_lineofinv_whtowh_heads, 'qty_moved');
                    //合计体积
                    $scope.data.currItem.total_cubage
                        = numberApi.sum($scope.data.currItem.inv_whtowh_lineofinv_whtowh_heads, 'cubage');
                    //合计金额
                    $scope.data.currItem.amount_total
                        = numberApi.sum($scope.data.currItem.inv_whtowh_lineofinv_whtowh_heads, 'amount_bill');
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计:',
                            qty_moved: numberApi.sum($scope.data.currItem.inv_whtowh_lineofinv_whtowh_heads, 'qty_moved'),
                            amount_bill: numberApi.sum($scope.data.currItem.inv_whtowh_lineofinv_whtowh_heads, 'amount_bill'),
                            cubage: numberApi.sum($scope.data.currItem.inv_whtowh_lineofinv_whtowh_heads, 'cubage')
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
                                    single_cubage: item.cubage
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
                        inv_whtowh_lineofinv_whtowh_heads: [],
                        stat: 1,
                        bill_date: dateApi.today(),
                        shipmode_name: "汽运月结",
                        shipmode_code: "01",
                        shipmode_id: "1",
                        move_type: 1
                    });
                    $scope.gridOptions.api.setRowData($scope.data.currItem.inv_whtowh_lineofinv_whtowh_heads);
                };

                /**
                 * 设置表格数据
                 * @param bizData
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.inv_whtowh_lineofinv_whtowh_heads);
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
                        .then(function (result) {
                            $scope.data.currItem.creator = result.employee_name;
                        });
                };

                /**
                 * 查部门
                 */
                function chooseOrg() {
                    $modal.openCommonSearch({
                            classId: 'dept'
                        })
                        .result//响应数据
                        .then(function (result) {
                            $scope.data.currItem.dept_id = result.dept_id;
                            $scope.data.currItem.dept_code = result.dept_code;
                            $scope.data.currItem.dept_name = result.dept_name;

                        });
                };
                $scope.chooseOrg = chooseOrg;

                /**
                 * 查仓库
                 */
                $scope.chooseWareHouse = chooseWareHouse;

                function chooseWareHouse(args) {
                    if (args.data && args.data.seq == "合计:") {
                        return;
                    }
                    $modal.openCommonSearch({
                            classId: 'warehouse',
                            sqlWhere: ' usable =2 and warehouse_type = 1 and is_end =2 '
                        })
                        .result//响应数据
                        .then(function (response) {
                            if (args.data) {
                                if (args.colDef.field == "warehouse_code_in") {
                                    args.data.warehouse_id_in = response.warehouse_id;
                                    args.data.warehouse_name_in = response.warehouse_name;
                                    args.data.warehouse_code_in = response.warehouse_code;
                                }
                                if (args.colDef.field == "warehouse_code_out") {
                                    args.data.warehouse_id_out = response.warehouse_id;
                                    args.data.warehouse_name_out = response.warehouse_name;
                                    args.data.warehouse_code_out = response.warehouse_code;
                                }
                                args.api.refreshView();
                                return args.data;
                            } else {
                                if (args == "to") {
                                    $scope.data.currItem.to_wh_name = response.warehouse_name;
                                    $scope.data.currItem.to_wh_code = response.warehouse_code;
                                    $scope.data.currItem.to_wh_id = response.warehouse_id;
                                }
                                if (args == "from") {
                                    $scope.data.currItem.from_wh_name = response.warehouse_name;
                                    $scope.data.currItem.from_wh_code = response.warehouse_code;
                                    $scope.data.currItem.from_wh_id = response.warehouse_id;
                                }
                                return {};
                            }
                        })
                        .then(searchItemQty)
                        .then(function () {
                            if (args.api) {
                                args.api.refreshView();
                            }
                        });
                }

                /**
                 *  /**输入框改变时自动查询仓库编码
                 *  **/
                function wareHouseChangeEvent(args) {
                    if (args)
                        if (args.newValue === args.oldValue)
                            return;
                    //获取产品
                    getWareHouse(args)
                        .catch(function (reason) {
                            var data = {};
                            if (args.colDef.field == "warehouse_code_in") {
                                data.warehouse_id_in = 0;
                                data.warehouse_name_in = '';
                                data.warehouse_code_in = reason;
                            }
                            else if (args.colDef.field == "warehouse_code_out") {
                                data.warehouse_id_out = 0;
                                data.warehouse_name_out = '';
                                data.warehouse_code_out = reason;
                            }
                            return data;
                        })
                        .then(function (line) {
                            angular.extend(args.data, line);
                            return args.data;
                        })
                        .then(searchItemQty)
                        .then(function () {
                            args.api.refreshView();
                        });
                }

                /** 查询仓库编码 **/
                function getWareHouse(args) {
                    var postData = {
                        classId: "warehouse",
                        action: 'search',
                        data: {sqlwhere: " usable =2 and warehouse_type = 1 and warehouse_code= '" + args.newValue + "' "}//查有效的实物仓
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            if (data.warehouses.length > 0) {
                                var warehouse = data.warehouses[0];
                                if (args.colDef.field == "warehouse_code_in") {
                                    args.data.warehouse_id_in = warehouse.warehouse_id;
                                    args.data.warehouse_name_in = warehouse.warehouse_name;
                                    args.data.warehouse_code_in = warehouse.warehouse_code;
                                }
                                else if (args.colDef.field == "warehouse_code_out") {
                                    args.data.warehouse_id_out = warehouse.warehouse_id;
                                    args.data.warehouse_name_out = warehouse.warehouse_name;
                                    args.data.warehouse_code_out = warehouse.warehouse_code;
                                }
                                args.api.refreshView();
                                return args.data;
                            } else {
                                return $q.reject("仓库编码【" + args.newValue + "】不可用");
                            }
                        });
                }

                /**
                 * 查出库类型
                 */
                $scope.chooseWareType = function () {
                    $modal.openCommonSearch({
                            classId: 'inv_out_ware_type',
                            sqlWhere: "  is_active = 2 "
                        })
                        .result//响应数据
                        .then(function (result) {
                            $scope.data.currItem.out_ware_type_code = result.out_ware_type_code;
                            $scope.data.currItem.out_ware_type_name = result.out_ware_type_name;
                            $scope.data.currItem.out_ware_type_id = result.out_ware_type_id;

                        });
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

                        });
                };
                /**
                 * 查产品
                 */
                $scope.chooseItem = chooseItem

                /**
                 * 选择产品
                 * @return {Promise}
                 */
                function chooseItem(args) {
                    if (args && args.data.seq == "合计:") {
                        return;
                    }
                    $modal.openCommonSearch({
                            classId: 'item_org'
                        })
                        .result//响应数据
                        .then(function (data) {
                            [
                                'item_id',
                                'item_code',
                                'item_name',
                                'uom_name',
                                'uom_id'
                            ]
                                .forEach(function (key) {
                                    args.data[key] = data[key];
                                });
                            args.data.single_cubage = data.cubage;
                            return args.data;
                        })
                        .then(searchItemQty)
                        .then(function () {
                            args.api.refreshView();
                        });
                }

                /**
                 * 查库存量
                 */
                function searchItemQty(data) {
                    if (data.item_id && data.warehouse_id_out) {
                        var postData = {
                            classId: "inv_current_inv",
                            action: 'search',
                            data: {
                                item_id: data.item_id,
                                warehouse_id: data.warehouse_id_out,
                                search_flag: 2,
                                plan_flag: 2
                            }
                        };
                        return requestApi.post(postData)
                            .then(function (response) {
                                if (response.inv_current_invs.length) {
                                    data.qty_onhand = response.inv_current_invs[0].qty_onhand;
                                    data.qty_plan = response.inv_current_invs[0].qty_plan;
                                } else {
                                    data.qty_onhand = 0;
                                    data.qty_plan = 0;
                                }
                                return data;
                            });
                    }
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