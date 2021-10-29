/**
 * 员工绩效评分属性表
 * 2019/6/17
 * shenguocheng
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'numberApi'],
    function (module, controllerApi, base_obj_prop, swalApi, numberApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数


            function ($scope, $modal) {
                /*----------------------------------定义数据-------------------------------------------*/
                $scope.data = {
                    currItem: {}
                };

                /*----------------------------------合并单元格-------------------------------------------*/
                function rowSpanFunc(params) {
                    var row_span_count = (params.data.row_span_count && HczyCommon.isNotNull(params.data.merge_no)) ? parseInt(params.data.row_span_count) : 1;
                    return row_span_count;
                }

                /*----------------------------------合并结束-------------------------------------------*/

                $scope.gridOptions = {
                    hcEvents: {
                        //焦点改变事件
                        cellFocused: function (params) {
                            $scope.gridOptions_score.hcApi.setRowData();
                        }
                    },
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: "kpiitem_type",
                        headerName: "指标类别",
                        rowSpan: rowSpanFunc
                    }, {
                        field: "kpiitem_type_scale",
                        headerName: "指标类别权重",
                        rowSpan: rowSpanFunc
                    }, {
                        field: "kpiitem_no",
                        headerName: "考核指标编码"
                    }, {
                        field: "kpiitem_name",
                        headerName: "考核指标名称"
                    }, {
                        field: "kpiitem_scale",
                        headerName: "考核指标权重",
                    }, {
                        field: "scale_value",
                        headerName: "参评人权重",
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
                        field: "notes",
                        headerName: "备注",
                        editable: true
                    }]
                };

                $scope.gridOptions_appraiser = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: "appraiseman_type",
                        headerName: "参评人类别",
                        width: 200
                    }, {
                        field: "appraiseman_userid",
                        headerName: "参评人",
                        width: 121
                    }, {
                        field: "graded_value",
                        headerName: "评分值",
                        type: '数量',
                        width: 121
                    }
                    ]
                };

                $scope.gridOptions_score = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: "gradeitem",
                        headerName: "评分标准",
                        width: 363
                    }, {
                        field: "value",
                        headerName: "分值",
                        type: '数量'
                    }]
                };
                //指定网格对象
                //$scope.data.currGridModel = 'data.currItem.kpi_empgradedbill_lineofkpi_empgradedbill_headers';
                //$scope.data.currGridOptions = $scope.gridOptions;

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
                    $scope.gridOptions.hcApi.setRowData(bizData.kpi_empgradedbill_lineofkpi_empgradedbill_headers);
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
                /*----------------------------------按钮及标签 定义-------------------------------------------*/
                //员工关键事件按钮
                $scope.footerLeftButtons.empkeyevents = {
                    title: '员工关键事件',
                    click: function () {
                        return $scope.empkeyevents && $scope.empkeyevents();
                    }
                };
                //隐藏其他按钮，只保留增减按钮
                $scope.footerLeftButtons.topRow.hide = true;
                $scope.footerLeftButtons.upRow.hide = true;
                $scope.footerLeftButtons.downRow.hide = true;
                $scope.footerLeftButtons.bottomRow.hide = true;

                /*隐藏底部右边边按钮*/
                $scope.footerRightButtons.saveThenAdd.hide = true;
                //$scope.footerRightButtons.saveThenSubmit.hide = true;

                $scope.empkeyevents = function () {
                    $modal.openCommonSearch({
                        classId: 'kpi_employeeevent',
                        postData: {},
                        sqlWhere: " empid = " + $scope.data.currItem.empid,
                        action: 'search',
                        title: "员工关键事件",
                        gridOptions: {
                            columnDefs: [
                                {
                                    headerName: "事件标题",
                                    field: "event_title"
                                }, {
                                    headerName: "事件摘要",
                                    field: "event_content"
                                }, {
                                    headerName: "部门名称",
                                    field: "org_name"
                                }, {
                                    headerName: "员工工号",
                                    field: "empid"
                                }, {
                                    headerName: "员工姓名",
                                    field: "userid"
                                }, {
                                    headerName: "发生时间",
                                    field: "happentime"
                                }, {
                                    headerName: "对绩效的影响",
                                    field: "kpieffect"
                                }
                            ]
                        }
                    })
                };

                /***
                 *   添加行 合并
                 */
                $scope.addRow_span_count = function (params) {
                    var flag = true;
                    $scope.data.currItem.kpi_empgradedbill_lineofkpi_empgradedbill_headers.forEach(
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
                    $scope.data.currItem.kpi_empgradedbill_lineofkpi_empgradedbill_headers.sort(function (a, b) {
                        return a.sortTime > b.sortTime;
                    })
                    $scope.data.currItem.kpi_empgradedbill_lineofkpi_empgradedbill_headers.sort(function (a, b) {
                        return a.kpiitem_type - b.kpiitem_type;
                    })
                    $scope.data.currItem.kpi_empgradedbill_lineofkpi_empgradedbill_headers.forEach(
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
                    $scope.data.currItem.kpi_empgradedbill_lineofkpi_empgradedbill_headers.sort(function (a, b) {
                        return a.kpiitem_type - b.kpiitem_type;
                    })
                    $scope.data.currItem.kpi_empgradedbill_lineofkpi_empgradedbill_headers.forEach(
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

                    $scope.data.currItem.kpi_empgradedbill_lineofkpi_empgradedbill_headers.sort(function (a, b) {
                        return a.sortTime > b.sortTime;
                    })
                    $scope.data.currItem.kpi_empgradedbill_lineofkpi_empgradedbill_headers.sort(function (a, b) {
                        return a.kpiitem_type - b.kpiitem_type;
                    })
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.kpi_empgradedbill_lineofkpi_empgradedbill_headers);
                };
                /**
                 *    合并验证
                 */
                $scope.invalidKts = function () {
                    //上一个val
                    var preVal = null;
                    var sum = [];
                    var str = '';
                    $scope.data.currItem.kpi_empgradedbill_lineofkpi_empgradedbill_headers.forEach(
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
                    $scope.data.currItem.kpi_empgradedbill_lineofkpi_empgradedbill_headers.forEach(
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
                                        if (erroMessage.length == 0 && index == $scope.data.currItem.kpi_empgradedbill_lineofkpi_empgradedbill_headers.length - 1) {
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
                    $scope.data.currItem.kpi_empkpibill_lineofkpi_empkpibill_headers[0].kpi_empkpibill_appraiserofkpi_empkpibill_headers = $scope.data.appraiser;
                    $scope.data.currItem.kpi_empkpibill_lineofkpi_empkpibill_headers[0].kpi_empkpibill_gradenormofkpi_empkpibill_lines = $scope.data.grade;
                    $scope.hcSuper.saveBizData(bizData);
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