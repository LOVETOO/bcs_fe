var billmanControllers = angular.module('inspinia');
function bill_invoice_split_headerEdit($scope, $location, $http, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService) {
    //继承基类方法
    bill_invoice_split_headerEdit = HczyCommon.extend(bill_invoice_split_headerEdit, ctrl_bill_public);
    bill_invoice_split_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "bill_invoice_split_header",
        key: "invoice_id",
        wftempid: 10018,
        FrmInfo: {},
        grids: [
            {optionname: 'h_itemoptions', idname: 'bill_invoice_split_h_lineofbill_invoice_split_headers'},//整机信息
            {optionname: 'itemoptions', idname: 'bill_invoice_split_lineofbill_invoice_split_headers'},//分体机
            {optionname: 'rateoptions', idname: 'bill_invoice_split_rateofbill_invoice_split_headers'}
        ]
    };
    //需要查询--机型
    var promise = BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "inv_fee_type"});
    promise.then(function (data) {
        var fee_types = [];
        for (var i = 0; i < data.dicts.length; i++) {
            fee_types[i] = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
        }
        if ($scope.getIndexByField('itemcolumns', 'fee_type')) {
            $scope.itemcolumns[$scope.getIndexByField('itemcolumns', 'fee_type')].cellEditorParams.values = fee_types;
        }
        if ($scope.getIndexByField('h_itemcolumns', 'fee_type')) {
            $scope.h_itemcolumns[$scope.getIndexByField('h_itemcolumns', 'fee_type')].cellEditorParams.values = fee_types;
        }
    });
    //贸易类型系统词汇值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"})
        .then(function (data) {
            $scope.sale_ent_types = HczyCommon.stringPropToNum(data.dicts);
        });
    //发运方式
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "ship_type"})
        .then(function (data) {
            $scope.ship_types = HczyCommon.stringPropToNum(data.dicts);
        });


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
    //整机信息
    $scope.h_itemoptions = {
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
        rowClicked: $scope.rowClicked22,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.h_itemoptions.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };

    $scope.h_itemcellchange = function () {
        var options = "h_itemoptions";
        var _this = $(this);
        var val = _this.val();

        var nodes = $scope[options].api.getModel().rootNode.childrenAfterGroup;
        var cell = $scope[options].api.getFocusedCell()
        var field = cell.column.colDef.field;
        var items = $scope.gridGetData("itemoptions");
        var keys = [];

        var h_item = nodes[cell.rowIndex].data;
        if (field == "invoice_qty" || field == "other_price") {
            h_item.invoice_amt = Number(h_item.invoice_qty || 0) * Number(h_item.price || 0);
            h_item.other_amt = Number(h_item.invoice_qty || 0) * Number(h_item.other_price || 0);
            if (h_item.notice_id == undefined || h_item.notice_id == 0) {
                h_item.invoice_amt = h_item.other_amt;
            } else if (h_item.notice_id > 0) {
                for (var i = 0; i < items.length; i++) {
                    if (h_item.notice_id == items[i].notice_id) {
                        items[i].invoice_qty = h_item.invoice_qty;
                    }
                }

            }
            if(field == "invoice_qty"){
                keys = ["invoice_amt", "other_amt"];
            }else{
                keys = ["invoice_amt", "other_amt","invoice_qty"];
            }
        }
        if (field == "other_amt") {
            h_item.other_price = Number(item.other_amt || 0);
            h_item.invoice_qty = 1;
            keys = ["other_price", "invoice_qty"];
        }
        $scope[options].api.refreshCells(nodes, keys);
        $scope.calTotalInvoiceAmt();
    }
    //待核销金额
    $scope.calTotalInvoiceAmt = function () {
        $scope.calLineInvoiceAmt();
        //待核销金额=明细中的  sum(单价*开票数量)
        var Invoice_Amt = 0, Send_Amt = 0, TT_Amt = 0, obj = {};
        for (var i = 0; i < $scope.data.currItem.bill_invoice_split_lineofbill_invoice_split_headers.length; i++) {
            obj = $scope.data.currItem.bill_invoice_split_lineofbill_invoice_split_headers[i];
            if (obj.notice_id == 0) {
                continue;
            }
            if (obj.fee_type == 14) {
                continue;
            }
            Invoice_Amt += Number(obj.other_amt || "");
            Send_Amt += Number(obj.invoice_amt || "");
            TT_Amt += Number(obj.invoice_qty || "") * Number(obj.price || "");
            if (obj.fee_type != "" && obj.fee_type != undefined) {
                TT_Amt += Number(obj.invoice_qty || "") * Number(obj.other_price || "")
            }
            //可能LC凑金额的行
            if (obj.notice_id != 0 && obj.fee_type == 1) {
                Invoice_Amt += Number(obj.other_amt || "");
            }
        }
        $scope.data.currItem.send_amt = Send_Amt;
        if ($scope.data.currItem.payment_type_name.indexOf(LC) != -1) {
            Invoice_Amt = Send_Amt * Number($scope.data.currItem.lc_rate || 0) * 0.01;
        }
        $scope.data.currItem.invoice_amt = Invoice_Amt;
        $scope.data.currItem.negotiate_amt = Invoice_Amt;
        $scope.data.currItem.tt_amt = TT_Amt;
    };

    $scope.calLineInvoiceAmt = function () {
        var payment = $scope.data.currItem.payment_type_name, obj = {}, rateobj = {}, ttrate = 0, lcrate = 0;
        if (payment.indexOf("TT") != -1 && payment.indexOf("LC") != -1) {
            for (var i = 0; i < $scope.data.currItem.bill_invoice_split_h_lineofbill_invoice_split_headers.length; i++) {
                obj = $scope.data.currItem.bill_invoice_split_h_lineofbill_invoice_split_headers[i];
                if (obj.notice_id == 0) {
                    continue;
                }
                ttrate = 0, lcrate = 0;
                for (var j = 0; j < $scope.data.currItem.bill_invoice_split_rateofbill_invoice_split_headers.length; j++) {
                    rateobj = $scope.data.currItem.bill_invoice_split_rateofbill_invoice_split_headers[j]
                    if (obj.notice_id == rateobj.notice_id) {
                        ttrate = rateobj.tt_rate;
                        lcrate = rateobj.lc_rate;
                        break;
                    }
                }
                obj.other_amt = (Number(obj.other_price || "") * Number(obj.invoice_qty || "") * Number(lcrate || "") * 0.01).toFixed(4);
            }
            for (var i = 0; i < $scope.data.currItem.bill_invoice_split_lineofbill_invoice_split_headers.length; i++) {
                if (obj.notice_id == 0) {
                    continue;
                }
                if (obj.fee_type == 14) {
                    continue;
                }
                obj = $scope.data.currItem.bill_invoice_split_lineofbill_invoice_split_headers[i];
                for (var j = 0; j < $scope.data.currItem.bill_invoice_split_rateofbill_invoice_split_headers.length; j++) {
                    rateobj = $scope.data.currItem.bill_invoice_split_rateofbill_invoice_split_headers[j]
                    if (obj.notice_id == rateobj.notice_id) {
                        ttrate = rateobj.tt_rate;
                        lcrate = rateobj.lc_rate;
                        break;
                    }
                }
                obj.other_amt = (Number(obj.other_price || "") * Number(obj.invoice_qty || "") * Number(lcrate || "") * 0.01).toFixed(4);
            }
        }
    }

    $scope.h_itemcolumns = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "整机编码", field: "item_h_code", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "整机名称", field: "item_h_name", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户机型", field: "cust_item_name", editable: true, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "发货通知数量", field: "qty", editable: false, filter: 'set', width: 120,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "单价", field: "price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },
        {
            headerName: "金额", field: "line_amt", editable: false, filter: 'set', width: 85,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },
        {
            headerName: "已发货确认数量", field: "actual_out_qty", editable: false, filter: 'set', width: 130,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },
        {
            headerName: "开票单价", field: "other_price", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            non_empty:true,
            cellchange: $scope.h_itemcellchange,
        }, {
            headerName: "开票数量", field: "invoice_qty", editable: true, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            non_empty:true,
            non_empty:true,
            cellchange: $scope.h_itemcellchange,
        },
        {
            headerName: "开票金额", field: "other_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            non_empty:true,
            cellchange: $scope.h_itemcellchange,
        },
        {
            headerName: "实际金额", field: "invoice_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "净重", field: "nw", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "毛重", field: "gw", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "体积", field: "volume", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "品牌", field: "brand_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];

    //分体机信息
    $scope.itemoptions = {
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
        rowClicked: $scope.rowClicked22,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.itemoptions.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.itemcellchange = function () {
        var options = "itemoptions";
        var _this = $(this);
        var val = _this.val();

        var nodes = $scope[options].api.getModel().rootNode.childrenAfterGroup;
        var cell = $scope[options].api.getFocusedCell()
        var field = cell.column.colDef.field;

        var item = nodes[cell.rowIndex].data;
        if (field == "invoice_qty" || field == "other_price") {
            item.invoice_amt = Number(item.invoice_qty || 0) * Number(item.price || 0);
            item.other_amt = Number(item.invoice_qty || 0) * Number(item.other_price || 0);
        }
        $scope.data.currItem.bill_invoice_split_lineofbill_invoice_split_headers = $scope.gridGetData("itemoptions");
        $scope.calLineInvoiceAmt()
    }

    $scope.itemcolumns = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "整机编码", field: "item_h_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "整机名称", field: "item_h_name", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "费用项目", field: "fee_type", editable: true, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "工厂型号编码", field: "item_code", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "工厂型号", field: "item_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户型号", field: "cust_item_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户产品名称", field: "cust_spec", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "装柜数量", field: "qty", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "销售价", field: "price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "金额", field: "line_amt", editable: false, filter: 'set', width: 85,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "已发货确认数量", field: "actual_out_qty", editable: false, filter: 'set', width: 150,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "已开发票数量", field: "allready_invoice_qty", editable: false, filter: 'set', width: 150,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "开票单价", field: "other_price", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            non_empty:true,
            cellchange: $scope.itemcellchange,
        },
        {
            headerName: "开票数量", field: "invoice_qty", editable: true, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            non_empty:true,
            cellchange: $scope.itemcellchange,
        },
        {
            headerName: "开票金额", field: "other_amt", editable: true, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            non_empty:true,
            cellchange: $scope.itemcellchange,
        },
        {
            headerName: "实际金额", field: "invoice_amt", editable: false, filter: 'set', width: 130,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "交单数量", field: "jd_qty", editable: true, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "交单金额", field: "jd_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "箱数", field: "pack_style", editable: true, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "体积", field: "pack_rule", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "毛重", field: "unit_gw", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "净重", field: "nw", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "通知单号", field: "notice_no", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];


    $scope.rateoptions = {
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
        //rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.rateoptions.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.ratecolumns = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "商业发票号", field: "invoice_no", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "发货通知单号", field: "notice_no", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "TT比例", field: "tt_rate", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "LC比例", field: "lc_rate", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];

    $scope.select_invoice_no = function () {
        $scope.FrmInfo = {
            classid: "bill_invoice_header",
            postdata: {
                s_flag: 1
            },
            type: "checkbox",
            sqlBlock: ' stat = 5 and nvl(bill_type,1) <> 2 and nvl(is_red,1) <> 2 and funds_flag<>2'
            + ' and nvl(invoice_type,0) <> 2 and nvl(tb_stat,0)<>2 '
            + ' and not exists (select 1 from bill_invoice_header ih '
            + ' where ih.old_invoice_id = bill_invoice_header.invoice_id and nvl(ih.bill_type,0)=2) ',
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (items) {
            if (items.length == undefined || items.length == 0) {
                return;
            }
            var data = {};
            for (var i = 0; i < items.length; i++) {
                var requesobj = BasemanService.RequestPostNoWait("bill_invoice_header", "select", {
                    invoice_id: items[i].invoice_id,
                });
                if (!requesobj.pass) {
                    continue;
                }
                data = requesobj.data;
                if (i == 0) {
                    data.wfid = 0;
                    data.wfflag = 0
                    data.stat = 1;
                    data.checkor = "";
                    data.check_time = "";
                    data.updator = "";
                    data.update_time = "";
                    data.dname = "";
                    for (var name in data) {
                        if (!(data[name] instanceof Array)) {
                            $scope.data.currItem[name] = data[name];
                        }
                    }
                    delete $scope.data.currItem.invoice_id;
                    delete $scope.data.currItem.invoice_no;
                    delete $scope.data.currItem.fact_invoice_no;
                    $scope.data.currItem.bill_invoice_split_h_lineofbill_invoice_split_headers = data.bill_invoice_h_lineofbill_invoice_headers;
                    $scope.data.currItem.bill_invoice_split_lineofbill_invoice_split_headers = data.bill_invoice_lineofbill_invoice_headers;
                    $scope.data.currItem.bill_invoice_split_rateofbill_invoice_split_headers = data.bill_invoice_rateofbill_invoice_headers;

                    $scope.data.currItem.old_invoice_ids = data.invoice_id;
                    $scope.data.currItem.old_invoice_nos = data.invoice_no;
                    $scope.data.currItem.notice_nos = data.notice_no;
                    $scope.data.currItem.old_fact_nos = data.fact_invoice_no;

                    $scope.data.currItem.send_amt = Number(data.send_amt);
                    $scope.data.currItem.can_invoice_amt = Number(data.can_invoice_amt);
                    $scope.data.currItem.jd_totalamt = Number(data.jd_totalamt);
                } else {
                    $scope.data.currItem.bill_invoice_split_h_lineofbill_invoice_split_headers =
                        $scope.data.currItem.bill_invoice_split_h_lineofbill_invoice_split_headers.concat(data.bill_invoice_h_lineofbill_invoice_headers);
                    $scope.data.currItem.bill_invoice_split_lineofbill_invoice_split_headers =
                        $scope.data.currItem.bill_invoice_split_lineofbill_invoice_split_headers.concat(data.bill_invoice_lineofbill_invoice_headers);
                    $scope.data.currItem.bill_invoice_split_rateofbill_invoice_split_headers =
                        $scope.data.currItem.bill_invoice_split_rateofbill_invoice_split_headers.concat(data.bill_invoice_rateofbill_invoice_headers);

                    $scope.data.currItem.old_invoice_ids += "," + data.invoice_id;
                    $scope.data.currItem.old_invoice_nos += "," + data.invoice_no;
                    $scope.data.currItem.notice_nos += "," + data.notice_no;
                    $scope.data.currItem.old_fact_nos += "," + data.fact_invoice_no;

                    $scope.data.currItem.send_amt += Number(data.send_amt);
                    $scope.data.currItem.can_invoice_amt += Number(data.can_invoice_amt);
                    $scope.data.currItem.jd_totalamt += Number(data.jd_totalamt);


                }
            }
            var obj = {};
            for (var i = 0; i < data.bill_invoice_lineofbill_invoice_headers.length; i++) {
                obj = data.bill_invoice_lineofbill_invoice_headers[i];
                obj.old_invoiceid = obj.invoice_id;
                obj.old_invoiceno = obj.invoice_no;
                obj.invoice_amt = Number(obj.invoice_qty || 0) * Number(obj.price || 0);
                obj.other_amt = Number(obj.invoice_qty || 0) * Number(obj.other_price || 0);
                if (obj.notice_id != undefined && obj.notice_id > 0) {
                    obj.invoice_amt = obj.other_amt;
                }
            }
            for (var i = 0; i < data.bill_invoice_h_lineofbill_invoice_headers.length; i++) {
                obj = data.bill_invoice_h_lineofbill_invoice_headers[i];
                obj.old_invoiceid = obj.invoice_id;
                obj.old_invoiceno = obj.invoice_no;
                obj.invoice_amt = Number(obj.invoice_qty || 0) * Number(obj.price || 0);
                obj.other_amt = Number(obj.invoice_qty || 0) * Number(obj.other_price || 0);
            }
            $scope.gridSetData("h_itemoptions", $scope.data.currItem.bill_invoice_split_h_lineofbill_invoice_split_headers);
            $scope.gridSetData("itemoptions", $scope.data.currItem.bill_invoice_split_lineofbill_invoice_split_headers);
            $scope.gridSetData("rateoptions", $scope.data.currItem.bill_invoice_split_rateofbill_invoice_split_headers);
        })
    }


    $scope.calLineInvoiceAmt = function () {
        var payment = $scope.data.currItem.payment_type_name, obj = {}, rateobj = {}, ttrate = 0, lcrate = 0;
        if (payment.indexOf("TT") != -1 && payment.indexOf("LC") != -1) {
            for (var i = 0; i < $scope.data.currItem.bill_invoice_split_rateofbill_invoice_split_headers.length; i++) {
                obj = $scope.data.currItem.bill_invoice_split_rateofbill_invoice_split_headers[i];
                if (obj.notice_id == 0) {
                    continue;
                }
                ttrate = 0, lcrate = 0;
                for (var j = 0; j < $scope.data.currItem.bill_invoice_split_lineofbill_invoice_split_headers.length; j++) {
                    rateobj = $scope.data.currItem.bill_invoice_split_lineofbill_invoice_split_headers[j]
                    if (obj.notice_id == rateobj.notice_id) {
                        ttrate = rateobj.tt_rate;
                        lcrate = rateobj.lc_rate;
                        break;
                    }
                }
                obj.other_amt = (Number(obj.other_price || "") * Number(obj.invoice_qty || "") * Number(lcrate || "") * 0.01).toFixed(4);
            }
            for (var i = 0; i < $scope.data.currItem.bill_invoice_split_lineofbill_invoice_split_headers.length; i++) {
                if (obj.notice_id == 0) {
                    continue;
                }
                if (obj.fee_type == 14) {
                    continue;
                }
                obj = $scope.data.currItem.bill_invoice_split_lineofbill_invoice_split_headers[i];
                for (var j = 0; j < $scope.data.currItem.bill_invoice_split_rateofbill_invoice_split_headers.length; j++) {
                    rateobj = $scope.data.currItem.bill_invoice_split_rateofbill_invoice_split_headers[j]
                    if (obj.notice_id == rateobj.notice_id) {
                        ttrate = rateobj.tt_rate;
                        lcrate = rateobj.lc_rate;
                        break;
                    }
                }
                obj.other_amt = (Number(obj.other_price || "") * Number(obj.invoice_qty || "") * Number(lcrate || "") * 0.01).toFixed(4);
            }
        }
    }


    //查询会计区间
    $scope.selectperiod = function () {
        $scope.FrmInfo = {
            classid: "fin_bud_period_header",
            postdata: {flag: 3}
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.dname = result.dname;
            $scope.data.currItem.period_year = result.period_year;
        });
    };


    $scope.export = function () {
        if (!$scope.data.currItem.invoice_id) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        BasemanService.RequestPost("bill_invoice_header", "exporttoexcel", {
                'invoice_id': $scope.data.currItem.invoice_id, 'splitorwhole': $scope.data.currItem.splitorwhole
                , 'istransfer': 1
            })
            .then(function (data) {
                if (data.docid != undefined && Number(data.docid) != 0) {
                    var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                    window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                } else {
                    BasemanService.notice("导出失败!", "alert-info");
                }
            });
    }

    $scope.export1 = function () {
        if (!$scope.data.currItem.invoice_id) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        BasemanService.RequestPost("bill_invoice_header", "exporttoexcel1", {
                'invoice_id': $scope.data.currItem.invoice_id, 'splitorwhole': $scope.data.currItem.splitorwhole
                , 'istransfer': 1
            })
            .then(function (data) {
                if (data.docid != undefined && Number(data.docid) != 0) {
                    var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                    window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                } else {
                    BasemanService.notice("导出失败!", "alert-info");
                }
            });
    }

    $scope.export2 = function () {
        if (!$scope.data.currItem.invoice_id) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        BasemanService.RequestPost("bill_invoice_header", "exporttoexcel", {
                'invoice_id': $scope.data.currItem.invoice_id, 'splitorwhole': $scope.data.currItem.splitorwhole
                , 'istransfer': 2
            })
            .then(function (data) {
                if (data.docid != undefined && Number(data.docid) != 0) {
                    var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                    window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                } else {
                    BasemanService.notice("导出失败!", "alert-info");
                }
            });
    }

    $scope.export3 = function () {
        if (!$scope.data.currItem.invoice_id) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        BasemanService.RequestPost("bill_invoice_header", "exporttoexcel1", {
                'invoice_id': $scope.data.currItem.invoice_id, 'splitorwhole': $scope.data.currItem.splitorwhole
                , 'istransfer': 2
            })
            .then(function (data) {
                if (data.docid != undefined && Number(data.docid) != 0) {
                    var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                    window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                } else {
                    BasemanService.notice("导出失败!", "alert-info");
                }
            });
    }
    $scope.validate=function () {
        var msg=[],obj={};
        if($scope.data.currItem.payment_type_name.indexOf("C")>0&&($scope.data.currItem.send_amt||0)>0
            &&($scope.data.currItem.lc_no==undefined||$scope.data.currItem.lc_no=="")){
            msg.push("信用证号为空");
        }
        if($scope.data.currItem.bill_invoice_split_h_lineofbill_invoice_split_headers.length==0
            ||$scope.data.currItem.bill_invoice_split_lineofbill_invoice_split_headers.length==0){
            msg.push("产品明细为空");
        }
        var boo=false;
        for(var i=0;i<$scope.data.currItem.bill_invoice_split_lineofbill_invoice_split_headers.length;i++){
            obj=$scope.data.currItem.bill_invoice_split_lineofbill_invoice_split_headers[i];
            if(obj.invoice_qty!=undefined&&obj.invoice_qty!=0){
                boo=true;
                break;
            }
        }
        if(boo){
            for(var i=0;i<$scope.data.currItem.bill_invoice_split_lineofbill_invoice_split_headers.length;i++){
                obj=$scope.data.currItem.bill_invoice_split_lineofbill_invoice_split_headers[i];
                if((obj.notice_id==undefined&&obj.notice_id==0)||obj.type==14||(obj.fee_type!=undefined&&obj.fee_type!="")){
                    continue;
                }
                if(obj.fee_type==undefined||obj.fee_type==""){
                    msg.push("第"+obj.seq+"行的费用项目不能为空!");
                }
                if(Number(obj.invoice_qty||0)>(Number(obj.actual_out_qty||0)-Number(obj.allready_invoice_qty||0))){
                    msg.push("第"+obj.seq+"开票数量不能大于已发货确认数量" +Number(obj.actual_out_qty||0)+
                        "-已开商业发票数量"+Number(obj.allready_invoice_qty||0));
                }
            }
        }
        if(Number($scope.data.currItem.invoice_qty||0)>(Number($scope.data.currItem.actual_out_qty||0)-Number($scope.data.currItem.allready_invoice_qty||0))){
            msg.push("此次开票金额" +Number($scope.data.currItem.invoice_qty||0)+
                "开票数量不能大于已发货确认数量" +Number($scope.data.currItem.actual_out_qty||0)+
                "-已开商业发票数量"+Number($scope.data.currItem.allready_invoice_qty||0));
        }
        if(msg.length>0){
            BasemanService.notice(msg,"alter-warning");
            return false;
        }
        return true;
    }

    $scope.wfstart = function (e) {
        if ($scope.data.currItem[$scope.objconf.key] == 0) {
            BasemanService.notice("请先保存再提交")
            return
        }
        try {
            if (!FormValidatorService.validatorFrom($scope)) {
                return;
            }
            if (e) e.currentTarget.disabled = true;
            $scope.getitemline($scope.data.currItem);

            if ($scope.wfstart_validDate()) {
                var postdata = $scope.data.currItem;
                if ($scope.save_before && typeof $scope.save_before == "function") {//将某个数组删除，避免出现解析xml错误
                    $scope.save_before(postdata);
                }
                var action = "update";
                if (postdata[$scope.objconf.key] == undefined || postdata[$scope.objconf.key] == 0) {
                    action = "insert";
                }
                var promise = BasemanService.RequestPost($scope.objconf.name, action, postdata);
                promise.then(function (data) {
                    if (e) e.currentTarget.disabled = true;
                    var postdata =$scope.data.currItem;
                    BasemanService.RequestPost($scope.objconf.name, "check", postdata)
                        .then(function (data) {
                            BasemanService.notice("审核完成", "alert-info");
                            $scope.data.currItem.wfid = data.wfid;
                            $scope.data.currItem.stat = data.stat;
                            if (e) e.currentTarget.disabled = false;
                            $scope.refresh(2);
                        }, function (error) {
                            if (e) e.currentTarget.disabled = false;
                        });
                }, function (error) {
                    if (e) e.currentTarget.disabled = false;
                });
            }
        } finally {
            if (e) e.currentTarget.disabled = false;
        }


        //返回即提交

    };

    $scope.clearinformation = function () {
        $scope.data.currItem.item_stat = 1;
        $scope.data.currItem.po_price_stat = 1;
        $scope.data.currItem.po_stat = 1;
        $scope.data.currItem.po_rcv_stat = 1;
        $scope.data.currItem.so_price_stat = 1;
        $scope.data.currItem.so_stat = 1;
        $scope.data.currItem.sel_stat = 1;
        $scope.data.currItem.is_check_over = 1;
    };
    $scope.initdata()

}

//加载控制器
billmanControllers
    .controller('bill_invoice_split_headerEdit', bill_invoice_split_headerEdit)

