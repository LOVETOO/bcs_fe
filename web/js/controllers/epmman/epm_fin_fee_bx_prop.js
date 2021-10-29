/**
 * 工程费用报销-属性页
 * shenguocheng
 * 2019-07-06
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'openBizObj', 'swalApi', 'loopApi', 'numberApi'],
    function (module, controllerApi, base_obj_prop, requestApi, openBizObj, swalApi, loopApi, numberApi) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数
            function ($scope, $modal) {

                // 继承控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                /*-------------------数据定义开始------------------------*/
                $scope.data = {
                    applyLineVisible: false //申请明细信息默认不可见
                };
                //支付信息标签页定义
                $scope.tabs.payList = {
                    title: '支付信息'
                };

                //定义编辑条件
                function editable_hasApply(args) {
                    return ($scope.data.currItem.stat == 1 && !$scope.data.currItem.fee_apply_id && !args.node.rowPinned);
                }

                //合计行和非制单状态下不可编辑
                function editable(args) {
                    return ($scope.data.currItem.stat == 1 && !args.node.rowPinned);
                }

                //报销明细网格
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
                                    hcRequired: function () {
                                        if (!$scope.data.currItem.fee_apply_id) {
                                            return true;
                                        }
                                    },
                                    editable: function (args) {
                                        if ($scope.data.currItem.fee_apply_id > 0) {
                                            return;
                                        }
                                        return editable(args)
                                    },
                                    onCellDoubleClicked: function (args) {
                                        if ($scope.data.currItem.fee_apply_id > 0) {
                                            return;
                                        }
                                        if (editable(args)) {
                                            $scope.chooseBudType(args);
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
                                    hcRequired: function () {
                                        if (!$scope.data.currItem.fee_apply_id) {
                                            return true;
                                        }
                                    },
                                    editable: function (args) {
                                        if ($scope.data.currItem.fee_apply_id > 0) {
                                            return;
                                        }
                                        return editable(args);
                                    },
                                    onCellDoubleClicked: function (args) {
                                        if ($scope.data.currItem.fee_apply_id > 0 || args.node.rowPinned) {
                                            return;
                                        }
                                        $scope.chooseFee(args);
                                    }
                                }, {
                                    field: 'fee_name',
                                    headerName: '名称'
                                }
                            ]
                        }, {
                            field: 'fee_org_name',
                            headerName: '费用承担部门',
                            hcRequired: function () {
                                if (!$scope.data.currItem.fee_apply_id) {
                                    return true;
                                }
                            },
                            editable: function (args) {
                                if ($scope.data.currItem.fee_apply_id > 0) {
                                    return;
                                }
                                return editable_hasApply(args)
                            },
                            onCellDoubleClicked: function (args) {
                                if ($scope.data.currItem.fee_apply_id > 0 || args.node.rowPinned) {
                                    return;
                                }
                                $scope.chooseOrg(args);
                            }
                        }, {
                            headerName: '费用申请单',
                            children: [
                                {
                                    field: 'apply_check_amt',
                                    headerName: '批准金额(元)',
                                    type: '金额'
                                }, {
                                    field: 'can_bx_amt',
                                    headerName: '当前可报销金额(元)',
                                    type: '金额'
                                }
                            ]
                        }, {
                            headerName: '本次报销',
                            children: [
                                {
                                    field: 'apply_bx_amt',
                                    headerName: '申请金额(元)',
                                    type: '金额',
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        var apply_bx_amt = numberApi.toNumber(args.data.apply_bx_amt, 0);//本次报销申请金额
                                        var can_bx_amt = numberApi.toNumber(args.data.can_bx_amt, 0);//当前报销金额

                                        if (args.newValue == args.oldValue) {
                                            return;
                                        } else if ($scope.data.currItem.fee_apply_id > 0) {
                                            if (args.newValue < 0) {
                                                swalApi.info('申请金额不能小于0');
                                                args.data.apply_bx_amt = '';
                                                args.data.allow_bx_amt = '';
                                                return;
                                            } else if (apply_bx_amt > can_bx_amt) {
                                                swalApi.info("输入的申请金额不能大于当前可报销金额" + can_bx_amt);
                                                args.data.apply_bx_amt = '';
                                                args.data.allow_bx_amt = '';
                                                //如果本次申请金额=当前可用金额，已报销完毕自动选择是
                                            } else if (apply_bx_amt == can_bx_amt) {
                                                $scope.data.currItem.is_finish_bx = 2;
                                                //如果本次申请金额<当前可用金额，已报销完毕自动选择否
                                            } else if (apply_bx_amt < can_bx_amt) {
                                                $scope.data.currItem.is_finish_bx = 1;
                                            }
                                        }
                                        //本次报销批准金额 = 本次报销申请金额
                                        args.data.allow_bx_amt = args.data.apply_bx_amt;

                                        $scope.calSum(); //合计
                                        $scope.calTotal(); //计算总额
                                    },
                                    hcRequired: true
                                }, {
                                    field: 'allow_bx_amt',
                                    headerName: '批准金额(元)',
                                    type: '金额'
                                }
                            ]
                        }, {
                            field: 'note',
                            headerName: '备注',
                            editable: function (args) {
                                return editable(args)
                            },
                            width: 114
                        }, {
                            field: 'subject_desc',
                            headerName: '报销提示'
                        }, {
                            field: 'subject_name',
                            headerName: '借方会计科目名称',
                            width: 151
                        }
                    ]
                };

                //支付信息网格
                $scope.payListGridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'balance_type_name',
                            headerName: '结算方式',
                            width: 120
                        }, {
                            field: 'feebx_create_bill_type',
                            headerName: '单据类型',
                            hcDictCode: '*',
                            width: 120
                        }, {
                            field: 'ordinal_no',
                            headerName: '单据号',
                            width: 120
                        }, {
                            field: 'date_fund',
                            headerName: '单据日期',
                            type: '日期',
                            width: 120
                        }, {
                            field: 'pay_amount',
                            headerName: '金额(元)',
                            type: '金额',
                            width: 120
                        }, {
                            field: 'created_by',
                            headerName: '付款人',
                            width: 80
                        }, {
                            field: 'is_credence',
                            headerName: '已生成凭证',
                            type: '是否',
                            cellStyle: {'text-align': 'center'},
                            width: 40
                        }, {
                            field: 'credence_no',
                            headerName: '跨月支付的凭证号',
                            width: 160
                        }
                    ]
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
                            args.api.refreshView();
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
                            args.api.refreshView();
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
                            if (response.bud_type_id != args.data.bud_type_id) {
                                args.data.fee_id = 0;
                                args.data.fee_code = '';
                                args.data.fee_name = '';
                                args.data.warm_prompt = '';
                                args.data.subject_desc = '';
                            }
                            args.data.fee_property = response.fee_property; //1变动费用或者2固定费用
                            args.data.is_control_bud = response.is_control_bud;

                            args.data.bud_type_code = response.bud_type_code;
                            args.data.bud_type_name = response.bud_type_name;
                            args.data.bud_id = response.bud_type_id;
                        }).then(function () {
                        args.api.refreshView();

                    });
                };

                /**
                 * 查询费用项目
                 */
                $scope.chooseFee = function (args) {
                    var data = $scope.gridOptions.hcApi.getRowData();
                    var postdata = {};
                    postdata.flag = 2;
                    if (numberApi.toNumber(args.data.bud_type_id) > 0) {
                        postdata.bud_type_id = args.data.bud_type_id;
                    }
                    $modal.openCommonSearch({
                        classId: 'fin_bud_type_line_obj',
                        postData: postdata,
                        sqlWherer: 'stat = 2 and apply_type=2',//使用中且为实报实销
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
                            if ($scope.data.currItem.fin_fee_bx_lines.length <= 1) {
                                args.data.fee_id = response.fee_id;
                                args.data.fee_code = response.fee_code;
                                args.data.fee_name = response.fee_name;

                                args.data.bud_id = response.bud_type_id;
                                args.data.bud_type_code = response.bud_type_code;
                                args.data.bud_type_name = response.bud_type_name;

                                args.data.fee_property = response.fee_property; //1变动费用或者2固定费用
                                args.data.is_control_bud = response.is_control_bud;

                                //带出报销提示和会计科目信息
                                return requestApi.post('fin_fee_header', 'select', {fee_id: args.data.fee_id})
                                    .then(function (response) {
                                        args.data.subject_id = response.subject_id;
                                        args.data.subject_no = response.subject_no;
                                        args.data.subject_name = response.subject_name;
                                        args.data.warm_prompt = response.subject_desc;
                                        args.data.subject_desc = response.subject_desc;
                                    }).then(function () {
                                        args.api.refreshView();//刷新网格视图
                                        return;
                                    });
                            } else {
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].bud_type_id == response.bud_type_id) {
                                        if (data[i].fee_code == response.fee_code) {
                                            swalApi.info("费用类别或项目【" + response.fee_code + "】已存在，请重新选择");
                                            args.data.fee_id = undefined;
                                            args.data.fee_code = undefined;
                                            args.data.fee_name = undefined;

                                            args.data.bud_id = response.bud_type_id;
                                            args.data.bud_type_code = response.bud_type_code;
                                            args.data.bud_type_name = response.bud_type_name;

                                            return requestApi.post('fin_fee_header', 'select', {fee_id: args.data.fee_id})
                                                .then(function (response) {
                                                    args.data.subject_id = response.subject_id;
                                                    args.data.subject_no = response.subject_no;
                                                    args.data.subject_name = response.subject_name;
                                                    args.data.warm_prompt = response.subject_desc;
                                                    args.data.subject_desc = response.subject_desc;
                                                }).then(function () {
                                                    args.api.refreshView();//刷新网格视图
                                                    return;
                                                });
                                        }
                                    }
                                }
                                args.data.bud_id = response.bud_type_id;
                                args.data.bud_type_code = response.bud_type_code;
                                args.data.bud_type_name = response.bud_type_name;

                                args.data.fee_property = response.fee_property; //1变动费用或者2固定费用
                                args.data.is_control_bud = response.is_control_bud;

                                args.data.fee_id = response.fee_id;
                                args.data.fee_code = response.fee_code;
                                args.data.fee_name = response.fee_name;
                            }
                            return requestApi.post('fin_fee_header', 'select', {fee_id: args.data.fee_id})
                                .then(function (response) {
                                    args.data.subject_id = response.subject_id;
                                    args.data.subject_no = response.subject_no;
                                    args.data.subject_name = response.subject_name;
                                    args.data.warm_prompt = response.subject_desc;
                                    args.data.subject_desc = response.subject_desc;
                                }).then(function () {
                                    args.api.refreshView();
                                })
                        })
                };

                /**
                 * 查结算方式
                 */
                $scope.chooseBalanceType = function () {
                    $modal.openCommonSearch({
                        classId: 'base_balance_type',
                        sqlWhere: ' is_fee = 2'
                    })
                        .result//响应数据
                        .then(function (response) {
                            $scope.data.currItem.balance_type_name = response.balance_type_name;
                            $scope.data.currItem.base_balance_type_id = response.base_balance_type_id;
                            $scope.data.currItem.balance_type_code = response.balance_type_code;
                        });
                };

                /**
                 * 查工程项目
                 */
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

                /**
                 * 通用查询-费用申请单
                 */
                $scope.commonSearchSettingOfFeeApplyNo = {
                    dataRelationName: 'fin_fee_apply_headers',
                    sqlWhere: 'stat = 5',
                    afterOk: function (data) {
                        //先清空原来带出的信息
                        if ($scope.data.currItem.bx_id == 0) {
                            $scope.newBizData($scope.data.currItem = {});
                        }
                        //如果选择的是相同的申请单则保持数据不变
                        if ($scope.data.currItem.fee_apply_id == data.fee_apply_id) {
                            return;
                        }
                        $scope.data.currItem.fee_apply_id = data.fee_apply_id;
                        $scope.data.currItem.fee_apply_no = data.fee_apply_no;

                        $scope.data.currItem.project_id = data.project_id;
                        $scope.data.currItem.project_code = data.project_code;
                        $scope.data.currItem.project_name = data.project_name;
                        $scope.data.currItem.purpose = data.purpose;

                        //明细
                        return requestApi.post('epm_fin_fee_apply_header', 'select',
                            {
                                fee_apply_id: data.fee_apply_id,
                                bx_id: $scope.data.currItem.bx_id
                            })
                            .then(function (response) {
                                $scope.data.currItem.fin_fee_bx_lines = response.fin_fee_apply_lines.slice(0);
                                var bx_lines = $scope.data.currItem.fin_fee_bx_lines;
                                var validLines = [];

                                //已报销完的明细不带出（is_bx = 2)
                                loopApi.forLoop(bx_lines.length, function (i) {
                                    if (bx_lines[i].is_bx == 2) {
                                        delete bx_lines[i];
                                    }
                                    if (typeof (bx_lines[i]) !== 'undefined') {
                                        validLines.push(bx_lines[i]);
                                    }
                                });

                                //设置数据
                                loopApi.forLoop(validLines.length, function (i) {
                                    validLines[i].apply_bx_amt = validLines[i].can_bx_amt;//本次申请报销金额
                                    validLines[i].allow_bx_amt = validLines[i].apply_bx_amt;//本次批准报销金额
                                    validLines[i].apply_check_amt = validLines[i].allow_amt;//费用申请批准金额
                                    $scope.data.currItem.is_finish_bx = 2;//是否报销完毕状态默认为是
                                    //查借方会计科目
                                    if (numberApi.toNumber(validLines[i].fee_id) > 0) {
                                        return requestApi.post('fin_fee_header', 'select', {fee_id: validLines[i].fee_id})
                                            .then(function (response) {
                                                validLines[i].subject_id = response.subject_id;
                                                validLines[i].subject_no = response.subject_no;
                                                validLines[i].subject_name = response.subject_name;
                                                validLines[i].subject_desc = response.subject_desc;

                                                $scope.gridOptions.hcApi.setRowData(validLines);
                                            });
                                    }

                                });
                            })
                            .then(function () {
                                $scope.setApplyLineVisible();

                                $scope.calSum();
                                $scope.calTotal();
                            })
                    }
                };
                /*-------------------通用查询结束---------------------*/
                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);

                    bizData.create_time = new Date().Format('yyyy-MM-dd hh:mm:ss');
                    bizData.chap_name = userbean.username;
                    bizData.org_id = userbean.loginuserifnos[0].org_id;
                    bizData.org_code = userbean.loginuserifnos[0].org_code;
                    bizData.org_name = userbean.loginuserifnos[0].org_name;
                    $scope.data.currItem.fin_fee_bx_lines = [{}];
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.fin_fee_bx_lines);
                };

                /**
                 * 复制
                 */
                $scope.copyBizData = function (bizData) {
                    $scope.hcSuper.copyBizData(bizData);

                    bizData.fee_apply_id = 0;
                    bizData.fee_apply_no = '';
                    bizData.fee_loan_id = 0;
                    bizData.fee_loan_no = '';
                    bizData.is_repay_loan = 1;
                    bizData.credence_no = '';
                    bizData.is_overproof = 1;
                    bizData.overproof_reason = '';
                    bizData.is_credence = 1;
                    bizData.gl_credence_head_id = 0;

                    bizData.create_time = new Date().Format('yyyy-MM-dd hh:mm:ss');

                    loopApi.forLoop(bizData.fin_fee_bx_lines.length, function (i) {
                        bizData.fin_fee_bx_lines[i].can_bx_amt = 0;
                        bizData.fin_fee_bx_lines[i].apply_check_amt = 0;
                    })
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);

                    $scope.gridOptions.hcApi.setRowData(bizData.fin_fee_bx_lines);
                    $scope.payListGridOptions.api.setRowData(bizData.fin_fee_bx_headers);
                    $scope.calSum();
                    $scope.calTotal();
                };

                /**
                 * 计算总额
                 */
                $scope.calTotal = function () {
                    var currItem = $scope.data.currItem;
                    var lines = $scope.data.currItem.fin_fee_bx_lines || [];

                    currItem.total_apply_amt = numberApi.sum(lines, 'apply_bx_amt');
                    currItem.total_allow_amt = numberApi.sum(lines, 'allow_bx_amt');
                };

                /**
                 * 计算合计行数据
                 */
                $scope.calSum = function () {
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            apply_check_amt: numberApi.sum($scope.data.currItem.fin_fee_bx_lines, 'apply_check_amt'),
                            apply_bx_amt: numberApi.sum($scope.data.currItem.fin_fee_bx_lines, 'apply_bx_amt'),
                            allow_bx_amt: numberApi.sum($scope.data.currItem.fin_fee_bx_lines, 'allow_bx_amt'),
                        }
                    ]);
                };

                /**
                 * 保存前校验
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);

                    var lines = $scope.data.currItem.fin_fee_bx_lines;
                    for (var i = 0; i < lines.length; i++) {
                        if (lines[i].can_bx_amt &&
                            (numberApi.toNumber(lines[i].apply_bx_amt, 0) > numberApi.toNumber(lines[i].can_bx_amt, 0))) { //报销申请金额不能大于当前可报销金额
                            lines[i].apply_bx_amt = lines[i].can_bx_amt;
                            invalidBox.push('第【' + i + 1 + '】行费用项目【' + lines[i].fee_name + '】的申请报销金额超出当前可报销金额，请检查');
                        } else if (lines[i].apply_bx_amt < 0) {
                            invalidBox.push('报销申请金额不能小于0');
                        }
                    }
                };

                /**
                 * 设置申请明细信息可见
                 */
                $scope.setApplyLineVisible = function () {
                    if ($scope.data.currItem.fee_apply_id) {
                        $scope.data.applyLineVisible = true;
                    } else {
                        $scope.data.applyLineVisible = false;
                    }
                    $scope.gridOptions.columnApi.setColumnVisible('apply_check_amt', $scope.data.applyLineVisible);
                    $scope.gridOptions.columnApi.setColumnVisible('can_bx_amt', $scope.data.applyLineVisible);

                    return $scope.gridOptions;
                };

                /**
                 * 删除费用申请单后清除数据
                 */
                $scope.afterDeleteApplyNo = function () {
                    $scope.data.currItem.fin_fee_bx_lines = [];
                    $scope.gridOptions.api.setRowData([]);
                    $scope.data.currItem.project_id = 0;
                    $scope.data.currItem.project_code = '';
                    $scope.data.currItem.project_name = '';
                    $scope.data.currItem.is_finish_bx = undefined;
                    $scope.setApplyLineVisible();
                };

                /**
                 * 初始化
                 */
                $scope.doInit = function () {
                    $scope.hcSuper.doInit()
                        .then($scope.setApplyLineVisible)
                };

                /**
                 * 增加行
                 */
                $scope.add_line = function () {
                    $scope.gridOptions.api.stopEditing();
                    var line = {
                        fee_org_id: $scope.data.currItem.org_id,
                        fee_org_code: $scope.data.currItem.org_code,
                        fee_org_name: $scope.data.currItem.org_name
                    };
                    $scope.data.currItem.fin_fee_bx_lines.push(line);

                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.fin_fee_bx_lines);
                };

                /**
                 * 删除行
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.fin_fee_bx_lines.splice(idx, 1);
                        if ($scope.data.currItem.fin_fee_bx_lines.length == 0) {
                            $scope.data.currItem.fin_fee_bx_lines.push({});
                        }
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.fin_fee_bx_lines);
                    }
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
                    $scope.data.currItem.fin_fee_bx_lines.push(newLine);

                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.fin_fee_bx_lines);
                };

                //底部左边按钮
                $scope.footerLeftButtons.add_line = {
                    icon: 'iconfont hc-add',
                    click: function () {
                        $scope.add_line && $scope.add_line();
                    },
                    hide: function () {
                        return !$scope.tabs.base.active || $scope.data.currItem.fee_apply_id > 0;
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
                        return !$scope.tabs.base.active || $scope.data.currItem.fee_apply_id > 0;
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
