var basemanControllers = angular.module('inspinia');
function sale_report_pi($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_report_pi = HczyCommon.extend(sale_report_pi, ctrl_bill_public);
    sale_report_pi.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_report",
       // key: "out_id",
      //  wftempid:10125,
        FrmInfo: {},
        grids: [{optionname: 'options_13', idname: 'sale_reports'}]
    };


//查询
	$scope.search = function () {
	var date1=$scope.data.currItem.start_date;

	var date2=$scope.data.currItem.end_date;
	
	var sqlBlock="";
	if(date1>date2){
		 BasemanService.notice("开始时间不能大于截止日期", "alert-warning");
            return;
	}
	sqlBlock="";
	if(date1!="" && date1!=undefined){
		sqlBlock+= " and pi.check_time>to_date("+"'"+date1+"'"+",'YYYY-MM-DD')";
	}
	if(date2!="" && date2!=undefined){
		sqlBlock+= " and pi.check_time<to_date("+"'"+date2+"'"+",'YYYY-MM-DD')";
	}
	if($scope.data.currItem.cust_codea!="" && $scope.data.currItem.cust_code!=undefined){
		sqlBlock+= " and pi.cust_code like '%" + $scope.data.currItem.cust_codea + "%'";
	}
	if($scope.data.currItem.org_name!="" && $scope.data.currItem.org_name!=undefined){
		sqlBlock+= " and pi.org_name like '%" + $scope.data.currItem.org_name + "%'";
	}
	if($scope.data.currItem.pi_no!="" && $scope.data.currItem.pi_no!=undefined){
		sqlBlock+= " and pi.pi_no like '%" + $scope.data.currItem.pi_no + "%'";
	}
	BasemanService.getSqlWhereBlock(sqlBlock);
	var postdata = { flag:1,
            sqlwhere  : sqlBlock,
		sales_user_id:  $scope.data.currItem.sales_user_id,
			//cust_code: $scope.data.currItem.cust_code,
			start_date : $scope.data.currItem.start_date,
			end_date : $scope.data.currItem.end_date
      
        };
 	var data=$scope.data.currItem.sale_reports;
 	BasemanService.RequestPost("sale_report", "search", postdata)
        .then(function(data){
        	 $scope.data.currItem.sale_reports=data.sale_reports;
             $scope.options_13.api.setRowData(data.sale_reports);
        });
	}

//清空
//	$scope.clear = function () {
//	var postdata={};
//	var data=$scope.data.currItem.sale_ship_out_lineofsale_ship_out_headers;
//	 BasemanService.RequestPost("sale_ship_out_header", "search", postdata)
//      .then(function(data){
//        $scope.options_13.api.setRowData();
//      });
//	}

    /***************************弹出框***********************/
	$scope.selectorg = function () {
       $scope.FrmInfo = {
            classid: "scporg",
            postdata: {},
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
	
	
	
	//业务部门
    $scope.changeAreaName = function () {

        $scope.data.currItem.org_name = "";
        $scope.data.currItem.org_id = "";
    };
    //客户
    $scope.change_customer = function () {

        $scope.data.currItem.cust_name = "";
        $scope.data.currItem.cust_id = "";
		$scope.data.currItem.cust_codea = "";
    };
	$scope.selectcust = function () {

	
	   var sqlwhere="";
	   if($scope.data.currItem.org_id!="" && $scope.data.currItem.org_id!=undefined){
		   sqlwhere+="org_id = " + $scope.data.currItem.org_id;
	   }
	   
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
           sqlBlock: sqlwhere //改界面的客户弹出框所需要的org_id并没有在scparea类中找到对应的属性
        };
        BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
			 $scope.data.currItem.cust_codea = result.sap_code;
             $scope.data.currItem.cust_code  = result.sap_code;
			 $scope.data.currItem.cust_name = result.cust_name;
			 $scope.data.currItem.cust_id = result.cust_id;
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
            headerName: "合同号", field: "pi_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "业务员", field: "sales_user_id", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "部门名称", field: "org_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "客户编码", field: "cust_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
		
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 150,
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
            headerName: "PI套数", field: "piqty", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "备案排产套数", field: "moqty", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "启动排产套数", field: "moqtystart", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "批次号", field: "lotnos", editable: false, filter: 'set', width: 150,
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
        //数据缓存
        $scope.initdata();
	}

//加载控制器
basemanControllers
    .controller('sale_report_pi', sale_report_pi);
