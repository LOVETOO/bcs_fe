var billmanControllers = angular.module('inspinia');
function bill_invoice_headerEdit($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService) {
    //继承基类方法
    bill_invoice_headerEdit = HczyCommon.extend(bill_invoice_headerEdit, ctrl_bill_public);
    bill_invoice_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "bill_invoice_header",
        key: "invoice_id",
        wftempid: 10018,
        FrmInfo: {
            sqlBlock: "nvl(invoice_type,0)<> 2",
        },
        grids: [
            {optionname: 'options_21', idname: 'bill_invoice_h_lineofbill_invoice_headers'},//整机信息

            {optionname: 'options_31', idname: 'bill_invoice_lineofbill_invoice_headers'},//产品信息

            {optionname: 'options_41', idname: 'bill_invoice_funds_lineofbill_invoice_headers'},//费用明细


            {optionname: 'options_51', idname: 'bill_invoice_feeofbill_invoice_headers'}
        ]
    };
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
    //整机信息
    $scope.options_21 = {
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
            var isGrouping = $scope.options_21.columnApi.getRowGroupColumns().length > 0;
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
        var options = "options_21";
        var _this = $(this);
        var val = _this.val();

        var nodes = $scope[options].api.getModel().rootNode.childrenAfterGroup;
        var cell = $scope[options].api.getFocusedCell()
        var field = cell.column.colDef.field;
        var items = $scope.gridGetData("options_31");
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
                $scope.options_31.api.refreshCells($scope.gridGetNodes("options_31"), ["invoice_qty"]);

            }
            keys = ["invoice_amt", "other_amt"];
        }
        if (field == "other_amt") {
            h_item.other_price = Number(item.other_amt || 0);
            h_item.invoice_qty = 1;
            keys = ["other_price", "invoice_qty"];
        }
        $scope[options].api.refreshCells(nodes, keys);
    }

    $scope.columns_21 = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
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
            cellchange: $scope.h_itemcellchange,
        }, {
            headerName: "开票数量", field: "invoice_qty", editable: true, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellchange: $scope.h_itemcellchange,
        },
        {
            headerName: "开票金额", field: "other_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
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
        },
        {
            headerName: "PI号", field: "pi_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    //产品信息
    $scope.options_31 = {
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
        rowClicked: $scope.rowClicked21,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_31.columnApi.getRowGroupColumns().length > 0;
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
        var keys = [];
        var item = nodes[cell.rowIndex].data;
        if (field == "invoice_qty" || field == "other_price") {
            item.invoice_amt = Number(item.invoice_qty || 0) * Number(item.price || 0);
            item.other_amt = Number(item.invoice_qty || 0) * Number(item.other_price || 0);
            keys = ["invoice_amt", "other_amt"];
        }
        if (field == "other_amt") {
            item.other_price = Number(item.other_amt || 0);
            item.other_price = 1;
            keys = ["other_price", "other_price"];
        }
        $scope[options].api.refreshCells(nodes, keys);
    }

    $scope.columns_31 = [
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
            headerName: "开票单价", field: "other_price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellchange: $scope.itemcellchange,
        },
        {
            headerName: "开票数量", field: "invoice_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellchange: $scope.itemcellchange,
        },
        {
            headerName: "开票金额", field: "other_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
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
            headerName: "箱数", field: "pack_style", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "体积", field: "pack_rule", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "毛重", field: "unit_gw", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "净重", field: "nw", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
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
        },
        {
            headerName: "信用证号", field: "lc_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "PI号", field: "pi_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    //核销明细
    $scope.options_41 = {
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
            var isGrouping = $scope.options_41.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_41 = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "分配单号", field: "allo_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "资金系统单号", field: "other_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "本次分配金额", field: "allo_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "制单时间", field: "create_time", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "到款类型", field: "funds_type", editable: false, filter: 'set', width: 150,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    //费用明细
    $scope.options_51 = {
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
            var isGrouping = $scope.options_51.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_51 = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "订单费用编码", field: "order_fee_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "订单费用名称", field: "order_fee_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "费用", field: "notice_fee", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "PI费用", field: "amt_fee", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];

    /**********************下拉框值查询（系统词汇）***************/
    //状态
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        var stats = [];
        for (var i = 0; i < data.dicts.length; i++) {
            object = {};
            object.id = data.dicts[i].dictvalue;
            object.name = data.dicts[i].dictname;
            stats.push(object);
        }
        $scope.stats = stats;
    })
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
    //币种
    BasemanService.RequestPost("base_search", "searchdict", {dictcode: "base_currency"})
        .then(function (data) {
            $scope.currencys = HczyCommon.stringPropToNum(data.dicts);
        });
    //价格条款名称
    BasemanService.RequestPost("base_search", "searchdict", {dictcode: "price_type"})
        .then(function (data) {
            $scope.price_types = HczyCommon.stringPropToNum(data.dicts);
        });
    $scope.is_check_overs = [
        {id: 1, name: "否"},
        {id: 2, name: "是"}
    ];
    /********************************网格下拉*****************************/
    //项目费用
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "inv_fee_type"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            };
            $scope.columns_31[3].cellEditorParams.values.push(newobj)
        }
    });
    //到款类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pay_type"}).then(function (data) {
        // $scope.funds_type=data.dict;
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            };
            $scope.columns_41[5].cellEditorParams.values.push(newobj)
        }
    });
    /*************************增加行/删除行***********************/
    //增加行
    $scope.additem31 = function () {
        $scope.FrmInfo = {
            title: "产品查询",
            is_high: true,
            thead: [
                {
                    name: "出货预告号",
                    code: "warn_no",
                    show: true,
                    iscond: true,
                    type: 'string',
                }, {
                    name: "整机名称",
                    code: "cust_item_name",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "erp产品编码",
                    code: "erp_code",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "参考柜号",
                    code: "ref_box_no",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "数据状态",
                    code: "csh",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "装柜数量",
                    code: "qty",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "单价",
                    code: "price",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "备注",
                    code: "note",
                    show: true,
                    iscond: true,
                    type: 'string'
                }],
            classid: "sale_ship_warn_header",
            type: "checkbox",
            is_custom_search: true,
            searchlist: ["warn_no", "cust_item_name", "ref_box_no", "csh", "qty", "price", "note"],
            backdatas: "sale_ship_warn_lineofsale_ship_warn_headers",
            postdata: {
                warn_id: $scope.data.currItem.warn_id,
                pi_id: $scope.data.currItem.pi_id,
                flag: 2
            }
        };
        BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (items) {
            if (items.length) {
                var postdata = {};
                var data1 = [];
                var data = $scope.gridGetData("options_31");
                if (data == undefined) {
                    data = [];
                }
                for (var i = 0; i < items.length; i++) {
                    var count3 = 0;
                    for (var j = 0; j < data.length; j++) {
                        if (items[i].warn_line_id == data[j].warn_line_id) {
                            count3 = count3 + 1;
                        }
                    }
                    if (count3 == 0) {
                        data.push(items[i]);
                    }
                }
                BasemanService.RequestPost("sale_ship_notice_header", "getpgflag", {
                    warn_id: $scope.data.currItem.warn_id,
                    pi_id: $scope.data.currItem.pi_id
                }).then(function (data) {
                    $scope.data.currItem.is_pg = data.is_pg
                });
                BasemanService.RequestPost("sale_pi_header", "getboxqty", {
                    warn_id: $scope.data.currItem.warn_id,
                    pi_id: $scope.data.currItem.pi_id
                }).then(function (data) {
                    $scope.data.currItem.sale_pi_box_lineofsale_ship_notice_headers = data.sale_pi_box_lineofsale_pi_headers;
                    $scope.data.currItem.sale_pi_feeofsale_ship_notice_headers = data.sale_pi_feeofsale_pi_headers
                });
                BasemanService.RequestPost("sale_ship_notice_header", "search", {notice_id: $scope.data.currItem.notice_id})
                    .then(function (data) {
                        $scope.data.currItem.sale_ship_item_h_lineofsale_ship_notice_headers = data.sale_ship_item_h_lineofsale_ship_notice_headers;
                    });
                $scope.options_31.api.setRowData(data);
                $scope.data.currItem.bill_invoice_lineofbill_invoice_headers = data;
            }
            $scope.aggreate();
        })
    };
    //费用明细
    $scope.aggreate = function () {
        var data2 = [], identify = [];
        var data = $scope.gridGetData("options_31");
        for (var i = 0; i < data.length; i++) {
            var count = 0;
            if (i == 0) {
                identify.push(data[i].erp_code)
            } else {
                for (var j = 0; j < identify.length; j++) {
                    if (data[i].erp_code == identify[j]) {
                        count = count + 1;
                    }
                }
            }
            if (count == 0 && i != 0) {
                identify.push(data[i].erp_code);
            }
        }
        for (var i = 0; i < identify.length; i++) {
            var count1 = 0;
            for (var j = 0; j < data.length; j++) {
                if (identify[i] == data[j].erp_code) {
                    if (count1 == 0) {
                        var object = $.extend({}, data[j]);
                        count1 = count1 + 1;

                    } else {
                        object.qty = parseInt(object.qty) + parseInt(data[j].qty);
                        object.line_amt = parseInt(object.line_amt) + parseInt(data[j].line_amt);
                        object.total_gw = parseInt(object.total_gw) + parseInt(data[j].total_gw);
                        object.total_nw = parseInt(object.total_nw) + parseInt(data[j].total_nw);
                    }
                }
            }
            data2.push(object);
        }
        $scope.options_51.api.setRowData(data2);
        $scope.data.currItem.bill_invoice_feeofbill_invoice_headers = data2;
    };
    //删除行
    $scope.delitem31 = function () {
        var data = [];
        var node = $scope.options_31.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            if (node[i].selected == false) {
                data.push(node[i].data);
            }
        }
        $scope.options_31.api.setRowData(data);
    };
    /**********************弹出框值查询**************************/
    //通知单号
    $scope.selectnotice = function () {
        $scope.FrmInfo = {
            classid: "sale_ship_notice_header",
            sqlBlock: "stat =5 and nvl(Is_Invoiced,0)<>2 and " +
            "exists ( select 1 from sale_ship_out_header a where a.notice_id=Sale_Ship_Notice_Header.notice_id and a.stat = 5) and " +
            "exists ( select 1 from Sale_Ship_Item_Line2 l where l.notice_id =Sale_Ship_Notice_Header.notice_id and l.actual_out_qty > l.allready_invoice_qty ) "
            /**+ "and not exists (select invoice_no from bill_invoice_header where  notice_ids like '%'||Sale_Ship_Notice_Header.Notice_Id||'%' and nvl(bill_type, 1) <> 2 and nvl(is_red, 1) <> 2)"
             * //判断是否有信用证不需要*/,
            postdata: {
                flag: 1
            },
            type: "checkbox",
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (items) {
            if (items.length == 0) {
                return
            }
            var piids = items[0].pi_id;
            var cust_id = items[0].cust_id;
            var payment_type_id = items[0].payment_type_id;
            var lc_no = items[0].lc_no;
            var warnid = items[0].warn_id;
            var notice_ids = "";
            var notice_nos = "";
            var pi_nos = "", pi_ids = "";
            var msg = [];
            for (var i = 0; i < items.length; i++) {
                if (cust_id != items[i].cust_id) {
                    msg.push("不能选择客户不同的发货通知单");
                }

                if (payment_type_id != items[i].payment_type_id) {
                    msg.push("不能选择付款方式不同的PI");
                }

                if (warnid != items[i].warn_id) {
                    msg.push("不能选择不同出货预告的发货通知单");
                }
                notice_ids += items[i].notice_id + ",";
                notice_nos += items[i].notice_no + ",";
                if (pi_nos.indexOf(items[i].pi_no) == -1) {
                    pi_nos += items[i].pi_no + ",";
                }
                if (pi_ids.indexOf(items[i].pi_id) == -1) {
                    pi_ids += items[i].pi_id + ",";
                }
            }
            pi_ids = pi_ids.substr(0, pi_ids.length - 1);
            pi_nos = pi_nos.substr(0, pi_nos.length - 1);
            notice_ids = notice_ids.substr(0, notice_ids.length - 1);
            notice_nos = notice_nos.substr(0, notice_nos.length - 1);
            if (msg.length > 0) {
                BasemanService.notice(msg);
                return;
            }

            $scope.data.currItem.org_id = items[0].org_id;
            $scope.data.currItem.org_code = items[0].org_code;
            $scope.data.currItem.org_name = items[0].org_name;
            delete items[0].wfid;
            delete items[0].wfflag;
            delete items[0].stat;
            delete items[0].creator;
            delete items[0].create_time;
            delete items[0].checkor
            delete items[0].check_time;
            delete items[0].lc_no;
            delete items[0].lc_bill_id;
            delete items[0].lc_bill_no;
            items[0] = HczyCommon.stringPropToNum(items[0]);
            for (name in items[0]) {
                $scope.data.currItem[name] = items[0][name];
            }
            $scope.data.currItem.notice_nos = notice_nos;
            $scope.data.currItem.notice_ids = notice_ids;
            $scope.data.currItem.pi_nos = pi_nos;
            $scope.data.currItem.pi_ids = pi_ids;

            if (payment_type_name.indexOf("LC") > -1) {//LC的需要用户先选择信用证号
                var postdata = {
                    flag: 2,
                }
                postdata.sqlwhere = " sale_ship_notice_money_line.notice_id in (" + notice_ids + ")";
                var requestobj = BasemanService.RequestPostNoWait("fin_lc_allot_header", "search", postdata)
                if (requestobj.pass) {
                    var items = requestobj.data.fin_lc_allot_headers;
                    var lc_bill_ids = "";
                    for (var i = 0; i < items.length; i++) {//去除重复
                        lc_bill_ids += "," + items[0].lc_bill_id;
                        if (lc_bill_ids.indexOf(items[0].lc_bill_id) > -1) {
                            items.splice(i);
                        }
                    }
                    $scope.lc_nos = HczyCommon.stringPropToNum(items);
                    if (items.length > 1) {//多于2个个信用证的时候只需要按照原先的查询方式执行；
                        BasemanService.notice("请先选择信用证!", "alter-warning");
                        return;
                    } else if (items.length == 1) {
                        $scope.data.currItem.lc_no = items[0].lc_no;
                        $scope.data.currItem.lc_bill_id = items[0].lc_bill_id;
                        var postdata = {
                            notice_ids: notice_ids,
                            lc_bill_id: $scope.data.currItem.lc_bill_id,
                        };
                        $scope.setLine(postdata);
                    }
                }
            }
            //非LC则按照原先请求获取明细，有1个信用证或者没有信用证，则可以通过原先的查询语句进行查询
            var postdata = {notice_ids: notice_ids};
            $scope.setLine(postdata);
        });
    };
    
    $scope.lc_change=function () {
        var postdata = {
            notice_ids: notice_ids,
            lc_bill_id: $scope.data.currItem.lc_bill_id,
        };
        $scope.setLine(postdata);
    }
    
    $scope.setLine = function (postdata) {
        var requestobj = RequestPost("sale_ship_notice_header", "getnoticeline", postdata);
        if (!requestobj.pass) {
            return;
        }
        var data = requestobj.data;
        $scope.data.currItem.td_date = data.billlad_date;
        $scope.data.currItem.can_invoice_amt = data.can_invoice_amt;
        $scope.data.currItem.send_amt = data.total_amt;
        $scope.data.currItem.sap_total_amt = data.sap_total_amt.toFixed(2);
        $scope.data.currItem.jd_totalamt = data.jd_totalamt;
        $scope.data.currItem.actual_ship_date = data.actual_ship_date;
        $scope.data.currItem.fpjz_date = data.actual_ship_date;
        for (var i = 0; i < data.sale_ship_item_h_lineofsale_ship_notice_headers.length; i++) {
            var obj = data.sale_ship_item_h_lineofsale_ship_notice_headers[i];
            obj.price = (Number(obj.line_amt) / Number(obj.qty)).toFixed(7)
            if (isNaN(obj.price)) obj.price = 0;
        }

        for (var i = 0; i < data.sale_ship_item_line2ofsale_ship_notice_headers.length; i++) {
            var obj = data.sale_ship_item_line2ofsale_ship_notice_headers[i];
            obj.price = (Number(obj.line_amt) / Number(obj.qty)).toFixed(7)
            if (isNaN(obj.price)) obj.price = 0;
        }
        //整机信息
        $scope.data.currItem.bill_invoice_h_lineofbill_invoice_headers = data.sale_ship_item_h_lineofsale_ship_notice_headers;
        //产品信息
        $scope.data.currItem.bill_invoice_lineofbill_invoice_headers = data.sale_ship_item_line2ofsale_ship_notice_headers;
        //费用明细
        $scope.data.currItem.bill_invoice_feeofbill_invoice_headers = data.sale_ship_notice_feeofsale_ship_notice_headers;

        var msg = [], obj = {}, pi_noticeids = [];
        for (var i = 0; i < $scope.data.currItem.bill_invoice_lineofbill_invoice_headers.length; i++) {
            obj = $scope.data.currItem.bill_invoice_lineofbill_invoice_headers[i];

        }
        requestobj = BasemanService.RequestPostNoWait("bill_invoice_header", "getnoticehid", {
            notice_ids: $scope.data.currItem.notice_ids,
            pi_id: $scope.data.currItem.pi_id,//虽然多个PI，但是要求每个PI的客户ID相同，付款方式相同
            flag: 2
        })
        if (requestobj.pass) {
            $scope.data.currItem.bill_invoice_rateofbill_invoice_headers = requestobj.data.bill_invoice_rateofbill_invoice_headers;
        }
        $scope.GetFeeLine();
        var Days = 0;
        requestobj = BasemanService.RequestPostNoWait("sale_pi_header", "getpipayline", {pi_id: $scope.data.currItem.pi_id});
        if (!requestobj.pass) {
            return;
        }
        var data1 = requestobj.data;
        if (data1.sale_pi_pay_lineofsale_pi_headers.length) {
            for (var i = 0; i < data1.sale_pi_pay_lineofsale_pi_headers.length; i++) {
                if (data1.sale_pi_pay_lineofsale_pi_headers[i].pay_type in [2, 3]) {
                    Days = data1.sale_pi_pay_lineofsale_pi_headers[i].days;
                    break;
                }
            }
        }
        requestobj = BasemanService.RequestPostNoWait("payment_type", "select", {payment_type_id: data1.payment_type_id});
        if (!requestobj.pass) {
            return;
        }
        var data2 = requestobj.data;
        $scope.data.currItem.eng_name = data2.eng_name;
        if ($scope.data.currItem.last_out_date.length > 0) {
            $scope.data.currItem.pre_return_date = HczyCommon.dateAdd($scope.data.currItem.last_out_date, Number(Days) + 15);
        }

        if ($scope.data.currItem.actual_ship_date.length > 0) {
            $scope.data.currItem.last_invoice_date = HczyCommon.dateAdd($scope.data.currItem.actual_ship_date, Number(Days));
        }
        requestobj = BasemanService.RequestPostNoWait("sale_ship_warn_header", "getmsgasbill", {warn_id: $scope.data.currItem.warn_id});
        if (requestobj.pass) {
            $scope.data.currItem.ship_type = requestobj.data.ship_type;
            $scope.data.currItem.price_type_name = requestobj.data.price_type_name;
            $scope.data.currItem.price_type_id = requestobj.data.price_type_id;
            $scope.data.currItem.price_type_code = requestobj.data.price_type_code;
        }
        var actual_box_no;
        var obj;
        var price, actual_out_qty, allready_invoice_qty;
        for (var i = 0; i < $scope.data.currItem.bill_invoice_h_lineofbill_invoice_headers.length; i++) {
            obj = $scope.data.currItem.bill_invoice_h_lineofbill_invoice_headers[i];
            price = Number(obj.price || "");
            actual_out_qty = Number(obj.actual_out_qty || "");
            allready_invoice_qty = Number(obj.allready_invoice_qty || "");
            obj.invoice_qty = Number(actual_out_qty || "") - Number(allready_invoice_qty || "");
            obj.other_price = Number(obj.price || "");
            obj.other_amt = obj.other_price * obj.invoice_qty;
            obj.invoice_amt = obj.other_amt;
        }
        var postdata;
        var j = 0;
        for (var i = 0; i < $scope.data.currItem.bill_invoice_lineofbill_invoice_headers.length; i++) {
            obj = $scope.data.currItem.bill_invoice_lineofbill_invoice_headers[i];
            if (obj.fee_type != "" && obj.fee_type != undefined) {
                continue
            }
            price = Number(obj.price || "");
            actual_out_qty = Number(obj.actual_out_qty || "");
            allready_invoice_qty = Number(obj.allready_invoice_qty || "");
            obj.invoice_qty = Number(actual_out_qty || "") - Number(allready_invoice_qty || "");
            obj.other_price = Number(obj.price || "");
            obj.other_amt = obj.other_price * obj.invoice_qty;
            obj.invoice_amt = obj.other_amt;
            postdata = {
                notice_id: obj.notice_id,
                pi_id: obj.pi_id,
                old_invoice_id: obj.prod_id,
                org_id: obj.prod_line_id,
                cust_id: obj.pi_line_id,
                flag: 1,
            }

            requestobj = BasemanService.RequestPostNoWait("bill_invoice_header", "getnoticehid", postdata);
            if (requestobj.pass) {
                obj.notice_h_id = requestobj.data.invoice_id;
                obj.item_h_id = requestobj.data.item_type_id;
                obj.item_h_code = requestobj.data.item_type_no;
                obj.item_h_name = requestobj.data.item_type_name;
                obj.pro_type = requestobj.data.entid;
            }
        }
        $scope.calTotalInvoiceAmt();
        $scope.getLc_No();
        $scope.setitemline1($scope.data.currItem);
    }
    //信用证号
    $scope.getLc_No = function () {
        if ($scope.data.currItem.notice_nos.length < 1) {
            return;
        }
        var obj, noNotice = true, postdata = {}, noticeids = "-1";
        postdata.flag = 2;
        for (var i = 0; i < $scope.data.currItem.bill_invoice_lineofbill_invoice_headers.length; i++) {
            obj = $scope.data.currItem.bill_invoice_lineofbill_invoice_headers[i]
            if (obj.notice_id > 0 && noticeids.indexOf(obj.notice_id) == -1) {
                noticeids += "," + obj.notice_id;
                noNotice = false;
            }
        }
        if (noNotice) {
            postdata.sqlwhere = " 1<>1 "
        } else {
            postdata.sqlwhere = " sale_ship_notice_money_line.notice_id in (" + noticeids + ")";
        }
        BasemanService.RequestPost("fin_lc_allot_header", "search", postdata).then(function (data) {
            var items = data.fin_lc_allot_headers;
            var lc_bill_ids = "";
            for (var i = 0; i < items.length; i++) {//去除重复
                lc_bill_ids += "," + items[0].lc_bill_id;
                if (lc_bill_ids.indexOf(items[0].lc_bill_id) > -1) {
                    items.splice(i);
                }
            }
            $scope.lc_nos = HczyCommon.stringPropToNum(items);
            if (items.length == 1) {
                $scope.data.currItem.lc_no = items[0].lc_no;
                $scope.data.currItem.lc_bill_id = items[0].lc_bill_id;
            }
        })
    };
    $scope.expdata = function () {
        $scope.data.currItem.cbx1 = 2;
        $scope.data.currItem.cbx4 = 2;
        $scope.data.currItem.cbx5 = 2;
        $scope.data.currItem.cbx6 = 2;
        $scope.data.currItem.chk1 = 1;
    }
    $scope.refresh_after = function () {
        $scope.lc_nos = [{lc_bill_id: $scope.data.currItem.lc_bill_id, lc_no: $scope.data.currItem.lc_no}];
        $scope.data.currItem.lc_bill_id = parseInt($scope.data.currItem.lc_bill_id);
        $scope.expdata();
        var data = $scope.data.currItem.bill_invoice_funds_lineofbill_invoice_headers;
        $scope.data.currItem.hkzje = 0;
        for (var i = 0; i < data.length; i++) {
            if (data[i].funds_type == 1) {
                data[i].allo_amt = parseFloat(data[i].allo_amt) || 0;
                $scope.data.currItem.hkzje += data[i].allo_amt;
            }
        }
    };
    //待核销金额
    $scope.calTotalInvoiceAmt = function () {
        $scope.calLineInvoiceAmt();
        //待核销金额=明细中的  sum(单价*开票数量)
        var Invoice_Amt = 0, TT_Amt = 0, obj = {};
        for (var i = 0; i < $scope.data.currItem.bill_invoice_lineofbill_invoice_headers.length; i++) {
            obj = $scope.data.currItem.bill_invoice_lineofbill_invoice_headers[i];
            if (obj.notice_id == 0) {
                continue;
            }
            if (obj.fee_type == 14) {
                continue;
            }
            Invoice_Amt += Number(obj.other_amt || "");
            TT_Amt += Number(obj.invoice_qty || "") * Number(obj.price || "");
            if (obj.fee_type != "" && obj.fee_type != undefined) {
                TT_Amt += Number(obj.invoice_qty || "") * Number(obj.other_price || "")
            }
            //可能LC凑金额的行
            if (obj.notice_id != 0 && obj.fee_type == 1) {
                Invoice_Amt += Number(obj.other_amt || "");
            }

        }
        ;

        $scope.data.currItem.invoice_amt = Invoice_Amt;
        $scope.data.currItem.tt_amt = TT_Amt;
        /*if($scope.data.currItem.payment_type_name.indexOf("LC")!=-1){
         Invoice_Amt=Number($scope.data.currItem.send_amt)*Number($scope.data.currItem.lc_rate)*0.01
         }*/
    };
    $scope.calLineInvoiceAmt = function () {
        var payment = $scope.data.currItem.payment_type_name, obj = {}, rateobj = {}, ttrate = 0;
        if ((payment.indexOf("TT") != -1 && payment.indexOf("LC") != -1) || (payment.indexOf("OA") != -1 && payment.indexOf("LC") != -1)) {
            for (var i = 0; i < $scope.data.currItem.bill_invoice_h_lineofbill_invoice_headers.length; i++) {
                obj = $scope.data.currItem.bill_invoice_h_lineofbill_invoice_headers[i];
                for (var j = 0; j < $scope.data.currItem.bill_invoice_rateofbill_invoice_headers.length; j++) {
                    rateobj = $scope.data.currItem.bill_invoice_rateofbill_invoice_headers[j]
                    if (obj.notice_id == rateobj.notice_id) {
                        ttrate = rateobj.tt_rate;
                        lcrate = rateobj.lc_rate;
                        break;
                    }
                }
                obj.other_amt = (Number(obj.other_price || "") * Number(obj.invoice_qty || "") * Number(lcrate || "") * 0.01).toFixed(4);
            }
            for (var i = 0; i < $scope.data.currItem.bill_invoice_lineofbill_invoice_headers.length; i++) {
                obj = $scope.data.currItem.bill_invoice_lineofbill_invoice_headers[i];
                for (var j = 0; j < $scope.data.currItem.bill_invoice_rateofbill_invoice_headers.length; j++) {
                    rateobj = $scope.data.currItem.bill_invoice_rateofbill_invoice_headers[j]
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

    //费用明细
    $scope.GetFeeLine = function () {
        var fee1, fee2;
        //海运费--2 保险费--3
        //order_fee_id=1 海运费 3  保险费
        var obj = {};
        var inputobj = {};
        if ((Number($scope.data.currItem.total_amt || "").toFixed(2) - Number($scope.data.currItem.sap_total_amt || "").toFixed(2)) != 0) {
            //自动产生一行调差金额
            inputobj.fee_type = "14";
            inputobj.notice_id = $scope.data.currItem.bill_invoice_lineofbill_invoice_headers[0].notice_id;
            inputobj.invoice_qty = 1;
            inputobj.other_price = (Number($scope.data.currItem.total_amt || "").toFixed(2) - Number($scope.data.currItem.sap_total_amt || "").toFixed(2));
            inputobj.other_amt = inputobj.other_price;
            $scope.data.currItem.bill_invoice_lineofbill_invoice_headers.push(inputobj);
        }
        if($scope.lc_nos!=undefined&&$scope.lc_nos.length>0){//有信用证不需要计算运、保费
            return;
        }
        for (var i = 0; i < $scope.data.currItem.bill_invoice_feeofbill_invoice_headers.length; i++) {
            obj = $scope.data.currItem.bill_invoice_feeofbill_invoice_headers[i];
            if (obj.is_tj == "2") {
                if (obj.notice_fee == 0) continue;
                var inputobj = {};
                if (obj.order_fee_id == "1") {
                    inputobj.fee_type = "2"
                    inputobj.item_name = "海运费";
                } else if (obj.order_fee_id == "3") {
                    inputobj.fee_type = "3"
                    inputobj.item_name = "保险费";
                }
                inputobj.notice_id = obj.notice_id;
                inputobj.notice_no = obj.notice_no;
                inputobj.invoice_qty = 1;
                inputobj.other_price = obj.notice_fee;
                inputobj.other_amt = obj.notice_fee;
                //产品信息
                $scope.data.currItem.bill_invoice_lineofbill_invoice_headers.push(inputobj);
            }
        }
    };
    //部门查询
    $scope.selectorg = function () {
        $scope.FrmInfo = {
            classid: "scporg",
            backdatas: "orgs",
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (result) {
            $scope.data.currItem.org_id = result.org_id;
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_name = result.orgname;
        });
    };
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

    /**********************网格事件处理**************************/
    $scope.invoice_qty = function () {
        var _this = $(this);
        var val = _this.val();
        // var grid = $scope.cntoptions.grid;
        // var data = grid.getData();
        var api = $scope.options_21.api;
        var data = $scope.gridGetData("options_21");
        var index = _this.attr('index');
        if (index != undefined) {
            $scope.itemtemp = grid.getData()[index];
            val = val ? val : 0;
            $scope.itemtemp.other_amt = Number($scope.itemtemp.other_price) * Number(val);
            if ($scope.data.currItem.have_lc == 2) {
                $scope.itemtemp.invoice_amt = $scope.itemtemp.other_amt / (1 - parseFloat($scope.itemtemp.lc_rate))
            } else {
                $scope.itemtemp.invoice_amt = $scope.itemtemp.other_amt;
            }
        }
        var cell1 = 0, cell2 = 0;
        for (var i = 0; i < $scope.cntcolumns.length; i++) {
            if ($scope.cntcolumns[i].field == "other_amt") {
                cell1 = i;
                continue;
            }
            if ($scope.cntcolumns[i].field == "invoice_amt") {
                cell2 = i;
                continue;
            }
        }
        api.updateCell(Number(index), cell1);
        api.updateCell(Number(index), cell2);
    };
    $scope.other_price = function () {
        var _this = $(this);
        var val = _this.val();
        // var grid = $scope.options_21.grid;
        // var data = grid.getData();
        var api = $scope.options_21.api;
        var data = $scope.gridGetData("options_21");
        var index = _this.attr('index');
        if (index != undefined) {
            $scope.itemtemp = data[index];
            val = val ? val : 0;
            $scope.itemtemp.other_amt = Number($scope.itemtemp.invoice_qty) * Number(val);
            if ($scope.data.currItem.have_lc == 2) {
                $scope.itemtemp.invoice_amt = $scope.itemtemp.other_amt / (1 - parseFloat($scope.itemtemp.lc_rate))
            } else {
                $scope.itemtemp.invoice_amt = $scope.itemtemp.other_amt;
            }
        }
        var cell1 = 0, cell2 = 0;
        for (var i = 0; i < $scope.columns_21.length; i++) {
            if ($scope.columns_21[i].field == "other_amt") {
                cell1 = i;
                continue;
            }
            if ($scope.columns_21[i].field == "invoice_amt") {
                cell2 = i;
                continue;
            }
        }
        // var item = $scope.gridGetRow('options_21');
        // $scope.gridUpdateRow('options_21', item);
        api.updateCell(Number(index), cell1);
        api.updateCel2(Number(index), cell2);

    };
    /************************初始化页面***********************/
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: $scope.userbean.userid,
            sales_user_id: $scope.userbean.userid,
            stat: 1,
            seaport_out_id: 1,
            seaport_out_code: "nansha",
            seaport_out_name: "nansha",
            pi_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            delivery_date: moment().add('days', 35).format('YYYY-MM-DD HH:mm:ss'),
            objattachs: [],
            currency_id: 4,
            order_type_id: 1,
            price_type_id: 1,
            ship_type: 1,
            invoice_type: 1,
            is_check_over: 1
        };
        $scope.data.currItem.currency_id = 4; //$scope.currencys[0].currency_id;
        $scope.data.currItem.order_type_id = 1;
        $scope.data.currItem.price_type_id = 1;
        $scope.data.currItem.ship_type = 1;
        $scope.expdata();
    };
    /************保存校验区域***********************/
    $scope.validate = function () {
        var errorlist = [];
        // $scope.data.currItem.sales_user_id == undefined ? errorlist.push("业务员为空") : 0;
        if (errorlist.length) {
            BasemanService.notice(errorlist, "alert-warning");
            return false;
        }
        return true;
    };
    if (window.userbean) {
        $scope.userbean = window.userbean;
    }
    $scope.save_before = function () {
        var data = $scope.gridGetData("options_41");
        for (var i = 0; i < data.length; i++) {
            data[i].allo_amt = parseFloat(data[i].allo_amt) || 0;
            $scope.data.currItem.hkzje += data[i].allo_amt;
        }
    }
    $scope.setnote = function () {
        var str = "";
        if ($scope.data.currItem.cbx1 == 2) {
            str += "cbx1";
        } else {
            str += "cbx2";
        }
        if ($scope.data.currItem.cbx4 == 2) {
            str += "cbx4";
        } else {
            str += "cbx3";
        }

        if ($scope.data.currItem.cbx5 == 2) {
            str += "cbx5";
        }
        if ($scope.data.currItem.cbx6 == 2) {
            str += "cbx6";
        }
        if ($scope.data.currItem.chx1 == 2) {
            str += "chx1";
        }
        return str;
    }
    /**********************导出excel*****************************/
    $scope.exportjy1 = function () {
        if (!$scope.data.currItem.invoice_id) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        var postdata = {
            invoice_id: $scope.data.currItem.invoice_id,
        }
        postdata.note = $scope.setnote();
        BasemanService.RequestPost("bill_invoice_header", "exporttoexceljy1", postdata)
            .then(function (data) {
                if (data.docid != undefined && Number(data.docid) != 0) {
                    var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                    window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                } else {
                    BasemanService.notice("导出失败!", "alert-info");
                }
            });
    };
    $scope.exportjy2 = function () {
        if (!$scope.data.currItem.invoice_id) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        var postdata = {
            invoice_id: $scope.data.currItem.invoice_id,
        }
        postdata.note = $scope.setnote();
        BasemanService.RequestPost("bill_invoice_header", "exporttoexceljy2", postdata)
            .then(function (data) {
                if (data.docid != undefined && Number(data.docid) != 0) {
                    var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                    window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                } else {
                    BasemanService.notice("导出失败!", "alert-info");
                }
            });
    };

    $scope.exportjy3 = function () {
        if (!$scope.data.currItem.invoice_id) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        var postdata = {
            invoice_id: $scope.data.currItem.invoice_id,
        }
        postdata.note = $scope.setnote();
        BasemanService.RequestPost("bill_invoice_header", "exporttoexceljy3", postdata)
            .then(function (data) {
                if (data.docid != undefined && Number(data.docid) != 0) {
                    var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                    window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                } else {
                    BasemanService.notice("导出失败!", "alert-info");
                }
            });
    };
    /**--------------------网格定义--------------------------*/
    //数据缓存
    $scope.initdata();
}
//加载控制器
billmanControllers
    .controller('bill_invoice_headerEdit', bill_invoice_headerEdit)
