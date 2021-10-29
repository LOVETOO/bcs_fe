var basemanControllers = angular.module('inspinia');
function sale_ship_warn_runlt($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_ship_warn_runlt = HczyCommon.extend(sale_ship_warn_runlt, ctrl_bill_public);
    sale_ship_warn_runlt.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_ship_out_header",
       /* key: "out_id",*/
      //  wftempid:10125,
        FrmInfo: {},
        grids: [{optionname: 'options_13', idname: 'sale_ship_out_headers'}]
    };

//下拉框   贸易类型

	$scope.is_overs = [{
        	id:1,
        	name:"否",
        },{
        	id:2,
        	name:"是",
        }]

//查询
$scope.search = function () {
	var date1=$scope.data.currItem.startdate;
	var date2=$scope.data.currItem.enddate;
	if(date1>date2){
		 BasemanService.notice("起始日期不能大于截止日期", "alert-warning");
            return;
	}
	if($scope.data.currItem.check_check){
		var sqlwhere = "a.stat=1";
	}else {
		var sqlwhere = "a.stat=5";
	}
	if(date1!=undefined && date1!=""){
	sqlwhere+=" and a.create_time >= to_Date('" + date1
						+ "','yyyy-MM-dd')";
	}
	if(date2!=undefined && date2!=""){
	sqlwhere+="and a.create_time <= to_Date('" + date2+ "','yyyy-MM-dd')";
	}
	//BasemanService.getSqlWhereBlock(sqlBlock);
	var postdata = {
		    flag:13,
            sqlwhere  : sqlwhere,
            org_id: $scope.data.currItem.org_id, //
			pi_no: $scope.data.currItem.pi_no, //
			spec:$scope.data.currItem.spec, //
			inspection_batchno:$scope.data.currItem.inspection_batchno,//
/*			org_namef:$scope.data.currItem.org_namef,
            cust_code: $scope.data.currItem.cust_code,
			cust_name: $scope.data.currItem.cust_namea,
			startdate: $scope.data.currItem.startdate,
			enddate: $scope.data.currItem.enddate */
        };
 BasemanService.RequestPost("sale_ship_out_header", "search", postdata)
        .then(function(data){
            $scope.data.currItem.sale_ship_out_headers=data.sale_ship_out_headers;
             $scope.options_13.api.setRowData(data.sale_ship_out_headers);
        });
}

$scope.org_change = function (){
	$scope.data.currItem.org_name = "";
	$scope.data.currItem.org_id = ""; 	
}

//清空
$scope.clear = function () {
//	var postdata={};
//	var data=$scope.data.currItem.sale_pi_headers;
	for(var r in $scope.data.currItem){
		if(typeof ($scope.data.currItem[r]) == "string"){
			$scope.data.currItem[r] = "";
		}
	}
	$scope.options_13.api.setRowData([]);
/*	 BasemanService.RequestPost("sale_ship_out_header", "search", postdata)
        .then(function(data){
          $scope.options_13.api.setRowData([]);
        });*/
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
/*			sqlBlock: "scporg.Stat =2 and OrgType in (5, 14)",*/
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
			
            classid: "sale_ship_out_header",
	        postdata:{},
/*			sqlBlock: "scporg.Stat =2 and OrgType in (5, 14)",*/
            backdatas: "sale_ship_out_headers",
           
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
            headerName: "币种", field: "currency_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "货代", field: "cust_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
                headerName: "合同号", field: "pi_no", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
               
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
        },{
            headerName: "部门", field: "org_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
         
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "开航日期", field: "actual_ship_date", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "航名船次", field: "notice_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "目的港", field: "seaport_in_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "发票号", field: "spec", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "付款公司", field: "pay_company", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "支付对象", field: "pay_object", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "原因", field: "pay_reason", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        
        },{
            headerName: "责任人", field: "reason_man", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "合计金额", field: "sbg_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        
        },{
            headerName: "备注", field: "note1", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
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
    .controller('sale_ship_warn_runlt', sale_ship_warn_runlt);
