/**
 * 绩效考核方案
 * 2019/5/30
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi', 'numberApi', 'dateApi'],
    function (module, controllerApi, base_obj_prop, swalApi, requestApi, numberApi, dateApi) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope', '$modal', '$q',
            //控制器函数
            function ($scope, $modal, $q) {
                //定义数据
                $scope.data = {
                    currItem: {}
                };
                //数据是否可编辑
                function editable() {
                    return $scope.data.currItem.stat == 1;
                }

                /**
                 * 列表定义
                 **/
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'org_name',
                            hcRequired: true,
                            headerName: '部门名称',
                            editable: editable,
                            width: 180,
                            onCellDoubleClicked: function (args) {
                                if ($scope.data.currItem.stat == 1) {
                                    $scope.chooseHrOrgName(args);
                                }
                            }
                        }, {
                            field: 'userid',
                            hcRequired: true,
                            headerName: '员工姓名',
                            editable: editable,
                            width: 180,
                            onCellDoubleClicked: function (args) {
                                if ($scope.data.currItem.stat == 1) {
                                    $scope.chooseHrUserName(args);
                                }
                            }
                        }, {
                            field: 'empkpibill_no',
                            headerName: '员工工号',
                            width: 180
                        }, {
                            field: 'positionid',
                            headerName: '员工岗位',
                            width: 180
                        }, {
                            field: 'prouserid',
                            headerName: '签核人',
                            width: 200
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
                 * 查用户
                 */
                $scope.chooseHrUserName = function (args) {
                    if ($scope.data.currItem.kpicase_type != 1) {
                        return;
                    }
                    if (args.data.org_name == null || args.data.org_name == undefined || args.data.org_name == "") {
                        swalApi.info('请先选择部门！');
                        return;
                    }
                    $modal.openCommonSearch({
                            classId: 'scporg',
                            postData: {orgid: args.data.org_id},
                            action: 'select',
                            title: "用户查询",
                            checkbox: true,
                            dataRelationName: 'useroforgs',
                            gridOptions: {
                                columnDefs: [
                                    {
                                        headerName: "用户编码",
                                        field: "userid"
                                    }, {
                                        headerName: "用户名称",
                                        field: "username"
                                    }
                                ]
                            }
                        })
                        .result//响应数据
                        .then(function (result) {
                            args.data.userid = result.username;
                            var postArr = [];
                            var index = 0;
                            result.forEach(function (val) {
                                if (index == 0) {
                                    args.data.userid = val.username;
                                    postArr.push(requestApi.post({
                                        classId: "kpi_kpicase_header",
                                        action: 'searchuserorg',
                                        data: {
                                            userid: val.username
                                        }
                                    }).then(function (data) {
                                        args.data.positionid = data.userorgs[0].positionid;
                                    }));
                                } else {
                                    postArr.push(requestApi.post({
                                        classId: "kpi_kpicase_header",
                                        action: 'searchuserorg',
                                        data: {
                                            userid: val.username
                                        }
                                    }).then(function (data) {
                                        args.data.positionid = data.userorgs[0].positionid;
                                        $scope.gridOptions.api.stopEditing();
                                        $scope.data.currItem.kpi_kpicase_lineofkpi_kpicase_headers.push({
                                            org_name: args.data.org_name,
                                            userid: val.username,
                                            positionid: data.userorgs[0].positionid,
                                            prouserid: args.data.prouserid
                                        });
                                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.kpi_kpicase_lineofkpi_kpicase_headers);
                                    }));
                                }
                                index++;
                            });
                            $q.all(postArr).then(function () {
                                args.api.refreshView();
                            });
                        });
                };

                /**
                 * 查部门名称
                 */
                $scope.chooseHrOrgName = function (args) {
                    if ($scope.data.currItem.kpicase_type != 1 && $scope.data.currItem.kpicase_type != 2) {
                        swalApi.info('请先选择考方案类别！');
                        return;
                    }
                    $modal.openCommonSearch({
                            classId: 'scporg',
                            postData: {},
                            action: 'search',
                            sqlWhere: 'isfeecenter = 2 ',
                            title: "部门查询",
                            dataRelationName: 'orgs',
                            gridOptions: {
                                columnDefs: [
                                    {
                                        headerName: "部门编码",
                                        field: "code"
                                    }, {
                                        headerName: "部门名称",
                                        field: "orgname"
                                    }
                                ]
                            }
                        })
                        .result//响应数据
                        .then(function (result) {
                            args.data.org_id = result.orgid;
                            args.data.org_code = result.code;
                            args.data.org_name = result.orgname;
                            if ($scope.data.currItem.kpicase_type == 2) {
                                args.data.userid = result.manager;
                                requestApi.post({
                                    classId: "kpi_kpicase_header",
                                    action: 'searchuserorg',
                                    data: {
                                        userid: result.manager
                                    }
                                }).then(function (data) {
                                    args.data.positionid = data.userorgs[0].positionid;
                                    return result.orgid;
                                }).then(function (id) {
                                    requestApi.post({
                                        classId: "kpi_kpicase_header",
                                        action: 'searchuserorg',
                                        data: {
                                            orgid: id
                                        }
                                    })
                                }).then(function (val) {
                                    if (val == undefined) {
                                        return args;
                                    }
                                    args.data.prouserid = val.userorgs[0].prouserid;
                                }).then(function (args) {
                                    args.api.refreshView();
                                });
                            } else {
                                args.data.userid = undefined;
                                args.data.positionid = undefined;
                                args.data.prouserid = result.manager;
                                return args;
                            }

                        }).then(function (args) {
                    });
                };

                /**
                 * 底部按钮定义
                 **/
                $scope.footerRightButtons.saveThenAdd.hide = true;

                $scope.footerRightButtons.confirm = {
                    groupId: 'base',
                    title: '确认',
                    click: function () {
                        $scope.confirm_save && $scope.confirm_save();
                    }
                };

                $scope.footerLeftButtons.addRow.hide = function () {
                    return $scope.data.currItem.stat == 5;
                };
                $scope.footerLeftButtons.deleteRow.hide = function () {
                    return $scope.data.currItem.stat == 5;
                };
                $scope.footerLeftButtons.addRow.click = function () {
                    $scope.add_line && $scope.add_line();
                };
                $scope.footerLeftButtons.deleteRow.click = function () {
                    $scope.del_line && $scope.del_line();
                };

                $scope.confirm_save = function () {
                    requestApi.post({
                        classId: "kpi_kpicase_header",
                        action: 'check',
                        data: {kpicase_id: $scope.data.currItem.kpicase_id}
                    }).then(function () {
                        swalApi.success('确认成功');
                    });
                };

                $scope.assess_time = [];

                /**
                 * 新增设置数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    bizData.kpi_kpicase_lineofkpi_kpicase_headers = [];
                    $scope.gridOptions.hcApi.setRowData(bizData.kpi_kpicase_lineofkpi_kpicase_headers);
                    $scope.add_line();

                };

                //保存验证
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    if (numberApi.sum($scope.data.currItem.masterscale, $scope.data.currItem.selfscale) != 100) {
                        invalidBox.push("主评人权重和自评人权重等于100");
                    }
                    return invalidBox;
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.setChangeKpiPeriod(bizData);
                    $scope.hcSuper.setBizData(bizData);
                    //设置教育经历
                    $scope.gridOptions.hcApi.setRowData(bizData.kpi_kpicase_lineofkpi_kpicase_headers);
                    $scope.changeType();
                    $scope.data.currItem.seasonmth = bizData.seasonmth;
                };

                /**
                 * 设置数据之前先改变考核期间取值范围
                 */
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


                /**
                 * 改变考核周期类型，自动改变考核期间取值范围
                 */
                $scope.changeKpiPeriod = function () {
                    $scope.data.currItem.seasonmth = undefined;
                    if ($scope.data.currItem.kpi_period == 0 || $scope.data.currItem.kpi_period == undefined || $scope.data.currItem.kpi_period == null) {
                        return;
                    }
                    if ($scope.data.currItem.kpi_period == 2) {//半年度
                        $scope.assess_time.length = 0;
                        $scope.assess_time.push({
                            name: '上半年',
                            value: '1'
                        }, {
                            name: '下半年',
                            value: '2'
                        })
                    }
                    if ($scope.data.currItem.kpi_period == 3) {//季度
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
                /**
                 * 校验是否选择考核周期类型
                 */
                $scope.clickKpi = function () {
                    if ($scope.data.currItem.kpi_period == 0 || $scope.data.currItem.kpi_period == undefined || $scope.data.currItem.kpi_period == null) {
                        swalApi.info('请先选择考核周期类型！');
                    }
                };
                /**
                 * 赋值考核方式
                 */
                $scope.changeType = function () {
                    if ($scope.data.currItem.kpicase_type == 1) {
                        $scope.data.currItem.kpi_deptkpimode = 'KPI考核';
                    }
                    if ($scope.data.currItem.kpicase_type == 2) {
                        $scope.data.currItem.kpi_deptkpimode = '部门考核方案';
                    }
                };
                /**
                 * 添加行明细
                 */
                $scope.add_line = function () {

                    $scope.gridOptions.api.stopEditing();
                    $scope.data.currItem.kpi_kpicase_lineofkpi_kpicase_headers.push({});
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.kpi_kpicase_lineofkpi_kpicase_headers);

                };
                /**
                 * 删除行明细
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.kpi_kpicase_lineofkpi_kpicase_headers.splice(idx, 1);
                        if ($scope.data.currItem.kpi_kpicase_lineofkpi_kpicase_headers.length == 0) {
                            $scope.data.currItem.kpi_kpicase_lineofkpi_kpicase_headers.push({});
                        }
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.kpi_kpicase_lineofkpi_kpicase_headers);
                    }
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