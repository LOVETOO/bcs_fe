var basemanControllers = angular.module('inspinia');
function sale_ship_warn_badlt($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_ship_warn_badlt = HczyCommon.extend(sale_ship_warn_badlt, ctrl_bill_public);
    sale_ship_warn_badlt.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_ship_notice_header",
       /* key: "out_id",*/
      //  wftempid:10125,
        FrmInfo: {},
        grids: [{optionname: 'options_13', idname: 'sale_ship_notice_headers'}]
    };


//下拉框   贸易类型

	 BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"}).then(function (data) {
        $scope.sale_ent_types = data.dicts;
    })

//查询
$scope.search = function () {
	var date1=$scope.data.currItem.startdate;
	var date2=$scope.data.currItem.enddate;
	if(date1>date2){
		 BasemanService.notice("起始日期不能大于截止日期", "alert-warning");
            return;
	}
	sqlBlock="";
	//BasemanService.getSqlWhereBlock(sqlBlock);
	var postdata = { flag:2,
            sqlwhere  : sqlBlock,
            org_code: $scope.data.currItem.org_code,
            org_name: $scope.data.currItem.org_name,
			org_namea:$scope.data.currItem.org_namea,
			org_nameb:$scope.data.currItem.org_nameb,
			org_namec:$scope.data.currItem.org_namec,
			org_named:$scope.data.currItem.org_named,
            cust_code: $scope.data.currItem.cust_code,
			cust_name: $scope.data.currItem.cust_namea,
			startdate: $scope.data.currItem.startdate,
			enddate: $scope.data.currItem.enddate
        };
 BasemanService.RequestPost("sale_ship_notice_header", "getsapline", postdata)
        .then(function(data){
            $scope.data.currItem.sale_ship_notice_headers=data.sale_notice_sapofsale_ship_notice_headers;
             $scope.options_13.api.setRowData(data.sale_notice_sapofsale_ship_notice_headers);

        });
}


    /***************************弹出框***********************/
	$scope.select = function () {
        $scope.FrmInfo = {
			
            classid: "scporg",
	        postdata:{},
			sqlBlock: "scporg.Stat =2 and OrgType in (5, 14)",
            backdatas: "orgs",
           
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			$scope.data.currItem.org_id = result.orgid;
			 $scope.data.currItem.org_code = result.code;   
			 $scope.data.currItem.org_name = result.orgname			
        });
    }
	
	$scope.select2 = function () {
        $scope.FrmInfo = {
			
            classid: "customer",
	        postdata:{},

            backdatas: "customers",
           
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			$scope.data.currItem.org_id = result.orgid;
			 $scope.data.currItem.org_code = result.code;   
			 $scope.data.currItem.org_name = result.orgname			
        });
    }
	
	$scope.select3 = function () {
        $scope.FrmInfo = {
			
            classid: "sale_ship_notice_header",
	        postdata:{},

            backdatas: "sale_ship_notice_headers",
           
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			$scope.data.currItem.org_id = result.orgid;
			 $scope.data.currItem.org_code = result.code;   
			 $scope.data.currItem.org_name = result.orgname			
        });
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
$scope.columns_13 = [
        {
            headerName: "条件类型", field: "tjlx", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "清单屏幕的选择指示符", field: "pmqd", editable: true, filter: 'set', width: 200,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
                headerName: "清单屏幕的选择指示符", field: "pmqd2", editable: true, filter: 'set', width: 200,
                cellEditor: "文本框",
               
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
        },{
            headerName: "销售组织", field: "xszz", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
         
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "工厂", field: "gc", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "物料号", field: "erp_code", editable: true, filter: 'set', width: 150,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "价格", field: "kaip_amt", editable: true, filter: 'set', width: 150,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "比率单位（货币或百分数）", field: "currency_code", editable: true, filter: 'set', width: 200,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "条件记录有效起始日期", field: "start_date", editable: true, filter: 'set', width: 180,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "条件记录有效截止日期", field: "end_date", editable: true, filter: 'set', width: 180,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "条件定价单位", field: "out_qty", editable: true, filter: 'set', width: 150,
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
    .controller('sale_ship_warn_badlt', sale_ship_warn_badlt);
