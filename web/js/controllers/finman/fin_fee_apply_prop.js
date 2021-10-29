/**
 * 费用申请-属性页
 * 2018-11-16
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'openBizObj',
        'swalApi', 'loopApi', 'numberApi', 'strApi'],
    function (module, controllerApi, base_obj_prop, requestApi, openBizObj,
              swalApi, loopApi, numberApi, strApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal', '$stateParams',
            //控制器函数
            function ($scope, $modal, $stateParams) {

                /*-------------------数据定义开始------------------------*/
                $scope.data = {
                    is_copy: false,
                    // loanVisible : false,//借款信息默认不可见
                    // isOverdue : false, //借款是否逾期默认为否
                    isApply: $stateParams.isApply === 'false' ? false : true   //是否费用申请菜单入口
                };

                function editable(args) {
                    if ($scope.data.currItem.stat == 1 && !args.node.rowPinned)
                        return true;
                    return false;
                }

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
                                                    swalApi.info('费用项目编码【' + args.data.fee_code + '】不存在');
                                                    args.data.fee_id = 0;
                                                    args.data.fee_name = '';
                                                    args.data.fee_code = '';
                                                }
                                            })
                                            .then(function (response) {
                                                if (response) {
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
                        // ,{
                        //     headerName: '借款项目',
                        //     children: [
                        //         {
                        //             field: 'loan_fee_code',
                        //             headerName: '编码',
                        //             hcRequired: function () {
                        //                 return $scope.data.currItem.is_loan == 2;
                        //             },
                        //             editable: function (args) {
                        //                 return editable(args)
                        //             },
                        //             onCellDoubleClicked: function (args) {
                        //                 $scope.chooseFee(args);
                        //             },
                        //             onCellValueChanged: function (args) {
                        //                 if(!args.newValue || args.newValue === args.oldValue){
                        //                     return;
                        //                 }
                        //                 var postdata = {
                        //                     flag: 8,
                        //                     sqlwhere: ' fee_property = 18011'
                        //                 };
                        //
                        //                 requestApi.post('fin_bud_type_line_obj', 'search', postdata)
                        //                     .then(function (res) {
                        //                         if(res.fin_bud_type_line_objs.length){
                        //                             var data = res.fin_bud_type_line_objs[0];
                        //
                        //                             args.data.loan_fee_id = data.fee_id;
                        //                             args.data.loan_fee_name = data.fee_name;
                        //
                        //                             var fee_id = args.data.fee_id;
                        //
                        //                             return requestApi.post('fin_fee_header', 'select', {fee_id : fee_id});
                        //                         }else{
                        //                             swalApi.info('借款类的费用项目编码【'+args.data.loan_fee_code+'】不存在');
                        //                             args.data.loan_fee_id = 0;
                        //                             args.data.loan_fee_name = '';
                        //                             args.data.loan_fee_code = '';
                        //                         }
                        //                     })
                        //                     .then(function (response) {
                        //                         args.data.loan_warm_prompt = response.subject_desc;
                        //                         args.api.refreshView();
                        //                     })
                        //             }
                        //         }
                        //         , {
                        //             field: 'loan_fee_name',
                        //             headerName: '名称'
                        //         }
                        //     ]
                        // }
                        , {
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
                        }
                        , {
                            headerName: '收款对象',
                            children: [
                                {
                                    field: 'receiver_type',
                                    headerName: '类型',
                                    hcRequired: true,
                                    hcDictCode: 'useobject_type',
                                    editable: function (args) {
                                        return editable(args)
                                    }
                                }
                                , {
                                    field: 'receiver_name',
                                    headerName: '名称',
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    hcRequired: function (args) {
                                        if (args.data.receiver_type > 0 && args.data.receiver_type < 4) {
                                            return true;
                                        }
                                    },
                                    onCellDoubleClicked: function (args) {
                                        if (args.data.receiver_type == 1 && editable(args)) {
                                            $scope.chooseUser(args);
                                        }
                                        if (args.data.receiver_type == 2 && editable(args)) {
                                            $scope.chooseCustomer(args);
                                        }
                                        if (args.data.receiver_type == 3 && editable(args)) {
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
                                return editable(args)
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
                            field: 'canuse_amt',
                            headerName: '可用预算',
                            type: '金额'
                        }
                        // ,{
                        //     field: 'entorgid',
                        //     headerName: '产品线',
                        //     hcDictCode: '*',
                        //     editable : function (args) {
                        //         return editable(args)
                        //     }
                        // }
                        , {
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
                                }
                                , {
                                    field: 'allow_amt',
                                    headerName: '批准金额',
                                    type: '金额'
                                }
                            ]
                        }
                        // ,{
                        //     headerName: '借款',
                        //     children: [
                        //         {
                        //             field: 'loan_apply_amt',
                        //             headerName: '申请金额',
                        //             type: '金额',
                        //             hcRequired: function () {
                        //                 return $scope.data.currItem.is_loan == 2;
                        //             },
                        //             editable : function (args) {
                        //                 return editable(args)
                        //             },
                        //             onCellValueChanged: function (args) {
                        //                 if(args.newValue == 0){
                        //                     swalApi.info('申请金额必须大于0');
                        //                     args.data.loan_apply_amt = '';
                        //                     args.api.refreshView();
                        //                     return;
                        //                 }
                        //                 $scope.loanApplyAmtChanged(args);
                        //             }
                        //         }
                        //         ,{
                        //             field: 'loan_allow_amt',
                        //             headerName: '批准金额',
                        //             type: '金额'
                        //         }
                        //     ]
                        // }
                        , {
                            field: 'note',
                            headerName: '备注',
                            editable: function (args) {
                                return editable(args)
                            }
                        }
                        , {
                            headerName: '报销',
                            children: [
                                {
                                    field: 'applied_bx_amt',
                                    headerName: '已申请金额',
                                    type: '金额'
                                }
                                , {
                                    field: 'finish_bx_amt',
                                    headerName: '已批准金额',
                                    type: '金额'
                                }
                            ]
                        }
                        , {
                            field: 'warm_prompt',
                            headerName: '报销提示'
                        }
                        // ,{
                        //     field: 'loan_warm_prompt',
                        //     headerName: '借款提示'
                        // }
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
                        });
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

                    });
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
                            args.data.fee_id = response.fee_id;
                            args.data.fee_code = response.fee_code;
                            args.data.fee_name = response.fee_name;

                            args.data.bud_type_id = response.bud_type_id;
                            args.data.bud_type_code = response.bud_type_code;
                            args.data.bud_type_name = response.bud_type_name;

                            args.data.period_type = response.period_type;
                            args.data.fee_property = response.fee_property; //1变动费用或者2固定费用
                            args.data.is_control_bud = response.is_control_bud;

                            return args.data;
                        })
                        .then(function (data) {
                            return requestApi.post('fin_fee_header', 'select', {fee_id: data.fee_id});
                        })
                        .then(function (response) {
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

                $scope.chooseBalanceType = function () {
                    $modal.openCommonSearch({
                            classId: 'base_balance_type',
                            sqlWherer: ' is_fee = 2'
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
                    bizData.org_code = strApi.isNull(userbean.loginuserifnos[0].org_code) ? userbean.loginuserifnos[0].org_name : userbean.loginuserifnos[0].org_code;
                    bizData.org_name = userbean.loginuserifnos[0].org_name;
                    bizData.fin_fee_apply_lines = [];

                    bizData.fee_apply_id = 0;
                    bizData.create_time = new Date().Format('yyyy-MM-dd hh:mm:ss');

                    $scope.gridOptions.hcApi.setRowData(bizData.fin_fee_apply_lines);
                };

                /**
                 * 复制
                 */
                $scope.copyBizData = function (bizData) {
                    $scope.hcSuper.copyBizData(bizData);

                    bizData.is_loan = 1;
                    bizData.is_advance = 1;
                    bizData.fee_loan_no = '';
                    bizData.is_bx = 1;
                    bizData.is_payed = 1;
                    bizData.settle_man = '';
                    bizData.settle_time = '';
                    bizData.settle_reason = '';

                    bizData.create_time = new Date().Format('yyyy-MM-dd hh:mm:ss');

                    loopApi.forLoop(bizData.fin_fee_apply_lines.length, function (i) {
                        bizData.fin_fee_apply_lines[i].receiver_id = 0;
                        bizData.fin_fee_apply_lines[i].receiver_code = '';
                        bizData.fin_fee_apply_lines[i].receiver_name = '';
                        bizData.fin_fee_apply_lines[i].finish_bx_amt = 0;
                        bizData.fin_fee_apply_lines[i].applied_bx_amt = 0;
                        bizData.fin_fee_apply_lines[i].loan_apply_amt = 0;
                        bizData.fin_fee_apply_lines[i].loan_allow_amt = 0;
                        bizData.fin_fee_apply_lines[i].pay_amt = 0;
                        bizData.fin_fee_apply_lines[i].is_bx = 1;
                    });

                    $scope.gridOptions.hcApi.setRowData(bizData.fin_fee_apply_lines);

                    $scope.data.is_copy = true;
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);

                    $scope.data.is_control_bud2 = bizData.is_control_bud2;

                    // $scope.setLoanVisible();
                    $scope.gridOptions.hcApi.setRowData(bizData.fin_fee_apply_lines);

                    $scope.calSum();
                    $scope.calTotal();
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
                 * 保存前校验
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);

                    if ($scope.data.currItem.fin_fee_apply_lines.length == 0) {
                        return swalApi.info('明细不能为空！');
                    } else {
                        loopApi.forLoop($scope.data.currItem.fin_fee_apply_lines.length, function (i) {
                            if ($scope.data.currItem.fin_fee_apply_lines[i].apply_amt <= 0) {
                                invalidBox.push('费用申请金额必须大于0');
                            }
                            // if($scope.data.currItem.is_loan == 2){
                            //     if($scope.data.currItem.fin_fee_apply_lines[i].loan_apply_amt <= 0){
                            //         invalidBox.push('借款申请金额必须大于0');
                            //     }
                            //     if(numberApi.sub($scope.data.currItem.fin_fee_apply_lines[i].apply_amt,$scope.data.currItem.fin_fee_apply_lines[i].loan_apply_amt) < 0){
                            //         invalidBox.push('借款申请金额不能大于费用申请金额');
                            //     }
                            // }

                        })
                    }
                };

                /**
                 * 复制重新查询可用预算(用递归解决循环异步请求出现的执行顺序问题)
                 */
                $scope.reGetAndSetCanuseAmt = function (i, length) {
                    var checkLines = $scope.data.currItem.fin_fee_apply_lines.slice(0);
                    var idx = i;
                    if ($scope.data.currItem.cyear && $scope.data.currItem.cmonth
                        && checkLines[idx].fee_org_id && checkLines[idx].fee_id && checkLines[idx].bud_type_id) {
                        //查可用预算
                        var postdata = {
                            period_line_id: checkLines[idx].period_line_id,
                            period_type: checkLines[idx].period_type,
                            org_id: checkLines[idx].fee_org_id,
                            object_id: checkLines[idx].fee_id,
                            bud_type_id: checkLines[idx].bud_type_id,
                            bud_year: $scope.data.currItem.cyear,
                            cmonth: $scope.data.currItem.cmonth,
                            crm_entid: checkLines[idx].crm_entid
                        };
                        requestApi.post('fin_bud', 'getfactcanuseamt', postdata)
                            .then(function (response) {
                                var canuse = response.canuse_amt ? response.canuse_amt : 0;
                                checkLines[idx].canuse_amt = canuse;
                                $scope.gridOptions.hcApi.setRowData(checkLines);
                            });
                    }
                    //递归
                    if (++i < length) {
                        $scope.reGetAndSetCanuseAmt(i, length);
                    }
                };

                /**
                 * 查询可用预算
                 */
                $scope.getAndSetCanuseAmt = function () {
                    var checkLines = $scope.data.currItem.fin_fee_apply_lines.slice(0);
                    var idx = 0;

                    //获取明细行索引
                    idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx >= 0) {
                        if ($scope.data.currItem.cyear && $scope.data.currItem.cmonth
                            && checkLines[idx].fee_org_id && checkLines[idx].fee_id && checkLines[idx].bud_type_id) {
                            //查可用预算
                            var postdata = {
                                period_line_id: checkLines[idx].period_line_id,
                                period_type: checkLines[idx].period_type,
                                org_id: checkLines[idx].fee_org_id,
                                object_id: checkLines[idx].fee_id,
                                bud_type_id: checkLines[idx].bud_type_id,
                                bud_year: $scope.data.currItem.cyear,
                                cmonth: $scope.data.currItem.cmonth,
                                crm_entid: checkLines[idx].crm_entid
                            };
                            return requestApi.post('fin_bud', 'getfactcanuseamt', postdata)
                                .then(function (response) {
                                    var canuse = response.canuse_amt ? response.canuse_amt : 0;
                                    checkLines[idx].canuse_amt = canuse;

                                    $scope.gridOptions.hcApi.setRowData(checkLines);
                                });
                        }
                    }
                };

                /**
                 * 明细行申请金额改变事件
                 */
                $scope.applyAmtChanged = function (args) {
                    if (args.data.apply_amt && args.data.apply_amt > 0) {
                        args.data.allow_amt = args.data.apply_amt;
                    }
                    args.api.refreshView();

                    //计算总额
                    $scope.calSum();
                    $scope.calTotal();
                };

                /**
                 * 明细行借款申请金额改变事件
                 */
                // $scope.loanApplyAmtChanged = function (args) {
                //     if(args.data.loan_apply_amt && args.data.loan_apply_amt > 0){
                //         //判断是否小于等于申请金额
                //         if(numberApi.toNumber(args.data.loan_apply_amt) > numberApi.toNumber(args.data.apply_amt)){
                //             args.data.loan_apply_amt = 0;
                //             args.api.refreshView();
                //             return swalApi.info('借款申请金额必须小于或等于申请金额！');
                //         }
                //         args.data.loan_allow_amt = args.data.loan_apply_amt;
                //     }
                //
                //     args.api.refreshView();
                //
                //     //计算总额
                //     $scope.calSum();
                //     $scope.calTotal();
                // };

                /**
                 * 计算总额
                 */
                $scope.calTotal = function () {
                    var total_apply = 0;
                    var total_allow = 0;
                    var loan_total_apply = 0;
                    var loan_total_allow = 0;
                    var lines = $scope.data.currItem.fin_fee_apply_lines.slice(0);
                    if (lines.length > 0) {
                        loopApi.forLoop(lines.length, function (i) {
                            total_apply += lines[i].apply_amt ? numberApi.toNumber(lines[i].apply_amt) : 0;
                            total_allow += lines[i].allow_amt ? numberApi.toNumber(lines[i].apply_amt) : 0;

                            // if($scope.data.loanVisible){
                            //     loan_total_apply += lines[i].loan_apply_amt ? numberApi.toNumber(lines[i].loan_apply_amt) : 0;
                            //     loan_total_allow += lines[i].loan_allow_amt ? numberApi.toNumber(lines[i].loan_allow_amt) : 0;
                            // }

                        });
                        $scope.data.currItem.total_apply_amt = total_apply.toFixed(2);
                        $scope.data.currItem.total_allow_amt = total_allow.toFixed(2);

                        // if($scope.data.loanVisible){
                        //     $scope.data.currItem.loan_total_apply_amt = loan_total_apply.toFixed(2);
                        //     $scope.data.currItem.loan_total_allow_amt = loan_total_allow.toFixed(2);
                        // }
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
                 * 借款复选框点击事件
                 */
                // $scope.is_loan_clicked = function () {
                //     $scope.setLoanVisible();
                //     var lines = $scope.data.currItem.fin_fee_apply_lines.slice(0);
                //     loopApi.forLoop(lines.length, function (i) {
                //         lines[i].loan_apply_amt = lines[i].apply_amt;
                //         lines[i].loan_allow_amt = lines[i].apply_amt;
                //     });
                //     $scope.calSum();
                //     $scope.calTotal();
                // };

                /**
                 * 设置借款信息可见
                 */
                // $scope.setLoanVisible = function () {
                //     if($scope.data.currItem.is_loan == 2){
                //         $scope.data.loanVisible = true;
                //     }else{
                //         $scope.data.loanVisible = false;
                //     }
                //
                //     $scope.gridOptions.columnApi.setColumnVisible('loan_fee_code',$scope.data.loanVisible);
                //     $scope.gridOptions.columnApi.setColumnVisible('loan_fee_name',$scope.data.loanVisible);
                //     $scope.gridOptions.columnApi.setColumnVisible('loan_warm_prompt',$scope.data.loanVisible);
                //     $scope.gridOptions.columnApi.setColumnVisible('loan_apply_amt',$scope.data.loanVisible);
                //     $scope.gridOptions.columnApi.setColumnVisible('loan_allow_amt',$scope.data.loanVisible);
                //
                // };

                /**
                 * 检查借款是否有逾期单
                 */
                // $scope.checkLoanOverdueBill = function () {
                //     return requestApi.post('fin_fee_loan_header', 'checkloanbill',
                //         {
                //             chap_name: $scope.data.currItem.chap_name,
                //             create_time: $scope.data.currItem.create_time
                //         })
                //     .then(function (response) {
                //         if(response.is_overdue == 2){
                //             $scope.data.isOverdue = true;
                //         }
                //     })
                // };

                /**
                 * 未还款明细查询
                 */
                // $scope.searchLineForNoPay = function () {
                //     return openBizObj({
                //         stateName: 'finman.fin_nopay_loan_list',
                //         params: {
                //             title: '未还款明细',
                //             creator: $scope.data.currItem.creator
                //         }
                //     }).result
                // };

                /**
                 * 初始化
                 */
                $scope.doInit = function () {
                    // $scope.setLoanVisible();

                    $scope.hcSuper.doInit()
                        // .then($scope.checkLoanOverdueBill)
                        .then(function () {
                            if ($scope.data.is_copy) {
                                $scope.reGetAndSetCanuseAmt(0, $scope.data.currItem.fin_fee_apply_lines.length);
                            }
                        })
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
                    $scope.data.currItem.fin_fee_apply_lines.push(line);

                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.fin_fee_apply_lines);
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
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.fin_fee_apply_lines);
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
                    $scope.data.currItem.fin_fee_apply_lines.push(newLine);

                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.fin_fee_apply_lines);
                };


                /**
                 * 费用结案
                 */
                $scope.settle = function () {
                    //获取未报销完的报销单
                    return requestApi.post('fin_fee_apply_header', 'getnocheckbxbill',
                        {fee_apply_id: $scope.data.currItem.fee_apply_id})
                        .then(function (data) {
                            if (strApi.isNotNull(data.nocheckbxbills)) {
                                return swalApi.confirmThenSuccess({
                                    title: '该申请单存在未完成业务的报销单【' + data.nocheckbxbills + '】,' +
                                    '是否确定一并进行结案？',
                                    okFun: function () {
                                        //填写结案原因
                                        return swalApi.input({
                                            title: '请填写结案原因',
                                            inputValidator: function (data) {
                                                if (strApi.isNull(data) || (data && data.trim() == '')) {
                                                    return '结案原因不能为空！'
                                                }
                                            }
                                        }).then(function (data) {
                                            $scope.data.currItem.settle_reason = data;
                                            return requestApi.post('fin_fee_apply_header', 'settle', $scope.data.currItem)
                                        });
                                    },
                                    okTitle: '结案成功'
                                });
                            } else {
                                //填写结案原因
                                return swalApi.input({
                                    title: '请填写结案原因',
                                    inputValidator: function (data) {
                                        if (strApi.isNull(data) || (data && data.trim() == '')) {
                                            return '结案原因不能为空！'
                                        }
                                    }
                                }).then(function (data) {
                                        $scope.data.currItem.settle_reason = data;
                                        return requestApi.post('fin_fee_apply_header', 'settle', $scope.data.currItem)
                                    })
                                    .then(function () {
                                        return swalApi.success('结案成功');
                                    });

                            }
                        });


                };

                if (!$scope.data.isApply) {
                    $scope.tabs.wf.hide = true;
                }

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

                //底部右边按钮
                //费用申请结案菜单使用
                $scope.footerRightButtons.settle = {
                    title: '费用结案',
                    click: function () {
                        $scope.settle && $scope.settle();
                    },
                    hide: $scope.data.isApply
                };

                $scope.footerRightButtons.saveThenAdd.hide = !$scope.data.isApply;
                $scope.footerRightButtons.save.hide = !$scope.data.isApply;

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
