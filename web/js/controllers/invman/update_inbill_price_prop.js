/**
 * 入库单列表0101(采购入库单)  0103(委外加工入库单)  0199(其他入库单)
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi', 'dateApi', 'numberApi'],
    function (module, controllerApi, base_obj_prop, swalApi, requestApi, dateApi, numberApi) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                /**数据定义 */
                $scope.data = {};
                $scope.data.currItem = {};

                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
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
                            headerName: '仓库编码'
                        }, {
                            field: 'warehouse_name',
                            headerName: '仓库名称'
                        },
                        {
                            field: 'qty_invbill',
                            headerName: '入库数量',
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
                            field: 'pricec_bill_f',
                            headerName: '含税价',
                            type: '金额',
                            hcRequired: true,
                            editable: true,
                            onCellValueChanged: function (args) {
                                pricec_bill_f_change(args);
                            }
                        }, {
                            field: 'amount_bill_f',
                            headerName: '含税金额',
                            type: '金额'
                        }, {
                            field: 'note',
                            headerName: '备注'
                        }
                    ]
                };

                /**继承主控制器 */
                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });


                /**
                 * 检查数据
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.gridOptions.api.stopEditing();
                    $scope.hcSuper.validCheck(invalidBox);
                    return invalidBox;
                };

                /**
                 * 设置表格数据
                 * @param bizData
                 */
                $scope.setBizData = function (bizData) {
                    bizData.stat = 1;
                    //左下按钮
                    $scope.footerRightButtons.saveThenAdd.hide = true;

                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.inv_in_bill_lines);
                };


                $scope.save = function () {

                    if ($scope.validCheck([]).length > 0) {
                        swalApi.info($scope.validCheck([]));
                        return;
                    }

                    var postData = {
                        classId: "inv_in_bill_head",
                        action: 'wareinpriceupdate',
                        data: $scope.data.currItem
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            swalApi.success("修改成功！");
                        });
                }

                $scope.onTaxRateChange = function () {
                    $scope.data.currItem.inv_in_bill_lines.forEach(function (value) {
                        value.pricec_bill_notax_f = numberApi.divide(value.pricec_bill_f, 1 + $scope.data.currItem.tax_rate / 100);
                        value.amount_bill_notax_f = numberApi.mutiply($scope.data.currItem.qty_invbill, numberApi.divide(value.pricec_bill_f, 1 + $scope.data.currItem.tax_rate / 100));
                    });
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.inv_in_bill_lines);
                }

                function pricec_bill_f_change(args) {
                    args.data.pricec_bill_notax_f = numberApi.divide(args.data.pricec_bill_f, 1 + $scope.data.currItem.tax_rate / 100);
                    args.data.amount_bill_notax_f = numberApi.mutiply($scope.data.currItem.qty_invbill, numberApi.divide(args.data.pricec_bill_f, 1 + $scope.data.currItem.tax_rate / 100));
                    args.data.amount_bill_f = numberApi.mutiply($scope.data.currItem.qty_invbill, args.data.pricec_bill_f);
                    args.api.refreshView();
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