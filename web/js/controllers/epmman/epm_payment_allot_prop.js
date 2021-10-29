/**
 *  项目到款认领
 *  2019/7/10.
 *  zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', '$modal', 'numberApi', 'requestApi', '$q'],
    function (module, controllerApi, base_obj_prop, swalApi, $modal, numberApi, requestApi, $q) {


        var controller = [
            '$scope',
            function ($scope) {
                /**
                 * 制单、不是合计行可编辑
                 */
                function editable(args) {
                    return !args.node.rowPinned;
                }

                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /*----------------------------------表格定义-------------------------------------------*/
                /**
                 * 表格定义  "基本详情"
                 */
                $scope.gridOptions = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [{
                        type: '序号'
                    }, {
                        headerName: '合同信息',
                        children: [
                            {
                                field: 'contract_code',
                                headerName: '合同编码',
                                hcRequired: true,
                                editable: editable,
                                onCellDoubleClicked: function (args) {
                                    if($scope.hcSuper.isFormReadonly()){
                                        return;
                                    }
                                    $scope.chooseContract(args);
                                },
                                onCellValueChanged: function (args) {
                                    if (args.newValue === args.oldValue) {
                                        return;
                                    }
                                    if (args.newValue == "" || args.newValue == undefined || args.newValue == null) {
                                        args.data.contract_id = undefined;
                                        args.data.contract_name = undefined;
                                        args.data.project_code = undefined;
                                        args.data.project_name = undefined;
                                        args.data.contract_amt = undefined;
                                        args.data.contract_amt_received = undefined;
                                        return;
                                    }
                                    $scope.valueContract(args.newValue, args);
                                }
                            }, {
                                field: 'contract_name',
                                headerName: '合同名称'
                            }, {
                                field: 'project_code',
                                headerName: '项目编码'
                            }, {
                                field: 'project_name',
                                headerName: '项目名称'
                            }, {
                                field: 'contract_amt',
                                headerName: '合同金额',
                                type : '金额'
                            }, {
                                field: 'contract_amt_received',
                                headerName: '已回款金额',
                                type : '金额'
                            }
                        ]
                    }, {
                        headerName: '认款信息',
                        children: [
                            {
                                field: 'payment_type',
                                headerName: '认款款项',
                                hcDictCode: 'epm.payment_type',
                                editable: editable
                            }, {
                                field: 'allot_amt',
                                headerName: '认款金额',
                                type: '金额',
                                hcRequired: true,
                                editable: editable,
                                onCellValueChanged: function (args) {
                                    $scope.valueChange(args);
                                }
                            }, {
                                field: 'remark',
                                headerName: '备注',
                                width: 170,
                                editable: editable
                            }
                        ]
                    }]
                };

                /*----------------------------------通用查询-------------------------------------------*/

                /**
                 * 查客户信息
                 */
                $scope.commSearchCustomerOrg = {
                    postData: {
                        search_flag: 124
                    },
                    sqlWhere: 'valid = 2 and usable = 2 ',
                    afterOk: function (result) {
                        $scope.data.currItem.customer_id = result.customer_id;
                        $scope.data.currItem.customer_code = result.customer_code;
                        $scope.data.currItem.customer_name = result.customer_name;
                    }
                };

                /**
                 * 双击事件合同查询
                 */
                $scope.chooseContract = function (args) {
                    $scope.gridOptions.api.stopEditing();
                    if ($scope.data.currItem.customer_code == undefined || $scope.data.currItem.customer_code == null || $scope.data.currItem.customer_code == "") {
                        swalApi.info('请先选择客户');
                        return;
                    }
                    return $modal.openCommonSearch({
                        classId: 'epm_project_contract',
                        gridOptions: {
                            columnDefs: [
                                {
                                    field: "contract_code",
                                    headerName: "工程合同编号"
                                },
                                {
                                    field: "contract_name",
                                    headerName: "工程合同名称"
                                },
                                {
                                    field: "project_code",
                                    headerName: "项目编码"
                                },
                                {
                                    field: "project_name",
                                    headerName: "项目名称"
                                }
                            ]
                        },
                        postData: {
                            customer_id: $scope.data.currItem.customer_id,
                            flag: 5
                        }
                    })
                        .result//响应数据
                        .then(function (result) {
                            args.data.contract_id = result.contract_id;
                            args.data.contract_code = result.contract_code;
                            args.data.contract_name = result.contract_name;
                            args.data.project_code = result.project_code;
                            args.data.project_name = result.project_name;
                            args.data.contract_amt = result.contract_amt;
                            requestApi
                                .post({
                                    classId: "epm_project_contract",
                                    action: 'selectamtreceived',
                                    data: {
                                        contract_id : result.contract_id
                                    }
                                })
                                .then(function(data){
                                    args.data.contract_amt_received = data.contract_amt_received;
                                    $scope.gridOptions.api.refreshCells({
                                        rowNodes: [args.node],
                                        force: true,//改变了值才进行刷新
                                        columns: $scope.gridOptions.columnApi.getColumns(['contract_code'
                                            , 'contract_name', 'project_code', 'project_name', 'contract_amt', 'contract_amt_received'])
                                    });
                                });
                        });
                };

                /**
                 * 复制合同编码查询
                 */
                $scope.valueContract = function (code, args) {
                    var postData = {
                        classId: "epm_project_contract",
                        action: 'search',
                        data: {sqlwhere: "contract_code = '" + code + "'"}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            if (data.epm_project_contracts.length > 0) {//查询回来是否有数据
                                if (data.epm_project_contracts[0].customer_id == $scope.data.currItem.customer_id) {//查询的合同对应的项目是否是当前客户
                                    if (data.epm_project_contracts[0].completed_date == "") {//合同是否结案
                                        args.data.contract_id = data.epm_project_contracts[0].contract_id;
                                        args.data.contract_code = data.epm_project_contracts[0].contract_code;
                                        args.data.contract_name = data.epm_project_contracts[0].contract_name;
                                        args.data.project_code = data.epm_project_contracts[0].project_code;
                                        args.data.project_name = data.epm_project_contracts[0].project_name;
                                        args.data.contract_amt = data.epm_project_contracts[0].contract_amt;
                                        requestApi
                                            .post({
                                                classId: "epm_project_contract",
                                                action: 'selectamtreceived',
                                                data: {
                                                    contract_id : data.epm_project_contracts[0].contract_id
                                                }
                                            })
                                            .then(function(data){
                                                args.data.contract_amt_received = data.contract_amt_received;
                                                $scope.gridOptions.api.refreshCells({
                                                    rowNodes: [args.node],
                                                    force: true,//改变了值才进行刷新
                                                    columns: $scope.gridOptions.columnApi.getColumns(['contract_amt_received'])
                                                });
                                            });
                                    } else {
                                        swalApi.info("合同已结案");
                                        args.data.contract_code = undefined;
                                    }
                                } else {
                                    swalApi.info("该合同不属于当前用户的可操作范围");
                                    args.data.contract_code = undefined;
                                }
                            } else {
                                swalApi.info("合同编码【" + code + "】不存在");
                                args.data.contract_code = undefined;
                            }
                            $scope.gridOptions.api.refreshCells({
                                rowNodes: [args.node],
                                force: true,//改变了值才进行刷新
                                columns: $scope.gridOptions.columnApi.getColumns(['contract_code'
                                    , 'contract_name', 'project_code', 'project_name', 'contract_amt'])
                            });
                        });
                };
                /*----------------------------------------计算方法定义-------------------------------------------*/
                /**
                 * 校验输入是否为正确的数字
                 */
                $scope.valueChange = function (args) {
                    if (args.data.allot_amt != undefined && args.data.allot_amt != null) {
                        if (numberApi.isNum(Number(args.data.allot_amt))) {
                            if (args.data.allot_amt <= 0) {
                                args.data.allot_amt = undefined;
                                swalApi.info('请输入大于0的数字');
                            }
                        } else {
                            args.data.allot_amt = undefined;
                            swalApi.info('输入的不是数字，请重新输入');
                        }
                    }
                    $scope.calSum();
                };

                /**
                 * 计算合计数据
                 */
                $scope.calSum = function () {
                    //总认款金额
                    $scope.data.currItem.allot_amt
                        = numberApi.sum($scope.data.currItem.epm_payment_allot_lines, 'allot_amt');
                    //计算行
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            allot_amt: numberApi.sum($scope.data.currItem.epm_payment_allot_lines, 'allot_amt')//本次认款金额
                        }
                    ]);
                };

                /*----------------------------------按钮方法数据 定义-------------------------------------------*/
                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    //基本详情
                    bizData.epm_payment_allot_lines = [];
                    bizData.payment_allot_stat = 1;
                    $scope.chooseData();
                    $scope.addLine();
                };

                /**
                 * 到款单号查询
                 */
                $scope.chooseData = function () {
                    $modal.openCommonSearch({
                        classId: 'epm_payment_import',
                        sqlWhere: ' unallot_amt > 0 ',
                        title : '到款单查询',
                        gridOptions: {
                            columnDefs: [
                                {
                                    headerName: "到款记录编号",
                                    field: "payment_import_code"
                                }, {
                                    headerName: "银行流水号",
                                    field: "serial_number"
                                }
                                , {
                                    headerName: "收款日期",
                                    field: "receive_date",
                                    type: '日期'
                                }
                                , {
                                    headerName: "收款金额",
                                    field: "receive_amt",
                                    type: '金额'
                                }
                                , {
                                    headerName: "币别名称",
                                    field: "currency_name"
                                }
                                , {
                                    headerName: "事业部",
                                    field: "division_name"
                                }
                                , {
                                    headerName: "汇款账号",
                                    field: "remit_account"
                                }
                                , {
                                    headerName: "汇率",
                                    field: "exchange_rate",
                                    cellStyle: {
                                        'text-align': 'center'
                                    }
                                }
                                , {
                                    headerName: "收款公司",
                                    field: "receive_unit_name"
                                }
                                , {
                                    headerName: "汇款单位编码",
                                    field: "remit_unit_code"
                                }
                                , {
                                    headerName: "汇款单位旧编码",
                                    field: "remit_unit_old_code"
                                }
                                , {
                                    headerName: "汇款单位名称",
                                    field: "remit_unit_name"
                                }
                            ]
                        }
                    })
                        .result//响应数据
                        .then(function (result) {
                            $scope.data.currItem.payment_import_id = result.payment_import_id;
                            $scope.data.currItem.payment_import_code = result.payment_import_code;
                            $scope.data.currItem.serial_number = result.serial_number;
                            $scope.data.currItem.receive_bank = result.receive_bank;
                            $scope.data.currItem.receive_account = result.receive_account;
                            $scope.data.currItem.receive_unit_name = result.receive_unit_name;
                            $scope.data.currItem.receive_date = result.receive_date;
                            $scope.data.currItem.remit_unit_code = result.remit_unit_code;
                            $scope.data.currItem.remit_unit_old_code = result.remit_unit_old_code;
                            $scope.data.currItem.remit_unit_name = result.remit_unit_name;
                            $scope.data.currItem.receive_amt = result.receive_amt;
                            $scope.data.currItem.currency_name = result.currency_name;
                            $scope.data.currItem.exchange_rate = result.exchange_rate;
                            $scope.data.currItem.can_allot_amt = result.unallot_amt;
                            $scope.data.currItem.payment_remark = result.payment_remark;
                            $scope.data.currItem.division_name = result.division_name;//事业部
                            $scope.data.currItem.remit_account = result.remit_account;//汇款账号
                            $scope.data.currItem.customer_id = result.customer_id;//
                            $scope.data.currItem.customer_code = result.customer_code;//
                            $scope.data.currItem.customer_name = result.customer_name;//
                        }, function (line) {
                            if (line == "头部关闭") {
                                this.window.opener = null;
                                window.close();
                            }
                        });
                };

                /**
                 * 保存验证
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    if ($scope.data.currItem.allot_amt > $scope.data.currItem.can_allot_amt) {
                        invalidBox.push('总的认款金额不能大于可认款金额');
                    }
                    return invalidBox;
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    //设置基本经历
                    $scope.gridOptions.hcApi.setRowData(bizData.epm_payment_allot_lines);
                    refAmtrak();
                };

                /**
                 * 每次进入单据查询最新的可认款金额数据
                 */
                function refAmtrak() {
                    return requestApi
                        .post({
                            classId: 'epm_payment_import',
                            action: 'search',
                            data: {
                                sqlwhere: ' payment_import_id = ' + $scope.data.currItem.payment_import_id
                            }
                        })
                        .then(function (respon) {
                            if(respon.epm_payment_imports.length > 0){
                                $scope.data.currItem.can_allot_amt = numberApi.sum(respon.epm_payment_imports[0].unallot_amt, $scope.data.currItem.allot_amt);
                            }
                            $scope.calSum();
                        });
                }

                /**
                 * 保存请求后的处理
                 * @param responseData
                 */
                $scope.doAfterSave = function (responseData) {
                    if (responseData.flag == 99) {
                        $scope.data.currItem.can_allot_amt = responseData.tatol_amt;
                        swalApi.info(responseData.sqlwhere);
                        return $q.reject();
                    }
                };


                /*----------------------------------按钮及标签 定义-------------------------------------------*/

                /*底部左边按钮*/
                $scope.footerLeftButtons.addRow.click = function () {
                    $scope.addLine && $scope.addLine();
                };
                $scope.footerLeftButtons.addRow.hide = function () {
                    return $scope.data.currItem.stat > 1;
                };
                $scope.footerLeftButtons.deleteRow.click = function () {
                    $scope.delLine && $scope.delLine();
                };
                $scope.footerLeftButtons.deleteRow.hide = function () {
                    return $scope.data.currItem.stat > 1;
                };
                /*----------------------------------按钮方法 定义-------------------------------------------*/

                /**
                 * 添加明细行
                 */
                $scope.addLine = function () {
                    $scope.gridOptions.api.stopEditing();
                    $scope.data.currItem.epm_payment_allot_lines.push({});
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_payment_allot_lines);
                };

                /**
                 * 删除行培训经历
                 */
                $scope.delLine = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.epm_payment_allot_lines.splice(idx, 1);
                        if($scope.data.currItem.epm_payment_allot_lines.length == 0){
                            $scope.data.currItem.epm_payment_allot_lines.push({});
                        }
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_payment_allot_lines);
                        $scope.calSum();
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

    });