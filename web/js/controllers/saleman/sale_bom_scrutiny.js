var basemanControllers = angular.module('inspinia');
function sale_bom_scrutiny($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_bom_scrutiny = HczyCommon.extend(sale_bom_scrutiny, ctrl_bill_public);
    sale_bom_scrutiny.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
		//java类名
        name: "sale_prod_header",
      //  key: "INSPECTION_BATCHNO",
      //  wftempid:10125,
        FrmInfo: {},
        grids: [{optionname: 'options_13', idname: 'sale_prod_headers'}]
    };


//查询
$scope.search = function () {
	
	var sqlBlock="";
	BasemanService.getSqlWhereBlock(sqlBlock);	
	var postdata = { flag:3,
            sqlwhere  : sqlBlock,
			//cust_code: $scope.data.currItem.cust_code,
			//sale_ent_type: $scope.data.currItem.sale_ent_type,
			//org_id: $scope.data.currItem.org_id
      
        };
 var data=$scope.data.currItem.sale_bom_scrutinys;
 BasemanService.RequestPost("sale_prod_header", "search", postdata)
        .then(function(data){
             $scope.options_13.api.setRowData(data.sale_prod_headers);
        });
}

//清空
/*$scope.clear = function () {
	var postdata={};
	var data=$scope.data.currItem.sale_bom_scrutinys;
	 BasemanService.RequestPost("Base_search", "search", postdata)
        .then(function(data){
          $scope.options_13.api.setRowData();
        });
}*/

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
	/*$scope.selectcust = function () {

		
		 $scope.FrmInfo = {
			title: "客户",
			thead: [
				{
				name: "ERP产品编码",
                code: "erp_code",
				 show: true,
                iscond: true,
                type: 'string'

            }, {
                name: "散件物料编码",
                code: "item_code",
				show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "散件物料描述",
                code: "item_desc",
				show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "散件订单数量",
                code: "item_qty",
				show: true,
                iscond: true,
                type: 'string'
            }
            ],
			is_custom_search:true,
			is_high:true,
            classid: "customer",
            sqlBlock: "org_id = " + $scope.data.currItem.org_id
        };
        BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
			 $scope.data.currItem.cust_code = result.cust_code;
			 $scope.data.currItem.cust_name = result.cust_name;
			 $scope.data.currItem.cust_id = result.cust_id;
        });

    }*/

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
            headerName: "ERP产品编码", field: "erp_code", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "散件物料编码", field: "item_code", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
                headerName: "散件物料描述", field: "item_desc", editable: true, filter: 'set', width: 200,
                cellEditor: "文本框",
               
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
        },{
            headerName: "散件物料订单数量", field: "item_qty", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
		
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "散件物料包装数量", field: "qty", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
         
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "差异数量", field: "warned_qty", editable: false, filter: 'set', width: 150,
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
    .controller('sale_bom_scrutiny', sale_bom_scrutiny);
