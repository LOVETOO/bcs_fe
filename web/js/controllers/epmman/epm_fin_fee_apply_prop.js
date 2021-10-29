/**
 * 工程费用申请-属性页
 * shenguocheng
 * 2019-7-1
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'swalApi', 'loopApi', 'numberApi', 'strApi'],
    function (module, controllerApi, base_obj_prop, requestApi, swalApi, loopApi, numberApi, strApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数
            function ($scope, $modal) {

                /*-------------------数据定义开始------------------------*/
                $scope.data = {
                    is_copy: false
                };

                function editable(args) {
                    return ($scope.data.currItem.stat == 1 && !args.node.rowPinned);
                }

                $scope.gridOptions = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            headerName: '预算类别',
                            children: [
                                {
                                    field: 'bud_type_code',
                                    headerName: '编码',
                                    hcRequired: true,
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    onCellDoubleClicked: function (args) {
                                        if (editable(args)) {
                                            $scope.chooseBudType(args);
                                        }
                                    },
                                    onCellValueChanged: function (args) {
                                        if (args.newValue == args.oldValue) {
                                            return;
                                        } else {
                                            args.data.apply_amt = 0;
                                            args.data.allow_amt = 0;
                                        }
                                    }
                                }, {
                                    field: 'bud_type_name',
                                    headerName: '名称'
                                }
                            ]
                        }, {
                            headerName: '费用项目',
                            children: [
                                {
                                    field: 'fee_code',
                                    headerName: '编码',
                                    hcRequired: true,
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    onCellDoubleClicked: function (args) {
                                        if (editable(args)) {
                                            $scope.chooseFee(args);
                                        }
                                    },
                                    onCellValueChanged: function (args) {
                                        if (args.newValue == args.oldValue) {
                                            return;
                                        } else {
                                            args.data.apply_amt = 0;
                                            args.data.allow_amt = 0;
                                        }
                                    }
                                }, {
                                    field: 'fee_name',
                                    headerName: '名称'
                                }
                            ]
                        }, {
                            field: 'fee_org_name',
                            headerName: '费用承担部门',
                            editable: function (args) {
                                return editable(args)
                            },
                            onCellDoubleClicked: function (args) {
                                if (editable(args)) {
                                    $scope.chooseOrg(args);
                                }
                            },
                            hcRequired: true
                        }, {
                            headerName: '费用',
                            children: [
                                {
                                    field: 'apply_amt',
                                    headerName: '申请金额',
                                    type: '金额',
                                    hcRequired: true,
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        if (args.newValue == 0) {
                                            swalApi.info('申请金额必须大于0');
                                            args.data.apply_amt = '';
                                            args.api.refreshView();
                                            return;
                                        }
                                        $scope.applyAmtChanged(args);
                                    }
                                }, {
                                    field: 'allow_amt',
                                    headerName: '批准金额',
                                    type: '金额'
                                }]
                        }, {
                            headerName: '报销',
                            children: [
                                {
                                    field: 'applied_bx_amt',
                                    headerName: '已申请金额',
                                    type: '金额'
                                }, {
                                    field: 'finish_bx_amt',
                                    headerName: '已批准金额',
                                    type: '金额'
                                }]
                        }, {
                            field: 'subject_desc',
                            headerName: '报销提示',
                            width: 173
                        }, {
                            field: 'note',
                            headerName: '备注',
                            width: 147,
                            editable: function (args) {
                                return editable(args)
                            }
                        }]
                };
                /*-------------------数据定义结束------------------------*/

                /*-------------------通用查询开始------------------------*/
                /**
                 * 查部门
                 */
                $scope.chooseOrg = function (args) {
                    $modal.openCommonSearch({
                        classId: 'dept'
                    })
                        .result//响应数据
                        .then(function (response) {
                            if (args) {
                                args.data.fee_org_id = response.dept_id;
                                args.data.fee_org_code = response.dept_code;
                                args.data.fee_org_name = response.dept_name;

                                args.api.refreshView();
                            } else {
                                $scope.data.currItem.org_id = response.dept_id;
                                $scope.data.currItem.org_code = response.dept_code;
                                $scope.data.currItem.org_name = response.dept_name;
                            }
                        })
                };

                /**
                 * 查用户
                 */
                $scope.chooseUser = function (args) {
                    $modal.openCommonSearch({
                        classId: 'base_view_erpemployee_org'
                    })
                        .result//响应数据
                        .then(function (response) {
                            if (args) {
                                args.data.receiver_name = response.employee_name;
                                args.data.receiver_code = response.employee_code;
                                args.data.receiver_id = response.employee_id;
                            } else {
                                $scope.data.currItem.chap_name = response.employee_name;
                            }
                        })
                };

                /**
                 * 查预算类别
                 */
                $scope.chooseBudType = function (args) {
                    $modal.openCommonSearch({
                        classId: 'fin_bud_type_header',
                        postData: {
                            fin_bud_type_kind: 2
                        },
                        gridOptions: {
                            columnDefs: [
                                {
                                    headerName: "预算类别编码",
                                    field: "bud_type_code"
                                }, {
                                    headerName: "预算类别名称",
                                    field: "bud_type_name"
                                }
                            ]
                        }
                    })
                        .result//响应数据
                        .then(function (response) {
                            //若更改预算类别，则清空费用项目
                            if (response.bud_type_id != args.data.bud_id) {
                                args.data.fee_id = 0;
                                args.data.fee_code = '';
                                args.data.fee_name = '';
                                args.data.subject_desc = '';
                            }
                            args.data.bud_type_code = response.bud_type_code;
                            args.data.bud_type_name = response.bud_type_name;
                            args.data.bud_id = response.bud_type_id;

                            args.data.fee_property = response.fee_property; //1变动费用或者2固定费用
                            args.data.is_control_bud = response.is_control_bud;
                        }).then(function () {
                        args.api.refreshView();

                    });
                };

                /**
                 * 查询费用项目
                 */
                $scope.chooseFee = function (args) {
                    var postdata = {};
                    postdata.flag = 2;
                    if (numberApi.toNumber(args.data.bud_id) > 0) {
                        postdata.bud_type_id = args.data.bud_id;
                    }
                    var data = $scope.gridOptions.hcApi.getRowData();
                    $modal.openCommonSearch({
                        classId: 'fin_bud_type_line_obj',
                        postData: postdata,
                        sqlWhere: 'stat = 2',
                        action: 'search',
                        title: "费用项目",
                        gridOptions: {
                            columnDefs: [{
                                headerName: "费用项目编码",
                                field: "fee_code"
                            }, {
                                headerName: "费用项目名称",
                                field: "fee_name"
                            }, {
                                headerName: "预算类别编码",
                                field: "bud_type_code"
                            }, {
                                headerName: "预算类别名称",
                                field: "bud_type_name"
                            }]
                        }
                    })
                        .result//响应数据
                        .then(function (response) {
                            if ($scope.data.currItem.fin_fee_apply_lines.length <= 1) {
                                args.data.fee_id = response.fee_id;
                                args.data.fee_code = response.fee_code;
                                args.data.fee_name = response.fee_name;

                                args.data.bud_id = response.bud_type_id;
                                args.data.bud_type_code = response.bud_type_code;
                                args.data.bud_type_name = response.bud_type_name;

                                args.data.fee_property = response.fee_property; //1变动费用或者2固定费用
                                args.data.is_control_bud = response.is_control_bud;

                                return requestApi.post('fin_fee_header', 'select', {fee_id: args.data.fee_id})
                                    .then(function (response) {
                                        args.data.subject_desc = response.subject_desc;
                                        args.api.refreshView();
                                    })

                                args.api.refreshView();//刷新网格视图
                                return;
                            } else {
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].bud_type_id == response.bud_type_id) {
                                        if (data[i].fee_code == response.fee_code) {
                                            swalApi.info("费用类别或项目【" + response.fee_code + "】已存在，请重新选择");
                                            args.data.fee_code = '';
                                            args.data.fee_name = '';
                                            args.data.subject_desc = '';

                                            args.data.bud_id = response.bud_type_id;
                                            args.data.bud_type_code = response.bud_type_code;
                                            args.data.bud_type_name = response.bud_type_name;

                                            return requestApi.post('fin_fee_header', 'select', {fee_id: args.data.fee_id})
                                                .then(function (response) {
                                                    args.data.subject_desc = response.subject_desc;
                                                })

                                            args.api.refreshView();//刷新网格视图
                                            return;
                                        }
                                    }
                                }
                                args.data.fee_id = response.fee_id;
                                args.data.fee_code = response.fee_code;
                                args.data.fee_name = response.fee_name;

                                args.data.bud_id = response.bud_type_id;
                                args.data.bud_type_code = response.bud_type_code;
                                args.data.bud_type_name = response.bud_type_name;

                                args.data.fee_property = response.fee_property; //1变动费用或者2固定费用
                                args.data.is_control_bud = response.is_control_bud;
                            }
                            //带出报销提示
                            return requestApi.post('fin_fee_header', 'select', {fee_id: args.data.fee_id})
                                .then(function (response) {
                                    args.data.subject_desc = response.subject_desc;
                                }).then(function () {
                                    args.api.refreshView();
                                })
                        })
                };

                //工程项目 查询
                $scope.commonSearchSettingOfProjectName = {
                    postData: {
                        search_flag: 120
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.project_id = result.project_id;
                        $scope.data.currItem.project_code = result.project_code;
                        $scope.data.currItem.project_name = result.project_name;
                    }
                };
                /*-------------------通用查询结束---------------------*/
                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);

                    bizData.chap_name = userbean.username;//申请人
                    bizData.org_id = userbean.loginuserifnos[0].org_id;
                    bizData.org_code = strApi.isNull(userbean.loginuserifnos[0].org_code)
                        ? userbean.loginuserifnos[0].org_name : userbean.loginuserifnos[0].org_code;
                    bizData.org_name = userbean.loginuserifnos[0].org_name;//申请部门
                    bizData.fin_fee_apply_lines = [{}];
                    bizData.create_time = new Date().Format('yyyy-MM-dd hh:mm:ss');
                    $scope.gridOptions.hcApi.setRowData(bizData.fin_fee_apply_lines);
                };

                /**
                 * 复制
                 */
                $scope.copyBizData = function (bizData) {
                    $scope.hcSuper.copyBizData(bizData);

                    bizData.is_advance = 1;
                    bizData.is_payed = 1;

                    bizData.create_time = new Date().Format('yyyy-MM-dd hh:mm:ss');

                    loopApi.forLoop(bizData.fin_fee_apply_lines.length, function (i) {
                        bizData.fin_fee_apply_lines[i].receiver_id = 0;
                        bizData.fin_fee_apply_lines[i].receiver_code = '';
                        bizData.fin_fee_apply_lines[i].receiver_name = '';
                        bizData.fin_fee_apply_lines[i].finish_bx_amt = 0;
                        bizData.fin_fee_apply_lines[i].applied_bx_amt = 0;
                    });
                    $scope.gridOptions.hcApi.setRowData(bizData.fin_fee_apply_lines);
                    $scope.data.is_copy = true;
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.fin_fee_apply_lines);
                    $scope.calSum();
                    $scope.calTotal();
                };

                /**
                 * 明细行申请金额改变事件
                 */
                $scope.applyAmtChanged = function (args) {
                    if (args.data.apply_amt && args.data.apply_amt > 0) {
                        args.data.allow_amt = args.data.apply_amt;
                    }
                    //计算总额
                    $scope.calSum();
                    $scope.calTotal();
                };

                /**
                 * 计算总额
                 */
                $scope.calTotal = function () {
                    var total_apply = 0;
                    var total_allow = 0;
                    var lines = $scope.data.currItem.fin_fee_apply_lines.slice(0);
                    if (lines.length > 0) {
                        loopApi.forLoop(lines.length, function (i) {
                            total_apply += lines[i].apply_amt ? numberApi.toNumber(lines[i].apply_amt) : 0;
                            total_allow += lines[i].allow_amt ? numberApi.toNumber(lines[i].apply_amt) : 0;
                        });
                        $scope.data.currItem.total_apply_amt = total_apply.toFixed(2);
                        $scope.data.currItem.total_allow_amt = total_allow.toFixed(2);
                    }
                };

                /**
                 * 计算合计行数据
                 */
                $scope.calSum = function () {
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            apply_amt: numberApi.sum($scope.data.currItem.fin_fee_apply_lines, 'apply_amt'),
                            allow_amt: numberApi.sum($scope.data.currItem.fin_fee_apply_lines, 'allow_amt'),
                            applied_bx_amt: numberApi.sum($scope.data.currItem.fin_fee_apply_lines, 'applied_bx_amt'),
                            finish_bx_amt: numberApi.sum($scope.data.currItem.fin_fee_apply_lines, 'finish_bx_amt')
                        }
                    ]);
                };

                /**
                 * 保存前校验
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    loopApi.forLoop($scope.data.currItem.fin_fee_apply_lines.length, function (i) {
                        if ($scope.data.currItem.fin_fee_apply_lines[i].apply_amt <= 0) {
                            invalidBox.push('费用申请金额必须大于0');
                        }
                    })
                };

                /**
                 * 增加行
                 */
                $scope.add_line = function () {
                    $scope.gridOptions.api.stopEditing();
                    $scope.data.currItem.fin_fee_apply_lines.push({});
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.fin_fee_apply_lines);
                    $scope.calSum();
                    $scope.calTotal();
                };

                /**
                 * 删除行
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.fin_fee_apply_lines.splice(idx, 1);
                        if ($scope.data.currItem.fin_fee_apply_lines.length == 0) {
                            $scope.data.currItem.fin_fee_apply_lines.push({});
                        }
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.fin_fee_apply_lines);
                    }
                    $scope.calSum();
                    $scope.calTotal();
                };

                /**
                 * 复制并增加行
                 */
                $scope.copyAndAdd_line = function () {
                    $scope.gridOptions.api.stopEditing();
                    //复制行数据
                    var copyData = $scope.gridOptions.hcApi.getFocusedData();
                    if (!copyData) {
                        return swalApi.info('请选中要复制的行');
                    }
                    var newLine = angular.copy(copyData);

                    //增加行
                    $scope.data.currItem.fin_fee_apply_lines.push(newLine);

                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.fin_fee_apply_lines);
                    $scope.calSum();
                    $scope.calTotal();
                };

                //底部左边按钮
                $scope.footerLeftButtons.add_line = {
                    icon: 'iconfont hc-add',
                    click: function () {
                        $scope.add_line && $scope.add_line();
                    },
                    hide: function () {
                        return !$scope.tabs.base.active;
                    }
                };
                $scope.footerLeftButtons.del_line = {
                    icon: 'iconfont hc-reduce',
                    click: function () {
                        $scope.del_line && $scope.del_line();
                    },
                    hide: function () {
                        return !$scope.tabs.base.active;
                    }
                };
                $scope.footerLeftButtons.copyAndAdd_line = {
                    title: '复制并增加行',
                    click: function () {
                        $scope.copyAndAdd_line && $scope.copyAndAdd_line();
                    },
                    hide: function () {
                        return !$scope.tabs.base.active;
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
