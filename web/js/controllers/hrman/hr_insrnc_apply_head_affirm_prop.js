/**
 * zengjinhua
 *  2019/5/5.
 * 社保增减员确认属性页
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'openBizObj', 'swalApi', 'directive/hcImg'],
    function (module, controllerApi, base_obj_prop, requestApi, openBizObj,swalApi) {

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
                        hcDictCode: 'addorsub_type'
                        /*editable: function (args) {
                         return editable();
                         },*/
                        /*onCellValueChanged: function (args) {
                         if (args.newValue === args.oldValue)
                         return;
                         qtyChange(args);
                         args.api.refreshCells();
                         }*/
                    }, {
                        field: 'employee_code',
                        headerName: '员工编码'
                        /*editable: function (args) {
                         return editable();
                         },
                         onCellDoubleClicked: function (args) {
                         $scope.chooseEmployeeCode(args);
                         }*/
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
                        headerName: '适用员工类型'/*,
                         hcDictCode:'for_employee_type',
                         editable: function (args) {
                         return editable();
                         }*/
                    }, {
                        field: 'for_domicile_type',
                        headerName: '适用户籍类型',
                        hcDictCode: 'for_domicile_type'/*,
                         editable: function (args) {
                         return editable();
                         }*/
                    }, {
                        field: 'useemployee_type',
                        headerName: '用工类型',
                        hcDictCode: 'useemployee_type'/*,
                         editable: function (args) {
                         return editable();
                         }*/
                    }, {
                        field: 'insrnc_reason_name',
                        headerName: '社保增减原因'/*,
                         editable: function (args) {
                         return editable();
                         },
                         onCellDoubleClicked: function (args) {
                         $scope.choosehrInsrncReason(args);
                         }*/
                    }, {
                        field: 'insrnc_group_name',
                        headerName: '所属社保组'/*,
                         editable: function (args) {
                         return editable();
                         },
                         onCellDoubleClicked: function (args) {
                         $scope.chooseHrInsrncGroup(args);
                         }*/
                    }, {
                        field: 'mobile_no',
                        headerName: '参保人手机号'/*,
                         editable: function (args) {
                         return editable();
                         }*/
                    }, {
                        field: 'line_remark',
                        headerName: '备注'/*,
                         editable: function (args) {
                         return editable();
                         }*/
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
                $scope.chooseHrInsrncGroup = function (args) {
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
                            args.data.insrnc_group_code = result.insrnc_group_code;
                            args.data.insrnc_group_name = result.insrnc_group_name;
                            args.data.year_month = result.start_month;
                            args.data.hr_insrnc_policy_id = result.policy_id;
                            return args;
                        }).then(getGroup)
                        .then(function () {
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
                    tacitly_approve(bizData);
                };

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


                $scope.footerLeftButtons.addRow.hide = true;
                $scope.footerLeftButtons.deleteRow.hide = true;
                $scope.footerRightButtons.save.hide = true;
                $scope.footerRightButtons.saveThenSubmit.hide = true;
                $scope.footerRightButtons.saveThenAdd.hide = true;
                $scope.footerLeftButtons.confirm = {
                    title: '确认',
                    click: function () {
                        $scope.confirm_save && $scope.confirm_save();
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

                        var data = $scope.data.currItem.hr_insrnc_apply_lineofhr_insrnc_apply_heads;

                        for (var i = 0; i < rowCount; i++) {
                            var newLine = {};
                            data.push(newLine);
                        }
                        $scope.gridOptions.hcApi.setRowData(data);
                    });
                };
                /**
                 * 删除行明细
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        calculate(idx);
                        $scope.data.currItem.hr_insrnc_apply_lineofhr_insrnc_apply_heads.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.hr_insrnc_apply_lineofhr_insrnc_apply_heads);
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
                            });
                            $scope.gridOptions.hcApi.setRowData(data);
                        });
                };

                $scope.confirm_save = function () {
                    var postParme = {
                        classId: "hr_insrnc_apply_head",
                        action: 'confirm',
                        data: {
                            hr_insrnc_apply_lineofhr_insrnc_apply_heads: $scope.data.currItem.hr_insrnc_apply_lineofhr_insrnc_apply_heads,
                            year_month: $scope.data.currItem.year_month
                        }
                    };
                    postParme.data[$scope.data.idField] = $scope.getId();
                    requestApi.post(postParme).then(function (val) {
                        swalApi.info('确认成功');
                    }).then(function () {
                        postParme = {
                            classId: "hr_insrnc_apply_head",
                            action: 'select',
                            data: {}
                        };
                        postParme.data[$scope.data.idField] = $scope.getId();
                        return requestApi.post(postParme)
                    }).then(function (val) {
                        $scope.data.currItem.is_confirm = val.is_confirm;
                    })
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