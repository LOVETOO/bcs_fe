var finmanControllers = angular.module('inspinia');
function edi_quotaapply_list($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    edi_quotaapply_list = HczyCommon.extend(edi_quotaapply_list, ctrl_bill_public);
    edi_quotaapply_list.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "edi_quotaapply_list",
   /*     key: "funds_id",*/
        wftempid: 10008,
        FrmInfo: {
            sqlBlock: "funds_type=2",
        },
        grids: [{optionname: 'options_11', idname: 'edi_quotaapply_lists'}]
    };
    
    //下拉
     $scope.search_styles = [{
        	id:1,
        	name:"预测录入",
        },{
        	id:2,
        	name:"预测发放",
        }]
     BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        $scope.stat = data.dicts;
    })
    
    /*查询*/
   $scope.search = function () { 
	var postdata = { flag:3, 
	     	org_id: $scope.data.currItem.org_id,
            org_code: $scope.data.currItem.org_code,
            org_name: $scope.data.currItem.org_name, 
	    	cust_id: $scope.data.currItem.cust_id, 
			cust_code: $scope.data.currItem.cust_code,
			cust_name: $scope.data.currItem.cust_name, 
			start_date: $scope.data.currItem.startdate,
			end_date: $scope.data.currItem.enddate,
		    bizbuyerno: $scope.data.currItem.bizbuyerno
        };
 BasemanService.RequestPost("edi_quotaapply_list", "search", postdata)
        .then(function(data){
            $scope.data.currItem.edi_quotaapply_lists=data.edi_quotaapply_lists;
             $scope.options_11.api.setRowData(data.edi_quotaapply_lists);
        });
}
   
   $scope.selectcode = function () {

		 $scope.FrmInfo = {
			classid: "scporg",
			postdata:{},
            backdatas:"orgs",
            sqlBlock: " orgtype = 5"
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			 $scope.data.currItem.org_code = result.code;
			 $scope.data.currItem.org_name = result.orgname;
			 $scope.data.currItem.org_id = result.orgid; 
        });

    }   
   
   $scope.selectcust = function () {
      var fag="";
	  if($scope.data.currItem.org_id!="" && $scope.data.currItem.org_id!=undefined){
		  fag="org_id = " + $scope.data.currItem.org_id;
	  }
			$scope.FrmInfo = {
			classid: "customer",
			postdata:{},
            backdatas:"customers",
			sqlBlock: fag
        };
		 
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			 $scope.data.currItem.cust_code = result.sap_code;
			 $scope.data.currItem.cust_name = result.cust_name;
			 $scope.data.currItem.cust_id = result.cust_id;
        });

    }
   
    /**-------网格定义区域 ------*/
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
    //单据明细
    $scope.columns_11 = [
        {
            headerName: "保险单号", field: "policyno", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
/*            cellEditorParams: {
                values: [{value: "1", desc: "空调组织"}]
            },*/
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "中信保卖家编号", field: "bizbuyerno", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "企业买方代码", field: "corpbuyerno", editable: false, filter: 'set', width: 180,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "限额编号", field: "buyerquotano", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "限额生效日期", field: "effectdate", editable: false, filter: 'set', width: 180,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "预计失效日期", field: "newlapsedate", editable: false, filter: 'set', width: 150,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "拒绝风险赔偿比例", field: "refuserate", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "其他商业风险赔偿比例", field: "otherrate", editable: false, filter: 'set', width: 250,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "特别生效条件", field: "adcondition", editable: false, filter: 'set', width: 180,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "信用证号", field: "lcno", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "银行swift", field: "bankswift", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "所属客户编号", field: "clientno", editable: false, filter: 'set', width: 180,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "测算时间", field: "calculatetime", editable: false, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		}];
    $scope.options_11 = {
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
            var isGrouping = $scope.options_11.columnApi.getRowGroupColumns().length > 0;
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
finmanControllers
    .controller('edi_quotaapply_list', edi_quotaapply_list);
