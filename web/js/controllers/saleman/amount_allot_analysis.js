var basemanControllers = angular.module('inspinia');
function amount_allot_analysis($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    amount_allot_analysis = HczyCommon.extend(amount_allot_analysis, ctrl_bill_public);
    amount_allot_analysis.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "fin_lc_allot_header",
       /* key: "out_id",*/
      //  wftempid:10125,
        FrmInfo: {},
        grids: [{optionname: 'options_13', idname: 'fin_lc_allot_lineoffin_lc_allot_headers'}]
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
	
	sqlBlock="";
	//BasemanService.getSqlWhereBlock(sqlBlock);
	var postdata = { flag:1,
            sqlwhere  : sqlBlock,
            org_code: $scope.data.currItem.org_code,
            org_id: $scope.data.currItem.org_id,
            cust_code: $scope.data.currItem.cust_code,
			cust_id: $scope.data.currItem.cust_id,
			funds_no: $scope.data.currItem.funds_no,
			is_over: $scope.data.currItem.is_over
      
        };
 BasemanService.RequestPost("fin_lc_allot_header", "analysis", postdata)
        .then(function(data){
            $scope.data.currItem.fin_lc_allot_lineoffin_lc_allot_headers=data.fin_lc_allot_lineoffin_lc_allot_headers;
             $scope.options_13.api.setRowData(data.fin_lc_allot_lineoffin_lc_allot_headers);
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
		  var sqlwhere="";
			if($scope.data.currItem.org_id!="" && $scope.data.currItem.org_id!=undefined){
				sqlwhere+= "org_id = " + $scope.data.currItem.org_id;
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
            sqlBlock: sqlwhere
        };
        BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
			 $scope.data.currItem.cust_code = result.cust_code;
			 $scope.data.currItem.cust_name = result.cust_name;
			 $scope.data.currItem.cust_id = result.cust_id;
        });
    }
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
		$scope.data.currItem.cust_codea = "";
    };
	$scope.select3 = function () {
        $scope.FrmInfo = {
			
            classid: "fin_funds_header",
	        postdata:{},
/*			sqlBlock: "scporg.Stat =2 and OrgType in (5, 14)",*/
            backdatas: "fin_funds_headers",
           
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			console.log(result);
			$scope.data.currItem.funds_no = result.funds_no;
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
            headerName: "分配单号", field: "lc_allot_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "到款单号", field: "lc_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
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
            headerName: "业务部门名称", field: "org_name", editable: false, filter: 'set', width: 150,
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
            headerName: "此次分配金额", field: "amt", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "发货金额", field: "send_amt", editable: false, filter: 'set', width: 150,
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
    .controller('amount_allot_analysis', amount_allot_analysis);
