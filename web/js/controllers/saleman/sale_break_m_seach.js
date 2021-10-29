var basemanControllers = angular.module('inspinia');
function sale_break_m_seach($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_break_m_seach = HczyCommon.extend(sale_break_m_seach, ctrl_bill_public);
    sale_break_m_seach.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_pi_header",
        key: "out_id",
      //  wftempid:10125,
        FrmInfo: {},
        grids: [{optionname: 'options_13', idname: 'sale_pi_break_itemofsale_pi_headers'}]
    };

//下拉框   贸易类型

	 BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"}).then(function (data) {
        $scope.sale_ent_types = data.dicts;
    })

//查询
$scope.search = function () {
	var date1=$scope.data.currItem.startdate;
	var date2=$scope.data.currItem.enddate;
	var date3=$scope.data.currItem.startdatey;
	var date4=$scope.data.currItem.enddatey;
	var sqlBlock="";
	if(date1>date2 && date1!="" && date1!=undefined && date2!="" && date2!=undefined){
		 BasemanService.notice("起始日期不能大于截止日期", "alert-warning");
            return;
	}
	if(date3>date4 && date3!="" && date3!=undefined && date4!="" && date4!=undefined){
		 BasemanService.notice("起始日期不能大于截止日期", "alert-warning");
            return;
	}
	sqlBlock=" 1=1 ";
	if($scope.data.currItem.package_id!="" && $scope.data.currItem.package_id!=undefined){
			sqlBlock+=" and package_id like '%"+$scope.data.currItem.package_id+"%'"
	}
	if($scope.data.currItem.package_name!="" && $scope.data.currItem.package_name!=undefined){
			sqlBlock+=" and package_name like '%"+$scope.data.currItem.package_name+"%'"
	}
	if(date1!="" && date1!=undefined){
		sqlBlock+="  and to_char(b_time, 'yyyy-mm-dd') >= "+"'"+date1+"'";
	}
	if(date2!="" && date2!=undefined){
		sqlBlock+="  and to_char(b_time, 'yyyy-mm-dd') <= "+"'"+date2+"'";
	}
	if(date3!="" && date3!=undefined){
		sqlBlock+=" and to_char(create_time, 'yyyy-mm-dd') >= "+"'"+date3+"'";
	}
	if(date4!="" && date4!=undefined){
		sqlBlock+=" and to_char(create_time, 'yyyy-mm-dd') <= "+"'"+date4+"'";
	}
	//BasemanService.getSqlWhereBlock(sqlBlock);
	var postdata = { 
			flag:59,
            sqlwhere  : sqlBlock
			//cust_code: $scope.data.currItem.cust_code,
			//sale_ent_type: $scope.data.currItem.sale_ent_type,
			//org_id: $scope.data.currItem.org_id
      
        };
 BasemanService.RequestPost("sale_pi_header", "search", postdata)
        .then(function(data){
			console.log(data);
            $scope.data.currItem.sale_pi_break_itemofsale_pi_headers=data.sale_pi_break_itemofsale_pi_headers;
             $scope.options_13.api.setRowData(data.sale_pi_break_itemofsale_pi_headers);
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
            headerName: "方案号", field: "package_id", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "方案名称", field: "package_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
                headerName: "创建时间", field: "b_time", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
               
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
        },{
            headerName: "订单类型", field: "style", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
		
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "订单号", field: "pi_no", editable: false, filter: 'set', width: 150,
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
            headerName: "业务员", field: "sales_user_id", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "机型编码", field: "item_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "引用时间", field: "create_time", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "引用方案次数", field: "num", editable: false, filter: 'set', width: 150,
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
    .controller('sale_break_m_seach', sale_break_m_seach);
