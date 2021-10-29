/**
 * 生成出纳凭证-列表页
 * 2019-01-25
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'openBizObj', 'swalApi', 'loopApi', 'requestApi', 'numberApi'],
    function (module, controllerApi, base_diy_page, openBizObj, swalApi, loopApi, requestApi, numberApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.gridOptions = {
                    onRowDoubleClicked: function (args) {
                        var stateName = '';
                        switch(numberApi.toNumber(args.data.fund_account_type)){
                            case 1: //现金日记账
                                return openBizObj({
                                    stateName: 'financeman.fundman.cash_journal_prop',
                                    params: {
                                        id: numberApi.toNumber(args.data.fd_fund_business_id)
                                    }
                                }).result;
                            case 2: //银行日记账
                                return openBizObj({
                                    stateName: 'financeman.fundman.bank_journal_prop',
                                    params: {
                                        id: numberApi.toNumber(args.data.fd_fund_business_id)
                                    }
                                }).result;
                        }

                    },
                    columnDefs : [
                        {
                            type: '序号',
                            checkboxSelection: true
                        }
                        , {
                            field: 'ontheway_billno',
                            headerName: '业务类型',
                            hcDictCode: 'cashier_order_type'
                        }
                        , {
                            field: 'ordinal_no',
                            headerName: '流水号'
                        }
                        , {
                            field: 'date_fund',
                            headerName: '记账日期',
                            type: '日期'
                        }
                        , {
                            field: 'year_month',
                            headerName: '记账月份'
                        }
                        , {
                            headerName: '资金账号',
                            children: [{
                                field: 'fund_account_code',
                                headerName: '编码'
                            },{
                                field: 'fund_account_name',
                                headerName: '名称'
                            }]
                        }
                        , {
                            field: 'amount_debit',
                            headerName: '借方金额',
                            type: '金额'
                        }
                        , {
                            field: 'amount_credit',
                            headerName: '贷方金额',
                            type: '金额'
                        }
                        , {
                            field: 'docket',
                            headerName: '摘要'
                        }
                        , {
                            headerName: '部门',
                            children: [{
                                field: 'dept_code',
                                headerName: '编码'
                            },{
                                field: 'dept_name',
                                headerName: '名称'
                            }]
                        }
                        , {
                            headerName: '结算方式',
                            children: [{
                                field: 'balance_type_code',
                                headerName: '编码'
                            },{
                                field: 'balance_type_name',
                                headerName: '名称'
                            }]
                        }
                        , {
                            field: 'bill_no',
                            headerName: '票据号'
                        }
                        , {
                            field: 'created_by',
                            headerName: '创建人'
                        }
                        , {
                            field: 'syscreate_type',
                            headerName: '来源单据类型',
                            hcDictCode: '*'
                        }
                    ],
                    hcObjType: 19012501,
                    hcRequestAction: 'cashiercredencesearch'
                };

                $scope.data = $scope.data || {};
                $scope.data.currItem = $scope.data.currItem || {};

                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                /**
                 * 生成凭证
                 */
                $scope.generate_credence = function () {
                    var selectedNodes = $scope.gridOptions.api.getSelectedNodes();
                    var selectedRows = $scope.gridOptions.api.getSelectedRows();

                    if(!selectedNodes.length){
                        return swalApi.info('请选择要生成凭证的行');
                    }

                    if(selectedRows.length > 1) {
                        for (var i = 0; i < selectedRows.length; i++) {
                            if (i > 0 && selectedRows[i].ontheway_billno != selectedRows[i - 1].ontheway_billno) {
                                return swalApi.info('第' + (selectedNodes[i - 1].rowIndex + 1) + '行与'
                                    + (selectedNodes[i].rowIndex + 1) + '行业务类型不同，请重新选择');
                            }
                        }
                    }

                    loopApi.forLoop(selectedRows.length, function (i) {
                        //查询资金账号对应的会计科目
                        if(selectedRows[i].fd_fund_account_id){
                            return requestApi.post('fd_fund_account', 'select', {
                                fd_fund_account_id: selectedRows[i].fd_fund_account_id
                            }).then(function (data) {
                                selectedRows[i].gl_account_subject_id = data.gl_account_subject_id;
                                selectedRows[i].km_code = data.subject_code;
                                selectedRows[i].km_name = data.subject_name;
                            })
                        }
                    });

                    openBizObj({
                        stateName: 'financeman.glman.gl_credence_prop',
                        params: {
                            openedByListPage: false,
                            is_cashier: true,
                            cashier_lines: JSON.stringify(selectedRows)
                        }
                    }).result.finally($scope.gridOptions.hcApi.search);
                };

                //按钮
                $scope.toolButtons = {
                    search: {
                        title: '筛选',
                        icon: 'iconfont hc-shaixuan',
                        click: function () {
                            //用表格产生条件，并查询
                            return $scope.gridOptions.hcApi.searchByGrid();
                        }
                    },
                    export: {
                        title: '导出',
                        icon: 'iconfont hc-daochu',
                        click: function () {
                            return $scope.gridOptions.hcApi.exportToExcel();
                        }
                    },
                    refresh: {
                        title: '刷新',
                        icon: 'iconfont hc-refresh',
                        click: function () {
                            return $scope.gridOptions.hcApi.search();
                        }
                    },
                    generate_credence: {
                        title: '生成凭证',
                        icon: 'iconfont hc-add',
                        click: function () {
                            return $scope.generate_credence && $scope.generate_credence();
                        }
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
