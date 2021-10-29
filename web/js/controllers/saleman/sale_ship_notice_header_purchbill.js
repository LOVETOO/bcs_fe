var basemanControllers = angular.module('inspinia');
function sale_ship_notice_header_purchbill($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_ship_notice_header_purchbill = HczyCommon.extend(sale_ship_notice_header_purchbill, ctrl_bill_public);
    sale_ship_notice_header_purchbill.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_ship_notice_header",
        key: "out_id",
      //  wftempid:10125,
        FrmInfo: {},
        grids: [{optionname: 'options_13', idname: 'sale_ship_notice_purch_lineofsale_ship_notice_headers'}]
    };



	//查询
	$scope.search = function () {
		var date1=$scope.data.currItem.notice_time_start;
		var date2=$scope.data.currItem.notice_time_end;
		var sql1="1=1";
		var sql2="1=1";
		var note 
		if(date1!=undefined && date1!="" && date2!=undefined && date2!="" && date1>date2){
			 BasemanService.notice("发货日期的起始日期不能大于截止日期", "alert-warning");
				return;
		}
		
		var date3=$scope.data.currItem.custosm_time_start;
		var date4=$scope.data.currItem.custosm_time_end;
		if(date3!=undefined && date3!="" && date4!=undefined && date4!="" && date3>date4){
			 BasemanService.notice("报关审核的起始日期不能大于截止日期", "alert-warning");
				return;
		}
		//BasemanService.getSqlWhereBlock(sqlBlock);
		if($scope.data.currItem.notice_no != undefined && $scope.data.currItem.notice_no != "") 
			sql1 += " and nheader.notice_no like '%"+$scope.data.currItem.notice_no +"%'";
		if($scope.data.currItem.warn_no != undefined && $scope.data.currItem.warn_no != "") 
			sql1 += " and nheader.warn_no like '%"+$scope.data.currItem.warn_no +"%'";
		if($scope.data.currItem.pi_no != undefined && $scope.data.currItem.pi_no != "") 
			sql1 += " and nheader.pi_no like '%"+$scope.data.currItem.pi_no +"%'";
		//if($scope.data.currItem.customs_no != undefined && $scope.data.currItem.customs_no != "")
			//sql1 += " and nheader.customs_no like '%"+$scope.data.currItem.customs_no +"%'";
		if($scope.data.currItem.cust_codea != undefined && $scope.data.currItem.cust_codea != "") 
			sql1 += " and nheader.cust_code like '%"+$scope.data.currItem.cust_codea +"%'";
		if($scope.data.currItem.org_codea != undefined && $scope.data.currItem.org_codea != "")
			sql1 += " and nheader.org_code like '%"+$scope.data.currItem.org_codea +"%'";
		
		if($scope.data.currItem.notice_time_start != undefined && $scope.data.currItem.notice_time_start != "") 
			sql1 += " and to_char(nheader.check_time,'YYYY-MM-DD') >='"+$scope.data.currItem.notice_time_start+"'" ;
		if($scope.data.currItem.notice_time_end) sql1 += " and to_char(nheader.check_time,'YYYY-MM-DD') <='"+$scope.data.currItem.notice_time_end +"'";
		
		if($scope.data.currItem.custosm_time_start != undefined && $scope.data.currItem.custosm_time_start != "") 
			sql2 += " and to_char(h.customs_date,'YYYY-MM-DD') >= '"+$scope.data.currItem.custosm_time_start+"'";
		if($scope.data.currItem.custosm_time_end != undefined && $scope.data.currItem.custosm_time_end != "")
			sql2 += " and to_char(h.customs_date,'YYYY-MM-DD') <=' "+$scope.data.currItem.custosm_time_end+"'";
		var postdata = {sqlwhere:sql1, note:sql2, flag:102};
		var data=$scope.data.currItem.sale_ship_notice_purch_lineofsale_ship_notice_headers;
		BasemanService.RequestPost("sale_ship_notice_header", "search", postdata)
			.then(function(data){
				console.log("查询");
				console.log(data);
				$scope.data.currItem.sale_ship_notice_purch_lineofsale_ship_notice_headers=data.sale_ship_notice_purch_lineofsale_ship_notice_headers;
				 $scope.options_13.api.setRowData(data.sale_ship_notice_purch_lineofsale_ship_notice_headers);
			});
	}

//清空
//$scope.clear = function () {
//	var postdata={};
//	var data=$scope.data.currItem.sale_ship_out_lineofsale_ship_out_headers;
//	 BasemanService.RequestPost("sale_ship_out_header", "search", postdata)
//      .then(function(data){
//        $scope.options_13.api.setRowData();
//      });
//}

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
            $scope.data.currItem.org_codea = result.code;
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
    };
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
            classid: "customer"
         
        };
		if ($scope.data.currItem.org_id != undefined && $scope.data.currItem.org_id != "") {
			$scope.FrmInfo.sqlBlock = " org_id = " + $scope.data.currItem.org_id;
		}
        BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
			 $scope.data.currItem.cust_code = result.cust_code;
			  $scope.data.currItem.cust_codea = result.sap_code;
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
            headerName: "部门名称", field: "org_name", editable: false, filter: 'set', width: 150,
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
            headerName: "PI号", field: "pi_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
		
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "发货通知单号", field: "notice_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
         
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "出货预告号", field: "warn_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "报关单号", field: "customs_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "ERP编码", field: "erp_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "发货数量", field: "out_qty", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "报关数量", field: "customs_qty", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "发货价格", field: "price", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "发货金额", field: "line_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "报关价格", field: "customs_price", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "报关金额", field: "customs_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "产品名称/要素名称", field: "item_h_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "发货审核日期", field: "notice_time", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "报关审核日期", field: "custosm_time", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "AB票", field: "ab_votes", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "要素名称", field: "brand_name", editable: false, filter: 'set', width: 150,
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
	}

//加载控制器
basemanControllers
    .controller('sale_ship_notice_header_purchbill', sale_ship_notice_header_purchbill);
