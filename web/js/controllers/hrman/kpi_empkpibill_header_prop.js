/**
 * 员工绩效表单属性表
 * 2019/5/30
 * shenguocheng
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'numberApi', 'swalApi', 'directive/hcTab', 'directive/hcTabPage'],
    function (module, controllerApi, base_obj_prop, requestApi, numberApi, swalApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$q', '$modal',
            //控制器函数
            function ($scope, $q, $modal) {
                /*----------------------------------定义数据-------------------------------------------*/
                $scope.data = {
                    appraiser: [],
                    grade: [{}],
                    currItem: {
                        kpi_empkpibill_lineofkpi_empkpibill_headers: [{
                            kpi_empkpibill_appraiserofkpi_empkpibill_headers: [],
                            kpi_empkpibill_gradenormofkpi_empkpibill_lines: []
                        }],
                    }
                };

                /*----------------------------------合并单元格-------------------------------------------*/
                function rowSpanFunc(params) {
                    var row_span_count = (params.data.row_span_count && HczyCommon.isNotNull(params.data.merge_no)) ? parseInt(params.data.row_span_count) : 1;
                    return row_span_count;
                }
                /*----------------------------------合并结束-------------------------------------------*/

                $scope.tabc = "gridOptions_grade";

                $scope.gridOptions = {
                    hcEvents: {
                        //焦点改变事件
                        cellFocused: function (params) {
                            $scope.gridOptions_grade.hcApi.setRowData($scope.data.currItem.kpi_empkpibill_lineofkpi_empkpibill_headers[params.rowIndex]
                                .kpi_empkpibill_gradenormofkpi_empkpibill_lines);
                        }
                    },
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: "itemtype_name",
                        headerName: "指标类别",
                        rowSpan: rowSpanFunc,
                        onCellDoubleClicked: function (args) {
                            $scope.chooseItemType(args);
                        },
                        hcRequired: true
                    }, {
                        field: "kpiitem_type_scale",
                        headerName: "指标类别权重",
                        rowSpan: rowSpanFunc,
                        editable: true,
                        type: '数量',
                        onCellValueChanged: function (args) {
                            if (numberApi.toNumber(args.data.kpiitem_type_scale,-1) == -1) {
                                swalApi.info('请输入数字');
                                args.data.kpiitem_type_scale = '';
                            }
                        },
                        hcRequired: true,
                    }, {
                        field: "kpiitem_no",
                        headerName: "考核指标编码",
                        onCellDoubleClicked: function (args) {
                            $scope.chooseKpiitemName(args);
                        }
                    }, {
                        field: "kpiitem_name",
                        headerName: "考核指标名称",
                        onCellDoubleClicked: function (args) {
                            $scope.chooseKpiitemName(args);
                        }
                    }, {
                        field: "kpiitem_scale",
                        headerName: "考核指标权重",
                        editable: true,
                        type: '数量',
                        onCellValueChanged: function (args) {
                            if (numberApi.toNumber(args.data.kpiitem_scale,-1) == -1) {
                                swalApi.info('请输入数字');
                                args.data.kpiitem_scale = '';
                            }
                        }
                    }, {
                        field: "notes",
                        headerName: "备注",
                        editable: true
                    }]
                };

                $scope.gridOptions_appraiser = {
                    columnDefs: [
                        {
                            field: "appraiseman_type",
                            headerName: "参评人类别",
                            hcDictCode: 'appraiseman_type',
                            editable: true,
                            onCellValueChanged: function (args) {
                                if (args.data.appraiseman_type == 2) {
                                    args.data.appraiseman_userid = $scope.data.currItem.userid;
                                }
                            },
                            width: 100
                        }, {
                            field: "appraiseman_userid",
                            headerName: "参评人姓名",
                            hcRequired: true,
                            width: 100,
                            onCellDoubleClicked: function (args) {
                                $scope.chooseAppraiser(args);
                            }
                        }, {
                            field: "scale_value",
                            headerName: "权重",
                            editable: true,
                            type: '数量',
                            width: 100,
                            onCellValueChanged: function (args) {
                                if (numberApi.toNumber(args.data.scale_value,-1) == -1) {
                                    swalApi.info('请输入数字');
                                    args.data.scale_value = '';
                                }
                            }
                        }, {
                            field: "appraiseman_empid",
                            headerName: "参评人工号",
                            width: 100,
                            onCellDoubleClicked: function (args) {
                                $scope.chooseAppraiser(args);
                            },
                            onCellValueChanged: function (args) {
                                if (args.newValue === args.oldValue)
                                    return;
                                setBatchAppraiseman(args.newValue)
                                    .catch(function (reason) {
                                        return {
                                            appraiseman_empid: '',
                                            appraiseman_userid: reason
                                        };
                                    })
                                    .then(function (line) {
                                        angular.extend(args.data, line);
                                        return args.data;
                                    })
                                    .then(function () {
                                        args.api.refreshView();
                                    });
                            }
                        }
                    ]
                };

                $scope.gridOptions_grade = {
                    columnDefs: [
                        {
                            field: "gradeitem",
                            headerName: "评分项目",
                            editable: true,
                            width: 170,
                            onCellValueChanged: function (args) {
                                if (args.data.appraiseman_type == 2) {
                                    args.data.appraiseman_userid = $scope.data.currItem.userid;
                                }
                            }
                        }, {
                            field: "value",
                            headerName: "分值",
                            editable: true,
                            type: '数量',
                            onCellValueChanged: function (args) {
                                if (numberApi.toNumber(args.data.value,-1) == -1) {
                                    swalApi.info('请输入数字');
                                    args.data.value = '';
                                }
                            },
                            width: 100
                        }
                    ]
                };

                //继承控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                /*----------------------------------指定网格对象-------------------------------------------*/
                $scope.data.currGridModel = 'data.currItem.kpi_empkpibill_lineofkpi_empkpibill_headers';
                $scope.data.currGridOptions = $scope.gridOptions;

                /**
                 * 查看时设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.setChangeKpiPeriod(bizData);
                    $scope.gridOptions_appraiser.hcApi.setRowData($scope.data.appraiser);
                    $scope.gridOptions_appraiser.hcApi.setRowData(bizData.kpi_empkpibill_lineofkpi_empkpibill_headers[0].kpi_empkpibill_appraiserofkpi_empkpibill_lines);
                    $scope.gridOptions_grade.hcApi.setRowData($scope.data.grade);
                    $scope.gridOptions_grade.hcApi.setRowData(bizData.kpi_empkpibill_lineofkpi_empkpibill_headers[0].kpi_empkpibill_gradenormofkpi_empkpibill_lines);
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

                //批量设置参评人信息
                function setBatchAppraiseman(code) {
                    var postData = {
                        classId: "kpi_empkpibill_header",
                        action: 'setapp',
                        data: {sqlwhere: "appraiseman_empid = '" + code + "'"}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            if (data.kpi_empkpibill_lineofkpi_empkpibill_headers.length > 0) {
                                return data.kpi_empkpibill_lineofkpi_empkpibill_headers[0];
                            } else {
                                return $q.reject("参评人工号【" + code + "】不可用");
                            }
                        });
                }

                //选择指标类别名称
                $scope.chooseItemType = function (args) {
                    $modal.openCommonSearch({
                            classId: 'kpi_itemtypes',
                            postData: {search_flag: 1},
                            action: 'searchitemtypes',
                            title: "指标类别查询",

                            gridOptions: {
                                columnDefs: [
                                    {
                                        headerName: "指标类别编码",
                                        field: "typid"
                                    }, {
                                        headerName: "指标类别名称",
                                        field: "itemtype"
                                    }
                                ]
                            }
                        })
                        .result//响应数据
                        .then(function (result) {
                            if (args.data.kpiitem_type == result.typid) {
                                return false;
                            }
                            if (args.data.kpiitem_type != result.typid && args.data.kpiitem_type != undefined) {
                                swalApi.info('不能修改值');
                                return false;
                            }
                            args.data.kpiitem_type = result.typid;
                            args.data.itemtype_name = result.itemtype;
                            $scope.data.currItem.idpath = result.idpath;
                            args.data.sortTime = Date.now();
                            $scope.data.currItem.kpi_empkpibill_lineofkpi_empkpibill_headers.sort(function (a, b) {
                                return a.sortTime - b.sortTime;
                            })
                            $scope.data.currItem.kpi_empkpibill_lineofkpi_empkpibill_headers.sort(function (a, b) {
                                return a.kpiitem_type - b.kpiitem_type;
                            })
                            $scope.addRow_span_count(args);
                            $scope.gridOptions.hcApi.setRowData($scope.data.currItem.kpi_empkpibill_lineofkpi_empkpibill_headers);
                        }).then(function () {
                        args.api.refreshView();//刷新网格视图
                    });
                };

                //选择考核指标名称
                $scope.chooseKpiitemName = function (args) {
                    if (!$scope.gridOptions.hcApi.getFocusedData().kpiitem_type) {
                        swalApi.info("请先选择指标类别");
                        return;
                    }
                    $modal.openCommonSearch({
                            classId: 'kpi_kpiitems',
                            postData: {},
                            sqlWhere: 'kpiitem_type = ' + $scope.gridOptions.hcApi.getFocusedData().kpiitem_type,
                            action: 'kpiitemsearch',
                            title: "考核指标查询",

                            gridOptions: {
                                columnDefs: [
                                    {
                                        headerName: "考核指标编码",
                                        field: "kpiitem_no"
                                    }, {
                                        headerName: "考核指标名称",
                                        field: "kpiitem_name"
                                    }
                                ]
                            }
                        })
                        .result//响应数据
                        .then(function (result) {
                            args.data.kpiitem_id = result.kpiitem_id;
                            args.data.kpiitem_no = result.kpiitem_no;
                            args.data.kpiitem_name = result.kpiitem_name;
                            args.api.refreshView();//刷新网格视图
                        });
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
                    $scope.data.currItem.kpi_empkpibill_lineofkpi_empkpibill_headers.forEach(
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
                    $scope.data.currItem.kpi_empkpibill_lineofkpi_empkpibill_headers.sort(function (a, b) {
                        return a.sortTime > b.sortTime;
                    })
                    $scope.data.currItem.kpi_empkpibill_lineofkpi_empkpibill_headers.sort(function (a, b) {
                        return a.kpiitem_type - b.kpiitem_type;
                    })
                    $scope.data.currItem.kpi_empkpibill_lineofkpi_empkpibill_headers.forEach(
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
                    $scope.data.currItem.kpi_empkpibill_lineofkpi_empkpibill_headers.sort(function (a, b) {
                        return a.kpiitem_type - b.kpiitem_type;
                    })
                    $scope.data.currItem.kpi_empkpibill_lineofkpi_empkpibill_headers.forEach(
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

                    $scope.data.currItem.kpi_empkpibill_lineofkpi_empkpibill_headers.sort(function (a, b) {
                        return a.sortTime > b.sortTime;
                    })
                    $scope.data.currItem.kpi_empkpibill_lineofkpi_empkpibill_headers.sort(function (a, b) {
                        return a.kpiitem_type - b.kpiitem_type;
                    })
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.kpi_empkpibill_lineofkpi_empkpibill_headers);
                };
                /**
                 *    合并验证
                 */
                $scope.invalidKts = function () {
                    //上一个val
                    var preVal = null;
                    var sum = [];
                    var str = '';
                    $scope.data.currItem.kpi_empkpibill_lineofkpi_empkpibill_headers.forEach(
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
                    $scope.data.currItem.kpi_empkpibill_lineofkpi_empkpibill_headers.forEach(
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
                                        if (erroMessage.length == 0 && index == $scope.data.currItem.kpi_empkpibill_lineofkpi_empkpibill_headers.length - 1) {
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
                    score: {
                        title: '评分标准',
                        active: true
                    },
                    completion: {
                        title: '重点工作完成率'
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
                    },
                    hide: true
                };

                //右下删除行
                $scope.footerRightButtons.del_rightline = {
                    icon: 'fa fa-minus',
                    click: function () {
                        return $scope.del_rightline && $scope.del_rightline();
                    }
                };

                //确认按钮
                $scope.footerRightButtons.confirm_save = {
                    title: '确认',
                    click: function () {
                        return $scope.confirm_save && $scope.confirm_save();
                    }
                };
                
                //右下增加行
                $scope.footerRightButtons.add_rightline = {
                    icon: 'fa fa-plus',
                    click: function () {
                        return $scope.add_rightline && $scope.add_rightline();
                    }
                };
                //左下删除行
                $scope.footerLeftButtons.deleteRow = {
                    icon: 'fa fa-minus',
                    click: function () {
                        return $scope.del_leftline && $scope.del_leftline();
                    }
                };
                //左下增加行
                $scope.footerLeftButtons.addRow = {
                    icon: 'fa fa-plus',
                    click: function () {
                        return $scope.add_leftline && $scope.add_leftline();
                    }
                };

                //复制参评人按钮
                $scope.copy_appraiseman = function () {
                    $modal.openCommonSearch({
                            classId: 'kpi_empkpibill_header',
                            postData: {
                                stat: 5,
                                //empid: $scope.data.currItem.empid,
                                sempkpibill_id: $scope.data.currItem.empkpibill_id,
                                empkpibill_id: $scope.data.currItem.empkpibill_id
                            },
                            action: 'copyappraiser',
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

                //确认按钮方法
                $scope.confirm_save = function () {
                    requestApi.post({
                        classId: "kpi_empkpibill_header",
                        action: 'test',
                        data: {empkpibill_id: $scope.data.currItem.empkpibill_id}
                    }).then(function () {
                        swalApi.success('确认成功');
                    });
                };

                /**
                 * 标签页改变事件
                 * @param params
                 */
                $scope.onTabChange = function (params) {
                    if (params.id == 'score') {
                        $scope.footerRightButtons.copy_appraiseman.hide = true;
                        $scope.tabc = "gridOptions_grade";
                    } else {
                        $scope.footerRightButtons.copy_appraiseman.hide = false;
                        $scope.tabc = "gridOptions_appraiser";

                    }
                };

                //右下添加明细
                $scope.add_rightline = function () {
                    $scope[$scope.tabc].api.stopEditing();
                    var data;
                    if ($scope.tabc == "gridOptions_appraiser") {
                        if($scope.data.currItem.
                                kpi_empkpibill_lineofkpi_empkpibill_headers[0].kpi_empkpibill_appraiserofkpi_empkpibill_lines){
                            $scope.data.appraiser = $scope.data.currItem.
                                kpi_empkpibill_lineofkpi_empkpibill_headers[0].kpi_empkpibill_appraiserofkpi_empkpibill_lines;
                        }
                        data = $scope.data.appraiser;
                    } else {
                        if ($scope.data.currItem.
                                kpi_empkpibill_lineofkpi_empkpibill_headers[0].kpi_empkpibill_gradenormofkpi_empkpibill_lines) {
                            $scope.data.grade = $scope.data.currItem.
                                kpi_empkpibill_lineofkpi_empkpibill_headers[0].kpi_empkpibill_gradenormofkpi_empkpibill_lines;
                        }
                        data = $scope.data.grade;
                    }
                    data.push({});
                    $scope[$scope.tabc].hcApi.setRowData(data);
                };
                /**
                 * 右下删除行明细
                 */
                $scope.del_rightline = function () {
                    var idx = $scope[$scope.tabc].hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        var data;
                        if ($scope.tabc == "gridOptions_appraiser") {
                            data = $scope.data.appraiser;
                        } else {
                            data = $scope.data.grade;
                        }
                        data.splice(idx, 1);
                        if (data.length == 0) {
                            data.push({});
                        }
                        $scope[$scope.tabc].hcApi.setRowData(data);
                    }
                };

                /**
                 * 左下添加行明细
                 */
                $scope.add_leftline = function () {
                    $scope.gridOptions.api.stopEditing();
                    $scope.data.currItem.kpi_empkpibill_lineofkpi_empkpibill_headers.push({});
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.kpi_empkpibill_lineofkpi_empkpibill_headers);
                };
                /**
                 * 左下删除行明细
                 */
                $scope.del_leftline = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.kpi_empkpibill_lineofkpi_empkpibill_headers.splice(idx, 1);
                        if ($scope.data.currItem.kpi_empkpibill_lineofkpi_empkpibill_headers.length == 0) {
                            $scope.data.currItem.kpi_empkpibill_lineofkpi_empkpibill_headers.push({});
                        }
                        if ($scope.data.currItem.kpi_empkpibill_lineofkpi_empkpibill_headers.length > 0) {
                            $scope.gridOptions.hcApi.setRowData($scope.data.currItem.kpi_empkpibill_lineofkpi_empkpibill_headers);
                            deleteRow_span_count();
                            initRow_span_count();
                        }

                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.kpi_empkpibill_lineofkpi_empkpibill_headers);
                    }
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