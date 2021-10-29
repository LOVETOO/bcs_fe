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
            '$scope', '$stateParams', 'BasemanService',
            //控制器函数
            function ($scope, $stateParams, BasemanService) {
                /**数据定义 */
                $scope.data = {};
                $scope.data.currItem = {};

                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'item_code',
                            headerName: '产品编码',
                            onCellDoubleClicked: chooseItem
                        }, {
                            field: 'item_name',
                            headerName: '产品名称',
                            onCellDoubleClicked: chooseItem
                        }, {
                            field: 'unit',
                            headerName: '单位',
                        }, {
                            field: 'in_ware_no',
                            headerName: '仓库编码',
                            onCellDoubleClicked: chooseWareHouse
                        }, {
                            field: 'in_ware_name',
                            headerName: '仓库名称',
                            onCellDoubleClicked: chooseWareHouse
                        }, {
                            field: 'stock_qty',
                            headerName: '库存量',
                            type: '数量',
                            editable: true
                        }, {
                            field: 'stock_in_qty',
                            headerName: '入库数量',
                            type: '数量',
                            editable: true,
                            onCellValueChanged: function (args) {
                                checkGridMoneyInput(args, [countStock_in_amt, countReference_amt]);
                            }
                        }, {
                            field: 'stock_in_price',
                            headerName: '入库单价',
                            type: '金额',
                            editable: true,
                            onCellValueChanged: function (args) {
                                checkGridMoneyInput(args, [countStock_in_amt, countReference_amt]);
                            }
                        }, {
                            field: 'stock_in_amt',
                            headerName: '入库金额',
                            type: '金额',
                        }, {
                            field: 'reference_price',
                            headerName: '参考价',
                            type: '金额',
                            onCellValueChanged: function (args) {
                                checkGridMoneyInput(args, [countReference_amt]);
                            },
                            editable: true
                        }, {
                            field: 'reference_amt',
                            headerName: '参考金额',
                            type: '金额',
                        }, {
                            field: 'note',
                            headerName: '备注',
                            editable: true
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
                function Editable() {
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

                        var data = $scope.data.currItem.other_in_ware_bill_lines;

                        for (var i = 0; i < rowCount; i++) {
                            var newLine = {
                                in_ware_no: $scope.data.currItem.in_ware_no,
                                in_ware_id: $scope.data.currItem.in_ware_id,
                                in_ware_name: $scope.data.currItem.in_ware_name
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
                            $scope.data.currItem.other_in_ware_bill_lines = rowData;
                            countTotal_bud_invest_amt();
                        },
                        okTitle: '删除成功'
                    });
                }
                /**============================逻辑计算====================================**/
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
                function countStock_in_amt(data) {
                    if (HczyCommon.isNotNull(data.stock_in_price) && HczyCommon.isNotNull(data.stock_in_qty)) {
                        data.stock_in_amt = numberApi.mutiply(data.stock_in_price, data.stock_in_qty);
                    }
                    countTotal_bud_invest_amt();
                }

                /**
                 * 计算参考价格;
                 *入库数量*参考单价
                 * @param data
                 */
                function countReference_amt(data) {
                    if (HczyCommon.isNotNull(data.reference_price) && HczyCommon.isNotNull(data.stock_in_qty)) {
                        data.reference_amt = numberApi.mutiply(data.reference_price, data.stock_in_qty);
                    }
                }

                /**
                 * 计算总额
                 */
                function countTotal_bud_invest_amt() {
                    var total_qty = numberApi.sum($scope.data.currItem.other_in_ware_bill_lines, 'stock_in_qty');
                    var total_amt = numberApi.sum($scope.data.currItem.other_in_ware_bill_lines, 'stock_in_amt');
                    if (numberApi.isNum(total_qty)) {
                        HczyCommon.safeApply($scope, function () {
                            $scope.data.currItem.total_qty = total_qty;
                        })
                    }
                    if (numberApi.isNum(total_amt)) {
                        HczyCommon.safeApply($scope, function () {
                            $scope.data.currItem.total_amt = total_amt;
                        })
                    }
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
                        bud_year: dateApi.nowYear(),
                        other_in_ware_bill_lines: [],
                        stat: 1
                    });
                    $scope.gridOptions.api.setRowData($scope.data.currItem.other_in_ware_bill_lines);
                };

                /**
                 * 设置表格数据
                 * @param bizData
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);

                    $scope.gridOptions.hcApi.setRowData(bizData.other_in_ware_bill_lines);
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
                        realtime: true,
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
                $scope.chooseWareHouse = chooseWareHouse

                function chooseWareHouse(args) {
                    $scope.FrmInfo = {
                        title: "仓库",
                        thead: [{
                            name: "仓库编码",
                            code: "warehouse_code",
                        }, {
                            name: "仓库名称",
                            code: "warehouse_name",
                        }, {
                            name: "仓库类型",
                            code: "warehouse_type",
                        }],
                        classid: "warehouse",
                        url: "/jsp/authman.jsp",
                        direct: "center",
                        sqlBlock: "",//过滤？
                        backdatas: "warehouses",
                        ignorecase: "true", //忽略大小写
                        postdata: {},
                        realtime: true,
                        searchlist: ["warehouse_code", "warehouse_name", "dept_id"]
                    };
                    BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                        if (args) {
                            args.data.in_ware_no = result.warehouse_code;
                            args.data.in_ware_name = result.warehouse_name;
                            args.data.in_warehouse_id = result.warehouse_id;
                            args.api.refreshView();
                        } else {
                            $scope.data.currItem.in_ware_no = result.warehouse_code;
                            $scope.data.currItem.in_ware_name = result.warehouse_name;
                            $scope.data.currItem.in_warehouse_id = result.warehouse_id;
                        }
                    })
                };

                /**
                 * 查出入库类型
                 */
                $scope.chooseWareType = function () {
                    $scope.FrmInfo = {
                        title: "出入库类型",
                        thead: [{
                            name: "类型编码",
                            code: "out_ware_type_code",
                        }, {
                            name: "类型名称",
                            code: "out_ware_type_name",
                        }, {
                            name: "出入库方向",
                            code: "out_ware_direction",
                        }],
                        classid: "inv_out_ware_type",
                        url: "/jsp/authman.jsp",
                        direct: "center",
                        sqlBlock: "",//过滤？
                        backdatas: "inv_out_ware_types",
                        ignorecase: "true", //忽略大小写
                        postdata: {},
                        realtime: true,
                        searchlist: ["out_ware_type_code", "out_ware_type_name", "dept_id"]
                    };
                    BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                        $scope.data.currItem.in_ware_type_code = result.out_ware_type_code;
                        $scope.data.currItem.in_ware_type_name = result.out_ware_type_name;
                        $scope.data.currItem.in_ware_type_id = result.out_ware_type_id;
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
                    return BasemanService
                        .chooseItem({
                            scope: $scope,
                            realtime: true
                        })
                        .then(function (data) {
                            [
                                'item_id',
                                'item_code',
                                'item_name'
                            ]
                                .forEach(function (key) {
                                    args.data[key] = data[key];
                                });
                            args.data.unit = data.uom_name;
                            args.api.refreshView();
                        });
                }

                /**
                 * 查供应商档案
                 */
                $scope.chooseVendorOrg = chooseVendorOrg

                function chooseVendorOrg() {
                    $scope.FrmInfo = {
                        title: "供应商档案",
                        thead: [{
                            name: "供应商编码",
                            code: "vendor_code",
                        }, {
                            name: "供应商名称",
                            code: "vendor_name",
                        }, {
                            name: "品类",
                            code: "out_ware_direction",
                        }],
                        classid: "vendor_org",
                        url: "/jsp/authman.jsp",
                        direct: "center",
                        sqlBlock: "",//过滤？
                        backdatas: "vendor_orgs",
                        ignorecase: "true", //忽略大小写
                        postdata: {},
                        realtime: true,
                        searchlist: ["vendor_code", "vendor_name"]
                    };
                    BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                        $scope.data.currItem.supplier_code = result.vendor_code;
                        $scope.data.currItem.supplier_name = result.vendor_name;
                        $scope.data.currItem.supplier_id = result.vendor_id;
                    })
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