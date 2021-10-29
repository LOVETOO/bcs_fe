/**
 * zengjinhua
 *  2019/4/25.
 * 员工离职申请
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'openBizObj', 'swalApi', '$q', 'numberApi', 'dateApi', 'directive/hcImg'],
    function (module, controllerApi, base_obj_prop, requestApi, openBizObj, swalApi, $q, numberApi, dateApi) {


        var HrEmployee_abdicateHeadProp = [
            '$scope', '$modal',

            function ($scope, $modal) {
                /*----------------------------------能否编辑-------------------------------------------*/
                function editable() {
                    if ($scope.data.currItem.stat == 1)
                        return true;
                    return false;
                }

                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                /*----------------------------------表格定义-------------------------------------------*/
                //表格定义  "基本详情"
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'handover_type',
                        headerName: '交接类型',
                        hcDictCode: 'handover_type',
                        hcRequired: true,
                        editable: function (args) {
                            return editable();
                        }
                    }, {
                        field: 'handover_content',
                        headerName: '交接内容',
                        hcRequired: true,
                        editable: function (args) {
                            return editable();
                        }
                    }, {
                        field: 'handover_dept_name',
                        headerName: '交接部门',
                        hcRequired: true,
                        editable: function (args) {
                            return editable();
                        },
                        onCellDoubleClicked: function (args) {
                            $scope.chooseDeptName(args);
                        }
                    }, {
                        field: 'handover_employee_name',
                        headerName: '交接人',
                        hcRequired: true,
                        editable: function (args) {
                            return editable();
                        },
                        onCellDoubleClicked: function (args) {
                            $scope.chooseWumen(args);
                        }
                    }, {
                        field: 'handover_date',
                        headerName: '交接日期',
                        hcRequired: true,
                        type: '日期',
                        editable: function (args) {
                            return editable();
                        }
                    }]
                };

                /**
                 * 查部门
                 */
                $scope.chooseDeptName = function (args) {
                    $modal.openCommonSearch({
                            classId: 'dept',
                            postData: {},
                            action: 'search',
                            title: "部门",
                            gridOptions: {
                                columnDefs: [
                                    {
                                        headerName: "部门编码",
                                        field: "dept_code"
                                    }, {
                                        headerName: "部门名称",
                                        field: "dept_name"
                                    }
                                ]
                            }
                        })
                        .result//响应数据
                        .then(function (result) {
                            args.data.handover_dept_id = result.dept_id;
                            args.data.dept_code = result.dept_code;
                            args.data.handover_dept_name = result.dept_name;
                            args.api.refreshView();//刷新网格视图
                        });
                };


                /**
                 * 查交接人
                 */
                $scope.chooseWumen = function (args) {
                    if (!args.data.handover_dept_id > 0) {
                        swalApi.info('请选择部门');
                        return;
                    }
                    $modal.openCommonSearch({
                            classId: 'employee_header',
                            postData: {},
                            action: 'search',
                            title: "交接人",
                            sqlWhere: 'org_id=' + args.data.handover_dept_id,
                            gridOptions: {
                                columnDefs: [
                                    {
                                        headerName: "员工编码",
                                        field: "employee_code"
                                    }, {
                                        headerName: "员工名称",
                                        field: "employee_name"
                                    }
                                ]
                            }
                        })
                        .result//响应数据
                        .then(function (result) {
                            args.data.handover_employee_id = result.employee_id;
                            args.data.handover_employee_code = result.employee_code;
                            args.data.handover_employee_name = result.employee_name;
                            args.api.refreshView();//刷新网格视图
                        });
                };

                /*----------------------------------通用查询-------------------------------------------*/

                // 员工查询
                $scope.commonSearchSettingOfErpemployee = {
                    sqlWhere: " stat <> 3",
                    afterOk: function (result) {
                        $scope.data.currItem.employee_id = result.employee_id;
                        $scope.data.currItem.employee_code = result.employee_code;
                        $scope.data.currItem.employee_name = result.employee_name;
                        $scope.data.currItem.org_name = result.org_name;
                        $scope.data.currItem.position_name = result.position_name;
                        $scope.data.currItem.start_date = result.start_date;
                    }
                };
                // 离职类型
                $scope.commonHrChangeTypeId = {
                    sqlWhere: " usable=2 and for_billtype = 3",
                    afterOk: function (result) {
                        $scope.data.currItem.hr_change_type_id = result.hr_change_type_id;
                        $scope.data.currItem.change_type_name = result.change_type_name;
                    }
                };
                //离职原因   查询
                $scope.commonSearchSettingOfHrAbdicateReson = {
                    sqlWhere: " usable = " + 2,
                    afterOk: function (result) {
                        $scope.data.currItem.reson = result.abdicate_reson;
                    }
                };

                $scope.changeEmp = function (id) {
                    return requestApi.post({
                            classId: 'hr_salary_group',
                            action: 'search',
                            data: {}
                        })
                        .then(function (response) {
                            return response.hr_salary_groups;
                        })
                };

                /*----------------------------------按钮方法数据 定义-------------------------------------------*/
                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    //基本详情
                    bizData.hr_employee_abdicate_lineofhr_employee_abdicate_heads = [];
                    $scope.gridOptions.hcApi.setRowData(bizData.hr_employee_abdicate_lineofhr_employee_abdicate_heads);
                    var formal_li = new Date();
                    var year = formal_li.getFullYear();
                    var month = formal_li.getMonth() + 1;
                    if (month < 10) {
                        month = "0" + month;
                    }
                    var today = formal_li.getDate();
                    if (today < 10) {
                        today = "0" + today;
                    }
                    bizData.salary_stop_date = year + "-" + month + "-" + today;
                    var today = 1 * 24 * 60 * 60 * 1000;
                    var todaydate = formal_li.getTime();
                    var abdTodayDate = todaydate + today;
                    var abdToday = new Date(abdTodayDate);
                    var year = abdToday.getFullYear();
                    var month = abdToday.getMonth() + 1;
                    if (month < 10) {
                        month = "0" + month;
                    }
                    var today = abdToday.getDate();
                    if (today < 10) {
                        today = "0" + today;
                    }
                    bizData.abdicate_date = year + "-" + month + "-" + today;
                    bizData.is_heimingdan = 1;
                    bizData.lock_type = 1;
                    newDouble();
                };


                function newDouble() {
                    var formal_li = new Date();
                    var year = formal_li.getFullYear();
                    var month = formal_li.getMonth() + 1;
                    if (month < 10) {
                        month = "0" + month;
                    }
                    var today = formal_li.getDate();
                    if (today < 10) {
                        today = "0" + today;
                    }
                    var data = $scope.data.currItem.hr_employee_abdicate_lineofhr_employee_abdicate_heads;
                    var newLine = {
                        handover_type: 1,
                        handover_date: year + "-" + month + "-" + today
                    };
                    data.push(newLine);
                    var newLine = {
                        handover_type: 2,
                        handover_date: year + "-" + month + "-" + today
                    };
                    data.push(newLine);
                    $scope.gridOptions.hcApi.setRowData(data);
                }


                //验证表头信息是否填完
                $scope.validHead = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    return invalidBox;
                };

                //验证明细行
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    var arr = [0, 0];
                    $scope.data.currItem.hr_employee_abdicate_lineofhr_employee_abdicate_heads.forEach(function (val) {
                        if (val.handover_type == 1) {
                            arr[0] += 1;
                        }
                        if (val.handover_type == 2) {
                            arr[1] += 1;
                        }
                    });
                    if (arr[0] < 1 && arr[1] < 1) {
                        invalidBox.push("最少要有一条工作交接记录与物品交接记录");
                    } else {
                        if (arr[0] < 1) {
                            invalidBox.push("最少要有一条工作交接记录");
                        }
                        if (arr[1] < 1) {
                            invalidBox.push("最少要有一条物品交接记录");
                        }
                    }
                    return invalidBox;
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    //设置基本经历
                    $scope.gridOptions.hcApi.setRowData(bizData.hr_employee_abdicate_lineofhr_employee_abdicate_heads);
                };
                //锁定类型修改
                $scope.changeLockType = function () {
                    if ($scope.data.currItem.lock_type == 1) {
                        $scope.data.currItem.lock_start_date = undefined;
                        $scope.data.currItem.lock_days = undefined;
                        $scope.data.currItem.lock_end_date = undefined;
                    } else {
                        $scope.data.currItem.lock_start_date = dateApi.today();
                    }
                };
                //锁定类型修改
                $scope.isChangeChose = function () {
                    if ($scope.data.currItem.is_heimingdan == 1) {
                        $scope.data.currItem.lock_type = 1;
                        delete $scope.data.currItem.lock_start_date;
                        delete $scope.data.currItem.lock_days;
                        delete $scope.data.currItem.lock_end_date;
                        delete $scope.data.currItem.heimingdan_reson;
                    }

                }
                /*----------------------------------按钮及标签 定义-------------------------------------------*/

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
                /*----------------------------------按钮方法 定义-------------------------------------------*/
                //添加明细
                $scope.add_line = function () {
                    var msg = $scope.validHead([]);
                    if (msg.length > 0) {
                        return swalApi.info(msg);
                    }
                    $scope.gridOptions.api.stopEditing();
                    swal({
                        title: '请输入要增加的行数',
                        type: 'input', //类型为输入框
                        inputValue: 1, //输入框默认值
                        closeOnConfirm: false, //点击确认不关闭，由后续代码判断是否关闭
                        showCancelButton: true //显示【取消】按钮
                    }, function (inputValue) {
                        if (inputValue === false) {
                            swal.close();
                            return;
                        }

                        var rowCount = Number(inputValue);
                        if (rowCount <= 0) {
                            swal.showInputError('请输入有效的行数');
                            return;
                        }
                        else if (rowCount > 1000) {
                            swal.showInputError('请勿输入过大的行数(1000以内为宜)');
                            return;
                        }

                        swal.close();

                        var data = $scope.data.currItem.hr_employee_abdicate_lineofhr_employee_abdicate_heads;

                        for (var i = 0; i < rowCount; i++) {
                            var newLine = {};
                            data.push(newLine);
                        }
                        $scope.gridOptions.hcApi.setRowData(data);
                    });
                };
                /**
                 * 删除行教育经历
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.hr_employee_abdicate_lineofhr_employee_abdicate_heads.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.hr_employee_abdicate_lineofhr_employee_abdicate_heads);
                    }
                };

                /*----------------------------------计算-------------------------------------------*/
                //计算转正日期
                $scope.setFormalDate = function () {
                    var start_time = new Date($scope.data.currItem.lock_start_date);
                    start_time = start_time.getTime();
                    var try_time = $scope.data.currItem.lock_days * 24 * 60 * 60 * 1000;
                    var formal_time = start_time + try_time;
                    var formal_li = new Date(formal_time);

                    var year = formal_li.getFullYear();
                    var month = formal_li.getMonth() + 1;
                    if (month < 10) {
                        month = "0" + month;
                    }
                    var today = formal_li.getDate();
                    if (today < 10) {
                        today = "0" + today;
                    }
                    $scope.data.currItem.lock_end_date = year + "-" + month + "-" + today;
                };
                //计算试用天数
                $scope.setTryDay = function () {
                    var formal_time = new Date($scope.data.currItem.lock_end_date).getTime();
                    var start_time = new Date($scope.data.currItem.lock_start_date).getTime();
                    var try_time = formal_time - start_time;
                    $scope.data.currItem.lock_days = parseInt(try_time / 1000 / 60 / 60 / 24);
                };

                /*----------------------------------标签定义-------------------------------------------*/

                $scope.tabs.base = {
                    title: '基本信息',
                    active: true
                };
            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: HrEmployee_abdicateHeadProp
        });

    });