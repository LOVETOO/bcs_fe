var finmanControllers = angular.module('inspinia');
function sale_list_prodxygenlt($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_list_prodxygenlt = HczyCommon.extend(sale_list_prodxygenlt, ctrl_bill_public);
    sale_list_prodxygenlt.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "fin_lc_allot_header",
   /*     key: "funds_id",*/
        wftempid: 10008,
        FrmInfo: {
            sqlBlock: "funds_type=2",
        },
        grids: [{optionname: 'options_11', idname: 'fin_lc_allot_lineoffin_lc_allot_headers'}/*, {
            optionname: 'options_12',
            idname: 'fin_funds_kind_lineoffin_funds_headers'
        }, {optionname: 'options_13', idname: 'fin_funds_xypmoffin_funds_headers'}, {
            optionname: 'options_14',
            idname: 'fin_funds_sapoffin_funds_headers'
        }*/]
    };
    
    //下拉
     $scope.is_part_shipments = [
        {
            id: 1,
            name: "否"
        }, {
            id: 2,
            name: "是"
        }];
     BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        $scope.stat = data.dicts;
		console.log($scope.stat);
    })
    
    /*查询*/
   $scope.search = function () {
	sqlBlock="";
	//BasemanService.getSqlWhereBlock(sqlBlock);
	var postdata = { flag:1,
            sqlwhere  : sqlBlock,
            org_id: $scope.data.currItem.org_id,
            org_name: $scope.data.currItem.org_namea,
			area_id:$scope.data.currItem.funds_id,
			cust_id: $scope.data.currItem.cust_id,
			cust_name: $scope.data.currItem.cust_namea,
			enddate: $scope.data.currItem.enddate
        };
 BasemanService.RequestPost("fin_lc_allot_header", "analysis", postdata)
        .then(function(data){
            $scope.data.currItem.fin_lc_allot_lineoffin_lc_allot_headers=data.fin_lc_allot_lineoffin_lc_allot_headers;
             $scope.options_11.api.setRowData(data.fin_lc_allot_lineoffin_lc_allot_headers);
        });
}
   // 到款单号
    $scope.fin_funds_header = function () {
        $scope.FrmInfo = {
            classid: "fin_funds_header",
			/*postdata:{},
			 backdatas:"orgs"*/
            sqlBlock: " Fin_Funds_Header.stat=5 and Fin_Funds_Header.tt_type<>8 and  nvl(Fin_Funds_Header.Allocated_Amt,0) < nvl(Fin_Funds_Header.Fact_Amt,0)"
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
		.result.then(function (result) {
			console.log(result);
        $scope.data.currItem.funds_no = result.funds_no;
		$scope.data.currItem.funds_id = result.funds_id;
		
           
           
        })
    }; 
   $scope.selectcode = function () {

		 $scope.FrmInfo = {
			classid: "scporg",
			postdata:{},
            backdatas:"orgs",
             sqlBlock: "scporg.Stat =2 and OrgType in (5, 14)"
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			 $scope.data.currItem.org_code = result.code;
			 $scope.data.currItem.org_namea = result.orgname;
            $scope.data.currItem.org_name = result.orgname;
			 $scope.data.currItem.org_id = result.orgid;
        });

    }


    //业务部门
    $scope.changeAreaName = function () {

        $scope.data.currItem.org_name = "";
        $scope.data.currItem.org_id = "";
    };
    //客户
    $scope.change_customer = function () {

        $scope.data.currItem.cust_name = "";
        $scope.data.currItem.cust_id = "";
    };
    //单号
    $scope.pino = function () {

        $scope.data.currItem.funds_no = "";
        $scope.data.currItem.funds_id = "";
    };
   
   $scope.selectcust = function () {
       var fag="";
       if($scope.data.currItem.org_id!="" && $scope.data.currItem.org_id!=undefined){
           fag="org_id = " + $scope.data.currItem.org_id;
       }
			$scope.FrmInfo = {
			classid: "customer",
			postdata:{},
            backdatas:"customers",
            sqlBlock: fag
        };
		 
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			 $scope.data.currItem.cust_code = result.cust_code;
			 $scope.data.currItem.cust_name = result.cust_name;
            $scope.data.currItem.cust_namea = result.cust_name;
			 $scope.data.currItem.cust_id = result.cust_id;
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
            headerName: "分配单号", field: "lc_allot_no", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
/*            cellEditorParams: {
                values: [{value: "1", desc: "空调组织"}]
            },*/
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "信用证号", field: "lc_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "PI号", field: "pi_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "业务部门", field: "org_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "客户", field: "cust_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "分配金额", field: "amt", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "发货金额", field: "send_amt", editable: false, filter: 'set', width: 100,
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
    //产品部信息
    $scope.columns_12 = [
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
   
    $scope.initdata();
}

//加载控制器
finmanControllers
    .controller('sale_list_prodxygenlt', sale_list_prodxygenlt);
