/**
 * 部门绩效表单 属性表
 * 2019/06/21
 * Created by shenguocheng
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'numberApi', 'requestApi', 'directive/hcTab', 'directive/hcTabPage'],
    function (module, controllerApi, base_obj_prop, numberApi, requestApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数
            function ($scope, $modal) {
                /*----------------------------------定义数据-------------------------------------------*/
                $scope.data = {
                    appraiser: [{}],
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
                        editable: true,
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
                        field: "aim",
                        headerName: "目标"
                    }, {
                        field: "countformula",
                        headerName: "计算公式"
                    }, {
                        field: "note",
                        headerName: "备注",
                        editable: true
                    }, {
                        field: "detailnotes",
                        headerName: "重点工作描述",
                        editable: true
                    }, {
                        field: "pivotjob_fulfill",
                        headerName: "重点工作履行",
                        editable: true
                    }, {
                        field: "self_value",
                        headerName: "自评",
                        editable: true,
                        type: '数量'
                    }, {
                        field: "superior_value",
                        headerName: "上级评分",
                        editable: true,
                        type: '数量'
                    }]
                };

                $scope.gridOptions_appraiser = {
                    columnDefs: [
                        {
                            field: "appraiseman_type",
                            headerName: "参评人类别",
                            hcDictCode: 'appraiseman_type',
                            editable: true
                        }, {
                            field: "appraiseman_userid",
                            headerName: "参评人姓名",
                            hcRequired: true,
                            onCellDoubleClicked: function (args) {
                                $scope.chooseAppraiser(args);
                            }
                        }, {
                            field: "scale_value",
                            headerName: "权重",
                            type: '数量',
                            editable: true
                        }, {
                            field: "appraiseman_empid",
                            headerName: "参评人工号"
                        }
                    ]
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
                    $scope.setChangeKpiPeriod(bizData);
                    $scope.gridOptions.hcApi.setRowData($scope.data.appraiser);
                    $scope.gridOptions.hcApi.setRowData(bizData.kpi_deptkpibill_lineofkpi_deptkpibill_headers);
                    $scope.gridOptions_appraiser.hcApi.setRowData(bizData.kpi_deptkpibill_lineofkpi_deptkpibill_headers[0].kpi_deptkpibill_appraiserofkpi_deptkpibill_lines);
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

                //选择参评人
                $scope.chooseAppraiser = function (args) {
                    $modal.openCommonSearch({
                            classId: 'employee_header',
                            postData: {
                                search_flag: 700
                            },
                            //sqlWhere: "and a.employee_code <> " + $scope.data.currItem.empid + " and a.org_id =" + $scope.data.currItem.org_id + ""
                            action: 'search',
                            title: "参评人查询",

                            gridOptions: {
                                columnDefs: [
                                    {
                                        headerName: "参评人工号",
                                        field: "employee_code"
                                    }, {
                                        headerName: "参评人姓名",
                                        field: "employee_name"
                                    }
                                ]
                            }
                        })
                        .result//响应数据
                        .then(function (result) {
                            args.data.appraiseman_empid = result.employee_code;
                            args.data.appraiseman_userid = result.employee_name;
                            args.api.refreshView();//刷新网格视图
                        });
                };

                /**
                 * 设置数据之前先改变考核期间取值范围
                 */
                $scope.assess_time = [];
                $scope.setChangeKpiPeriod = function (bizData) {
                    if (bizData.kpi_period == 0 || bizData.kpi_period == undefined || bizData.kpi_period == null) {
                        return;
                    }
                    if (bizData.kpi_period == 2) {//半年度
                        $scope.assess_time.length = 0;
                        $scope.assess_time.push({
                            name: '上半年',
                            value: '1'
                        }, {
                            name: '下半年',
                            value: '2'
                        })
                    }
                    if (bizData.kpi_period == 3) {//季度
                        $scope.assess_time.length = 0;
                        $scope.assess_time.push(
                            {
                                name: '1季度',
                                value: '1'
                            }, {
                                name: '2季度',
                                value: '2'
                            }, {
                                name: '3季度',
                                value: '3'
                            }, {
                                name: '4季度',
                                value: '4'
                            })
                    }
                };

                /***
                 *   添加行 合并
                 */
                $scope.addRow_span_count = function (params) {
                    var flag = true;
                    $scope.data.currItem.kpi_deptkpibill_lineofkpi_deptkpibill_headers.forEach(
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
                    $scope.data.currItem.kpi_deptkpibill_lineofkpi_deptkpibill_headers.sort(function (a, b) {
                        return a.sortTime > b.sortTime;
                    })
                    $scope.data.currItem.kpi_deptkpibill_lineofkpi_deptkpibill_headers.sort(function (a, b) {
                        return a.kpiitem_type - b.kpiitem_type;
                    })
                    $scope.data.currItem.kpi_deptkpibill_lineofkpi_deptkpibill_headers.forEach(
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
                    $scope.data.currItem.kpi_deptkpibill_lineofkpi_deptkpibill_headers.sort(function (a, b) {
                        return a.kpiitem_type - b.kpiitem_type;
                    })
                    $scope.data.currItem.kpi_deptkpibill_lineofkpi_deptkpibill_headers.forEach(
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

                    $scope.data.currItem.kpi_deptkpibill_lineofkpi_deptkpibill_headers.sort(function (a, b) {
                        return a.sortTime > b.sortTime;
                    })
                    $scope.data.currItem.kpi_deptkpibill_lineofkpi_deptkpibill_headers.sort(function (a, b) {
                        return a.kpiitem_type - b.kpiitem_type;
                    })
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.kpi_deptkpibill_lineofkpi_deptkpibill_headers);
                };
                /**
                 *    合并验证
                 */
                $scope.invalidKts = function () {
                    //上一个val
                    var preVal = null;
                    var sum = [];
                    var str = '';
                    $scope.data.currItem.kpi_deptkpibill_lineofkpi_deptkpibill_headers.forEach(
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
                    $scope.data.currItem.kpi_deptkpibill_lineofkpi_deptkpibill_headers.forEach(
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
                                        if (erroMessage.length == 0 && index == $scope.data.currItem.kpi_deptkpibill_lineofkpi_deptkpibill_headers.length - 1) {
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

                /*----------------------------------按钮及标签 定义-------------------------------------------*/
                /**
                 * tab标签页
                 */
                $scope.kpi_tab = {
                    feectrlrate: {
                        title: '部门五项费用控制率',
                        active: true
                    }
                };

                //隐藏其他按钮，只保留增减按钮
                $scope.footerLeftButtons.topRow.hide = true;
                $scope.footerLeftButtons.upRow.hide = true;
                $scope.footerLeftButtons.downRow.hide = true;
                $scope.footerLeftButtons.bottomRow.hide = true;

                /*隐藏底部右边边按钮*/
                $scope.footerRightButtons.saveThenSubmit.hide = true;
                $scope.footerRightButtons.saveThenAdd.hide = true;

                //右边复制参评人
                $scope.footerRightButtons.copy_appraiseman = {
                    title: '复制参评人',
                    click: function () {
                        return $scope.copy_appraiseman && $scope.copy_appraiseman();
                    }
                };

                //右边删除行
                $scope.footerRightButtons.del_line = {
                    icon: 'fa fa-minus',
                    click: function () {
                        return $scope.del_line && $scope.del_line();
                    }
                };

                //右边增加行
                $scope.footerRightButtons.add_line = {
                    icon: 'fa fa-plus',
                    click: function () {
                        return $scope.add_line && $scope.add_line();
                    }
                };

                //复制参评人按钮
                $scope.copy_appraiseman = function () {
                    $modal.openCommonSearch({
                            classId: 'kpi_deptkpibill_header',
                            postData: {
                                copyflag: 2,
                                sdeptkpibill_id: $scope.data.currItem.deptkpibill_id,
                                deptkpibill_id: $scope.data.currItem.deptkpibill_id
                            },
                            action: 'copydata',
                            title: "参评人",
                            gridOptions: {
                                columnDefs: [
                                    {
                                        headerName: "参评人工号",
                                        field: "appraiseman_empid"
                                    }, {
                                        headerName: "参评人姓名",
                                        field: "appraiseman_userid"
                                    }
                                ]
                            }
                        })
                        .result//响应数据
                        .then(function (result) {
                            $scope.data.appraiser.push(result);
                            $scope.gridOptions_appraiser.hcApi.setRowData($scope.data.appraiser);
                        });
                };

                //增加行
                $scope.add_line = function () {
                    $scope.gridOptions_appraiser.api.stopEditing();
                    if ($scope.data.currItem.kpi_deptkpibill_lineofkpi_deptkpibill_headers[0].kpi_deptkpibill_appraiserofkpi_deptkpibill_lines) {
                        $scope.data.appraiser = $scope.data.currItem.kpi_deptkpibill_lineofkpi_deptkpibill_headers[0].kpi_deptkpibill_appraiserofkpi_deptkpibill_lines;
                    }
                    $scope.data.appraiser.push({});
                    $scope.gridOptions_appraiser.hcApi.setRowData($scope.data.appraiser);
                };

                //删除行
                $scope.del_line = function () {
                    var idx = $scope.gridOptions_appraiser.hcApi.getFocusedRowIndex();
                    var data = $scope.data.appraiser;
                    data.splice(idx, 1);
                    if (data.length == 0) {
                        data.push({});
                    }
                    $scope.gridOptions_appraiser.hcApi.setRowData(data);
                };

                /*----------------------------------保存数据-------------------------------------------*/
                $scope.saveBizData = function (bizData) {
                    $scope.data.currItem.kpi_deptkpibill_lineofkpi_deptkpibill_headers[0].kpi_deptkpibill_appraiserofkpi_deptkpibill_lines = $scope.data.appraiser;
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