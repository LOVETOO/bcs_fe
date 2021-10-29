var basemanControllers = angular.module('inspinia');
function sale_cost_price_search($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_cost_price_search = HczyCommon.extend(sale_cost_price_search, ctrl_bill_public);
    sale_cost_price_search.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_pi_priceapply_header",
        FrmInfo: {},
        grids: [{optionname: 'options_13', idname: 'sale_pi_priceapply_line2ofsale_pi_priceapply_headers'}]
    };
   //查询
    $scope.search = function () {
        var postdata={};
        if($scope.data.currItem.start_date!=""){postdata.start_date=$scope.data.currItem.start_date};
        if($scope.data.currItem.end_date!=""){postdata.end_date=$scope.data.currItem.end_date};
        if($scope.data.currItem.item_h_id>0){postdata.item_h_id=$scope.data.currItem.item_h_id};
        if($scope.data.currItem.item_id>0){postdata.item_id=$scope.data.currItem.item_id};
        BasemanService.RequestPost("sale_pi_priceapply_header", "getitemlist", postdata)
            .then(function (data) {
                $scope.data.currItem.sale_pi_priceapply_line2ofsale_pi_priceapply_headers =
                    data.sale_pi_priceapply_line2ofsale_pi_priceapply_headers;
                $scope.options_13.api.setRowData(data.sale_pi_priceapply_line2ofsale_pi_priceapply_headers);
            });
    };
    /***************************弹出框***********************/
   //整机编码
    $scope.selectorg = function () {
        $scope.FrmInfo = {
            classid: "pro_item_header",
            postdata: {},
            sqlBlock: "Usable = 2"
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.item_h_id = result.item_h_id;
            $scope.data.currItem.item_h_code = result.item_h_code;
            $scope.data.currItem.item_h_name = result.item_h_name;
        });
    };
    $scope.Item_h_code=function(){
        $scope.data.currItem.item_h_id = "";
        $scope.data.currItem.item_h_code = "";
        $scope.data.currItem.item_h_name = "";
    };
    //分体机编码
    $scope.selectcust = function () {
        $scope.FrmInfo = {
            classid: "pro_item",
            postdata: {},
            sqlBlock: "Usable = 2",
            // backdatas: "pro_item_headers",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.item_id = result.item_id;
            $scope.data.currItem.item_code = result.item_code;
            $scope.data.currItem.item_name = result.item_name
        });


    };
    $scope.Item_code=function(){
        $scope.data.currItem.item_id = "";
        $scope.data.currItem.item_code = "";
        $scope.data.currItem.item_name = "";
    };
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
    $scope.columns_13 = [
        {
            headerName: "整机编码", field: "item_h_code", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "整机名称", field: "item_h_name", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "分体机编码", field: "item_code", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "分体机名称", field: "item_name", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "开始时间", field: "start_date", editable: false, filter: 'set', width: 120,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "结束时间", field: "end_date", editable: false, filter: 'set', width: 120,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "工厂预算结算价（美元）", field: "std_price", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "工厂预算结算价（人民币）", field: "base_price", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    $scope.options_13 = {
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
            var isGrouping = $scope.options_13.columnApi.getRowGroupColumns().length > 0;
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
    .controller('sale_cost_price_search', sale_cost_price_search);
