/**
 * 其他出库红冲单-详情页
 * date:2018-12-26
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi', 'dateApi', 'numberApi', 'loopApi'],
    function (module, controllerApi, base_obj_prop, swalApi, requestApi, dateApi, numberApi, loopApi) {
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
                        }, {
                            field: 'item_name',
                            headerName: '产品名称',
                        }, {
                            field: 'uom_name',
                            headerName: '单位',
                        }, {
                            field: 'warehouse_code',
                            headerName: '仓库编码',
                        }, {
                            field: 'warehouse_name',
                            headerName: '仓库名称',
                        }
                        , {
                            field: 'qty_bill',
                            headerName: '原单出库数量',
                            type: '数量',

                        }, {
                            field: 'qty_red',
                            headerName: '本次红冲数量',
                            type: '数量',
                            editable: Editable,
                            onCellValueChanged: function (args) {
                                checkGridMoneyInput(args, [countAmount_bill, countCubage, toNegative, countQty_sum]);
                            }
                        },
                        {
                            field: 'price_bill',
                            headerName: '红冲单价',
                            type: '金额',
                            onCellValueChanged: function (args) {
                                checkGridMoneyInput(args, [countAmount_bill]);
                            }
                        },
                        {
                            field: 'amount_bill',
                            headerName: '红冲金额',
                            type: '金额',
                            onCellValueChanged: function (args) {
                                checkGridMoneyInput(args, [countAmount_bill]);
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
                                checkGridMoneyInput(args, [countCubage]);
                            },
                            type: '体积'
                        }
                        , {
                            field: 'cubage',
                            headerName: '红冲体积(m³)',
                            type: '体积'
                        }
                        , {
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

                /**
                 * 根据记账日期生成记账月份
                 */
                $scope.onInvbilldateChange = function () {
                    $scope.data.currItem.year_month = new Date($scope.data.currItem.date_invbill).Format('yyyy-MM');
                }

                /**======================点击事件==========================**/

                    //左下按钮
                    //$scope.footerLeftButtons.add_line = {
                    //    title: '增加行',
                    //    click: function () {
                    //        $scope.add_line && $scope.add_line();
                    //    },
                    //};
                    //$scope.footerLeftButtons.add_line.hide=true;
                $scope.footerLeftButtons.del_line = {
                    icon: 'fa fa-minus',
                    click: function () {
                        $scope.del_line && $scope.del_line();
                    }
                };

                //$scope.footerLeftButtons.copyAndAdd_line.hide=true;
                //$scope.footerLeftButtons.copyAndAdd_line = {
                //    title: '批量导入',
                //    click: function () {
                //        $scope.copyAndAdd_line && $scope.copyAndAdd_line();
                //    },
                //};
                //$scope.add_line = function () {
                //    $scope.gridOptions.api.stopEditing();
                //    swal({
                //        title: '请输入要增加的行数',
                //        type: 'input', //类型为输入框
                //        inputValue: 1, //输入框默认值
                //        closeOnConfirm: false, //点击确认不关闭，由后续代码判断是否关闭
                //        showCancelButton: true //显示【取消】按钮
                //    }, function (inputValue) {
                //        if (inputValue === false) {
                //            swal.close();
                //            return;
                //        }
                //
                //        var rowCount = Number(inputValue);
                //        if (rowCount <= 0) {
                //            swal.showInputError('请输入有效的行数');
                //            return;
                //        }
                //        else if (rowCount > 1000) {
                //            swal.showInputError('请勿输入过大的行数(1000以内为宜)');
                //            return;
                //        }
                //
                //        swal.close();
                //
                //        var data = $scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads;
                //
                //        for (var i = 0; i < rowCount; i++) {
                //            var newLine = {
                //                warehouse_code: $scope.data.currItem.warehouse_code,
                //                warehouse_id: $scope.data.currItem.warehouse_id,
                //                warehouse_name: $scope.data.currItem.warehouse_name
                //            };
                //            data.push(newLine);
                //        }
                //        $scope.gridOptions.hcApi.setRowData(data);
                //        $scope.gridOptions.hcApi.setFocusedCell(data.length - rowCount, 'item_code');
                //    });
                //}
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
                            countAmount_bill();
                            countTotal_Amount_bill();
                            countTotal_Amount_bill();
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
                    $scope.hcSuper.validCheck(invalidBox);

                    var lines = $scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads.slice(0);
                    //检验‘本次红冲数量’值（负数，红冲数量绝对值小于等于（原单出库数量 - |累计红冲数量|））
                    if (lines.length) {
                        loopApi.forLoop(lines.length, function (i) {
                            var qty_red = numberApi.toNumber(lines[i].qty_red);
                            var qty_bill = numberApi.toNumber(lines[i].qty_bill);
                            var sum_red_out = numberApi.toNumber(lines[i].sum_red_out);
                            var dif = qty_bill - Math.abs(sum_red_out);
                            if (qty_red > 0) {
                                invalidBox.push('第' + (i + 1) + '行【本次红冲数量】必须是负数！');
                            }
                            else if (Math.abs(qty_red) > (dif)) {
                                invalidBox.push('第' + (i + 1) + '行【本次红冲数量】绝对值必须小于等于【' + dif + '】！');
                            }
                        });
                    }

                    return invalidBox;
                };

                //本次红冲数量正数转负数
                function toNegative(data) {
                    if (data.qty_red && data.qty_red > 0) {
                        data.qty_red = 0 - data.qty_red;
                    }
                }

                /**
                 * 计算明细行红冲体积;
                 *本次红冲数量*红冲体积
                 * @param data
                 */
                function countCubage(data) {
                    if (HczyCommon.isNotNull(data.single_cubage) && HczyCommon.isNotNull(data.qty_red)) {
                        data.cubage = numberApi.mutiply(data.single_cubage, data.qty_red);
                    }
                    countTotal_Cubage();
                }

                /**
                 * 计算明细行出库金额;
                 *本次红冲数量*红冲单价
                 * @param data
                 */
                function countAmount_bill(data) {
                    if (HczyCommon.isNotNull(data.price_bill) && HczyCommon.isNotNull(data.qty_red)) {
                        data.amount_bill = numberApi.mutiply(data.price_bill, data.qty_red);
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
                    var qty_sum = numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'qty_red');
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
                            qty_red: numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'qty_red'),
                            //price_bill: numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'price_bill'),
                            sum_red_out: numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'sum_red_out'),
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
                        inv_out_type: 2,
                        billtypecode: "0299",
                        bluered: 'R',//红冲单
                        year_month: new Date(dateApi.today()).Format('yyyy-MM')
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
                $scope.chooseWareHouse = chooseWareHouse;

                function chooseWareHouse(args) {
                    if (args && args.data.seq == "合计") {
                        return;
                    }
                    $modal.openCommonSearch({
                            classId: 'warehouse',
                            sqlWhere: ' usable =2 and warehouse_type = 1'
                        })
                        .result//响应数据
                        .then(function (response) {
                            if (args) {
                                args.data.warehouse_id = response.warehouse_id;
                                args.data.warehouse_name = response.warehouse_name;
                                args.data.warehouse_code = response.warehouse_code;
                                args.api.refreshView();
                            } else {
                                $scope.data.currItem.warehouse_name = response.warehouse_name;
                                $scope.data.currItem.warehouse_code = response.warehouse_code;
                                $scope.data.currItem.warehouse_id = response.warehouse_id;
                            }
                        });
                }

                /**
                 * 查出库类型
                 */
                $scope.chooseWareType = function () {
                    $modal.openCommonSearch({
                            classId: 'inv_out_ware_type',
                            sqlWhere: " out_ware_direction = 1 and is_active = 2 "
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
                    if (args && args.data.seq == "合计") {
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
                            args.api.refreshView();
                        })
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

                /**
                 * 查出库单（已审核）
                 */
                $scope.chooseOtherOut = function () {
                    $modal.openCommonSearch({
                            classId: 'inv_out_bill_head',
                            postData: {search_flag: 8},
                            sqlWhere: ' stat = 5',
                            action: 'search',
                            title: "其他出库单",
                            gridOptions: {
                                columnDefs: [{
                                    headerName: "其他出库单号",
                                    field: "invbillno"
                                }, {
                                    headerName: "客户编码",
                                    field: "customer_code"
                                }, {
                                    headerName: "客户名称",
                                    field: "customer_name"
                                }, {
                                    headerName: "部门",
                                    field: "dept_name"
                                }]
                            }
                        })
                        .result//响应数据
                        .then(function (response) {
                            $scope.data.currItem = angular.extend({}, response);

                            $scope.data.currItem.parent_id = response.inv_out_bill_head_id;
                            $scope.data.currItem.parent_billno = response.invbillno;
                            $scope.data.currItem.invbillno = '';

                            $scope.data.currItem.inv_out_bill_head_id = 0;
                            $scope.data.currItem.qty_sum = 0
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