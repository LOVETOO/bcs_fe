/**
 * 部门绩效评分 属性表
 * 2019/6/20
 * Created by shenguocheng
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'directive/hcTab', 'directive/hcTabPage'],
    function (module, controllerApi, base_obj_prop) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数

            function ($scope) {
                /*----------------------------------定义数据-------------------------------------------*/
                $scope.data = {
                    currItem: {
                        kpi_deptkpibill_lineofkpi_deptkpibill_headers: [{kpi_deptkpibill_appraiserofkpi_deptkpibill_lines: []}]
                    }
                };

                /*----------------------------------合并单元格-------------------------------------------*/
                function rowSpanFunc(params) {
                    var row_span_count = (params.data.row_span_count && HczyCommon.isNotNull(params.data.merge_no)) ? parseInt(params.data.row_span_count) : 1;
                    return row_span_count;
                }

                /*----------------------------------合并结束-------------------------------------------*/

                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: "itemtype_name",
                        headerName: "指标类别",
                        rowSpan: rowSpanFunc,
                        hcRequired: true
                    }, {
                        field: "kpiitem_type_scale",
                        headerName: "指标类别权重",
                        rowSpan: rowSpanFunc,
                        hcRequired: true
                    }, {
                        field: "kpiitem_no",
                        headerName: "考核指标编码"
                    }, {
                        field: "kpiitem_name",
                        headerName: "考核指标名称"
                    }, {
                        field: "kpiitem_scale",
                        headerName: "考核指标权重"
                    }, {
                        field: "appraiseman_type",
                        headerName: "参评人类别",
                    }, {
                        field: "scale_value",
                        headerName: "参评人权重"
                    }, {
                        field: "graded_value",
                        headerName: "评分值(百分制)",
                        type: "数量",
                        editable: true,
                        onCellValueChanged: function (args) {
                            if (numberApi.toNumber(args.data.graded_value, -1) == -1) {
                                swalApi.info('请输入数字');
                                args.data.graded_value = '';
                            } else if (numberApi.toNumber(args.data.graded_value) < 50) {
                                swalApi.info('这是百分制的，请合理打分');
                                args.data.graded_value = '';
                            }
                        }
                    }, {
                        field: "note",
                        headerName: "备注",
                        editable: true
                    }]
                };

                //继承控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /**
                 * 查看时设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.kpi_deptgradedbill_lineofkpi_deptgradedbill_headers);
                    $scope.gridOptions.hcApi.setRowData(bizData.kpi_deptgradedbill_lineofkpi_deptgradedbill_headers[0].kpi_deptkpibill_appraiserofkpi_deptkpibill_lines);
                    initRow_span_count();
                };

                //保存验证
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    var Kts = $scope.invalidKts();
                    var Kt = $scope.invalidKt();
                    if (Kts.length > 0) {
                        invalidBox.push(Kts);
                    }
                    if (Kt.length > 0) {
                        invalidBox.push(Kt);
                    }
                };

                /***
                 *   添加行 合并
                 */
                $scope.addRow_span_count = function (params) {
                    var flag = true;
                    $scope.data.currItem.kpi_deptgradedbill_lineofkpi_deptgradedbill_headers.forEach(
                        function (val) {
                            if (val.itemtype_name == params.data.itemtype_name) {
                                if (val.merge_no == 'getTo') {
                                    val.row_span_count++;
                                    params.data.kpiitem_type_scale = val.kpiitem_type_scale;
                                    flag = false;
                                    return flag;
                                } else if (flag && (val.merge_no == null || val.merge_no == '')) {
                                    params.data.row_span_count = 1;
                                    params.data.merge_no = 'getTo';
                                }
                            }
                        })
                };

                /***
                 *    删除行时合并
                 *
                 */
                function deleteRow_span_count() {
                    var preVal = '';
                    $scope.data.currItem.kpi_deptgradedbill_lineofkpi_deptgradedbill_headers.sort(function (a, b) {
                        return a.sortTime > b.sortTime;
                    })
                    $scope.data.currItem.kpi_deptgradedbill_lineofkpi_deptgradedbill_headers.sort(function (a, b) {
                        return a.kpiitem_type - b.kpiitem_type;
                    })
                    $scope.data.currItem.kpi_deptgradedbill_lineofkpi_deptgradedbill_headers.forEach(
                        function (val) {
                            if (val.merge_no != null || val.merge_no != undefined) {
                                val.merge_no = null;
                                val.row_span_count = null;
                            }
                        })
                };

                /***
                 *    初始化合并数据
                 *
                 */
                function initRow_span_count() {
                    var preVal = '';
                    $scope.data.currItem.kpi_deptgradedbill_lineofkpi_deptgradedbill_headers.sort(function (a, b) {
                        return a.kpiitem_type - b.kpiitem_type;
                    })
                    $scope.data.currItem.kpi_deptgradedbill_lineofkpi_deptgradedbill_headers.forEach(
                        function (val) {
                            if (JSON.stringify(val) === '{}') {
                                return;
                            }
                            if (preVal == '') {
                                preVal = val;
                                preVal.merge_no = 'getTo';
                                preVal.row_span_count = 1;
                                preVal.sortTime = Date.now();
                            } else {
                                if (preVal.kpiitem_type != val.kpiitem_type) {
                                    preVal = val;
                                    preVal.merge_no = 'getTo';
                                    preVal.row_span_count = 1;
                                    preVal.sortTime = Date.now();
                                    ;
                                } else if ((preVal.kpiitem_type == val.kpiitem_type) && (val.merge_no == null || val.merge_no == undefined)) {
                                    preVal.row_span_count++;
                                    val.sortTime = Date.now();
                                }
                            }
                        })

                    $scope.data.currItem.kpi_deptgradedbill_lineofkpi_deptgradedbill_headers.sort(function (a, b) {
                        return a.sortTime > b.sortTime;
                    })
                    $scope.data.currItem.kpi_deptgradedbill_lineofkpi_deptgradedbill_headers.sort(function (a, b) {
                        return a.kpiitem_type - b.kpiitem_type;
                    })
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.kpi_deptgradedbill_lineofkpi_deptgradedbill_headers);
                };
                /**
                 *    合并验证
                 */
                $scope.invalidKts = function () {
                    //上一个val
                    var preVal = null;
                    var sum = [];
                    var str = '';
                    $scope.data.currItem.kpi_deptgradedbill_lineofkpi_deptgradedbill_headers.forEach(
                        function (val) {
                            if (preVal == null) {
                                preVal = val;
                                sum.push(val.kpiitem_type_scale);
                            } else {
                                if (preVal.kpiitem_type != val.kpiitem_type) {
                                    sum.push(val.kpiitem_type_scale);
                                    preVal = val;
                                }
                            }
                        })
                    var result = sumArray(sum);
                    if (result != 100) {
                        str += "指标类别权重不等于100"
                    }
                    return str;
                };

                /**
                 *    非合并验证
                 */
                $scope.invalidKt = function () {
                    var preVal = null;
                    var erroMessage = [];
                    var sum = [];
                    var str = '';
                    $scope.data.currItem.kpi_deptgradedbill_lineofkpi_deptgradedbill_headers.forEach(
                        function (val, index) {
                            if (preVal == null) {
                                preVal = val;
                                sum.push(val.kpiitem_scale);
                            } else {
                                if (preVal.kpiitem_type == val.kpiitem_type) {
                                    if (val.kpiitem_scale != null || val.kpiitem_scale != '') {
                                        var tmp = val.kpiitem_scale;
                                        if (numberApi.isStrOfNum(tmp)) {
                                            sum.push(val.kpiitem_scale);
                                        }
                                        if (erroMessage.length == 0 && index == $scope.data.currItem.kpi_deptgradedbill_lineofkpi_deptgradedbill_headers.length - 1) {
                                            var sumKt = sumArray(sum);
                                            if (sumKt != 100) {
                                                erroMessage.push(preVal.itemtype_name + "考核权重值不等于100");
                                            }
                                            sum = [];
                                        }
                                    }
                                } else {
                                    var sumKt = sumArray(sum);
                                    if (sumKt != 100) {
                                        erroMessage.push(preVal.itemtype_name + "考核权重值不等于100");
                                    }
                                    sum = [];
                                    sum.push(val.kpiitem_scale);
                                    preVal = val;

                                }
                            }
                        })
                    for (var i = 0, len = erroMessage.length; i < len; i++) {
                        str += erroMessage[i];
                    }
                    return str;
                };

                /*
                 计算
                 */
                function sumArray(params) {
                    return eval(params.join("+"));
                };

                /*----------------------------------保存数据-------------------------------------------*/
                $scope.saveBizData = function (bizData) {
                    $scope.data.currItem.kpi_deptkpibill_lineofkpi_deptkpibill_headers[0].kpi_deptkpibill_appraiserofkpi_deptkpibill_lines;
                    $scope.hcSuper.saveBizData(bizData);
                };

                /*----------------------------------按钮及标签 定义-------------------------------------------*/
                //隐藏其他按钮，只保留增减按钮
                $scope.footerLeftButtons.topRow.hide = true;
                $scope.footerLeftButtons.upRow.hide = true;
                $scope.footerLeftButtons.downRow.hide = true;
                $scope.footerLeftButtons.bottomRow.hide = true;

                /*隐藏底部右边边按钮*/
                $scope.footerRightButtons.saveThenSubmit.hide = true;
                $scope.footerRightButtons.saveThenAdd.hide = true;
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