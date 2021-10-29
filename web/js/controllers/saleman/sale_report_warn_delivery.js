var basemanControllers = angular.module('inspinia');
function sale_report_warn_delivery($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_report_warn_delivery = HczyCommon.extend(sale_report_warn_delivery, ctrl_bill_public);
    sale_report_warn_delivery.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_report",
       // key: "out_id",
      //  wftempid:10125,
        FrmInfo: {},
        grids: [{optionname: 'options_13', idname: 'sale_reports'}]
    };

//下拉框   贸易类型

//	 BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"}).then(function (data) {
//      $scope.sale_ent_types = data.dicts;
//  })

//下拉框  状态 固定类型	 
	   $scope.stats_luotao = [ {
        	dictvalue:"0",
        	dictname:"全部"
        },{
        	dictvalue:"1",
        	dictname:"制单"
        },{
        	dictvalue:"3",
        	dictname:"启动"
        },{
        	dictvalue:"5",
        	dictname:"已审核"
        }];
       
//查询
$scope.search = function () {
	var date1=$scope.data.currItem.startdate;
	var date2=$scope.data.currItem.enddate;
	var sqlBlock="";
	if(date1>date2 && date1!="" &&  date2!="" && date1!=undefined && date2!=undefined){
		 BasemanService.notice("起始日期不能大于截止日期", "alert-warning");
            return;
	}
	if($scope.data.currItem.org_codea!="" && $scope.data.currItem.org_codea!=undefined){
		sqlBlock+=" and sswh.org_code like '%" + $scope.data.currItem.org_codea + "%'";
	}
	if($scope.data.currItem.org_id!="" && $scope.data.currItem.org_id!=undefined){
		sqlBlock+=" and sswh.org_id like '%" + $scope.data.currItem.org_id + "%'";
	}
	if($scope.data.currItem.cust_codea!="" && $scope.data.currItem.cust_codea!=undefined){
		sqlBlock+=" and sswh.cust_code like '%" + $scope.data.currItem.cust_codea + "%'";
	}
	if($scope.data.currItem.cust_id!="" && $scope.data.currItem.cust_id!=undefined){
		sqlBlock+=" and sswh.cust_id like '%" + $scope.data.currItem.cust_id + "%'";
	}
	if($scope.data.currItem.sales_user_id!="" && $scope.data.currItem.sales_user_id!=undefined){
		sqlBlock+=" and sswh.sales_user_id like '%" + $scope.data.currItem.sales_user_id + "%'";
	}
	if($scope.data.currItem.pi_no!="" && $scope.data.currItem.pi_no!=undefined){
		sqlBlock+=" and sswh.warn_no like '%" + $scope.data.currItem.pi_no + "%'";
	}
	if(date1!="" && date1!=undefined){
		sqlBlock+=" and sswh.check_time>to_date("+"'"+ date1 +"'"+",'YYYY-MM-DD')";
	}
	if(date2!="" && date2!=undefined){
		sqlBlock+=" and sswh.check_time<to_date("+"'"+ date2 +"'"+",'YYYY-MM-DD')";
	}
	//BasemanService.getSqlWhereBlock(sqlBlock);
	var postdata = { flag:2,
            sqlwhere  : sqlBlock,
			stat: $scope.data.currItem.stat_luotao,
            start_date : $scope.data.currItem.startdate,
            end_date : $scope.data.currItem.enddate
			//cust_code: $scope.data.currItem.cust_code,
			//stat: $scope.data.currItem.stat
			//org_id: $scope.data.currItem.org_id
      
        };
 var data=$scope.data.currItem.sale_ship_out_lineofsale_ship_out_headers;
 BasemanService.RequestPost("sale_report", "search", postdata)
        .then(function(data){
        	$scope.data.currItem.sale_reports=data.sale_reports;
             $scope.options_13.api.setRowData(data.sale_reports);
        });
}

//清空
$scope.clear = function () {
	var postdata={};
	var data=$scope.data.currItem.sale_reports;
	 BasemanService.RequestPost("sale_report", "search", postdata)
        .then(function(data){
          $scope.options_13.api.setRowData();
        });
}
//业务部门
    $scope.changeAreaName = function () {
        $scope.data.currItem.org_codea = "";
        $scope.data.currItem.org_name = "";
        $scope.data.currItem.org_id = "";
    };
    //客户
    $scope.change_customer = function () {
        $scope.data.currItem.cust_codea = "";
        $scope.data.currItem.cust_name = "";
        $scope.data.currItem.cust_id = "";
		$scope.data.currItem.cust_codea = "";
    };
    /***************************弹出框***********************/
	$scope.selectcode = function () {

		 $scope.FrmInfo = {
			
            classid: "scporg",
	        postdata:{},
			sqlBlock: "scporg.Stat =2 and OrgType in (5, 14)",
            backdatas: "orgs",
           
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			$scope.data.currItem.org_id = result.orgid;
			 $scope.data.currItem.org_codea = result.code;
            $scope.data.currItem.org_code = result.code;
			 $scope.data.currItem.org_name = result.orgname			
        });

    }
	$scope.selectcust = function () {
        var fag="";
        if($scope.data.currItem.org_id!="" && $scope.data.currItem.org_id!=undefined){
            fag="org_id = " + $scope.data.currItem.org_id;
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
            sqlBlock: fag
        };
        BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
			 $scope.data.currItem.cust_codea = result.cust_code;
            $scope.data.currItem.cust_code = result.cust_code;
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
            headerName: "出货预告号", field: "warn_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "状态", field: "stat", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "柜型柜量", field: "boxs", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "预计装柜日期", field: "info1", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
		
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "预计最迟装柜日期", field: "info2", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
         
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "截关日期", field: "info3", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "开船日期", field: "info4", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "PI号", field: "pi_no", editable: false, filter: 'set', width: 150,
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
            headerName: "审核时间", field: "check_time", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "商检批号", field: "info5", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "ERP_编码", field: "erp_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "客户型号", field: "info6", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "标机编码", field: "item_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "BOX_TYPE", field: "info7", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "排柜数量", field: "qty", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "导出数量", field: "printqty", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "WARN_ID", field: "warn_id", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "WARN_LINE_ID", field: "warn_line_id", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "通知单", field: "notice_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "实际出货日期", field: "act_date", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "装柜数", field: "qty", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "仓库实发数", field: "outqty", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "备案实发数", field: "outqty_check", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "仓库启动填写发货数", field: "outqty_start", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "制单发货数", field: "outqty_create", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "实际柜号封条车号", field: "car_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "WARN_ID", field: "warn_id", editable: false, filter: 'set', width: 150,
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
    .controller('sale_report_warn_delivery', sale_report_warn_delivery);
