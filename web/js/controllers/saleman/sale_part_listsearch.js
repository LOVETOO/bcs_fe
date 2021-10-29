var basemanControllers = angular.module('inspinia');
function sale_part_listsearch($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_part_listsearch = HczyCommon.extend(sale_part_listsearch, ctrl_bill_public);
    sale_part_listsearch.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_list",
/*        key: "out_id",*/
      //  wftempid:10125,
        FrmInfo: {},
        grids: [{optionname: 'options_13', idname: 'sale_lists'}]
    };

//下拉框   贸易类型

	 BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"}).then(function (data) {
        $scope.sale_ent_types = data.dicts;
    })

//查询
$scope.search = function () {
	var date1=$scope.data.currItem.start_date;
	var date2=$scope.data.currItem.end_date;
	if(date1>date2){
		 BasemanService.notice("起始日期不能大于截止日期", "alert-warning");
            return;
	}
	//BasemanService.getSqlWhereBlock(sqlBlock);
	var postdata = { flag:5,
			org_id: $scope.data.currItem.org_id,//	
			cust_id: $scope.data.currItem.cust_id,//
			start_date : $scope.data.currItem.start_date,
			end_date : $scope.data.currItem.end_date,
			erp_code : $scope.data.currItem.erp_code,
			inspection_batchno : $scope.data.currItem.inspection_batchno,
			pi_no : $scope.data.currItem.pi_no,
			prod_no : $scope.data.currItem.prod_no
        };


	BasemanService.RequestPost("sale_list", "search", postdata)
        .then(function(data){
            $scope.data.currItem.sale_lists=data.sale_lists
             $scope.options_13.api.setRowData(data.sale_lists);
        });
}

	//清空
	$scope.clear = function () {
		
		for(var r in $scope.data.currItem){
			if(typeof ($scope.data.currItem[r]) == "string"){
				$scope.data.currItem[r] = "";
			}
		}
		$scope.options_13.api.setRowData([]);
		/*var postdata={};
		var data=$scope.data.currItem.sale_lists;
		 BasemanService.RequestPost("sale_list", "search", postdata)
			.then(function(data){
			  $scope.options_13.api.setRowData();
			});*/
	}
	$scope.chang_cust = function(){

		 $scope.data.currItem.cust_name = "";
		 $scope.data.currItem.cust_id = "";
	}
	$scope.change_org = function(){
		$scope.data.currItem.org_id = "";
		 
		 $scope.data.currItem.org_name = "";
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
			 $scope.data.currItem.org_name = result.orgname;
        });
    }
	$scope.selectcust = function () {

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
            sqlBlock: "(org_id = " + $scope.data.currItem.org_id + "or other_org_ids like '%"+$scope.data.currItem.org_id+"%')"
        };
        BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
			 $scope.data.currItem.cust_code = result.cust_code;
			 $scope.data.currItem.cust_name = result.cust_name;
			 $scope.data.currItem.cust_id = result.cust_id;
        });

    }
	
	$scope.select_pgm = function(num){
		$scope.FrmInfo = {
			classid : "sale_prod_header",
			is_custom_search:true,//控制高级查询不调用FrmInfo.js文件里的
			sqlBlock : "stat=5",
			is_high : true,
			title : "生产单查询",
			thead: [
				{
				name: "生产单编码",
                code: "prod_no",
				 show: true,
                iscond: true,
                type: 'string'

            }, {
                name: "形式发票号",
                code: "pi_no",
				show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "所属机构名称",
                code: "org_name",
				show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "客户名称",
                code: "cust_name",
				show: true,
                iscond: true,
                type: 'string'
            }]
		};
		BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
				if(num==1)$scope.data.currItem.inspection_batchno = result.inspection_batchno;
				if(num==2)$scope.data.currItem.pi_no = result.pi_no;
				if(num==3)$scope.data.currItem.prod_no = result.prod_no;
        });
		
	}
	

$scope.selectcust1 = function () {
        $scope.FrmInfo = {
			
            classid: "sale_prod_header",
	        postdata:{},
		/*	sqlBlock: "scporg.Stat =2 and OrgType in (5, 14)",*/
/*            backdatas: "sale_prod_header_frminfos",*/
           
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			 $scope.data.currItem.inspection_batchno = result.prod_no		
        });
    }
$scope.selectcust2 = function () {
        $scope.FrmInfo = {
			
            classid: "sale_prod_header",
	        postdata:{},
		/*	sqlBlock: "scporg.Stat =2 and OrgType in (5, 14)",*/
/*            backdatas: "sale_prod_header_frminfos",*/
           
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			 $scope.data.currItem.pi_no = result.pi_no		
        });
    }
$scope.selectcust3 = function () {
        $scope.FrmInfo = {
			
            classid: "sale_prod_header",
	        postdata:{},
		/*	sqlBlock: "scporg.Stat =2 and OrgType in (5, 14)",*/
/*            backdatas: "sale_prod_header_frminfos",*/
           
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			 $scope.data.currItem.prod_no = result.prod_no		
        });
    }
	
 //需要查询--贸易类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"})
        .then(function (data) {
            var sale_ent_type = [];
            for (var i = 0; i < data.dicts.length; i++) {
                sale_ent_type[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('columns_13', 'sale_ent_type')) {
                $scope.columns_13[$scope.getIndexByField('columns_13', 'sale_ent_type')].cellEditorParams.values = sale_ent_type;
            }
        });

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
            headerName: "生产通知单号", field: "prod_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "商检批号", field: "inspection_batchno", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
                headerName: "贸易类型", field: "sale_ent_type", editable: false, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {values: []},
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
        },{
            headerName: "业务部门", field: "org_name", editable: false, filter: 'set', width: 150,
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
            headerName: "PI号", field: "pi_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "整机编码", field: "item_h_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "整机描述", field: "item_h_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "分体机编码", field: "item_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "分体机名称", field: "item_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "客户型号", field: "cust_item_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "配件描述", field: "part_desc", editable: false, filter: 'set', width: 150,
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
            headerName: "本次生产数量", field: "pprod_qty", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "销售价格", field: "psale_price", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "成本价", field: "price", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "金额", field: "amt", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "备注", field: "note", editable: false, filter: 'set', width: 150,
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
    .controller('sale_part_listsearch', sale_part_listsearch);
