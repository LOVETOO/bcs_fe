/**
 * 其他入库单-详情页
 * date:2018-12-18
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
                            onCellDoubleClicked: chooseItem,
                            editable: Editable,
                            onCellValueChanged: function (args) {
                                if (!Editable(args)) {
                                    return;
                                }
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
                                    .then(getSpecialPrice)//取特价
                                    .then(searchItemQty.bind(undefined, args))//查库存
                                    .then(function () {
                                        countCubage(args.data);
                                        args.api.refreshView();
                                    });
                            }
                        }, {
                            field: 'item_name',
                            headerName: '产品名称',
                            onCellDoubleClicked: chooseItem,
                            maxWidth: 260
                        }, {
                            field: 'uom_name',
                            headerName: '单位',
                        }, {
                            field: 'warehouse_code',
                            headerName: '仓库编码',
                            onCellDoubleClicked: chooseWareHouse,
                        }, {
                            field: 'warehouse_name',
                            headerName: '仓库名称',
                        },
                        // {
                        //     field: 'qty_onhand',
                        //     headerName: '库存量',
                        //     type: '数量'
                        // },
                        {
                            field: 'qty_invbill',
                            headerName: '入库数量',
                            type: '数量',
                            editable: Editable,
                            onCellValueChanged: function (args) {
                                checkGridMoneyInput(args, [countamount_bill, countCubage, countReference_amt]);
                            }
                        }, {
                            field: 'price_bill',
                            headerName: '入库单价',
                            type: '金额',
                            editable: Editable,
                            onCellValueChanged: function (args) {
                                checkGridMoneyInput(args, [countamount_bill, countReference_amt]);
                            }
                        }, {
                            field: 'amount_bill',
                            headerName: '入库金额',
                            type: '金额',
                        }, {
                            field: 'reference_price',
                            headerName: '参考价',
                            type: '金额',
                            onCellValueChanged: function (args) {
                                checkGridMoneyInput(args, [countReference_amt]);
                            },
                            editable: Editable
                        }, {
                            field: 'reference_amt',
                            headerName: '参考金额',
                            type: '金额',
                        }, {
                            field: 'single_cubage',
                            headerName: '单位体积(m³)',
                            onCellValueChanged: function (args) {
                                checkGridMoneyInput(args, [countCubage]);
                            },
                            type: '体积'
                        }, {
                            field: 'cubage',
                            headerName: '体积(m³)',
                            type: '体积'
                        },
                        {
                            field: 'sum_red_out',
                            headerName: '累计红冲量',
                            type: '数量'
                        },
                        {
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
                    }
                    else {
                        return swalApi.info("请输入有效数字");
                    }
                }

                /**======================点击事件==========================**/

                    //底部右边按钮
                $scope.footerRightButtons.submit = {
                    title: '提交',
                    click: function () {
                        $scope.submit && $scope.submit();
                    },
                };
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

                        var data = $scope.data.currItem.inv_in_bill_lines;

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
                            $scope.data.currItem.inv_in_bill_lines = rowData;
                            countTotalAll();
                        },
                        okTitle: '删除成功'
                    });
                }
                /**============================逻辑计算====================================**/

                /**
                 * 计算合计数据
                 */
                $scope.calSum = function () {
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            qty_invbill: numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'qty_invbill'),
                            amount_bill: numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'amount_bill'),
                            cubage: numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'cubage'),
                            reference_amt: numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'reference_amt'),
                            sum_red_out: numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'sum_red_out')
                        }
                    ]);
                }

                /**
                 * 检查数据
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    $scope.stopEditingAllGrid();

                };

                /**
                 * 计算明细行入库金额;
                 *入库数量*入库单价
                 * @param data
                 */
                function countamount_bill(data) {
                    if (HczyCommon.isNotNull(data.price_bill) && HczyCommon.isNotNull(data.qty_invbill)) {
                        data.amount_bill = numberApi.mutiply(data.price_bill, data.qty_invbill);
                    }
                    countTotalAll();
                }

                /**
                 * 计算参考价格;
                 *入库数量*参考单价
                 * @param data
                 */
                function countReference_amt(data) {
                    if (HczyCommon.isNotNull(data.reference_price) && HczyCommon.isNotNull(data.qty_invbill)) {
                        data.reference_amt = numberApi.mutiply(data.reference_price, data.qty_invbill);
                    }
                    countTotalAll();
                }

                /**
                 * 计算明细行发货体积;
                 *出库数量*单位体积
                 * @param data
                 */
                function countCubage(data) {
                    if (HczyCommon.isNotNull(data.single_cubage) && HczyCommon.isNotNull(data.qty_invbill)) {
                        data.cubage = numberApi.mutiply(data.single_cubage, data.qty_invbill);
                    }
                    countTotal_Cubage();
                }

                /**
                 * 计算总额
                 */
                function countTotalAll() {
                    var total_qty = numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'qty_invbill');
                    var amount_total = numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'amount_bill');
                    var total_refer_amt = numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'reference_amt');
                    if (numberApi.isNum(total_qty)) {
                        HczyCommon.safeApply($scope, function () {
                            $scope.data.currItem.total_qty = total_qty;
                        })
                    }
                    if (numberApi.isNum(amount_total)) {
                        HczyCommon.safeApply($scope, function () {
                            $scope.data.currItem.amount_total = amount_total;
                        })
                    }
                    if (numberApi.isNum(total_refer_amt)) {
                        HczyCommon.safeApply($scope, function () {
                            $scope.data.currItem.total_refer_amt = total_refer_amt;
                        })
                    }
                    $scope.calSum();
                }

                /**
                 * 计算总体积
                 */
                function countTotal_Cubage() {
                    var total_cubage = numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'cubage');
                    if (numberApi.isNum(total_cubage)) {
                        HczyCommon.safeApply($scope, function () {
                            $scope.data.currItem.total_cubage = total_cubage;
                        })
                    }
                    $scope.calSum();
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
                        create_date: dateApi.now(),
                        bud_year: dateApi.nowYear(),
                        inv_in_bill_lines: [],
                        stat: 1,
                        billtypecode: "0199",
                        invbilldate: dateApi.today(),
                        year_month: new Date(dateApi.today()).Format('yyyy-MM')
                    });
                    $scope.gridOptions.api.setRowData($scope.data.currItem.inv_in_bill_lines);
                };

                /**
                 * 设置表格数据
                 * @param bizData
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);

                    $scope.gridOptions.hcApi.setRowData(bizData.inv_in_bill_lines);
                    $scope.calSum();
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
                            classId: 'dept'
                        })
                        .result//响应数据
                        .then(function (response) {
                            $scope.data.currItem.dept_id = response.dept_id;
                            $scope.data.currItem.dept_code = response.dept_code;
                            $scope.data.currItem.dept_name = response.dept_name;
                        });
                };
                $scope.chooseOrg = chooseOrg;

                /**
                 * 查仓库
                 */
                $scope.chooseWareHouse = chooseWareHouse
                function chooseWareHouse(args) {
                    if (!Editable(args)) {
                        return;
                    }
                    $modal.openCommonSearch({
                            classId: 'warehouse',
                            sqlWhere: ' usable =2 and warehouse_type = 1 and is_end = 2'
                        })
                        .result//响应数据
                        .then(function (result) {
                            if (args) {
                                args.data.warehouse_code = result.warehouse_code;
                                args.data.warehouse_name = result.warehouse_name;
                                args.data.warehouse_id = result.warehouse_id;
                                args.api.refreshView();
                                searchItemQty(args);
                            } else {
                                $scope.data.currItem.warehouse_code = result.warehouse_code;
                                $scope.data.currItem.warehouse_name = result.warehouse_name;
                                $scope.data.currItem.warehouse_id = result.warehouse_id;
                            }
                        });
                };

                /**
                 * 查出入库类型
                 */
                $scope.chooseWareType = function () {
                    $modal.openCommonSearch({
                            classId: 'inv_out_ware_type',
                            sqlWhere: " out_ware_direction = 2 and is_active = 2 ",
                            postData: {
                                flag: 1
                            }
                        })
                        .result//响应数据
                        .then(function (result) {
                            $scope.data.currItem.in_ware_type_code = result.out_ware_type_code;
                            $scope.data.currItem.in_ware_type_name = result.out_ware_type_name;
                            $scope.data.currItem.in_ware_type_id = result.out_ware_type_id;
                        });
                };

                /**
                 * 通用查询设置
                 * @type {{chooseWareType: {afterOk: afterOk}}}
                 */
                $scope.commonSearchSetting = {
                    chooseWareType: {
                        postData: {
                            flag: 1
                        },
                        afterOk: function (result) {
                            $scope.data.currItem.in_ware_type_code = result.out_ware_type_code;
                            $scope.data.currItem.in_ware_type_name = result.out_ware_type_name;
                            $scope.data.currItem.in_ware_type_id = result.out_ware_type_id;
                        },
                        sqlWhere: " out_ware_direction = 2 and is_active = 2 ",
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
                            countCubage(args.data);
                            args.api.refreshView();
                            searchItemQty(args);
                        });
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
                                };
                            } else {
                                return $q.reject("产品编码【" + code + "】不可用");
                            }
                        });
                }

                /**
                 * 查供应商档案
                 */
                $scope.chooseVendorOrg = chooseVendorOrg

                function chooseVendorOrg() {
                    $modal.openCommonSearch({
                            classId: 'vendor_org',
                            postData: {},
                            sqlWhere: "  usable = 2 ",
                            action: 'search',
                            title: "供应商档案",
                            gridOptions: {
                                columnDefs: [{
                                    headerName: "供应商编码",
                                    field: "vendor_code",
                                }, {
                                    headerName: "供应商名称",
                                    field: "vendor_name",
                                }, {
                                    headerName: "品类",
                                    field: "out_ware_direction",
                                }]
                            }
                        })
                        .result//响应数据
                        .then(function (result) {
                            $scope.data.currItem.vendor_code = result.vendor_code;
                            $scope.data.currItem.vendor_name = result.vendor_name;
                            $scope.data.currItem.vendor_id = result.vendor_id;
                        });
                };


                /**
                 * 查库存量
                 */
                function searchItemQty(args) {
                    if (args.data.item_id === undefined || args.data.warehouse_id === undefined) {
                        args.data.qty_onhand = 0;
                        args.api.refreshView();
                        return;
                    }
                    var postData = {
                        classId: "inv_current_inv",
                        action: 'search',
                        data: {
                            item_id: args.data.item_id,
                            warehouse_id: args.data.warehouse_id,
                            search_flag: 2,
                            plan_flag: 2
                        }
                    };
                    return requestApi.post(postData)
                        .then(function (response) {
                            if (response.inv_current_invs.length) {
                                args.data.qty_onhand = response.inv_current_invs[0].qty_onhand;
                                args.data.qty_plan = response.inv_current_invs[0].qty_plan;
                            } else {
                                data.qty_onhand = 0;
                                data.qty_plan = 0;
                            }
                            args.api.refreshView();
                            return args.data;
                        });
                }

                /**
                 * 取特价作为参考价
                 * @param data
                 */
                function getSpecialPrice(data) {
                    if (data.item_id && $scope.data.currItem.customer_id) {
                        //先取特价
                        var postData = {
                            item_id: data.item_id,
                            customer_id: $scope.data.currItem.customer_id,
                            invbilldate: $scope.data.currItem.invbilldate,
                            search_flag: 1
                        };
                        return requestApi.post('sa_saleprice_head', 'getprice', postData)
                            .then(function (response) {
                                data.reference_price = response.price_bill;
                                return data;
                            }, function () {
                                return swalApi.error("产品编码【" + data.item_code + "】未维护价格");
                            }).catch(function (msg) {
                                data.item_id = 0;
                                data.item_code = '';
                                data.reference_price = msg;
                                return data;
                            });
                    }

                }

                /**
                 * 根据记账日期生成记账月份
                 */
                $scope.onInvbilldateChange = function () {
                    $scope.data.currItem.year_month = new Date($scope.data.currItem.invbilldate).Format('yyyy-MM');
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