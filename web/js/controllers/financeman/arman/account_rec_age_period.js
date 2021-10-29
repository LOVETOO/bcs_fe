/**
 * 应收账龄期间-列表页
 * date:2018-12-10
 */
define(
    ['module', 'controllerApi', 'base_edit_list', 'swalApi', 'requestApi', 'numberApi'],
    function (module, controllerApi, base_edit_list, swalApi, requestApi, numberApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$q',
            //控制器函数
            function ($scope, $q) {
                $scope.data = {};
                $scope.data.currItem = {};
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'rec_age_code',
                        headerName: '编号',
                    }, {
                        field: 'day_count',
                        headerName: '天数'
                    }, {
                        field: 'describle',
                        headerName: '账龄期间描述'
                    }, {
                        field: 'note',
                        headerName: '备注',
                        suppressSizeToFit: false,
                        minWidth: 780,
                        maxWidth: 1200,
                    }
                    ]
                };

                controllerApi.extend({
                    controller: base_edit_list.controller,
                    scope: $scope
                });


                //表格双击事件
                //单元格双击事件
                $scope.gridOptions.onCellClicked = function (node) {

                    $scope.data.currItem.rowIndex = node.rowIndex;
                    $scope.data.currItem = node.data;
                    setDescrible(node.rowIndex);
                };

                /**
                 * 生成账期描述
                 */
                function setDescrible(rowIndex) {
                    var rowdata = $scope.gridOptions.hcApi.getRowData();
                    var rowdata1 = rowdata[rowIndex - 1];
                    if (rowdata1) {
                        $scope.data.currItem.describle = parseInt(rowdata1.day_count) + 1 + "~" + $scope.data.currItem.day_count;
                    } else {
                        $scope.data.currItem.describle = "0~" + $scope.data.currItem.day_count;
                        return;
                    }
                }

                /**
                 * 天数修改事件
                 */
                $scope.onDayCountChange = function () {
                    if (!$scope.data.currItem.rowIndex) {
                        $scope.data.currItem.rowIndex = 0;
                    }
                    setDescrible($scope.data.currItem.rowIndex);
                }

                /**
                 * 检查逻辑
                 */
                /**
                 * 保存前验证
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);

                    var rowdata = $scope.gridOptions.hcApi.getRowData();
                    if ($scope.data.currItem.rec_age_id > 0) {
                        if ($scope.data.currItem.rowIndex == rowdata.length - 1) {
                            return invalidBox;
                        } else {
                            if (rowdata[$scope.data.currItem.rowIndex - 1] && parseInt(rowdata[$scope.data.currItem.rowIndex - 1].day_count) > $scope.data.currItem.day_count) {
                                invalidBox.push("天数必须大于上一条记录的天数");
                            }
                            if (rowdata[$scope.data.currItem.rowIndex + 1] && parseInt(rowdata[$scope.data.currItem.rowIndex + 1].day_count < $scope.data.currItem.day_count)) {
                                invalidBox.push("天数必须小于下一条记录的天数");
                            }
                        }
                    } else {
                        if (!rowdata.length || rowdata.length == 0) {
                            return invalidBox;
                        }
                        var LastDayCount = parseInt(rowdata[rowdata.length - 1].day_count);
                        if (parseInt($scope.data.currItem.day_count) <= LastDayCount) {
                            invalidBox.push("新增天数必须大于最后一条记录的天数!");
                        }
                    }
                    return invalidBox;
                }

                $scope.newBizData = function (bizdata) {
                    $scope.hcSuper.newBizData(bizdata);

                    var rowdata = $scope.gridOptions.hcApi.getRowData();
                    bizdata.rowIndex = rowdata.length ? rowdata.length : 0;
                };

                $scope.doAfterSave = function (responseData) {
                    $scope.gridOptions.hcApi.search();
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