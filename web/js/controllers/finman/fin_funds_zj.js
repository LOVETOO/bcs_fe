var basemanControllers = angular.module('inspinia');
function fin_funds_zj($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    fin_funds_zj = HczyCommon.extend(fin_funds_zj, ctrl_bill_public);
    fin_funds_zj.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_baoguan_header",
        key: "baoguan_id",
        //  wftempid:10008,
        FrmInfo: {},
        grids: [{optionname: 'options_19', idname: 'sale_baoguan_headerofsale_baoguan_headers'}]
    };

    //下拉框  同步状态
    $scope.usables = [{dictvalue: 1, dictname: "未同步"}, {dictvalue: 2, dictname: "已经同步"}, {
        dictvalue: 3,
        dictname: "全部"
    }];
    //初始化同步到款状态未同步
    $scope.clearinformation = function () {
        $scope.data.currItem = {
            usable: 1
        };
    };
//查询
    $scope.search = function () {
        var date1 = $scope.data.currItem.startdate;
        var date2 = $scope.data.currItem.enddate;
        if (date1 != "" && date2 != "") {
            if (date1 > date2) {
                BasemanService.notice("起始日期不能大于截止日期", "alert-warning");
                return;
            }
        }
        var sqlBlock = "";
        sqlBlock = BasemanService.getSqlWhereBlock(sqlBlock);
        var postdata = {
            sqlwhere: sqlBlock,
            other_no: $scope.data.currItem.other_no || "",
            usable: $scope.data.currItem.usable || "",
            flag: 1,
        };
        BasemanService.RequestPost("sale_baoguan_header", "search", postdata)
            .then(function (data) {
                $scope.gridSetData("options_19", data.sale_baoguan_headerofsale_baoguan_headers);
                $scope.data.currItem.sale_baoguan_headerofsale_baoguan_headers = data.sale_baoguan_headerofsale_baoguan_headers
            });
    }
    //同步到款
    $scope.check1 = function () {
        var data = $scope.gridGetData("options_19");
        var selectRows = $scope.selectGridGetData('options_19');
        var errorlist = [];
        if (!selectRows.length) {
            errorlist.push("请选择你要同步的到款!", "alert-warning");
            return errorlist;
        }
        else {
            for (var i = 0; i < selectRows.length; i++) {
                if (selectRows[i].funds_type == 0) {
                    errorlist.push("第" + selectRows[i].seq + "行到款种类不能为空");
                    return errorlist;
                }
                if (selectRows[i].funds_type == 1) {
                    if (selectRows[i].tt_type == 0) {
                        errorlist.push("第" + selectRows[i].seq + "行到款种类为TT到款,则TT到款类型不能为空");
                        return errorlist;
                    }
                    if (selectRows[i].lc_cash_type != 0) {
                        errorlist.push("第" + selectRows[i].seq + "行到款种类为TT到款,则LC到款类型只能为空");

                        return errorlist;
                    }
                }
                if (selectRows[i].funds_type == 2) {
                    if (parseInt(selectRows[i].lc_cash_type == 0)) {
                        errorlist.push("第" + selectRows[i].seq + "行到款种类为LC到款,则LC到款类型不能为空");
                        return errorlist;
                    }
                    if (selectRows[i].tt_type != 0) {
                        errorlist.push("第" + selectRows[i].seq + "行到款种类为LC到款,则TT到款类型只能为空");

                        return errorlist;
                    }
                }
                if (selectRows[i].return_ent_type == 0) {
                    errorlist.push("第" + selectRows[i].seq + "行回款组织不能为空");
                    return errorlist;
                }

            }
            return [];
        }
        if (errorlist.length) {
            BasemanService.notify(notify, errorlist, "alert-danger");
            return false;
        }
        return true;

    }
    $scope.synch = function () {
        var msg = $scope.check1();
        if (msg.length > 0) {
            BasemanService.notice(msg, "alert-warning");
            return;
        }
        ;

        ds.dialog.confirm("引资金系统信息到款单，是否确认？", function () {
            var selectRows = $scope.selectGridGetData('options_19');
            var datas=[]
            for (var i = 0; i < selectRows.length; i++) {
                if (selectRows[i].usable == 2 || selectRows[i].usable == 3) {
                    continue;
                }
                datas.push(selectRows[i]);
            }
            var postdata={
                sale_baoguan_headerofsale_baoguan_headers:datas,
                flag:1,
            }

            BasemanService.RequestPost("sale_baoguan_header", "update", postdata)
                .then(function (result) {
                        BasemanService.notice("执行成功！", "alert-warning");
                    }
                )
        }, function () {
            $scope.newWindow.close();
        });

    }
    /************************网格定义区域**************************/
    var groupColumn = {
        headerName: "Group",
        width: 200,
        field: 'name',
        valueGetter: function (params) {
            if (params.node.group) {
                return params.node.key;
            } else {
                return params.data[params.colDef.field];
            }
        },
        comparator: agGrid.defaultGroupComparator,
        cellRenderer: 'group',
        cellRendererParams: {
            checkbox: true
        }
    };
    $scope.columns_19 = [{
        headerName: "序号", field: "seq", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "是否可用", field: "stat", editable: false, filter: 'set', width: 150,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 1, desc: '不可用'}, {value: 2, desc: '可用'}, {value: 3, desc: '已作废'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
        checkboxSelection: function (params) {
            return params.columnApi.getRowGroupColumns().length === 0;
        },
    }, {
        headerName: "是否已经同步", field: "usable", editable: false, filter: 'set', width: 150,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 1, desc: '未同步'}, {value: 2, desc: '已同步'}, {value: 3, desc: '已作废'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "资金系统单号", field: "other_no", editable: false, filter: 'set', width: 300,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "到款日期", field: "funds_date", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "到款种类", field: "funds_type", editable: true, filter: 'set', width: 150,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 1, desc: 'TT到款'}, {value: 2, desc: 'LC到款'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "TT到款类型", field: "tt_type", editable: true, filter: 'set', width: 150,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 1, desc: 'TT_现金'}, {value: 2, desc: 'TT_转货款'},
                {value: 3, desc: 'OA_融资到款'}, {value: 4, desc: 'OA_还押汇（分配PI）'},
                {value: 5, desc: 'OA_余款到款'}, {value: 6, desc: 'OA_还押汇（不分配PI）'},
                {value: 7, desc: 'TT_保证金'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "LC到款类型", field: "lc_cash_type", editable: true, filter: 'set', width: 150,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 1, desc: '融资到款'}, {value: 2, desc: '还押汇'},
                {value: 3, desc: '余款到款'}, {value: 4, desc: '普通信用证到款'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "回款组织", field: "return_ent_type", editable: true, filter: 'set', width: 150,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 1, desc: '宁波-进出口'}, {value: 2, desc: '香港'},{value: 5, desc: '宁波-空调'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "扣费金额", field: "amt_deduct", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "利息", field: "lc_interest", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "实际到款", field: "amt", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "到款总额", field: "fact_amt", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "货币编码", field: "currency_code", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "货币名称", field: "currency_name", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        //cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "付款方名称", field: "hk_man", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        //cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "到款银行名称", field: "bank_name", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "到款银行编码", field: "bank_code", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "到款账户", field: "bank_account", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        //cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "到款备注", field: "note", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        //cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }];
    $scope.options_19 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: true,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_19.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.initdata();
}
//加载控制器
basemanControllers
    .controller('fin_funds_zj', fin_funds_zj);
