var finmanControllers = angular.module('inspinia');
function sale_months_invplan_header_hz($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_months_invplan_header_hz = HczyCommon.extend(sale_months_invplan_header_hz, ctrl_bill_public);
    sale_months_invplan_header_hz.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_months_inv_list",
        FrmInfo: {},
        grids: [
            {optionname: 'options_11', idname: 'sale_months_inv_lists'},
            {optionname: 'options_12', idname: 'sale_months_inv_list_sums'}
        ]
    };
    /**********************查询、弹出框*************************/
    $scope.launch_months = [
        {id: 1,name: "1月"}, {id: 2,name: "2月"}, {id: 3,name: "3月"}, {id: 4,name: "4月"}, {id: 5,name: "5月"}, {id: 6,name: "6月"},
        {id: 7,name: "7月"}, {id: 8,name: "8月"}, {id: 9,name: "9月"}, {id: 10,name: "10月"}, {id: 11,name: "11月"}, {id: 12,name: "12月"},
    ];
    $scope.search = function () {
        var postdata = {
            flag: 2,
            // sqlwhere: sqlBlock,
            start_date: $scope.data.currItem.start_date,
            end_date: $scope.data.currItem.end_date
        };
        BasemanService.RequestPost("sale_months_inv_list", "search", postdata)
            .then(function (data) {
                $scope.data.currItem.sale_months_inv_lists = data.sale_months_inv_lists;
                $scope.options_11.api.setRowData(data.sale_months_inv_lists);
                $scope.data.currItem.sale_months_inv_list_sums = data.sale_months_inv_list_sums;
                $scope.options_12.api.setRowData(data.sale_months_inv_list_sums);
                $scope.sum();
            });
    };
    /****************************汇总**********************************/
    //汇总列
    $scope.sum = function (arr,column,datas) {
        var arr = [], column = [];
        column[0] = "ship_node1";
        column[1] = "ship_node2";
        column[2] = "ship_node3";
        column[3] = "ship_node4";
        column[4] = "ship_node5";
        column[5] = "ship_node6";
        column[6] = "total_ship_node";
        var data= $scope.data.currItem.sale_months_inv_list_sums;
        var total = {};
        for (var j = 0; j < column.length; j++) {
            var arr = column[j];
            total[arr] = 0;
        }
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < column.length; j++) {
                var arr = column[j];
                if (data[i][arr] != undefined) {
                    total[arr] += parseFloat(data[i][arr]);
                }
            }
        }
        for (var j = 0; j < column.length; j++) {
            var arr = column[j];
            total[arr] = parseFloat(total[arr]).toFixed(2);
        }
        total.zone_name = "合计";
        data.push(total);
        $scope.options_12.api.setRowData(data);
    };
    /**-------网格定义区域 ------*/
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
    //明细
    $scope.columns_11 = [
        {
            headerName: "线检日期", field: "line_inspect_date", editable: false, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "验货日期", field: "inspect_date", editable: false, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "发货日期", field: "ship_date", editable: false, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "拖柜日期", field: "tg_date", editable: false, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "发货数量", field: "ship_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "发货节点", field: "ship_node", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "公司处理数量", field: "company_qty", editable: false, filter: 'set', width: 130,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "待定数量", field: "wait_qty", editable: false, filter: 'set', width: 130,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "备注", field: " note", editable: false, filter: 'set', width: 100,
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
    //汇总
    $scope.columns_12 = [
        {
            headerName: "大区", field: "zone_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide:false
        }, {
            headerName: "1-5", field: "ship_node1", editable: false, filter: 'set', width: 100,//发货节点
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide:false
        }, {
            headerName: "6-10", field: "ship_node2", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide:false
        }, {
            headerName: "11-15", field: "ship_node3", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide:false
        }, {
            headerName: "16-20", field: "ship_node4", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide:false
        }, {
            headerName: "21-25", field: "ship_node5", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "26-31", field: "ship_node6", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "小计", field: "total_ship_node", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    $scope.options_12 = {
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
            var isGrouping = $scope.options_12.columnApi.getRowGroupColumns().length > 0;
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
finmanControllers
    .controller('sale_months_invplan_header_hz', sale_months_invplan_header_hz);
