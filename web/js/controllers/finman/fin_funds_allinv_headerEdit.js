var billmanControllers = angular.module('inspinia');
function fin_funds_allinv_headerEdit($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService, notify) {
    //继承基类方法
    fin_funds_allinv_headerEdit = HczyCommon.extend(fin_funds_allinv_headerEdit, ctrl_bill_public);
    fin_funds_allinv_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "fin_funds_allinv_header",
        key: "allo_id",
        wftempid: 10136,
        FrmInfo: {},
        grids: [
            {//金额分配明细
                optionname: 'detail_options',
                idname: 'fin_funds_allinv_lineoffin_funds_allinv_headers'
            }
        ]
    };

    /**---------------------初始化页面----------------------*/
    /***********************权限控制*********************/
    if (window.userbean) {
        $scope.userbean = window.userbean;
    }
    //用户权限
    $scope.user_auth = {
        //知否有区域总监权限
        area_auth: false
    };
    //业务员,区总,系总,财务,事总权限
    var mystring = $scope.userbean.stringofrole;
    $scope.user_auth.saleman_auth = mystring.indexOf("销售人员") > -1 ? true : false;
    $scope.user_auth.areamanager_auth = mystring.indexOf("大区总监") > -1 ? true : false;
    $scope.user_auth.system_auth = mystring.indexOf("外总") > -1 ? true : false;
    $scope.user_auth.departmen_auth = mystring.indexOf("事总") > -1 ? true : false;
    $scope.user_auth.infance_auth = mystring.indexOf("财务部") > -1 ? true : false;
    $scope.user_auth.admin_auth = mystring.indexOf("admin") > -1 ? true : false;
    /**---------------------权限控制-------------------*/


    /**----------------页面隐藏------------------------*/

    /**********************下拉框值查询（系统词汇）***************/
    //到款类型 funds_type
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pay_type"}).then(function (data) {
        var selDataas = [];
        for (var i = 0; i < data.dicts.length; i++) {
            selDataas[i] = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
        }
        $scope.detail_columns[$scope.getIndexByField("detail_columns", "funds_type")].cellEditorParams.values = selDataas;
    })
    //贸易类型 trade_type
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"}).then(function (data) {
        var selDataas = [];
        for (var i = 0; i < data.dicts.length; i++) {
            selDataas[i] = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
        }
        $scope.detail_columns[$scope.getIndexByField("detail_columns", "trade_type")].cellEditorParams.values = selDataas;
    })

    //detail_columns.fee_type 费用项目
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "inv_fee_type"}).then(function (data) {
        var selDataas = [];
        for (var i = 0; i < data.dicts.length; i++) {
            selDataas[i] = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
        }
        $scope.detail_columns[$scope.getIndexByField("detail_columns", "fee_type")].cellEditorParams.values = selDataas;
    })
    /**************************网格定义******************************/
    //分组功能
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
        cellRendererParams: function (params) {
        }
    };

    //金额分配明细
    $scope.detail_options = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.detail_options.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };

    //funds_no
    $scope.funds_no = function () {
        $scope.FrmInfo = {
            classid: "fin_funds_header",
            sqlBlock: ' Fin_Funds_Header.Allocated_Amt < Fin_Funds_Header.Fact_Amt and stat =5 '
            + '  and nvl(Fin_Funds_Header.lc_cash_type,0) <> 1'
            + '  and nvl(Fin_Funds_Header.tt_type,0) not in  (3,6,7)',
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (data) {
            if (data.funds_id == undefined) {
                return;
            }
            var item = $scope.gridGetRow("detail_options");
            item.total_amt = data.fact_amt;
            item.canuse_amt = Number(data.fact_amt || 0) - Number(data.allocated_amt || 0);
            item.funds_id = data.funds_id;
            item.funds_no = data.funds_no;
            item.other_no = data.other_no;
            item.currency_id = data.currency_id;
            item.currency_code = data.currency_code;
            item.currency_name = data.currency_name;
            item.funds_type = data.funds_type;
            item.trade_type = data.trade_type;
            item.total_amt = data.total_amt;
            item.allocated_amt = data.allocated_amt;
            item.canuse_amt = data.canuse_amt;
            item.cust_id = data.cust_id;
            item.cust_code = data.cust_code;
            item.cust_name = data.cust_name;
            item.org_id = data.org_id;
            item.org_code = data.org_code;
            item.org_name = data.org_name;
            $scope.gridUpdateRow("detail_options", item);
        });
    }

    //invoice_no  发票不能重复添加
    $scope.invoice_no = function () {
        var items = $scope.gridGetData("detail_options");
        var item = $scope.gridGetRow("detail_options");
        $scope.FrmInfo = {
            classid: "bill_invoice_header",
            postdata: {
                flag: 6,
            },
            sqlBlock: ' h.stat <> 53' +
            ' and h.cust_id=' + item.cust_id || 0 +
            ' and h.org_id = ' + item.org_id || 0,
            type: "checkbox",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (datas) {
            if (datas.length == undefined || datas.length == 0) {
                return;
            }
            for (var i = 0; i < datas.length; i++) {
                if (HczyCommon.isExist(items, datas[i], ["invoice_no", "fee_type"]).exist) {
                    continue;
                }
                item.invoice_line_seq = datas[i].invoice_line_seq;
                item.fee_type = datas[i].fee_type;
                item.invoice_check_amt = datas[i].invoice_check_amt;
                item.tt_check_amt = datas[i].tt_check_amt;
                item.pi_id = datas[i].pi_id;
                item.pi_no = datas[i].pi_no;
                item.fact_invoice_no = datas[i].fact_invoice_no;
                item.invoice_id = datas[i].invoice_id;
                item.invoice_no = datas[i].invoice_no;
                item.tt_amt = datas[i].tt_amt;
                $scope.gridUpdateRow("detail_options", item);
                break;
            }
        });
    }

    $scope.detail_columns = [
        {
            headerName: "到款单号", field: "funds_no", editable: true, filter: 'set', width: 120,
            cellEditor: "弹出框",
            action: $scope.funds_no,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            non_empty: true,
        }, {
            headerName: "资金系统单号", field: "other_no", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "到款类型", field: "funds_type", editable: false, filter: 'set', width: 120,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "部门名称", field: "org_name", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "客户编码", field: "cust_code", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "货币编码", field: "currency_code", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "币种", field: "currency_name", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "到款单总金额", field: "total_amt", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "已分配金额", field: "allocated_amt", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "可分配金额", field: "canuse_amt", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "贸易类型", field: "trade_type", editable: false, filter: 'set', width: 120,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "商业发票号", field: "invoice_no", editable: true, filter: 'set', width: 120,
            cellEditor: "弹出框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            action: $scope.invoice_no,
            non_empty: true,
        }, {
            headerName: "费用项目", field: "fee_type", editable: true, filter: 'set', width: 120,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            non_empty: true,
        }, {
            headerName: "本次核销金额", field: "invoice_check_amt", editable: true, filter: 'set', width: 120,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            non_empty: true,
        }, {
            headerName: "待核销金额", field: "tt_amt", editable: false, filter: 'set', width: 120,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "已核销金额", field: "tt_check_amt", editable: false, filter: 'set', width: 120,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "实际发票号", field: "fact_invoice_no", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        }, {
            headerName: "形式发票NO", field: "pi_no", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        }
    ];


    //数据缓存
    $scope.initdata();
}
//加载控制器
billmanControllers
    .controller('fin_funds_allinv_headerEdit', fin_funds_allinv_headerEdit)
