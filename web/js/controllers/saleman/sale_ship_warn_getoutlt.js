var basemanControllers = angular.module('inspinia');
function sale_ship_warn_getoutlt($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_ship_warn_getoutlt = HczyCommon.extend(sale_ship_warn_getoutlt, ctrl_bill_public);
    sale_ship_warn_getoutlt.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_ship_warn_header",
       /* key: "out_id",*/
      //  wftempid:10125,
        FrmInfo: {},
        grids: [{optionname: 'options_13', idname: 'sale_ship_warn_headers'}]
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
	sqlBlock="1=1";
	if(date1!=undefined && date1!=""){
	sqlBlock+=" and date1 >= to_date('" + date1
						+ "','YYYY-MM-DD')";
	}
	if(date2!=undefined && date2!=""){
	sqlBlock+=" and date1 <= to_date('" + date2+ "','YYYY-MM-DD')";
	}
	if($scope.data.currItem.cust_codea!=undefined && $scope.data.currItem.cust_codea!=""){
		sqlBlock+=" and Cust_Code like '%"+ $scope.data.currItem.cust_codea+"%'";
	}
	if($scope.data.currItem.org_codea>0){
		sqlBlock+=" and Org_Code=" + $scope.data.currItem.org_codea;
	}
	if($scope.data.currItem.pi_no!="" && $scope.data.currItem.pi_no!=undefined){
		sqlBlock+=" and pi_no like '%" + $scope.data.currItem.pi_no +"%' ";
	}
	if($scope.data.currItem.warn_no!="" && $scope.data.currItem.warn_no!=undefined){
		sqlBlock+=" and warn_no like '%" + $scope.data.currItem.warn_no +"%' ";
	}
	if($scope.data.currItem.to_area_name!="" && $scope.data.currItem.to_area_name!=undefined){
		sqlBlock+=" and to_area_name like '%" + $scope.data.currItem.to_area_name +"%' ";
	}
	if($scope.data.currItem.brand_name!="" && $scope.data.currItem.brand_name!=undefined){
		sqlBlock+=" and brand_name like '%" + $scope.data.currItem.brand_name +"%' ";
	}
	if($scope.data.currItem.seaport_in_name!="" && $scope.data.currItem.seaport_in_name!=undefined){
		sqlBlock+=" and seaport_in_name like '%" + $scope.data.currItem.seaport_in_name +"%' ";
	}
	//BasemanService.getSqlWhereBlock(sqlBlock);
	var postdata = { flag:102,
            sqlwhere  : sqlBlock,
            org_id: $scope.data.currItem.org_id,		
            cust_id: $scope.data.currItem.cust_id,
			cust_name: $scope.data.currItem.cust_namea,
			startdate: $scope.data.currItem.startdate,
			enddate: $scope.data.currItem.enddate
        };
 var data=$scope.data.currItem.sale_ship_warn_headers;
 BasemanService.RequestPost("sale_ship_warn_header", "search", postdata)
        .then(function(data){
            $scope.data.currItem.sale_ship_warn_headers=data.sale_ship_warn_headers;
             $scope.options_13.api.setRowData(data.sale_ship_warn_headers);
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
	$scope.select2 = function () {
       if ($scope.data.currItem.org_code == undefined || $scope.data.currItem.org_code == "") {
            BasemanService.notice("请先选业务部门", "alert-warning");
            return;
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
            sqlBlock: "org_id = " + $scope.data.currItem.org_id
        };
        BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
			 $scope.data.currItem.cust_code = result.cust_code;
            $scope.data.currItem.cust_codea = result.cust_code;
			 $scope.data.currItem.cust_name = result.cust_name;
			 $scope.data.currItem.cust_id = result.cust_id;
        });

    }
	
	$scope.select3 = function () {
        $scope.FrmInfo = {
			
            classid: "sale_ship_warn_header",
	        postdata:{},

            backdatas: "sale_ship_warn_headers",
           
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
            headerName: "出货预告号", field: "warn_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
		
			
        },{
            headerName: "合同号", field: "pi_no", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
                headerName: "状态", field: "stat", editable: false, filter: 'set', width: 200,
                cellEditor: "文本框",
               
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
        },{
            headerName: "部门编码", field: "org_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
         
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "部门名称", field: "org_name", editable: false, filter: 'set', width: 150,
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
            headerName: "报关日期", field: "date1", editable: false, filter: 'set', width: 200,
            cellEditor: "年月日",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "到货港", field: "seaport_in_name", editable: false, filter: 'set', width: 180,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "目的国", field: "to_area_name", editable: false, filter: 'set', width: 180,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "品牌", field: "brand_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "总数量", field: "total_qty", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "总件数", field: "total_carton", editable: false, filter: 'set', width: 150,
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
    .controller('sale_ship_warn_getoutlt', sale_ship_warn_getoutlt);
