var billmanControllers = angular.module('inspinia');
function sale_pi_headerEdit($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService) {
    //继承基类方法
    sale_pi_headerEdit = HczyCommon.extend(sale_pi_headerEdit, ctrl_bill_public);
    sale_pi_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf={
        name:"sale_pi_header",
        key:"pi_id",
        //wftempid:
        FrmInfo: {},
        grids:[]
    };
	
	/******************  页面隐藏****************************/
    $scope.show_11 = false;
    $scope.show11 = function () {
        $scope.show_11 = !$scope.show_11;
    };
    $scope.show_12 = false;
    $scope.show12 = function () {
        $scope.show_12 = !$scope.show_12;
    };
    $scope.show_13 = false;
    $scope.show13 = function () {
        $scope.show_13 = !$scope.show_13;
    };
    $scope.show_14 = false;
    $scope.show14 = function () {
        $scope.show_14 = !$scope.show_14;
    };
    $scope.show_15 = false;
    $scope.show15 = function () {
        $scope.show_15 = !$scope.show_15;
    };
    $scope.show_16 = false;
    $scope.show16 = function () {
        $scope.show_16 = !$scope.show_16;
    };
	//sheet 第2页
    $scope.show_21 = false;
    $scope.show21 = function () {
        $scope.show_21 = !$scope.show_21;
    };
	$scope.show_22 = false;
    $scope.show22 = function () {
        $scope.show_22 = !$scope.show_22;
    };
	//sheet 第3页
    $scope.show_31 = false;
    $scope.show31 = function () {
        $scope.show_31 = !$scope.show_31;
    };
    //sheet 第4页
    $scope.show_41 = false;
    $scope.show41 = function () {
        $scope.show_41 = !$scope.show_41;
    };
	$scope.show_42 = false;
    $scope.show42 = function () {
        $scope.show_42 = !$scope.show_42;
    };
	$scope.show_43 = false;
    $scope.show43 = function () {
        $scope.show_43 = !$scope.show_43;
    };
	$scope.show_44 = false;
    $scope.show44 = function () {
        $scope.show_44 = !$scope.show_44;
    };
	$scope.show_45 = false;
    $scope.show45 = function () {
        $scope.show_45 = !$scope.show_45;
    };
	
   /**----------------------------------------*/
    if (window.userbean) {
        $scope.userbean = window.userbean;
    }
  //查询柜型
  /**  BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "box_type"}).then(function (data) {
            intoObj.value = data.dicts[i].dictvalue;
            intoObj.desc = data.dicts[i].dictname;
        }
    })*/
	/**********************业务逻辑控制***************/
	
	
	/**---------------------------------------------**/
	
	
	/**************************网格区域***************/
	
	//分组功能
	var groupColumn = {
    headerName: "Group",
    width: 200,
    field: 'name',
    valueGetter: function(params) {
        if (params.node.group) {
            return params.node.key;
        } else {
            return params.data[params.colDef.field];
        }
    },
    comparator: agGrid.defaultGroupComparator,
    cellRenderer: 'group',
    cellRendererParams: function(params){}
    };

	//资金预览
	$scope.options_11 = {
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
            var isGrouping = $scope.payment_typeoptions.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
	$scope.columns_11 = [       
    {
        headerName: "序号", field: "seq",editable: false, filter: 'set',  width: 60,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "付款方式", field: "pay_type",editable: false, filter: 'set',  width: 150,
		cellEditor:"下拉框",
		cellEditorParams: {values: [{value: 1, desc: 'TT'},{value: 2, desc: 'LC'},{value: 3, desc: 'OA'},{value: 4, desc: '领导特批'}]},
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "金额", field: "amount",editable: true, filter: 'set',  width: 150,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "付款比例", field: "pay_ratio",editable: true, filter: 'set',  width: 150,
		cellEditor:"浮点框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "回款期限", field: "days",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "基础扣费", field: "base_fee",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	}
];

	//费用明细
	$scope.options_12 = {
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
            var isGrouping = $scope.payment_typeoptions.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
	$scope.columns_12 = [       
    {
        headerName: "序号", field: "seq",editable: false, filter: 'set',  width: 60,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "订单费用编码", field: "order_fee_code",editable: true, filter: 'set',  width: 200,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "订单费用名称", field: "order_fee_name",editable: true, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "费用", field: "amt_fee",editable: false, filter: 'set',  width: 150,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	}
];

	//柜型柜量
	$scope.options_13 = {
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
            var isGrouping = $scope.payment_typeoptions.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
	$scope.columns_13 = [       
    {
        headerName: "序号", field: "seq",editable: false, filter: 'set',  width: 60,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "柜型", field: "box_type",editable: true, filter: 'set',  width: 200,
		cellEditor:"下拉框",
		cellEditorParams: {values:[]},
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "柜数", field: "box_qty",editable: true, filter: 'set',  width: 150,
		cellEditor:"整数框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "到货港", field: "seaport_in_name",editable: false, filter: 'set',  width: 150,
		cellEditor:"弹出框",
		action:$scope.seaport_in_name,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "单柜海运费", field: "amt_fee1",editable: true, filter: 'set',  width: 150,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "单柜保险费", field: "amt_fee2",editable: true, filter: 'set',  width: 150,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "参考海运费", field: "ref_amt",editable: true, filter: 'set',  width: 150,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	}
];

	//款项明细
	$scope.options_14 = {
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
            var isGrouping = $scope.payment_typeoptions.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
	$scope.columns_14 = [       
    {
        headerName: "序号", field: "seq",editable: false, filter: 'set',  width: 60,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "资金单号", field: "money_bill_no",editable: true, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},	
	{
        headerName: "付款方式", field: "pay_type",editable: false, filter: 'set',  width: 150,
		cellEditor:"下拉框",
		cellEditorParams: {values: [{value: 1, desc: 'TT'},{value: 2, desc: 'LC'},{value: 3, desc: 'OA'},{value: 4, desc: '领导特批'}]},
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "对应单据号", field: "source_bill_no",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "金额", field: "amount",editable: false, filter: 'set',  width: 150,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "发货金额", field: "send_amt",editable: false, filter: 'set',  width: 150,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "已发货确认金额", field: "confirm_amt",editable: false, filter: 'set',  width: 150,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "已核销金额", field: "reduce_amt",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "是否可用", field: "usable",editable: true, filter: 'set',  width: 100,
		cellEditor:"下拉框",
		cellEditorParams: {values:[{value: 1, desc: '否'},{value: 2, desc: '是'}]},
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	}
];


	//机型参数
	$scope.options_15 = {
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
            var isGrouping = $scope.payment_typeoptions.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
	$scope.columns_15 = [       
    {
        headerName: "序号", field: "seq",editable: false, filter: 'set',  width: 60,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "整机编码", field: "item_h_code",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},	
	{
        headerName: "客户型号", field: "cust_item_name",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "参数类型", field: "row_type",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "国家名称", field: "area_name",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "制冷剂类型", field: "refrigerant",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "气候", field: "climate_type",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "电源", field: "power_type",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "低电压", field: "low_voltage",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "冬季最低温度", field: "low_temperature",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "夏季最高温度", field: "high_temperature",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "能效", field: "energy",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "认证", field: "certification",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	}
];

	//机型面板
	$scope.options_16 = {
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
            var isGrouping = $scope.payment_typeoptions.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
	$scope.columns_16 = [       
    {
        headerName: "序号", field: "seq",editable: false, filter: 'set',  width: 60,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "整机编码", field: "item_h_code",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},	
	{
        headerName: "客户型号", field: "cust_item_name",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "机型类型", field: "item_type",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "面板款式", field: "mb_style",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "面板颜色", field: "mb_color",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "装饰条颜色", field: "mb_article",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	}
];

    //sheet页第二页订单明细
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
        //rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.payment_typeoptions.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
	$scope.columns_21 = [       
    {
        headerName: "序号", field: "seq",editable: false, filter: 'set',  width: 60,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "品牌名", field: "brand_name",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},	
	{
        headerName: "销售国家", field: "area_names",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "类型", field: "line_type",editable: false, filter: 'set',  width: 150,
		cellEditor:"下拉框",
		cellEditorParams: {values:[]},
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "工厂型号编码", field: "item_h_code",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "工厂型号", field: "item_h_name",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "客户型号", field: "cust_item_name",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "数量", field: "qty",editable: false, filter: 'set',  width: 100,
		cellEditor:"整数框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "FOB销售价", field: "price",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "销售金额", field: "sale_amt",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "指导价", field: "guide_p6",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "业务结算价", field: "P4",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "结算价", field: "P6",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "标准结算价", field: "std_p4",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "指导价毛利率", field: "hguide_hwmlv",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "指导选配差价", field: "std_c_price",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "业务选配结算差价", field: "c_price",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "标准选配差价", field: "std_c_cl_cb",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "资金成本", field: "S3",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "汇兑损益", field: "S4",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "返利", field: "S7",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "佣金", field: "S1",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "CKD费用", field: "ckd_amt",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "SKD费用", field: "skd_amt",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "包装费用", field: "package_fee",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "佣金", field: "S1",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "产品技术要求", field: "item_desc",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "材料成本价", field: "cl_cb",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "材料成本差价", field: "c_cl_cb",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "标准成本", field: "std_cl_cb",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "机型装柜数量", field: "box_qty",editable: false, filter: 'set',  width: 100,
		cellEditor:"整数框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	}
];

	//分体机
	$scope.options_22 = {
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
            var isGrouping = $scope.payment_typeoptions.columnApi.getRowGroupColumns().length > 0;
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
        headerName: "机型类别", field: "pro_type",editable: false, filter: 'set',  width: 150,
		cellEditor:"下拉框",
		cellEditorParams: {values:[]},
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},	
	{
        headerName: "散件类型", field: "sj_type",editable: false, filter: 'set',  width: 150,
		cellEditor:"下拉框",
		cellEditorParams: {values:[]},
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "分体机编码", field: "item_code",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "分体机描述", field: "item_name",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "客户型号", field: "cust_item_name",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "客户产品名称", field: "cust_spec",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "数量", field: "qty",editable: false, filter: 'set',  width: 100,
		cellEditor:"整数框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "FOB销售价", field: "price",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "销售金额", field: "sale_amt",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "指导价", field: "guide_p6",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "业务结算价", field: "P4",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "标准结算价", field: "std_p4",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "指导选配差价", field: "std_c_price",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "业务选配结算差价", field: "c_price",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "标准选配差价", field: "std_c_cl_cb",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "备注", field: "note",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "压机型号", field: "comp_name",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "材料成本价", field: "cl_cb",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "材料成本差价", field: "c_cl_cb",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "指导成本", field: "guide_cl_cb",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "制造费用系数", field: "made_sx",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "包装费用", field: "package_fee",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	}
];

	//配件清单
	$scope.options_23 = {
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
            var isGrouping = $scope.payment_typeoptions.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
	$scope.columns_23 = [       
	{
        headerName: "整机编码", field: "item_h_code",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},	
	{
        headerName: "整机名称", field: "item_h_name",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "分体机编码", field: "item_code",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "分体机名称", field: "item_name",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "客户型号", field: "cust_item_name",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "配件分类", field: "part_class",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "配件描述", field: "part_desc",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "英文名", field: "part_en_name",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "单台用量", field: "qty",editable: false, filter: 'set',  width: 100,
		cellEditor:"整数框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "需求数量", field: "require_qty",editable: false, filter: 'set',  width: 100,
		cellEditor:"整数框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "价格", field: "price",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "销售价格", field: "psale_price",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "金额", field: "amt",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "备注", field: "note",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	}
];

	//当前机型
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
        //rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.payment_typeoptions.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
	$scope.columns_31 = [       
	{
        headerName: "配置项名称", field: "conf_name",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},	
	{
        headerName: "可选项名称", field: "option_name",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "是否特殊项", field: "is_special",editable: false, filter: 'set',  width: 150,
		cellEditor:"复选框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "是否标配", field: "is_default",editable: false, filter: 'set',  width: 150,
		cellEditor:"复选框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "方案号", field: "file_no",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "方案名称", field: "file_name",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "价差", field: "diff_price",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "选配信息", field: "defs",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "备注", field: "note",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	}
];

	//所有机型
	$scope.options_32 = {
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
            var isGrouping = $scope.payment_typeoptions.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
	$scope.columns_32 = [       
	{
        headerName: "配置项名称", field: "conf_name",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},	
	{
        headerName: "可选项名称", field: "option_name",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "是否特殊项", field: "is_special",editable: false, filter: 'set',  width: 150,
		cellEditor:"复选框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "是否标配", field: "is_default",editable: false, filter: 'set',  width: 150,
		cellEditor:"复选框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "方案号", field: "file_no",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "方案名称", field: "file_name",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "客户型号", field: "item_cust_name",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "机型编码", field: "item_code",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "机型名称", field: "item_name",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "价差", field: "diff_price",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "选配信息", field: "defs",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "备注", field: "note",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	}
];

	//打散-包装方案
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
            var isGrouping = $scope.payment_typeoptions.columnApi.getRowGroupColumns().length > 0;
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
        headerName: "散件类型", field: "sj_type",editable: false, filter: 'set',  width: 150,
		cellEditor:"下拉框",
		cellEditorParams:{values:[]},
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},	
	{
        headerName: "打散方案", field: "break_name",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "装配规则", field: "assembly_name",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "打散大类名称", field: "item_type_name",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "机型编码", field: "item_code",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "适用机型", field: "item_name",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "订单数量", field: "qty",editable: false, filter: 'set',  width: 100,
		cellEditor:"整数框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "制造费用系数", field: "made_sx",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "包装费用", field: "package_fee",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "价差", field: "diff_price",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "选配信息", field: "defs",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "备注", field: "note",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	}
];

	//打散方案明细 左边
	$scope.options_42 = {
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
            var isGrouping = $scope.payment_typeoptions.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
	$scope.columns_42 = [
    {
        headerName: '序号',
        field: 'line_id',
        width: 70,
        editable: true,
        enableRowGroup: true,
        checkboxSelection: function (params) {
            // we put checkbox on the name if we are not doing no grouping
            return params.columnApi.getRowGroupColumns().length === 0;
        },
        icons: {
            sortAscending: '<i class="fa fa-sort-alpha-asc"/>',
            sortDescending: '<i class="fa fa-sort-alpha-desc"/>'
        }
    },	
	{
        headerName: "父项序号", field: "p_seq",editable: true, filter: 'set',  width: 150,
		cellEditor:"文本框",
		cellEditorParams:{values:[]},
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},	
	{
        headerName: "编码前缀", field: "item_code",editable: true, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "物料描述包含", field: "item_name",editable: true, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "物料描述不包含", field: "item_name2",editable: true, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "包装方式", field: "pack_name",editable: true, filter: 'set',  width: 100,
		cellEditor:"下拉框",
		cellEditorParams:{values:[]},
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "备注", field: "note",editable: true, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	}
];

	//打散方案明细 右边
	$scope.options_43 = {
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
            var isGrouping = $scope.payment_typeoptions.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
	$scope.columns_43 = [
    {
        headerName: '序号',
        field: 'line_id',
        width: 70,
        editable: true,
        enableRowGroup: true,
        checkboxSelection: function (params) {
            // we put checkbox on the name if we are not doing no grouping
            return params.columnApi.getRowGroupColumns().length === 0;
        },
        icons: {
            sortAscending: '<i class="fa fa-sort-alpha-asc"/>',
            sortDescending: '<i class="fa fa-sort-alpha-desc"/>'
        }
    },	
	{
        headerName: "编码", field: "item_code",editable: true, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},	
	{
        headerName: "物料描述", field: "item_code",editable: true, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "方案类型", field: "ptype_name",editable: true, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "包装方式", field: "pack_name",editable: true, filter: 'set',  width: 150,
		cellEditor:"下拉框",
		cellEditorParams:{values:[]},
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "单台用量", field: "item_qty",editable: true, filter: 'set',  width: 100,
		cellEditor:"整数框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "BOM层次", field: "bom_level",editable: true, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	}
];

	//包装方案
	$scope.options_44 = {
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
            var isGrouping = $scope.payment_typeoptions.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
	$scope.columns_44 = [
    {
        headerName: '序号',
        field: 'line_id',
        width: 70,
        editable: true,
        enableRowGroup: true,
        checkboxSelection: function (params) {
            // we put checkbox on the name if we are not doing no grouping
            return params.columnApi.getRowGroupColumns().length === 0;
        },
        icons: {
            sortAscending: '<i class="fa fa-sort-alpha-asc"/>',
            sortDescending: '<i class="fa fa-sort-alpha-desc"/>'
        }
    },		
	{
        headerName: "BOM层次", field: "bom_level",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},	
	{
        headerName: "BOM路径", field: "item_ids",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "方案类型", field: "ptype_name",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "物料编码", field: "item_code",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "物料描述", field: "item_name",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "单位", field: "item_uom",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "单台用量(PC)", field: "item_qty",editable: false, filter: 'set',  width: 100,
		cellEditor:"整数框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "制造费用系数", field: "made_sx",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "打散方式", field: "pack_name",editable: false, filter: 'set',  width: 100,
		cellEditor:"下拉框",
		cellEditorParams:{values:[]},
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "包装方案名称", field: "package_name",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "原包装数量", field: "qty",editable: false, filter: 'set',  width: 100,
		cellEditor:"整数框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "原包装用量", field: "calc_qty",editable: false, filter: 'set',  width: 100,
		cellEditor:"整数框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "长", field: "package_long",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "宽", field: "package_wide",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "高", field: "package_high",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "包辅物料", field: "item_code2",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "包辅物料描述", field: "item_desc2",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "包辅用量", field: "item_qty2",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "BOM包类型", field: "package_ware",editable: false, filter: 'set',  width: 100,
		cellEditor:"下拉框",
		cellEditorParams:{values:[]},
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "包装工厂", field: "package_factory",editable: false, filter: 'set',  width: 100,
		cellEditor:"下拉框",
		cellEditorParams:{values:[]},
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "生产类型", field: "made_type",editable: false, filter: 'set',  width: 100,
		cellEditor:"下拉框",
		cellEditorParams:{values:[]},
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "所属箱型", field: "item_type",editable: false, filter: 'set',  width: 100,
		cellEditor:"下拉框",
		cellEditorParams:{values:[]},
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "所属类型", field: "row_type",editable: false, filter: 'set',  width: 100,
		cellEditor:"下拉框",
		cellEditorParams:{values:[]},
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "包辅料所需用量", field: "package_qty",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "备注", field: "note",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	}
];

	//辅料用量汇总
	$scope.options_45 = {
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
            var isGrouping = $scope.payment_typeoptions.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
	$scope.columns_45 = [	
	{
        headerName: "BOM包类型", field: "package_ware",editable: false, filter: 'set',  width: 150,
		cellEditor:"下拉框",
		cellEditorParams:{values:[]},
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},	
	{
        headerName: "包辅料编码", field: "item_code2",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "包辅料描述", field: "item_desc2",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "订单数量", field: "order_qty",editable: false, filter: 'set',  width: 150,
		cellEditor:"整数框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "包辅料所需用量", field: "package_qty",editable: false, filter: 'set',  width: 150,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "包辅料实际用量", field: "actual_qty",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "包装箱单位体积", field: "package_tj",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "所属类型", field: "row_type",editable: false, filter: 'set',  width: 100,
		cellEditor:"下拉框",
		cellEditorParams:{values:[]},
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "所属箱型", field: "item_type",editable: false, filter: 'set',  width: 100,
		cellEditor:"下拉框",
		cellEditorParams:{values:[]},
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "合并序号", field: "union_seq",editable: false, filter: 'set',  width: 100,
		cellEditor:"整数框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "辅料成本", field: "price",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	}
];

	//标机BOM查看
	$scope.options_46 = {
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
            var isGrouping = $scope.payment_typeoptions.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
	$scope.columns_46 = [	
	{
        headerName: "物料编码", field: "item_code",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "物料名称", field: "item_name",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "数量", field: "qty",editable: false, filter: 'set',  width: 150,
		cellEditor:"整数框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "单装物料", field: "danz",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "备注", field: "note",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	}
];

//包装方案（未维护）
	$scope.options_47 = {
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
            var isGrouping = $scope.payment_typeoptions.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
	$scope.columns_47 = [
    {
        headerName: '序号',
        field: 'line_id',
        width: 70,
        editable: true,
        enableRowGroup: true,
        checkboxSelection: function (params) {
            // we put checkbox on the name if we are not doing no grouping
            return params.columnApi.getRowGroupColumns().length === 0;
        },
        icons: {
            sortAscending: '<i class="fa fa-sort-alpha-asc"/>',
            sortDescending: '<i class="fa fa-sort-alpha-desc"/>'
        }
    },		
	{
        headerName: "BOM层次", field: "bom_level",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},	
	{
        headerName: "BOM路径", field: "item_ids",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "方案类型", field: "ptype_name",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "物料编码", field: "item_code",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "物料描述", field: "item_name",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "单位", field: "item_uom",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "单台用量(PC)", field: "item_qty",editable: false, filter: 'set',  width: 100,
		cellEditor:"整数框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "制造费用系数", field: "made_sx",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "打散方式", field: "pack_name",editable: false, filter: 'set',  width: 100,
		cellEditor:"下拉框",
		cellEditorParams:{values:[]},
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "包装方案名称", field: "package_name",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "原包装数量", field: "qty",editable: false, filter: 'set',  width: 100,
		cellEditor:"整数框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "原包装用量", field: "calc_qty",editable: false, filter: 'set',  width: 100,
		cellEditor:"整数框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "长", field: "package_long",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "宽", field: "package_wide",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "高", field: "package_high",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "包辅物料", field: "item_code2",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "包辅物料描述", field: "item_desc2",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "包辅用量", field: "item_qty2",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "BOM包类型", field: "package_ware",editable: false, filter: 'set',  width: 100,
		cellEditor:"下拉框",
		cellEditorParams:{values:[]},
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "包装工厂", field: "package_factory",editable: false, filter: 'set',  width: 100,
		cellEditor:"下拉框",
		cellEditorParams:{values:[]},
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "生产类型", field: "made_type",editable: false, filter: 'set',  width: 100,
		cellEditor:"下拉框",
		cellEditorParams:{values:[]},
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "所属箱型", field: "item_type",editable: false, filter: 'set',  width: 100,
		cellEditor:"下拉框",
		cellEditorParams:{values:[]},
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "所属类型", field: "row_type",editable: false, filter: 'set',  width: 100,
		cellEditor:"下拉框",
		cellEditorParams:{values:[]},
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "包辅料所需用量", field: "package_qty",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "备注", field: "note",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	}
];

/**---------------------------------------------**/
/*******************************导出excel**********/
    $scope.export = function () {
        if (!$scope.data.currItem.pi_id) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        BasemanService.RequestPost("sale_pi_header", "exporttoexcel", {'pi_id': $scope.data.currItem.pi_id})
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
        if (!$scope.data.currItem.pi_id) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        BasemanService.RequestPost("sale_pi_header", "exporttoexcel1", {'pi_id': $scope.data.currItem.pi_id})
            .then(function (data) {
                if (data.docid != undefined && Number(data.docid) != 0) {
                    var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                    window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                } else {
                    BasemanService.notice("导出失败!", "alert-info");
                }
            });
    }
	
/**----------------------------------------------*/
    //数据缓存
    $scope.initdata();
}
//加载控制器
billmanControllers
    .controller('sale_pi_headerEdit', sale_pi_headerEdit)
