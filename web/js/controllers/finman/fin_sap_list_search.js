var basemanControllers = angular.module('inspinia');
function fin_sap_list_search($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    fin_sap_list_search = HczyCommon.extend(fin_sap_list_search, ctrl_bill_public);
    fin_sap_list_search.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "fin_amount_search",
/*        key: "out_id",*/
      //  wftempid:10125,
        FrmInfo: {},
        grids: [{optionname: 'options_13', idname: 'fin_amount_searchs'}]
    };

//下拉框   贸易类型

	 BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"}).then(function (data) {
        $scope.sale_ent_types = data.dicts;
    })

//查询
$scope.search = function () {
	var date1=$scope.data.currItem.startdate;
	var date2=$scope.data.currItem.enddate;
	var sqlBlock="";
	if(date1>date2){
		 BasemanService.notice("起始日期不能大于截止日期", "alert-warning");
            return;
	}
	sqlBlock="";
	//BasemanService.getSqlWhereBlock(sqlBlock);
	var postdata = { flag:14,
            sqlwhere  : sqlBlock,
            start_date: $scope.data.currItem.start_date,
            end_date: $scope.data.currItem.end_date,
			cust_id: $scope.data.currItem.cust_id,
			org_id: $scope.data.currItem.org_id,
			area_code: $scope.data.currItem.area_ids
      
        };
 BasemanService.RequestPost("fin_amount_search", "search", postdata)
        .then(function(data){
            $scope.data.currItem.fin_amount_searchs=data.fin_amount_searchs;
             $scope.options_13.api.setRowData(data.fin_amount_searchs);
        });
}


    /***************************弹出框***********************/
	//搜索条件清空
    $scope.areaclear = function () {
        $scope.data.currItem.area_code = "";
        $scope.data.currItem.area_name = "";
        $scope.data.currItem.area_ids = "";
    }
    $scope.orgclear = function () {
        $scope.data.currItem.org_code = "";
        $scope.data.currItem.org_name = "";
        $scope.data.currItem.org_id = "";
    }
    $scope.custclear = function () {
        $scope.data.currItem.cust_code = "";
        $scope.data.currItem.cust_name = "";
    }
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
	 $scope.selectarea = function () {
        $scope.FrmInfo = {
            type: "checkbox",
            backdatas: "orgs",
            classid: "scporg",
            sqlBlock: "stat =2 and orgtype in (3)"
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (items) {
            if (items.length == 0) {
                return
            }
            var ids = '', names = '', ids = [], codes = [];
            for (var i = 0; i < items.length; i++) {
                names += items[i].orgname + ',';
                ids += items[i].orgid + ',';
                codes += items[i].code + ',';
            }
            names = names.substring(0, names.length - 1);
            ids = ids.substring(0, ids.length - 1);
            codes = codes.substring(0, ids.length - 1);
            $scope.data.currItem.area_name = names;
            $scope.data.currItem.area_code = codes;
            $scope.data.currItem.area_ids = ids;
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
            sqlBlock: "org_id = " + $scope.data.currItem.org_id
        };
        BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
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
            headerName: "部门", field: "org_name", editable: false, filter: 'set', width: 150,
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
                headerName: "资金系统单号", field: "other_no", editable: false, filter: 'set', width: 100,
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
            headerName: "所在国编码", field: "area_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "所在国名称", field: "area_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "汇款人", field: "hk_man", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "银行", field: "bank_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "SAP凭证号", field: "sap_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "引SAP日期", field: "sap_date", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "总账日期", field: "gl_date", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "到款日期", field: "funds_date", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "到款路径", field: "return_ent_type", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "到款类型", field: "tt_types", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "币种", field: "currency_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "实收金额", field: "amt1", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "实收金额（RMB）", field: "send_amt_rmb", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "扣费", field: "amt_dist", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "银行利息", field: "lc_interest", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "客户付款金额", field: "send_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "预计发货日期", field: "pre_ship_date", editable: false, filter: 'set', width: 150,
            cellEditor: "年月日",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "合同号", field: "pi_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "合同对应金额", field: "temp_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "到款用途", field: "is_purpose", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "定金超出天数", field: "dates", editable: false, filter: 'set', width: 150,
            cellEditor: "整数框",
			
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
    .controller('fin_sap_list_search', fin_sap_list_search);
