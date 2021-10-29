var basemanControllers = angular.module('inspinia');
function fin_funds_header_fyEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    fin_funds_header_fyEdit = HczyCommon.extend(fin_funds_header_fyEdit, ctrl_bill_public);
    fin_funds_header_fyEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "bill_invoice_header",
        key: "invoice_id",
        wftempid: 20000,
        FrmInfo: {
            sqlBlock: "(nvl(invoice_type, 0) =2)"
        },
        grids: [{optionname: 'options_11', idname: 'bill_invoice_lineofbill_invoice_headers'}]
    };

    /**----弹出框区域*---------------*/
    //隐藏区域
    $scope.show_11 = false;
    $scope.show_fy = function () {
        $scope.show_11 = !$scope.show_11;
    };
    /************************系统词汇**************************/
    //状态
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        $scope.stats = HczyCommon.stringPropToNum(data.dicts);
    });
    //货币
    BasemanService.RequestPostAjax("base_search", "searchcurrency", {}).then(function (data) {
        $scope.base_currencys = HczyCommon.stringPropToNum(data.base_currencys);
    });
    //贸易类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"}).then(function (data) {
        $scope.trade_types = data.dicts;
    });
    $scope.trueorfalsetests = [
        {
            id: 1,
            name: "否"
        }, {
            id: 2,
            name: "是"
        }];
    /************************网格下拉**************************/
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "inv_fee_type"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            };
            $scope.columns_11[1].cellEditorParams.values.push(newobj)
        }
    });
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pay_type"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            };
            $scope.columns_11[6].cellEditorParams.values.push(newobj)
        }
    });
    /***************************弹出框***********************/
    //查询
    $scope.search = function () {
        $scope.FrmInfo = {
            classid: "bill_invoice_header",
            sqlBlock: "(nvl(invoice_type, 0) =2)"
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            result = HczyCommon.stringPropToNum(result);
            $scope.data.currItem.invoice_id = result.invoice_id;
            for (var name in result) {
                $scope.data.currItem[name] = result[name];
            }
            var postdata = {invoice_id: result.invoice_id}
            BasemanService.RequestPost("bill_invoice_header", "select", postdata)
                .then(function (data) {
                    $scope.options_11.api.setRowData(data.bill_invoice_lineofbill_invoice_headers);
                });
        });
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
    //增加行
    $scope.additem = function () {
        var data = [];
        var node = $scope.options_11.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        item = {
            seq: node.length + 1,
            line_id: node.length + 1,
            item_name: "0",
            item_id: 0,
            bill_no: "",
            billtype: 2,
        };
        data.push(item);
        $scope.options_11.api.setRowData(data);
    };
    //通知单号
    $scope.sale_ship_notice_header = function () {

        if ($scope.data.currItem.org_id == undefined) {
            BasemanService.notice("请选择业务部门", "alert-warning");
            return;
        }

        if ($scope.data.currItem.cust_id == undefined) {
            BasemanService.notice("请选择客户", "alert-warning");
            return;
        }

        if ($scope.data.currItem.payment_type_name == undefined) {
            BasemanService.notice("请选择付款方式", "alert-warning");
            return;
        }

        if ($scope.data.currItem.sale_ent_type == undefined) {
            BasemanService.notice("请选择贸易类型", "alert-warning");
            return;
        }
        $scope.FrmInfo = {
            classid: "sale_ship_notice_header",
            sqlBlock: " Stat =5 and Org_Id=" + $scope.data.currItem.org_id + " and Cust_Id=" + $scope.data.currItem.cust_id
            + " and Payment_Type_Name='" + $scope.data.currItem.payment_type_name
            + "' and Sale_Ent_Type=" + $scope.data.currItem.sale_ent_type,
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            var grid = $scope.bill_invoice_lineOptions.grid;
            var dataActived = grid.getData()[grid.getActiveCell().row];
            dataActived.notice_no = result.notice_no;
            dataActived.notice_id = result.notice_id;
            grid.updateRow(grid.getActiveCell().row);
        })
    };
    //通知单号、赔款对应付款方式
    $scope.rowClicked = function (e) {
        if ($scope.data.currItem.stat != 1) {
            return;
        }
        if (e.colDef.field != "notice_no" && e.colDef.field != "bpay_type" && e.colDef.field != "bill_no" && e.colDef.field != "billtype") {
            return
        }
        if(e.colDef.field == "notice_no" ||e.colDef.field == "bpay_type"){
            if (e.data.fee_type == 29) {//费用赔款
                e.colDef.editable = true;
            } else {
                e.colDef.editable = false;
            }
        }
        if(e.colDef.field == "bill_no" ||e.colDef.field == "billtype"){
            if (e.data.fee_type == 30 || e.data.fee_type == 31 || e.data.fee_type == 36) {
                e.colDef.editable = true;
            } else {
                e.colDef.editable = false;
            }
        }
    }
    //币种
    $scope.changeCurrency = function () {
        for (i = 0; i < $scope.base_currencys.length; i++) {
            if ($scope.base_currencys[i].currency_code == $scope.data.currItem.currency_code) {
                $scope.data.currItem.currency_code = $scope.base_currencys[i].currency_code;
                $scope.data.currItem.currency_id = $scope.base_currencys[i].currency_id;
                $scope.data.currItem.currency_name = $scope.base_currencys[i].currency_name;
                break;
            }
        }
    }
    $scope.beforesave = function () {
        $scope.changeCurrency();
    };
    $scope.save_before = function (postdata) {
//         delete postdata.bill_invoice_lineofbill_invoice_headers;
        delete postdata.bill_invoice_lineoffin_funds_headers;
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

    $scope.cellchange = function () {
        var options = "options_11";
        var _this = $(this);
        var val = _this.val();

        var nodes = $scope[options].api.getModel().rootNode.childrenAfterGroup;
        var cell = $scope[options].api.getFocusedCell();
        var field = cell.column.colDef.field;
        var data = nodes[cell.rowIndex].data;
        data[field] = val;
        var key = [];
        if (field == "fee_type") {
            if (data.fee_type != 29) {
                data.notice_no = "";
                data.notice_id = 0;
                key = ["notice_no", "notice_id"];
            }
        }
        if (field == "notice_no") {
            if (data.notice_id == undefined || data.notice_id < 1) {
                data.notice_no = "";
                key = ["notice_no"];
            }
        }
        if (field == "other_price") {
            data.invoice_qty = 1;
            var invoice_qty = Number(data.invoice_qty || 0);
            var other_price = Number(data.other_price || 0);
            var price = Number(data.price || 0);
            data.invoice_amt = invoice_qty * price;
            data.other_amt = invoice_qty * other_price;
            if (data.notice_id == undefined || data.notice_id < 1) {
                data.invoice_amt = data.other_amt;
            }
            key = ["invoice_qty", "price", "invoice_amt", "other_amt"];
        }
        if (field == "other_amt") {
            data.other_price = data.other_amt;
            data.invoice_qty = 1;
            key = ["other_price", "invoice_qty"]
        }

        $scope.options_11.api.refreshCells($scope.gridGetNodes("options_11"), key);
        $scope.changeTT_Amt();
    }

    $scope.changeTT_Amt = function () {
        var invoice_amt = 0;
        var dataItem = $scope.gridGetData("options_11");
        for (i = 0; i < dataItem.length; i++) {
            if (dataItem[i].fee_type == "29" || dataItem[i].fee_type == "30"
                || dataItem[i].fee_type == "31" || dataItem[i].fee_type == "36") {
                continue;
            }
            ;
            if (dataItem[i].other_amt == undefined) dataItem[i].other_amt = 0;
            invoice_amt = dataItem[i].other_amt + invoice_amt;
        }
        $scope.data.currItem.invoice_amt = invoice_amt;
        $scope.data.currItem.tt_amt = invoice_amt;
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
            headerName: "费用项目", field: "fee_type", editable: true, filter: 'set', width: 100,
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
            cellEditor: "文本框",
            cellchange: $scope.cellchange,
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
            headerName: "开票金额", field: "other_amt", editable: false, filter: 'set', width: 85,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "通知单号", field: "notice_no", editable: false, filter: 'set', width: 100,
            cellEditor: "弹出框",
            action: $scope.sale_ship_notice_header,
            cellchange: $scope.cellchange,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "赔款对应付款方式", field: "bpay_type", editable: false, filter: 'set', width: 150,
            cellEditor: "下拉框",
            cellchange: $scope.cellchange,
            cellEditorParams: {
                values: []
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "单据号", field: "bill_no", editable: false, filter: 'set', width: 90,
            cellEditor: "文本框",
            cellchange: $scope.cellchange,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "单据类型", field: "billtype", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: [{value: 1, desc: '商业发票'}, {value: 2, desc: '费用发票'}, {value: 3, desc: 'SAP引入'}, {
                    value: 4,
                    desc: '商业发票手工行'
                }]
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
        , {
            headerName: "1130凭证号", field: "sap_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "1500凭证号", field: "sap_no2", editable: false, filter: 'set', width: 100,
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
    /**
     1）、费用项目为费用赔款/应收款调整/坏账损失/主营业务收入-外销-折扣折让时开票单价只能小于0(29/30/31/36)
     2）、费用项目为费用赔款时发货通知单、赔款对应付款方式不能为空!(29)
     3）、费用项目为应收款调整/坏账损失/主营业务收入-外销-折扣折让时单据号不能为空，单据类型不能为空！/30/31/36**/
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
        $scope.funds_type = "LC";
        $scope.data.currItem.funds_date = moment().format('YYYY-MM-DD HH:mm:ss');
        $scope.data.currItem.sales_user_id = window.userbean.userid;
        $scope.data.currItem.lc_cash_type = 4;
        $scope.data.currItem.is_into_amt = 2;
        $scope.data.currItem.is_yin = 2;
        $scope.data.currItem.sale_order_type = 1;
        $scope.data.currItem.currency_name = "美元";
        $scope.data.currItem.currency_code = "USD";
        $scope.data.currItem.invoice_type = 2;
        $scope.data.currItem.is_check_over = 1;
        $scope.data.currItem.objattachs = [];
    };
    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('fin_funds_header_fyEdit', fin_funds_header_fyEdit);
