/**
 * 入库单列表0301(库存金额调整单)
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi', 'dateApi', 'numberApi'],
    function (module, controllerApi, base_obj_prop, swalApi, requestApi, dateApi, numberApi) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope', '$stateParams', '$modal',
            //控制器函数
            function ($scope, $stateParams, $modal) {
                $scope.data = {};
                $scope.data.currItem = {};
                /**数据定义 */
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'item_code',
                            headerName: '产品编码',
                            hcRequired: true,
                            onCellDoubleClicked: chooseItem
                        }, {
                            field: 'item_name',
                            headerName: '产品名称'
                        }, {
                            field: 'uom_name',
                            headerName: '单位'
                        }, {
                            field: 'warehouse_code',
                            headerName: '仓库编码',
                            onCellDoubleClicked: chooseWareHouse
                        }, {
                            field: 'warehouse_name',
                            headerName: '仓库名称'
                        },
                        {
                            field: 'qty_invbill',
                            headerName: '数量',
                            editable: true,
                            hcRequired: true,
                            type: '数量'
                        }, {
                            field: 'pricec_bill_notax_f',
                            headerName: '未税价',
                            type: '金额',
                            editable: true,
                            hcRequired: true,
                            onCellValueChanged: function (args) {
                                pricec_bill_notax_f_change(args);
                            }
                        }, {
                            field: 'amount_bill_notax_f',
                            headerName: '未税金额',
                            type: '金额'
                        }, {
                            field: 'note',
                            headerName: '备注',
                            editable: true
                        }
                    ]
                };

                /**继承主控制器 */
                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });


                //查部门
                $scope.chooseOrg = {
                    classId: 'dept',
                    title: '部门查询',
                    gridOptions: {
                        "columnDefs": [
                            {
                                headerName: "部门编码",
                                field: "dept_code"
                            }, {
                                headerName: "部门名称",
                                field: "dept_name"
                            }
                        ]
                    },
                    afterOk: function (response) {
                        $scope.data.currItem.dept_id = response.dept_id;
                        $scope.data.currItem.dept_code = response.dept_code;
                        $scope.data.currItem.dept_name = response.dept_name;
                    }
                };

                /**
                 * 查仓库
                 */
                $scope.chooseWareHouse = {
                    classId: 'warehouse',
                    title: '仓库查询',
                    sqlWhere: 'usable = 2 and warehouse_type = 1',
                    gridOptions: {
                        "columnDefs": [
                            {
                                headerName: "仓库编码",
                                field: "warehouse_code"
                            }, {
                                headerName: "仓库名称",
                                field: "warehouse_name"
                            }, {
                                headerName: "仓库类型",
                                field: "warehouse_type",
                                hcDictCode: "warehouse_type"
                            }
                        ]
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.warehouse_code = result.warehouse_code;
                        $scope.data.currItem.warehouse_name = result.warehouse_name;
                        $scope.data.currItem.warehouse_id = result.warehouse_id;
                    }
                };

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
                            args.api.refreshView();
                        })
                }


                function chooseWareHouse(args) {
                    $modal.openCommonSearch({
                            classId: 'warehouse',
                            sqlWhere: ' usable =2 and warehouse_type = 1'
                        })
                        .result//响应数据
                        .then(function (result) {
                            args.data.warehouse_code = result.warehouse_code;
                            args.data.warehouse_name = result.warehouse_name;
                            args.data.warehouse_id = result.warehouse_id;
                            args.api.refreshView();
                        });
                };


                /**
                 * 检查数据
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.gridOptions.api.stopEditing();
                    $scope.hcSuper.validCheck(invalidBox);
                    return invalidBox;
                };

                /**
                 * 新建单据时初始化数据
                 * @param bizData
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    angular.extend($scope.data.currItem, {
                        creator: strUserName,
                        create_date: dateApi.now(),
                        bud_year: dateApi.nowYear(),
                        inv_in_bill_lines: [],
                        stat: 1,
                        billtypecode: "0301",
                        invbilldate: dateApi.today(),
                        year_month: new Date(dateApi.today()).Format('yyyy-MM')
                    });
                }

                /**
                 * 设置表格数据
                 * @param bizData
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.inv_in_bill_lines);
                };


                $scope.autoSearch = function () {
                    var postData = {
                        classId: "inv_in_bill_head",
                        action: 'stkamtadjuctsearch',
                        data: {warehouse_id: $scope.data.currItem.warehouse_id}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            $scope.data.currItem.inv_in_bill_lines = data.inv_in_bill_lines;
                            $scope.gridOptions.hcApi.setRowData($scope.data.currItem.inv_in_bill_lines);
                        });
                }


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
                $scope.footerLeftButtons.autoSearch = {
                    title: '获取明细数据',
                    click: function () {
                        $scope.autoSearch && $scope.autoSearch();
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

                    var rowData = $scope.gridOptions.hcApi.getRowData();
                    if (index == (rowData.length - 1)) {
                        $scope.gridOptions.api.focusedCellController.clearFocusedCell();
                    }
                    rowData.splice(index, 1);
                    $scope.gridOptions.hcApi.setRowData(rowData);
                    $scope.data.currItem.inv_in_bill_lines = rowData;
                }

                $scope.onTaxRateChange = function () {
                    $scope.data.currItem.inv_in_bill_lines.forEach(function (value) {
                        value.pricec_bill_notax_f = numberApi.divide(value.pricec_bill_f, 1 + $scope.data.currItem.tax_rate / 100);
                        value.amount_bill_notax_f = numberApi.mutiply($scope.data.currItem.qty_invbill, numberApi.divide(value.pricec_bill_f, 1 + $scope.data.currItem.tax_rate / 100));
                    });
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.inv_in_bill_lines);
                }

                function pricec_bill_notax_f_change(args) {
                    args.data.pricec_bill_f = numberApi.mutiply(args.data.pricec_bill_notax_f, 1 + $scope.data.currItem.tax_rate / 100);
                    args.data.amount_bill_f = numberApi.mutiply($scope.data.currItem.qty_invbill, numberApi.mutiply(args.data.pricec_bill_notax_f, 1 + $scope.data.currItem.tax_rate / 100));
                    args.data.amount_bill_notax_f = numberApi.mutiply($scope.data.currItem.qty_invbill, args.data.pricec_bill_notax_f);
                    args.api.refreshView();
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