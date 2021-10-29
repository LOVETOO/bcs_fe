/**
 * 客户发货余额报表
 * date:2018-11-26
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi','numberApi','openBizObj'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi,numberApi,openBizObj) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.data = {};
                $scope.data.currItem = {};
                $scope.gridOptions = {
                    columnDefs: [{
                        id:'seq',
                        type: '序号'
                    }, {
                        headerName: "客户编码",
                        field: "customer_code"
                    },{
                        id:'customer_name',
                        headerName: "客户名称",
                        field: "customer_name"
                    },
                        {
                            id:'crm_entid',
                            headerName: "品类",
                            field: "crm_entid",
                            hcDictCode:'crm_entid'
                        },
                        {
                            id:'currency_name',
                            headerName: "货币",
                            field: "currency_name"
                        },
                        {
                            id:'believe_amount',
                            headerName: "信用额",
                            field: "believe_amount",
                            type:"金额"
                        },
                        {
                            id:'actual_total',
                            headerName: "销售回款",
                            field: "actual_total",
                            type:"金额",
                            onCellDoubleClicked:function (args) {
                                showActualTotal(args);
                            }
                        },
                        {
                            id:'invoice_receivable',
                            headerName: "其它应收款",
                            field: "invoice_receivable",
                            type:"金额",
                            onCellDoubleClicked:function (args) {
                                showInvoiceReceivable(args);
                            }
                        },
                        {
                            id:'invoice_total',
                            headerName: "出货金额",
                            field: "invoice_total",
                            type:"金额"
                        },
                        {
                            id:'no_invoice_total',
                            headerName: "订单占用金额",
                            field: "no_invoice_total",
                            type:"金额",
                            onCellDoubleClicked:function (args) {
                                showNoInvoiceTotal(args);
                            }
                        },
                        {
                            id:'actual_mc_amount',
                            headerName: "可发货余额",
                            field: "actual_mc_amount",
                            type:"金额"
                        },
                        {
                            id:'crebit_ctrl',
                            headerName: "发货余额控制",
                            field: "crebit_ctrl",
                            type:"是否"
                        }

                    ],
                    hcBeforeRequest:function (searchObj) {
                        angular.extend(searchObj,$scope.data.currItem);
                        searchObj.search_flag = 4;
                    }

                };


                $scope.gridOptions1 = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [{
                            type: '序号'
                        }, {
                            field: 'ordinal_no',
                            headerName: '流水号'
                        }
                        , {
                            field: 'date_fund',
                            headerName: '记账日期',
                            type:"日期"
                        }
                        , {
                            field: 'year_month',
                            headerName: '记账月份'
                        }
                        , {
                            field: 'credence_no',
                            headerName: '凭证号'
                        },
                        {
                            field: 'amount_debit',
                            headerName: '回款金额',
                            type:"金额"
                        }
                        ,
                        {
                            field: 'group_customer_code',
                            headerName: '总公司编码'
                        },
                        {
                            field: 'group_customer_name',
                            headerName: '总公司名称'
                        }
                        ,
                        {
                            field: 'crm_entid',
                            headerName: '品类',
                            hcDictCode:"crm_entid"
                        }
                        ,
                        {
                            field: 'fund_account_code',
                            headerName: '资金账号编码'
                        }
                        , {
                            field: 'fund_account_name',
                            headerName: '资金账号名称'
                        },
                        {
                            field: 'customer_code',
                            headerName: '客户编码'
                        }
                        , {
                            field: 'customer_name',
                            headerName: '客户名称'
                        },
                        {
                            field: 'stat',
                            headerName: '状态',
                            hcDictCode:"stat"
                        },
                        {
                            field: 'employee_code',
                            headerName: '经办人编码'
                        }
                        , {
                            field: 'employee_name',
                            headerName: '经办人名称'
                        },
                        {
                            field: 'dept_code',
                            headerName: '部门编码'
                        }
                        , {
                            field: 'dept_name',
                            headerName: '部门名称'
                        },
                        {
                            field: 'balance_type_code',
                            headerName: '结算方式编码'
                        }
                        , {
                            field: 'balance_type_name',
                            headerName: '结算方式名称'
                        },
                        {
                            field: 'is_need_creedence',
                            headerName: '要会计凭证',
                            type:"是否"
                        },
                        {
                            field: 'is_credence',
                            headerName: '产生凭证否',
                            type:"是否"
                        },
                        {
                            field: 'note',
                            headerName: '摘要'
                        },
                        {
                            field: 'amount_cancel_ivc',
                            headerName: '已核销金额',
                            type:'金额'
                        }
                    ]
                };

                $scope.gridOptions2 = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [{
                            type: '序号'
                        }, {
                            field: 'invoice_bill_no',
                            headerName: '系统发票流水号'
                        },
                        {
                            field: 'sourcebilltype',
                            headerName: '单据类型',
                            hcDictCode:"sourcebilltype"
                            // PickList[0]=手工
                            // PickList[1]=销售出库
                            // PickList[2]=应收转移
                            // PickList[3]=应付转应收
                            // PickList[4]=应收转应付
                            // PickList[5]=低开发票
                            // RelationValues[0]=0
                            // RelationValues[1]=1
                            // RelationValues[2]=2
                            // RelationValues[3]=3
                            // RelationValues[4]=4
                            // RelationValues[5]=5
                        },
                        {
                            field: 'crm_entid',
                            headerName: '品类',
                            hcDictCode:"crm_entid"
                        }
                        ,
                        {
                            field: 'customer_code',
                            headerName: '客户编码'
                        }
                        , {
                            field: 'customer_name',
                            headerName: '客户名称'
                        },
                        {
                            field: 'group_customer_code',
                            headerName: '总公司编码'
                        },
                        {
                            field: 'group_customer_name',
                            headerName: '总公司名称'
                        },
                        {
                            field: 'dept_code',
                            headerName: '部门编码'
                        },
                        {
                            field: 'dept_name',
                            headerName: '部门名称'
                        }
                        , {
                            field: 'date_invoice',
                            headerName: '发票日期',
                            type:"日期"
                        },
                        {
                            field: 'date_fund',
                            headerName: '记账日期',
                            type:"日期"
                        }
                        , {
                            field: 'year_month',
                            headerName: '记账月份'
                        },
                        {
                            field: 'invoice_type',
                            headerName: '发票类型',
                            hcDictCode:"invoice_type"
                        }
                        // PickList[0]=普通发票
                        // PickList[1]=专用发票
                        // PickList[2]=出口发票
                        // RelationValues[0]=0
                        // RelationValues[1]=1
                        // RelationValues[2]=2
                        ,
                        {
                            field: 'amount_bill_f',
                            headerName: '发票总额',
                            type:"金额"
                        }
                        ,{
                            field: 'note',
                            headerName: '摘要'
                        },
                        {
                            field: 'is_need_creedence',
                            headerName: '要会计凭证',
                            type:"是否"
                        },
                        {
                            field: 'credence_no',
                            headerName: '凭证号'
                        },
                        {
                            field: 'bill_type',
                            headerName: '发票类别',
                            hcDictCode:"bill_type"
                            // PickList[0]=销售发票
                            // PickList[1]=其它销售发票
                            // PickList[2]=回购发票
                            // RelationValues[0]=1
                            // RelationValues[1]=2
                            // RelationValues[2]=3
                        },
                        {
                            field: 'invoice_no',
                            headerName: '发票号'
                        }
                    ]
                };

                $scope.gridOptions3 = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [{
                            type: '序号'
                        }, {
                            field: 'sa_salebillno',
                            headerName: '单据号'
                        },
                        {
                            field: 'date_invbill',
                            headerName: '单据日期',
                            type:"日期"
                        },
                        {
                            field: 'year_month',
                            headerName: '月份'
                        },
                        {
                            field: 'stat',
                            headerName: '状态',
                            hcDictCode:"stat"
                        },
                        {
                            field: 'no_invoice_total',
                            headerName: '金额',
                            type:"金额"
                        },
                        {
                            field: 'business_remark',
                            headerName: '单据类型'
                        }
                        ,
                        {
                            field: 'created_by',
                            headerName: '创建人'
                        }
                        , {
                            field: 'creation_date',
                            headerName: '创建时间'
                        }
                    ]
                };

                $scope.gridOptions.hcClassId = 'sa_out_bill_head';
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });




                /**
                 * 查客户
                 */
                $scope.chooseCustomer = {
                    afterOk: function (result) {
                        $scope.data.currItem.customer_name = result.customer_name;
                        $scope.data.currItem.customer_code = result.customer_code;
                        $scope.data.currItem.customer_id = result.customer_id;
                    }
                };



                //添加按钮
                $scope.toolButtons = {

                    search: {
                        title: '查询',
                        icon: 'fa fa-search',
                        click: function () {
                            $scope.search && $scope.search();
                        }
                    },

                    export: {
                        title: '导出',
                        icon: 'glyphicon glyphicon-log-out',
                        click: function () {
                            $scope.export && $scope.export();
                        }

                    }

                };

                // 查询

                $scope.search = function () {
                    return $scope.gridOptions.hcApi.search();
                };



                $scope.refresh = function () {
                    $scope.search();
                }


                $scope.export = function () {
                    $scope.gridOptions.hcApi.exportToExcel();
                }


                /**
                 * 销售回款
                 * @param args
                 */
                function showActualTotal(args) {
                    //if(args.data.actual_total==0)return;
                    $("#ActualTotal").modal();
                    var postData = {
                        classId: "fd_fund_business",
                        action: 'fdfundbusinesslist',
                        data: {
                            customer_id : args.data.customer_id,
                            is_ar_fund:2
                        }
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            $scope.gridOptions1.api.setRowData(data.fd_fund_businessoffd_fund_businesss);
                            $scope.calSum(data.fd_fund_businessoffd_fund_businesss);
                        });
                }

                /**
                 * 销售发票列表
                 * @param args
                 */
                function showInvoiceReceivable(args) {
                    //if(args.data.invoice_receivable==0)return;
                    $("#InvoiceReceivable").modal();
                    var postData = {
                        classId: "ar_invoice_head",
                        action: 'invoicesearchlist',
                        data: {
                            sqlwhere : "customer_code = '"+args.data.customer_code+"' and bill_type = 2"
                        }
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            $scope.gridOptions2.api.setRowData(data.ar_invoice_heads);
                        });
                }

                /**
                 * 订单占用额
                 * @param args
                 */
                function showNoInvoiceTotal(args) {
                    //if(args.data.no_invoice_total==0)return;
                    $("#NoInvoiceTotal").modal();
                    var postData = {
                        classId: "sa_out_bill_head",
                        action: 'usedamount',
                        data: {
                            customer_id : args.data.customer_id,
                            crm_entid:args.data.crm_entid
                        }
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            $scope.gridOptions3.api.setRowData(data.sa_out_bill_heads);
                        });
                }

                /**
                 * 计算合计数据
                 */
                $scope.calSum = function (lines) {
                    $scope.gridOptions1.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            amount_debit: numberApi.sum(lines, 'amount_debit')
                        }
                    ]);
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