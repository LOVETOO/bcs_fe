/**
 * zengjinhua
 *  2019/4/27.
 * 社保增减员申请属性页
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'openBizObj', 'swalApi', 'directive/hcImg'],
    function (module, controllerApi, base_obj_prop, requestApi, openBizObj, swalApi) {

        var EmployeeApplyHeaderProp = [
            '$scope', '$modal', '$q',

            function ($scope, $modal, $q) {
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
                        field: 'addorsub_type',
                        headerName: '增减类型',
                        hcDictCode: 'addorsub_type',
                        hcRequired: true,
                        editable: true,
                        onCellValueChanged: function (args) {
                            if (args.newValue === args.oldValue) {
                                return;
                            } else {
                                oldQtyChange(args.oldValue);
                            }
                            ;
                            qtyChange(args);
                            args.api.refreshCells();
                        }
                    }, {
                        field: 'employee_code',
                        headerName: '员工编码',
                        hcRequired: true,
                        editable: true,
                        onCellDoubleClicked: function (args) {
                            $scope.chooseEmployeeCode(args);
                        }
                    }, {
                        field: 'insrnc_no',
                        headerName: '个人社保号'
                    }, {
                        field: 'employee_name',
                        headerName: '姓名'
                    }, {
                        field: 'sex',
                        headerName: '性别',
                        hcDictCode: 'sex'
                    }, {
                        field: 'idcard',
                        headerName: '身份证号'
                    }, {
                        field: 'card_addrinfo',
                        headerName: '户籍所在地'
                    }, {
                        field: 'for_employee_type',
                        headerName: '适用员工类型',
                        hcDictCode: 'for_employee_type',
                        editable: true,
                        hcRequired: true,
                        onCellValueChanged: function (args) {
                            $scope.chooseHrInsrncGroup(args);
                        },
                    }, {
                        field: 'for_domicile_type',
                        headerName: '适用户籍类型',
                        hcDictCode: 'for_domicile_type',
                        editable: true,
                        hcRequired: true,
                        onCellValueChanged: function (args) {
                            $scope.chooseHrInsrncGroup(args);
                        },
                    }, {
                        field: 'useemployee_type',
                        headerName: '用工类型',
                        hcDictCode: 'useemployee_type',
                        hcRequired: true,
                        editable: true
                    }, {
                        field: 'insrnc_reason_name',
                        headerName: '社保增减原因',
                        editable: true,
                        hcRequired: true,
                        onCellDoubleClicked: function (args) {
                            $scope.choosehrInsrncReason(args);
                        }
                    }, {
                        field: 'insrnc_group_name',
                        headerName: '所属社保组',
                        editable: true,
                        hcRequired: true,
                        onCellDoubleClicked: function (args) {
                            $scope.onechooseHrInsrncGroup(args);
                        }
                    }, {
                        field: 'mobile_no',
                        headerName: '参保人手机号',
                        editable: true
                    }, {
                        field: 'line_remark',
                        headerName: '备注',
                        editable: true
                    }, {
                        field: 'is_cancel',
                        headerName: '是否作废',
                        type: '是否'
                    }]
                };
                /*----------------------------------查询-------------------------------------------*/
                /**
                 * 查员工
                 */
                $scope.chooseEmployeeCode = function (args) {
                    $modal.openCommonSearch({
                            classId: 'employee_header',
                            postData: {},
                            action: 'search',
                            title: "员工",
                            gridOptions: {
                                columnDefs: [
                                    {
                                        headerName: "员工编码",
                                        field: "employee_code"
                                    }, {
                                        headerName: "员工名称",
                                        field: "employee_name"
                                    }, {
                                        headerName: "身份证",
                                        field: "idcard"
                                    }, {
                                        headerName: "部门",
                                        field: "org_name"
                                    }
                                ]
                            }
                        })
                        .result//响应数据
                        .then(function (result) {
                            args.data.employee_id = result.employee_id;
                            args.data.employee_code = result.employee_code;
                            args.data.employee_name = result.employee_name;
                            args.data.sex = result.sex;
                            args.data.idcard = result.idcard;
                            args.data.insrnc_no = result.idcard;
                            args.data.card_addrinfo = result.card_addrinfo;
                            args.api.refreshView();//刷新网格视图
                        });
                };

                /**
                 * 查增减员原因
                 */
                $scope.choosehrInsrncReason = function (args) {
                    if (!args.data.addorsub_type > 0) {
                        swalApi.info('请选择增减员类型');
                        return;
                    }
                    $modal.openCommonSearch({
                            classId: 'hr_insrnc_reason',
                            postData: {},
                            action: 'search',
                            title: "增减员原因",
                            sqlWhere: 'addorsub_type=' + args.data.addorsub_type,
                            gridOptions: {
                                columnDefs: [
                                    {
                                        headerName: "原因编码",
                                        field: "insrnc_reason_code"
                                    }, {
                                        headerName: "原因描述",
                                        field: "insrnc_reason_name"
                                    }
                                ]
                            }
                        })
                        .result//响应数据
                        .then(function (result) {
                            args.data.hr_insrnc_reason_id = result.hr_insrnc_reason_id;
                            args.data.insrnc_reason_code = result.insrnc_reason_code;
                            args.data.insrnc_reason_name = result.insrnc_reason_name;
                            args.api.refreshView();//刷新网格视图
                        });
                };

                /**
                 * 查社保组
                 */
                $scope.onechooseHrInsrncGroup = function (args) {
                    if (!args.data.for_employee_type > 0) {
                        swalApi.info('请选择适用员工类型');
                        return;
                    }
                    if (!args.data.for_domicile_type > 0) {
                        swalApi.info('请选择适用户籍类型');
                        return;
                    }
                    $modal.openCommonSearch({
                            classId: 'hr_insrnc_group',
                            postData: {
                                search_flag: 2,
                                for_employee_type: args.data.for_employee_type,
                                for_domicile_type: args.data.for_domicile_type
                            },
                            action: 'search',
                            title: "社保组查询",
                            sqlWhere: 'usable = 2 ',
                            gridOptions: {
                                columnDefs: [
                                    {
                                        headerName: "社保编码",
                                        field: "insrnc_group_code"
                                    }, {
                                        headerName: "社保名称",
                                        field: "insrnc_group_name"
                                    }, {
                                        headerName: "生效年月",
                                        field: "year_month"
                                    }
                                ]
                            }
                        })
                        .result//响应数据
                        .then(function (result) {
                            args.data.hr_insrnc_group_id = result.hr_insrnc_group_id;
                            args.data.insrnc_group_code = respresultonse.insrnc_group_code;
                            args.data.insrnc_group_name = result.insrnc_group_name;
                            args.data.year_month = result.start_month;
                            args.data.hr_insrnc_policy_id = result.policy_id;
                            return args;
                        }).then(getGroup)
                        .then(function () {
                            args.api.refreshView();
                        });
                };
                /**
                 * 查社保组
                 */
                $scope.chooseHrInsrncGroup = function (args) {
                    if (!args.data.for_employee_type > 0) {
                        return;
                    }
                    if (!args.data.for_domicile_type > 0) {
                        return;
                    }
                    requestApi.post({
                            classId: 'hr_insrnc_group',
                            action: 'search',
                            data: {
                                search_flag: 2,
                                for_employee_type: args.data.for_employee_type,
                                for_domicile_type: args.data.for_domicile_type,
                                sqlwhere: "usable = 2"
                            }
                        })
                        .then(function (response) {
                            if (response.hr_insrnc_groups.length > 0) {
                                args.data.hr_insrnc_group_id = response.hr_insrnc_groups[0].hr_insrnc_group_id;
                                args.data.insrnc_group_code = response.hr_insrnc_groups[0].insrnc_group_code;
                                args.data.insrnc_group_name = response.hr_insrnc_groups[0].insrnc_group_name;
                                args.data.year_month = response.hr_insrnc_groups[0].start_month;
                                args.data.hr_insrnc_policy_id = response.hr_insrnc_groups[0].policy_id;
                                getGroup(args);
                            } else {
                                args.data.hr_insrnc_group_id = undefined;
                                args.data.insrnc_group_code = undefined;
                                args.data.insrnc_group_name = undefined;
                                args.data.year_month = undefined;
                                args.data.hr_insrnc_policy_id = undefined;
                                $scope.gridOptions.columnDefs.forEach(function (col) {
                                    if (col.col_type) {
                                        args.data[col.field] = 1;
                                    }
                                });
                                args.api.refreshView();
                            }
                        }).then(function (args) {
                        args.api.refreshView();
                    });

                };


                //新增社保列
                var lines = function () {
                    requestApi.post({
                            classId: 'hr_insrnc_type',
                            action: 'search',
                            data: {
                                sqlwhere: "usable = 2"
                            }
                        })
                        .then(function (response) {
                            response.hr_insrnc_types.forEach(function (value) {
                                var val = {
                                    field: value.hr_insrnc_type_id,
                                    headerName: value.insrnc_type_name,
                                    col_type: 1,
                                    type: '是否'
                                };
                                $scope.gridOptions.columnDefs.push(val);
                            });
                            if ($scope.gridOptions.columnApi) {
                                $scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs);
                            }


                        });
                }();

                //判断社保政策
                function getGroup(args) {
                    $scope.gridOptions.columnDefs.forEach(function (col) {
                        if (col.col_type) {
                            args.data[col.field] = 1;

                        }
                    });
                    return requestApi.post({
                        classId: "hr_insrnc_policy",
                        action: 'select',
                        data: {hr_insrnc_policy_id: args.data.hr_insrnc_policy_id}
                    }).then(function (data) {
                        $scope.gridOptions.columnDefs.forEach(function (col) {
                            if (col.col_type) {
                                data.hr_insrnc_policy_lineofhr_insrnc_policys.forEach(function (d) {
                                    if (d.hr_insrnc_type_id == col.field) {
                                        args.data[col.field] = 2;
                                    }
                                })
                            }
                        });
                        args.api.refreshView();
                        return args;
                    });
                }

                /*----------------------------------按钮方法数据 定义-------------------------------------------*/


                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    //基本详情
                    bizData.hr_insrnc_apply_lineofhr_insrnc_apply_heads = [];
                    $scope.gridOptions.hcApi.setRowData(bizData.hr_insrnc_apply_lineofhr_insrnc_apply_heads);
                    bizData.add_num = 0;
                    bizData.sub_num = 0;
                    bizData.total_change = 0;
                    bizData.is_confirm = 1;
                    tacitly_approve(bizData);
                    addOneLine();
                };
                //默认新增一行明细
                function addOneLine() {
                    var data = $scope.data.currItem.hr_insrnc_apply_lineofhr_insrnc_apply_heads;
                    var newLine = {
                        addorsub_type: 1
                    };
                    data.push(newLine);
                    $scope.gridOptions.hcApi.setRowData(data);
                    $scope.data.currItem.add_num += 1;
                    $scope.data.currItem.total_change = $scope.data.currItem.add_num + $scope.data.currItem.sub_num;
                }


                //默认当前年月
                function tacitly_approve(bizData) {
                    var formal_li = new Date();

                    var year = formal_li.getFullYear();
                    var month = formal_li.getMonth() + 1;
                    if (month < 10) {
                        month = "0" + month;
                    }
                    bizData.year_month = year + "-" + month;
                }

                //验证表头信息是否填完
                $scope.validHead = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    return invalidBox;
                };
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    if ($scope.data.currItem.remark != undefined && $scope.data.currItem.remark.length >= 1024) {
                        invalidBox.push("备注不能超过1024字");
                    }
                    return invalidBox;
                };
                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    setChange();
                    var arr = determine();
                    $q.all(arr).then(function () {
                        $scope.gridOptions.hcApi.setRowData(bizData.hr_insrnc_apply_lineofhr_insrnc_apply_heads);
                    });
                };
                //计算共变数
                function setChange() {
                    $scope.data.currItem.total_change = $scope.data.currItem.add_num + $scope.data.currItem.sub_num;
                }

                //判断社保政策
                function determine() {
                    var promises = [];
                    $scope.data.currItem.hr_insrnc_apply_lineofhr_insrnc_apply_heads.forEach(function (val) {
                        promises.push(requestApi.post({
                            classId: "hr_insrnc_policy",
                            action: 'select',
                            data: {hr_insrnc_policy_id: val.hr_insrnc_policy_id}
                        }).then(function (data) {
                            $scope.gridOptions.columnDefs.forEach(function (col) {
                                if (col.col_type) {
                                    data.hr_insrnc_policy_lineofhr_insrnc_policys.forEach(function (d) {
                                        if (d.hr_insrnc_type_id == col.field) {
                                            val[col.field] = 2;
                                        }
                                    })
                                }
                            });
                        }));
                    });
                    return promises;
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
                $scope.footerLeftButtons.get = {
                    title: '增加本月可做增员或减员的员工',
                    click: function () {
                        $scope.add_del_poliy && $scope.add_del_poliy();
                    },
                    hide: function () {
                        return $scope.data.currItem.stat > 1;
                    }
                };
                $scope.footerLeftButtons.show = {
                    title: '查看社保政策信息',
                    click: function () {
                        $scope.show_poliy && $scope.show_poliy();
                    },
                    hide: function () {
                        return $scope.data.currItem.stat > 1;
                    }
                };


                /*----------------------------------按钮方法 定义-------------------------------------------*/
                //添加明细
                $scope.add_line = function () {
                    var data = $scope.data.currItem.hr_insrnc_apply_lineofhr_insrnc_apply_heads;
                    var newLine = {
                        addorsub_type: 1
                    };
                    data.push(newLine);
                    $scope.gridOptions.hcApi.setRowData(data);
                    $scope.data.currItem.add_num += 1;
                    $scope.data.currItem.total_change = $scope.data.currItem.add_num + $scope.data.currItem.sub_num;
                };
                /**
                 * 删除行明细
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                    } else {
                        calculate(idx);
                        $scope.data.currItem.hr_insrnc_apply_lineofhr_insrnc_apply_heads.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.hr_insrnc_apply_lineofhr_insrnc_apply_heads);
                    }
                    if ($scope.data.currItem.hr_insrnc_apply_lineofhr_insrnc_apply_heads.length <= 0) {
                        var data = $scope.data.currItem.hr_insrnc_apply_lineofhr_insrnc_apply_heads;
                        var newLine = {
                            addorsub_type: 1
                        };
                        data.push(newLine);
                        $scope.gridOptions.hcApi.setRowData(data);
                        $scope.data.currItem.add_num += 1;
                        $scope.data.currItem.total_change = $scope.data.currItem.add_num + $scope.data.currItem.sub_num;
                    }
                };

                function calculate(idx) {
                    if ($scope.data.currItem.hr_insrnc_apply_lineofhr_insrnc_apply_heads[idx].addorsub_type == 1) {
                        $scope.data.currItem.add_num -= 1;
                    }
                    if ($scope.data.currItem.hr_insrnc_apply_lineofhr_insrnc_apply_heads[idx].addorsub_type == 2) {
                        $scope.data.currItem.sub_num -= 1;
                    }
                    $scope.data.currItem.total_change = $scope.data.currItem.add_num + $scope.data.currItem.sub_num;
                }

                /**
                 * 增加本月可做增员或减员的员工
                 */
                $scope.add_del_poliy = function () {
                    requestApi.post({
                            classId: 'hr_insrnc_apply_head',
                            action: 'searchallemployee',
                            data: {}
                        })
                        .then(function (response) {
                            var data = $scope.data.currItem.hr_insrnc_apply_lineofhr_insrnc_apply_heads;

                            response.hr_insrnc_apply_lineofhr_insrnc_apply_heads.forEach(function (value) {
                                if (value.addorsub_type == 1) {
                                    $scope.data.currItem.add_num += 1;
                                }
                                if (value.addorsub_type == 2) {
                                    $scope.data.currItem.sub_num += 1;
                                }
                                $scope.data.currItem.total_change = $scope.data.currItem.add_num + $scope.data.currItem.sub_num;
                                var newLine = {
                                    addorsub_type: value.addorsub_type,
                                    employee_code: value.employee_code,
                                    employee_id: value.employee_id,
                                    employee_name: value.employee_name,
                                    idcard: value.idcard,
                                    sex: value.sex
                                };
                                data.push(newLine);
                            })
                            $scope.gridOptions.hcApi.setRowData(data);
                        });
                };


                /**
                 * 查看社保政策
                 */
                $scope.show_poliy = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要查看的行');
                    } else {
                        if (!$scope.data.currItem.hr_insrnc_apply_lineofhr_insrnc_apply_heads[idx].hr_insrnc_policy_id > 0) {
                            swalApi.info('请选社保组');
                            return;
                        }
                        openBizObj({
                            stateName: 'hrman.hr_insrnc_policy_prop',
                            params: {
                                id: $scope.data.currItem.hr_insrnc_apply_lineofhr_insrnc_apply_heads[idx].hr_insrnc_policy_id,
                                readonly: true
                            }
                        });
                    }
                };
                //进行增减员合计
                function oldQtyChange(old) {
                    if (old == 1) {//增员
                        $scope.data.currItem.add_num -= 1;
                    }
                    if (old == 2) {//减员
                        $scope.data.currItem.sub_num -= 1;
                    }
                    $scope.data.currItem.total_change = $scope.data.currItem.add_num + $scope.data.currItem.sub_num;
                }


                //进行增减员合计
                function qtyChange(args) {
                    if (args.data.addorsub_type == 1) {//增员
                        $scope.data.currItem.add_num += 1;
                    }
                    if (args.data.addorsub_type == 2) {//减员
                        $scope.data.currItem.sub_num += 1;
                    }
                    $scope.data.currItem.total_change = $scope.data.currItem.add_num + $scope.data.currItem.sub_num;
                }


            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: EmployeeApplyHeaderProp
        });

    });