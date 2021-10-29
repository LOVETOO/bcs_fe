/**
 * 记账凭证
 * 2019-01-24
 * huderong
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi', 'dateApi', 'numberApi', 'strApi', 'openBizObj'],
    function (module, controllerApi, base_obj_prop, swalApi, requestApi, dateApi, numberApi, strApi, openBizObj) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope', '$stateParams', '$q', '$modal',
            //控制器函数战略目标分解
            function ($scope, $stateParams, $q, $modal) {
                /**==============================网格定义========================= */
                $scope.gridOptions = {
                    pinnedBottomRowData: [{seq: '合计'}],
                    columnDefs: [
                        {
                            type: '序号'
                        },
                        {
                            field: 'docket_name',
                            headerName: '摘要',
                            width: 300,
                            editable: Editable,
                            //onCellDoubleClicked: chooseDocket,
                            onCellValueChanged: copyDocket,
                            hcRequired: checkDocketOrSubjectRequired
                        },
                        {
                            id: 'km_code',
                            headerName: "会计科目编码",
                            field: "km_code",
                            editable: Editable,
                            onCellDoubleClicked: chooseSubject,
                            onCellValueChanged: subjectChangeEvent,
                            hcRequired: checkDocketOrSubjectRequired
                        }, {
                            id: 'km_name',
                            headerName: "会计科目名称",
                            field: "km_name",
                            editable: Editable,
                            onCellDoubleClicked: chooseSubject
                        },
                        {
                            field: 'amount_debit',
                            headerName: '借方金额',
                            cellStyle: moneycellStyle,
                            valueFormatter: moneyvalueFormatter,
                            editable: Editable,
                            // hcRequired: checkAmountRequired,
                            onCellValueChanged: function (args) {
                                checkGridMoneyInput(args, [inputAmount_debit, countSum]);
                            }
                        },
                        {
                            field: 'amount_credit',
                            headerName: '贷方金额',
                            cellStyle: moneycellStyle,
                            valueFormatter: moneyvalueFormatter,
                            editable: Editable,
                            // hcRequired: checkAmountRequired,
                            onCellValueChanged: function (args) {
                                checkGridMoneyInput(args, [inputAmount_credit, countSum]);
                            }
                        },
                        {
                            field: 'line_doc_id',
                            headerName: '附件',
                            editable: false
                        }
                    ],
                    hcObjType: $stateParams.objtypeid,
                    hcEvents: {
                        selectionChanged: function (args) {
                        },
                        rowClicked: function (args) {
                            $q.when()
                                .then(function () {
                                    var oldLine = $scope.data.currLine;
                                    $scope.data.currLine = args.data;
                                    $scope.data.currLine.rowIndex = args.rowIndex;
                                    $scope.data.currEditLineTitle = '正在查看第' + ($scope.data.currLine.rowIndex + 1) + '行明细';
                                    return oldLine;
                                });
                        }
                    }
                };

                /**继承主控制器 */
                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                // 金额样式
                function moneycellStyle(params) {
                    return angular.extend($scope.gridOptions.hcApi.getDefaultCellStyle(params), {
                        'text-align': 'right' //文本居右
                    });
                }

                //金额样式值格式化器
                function moneyvalueFormatter(params) {
                    if (params.value == 0 || params.value == '0') {
                        return '';
                    }
                    return HczyCommon.formatMoney(params.value);
                }

                /**==============================数据定义========================= */
                $scope.data.currLine = {};
                angular.extend($scope.tabs, {
                    other: {
                        title: '其他',
                        actived: false
                    }
                });

                /**============================ 明细行检验=================================**/

                /**
                 * 输入值改变校验并计算事件
                 * @param args
                 * @returns {Promise|void|*}
                 */
                function checkGridMoneyInput(args, functions) {
                    if (args.newValue === args.oldValue)
                        return;
                    if (numberApi.isNum(args.newValue) || numberApi.isStrOfNum(args.newValue)) {
                        functions.forEach(function (value) {
                            value(args);
                        })
                        args.api.refreshView();
                    }
                    else {
                        return swalApi.info("请输入有效数字");
                    }
                }

                /**
                 * 输入贷方金额时，去除借方金额
                 */
                function inputAmount_credit(args) {
                    if (args.newValue != 0) {
                        args.data.amount_debit = 0;
                    }
                }

                /**
                 * 输入借方金额时，去除贷方金额
                 */
                function inputAmount_debit(args) {
                    if (args.newValue != 0) {
                        args.data.amount_credit = 0;
                    }
                }

                /**
                 * 检查摘要和会计科目是否要校验非空
                 */
                function checkDocketOrSubjectRequired(args) {
                    var row = args.data;
                    return (strApi.isNotNull(row.amount_debit) || strApi.isNotNull(row.amount_credit));
                }

                /**
                 * 检查借贷金额是否要校验非空
                 */
                function checkAmountRequired(args) {
                    var row = args.data;
                    return (strApi.isNotNull(row.docket_name) || strApi.isNotNull(row.subject_code));
                }

                /**============================ 点击事件=================================**/

                    //隐藏按钮
                $scope.footerRightButtons.saveThenSubmit.hide = hide;
                $scope.footerRightButtons.save.hide = hide;
                $scope.footerLeftButtons.addRow.hide = hide;
                $scope.footerLeftButtons.deleteRow.hide = hide;

                /**
                 * 已审核则隐藏
                 * @returns {boolean}
                 */
                function hide() {
                    var assess_flag = $scope.data.currItem.assess_flag ? parseInt($scope.data.currItem.assess_flag) : 0
                    if (assess_flag === 2) {
                        return true;
                    }
                    return false;
                }

                /**
                 * 会计科目改变事件
                 * @param args
                 */
                function subjectChangeEvent(args) {
                    if (args)
                        if (args.newValue === args.oldValue)
                            return;
                    if (args.newValue == '') {
                        var obj = args.data;
                        angular.forEach($scope.data.currLine, function (value, key) {
                            if (obj[key]) {
                                delete obj[key];
                            }
                            return;
                        })
                        $scope.data.currLine = {};
                    }
                    //获取会计科目
                    getSubject(args.newValue)
                        .catch(function (reason) {
                            return {
                                gl_account_subject_id: 0,
                                km_code: reason,
                                km_name: ""
                            };
                        })
                        .then(function (line) {
                            angular.extend(args.data, line);
                            return args.data;
                        })
                        .then(function () {
                            args.api.refreshView();
                        });
                }


                /**输入框改变时自动查询会计科目 **/
                function getSubject(code) {
                    var postData = {
                        classId: "gl_account_subject",
                        action: 'search',
                        data: {sqlwhere: " km_code = '" + code + "' and end_km = 2 and is_freeze <> 2 "}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            if (data.gl_account_subjects.length > 0) {
                                var subject = data.gl_account_subjects[0];
                                var gl_account_check_authrorities = strApi.stringPropToNum(data.gl_account_subjects[0]);
                                return {
                                    gl_account_subject_id: subject.gl_account_subject_id,
                                    km_code: subject.km_code,
                                    km_name: subject.km_name,
                                    gl_account_check_authrorities: gl_account_check_authrorities
                                };

                            } else {
                                return $q.reject("会计科目编码【" + code + "】不可用");
                            }
                        });
                }

                /**
                 * 选择会计科目
                 * @return {Promise}
                 */
                function chooseSubject(args) {
                    if (!Editable(args)) {
                        return;
                    }
                    $modal.openCommonSearch({
                            classId: 'gl_account_subject',
                            sqlWhere: " end_km = 2 and is_freeze <> 2 "
                        })
                        .result//响应数据
                        .then(function (result) {
                            args.data.gl_account_subject_id = result.gl_account_subject_id;
                            args.data.km_code = result.km_code;
                            args.data.km_name = result.km_name;
                            args.data.gl_account_check_authrorities = strApi.stringPropToNum(result);

                            return args.data;
                        }).then(function () {
                        args.api.refreshView();
                    });
                };

                /**
                 * 选择摘要
                 * @param args
                 */
                function chooseDocket(args) {
                    if (!Editable(args)) {
                        return;
                    }
                    $modal.openCommonSearch({
                            classId: 'gl_docket',
                            postData: {},
                            action: 'search',
                            title: "部门",
                            dataRelationName: 'gl_dockets',
                            gridOptions: {
                                columnDefs: [{
                                    name: "编码",
                                    code: "docket_code"
                                }, {
                                    name: "内容",
                                    code: "docket_name"
                                }]
                            }
                        })
                        .result//响应数据
                        .then(function (result) {
                            args.data.docket_id = result.docket_id;
                            args.data.docket_code = result.docket_code;
                            args.data.docket_name = result.docket_name;

                            return args;
                        })
                        .then(copyDocket)
                };

                /**
                 * 将当前填入的摘要带入到下一行
                 * @param args
                 */
                function copyDocket(args) {
                    if (args.data.docket_name) {
                        $scope.data.currItem.gl_credence_lines.forEach(function (row, rowindex) {
                            if (strApi.isNull(row.docket_name) && args.data.rowIndex === rowindex - 1) {
                                row.docket_name = args.data.docket_name;
                            }
                        })
                    }
                    args.api.refreshView();
                }

                /**
                 * 增加明细
                 */
                $scope.addRow = function () {
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

                        var data = $scope.data.currItem.gl_credence_lines;

                        if (data.length > 0) {
                            var docket_id = data[data.length - 1].docket_id;
                            var docket_code = data[data.length - 1].docket_code;
                            var docket_name = data[data.length - 1].docket_name;
                        }
                        for (var i = 0; i < rowCount; i++) {
                            var newLine = {
                                    docket_id: docket_id ? docket_id : 0,
                                    docket_code: docket_code ? docket_code : "",
                                    docket_name: docket_name ? docket_name : ""
                                }
                                ;
                            data.push(newLine);
                        }
                        $scope.gridOptions.hcApi.setRowData(data);
                        $scope.gridOptions.hcApi.setFocusedCell(data.length - rowCount, 'docket_name');
                    });
                }
                $scope.deleteRow = function () {
                    var index = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (index < 0) {
                        return swalApi.info("请选中要删除的行");
                    }
                    return swalApi.confirmThenSuccess({
                        title: "确定要删除第" + (index + 1) + "行吗?",
                        okFun: function () {
                            //函数区域
                            var rowData = $scope.gridOptions.hcApi.getRowData();
                            if (index == (rowData.length - 1)) {
                                $scope.gridOptions.api.focusedCellController.clearFocusedCell();
                            }
                            rowData.splice(index, 1);
                            $scope.gridOptions.hcApi.setRowData(rowData);
                            $scope.data.currItem.gl_credence_lines = rowData;
                        },
                        okTitle: '删除成功'
                    });
                }

                $scope.footerLeftButtons.addRow.click = $scope.addRow;
                $scope.footerLeftButtons.deleteRow.click = $scope.deleteRow;

                /**
                 * 打开来源的单据或日记账
                 */
                $scope.openOrginal_journalOrlist = openOrginal_journalOrlist;

                function openOrginal_journalOrlist() {

                    var rowNode = $scope.gridOptions.hcApi.getFocusedNode();
                    if (!rowNode)
                        return swalApi.info('请先选中要' + $scope.toolButtons.openOrginal_journalOrlist.title + '的行').then($q.reject);

                    var bizData = $scope.data.currItem;
                    var credence_type = numberApi.toNumber(bizData.credence_type);

                    switch (credence_type) {
                        case 1:
                            return swalApi.info('人工凭证无来源单据');
                        case 14:
                            openCredenceType13(bizData);
                            break;
                        default:
                            openCredenceTypeDefault(bizData);
                            break;
                    }
                }

                /**
                 * 默认打开日记账方式
                 */
                function openCredenceTypeDefault(bizData) {
                    $q.when()
                        .then(function () {
                            //查现金日记账表
                            return requestApi.post('fd_fund_business', 'search', {sqlwhere: " Gl_Credence_Head_Id =" + bizData.gl_credence_head_id})
                                .then(function (response) {
                                    if (response.fd_fund_businesss.length > 0) {
                                        return {
                                            fd_fund_business_id: response.fd_fund_businesss[0].fd_fund_business_id,
                                            fund_account_type: response.fd_fund_businesss[0].fund_account_type
                                        }
                                    }
                                    else {
                                        swalApi.info('未找到来源单据，或已被删除');
                                        return $q.reject();
                                    }
                                })
                        })
                        .then(function (data) {
                            switch (numberApi.toNumber(data.fund_account_type)) {
                                case 1: //现金日记账
                                    return openBizObj({
                                        stateName: 'financeman.fundman.cash_journal_prop',
                                        params: {
                                            id: numberApi.toNumber(data.fd_fund_business_id)
                                        }
                                    }).result;
                                case 2: //银行日记账
                                    return openBizObj({
                                        stateName: 'financeman.fundman.bank_journal_prop',
                                        params: {
                                            id: numberApi.toNumber(data.fd_fund_business_id)
                                        }
                                    }).result;
                            }
                        });
                }

                /**
                 * 打开费用凭证
                 */
                function openCredenceType13(bizData) {
                    $q
                        .when()
                        .then(function () {
                            $modal
                                .openCommonSearch({
                                    title: '费用报销列表查询',
                                    classId: 'fin_fee_bx_header',
                                    postData: {},
                                    sqlWhere: ' Gl_Credence_Head_Id= ' + bizData.gl_credence_head_id,
                                    hcDataRelationName: 'fin_fee_bx_headers',
                                    gridOptions: {
                                        columnDefs: [
                                            {
                                                type: '序号',
                                            }
                                            , {
                                                field: 'stat',
                                                headerName: '单据状态',
                                                hcDictCode: '*'
                                            }
                                            , {
                                                field: 'bx_no',
                                                headerName: '报销单号'
                                            }
                                            , {
                                                field: 'bud_type_name',
                                                headerName: '预算类别'
                                            }
                                            , {
                                                field: 'chap_name',
                                                headerName: '报销人'
                                            }
                                            , {
                                                field: 'org_name',
                                                headerName: '报销部门'
                                            }
                                            , {
                                                field: 'balance_type_name',
                                                headerName: '结算方式'
                                            }
                                            , {
                                                field: 'cyear',
                                                headerName: '年度',
                                                cellStyle: {
                                                    'text-align': 'center'
                                                }
                                            }
                                            , {
                                                field: 'cmonth',
                                                headerName: '月度',
                                                type: '数量'
                                            }
                                            , {
                                                field: 'fee_apply_no',
                                                headerName: '申请单号'
                                            }
                                            , {
                                                field: 'total_apply_amt',
                                                headerName: '报销申请总额',
                                                type: '金额'
                                            }
                                            , {
                                                field: 'total_allow_amt',
                                                headerName: '报销批准总额',
                                                type: '金额'
                                            }
                                            , {
                                                field: 'purpose',
                                                headerName: '费用用途'
                                            }
                                            , {
                                                field: 'receiver',
                                                headerName: '收款人'
                                            }
                                            , {
                                                field: 'receive_bank',
                                                headerName: '收款银行'
                                            }
                                            , {
                                                field: 'receive_accno',
                                                headerName: '收款账号'
                                            }
                                            , {
                                                field: 'creator',
                                                headerName: '创建人'
                                            }
                                            , {
                                                field: 'create_time',
                                                headerName: '创建时间'
                                            }
                                            , {
                                                field: 'credence_no',
                                                headerName: '凭证号'
                                            }
                                        ]
                                    },
                                    cellDoubleFunc: function (params) {
                                        var bx_id = numberApi.toNumber(params.node.data.bx_id);
                                        return openBizObj({
                                            stateName: 'finman.fin_fee_bx_prop',
                                            params: {
                                                id: bx_id
                                            }
                                        }).result;
                                    }
                                })
                        })
                }

                //打开来源单据按钮定义
                $scope.footerRightButtons.openOrginal_journalOrlist = {
                    title: '打开来源单据',
                    click: $scope.openOrginal_journalOrlist
                };

                /**============================ 点击事件结束=================================**/

                /**============================数据处理 ================================**/

                $scope.setBizData = function (bizData) {
                    // $scope.aa=JSON.stringify(bizData);
                    // $scope.hcSuper.setBizData(bizData); //继承基础控制器的方法，类似Java的super
                    //设置头部数据的步骤已在基础控制器实现
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.api.setRowData(bizData.gl_credence_lines);
                    countSum();//合计
                };

                /**
                 * 新建单据时初始化数据
                 * @param bizData
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData); //继承基础控制器的方法，类似Java的super
                    $scope.initData(bizData);

                    //由‘生成出纳凭证’打开
                    if ($stateParams.is_cashier === 'true') {
                        $scope.initDataFromCashier(bizData);
                    }

                    $scope.gridOptions.api.setRowData($scope.data.currItem.gl_credence_lines);
                };

                /**
                 * 复制数据
                 */
                $scope.copyBizData = function (bizData) {
                    $scope.hcSuper.copyBizData(bizData);

                    bizData.credence_no = '';

                    angular.extend(bizData, {
                        created_by: strUserName,
                        creation_date: dateApi.now(),
                        credence_date: dateApi.today(),
                        stat: 1,
                        year_month: new Date(dateApi.today()).Format('yyyy-MM'),
                        credence_type: 1,
                        is_relation: 1
                    });
                    return bizData;
                };

                /**
                 * 复制红字数据
                 * @param bizData
                 */
                $scope.redBizData = function (bizData) {
                    $scope.hcSuper.copyBizData(bizData);

                    bizData.gl_credence_lines.forEach(function (row) {
                        var copyrow = angular.copy(row);
                        row.amount_debit = -copyrow.amount_debit;
                        row.amount_credit = -copyrow.amount_credit;
                        row.amount_debit_f = -copyrow.amount_debit_f;
                        row.amount_credit_f = -copyrow.amount_credit_f;
                    });
                    $scope.data.currItem = bizData;
                    angular.extend($scope.data.currItem, {
                        created_by: strUserName,
                        creation_date: dateApi.now(),
                        credence_date: dateApi.today(),
                        stat: 1,
                        year_month: new Date(dateApi.today()).Format('yyyy-MM'),
                        credence_type: 1,
                        is_relation: 1
                    });
                    $scope.gridOptions.api.setRowData($scope.data.currItem.gl_credence_lines);
                };

                /**
                 * 由出纳凭证带出的初始化数据
                 */
                $scope.initDataFromCashier = function (bizData) {
                    var dates = [];
                    var cashier_lines = JSON.parse($stateParams.cashier_lines);

                    bizData.credence_type = 2;//系统出纳凭证

                    //取最大记账日期
                    if (cashier_lines.length == 1) {
                        bizData.credence_date = new Date(cashier_lines[0].date_fund).Format('yyyy-MM-dd');
                    } else {
                        cashier_lines.forEach(function (line) {
                            if (line.date_fund) {
                                dates.push(new Date(line.date_fund).getTime());
                            }
                        });
                        bizData.credence_date = new Date(Math.max.apply(null, dates)).Format('yyyy-MM-dd');
                    }

                    bizData.year_month = new Date(bizData.credence_date).Format('yyyy-MM');

                    bizData.gl_credence_lines = [];

                    for (var i = 0; i < cashier_lines.length; i++) {
                        var initLine = {
                            docket_name: cashier_lines[i].docket,
                            gl_account_subject_id: cashier_lines[i].gl_account_subject_id,
                            km_code: cashier_lines[i].km_code,
                            km_name: cashier_lines[i].km_name,
                            fd_fund_account_id: cashier_lines[i].fd_fund_account_id,
                            fd_fund_business_id: cashier_lines[i].fd_fund_business_id,
                            fund_account_code: cashier_lines[i].fund_account_code,
                            fund_account_name: cashier_lines[i].fund_account_name,
                            amount_debit: cashier_lines[i].amount_debit ? cashier_lines[i].amount_debit : 0,
                            amount_credit: cashier_lines[i].amount_credit ? cashier_lines[i].amount_credit : 0
                        };

                        bizData.gl_credence_lines.push(initLine);
                    }
                };

                /**
                 * 初始化数据
                 */
                $scope.initData = function (bizData) {
                    angular.extend(bizData, {
                        created_by: strUserName,
                        creation_date: dateApi.now(),
                        credence_date: dateApi.today(),
                        gl_credence_lines: [{}, {}],
                        stat: 1,
                        year_month: new Date(dateApi.today()).Format('yyyy-MM'),
                        credence_type: 1,
                        is_relation: 1
                    });

                    //查凭证字
                    return requestApi.post('gl_credence_type', 'search', {})
                        .then(function (response) {
                            $scope.data.currItem.character_id = response.gl_credence_types[0].character_id;
                            $scope.data.currItem.character_code = response.gl_credence_types[0].character_code;
                            $scope.data.currItem.character_name = response.gl_credence_types[0].character_name;
                            //组合编码和名称
                            $scope.data.currItem.character = $scope.data.currItem.character_code + ' ' + $scope.data.currItem.character_name;
                        })

                };
                /**
                 * 检查数据
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);

                    $scope.data.currItem.gl_credence_lines.forEach(function (row, rowindex) {
                        var warningStr = '：第' + (rowindex + 1) + '行';
                        if (row.gl_account_check_authrorities) {
                            if (row.gl_account_check_authrorities.is_fd_account == 2 && strApi.isNull(row.fund_account_code)) {
                                invalidBox.push('资金账号' + warningStr);
                            }
                            if (row.gl_account_check_authrorities.ac_object_calculate == 2 && strApi.isNull(row.base_ac_object_code)) {
                                invalidBox.push('往来对象' + warningStr);
                            }
                            if (row.gl_account_check_authrorities.crm_entid_calculate == 2 && strApi.isNull(row.crm_entid)) {
                                invalidBox.push('品类' + warningStr);
                            }
                            if (row.gl_account_check_authrorities.customer_calculate == 2 && strApi.isNull(row.customer_code)) {
                                invalidBox.push('客户' + warningStr);
                            }
                            if (row.gl_account_check_authrorities.vendor_calculate == 2 && strApi.isNull(row.vendor_code)) {
                                invalidBox.push('供应商' + warningStr);
                            }
                            if (row.gl_account_check_authrorities.person_calculate == 2 && strApi.isNull(row.employee_name)) {
                                invalidBox.push('个人' + warningStr);
                            }
                            if (row.gl_account_check_authrorities.dept_calculate == 2 && strApi.isNull(row.dept_code)) {
                                invalidBox.push('部门' + warningStr);
                            }
                            if (row.gl_account_check_authrorities.is_area_calculate == 2 && strApi.isNull(row.sale_area_name)) {
                                invalidBox.push('区域' + warningStr);
                            }
                        }
                    })
                    if (numberApi.notEqual($scope.total_amount_credit, $scope.total_amount_debit)) {
                        invalidBox.push('借方合计与贷方合计不相等，请检查！');
                    } else if ($scope.total_amount_credit == 0 || $scope.total_amount_debit == 0) {
                        invalidBox.push('借方合计与贷方合计不能为0，请检查！');
                    }
                };

                /**
                 * 刷新
                 */
                $scope.refresh = function () {
                    $scope.hcSuper.refresh(); //继承基础控制器的方法，类似Java的super
                };

                /**
                 * 保存数据
                 */
                $scope.saveBizData = function (saveData) {
                    $scope.hcSuper.saveBizData(saveData);

                    var gl_credence_lines = [];
                    // 把会计辅助核算权限的数组删除 ;
                    saveData.gl_credence_lines.forEach(function (row, rowindex, arr) {
                        // if (row.amount_debit === 0 || row.amount_debit === '0' || row.amount_debit == '') {
                        //     delete row.amount_debit;
                        // }
                        // if (row.amount_credit === 0 || row.amount_credit === '0'|| row.amount_credit == '') {
                        //     delete row.amount_credit;
                        // }
                        if (JSON.toString(row) != "{}") {
                            delete row.gl_account_check_authrorities;
                            gl_credence_lines.push(row);
                        }
                    });

                    saveData.gl_credence_lines = gl_credence_lines;
                };

                /**
                 * 判断明细可否编辑
                 * @param args
                 * @constructor
                 */
                function Editable(args) {
                    if (args.data.seq === "合计") {
                        return false;
                    }
                    var assess_flag = $scope.data.currItem.assess_flag ? parseInt($scope.data.currItem.assess_flag) : 0;
                    if (assess_flag === 2) {
                        return false;
                    }
                    return true;
                }

                /**
                 * 初始化
                 * @since 2019-01-26
                 */
                $scope.doInit = function () {
                    //若是红字
                    var redFrom = numberApi.toNumber($stateParams.redFrom);
                    if (redFrom) {
                        return $scope.redFrom(redFrom);
                    }
                    $scope.hcSuper.doInit();
                }


                /**
                 * 从源对象红字
                 * @param {number} srcId
                 * @return {Promise}
                 * @since 2018-12-19
                 */
                $scope.redFrom = function (srcId) {
                    var response;

                    /**
                     * 设置响应对象，然后返回
                     * @param responseToSet
                     * @return
                     */
                    function setResponse(responseToSet) {
                        return response = responseToSet;
                    }

                    /**
                     * 返回响应对象
                     * @param responseToSet
                     */
                    function getResponse() {
                        return response;
                    }

                    return $q
                        .when(srcId)
                        .then($scope.requestSelect)
                        .then(setResponse)
                        .then($scope.redBizData)
                        .then(getResponse)
                        .finally(function () {
                            $scope.data.isInsert = true;
                        });
                };


                /*----------------------逻辑计算----------------------*/
                /**
                 * 计算合计
                 */
                function countSum() {
                    $scope.total_amount_debit = numberApi.sum($scope.data.currItem.gl_credence_lines, 'amount_debit');
                    $scope.total_amount_credit = numberApi.sum($scope.data.currItem.gl_credence_lines, 'amount_credit');
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            amount_credit: $scope.total_amount_credit,
                            amount_debit: $scope.total_amount_debit
                        }
                    ]);
                }

                /**============================通用查询 ===================**/

                    //查现金日记账的router信息
                requestApi.post('base_router', 'search', {sqlwhere: " pagetitle = '现金日记账' and type = 2 "})
                    .then(function (response) {
                        if (response.base_routers.length > 0) {
                            $scope.data.cash_journal_list_router = response.base_routers[0];
                        }
                    })
                /**
                 * 通用查询设置
                 */
                $scope.commonSearchSetting = {
                    //供应商
                    chooseVendor: {
                        sqlWhere: ' usable = 2 ',
                        beforeOpen: beforeOpen,
                        afterOk: function (item) {
                            $scope.data.currLine.vendor_id = item.vendor_id;
                            $scope.data.currLine.vendor_code = item.vendor_code;
                            $scope.data.currLine.vendor_name = item.vendor_name;
                        }
                    },
                    //业务员
                    chooseEmployee: {
                        sqlWhere: ' actived = 2 ',
                        beforeOpen: beforeOpen,
                        afterOk: function (item) {
                            $scope.data.currLine.employee_name = item.employee_name;
                            $scope.data.currLine.employee_id = item.employee_id;
                            $scope.data.currLine.employee_code = item.employee_code;
                        }
                    },
                    //客户
                    chooseCustomer: {
                        sqlWhere: ' usable = 2 ',
                        beforeOpen: beforeOpen,
                        afterOk: function (item) {
                            $scope.data.currLine.customer_name = item.customer_name;
                            $scope.data.currLine.customer_code = item.customer_code;
                            $scope.data.currLine.customer_id = item.customer_id;
                        }
                    },
                    //现金流量
                    chooseGl_cash_report_set: {
                        beforeOpen: beforeOpen,
                        afterOk: function (item) {
                            $scope.data.currLine.gl_cash_report_set_id = item.gl_cash_report_set_id;
                            $scope.data.currLine.obj_code = item.obj_code;
                            $scope.data.currLine.obj_name = item.obj_name;
                        }
                    },
                    //部门
                    chooseDept: {
                        beforeOpen: beforeOpen,
                        afterOk: function (item) {
                            $scope.data.currLine.dept_id = item.dept_id;
                            $scope.data.currLine.dept_code = item.dept_code;
                            $scope.data.currLine.dept_name = item.dept_name;
                        }
                    },
                    //区域
                    chooseSale_area: {
                        beforeOpen: beforeOpen,
                        afterOk: function (item) {
                            $scope.data.currLine.sale_area_id = item.sale_area_id;
                            $scope.data.currLine.sale_area_code = item.sale_area_code;
                            $scope.data.currLine.sale_area_name = item.sale_area_name;
                        }
                    }
                    ,
                    //往来对象
                    chooseBase_ac_object: {
                        beforeOpen: beforeOpen,
                        afterOk: function (item) {
                            $scope.data.currLine.base_ac_object_code = item.base_ac_object_code;
                            $scope.data.currLine.base_ac_object_name = item.base_ac_object_name;
                            $scope.data.currLine.base_ac_object_id = item.base_ac_object_id;
                        }
                    },
                    //资金账户
                    choose_fund_account: {
                        beforeOpen: beforeOpen,
                        sqlWhere: ' fund_account_status = 2 ',
                        afterOk: function (response) {
                            $scope.data.currLine.fd_fund_account_id = response.fd_fund_account_id;
                            $scope.data.currLine.fund_account_code = response.fund_account_code;
                            $scope.data.currLine.fund_account_name = response.fund_account_name;
                        }
                    }
                };

                /**
                 *将凭证编码和名称拼接
                 */
                $scope.$watch('data.currItem.character_code + data.currItem.character_name', function (newVal) {
                    $scope.data.currItem.character_codename = newVal;
                });

                /**
                 * 记账日期值改变事件
                 */
                $scope.dateChangeEvent = function () {
                    if ($scope.data.currItem.credence_date) {
                        $scope.data.currItem.year_month
                            = new Date($scope.data.currItem.credence_date).Format('yyyy-MM');
                    }
                };

                /**
                 * 打开通用查询前先检查是否有选中行
                 * @returns {boolean}
                 */
                function beforeOpen() {
                    if (strApi.isNull($scope.data.currLine.rowIndex)) {
                        swalApi.info('请先选择要编辑的行');
                        return false;
                    }
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