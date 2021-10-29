var salemanControllers = angular.module('inspinia');
function sale_months_invplan_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_months_invplan_headerEdit = HczyCommon.extend(sale_months_invplan_headerEdit, ctrl_bill_public);
    sale_months_invplan_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_months_invplan_header",
        key: "months_invplan_id",
        wftempid: 10160,
        FrmInfo: {},
        grids: [
            {optionname: 'options_21', idname: 'sale_months_invplan_lineofsale_months_invplan_headers'},
            {optionname: 'options_22', idname: 'sale_months_invplan_line2ofsale_months_invplan_headers'}
        ]
    };
    $scope.save_before=function(){
       delete $scope.data.currItem.sale_months_invplan_line2ofsale_months_invplan_headers;
   };
    /******************页面隐藏****************************/
    $scope.show_11 = true;
    $scope.show11 = function () {
        $scope.show_11 = !$scope.show_11;
    };
    /******************词汇值****************************/
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            $scope.stats = HczyCommon.stringPropToNum(data.dicts);
        });
    $scope.launch_months = [
        {id: 1, name: "1月"}, {id: 2, name: "2月"}, {id: 3, name: "3月"}, {id: 4, name: "4月"}, {id: 5, name: "5月"}, {
            id: 6,
            name: "6月"
        },
        {id: 7, name: "7月"}, {id: 8, name: "8月"}, {id: 9, name: "9月"}, {id: 10, name: "10月"}, {
            id: 11,
            name: "11月"
        }, {id: 12, name: "12月"},
    ];
    //选择年月份清除明细
    $scope.YearClear = function () {
        var data = $scope.data.currItem.sale_months_invplan_lineofsale_months_invplan_headers;
        if (data !== undefined) {
            $scope.gridSetData("options_21", []);
        }
    };
    $scope.MonthClear = function () {
        var data = $scope.data.currItem.sale_months_invplan_lineofsale_months_invplan_headers;
        if (data !== undefined) {
            $scope.gridSetData("options_21", []);
        }
    };
    /*************************网格下拉**********************************/
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "line_type"})
        .then(function (data) {
            var line_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                line_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('columns_21', 'line_type')) {
                $scope.columns_21[$scope.getIndexByField('columns_21', 'line_type')].cellEditorParams.values = line_types;
            }
        });
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "sale_order_type"})
        .then(function (data) {
            var sale_order_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                sale_order_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('columns_21', 'order_type')) {
                $scope.columns_21[$scope.getIndexByField('columns_21', 'order_type')].cellEditorParams.values = sale_order_types;
            }
        });
    /******************网格定义区域****************************/
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
    $scope.columns_21 = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 70,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "生产单", field: "prod_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "订单", field: "order_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "订单类型", field: "order_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "MRP控制者", field: "mrp_ctrl", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "预计发货日期", field: "pre_ship_date", editable: false, filter: 'set', width: 120,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户代码", field: "cust_code", editable: false, filter: 'set', width: 100,
            cellEditor: "弹出框",
            action: $scope.cust_code,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "行类型", field: "line_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "整机编码", field: "item_h_code", editable: false, filter: 'set', width: 100,
            cellEditor: "弹出框",
            action: $scope.item_h_code11,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "整机名称", field: "item_h_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "库存", field: "inv_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "发货日期", field: "ship_date", editable: true, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "验货日期", field: "inspect_date", editable: true, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "线检日期", field: "line_inspect_date", editable: true, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },

        {
            headerName: "发货数量", field: "ship_qty", editable: true, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "发货节点", field: "ship_node", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "公司处理数量", field: "company_qty", editable: true, filter: 'set', width: 130,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "待定数量", field: "wait_qty", editable: true, filter: 'set', width: 130,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "备注", field: "note", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];
    $scope.options_21 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        rowClicked: $scope.rowdatachange,
        enableRangeSelection: true,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
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
    $scope.columns_22 = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 70,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "生产单", field: "prod_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "订单", field: "order_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "订单类型", field: "order_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "MRP控制者", field: "mrp_ctrl", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "预计发货日期", field: "pre_ship_date", editable: false, filter: 'set', width: 120,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户代码", field: "cust_code", editable: false, filter: 'set', width: 100,
            cellEditor: "弹出框",
            action: $scope.cust_code,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "行类型", field: "line_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "整机编码", field: "item_h_code", editable: false, filter: 'set', width: 100,
            cellEditor: "弹出框",
            action: $scope.item_h_code11,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "整机名称", field: "item_h_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "库存", field: "inv_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "发货日期", field: "ship_date", editable: true, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "验货日期", field: "inspect_date", editable: true, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "线检日期", field: "line_inspect_date", editable: true, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },

        {
            headerName: "发货数量", field: "ship_qty", editable: true, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "发货节点", field: "ship_node", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "公司处理数量", field: "company_qty", editable: true, filter: 'set', width: 130,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "待定数量", field: "wait_qty", editable: true, filter: 'set', width: 130,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "备注", field: "note", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];
    $scope.options_22 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        rowClicked: $scope.rowdatachange,
        enableRangeSelection: true,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_22.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.importComplete = function () {
        var data2 = $scope.gridGetData("options_22");
        var data=$scope.gridGetData("options_21");
        for(var i=0;i<data2.length;i++){
            var isExists=true;
            var isExists = HczyCommon.isExist(data, data2[i], ["seq","order_no","item_h_code"],["seq","order_no","item_h_code"]).exist;
            if(isExists==false){
                $scope.gridSetData('options_22', []);
                BasemanService.notice("导入的订单号:"+data2[i].order_no+"与原来不一致,请核对!", "alert-warning");
                return;
            }
        };
        $scope.options_21.api.setRowData(data2);
        $scope.gridSetData('options_22', []);
        alert('导入成功！', "alert-info");
    };
    /******************界面初始化****************************/
    $scope.refresh_after = function () {
        if($scope.data.currItem.stat==3){
            $scope.columns_21[$scope.getIndexByField("columns_21", "line_inspect_date")].editable = true;
            $scope.columns_21[$scope.getIndexByField("columns_21", "inspect_date")].editable = true;
            $scope.columns_21[$scope.getIndexByField("columns_21", "ship_date")].editable = true;
            $scope.columns_21[$scope.getIndexByField("columns_21", "ship_qty")].editable = true;
            $scope.columns_21[$scope.getIndexByField("columns_21", "note")].editable = true;
        }
    };
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            stat: 1
        };
        var date = new Date;
        $scope.data.currItem.inv_year = date.getFullYear();
        var month = date.getMonth() + 1;
        $scope.data.currItem.inv_month = (month < 10 ? "0" + month : month);
    };
    $scope.initdata();

}

//加载控制器
salemanControllers
    .controller('sale_months_invplan_headerEdit', sale_months_invplan_headerEdit);
