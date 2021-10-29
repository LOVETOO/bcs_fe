var basemanControllers = angular.module('inspinia');
function fin_funds_bill_listfo($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    fin_funds_bill_listfo = HczyCommon.extend(fin_funds_bill_listfo, ctrl_bill_public);
    fin_funds_bill_listfo.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "fin_funds_header",
        key: "funds_id",
        //  wftempid:10008,
        FrmInfo: {},
        grids: [{optionname: 'options_11', idname: 'bill_invoice_split_headers'}]
    };

    /***************************弹出框***********************/

    $scope.selectorg = function () {
        $scope.FrmInfo = {

            classid: "scporg",
            postdata: {},
            sqlBlock: "OrgType = 5",
            backdatas: "orgs",

        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_name = result.orgname;
            $scope.data.currItem.org_id = result.orgid;
        });
    }

    $scope.selectarea = function () {
        $scope.FrmInfo = {

            classid: "scporg",
            postdata: {},
            sqlBlock: "CpcOrg.Stat =2 and OrgType in (3)",
            backdatas: "orgs",

        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.area_code = result.code;
            $scope.data.currItem.area_name = result.orgname;
            $scope.data.currItem.org_id = result.orgid;
        });
    }
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

        var date1 = $scope.data.currItem.funds_date1;
        var date2 = $scope.data.currItem.funds_date2;
        var sqlBlock = "";
        if (date1 != "" && date2 != "") {
            if (date1 > date2) {
                BasemanService.notice("起始日期不能大于截止日期", "alert-warning");
                return;
            }
        }
        var s_flag=0;
        if ($scope.data.currItem.result == 1||$scope.data.currItem.result == undefined) {
            s_flag=0;
        }
        else{
            s_flag=1;
        }
        var postdata = {}
        if ($scope.data.currItem.cust_code > 0) {
            postdata.cust_id = $scope.data.currItem.cust_id;
        }
        postdata = {
            flag: 4, s_flag: s_flag,
            start_date: $scope.data.currItem.funds_date1,
            end_date: $scope.data.currItem.funds_date2,
            invoice_no: $scope.data.currItem.invoice_no,
            area_name: $scope.data.currItem.area_id
        };
        BasemanService.RequestPost("bill_invoice_split_header", "search", postdata)
            .then(function (data) {
                $scope.gridSetData("options_11", data.bill_invoice_split_headers);
                $scope.data.currItem.bill_invoice_split_headers = data.bill_invoice_split_headers;
            });
    }

//释放OMS限额
    $scope.released = function () {
        var data = $scope.gridGetData("options_10");
        for (var i = 0; i < data.length; i++) {
            var selectRows = $scope.selectGridGetData('options_10')
            if (!selectRows.length) {
                continue;
            }
            if (data[i].funds_flag == 2) {
                continue;
            }
            if (data[i].note == "已做出运申报") {
                continue;
            }
            var postdata = {S_Flag: 10};
            BasemanService.RequestPost("bill_invoice_split_header", "writeedi", postdata)
                .then(function (data) {
                    data[i].funds_flag = 2;
                    $scope.options_11.api.setRowData(data.bill_invoice_split_headers);
                    $scope.data.currItem.bill_invoice_split_headers = data.bill_invoice_split_headers;

                });
        }
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
    $scope.columns_11 = [
        {
            headerName: "引信保通状态", field: "funds_flag", editable: false, filter: 'set', width: 150,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: [{value: 1, desc: '未引入'}, {value: 2, desc: '已引入'}]
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            checkboxSelection: function (params) {
                return params.columnApi.getRowGroupColumns().length === 0;
            },
        }, {
            headerName: "拆分前发票号", field: "old_fact_nos", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "拆分前发票流水号", field: "old_invoice_nos", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "发票号", field: "fact_invoice_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "发票流水号", field: "invoice_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "客户编码", field: "cust_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "最后回款日期", field: "check_time", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "发票来源", field: "flag", editable: false, filter: 'set', width: 150,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: [{value: 1, desc: '商业发票'}, {value: 2, desc: '拆分发票'}]
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "处理结果", field: "note", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "备注", field: "warn_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    $scope.options_11 = {
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
            var isGrouping = $scope.options_11.columnApi.getRowGroupColumns().length > 0;
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
    .controller('fin_funds_bill_listfo', fin_funds_bill_listfo);
