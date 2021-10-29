/**
 * 费用报销-属性页
 * 2018-11-22
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

                /*-------------------数据定义开始------------------------*/
                $scope.data = {
                    loanVisible: false,//借款信息默认不可见
                    applyLineVisible: false //申请明细信息默认不可见
                };


                function editable_hasApply(args) {
                    if ($scope.data.currItem.stat == 1 && !$scope.data.currItem.fee_apply_id && !args.node.rowPinned) {
                        return true;
                    }
                    return false;
                }

                function editable(args) {
                    if ($scope.data.currItem.stat == 1 && !args.node.rowPinned) {
                        return true;
                    }
                    return false;
                }

                //报销明细网格
                $scope.gridOptions = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [
                        {
                            type: '序号'
                        }
                        , {
                            headerName: '预算类别',
                            children: [
                                {
                                    field: 'bud_type_code',
                                    headerName: '编码',
                                    pinned: 'left',
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
                                    },
                                    onCellValueChanged: function (args) {
                                        if (!args.newValue || args.newValue === args.oldValue) {
                                            return;
                                        }
                                        requestApi.post('fin_bud_type_header', 'search', {})
                                            .then(function (res) {
                                                if (res.fin_bud_type_headers.length) {
                                                    var data = res.fin_bud_type_headers[0];

                                                    args.data.bud_type_id = data.bud_type_id;
                                                    args.data.bud_type_name = data.bud_type_name;
                                                    args.data.period_type = data.period_type;
                                                    args.data.fee_property = data.fee_property; //1变动费用或者2固定费用
                                                    args.data.is_control_bud = data.is_control_bud;
                                                } else {
                                                    swalApi.info('费用类别编码【' + args.data.bud_type_code + '】不存在');
                                                    args.data.bud_type_id = 0;
                                                    args.data.bud_type_code = '';
                                                    args.data.bud_type_name = '';
                                                }
                                                $scope.getAndSetCanuseAmt();
                                            })
                                            .then(function () {
                                                args.api.refreshView();
                                            })
                                    }
                                }
                                , {
                                    field: 'bud_type_name',
                                    headerName: '名称',
                                    pinned: 'left'
                                }
                            ]
                        }
                        , {
                            headerName: '费用项目',
                            children: [
                                {
                                    field: 'fee_code',
                                    headerName: '编码',
                                    pinned: 'left',
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
                                    },
                                    onCellValueChanged: function (args) {
                                        if (!args.newValue || args.newValue === args.oldValue) {
                                            return;
                                        }
                                        var postdata = {
                                            flag: 2,
                                            sqlwhere: " fee_code='" + args.data.fee_code + "'"
                                        };
                                        if (numberApi.toNumber(args.data.bud_type_id) > 0) {
                                            postdata.bud_type_id = args.data.bud_type_id
                                        }

                                        requestApi.post('fin_bud_type_line_obj', 'search', postdata)
                                            .then(function (res) {
                                                if (res.fin_bud_type_line_objs.length) {
                                                    var data = res.fin_bud_type_line_objs[0];

                                                    args.data.fee_id = data.fee_id;
                                                    args.data.fee_name = data.fee_name;

                                                    args.data.bud_type_id = data.bud_type_id;
                                                    args.data.bud_type_code = data.bud_type_code;
                                                    args.data.bud_type_name = data.bud_type_name;
                                                    args.data.period_type = data.period_type;
                                                    args.data.fee_property = data.fee_property; //1变动费用或者2固定费用
                                                    args.data.is_control_bud = data.is_control_bud;

                                                    return requestApi.post('fin_fee_header', 'select', {fee_id: args.data.fee_id});
                                                } else {
                                                    swalApi.info('预算类别【' + $scope.data.currItem.bud_type_name + '】' +
                                                        '下的费用项目编码【' + args.data.fee_code + '】不存在');
                                                    args.data.fee_id = 0;
                                                    args.data.fee_name = '';
                                                    args.data.fee_code = '';
                                                }
                                            })
                                            .then(function (response) {
                                                if (response) {
                                                    args.data.subject_id = response.subject_id;
                                                    args.data.subject_name = response.subject_name;
                                                    args.data.warm_prompt = response.subject_desc;
                                                    $scope.getAndSetCanuseAmt();
                                                }
                                            })
                                            .then(function () {
                                                args.api.refreshView();
                                            })
                                    }
                                }
                                , {
                                    field: 'fee_name',
                                    headerName: '名称',
                                    pinned: 'left'
                                }
                            ]
                        }
                        , {
                            headerName: '借款项目',
                            children: [
                                {
                                    field: 'loan_fee_code',
                                    headerName: '编码'
                                }
                                , {
                                    field: 'loan_fee_name',
                                    headerName: '名称'
                                }
                            ]
                        }
                        , {
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
                        }
                        , {
                            headerName: '收款对象',
                            children: [
                                {
                                    field: 'receiver_type',
                                    headerName: '类型',
                                    hcDictCode: 'useobject_type',
                                    hcRequired: function () {
                                        if (!$scope.data.currItem.fee_apply_id) {
                                            return true;
                                        }
                                    },
                                    editable: function (args) {
                                        return editable_hasApply(args)
                                    }
                                }
                                , {
                                    field: 'receiver_name',
                                    headerName: '名称',
                                    editable: function (args) {
                                        if (args.data.receiver_type == 4) {
                                            return false;
                                        } else {
                                            return editable_hasApply(args)
                                        }
                                    },
                                    onCellDoubleClicked: function (args) {
                                        if (!editable_hasApply()) {
                                            return;
                                        }
                                        if (args.data.receiver_type == 1) {
                                            $scope.chooseUser(args);
                                        }
                                        if (args.data.receiver_type == 2) {
                                            $scope.chooseCustomer(args);
                                        }
                                        if (args.data.receiver_type == 3) {
                                            $scope.chooseVendor(args);
                                        }
                                    }
                                }
                            ]
                        }
                        , {
                            field: 'crm_entid',
                            headerName: '品类',
                            hcDictCode: '*',
                            editable: function (args) {
                                return editable_hasApply(args)
                            },
                            onCellValueChanged: function (args) {
                                if (args.newValue === args.oldValue) {
                                    return;
                                }
                                if (args.data.crm_entid) {
                                    $scope.getAndSetCanuseAmt()
                                        .then(function () {
                                            args.api.refreshView();
                                        })
                                }
                            }
                        }
                        , {
                            headerName: '费用申请单',
                            children: [
                                {
                                    field: 'apply_check_amt',
                                    headerName: '批准金额',
                                    type: '金额'
                                }
                                , {
                                    field: 'finish_bx_amt',
                                    headerName: '已报销金额',
                                    type: '金额'
                                }
                                , {
                                    field: 'loan_allow_amt',
                                    headerName: '借款批准金额',
                                    type: '金额'
                                }
                                , {
                                    field: 'finish_payloan_amt',
                                    headerName: '已还款金额',
                                    type: '金额'
                                }
                            ]
                        }
                        , {
                            field: 'canuse_amt',
                            headerName: '可用预算',
                            type: '金额'
                        }
                        , {
                            headerName: '本次报销',
                            children: [
                                {
                                    field: 'apply_bx_amt',
                                    headerName: '申请金额',
                                    type: '金额',
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        $scope.applyAmtChanged(args);
                                    },
                                    hcRequired: true
                                }
                                , {
                                    field: 'allow_bx_amt',
                                    headerName: '批准金额',
                                    type: '金额'
                                }
                            ]
                        }
                        , {
                            field: 'note',
                            headerName: '备注',
                            editable: function (args) {
                                return editable(args)
                            }
                        }
                        , {
                            field: 'pay_amt',
                            headerName: '已支付金额',
                            type: '金额'
                        }
                        , {
                            field: 'warm_prompt',
                            headerName: '报销提示'
                        }
                        , {
                            field: 'subject_name',
                            headerName: '借方会计科目名称'
                        }
                    ]
                };

                //支付信息网格
                $scope.payListGridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }
                        , {
                            field: 'balance_type_name',
                            headerName: '结算方式',
                            width: 120
                        }
                        , {
                            field: 'feebx_create_bill_type',
                            headerName: '单据类型',
                            hcDictCode: '*',
                            width: 120
                        }
                        , {
                            field: 'ordinal_no',
                            headerName: '单据号',
                            width: 120
                        }
                        , {
                            field: 'date_fund',
                            headerName: '单据日期',
                            type: '日期',
                            width: 120
                        }
                        , {
                            field: 'pay_amount',
                            headerName: '金额',
                            type: '金额',
                            width: 120
                        }
                        , {
                            field: 'created_by',
                            headerName: '付款人',
                            width: 80
                        }
                        , {
                            field: 'is_credence',
                            headerName: '已生成凭证',
                            type: '是否',
                            cellStyle: {'text-align': 'center'},
                            width: 40
                        }
                        , {
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

                                $scope.getAndSetCanuseAmt().then(function () {
                                    args.api.refreshView();
                                })
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
                 * 查客户
                 */
                $scope.chooseCustomer = function (args) {
                    $modal.openCommonSearch({
                            classId: 'customer_org'
                        })
                        .result//响应数据
                        .then(function (response) {
                            args.data.receiver_name = response.customer_name;
                            args.data.receiver_code = response.customer_code;
                            args.data.receiver_id = response.customer_id;

                            args.api.refreshView();
                        })
                };

                /**
                 * 查供应商
                 */
                $scope.chooseVendor = function (args) {
                    $modal.openCommonSearch({
                            classId: 'vendor_org'
                        })
                        .result//响应数据
                        .then(function (response) {
                            args.data.receiver_name = response.vendor_name;
                            args.data.receiver_code = response.vendor_code;
                            args.data.receiver_id = response.vendor_id;

                            args.api.refreshView();
                        });
                };

                /**
                 * 查预算类别
                 */
                $scope.chooseBudType = function (args) {
                    $modal.openCommonSearch({
                            classId: 'fin_bud_type_header'
                        })
                        .result//响应数据
                        .then(function (response) {
                            //若更改预算类别，则清空费用项目和可用预算
                            if (response.bud_type_id != args.data.bud_type_id) {
                                args.data.fee_id = 0;
                                args.data.fee_code = '';
                                args.data.fee_name = '';
                                args.data.canuse_amt = 0;
                            }

                            args.data.bud_type_code = response.bud_type_code;
                            args.data.bud_type_name = response.bud_type_name;
                            args.data.bud_type_id = response.bud_type_id;

                            args.data.period_type = response.period_type;
                            args.data.fee_property = response.fee_property; //1变动费用或者2固定费用
                            args.data.is_control_bud = response.is_control_bud;

                            $scope.getAndSetCanuseAmt();
                        }).then(function () {
                        args.api.refreshView();
                    })
                };

                /**
                 * 查询费用项目
                 */
                $scope.chooseFee = function (args) {
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
                            args.data.fee_id = response.fee_id;
                            args.data.fee_code = response.fee_code;
                            args.data.fee_name = response.fee_name;

                            args.data.bud_type_id = response.bud_type_id;
                            args.data.bud_type_code = response.bud_type_code;
                            args.data.bud_type_name = response.bud_type_name;

                            args.data.period_type = response.period_type;
                            args.data.fee_property = response.fee_property; //1变动费用或者2固定费用
                            args.data.is_control_bud = response.is_control_bud;

                            return requestApi.post('fin_fee_header', 'select', {fee_id: args.data.fee_id});
                        })
                        .then(function (response) {
                            args.data.subject_id = response.subject_id;
                            args.data.subject_no = response.subject_no;
                            args.data.subject_name = response.subject_name;
                            args.data.warm_prompt = response.subject_desc;

                            $scope.getAndSetCanuseAmt();
                        })
                        .then(function () {
                            args.api.refreshView();
                        })
                };

                /**
                 * 查结算方式
                 */
                $scope.chooseBalanceType = function (args) {
                    $modal.openCommonSearch({
                            classId: 'base_balance_type',
                            sqlWhere: ' is_fee = 2'
                        })
                        .result//响应数据
                        .then(function (response) {
                            $scope.data.currItem.balance_type_name = response.balance_type_name;
                            $scope.data.currItem.base_balance_type_id = response.base_balance_type_id;
                        });
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

                    bizData.cyear = new Date().getFullYear();
                    bizData.cmonth = new Date().getMonth() + 1;
                    if (numberApi.toNumber(bizData.cmonth) >= 10) {
                        bizData.year_month = bizData.cyear + '-' + bizData.cmonth;
                    } else {
                        bizData.year_month = bizData.cyear + '-0' + bizData.cmonth;
                    }
                    bizData.chap_name = bizData.creator;
                    bizData.org_id = userbean.loginuserifnos[0].org_id;
                    bizData.org_code = userbean.loginuserifnos[0].org_code;
                    bizData.org_name = userbean.loginuserifnos[0].org_name;
                    bizData.fin_fee_bx_lines = [];

                    bizData.bx_id = 0;
                    bizData.create_time = new Date().Format('yyyy-MM-dd hh:mm:ss');

                    $scope.gridOptions.hcApi.setRowData(bizData.fin_fee_bx_lines);
                };

                /**
                 * 拆分年月和月度
                 */
                $scope.splitYM = function () {
                    //年月拆分成年度和月度
                    if ($scope.data.currItem.year_month) {
                        var date = new Date($scope.data.currItem.year_month).Format('yyyy-M');
                        var arrYM = date.split('-');
                        $scope.data.currItem.cyear = arrYM[0];
                        $scope.data.currItem.cmonth = arrYM[1];
                    }
                    $scope.getAndSetCanuseAmt();
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
                        bizData.fin_fee_bx_lines[i].finish_bx_amt = 0;
                        bizData.fin_fee_bx_lines[i].pay_amt = 0;
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
                 * 保存前校验
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);

                    var lines = $scope.data.currItem.fin_fee_bx_lines;


                    if (!lines.length) {
                        invalidBox.push('明细不能为空');
                    }
                    else {
                        loopApi.forLoop(lines.length, function (i) {
                            //勾选还借款：校验“本次报销-批准金额”必须小于或等于 “费用申请单借款批准金额 - 已还款金额”
                            if ($scope.data.currItem.fee_loan_id) {
                                var can_bx_amt = numberApi.sub(lines[i].loan_allow_amt, lines[i].finish_payloan_amt);
                                if (lines[i].apply_bx_amt > can_bx_amt) {
                                    invalidBox.push('本次报销申请金额不能大于【' + can_bx_amt + '】');
                                }
                            }
                        })
                    }
                };


                /**
                 * 查询可用预算
                 */
                $scope.getAndSetCanuseAmt = function () {
                    //获取明细行索引
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx >= 0) {
                        var line = $scope.data.currItem.fin_fee_bx_lines.slice(0);

                        if (line[idx].bud_type_id && $scope.data.currItem.cyear && $scope.data.currItem.cmonth
                            && line[idx].fee_org_id && line[idx].fee_id) {
                            //查可用预算
                            var postdata = {
                                period_line_id: line[idx].period_line_id,
                                period_type: line[idx].period_type,
                                org_id: line[idx].fee_org_id,
                                object_id: line[idx].fee_id,
                                bud_type_id: line[idx].bud_type_id,
                                bud_year: $scope.data.currItem.cyear,
                                cmonth: $scope.data.currItem.cmonth,
                                crm_entid: line[idx].crm_entid
                            };
                            return requestApi.post('fin_bud', 'getfactcanuseamt', postdata)
                                .then(function (response) {
                                    var canuse = response.canuse_amt ? response.canuse_amt : 0;
                                    line[idx].canuse_amt = canuse;

                                    $scope.gridOptions.hcApi.setRowData(line);
                                });
                        }
                    }

                };

                /**
                 * 明细行申请金额改变事件
                 */
                $scope.applyAmtChanged = function (args) {
                    //本次报销批准金额 = 本次报销申请金额
                    args.data.allow_bx_amt = args.data.apply_bx_amt;
                    args.api.refreshView();

                    if ($scope.data.currItem.fee_apply_id > 0) {
                        if ($scope.data.currItem.is_repay_loan != 2) {
                            $scope.data.currItem.is_overproof = 1;
                            $scope.checkOverProof();
                        } else {
                            loopApi.forLoop($scope.data.currItem.fin_fee_bx_lines.length, function (i) {
                                var can_bx_amt = numberApi.sub($scope.data.currItem.fin_fee_bx_lines[i].loan_allow_amt
                                    , $scope.data.currItem.fin_fee_bx_lines[i].finish_payloan_amt);
                                if ($scope.data.currItem.fin_fee_bx_lines[i].apply_bx_amt > can_bx_amt) {
                                    $scope.data.currItem.fin_fee_bx_lines[i].apply_bx_amt = 0;
                                    $scope.data.currItem.fin_fee_bx_lines[i].allow_bx_amt = 0;

                                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.fin_fee_bx_lines);
                                    return swalApi.info('本次报销申请金额不能大于【' + can_bx_amt + '】');
                                }
                            })
                        }
                    }

                    //计算总额
                    $scope.calSum();
                    $scope.calTotal();
                };

                /**
                 * 检查明细行【本次报销申请金额】是否超额报销
                 * --申请单有借款：A = 费用申请单批准金额  -  借款批准金额 - （已报销金额 - 已还款金额）
                 * --申请单无借款：A = 费用申请单批准金额  -  已报销金额
                 * B = 本次报销申请金额
                 * 若B-A > 0 ,则超额报销，超额金额 = B - A
                 */
                $scope.checkOverProof = function () {
                    if ($scope.data.currItem.fee_apply_id > 0) {
                        var validData = $scope.gridOptions.hcApi.getFocusedData();
                        var validLine = [];
                        validLine.push(validData);
                        return requestApi.post('fin_fee_bx_header', 'checkoverproof', {
                                fee_apply_id: $scope.data.currItem.fee_apply_id,
                                fin_fee_bx_lines: validLine
                            })
                            .then(function (data) {
                                if (data) {
                                    $scope.data.currItem.is_overproof = data.is_overproof;
                                }
                            });
                    }
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
                            finish_bx_amt: numberApi.sum($scope.data.currItem.fin_fee_bx_lines, 'finish_bx_amt'),
                            apply_bx_amt: numberApi.sum($scope.data.currItem.fin_fee_bx_lines, 'apply_bx_amt'),
                            allow_bx_amt: numberApi.sum($scope.data.currItem.fin_fee_bx_lines, 'allow_bx_amt'),
                            pay_amt: numberApi.sum($scope.data.currItem.fin_fee_bx_lines, 'pay_amt')
                        }
                    ]);
                };

                /**
                 * 还借款复选框点击事件
                 */
                $scope.is_repay_loan_clicked = function () {
                    if ($scope.data.currItem.is_repay_loan != 2) {
                        $scope.data.currItem.fee_loan_id = 0;
                        $scope.data.currItem.fee_loan_no = '';
                    }
                    $scope.setLoanVisible();
                };

                /**
                 * 通用查询-费用申请单
                 */
                $scope.getCommonSearchSetting_apply = function () {
                    return {
                        classId: 'fin_fee_apply_header',
                        postData: {flag: 2},
                        gridOptions: {
                            columnDefs: [
                                {
                                    field: 'fee_apply_no',
                                    headerName: '费用申请单号'
                                }, {
                                    field: 'purpose',
                                    headerName: '费用用途'
                                }, {
                                    field: 'total_allow_amt',
                                    headerName: '批准金额',
                                    type: '金额'
                                }, {
                                    field: 'fee_loan_no',
                                    headerName: '借款单号'
                                }, {
                                    field: 'loan_total_allow_amt',
                                    headerName: '借款批准金额',
                                    type: '金额'
                                }, {
                                    field: 'year_month',
                                    headerName: '年月'
                                }
                            ]
                        },
                        afterOk: function (data) {
                            //先清空原来带出的信息
                            if ($scope.data.currItem.bx_id == 0) {
                                $scope.newBizData($scope.data.currItem = {});
                            } else {
                                $scope.data.currItem.fee_loan_id = 0;
                                $scope.data.currItem.fee_loan_no = '';
                            }

                            $scope.data.currItem.cyear = data.cyear;
                            $scope.data.currItem.cmonth = data.cmonth;
                            if (numberApi.toNumber($scope.data.currItem.cmonth) >= 10) {
                                $scope.data.currItem.year_month = $scope.data.currItem.cyear + '-' + $scope.data.currItem.cmonth;
                            } else {
                                $scope.data.currItem.year_month = $scope.data.currItem.cyear + '-0' + $scope.data.currItem.cmonth;
                            }

                            $scope.data.currItem.fee_apply_id = data.fee_apply_id;
                            $scope.data.currItem.fee_apply_no = data.fee_apply_no;
                            $scope.data.currItem.purpose = data.purpose;

                            if (numberApi.toNumber(data.fee_loan_id) > 0) {
                                $scope.data.currItem.fee_loan_id = data.fee_loan_id;
                                $scope.data.currItem.fee_loan_no = data.fee_loan_no;
                                $scope.data.currItem.loan_total_allow_amt = data.loan_total_allow_amt;
                                $scope.data.currItem.loan_total_nopay_amt = data.loan_total_nopay_amt;
                                $scope.data.currItem.is_repay_loan = 2;
                            }

                            //明细
                            requestApi.post('fin_fee_apply_header', 'select',
                                {fee_apply_id: data.fee_apply_id})
                                .then(function (response) {
                                    $scope.data.currItem.fin_fee_bx_lines = response.fin_fee_apply_lines.slice(0);
                                    var bx_lines = $scope.data.currItem.fin_fee_bx_lines;
                                    var validLines = [];

                                    //已报销完的明细不带出（is_bx = 2)
                                    loopApi.forLoop(bx_lines.length, function (i) {
                                        if (bx_lines[i].is_bx == 2) {
                                            delete bx_lines[i];
                                        }
                                        if (typeof(bx_lines[i]) !== 'undefined') {
                                            validLines.push(bx_lines[i]);
                                        }
                                    });

                                    //设置数据
                                    loopApi.forLoop(validLines.length, function (i) {
                                        validLines[i].apply_check_amt = validLines[i].allow_amt;
                                        //查借方会计科目
                                        if (numberApi.toNumber(validLines[i].fee_id) > 0) {
                                            return requestApi.post('fin_fee_header', 'select', {fee_id: validLines[i].fee_id})
                                                .then(function (response) {
                                                    validLines[i].subject_id = response.subject_id;
                                                    validLines[i].subject_no = response.subject_no;
                                                    validLines[i].subject_name = response.subject_name;

                                                    $scope.gridOptions.hcApi.setRowData(validLines);
                                                });
                                        }
                                    });
                                })
                                .then(function () {
                                    $scope.setLoanVisible();
                                    $scope.setApplyLineVisible();

                                    $scope.setButtonHide();

                                    $scope.calSum();
                                    $scope.calTotal();
                                })
                        }
                    };
                };

                /**
                 * 设置借款信息可见
                 */
                $scope.setLoanVisible = function () {
                    if ($scope.data.currItem.fee_loan_id > 0) {
                        $scope.data.loanVisible = true;
                    } else {
                        $scope.data.loanVisible = false;
                    }

                    $scope.gridOptions.columnApi.setColumnVisible('loan_fee_code', $scope.data.loanVisible);
                    $scope.gridOptions.columnApi.setColumnVisible('loan_fee_name', $scope.data.loanVisible);
                    $scope.gridOptions.columnApi.setColumnVisible('loan_allow_amt', $scope.data.loanVisible);
                    $scope.gridOptions.columnApi.setColumnVisible('finish_payloan_amt', $scope.data.loanVisible);

                    return $scope.gridOptions;
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
                    $scope.gridOptions.columnApi.setColumnVisible('loan_allow_amt',
                        $scope.data.applyLineVisible && $scope.data.currItem.fee_loan_id > 0);
                    $scope.gridOptions.columnApi.setColumnVisible('finish_bx_amt', $scope.data.applyLineVisible);
                    $scope.gridOptions.columnApi.setColumnVisible('finish_payloan_amt',
                        $scope.data.applyLineVisible && $scope.data.currItem.fee_loan_id > 0);

                    return $scope.gridOptions;
                };

                /**
                 * 设置按钮隐藏或显示
                 */
                $scope.setButtonHide = function () {
                    /* $scope.footerLeftButtons.add_line.hide = $scope.data.currItem.fee_apply_id > 0;
                     $scope.footerLeftButtons.copyAndAdd_line.hide = $scope.data.currItem.fee_apply_id > 0;
                     $scope.footerLeftButtons.chooseFeeRecord.hide = $scope.data.currItem.fee_apply_id > 0; */
                };

                /**
                 * 删除费用申请单后清除数据
                 */
                $scope.afterDeleteApplyNo = function () {
                    $scope.data.currItem.fin_fee_bx_lines = [];
                    $scope.gridOptions.api.setRowData([]);

                    $scope.setApplyLineVisible();
                };

                /**
                 * 初始化
                 */
                $scope.doInit = function () {
                    $scope.hcSuper.doInit()
                        .then($scope.setLoanVisible)
                        .then($scope.setApplyLineVisible)
                        .then($scope.setButtonHide);
                };

                /**
                 * 增加行
                 */
                $scope.add_line = function () {
                    $scope.gridOptions.api.stopEditing();
                    var line = {
                        fee_org_id: $scope.data.currItem.org_id,
                        fee_org_code: $scope.data.currItem.org_code,
                        fee_org_name: $scope.data.currItem.org_name,
                        receiver_type: 4 //收款对象类型： 其他
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

                /**
                 * 选取费用记录
                 */
                $scope.chooseFeeRecord = function () {
                    if (!$scope.data.currItem.bud_type_id || $scope.data.currItem.bud_type_id <= 0) {
                        return swalApi.info('请先选择预算类别')
                    }
                    var modal = openBizObj({
                        stateName: 'finman.fin_fee_record_choose_list',
                        params: {
                            bud_type_id: $scope.data.currItem.bud_type_id,
                            lines: JSON.stringify($scope.data.currItem.fin_fee_bx_lines)
                        }
                    });
                    top.modal_record = modal;
                    return modal.result
                        .then(function (data) {
                            if ($scope.data.currItem.org_id == 0) {
                                $scope.data.currItem.org_id = data[0].org_id;
                                $scope.data.currItem.org_code = data[0].org_code;
                                $scope.data.currItem.org_name = data[0].org_name;
                            }

                            var lines = $scope.data.currItem.fin_fee_bx_lines;

                            loopApi.forLoop(data.length, function (i) {
                                data[i].fee_org_id = data[i].org_id;
                                data[i].fee_org_code = data[i].org_code;
                                data[i].fee_org_name = data[i].org_name;

                                data[i].apply_bx_amt = data[i].xf_amt;
                                data[i].allow_bx_amt = data[i].xf_amt;

                                //查借方会计科目
                                if (numberApi.toNumber(data[i].fee_id) > 0) {
                                    return requestApi.post('fin_fee_header', 'select', {fee_id: data[i].fee_id})
                                        .then(function (response) {
                                            data[i].subject_no = response.subject_no;
                                            data[i].subject_name = response.subject_name;

                                            lines.push(data[i]);
                                            $scope.gridOptions.hcApi.setRowData(lines);
                                        });
                                } else {
                                    lines.push(data[i]);
                                    $scope.gridOptions.hcApi.setRowData(lines);
                                }
                            });

                        })
                };

                /**
                 * 关联发票
                 */
                    // $scope.link_invoice = function () {
                    //     var modal =  openBizObj({
                    //         stateName: 'finman.fin_fee_invoice_related_list',
                    //         params: {
                    //             lines: JSON.stringify($scope.data.currItem.fin_fee_record_lines)
                    //         }
                    //     })
                    //     top.modal_invoice_bx = modal;
                    //     return modal.result.then(function (invoices) {
                    //         Array.prototype.push.apply($scope.data.currItem.fin_fee_record_lines, invoices);
                    //     });
                    // };

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
                $scope.footerLeftButtons.chooseFeeRecord = {
                    title: '选取费用',
                    click: function () {
                        $scope.chooseFeeRecord && $scope.chooseFeeRecord();
                    },
                    hide: function () {
                        return !$scope.tabs.base.active || $scope.data.currItem.fee_apply_id > 0;
                    }
                };

                //支付信息标签页
                $scope.tabs.payList = {
                    title: '支付信息'
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
