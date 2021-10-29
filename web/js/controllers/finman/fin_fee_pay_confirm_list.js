/**
 * 费用支付确认
 * 2018-11-29
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi', 'loopApi', 'numberApi', 'dateApi'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi, loopApi, numberApi, dateApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.gridOptions = {
                    //suppressRowTransform: true,
                    hcEvents: {
                        selectionChanged: function (args) {
                            $scope.data.currItem.mkt_payofmkt_pays = $scope.gridOptions.hcApi.getRowData();

                            //当前焦点单元格信息
                            var curr_node;
                            if (!$scope.gridOptions.hcApi.getFocusedNode()) {
                                $scope.gridOptions.hcApi.setFocusedCell(0, 'cyear');
                            }
                            curr_node = $scope.gridOptions.hcApi.getFocusedNode();

                            var curr_data = $scope.gridOptions.hcApi.getFocusedData();

                            var curr_field;
                            if ($scope.gridOptions.api.getFocusedCell() == null) {
                                curr_field = $scope.gridOptions.columnDefs[0].field;
                            } else {
                                curr_field = $scope.gridOptions.api.getFocusedCell().column.colId;
                            }

                            var source_bill_no = curr_data.source_bill_no;

                            loopApi.forLoop($scope.data.currItem.mkt_payofmkt_pays.length, function (i) {
                                //选中或取消选中同一单据的所有行
                                if ($scope.data.currItem.mkt_payofmkt_pays[i].source_bill_no == source_bill_no) {
                                    var node = $scope.gridOptions.api.getRowNode(i);

                                    if (curr_node.isSelected()) {
                                        if (curr_field !== 'temp') {
                                            node.setSelected(true);
                                        }
                                        //同步资金账户
                                        $scope.accOfHeadToAccOfLine(true);
                                    } else {
                                        if (curr_field !== 'temp') {
                                            node.setSelected(false);
                                        }
                                        //取消同步资金账户
                                        $scope.accOfHeadToAccOfLine(false);
                                    }
                                }
                            });

                            //付款合计
                            $scope.calTotal();

                            var selectedNodes = $scope.gridOptions.api.getSelectedNodes();

                            //默认选中的第一行的结算方式
                            if (selectedNodes.length) {
                                $scope.data.currItem.base_balance_type_id
                                    = selectedNodes[0].data.base_balance_type_id;

                                //查结算方式code，name
                                if ($scope.data.currItem.base_balance_type_id) {
                                    requestApi.post('base_balance_type', 'select',
                                        {base_balance_type_id: $scope.data.currItem.base_balance_type_id})
                                        .then(function (response) {
                                            $scope.data.currItem.settlement_type = response.settlement_type;
                                            $scope.data.currItem.balance_type_code = response.balance_type_code;
                                            $scope.data.currItem.balance_type_name = response.balance_type_name;
                                        })
                                }
                            } else {
                                //无勾选，清空结算方式
                                $scope.data.currItem.base_balance_type_id = 0;
                                $scope.data.currItem.settlement_type = 0;
                                $scope.data.currItem.balance_type_code = '';
                                $scope.data.currItem.balance_type_name = '';
                            }
                        }
                    },
                    columnDefs: [
                        {
                            field: 'merge_bx_no',
                            headerName: '报销单号',
                            pinned: 'left',
                            checkboxSelection: true,
                            rowSpan: function (params) {
                                if (params.data.merge_bx_no) {
                                    return params.data.count_seq;
                                }
                            },
                            /* cellClassRules: {
                             'show-cell': 'value !== undefined'
                             },
                             cellStyle: function (params) {
                             var style = {'text-align': 'center'};
                             if(params.data.count_seq > 1){
                             style['line-height'] = params.data.count_seq * params.node.rowHeight + 'px'

                             }
                             return style;
                             } */
                        },
                        {
                            field: 'temp',
                            headerName: '',
                            pinned: 'left',
                            checkboxSelection: true,
                            cellStyle: {'text-align': 'center'}
                        }
                        , {
                            field: 'cyear',
                            headerName: '年度'
                        }
                        , {
                            field: 'cmonth',
                            headerName: '月度'
                        }
                        , {
                            field: 'balance_type_name',
                            headerName: '结算方式'
                        }
                        , {
                            field: 'pay_amt',
                            headerName: '本次付款金额',
                            type: '金额',
                            editable: true,
                            onCellValueChanged: function () {
                                $scope.calTotal()
                            }
                        }
                        , {
                            field: 'source_amt',
                            headerName: '申请报销金额',
                            type: '金额'
                        }
                        , {
                            field: 'payed_amt',
                            headerName: '已付款金额',
                            type: '金额'
                        }
                        , {
                            field: 'canpay_amt',
                            headerName: '剩余金额',
                            type: '金额'
                        }
                        , {
                            field: 'fund_account_code',
                            headerName: '资金账户编码'
                        }
                        , {
                            field: 'fund_account_name',
                            headerName: '资金账户名称'
                        }
                        , {
                            field: 'note',
                            headerName: '用途'
                        }
                        , {
                            field: 'org_name',
                            headerName: '部门名称'
                        }
                        , {
                            field: 'crm_entid',
                            headerName: '品类',
                            hcDictCode: '*'
                        }
                        , {
                            field: 'receiver_type',
                            headerName: '收款对象类型',
                            hcDictCode: 'useobject_type'
                        }
                        , {
                            field: 'receiver_name',
                            headerName: '收款对象'
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
                            field: 'fee_name',
                            headerName: '费用项目名称'
                        }
                    ],
                    hcObjType: 18122802,
                    hcRequestAction: 'getsourcebill',
                    hcDataRelationName: 'mkt_payofmkt_pays',

                    hcBeforeRequest: function (searchObj) {
                        searchObj.cyear = $scope.data.searchItem.cyear;
                        searchObj.cmonth = $scope.data.searchItem.cmonth;
                        searchObj.base_balance_type_id = $scope.data.searchItem.base_balance_type_id;
                        searchObj.source_bill_no = $scope.data.searchItem.source_bill_no;
                        searchObj.org_id = $scope.data.searchItem.org_id;
                        searchObj.chap_name = $scope.data.searchItem.chap_name;
                        searchObj.note = $scope.data.searchItem.note;
                    },
                    hcAfterRequest: function (data) {
                        $scope.data.currItem.mkt_payofmkt_pays = data.mkt_payofmkt_pays;

                        $scope.calTotal();
                    }
                };

                $scope.data = {};
                $scope.data.searchItem = {};
                $scope.data.currItem = {};


                /*----------------------通用查询开始----------------------*/
                /**
                 * 通用查询设置
                 */
                $scope.commonSearchSetting = {
                    //部门
                    dept: {
                        afterOk: function (response) {
                            $scope.data.searchItem.org_id = response.dept_id;
                            $scope.data.searchItem.org_code = response.dept_code;
                            $scope.data.searchItem.org_name = response.dept_name;
                        }
                    },
                    //结算方式-查询条件
                    base_balance_type_search: {
                        afterOk: function (response) {
                            $scope.data.searchItem.balance_type_name = response.balance_type_name;
                            $scope.data.searchItem.base_balance_type_id = response.base_balance_type_id;
                        }
                    },
                    //结算方式-底部信息
                    base_balance_type: {
                        afterOk: function (response) {
                            $scope.data.currItem.balance_type_name = response.balance_type_name;
                            $scope.data.currItem.base_balance_type_id = response.base_balance_type_id;
                            $scope.data.currItem.settlement_type = response.settlement_type;
                        }
                    }
                };

                /**
                 * 资金账户通用查询
                 */
                $scope.getCommonSearchSetting_fd_account = function () {
                    var sqlwhere = ' fund_account_status = 2';
                    var acc_type = 0;
                    switch (numberApi.toNumber($scope.data.currItem.settlement_type)) {
                        case 1://现金
                            acc_type = 1;
                            break;
                        case 2://银行
                            acc_type = 2;
                            break;
                        case 3://票据
                            acc_type = 3;
                            break;
                    }
                    sqlwhere += ' and fund_account_type = ' + acc_type;
                    return {
                        beforeOpen: function () {
                            if (numberApi.toNumber($scope.data.currItem.base_balance_type_id) == 0) {
                                swalApi.info('请选择结算方式！');
                                return true;
                            }
                        },
                        sqlWhere: sqlwhere,
                        afterOk: function (response) {
                            $scope.data.currItem.fd_fund_account_id = response.fd_fund_account_id;
                            $scope.data.currItem.fund_account_code = response.fund_account_code;
                            $scope.data.currItem.fund_account_name = response.fund_account_name;

                            $scope.accOfHeadToAccOfLine(true);
                        }
                    };
                };


                /*----------------------通用查询结束----------------------*/

                controllerApi.run({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                $scope.data.searchItem = {
                    cyear: new Date().getFullYear(),
                    cmonth: new Date().getMonth() + 1
                };

                $scope.data.currItem = {
                    pay_date: new Date().Format('yyyy-MM-dd'),
                };

                /**
                 * 同步表单资金账户到选中行资金帐户
                 */
                $scope.accOfHeadToAccOfLine = function (sync) {
                    var refreshNodes = [];
                    //列表选中行
                    var selectedNodes = $scope.gridOptions.api.getSelectedNodes();
                    //非选中行
                    var noSelectedNodes = [];
                    $scope.gridOptions.api.getModel().forEachNode(function (node) {
                        if (!node.isSelected()) {
                            noSelectedNodes.push(node);
                        }
                    });

                    if (sync) {//同步
                        if (selectedNodes.length) {
                            loopApi.forLoop(selectedNodes.length, function (i) {
                                selectedNodes[i].data.fd_fund_account_id = $scope.data.currItem.fd_fund_account_id;
                                selectedNodes[i].data.fund_account_code = $scope.data.currItem.fund_account_code;
                                selectedNodes[i].data.fund_account_name = $scope.data.currItem.fund_account_name;
                            });
                            refreshNodes = selectedNodes.slice(0);
                        }
                    } else {//取消同步
                        if (noSelectedNodes.length) {
                            loopApi.forLoop(noSelectedNodes.length, function (i) {
                                noSelectedNodes[i].data.fd_fund_account_id = 0;
                                noSelectedNodes[i].data.fund_account_code = '';
                                noSelectedNodes[i].data.fund_account_name = '';
                            })
                        }
                        refreshNodes = noSelectedNodes.slice(0);
                    }

                    //刷新选中行的指定列
                    var columns = $scope.gridOptions.columnApi.getColumns(
                        ['fund_account_code', 'fund_account_name']
                    );
                    $scope.gridOptions.api.refreshCells(
                        {rowNodes: refreshNodes, columns: columns}
                    );
                };

                /**
                 * 条件查询
                 */
                $scope.searchByCon = function () {
                    $scope.gridOptions.hcApi.search();
                };

                /**
                 * 计算合计付款金额
                 */
                $scope.calTotal = function () {
                    //计算选中行合计
                    var selectedRows = $scope.gridOptions.api.getSelectedRows();
                    if (selectedRows.length) {
                        $scope.data.currItem.total_pay_amt
                            = numberApi.sum(selectedRows, 'pay_amt');
                    } else {
                        $scope.data.currItem.total_pay_amt = 0;
                    }
                };

                /**
                 * 确认
                 */
                $scope.pay_confirm = function () {
                    $scope.gridOptions.api.stopEditing();
                    var invalidBox = [];

                    //校验是否选中行
                    var selectedNodes = $scope.gridOptions.api.getSelectedNodes();
                    if (!selectedNodes.length) {
                        invalidBox.push('请选中要确认的行！');
                    }
                    //必填项校验
                    var requiredInvalidModelControllers = $scope.form.$error.required;
                    if (requiredInvalidModelControllers && requiredInvalidModelControllers.length) {
                        invalidBox.push('以下内容为必填项，请补充完整');
                        requiredInvalidModelControllers.forEach(function (modelController) {
                            //获取【模型控制器】的【输入组件控制器】的【文本标签】
                            invalidBox.push(modelController.getInputController().getLabel());
                        });
                    }

                    if (invalidBox.length) {
                        return swalApi.info(invalidBox);
                    }

                    //确认
                    var selectedData = $scope.gridOptions.api.getSelectedRows();
                    swalApi.confirmThenSuccess({
                        title: '确定要支付吗？',
                        okFun: function () {
                            $scope.data.currItem.mkt_payofmkt_pays = angular.copy(selectedData);

                            return requestApi.post('mkt_pay', 'settlepay', $scope.data.currItem)
                                .then(function () {
                                    //清空底部确认信息
                                    $scope.data.currItem.pay_date = dateApi.today();

                                    $scope.data.currItem.base_balance_type_id = 0;
                                    $scope.data.currItem.balance_type_code = '';
                                    $scope.data.currItem.balance_type_name = '';

                                    $scope.data.currItem.total_pay_amt = 0;

                                    $scope.data.currItem.fd_fund_account_id = 0;
                                    $scope.data.currItem.fund_account_code = '';
                                    $scope.data.currItem.fund_account_name = '';

                                    $scope.gridOptions.hcApi.search();
                                })
                        },
                        okTitle: '确认成功'
                    })
                };

                //工具栏按钮
                $scope.toolButtons.pay_search = {
                    title: '查询',
                    icon: 'iconfont hc-search',
                    click: function () {
                        $scope.searchByCon();
                    }
                };
                $scope.toolButtons.refresh = {
                    title: '刷新',
                    icon: 'iconfont hc-refresh',
                    click: function () {
                        $scope.gridOptions.hcApi.search()
                    }

                };
                $scope.toolButtons.pay_confirm = {
                    title: '确认',
                    icon: 'iconfont hc-selected',
                    click: $scope.pay_confirm
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
