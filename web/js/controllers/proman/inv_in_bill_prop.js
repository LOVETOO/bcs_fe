/**
 * 采购入库单-属性页
 * 2018-12-20 inv_in_bill.js
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'openBizObj',
        'swalApi', 'loopApi', 'numberApi', 'dateApi'],
    function (module, controllerApi, base_obj_prop, requestApi, openBizObj,
              swalApi, loopApi, numberApi, dateApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal', '$q',
            //控制器函数
            function ($scope, $modal, $q) {

                $scope.data = {};
                $scope.data.currItem = {};

                $scope.gridOptions = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'pono',
                            headerName: '采购订单号',
                            editable: false
                        }, {
                            field: 'item_code',
                            headerName: '产品编码'
                        }, {
                            field: 'item_name',
                            headerName: '产品名称'
                        }, {
                            field: 'uom_name',
                            headerName: '单位'
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
                            headerName: '仓库名称'
                        }, {
                            field: 'qty_po',
                            headerName: '订单数量',//根据“采购订单”带出
                            type: '数量'
                        }, {
                            field: 'qty_invbill',
                            headerName: '入库数量',//根据“采购订单”带出
                            type: '数量',
                            editable: function (args) {
                                return editable(args)
                            },
                            onCellValueChanged: function (args) {
                                if (args.newValue === args.oldValue)
                                    return;
                                args.data.amount_bill = numberApi.mutiply(args.data.qty_invbill, args.data.price_bill);

                                args.data.cubage = numberApi.mutiply(args.data.qty_invbill, args.data.single_cubage);

                                $scope.calTotal(args);
                            }
                        }, {
                            field: 'price_bill',
                            headerName: '含税价格',
                            type: '金额'

                        }, {
                            field: 'amount_bill',
                            headerName: '含税入库金额',
                            type: '金额'
                        }, {
                            field: 'single_cubage',
                            headerName: '单品体积',
                            type: '体积'
                        }, {
                            field: 'cubage',
                            headerName: '本次入库体积',
                            type: '体积'
                        }, {
                            field: 'qty_porealin',
                            headerName: '已入库数量',
                            type: '数量'
                        }, {
                            field: 'qty_red_bill',
                            headerName: '累计红冲数量',
                            type: '数量'
                        }, {
                            field: 'remark',
                            headerName: '备注',
                            editable: function (args) {
                                return editable(args)
                            }
                        }
                    ],
                    hcReady: $q.deferPromise()
                };

                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /*-------------------通用查询开始------------------------*/

                /**
                 * 查供应商
                 */
                $scope.chooseVendor = function () {
                    $modal.openCommonSearch({
                            classId: 'vendor_org',
                            sqlWhere: "usable = 2"
                        })
                        .result//响应数据
                        .then(function (response) {
                            $scope.data.currItem.vendor_name = response.vendor_name;
                            $scope.data.currItem.vendor_code = response.vendor_code;
                            $scope.data.currItem.vendor_id = response.vendor_id;
                        });
                };

                /**
                 * 查仓库
                 */
                $scope.chooseWarehouse = function (args) {
                    $modal.openCommonSearch({
                            classId: 'warehouse',
                            sqlWhere: ' warehouse_type = 1 and warehouse_property = 1 and usable = 2 and is_end =2 '
                        })
                        .result//响应数据
                        .then(function (response) {
                            if (args) {
                                args.data.warehouse_id = response.warehouse_id;
                                args.data.warehouse_code = response.warehouse_code;
                                args.data.warehouse_name = response.warehouse_name;
                                args.api.refreshView();
                            } else {
                                $scope.data.currItem.warehouse_id = response.warehouse_id;
                                $scope.data.currItem.warehouse_name = response.warehouse_name;
                                $scope.data.currItem.warehouse_code = response.warehouse_code;
                            }
                        })
                };

                //查采购订单
                $scope.choosePurOrder = function () {
                    $modal.openCommonSearch({
                            classId: 'srm_po_head',
                            postData: {
                                vendor_id: getCurrItem().vendor_id
                            },
                            action: 'search',
                            sqlWhere: 'sph.stat = 5 ',
                            title: "采购订单",
                            gridOptions: {
                                columnDefs: [{
                                    headerName: "采购订单号",
                                    field: "pono"
                                }, {
                                    headerName: "供应商编码",
                                    field: "vendor_code"
                                }, {
                                    headerName: "供应商名称",
                                    field: "vendor_name"
                                }, {
                                    headerName: "合计数量",
                                    field: "total_qty"
                                }, {
                                    headerName: "合计金额",
                                    field: "amount_potax"
                                }, {
                                    headerName: "单据日期",
                                    field: "creation_date"
                                }, {
                                    headerName: "备注",
                                    field: "poremark"
                                }]
                            }
                        })
                        .result//响应数据
                        .then(function (response) {
                            $scope.data.currItem.pono = response.pono;
                            $scope.data.currItem.vendor_id = response.vendor_id;
                            $scope.data.currItem.vendor_code = response.vendor_code;
                            $scope.data.currItem.vendor_name = response.vendor_name;
                            $scope.data.currItem.warehouse_id = response.warehouse_id;
                            $scope.data.currItem.warehouse_code = response.warehouse_code;
                            $scope.data.currItem.warehouse_name = response.warehouse_name;
                            $scope.data.currItem.price_type = response.price_type;
                            $scope.data.currItem.total_cubage = response.total_cubage;
                            /*  发送请求带出采购订单中的明细 ,补充到采购入库单明细*/
                            var postdata = {
                                srm_po_head_id: response.srm_po_head_id
                            };
                            return requestApi.post('srm_po_head', 'select', postdata)
                                .then(function (response) {
                                    $scope.data.currItem.inv_in_bill_lines = [];//每次选择前先清空数据
                                    var lineData = response.srm_po_lineofsrm_po_heads;
                                    var lineNum = lineData.length;//返回数据的长度
                                    var data;
                                    for (var i = 0; i < lineNum; i++) {
                                        if (parseInt(lineData[i].qty_po) > parseInt(lineData[i].qty_sum)) {
                                            //如果未完全入库则加入到明细
                                            $scope.add_line(lineData[i]);
                                        }
                                    }
                                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.inv_in_bill_lines);
                                })
                                .then($scope.calTotal);
                        });

                }

                //查询部门
                $scope.chooseDept = function (args) {
                    $modal.openCommonSearch({
                            classId: 'dept'
                        })
                        .result//响应数据
                        .then(function (result) {
                            $scope.data.currItem.dept_id = result.dept_id;
                            $scope.data.currItem.dept_code = result.dept_code;
                            $scope.data.currItem.dept_name = result.dept_name;
                        });
                }
                /*-------------------通用查询结束------------------------*/
                /**
                 * 计算合计数据
                 */
                $scope.calSum = function () {
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            qty_po: numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'qty_po'),//订单数量
                            qty_invbill: numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'qty_invbill'),//入库数量
                            amount_bill: numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'amount_bill'),//含税入库金额
                            cubage: numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'cubage'),//本次入库体积
                            qty_porealin: numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'qty_porealin'),//已入库数量
                            qty_red_bill: numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'qty_red_bill')//已入库数量
                        }
                    ]);
                };
                /*-------------------检查、计算开始------------------------*/


                /**
                 * 计算总额
                 */
                $scope.calTotal = function () {
                    //合计数量
                    $scope.data.currItem.total_qty
                        = numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'qty_invbill');

                    //合计数量
                    $scope.data.currItem.total_cubage
                        = numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'cubage');

                    //合计金额
                    $scope.data.currItem.amount_total
                        = numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'amount_bill');
                    $scope.calSum();
                };

                //明细验证
                $scope.validCheck = function (invalidBox) {
                    $scope.gridOptions.api.stopEditing();
                    $scope.hcSuper.validCheck(invalidBox);
                    var lineData = getCurrItem().inv_in_bill_lines;
                    lineData.forEach(function (line, index) {
                        var row = index + 1;
                        if (!line.qty_invbill && line.qty_invbill == 0)
                            invalidBox.push('第' + row + '行数量不能为空');
                        if ((line.qty_invbill - line.qty_po + line.qty_porealin) > 0)
                            invalidBox.push('第' + row + '行数量不能大于订单数量减去已入库数量');
                    });
                };

                $scope.onInvbilldateChange = function () {
                    getCurrItem().year_month = new Date(getCurrItem().invbilldate).Format('yyyy-MM');
                };

                /*-------------------检查、计算结束------------------------*/


                /**
                 * 新增时数据、网格默认设置
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    bizData.create_date = dateApi.now();
                    bizData.invbilldate = dateApi.today();
                    bizData.year_month = new Date().Format('yyyy-MM');
                    bizData.billtypecode = '0101';
                    bizData.searchflag = 3;
                    bizData.inv_in_bill_lines = [];
                    $scope.gridOptions.hcReady.then(function () {
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.inv_in_bill_lines);
                    })
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.inv_in_bill_lines);
                    $scope.calTotal();
                };


                $scope.footerLeftButtons.del_line = {
                    title: '删除行',
                    click: function () {
                        $scope.del_line && $scope.del_line();
                        $scope.calTotal();
                    },
                    hide: function () {
                        return getCurrItem().stat > 1;
                    }
                };


                /**
                 * 增加行
                 */
                $scope.add_line = function (data) {
                    $scope.gridOptions.api.stopEditing();

                    var line = {};

                    if (data) {
                        line.item_id = data.item_id;
                        line.item_code = data.item_code;
                        line.item_name = data.item_name;
                        line.uom_id = data.uom_id;
                        line.uom_name = data.uom_name;
                        line.warehouse_id = data.warehouse_id;
                        line.warehouse_code = data.warehouse_code;
                        line.warehouse_name = data.warehouse_name;
                        line.qty_po = data.qty_po;
                        line.price_bill = data.price_potaxprice;
                        line.amount_bill = data.amount_potax;
                        line.remark = data.line_remark;
                        line.pono = $scope.data.currItem.pono;
                        line.qty_invbill = data.qty_po - data.qty_sum;
                        line.srm_po_line_id = data.srm_po_line_id;
                        line.qty_porealin = data.qty_sum;
                        line.single_cubage = data.cubage;
                        line.cubage = data.total_cubage;
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

                function getCurrItem() {
                    return $scope.data.currItem;
                }

                function editable(args) {
                    if (getCurrItem().stat == 1)
                        return true;
                    return false;
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






