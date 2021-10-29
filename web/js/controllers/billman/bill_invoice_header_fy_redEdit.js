var basemanControllers = angular.module('inspinia');
function bill_invoice_header_fy_redEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    bill_invoice_header_fy_redEdit = HczyCommon.extend(bill_invoice_header_fy_redEdit, ctrl_bill_public);
    bill_invoice_header_fy_redEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "bill_invoice_header",
        key: "invoice_id",
        wftempid: 10075,
        FrmInfo: {
            sqlBlock: ' nvl(bill_type,1) = 2 and invoice_type=2 '
        },
        grids: [{optionname: 'options_11', idname: 'bill_invoice_lineofbill_invoice_headers'}]
    };

    /**----弹出框区域*---------------*/
    /************************系统词汇**************************/
    //货币
    BasemanService.RequestPostAjax("base_search", "searchcurrency", {}).then(function (data) {
        $scope.base_currencys = HczyCommon.stringPropToNum(data.base_currencys);
    });
    //贸易类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"}).then(function (data) {
        $scope.trade_types = data.dicts;
    });
    /************************网格下拉**************************/
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "inv_fee_type"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            };
            $scope.columns_11[$scope.getIndexByField("columns_11", "fee_type")].cellEditorParams.values.push(newobj)
        }
    });
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pay_type"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            };
            $scope.columns_11[$scope.getIndexByField("columns_11", "bpay_type")].cellEditorParams.values.push(newobj)
        }
    });
    /***************************弹出框***********************/
    //老单号
    $scope.old_bill_invoice_header = function () {
        $scope.FrmInfo = {
            classid: "bill_invoice_header",
            sqlBlock: "stat = 5 and nvl(bill_type,1) <> 2 and nvl(is_red,1) <> 2 " +
            "and nvl(invoice_type,0) =2 and not exists " +
            "(select 1 from bill_invoice_header ih where " +
            "ih.old_invoice_id = bill_invoice_header.invoice_id and nvl(ih.bill_type,0)=2)"
        };
        BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (result) {
            if (result.invoice_id == undefined) {
                return;
            }
            BasemanService.RequestPost("bill_invoice_header", "select", {invoice_id: result.invoice_id})
                .then(function (result) {
                    result.old_invoice_no = result.invoice_no;
                    result.old_invoice_id = result.invoice_id
                    delete result.invoice_id;
                    delete result.invoice_no;
                    delete result.stat;
                    delete result.wfid;
                    delete result.wfflag;
                    delete result.checkor;
                    delete result.check_time;
                    delete result.updator;
                    delete result.update_time;
                    delete result.dname;
                    delete result.bill_type;//删除类型
                    result.invoice_amt = -result.invoice_amt;
                    result.can_invoice_amt = -result.can_invoice_amt;
                    result.already_invoice_amt = -result.already_invoice_amt;
                    result.tt_amt = -result.tt_amt;
                    result.tt_check_amt = -result.tt_check_amt;
                    for (var name in result) {
                        if (result[name] != undefined && !(result[name] instanceof Array)) {
                            $scope.data.currItem[name] = result[name];
                        }
                    }
                    var data = result.bill_invoice_lineofbill_invoice_headers
                    for (var i = 0; i < data.length; i++) {
                        data[i].seq = i + 1;
                        data[i].invoice_qty = parseFloat("-" + data[i].invoice_qty);
                        data[i].other_price = parseFloat(data[i].other_price);
                        data[i].price = parseFloat(data[i].price);
                        data[i].other_amt = data[i].invoice_qty * data[i].other_price;
                    }
                    $scope.gridSetData("options_11",data);
                })
        })
    };


    //会计期间
    $scope.fin_bud_period_header = function () {
        $scope.FrmInfo = {
            classid: "fin_bud_period_header",
            postdata: {flag: 3}
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.period_year = result.period_year;
            $scope.data.currItem.period_id = result.period_id;
            $scope.data.currItem.period_line_id = result.period_line_id;
            $scope.data.currItem.dname = result.dname;
        });
    };
    //业务部门
    $scope.scporg = function () {
        return;
        $scope.FrmInfo = {
            classid: "scporg",
            sqlBlock: "( idpath like '%1%') and 1=1 and stat =2 and OrgType = 5",
            backdatas: "orgs",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_name = result.orgname;
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_id = result.orgid;
            $scope.data.currItem.idpath = result.idpath;
        });
    };
    //客户
    $scope.customer = function () {
        return;
        $scope.FrmInfo = {
            postdata: {},
            classid: "customer",
            sqlBlock: "",
        };
        $scope.FrmInfo.sqlBlock = " (org_id=" + $scope.data.currItem.org_id
            + " or other_org_ids like '%," + $scope.data.currItem.org_id + ",%')";
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.cust_desc = result.cust_desc;
            $scope.data.currItem.cust_id = result.cust_id;
            $scope.data.currItem.cust_name = result.cust_name;
            $scope.data.currItem.cust_code = result.sap_code;
        })
    };
    //付款方式查询
    $scope.payment_type = function () {
        return;
        if ($scope.data.currItem.org_code == undefined) {
            BasemanService.notice("请先选择业务部门", "alert-warning");
            return;
        }

        if ($scope.data.currItem.cust_code == undefined) {
            BasemanService.notice("请先选择客户", "alert-warning");
            return;
        }
        $scope.FrmInfo = {
            classid: "payment_type",
            sqlBlock: "(payment_type_id in ( select customer_payment_type.payment_type_id from customer , customer_payment_type where "
            + " customer.cust_id=customer_payment_type.cust_id and (customer.Cust_Code='"
            + $scope.data.currItem.cust_code
            + "' or customer.Sap_Code='" + $scope.data.currItem.cust_code + "')))",
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.payment_type_name = result.payment_type_name;
            $scope.data.currItem.payment_type_code = result.payment_type_code;
            $scope.data.currItem.payment_type_id = result.payment_type_id;
        })
    };
    /***********************网格处理事件***************************/


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
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 70,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "费用项目", field: "fee_type", editable: true, filter: 'set', width: 200,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: []
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "开票单价", field: "other_price", editable: true, filter: 'set', width: 120,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "开票数量", field: "invoice_qty", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "开票金额", field: "other_amt", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "通知单号", field: "notice_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "赔款对应付款方式", field: "bpay_type", editable: false, filter: 'set', width: 150,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: []
            },
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
        rowClicked: $scope.rowClicked,
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
    /************保存校验区域**********/
    $scope.validate = function () {
        var errorlist = [];
        var data = $scope.gridGetData("options_11");
        data.length == 0 ? errorlist.push("开票数量为0") : 0;
        for (var i = 0; i < data.length; i++) {
            data[i].invoice_qty == 0 || data[i].invoice_qty == undefined ? errorlist.push("开票数量为0") : 0;
        }
        if (errorlist.length) {
            BasemanService.notice(errorlist, "alert-warning");
            return false;
        }
        return true;
    };
    /****************************初始化**********************/
    $scope.clearinformation = function () {
        $scope.data.currItem.item_stat = 1;
        $scope.data.currItem.po_price_stat = 1;
        $scope.data.currItem.po_stat = 1;
        $scope.data.currItem.po_rcv_stat = 1;
        $scope.data.currItem.so_price_stat = 1;
        $scope.data.currItem.so_stat = 1;
        $scope.data.currItem.sel_stat = 1;
        $scope.data.currItem.is_check_over = 1;
        $scope.data.currItem.bill_type = 2;
        $scope.data.currItem.flag = 10;
    };
    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('bill_invoice_header_fy_redEdit', bill_invoice_header_fy_redEdit);
