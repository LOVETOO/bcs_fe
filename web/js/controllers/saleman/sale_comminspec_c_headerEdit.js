var billmanControllers = angular.module('inspinia');
function sale_comminspec_c_headerEdit($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService) {
    //继承基类方法
    sale_comminspec_c_headerEdit = HczyCommon.extend(sale_comminspec_c_headerEdit, ctrl_bill_public);
    sale_comminspec_c_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_comminspec_c_header",
        key: "comminspec_c_id",
        wftempid: 10084,
        FrmInfo: {},
        grids: [{
            optionname: 'hline_options', idname: 'sale_comminspec_c_h_lineofsale_comminspec_c_headers',
            line: {
                optionname: 'line_options',
                idname: 'sale_comminspec_c_lineofsale_comminspec_c_h_lines'
            }
        }
        ]
    };


    /**********************下拉框值查询***************/
    {

        $scope.buyer_names = [{
            id: "DE ZE COMPANY LTD",
            name: "DE ZE COMPANY LTD"
        }, {
            id: "AUX ELECTRIC (HONG KONG) COMPANY LIMITED",
            name: "AUX ELECTRIC (HONG KONG) COMPANY LIMITED"
        }];
        // 机型类别
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pro_type"}).then(function (data) {

            var pro_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                pro_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                }
            }
            if ($scope.getIndexByField('hline_columns', 'pro_type')) {
                $scope.hline_columns[$scope.getIndexByField('hline_columns', 'pro_type')].cellEditorParams.values = pro_types;
            }
            if ($scope.getIndexByField('line_columns', 'pro_type')) {
                $scope.line_columns[$scope.getIndexByField('line_columns', 'pro_type')].cellEditorParams.values = pro_types;
            }
        });
        //
    }

    {  //按钮与弹出框

        //查询目的港
        $scope.comminspec_no = function () {
            $scope.FrmInfo = {
                title: "商检单查询",
                classid: "sale_comminspec_header",
                sqlBlock: " stat=5",
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (data) {
                if (data.comminspec_id == undefined) {
                    return;
                }
                BasemanService.RequestPost("sale_comminspec_header", "select", {comminspec_id: data.comminspec_id}).then(function (data) {
                    delete data.stat;
                    delete data.creator;
                    delete data.create_time;
                    delete data.checkor;
                    delete data.check_time;
                    delete data.wfid;
                    delete data.wfflag;
                    delete  data.sale_prod_line_partofsale_prod_headers;
                    for (var name in data) {
                        if (data[name] instanceof Array) {
                            continue;
                        }
                        $scope.data.currItem[name] = data[name];
                    }

                    $scope.data.currItem.sale_comminspec_c_lineofsale_comminspec_c_headers = data.sale_comminspec_lineofsale_comminspec_headers;
                    $scope.data.currItem.sale_comminspec_c_h_lineofsale_comminspec_c_headers = data.sale_comminspec_h_lineofsale_comminspec_headers;
                    var obj = {}, objline = {};
                    for (var i = 0; i < data.sale_comminspec_h_lineofsale_comminspec_headers.length; i++) {
                        obj = data.sale_comminspec_h_lineofsale_comminspec_headers[i];
                        obj.modify_price = obj.price;
                        obj.modify_amt = obj.amt;
                        obj.modify_price2 = obj.print_price;
                        obj.sale_comminspec_c_lineofsale_comminspec_c_h_lines = obj.sale_comminspec_lineofsale_comminspec_h_lines;
                        delete obj.sale_comminspec_lineofsale_comminspec_h_lines;
                        for (var j = 0; j < obj.sale_comminspec_c_lineofsale_comminspec_c_h_lines.length; j++) {
                            objline = obj.sale_comminspec_c_lineofsale_comminspec_c_h_lines[j];
                            objline.modify_price = objline.price;
                            objline.modify_amt = objline.amt;
                            objline.modify_price2 = objline.print_price;
                        }
                    }
                    $scope.setitemline1($scope.data.currItem);
                    $scope.cal_total();
                })
            })
        };

        $scope.cal_total = function () {
            var hlines = $scope.gridGetData("hline_options");
            var total_gw = 0, total_nw = 0, total_tj = 0, total_qty = 0, total_amt = 0, total_xqty = 0;
            for (var i = 0; i < hlines.length; i++) {
                total_gw += Number(hlines[i].unit_gw || 0);
                total_nw += Number(hlines[i].unit_nw || 0);
                total_tj += Number(hlines[i].unit_tj || 0);
                total_qty += Number(hlines[i].comminspec_qty || 0);
                total_amt += Number(hlines[i].amt || 0);
                total_xqty += Number(hlines[i].x_qty || 0);
            }
            $scope.data.currItem.total_gw = total_gw.toFixed(2);
            $scope.data.currItem.total_nw = total_nw.toFixed(2);
            $scope.data.currItem.total_tj = total_tj.toFixed(3);
            $scope.data.currItem.total_qty = total_qty;
            $scope.data.currItem.total_amt = total_amt.toFixed(2);
            $scope.data.currItem.total_xqty = total_xqty;
        }

        $scope.warn_msg = function () {
            if ($scope.data.currItem.warn_id == undefined || $scope.data.currItem.warn_id == "") {
                BasemanService.notice("出货预告号不能为空!");
                return;
            }
            BasemanService.RequestPost("sale_ship_warn_header", "select", {warn_id: $scope.data.currItem.warn_id}).then(function (data) {
                $scope.data.currItem.to_area_code == data.to_area_code;
                $scope.data.currItem.to_area_id == data.to_area_id;
                $scope.data.currItem.to_area_name == data.to_area_name;
            })
        }


    }
    /**------------------ 业务逻辑控制--------------------------**/
    /**************************网格区域***************/
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

    $scope.hline_cellchange = function () {
        var options = "hline_options"
        var _this = $(this);
        var val = _this.val();

        var nodes = $scope[options].api.getModel().rootNode.childrenAfterGroup;
        var cell = $scope[options].api.getFocusedCell()
        var field = cell.column.colDef.field;
        var hline = nodes[cell.rowIndex].data;
        hline[field] = val;
        var lines = hline.sale_comminspec_c_lineofsale_comminspec_c_h_lines;
        var hkey = [], price1 = 0;
        if (field == "modify_price") {
            var priceh = Number(hline.warn_price || 0), price = Number(hline.modify_price || 0), aprice = 0;
            for (var i = 0; i < lines.length; i++) {
                if (i == lines.length - 1) {
                    lines[i].modify_price = price - aprice;
                } else {
                    price1 = Number(lines[i].warn_price || 0);
                    lines[i].modify_price = (price1 / priceh * price).toFixed(2);
                    aprice += lines[i].modify_price;
                }

            }
            if ($scope.data.currItem.price_changed2 != "2") {
                hline.modify_price2 = hline.modify_price;
                for (var i = 0; i < lines.length; i++) {
                    lines[i].modify_price2 = lines[i].modify_price;
                    lines[i].modify_amt = Number(lines[i].comminspec_qty || 0) * Number(lines[i].modify_price2 || 0)
                }
            }
        }
        if (field == "modify_price2") {
            var priceh = Number(hline.warn_price || 0), price = Number(hline.modify_price2 || 0), aprice = 0;
            for (var i = 0; i < lines.length; i++) {
                if (i == lines.length - 1) {
                    lines[i].modify_price2 = price - aprice;
                } else {
                    price1 = Number(lines[i].warn_price || 0);
                    lines[i].modify_price2 = (price1 / priceh * price).toFixed(2);
                    aprice += lines[i].modify_price2;
                }
                lines[i].modify_amt = Number(lines[i].comminspec_qty || 0) * lines[i].modify_price2;
            }
        }
        hline.modify_amt = Number(hline.comminspec_qty || 0) * Number(hline.modify_price2 || 0);
        if(field!="modify_amt"){
            $scope[options].api.refreshCells(nodes,["modify_amt"]);
        }
        $scope.gridSetData("line_options",hline.sale_comminspec_c_lineofsale_comminspec_c_h_lines);
    }

    $scope.rowClicked = function (e) {
        if (e.data) {
            if (e.data.sale_comminspec_c_lineofsale_comminspec_c_h_lines == undefined) {
                e.data.sale_comminspec_c_lineofsale_comminspec_c_h_lines = []
            }
            $scope.gridSetData('line_options', e.data.sale_comminspec_c_lineofsale_comminspec_c_h_lines);
        }
    }


    $scope.hline_options = {
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
            var isGrouping = $scope.hline_options.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.hline_columns = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "形式发票号", field: "pi_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "商检批号", field: "inspection_batchno", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "机型类别", field: "pro_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellEditorParams: {
                values: [],
            },
        }, {
            headerName: "客户机型", field: "cust_item_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "客户产品名称", field: "cust_spec", editable: false, filter: 'set', width: 140,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "品名(英文)", field: "brand_name_en", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "出货预告数量", field: "prod_qty", editable: false, filter: 'set', width: 120,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "件数", field: "x_qty", editable: false, filter: 'set', width: 70,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "单位", field: "uom_name", editable: false, filter: 'set', width: 70,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellEditorParams: {
                values: [{value: 1, desc: "Unit"}, {value: 2, desc: "Kgs"}],
            },
        }, {
            headerName: "出货预告价格", field: "warn_price", editable: false, filter: 'set', width: 120,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "单价", field: "price", editable: false, filter: 'set', width: 70,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "金额", field: "amt", editable: false, filter: 'set', width: 70,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "修改价格", field: "modify_price", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellchange:$scope.hline_cellchange,
        }, {
            headerName: "打印价格", field: "print_price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "修改打印价格", field: "modify_price2", editable: true, filter: 'set', width: 140,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellchange:$scope.hline_cellchange,
        }, {
            headerName: "修改金额", field: "modify_amt", editable: true, filter: 'set', width: 120,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellchange:$scope.hline_cellchange,
        }, {
            headerName: "备注", field: "note", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        }
    ];
    //line_options
    $scope.line_options = {
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
        rowClicked: undefined,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.line_options.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.line_columns = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "形式发票号", field: "pi_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "商检批号", field: "inspection_batchno", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "机型类别", field: "pro_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellEditorParams: {
                values: [],
            },
        }, {
            headerName: "客户机型", field: "cust_item_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "客户产品名称", field: "cust_spec", editable: false, filter: 'set', width: 140,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "品名(英文)", field: "brand_name_en", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "出货预告数量", field: "prod_qty", editable: false, filter: 'set', width: 120,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "件数", field: "x_qty", editable: false, filter: 'set', width: 70,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "单位", field: "uom_name", editable: false, filter: 'set', width: 70,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellEditorParams: {
                values: [{value: 1, desc: "Unit"}, {value: 2, desc: "Kgs"}],
            },
        }, {
            headerName: "出货预告价格", field: "warn_price", editable: false, filter: 'set', width: 120,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "单价", field: "price", editable: false, filter: 'set', width: 70,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "金额", field: "amt", editable: false, filter: 'set', width: 70,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "修改价格", field: "modify_price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "打印价格", field: "print_price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "修改打印价格", field: "modify_price2", editable: false, filter: 'set', width: 140,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "修改金额", field: "modify_amt", editable: false, filter: 'set', width: 120,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        }, {
            headerName: "备注", field: "note", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];
    //part_options
    $scope.part_options = {
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
        rowClicked: undefined,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.part_options.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.part_columns = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        }, {
            headerName: "生产单号", field: "prod_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "整机编码", field: "item_h_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "整机名称", field: "item_h_name", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "分体机编码", field: "item_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "分体机名称", field: "item_name", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户型号", field: "cust_item_name", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "描述", field: "part_desc", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "ERP编码", field: "erp_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "参考批次", field: "note", editable: false, filter: 'set', width: 85,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "需求数量", field: "require_qty", editable: false, filter: 'set', width: 85,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "已生产数量", field: "pproded_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "本次生产数量", field: "pprod_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "销售价格", field: "psale_price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "成本价", field: "price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "金额", field: "amt", editable: false, filter: 'set', width: 120,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "英文名", field: "part_en_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];

    $scope.clearinformation = function () {
        $scope.data.currItem.price_changed = 1;
        $scope.data.currItem.price_changed2 = 1;
        $scope.data.currItem.stat = 1;
        $scope.data.currItem.sales_user_id = window.userbean.userid;
        $scope.data.currItem.creator = window.userbean.userid;
        $scope.data.currItem.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
    }


    $scope.initdata();
}
//加载控制器
billmanControllers
    .controller('sale_comminspec_c_headerEdit', sale_comminspec_c_headerEdit)
