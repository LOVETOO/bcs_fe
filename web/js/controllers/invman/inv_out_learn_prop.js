/**
 *  author: Li Meng
 *  time: 2019/6/12
 *  module:单据练习
 **/
define(
    ['module', 'controllerApi', 'base_obj_prop', 'dateApi', 'requestApi', 'numberApi', 'swalApi'],
    function (module, controllerApi, base_obj_prop, dateApi, requestApi, numberApi, swalApi) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数
            function ($scope, $modal) {
                $scope.data = {};
                $scope.data.currItem = {};

                /**
                 * 列表定义
                 *
                 **/
                $scope.gridOptions = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'item_code',
                            headerName: '产品编码',
                            editable: true,
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
                                            product_no: '',
                                            product_name: reason
                                        };
                                    })
                                    .then(function (line) {
                                        angular.extend(args.data, line);
                                        return args.data;
                                    })
                                    .then(function () {
                                        args.api.refreshView();
                                    });
                            },
                            width: 120
                        }, {
                            field: 'item_name',
                            headerName: '产品名称',
                            editable: true,
                            hcRequired: true,
                            width: 120,
                            onCellDoubleClicked: chooseItem
                        }, {
                            field: 'warehouse_code',
                            headerName: '仓库编码',
                            editable: true,
                            width: 130,
                            onCellDoubleClicked: chooseWareHouse
                        }, {
                            field: 'warehouse_name',
                            headerName: '仓库名称',
                            width: 130,
                            onCellDoubleClicked: chooseWareHouse
                        }, {
                            field: 'price',
                            headerName: '单价',
                            hcRequired: true,
                            type: '金额',
                            editable: Editable,
                            width: 80,
                            onCellValueChanged: function (args) {
                                checkGridMoneyInput(args, [countAmount_bill]);
                            }
                        }, {
                            field: 'quantity',
                            editable: Editable,
                            headerName: '数量',
                            onCellValueChanged: function (args) {
                                checkGridMoneyInput(args, [countQty_sum, countAmount_bill]);
                            },
                            width: 80
                        }, {
                            field: 'amount',
                            type: '金额',
                            headerName: '金额',
                            width: 80,
                            onCellValueChanged: function (args) {
                                checkGridMoneyInput(args, [countAmount_bill]);
                            }
                        }, {
                            field: 'valuation',
                            headerName: '是否暂估价',
                            editable: true,
                            hcDictCode: 'valuation',
                            width: 60
                        }, {
                            field: 'note',
                            editable: true,
                            headerName: '备注',
                            width: 110
                        }

                    ]
                };

                /**
                 * 继承控制器
                 **/
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /*----------------------------------通用查询-------------------------------------------*/
                $scope.commonSearchSettingOfDept = {
                    //部门
                    afterOk: function (response) {
                        $scope.data.currItem.dept_code = response.dept_code;
                        $scope.data.currItem.dept_name = response.dept_name;
                    },
                };
                //客户
                $scope.commonSearchSettingOfCustom = {
                    afterOk: function (response) {
                        $scope.data.currItem.customer_code = response.customer_code;
                        $scope.data.currItem.customer_name = response.customer_name;
                    }
                };
                /**
                 *  新增设置数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    $scope.data.currItem.inv_out_learn_lines = [{}];
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.inv_out_learn_lines);
                    bizData.creator = strUserName;
                    bizData.create_time = dateApi.now();
                };
                /*----------------------------------保存数据-------------------------------------------*/
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.inv_out_learn_lines);
                };
                /*----------------------------------保存数据结束-------------------------------------------*/
                /*
                 * 增加行明细
                 */
                $scope.add_line = function () {
                    $scope.gridOptions.api.stopEditing();
                    $scope.data.currItem.inv_out_learn_lines.push({});
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.inv_out_learn_lines);
                };
                /**
                 * 删除行明细
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.inv_out_learn_lines.splice(idx, 1);
                        if ($scope.data.currItem.inv_out_learn_lines.length == 0) {
                            $scope.data.currItem.inv_out_learn_lines.push([{}]);
                            $scope.gridOptions.hcApi.setRowData($scope.data.currItem.inv_out_learn_lines);
                        }
                        if ($scope.data.currItem.inv_out_learn_lines.length > 0) {
                            $scope.gridOptions.hcApi.setRowData($scope.data.currItem.inv_out_learn_lines);
                        }
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.inv_out_learn_lines);
                    }
                };

                /*----------------------------------通用查询结束-------------------------------------------*/
                $scope.data.currGridModel = 'data.currItem.inv_out_learn_lines';
                $scope.data.currGridOptions = $scope.gridOptions;
                /**
                 * 底部按钮定义
                 **/
                $scope.footerRightButtons.saveThenAdd.hide = false;
                $scope.footerRightButtons.saveThenSubmit.hide = false;
                $scope.footerLeftButtons.addRow.hide = false;
                $scope.footerLeftButtons.deleteRow.hide = false;
                $scope.footerLeftButtons.topRow.hide = true;
                $scope.footerLeftButtons.upRow.hide = true;
                $scope.footerLeftButtons.downRow.hide = true;
                $scope.footerLeftButtons.bottomRow.hide = true;
                $scope.footerLeftButtons.deleteRow.click = function () {
                    $scope.del_line && $scope.del_line();
                };

                /**
                 * 查产品
                 */
                $scope.chooseItem = chooseItem;

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
                                'item_name'
                            ]
                                .forEach(function (key) {
                                    args.data[key] = data[key];
                                });
                            args.api.refreshView();
                        })
                };

                /**
                 * 查仓库
                 */
                $scope.chooseWareHouse = chooseWareHouse;

                /**
                 * 查仓库
                 */
                function chooseWareHouse(args) {
                    if (args && args.data.seq == "合计") {
                        return;
                    }
                    $modal.openCommonSearch({
                            classId: 'warehouse',
                            sqlWhere: ' usable =2 and warehouse_type = 1 and is_end = 2'
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
                };

                function Editable(args) {
                    if (args && args.data.seq == "合计") {
                        return false;
                    }
                    return true;
                };

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
                };

                /**
                 * 计算明细行出库金额;
                 *出库数量*出库单价
                 * @param data
                 */
                function countAmount_bill(data) {
                    if (HczyCommon.isNotNull(data.price) && HczyCommon.isNotNull(data.quantity)) {
                        data.amount = numberApi.mutiply(data.price, data.quantity);
                    }
                    countTotal_Amount_bill();
                };

                /**
                 * 计算总金额
                 */
                function countTotal_Amount_bill() {
                    var amount_total = numberApi.sum($scope.data.currItem.inv_out_learn_lines, 'amount');
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
                    var qty_sum = numberApi.sum($scope.data.currItem.inv_out_learn_lines, 'quantity');
                    if (numberApi.isNum(qty_sum)) {
                        HczyCommon.safeApply($scope, function () {
                            $scope.data.currItem.quantity_total = qty_sum;
                        })
                    }
                };

                /**
                 * 计算合计数据
                 */
                function calSum() {
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            amount: numberApi.sum($scope.data.currItem.inv_out_learn_lines, 'amount'),
                            quantity: numberApi.sum($scope.data.currItem.inv_out_learn_lines, 'quantity'),
                        }
                    ]);
                };

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
                                    product_no: item.item_code,
                                    product_name: item.item_name,
                                }
                                    ;
                            } else {
                                return $q.reject("产品编码【" + code + "】不可用");
                            }
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