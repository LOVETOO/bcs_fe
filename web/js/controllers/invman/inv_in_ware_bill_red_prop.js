/**
 * 其他入库红冲 属性页
 * 2018-12-26 huderong
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
                            headerName: '产品编码'
                        }, {
                            field: 'item_name',
                            headerName: '产品名称',
                            maxWidth: 260
                        }, {
                            field: 'uom_name',
                            headerName: '单位'
                        }, {
                            field: 'warehouse_code',
                            headerName: '仓库编码'
                        }, {
                            field: 'warehouse_name',
                            headerName: '仓库名称'
                        }, {
                            field: 'qty_red',
                            headerName: '本次红冲数量',
                            type: '数量',
                            editable: function (args) {
                                return editable(args)
                            },
                            onCellValueChanged: function (args) {
                                if (args.newValue === args.oldValue)
                                    return;

                                //计算红冲数量
                                if (args.data.qty_red && args.data.price_bill) {
                                    args.data.amount_bill = Math.abs(numberApi.toNumber(args.data.qty_red))
                                        * numberApi.toNumber(args.data.price_bill);
                                }

                                $scope.toNegative(args);
                                $scope.calTotal(args);
                            }
                        }, {
                            field: 'qty_invbill',
                            headerName: '原单入库数量',
                            type: '数量',
                            editable: false
                        }, {
                            field: 'price_bill',
                            headerName: '入库红冲单价',
                            type: '金额'
                        }, {
                            field: 'amount_bill',
                            headerName: '入库红冲金额',
                            editable: false,//测试，暂时为true
                            type: '金额',
                            onCellValueChanged: function (args) {
                                if (args.newValue === args.oldValue)
                                    return;
                                $scope.calTotal();
                            }
                        },
                        // {
                        //     field: 'qty_red_bill',
                        //     headerName: '已红冲数量',
                        //     type: '数量',
                        //     onCellValueChanged: function (args) {
                        //         if (args.newValue === args.oldValue)
                        //             return;
                        //     }
                        // },
                        {
                            field: 'sum_red_out',
                            headerName: '累计红冲量',
                            type: '数量'
                        }, {
                            field: 'single_cubage',
                            headerName: '单位体积(m³)',
                            onCellValueChanged: function (args) {
                                checkGridMoneyInput(args, [countCubage]);
                            }
                        }, {
                            field: 'cubage',
                            headerName: '入库红冲体积(m³)'
                        }, {
                            field: 'remark',
                            headerName: '备注',
                            editable: function (args) {
                                return editable(args)
                            }
                        }
                    ]
                };

                /*-------------------通用查询开始------------------------*/

                /**
                 * 查供应商
                 */
                $scope.chooseVendor = function () {
                    $modal.openCommonSearch({
                            classId: 'vendor_org',
                            sqlWhere: ' usable = 2'
                        })
                        .result//响应数据
                        .then(function (response) {
                            $scope.data.currItem.vendor_name = response.vendor_name;
                            $scope.data.currItem.vendor_code = response.vendor_code;
                            $scope.data.currItem.vendor_id = response.vendor_id;

                            //价格类型
                            $scope.data.currItem.price_type = response.attribute41;

                            return $scope.data.currItem;
                        }).then($scope.queryPriceBill);
                };

                //查产品
                $scope.chooseItem = function (args) {

                    if (!getCurrItem().vendor_code) {
                        $scope.gridOptions.api.stopEditing();
                        swalApi.info('请先选择供应商');
                        $scope.chooseVendor();
                        return;
                    }
                    $modal.openCommonSearch({
                            classId: 'item_org',
                            postData: {},
                            action: 'search',
                            title: "产品",
                            gridOptions: {
                                columnDefs: [{
                                    headerName: "产品编码",
                                    field: "item_code"
                                }, {
                                    headerName: "产品名称",
                                    field: "item_name"
                                }, {
                                    headerName: "体积",
                                    field: "cubage"
                                }]
                            }
                        })
                        .result//响应数据
                        .then(function (result) {
                            args.data.item_id = result.item_id;
                            args.data.item_code = result.item_code;
                            args.data.item_name = result.item_name;
                            args.data.uom_name = result.uom_name;
                            args.data.cubage = result.cubage;
                            if (args.data.item_id) {
                                args.data.cubage_temp = numberApi.toNumber(args.data.qty_invbill)
                                    * numberApi.toNumber(args.data.cubage);
                            }
                            $scope.calTotal();
                            args.api.refreshView();
                        });
                };

                /**
                 * 查仓库
                 */
                $scope.chooseWarehouse = function (args) {
                    $modal.openCommonSearch({
                            classId: 'warehouse',
                            sqlWhere: 'warehouse_type = 1 and warehouse_property = 1 and usable = 2'
                        })
                        .result//响应数据
                        .then(function (response) {
                            if (args) {
                                args.data.warehouse_id = response.warehouse_id;
                                args.data.warehouse_code = response.warehouse_code;
                                args.data.warehouse_name = response.warehouse_name;
                                args.api.refreshView();
                            } else {
                                $scope.data.currItem.warehouse_name = response.warehouse_name;
                                $scope.data.currItem.warehouse_code = response.warehouse_code;
                                $scope.data.currItem.warehouse_id = response.warehouse_id;
                            }
                        });
                };

                //查其他订单
                $scope.chooseInvBill = function (args) {
                    $modal.openCommonSearch({
                            classId: 'inv_in_bill_head',
                            postData: {searchflag: 8},
                            action: 'search',
                            title: "其他入库单",
                            gridOptions: {
                                columnDefs: [{
                                    headerName: "入库订单号",
                                    field: "invbillno"
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
                                    field: "amount_total"
                                }, {
                                    headerName: "记账日期",
                                    field: "invbilldate"
                                }, {
                                    headerName: "备注",
                                    field: "note"
                                }]
                            }
                        })
                        .result//响应数据
                        .then(function (response) {
                            $scope.data.currItem.invbillno_relevant = response.invbillno;

                            if (args != null) {
                                args.data.price_bill = response.price_bill;
                                args.data.invbillno_relevant = response.invbillno;
                                swalApi.info('data ' + response.invbillno_relevant);
                            } else {
                                $scope.data.currItem.inv_in_bill_lines = [];
                                $scope.data.currItem.invbillno_relevant = response.invbillno;
                                // 发送请求带出明细 ,补充到其他入库红冲明细
                                var postdata = {
                                    //sqlwhere: sqlwhere
                                    //search_flag: 10,
                                    inv_in_bill_head_id: response.inv_in_bill_head_id
                                };
                                return requestApi.post('inv_in_bill_head', 'select', postdata)
                                    .then(function (response) {
                                        var lineData = response.inv_in_bill_lines;
                                        var lineNum = lineData.length;//返回数据的长度

                                        ['warehouse_name', 'warehouse_code', 'warehouse_id', 'in_ware_type_code',
                                            'in_ware_type_id', 'in_ware_type_name', 'customer_code', 'customer_id', 'customer_name', 'total_qty', 'amount_total', 'total_cubage',
                                            'vendor_code', 'vendor_id', 'vendor_name', 'note'].forEach(function (value) {
                                            $scope.data.currItem[value] = response[value]
                                        })

                                        var data;
                                        for (var i = 0; i < lineNum; i++) {
                                            console.log('object : ' + i);
                                            console.log(lineData[i].qty_invbill + ' : ' + lineData[i].qty_red_bill);
                                            if (parseInt(lineData[i].qty_invbill) > parseInt(lineData[i].qty_red_bill)) {//如果未完全红冲则加入到明细
                                                $scope.add_line(lineData[i]);
                                            }
                                        }
                                        $scope.calTotal(args);
                                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.inv_in_bill_lines);
                                    })
                            }
                        })
                }

                //查询部门
                $scope.chooseDept = function (args) {
                    $modal.openCommonSearch({
                            classId: 'dept',
                            postData: {},
                            action: 'search',
                            title: "部门或机构查询",
                            gridOptions: {
                                columnDefs: [
                                    {
                                        headerName: "部门或机构编码",
                                        field: "dept_code"
                                    }, {
                                        headerName: "部门或机构名称",
                                        field: "dept_name"
                                    }
                                ]
                            }
                        })
                        .result//响应数据
                        .then(function (result) {
                            $scope.data.currItem.dept_id = result.dept_id;
                            $scope.data.currItem.dept_code = result.dept_code;
                            $scope.data.currItem.dept_name = result.dept_name;
                        });
                }


                /*-------------------通用查询结束------------------------*/

                /*-------------------明细检查、计算、变值开始------------------------*/
                /**
                 * 计算合计数据
                 */
                $scope.calSum = function () {
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            qty_red: numberApi.sum(getCurrItem().inv_in_bill_lines, 'qty_red'),
                            sum_red_out: numberApi.sum(getCurrItem().inv_in_bill_lines, 'sum_red_out'),
                            amount_bill: numberApi.sum(getCurrItem().inv_in_bill_lines, 'amount_bill'),
                            cubage: numberApi.sum(getCurrItem().inv_in_bill_lines, 'cubage'),
                        }
                    ]);
                }

                /*
                 * 调出含税价前检查输入（供应商、产品、数量）
                 * */
                $scope.checkInput = function (args) {

                    if (!args.data.item_code) {
                        swalApi.info('请先选择该行的产品编码,再输入数量');
                        //移开焦点
                        $scope.gridOptions.hcApi.setFocusedCell('item_code');
                    }

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
                 * 计算明细行红冲体积;
                 *本次红冲数量*红冲体积
                 * @param data
                 */
                function countCubage(data) {
                    if (HczyCommon.isNotNull(data.attribute51) && HczyCommon.isNotNull(data.qty_red)) {
                        data.cubage = numberApi.mutiply(data.attribute51, data.qty_red);
                    }
                    countTotal_Cubage();
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
                }

                /**
                 * 查询含税价格
                 * 取对应供应商、价格类型、有效期内的其他价格表中的含税单价
                 */
                $scope.queryPriceBill = function () {
                    if ($scope.data.currItem.vendor_id
                        && $scope.data.currItem.price_type
                        && $scope.data.currItem.invbilldate) {

                        var sqlwhere = "vendor_id = " + $scope.data.currItem.vendor_id
                            + " and price_type = " + $scope.data.currItem.price_type
                            + " and to_date('" + $scope.data.currItem.invbilldate + "','yyyy-MM-dd')"
                            + " between start_date and end_date ";
                        var postdata = {
                            sqlwhere: sqlwhere
                        };

                        return requestApi.post('srm_purchase_price', 'select', postdata)
                            .then(function (response) {
                                $scope.data.price_bill = response.price_tax;
                            })
                    }
                };

                /**
                 * 计算总额
                 */
                $scope.calTotal = function () {
                    //合计数量
                    $scope.data.currItem.total_qty
                        = numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'qty_red');

                    //合计金额
                    $scope.data.currItem.amount_total
                        = numberApi.sum($scope.data.currItem.inv_in_bill_lines, 'amount_bill');

                    $scope.calSum();
                };

                //本次红冲数量正数转负数
                $scope.toNegative = function (args) {
                    if (args && args.data.qty_red > 0) {
                        args.data.qty_red = 0 - args.data.qty_red;
                    }

                }

                /*-------------------明细检查、计算、变值结束------------------------*/

                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //明细验证
                $scope.validCheck = function (invalidBox) {
                    $scope.gridOptions.api.stopEditing();

                    $scope.hcSuper.validCheck(invalidBox);

                    var lineData = getCurrItem().inv_in_bill_lines;
                    lineData.forEach(function (line, index) {
                        var row = index + 1;
                        //if (line.qty_red && getCurrItem().stat == 1)
                        //    invalidBox.push('第' + row + '行本次红冲数量不能为空');

                        //验证红冲数量小于|入库数量-已红冲数量|
                        //console.log((0 - args.data.qty_red) > (args.data.qty_invbill - args.data.qty_red_bill));
                        if ((0 - line.qty_red) > (line.qty_invbill - line.qty_red_bill)) {
                            invalidBox.push('第' + row + '行本次红冲数量绝对值不能大于' + (line.qty_invbill - line.qty_red_bill));
                        }
                    });
                };

                //隐藏标签页
                $scope.tabs.wf.hide = false;
                $scope.tabs.attach.hide = true;
                //修改标签页标题
                $scope.tabs.base.title = '基本信息';

                /**
                 * 新增时数据、网格默认设置
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    bizData.create_date = new Date().Format('yyyy-MM-dd');
                    bizData.invbilldate = new Date().Format('yyyy-MM-dd');
                    bizData.year_month = new Date().Format('yyyy-MM');
                    bizData.billtypecode = '0199';
                    bizData.searchflag = 2;
                    bizData.inv_in_bill_lines = [];
                    bizData.bluered = 'R';
                    bizData.red_type = 2;
                    $scope.gridOptions.hcApi.setRowData(bizData.inv_in_bill_lines);

                    //新增时默认的部门(注意：发送请求要放在 setRowData 初始设置之后)
                    var postData = {
                        classId: "srm_po_head",
                        action: 'searchdept',
                        data: {}
                        //data: {org_id : getCurrItem().org_id,sales_year:getCurrItem().bud_year}
                    }
                    return requestApi.post(postData)
                        .then(function (data) {
                            //swalApi.info("data.dept_code:" + data.dept_code);

                            getCurrItem().dept_code = data.dept_code;
                            getCurrItem().dept_code = data.dept_name;

                            bizData.dept_id = userbean.loginuserifnos[0].org_id;
                            bizData.dept_code = userbean.loginuserifnos[0].org_code;
                            bizData.dept_name = userbean.loginuserifnos[0].org_name;
                        });
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.inv_in_bill_lines);
                    $scope.calSum();

                };

                //底部左边按钮
                /* $scope.footerLeftButtons.add_line = {
                 title: '增加行',
                 click: function () {
                 $scope.add_line && $scope.add_line();
                 }
                 };*/
                $scope.footerLeftButtons.del_line = {
                    title: '删除行',
                    click: function () {
                        $scope.del_line && $scope.del_line();
                    }
                };

                $scope.initRow = function () {
                    $scope.gridOptions.api.stopEditing();

                    var lineData = getCurrItem().inv_in_bill_lines;
                    /*
                     lineData.forEach(function (line, index) {
                     var row = index + 1;
                     line.cubage_temp = line.cubage * line.qty_invbill;
                     });
                     */
                };


                /**
                 * 增加行
                 */
                $scope.add_line = function (data) {
                    $scope.gridOptions.api.stopEditing();

                    var line = {
                        item_id: '',
                        item_code: '',
                        item_name: '',
                        warehouse_id: '',
                        warehouse_code: '',
                        warehouse_name: '',
                        qty_po: '',
                        qty_pricebill: '',
                        remark: '',
                        qty_invbill: '',
                        qty_red_bill: '',
                        soure_bill_line_id: ''
                    };

                    if (data) {
                        line.item_id = data.item_id;
                        line.item_code = data.item_code;
                        line.item_name = data.item_name;
                        line.uom_id = data.uom_id;
                        line.uom_name = data.uom_name;
                        line.warehouse_id = data.warehouse_id;
                        line.warehouse_code = data.warehouse_code;
                        line.warehouse_name = data.warehouse_name;
                        line.qty_invbill = data.qty_invbill;
                        line.price_bill = data.price_bill;
                        line.remark = data.remark;
                        line.qty_red_bill = data.qty_red_bill;

                        line.invbillno_relevant = $scope.data.currItem.invbillno_relevant;

                        line.amount_bill = data.qty_red * data.price_bill;
                        line.source_bill_line_id = data.inv_in_bill_line_id;
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
                        $scope.calSum();
                    }
                };

                function getCurrItem() {
                    return $scope.data.currItem;
                }

                function editable(args) {
                    if (getCurrItem().stat == 1)
                        return true;
                    return false;
                };

                /**
                 * 根据记账日期生成记账月份
                 */
                $scope.onInvbilldateChange = function () {
                    getCurrItem().year_month = new Date(getCurrItem().invbilldate).Format('yyyy-MM');
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






