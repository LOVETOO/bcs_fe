var basemanControllers = angular.module('inspinia');
function fin_funds_header_list($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    fin_funds_header_list = HczyCommon.extend(fin_funds_header_list, ctrl_bill_public);
    fin_funds_header_list.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "fin_funds_header",
        key: "funds_id",
        //  wftempid:10008,
        FrmInfo: {},
        grids: [{optionname: 'options_27', idname: 'fin_funds_lineoffin_funds_headers'}]
    };

    /***************************弹出框***********************/
    $scope.selectcust = function () {
        $scope.FrmInfo = {
            title: "客户",
            thead: [
                {
                    name: "客户编码",
                    code: "cust_code",
                    show: true,
                    iscond: true,
                    type: 'string'

                }, {
                    name: "SAP编码",
                    code: "sap_code",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "客户名称",
                    code: "cust_name",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "客户描述",
                    code: "cust_desc",
                    show: true,
                    iscond: true,
                    type: 'string'
                }],
            is_custom_search: true,
            is_high: true,
            classid: "customer",
            //      sqlBlock: "org_id = " + $scope.data.currItem.org_id
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (result) {
            $scope.data.currItem.sap_code = result.sap_code;
            $scope.data.currItem.cust_name = result.cust_name;
            $scope.data.currItem.cust_id = result.cust_id;
            $scope.data.currItem.cust_code = result.cust_code;
        });

    }
//查询
    $scope.search = function () {
        var fin_funds_header;
        var date1 = $scope.data.currItem.funds_date1;
        var date2 = $scope.data.currItem.funds_date2;
        var sqlBlock = "";
        if (date1 != "" && date2 != "") {
            if (date1 > date2) {
                BasemanService.notice("起始日期不能大于截止日期", "alert-warning");
                return;
            }
        }
        sqlBlock = BasemanService.getSqlWhereBlock(sqlBlock);
        if ($scope.data.currItem.new_bill == 2) {
            new_bill = 2;
        }
        else {
            new_bill = 1;
        }
        var postdata = {
            flag: 3,
            sqlwhere: sqlBlock,
            new_bill: $scope.data.currItem.new_bill
            //   cust_code:$scope.item.cust_code
        };

        var data = $scope.data.currItem.fin_funds_lineoffin_funds_headers;
        BasemanService.RequestPost("fin_funds_header", "search", postdata)
            .then(function (data) {
                var obj={};
                for(var i=0;i< data.fin_funds_headers.length;i++){
                    obj=data.fin_funds_headers[i];
                    var myDate= new Date();
                    obj.gl_date=myDate.toLocaleDateString();
                }
                $scope.gridSetData("options_27", data.fin_funds_headers);
                $scope.data.currItem.fin_funds_lineoffin_funds_headers = data.fin_funds_headers
            });
    }
    //导入ERP
    $scope.omstosap = function () {
        var data = $scope.gridGetData("options_27");
        var selectRows = $scope.selectGridGetData('options_27');
        if (!selectRows.length) {
            BasemanService.notice("请先选择要导入的SAP到款", "alert-warning");
            return;
        }
        ;

        ds.dialog.confirm("是否导入ERP？", function () {
            for (var i = 0,obj=[]; i < selectRows.length; i++) {
                if (selectRows[i].erp_stat != 2) {
                    if (selectRows[i].gl_date == "") {
                        BasemanService.notice("第" + selectRows[i].seq + "行总账日期为空", "alert-warning");
                        return;

                    }
                }
                var postdata={};
                postdata=selectRows[i];
                BasemanService.RequestPost("fin_funds_header", "omstosap", postdata)
                    .then(function () {

                    });
                // obj.push(selectRows[i]);
            }
            $scope.search();
            // var  postdata={};
            // postdata=obj;
            // BasemanService.RequestPost("fin_funds_header", "omstosap", postdata)
            //     .then(function () {
            //         $scope.search();
            //     });

        }, function () {
            // $scope.newWindow.close();
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
    $scope.columns_27 = [{
        headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
        cellEditor: "文本框",

        //cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
        pinned: 'left',
        checkboxSelection: function (params) {
            return params.columnApi.getRowGroupColumns().length === 0;
        },
    }, {
        headerName: "引入ERP状态", field: "erp_stat", editable: false, filter: 'set', width: 150,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 0, desc: ''}, {value: 1, desc: '未引入ERP'}, {value: 2, desc: '已引入ERP且确定客户'}, {
                value: 3,
                desc: '已引入ERP（暂收款）'
            }]
        },
        //cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
        pinned: 'left',
    }, {
        headerName: "状态2", field: "lc_no", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        //cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "回款组织", field: "return_ent_type", editable: false, filter: 'set', width: 100,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 1, desc: '宁波-进出口'}, {value: 2, desc: '香港'}, {value: 3, desc: '宁波-空调'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "资金系统单号", field: "other_no", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "到款单号", field: "funds_no", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "实际到款", field: "fact_amt", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "扣费", field: "amt_deduct", editable: false, filter: 'set', width: 150,
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
        headerName: "净回款", field: "amt", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "已分配金额", field: "allocated_amt", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "未分配金额", field: "wfpamt", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "SAP凭证号", field: "sap_no", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "制单部门", field: "org_name", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "客户编码", field: "cust_code", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        //cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        //cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "到款日期", field: "funds_date", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "总账日期", field: "gl_date", editable: true, filter: 'set', width: 150,
        cellEditor: "年月日",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "单据汇率", field: "exchange_rate", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "汇款人", field: "hk_man", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "货币代码", field: "currency_code", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "货币名称", field: "currency_name", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "确认人", field: "confirm_man", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "确认时间", field: "confirm_date", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "业务员", field: "sales_user_id", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "备注", field: "note", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "是否分配完全", field: "allo_finish", editable: false, filter: 'set', width: 150,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 0, desc: '否'}, {value: 1, desc: '否'}, {value: 2, desc: '是'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "状态", field: "stat", editable: false, filter: 'set', width: 150,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 1, desc: '制单'}, {value: 10, desc: '红冲'}, {value: 2, desc: '提交'},
                {value: 3, desc: '启动'}, {value: 4, desc: '驳回'}, {value: 5, desc: '已审核'}, {value: 99, desc: '关闭'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }];
    $scope.options_27 = {
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
            var isGrouping = $scope.options_27.columnApi.getRowGroupColumns().length > 0;
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
    .controller('fin_funds_header_list', fin_funds_header_list);
