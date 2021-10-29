var finmanControllers = angular.module('inspinia');
function sale_xdmxds_search($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_xdmxds_search = HczyCommon.extend(sale_xdmxds_search, ctrl_bill_public);
    sale_xdmxds_search.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "fin_amount_search",
   /*     key: "funds_id",*/
        wftempid: 10008,
        FrmInfo: {
            sqlBlock: "funds_type=2",
        },
        grids: [{optionname: 'options_11', idname: 'fin_amount_search'}/*, {
            optionname: 'options_12',
            idname: 'fin_funds_kind_lineoffin_funds_headers'
        }, {optionname: 'options_13', idname: 'fin_funds_xypmoffin_funds_headers'}, {
            optionname: 'options_14',
            idname: 'fin_funds_sapoffin_funds_headers'
        }*/]
    };
    
    //下拉
     $scope.betd1 = [{
        	id:1,
        	name:"",
        },{
        	id:2,
        	name:"已开票",
        },{
        	id:3,
        	name:"未开票",
        }]
     BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        $scope.stat = data.dicts;
    })
    
    /*查询*/
   $scope.search = function () {
	sqlBlock="";
	//BasemanService.getSqlWhereBlock(sqlBlock);
	var postdata = { flag:102,
            sqlwhere  : sqlBlock,
            start_date: $scope.data.currItem.start_date,
            end_date: $scope.data.currItem.end_date,
			pi_no: $scope.data.currItem.pi_no,
			org_code: $scope.data.currItem.org_code,
			betd1: $scope.data.currItem.betd1,
			chk4: $scope.data.currItem.chk4,
			cust_code: $scope.data.currItem.cust_code,
			area_code: $scope.data.currItem.area_code,
			org_name: $scope.data.currItem.org_name,
			cust_name: $scope.data.currItem.cust_name,
			area_name: $scope.data.currItem.area_name
      
        };
 BasemanService.RequestPost("fin_amount_search", "search", postdata)
        .then(function(data){
            $scope.data.currItem.fin_amount_searchs=data.fin_amount_searchs;
             $scope.options_11.api.setRowData(data.fin_amount_searchs);
        });
}
   
   $scope.selectcode = function () {

		 $scope.FrmInfo = {
			classid: "scporg",
			postdata:{},
            backdatas:"orgs"
            /*sqlBlock: "org_id = " + $scope.data.currItem.org_id*/
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			 $scope.data.currItem.org_code = result.code;
			 $scope.data.currItem.org_name = result.orgname;
			 /*$scope.data.currItem.cust_id = result.cust_id;*/
        });

    }
   
   
   $scope.selectcust = function () {

			$scope.FrmInfo = {
			classid: "customer",
			postdata:{},
            backdatas:"customers"
            /*sqlBlock: "org_id = " + $scope.data.currItem.org_id*/
        };
		 
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			 $scope.data.currItem.cust_code = result.cust_code;
			 $scope.data.currItem.cust_name = result.cust_name;
			 $scope.data.currItem.cust_id = result.cust_id;
        });

    }
   
   
    $scope.area = function () {

			$scope.FrmInfo = {
			classid: "scporg",
			postdata:{},
            backdatas:"orgs"
            /*sqlBlock: "org_id = " + $scope.data.currItem.org_id*/
        };
		 
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			 $scope.data.currItem.area_code = result.area_code;
			 $scope.data.currItem.area_name = result.area_name;
        });

    }
    /**********************隐藏、显示*************************/
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
    //隐藏区域
    $scope.show_11 = false;
    $scope.show_sap = function () {
        $scope.show_11 = !$scope.show_11;
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
    //单据明细
    $scope.columns_11 = [
        {
            headerName: "时间", field: "end_date", editable: false, filter: 'set', width: 100,
            cellEditor: "勾选框",
/*            cellEditorParams: {
                values: [{value: "1", desc: "空调组织"}]
            },*/
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "币种", field: "currency_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "客户编码", field: "cust_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "发货金额", field: "amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "回款金额", field: "fact_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "应收款余额", field: "reduce_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];
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
    //产品部信息
    $scope.columns_12 = [
        {
            headerName: "到款单号", field: "funds_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "资金系统单号", field: "other_no", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "到款日期", field: "funds_date", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "汇款人", field: "hk_man", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "客户编码", field: "cust_code", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
        , {
            headerName: "引SAP时间", field: "sap_date", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "SAP凭证号", field: "sap_no", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "TT/LC", field: "funds_type", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "回款组织", field: "return_ent_type", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "币种", field: "currency_code", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "实收金额", field: "amt1", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "扣费", field: "amt_deduct", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "利息", field: "lc_interest", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "付款总额", field: "fact_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "PI号", field: "pi_no2", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "贸易类型", field: "trade_type2", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "分配金额", field: "allo_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "备注", field: "note", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "大区", field: "area_name2", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "业务员", field: "sales_user_id2", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];
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
    //信用证扣费名称
    $scope.columns_13 = [
        {
            headerName: "时间", field: "end_date", editable: false, filter: 'set', width: 100,
            cellEditor: "勾选框",
/*            cellEditorParams: {
                values: [{value: "1", desc: "空调组织"}]
            },*/
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "币种", field: "currency_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "客户编码", field: "cust_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "发货金额", field: "amt", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "回款金额", field: "fact_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "应收款余额", field: "Reduce_Amt", editable: false, filter: 'set', width: 100,
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
finmanControllers
    .controller('sale_xdmxds_search', sale_xdmxds_search);
