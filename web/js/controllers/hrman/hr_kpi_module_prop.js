/**
 *  author: Li Meng
 *  time: 2019/6/12
 *  module:绩效测评模板
 **/
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'openBizObj', 'dateApi', 'numberApi'],
    function (module, controllerApi, base_obj_prop, swalApi, openBizObj, dateApi, numberApi) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数
            function ($scope, $modal) {
                $scope.data = {};
                $scope.data.currItem = {};

                /*----------------------------------通用查询-------------------------------------------*/
                $scope.commonSearchSettingOfDept = {
                    //部门
                    afterOk: function (response) {
                        if ($scope.data.currItem.org_name != response.dept_name) {
                            $scope.data.currItem.positionid = null;
                            $scope.data.currItem.kpi_kpimoduel_kpiitemsofkpi_kpimoduels = [{}];
                            $scope.gridOptions.hcApi.setRowData($scope.data.currItem.kpi_kpimoduel_kpiitemsofkpi_kpimoduels);
                        }
                        $scope.data.currItem.org_id = response.dept_id;
                        $scope.data.currItem.org_code = response.dept_code;
                        $scope.data.currItem.org_name = response.dept_name;
                    },
                    sqlWhere: "status=2",
                };

                //岗位
                $scope.commonSearchSettingOfPosition = {
                    afterOk: function (response) {
                        if ($scope.data.currItem.positionid != response.positionid) {
                            $scope.data.currItem.kpi_kpimoduel_kpiitemsofkpi_kpimoduels = [{}];
                            $scope.gridOptions.hcApi.setRowData($scope.data.currItem.kpi_kpimoduel_kpiitemsofkpi_kpimoduels);
                        }
                        $scope.data.currItem.positionid = response.positionid;
                    },
                    beforeOpen: function () {
                        if ($scope.data.currItem.org_name == null || $scope.data.currItem.org_name == "") {
                            swalApi.info('请先选择适用部门 ');
                            return false;
                        }
                        // $scope.commonSearchSettingOfPosition.sqlBlock={'org_id':$scope.data.currItem.org_id,"isvi":7}
                    },
                    postData: function () {
                        return {
                            org_id: $scope.data.currItem.org_id,
                            flag: 1
                        }
                    }
                };
                /*----------------------------------通用查询结束-------------------------------------------*/


                /*----------------------------------合并单元格-------------------------------------------*/
                function rowSpanFunc(params) {
                    var row_span_count = (params.data.row_span_count && HczyCommon.isNotNull(params.data.merge_no)) ? parseInt(params.data.row_span_count) : 1;
                    return row_span_count;
                }

                /*----------------------------------合并结束-------------------------------------------*/
                /**
                 * 列表定义
                 *
                 **/
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'itemtype_name',
                            headerName: '指标类别',
                            hcRequired: true,
                            editable: false,
                            rowSpan: rowSpanFunc,
                            onCellDoubleClicked: function (args) {
                                if ($scope.data.currItem.org_name == null || $scope.data.currItem.org_name == "") {
                                    swalApi.info('请先选择部门');
                                    return false;
                                }
                                else if ($scope.data.currItem.positionid == null || $scope.data.currItem.positionid == "") {
                                    swalApi.info('请先选择岗位');
                                    return false;
                                }
                                $scope.chooseKpi(args);
                            },
                            width: 150
                        }, {
                            field: 'kpiitem_type_scale',
                            headerName: '指标类别权重',
                            editable: true,
                            type: '数量',
                            rowSpan: rowSpanFunc,
                            onCellValueChanged: function (args) {
                                if (!numberApi.isStrOfNum(args.data.kpiitem_type_scale)) {
                                    swalApi.info('输入的不是一个数');
                                    args.data.kpiitem_type_scale = 0;
                                    args.api.refreshView();
                                }
                                checkType_scaleInput(args);

                            },
                            hcRequired: true,
                            width: 150
                        }, {
                            field: 'kpiitem_no',
                            headerName: '考核指标编码',
                            editable: true,
                            onCellDoubleClicked: function (args) {
                                $scope.chooseKpi_code(args);
                            },
                            hcRequired: true,
                            width: 150
                        }, {
                            field: 'kpiitem_name',
                            headerName: '考核指标名称',
                            hcRequired: true,
                            width: 150
                        }, {
                            field: 'kpiitem_scale',
                            headerName: '考核指标权重',
                            hcRequired: true,
                            type: '数量',
                            onCellValueChanged: function (args) {
                                if (!numberApi.isStrOfNum(args.data.kpiitem_scale)) {
                                    swalApi.info('输入的不是一个数');
                                    args.data.kpiitem_scale = 0;
                                    args.api.refreshView();
                                }
                            },
                            editable: true,
                            width: 150
                        }, {
                            field: 'notes',
                            editable: true,
                            headerName: '备注',
                            width: 300
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
                /**
                 * 底部按钮定义
                 **/
                $scope.footerRightButtons.saveThenAdd.hide = true;

                $scope.footerLeftButtons.addRow.hide = false;

                $scope.footerLeftButtons.deleteRow.hide = false;

                $scope.footerLeftButtons.addRow.click = function () {
                    $scope.add_line && $scope.add_line();
                };

                $scope.footerLeftButtons.deleteRow.click = function () {
                    $scope.del_line && $scope.del_line();
                };
                /**
                 *  新增设置数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    $scope.data.currItem.kpi_kpimoduel_kpiitemsofkpi_kpimoduels = [{}];
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.kpi_kpimoduel_kpiitemsofkpi_kpimoduels);
                    $scope.data.currItem.scppositions = [];
                    initRow_span_count();
                    bizData.creator = strUserName;
                    bizData.create_time = dateApi.now();
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
                /*----------------------------------保存数据-------------------------------------------*/
                $scope.saveBizData = function (bizData) {
                    $scope.hcSuper.saveBizData(bizData);
                };
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.kpi_kpimoduel_kpiitemsofkpi_kpimoduels);
                    initRow_span_count();
                };
                /*----------------------------------保存数据结束-------------------------------------------*/
                /*----------------------------------复制-------------------------------------------*/
                $scope.copyBizData = function (bizData) {
                    bizData.create_time = dateApi.now();
                    bizData.note = '';
                    bizData.update_time = '';
                    bizData.kpimoudel_name = '';
                    bizData.kpimoudel_no = '';
                    bizData.kpi_kpimoduel_kpiitemsofkpi_kpimoduels[0].notes = '';
                    bizData.creator = strUserName;

                };
                /*----------------------------------复制-------------------------------------------*/

                /**
                 * 添加行明细
                 */
                $scope.add_line = function () {
                    $scope.gridOptions.api.stopEditing();
                    $scope.data.currItem.kpi_kpimoduel_kpiitemsofkpi_kpimoduels.push({});
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.kpi_kpimoduel_kpiitemsofkpi_kpimoduels);
                };
                /**
                 * 删除行明细
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.kpi_kpimoduel_kpiitemsofkpi_kpimoduels.splice(idx, 1);
                        if ($scope.data.currItem.kpi_kpimoduel_kpiitemsofkpi_kpimoduels.length == 0) {
                            $scope.data.currItem.kpi_kpimoduel_kpiitemsofkpi_kpimoduels.push({});
                            $scope.gridOptions.hcApi.setRowData($scope.data.currItem.kpi_kpimoduel_kpiitemsofkpi_kpimoduels);
                        }
                        if ($scope.data.currItem.kpi_kpimoduel_kpiitemsofkpi_kpimoduels.length > 0) {
                            $scope.gridOptions.hcApi.setRowData($scope.data.currItem.kpi_kpimoduel_kpiitemsofkpi_kpimoduels);
                            deleteRow_span_count();
                            initRow_span_count();
                        }
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.kpi_kpimoduel_kpiitemsofkpi_kpimoduels);
                    }
                };
                /**
                 * 查找指标类别
                 */
                $scope.chooseKpi = function (args) {
                    $modal.openCommonSearch({
                        classId: 'kpi_kpimoduel',
                        postData: {
                            flag: 2,
                            positionid: $scope.data.currItem.positionid,
                            org_id: $scope.data.currItem.org_id
                        },
                        action: 'search',
                        dataRelationName: 'kpi_kpiitemsofkpi_kpimoduels',
                        title: "考核类别选择",
                        gridOptions: {
                            columnDefs: [
                                {
                                    headerName: "指标类别",
                                    field: "kpiitem_type"
                                }, {
                                    headerName: "指标类别名称",
                                    field: "itemtype_name"
                                }
                            ]
                        }
                    })
                        .result//响应数据
                        .then(function (result) {
                            args.data.kpiitem_type = result.kpiitem_type;
                            args.data.itemtype_name = result.itemtype_name;
                            args.data.sortTime = Date.now();
                            $scope.data.currItem.kpi_kpimoduel_kpiitemsofkpi_kpimoduels.sort(function (a, b) {
                                return a.sortTime - b.sortTime;
                            })
                            $scope.data.currItem.kpi_kpimoduel_kpiitemsofkpi_kpimoduels.sort(function (a, b) {
                                return a.kpiitem_type - b.kpiitem_type;
                            })
                            $scope.addRow_span_count(args);
                            $scope.gridOptions.hcApi.setRowData($scope.data.currItem.kpi_kpimoduel_kpiitemsofkpi_kpimoduels);
                            args.api.refreshView();
                        });
                };
                /**
                 *
                 *  考核指标类别
                 */
                $scope.chooseKpi_code = function (args) {
                    $modal.openCommonSearch({
                        classId: 'kpi_kpimoduel',
                        postData: {
                            typid: args.data.kpiitem_type, flag: 3
                        },
                        action: 'search',
                        dataRelationName: 'kpi_kpiitemsofkpi_kpimoduels',
                        title: "考核指标选择",
                        gridOptions: {
                            columnDefs: [
                                {
                                    headerName: "类别名称",
                                    field: "itemtype_name"

                                }, {
                                    headerName: "指标编码",
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
                            args.data.kpiitem_no = result.kpiitem_no;
                            args.data.kpiitem_name = result.kpiitem_name;
                            args.data.itemtype_name = result.itemtype_name;
                            args.api.refreshView();
                        });
                };
                /***
                 *
                 *   添加行 合并
                 */
                $scope.addRow_span_count = function (params) {
                    var flag = true;
                    $scope.data.currItem.kpi_kpimoduel_kpiitemsofkpi_kpimoduels.forEach(
                        function (val) {
                            if (val.itemtype_name == params.data.itemtype_name) {
                                if (val.merge_no == 'getTo') {
                                    val.row_span_count++;
                                    params.data.kpiitem_type_scale = val.kpiitem_type_scale;
                                    flag = false;
                                    return false;
                                } else if (flag && (val.merge_no == null || val.merge_no == '')) {
                                    params.data.row_span_count = 1;
                                    params.data.merge_no = 'getTo';
                                }
                            }
                        })
                };
                /****
                 *
                 *    合并验证
                 *
                 */
                $scope.invalidKts = function () {
                    //上一个val
                    var preVal = null;
                    var sum = [];
                    var str = '';
                    $scope.data.currItem.kpi_kpimoduel_kpiitemsofkpi_kpimoduels.forEach(
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
                /****
                 *
                 *    非合并验证
                 *
                 */
                $scope.invalidKt = function () {
                    var preVal = null;
                    var erroMessage = [];
                    var sum = [];
                    var str = '';
                    $scope.data.currItem.kpi_kpimoduel_kpiitemsofkpi_kpimoduels.forEach(
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
                                        if (erroMessage.length == 0 && index == $scope.data.currItem.kpi_kpimoduel_kpiitemsofkpi_kpimoduels.length - 1) {
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

                /***
                 *    删除行时合并
                 *
                 */
                function deleteRow_span_count() {
                    var preVal = '';
                    $scope.data.currItem.kpi_kpimoduel_kpiitemsofkpi_kpimoduels.sort(function (a, b) {
                        return a.sortTime > b.sortTime;
                    })
                    $scope.data.currItem.kpi_kpimoduel_kpiitemsofkpi_kpimoduels.sort(function (a, b) {
                        return a.kpiitem_type - b.kpiitem_type;
                    })
                    $scope.data.currItem.kpi_kpimoduel_kpiitemsofkpi_kpimoduels.forEach(
                        function (val) {
                            if (val.merge_no != null || val.merge_no != undefined) {
                                val.merge_no = null;
                                val.row_span_count = null;
                            }
                        })
                };

                /***
                 *
                 *    初始化数据
                 */
                function initRow_span_count() {
                    var preVal = '';
                    $scope.data.currItem.kpi_kpimoduel_kpiitemsofkpi_kpimoduels.sort(function (a, b) {
                        return a.kpiitem_type - b.kpiitem_type;
                    })
                    $scope.data.currItem.kpi_kpimoduel_kpiitemsofkpi_kpimoduels.forEach(
                        function (val) {
                            if (JSON.stringify(val) == '{}') {
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
                    $scope.data.currItem.kpi_kpimoduel_kpiitemsofkpi_kpimoduels.sort(function (a, b) {
                        return a.sortTime > b.sortTime;
                    })
                    $scope.data.currItem.kpi_kpimoduel_kpiitemsofkpi_kpimoduels.sort(function (a, b) {
                        return a.kpiitem_type - b.kpiitem_type;
                    })
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.kpi_kpimoduel_kpiitemsofkpi_kpimoduels);
                };

                /*
                 计算
                 */
                function sumArray(params) {
                    return eval(params.join("+"));
                };

                /***
                 *
                 *    检测指标类别权重 值变化
                 */
                function checkType_scaleInput(args) {
                    if (args.newValue === args.oldValue)
                        return;
                    if (numberApi.isNum(args.newValue) || numberApi.isStrOfNum(args.newValue)) {
                        $scope.data.currItem.kpi_kpimoduel_kpiitemsofkpi_kpimoduels.forEach(
                            function (val) {
                                if (val.itemtype_name === args.data.itemtype_name) {
                                    val.kpiitem_type_scale = args.newValue;
                                } else {
                                    return;
                                }
                            })
                        args.api.refreshView();
                    }
                    else {
                        return swalApi.info("请输入有效数字");
                    }
                };

                /***
                 *
                 *    检测部门和岗位值变化
                 */
                function checkInputChange(args) {

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