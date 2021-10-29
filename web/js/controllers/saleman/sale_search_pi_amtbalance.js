var basemanControllers = angular.module('inspinia');
function sale_search_pi_amtbalance($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_search_pi_amtbalance = HczyCommon.extend(sale_search_pi_amtbalance, ctrl_bill_public);
    sale_search_pi_amtbalance.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_report",
   /*     key: "out_id",*/
      //  wftempid:10125,
        FrmInfo: {},
        grids: [{optionname: 'options_13', idname: 'sale_reports'}]
    };

//下拉框   贸易类型
	
	 $scope.searchclass=[{
	 	id:1,
	 	name:"发货完结",
	 },{
	 	id:2,
	 	name:"未发货",
	 },{
	 	id:3,
	 	name:"部分发货",
	 }]

//查询
$scope.search = function () {
	var date1=$scope.data.currItem.start_date;
	var date2=$scope.data.currItem.end_date;
	var sqlBlock="";
	var date3=$scope.data.currItem.searchclass;
	if(date3==1){
      sqlBlock+= " and SC.排产总额=FH.发货货值金额 ";
	}
	if(date3==2){
      sqlBlock+= " and FH.发货货值金额=0 ";
	}if(date3==3){
      sqlBlock+= "  and (SC.排产总额!=FH.发货货值金额 and FH.发货货值金额!=0) ";
	}
	
	if(date1>date2){
		 BasemanService.notice("起始日期不能大于截止日期", "alert-warning");
            return;
	}

	if($scope.data.currItem.org_code!="" && $scope.data.currItem.org_code!=undefined){
		sqlBlock+=" and pi.org_code like '%" + $scope.data.currItem.org_code + "%'";
	}
	if($scope.data.currItem.org_name!="" && $scope.data.currItem.org_name!=undefined){
		sqlBlock+=" and pi.org_name like '%" + $scope.data.currItem.org_name + "%'";
	}
	/*if($scope.data.currItem.cust_code!="" && $scope.data.currItem.cust_code!=undefined){
		sqlBlock+=" and pi.cust_code like '%" + $scope.data.currItem.cust_code + "%'";
	}*/
	if($scope.data.currItem.cust_name!="" && $scope.data.currItem.cust_name!=undefined){
		sqlBlock+=" and pi.cust_name like '%" + $scope.data.currItem.cust_name + "%'";
	}
	if($scope.data.currItem.pi_no!="" && $scope.data.currItem.pi_no!=undefined){
		sqlBlock+=" and pi.pi_no like '%" + $scope.data.currItem.pi_no + "%'";
	}
	if(date1!=undefined && date1!=""){
	sqlBlock+=" and pi.check_time>to_date('" + date1
						+ "','YYYY-MM-DD')";
	}
	if(date2!=undefined && date2!=""){
	sqlBlock+=" and pi.check_time<to_date('" + date2+ "','YYYY-MM-DD')+1";
	}
	//BasemanService.getSqlWhereBlock(sqlBlock);
	var postdata = { flag:3,
            sqlwhere  : sqlBlock,
			cust_code: $scope.data.currItem.cust_code,
			cust_id: $scope.data.currItem.cust_id,
			org_code: $scope.data.currItem.org_code,
			org_id: $scope.data.currItem.org_id,
			start_date: $scope.data.currItem.start_date,
			end_date: $scope.data.currItem.end_date,
			sales_user_id: $scope.data.currItem.sales_user_id,
			pi_no: $scope.data.currItem.pi_no,
			searchclass: $scope.data.currItem.searchclass
      
        };
 BasemanService.RequestPost("sale_report", "search", postdata)
        .then(function(data){
            $scope.data.currItem.sale_reports=data.sale_reports
             $scope.options_13.api.setRowData(data.sale_reports);
        });
}


    /***************************弹出框***********************/
	$scope.selectorg = function () {
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
$scope.selectcust = function () {
       
        $scope.FrmInfo = {
			title: "客户",
			thead: [
				{
				name: "客户编码",
                code: "cust_code",
				 show: true,
                iscond: true,
                type: 'string'

            }, {
                name: "SAP编码",
                code: "sap_code",
				show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "客户名称",
                code: "cust_name",
				show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "客户描述",
                code: "cust_desc",
				show: true,
                iscond: true,
                type: 'string'
            }],
			is_custom_search:true,
			is_high:true,
            classid: "customer",
            sqlBlock: "" 
        };
        BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
			 $scope.data.currItem.cust_code = result.cust_code;
			 $scope.data.currItem.cust_name = result.cust_name;
			 $scope.data.currItem.cust_id = result.cust_id;
        });

    };
//业务部门
    $scope.changeAreaName = function () {
        $scope.data.currItem.org_code = "";
        $scope.data.currItem.org_name = "";
        $scope.data.currItem.org_id = "";
    };
    //客户
    $scope.change_customer = function () {
        $scope.data.currItem.cust_code = "";
        $scope.data.currItem.cust_name = "";
        $scope.data.currItem.cust_id = "";
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
            headerName: "PI号", field: "pi_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "客户编码", field: "cust_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
                headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
               
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
        },{
            headerName: "可发货值", field: "info1", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
		
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "TT结余", field: "info2", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
         
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "LC结余", field: "info3", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "业务员", field: "sales_user_id", editable: false, filter: 'set', width: 150,
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
            headerName: "PI备案时间", field: "check_time", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "付款方式", field: "info4", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "价格条款", field: "info5", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "佣生TT比率", field: "info6", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "PI总额", field: "info7", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "PI回款总额", field: "info8", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "分配TT", field: "info8", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "提前到款", field: "info9", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "信用证分配", field: "info10", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "信用证发货", field: "info11", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "排产总额", field: "info12", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "生产TT定金", field: "info13", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "生产LC定金", field: "info14", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "已发货总额", field: "info15", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "启动发货总额", field: "info16", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "发货总分配", field: "info17", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "发货TT分配", field: "info18", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "发货LC分配", field: "info19", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "发货OA", field: "info20", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "发货特批", field: "info21", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "发货台数", field: "info22", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "发货货值金额", field: "info23", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "发货释放生产定金", field: "info24", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "费用发票核销", field: "info25", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "费用发票金额", field: "info26", editable: false, filter: 'set', width: 150,
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
    .controller('sale_search_pi_amtbalance', sale_search_pi_amtbalance);
