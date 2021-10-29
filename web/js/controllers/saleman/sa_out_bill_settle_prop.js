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
            '$scope', '$stateParams', 'BasemanService', '$q',
            //控制器函数
            function ($scope, $stateParams, BasemanService, $q) {
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
                                        args.data.spec_qty = line.spec_qty;//凑整数量
                                        return args.data;
                                    })
                                    .then(getSpecialPrice)//取特价
                                    .then(getDaixiaoStock)
                                    .then(getNormalStock)
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
                            headerName: '单位',
                        },
                        {
                            field: 'attribute41',
                            headerName: '代销仓库实物库存',
                            type: '数量',
                        }, {
                            field: 'warehouse_code',
                            headerName: '发货仓库编码',
                            onCellDoubleClicked: chooseWareHouse
                        }, {
                            field: 'warehouse_name',
                            headerName: '发货仓库名称',
                            onCellDoubleClicked: chooseWareHouse
                        }
                        , {
                            field: 'qty_onhand',
                            headerName: '实际库存数量',
                            type: '数量',
                        }, {
                            field: 'qty_plan',
                            headerName: '可使用库存数量',
                            type: '数量'
                        },
                        {
                            field: 'qty_bill',
                            headerName: '开单数',
                            type: '数量',
                            editable: Editable,
                            onCellValueChanged: function (args) {
                                checkGridMoneyInput(args, [countQty_sum, countAmount_bill, countCubage]);
                            }
                        },
                        {
                            field: 'spec_qty',
                            headerName: '凑整数量',
                            type: '数量'
                        }, {
                            field: "",
                            headerName: "是否赠品",
                            type: "是否",
                            editable: Editable
                        },
                        {
                            field: 'reference_price',
                            headerName: '参考价',
                            type: '金额',
                            editable: Editable,
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
                            headerName: '开单体积',
                            type: '体积'
                        },
                        {
                            field: 'note',
                            headerName: '备注',
                            editable: Editable
                        }, {
                            field: 'remark_order_no',
                            headerName: '订单号',
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
                    if (args.data.seq == "合计") {
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
                        return BasemanService.swal("请输入有效数字");
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
                $scope.footerLeftButtons.add_line = {
                    title: '增加行',
                    click: function () {
                        $scope.add_line && $scope.add_line();
                    }
                };
                $scope.footerLeftButtons.del_line = {
                    title: '删除行',
                    click: function () {
                        $scope.del_line && $scope.del_line();
                    }
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
                        if (numberApi.compare(row.qty_plan, row.qty_bill) == -1) {
                            invalidBox.push('第' + (i + 1) + '行发货仓' + row.warehouse_name + '产品' + row.item_name + '可使用库存数量[' + row.qty_plan + ']小于开单数[' + row.qty_bill + ']');
                        }
                    })

                    return invalidBox;
                };

                /**
                 * 计算明细行开单体积;
                 * 开单数量* 单位体积
                 * @param data
                 */
                function countCubage(data) {
                    if (HczyCommon.isNotNull(data.qty_bill) && HczyCommon.isNotNull(data.single_cubage)) {
                        data.cubage = numberApi.mutiply(data.qty_bill, data.single_cubage);
                    }
                    countTotal_Cubage();
                }

                /**
                 * 计算明细行金额;
                 *  开单数 * 参考价
                 * @param data
                 */
                function countAmount_bill(data) {
                    if (HczyCommon.isNotNull(data.qty_bill) && HczyCommon.isNotNull(data.reference_price) && numberApi.isNum(data.reference_price)) {
                        data.amount_bill = numberApi.mutiply(data.qty_bill, data.reference_price);
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
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            qty_bill: numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'qty_bill'),
                            amount_bill: numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'amount_bill'),
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
                                    spec_qty: item.spec_qty,
                                    bar_code: item.bar_code
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
                /**============================通用查询 ===================**/

                /**
                 * 人员查询
                 */
                $scope.chooseUser = function () {
                    BasemanService.chooseUser({
                        scope: $scope,
                        realtime: true,
                        then: function (response) {
                            $scope.data.currItem.creator = response.employee_name;
                        }
                    })
                };

                /**
                 * 查部门
                 */
                function chooseOrg() {
                    BasemanService.chooseDept({
                        scope: $scope,
                        realtime: true
                    }).then(function (response) {
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
                    var sqlBlock = ' usable =2 and warehouse_type = 1 and warehouse_property = 1 '; //搜实物正品仓
                    if (args && args == 'sa') {
                        sqlBlock = ' usable =2 and warehouse_type = 1 and warehouse_property = 4 ';//搜实物代销仓
                    }
                    $scope.FrmInfo = {
                        title: "仓库",
                        thead: [{
                            name: "编码",
                            code: "warehouse_code"
                        }, {
                            name: "名称",
                            code: "warehouse_name"
                        }],
                        classid: "warehouse",
                        url: "/jsp/authman.jsp",
                        direct: "center",
                        ignorecase: true,
                        sqlBlock: sqlBlock,//查有效的实物仓
                        searchlist: ["warehouse_code", "warehouse_name"],
                        realtime: true
                    };
                    BasemanService.open(CommonPopController, $scope).result.then(function (response) {
                        if (args && args.data) {
                            args.data.warehouse_id = response.warehouse_id;
                            args.data.warehouse_name = response.warehouse_name;
                            args.data.warehouse_code = response.warehouse_code;
                            args.api.refreshView();
                        } else if (args && args == 'sa') { //代销
                            $scope.data.currItem.sa_warehouse_name = response.warehouse_name;
                            $scope.data.currItem.sa_warehouse_code = response.warehouse_code;
                            $scope.data.currItem.sa_warehouse_id = response.warehouse_id;
                            $scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads.forEach(function (row) {
                                getDaixiaoStock(row);
                            })
                        } else {
                            $scope.data.currItem.warehouse_name = response.warehouse_name;
                            $scope.data.currItem.warehouse_code = response.warehouse_code;
                            $scope.data.currItem.warehouse_id = response.warehouse_id;
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
                    $scope.FrmInfo = {
                        title: "收货地址",
                        thead: [{
                            name: "地址",
                            code: "address1"
                        }, {
                            name: "收货人",
                            code: "take_man"
                        }, {
                            name: "收货电话",
                            code: "phone_code"
                        }],
                        classid: "customer_org",
                        url: "/jsp/authman.jsp",
                        direct: "center",
                        action: 'getCustomerInfo',
                        ignorecase: true,
                        sqlBlock: ' customer_id = ' + $scope.data.currItem.customer_id,
                        searchlist: ["address1", "take_man", "phone_code"],
                        realtime: true
                    };
                    return BasemanService.open(CommonPopController, $scope).result
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
                    var postdata = {}
                    BasemanService.chooseCustomer({
                        title: '选择客户',
                        scope: $scope,
                        then: function (result) {
                            $scope.data.currItem.customer_name = result.customer_name;
                            $scope.data.currItem.customer_code = result.customer_code;
                            $scope.data.currItem.customer_id = result.customer_id;
                            $scope.data.currItem.employee_name = result.employee_name;
                            $scope.data.currItem.employee_code = result.employee_code;
                            $scope.data.currItem.employee_id = result.sale_employee_id;
                            $scope.data.currItem.dept_code = result.dept_code;
                            $scope.data.currItem.dept_name = result.dept_name;
                            $scope.data.currItem.dept_id = result.dept_id;
                        },
                        postdata: postdata
                    })
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
                    if (args && args.data.seq == "合计") {
                        return;
                    }
                    return BasemanService
                        .chooseItem({
                            scope: $scope,
                            realtime: true
                        })
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
                        .then(getDaixiaoStock)//查代销库存
                        .then(getNormalStock) //查正品库存
                        .then(function () {
                            args.api.refreshView();
                        })
                }

                /**
                 * 查发运方式
                 */
                $scope.chooseShip = function () {
                    $scope.FrmInfo = {
                        title: "发运方式",
                        thead: [{
                            name: "编码",
                            code: "shipmode_code"
                        }, {
                            name: "名称",
                            code: "shipmode_name"
                        }],
                        classid: "shipmode",
                        url: "/jsp/authman.jsp",
                        direct: "center",
                        ignorecase: true,
                        sqlBlock: '',
                        searchlist: ["shipmode_code", "shipmode_name"],
                        realtime: true
                    };
                    BasemanService.open(CommonPopController, $scope).result.then(function (response) {
                        $scope.data.currItem.shipmode_name = response.shipmode_name;
                        $scope.data.currItem.shipmode_code = response.shipmode_code;
                        $scope.data.currItem.shipmode_id = response.shipmode_id;
                    });
                };

                /**
                 * 查出库单（已审核）
                 */
                $scope.chooseOtherOut = function () {
                    $scope.FrmInfo = {
                        title: "其他出库单",
                        thead: [{
                            name: "其他出库单号",
                            code: "invbillno"
                        }, {
                            name: "客户编码",
                            code: "customer_code"
                        }, {
                            name: "客户名称",
                            code: "customer_name"
                        }, {
                            name: "部门",
                            code: "dept_name"
                        }],
                        classid: "inv_out_bill_head",
                        url: "/jsp/budgetman.jsp",
                        direct: "center",
                        postdata: {search_flag: 1},
                        sqlBlock: ' stat = 5',//查询条件
                        ignorecase: true,
                        searchlist: ["invbillno", "customer_code", "customer_name", "dept_name", "sale_area_name"]
                    };
                    BasemanService.open(CommonPopController, $scope).result
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
                    $scope.FrmInfo = {
                        title: "发运方式",
                        thead: [{
                            name: "编码",
                            code: "shipmode_code"
                        }, {
                            name: "名称",
                            code: "shipmode_name"
                        }],
                        classid: "shipmode",
                        url: "/jsp/authman.jsp",
                        direct: "center",
                        ignorecase: true,
                        sqlBlock: '',
                        searchlist: ["shipmode_code", "shipmode_name"],
                        realtime: true
                    };
                    return BasemanService.open(CommonPopController, $scope).result.then(function (response) {
                        $scope.data.currItem.shipmode_name = response.shipmode_name;
                        $scope.data.currItem.shipmode_code = response.shipmode_code;
                        $scope.data.currItem.shipmode_id = response.shipmode_id;
                    });
                };


                /**
                 * 取代销仓库存
                 */
                function getDaixiaoStock(data) {
                    if (data.item_id) {
                        var postData = {
                            item_id: data.item_id,
                            search_flag: 2,
                            sqlwhere: " warehouse_type = 1 and warehouse_property = 4 "
                        };
                        if ($scope.data.currItem.sa_warehouse_id) {
                            postData.warehouse_id = $scope.data.currItem.sa_warehouse_id;
                            return requestApi.post('inv_current_inv', 'search', postData)
                                .then(function (response) {
                                    if (response.inv_current_invs.length) {
                                        data.attribute41 = response.inv_current_invs[0].qty_plan;
                                    } else {
                                        data.attribute41 = 0;
                                    }
                                    return data;
                                })
                        }
                    } else {
                        return data;
                    }
                }

                /**
                 * 取正品仓库存
                 * @param data
                 */
                function getNormalStock(data) {
                    if (data.warehouse_id) {
                        var postData = {
                            item_id: data.item_id,
                            search_flag: 2,
                            sqlwhere: " warehouse_type = 1 and warehouse_property = 1 ",
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
                    else {
                        return data;
                    }
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
                            date_invbill: $scope.data.currItem.date_invbill,
                            search_flag: 1
                        };
                        return requestApi.post('sa_saleprice_head', 'getprice', postData)
                            .then(function (response) {
                                data.reference_price = response.price_bill;
                                data.sa_saleprice_line_id = response.sa_confer_price_line_id;
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
                 * 查委托代销开单（已审核）
                 */
                $scope.chooseSaleOut = function () {
                    $scope.FrmInfo = {
                        title: "其他出库单",
                        thead: [{
                            name: "其他出库单号",
                            code: "sa_salebillno"
                        }, {
                            name: "客户编码",
                            code: "customer_code"
                        }, {
                            name: "客户名称",
                            code: "customer_name"
                        }, {
                            name: "部门",
                            code: "dept_name"
                        }],
                        classid: "sa_out_bill_head",
                        url: "/jsp/budgetman.jsp",
                        direct: "center",
                        postdata: {search_flag: 2},
                        // sqlBlock: ' stat = 5',//查询条件
                        ignorecase: true,
                        searchlist: ["sa_salebillno", "customer_code", "customer_name", "dept_name", "sale_area_name"]
                    };
                    BasemanService.open(CommonPopController, $scope).result
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
                    // .then(function (response) {
                    //     loopApi.forLoop(response.sa_out_bill_lines.length, function (i) {
                    //         response.inv_out_bill_lineofinv_out_bill_heads[i].p_inv_out_bill_line_id
                    //             = response.sa_out_bill_lines[i].inv_out_bill_line_id;
                    //
                    //         response.inv_out_bill_lineofinv_out_bill_heads[i].invbillno = $scope.data.currItem.parent_billno;
                    //     });
                    //     $scope.gridOptions.hcApi.setRowData(response.inv_out_bill_lineofinv_out_bill_heads);
                    //     $scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads = response.inv_out_bill_lineofinv_out_bill_heads;
                    //     calSum();
                    // })
                };

                /**
                 * 查配送区域
                 */
                $scope.chooseDeliverArea = function () {
                    $scope.FrmInfo = {
                        title: "配送区域",
                        thead: [{
                            name: "编码",
                            code: "deliver_area_code"
                        }, {
                            name: "名称",
                            code: "deliver_area_name"
                        }],
                        classid: "sa_deliver_area",
                        url: "/jsp/authman.jsp",
                        direct: "center",
                        ignorecase: true,
                        sqlBlock: '',
                        searchlist: ["deliver_area_name", "deliver_area_code"],
                        realtime: true
                    };
                    return BasemanService.open(CommonPopController, $scope).result.then(function (response) {
                        $scope.data.currItem.sa_deliver_area_name = response.deliver_area_name;
                        $scope.data.currItem.sa_deliver_area_code = response.deliver_area_code;
                        $scope.data.currItem.sa_deliver_area_id = response.sa_deliver_area_id;
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