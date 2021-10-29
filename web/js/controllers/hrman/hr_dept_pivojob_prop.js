define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'swalApi'],
    function (module, controllerApi, base_obj_prop, requestApi, swalApi) {
        'use strict';

        var controller = [
            '$scope', '$q', '$stateParams', '$modal',
            function ($scope, $q, $stateParams, $modal) {
                $scope.data = {
                    currItem: {},
                    dept: [{}],
                    position: [{}],
                    grade: [{}],
                    //接收参数
                    kpiitem_id: $stateParams.kpiitem_id,
                    kpiitem_type: $stateParams.typid,
                    itemtype_name: $stateParams.itemtype_name
                };

                $scope.tabs = {};
                $scope.tabc = "gridOptions_dept";

                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                $scope.gridOptions_dept = {
                    columnDefs: [{
                        type: "序号",
                    }, {
                        headerName: "部门编码",
                        field: "org_code",
                        width: 200,
                        onCellDoubleClicked: function (args) {
                            $scope.choose_org_name(args);
                        }
                    }, {
                        headerName: "部门名称",
                        field: "org_name",
                        width: 200
                    }],
                    hcReady: $q.deferPromise()
                };
                $scope.gridOptions_position = {
                    columnDefs: [{
                        type: "序号",
                    }, {
                        headerName: "岗位名称",
                        field: "positionid",
                        width: 200,
                        hcRequired: true,
                        onCellDoubleClicked: function (args) {
                            $scope.choose_position_name(args);
                        }
                    }]

                };
                $scope.gridOptions_grade = {
                    columnDefs: [{
                        type: "序号",
                    }, {
                        headerName: "评分标准",
                        field: "gradeitem",
                        width: 200,
                        editable: true,
                        hcRequired: true
                    }, {
                        headerName: "分值",
                        field: "value",
                        width: 200,
                        editable: true,
                        hcRequired: true
                    }]

                };

                $scope.kpi_tab = {
                    dept: {
                        title: '适用部门',
                        active: true
                    },
                    position: {
                        title: '适用岗位'
                    },
                    grade: {
                        title: '评分标准'
                    }
                };
                /**
                 * 新增设置数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    bizData.kpiitem_id = $scope.data.kpiitem_id;
                    bizData.itemtype_name = $scope.data.itemtype_name;
                    bizData.kpiitem_type = $scope.data.typid;
                    $scope.gridOptions_dept.hcReady.then(function () {
                        $scope.gridOptions_dept.hcApi.setRowData($scope.data.dept);
                        $scope.gridOptions_position.hcApi.setRowData($scope.data.position);
                        $scope.gridOptions_grade.hcApi.setRowData($scope.data.grade);
                    });
                };
                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions_dept.hcReady.then(function () {
                        $scope.gridOptions_dept.hcApi.setRowData(bizData.kpi_kpiitems_deptofkpi_kpiitemss);
                        $scope.gridOptions_position.hcApi.setRowData(bizData.kpi_kpiitems_positionofkpi_kpiitemss);
                        $scope.gridOptions_grade.hcApi.setRowData(bizData.kpi_kpiitems_gradenormofkpi_kpiitemss);
                    })
                };

                /*底部左边按钮*/

                $scope.footerLeftButtons.addRow.click = function () {
                    $scope.add_line && $scope.add_line();
                };
                $scope.footerLeftButtons.addRow.hide = function () {
                    return $scope.data.currItem.stat > 1;
                };
                $scope.footerLeftButtons.deleteRow.click = function () {
                    $scope.del_line && $scope.del_line();

                };
                $scope.footerLeftButtons.deleteRow.hide = function () {
                    return $scope.data.currItem.stat > 1;
                };

                $scope.onTabChange_hr = function (params) {
                    if (params.id == "dept") {
                        $scope.tabc = "gridOptions_dept"
                    } else if (params.id == "position") {
                        $scope.tabc = "gridOptions_position"
                    } else {
                        $scope.tabc = "gridOptions_grade"
                    }
                };

                /**
                 * 查部门
                 */
                $scope.choose_org_name = function (args) {
                    $modal.openCommonSearch({
                            classId: 'dept',
                            sqlWhere: 'status = 2'
                        })
                        .result//响应数据
                        .then(function (response) {
                            for (var i = 0; i < $scope.data.dept.length; i++) {
                                var obj = $scope.data.dept[i];
                                if (obj.org_code == response.dept_code) {
                                    return swalApi.info("部门【" + obj.org_code + "】已存在，不能重复添加");
                                }
                            }
                            args.data.org_id = response.dept_id;
                            args.data.org_code = response.dept_code;
                            args.data.org_name = response.dept_name;
                            args.api.refreshView();

                        });
                };

                /**
                 * 查岗位
                 */
                $scope.choose_position_name = function (args) {
                    $modal.openCommonSearch({
                            classId: 'hr_position',
                            sqlWhere: 'usable = 2'
                        })
                        .result//响应数据
                        .then(function (response) {
                            for (var i = 0; i < $scope.data.position.length; i++) {
                                var obj = $scope.data.position[i];
                                if (obj.positionid == response.position_name) {
                                    return swalApi.info("岗位【" + obj.positionid + "】已存在，不能重复添加");
                                }
                            }
                            args.data.positionid = response.position_name;
                            args.api.refreshView();
                        });
                };

                //校验考核指标编码是否重复
                $scope.checkKpiItemNo = function () {
                    requestApi.post({
                            classId: 'kpi_kpiitems',
                            action: 'kpiitemsearch',
                            data: $scope.data.currItem
                        })
                        .then(function (response) {
                            if (response.kpi_kpiitemss.length < 0) {
                                return;
                            }
                            for (var i = 0; i < response.kpi_kpiitemss.length; i++) {
                                var obj = response.kpi_kpiitemss[i];
                                if ($scope.data.currItem.kpiitem_no == obj.kpiitem_no) {
                                    swalApi.info("考核指标编码【" + $scope.data.currItem.kpiitem_no + "】已存在，不能重复添加");
                                    $scope.data.currItem.kpiitem_no = '';
                                }
                                if ($scope.data.currItem.kpiitem_name == obj.kpiitem_name) {
                                    swalApi.info("考核名称【" + $scope.data.currItem.kpiitem_name + "】已存在，不能重复添加");
                                    $scope.data.currItem.kpiitem_name = '';
                                }
                            }
                        })
                };
                //添加明细
                $scope.add_line = function () {
                    $scope[$scope.tabc].api.stopEditing();
                    var data;

                    if ($scope.tabc == "gridOptions_dept") {
                        data = $scope.data.dept;
                    } else if ($scope.tabc == "gridOptions_position") {
                        data = $scope.data.position;
                    } else {
                        data = $scope.data.grade;
                    }
                    data.push({});
                    $scope[$scope.tabc].hcApi.setRowData(data);
                };
                /**
                 * 删除行明细
                 */
                $scope.del_line = function () {
                    var idx = $scope[$scope.tabc].hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {

                        var data;

                        if ($scope.tabc == "gridOptions_dept") {
                            data = $scope.data.dept;
                        } else if ($scope.tabc == "gridOptions_position") {
                            data = $scope.data.position;
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

                //验证表头信息是否填完
                $scope.validHead = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    return invalidBox;
                };
                /**
                 * 保存
                 */
                $scope.save = function () {
                    var msg = $scope.validHead([]);
                    if (msg.length > 0) {
                        return swalApi.info(msg);
                    }
                    requestApi.post({
                        classId: 'kpi_kpiitems',
                        action: 'insert',
                        data: {
                            kpi_kpiitems_deptofkpi_kpiitemss: $scope.data.dept,
                            kpi_kpiitems_positionofkpi_kpiitemss: $scope.data.position,
                            kpi_kpiitems_gradenormofkpi_kpiitemss: $scope.data.grade,
                            kpiitem_type: $scope.data.kpiitem_type,
                            data: $scope.data.currItem
                        }
                    }).then(function (data) {
                        return swalApi.success('保存成功!');
                    }).then($scope.search);
                };

            }

        ]

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
)