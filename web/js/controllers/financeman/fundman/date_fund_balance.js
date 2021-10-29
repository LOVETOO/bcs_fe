/**
 * 账户余额
 * date:2018-11-26
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi','numberApi','openBizObj','dateApi'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi,numberApi,openBizObj,dateApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.data = {};
                $scope.data.currItem = {
                    is_zj:1,
                    startyear_month:dateApi.today().substr(0,7),
                    endyear_month:dateApi.today().substr(0,7)
                };
                $scope.gridOptions = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [{
                            id:'seq',
                            type: '序号'
                        },
                        {
                            id:'fund_account_code',
                            headerName: "账户编码",
                            field: "fund_account_code",
                            pinned:'left'
                        },{
                            id:'fund_account_name',
                            headerName: "账户名称",
                            field: "fund_account_name",
                            pinned:'left'
                        },
                        {
                            id:'date_sum',
                            headerName: "记账日期",
                            field: "date_sum",
                            type:'日期'
                        },
                        {
                            id:'brief',
                            headerName: "摘要",
                            field: "brief"
                        },
                        {
                            id:'amount_debit',
                            headerName: "借方金额(元)",
                            field: "amount_debit",
                            type:"金额"
                        },
                        {
                            id:'amount_credit',
                            headerName: "贷方金额(元)",
                            field: "amount_credit",
                            type:"金额"
                        },
                        {
                            id:'amount_blnc',
                            headerName: "余额(元)",
                            field: "amount_blnc",
                            type:"金额"
                        },
                        {
                            id:'bill_type',
                            headerName: "单据类型",
                            field: "bill_type"
                        },
                        {
                            id:'fund_account_type',
                            headerName: "账户类型",
                            field: "fund_account_type",
                            hcDictCode:'fund_account_type'
                        },
                        {
                            id:'fund_account_property',
                            headerName: "账户类别",
                            field: "fund_account_property",
                            hcDictCode:'fund_account_property'
                        },
                        {
                            id:'bank_name',
                            headerName: "开户行名称",
                            field: "bank_name"
                        },
                        {
                            id:'ordinal_no',
                            headerName: "流水号",
                            field: "ordinal_no"
                        },
                        {
                            id:'credence_no',
                            headerName: "记帐凭证号",
                            field: "credence_no"
                        },
                        {
                            id:'balance_type_name',
                            headerName: "结算方式",
                            field: "balance_type_name"
                        },
                        {
                            id:'note',
                            headerName: "备注",
                            field: "note"
                        },
                        {
                            id:'syscreate_type',
                            headerName: "源单据类型",
                            field: "syscreate_type",
                            hcDictCode:"syscreate_type"
                            // PickList[0]=手工增加
                            // PickList[1]=销售回款
                            // PickList[2]=采购付款
                            // PickList[3]=日记账
                            // PickList[4]=费用报销
                            // PickList[5]=存取款登记
                            // PickList[6]=现款销售单
                            // PickList[7]=薪资计算
                            // PickList[8]=记账凭证
                            // PickList[9]=应收票据
                            // PickList[10]=应付票据
                            // PickList[11]=融资申请单
                            // PickList[12]=应收票据处理单
                            // PickList[13]=还款单
                            // PickList[14]=资金置换单
                            // RelationValues[0]=0
                            // RelationValues[1]=1
                            // RelationValues[2]=2
                            // RelationValues[3]=3
                            // RelationValues[4]=4
                            // RelationValues[5]=5
                            // RelationValues[6]=6
                            // RelationValues[7]=7
                            // RelationValues[8]=8
                            // RelationValues[9]=9
                            // RelationValues[10]=10
                            // RelationValues[11]=11
                            // RelationValues[12]=12
                            // RelationValues[13]=13
                            // RelationValues[14]=14
                        },
                        {
                            id:'reference_no',
                            headerName: "源单据号",
                            field: "reference_no"
                        },
                        {
                            id:'bill_no',
                            headerName: "票据号",
                            field: "bill_no"
                        },
                        {
                            id:'io_type_name',
                            headerName: "收支类型",
                            field: "io_type_name"
                        },
                        {
                            id:'employee_name',
                            headerName: "经手人员",
                            field: "employee_name"
                        }
                    ],
                    hcBeforeRequest:function (searchObj) {
                        angular.extend(searchObj,$scope.data.currItem);
                    },
                    hcAfterRequest:function (data) {
                        $scope.calSum(data.fd_date_fund_balance_searchs);
                    },

                };

                $scope.groupGridOptions = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [{
                            id:'seq',
                            type: '序号'
                        },
                        {
                            id:'fund_account_code',
                            headerName: "账户编码",
                            field: "fund_account_code",
                            pinned:'left'
                        },{
                            id:'fund_account_name',
                            headerName: "账户名称",
                            field: "fund_account_name",
                            pinned:'left'
                        },
                        {
                            id:'date_sum',
                            headerName: "记账日期",
                            field: "date_sum",
                            type:'日期'
                        },
                        {
                            id:'brief',
                            headerName: "摘要",
                            field: "brief"
                        },
                        {
                            id:'amount_debit',
                            headerName: "借方金额(元)",
                            field: "amount_debit",
                            type:"金额"
                        },
                        {
                            id:'amount_credit',
                            headerName: "贷方金额(元)",
                            field: "amount_credit",
                            type:"金额"
                        },
                        {
                            id:'amount_blnc',
                            headerName: "余额(元)",
                            field: "amount_blnc",
                            type:"金额"
                        },
                        {
                            id:'bill_type',
                            headerName: "单据类型",
                            field: "bill_type"
                        },
                        {
                            id:'fund_account_type',
                            headerName: "账户类型",
                            field: "fund_account_type",
                            hcDictCode:'fund_account_type'
                        },
                        {
                            id:'fund_account_property',
                            headerName: "账户类别",
                            field: "fund_account_property",
                            hcDictCode:'fund_account_property'
                        },
                        {
                            id:'bank_name',
                            headerName: "开户行名称",
                            field: "bank_name"
                        },
                        {
                            id:'ordinal_no',
                            headerName: "流水号",
                            field: "ordinal_no"
                        },
                        {
                            id:'credence_no',
                            headerName: "记帐凭证号",
                            field: "credence_no"
                        },
                        {
                            id:'balance_type_name',
                            headerName: "结算方式",
                            field: "balance_type_name"
                        },
                        {
                            id:'note',
                            headerName: "备注",
                            field: "note"
                        },
                        {
                            id:'syscreate_type',
                            headerName: "源单据类型",
                            field: "syscreate_type",
                            hcDictCode:"syscreate_type"
                        },
                        {
                            id:'reference_no',
                            headerName: "源单据号",
                            field: "reference_no"
                        },
                        {
                            id:'bill_no',
                            headerName: "票据号",
                            field: "bill_no"
                        },
                        {
                            id:'io_type_name',
                            headerName: "收支类型",
                            field: "io_type_name"
                        },
                        {
                            id:'employee_name',
                            headerName: "经手人员",
                            field: "employee_name"
                        }
                    ]
                };

                $scope.gridOptions.hcClassId = 'fd_date_fund_balance_search';
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                $scope.chooseAccount = function () {
                    return $scope.choose_account = {
                        classId: 'fd_fund_account',
                        title: '资金账户',
                        postData: {},
                        gridOptions: {
                            "columnDefs": [
                                {
                                    headerName: "账户编码",
                                    field: "fund_account_code"
                                }, {
                                    headerName: "账户名称",
                                    field: "fund_account_name"
                                }
                            ]
                        },
                        afterOk: function (result) {
                            $scope.data.currItem.fd_fund_account_id = result.fd_fund_account_id;
                            $scope.data.currItem.fund_account_code = '('+result.fund_account_code+')'+result.fund_account_name;
                        }
                    };
                };

                $scope.chooseBank = function () {
                    return $scope.choose_account = {
                        classId: 'fd_fund_bank',
                        title: '开户银行',
                        postData: {settlement_type:2},
                        gridOptions: {
                            "columnDefs": [
                                {
                                    headerName: "银行编码",
                                    field: "bank_code"
                                }, {
                                    headerName: "银行名称",
                                    field: "bank_name"
                                }
                            ]
                        },
                        afterOk: function (result) {
                            $scope.data.currItem.fd_fund_bank_id = result.fd_fund_bank_id;
                            $scope.data.currItem.fd_fund_bank_code = '('+result.bank_code+')'+result.bank_name;
                        }
                    };
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

                    },

                    // show_group: {
                    //     title: '显示汇总',
                    //     icon: 'glyphicon glyphicon-indent-right',
                    //     click: function () {
                    //         $scope.group && $scope.group();
                    //     }
                    //
                    // }

                };

                // 查询

                $scope.search = function () {
                    if($scope.data.currItem.startyear_month==undefined
                        ||$scope.data.currItem.endyear_month==undefined){
                        swalApi.info("请选择 记账月份");
                        return;
                    }
                    //$('#tab11').tab('show');
                    //$scope.data.lines = [];
                    //$scope.groupGridOptions.hcApi.setRowData([]);
                    return $scope.gridOptions.hcApi.search();
                };





                $scope.refresh = function () {
                    $scope.search();
                }


                $scope.export = function () {
                    $scope.gridOptions.hcApi.exportToExcel();
                }





                // $scope.data.lines = [];
                // $scope.group = function () {
                //     if($scope.data.lines.length==0){
                //         $scope.data.lines = $scope.gridOptions.hcApi.getRowData();
                //     }
                //
                //     $("#groupModal").modal();
                //
                // }
                //
                // $scope.columns = [];
                // $scope.initGroup = function () {
                //     var columns = [];
                //     if($scope.fund_account_type == 2)columns.push("账户类型");
                //     if($scope.fund_account_property == 2)columns.push("账户类别");
                //     if(columns.length==0){
                //         swalApi.info("请选择汇总项");
                //         return;
                //     }
                //     $scope.columns = columns;
                //     $scope.groupGridOptions.columnDefs.forEach(function (column) {
                //         if(columns.indexOf(column.headerName)>=0){
                //             $scope.groupGridOptions.columnApi.setColumnVisible(column.id,true);
                //             if(column.children){
                //                 column.children.forEach(function (child) {
                //                     $scope.groupGridOptions.columnApi.setColumnVisible(child.id,true);
                //                 });
                //             }
                //         }else{
                //             $scope.groupGridOptions.columnApi.setColumnVisible(column.id,false);
                //             if(column.children) {
                //                 column.children.forEach(function (child) {
                //                     $scope.groupGridOptions.columnApi.setColumnVisible(child.id, false);
                //                 });
                //             }
                //         }
                //     });
                //
                //
                //     $scope.groupGridOptions.columnApi.setColumnsVisible(['amount_blnc','seq'],true);
                //
                //     $("#groupModal").modal('hide');
                //
                //     $('#tab22').tab('show');
                //
                //     //数据分组
                //     groupData($scope.data.lines,columns);
                // }
                //
                //
                // function groupData(lines,columns) {
                //     var map = {};
                //     var key = "";
                //     var group_data = [];
                //     for(var i = 0; i < lines.length; i++){
                //         var ai = lines[i];
                //         key = "";
                //         columns.forEach(function (v) {
                //             if(v == '账户类型')key+=ai.fund_account_type;
                //             if(v == '账户类别')key+=ai.fund_account_property;
                //         });
                //         if(!map[key]){
                //             map[key] = [ai];
                //         }else{
                //             map[key].push(ai);
                //         }
                //     }
                //     Object.keys(map).forEach(function(key){
                //         var row = map[key][0];
                //         row.amount_blnc = numberApi.sum(map[key],'amount_blnc');
                //         group_data.push(row);
                //     });
                //     $scope.groupGridOptions.hcApi.setRowData(group_data);
                // }

                $scope.onChange = function () {
                    $scope.search();
                }

                /**
                 * 计算合计数据
                 */
                $scope.calSum = function (lines) {
                    var amount_debit = numberApi.divide(numberApi.sum(lines, 'amount_debit'),2);
                    var amount_credit = numberApi.divide(numberApi.sum(lines, 'amount_credit'),2);
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            amount_debit:amount_debit,
                            amount_credit:amount_credit
                        }
                    ]);
                    // $scope.groupGridOptions.api.setPinnedBottomRowData([
                    //     {
                    //         seq: '合计',
                    //         amount_debit:amount_debit,
                    //         amount_credit:amount_credit
                    //     }
                    // ]);
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